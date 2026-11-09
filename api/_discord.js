// Shared helpers for the 18k Discord channels that feed the Foto section.
// The bot token lives only in the Vercel environment (DISCORD_BOT_TOKEN), never in the code.
// Only the channels listed here can be read: the token can't be used to read anything else.

const ALBUMS = {
  sets: { channel: "1531029648593518866", name: "Sets" },
  replies: { channel: "1546667763605569566", name: "Replies" },
  pfps: { channel: "1441581025133199440", name: "Pfps" }
};
const REQUEST_CHANNEL = "1544837625213489253";
const API = "https://discord.com/api/v10";
const SNOWFLAKE = /^\d{15,22}$/;

function token() {
  const t = process.env.DISCORD_BOT_TOKEN;
  if (!t) { const e = new Error("Il bot Discord non è ancora collegato (manca DISCORD_BOT_TOKEN su Vercel)."); e.status = 503; throw e; }
  return t;
}

async function discord(path, init = {}) {
  const r = await fetch(API + path, {
    ...init,
    headers: { Authorization: "Bot " + token(), "User-Agent": "DiscordBot (https://18k.bio, 1.0)", ...(init.body ? { "Content-Type": "application/json" } : {}), ...(init.headers || {}) }
  });
  if (r.status === 429) { const e = new Error("Discord ci chiede di rallentare, riprova tra poco."); e.status = 429; throw e; }
  if (!r.ok) { const e = new Error("Discord ha risposto " + r.status); e.status = r.status === 403 || r.status === 404 ? r.status : 502; throw e; }
  return r.status === 204 ? null : r.json();
}

// Guild id for "open on Discord" links, fetched once per warm function
const guildCache = {};
async function guildOf(channel) {
  if (!guildCache[channel]) guildCache[channel] = discord(`/channels/${channel}`).then(c => c.guild_id || "").catch(() => "");
  return guildCache[channel];
}

const isMedia = ct => /^(image|video)\//.test(ct || "");
const kindOf = (ct, url) => /^video\//.test(ct || "") || /\.(mp4|webm|mov)(\?|$)/i.test(url || "") ? "video" : /gif/.test(ct || "") || /\.gif(\?|$)/i.test(url || "") ? "gif" : "image";

// Every photo, GIF or video in a message: uploads first, then link embeds (Tenor, GIPHY, image links)
function mediaOf(m) {
  const out = [];
  (m.attachments || []).forEach(a => {
    if (!isMedia(a.content_type) && !/\.(png|jpe?g|gif|webp|mp4|webm|mov)(\?|$)/i.test(a.filename || "")) return;
    if (/^18k-preview\./.test(a.filename || "")) return; // the /posta preview: the site shows the real pfp and banner
    out.push({ kind: kindOf(a.content_type, a.filename), video: kindOf(a.content_type, a.filename) === "video", url: a.url, thumb: a.proxy_url || a.url, w: a.width || 0, h: a.height || 0, size: a.size || 0, name: a.filename || "" });
  });
  (m.embeds || []).forEach(e => {
    const v = e.video && (e.type === "gifv" || e.type === "video") ? e.video : null;
    const img = e.image || (e.type === "image" || e.type === "gifv" ? e.thumbnail : null);
    if (v && v.url) out.push({ kind: e.type === "gifv" ? "gif" : "video", video: true, url: v.proxy_url || v.url, thumb: (e.thumbnail && (e.thumbnail.proxy_url || e.thumbnail.url)) || v.proxy_url || v.url, w: v.width || 0, h: v.height || 0, size: 0, name: "" });
    else if (img && img.url && /\/18k-preview\.png/i.test(img.url)) return; // the /posta preview
    else if (img && img.url) out.push({ kind: kindOf("", img.url), url: img.proxy_url || img.url, thumb: img.proxy_url || img.url, w: img.width || 0, h: img.height || 0, size: 0, name: "" });
  });
  return out;
}

const avatarOf = a => a && a.avatar ? `https://cdn.discordapp.com/avatars/${a.id}/${a.avatar}.${a.avatar.startsWith("a_") ? "gif" : "png"}?size=64` : "";
const thumbUrl = (u, w) => { try { const x = new URL(u); if (/discordapp\.(net|com)$/.test(x.hostname)) { x.searchParams.set("width", String(w)); if (!x.searchParams.has("format")) x.searchParams.set("format", "webp"); } return x.href; } catch (_) { return u; } };

// Where the dashboard uploads go (photos, audio, fonts): a hidden channel "18k-file" that only the bot sees.
// Firebase Storage needs a paid plan; Discord keeps the files for free and /api/photo gives links that don't expire.
let fileCh = null;
async function fileChannel() {
  if (process.env.FILE_CHANNEL && SNOWFLAKE.test(process.env.FILE_CHANNEL)) return process.env.FILE_CHANNEL;
  if (fileCh) return fileCh;
  fileCh = (async () => {
    const guild = await guildOf(ALBUMS.sets.channel);
    const all = await discord(`/guilds/${guild}/channels`).catch(() => []);
    const hit = all.find(c => c.type === 0 && c.name === "18k-file");
    if (hit) return hit.id;
    // No channel: a private thread "18k-file" in the requests channel (needs no special permission)
    const isOurs = th => th && th.name === "18k-file" && th.parent_id === REQUEST_CHANNEL;
    const active = await discord(`/guilds/${guild}/threads/active`).catch(() => ({ threads: [] }));
    const a = (active.threads || []).find(isOurs);
    if (a) return a.id;
    const arch = await discord(`/channels/${REQUEST_CHANNEL}/users/@me/threads/archived/private?limit=50`).catch(() => ({ threads: [] }));
    const b = (arch.threads || []).find(isOurs);
    if (b) return b.id;
    try {
      const th = await discord(`/channels/${REQUEST_CHANNEL}/threads`, { method: "POST", body: JSON.stringify({ name: "18k-file", type: 12, invitable: false, auto_archive_duration: 10080 }) });
      return th.id;
    } catch (_) { /* no private threads: a public one (archived, it stays out of the way) */ }
    const pub = (active.threads || []).find(th => th.name === "18k-file");
    if (pub) return pub.id;
    const archPub = await discord(`/channels/${REQUEST_CHANNEL}/threads/archived/public?limit=50`).catch(() => ({ threads: [] }));
    const c2 = (archPub.threads || []).find(isOurs);
    if (c2) return c2.id;
    try {
      const th = await discord(`/channels/${REQUEST_CHANNEL}/threads`, { method: "POST", body: JSON.stringify({ name: "18k-file", type: 11, auto_archive_duration: 60 }) });
      return th.id;
    } catch (_) { /* no threads at all: try a channel */ }
    const me = await discord("/users/@me");
    const c = await discord(`/guilds/${guild}/channels`, { method: "POST", body: JSON.stringify({
      name: "18k-file", type: 0, topic: "File caricati dal sito 18k.bio. Non cancellare: i profili li usano.",
      permission_overwrites: [{ id: guild, type: 0, deny: "1024" }, { id: me.id, type: 1, allow: String(1024 + 2048 + 32768 + 65536) }]
    }) });
    return c.id;
  })().catch(e => { fileCh = null; throw e; });
  return fileCh;
}

module.exports = { ALBUMS, REQUEST_CHANNEL, SNOWFLAKE, discord, guildOf, mediaOf, avatarOf, thumbUrl, fileChannel };
