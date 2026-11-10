const { limited } = require("./_limit");
// GET /api/lastfm?user=<name>: the Last.fm profile (picture, plays) and the track playing now (or the last one).
// The read-only API key stays on Vercel (LASTFM_API_KEY), never in the page.
//
// GET /api/lastfm?connect=1: "Collega Last.fm".
// 1. Without a token: sends the person to Last.fm to say yes.
// 2. Last.fm sends them back here with &token=…; we ask Last.fm whose account it is (auth.getSession, signed
//    with LASTFM_SHARED_SECRET, which stays on Vercel) and return to the dashboard with that name.
// (One file for both, because the free Vercel plan allows 12 functions.)
const crypto = require("crypto");

async function connect(req, res) {
  const url = new URL(req.url, "https://" + (req.headers.host || "18kbio.xyz"));
  const origin = "https://" + (req.headers["x-forwarded-host"] || req.headers.host || "18kbio.xyz");
  const key = process.env.LASTFM_API_KEY, secret = process.env.LASTFM_SHARED_SECRET;
  const back = (q) => { res.statusCode = 302; res.setHeader("Location", origin + "/dashboard.html#" + q); res.end(); };
  if (!key || !secret) return back("lastfm-error=" + encodeURIComponent("Last.fm non è ancora collegato al sito."));
  const token = url.searchParams.get("token");
  if (!token) {
    res.statusCode = 302;
    res.setHeader("Location", `https://www.last.fm/api/auth/?api_key=${key}&cb=${encodeURIComponent(origin + "/api/lastfm?connect=1")}`);
    return res.end();
  }
  if (!/^[a-z0-9]{10,64}$/i.test(token)) return back("lastfm-error=" + encodeURIComponent("Collegamento non valido."));
  try {
    const sig = crypto.createHash("md5").update(`api_key${key}methodauth.getSessiontoken${token}${secret}`, "utf8").digest("hex");
    const r = await fetch(`https://ws.audioscrobbler.com/2.0/?method=auth.getSession&api_key=${key}&token=${token}&api_sig=${sig}&format=json`, { signal: AbortSignal.timeout(6000) });
    const j = await r.json();
    const name = j.session && j.session.name;
    if (!name) return back("lastfm-error=" + encodeURIComponent("Last.fm non ha confermato il collegamento."));
    back("lastfm=" + encodeURIComponent(name));
  } catch (_) {
    back("lastfm-error=" + encodeURIComponent("Last.fm non risponde, riprova."));
  }
}

module.exports = async (req, res) => {
  if (limited(req, res, "lastfm", 60)) return; // traffic guard (see _limit.js)
  if (new URL(req.url, "https://x").searchParams.has("connect")) return connect(req, res);
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
