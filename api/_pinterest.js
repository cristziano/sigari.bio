// Pinterest search shared by the autopost and the requests. No login, no key:
// first the JSON the site itself uses, then the plain page. Pins that look cringe are skipped.
// Pins whose text says meme, quote, drawing, edit and similar are skipped ("niente roba cringe")
const CRINGE = /quote|meme|funny|lol\b|joke|humou?r|tiktok|edit\b|edits\b|fan ?art|drawing|sketch|cartoon|anime|manga|chibi|\bai\b|ai art|midjourney|lyrics|text|caption|couple|boyfriend|girlfriend|husband|tattoo|nails|wallpaper|lockscreen|template|sticker|emoji|outfit idea|cringe|cute/i;

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const big = u => u.replace(/\/(?:60x60|75x75_RS|170x|236x|474x|564x)\//, "/736x/");

// Pinterest search, first the JSON the site itself uses, then the plain page
async function pinterest(q) {
  const out = new Set();
  const data = encodeURIComponent(JSON.stringify({ options: { query: q, scope: "pins", page_size: 50 }, context: {} }));
  const src = encodeURIComponent(`/search/pins/?q=${encodeURIComponent(q)}`);
  try {
    const r = await fetch(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=${src}&data=${data}`, {
      headers: { "User-Agent": UA, Accept: "application/json, text/javascript, */*; q=0.01", "X-Requested-With": "XMLHttpRequest", "X-Pinterest-PWS-Handler": "www/search/[scope].js", Referer: "https://www.pinterest.com/" },
      signal: AbortSignal.timeout(6000)
    });
    if (r.ok) {
      const j = await r.json();
      const rows = (j.resource_response && j.resource_response.data && (j.resource_response.data.results || j.resource_response.data)) || [];
      (Array.isArray(rows) ? rows : []).forEach(p => {
        const im = p && p.images && (p.images["736x"] || p.images.orig);
        const words = [p && p.title, p && p.grid_title, p && p.description, p && p.auto_alt_text, p && p.rich_summary && p.rich_summary.display_name].filter(Boolean).join(" ");
        if (im && im.url && !CRINGE.test(words) && !/\.gif$/i.test(im.url)) out.add(im.url);
      });
    }
  } catch (_) { /* try the page */ }
  if (out.size === 0) {
    try {
      const r = await fetch(`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(q)}`, { headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" }, signal: AbortSignal.timeout(6000) });
      const html = await r.text();
      (html.match(/https:\/\/i\.pinimg\.com\/(?:originals|736x|564x|474x|236x)\/[0-9a-f/]+\.(?:jpg|jpeg|png|gif|webp)/gi) || []).forEach(u => out.add(big(u)));
    } catch (_) { /* nothing found */ }
  }
  return [...out];
}

const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

module.exports = { pinterest, shuffle };
