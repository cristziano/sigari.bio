/*
  sigari.bio profile kit.
  One renderer for every place a profile is drawn: the public page (profile.html),
  the dashboard preview and the landing demo. Data in, DOM out; nothing here talks to Firebase.
*/

// Last.fm "now playing" needs a read-only API key: https://www.last.fm/api/account/create
// Without it the Last.fm widget still shows, as a link to the profile.
export const LASTFM_API_KEY = "";

export const ICON_CDN = "https://cdn.jsdelivr.net/npm/simple-icons@11.14.0/icons/";

/* ---------- Catalogs ---------- */

// [id, label, css font-family, Google Fonts family spec]
export const FONTS = [
  ["geist", "Geist", "'Geist', system-ui, sans-serif", "Geist:wght@400;500;600;700;800"],
  ["inter", "Inter", "'Inter', system-ui, sans-serif", "Inter:wght@400;600;800"],
  ["geist-mono", "Geist Mono", "'Geist Mono', ui-monospace, monospace", "Geist+Mono:wght@400;600"],
  ["space-mono", "Space Mono", "'Space Mono', monospace", "Space+Mono:wght@400;700"],
  ["vt323", "VT323", "'VT323', monospace", "VT323"],
  ["silkscreen", "Silkscreen", "'Silkscreen', monospace", "Silkscreen:wght@400;700"],
  ["syne", "Syne", "'Syne', sans-serif", "Syne:wght@500;700;800"],
  ["bebas", "Bebas Neue", "'Bebas Neue', sans-serif", "Bebas+Neue"],
  ["anton", "Anton", "'Anton', sans-serif", "Anton"],
  ["audiowide", "Audiowide", "'Audiowide', sans-serif", "Audiowide"],
  ["instrument", "Instrument Serif", "'Instrument Serif', serif", "Instrument+Serif:ital@0;1"],
  ["bodoni", "Bodoni Moda", "'Bodoni Moda', serif", "Bodoni+Moda:ital,wght@0,400;0,700;1,400;1,700"],
  ["unifraktur", "UnifrakturMaguntia", "'UnifrakturMaguntia', serif", "UnifrakturMaguntia"],
  ["pirata", "Pirata One", "'Pirata One', serif", "Pirata+One"],
  ["metal", "Metal Mania", "'Metal Mania', serif", "Metal+Mania"],
  ["blackops", "Black Ops One", "'Black Ops One', sans-serif", "Black+Ops+One"],
  ["cherry", "Cherry Bomb One", "'Cherry Bomb One', sans-serif", "Cherry+Bomb+One"],
  ["marker", "Permanent Marker", "'Permanent Marker', cursive", "Permanent+Marker"],
  ["pinyon", "Pinyon Script", "'Pinyon Script', cursive", "Pinyon+Script"],
  ["glitch", "Rubik Glitch", "'Rubik Glitch', sans-serif", "Rubik+Glitch"]
];
const FONT = Object.fromEntries(FONTS.map(f => [f[0], f]));

const ICON_MAIL = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2 5h20v14H2z M2 5l10 8 10-8" fill="none" stroke="#000" stroke-width="2"/></svg>');
const ICON_WEB = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="#000" stroke-width="2"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" fill="none" stroke="#000" stroke-width="2"/></svg>');

export const SOCIALS = [
  { key: "instagram", label: "Instagram", color: "#E4405F", base: "https://instagram.com/" },
  { key: "tiktok", label: "TikTok", color: "#ff0050", base: "https://tiktok.com/@" },
  { key: "x", label: "X", color: "#ffffff", base: "https://x.com/" },
  { key: "discord", label: "Discord", color: "#5865F2", base: "" },
  { key: "youtube", label: "YouTube", color: "#FF0000", base: "https://youtube.com/@" },
  { key: "twitch", label: "Twitch", color: "#9146FF", base: "https://twitch.tv/" },
  { key: "kick", label: "Kick", color: "#53FC18", base: "https://kick.com/" },
  { key: "spotify", label: "Spotify", color: "#1DB954", base: "https://open.spotify.com/user/" },
  { key: "applemusic", label: "Apple Music", color: "#FA243C", base: "" },
  { key: "soundcloud", label: "SoundCloud", color: "#FF5500", base: "https://soundcloud.com/" },
  { key: "lastdotfm", label: "Last.fm", color: "#D51007", base: "https://last.fm/user/" },
  { key: "github", label: "GitHub", color: "#ffffff", base: "https://github.com/" },
  { key: "telegram", label: "Telegram", color: "#229ED1", base: "https://t.me/" },
  { key: "snapchat", label: "Snapchat", color: "#FFFC00", base: "https://snapchat.com/add/" },
  { key: "threads", label: "Threads", color: "#ffffff", base: "https://threads.net/@" },
  { key: "bluesky", label: "Bluesky", color: "#0085FF", base: "https://bsky.app/profile/" },
  { key: "reddit", label: "Reddit", color: "#FF4500", base: "https://reddit.com/user/" },
  { key: "pinterest", label: "Pinterest", color: "#E60023", base: "https://pinterest.com/" },
  { key: "whatsapp", label: "WhatsApp", color: "#25D366", base: "https://wa.me/" },
  { key: "steam", label: "Steam", color: "#ffffff", base: "https://steamcommunity.com/id/" },
  { key: "roblox", label: "Roblox", color: "#ffffff", base: "https://roblox.com/users/" },
  { key: "playstation", label: "PlayStation", color: "#0070D1", base: "" },
  { key: "xbox", label: "Xbox", color: "#107C10", base: "" },
  { key: "epicgames", label: "Epic Games", color: "#ffffff", base: "" },
  { key: "riotgames", label: "Riot Games", color: "#D32936", base: "" },
  { key: "letterboxd", label: "Letterboxd", color: "#00E054", base: "https://letterboxd.com/" },
  { key: "patreon", label: "Patreon", color: "#FF424D", base: "https://patreon.com/" },
  { key: "kofi", label: "Ko-fi", color: "#FF5E5B", base: "https://ko-fi.com/" },
  { key: "paypal", label: "PayPal", color: "#00457C", base: "https://paypal.me/" },
  { key: "behance", label: "Behance", color: "#1769FF", base: "https://behance.net/" },
  { key: "dribbble", label: "Dribbble", color: "#EA4C89", base: "https://dribbble.com/" },
  { key: "figma", label: "Figma", color: "#F24E1E", base: "https://figma.com/@" },
  { key: "vimeo", label: "Vimeo", color: "#1AB7EA", base: "https://vimeo.com/" },
  { key: "tumblr", label: "Tumblr", color: "#36465D", base: "" },
  { key: "mastodon", label: "Mastodon", color: "#6364FF", base: "" },
  { key: "facebook", label: "Facebook", color: "#1877F2", base: "https://facebook.com/" },
  { key: "email", label: "Email", color: "#ffffff", base: "mailto:", icon: ICON_MAIL },
  { key: "website", label: "Sito web", color: "#ffffff", base: "", icon: ICON_WEB }
];
export const socialIcon = s => s.icon || `${ICON_CDN}${s.key}.svg`;

export const LAYOUTS = [["classic", "Classico"], ["left", "A sinistra"], ["banner", "Banner"], ["minimal", "Minimal"], ["terminal", "Terminale"]];
export const EFFECTS = [["none", "Nessuno"], ["lava", "Lava"], ["aurora", "Aurora"], ["snow", "Neve"], ["rain", "Pioggia"], ["stars", "Stelle"], ["particles", "Costellazione"], ["hearts", "Cuori"], ["matrix", "Matrix"], ["noise", "Grana"], ["scanlines", "Scanline"], ["dither", "Dither"]];
export const NAME_FX = [["none", "Nessuno"], ["glow", "Glow"], ["gradient", "Gradiente"], ["rainbow", "Arcobaleno"], ["glitch", "Glitch"], ["sparkle", "Scintille"], ["typewriter", "Macchina da scrivere"], ["shuffle", "Shuffle"], ["outline", "Contorno"]];
export const ENTRANCES = [["none", "Nessuna"], ["pixel", "Pixel"], ["fade", "Dissolvenza"], ["glitch", "Glitch"], ["pop", "Pop"]];

/* ---------- Defaults and normalisation ---------- */

export const DEFAULT_APPEARANCE = {
  v: 2,
  layout: "classic",
  bg: { type: "color", color: "#000000", gradient: { kind: "linear", angle: 160, stops: ["#1a1a1a", "#000000", "#2b2b2b"] }, image: "", video: "", fit: "cover", dim: 30, blur: 0 },
  effect: "lava", effectColor: "#ffffff", intensity: 80,
  card: { opacity: 55, blur: 14, radius: 22, border: "solid", width: 420, gradient: false },
  colors: { accent: "#ffffff", text: "#ffffff", muted: "#9a9a9a", icon: "#ffffff", primary: "#0d0d0d", secondary: "#141414", border: "#2a2a2a" },
  font: { name: "geist", body: "geist", nameSize: 100, upper: false, spacing: 0 },
  nameFx: "none", nameGradient: ["#ffffff", "#8a8a8a"],
  bioFx: "none", bioLines: [], typeSpeed: 70,
  avatar: { show: true, shape: "circle", size: 92, ring: "none" },
  badges: { show: true },
  socialsStyle: { style: "plain", size: 40, position: "top", align: "center" },
  buttons: { variant: "solid", palette: "white", custom: "#ffffff", shape: "rounded", shadow: "none", hover: "lift", align: "center", icons: true },
  cursor: { type: "default", url: "", trail: "none" },
  enter: { on: false, text: "clicca per entrare", style: "blur" },
  music: { type: "none", url: "", autoplay: true, volume: 60, showPlayer: true, title: "" },
  lastfm: { user: "", show: false },
  widgets: { discordId: "", github: "", clock: "", showViews: true },
  title: { text: "", animated: false },
  seo: { description: "", image: "" },
  privacy: { hideViews: false, unlisted: false, hideBadges: false, private: false },
  glow: { username: false, socials: false, badges: false, links: false },
  entrance: "pixel"
};

const HEX = /^#[0-9a-f]{6}$/i;
const isObj = v => v && typeof v === "object" && !Array.isArray(v);
export const clamp = (n, a, b, f) => Number.isFinite(+n) && n !== "" && n !== null ? Math.min(b, Math.max(a, +n)) : f;
export const safeColor = (c, f) => HEX.test(String(c || "")) ? String(c).toLowerCase() : f;
const pickOne = (v, list, f) => list.some(x => x[0] === v) ? v : f;

export function safeUrl(u, allowData = false) {
  const s = String(u || "").trim();
  if (!s) return null;
  if (allowData && /^data:image\/(png|jpe?g|webp|gif);base64,[a-z0-9+/=]+$/i.test(s)) return s;
  try {
    const x = new URL(s);
    return x.protocol === "https:" || x.protocol === "http:" ? x.href : null;
  } catch (_) { return null; }
}
export function safeLinkUrl(u) {
  const s = String(u || "").trim();
  try {
    const x = new URL(s);
    return ["http:", "https:", "mailto:", "tel:"].includes(x.protocol) ? x.href : null;
  } catch (_) { return null; }
}

function deepMerge(base, over) {
  const out = Array.isArray(base) ? base.slice() : { ...base };
  if (!isObj(over)) return out;
  for (const [k, v] of Object.entries(over)) {
    if (isObj(base[k]) && isObj(v)) out[k] = deepMerge(base[k], v);
    else if (v !== undefined) out[k] = v;
  }
  return out;
}

