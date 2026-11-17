const { limited } = require("./_limit");
// /api/photos?album=sets&before=<message id>
// The photos posted in one of the 18k Discord channels, newest first, 50 messages per page.
// Links point to /api/photo, which never expires (Discord's own links last about a day).
const { ALBUMS, SNOWFLAKE, discord, guildOf, mediaOf, avatarOf, thumbUrl } = require("./_discord");
const { verifyUser } = require("./_auth");
const { isStaffUid } = require("./_admin");

// DELETE /api/photos?album=pfps&m=<message id>  (Authorization: Bearer <Firebase token>)
// Staff only: deletes that Discord message, so its photos leave the channel and the app's Foto section.
async function remove(req, res, url) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  const fail = (code, error) => { res.statusCode = code; res.end(JSON.stringify({ error })); };
  let uid;
  try { uid = await verifyUser(req); } catch (_) { return fail(401, "Accedi per farlo."); }
  if (!(await isStaffUid(uid).catch(() => false))) return fail(403, "Solo lo staff può eliminare le foto.");
  const album = ALBUMS[url.searchParams.get("album") || ""], m = url.searchParams.get("m") || "";
  if (!album || !SNOWFLAKE.test(m)) return fail(400, "Foto sconosciuta.");
  try {
    await discord(`/channels/${album.channel}/messages/${m}`, { method: "DELETE" });
    res.end(JSON.stringify({ ok: true }));
  } catch (e) {
    fail(e.status === 403 ? 403 : e.status === 404 ? 404 : 502, e.status === 403 ? "Il bot non ha il permesso \"Gestisci messaggi\" in quel canale." : e.status === 404 ? "Questa foto è già stata eliminata." : "Discord non risponde, riprova.");
  }
}

module.exports = async (req, res) => {
  if (limited(req, res, "photos", 120)) return; // traffic guard (see _limit.js)
  const url = new URL(req.url, "https://18kbio.xyz");
  if (req.method === "DELETE") return remove(req, res, url);
  // ?profili=top  -> the most voted profile of the week in the Discord "profili" channel (for the home page)
  // ?profili=scan -> adds ✅ ❌ to profile links posted by hand there (opened every hour by GitHub Actions)
  const pr = url.searchParams.get("profili");
  if (pr) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    const P = require("./_profili");
    try {
      if (pr === "scan") { res.setHeader("Cache-Control", "no-store"); return res.end(JSON.stringify(await P.scan())); }
      const t = await P.top();
      let out = null;
      if (t) {
        const p = await require("./_firestore").profileByName(t.handle).catch(() => null);
        if (p && !p.private) {
          const bio = String(p.bio || "").replace(/\[(?:glow|rainbow|\/glow|\/rainbow|#[0-9a-f]{6}|\/)\]/gi, "").replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, "$1").replace(/\*\*|__|~~|\|\||`|\*/g, "").replace(/\s+/g, " ").trim().slice(0, 160);
          const ap = p.appearance || {};
          out = { handle: p.handle, name: p.displayName || p.handle, bio, avatar: /^https:\/\//.test(p.avatarUrl || "") ? p.avatarUrl : "",
            banner: ap.banner && ap.banner.type === "image" && /^https:\/\//.test(ap.banner.url || "") ? ap.banner.url : (ap.bg && ap.bg.type === "image" && /^https:\/\//.test(ap.bg.image || "") ? ap.bg.image : ""),
            accent: /^#[0-9a-f]{6}$/i.test((ap.colors && ap.colors.accent) || "") ? ap.colors.accent : "#ffffff", yes: t.yes, score: t.score };
        }
      }
      res.setHeader("Cache-Control", "public, max-age=300, s-maxage=1800, stale-while-revalidate=3600");
      return res.end(JSON.stringify({ top: out }));
    } catch (e) { res.statusCode = 502; res.setHeader("Cache-Control", "no-store"); return res.end(JSON.stringify({ error: "Discord non risponde." })); }
  }
  const key = url.searchParams.get("album") || "";
  const before = url.searchParams.get("before") || "";
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (!key) {
    res.setHeader("Cache-Control", "public, max-age=300");
    return res.end(JSON.stringify({ albums: Object.entries(ALBUMS).map(([id, a]) => ({ id, name: a.name })) }));
  }
  const album = ALBUMS[key];
  if (!album || (before && !SNOWFLAKE.test(before))) { res.statusCode = 400; return res.end(JSON.stringify({ error: "Album sconosciuto." })); }
  try {
    const [msgs, guild] = await Promise.all([
      discord(`/channels/${album.channel}/messages?limit=50${before ? "&before=" + before : ""}`),
      guildOf(album.channel)
    ]);
    const items = [];
    msgs.forEach(m => mediaOf(m).forEach((md, i) => {
      const stable = `/api/photo?album=${key}&m=${m.id}&i=${i}`;
      items.push({
        id: `${m.id}-${i}`, kind: md.kind, video: !!md.video, w: md.w, h: md.h,
        // grid pictures: 360px WebP (a video gets a still frame from Discord's media proxy, not the whole file)
        src: stable, thumb: thumbUrl(md.thumb, 360), full: md.url,
        author: { name: (m.author && (m.author.global_name || m.author.username)) || "", avatar: avatarOf(m.author) },
        text: String(m.content || "").slice(0, 280),
        at: m.timestamp,
        discord: guild ? `https://discord.com/channels/${guild}/${album.channel}/${m.id}` : ""
      });
    }));
    // full links expire, the stable ones don't: browsers and the CDN may keep this list a few minutes
    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=180, stale-while-revalidate=900");
    res.end(JSON.stringify({ album: key, name: album.name, items, next: msgs.length === 50 ? msgs[msgs.length - 1].id : null }));
  } catch (err) {
    res.statusCode = err.status || 500;
    res.setHeader("Cache-Control", "no-store");
    res.end(JSON.stringify({ error: err.message }));
  }
};
