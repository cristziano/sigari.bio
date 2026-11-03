// POST /api/request  { handle, type, text, link, website }
// Sends a request from the app to the 18k request channel. The bot writes it there,
// so no webhook address is ever visible in the browser. Mentions are switched off.
const { REQUEST_CHANNEL, discord } = require("./_discord");

const TYPES = { set: "Set", pfp: "Pfp", edit: "Edit", altro: "Altro" };
const recent = new Map(); // light flood guard per warm function: one request every 60 s per address

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = []; let size = 0;
  for await (const c of req) { size += c.length; if (size > 8000) throw Object.assign(new Error("Richiesta troppo lunga."), { status: 413 }); chunks.push(c); }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"); } catch (_) { return {}; }
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.statusCode = 405; return res.end(JSON.stringify({ error: "Usa POST." })); }
  try {
    const b = await readBody(req);
    if (b.website) { return res.end(JSON.stringify({ ok: true })); } // bots fill the hidden field
    const handle = String(b.handle || "").toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20);
    const type = TYPES[b.type] ? b.type : "altro";
    const text = String(b.text || "").replace(/\s+/g, " ").trim().slice(0, 800);
    let link = String(b.link || "").trim().slice(0, 300);
    if (link && !/^https:\/\/[^\s]+$/i.test(link)) link = "";
    if (text.length < 5) { res.statusCode = 400; return res.end(JSON.stringify({ error: "Scrivi cosa vuoi (almeno qualche parola)." })); }
    const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "?";
    const last = recent.get(ip) || 0;
    if (Date.now() - last < 60000) { res.statusCode = 429; return res.end(JSON.stringify({ error: "Hai appena mandato una richiesta: aspetta un minuto." })); }
    recent.set(ip, Date.now());
    if (recent.size > 5000) recent.clear();
    await discord(`/channels/${REQUEST_CHANNEL}/messages`, {
      method: "POST",
      body: JSON.stringify({
        allowed_mentions: { parse: [] },
        embeds: [{
          title: `Nuova richiesta · ${TYPES[type]}`,
          description: text,
          color: 0xffffff,
          fields: [
            { name: "Da", value: handle ? `[@${handle}](https://404.bio/${handle})` : "ospite", inline: true },
            ...(link ? [{ name: "Riferimento", value: link, inline: true }] : [])
          ],
          footer: { text: "dall'app 404.bio" },
          timestamp: new Date().toISOString()
        }]
      })
    });
    res.end(JSON.stringify({ ok: true }));
  } catch (err) {
    res.statusCode = err.status || 500;
    res.end(JSON.stringify({ error: err.status === 403 ? "Il bot non può scrivere nel canale delle richieste." : err.message }));
  }
};