// Merges stored data over the defaults, migrates the v1 fields and clamps every value
// into a safe range, so the renderer can trust what it gets.
export function normalizeAppearance(raw) {
  const r = isObj(raw) ? raw : {};
  const a = deepMerge(DEFAULT_APPEARANCE, r);
  if (!r.v) {
    // v1 documents: flat cursor, profileOpacity/profileBlur, colors.background, theme
    if (typeof r.cursor === "string") a.cursor = { ...DEFAULT_APPEARANCE.cursor, type: r.cursor };
    if (typeof r.profileOpacity === "number") a.card.opacity = r.profileOpacity;
    if (typeof r.profileBlur === "number") a.card.blur = r.profileBlur;
    const legacyBg = r.colors && r.colors.background ? r.colors.background : r.theme === "charcoal" ? "#0d0d0d" : null;
    if (legacyBg) a.bg.color = legacyBg;
    a.v = 2;
  }
  const d = DEFAULT_APPEARANCE;
  a.layout = pickOne(a.layout, LAYOUTS, d.layout);
  a.bg.type = ["color", "gradient", "image", "video"].includes(a.bg.type) ? a.bg.type : "color";
  a.bg.color = safeColor(a.bg.color, d.bg.color);
  a.bg.gradient.kind = ["linear", "radial", "conic"].includes(a.bg.gradient.kind) ? a.bg.gradient.kind : "linear";
  a.bg.gradient.angle = clamp(a.bg.gradient.angle, 0, 360, 160);
  a.bg.gradient.stops = (Array.isArray(a.bg.gradient.stops) ? a.bg.gradient.stops : []).map(c => safeColor(c, null)).filter(Boolean).slice(0, 4);
  if (a.bg.gradient.stops.length < 2) a.bg.gradient.stops = d.bg.gradient.stops.slice();
  a.bg.fit = ["cover", "contain", "tile"].includes(a.bg.fit) ? a.bg.fit : "cover";
  a.bg.dim = clamp(a.bg.dim, 0, 90, 30);
  a.bg.blur = clamp(a.bg.blur, 0, 24, 0);
  a.effect = pickOne(a.effect, EFFECTS, "none");
  a.effectColor = safeColor(a.effectColor, "#ffffff");
  a.intensity = clamp(a.intensity, 0, 100, 80);
  a.card.opacity = clamp(a.card.opacity, 0, 100, 55);
  a.card.blur = clamp(a.card.blur, 0, 30, 14);
  a.card.radius = clamp(a.card.radius, 0, 40, 22);
  a.card.width = clamp(a.card.width, 320, 620, 420);
  a.card.border = ["none", "solid", "glow", "animated"].includes(a.card.border) ? a.card.border : "solid";
  a.card.gradient = !!a.card.gradient;
  for (const k of Object.keys(d.colors)) a.colors[k] = safeColor(a.colors[k], d.colors[k]);
  a.font.name = FONT[a.font.name] ? a.font.name : "geist";
  a.font.body = FONT[a.font.body] ? a.font.body : "geist";
  a.font.nameSize = clamp(a.font.nameSize, 60, 200, 100);
  a.font.spacing = clamp(a.font.spacing, -8, 30, 0);
  a.font.upper = !!a.font.upper;
  a.nameFx = pickOne(a.nameFx, NAME_FX, "none");
  a.nameGradient = [safeColor(a.nameGradient?.[0], "#ffffff"), safeColor(a.nameGradient?.[1], "#8a8a8a")];
  a.bioFx = a.bioFx === "typewriter" ? "typewriter" : "none";
  a.bioLines = (Array.isArray(a.bioLines) ? a.bioLines : []).map(s => String(s || "").slice(0, 80)).filter(Boolean).slice(0, 6);
  a.typeSpeed = clamp(a.typeSpeed, 20, 200, 70);
  a.avatar.shape = ["circle", "rounded", "square", "hex"].includes(a.avatar.shape) ? a.avatar.shape : "circle";
  a.avatar.size = clamp(a.avatar.size, 56, 150, 92);
  a.avatar.ring = ["none", "solid", "glow", "spin"].includes(a.avatar.ring) ? a.avatar.ring : "none";
  a.avatar.show = a.avatar.show !== false;
  a.socialsStyle.style = ["plain", "brand", "glow", "outline", "filled"].includes(a.socialsStyle.style) ? a.socialsStyle.style : "plain";
  a.socialsStyle.size = clamp(a.socialsStyle.size, 28, 60, 40);
  a.socialsStyle.position = a.socialsStyle.position === "bottom" ? "bottom" : "top";
  a.socialsStyle.align = ["left", "center", "right"].includes(a.socialsStyle.align) ? a.socialsStyle.align : "center";
  const b = a.buttons;
  b.variant = ["solid", "outline", "ghost", "glass"].includes(b.variant) ? b.variant : "solid";
  b.palette = ["white", "silver", "graphite", "accent", "custom"].includes(b.palette) ? b.palette : "white";
  b.custom = safeColor(b.custom, "#ffffff");
  b.shape = ["square", "rounded", "pill"].includes(b.shape) ? b.shape : "rounded";
  b.shadow = ["none", "soft", "glow", "hard"].includes(b.shadow) ? b.shadow : "none";
  b.hover = ["none", "lift", "grow", "glow", "shine"].includes(b.hover) ? b.hover : "lift";
  b.align = b.align === "left" ? "left" : "center";
  b.icons = b.icons !== false;
  a.cursor.type = ["default", "crosshair", "custom"].includes(a.cursor.type) ? a.cursor.type : "default";
  a.cursor.url = safeUrl(a.cursor.url, true) || "";
  a.cursor.trail = ["none", "dots", "sparkle", "ghost"].includes(a.cursor.trail) ? a.cursor.trail : "none";
  a.enter.on = !!a.enter.on;
  a.enter.text = String(a.enter.text || "clicca per entrare").slice(0, 40);
  a.enter.style = ["blur", "pixel", "fade"].includes(a.enter.style) ? a.enter.style : "blur";
  a.music.type = ["none", "spotify", "audio", "soundcloud", "youtube"].includes(a.music.type) ? a.music.type : "none";
  a.music.url = String(a.music.url || "").slice(0, 600);
  a.music.title = String(a.music.title || "").slice(0, 60);
  a.music.volume = clamp(a.music.volume, 0, 100, 60);
  a.music.autoplay = a.music.autoplay !== false;
  a.music.showPlayer = a.music.showPlayer !== false;
  a.lastfm.user = String(a.lastfm.user || "").replace(/[^a-z0-9_.-]/gi, "").slice(0, 30);
  a.lastfm.show = !!a.lastfm.show && !!a.lastfm.user;
  a.widgets.discordId = String(a.widgets.discordId || "").replace(/\D/g, "").slice(0, 20);
  a.widgets.github = String(a.widgets.github || "").replace(/[^a-z0-9-]/gi, "").slice(0, 39);
  a.widgets.clock = String(a.widgets.clock || "").slice(0, 40);
  a.widgets.showViews = a.widgets.showViews !== false;
  a.title.text = String(a.title.text || "").slice(0, 60);
  a.title.animated = !!a.title.animated;
  a.seo.description = String(a.seo.description || "").slice(0, 160);
  a.seo.image = safeUrl(a.seo.image) || "";
  for (const k of Object.keys(d.privacy)) a.privacy[k] = !!a.privacy[k];
  for (const k of Object.keys(d.glow)) a.glow[k] = !!a.glow[k];
  a.entrance = pickOne(a.entrance, ENTRANCES, "pixel");
  a.bg.image = safeUrl(a.bg.image, true) || "";
  a.bg.video = safeUrl(a.bg.video) || "";
  return a;
}

export function normalizeProfile(raw) {
  const p = isObj(raw) ? raw : {};
  const handle = String(p.handle || "tuonome").toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20) || "tuonome";
  return {
    handle,
    displayName: String(p.displayName || handle).slice(0, 40),
    bio: String(p.bio ?? "").slice(0, 160),
    tags: (Array.isArray(p.tags) ? p.tags : []).map(t => String(t).slice(0, 20)).filter(Boolean).slice(0, 5),
    location: String(p.location || "").slice(0, 60),
    avatarUrl: safeUrl(p.avatarUrl, true) || "",
    links: (Array.isArray(p.links) ? p.links : []).slice(0, 30).map(l => ({ title: String(l?.title || "").slice(0, 60), url: String(l?.url || "").slice(0, 600), hidden: !!l?.hidden })),
    socials: isObj(p.socials) ? Object.fromEntries(Object.entries(p.socials).filter(([k, v]) => SOCIALS.some(s => s.key === k) && v).map(([k, v]) => [k, String(v).slice(0, 200)])) : {},
    badges: (Array.isArray(p.badges) ? p.badges : []).filter(b => BADGES[b]).slice(0, 8),
    weekly: isObj(p.weekly) ? { week: String(p.weekly.week || ""), text: String(p.weekly.text || "").slice(0, 200), link: String(p.weekly.link || "").slice(0, 600), image: String(p.weekly.image || "").slice(0, 600), show: !!p.weekly.show } : null,
    views: Math.max(0, Math.floor(+p.views || 0)),
    appearance: normalizeAppearance(p.appearance)
  };
}

export const BADGES = {
  beta: ["beta", '<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/>'],
  early: ["della prima ora", '<path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"/>'],
  verified: ["verificato", '<path d="M20 6L9 17l-5-5"/>'],
  partner: ["partner", '<path d="M3 15h15v4H3zM18 15h3v4h-3M7 11c0-2 2-2 2-4s-2-2-2-4M12 11c0-2 2-2 2-4s-2-2-2-4"/>'],
  winner: ["vincitore del topic", '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/>']
};

/* ---------- Templates ---------- */

