const { limited } = require("./_limit");
// /api/photo?album=sets&m=<message id>&i=<n>
// A link to one photo that never expires: asks Discord for a fresh link and redirects there.
// With &raw=1 it sends the file itself (used to turn a photo into a sticker, max 4 MB).
// POST /api/photo?upload=1&name=<file name>  (Authorization: Bearer <Firebase token>, body = the file)
// The dashboard's uploads: saved by the bot in the hidden "18k-file" channel. Answers { url } with a lasting link.
const { ALBUMS, SNOWFLAKE, discord, mediaOf, fileChannel } = require("./_discord");
const { verifyUser } = require("./_auth");
const { adminToken, reportSystem } = require("./_admin");

const MAX = 4.3 * 1024 * 1024; // Vercel takes at most 4.5 MB per request
// When the bot can't keep the file on Discord, it goes to Firestore in pieces (free): /files/{id} + /files/{id}/parts/{n}
const FS = "https://firestore.googleapis.com/v1/projects/kbio-c6126/databases/(default)/documents";
const PART = 900 * 1024;
async function saveToFirestore(buf, type, uid) {
  // written with the service account: works whatever the Firestore rules say
  const token = "Bearer " + await adminToken();
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const parts = Math.ceil(buf.length / PART);
  const post = (path, docId, fields) => fetch(`${FS}/${path}?documentId=${docId}`, { method: "POST", headers: { Authorization: token, "Content-Type": "application/json" }, body: JSON.stringify({ fields }), signal: AbortSignal.timeout(20000) });
  const r = await post("files", id, { uid: { stringValue: uid }, type: { stringValue: type }, parts: { integerValue: String(parts) }, size: { integerValue: String(buf.length) }, createdAt: { timestampValue: new Date().toISOString() } });
  if (!r.ok) throw Object.assign(new Error("firestore " + r.status + " " + (await r.text()).slice(0, 200)), { status: r.status });
  for (let n = 0; n < parts; n++) {
    const p = await post(`files/${id}/parts`, String(n), { d: { bytesValue: buf.subarray(n * PART, (n + 1) * PART).toString("base64") } });
    if (!p.ok) throw new Error("firestore parte " + n + ": " + p.status);
  }
  return id;
}
async function sendFromFirestore(res, id) {
  if (!/^[a-z0-9]{6,24}$/.test(id)) { res.statusCode = 400; return res.end("File sconosciuto."); }
  const auth = { Authorization: "Bearer " + await adminToken() };
  const get = path => fetch(`${FS}/${path}`, { headers: auth, signal: AbortSignal.timeout(10000) }).then(r => r.ok ? r.json() : null);
  const doc = await get(`files/${id}`);
  if (!doc) { res.statusCode = 404; return res.end("File non trovato."); }
  const n = Math.min(8, parseInt(doc.fields.parts.integerValue, 10) || 0);
  const parts = await Promise.all(Array.from({ length: n }, (_, k) => get(`files/${id}/parts/${k}`)));
  if (parts.some(p => !p)) { res.statusCode = 502; return res.end("File incompleto."); }
  const buf = Buffer.concat(parts.map(p => Buffer.from(p.fields.d.bytesValue, "base64")));
  // SAFETY: only pictures, audio, video and fonts are sent with their real type. Anything else
  // (e.g. a page with code inside) becomes a plain download and can never run on 18kbio.xyz.
  safeHeaders(res, doc.fields.type.stringValue);
  res.setHeader("Cache-Control", "public, max-age=31536000, s-maxage=31536000, immutable");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(buf);
}
function safeHeaders(res, type) {
  const t = String(type || "").split(";")[0].trim().toLowerCase();
  res.setHeader("Content-Type", TYPES.test(t) && t !== "application/octet-stream" ? t : "application/octet-stream");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Content-Security-Policy", "default-src 'none'; sandbox");
  if (!TYPES.test(t)) res.setHeader("Content-Disposition", "attachment");
}
const TYPES = /^(image\/(png|jpeg|webp|gif|apng)|audio\/(mpeg|mp3|ogg|wav|x-wav|mp4|aac|x-m4a)|video\/(mp4|webm)|font\/(ttf|otf|woff2?)|application\/(font-woff|x-font-ttf|octet-stream))$/;
async function upload(req, res, url) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  const fail = (code, error) => { res.statusCode = code; res.end(JSON.stringify({ error })); };
  let uid;
  try { uid = await verifyUser(req); } catch (e) { return fail(401, "Accedi per caricare file."); }
  const type = String(req.headers["content-type"] || "").split(";")[0].trim().toLowerCase();
  if (!TYPES.test(type)) return fail(415, "Tipo di file non supportato.");
  const chunks = []; let size = 0;
  for await (const c of req) { size += c.length; if (size > MAX) return fail(413, "Il file è troppo grande: massimo 4 MB."); chunks.push(c); }
  if (!size) return fail(400, "File vuoto.");
  const name = String(url.searchParams.get("name") || "file").replace(/[^a-z0-9._-]/gi, "").slice(-60) || "file";
  const origin = "https://" + (req.headers["x-forwarded-host"] || req.headers.host);
  let ch = "";
  try { ch = await fileChannel(); } catch (_) { ch = ""; }
  if (!ch) {
    try {
      const id = await saveToFirestore(Buffer.concat(chunks), type, uid);
      return res.end(JSON.stringify({ url: `${origin}/api/photo?file=${id}` }));
    } catch (e) {
      // the person gets a simple message; the real reason goes to the staff (segnalazioni di sistema)
      await reportSystem("caricamento", e.message, { uid, type });
      return fail(502, "Caricamento non riuscito, riprova tra poco.");
    }
  }
  try {
    const fd = new FormData();
    fd.append("payload_json", JSON.stringify({ content: `uid:${uid}`, attachments: [{ id: 0, filename: name }], allowed_mentions: { parse: [] } }));
    fd.append("files[0]", new Blob([Buffer.concat(chunks)], { type }), name);
    const r = await fetch(`https://discord.com/api/v10/channels/${ch}/messages`, { method: "POST", headers: { Authorization: "Bot " + process.env.DISCORD_BOT_TOKEN }, body: fd, signal: AbortSignal.timeout(25000) });
    if (!r.ok) { await reportSystem("caricamento", "Discord ha rifiutato il file: " + r.status, { uid, type }); return fail(502, "Caricamento non riuscito, riprova tra poco."); }
    const m = await r.json();
    res.end(JSON.stringify({ url: `${origin}/api/photo?album=file&m=${m.id}&i=0` }));
  } catch (e) {
    await reportSystem("caricamento", "Errore nel salvare su Discord: " + e.message, { uid, type });
    fail(502, "Caricamento non riuscito, riprova tra poco.");
  }
}

