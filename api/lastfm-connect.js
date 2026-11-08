// GET /api/lastfm-connect: "Collega Last.fm".
// 1. Without a token: sends the person to Last.fm to say yes.
// 2. Last.fm sends them back here with ?token=…; we ask Last.fm whose account it is (auth.getSession, signed
//    with the shared secret that stays on Vercel) and return to the dashboard with that name.
// Needs LASTFM_API_KEY and LASTFM_SHARED_SECRET in Vercel.
const crypto = require("crypto");

module.exports = async (req, res) => {
  const url = new URL(req.url, "https://" + (req.headers.host || "18k.bio"));
  const origin = "https://" + (req.headers["x-forwarded-host"] || req.headers.host || "18k.bio");
  const key = process.env.LASTFM_API_KEY, secret = process.env.LASTFM_SHARED_SECRET;
  const back = (q) => { res.statusCode = 302; res.setHeader("Location", origin + "/dashboard.html#" + q); res.end(); };
  if (!key || !secret) return back("lastfm-error=" + encodeURIComponent("Last.fm non è ancora collegato al sito."));
  const token = url.searchParams.get("token");
  if (!token) {
    res.statusCode = 302;
    res.setHeader("Location", `https://www.last.fm/api/auth/?api_key=${key}&cb=${encodeURIComponent(origin + "/api/lastfm-connect")}`);
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
};
