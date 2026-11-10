// POST /api/request  { handle, type, text, link, website }  + header Authorization: Bearer <Firebase ID token>
// Sends a request from the app to the 18k request channel, with 3 pictures the bot finds on
// Pinterest from the request text. One request per account per week: the bot checks its own
// recent messages in the channel (each carries a short code of the account, not the account id).
const crypto = require("crypto");
const { REQUEST_CHANNEL, discord } = require("./_discord");
const { verifyUser } = require("./_auth");
const { pinterest, shuffle } = require("./_pinterest");
const { adminToken, alertIfMany, reportSystem } = require("./_admin");

// POST /api/request?sys=1 { kind, message, page, handle }: an error of the site seen in the dashboard
const SYS_KINDS = ["permessi", "pagina pubblica", "look salvati", "errore pagina"];
async function sysError(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  let b = {};
  try { b = await readBody(req); } catch (_) { b = {}; }
  const kind = SYS_KINDS.includes(b.kind) ? b.kind : "";
  const msg = String(b.message || "");
  // errors from browser extensions (crypto wallets etc.) or injected at line 1 of the page: not ours
  if (/ethereum|web3|solana|phantom|metamask|tronweb|__gCrWeb|extension:\/\/|webkit-masked-url|\.html:1$/i.test(msg)) return res.end('{"ok":true}');
  if (kind) await reportSystem(kind, String(b.message || "").slice(0, 400), { handle: String(b.handle || "").replace(/[^a-z0-9_]/g, "").slice(0, 20), page: String(b.page || "").slice(0, 60) });
  res.end('{"ok":true}');
}

