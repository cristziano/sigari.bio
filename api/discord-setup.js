// GET /api/discord-setup: tells Discord which slash commands the 18k bot has.
// Safe to open more than once: it always writes the same fixed list.
const { discord, fileChannel } = require("./_discord");

const COMMANDS = [{
  name: "pfp", type: 1, description: "Mostra un profilo 18k.bio: pfp, banner, badge e link",
  options: [
    { type: 3, name: "nome", description: "Il nome su 18k.bio (18k.bio/nome)", required: false, max_length: 21 },
    { type: 6, name: "utente", description: "Una persona del server", required: false }
  ]
}, {
  name: "posta", type: 1, description: "Posta pfp e banner nel canale, con anteprima e bottone per scaricarli (admin e ruolo pfps)",
  dm_permission: false,
  options: [
    { type: 11, name: "pfp", description: "La foto profilo", required: true },
    { type: 11, name: "pfp2", description: "Un'altra pfp (facoltativa)", required: false },
    { type: 11, name: "pfp3", description: "Un'altra pfp (facoltativa)", required: false },
    { type: 11, name: "pfp4", description: "Un'altra pfp (facoltativa)", required: false },
    { type: 11, name: "banner", description: "Il banner (facoltativo)", required: false },
    { type: 3, name: "canale", description: "Dove postarla (di base #pfps)", required: false, choices: [{ name: "pfps", value: "pfps" }, { name: "sets", value: "sets" }, { name: "replies", value: "replies" }] },
    { type: 3, name: "crediti", description: "Scritta sotto, es. by dede", required: false, max_length: 60 }
  ]
}];

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  try {
    const app = await discord("/applications/@me");
    const out = await discord(`/applications/${app.id}/commands`, { method: "PUT", body: JSON.stringify(COMMANDS) });
    const want = "https://" + req.headers.host + "/api/interactions";
    // the hidden channel for the dashboard uploads: created here if the bot can
    let files = "";
    try { files = "ok " + await fileChannel(); } catch (e) { files = "errore: " + e.message; }
    res.end(JSON.stringify({ ok: true, commands: out.map(c => "/" + c.name), interactions_url: want, portal_url: app.interactions_endpoint_url || "", connected: app.interactions_endpoint_url === want, file_channel: files }));
  } catch (e) {
    res.statusCode = e.status || 500;
    res.end(JSON.stringify({ error: e.message }));
  }
};