const PX = id => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`;
export const TEMPLATES = [
  { id: "nero", name: "Nero puro", tags: ["minimal", "b&w"], a: {} },
  { id: "fumo", name: "Fumo", tags: ["foto", "b&w"], a: { bg: { type: "image", image: PX(9694694), dim: 35 }, effect: "none", font: { name: "bodoni" }, nameFx: "glow", card: { opacity: 30, blur: 10 } } },
  { id: "vapor", name: "Vapor", tags: ["gradiente", "colori"], a: { bg: { type: "gradient", gradient: { kind: "linear", angle: 135, stops: ["#ff6ad5", "#c774e8", "#8795e8", "#94d0ff"] } }, effect: "stars", effectColor: "#ffffff", intensity: 45, card: { opacity: 18, blur: 16, border: "glow" }, colors: { accent: "#ffffff", primary: "#2a1a4a", secondary: "#2a1a4a", border: "#ffffff" }, font: { name: "audiowide" }, nameFx: "glow", buttons: { variant: "glass", shape: "pill" }, socialsStyle: { style: "glow" } } },
  { id: "egirl", name: "E-girl", tags: ["egirl", "rosa"], a: { bg: { type: "gradient", gradient: { kind: "radial", stops: ["#ff7ad9", "#2a0420", "#0a0008"] } }, effect: "hearts", effectColor: "#ff9de6", intensity: 55, colors: { accent: "#ff5fc8", text: "#ffe6f7", muted: "#ff9de6", icon: "#ffd1f0", primary: "#1a0414", secondary: "#2a0820", border: "#ff5fc8" }, card: { opacity: 50, border: "glow", radius: 28 }, font: { name: "cherry" }, nameFx: "gradient", nameGradient: ["#ffd1f0", "#ff5fc8"], avatar: { ring: "glow" }, buttons: { variant: "solid", palette: "accent", shape: "pill", hover: "grow" } } },
  { id: "emo", name: "Emo", tags: ["emo", "rosso"], a: { bg: { type: "image", image: PX(37364257), dim: 62 }, effect: "rain", effectColor: "#ff3b3b", intensity: 60, colors: { accent: "#ff2a2a", text: "#f2f2f2", muted: "#b0b0b0", icon: "#ff4d4d", primary: "#0a0a0a", secondary: "#160606", border: "#ff2a2a" }, font: { name: "metal" }, nameFx: "glitch", card: { border: "solid", radius: 6 }, buttons: { variant: "outline", palette: "accent", shape: "square" } } },
  { id: "rap", name: "Rapper", tags: ["rap", "oro"], a: { bg: { type: "gradient", gradient: { kind: "linear", angle: 180, stops: ["#2a1f06", "#000000"] } }, effect: "particles", effectColor: "#f5c542", intensity: 50, colors: { accent: "#f5c542", text: "#fff8e1", muted: "#c9a94a", icon: "#f5c542", primary: "#0d0b05", secondary: "#1a150a", border: "#5a4512" }, font: { name: "anton", upper: true, spacing: 2 }, nameFx: "gradient", nameGradient: ["#fff3b0", "#d4a017"], buttons: { variant: "solid", palette: "accent", shape: "rounded", shadow: "glow" } } },
  { id: "rapita", name: "Rap italiano", tags: ["rap", "città"], a: { layout: "left", bg: { type: "image", image: PX(17432931), dim: 55 }, effect: "noise", intensity: 60, font: { name: "bebas", nameSize: 140 }, nameFx: "shuffle", card: { opacity: 40, radius: 4 }, buttons: { variant: "solid", shape: "square", hover: "shine" } } },
  { id: "goth", name: "Goth", tags: ["goth", "viola"], a: { bg: { type: "color", color: "#07040c" }, effect: "lava", effectColor: "#7b3fc4", intensity: 70, colors: { accent: "#b48cff", text: "#ece4ff", muted: "#9b8cc0", icon: "#b48cff", primary: "#0d0814", secondary: "#160d24", border: "#3c2766" }, font: { name: "unifraktur", body: "instrument", nameSize: 130 }, nameFx: "glow", avatar: { shape: "hex", ring: "none" }, card: { border: "animated" } } },
  { id: "y2k", name: "Y2K", tags: ["y2k", "cromo"], a: { bg: { type: "gradient", gradient: { kind: "conic", stops: ["#e0f7ff", "#a3b8ff", "#ffffff", "#b6fff4"] } }, effect: "stars", effectColor: "#3a6cff", intensity: 35, colors: { accent: "#3a6cff", text: "#0a0a2a", muted: "#4a4a7a", icon: "#3a6cff", primary: "#ffffff", secondary: "#eef2ff", border: "#a3b8ff" }, card: { opacity: 55, border: "solid" }, font: { name: "audiowide" }, nameFx: "outline", buttons: { variant: "outline", palette: "accent", shape: "pill", hover: "grow" } } },
  { id: "terminale", name: "Terminale", tags: ["hacker", "verde"], a: { layout: "terminal", bg: { type: "color", color: "#000000" }, effect: "matrix", effectColor: "#00ff66", intensity: 55, colors: { accent: "#00ff66", text: "#00ff66", muted: "#0aa045", icon: "#00ff66", primary: "#000000", secondary: "#001a0a", border: "#00ff66" }, card: { opacity: 70, radius: 2, border: "solid" }, font: { name: "vt323", body: "vt323", nameSize: 150 }, nameFx: "typewriter", buttons: { variant: "outline", palette: "accent", shape: "square", hover: "none" } } },
  { id: "angel", name: "Angel", tags: ["angel", "chiaro"], a: { bg: { type: "gradient", gradient: { kind: "linear", angle: 180, stops: ["#ffffff", "#f3e9ff", "#e6f0ff"] } }, effect: "particles", effectColor: "#b9a6ff", intensity: 40, colors: { accent: "#8f7bff", text: "#1a1a2e", muted: "#6b6b8a", icon: "#8f7bff", primary: "#ffffff", secondary: "#f6f2ff", border: "#d9d0ff" }, card: { opacity: 70, radius: 30 }, font: { name: "pinyon", body: "instrument", nameSize: 150 }, avatar: { ring: "glow" }, buttons: { variant: "solid", palette: "accent", shape: "pill", hover: "glow" } } },
  { id: "oceano", name: "Oceano", tags: ["foto", "blu"], a: { bg: { type: "image", image: PX(34000505), dim: 40 }, effect: "none", colors: { accent: "#7fe7ff", text: "#f0fbff", muted: "#9fc3cf", icon: "#bff3ff", primary: "#03141c", secondary: "#082431", border: "#1e5566" }, font: { name: "syne" }, card: { opacity: 35, blur: 18, border: "glow" }, buttons: { variant: "glass", shape: "rounded" } } },
  { id: "tramonto", name: "Tramonto", tags: ["gradiente", "caldo"], a: { bg: { type: "gradient", gradient: { kind: "linear", angle: 200, stops: ["#ff7e5f", "#feb47b", "#6a2c70"] } }, effect: "dither", intensity: 45, colors: { accent: "#ffe0b8", text: "#fff7ee", muted: "#ffd7b0", icon: "#fff7ee", primary: "#2a0f1e", secondary: "#3a1526", border: "#ffe0b8" }, card: { opacity: 30, blur: 12 }, font: { name: "instrument", nameSize: 150 }, nameFx: "glow", buttons: { variant: "ghost", shape: "pill", hover: "lift" } } },
  { id: "bianco", name: "Bianco minimal", tags: ["minimal", "chiaro"], a: { layout: "minimal", bg: { type: "color", color: "#f4f4f4" }, effect: "none", colors: { accent: "#111111", text: "#111111", muted: "#6b6b6b", icon: "#111111", primary: "#ffffff", secondary: "#ffffff", border: "#dddddd" }, buttons: { variant: "outline", palette: "accent", shape: "square", hover: "lift" } } }
];

// Parts a template can lend without overwriting the whole look.
export const TEMPLATE_PARTS = {
  all: null,
  bg: ["bg", "effect", "effectColor", "intensity"],
  colors: ["colors"],
  fonts: ["font", "nameFx", "nameGradient"],
  layout: ["layout", "card", "avatar", "entrance"],
  buttons: ["buttons", "socialsStyle"]
};
const PERSONAL = ["music", "lastfm", "widgets", "title", "seo", "privacy"];

export function applyTemplate(current, tplAppearance, part = "all") {
  const cur = normalizeAppearance(current);
  if (part === "all") {
    const base = deepMerge(DEFAULT_APPEARANCE, tplAppearance || {});
    for (const k of PERSONAL) base[k] = cur[k];
    return normalizeAppearance({ ...base, v: 2 });
  }
  const keys = TEMPLATE_PARTS[part] || [];
  const tpl = normalizeAppearance({ ...deepMerge(DEFAULT_APPEARANCE, tplAppearance || {}), v: 2 });
  const out = structuredClone(cur);
  for (const k of keys) out[k] = structuredClone(tpl[k]);
  return normalizeAppearance(out);
}

// Strips the personal bits before a look is shared as a template.
export function templateFromAppearance(a) {
  const n = normalizeAppearance(a);
  const out = structuredClone(n);
  for (const k of PERSONAL) delete out[k];
  if (out.bg.image && out.bg.image.startsWith("data:")) out.bg.image = "";
  if (out.cursor.url && out.cursor.url.startsWith("data:")) out.cursor.url = "";
  return out;
}

/* ---------- Weekly topic ---------- */

export const TOPICS = [
  { title: "La canzone che ti ha cambiato l'estate", hint: "Metti il brano, un link o la copertina." },
  { title: "Il tuo setup", hint: "Una foto della tua postazione, così com'è." },
  { title: "Una foto senza filtri", hint: "Niente ritocchi, solo quello che vedi." },
  { title: "L'outfit della settimana", hint: "Una foto o tre parole per descriverlo." },
  { title: "La copertina di un album che ami", hint: "E una riga sul perché." },
  { title: "Il tuo posto in città", hint: "Dove vai quando vuoi stare da solo." },
  { title: "Tre parole che ti descrivono", hint: "Solo tre. Niente di più." },
  { title: "Il gioco a cui torni sempre", hint: "Link, screenshot o la tua stat migliore." },
  { title: "Lo sfondo del tuo telefono", hint: "Fai uno screenshot e mettilo qui." },
  { title: "Un ricordo del 2016", hint: "Una foto, una canzone, un meme." },
  { title: "La tua bio in cinque parole", hint: "Cinque, contale." },
  { title: "Il film che rivedresti stasera", hint: "Titolo e una scena che ti è rimasta." }
];

export function isoWeek(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const year = t.getUTCFullYear();
  const week = Math.ceil(((t - Date.UTC(year, 0, 1)) / 864e5 + 1) / 7);
  return { year, week, id: `${year}-W${String(week).padStart(2, "0")}` };
}

export function currentTopic(d = new Date()) {
  const { year, week, id } = isoWeek(d);
  const t = TOPICS[(year * 53 + week) % TOPICS.length];
  const end = new Date(d);
  end.setHours(24, 0, 0, 0);
  while (end.getDay() !== 1) end.setDate(end.getDate() + 1);
  return { id, week, ...t, endsAt: end };
}

/* ---------- Media helpers ---------- */

export function spotifyEmbed(url) {
  const m = String(url || "").match(/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(track|album|playlist|artist|episode|show)\/([a-z0-9]{10,40})/i);
  return m ? { src: `https://open.spotify.com/embed/${m[1]}/${m[2]}?theme=0`, height: m[1] === "track" || m[1] === "episode" ? 80 : 152 } : null;
}
export function youtubeEmbed(url) {
  const m = String(url || "").match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-z0-9_-]{11})/i);
  return m ? { src: `https://www.youtube-nocookie.com/embed/${m[1]}`, height: 200 } : null;
}
export function soundcloudEmbed(url) {
  const u = safeUrl(url);
  return u && /soundcloud\.com\//i.test(u) ? { src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(u)}&color=%23ffffff&auto_play=false&hide_related=true&show_comments=false&visual=false`, height: 120 } : null;
}

export function ensureFonts(ids) {
  const want = [...new Set(ids)].filter(id => FONT[id] && !document.getElementById("pkf-" + id));
  if (!want.length) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?" + want.map(id => "family=" + FONT[id][3]).join("&") + "&display=swap";
  document.head.appendChild(link);
  want.forEach(id => { const m = document.createElement("meta"); m.id = "pkf-" + id; document.head.appendChild(m); });
}

const hexRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)).join(",");
const R = (a, b) => a + Math.random() * (b - a);
const reduceMotion = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () => typeof matchMedia === "function" && matchMedia("(pointer: fine)").matches;
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const svg = (paths, size = 14, fill = false) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" ${fill ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'}>${paths}</svg>`;

/* ---------- Styles (injected once) ---------- */

