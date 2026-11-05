// Pinterest search shared by the autopost and the requests. No login, no key:
// first the JSON the site itself uses, then the plain page. Pins that look cringe are skipped.
// Pins whose text says meme, quote, drawing, edit and similar are skipped ("niente roba cringe")
const CRINGE = /quote|meme|funny|lol\b|joke|humou?r|tiktok|edit\b|edits\b|fan ?art|drawing|sketch|cartoon|anime|manga|chibi|\bai\b|ai art|midjourney|lyrics|text|caption|couple|boyfriend|girlfriend|husband|tattoo|nails|wallpaper|lockscreen|template|sticker|emoji|outfit idea|cringe|cute/i;

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const big = u => u.replace(/\/(?:60x60|75x75_RS|170x|236x|474x|564x)\//, "/736x/");

// Pinterest search, first the JSON the site itself uses, then the plain page
// Matching pfps (one picture for each friend/partner) are allowed the words a normal search drops
const CRINGE_MATCHING = /quote|meme|funny|lol\b|joke|humou?r|tiktok|fan ?art|drawing|sketch|cartoon|\bai\b|ai art|midjourney|lyrics|caption|tattoo|nails|wallpaper|lockscreen|template|sticker|emoji|outfit idea|cringe/i;
const isMatching = q => /\bmatch(ing|es)?\b/i.test(q);
// "match dogs" -> "matching pfp dogs", the words people use on Pinterest
const queryOf = q => isMatching(q) ? ("matching pfp " + q.replace(/\bmatch(ing|es)?\b/ig, "").replace(/\bpfps?\b/ig, "")).replace(/\s+/g, " ").trim() : q;

// Pinterest search, first the JSON the site itself uses, then the plain page.
// Returns picture urls. For matching topics it also returns `pairs`: carousel pins with exactly
// 2 pictures, which is how matching pfps are posted (left one for you, right one for your friend).
async function pinterest(topic) {
  const q = queryOf(topic), matching = isMatching(topic), bad = matching ? CRINGE_MATCHING : CRINGE;
  const out = new Set(), pairs = [];
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
        if (!p) return;
        const words = [p.title, p.grid_title, p.description, p.auto_alt_text, p.rich_summary && p.rich_summary.display_name].filter(Boolean).join(" ");
        if (bad.test(words)) return;
        const slots = p.carousel_data && Array.isArray(p.carousel_data.carousel_slots) ? p.carousel_data.carousel_slots : [];
        if (matching && slots.length === 2) {
          const two = slots.map(s => s.images && (s.images["736x"] || s.images.orig || Object.values(s.images)[0])).map(im => im && im.url).filter(Boolean);
          if (two.length === 2 && !two.some(u => /\.gif$/i.test(u))) pairs.push(two);
        }
        const im = p.images && (p.images["736x"] || p.images.orig);
        // For matching, single pins count only when they say "matching" (often one picture with both)
        if (im && im.url && !/\.gif$/i.test(im.url) && (!matching || /match/i.test(words))) out.add(im.url);
      });
    }
  } catch (_) { /* try the page */ }
  if (out.size === 0 && !pairs.length) {
    try {
      const r = await fetch(`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(q)}`, { headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" }, signal: AbortSignal.timeout(6000) });
      const html = await r.text();
      (html.match(/https:\/\/i\.pinimg\.com\/(?:originals|736x|564x|474x|236x)\/[0-9a-f/]+\.(?:jpg|jpeg|png|webp)/gi) || []).forEach(u => out.add(big(u)));
    } catch (_) { /* nothing found */ }
  }
  const list = [...out];
  list.pairs = pairs;
  list.query = q;
  return list;
}

const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

module.exports = { pinterest, shuffle, isMatching };