// POST /api/request?bug=1  { text, page, device, handle }  -> saved for the staff + a Discord message to them
async function bugReport(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  let b;
  try { b = await readBody(req); } catch (e) { res.statusCode = 413; return res.end(JSON.stringify({ error: "Testo troppo lungo." })); }
  const text = String(b.text || "").trim().slice(0, 1000);
  if (text.length < 4) { res.statusCode = 400; return res.end(JSON.stringify({ error: "Scrivi cosa non va." })); }
  if (b.website) return res.end(JSON.stringify({ ok: true })); // bots fill the hidden field
  let uid = "";
  try { uid = await verifyUser(req); } catch (_) { uid = ""; }
  const handle = String(b.handle || "").toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20);
  const page = String(b.page || "").slice(0, 80), device = String(b.device || "").slice(0, 160);
  try {
    const token = await adminToken();
    const fields = { text: { stringValue: text }, page: { stringValue: page }, device: { stringValue: device }, handle: { stringValue: handle }, uid: { stringValue: uid }, createdAt: { timestampValue: new Date().toISOString() } };
    const r = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/bugs`, { method: "POST", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" }, body: JSON.stringify({ fields }) });
    if (!r.ok) throw new Error("save " + r.status);
  } catch (_) { res.statusCode = 502; return res.end(JSON.stringify({ error: "Non sono riuscito a mandarla, riprova tra poco." })); }
  await alertIfMany(); // the bot writes to the staff only when there are many reports together
  res.end(JSON.stringify({ ok: true }));
}

const TYPES = { set: "Set", pfp: "Pfp", edit: "Edit", altro: "Altro" };
const WEEK = 7 * 864e5;
const PROJECT = "kbio-c6126";

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = []; let size = 0;
  for await (const c of req) { size += c.length; if (size > 8000) throw Object.assign(new Error("Richiesta troppo lunga."), { status: 413 }); chunks.push(c); }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"); } catch (_) { return {}; }
}
const tag = uid => "u" + crypto.createHash("sha256").update("18k-req:" + uid).digest("hex").slice(0, 10);

// When this account sent its last request (from the bot's own messages), or 0
async function lastRequest(code) {
  const me = await discord("/users/@me");
  let before = "";
  for (let page = 0; page < 4; page++) {
    const batch = await discord(`/channels/${REQUEST_CHANNEL}/messages?limit=100${before ? "&before=" + before : ""}`);
    for (const m of batch) {
      const t = Date.parse(m.timestamp);
      if (Date.now() - t > WEEK) return 0;
      const f = m.author && m.author.id === me.id && m.embeds && m.embeds[0] && m.embeds[0].footer && m.embeds[0].footer.text;
      if (f && f.includes("#" + code)) return t;
    }
    if (batch.length < 100) return 0;
    before = batch[batch.length - 1].id;
  }
  return 0;
}

module.exports = async (req, res) => {
  if (/[?&]bug=1/.test(req.url || "")) return bugReport(req, res);
  if (/[?&]sys=1/.test(req.url || "")) return sysError(req, res);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.statusCode = 405; return res.end(JSON.stringify({ error: "Usa POST." })); }
  try {
    const uid = await verifyUser(req);
    const b = await readBody(req);
    if (b.website) return res.end(JSON.stringify({ ok: true })); // bots fill the hidden field
    const handle = String(b.handle || "").toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20);
    // The @ must belong to this account
    const u = handle && await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/usernames/${handle}`).then(r => r.ok ? r.json() : null).catch(() => null);
    if (!u || !u.fields || !u.fields.uid || u.fields.uid.stringValue !== uid) { res.statusCode = 403; return res.end(JSON.stringify({ error: "Questa @ non è del tuo account." })); }
    const type = TYPES[b.type] ? b.type : "altro";
    const text = String(b.text || "").replace(/\s+/g, " ").trim().slice(0, 800);
    let link = String(b.link || "").trim().slice(0, 300);
    if (link && !/^https:\/\/[^\s]+$/i.test(link)) link = "";
    if (text.length < 5) { res.statusCode = 400; return res.end(JSON.stringify({ error: "Scrivi cosa vuoi (almeno qualche parola)." })); }

    const code = tag(uid);
    const prev = await lastRequest(code);
    if (prev) {
      const next = prev + WEEK, days = Math.ceil((next - Date.now()) / 864e5);
      res.statusCode = 429;
      return res.end(JSON.stringify({ error: `Hai già fatto la richiesta di questa settimana. La prossima tra ${days} ${days === 1 ? "giorno" : "giorni"}.`, next }));
    }

    // 3 pictures from the request text (plus "pfp" when it is a pfp request)
    const q = (text.replace(/https?:\/\/\S+/g, "").slice(0, 80) + (type === "pfp" && !/pfp/i.test(text) ? " pfp" : "")).trim();
    let found = [];
    try { found = shuffle(await pinterest(q)).slice(0, 3); } catch (_) { found = []; }
    const search = "https://www.pinterest.com/search/pins/?q=" + encodeURIComponent(q);
    const embeds = [{
      title: `Nuova richiesta · ${TYPES[type]}`, url: search, description: text, color: 0xffffff,
      fields: [{ name: "Da", value: `[@${handle}](${process.env.SITE_URL || "https://18kbio.xyz"}/${handle})`, inline: true }, ...(link ? [{ name: "Riferimento", value: link, inline: true }] : [])],
      ...(found[0] ? { image: { url: found[0] } } : {}),
      footer: { text: `dall'app 18k.bio · ${found.length ? "3 foto trovate dal bot" : "nessuna foto trovata"} · #${code}` },
      timestamp: new Date().toISOString()
    }, ...found.slice(1).map(u => ({ url: search, image: { url: u } }))];
    await discord(`/channels/${REQUEST_CHANNEL}/messages`, { method: "POST", body: JSON.stringify({ allowed_mentions: { parse: [] }, embeds }) });
    res.end(JSON.stringify({ ok: true, found, next: Date.now() + WEEK }));
  } catch (err) {
    res.statusCode = err.status || 500;
    res.end(JSON.stringify({ error: err.status === 403 ? "Il bot non può scrivere nel canale delle richieste." : err.message }));
  }
};
