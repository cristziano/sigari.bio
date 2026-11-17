// The "profili" channel of the 18k Discord server:
//   share(i)  -> /condividi: the bot posts your profile card there, then adds ✅ and ❌ for the votes
//   scan()    -> profile links posted by hand in the channel also get ✅ and ❌ (run every hour + after /condividi)
//   top()     -> the profile with the most votes (✅ minus ❌) of the last 7 days: "profilo della settimana"
// The channel is the first text channel with "profil" in its name (create it on Discord, no ID needed).
const { discord, guildOf, ALBUMS } = require("./_discord");

const YES = "✅", NO = "❌";
const LINK = /(?:18kbio\.xyz|18k\.bio|18kbio\.vercel\.app)\/@?([a-z0-9_]{1,20})(?![a-z0-9_])/i;
const NOT_HANDLES = ["api", "sigari-bio", "dashboard", "login", "explore", "esplora", "clan", "paste", "privacy", "termini", "index", "accedi"];

let chanP = null;
function profilesChannel() {
  if (chanP) return chanP;
  chanP = (async () => {
    const guild = await guildOf(ALBUMS.sets.channel);
    if (!guild) return "";
    const all = await discord(`/guilds/${guild}/channels`);
    const c = all.find(x => x.type === 0 && /profil/i.test(x.name));
    return c ? c.id : "";
  })().catch(e => { chanP = null; throw e; });
  return chanP;
}

// The handle a message is about: the card the bot posted (embed link) or a link typed by someone
function handleOf(m) {
  const texts = [m.content || "", ...(m.embeds || []).map(e => e.url || "")];
  for (const t of texts) { const x = LINK.exec(t); if (x && !NOT_HANDLES.includes(x[1].toLowerCase())) return x[1].toLowerCase(); }
  return "";
}
const wait = ms => new Promise(r => setTimeout(r, ms));
const react = (ch, id, emoji) => discord(`/channels/${ch}/messages/${id}/reactions/${encodeURIComponent(emoji)}/@me`, { method: "PUT" });
const hasMine = (m, emoji) => (m.reactions || []).some(r => r.me && r.emoji && r.emoji.name === emoji);

async function scan(limit = 50) {
  const ch = await profilesChannel();
  if (!ch) return { channel: false, reacted: 0 };
  const msgs = await discord(`/channels/${ch}/messages?limit=${Math.min(100, limit)}`);
  let n = 0;
  for (const m of msgs) {
    if (n >= 8) break; // a few per run: Discord limits how fast a bot can react
    if (!handleOf(m) || (hasMine(m, YES) && hasMine(m, NO))) continue;
    if (!hasMine(m, YES)) { await react(ch, m.id, YES).catch(() => {}); await wait(350); }
    if (!hasMine(m, NO)) { await react(ch, m.id, NO).catch(() => {}); await wait(350); }
    n++;
  }
  return { channel: true, reacted: n };
}

// votes of people (the bot's own reaction does not count)
const votes = (m, emoji) => { const r = (m.reactions || []).find(x => x.emoji && x.emoji.name === emoji); return r ? r.count - (r.me ? 1 : 0) : 0; };

async function top() {
  const ch = await profilesChannel();
  if (!ch) return null;
  const since = Date.now() - 7 * 864e5;
  let msgs = [], before = "";
  for (let page = 0; page < 3; page++) {
    const batch = await discord(`/channels/${ch}/messages?limit=100${before ? "&before=" + before : ""}`);
    msgs = msgs.concat(batch);
    if (batch.length < 100 || Date.parse(batch[batch.length - 1].timestamp) < since) break;
    before = batch[batch.length - 1].id;
  }
  const best = {};
  msgs.filter(m => Date.parse(m.timestamp) >= since).forEach(m => {
    const h = handleOf(m); if (!h) return;
    const yes = votes(m, YES), score = yes - votes(m, NO);
    if (yes > 0 && (!best[h] || score > best[h].score)) best[h] = { handle: h, score, yes };
  });
  return Object.values(best).sort((a, b) => b.score - a.score || b.yes - a.yes)[0] || null;
}

module.exports = { profilesChannel, scan, top, handleOf, YES, NO };