const CSS = `
.pk{--pk-accent:#fff;--pk-text:#fff;--pk-muted:#9a9a9a;--pk-icon:#fff;--pk-card-rgb:13,13,13;--pk-card-a:.55;--pk-card-blur:14px;--pk-radius:22px;--pk-w:420px;--pk-surface:#141414;--pk-border:#2a2a2a;--pk-name-font:'Geist',system-ui,sans-serif;--pk-body-font:'Geist',system-ui,sans-serif;--pk-name-scale:1;--pk-name-ls:0;--pk-av:92px;--pk-soc:40px;--pk-fxc:#fff;--pk-fxa:.1;
position:relative;width:100%;height:100%;overflow:hidden;color:var(--pk-text);font-family:var(--pk-body-font);background:#000;isolation:isolate;-webkit-font-smoothing:antialiased;text-align:center;line-height:1.45}
.pk *{box-sizing:border-box;margin:0;padding:0}
.pk a{color:inherit}
.pk-bg{position:absolute;inset:0;z-index:0;overflow:hidden}
.pk-bg img,.pk-bg video{position:absolute;inset:-24px;width:calc(100% + 48px);height:calc(100% + 48px);object-fit:cover;filter:blur(var(--pk-bgblur,0px))}
.pk-bg[data-fit=contain] img,.pk-bg[data-fit=contain] video{object-fit:contain}
.pk-bg .pk-tile{position:absolute;inset:0;background-repeat:repeat;background-size:auto;filter:blur(var(--pk-bgblur,0px))}
.pk-dim{position:absolute;inset:0;z-index:0;background:#000;opacity:var(--pk-dim,0);pointer-events:none}
.pk-fx{position:absolute;inset:0;z-index:1;pointer-events:none;overflow:hidden}
.pk-fx canvas{position:absolute;inset:0;width:100%;height:100%}
.pk-lava i{position:absolute;border-radius:50%;background:var(--pk-fxc);filter:blur(70px);opacity:var(--pk-fxa);animation:pk-drift 34s ease-in-out infinite alternate}
.pk-lava i:nth-child(1){width:55%;aspect-ratio:1;left:-15%;top:-12%}
.pk-lava i:nth-child(2){width:65%;aspect-ratio:1;right:-25%;top:28%;animation-duration:42s;animation-delay:-8s}
.pk-lava i:nth-child(3){width:45%;aspect-ratio:1;left:25%;bottom:-20%;animation-duration:48s;animation-delay:-20s}
.pk-lava i:nth-child(4){width:38%;aspect-ratio:1;left:55%;top:5%;animation-duration:40s;animation-delay:-14s}
@keyframes pk-drift{0%{transform:translate(0,0) scale(1)}50%{transform:translate(18%,-12%) scale(1.12)}100%{transform:translate(-10%,14%) scale(.9)}}
.pk-aurora i{position:absolute;width:90%;height:60%;left:5%;top:-10%;border-radius:50%;filter:blur(60px);mix-blend-mode:screen;opacity:var(--pk-fxa);animation:pk-aur 18s ease-in-out infinite alternate}
.pk-aurora i:nth-child(1){background:var(--pk-fxc)}
.pk-aurora i:nth-child(2){background:var(--pk-accent);top:20%;left:-20%;animation-duration:24s;animation-delay:-6s}
.pk-aurora i:nth-child(3){background:var(--pk-fxc);top:45%;left:30%;animation-duration:28s;animation-delay:-12s;opacity:calc(var(--pk-fxa)*.7)}
@keyframes pk-aur{0%{transform:translate(-10%,0) rotate(-8deg) scaleY(.7)}100%{transform:translate(12%,8%) rotate(10deg) scaleY(1.15)}}
.pk-noise{position:absolute;inset:-50%;opacity:var(--pk-fxa);background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");animation:pk-grain .6s steps(3) infinite}
@keyframes pk-grain{0%{transform:translate(0,0)}33%{transform:translate(-3%,2%)}66%{transform:translate(2%,-3%)}}
.pk-scan{position:absolute;inset:0;opacity:var(--pk-fxa);background:repeating-linear-gradient(0deg,rgba(0,0,0,.7) 0 1px,transparent 1px 3px)}
.pk-scan::after{content:"";position:absolute;left:0;right:0;height:18%;background:linear-gradient(transparent,rgba(255,255,255,.06),transparent);animation:pk-band 6s linear infinite}
@keyframes pk-band{from{top:-20%}to{top:110%}}
.pk-dith{position:absolute;inset:0;opacity:var(--pk-fxa);background:repeating-conic-gradient(#000 0 25%,transparent 0 50%) 0 0/3px 3px}
.pk-scroll{position:absolute;inset:0;z-index:2;overflow-y:auto;overflow-x:hidden;display:flex;flex-direction:column;align-items:center;padding:52px 16px 40px;scrollbar-width:none}
.pk-scroll::-webkit-scrollbar{display:none}
.pk-s:empty{display:none}
.pk-card{position:relative;width:100%;max-width:var(--pk-w);margin:auto 0;padding:28px 20px 22px;border-radius:var(--pk-radius);background:rgba(var(--pk-card-rgb),var(--pk-card-a));-webkit-backdrop-filter:blur(var(--pk-card-blur));backdrop-filter:blur(var(--pk-card-blur));border:1px solid transparent}
.pk[data-border=solid] .pk-card{border-color:var(--pk-border)}
.pk[data-border=glow] .pk-card{border-color:color-mix(in srgb,var(--pk-accent) 60%,transparent);box-shadow:0 0 34px color-mix(in srgb,var(--pk-accent) 30%,transparent)}
.pk[data-border=animated] .pk-card::before{content:"";position:absolute;inset:-1px;border-radius:inherit;padding:1px;pointer-events:none;background:conic-gradient(from var(--pk-a,0deg),transparent 0 62%,var(--pk-accent) 82%,transparent);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:pk-spin-a 4s linear infinite}
@property --pk-a{syntax:"<angle>";inherits:false;initial-value:0deg}
@keyframes pk-spin-a{to{--pk-a:360deg}}
.pk[data-cardgrad="1"] .pk-card{background:linear-gradient(160deg,rgba(var(--pk-card-rgb),var(--pk-card-a)),color-mix(in srgb,var(--pk-accent) 22%,transparent))}
.pk-head{display:flex;flex-direction:column;align-items:center}
.pk-av{position:relative;width:var(--pk-av);height:var(--pk-av);border-radius:50%;background:#1a1a1a;display:grid;place-items:center;flex-shrink:0;font:700 calc(var(--pk-av)*.38)/1 var(--pk-name-font);color:#fff}
.pk-av img{width:100%;height:100%;object-fit:cover;border-radius:inherit;display:block}
.pk[data-avshape=rounded] .pk-av{border-radius:26%}
.pk[data-avshape=square] .pk-av{border-radius:6px}
.pk[data-avshape=hex] .pk-av,.pk[data-avshape=hex] .pk-av img{border-radius:0;clip-path:polygon(25% 3%,75% 3%,100% 50%,75% 97%,25% 97%,0 50%)}
.pk[data-avring=solid] .pk-av{box-shadow:0 0 0 3px var(--pk-accent)}
.pk[data-avring=glow] .pk-av{box-shadow:0 0 0 2px var(--pk-accent),0 0 32px color-mix(in srgb,var(--pk-accent) 70%,transparent)}
.pk[data-avring=spin] .pk-av::after{content:"";position:absolute;inset:-8px;border-radius:50%;border:1.5px dashed var(--pk-accent);animation:pk-spin 18s linear infinite}
@keyframes pk-spin{to{transform:rotate(360deg)}}
.pk-name-wrap{margin-top:14px;max-width:100%}
.pk-name{position:relative;display:inline-block;font:700 calc(26px*var(--pk-name-scale))/1.08 var(--pk-name-font);letter-spacing:var(--pk-name-ls);overflow-wrap:anywhere}
.pk[data-upper="1"] .pk-name{text-transform:uppercase}
.pk-name.fx-glow,.pk[data-gname="1"] .pk-name{text-shadow:0 0 18px color-mix(in srgb,var(--pk-accent) 80%,transparent),0 0 2px var(--pk-text)}
.pk-name.fx-gradient{background:linear-gradient(90deg,var(--pk-g1),var(--pk-g2));-webkit-background-clip:text;background-clip:text;color:transparent}
.pk-name.fx-rainbow{background:linear-gradient(90deg,#ff5f6d,#ffc371,#47e891,#3bb3ff,#b56bff,#ff5f6d);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:pk-rb 4s linear infinite}
@keyframes pk-rb{to{background-position:200% 0}}
.pk-name.fx-outline{color:transparent;-webkit-text-stroke:1px var(--pk-text)}
.pk-name.fx-glitch::before,.pk-name.fx-glitch::after{content:attr(data-text);position:absolute;left:0;top:0;width:100%;clip-path:inset(0 0 100% 0)}
.pk-name.fx-glitch::before{color:var(--pk-accent);transform:translateX(-2px);animation:pk-gl 2.4s steps(1) infinite}
.pk-name.fx-glitch::after{color:var(--pk-muted);transform:translateX(2px);animation:pk-gl 3.1s steps(1) infinite reverse}
@keyframes pk-gl{0%,84%{clip-path:inset(0 0 100% 0)}86%{clip-path:inset(12% 0 58% 0)}90%{clip-path:inset(54% 0 18% 0)}94%{clip-path:inset(78% 0 4% 0)}97%{clip-path:inset(30% 0 40% 0)}}
.pk-spark{position:absolute;width:8px;height:8px;color:var(--pk-accent);pointer-events:none;animation:pk-sp 1.8s ease-in-out infinite}
.pk-spark::before{content:"";position:absolute;inset:0;background:currentColor;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%)}
@keyframes pk-sp{0%,100%{transform:scale(0) rotate(0);opacity:0}50%{transform:scale(1) rotate(90deg);opacity:1}}
.pk-caret{display:inline-block;width:2px;height:.9em;margin-left:2px;vertical-align:-.08em;background:currentColor;animation:pk-blink 1s steps(1) infinite}
@keyframes pk-blink{50%{opacity:0}}
.pk-handle{margin-top:4px;font-size:13px;color:var(--pk-muted)}
.pk-badges{display:flex;gap:6px;justify-content:center;margin-top:9px}
.pk-badge{position:relative;width:24px;height:24px;display:grid;place-items:center;border-radius:7px;background:var(--pk-surface);border:1px solid var(--pk-border);color:var(--pk-accent)}
.pk[data-gbadges="1"] .pk-badge{box-shadow:0 0 12px color-mix(in srgb,var(--pk-accent) 50%,transparent)}
.pk-badge:hover::after{content:attr(data-tip);position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);white-space:nowrap;font-size:11px;padding:4px 8px;border-radius:6px;background:var(--pk-text);color:#000}
.pk-bio{margin-top:12px;font-size:14px;opacity:.88;white-space:pre-wrap;overflow-wrap:anywhere;min-height:1.4em}
.pk-meta{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:10px;font-size:12px;color:var(--pk-muted)}
.pk-meta span{display:inline-flex;align-items:center;gap:5px}
.pk-soc{display:flex;flex-wrap:wrap;gap:8px;justify-content:var(--pk-soc-align,center);margin-top:16px}
.pk-soc a{width:var(--pk-soc);height:var(--pk-soc);display:grid;place-items:center;border-radius:50%;transition:transform .2s}
.pk-soc a:hover{transform:translateY(-2px)}
.pk-soc i{width:48%;height:48%;background:var(--pk-icon);-webkit-mask:var(--ico) center/contain no-repeat;mask:var(--ico) center/contain no-repeat}
.pk[data-soc=brand] .pk-soc i{background:var(--brand)}
.pk[data-soc=outline] .pk-soc a{border:1px solid var(--pk-border)}
.pk[data-soc=filled] .pk-soc a{background:var(--pk-surface);border:1px solid var(--pk-border)}
.pk[data-soc=glow] .pk-soc i,.pk[data-gsoc="1"] .pk-soc i{filter:drop-shadow(0 0 6px var(--pk-icon))}
.pk-links{display:flex;flex-direction:column;gap:10px;margin-top:18px}
.pk-link{position:relative;overflow:hidden;min-height:50px;display:flex;align-items:center;justify-content:var(--pk-link-align,center);gap:10px;padding:10px 16px;font-size:14px;font-weight:500;text-decoration:none;background:var(--btn-bg);color:var(--btn-fg)!important;border:var(--btn-border);border-radius:var(--btn-radius);box-shadow:var(--btn-shadow);-webkit-backdrop-filter:var(--btn-blur,none);backdrop-filter:var(--btn-blur,none);transition:transform .2s,box-shadow .2s,filter .2s}
.pk-link img{width:18px;height:18px;border-radius:4px;flex-shrink:0}
.pk[data-hover=lift] .pk-link:hover{transform:translateY(-2px)}
.pk[data-hover=grow] .pk-link:hover{transform:scale(1.025)}
.pk[data-hover=glow] .pk-link:hover,.pk[data-glinks="1"] .pk-link{box-shadow:0 0 22px color-mix(in srgb,var(--pk-accent) 45%,transparent)}
.pk[data-hover=shine] .pk-link::after{content:"";position:absolute;top:0;bottom:0;width:40%;left:-60%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.35),transparent);transition:left .6s}
.pk[data-hover=shine] .pk-link:hover::after{left:120%}
.pk-w{display:flex;align-items:center;gap:12px;margin-top:12px;padding:11px 12px;border-radius:14px;background:var(--pk-surface);border:1px solid var(--pk-border);text-align:left;font-size:13px;text-decoration:none}
.pk-w .pic{position:relative;width:44px;height:44px;border-radius:10px;background:#222;flex-shrink:0;overflow:visible}
.pk-w .pic img{width:100%;height:100%;border-radius:inherit;object-fit:cover;display:block}
.pk-w .txt{flex:1;min-width:0}
.pk-w b{display:block;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pk-w small{display:block;color:var(--pk-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pk-w .tag{font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--pk-accent)}
.pk-dot{position:absolute;right:-3px;bottom:-3px;width:13px;height:13px;border-radius:50%;border:3px solid var(--pk-surface);background:#777}
.pk-dot.online{background:#3ba55d}.pk-dot.idle{background:#faa61a}.pk-dot.dnd{background:#ed4245}
.pk-eq{display:flex;align-items:flex-end;gap:2px;height:16px}
.pk-eq i{width:3px;height:100%;background:var(--pk-accent);transform-origin:bottom;animation:pk-eq 1s ease-in-out infinite alternate}
.pk-eq i:nth-child(2){animation-delay:-.3s}.pk-eq i:nth-child(3){animation-delay:-.6s}
@keyframes pk-eq{0%{transform:scaleY(.2)}100%{transform:scaleY(1)}}
.pk-player .play{width:34px;height:34px;border-radius:50%;border:0;background:var(--pk-accent);color:#000;display:grid;place-items:center;cursor:pointer;flex-shrink:0}
.pk-player .bar{height:3px;border-radius:3px;background:var(--pk-border);margin-top:6px;overflow:hidden}
.pk-player .bar i{display:block;height:100%;width:0;background:var(--pk-accent)}
.pk-player input[type=range]{width:64px;accent-color:var(--pk-accent)}
.pk-embed{margin-top:12px;border-radius:12px;overflow:hidden;background:var(--pk-surface)}
.pk-embed iframe{display:block;width:100%;border:0}
.pk-topic img{width:100%;max-height:220px;object-fit:cover;border-radius:10px;margin-top:8px;display:block}
.pk-tags{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:16px}
.pk-tags span{font-size:11px;padding:3px 9px;border-radius:99px;border:1px solid var(--pk-border);color:var(--pk-muted)}
.pk-banner{height:110px;margin:-28px -20px 0;border-radius:var(--pk-radius) var(--pk-radius) 0 0;background:var(--pk-banner);background-size:cover;background-position:center}
.pk[data-layout=banner] .pk-head{margin-top:calc(var(--pk-av)*-.5)}
.pk[data-layout=left] .pk-card{text-align:left}
.pk[data-layout=left] .pk-head{flex-direction:row;align-items:center;gap:16px}
.pk[data-layout=left] .pk-name-wrap{margin-top:0}
.pk[data-layout=left] .pk-meta,.pk[data-layout=left] .pk-badges,.pk[data-layout=left] .pk-tags{justify-content:flex-start}
.pk[data-layout=minimal] .pk-card{background:none;border-color:transparent!important;box-shadow:none;-webkit-backdrop-filter:none;backdrop-filter:none}
.pk[data-layout=minimal] .pk-card::before{display:none}
.pk[data-layout=minimal] .pk-name{font-size:calc(38px*var(--pk-name-scale))}
.pk[data-layout=terminal] .pk-card{text-align:left;font-family:var(--pk-body-font)}
.pk[data-layout=terminal] .pk-head{align-items:flex-start}
.pk[data-layout=terminal] .pk-av{display:none}
.pk[data-layout=terminal] .pk-name::before{content:"> ";color:var(--pk-muted)}
.pk[data-layout=terminal] .pk-bio::before{content:"$ cat bio\\A";white-space:pre;color:var(--pk-muted)}
.pk[data-layout=terminal] .pk-meta,.pk[data-layout=terminal] .pk-badges,.pk[data-layout=terminal] .pk-tags{justify-content:flex-start}
.pk[data-layout=terminal] .pk-link{justify-content:flex-start;font-family:var(--pk-body-font)}
.pk[data-layout=terminal] .pk-link::before{content:"→ ";opacity:.7}
.pk-enter{position:absolute;inset:0;z-index:6;display:grid;place-items:center;border:0;cursor:pointer;color:var(--pk-text);font:500 14px var(--pk-body-font);letter-spacing:.1em;background:rgba(0,0,0,.45);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);transition:opacity .7s}
.pk-enter span{animation:pk-breathe 2.4s ease-in-out infinite}
@keyframes pk-breathe{50%{opacity:.35}}
.pk-enter[data-style=fade]{background:rgba(0,0,0,.85);-webkit-backdrop-filter:none;backdrop-filter:none}
.pk-enter[data-style=pixel]{background:#000;-webkit-backdrop-filter:none;backdrop-filter:none}
.pk-enter.out{opacity:0;pointer-events:none}
.pk-enter[data-style=pixel].out{opacity:1;animation:pk-pixout .6s steps(1,end) forwards}
@keyframes pk-pixout{0%{-webkit-mask:conic-gradient(#000 0 75%,transparent 0) 0 0/16px 16px;mask:conic-gradient(#000 0 75%,transparent 0) 0 0/16px 16px}25%{-webkit-mask:repeating-conic-gradient(#000 0 25%,transparent 0 50%) 0 0/16px 16px;mask:repeating-conic-gradient(#000 0 25%,transparent 0 50%) 0 0/16px 16px}50%{-webkit-mask:conic-gradient(#000 0 25%,transparent 0) 0 0/16px 16px;mask:conic-gradient(#000 0 25%,transparent 0) 0 0/16px 16px}75%{-webkit-mask:conic-gradient(#000 0 25%,transparent 0) 4px 4px/24px 24px;mask:conic-gradient(#000 0 25%,transparent 0) 4px 4px/24px 24px}100%{visibility:hidden}}
.pk-card.in-pixel{animation:pk-pixin .6s steps(1,end) both}
@keyframes pk-pixin{0%{-webkit-mask:linear-gradient(transparent,transparent);mask:linear-gradient(transparent,transparent)}20%{-webkit-mask:conic-gradient(#000 0 25%,transparent 0) 0 0/16px 16px;mask:conic-gradient(#000 0 25%,transparent 0) 0 0/16px 16px}40%{-webkit-mask:repeating-conic-gradient(#000 0 25%,transparent 0 50%) 0 0/16px 16px;mask:repeating-conic-gradient(#000 0 25%,transparent 0 50%) 0 0/16px 16px}60%{-webkit-mask:conic-gradient(#000 0 75%,transparent 0) 0 0/16px 16px;mask:conic-gradient(#000 0 75%,transparent 0) 0 0/16px 16px}80%{-webkit-mask:repeating-conic-gradient(#000 0 25%,transparent 0 50%) 0 0/4px 4px;mask:repeating-conic-gradient(#000 0 25%,transparent 0 50%) 0 0/4px 4px}100%{-webkit-mask:none;mask:none}}
.pk-card.in-fade{animation:pk-fade .8s ease both}
@keyframes pk-fade{from{opacity:0}}
.pk-card.in-pop{animation:pk-pop .55s cubic-bezier(.2,1.4,.4,1) both}
@keyframes pk-pop{from{opacity:0;transform:scale(.92)}}
.pk-card.in-glitch{animation:pk-glin .5s steps(1,end) both}
@keyframes pk-glin{0%{opacity:0}20%{opacity:1;transform:translate(-6px,2px);clip-path:inset(20% 0 40% 0)}40%{transform:translate(5px,-2px);clip-path:inset(60% 0 10% 0)}60%{transform:translate(-3px,0);clip-path:inset(0 0 70% 0)}80%{transform:translate(2px,1px);clip-path:inset(40% 0 0 0)}100%{transform:none;clip-path:none}}
.pk-trail{position:absolute;z-index:7;pointer-events:none;width:8px;height:8px;margin:-4px 0 0 -4px;border-radius:50%;background:var(--pk-accent)}
.pk-trail.sparkle{border-radius:0;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%)}
.pk-trail.ghost{width:22px;height:22px;margin:-11px 0 0 -11px;background:none;border:1px solid var(--pk-accent)}
@media (prefers-reduced-motion:reduce){.pk *,.pk *::before,.pk *::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}}
`;
function injectStyle() {
  if (document.getElementById("pk-style")) return;
  const s = document.createElement("style");
  s.id = "pk-style";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/* ---------- Canvas effects ---------- */

const KINDS = {
  snow: { n: 80, make: (W, H, init) => ({ x: R(0, W), y: init ? R(0, H) : -8, r: R(1, 3.2), vy: R(.35, 1.1), vx: R(-.25, .25), p: R(0, 6.3) }),
    step: (o, W, H, t) => { o.y += o.vy; o.x += o.vx + Math.sin(t / 900 + o.p) * .3; return o.y < H + 8; },
    draw: (c, o) => { c.globalAlpha = .8; c.beginPath(); c.arc(o.x, o.y, o.r, 0, 6.283); c.fill(); } },
  rain: { n: 120, make: (W, H, init) => ({ x: R(-60, W), y: init ? R(0, H) : R(-H * .3, 0), l: R(8, 18), v: R(7, 13) }),
    step: (o, W, H) => { o.y += o.v; o.x += o.v * .18; return o.y < H + 20; },
    draw: (c, o) => { c.globalAlpha = .4; c.beginPath(); c.moveTo(o.x, o.y); c.lineTo(o.x - o.l * .18, o.y - o.l); c.stroke(); } },
  stars: { n: 90, make: (W, H) => ({ x: R(0, W), y: R(0, H), r: R(.5, 1.6), p: R(0, 6.3), s: R(.6, 2) }),
    step: () => true,
    draw: (c, o, t) => { c.globalAlpha = .25 + .75 * Math.abs(Math.sin(t / 1000 * o.s + o.p)); c.fillRect(o.x, o.y, o.r * 1.6, o.r * 1.6); } },
  hearts: { n: 26, make: (W, H, init) => ({ x: R(0, W), y: init ? R(0, H) : H + 16, s: R(5, 11), v: R(.3, .9), p: R(0, 6.3) }),
    step: (o, W, H, t) => { o.y -= o.v; o.x += Math.sin(t / 800 + o.p) * .4; return o.y > -20; },
    draw: (c, o) => { const s = o.s; c.globalAlpha = .7; c.beginPath(); c.moveTo(o.x, o.y + s * .35); c.bezierCurveTo(o.x, o.y, o.x - s, o.y, o.x - s, o.y + s * .45); c.bezierCurveTo(o.x - s, o.y + s * .95, o.x, o.y + s * 1.1, o.x, o.y + s * 1.5); c.bezierCurveTo(o.x, o.y + s * 1.1, o.x + s, o.y + s * .95, o.x + s, o.y + s * .45); c.bezierCurveTo(o.x + s, o.y, o.x, o.y, o.x, o.y + s * .35); c.fill(); } }
};

function canvasEffect(host, kind, color, intensity) {
  const cv = document.createElement("canvas");
  host.appendChild(cv);
  const c = cv.getContext("2d");
  const k = KINDS[kind];
  const mul = .25 + intensity / 100;
  let W = 1, H = 1, items = [], raf = 0, on = false, cols = [], last = 0;
  const GL = "アイウエオカキクケコサシスセソ0123456789ABCDEF@#$%";
  function size() {
    const r = host.getBoundingClientRect();
    W = cv.width = Math.max(1, Math.round(r.width));
    H = cv.height = Math.max(1, Math.round(r.height));
    if (k) items = Array.from({ length: Math.round(k.n * mul) }, () => k.make(W, H, true));
    if (kind === "particles") items = Array.from({ length: Math.min(80, Math.round(45 * mul)) }, () => ({ x: R(0, W), y: R(0, H), vx: R(-.3, .3), vy: R(-.3, .3) }));
    if (kind === "matrix") cols = Array.from({ length: Math.ceil(W / 14) }, () => ({ y: R(-H, 0), v: R(2, 5), len: Math.round(R(8, 22)), ch: [] }));
  }
  function frame(now) {
    c.clearRect(0, 0, W, H);
    c.fillStyle = c.strokeStyle = color;
    c.lineWidth = 1;
    if (k) {
      for (let i = 0; i < items.length; i++) {
        if (!k.step(items[i], W, H, now)) items[i] = k.make(W, H, false);
        k.draw(c, items[i], now);
      }
    } else if (kind === "particles") {
      for (const p of items) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1; }
      for (let i = 0; i < items.length; i++) {
        const a = items[i];
        c.globalAlpha = .8; c.fillRect(a.x - 1, a.y - 1, 2, 2);
        for (let j = i + 1; j < items.length; j++) {
          const b = items[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
          if (d < 12000) { c.globalAlpha = (1 - d / 12000) * .35; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); }
        }
      }
    } else if (kind === "matrix") {
      c.font = "13px monospace";
      if (now - last > 50) {
        last = now;
        cols.forEach(col => { col.y += col.v * 3; if (col.y - col.len * 14 > H) { col.y = R(-200, 0); col.len = Math.round(R(8, 22)); } col.ch.unshift(GL[(Math.random() * GL.length) | 0]); col.ch.length = col.len; });
      }
      cols.forEach((col, x) => col.ch.forEach((ch, i) => { const y = col.y - i * 14; if (y < -14 || y > H + 14) return; c.globalAlpha = i === 0 ? 1 : (1 - i / col.len) * .55; c.fillText(ch || "", x * 14, y); }));
    }
    c.globalAlpha = 1;
    if (on) raf = requestAnimationFrame(frame);
  }
  const ro = typeof ResizeObserver === "function" ? new ResizeObserver(() => size()) : null;
  ro && ro.observe(host);
  size();
  frame(performance.now());
  return {
    play() { if (on || reduceMotion()) return; on = true; raf = requestAnimationFrame(frame); },
    pause() { on = false; cancelAnimationFrame(raf); },
    stop() { on = false; cancelAnimationFrame(raf); ro && ro.disconnect(); cv.remove(); }
  };
}

