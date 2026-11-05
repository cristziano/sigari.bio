// GET /api/autopost: posts 4 random Pinterest pictures in the 18k pfps channel,
// about every 3 hours. A scheduler (GitHub Actions, every hour) just opens this address:
// the function itself decides if it is time, so opening it more often cannot spam.
// Every post: 4 pictures of one topic, only pictures. The next post uses another topic.
// State lives in the channel itself (the invisible link of the bot's pictures).
//   ?dry=1  -> only shows what it would post (nothing is sent)
//   ?test=1 -> posts now, without waiting 3 hours (never twice within 10 minutes); &topic=xyz chooses the topic
const { discord } = require("./_discord");
const { pinterest, shuffle } = require("./_pinterest");

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


module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  const dry = /[?&]dry=1/.test(req.url || ""), test = /[?&]test=1/.test(req.url || "");
  try {
    const CH = await findChannel();
    if (!CH && !dry) { res.statusCode = 503; return res.end(JSON.stringify({ error: "Non trovo il canale: crea un canale con \"pinterest\" o \"auto\" nel nome, o mandami il suo ID." })); }
    // Posts are only pictures. The topic is kept in the (invisible) link of the pictures,
    // so the bot knows what it already used without writing anything in the channel.
    const SEARCH = "https://www.pinterest.com/search/pins/?q=";
    const topicOf = m => { const e = (m.embeds || []).find(x => x.url && x.url.startsWith(SEARCH)); return e ? decodeURIComponent(e.url.slice(SEARCH.length)) : ""; };
    let last = 0;
    const seen = new Set(), recentTopics = [];
    if (CH) {
      const me = await discord("/users/@me");
      // People post here too: go back up to 500 messages to find the bot's last post
      let msgs = [], before = "";
      for (let page = 0; page < 5; page++) {
        const batch = await discord(`/channels/${CH}/messages?limit=100${before ? "&before=" + before : ""}`);
        msgs = msgs.concat(batch);
        if (batch.length < 100 || batch.some(m => m.author && m.author.id === me.id && topicOf(m))) break;
        before = batch[batch.length - 1].id;
      }
      const mine = msgs.filter(m => m.author && m.author.id === me.id && topicOf(m));
      // The first test had a title and a "topic 1/3" footer: remove posts in that old style
      if (!dry) for (const m of mine.filter(m => m.embeds.some(e => e.title || e.footer))) await discord(`/channels/${CH}/messages/${m.id}`, { method: "DELETE" }).catch(() => {});
      const kept = mine.filter(m => !m.embeds.some(e => e.title || e.footer));
      mine.forEach(m => m.embeds.forEach(e => e.image && e.image.url && seen.add(e.image.url.split("?")[0])));
      kept.forEach(m => { const tp = topicOf(m); if (!recentTopics.includes(tp)) recentTopics.push(tp); });
      if (kept[0]) last = Date.parse(kept[0].timestamp);
    }
    // A new topic every post, never one of the last 10
    const fresh = TOPICS.filter(x => !recentTopics.slice(0, 10).includes(x));
    // ?test=1&topic=xyz picks the topic of a test post by hand
    const forced = (test || dry) && /[?&]topic=([^&]+)/.exec(req.url || "");
    const topic = forced ? decodeURIComponent(forced[1].replace(/\+/g, " ")).replace(/[^\w !.'-]/g, "").trim().slice(0, 60)
      : recentTopics.length ? shuffle(fresh.length ? fresh : TOPICS.slice())[0] : TOPICS[0];
    if (test && last && Date.now() - last < 10 * 60e3) return res.end(JSON.stringify({ skipped: true, reason: "ultimo invio meno di 10 minuti fa" }));
    if (!dry && !test && last && Date.now() - last < EVERY) return res.end(JSON.stringify({ skipped: true, next_in_min: Math.round((EVERY - (Date.now() - last)) / 60000) }));

    const found = (await pinterest(topic)).filter(u => !seen.has(u.split("?")[0]));
    const pick = shuffle(found).slice(0, 4);
    if (pick.length < 2) { res.statusCode = 502; return res.end(JSON.stringify({ error: "Pinterest non ha dato abbastanza foto per questo topic.", topic })); }
    // Only pictures: no title, no text. Embeds that share the same url show up as one gallery.
    const link = SEARCH + encodeURIComponent(topic);
    const embeds = pick.map(u => ({ url: link, image: { url: u } }));
    if (dry) return res.end(JSON.stringify({ dry: true, channel: CH || null, topic, found: found.length, would_post: pick }));
    await discord(`/channels/${CH}/messages`, { method: "POST", body: JSON.stringify({ embeds, allowed_mentions: { parse: [] } }) });
    res.end(JSON.stringify({ ok: true, topic, posted: pick.length }));
  } catch (e) {
    res.statusCode = e.status || 500;
    res.end(JSON.stringify({ error: e.message }));
  }
};
