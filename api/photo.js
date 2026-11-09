// /api/photo?album=sets&m=<message id>&i=<n>
// A link to one photo that never expires: asks Discord for a fresh link and redirects there.
// With &raw=1 it sends the file itself (used to turn a photo into a sticker, max 4 MB).
// POST /api/photo?upload=1&name=<file name>  (Authorization: Bearer <Firebase token>, body = the file)
// The dashboard's uploads: saved by the bot in the hidden "18k-file" channel. Answers { url } with a lasting link.
const { ALBUMS, SNOWFLAKE, discord, mediaOf, fileChannel } = require("./_discord");
const { verifyUser } = require("./_auth");

const MAX = 4.3 * 1024 * 1024; // Vercel takes at most 4.5 MB per request
const TYPES = /^(image\/(png|jpeg|webp|gif|apng)|audio\/(mpeg|mp3|ogg|wav|x-wav|mp4|aac|x-m4a)|video\/mp4|font\/(ttf|otf|woff2?)|application\/(font-woff|x-font-ttf|octet-stream))$/;
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
  try {
    const ch = await fileChannel();
    const fd = new FormData();
    fd.append("payload_json", JSON.stringify({ content: `uid:${uid}`, attachments: [{ id: 0, filename: name }], allowed_mentions: { parse: [] } }));
    fd.append("files[0]", new Blob([Buffer.concat(chunks)], { type }), name);
    const r = await fetch(`https://discord.com/api/v10/channels/${ch}/messages`, { method: "POST", headers: { Authorization: "Bot " + process.env.DISCORD_BOT_TOKEN }, body: fd, signal: AbortSignal.timeout(25000) });
    if (!r.ok) return fail(502, r.status === 403 ? "Il bot non può creare o usare il canale 18k-file: dagli il permesso Gestisci canali." : "Discord non ha preso il file, riprova.");
    const m = await r.json();
    const origin = "https://" + (req.headers["x-forwarded-host"] || req.headers.host);
    res.end(JSON.stringify({ url: `${origin}/api/photo?album=file&m=${m.id}&i=0` }));
  } catch (e) {
    fail(e.status === 403 ? 403 : 502, e.status === 403 ? "Il bot non può creare il canale 18k-file: dagli il permesso Gestisci canali, oppure crea tu un canale chiamato 18k-file dove solo il bot può scrivere." : "Caricamento non riuscito, riprova.");
  }
}

module.exports = async (req, res) => {
  const url = new URL(req.url, "https://18k.bio");
  if (req.method === "POST" && url.searchParams.get("upload") === "1") return upload(req, res, url);
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
      res.setHeader("Content-Type", r.headers.get("content-type") || "image/png");
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
