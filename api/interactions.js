// Discord slash commands for the 18k bot. Discord calls this address
// (Developer Portal > General Information > Interactions Endpoint URL).
//   /pfp            -> your 18k.bio profile (the one with your Discord id in "presenza discord")
//   /pfp nome:xyz   -> the profile 18k.bio/xyz
//   /pfp utente:@x  -> the profile of that Discord user
// Every request is checked with the application's public key, fetched with the bot token.
const crypto = require("crypto");
const { discord } = require("./_discord");
const { profileByDiscord, profileByName } = require("./_firestore");

const SITE = "https://18k.bio";
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
    footer: { text: `18k.bio/${p.handle} · ${stats.join(" · ")}` }
  };
  const buttons = [{ type: 2, style: 5, label: "Apri il profilo", url }];
  if (avatar) buttons.push({ type: 2, style: 5, label: "Scarica la pfp", url: avatar });
  if (banner || bgImage) buttons.push({ type: 2, style: 5, label: "Scarica il banner", url: banner || bgImage });
  return { embeds: [embed], components: [{ type: 1, components: buttons }] };
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
  if (i.type !== 2 || !i.data || i.data.name !== "pfp") return secret(res, "Comando sconosciuto.");

  const opt = Object.fromEntries((i.data.options || []).map(o => [o.name, o.value]));
  const me = (i.member && i.member.user) || i.user || {};
  try {
    let p = null;
    if (opt.nome) p = await profileByName(opt.nome);
    else p = await profileByDiscord(String(opt.utente || me.id || ""));
    if (!p) {
      return secret(res, opt.nome
        ? `Nessun profilo **18k.bio/${String(opt.nome).toLowerCase().replace(/[^a-z0-9_@]/g, "").replace(/^@/, "")}**.`
        : (opt.utente ? "Questa persona non ha collegato Discord al suo profilo 18k.bio." : "Non trovo il tuo profilo. Entra su 18k.bio con Discord (il collegamento è automatico), oppure in Widget > Stato Discord metti il tuo ID e salva. Oppure usa `/pfp nome:tuonome`."));
    }
    if (p.private) return secret(res, "Questo profilo è privato.");
    return reply(res, card(p));
  } catch (_) {
    return secret(res, "18k.bio non risponde adesso, riprova tra poco.");
  }
};