module.exports = async (req, res) => {
  if (limited(req, res, (req.method === "POST" ? "upload" : "photo"), req.method === "POST" ? 15 : 240, req.method === "POST" ? 600 : 60)) return; // traffic guard (see _limit.js)
  const url = new URL(req.url, "https://18k.bio");
  if (req.method === "POST" && url.searchParams.get("upload") === "1") return upload(req, res, url);
  if (url.searchParams.get("file")) { try { return await sendFromFirestore(res, url.searchParams.get("file")); } catch (_) { res.statusCode = 502; return res.end("File non raggiungibile."); } }
  const isFile = url.searchParams.get("album") === "file";
  const album = isFile ? { channel: await fileChannel().catch(() => "") } : ALBUMS[url.searchParams.get("album") || ""];
  const m = url.searchParams.get("m") || "", i = Math.max(0, Math.min(20, parseInt(url.searchParams.get("i") || "0", 10) || 0));
  if (!album || !album.channel || !SNOWFLAKE.test(m)) { res.statusCode = 400; return res.end("Foto sconosciuta."); }
  try {
    const msg = await discord(`/channels/${album.channel}/messages/${m}`);
    // uploads can be audio or fonts too: take the attachment itself
    const md = isFile ? (msg.attachments || []).map(a => ({ url: a.url, size: a.size || 0 }))[i] : mediaOf(msg)[i];
    if (!md) { res.statusCode = 404; return res.end("Foto non trovata: forse è stata cancellata da Discord."); }
    if (url.searchParams.get("raw") === "1") {
      if (md.size > 4 * 1024 * 1024) { res.statusCode = 413; return res.end("Foto troppo grande per diventare sticker."); }
      const r = await fetch(md.url);
      if (!r.ok) { res.statusCode = 502; return res.end("Discord non ha dato la foto."); }
      const buf = Buffer.from(await r.arrayBuffer());
      safeHeaders(res, r.headers.get("content-type") || "image/png");
      res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
      return res.end(buf);
    }
    // Discord links last about a day: one hour of cache is safe
    res.statusCode = 302;
    res.setHeader("Location", md.url);
    res.setHeader("Cache-Control", "public, max-age=1800, s-maxage=3600");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end();
  } catch (err) {
    res.statusCode = err.status === 404 ? 404 : err.status || 500;
    res.setHeader("Cache-Control", "no-store");
    res.end(err.status === 404 ? "Foto non trovata: forse è stata cancellata da Discord." : err.message);
  }
};