function mountEffect(host, a) {
  host.replaceChildren();
  host.style.setProperty("--pk-fxc", a.effectColor);
  const amt = a.intensity / 100;
  const css = { lava: ["pk-lava", 4, .04 + amt * .26], aurora: ["pk-aurora", 3, .12 + amt * .5], noise: ["pk-noise", 0, .03 + amt * .22], scanlines: ["pk-scan", 0, .2 + amt * .7], dither: ["pk-dith", 0, .1 + amt * .55] }[a.effect];
  if (css) {
    const d = el("div", css[0]);
    for (let i = 0; i < css[1]; i++) d.appendChild(el("i"));
    d.style.position = "absolute"; d.style.inset = "0";
    host.style.setProperty("--pk-fxa", css[2].toFixed(3));
    host.appendChild(d);
    return { play() {}, pause() {}, stop() { d.remove(); } };
  }
  if (a.effect === "none") return { play() {}, pause() {}, stop() {} };
  return canvasEffect(host, a.effect, a.effectColor, a.intensity);
}

/* ---------- Widgets (cached per id so live edits do not refetch) ---------- */

const cache = new Map();
function cached(key, ttl, fn) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.t < ttl) return hit.p;
  const p = fn().catch(e => { cache.delete(key); throw e; });
  cache.set(key, { t: Date.now(), p });
  return p;
}
const getJSON = url => fetch(url).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); });

