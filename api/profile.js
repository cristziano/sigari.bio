// 404.bio/handle (and the old /@handle): serves profile.html with the link preview filled in
// (title, description, picture, accent colour), so Discord, WhatsApp and
// Telegram show the profile instead of a generic card. Everything else still
// happens in the browser; if anything here fails, the plain page is served.
const fs = require("fs");
const path = require("path");

const PROJECT = "sigari-bio-52324";
const PAGE = path.join(process.cwd(), "sigari-bio", "profile.html");

const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const str = f => (f && typeof f.stringValue === "string" ? f.stringValue : "");
const fields = f => (f && f.mapValue && f.mapValue.fields) || {};
// Removes the bio formatting marks (**bold**, [glow]…[/glow], [#ff00aa]…[/] and so on)
const plain = s => s.replace(/\[(?:glow|rainbow|\/glow|\/rainbow|#[0-9a-f]{6}|\/)\]/gi, "").replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, "$1").replace(/\*\*|__|~~|\|\||`|\*/g, "").replace(/\s+/g, " ").trim();
const httpsUrl = s => (/^https:\/\/[^\s"'<>]+$/.test(s) ? s : "");

async function getDoc(docPath) {
  const r = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/${docPath}`);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error("firestore " + r.status);
  return (await r.json()).fields || {};
}

async function readPage(origin) {
  try { return fs.readFileSync(PAGE, "utf8"); } catch (_) { /* not bundled: fetch the static file */ }
  const r = await fetch(origin + "/sigari-bio/profile.html");
  if (!r.ok) throw new Error("page " + r.status);
  return r.text();
}

module.exports = async (req, res) => {
  const url = new URL(req.url, "https://404.bio");
  const handle = String(url.searchParams.get("h") || "").replace(/^@/, "").toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20);
  const origin = "https://" + (req.headers["x-forwarded-host"] || req.headers.host || "404.bio");
  let html;
  try { html = await readPage(origin); }
  catch (_) {
    res.statusCode = 302;
    res.setHeader("Location", "/sigari-bio/profile.html?u=" + handle);
    return res.end();
  }
  try {
    if (handle.length >= 3) {
      const f = await getDoc("profiles/" + handle);
      if (!f) {
        // An extra name sends people to the main profile
        const u = await getDoc("usernames/" + handle);
        const main = u && str(u.aliasOf);
        if (main && /^[a-z0-9_]{3,20}$/.test(main)) {
          res.statusCode = 302;
          res.setHeader("Location", "/" + main + (url.searchParams.get("utm_source") ? "?utm_source=" + encodeURIComponent(url.searchParams.get("utm_source")) : ""));
          return res.end();
        }
      } else if (!(f.private && f.private.booleanValue)) {
        const a = fields(f.appearance), seo = fields(a.seo), colors = fields(a.colors), title = fields(a.title);
        const name = str(f.displayName) || handle;
        const t = str(title.text) || `${name} · 404.bio`;
        const d = str(seo.description) || plain(str(f.bio)) || `@${handle} su 404.bio`;
        const img = httpsUrl(str(seo.image)) || httpsUrl(str(f.avatarUrl));
        const color = /^#[0-9a-f]{6}$/i.test(str(colors.accent)) ? str(colors.accent) : "#ffffff";
        const tags = [
          `<title>${esc(t)}</title>`,
          `<meta name="description" content="${esc(d)}">`,
          `<meta name="theme-color" content="${color}">`,
          `<meta property="og:type" content="profile">`,
          `<meta property="og:site_name" content="404.bio">`,
          `<meta property="og:title" content="${esc(t)}">`,
          `<meta property="og:description" content="${esc(d)}">`,
          `<meta property="og:url" content="${esc(origin + "/" + handle)}">`,
          img ? `<meta property="og:image" content="${esc(img)}">` : "",
          `<meta name="twitter:card" content="${img ? "summary_large_image" : "summary"}">`,
          `<meta name="twitter:title" content="${esc(t)}">`,
          `<meta name="twitter:description" content="${esc(d)}">`,
          img ? `<meta name="twitter:image" content="${esc(img)}">` : ""
        ].filter(Boolean).join("\n");
        html = html
          .replace(/<title>[^<]*<\/title>/, "")
          .replace(/<meta name="description"[^>]*>/, "")
          .replace(/<meta name="theme-color"[^>]*>/, "")
          .replace("<head>", "<head>\n" + tags);
      }
    }
  } catch (_) { /* Firestore not reachable or rules not published: plain page */ }
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=600");
  res.end(html);
};
