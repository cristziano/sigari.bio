// Discord slash commands for the 18k bot. Discord calls this address
// (Developer Portal > General Information > Interactions Endpoint URL).
//   /pfp            -> your 18k.bio profile (the one with your Discord id in "presenza discord")
//   /pfp nome:xyz   -> the profile 18kbio.xyz/xyz
//   /pfp utente:@x  -> the profile of that Discord user
//   /posta pfp:<file> banner:<file> canale crediti
//                   -> (admins and the "pfps" role) the bot posts pfp + banner in the channel, with a
//                      Discord-profile style preview, "by …" and a ⬇ button that sends you both files
// Every request is checked with the application's public key, fetched with the bot token.
const crypto = require("crypto");
const { discord, ALBUMS } = require("./_discord");
const { profileByDiscord, profileByName } = require("./_firestore");

// The real address until the 18k.bio domain is live (set SITE_URL in Vercel to change it)
const SITE = process.env.SITE_URL || "https://18kbio.xyz";
let keyP = null;
const publicKey = () => keyP || (keyP = discord("/applications/@me").then(a => crypto.createPublicKey({
  key: Buffer.concat([Buffer.from("302a300506032b6570032100", "hex"), Buffer.from(a.verify_key, "hex")]), format: "der", type: "spki"
})).catch(e => { keyP = null; throw e; }));

async function rawBody(req) {
  const chunks = []; let size = 0;
  for await (const c of req) { size += c.length; if (size > 100000) break; chunks.push(c); }
  return Buffer.concat(chunks).toString("utf8");
}

