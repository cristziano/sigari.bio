// "Collega Spotify": the song you are listening to right now, on your profile.
//   POST ?spotify=start (Bearer Firebase token) -> { url } of Spotify's "allow" page; state = your account id, signed
//   GET  ?spotify=callback&code&state          -> Spotify comes back here; we keep your refresh token in /spotify/{uid}
//                                                (server only: the Firestore rules let nobody read it) and go back
//   GET  ?spotify=now&h=<handle>                -> { track } playing now (or the last one), cached 20 s
//   GET  ?spotify=ping                          -> { ready } are the keys on Vercel?
// Needs SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET on Vercel, and this Redirect URI in the Spotify app:
//   https://18kbio.vercel.app/api/music-search?spotify=callback
const crypto = require("crypto");
const { verifyUser } = require("./_auth");
const { adminToken, PROJECT } = require("./_admin");

const REDIRECT = "https://18kbio.vercel.app/api/music-search?spotify=callback";
const SITES = ["18kbio.xyz", "www.18kbio.xyz", "18kbio.vercel.app"];
const FS = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
const keys = () => ({ id: process.env.SPOTIFY_CLIENT_ID, secret: process.env.SPOTIFY_CLIENT_SECRET });
const sign = s => crypto.createHmac("sha256", keys().secret || "x").update(s).digest("base64url").slice(0, 32);
const json = (res, code, body, cache = "no-store") => { res.statusCode = code; res.setHeader("Content-Type", "application/json; charset=utf-8"); res.setHeader("Cache-Control", cache); res.end(JSON.stringify(body)); };

async function fsGet(path) {
  const r = await fetch(`${FS}/${path}`, { headers: { Authorization: "Bearer " + await adminToken() }, signal: AbortSignal.timeout(6000) });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error("firestore " + r.status);
  return (await r.json()).fields || {};
}
async function fsSet(path, fields) {
  const r = await fetch(`${FS}/${path}`, { method: "PATCH", headers: { Authorization: "Bearer " + await adminToken(), "Content-Type": "application/json" }, body: JSON.stringify({ fields }), signal: AbortSignal.timeout(6000) });
  if (!r.ok) throw new Error("firestore " + r.status);
}
async function tokenCall(body) {
  const { id, secret } = keys();
  const r = await fetch("https://accounts.spotify.com/api/token", { method: "POST", signal: AbortSignal.timeout(6000),
    headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Basic " + Buffer.from(id + ":" + secret).toString("base64") }, body: new URLSearchParams(body) });
  return r.json();
}

const access = new Map(); // uid -> { v, exp }
const nowCache = new Map(); // handle -> { at, body }

async function handle(req, res, url) {
  const mode = url.searchParams.get("spotify");
  const { id, secret } = keys();
  if (mode === "ping") return json(res, 200, { ready: !!(id && secret) });
  if (!id || !secret) return json(res, 503, { error: "Spotify non è ancora collegato al sito." });

  if (mode === "start") {
    let uid;
    try { uid = await verifyUser(req); } catch (_) { return json(res, 401, { error: "Accedi per collegare Spotify." }); }
    const host = String(req.headers["x-forwarded-host"] || req.headers.host || "");
    const site = SITES.includes(host) ? host : "18kbio.xyz";
    const payload = Buffer.from(JSON.stringify({ u: uid, s: site, t: Date.now() })).toString("base64url");
    const state = payload + "." + sign(payload);
    return json(res, 200, { url: "https://accounts.spotify.com/authorize?" + new URLSearchParams({ client_id: id, response_type: "code", redirect_uri: REDIRECT, scope: "user-read-currently-playing user-read-recently-played", state, show_dialog: "false" }) });
  }

  if (mode === "callback") {
    const [payload, sig] = String(url.searchParams.get("state") || "").split(".");
    let st = null;
    try { if (sig && sig === sign(payload)) st = JSON.parse(Buffer.from(payload, "base64url").toString()); } catch (_) { st = null; }
    const back = hash => { res.statusCode = 302; res.setHeader("Location", `https://${st && SITES.includes(st.s) ? st.s : "18kbio.xyz"}/dashboard.html#${hash}`); res.end(); };
    if (!st || Date.now() - st.t > 15 * 60e3) return back("spotify-error=" + encodeURIComponent("Collegamento scaduto, riprova."));
    if (url.searchParams.get("error")) return back("spotify-error=" + encodeURIComponent("Collegamento annullato."));
    try {
      const t = await tokenCall({ grant_type: "authorization_code", code: url.searchParams.get("code") || "", redirect_uri: REDIRECT });
      if (!t.refresh_token) throw new Error("no token");
      const me = await fetch("https://api.spotify.com/v1/me", { headers: { Authorization: "Bearer " + t.access_token } }).then(r => r.json()).catch(() => ({}));
      await fsSet(`spotify/${encodeURIComponent(st.u)}`, { refresh: { stringValue: t.refresh_token }, name: { stringValue: String(me.display_name || me.id || "") }, at: { timestampValue: new Date().toISOString() } });
      return back("spotify=" + encodeURIComponent(String(me.display_name || me.id || "Spotify").slice(0, 40)));
    } catch (_) { return back("spotify-error=" + encodeURIComponent("Spotify non ha confermato, riprova.")); }
  }

  if (mode === "now") {
    const h = String(url.searchParams.get("h") || "").toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20);
    if (!h) return json(res, 400, { error: "Manca il nome." });
    const c = nowCache.get(h);
    if (c && Date.now() - c.at < 20000) return json(res, 200, c.body, "public, s-maxage=20, max-age=10");
    try {
      const u = await fsGet(`usernames/${h}`);
      const uid = u && u.uid && u.uid.stringValue;
      if (!uid) return json(res, 404, { error: "Profilo sconosciuto." });
      let a = access.get(uid);
      if (!a || a.exp < Date.now()) {
        const doc = await fsGet(`spotify/${encodeURIComponent(uid)}`);
        if (!doc || !doc.refresh) return json(res, 404, { error: "Spotify non collegato." });
        const t = await tokenCall({ grant_type: "refresh_token", refresh_token: doc.refresh.stringValue });
        if (!t.access_token) return json(res, 410, { error: "Spotify va ricollegato." });
        a = { v: t.access_token, exp: Date.now() + (t.expires_in - 60) * 1000 }; access.set(uid, a);
      }
      const H = { Authorization: "Bearer " + a.v };
      let track = null, now = false;
      const r = await fetch("https://api.spotify.com/v1/me/player/currently-playing", { headers: H, signal: AbortSignal.timeout(5000) });
      if (r.status === 200) { const j = await r.json(); if (j.item) { track = j.item; now = !!j.is_playing; } }
      if (!track) { const j = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", { headers: H, signal: AbortSignal.timeout(5000) }).then(x => x.json()).catch(() => ({})); track = j.items && j.items[0] && j.items[0].track; }
      const body = { track: track ? { name: track.name, artist: (track.artists || []).map(x => x.name).join(", "), image: ((track.album && track.album.images) || []).slice(-2)[0]?.url || "", url: track.external_urls && track.external_urls.spotify || "", now } : null };
      nowCache.set(h, { at: Date.now(), body });
      return json(res, 200, body, "public, s-maxage=20, max-age=10");
    } catch (_) { return json(res, 502, { error: "Spotify non risponde." }); }
  }
  return json(res, 400, { error: "Richiesta sconosciuta." });
}

module.exports = { handle };
