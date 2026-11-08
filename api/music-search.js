// The song search in the dashboard (Musica).
//   GET /api/music-search?q=<text>       -> up to 12 songs { id, title, artist, cover, deezer, spotify? }
//   GET /api/music-search?resolve=<id>   -> { spotify } the same song on Spotify, when it exists
// With SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in Vercel it searches Spotify directly.
// Without them it searches Deezer (free, no key) and finds the Spotify link through song.link.
let spToken = null;
async function spotifyToken() {
  const id = process.env.SPOTIFY_CLIENT_ID, secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) return null;
  if (spToken && spToken.exp > Date.now()) return spToken.v;
  const r = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST", signal: AbortSignal.timeout(5000),
    headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Basic " + Buffer.from(id + ":" + secret).toString("base64") },
    body: "grant_type=client_credentials"
  });
  const j = await r.json();
  if (!j.access_token) return null;
  spToken = { v: j.access_token, exp: Date.now() + (j.expires_in - 60) * 1000 };
  return spToken.v;
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  const url = new URL(req.url, "https://x");
  const q = String(url.searchParams.get("q") || "").trim().slice(0, 80);
  const resolve = String(url.searchParams.get("resolve") || "");
  const fail = (code, msg) => { res.statusCode = code; res.setHeader("Cache-Control", "no-store"); res.end(JSON.stringify({ error: msg })); };
  try {
    if (resolve) {
      if (!/^\d{1,15}$/.test(resolve)) return fail(400, "Brano non valido.");
      const r = await fetch(`https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent("https://www.deezer.com/track/" + resolve)}&userCountry=IT`, { signal: AbortSignal.timeout(7000) });
      const j = await r.json().catch(() => ({}));
      const sp = j.linksByPlatform && j.linksByPlatform.spotify && j.linksByPlatform.spotify.url;
      res.setHeader("Cache-Control", "public, s-maxage=86400");
      return res.end(JSON.stringify({ spotify: sp && /^https:\/\/open\.spotify\.com\//.test(sp) ? sp : "" }));
    }
    if (q.length < 2) return fail(400, "Scrivi almeno 2 lettere.");
    const tok = await spotifyToken().catch(() => null);
    let items;
    if (tok) {
      const r = await fetch(`https://api.spotify.com/v1/search?type=track&limit=12&market=IT&q=${encodeURIComponent(q)}`, { headers: { Authorization: "Bearer " + tok }, signal: AbortSignal.timeout(6000) });
      const j = await r.json();
      items = ((j.tracks && j.tracks.items) || []).map(t => ({
        id: t.id, title: t.name, artist: (t.artists || []).map(a => a.name).join(", "),
        cover: ((t.album && t.album.images) || []).slice(-2)[0]?.url || "", spotify: t.external_urls && t.external_urls.spotify || "", deezer: ""
      }));
    } else {
      const r = await fetch(`https://api.deezer.com/search?limit=12&q=${encodeURIComponent(q)}`, { signal: AbortSignal.timeout(6000) });
      const j = await r.json();
      items = (j.data || []).filter(t => t.type === "track").map(t => ({
        id: String(t.id), title: t.title, artist: t.artist && t.artist.name || "",
        cover: t.album && t.album.cover_medium || "", deezer: t.link, spotify: ""
      }));
    }
    res.setHeader("Cache-Control", "public, s-maxage=3600, max-age=300");
    res.end(JSON.stringify({ source: tok ? "spotify" : "deezer", items }));
  } catch (_) {
    fail(502, "La ricerca non risponde adesso, riprova.");
  }
};
