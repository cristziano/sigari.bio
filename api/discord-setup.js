// GET /api/discord-setup: tells Discord which slash commands the 18k bot has.
// Safe to open more than once: it always writes the same fixed list.
const { discord } = require("./_discord");

const COMMANDS = [{
  name: "pfp", type: 1, description: "Mostra un profilo 18k.bio: pfp, banner, badge e link",
  options: [
    { type: 3, name: "nome", description: "Il nome su 18k.bio (18k.bio/nome)", required: false, max_length: 21 },
    { type: 6, name: "utente", description: "Una persona del server", required: false }
  ]
}];

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  try {
    const app = await discord("/applications/@me");
    const out = await discord(`/applications/${app.id}/commands`, { method: "PUT", body: JSON.stringify(COMMANDS) });
    res.end(JSON.stringify({ ok: true, commands: out.map(c => "/" + c.name), interactions_url: "https://" + req.headers.host + "/api/interactions" }));
  } catch (e) {
    res.statusCode = e.status || 500;
    res.end(JSON.stringify({ error: e.message }));
  }
};
