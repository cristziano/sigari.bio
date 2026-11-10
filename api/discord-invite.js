const { limited } = require("./_limit");
// GET /api/discord-invite?code=<invite>: name, icon and member counts of a Discord server, for the
// "server Discord" widget. Discord gives this for any public invite, without a key.
module.exports = async (req, res) => {
  if (limited(req, res, "invite", 20)) return; // traffic guard (see _limit.js)
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  const raw = String(new URL(req.url, "https://x").searchParams.get("code") || "");
  const code = raw.replace(/^(https?:\/\/)?(www\.)?(discord\.gg|discord\.com\/invite)\//i, "").replace(/[^a-z0-9-]/gi, "").slice(0, 40);
  if (!code) { res.statusCode = 400; return res.end(JSON.stringify({ error: "Manca l'invito." })); }
  try {
    const r = await fetch(`https://discord.com/api/v10/invites/${code}?with_counts=true`, { headers: { "User-Agent": "DiscordBot (https://18k.bio, 1.0)" }, signal: AbortSignal.timeout(5000) });
    if (!r.ok) { res.statusCode = 404; return res.end(JSON.stringify({ error: "Invito non valido o scaduto." })); }
    const j = await r.json(), g = j.guild || {};
    res.setHeader("Cache-Control", "public, s-maxage=300, max-age=60");
    res.end(JSON.stringify({
      code, name: g.name || "", online: j.approximate_presence_count || 0, members: j.approximate_member_count || 0,
      icon: g.icon ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.${g.icon.startsWith("a_") ? "gif" : "png"}?size=128` : "",
      banner: g.banner ? `https://cdn.discordapp.com/banners/${g.id}/${g.banner}.png?size=600` : ""
    }));
  } catch (_) { res.statusCode = 502; res.end(JSON.stringify({ error: "Discord non risponde." })); }
};