function widgetShell(href) {
  const w = el(href ? "a" : "div", "pk-w");
  if (href) { w.href = href; w.target = "_blank"; w.rel = "noopener noreferrer"; }
  const pic = el("div", "pic"), txt = el("div", "txt");
  w.append(pic, txt);
  return { w, pic, txt };
}
function setLines(txt, tag, title, sub) {
  txt.replaceChildren();
  if (tag) txt.appendChild(el("span", "tag", tag));
  txt.appendChild(el("b", null, title));
  if (sub) txt.appendChild(el("small", null, sub));
}
function setPic(pic, url) {
  pic.querySelector("img")?.remove();
  const u = safeUrl(url);
  if (!u) return;
  const img = el("img"); img.src = u; img.alt = ""; img.loading = "lazy";
  pic.prepend(img);
}

function discordWidget(id) {
  const { w, pic, txt } = widgetShell(null);
  setLines(txt, "discord", "Carico lo stato…", "");
  cached("ly:" + id, 30000, () => getJSON(`https://api.lanyard.rest/v1/users/${id}`)).then(j => {
    if (!j.success) throw new Error("lanyard");
    const d = j.data, u = d.discord_user || {};
    setPic(pic, u.avatar ? `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png?size=96` : "");
    const dot = el("span", "pk-dot " + (d.discord_status || "offline")); pic.appendChild(dot);
    let sub = { online: "online", idle: "assente", dnd: "non disturbare", offline: "offline" }[d.discord_status] || "";
    const custom = (d.activities || []).find(a => a.type === 4);
    const game = (d.activities || []).find(a => a.type === 0);
    if (d.listening_to_spotify && d.spotify) sub = `ascolta ${d.spotify.song} · ${d.spotify.artist}`;
    else if (game) sub = `gioca a ${game.name}`;
    else if (custom && custom.state) sub = custom.state;
    setLines(txt, "discord", u.global_name || u.username || "Discord", sub);
  }).catch(() => setLines(txt, "discord", "Stato non disponibile", "Entra nel server di Lanyard per mostrarlo"));
  return w;
}

function githubWidget(user) {
  const { w, pic, txt } = widgetShell(`https://github.com/${user}`);
  setLines(txt, "github", user, "");
  cached("gh:" + user, 600000, () => getJSON(`https://api.github.com/users/${user}`)).then(g => {
    setPic(pic, g.avatar_url);
    setLines(txt, "github", g.name || g.login, `${g.public_repos} repo · ${g.followers} follower`);
  }).catch(() => {});
  return w;
}

