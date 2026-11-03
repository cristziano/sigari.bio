// /api/photo?album=sets&m=<message id>&i=<n>
// A link to one photo that never expires: asks Discord for a fresh link and redirects there.
// With &raw=1 it sends the file itself (used to turn a photo into a sticker, max 4 MB).
const { ALBUMS, SNOWFLAKE, discord, mediaOf } = require("./_discord");

module.exports = async (req, res) => {
  const url = new URL(req.url, "https://18k.bio");
  const album = ALBUMS[url.searchParams.get("album") || ""];
  const m = url.searchParams.get("m") || "", i = Math.max(0, Math.min(20, parseInt(url.searchParams.get("i") || "0", 10) || 0));
  if (!album || !SNOWFLAKE.test(m)) { res.statusCode = 400; return res.end("Foto sconosciuta."); }
  try {
    const msg = await discord(`/channels/${album.channel}/messages/${m}`);
    const md = mediaOf(msg)[i];
    if (!md) { res.statusCode = 404; return res.end("Foto non trovata: forse è stata cancellata da Discord."); }
    if (url.searchParams.get("raw") === "1") {
      if (md.size > 4 * 1024 * 1024) { res.statusCode = 413; return res.end("Foto troppo grande per diventare sticker."); }
      const r = await fetch(md.url);
      if (!r.ok) { res.statusCode = 502; return res.end("Discord non ha dato la foto."); }
      const buf = Buffer.from(await r.arrayBuffer());
      res.setHeader("Content-Type", r.headers.get("content-type") || "image/png");
      res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
      return res.end(buf);
    }
    // Discord links last about a day: one hour of cache is safe
    res.statusCode = 302;
    res.setHeader("Location", md.url);
    res.setHeader("Cache-Control", "public, max-age=1800, s-maxage=3600");
    res.end();
  } catch (err) {
    res.statusCode = err.status === 404 ? 404 : err.status || 500;
    res.setHeader("Cache-Control", "no-store");
    res.end(err.status === 404 ? "Foto non trovata: forse è stata cancellata da Discord." : err.message);
  }
};
