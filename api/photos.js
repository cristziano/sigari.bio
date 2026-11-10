const { limited } = require("./_limit");
// /api/photos?album=sets&before=<message id>
// The photos posted in one of the 18k Discord channels, newest first, 50 messages per page.
// Links point to /api/photo, which never expires (Discord's own links last about a day).
const { ALBUMS, SNOWFLAKE, discord, guildOf, mediaOf, avatarOf, thumbUrl } = require("./_discord");

module.exports = async (req, res) => {
  if (limited(req, res, "photos", 120)) return; // traffic guard (see _limit.js)
  const url = new URL(req.url, "https://18k.bio");
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
        src: stable, thumb: md.kind === "video" ? md.thumb : thumbUrl(md.thumb, 480), full: md.url,
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
