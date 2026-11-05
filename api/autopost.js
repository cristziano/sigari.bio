// GET /api/autopost: posts 2-3 random Pinterest pictures in the 18k auto channel,
// about every 3 hours. A scheduler (GitHub Actions, every hour) just opens this address:
// the function itself decides if it is time, so opening it more often cannot spam.
// The topic stays for 3 posts, then a new one is picked from TOPICS.
// State lives in the channel itself: the footer of the bot's last post ("topic: x · 2/3").
//   ?dry=1  -> only shows what it would post (nothing is sent)
//   ?test=1 -> posts now, without waiting 3 hours (never twice within 10 minutes)
const { discord } = require("./_discord");

const CHANNEL = "1441581025133199440"; // pfps (also feeds the Foto library of the site); empty = a channel with "pinterest" or "auto" in its name
const SETS = "1531029648593518866"; // any channel of the 18k server, to find the server
async function findChannel() {
  if (CHANNEL) return CHANNEL;
  const ch = await discord(`/channels/${SETS}`);
  const all = await discord(`/guilds/${ch.guild_id}/channels`);
  const c = all.find(x => x.type === 0 && /pinterest/i.test(x.name)) || all.find(x => x.type === 0 && /auto/i.test(x.name));
  return c ? c.id : "";
}
const EVERY = 2.75 * 3600e3; // the hourly scheduler + this gap = about every 3 hours

// Real artists of the 18k vibe and live photos: vague "aesthetic" searches bring memes and text, so none here
const TOPICS = [
  "nettspend", "osamason", "underground artist",
  "ken carson", "destroy lonely", "yeat", "2hollis", "lucki rapper", "che rapper", "xaviersobased", "fakemink",
  "jaydes rapper", "prettifun", "slayr rapper", "lazer dim 700", "1oneam", "summrs", "autumn! rapper", "bladee",
  "ecco2k", "yung lean", "surf gang", "bnyx", "rich amiri", "homixide gang", "nettspend live", "osamason live",
  "ken carson live", "destroy lonely live", "rage concert", "underground rap concert", "opium concert"
];
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

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  const dry = /[?&]dry=1/.test(req.url || ""), test = /[?&]test=1/.test(req.url || "");
  try {
    const CH = await findChannel();
    if (!CH && !dry) { res.statusCode = 503; return res.end(JSON.stringify({ error: "Non trovo il canale: crea un canale con \"pinterest\" o \"auto\" nel nome, o mandami il suo ID." })); }
    let topic = TOPICS[0], n = 1, last = 0;
    const seen = new Set(), recentTopics = [];
    if (CH) {
      const me = await discord("/users/@me");
      // People post here too: go back up to 500 messages to find the bot's last post
      let msgs = [], before = "";
      for (let page = 0; page < 5; page++) {
        const batch = await discord(`/channels/${CH}/messages?limit=100${before ? "&before=" + before : ""}`);
        msgs = msgs.concat(batch);
        if (batch.length < 100 || batch.some(m => m.author && m.author.id === me.id && m.embeds && m.embeds[0] && m.embeds[0].footer && /topic: /.test(m.embeds[0].footer.text))) break;
        before = batch[batch.length - 1].id;
      }
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
    if (test && last && Date.now() - last < 10 * 60e3) return res.end(JSON.stringify({ skipped: true, reason: "ultimo invio meno di 10 minuti fa" }));
    if (!dry && !test && last && Date.now() - last < EVERY) return res.end(JSON.stringify({ skipped: true, next_in_min: Math.round((EVERY - (Date.now() - last)) / 60000), topic, n }));

    const found = (await pinterest(topic)).filter(u => !seen.has(u.split("?")[0]));
    const pick = shuffle(found).slice(0, 2 + Math.floor(Math.random() * 2));
    if (!pick.length) { res.statusCode = 502; return res.end(JSON.stringify({ error: "Pinterest non ha dato foto per questo topic.", topic })); }
    // Embeds that share the same url show up as one gallery in Discord
    const link = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(topic)}`;
    const embeds = pick.map((u, i) => i === 0
      ? { url: link, title: topic, color: 0xffffff, image: { url: u }, footer: { text: `18k · topic: ${topic} · ${n}/3` } }
      : { url: link, image: { url: u } });
    if (dry) return res.end(JSON.stringify({ dry: true, channel: CH || null, topic, n, found: found.length, would_post: pick }));
    await discord(`/channels/${CH}/messages`, { method: "POST", body: JSON.stringify({ embeds, allowed_mentions: { parse: [] } }) });
    res.end(JSON.stringify({ ok: true, topic, n, posted: pick.length }));
  } catch (e) {
    res.statusCode = e.status || 500;
    res.end(JSON.stringify({ error: e.message }));
  }
};
