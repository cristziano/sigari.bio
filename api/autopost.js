// GET /api/autopost: posts 2-3 random Pinterest pictures in the 18k auto channel,
// about every 3 hours. A scheduler (GitHub Actions, every hour) just opens this address:
// the function itself decides if it is time, so opening it more often cannot spam.
// The topic stays for 3 posts, then a new one is picked from TOPICS.
// State lives in the channel itself: the footer of the bot's last post ("topic: x · 2/3").
//   ?dry=1  -> only shows what it would post (nothing is sent)
const { discord } = require("./_discord");

const CHANNEL = ""; // the new channel id (to fill in)
const EVERY = 2.75 * 3600e3; // the hourly scheduler + this gap = about every 3 hours

// Aesthetics close to the 18k vibe: underground rap, rage, opium, plugg, y2k, dark
const TOPICS = [
  "nettspend", "osamason", "underground artist",
  "ken carson aesthetic", "destroy lonely aesthetic", "opium aesthetic", "rage rap aesthetic", "yeat aesthetic",
  "2hollis aesthetic", "che rapper aesthetic", "lucki aesthetic", "jerk aesthetic", "dark plugg aesthetic",
  "underground rap pfp", "glitchcore aesthetic", "y2k grunge aesthetic", "emo rap aesthetic", "drain gang aesthetic",
  "ecco2k aesthetic", "surf gang aesthetic", "summrs aesthetic", "autumn! rapper", "fakemink", "xaviersobased",
  "rage concert", "mosh pit flash photo", "blurry flash photography aesthetic", "chrome hearts aesthetic",
  "vamp aesthetic", "goth rap aesthetic", "baggy streetwear aesthetic", "underground rap concert photo",
  "hyperpop aesthetic", "1oneam aesthetic", "slayr rapper", "nettspend pfp", "osamason pfp"
];

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
      (Array.isArray(rows) ? rows : []).forEach(p => { const im = p && p.images && (p.images["736x"] || p.images.orig); if (im && im.url) out.add(im.url); });
    }
  } catch (_) { /* try the page */ }
  if (out.size < 6) {
    try {
      const r = await fetch(`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(q)}`, { headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" }, signal: AbortSignal.timeout(6000) });
      const html = await r.text();
      (html.match(/https:\/\/i\.pinimg\.com\/(?:originals|736x|564x|474x|236x)\/[0-9a-f/]+\.(?:jpg|jpeg|png|gif|webp)/gi) || []).forEach(u => out.add(big(u)));
    } catch (_) { /* nothing found */ }
  }
  return [...out];
}

const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  const dry = /[?&]dry=1/.test(req.url || "");
  try {
    if (!CHANNEL && !dry) { res.statusCode = 503; return res.end(JSON.stringify({ error: "Manca l'ID del canale per le foto automatiche." })); }
    let topic = TOPICS[0], n = 1, last = 0;
    const seen = new Set(), recentTopics = [];
    if (CHANNEL) {
      const me = await discord("/users/@me");
      const msgs = await discord(`/channels/${CHANNEL}/messages?limit=100`);
      const mine = msgs.filter(m => m.author && m.author.id === me.id);
      mine.forEach(m => (m.embeds || []).forEach(e => e.image && e.image.url && seen.add(e.image.url.split("?")[0])));
      mine.forEach(m => { const f = m.embeds && m.embeds[0] && m.embeds[0].footer && m.embeds[0].footer.text; const t = f && /topic: (.+) · (\d)\/3/.exec(f); if (t && !recentTopics.includes(t[1])) recentTopics.push(t[1]); });
      const prev = mine.find(m => m.embeds && m.embeds[0] && m.embeds[0].footer && /topic: .+ · \d\/3/.test(m.embeds[0].footer.text));
      if (prev) {
        last = Date.parse(prev.timestamp);
        const [, t, k] = /topic: (.+) · (\d)\/3/.exec(prev.embeds[0].footer.text);
        if (+k < 3) { topic = t; n = +k + 1; }
        else { const fresh = TOPICS.filter(x => !recentTopics.slice(0, 8).includes(x)); topic = shuffle(fresh.length ? fresh : TOPICS.slice())[0]; n = 1; }
      }
    }
    if (!dry && last && Date.now() - last < EVERY) return res.end(JSON.stringify({ skipped: true, next_in_min: Math.round((EVERY - (Date.now() - last)) / 60000), topic, n }));

    const found = (await pinterest(topic)).filter(u => !seen.has(u.split("?")[0]));
    const pick = shuffle(found).slice(0, 2 + Math.floor(Math.random() * 2));
    if (!pick.length) { res.statusCode = 502; return res.end(JSON.stringify({ error: "Pinterest non ha dato foto per questo topic.", topic })); }
    // Embeds that share the same url show up as one gallery in Discord
    const link = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(topic)}`;
    const embeds = pick.map((u, i) => i === 0
      ? { url: link, title: topic, color: 0xffffff, image: { url: u }, footer: { text: `18k · topic: ${topic} · ${n}/3` } }
      : { url: link, image: { url: u } });
    if (dry) return res.end(JSON.stringify({ dry: true, topic, n, found: found.length, would_post: pick }));
    await discord(`/channels/${CHANNEL}/messages`, { method: "POST", body: JSON.stringify({ embeds, allowed_mentions: { parse: [] } }) });
    res.end(JSON.stringify({ ok: true, topic, n, posted: pick.length }));
  } catch (e) {
    res.statusCode = e.status || 500;
    res.end(JSON.stringify({ error: e.message }));
  }
};