const plain = s => String(s || "").replace(/\[(?:glow|rainbow|\/glow|\/rainbow|#[0-9a-f]{6}|\/)\]/gi, "").replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, "$1").replace(/\*\*|__|~~|\|\||`|\*/g, "").replace(/\s+/g, " ").trim();
const https = s => (/^https:\/\/[^\s"'<>]+$/.test(String(s || "")) ? String(s) : "");
const colorOf = hex => { const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || "")); const n = m ? parseInt(m[1], 16) : 0xffffff; return n === 0 ? 0x111111 : n; };
const BADGE = { beta: "beta", verified: "verificato", staff: "staff", founder: "founder", partner: "partner", winner: "vincitore topic", premium: "premium", og: "og", donor: "supporter" };
const reply = (res, data) => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify({ type: 4, data: { allowed_mentions: { parse: [] }, ...data } })); };
const secret = (res, content) => reply(res, { content, flags: 64 });

function card(p) {
  const a = p.appearance || {}, url = `${SITE}/${p.handle}`;
  const banner = a.banner && a.banner.type === "image" && https(a.banner.url);
  const bgImage = a.bg && a.bg.type === "image" && https(a.bg.image);
  const avatar = https(p.avatarUrl);
  const stats = [];
  if (!(a.privacy && a.privacy.hideViews)) stats.push(`${(p.views || 0).toLocaleString("it-IT")} visite`);
  stats.push(`♥ ${(p.likes || 0).toLocaleString("it-IT")}`);
  const badges = (p.badges || []).filter(b => BADGE[b]).map(b => BADGE[b]);
  const embed = {
    title: p.displayName && p.displayName !== p.handle ? `${p.displayName} · @${p.handle}` : `@${p.handle}`,
    url,
    description: plain(p.bio).slice(0, 300) || undefined,
    color: colorOf(a.colors && a.colors.accent),
    thumbnail: avatar ? { url: avatar } : undefined,
    image: banner || bgImage ? { url: banner || bgImage } : undefined,
    fields: badges.length ? [{ name: "badge", value: badges.join(" · "), inline: true }] : undefined,
    footer: { text: `18kbio.xyz/${p.handle} · ${stats.join(" · ")}` }
  };
  const buttons = [{ type: 2, style: 5, label: "Apri il profilo", url }];
  if (avatar) buttons.push({ type: 2, style: 5, label: "Scarica la pfp", url: avatar });
  if (banner || bgImage) buttons.push({ type: 2, style: 5, label: "Scarica il banner", url: banner || bgImage });
  return { embeds: [embed], components: [{ type: 1, components: buttons }] };
}

/* ---------- /posta ---------- */
const API = "https://discord.com/api/v10";
let waitUntil = null;
try { ({ waitUntil } = require("@vercel/functions")); } catch (_) { waitUntil = null; }
const roleCache = {};
async function canPost(i) {
  const perms = BigInt((i.member && i.member.permissions) || "0");
  // Administrator, Manage server, Manage messages
  if (perms & (1n << 3n) || perms & (1n << 5n) || perms & (1n << 13n)) return true;
  const mine = (i.member && i.member.roles) || [];
  if (!mine.length || !i.guild_id) return false;
  if (!roleCache[i.guild_id]) roleCache[i.guild_id] = discord(`/guilds/${i.guild_id}/roles`).catch(() => []);
  const roles = await roleCache[i.guild_id];
  return roles.some(r => mine.includes(r.id) && /pfp/i.test(r.name));
}
const extOf = a => (String(a.filename || "").match(/\.(png|jpe?g|gif|webp)$/i) || [, "png"])[1].toLowerCase().replace("jpeg", "jpg");
async function getFile(a) {
  const r = await fetch(a.url, { signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error("file");
  return Buffer.from(await r.arrayBuffer());
}
async function doPosta(i, opt) {
  const att = (i.data.resolved && i.data.resolved.attachments) || {};
  const pfpAs = ["pfp", "pfp2", "pfp3", "pfp4"].map(k => opt[k] && att[opt[k]]).filter(Boolean), pfpA = pfpAs[0], banA = opt.banner ? att[opt.banner] : null;
  const album = ALBUMS[opt.canale] ? opt.canale : "pfps";
  const me = (i.member && i.member.user) || i.user || {};
  const edit = content => fetch(`${API}/webhooks/${i.application_id}/${i.token}/messages/@original`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content }) }).catch(() => {});
  try {
    if (!pfpA || pfpAs.some(x => !/^image\//.test(x.content_type || "image/"))) return edit("Le pfp devono essere immagini (PNG, JPG, GIF, WebP).");
    if (banA && !/^image\//.test(banA.content_type || "image/")) return edit("Il banner deve essere un'immagine.");
    const [ban, ...pfps] = await Promise.all([banA ? getFile(banA) : null, ...pfpAs.map(getFile)]);
    const { preview } = require("./_preview");
    // the "profile" preview only with a banner, and only if everything still fits in Discord's 4-picture card
    const withPreview = !!ban && pfps.length + 2 <= 4;
    const prev = withPreview ? await preview(pfps[0], ban) : null;
    const files = [...(withPreview ? [["18k-preview.png", prev, "image/png"]] : []), ...pfps.map((buf, k) => [`pfp${pfps.length > 1 ? k + 1 : ""}.${extOf(pfpAs[k])}`, buf, pfpAs[k].content_type || "image/png"])];
    if (ban) files.push([`banner.${extOf(banA)}`, ban, banA.content_type || "image/png"]);
    const credit = String(opt.crediti || "").trim().slice(0, 60) || `by ${me.global_name || me.username || "18k"}`;
    const link = `${SITE}/#${Date.now().toString(36)}`;
    // same link on every embed: Discord shows them as one card with a gallery
    const embeds = files.map(([name], k) => ({ url: link, image: { url: `attachment://${name}` }, ...(k ? {} : { color: 0x111214, description: `*${credit.replace(/[*_~`|]/g, "")}*`, footer: { text: "18k.bio" } }) }));
    const payload = {
      embeds, attachments: files.map(([name], id) => ({ id, filename: name })),
      components: [{ type: 1, components: [{ type: 2, style: 2, custom_id: "18k:dl", emoji: { name: "⬇️" }, label: (pfps.length > 1 ? `${pfps.length} pfp` : "pfp") + (ban ? " e banner" : "") }] }],
      allowed_mentions: { parse: [] }
    };
    const fd = new FormData();
    fd.append("payload_json", JSON.stringify(payload));
    files.forEach(([name, buf, type], id) => fd.append(`files[${id}]`, new Blob([buf], { type }), name));
    const r = await fetch(`${API}/channels/${ALBUMS[album].channel}/messages`, { method: "POST", headers: { Authorization: "Bot " + process.env.DISCORD_BOT_TOKEN }, body: fd, signal: AbortSignal.timeout(20000) });
    if (!r.ok) return edit(r.status === 403 ? "Il bot non può scrivere in quel canale: dagli il permesso di inviare messaggi e allegare file." : `Discord ha risposto ${r.status}. Riprova.`);
    const m = await r.json();
    return edit(`Fatto ✓ postato in <#${ALBUMS[album].channel}> — https://discord.com/channels/${i.guild_id}/${m.channel_id}/${m.id}`);
  } catch (_) {
    return edit("Non sono riuscito a postare: riprova (file sotto 10 MB, PNG/JPG/GIF/WebP).");
  }
}
// ⬇ button: sends the pfp and banner of that post only to who pressed it
function sendFiles(res, i) {
  // the files are inside the card (embeds) once Discord shows them; older posts may list them as attachments
  const nameOf = u => { try { return decodeURIComponent(new URL(u).pathname.split("/").pop()); } catch (_) { return ""; } };
  const fromEmbeds = ((i.message && i.message.embeds) || []).map(e => e.image && e.image.url).filter(Boolean).map(url => ({ url, filename: nameOf(url) }));
  const at = [...((i.message && i.message.attachments) || []), ...fromEmbeds].filter((a, k, all) => all.findIndex(b => b.filename === a.filename) === k);
  const out = [...at.filter(a => /^pfp\d?\./i.test(a.filename || "")), ...at.filter(a => /^banner\./i.test(a.filename || ""))];
  if (!out.length) return secret(res, "Non trovo i file di questo post.");
  return reply(res, {
    flags: 64,
    embeds: out.map(a => ({ url: SITE, image: { url: a.url } })),
    components: [{ type: 1, components: out.slice(0, 5).map(a => ({ type: 2, style: 5, label: /^pfp/i.test(a.filename) ? "Scarica " + a.filename.replace(/\..*$/, "") : "Scarica il banner", url: a.url })) }]
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") { res.statusCode = 405; return res.end("Usa POST."); }
  const body = await rawBody(req);
  const sig = String(req.headers["x-signature-ed25519"] || ""), ts = String(req.headers["x-signature-timestamp"] || "");
  let ok = false;
  try { ok = /^[0-9a-f]{128}$/i.test(sig) && crypto.verify(null, Buffer.from(ts + body), await publicKey(), Buffer.from(sig, "hex")); } catch (_) { ok = false; }
  if (!ok) { res.statusCode = 401; return res.end("firma non valida"); }

  let i; try { i = JSON.parse(body); } catch (_) { res.statusCode = 400; return res.end("json"); }
  if (i.type === 1) { res.setHeader("Content-Type", "application/json"); return res.end('{"type":1}'); }
  if (i.type === 3 && i.data && i.data.custom_id === "18k:dl") return sendFiles(res, i);
  if (i.type === 2 && i.data && i.data.name === "posta") {
    const opt = Object.fromEntries((i.data.options || []).map(o => [o.name, o.value]));
    let ok = false;
    try { ok = await canPost(i); } catch (_) { ok = false; }
    if (!ok) return secret(res, "Questo comando è solo per gli admin e per chi ha il ruolo pfps.");
    // answer now ("sto postando…"), do the work right after: Discord waits only 3 seconds
    res.setHeader("Content-Type", "application/json");
    const work = doPosta(i, opt);
    if (waitUntil) { waitUntil(work); return res.end(JSON.stringify({ type: 5, data: { flags: 64 } })); }
    res.end(JSON.stringify({ type: 5, data: { flags: 64 } }));
    return work;
  }
  if (i.type !== 2 || !i.data || i.data.name !== "pfp") return secret(res, "Comando sconosciuto.");

  const opt = Object.fromEntries((i.data.options || []).map(o => [o.name, o.value]));
  const me = (i.member && i.member.user) || i.user || {};
  try {
    let p = null;
    if (opt.nome) p = await profileByName(opt.nome);
    else p = await profileByDiscord(String(opt.utente || me.id || ""));
    if (!p) {
      return secret(res, opt.nome
        ? `Nessun profilo **18kbio.xyz/${String(opt.nome).toLowerCase().replace(/[^a-z0-9_@]/g, "").replace(/^@/, "")}**.`
        : (opt.utente ? "Questa persona non ha collegato Discord al suo profilo 18k.bio." : "Non trovo il tuo profilo. Entra su 18k.bio con Discord (il collegamento è automatico), oppure in Widget > Stato Discord metti il tuo ID e salva. Oppure usa `/pfp nome:tuonome`."));
    }
    if (p.private) return secret(res, "Questo profilo è privato.");
    return reply(res, card(p));
  } catch (_) {
    return secret(res, "18k.bio non risponde adesso, riprova tra poco.");
  }
};

module.exports._doPosta = doPosta; // for tests
