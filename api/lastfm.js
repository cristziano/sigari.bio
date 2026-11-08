// GET /api/lastfm?user=<name>: the Last.fm profile (picture, plays) and the track playing now (or the last one).
// The read-only API key stays on Vercel (LASTFM_API_KEY), never in the page.
module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  const user = String(new URL(req.url, "https://x").searchParams.get("user") || "").replace(/[^a-z0-9_.-]/gi, "").slice(0, 30);
  if (!user) { res.statusCode = 400; return res.end(JSON.stringify({ error: "Manca il nome Last.fm." })); }
  const key = process.env.LASTFM_API_KEY;
  if (!key) { res.statusCode = 503; return res.end(JSON.stringify({ error: "Last.fm non è ancora collegato al sito." })); }
  try {
    const call = m => fetch(`https://ws.audioscrobbler.com/2.0/?method=${m}&user=${encodeURIComponent(user)}&api_key=${key}&format=json&limit=1`, { signal: AbortSignal.timeout(5000) }).then(r => r.json());
    const [j, info] = await Promise.all([call("user.getrecenttracks"), call("user.getinfo").catch(() => null)]);
    if (j.error) { res.statusCode = j.error === 6 ? 404 : 502; return res.end(JSON.stringify({ error: j.error === 6 ? "Utente Last.fm non trovato." : "Last.fm non risponde." })); }
    const u = info && info.user;
    const profile = u ? { name: u.realname || u.name, user: u.name, image: ((u.image || []).map(i => i["#text"]).filter(Boolean).pop()) || "", plays: +u.playcount || 0, url: u.url } : null;
    const t = j.recenttracks && j.recenttracks.track && j.recenttracks.track[0];
    res.setHeader("Cache-Control", "public, s-maxage=20, max-age=10");
    if (!t) return res.end(JSON.stringify({ user, profile, track: null }));
    const img = (t.image || []).map(i => i["#text"]).filter(Boolean).pop() || "";
    res.end(JSON.stringify({ user, profile, track: { name: t.name, artist: (t.artist && (t.artist["#text"] || t.artist.name)) || "", album: (t.album && t.album["#text"]) || "", image: img, url: t.url, now: !!(t["@attr"] && t["@attr"].nowplaying === "true") } }));
  } catch (_) {
    res.statusCode = 502; res.end(JSON.stringify({ error: "Last.fm non risponde." }));
  }
};
