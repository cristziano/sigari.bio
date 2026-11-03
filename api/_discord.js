// Shared helpers for the 18k Discord channels that feed the Foto section.
// The bot token lives only in the Vercel environment (DISCORD_BOT_TOKEN), never in the code.
// Only the channels listed here can be read: the token can't be used to read anything else.

const ALBUMS = {
  sets: { channel: "1531029648593518866", name: "Sets" },
  replie: { channel: "1546667763605569566", name: "Replie" },
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
    out.push({ kind: kindOf(a.content_type, a.filename), video: kindOf(a.content_type, a.filename) === "video", url: a.url, thumb: a.proxy_url || a.url, w: a.width || 0, h: a.height || 0, size: a.size || 0, name: a.filename || "" });
  });
  (m.embeds || []).forEach(e => {
    const v = e.video && (e.type === "gifv" || e.type === "video") ? e.video : null;
    const img = e.image || (e.type === "image" || e.type === "gifv" ? e.thumbnail : null);
    if (v && v.url) out.push({ kind: e.type === "gifv" ? "gif" : "video", video: true, url: v.proxy_url || v.url, thumb: (e.thumbnail && (e.thumbnail.proxy_url || e.thumbnail.url)) || v.proxy_url || v.url, w: v.width || 0, h: v.height || 0, size: 0, name: "" });
    else if (img && img.url) out.push({ kind: kindOf("", img.url), url: img.proxy_url || img.url, thumb: img.proxy_url || img.url, w: img.width || 0, h: img.height || 0, size: 0, name: "" });
  });
  return out;
}

const avatarOf = a => a && a.avatar ? `https://cdn.discordapp.com/avatars/${a.id}/${a.avatar}.${a.avatar.startsWith("a_") ? "gif" : "png"}?size=64` : "";
const thumbUrl = (u, w) => { try { const x = new URL(u); if (/discordapp\.(net|com)$/.test(x.hostname)) { x.searchParams.set("width", String(w)); if (!x.searchParams.has("format")) x.searchParams.set("format", "webp"); } return x.href; } catch (_) { return u; } };

module.exports = { ALBUMS, REQUEST_CHANNEL, SNOWFLAKE, discord, guildOf, mediaOf, avatarOf, thumbUrl };