function lastfmWidget(user) {
  const { w, pic, txt } = widgetShell(`https://www.last.fm/user/${user}`);
  setLines(txt, "last.fm", user, "Ascolti recenti su Last.fm");
  if (!LASTFM_API_KEY) return w;
  cached("lf:" + user, 30000, () => getJSON(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(user)}&api_key=${LASTFM_API_KEY}&format=json&limit=1`)).then(j => {
    const t = j?.recenttracks?.track?.[0];
    if (!t) return;
    const now = t["@attr"]?.nowplaying === "true";
    setPic(pic, (t.image || []).slice(-1)[0]?.["#text"]);
    setLines(txt, now ? "in ascolto ora" : "ultimo ascolto", t.name, t.artist?.["#text"] || "");
    if (now) { const eq = el("div", "pk-eq"); eq.innerHTML = "<i></i><i></i><i></i>"; w.appendChild(eq); }
  }).catch(() => {});
  return w;
}

function audioPlayer(src, title, volume, onReady) {
  const { w, pic, txt } = widgetShell(null);
  w.classList.add("pk-player");
  pic.innerHTML = svg('<path d="M9 18V6l11-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>', 20);
  pic.style.display = "grid"; pic.style.placeItems = "center"; pic.style.color = "var(--pk-accent)";
  setLines(txt, "musica", title || "La mia canzone", "");
  const bar = el("div", "bar"); bar.appendChild(el("i")); txt.appendChild(bar);
  const audio = new Audio(); audio.src = src; audio.loop = true; audio.preload = "none"; audio.volume = volume / 100;
  const play = el("button", "play"); play.type = "button"; play.setAttribute("aria-label", "Riproduci");
  const icon = () => { play.innerHTML = audio.paused ? svg('<path d="M7 4v16l13-8z"/>', 12, true) : svg('<path d="M6 4h4v16H6zM14 4h4v16h-4z"/>', 12, true); play.setAttribute("aria-label", audio.paused ? "Riproduci" : "Pausa"); };
  play.addEventListener("click", () => { audio.paused ? audio.play().catch(() => {}) : audio.pause(); });
  audio.addEventListener("play", icon); audio.addEventListener("pause", icon);
  audio.addEventListener("timeupdate", () => { if (audio.duration) bar.firstChild.style.width = (audio.currentTime / audio.duration * 100) + "%"; });
  const vol = el("input"); vol.type = "range"; vol.min = 0; vol.max = 100; vol.value = volume; vol.setAttribute("aria-label", "Volume");
  vol.addEventListener("input", () => { audio.volume = vol.value / 100; });
  icon();
  w.append(vol, play);
  onReady && onReady(audio);
  return { node: w, audio };
}

function embed(info, title) {
  const box = el("div", "pk-embed");
  const f = el("iframe");
  f.src = info.src; f.height = info.height; f.loading = "lazy"; f.title = title;
  f.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
  f.referrerPolicy = "strict-origin-when-cross-origin";
  box.appendChild(f);
  return box;
}

/* ---------- Mount ---------- */

/*
  mountProfile(root, profile, opts) draws a profile into root and returns { update, destroy, enter }.
  opts.preview: dashboard/landing mode (no autoplay, links open safely, splash can be reopened).
*/
export function mountProfile(root, input, opts = {}) {
  injectStyle();
  const o = { preview: false, entrance: true, ...opts };
  root.classList.add("pk");
  root.innerHTML = '<div class="pk-bg"></div><div class="pk-dim"></div><div class="pk-fx"></div><div class="pk-scroll"><article class="pk-card"></article></div>';
  const bgEl = root.querySelector(".pk-bg"), fxEl = root.querySelector(".pk-fx"), card = root.querySelector(".pk-card");
  const SLOTS = ["banner", "head", "badges", "bio", "meta", "soctop", "widgets", "music", "topic", "links", "socbot", "tags"];
  const slot = Object.fromEntries(SLOTS.map(n => { const d = el("div", "pk-s pk-s-" + n); card.appendChild(d); return [n, d]; }));
  // Replaces a slot's children only when they actually differ, so live iframes stay put.
  const fill = (name, nodes) => {
    const box = slot[name], cur = [...box.childNodes];
    if (cur.length === nodes.length && cur.every((n, i) => n === nodes[i])) return;
    box.replaceChildren(...nodes);
  };
  const st = { bgKey: "", fxKey: "", fx: null, timers: [], keyed: new Map(), entered: false, first: true, audio: null, enterEl: null, trail: null, visible: true, last: input };
  const later = (fn, ms) => { const t = setTimeout(fn, ms); st.timers.push(t); return t; };
  const every = (fn, ms) => { const t = setInterval(fn, ms); st.timers.push(t); return t; };

  const io = typeof IntersectionObserver === "function" ? new IntersectionObserver(([e]) => { st.visible = e.isIntersecting; syncFx(); }) : null;
  io && io.observe(root);
  const onVis = () => syncFx();
  document.addEventListener("visibilitychange", onVis);
  function syncFx() { if (!st.fx) return; st.visible && !document.hidden ? st.fx.play() : st.fx.pause(); }

  function keyedNode(key, make) {
    const hit = st.keyed.get(key);
    if (hit) { hit.used = true; return hit.node; }
    const node = make();
    st.keyed.set(key, { node, used: true });
    return node;
  }

  function render(input) {
    st.last = input;
    const p = normalizeProfile(input);
    const a = p.appearance;
    st.timers.forEach(t => { clearTimeout(t); clearInterval(t); });
    st.timers = [];
    st.keyed.forEach(v => { v.used = false; });
    ensureFonts([a.font.name, a.font.body]);

    // Tokens
    const c = a.colors, s = root.style;
    s.setProperty("--pk-accent", c.accent); s.setProperty("--pk-text", c.text); s.setProperty("--pk-muted", c.muted);
    s.setProperty("--pk-icon", c.icon); s.setProperty("--pk-surface", c.secondary); s.setProperty("--pk-border", c.border);
    s.setProperty("--pk-card-rgb", hexRgb(c.primary)); s.setProperty("--pk-card-a", (a.card.opacity / 100).toFixed(2));
    s.setProperty("--pk-card-blur", a.card.blur + "px"); s.setProperty("--pk-radius", a.card.radius + "px"); s.setProperty("--pk-w", a.card.width + "px");
    s.setProperty("--pk-name-font", FONT[a.font.name][2]); s.setProperty("--pk-body-font", FONT[a.font.body][2]);
    s.setProperty("--pk-name-scale", (a.font.nameSize / 100).toFixed(2)); s.setProperty("--pk-name-ls", (a.font.spacing / 100) + "em");
    s.setProperty("--pk-av", a.avatar.size + "px"); s.setProperty("--pk-soc", a.socialsStyle.size + "px");
    s.setProperty("--pk-soc-align", { left: "flex-start", center: "center", right: "flex-end" }[a.socialsStyle.align]);
    s.setProperty("--pk-link-align", a.buttons.align === "left" ? "flex-start" : "center");
    s.setProperty("--pk-g1", a.nameGradient[0]); s.setProperty("--pk-g2", a.nameGradient[1]);
    s.setProperty("--pk-dim", (a.bg.dim / 100).toFixed(2)); s.setProperty("--pk-bgblur", a.bg.blur + "px");
    const ds = root.dataset;
    ds.layout = a.layout; ds.border = a.card.border; ds.cardgrad = a.card.gradient ? "1" : "0"; ds.avshape = a.avatar.shape; ds.avring = a.avatar.ring;
    ds.upper = a.font.upper ? "1" : "0"; ds.soc = a.socialsStyle.style; ds.hover = a.buttons.hover;
    ds.gname = a.glow.username ? "1" : "0"; ds.gsoc = a.glow.socials ? "1" : "0"; ds.gbadges = a.glow.badges ? "1" : "0"; ds.glinks = a.glow.links ? "1" : "0";
    applyButtons(s, a);
    root.style.cursor = a.cursor.type === "crosshair" ? "crosshair" : a.cursor.type === "custom" && a.cursor.url ? `url("${a.cursor.url.replace(/"/g, "%22")}") 4 4, auto` : "";

    // Background (rebuilt only when it changes)
    const bgKey = JSON.stringify(a.bg);
    if (bgKey !== st.bgKey) {
      st.bgKey = bgKey;
      bgEl.replaceChildren();
      bgEl.dataset.fit = a.bg.fit;
      root.style.background = a.bg.color;
      const g = a.bg.gradient;
      const grad = g.kind === "radial" ? `radial-gradient(circle at 50% 30%, ${g.stops.join(",")})` : g.kind === "conic" ? `conic-gradient(from ${g.angle}deg at 50% 50%, ${g.stops.join(",")}, ${g.stops[0]})` : `linear-gradient(${g.angle}deg, ${g.stops.join(",")})`;
      if (a.bg.type === "gradient") bgEl.style.background = grad; else bgEl.style.background = "";
      if (a.bg.type === "image" && a.bg.image) {
        if (a.bg.fit === "tile") { const t = el("div", "pk-tile"); t.style.backgroundImage = `url("${a.bg.image.replace(/"/g, "%22")}")`; bgEl.appendChild(t); }
        else { const img = el("img"); img.src = a.bg.image; img.alt = ""; img.decoding = "async"; bgEl.appendChild(img); }
      }
      if (a.bg.type === "video" && a.bg.video) {
        const v = el("video"); v.src = a.bg.video; v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true; v.setAttribute("playsinline", "");
        bgEl.appendChild(v); v.play().catch(() => {});
      }
      root.style.setProperty("--pk-banner", a.bg.type === "image" && a.bg.image ? `url("${a.bg.image.replace(/"/g, "%22")}") center/cover` : a.bg.type === "gradient" ? grad : `linear-gradient(135deg, ${c.accent}, ${c.primary})`);
    }
    root.querySelector(".pk-dim").style.display = a.bg.type === "image" || a.bg.type === "video" ? "" : "none";

    // Effect (restarted only when it changes)
    const fxKey = `${a.effect}|${a.effectColor}|${a.intensity}`;
    if (fxKey !== st.fxKey) {
      st.fxKey = fxKey;
      st.fx && st.fx.stop();
      st.fx = mountEffect(fxEl, a);
      syncFx();
    }

    // Card content, slot by slot
    fill("banner", a.layout === "banner" ? [el("div", "pk-banner")] : []);
    const head = el("div", "pk-head");
    if (a.avatar.show) {
      const av = el("div", "pk-av");
      if (p.avatarUrl) { const img = el("img"); img.src = p.avatarUrl; img.alt = ""; av.appendChild(img); }
      else av.textContent = p.handle[0].toUpperCase();
      head.appendChild(av);
    }
    const nameBox = el("div", "pk-name-wrap");
    const nameEl = el("h1", "pk-name");
    const name = p.displayName || p.handle;
    nameEl.dataset.text = name;
    nameBox.appendChild(nameEl);
    nameBox.appendChild(el("div", "pk-handle", "@" + p.handle));
    head.appendChild(nameBox);
    fill("head", [head]);
    nameText(nameEl, name, a);

    const badges = [];
    if (a.badges.show && !a.privacy.hideBadges && p.badges.length) {
      const bx = el("div", "pk-badges");
      p.badges.forEach(b => { const [tip, path] = BADGES[b]; const n = el("span", "pk-badge"); n.dataset.tip = tip; n.innerHTML = svg(path, 13); bx.appendChild(n); });
      badges.push(bx);
    }
    fill("badges", badges);

    const lines = a.bioLines.length ? a.bioLines : p.bio ? [p.bio] : [];
    if (lines.length || p.bio) {
      const bio = el("p", "pk-bio");
      if (a.bioFx === "typewriter" && lines.length && !reduceMotion()) typewriter(bio, lines, a.typeSpeed);
      else bio.textContent = p.bio || lines[0] || "";
      fill("bio", [bio]);
    } else fill("bio", []);

    const meta = el("div", "pk-meta");
    if (p.location) { const m = el("span"); m.innerHTML = svg('<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>', 12); m.append(p.location); meta.appendChild(m); }
    if (a.widgets.showViews && !a.privacy.hideViews) { const m = el("span"); m.innerHTML = svg('<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>', 12); m.append(p.views.toLocaleString("it-IT")); meta.appendChild(m); }
    if (a.widgets.clock) {
      const m = el("span"), tz = a.widgets.clock === "local" ? undefined : a.widgets.clock;
      m.innerHTML = svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', 12);
      const t = el("b"); t.style.fontWeight = "500"; m.appendChild(t); meta.appendChild(m);
      const tick = () => { try { t.textContent = new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit", timeZone: tz }); } catch (_) { t.textContent = new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }); } };
      tick(); every(tick, 15000);
    }
    fill("meta", meta.childNodes.length ? [meta] : []);

    const socials = el("div", "pk-soc");
    SOCIALS.forEach(sd => {
      const v = p.socials[sd.key];
      if (!v) return;
      const raw = String(v).trim();
      const url = /^(https?:|mailto:)/i.test(raw) ? safeLinkUrl(raw) : sd.base ? safeLinkUrl(sd.base + raw.replace(/^@/, "")) : null;
      const n = el(url ? "a" : "span");
      if (url) { n.href = url; n.target = "_blank"; n.rel = "noopener noreferrer"; }
      n.title = url ? sd.label : `${sd.label}: ${raw}`;
      n.setAttribute("aria-label", sd.label);
      const i = el("i"); i.style.setProperty("--ico", `url("${socialIcon(sd)}")`); i.style.setProperty("--brand", sd.color);
      n.appendChild(i);
      socials.appendChild(n);
    });
    const hasSocials = socials.childNodes.length > 0;
    fill("soctop", hasSocials && a.socialsStyle.position === "top" ? [socials] : []);
    fill("socbot", hasSocials && a.socialsStyle.position === "bottom" ? [socials] : []);

    const widgets = [];
    if (a.widgets.discordId) widgets.push(keyedNode("dc:" + a.widgets.discordId, () => discordWidget(a.widgets.discordId)));
    if (a.lastfm.show && a.lastfm.user) widgets.push(keyedNode("lf:" + a.lastfm.user, () => lastfmWidget(a.lastfm.user)));
    if (a.widgets.github) widgets.push(keyedNode("gh:" + a.widgets.github, () => githubWidget(a.widgets.github)));
    fill("widgets", widgets);

    const m = a.music, music = [];
    if (m.type === "spotify" && spotifyEmbed(m.url)) music.push(keyedNode("sp:" + m.url, () => embed(spotifyEmbed(m.url), "Spotify")));
    if (m.type === "soundcloud" && soundcloudEmbed(m.url)) music.push(keyedNode("sc:" + m.url, () => embed(soundcloudEmbed(m.url), "SoundCloud")));
    if (m.type === "youtube" && youtubeEmbed(m.url)) music.push(keyedNode("yt:" + m.url, () => embed(youtubeEmbed(m.url), "YouTube")));
    if (m.type === "audio" && safeUrl(m.url, true)) {
      const node = keyedNode("au:" + m.url, () => { const pl = audioPlayer(safeUrl(m.url, true), m.title, m.volume); st.audio = pl.audio; return pl.node; });
      node.style.display = m.showPlayer ? "" : "none";
      node.querySelector(".txt b").textContent = m.title || "La mia canzone";
      if (st.audio) st.audio.volume = m.volume / 100;
      music.push(node);
    } else st.audio = null;
    fill("music", music);

    const topic = currentTopic(), topicNodes = [];
    if (p.weekly && p.weekly.show && p.weekly.week === topic.id && (p.weekly.text || p.weekly.link || p.weekly.image)) {
      const href = safeLinkUrl(p.weekly.link);
      const { w, pic, txt } = widgetShell(href);
      w.classList.add("pk-topic");
      pic.innerHTML = svg('<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/>', 20);
      pic.style.display = "grid"; pic.style.placeItems = "center"; pic.style.color = "var(--pk-accent)";
      setLines(txt, "topic della settimana", topic.title, p.weekly.text);
      const img = safeUrl(p.weekly.image, true);
      if (img) { const i = el("img"); i.src = img; i.alt = ""; i.loading = "lazy"; w.style.flexWrap = "wrap"; i.style.flexBasis = "100%"; w.appendChild(i); }
      topicNodes.push(w);
    }
    fill("topic", topicNodes);

    const links = p.links.filter(l => !l.hidden && l.title && safeLinkUrl(l.url));
    if (links.length) {
      const box = el("div", "pk-links");
      links.forEach(l => {
        const url = safeLinkUrl(l.url);
        const n = el("a", "pk-link");
        n.href = url; n.target = "_blank"; n.rel = "noopener noreferrer";
        if (a.buttons.icons && /^https?:/.test(url)) {
          const ic = el("img"); ic.alt = ""; ic.loading = "lazy";
          ic.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(new URL(url).hostname)}&sz=64`;
          ic.addEventListener("error", () => ic.remove(), { once: true });
          n.appendChild(ic);
        }
        n.append(l.title);
        box.appendChild(n);
      });
      fill("links", [box]);
    } else fill("links", []);

    if (p.tags.length) {
      const tg = el("div", "pk-tags");
      p.tags.forEach(t => tg.appendChild(el("span", null, t)));
      fill("tags", [tg]);
    } else fill("tags", []);

    st.keyed.forEach((v, k) => { if (!v.used) { v.node.querySelectorAll("audio,video").forEach(x => x.pause()); st.keyed.delete(k); } });

    // Entrance (first render only) and enter splash
    if (st.first && o.entrance && a.entrance !== "none" && !reduceMotion()) {
      const cls = "in-" + a.entrance;
      card.classList.add(cls);
      later(() => card.classList.remove(cls), 1200);
    }
    st.first = false;
    if (a.enter.on && !st.entered) showEnter(a);
    else hideEnter(true);
    setupTrail(a);
  }

  function nameText(nameEl, name, a) {
    nameEl.className = "pk-name" + (a.nameFx !== "none" ? " fx-" + a.nameFx : "");
    if (a.nameFx === "typewriter" && !reduceMotion()) {
      nameEl.textContent = "";
      const caret = el("span", "pk-caret");
      nameEl.appendChild(caret);
      let i = 0;
      const chars = [...name];
      const step = () => { if (i >= chars.length) return; caret.before(chars[i++]); later(step, 90); };
      later(step, 350);
      return;
    }
    nameEl.textContent = name;
    if (a.nameFx === "shuffle" && !reduceMotion()) {
      const G = "abcdefghijklmnopqrstuvwxyz0123456789#$%&";
      const run = () => {
        const chars = [...name], start = performance.now();
        const tick = () => {
          const p = Math.min(1, (performance.now() - start) / 700);
          nameEl.textContent = chars.map((ch, i) => (i / chars.length < p || ch === " ") ? ch : G[(Math.random() * G.length) | 0]).join("");
          if (p < 1) later(tick, 40);
        };
        tick();
      };
      run();
      nameEl.onmouseenter = run;
    }
    if (a.nameFx === "sparkle" && !reduceMotion()) {
      for (let i = 0; i < 4; i++) {
        const sp = el("span", "pk-spark");
        sp.style.left = R(-6, 100) + "%"; sp.style.top = R(-30, 90) + "%";
        sp.style.animationDelay = (i * .45) + "s";
        nameEl.appendChild(sp);
      }
    }
  }

  function typewriter(node, lines, speed) {
    const text = el("span"), caret = el("span", "pk-caret");
    node.replaceChildren(text, caret);
    let li = 0, ci = 0, del = false;
    const loop = () => {
      const line = lines[li];
      if (!del) {
        text.textContent = line.slice(0, ++ci);
        if (ci >= line.length) { if (lines.length === 1) return; del = true; return later(loop, 1800); }
        return later(loop, speed);
      }
      text.textContent = line.slice(0, --ci);
      if (ci <= 0) { del = false; li = (li + 1) % lines.length; return later(loop, 300); }
      later(loop, speed / 2);
    };
    later(loop, 400);
  }

  function showEnter(a) {
    if (!st.enterEl) {
      st.enterEl = el("button", "pk-enter");
      st.enterEl.type = "button";
      st.enterEl.appendChild(el("span"));
      st.enterEl.addEventListener("click", () => {
        st.entered = true;
        st.enterEl.classList.add("out");
        if (st.audio && !o.preview && st.lastAutoplay) st.audio.play().catch(() => {});
        o.onEnter && o.onEnter();
      });
      root.appendChild(st.enterEl);
    }
    st.lastAutoplay = a.music.type === "audio" && a.music.autoplay;
    st.enterEl.dataset.style = a.enter.style;
    st.enterEl.firstChild.textContent = a.enter.text;
    st.enterEl.classList.remove("out");
  }
  function hideEnter(instant) {
    if (!st.enterEl) return;
    if (instant) { st.enterEl.remove(); st.enterEl = null; }
  }

  function setupTrail(a) {
    const want = a.cursor.trail !== "none" && finePointer() && !reduceMotion() ? a.cursor.trail : "none";
    if (st.trail && st.trail.kind === want) return;
    if (st.trail) { st.trail.stop(); st.trail = null; }
    if (want === "none") return;
    const dots = Array.from({ length: want === "ghost" ? 5 : 10 }, () => { const d = el("span", "pk-trail " + want); d.style.opacity = "0"; root.appendChild(d); return d; });
    const pts = dots.map(() => ({ x: 0, y: 0 }));
    let tx = -99, ty = -99, raf = 0, active = false;
    const move = e => { const r = root.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; if (!active) { active = true; raf = requestAnimationFrame(tick); } };
    const leave = () => { dots.forEach(d => { d.style.opacity = "0"; }); active = false; cancelAnimationFrame(raf); };
    function tick() {
      let x = tx, y = ty;
      pts.forEach((p, i) => { p.x += (x - p.x) * .35; p.y += (y - p.y) * .35; x = p.x; y = p.y; const d = dots[i]; d.style.transform = `translate(${p.x}px,${p.y}px) scale(${1 - i / dots.length})`; d.style.opacity = String((1 - i / dots.length) * .8); });
      if (active) raf = requestAnimationFrame(tick);
    }
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerleave", leave);
    st.trail = { kind: want, stop() { cancelAnimationFrame(raf); root.removeEventListener("pointermove", move); root.removeEventListener("pointerleave", leave); dots.forEach(d => d.remove()); } };
  }

  render(input);
  return {
    update: render,
    // Replays the entrance on the card, used for live transitions between looks
    replay(kind = "pixel") {
      if (reduceMotion()) return;
      ["in-pixel", "in-fade", "in-glitch", "in-pop"].forEach(c => card.classList.remove(c));
      void card.offsetWidth;
      card.classList.add("in-" + kind);
      setTimeout(() => card.classList.remove("in-" + kind), 900);
    },
    enter() { if (st.enterEl) st.enterEl.click(); },
    reopenEnter() { st.entered = false; render(st.last); },
    destroy() {
      st.timers.forEach(t => { clearTimeout(t); clearInterval(t); });
      st.fx && st.fx.stop();
      st.trail && st.trail.stop();
      io && io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      st.keyed.forEach(v => v.node.querySelectorAll("audio,video").forEach(x => x.pause()));
      if (st.audio) st.audio.pause();
      root.replaceChildren();
    }
  };
}

function applyButtons(s, a) {
  const b = a.buttons, c = a.colors;
  const pal = { white: ["#ffffff", "#000000"], silver: ["#9a9a9a", "#000000"], graphite: ["#2a2a2a", "#ffffff"], accent: [c.accent, readableOn(c.accent)], custom: [b.custom, readableOn(b.custom)] }[b.palette];
  const [col, fg] = pal;
  const v = b.variant;
  s.setProperty("--btn-bg", v === "solid" ? col : v === "glass" ? "color-mix(in srgb," + col + " 14%, transparent)" : "transparent");
  s.setProperty("--btn-fg", v === "solid" ? fg : v === "glass" ? c.text : col);
  s.setProperty("--btn-border", v === "outline" ? `1px solid ${col}` : v === "glass" ? `1px solid color-mix(in srgb, ${col} 35%, transparent)` : v === "ghost" ? "1px solid transparent" : `1px solid ${col}`);
  s.setProperty("--btn-blur", v === "glass" ? "blur(10px)" : "none");
  s.setProperty("--btn-radius", { square: "4px", rounded: "14px", pill: "999px" }[b.shape]);
  s.setProperty("--btn-shadow", { none: "none", soft: "0 8px 24px rgba(0,0,0,.35)", glow: `0 0 24px color-mix(in srgb, ${col} 45%, transparent)`, hard: `4px 4px 0 ${c.border}` }[b.shadow]);
}

// Black or white text, whichever reads better on the given colour.
export function readableOn(hex) {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return .2126 * r + .7152 * g + .0722 * b > .4 ? "#000000" : "#ffffff";
}

/* ---------- Public profile fields (what the public mirror stores) ---------- */
export function publicFields(p) {
  const n = normalizeProfile(p);
  return {
    handle: n.handle, displayName: n.displayName, bio: n.bio, tags: n.tags, location: n.location,
    avatarUrl: n.avatarUrl.startsWith("data:") ? "" : n.avatarUrl,
    links: n.links.filter(l => !l.hidden), socials: n.socials, badges: n.badges,
    weekly: n.weekly, appearance: n.appearance
  };
}
