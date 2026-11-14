import { DECO, DECO_LIST, DECO_GROUPS, DECO_GROUP_OF, DECO_IMG_BY, decoImgSrc } from "./decos.js";
/*
  18k.bio profile kit.
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

// Where a social opens: the profile page of that name, or a search for it (in the app or on the web)
const enc = encodeURIComponent;
const SOCIAL_FIND = {
  discord: v => /^\d{15,20}$/.test(v) ? `https://discord.com/users/${v}` : `https://www.google.com/search?q=${enc('discord "' + v + '"')}`,
  applemusic: v => `https://music.apple.com/search?term=${enc(v)}`,
  playstation: v => `https://psnprofiles.com/${enc(v)}`,
  xbox: v => `https://www.xboxgamertag.com/search/${enc(v)}`,
  epicgames: v => `https://www.google.com/search?q=${enc('epic games "' + v + '"')}`,
  riotgames: v => v.includes("#") ? `https://tracker.gg/valorant/profile/riot/${enc(v)}/overview` : `https://www.google.com/search?q=${enc('riot id "' + v + '"')}`,
  tumblr: v => `https://www.tumblr.com/${enc(v)}`,
  mastodon: v => { const m = v.match(/^@?([^@\s]+)@([a-z0-9.-]+\.[a-z]{2,})$/i); return m ? `https://${m[2]}/@${m[1]}` : `https://www.google.com/search?q=${enc('mastodon "' + v + '"')}`; },
  roblox: v => /^\d+$/.test(v) ? `https://www.roblox.com/users/${v}/profile` : `https://www.roblox.com/search/users?keyword=${enc(v)}`,
  steam: v => /^\d{17}$/.test(v) ? `https://steamcommunity.com/profiles/${v}` : `https://steamcommunity.com/id/${enc(v)}`,
  spotify: v => /^[a-z0-9._-]{1,40}$/i.test(v) ? `https://open.spotify.com/user/${v}` : `https://open.spotify.com/search/${enc(v)}/users`,
  whatsapp: v => `https://wa.me/${v.replace(/\D/g, "")}`,
  email: v => `mailto:${v}`,
  website: v => /\.[a-z]{2,}/i.test(v) ? `https://${v}` : `https://www.google.com/search?q=${enc(v)}`,
  bluesky: v => `https://bsky.app/profile/${v.includes(".") ? v : v + ".bsky.social"}`
};
export function socialHref(sd, value) {
  const raw = String(value || "").trim();
  if (!raw) return null;
  if (/^(https?:|mailto:)/i.test(raw)) return safeLinkUrl(raw);
  const v = raw.replace(/^@/, "");
  if (SOCIAL_FIND[sd.key]) return safeLinkUrl(SOCIAL_FIND[sd.key](sd.key === "mastodon" ? raw : v));
  if (sd.base) return safeLinkUrl(sd.base + enc(v).replace(/%2F/g, "/"));
  return safeLinkUrl(`https://www.google.com/search?q=${enc(sd.label + ' "' + v + '"')}`);
}

export const LINK_DOMAINS = [["18kbio.xyz", "il tuo link vero"], ["18k.bio", "classico"], ["18k.gin", "partner"], ["18k.xyz", "nuovo"], ["18k.gg", "gaming"], ["18k.lol", "meme"], ["18k.wtf", "caos"], ["18k.rip", "dark"], ["18k.fm", "musica"],
  ["18k.vip", "lusso"], ["18k.ink", "arte"], ["18k.cc", "corto"], ["18kt.bio", "oro"], ["x18k.bio", "collab"]];

export const MUSIC_POS = [["top", "In cima"], ["name", "Sotto il nome"], ["bio", "Sotto la descrizione"], ["bottom", "In fondo"], ["float-r", "Fluttuante a destra"], ["float-l", "Fluttuante a sinistra"]];
export const PLAYER_STYLES = [["card", "Scheda"], ["glass", "Vetro"], ["minimal", "Minimal"], ["pill", "Pillola"], ["vinyl", "Vinile"], ["retro", "Retro"], ["neon", "Neon"], ["cassette", "Cassetta"]];

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
export const EFFECTS = [["none", "Nessuno"], ["lava", "Lava"], ["aurora", "Aurora"], ["snow", "Neve"], ["rain", "Pioggia"], ["stars", "Stelle"], ["particles", "Costellazione"], ["hearts", "Cuori"], ["matrix", "Matrix"], ["ascii", "ASCII"], ["noise", "Grana"], ["scanlines", "Scanline"], ["dither", "Dither"]];
export const NAME_FX = [["none", "Nessuno"], ["glow", "Glow"], ["gradient", "Gradiente"], ["rainbow", "Arcobaleno"], ["glitch", "Glitch"], ["sparkle", "Scintille"], ["typewriter", "Macchina da scrivere"], ["shuffle", "Shuffle"], ["outline", "Contorno"],
  ["wave", "Onda"], ["bounce", "Rimbalzo"], ["neon", "Neon"], ["float", "Fluttua"], ["shake", "Trema"], ["chrome", "Cromo"], ["fire", "Fuoco"], ["ice", "Diamante"], ["3d", "3D"], ["blur", "Sfocato"]];
export const BIO_FX = [["none", "Statica"], ["typewriter", "Macchina da scrivere"], ["cycle", "Frasi che cambiano"], ["glitch", "Glitch"], ["rainbow", "Arcobaleno"], ["wave", "Onda"]];
export const ENTRANCES = [["none", "Nessuna"], ["pixel", "Pixel"], ["fade", "Dissolvenza"], ["glitch", "Glitch"], ["pop", "Pop"]];
export const AVATAR_DECOS = [["none", "Nessuna"], ["custom", "La mia (caricata)"], ...DECO_LIST];
export const SFX = [["none", "Nessuno"], ["tick", "Tick"], ["pop", "Pop"], ["blip", "Blip"], ["8bit", "8-bit"], ["glass", "Vetro"], ["bass", "Basso"]];
// Icons a user can pick for their own badge (24px stroke paths)
export const BADGE_ICONS = {
  star: '<path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7.3L12 17.8 5.7 21.5l1.7-7.3L2 9.5l7.1-.6z"/>',
  heart: '<path d="M12 21s-8.5-5.2-8.5-11.2A4.8 4.8 0 0 1 12 7a4.8 4.8 0 0 1 8.5 2.8C20.5 15.8 12 21 12 21z"/>',
  skull: '<path d="M12 3a8 8 0 0 0-5 14.2V21h10v-3.8A8 8 0 0 0 12 3z"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><path d="M10 21v-2M14 21v-2"/>',
  crown: '<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/>',
  flame: '<path d="M12 22c4 0 7-2.7 7-6.6 0-4.4-4-6.9-4.6-11.4-2.6 1.6-4 4.2-3.6 7-1.4-.6-2.3-2-2.5-3.4C6.4 9.4 5 12 5 15.4 5 19.3 8 22 12 22z"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>',
  diamond: '<path d="M6 3h12l4 6-10 12L2 9zM2 9h20M9 3l3 18M15 3l-3 18"/>',
  music: '<path d="M9 18V6l11-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  game: '<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 11v3M5.5 12.5h3"/><circle cx="16" cy="11.5" r="1"/><circle cx="18" cy="14" r="1"/>',
  code: '<path d="M8 6l-6 6 6 6M16 6l6 6-6 6"/>',
  camera: '<rect x="2" y="6" width="20" height="14" rx="3"/><circle cx="12" cy="13" r="4"/><path d="M8 6l2-3h4l2 3"/>',
  cig: '<path d="M2 15h15v4H2zM17 15h2v4h-2M21 15v4M18 11c0-2 2-2 2-4M14 11c0-2 2-2 2-4"/>',
  ghost: '<path d="M5 21V10a7 7 0 0 1 14 0v11l-2.5-2-2.3 2-2.2-2-2.2 2-2.3-2z"/><circle cx="9.5" cy="10" r="1"/><circle cx="14.5" cy="10" r="1"/>'
};

/* ---------- Defaults and normalisation ---------- */

export const DEFAULT_APPEARANCE = {
  v: 2,
  layout: "classic",
  bg: { type: "color", color: "#000000", gradient: { kind: "linear", angle: 160, stops: ["#1a1a1a", "#000000", "#2b2b2b"] }, image: "", video: "", poster: "", fit: "cover", dim: 30, blur: 0, x: 50, y: 50, zoom: 100, gray: 0, sat: 100, tint: "#000000", tintA: 0, vignette: 0 },
  effect: "none", effectColor: "#ffffff", intensity: 80,
  card: { opacity: 55, blur: 14, radius: 22, border: "solid", width: 420, minH: 0, x: 0, y: 0, zoom: 100, rot: 0, gradient: false, borderColor: "", borderWidth: 1, shadow: "none", padding: 24, align: "center", pos: "center", grad2: "", gradAngle: 160, tilt: false },
  colors: { accent: "#ffffff", text: "#ffffff", muted: "#9a9a9a", icon: "#ffffff", primary: "#0d0d0d", secondary: "#141414", border: "#2a2a2a" },
  font: { name: "geist", body: "geist", nameSize: 100, upper: false, spacing: 0, custom: "" },
  nameFx: "none", nameGradient: ["#ffffff", "#8a8a8a"],
  bioFx: "none", bioLines: [], typeSpeed: 70,
  banner: { type: "none", url: "", height: 120 },
  avatar: { show: true, shape: "circle", size: 92, ring: "none", deco: "none", decoUrl: "", discord: false, discordDeco: false, decoSize: 100 },
  badges: { show: true, color: "", style: "box", custom: { on: false, icon: "star", label: "", color: "" } },
  socialsStyle: { style: "plain", size: 40, position: "top", align: "center" },
  buttons: { variant: "solid", palette: "white", custom: "#ffffff", shape: "rounded", shadow: "none", hover: "lift", align: "center", icons: true, size: "m", font: "body", upper: false, border: 1, gradient: false, anim: "none" },
  widgetStyle: { style: "card", radius: 14, size: "normal", accentTag: true },
  cursor: { type: "default", url: "", trail: "none" },
  sfx: { hover: "none", click: "none", volume: 50 },
  enter: { on: false, text: "clicca per entrare", style: "blur" },
  music: { type: "none", url: "", autoplay: true, volume: 60, showPlayer: true, title: "", tracks: [], shuffle: false, loop: "all", blurCover: true, visualizer: "bars", lyrics: true, cover: "",
    // Where the music sits on the profile (all sources) and how the 18k player looks (own files)
    pos: "name",
    player: { style: "card", size: "m", radius: 16, color: "", bg: 70, cover: "square", bar: "line", marquee: false, fadeIn: true,
      showCover: true, showTitle: true, showTime: true, showBar: true, showSkip: true, showVolume: true, showList: true } },
  lastfm: { user: "", show: false },
  widgets: { discordId: "", discordPresence: false, github: "", clock: "", showViews: true, twitch: "", youtube: "", gallery: false, galleryStyle: "grid", contact: false, newsletter: false, newsletterText: "", guestbook: false, discordServer: "", spotify: "", roblox: "", countdown: { date: "", label: "" }, weather: "", mood: "", note: "", pics: {} },
  title: { text: "", animated: false },
  seo: { description: "", image: "" },
  privacy: { hideViews: false, unlisted: false, hideBadges: false, private: false, disabled: false },
  // Your link: which 18k prefix and /name or /@name (the prefixes go live when the domains are bought)
  link: { domain: "18kbio.xyz", format: "/" },
  glow: { username: false, socials: false, badges: false, links: false },
  entrance: "pixel"
};

const HEX = /^#[0-9a-f]{6}$/i;
const isObj = v => v && typeof v === "object" && !Array.isArray(v);
export const clamp = (n, a, b, f) => Number.isFinite(+n) && n !== "" && n !== null ? Math.min(b, Math.max(a, +n)) : f;
export const safeColor = (c, f) => HEX.test(String(c || "")) ? String(c).toLowerCase() : f;
const pickOne = (v, list, f) => list.some(x => x[0] === v) ? v : f;

// Music that starts by itself needs one tap (browsers never play sound before it): the "clicca per entrare" screen gives it
const needsEnter = a => a.enter.on || (a.music.autoplay && ["audio", "deezer", "youtube", "soundcloud"].includes(a.music.type) && (a.music.type !== "audio" || a.music.tracks.length > 0) && (a.music.type === "audio" || !!a.music.url));
export function safeUrl(u, allowData = false) {
  const s = String(u || "").trim();
  if (!s) return null;
  if (allowData && /^data:image\/(png|jpe?g|webp|gif);base64,[a-z0-9+/=]+$/i.test(s)) return s;
  try {
    const x = new URL(s);
    return x.protocol === "https:" || x.protocol === "http:" ? x.href : null;
  } catch (_) { return null; }
}
// Uploaded fonts: a normal https link, or (for guests) a small font kept inline
export function safeFontUrl(u) {
  const s = String(u || "").trim();
  if (/^data:(font\/(ttf|otf|woff2?)|application\/(font-woff2?|x-font-ttf|x-font-otf|octet-stream));base64,[a-z0-9+/=]+$/i.test(s) && s.length < 700000) return s;
  return safeUrl(s);
}
export function safeLinkUrl(u) {
  let s = String(u || "").trim();
  // People type "instagram.com/me" or "www.site.it": add https:// for them
  if (s && !/^[a-z][a-z0-9+.-]*:/i.test(s) && /^[^\s/]+\.[a-z]{2,}(\/|$)/i.test(s)) s = "https://" + s;
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
  // Photo controls: focus point, zoom, black and white, saturation, colour on top, dark edges
  a.bg.x = clamp(a.bg.x, 0, 100, 50); a.bg.y = clamp(a.bg.y, 0, 100, 50);
  a.bg.zoom = clamp(a.bg.zoom, 100, 250, 100);
  a.bg.gray = clamp(a.bg.gray, 0, 100, 0); a.bg.sat = clamp(a.bg.sat, 0, 200, 100);
  a.bg.tint = safeColor(a.bg.tint, "#000000"); a.bg.tintA = clamp(a.bg.tintA, 0, 90, 0);
  a.bg.vignette = clamp(a.bg.vignette, 0, 100, 0);
  a.effect = pickOne(a.effect, EFFECTS, "none");
  a.effectColor = safeColor(a.effectColor, "#ffffff");
  a.intensity = clamp(a.intensity, 0, 100, 80);
  a.card.opacity = clamp(a.card.opacity, 0, 100, 55);
  a.card.blur = clamp(a.card.blur, 0, 30, 14);
  a.card.radius = clamp(a.card.radius, 0, 40, 22);
  a.card.width = clamp(a.card.width, 320, 900, 420);
  a.card.minH = clamp(a.card.minH, 0, 1200, 0); // 0 = as tall as what is inside
  // move / zoom / turn the whole profile, like a photo
  a.card.x = clamp(a.card.x, -50, 50, 0); a.card.y = clamp(a.card.y, -50, 50, 0);
  a.card.zoom = clamp(a.card.zoom, 50, 160, 100); a.card.rot = clamp(a.card.rot, -30, 30, 0);
  a.card.border = ["none", "solid", "glow", "animated"].includes(a.card.border) ? a.card.border : "solid";
  a.card.gradient = !!a.card.gradient;
  // Full control of the profile box (the frame around the photo)
  a.card.borderColor = safeColor(a.card.borderColor, "") || "";
  a.card.borderWidth = clamp(a.card.borderWidth, 0, 6, 1);
  a.card.shadow = ["none", "soft", "strong", "glow"].includes(a.card.shadow) ? a.card.shadow : "none";
  a.card.padding = clamp(a.card.padding, 10, 48, 24);
  a.card.align = a.card.align === "left" ? "left" : "center";
  a.card.pos = a.card.pos === "top" ? "top" : "center";
  a.card.grad2 = safeColor(a.card.grad2, "") || "";
  a.card.gradAngle = clamp(a.card.gradAngle, 0, 360, 160);
  a.card.tilt = !!a.card.tilt;
  for (const k of Object.keys(d.colors)) a.colors[k] = safeColor(a.colors[k], d.colors[k]);
  a.font.custom = safeFontUrl(a.font.custom) || "";
  a.font.name = FONT[a.font.name] || (a.font.name === "custom" && a.font.custom) ? a.font.name : "geist";
  a.font.body = FONT[a.font.body] || (a.font.body === "custom" && a.font.custom) ? a.font.body : "geist";
  a.font.nameSize = clamp(a.font.nameSize, 60, 200, 100);
  a.font.spacing = clamp(a.font.spacing, -8, 30, 0);
  a.font.upper = !!a.font.upper;
  a.nameFx = pickOne(a.nameFx, NAME_FX, "none");
  a.nameGradient = [safeColor(a.nameGradient?.[0], "#ffffff"), safeColor(a.nameGradient?.[1], "#8a8a8a")];
  a.bioFx = pickOne(a.bioFx, BIO_FX, "none");
  a.bioLines = (Array.isArray(a.bioLines) ? a.bioLines : []).map(s => String(s || "").slice(0, 80)).filter(Boolean).slice(0, 6);
  a.typeSpeed = clamp(a.typeSpeed, 20, 200, 70);
  a.avatar.shape = ["circle", "rounded", "square", "hex"].includes(a.avatar.shape) ? a.avatar.shape : "circle";
  a.avatar.size = clamp(a.avatar.size, 56, 150, 92);
  a.avatar.decoSize = clamp(a.avatar.decoSize, 50, 200, 100); // % of the normal decoration size
  a.avatar.ring = ["none", "solid", "glow", "spin"].includes(a.avatar.ring) ? a.avatar.ring : "none";
  a.avatar.show = a.avatar.show !== false;
  // the old simple decorations become the closest new one
  const OLD_DECO = { neon: "holoheart", rainbow: "holoheart", cyber: "storm", firering: "fire", flames: "fire", bolts: "storm", starring: "cosmos", sparkles: "cosmos", orbit: "cosmos", saturn: "cosmos", smoke: "cosmos", bubbles: "ice", butterflies: "sakura", halo: "angel", horns: "demon", cat: "blackcat", crown: "gold", hearts: "holoheart", headphones: "phones", glitch: "storm" };
  a.avatar.deco = pickOne(OLD_DECO[a.avatar.deco] || a.avatar.deco, AVATAR_DECOS, "none");
  a.avatar.decoUrl = safeUrl(a.avatar.decoUrl, true) || "";
  if (a.avatar.deco === "custom" && !a.avatar.decoUrl) a.avatar.deco = "none";
  a.avatar.discord = !!a.avatar.discord;
  a.avatar.discordDeco = !!a.avatar.discordDeco;
  a.banner.type = ["none", "image", "video"].includes(a.banner.type) ? a.banner.type : "none";
  a.banner.url = (a.banner.type === "video" ? safeUrl(a.banner.url) : safeUrl(a.banner.url, true)) || "";
  a.banner.height = clamp(a.banner.height, 70, 240, 120);
  a.badges.show = a.badges.show !== false;
  a.badges.color = safeColor(a.badges.color, "");
  a.badges.style = ["box", "round", "plain"].includes(a.badges.style) ? a.badges.style : "box";
  const cb = isObj(a.badges.custom) ? a.badges.custom : {};
  a.badges.custom = { on: !!cb.on, icon: BADGE_ICONS[cb.icon] ? cb.icon : "star", label: String(cb.label || "").slice(0, 24), color: safeColor(cb.color, "") };
  a.sfx.hover = pickOne(a.sfx.hover, SFX, "none");
  a.sfx.click = pickOne(a.sfx.click, SFX, "none");
  a.sfx.volume = clamp(a.sfx.volume, 0, 100, 50);
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
  b.size = ["s", "m", "l"].includes(b.size) ? b.size : "m";
  b.font = ["body", "name", "mono"].includes(b.font) ? b.font : "body";
  b.upper = !!b.upper; b.gradient = !!b.gradient;
  b.border = clamp(b.border, 0, 3, 1);
  b.anim = ["none", "shine", "pulse", "border"].includes(b.anim) ? b.anim : "none";
  const ws = a.widgetStyle = isObj(a.widgetStyle) ? a.widgetStyle : {};
  ws.style = ["card", "glass", "outline", "minimal", "neon"].includes(ws.style) ? ws.style : "card";
  ws.radius = clamp(ws.radius, 0, 28, 14);
  ws.size = ["compact", "normal", "large"].includes(ws.size) ? ws.size : "normal";
  ws.accentTag = ws.accentTag !== false;
  b.align = b.align === "left" ? "left" : "center";
  b.icons = b.icons !== false;
  a.cursor.type = ["default", "crosshair", "custom"].includes(a.cursor.type) ? a.cursor.type : "default";
  a.cursor.url = safeUrl(a.cursor.url, true) || "";
  a.cursor.trail = ["none", "dots", "sparkle", "ghost"].includes(a.cursor.trail) ? a.cursor.trail : "none";
  a.cursor.hot = ["auto", "center"].includes(a.cursor.hot) ? a.cursor.hot : "auto";
  a.enter.on = !!a.enter.on;
  a.enter.text = String(a.enter.text || "clicca per entrare").slice(0, 40);
  a.enter.style = ["blur", "pixel", "fade"].includes(a.enter.style) ? a.enter.style : "blur";
  a.music.type = ["none", "spotify", "deezer", "audio", "soundcloud", "youtube"].includes(a.music.type) ? a.music.type : "none";
  a.music.url = String(a.music.url || "").slice(0, 600);
  a.music.title = String(a.music.title || "").slice(0, 60);
  a.music.volume = clamp(a.music.volume, 0, 100, 60);
  a.music.autoplay = a.music.autoplay !== false;
  a.music.showPlayer = a.music.showPlayer !== false;
  // Playlist: the old single url/title becomes the first track
  const tracks = (Array.isArray(a.music.tracks) ? a.music.tracks : []).filter(isObj).slice(0, 20).map(t => ({
    url: String(t.url || "").slice(0, 600), title: String(t.title || "").slice(0, 60), artist: String(t.artist || "").slice(0, 60),
    cover: safeUrl(t.cover, true) || "", lrc: String(t.lrc || "").slice(0, 12000)
  })).filter(t => t.url);
  if (!tracks.length && a.music.url && a.music.type === "audio") tracks.push({ url: a.music.url, title: a.music.title, artist: "", cover: "", lrc: "" });
  a.music.tracks = tracks;
  a.music.shuffle = !!a.music.shuffle;
  a.music.loop = ["all", "one", "none"].includes(a.music.loop) ? a.music.loop : "all";
  a.music.blurCover = a.music.blurCover !== false;
  a.music.visualizer = ["none", "bars", "wave"].includes(a.music.visualizer) ? a.music.visualizer : "bars";
  a.music.lyrics = a.music.lyrics !== false;
  a.music.pos = MUSIC_POS.some(x => x[0] === a.music.pos) ? a.music.pos : "name";
  const pl = isObj(a.music.player) ? a.music.player : {}, dp = d.music.player;
  a.music.player = {
    style: PLAYER_STYLES.some(x => x[0] === pl.style) ? pl.style : "card",
    size: ["s", "m", "l"].includes(pl.size) ? pl.size : "m",
    radius: clamp(pl.radius, 0, 32, 16),
    color: /^#[0-9a-f]{6}$/i.test(pl.color || "") ? pl.color : "",
    bg: clamp(pl.bg, 0, 100, 70),
    cover: ["square", "round", "vinyl", "none"].includes(pl.cover) ? pl.cover : "square",
    bar: ["line", "thick", "dots", "none"].includes(pl.bar) ? pl.bar : "line",
    marquee: !!pl.marquee, fadeIn: pl.fadeIn !== false
  };
  ["showCover", "showTitle", "showTime", "showBar", "showSkip", "showVolume", "showList"].forEach(k => { a.music.player[k] = pl[k] !== false && dp[k] !== false; });
  a.music.cover = safeUrl(a.music.cover, true) || "";
  a.lastfm.user = String(a.lastfm.user || "").replace(/[^a-z0-9_.-]/gi, "").slice(0, 30);
  a.lastfm.show = !!a.lastfm.show && !!a.lastfm.user;
  a.widgets.discordId = String(a.widgets.discordId || "").replace(/\D/g, "").slice(0, 20);
  a.widgets.discordPresence = a.widgets.discordPresence === true;
  a.widgets.github = String(a.widgets.github || "").replace(/[^a-z0-9-]/gi, "").slice(0, 39);
  a.widgets.discordServer = String(a.widgets.discordServer || "").replace(/^(https?:\/\/)?(www\.)?(discord\.gg|discord\.com\/invite)\//i, "").replace(/[^a-z0-9-]/gi, "").slice(0, 40);
  a.widgets.spotify = /^https:\/\/open\.spotify\.com\//.test(String(a.widgets.spotify || "")) ? String(a.widgets.spotify).slice(0, 300) : "";
  a.widgets.roblox = String(a.widgets.roblox || "").replace(/[^a-z0-9_]/gi, "").slice(0, 20);
  a.widgets.clock = String(a.widgets.clock || "").slice(0, 40);
  const cd = isObj(a.widgets.countdown) ? a.widgets.countdown : {};
  a.widgets.countdown = { date: /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/.test(cd.date || "") ? cd.date : "", label: String(cd.label || "").slice(0, 40) };
  a.widgets.weather = String(a.widgets.weather || "").replace(/[<>"]/g, "").slice(0, 40);
  a.widgets.mood = String(a.widgets.mood || "").slice(0, 60);
  a.widgets.note = String(a.widgets.note || "").slice(0, 200);
  // Each widget's picture: automatic, your own image, or none
  const pics = isObj(a.widgets.pics) ? a.widgets.pics : {};
  a.widgets.pics = {};
  ["dc", "lf", "gh", "ds", "rb", "wx", "cd", "md", "nt"].forEach(k => { const x = pics[k]; if (isObj(x) && ["custom", "none"].includes(x.mode)) a.widgets.pics[k] = { mode: x.mode, url: x.mode === "custom" ? safeUrl(x.url, true) || "" : "" }; });
  a.widgets.showViews = a.widgets.showViews !== false;
  a.widgets.twitch = String(a.widgets.twitch || "").replace(/^https?:\/\/(www\.)?twitch\.tv\//i, "").replace(/[^a-z0-9_]/gi, "").slice(0, 25);
  a.widgets.youtube = String(a.widgets.youtube || "").trim().slice(0, 200);
  a.widgets.gallery = !!a.widgets.gallery;
  a.widgets.galleryStyle = ["grid", "row", "stack"].includes(a.widgets.galleryStyle) ? a.widgets.galleryStyle : "grid";
  a.widgets.contact = !!a.widgets.contact;
  a.widgets.newsletter = !!a.widgets.newsletter;
  a.widgets.newsletterText = String(a.widgets.newsletterText || "").slice(0, 80);
  a.widgets.guestbook = !!a.widgets.guestbook;
  a.title.text = String(a.title.text || "").slice(0, 60);
  a.title.animated = !!a.title.animated;
  a.seo.description = String(a.seo.description || "").slice(0, 160);
  a.seo.image = safeUrl(a.seo.image) || "";
  a.link.domain = "18kbio.xyz"; // prefixes removed: the link is always 18kbio.xyz/name
  a.link.format = a.link.format === "/@" ? "/@" : "/";
  for (const k of Object.keys(d.privacy)) a.privacy[k] = !!a.privacy[k];
  for (const k of Object.keys(d.glow)) a.glow[k] = !!a.glow[k];
  a.entrance = pickOne(a.entrance, ENTRANCES, "pixel");
  a.bg.image = safeUrl(a.bg.image, true) || "";
  a.bg.video = safeUrl(a.bg.video) || "";
  a.bg.poster = safeUrl(a.bg.poster) || "";
  return a;
}

// Short stable id for a link that was saved before links had ids
export function linkId(l) {
  if (/^[a-z0-9]{4,10}$/.test(l?.id || "")) return l.id;
  let h = 5381;
  for (const ch of String(l?.url || "") + "|" + String(l?.title || "")) h = ((h * 33) ^ ch.charCodeAt(0)) >>> 0;
  return h.toString(36).slice(0, 8).padStart(4, "0");
}
const DT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const B64 = /^[a-z0-9+/=]{8,2400}$/i;
function normLink(l) {
  const lock = isObj(l?.lock) && B64.test(l.lock.s || "") && B64.test(l.lock.iv || "") && B64.test(l.lock.ct || "") ? { s: l.lock.s, iv: l.lock.iv, ct: l.lock.ct } : null;
  return {
    id: linkId(l), type: l?.type === "header" ? "header" : "link",
    title: String(l?.title || "").slice(0, 60), url: lock ? "" : String(l?.url || "").slice(0, 600), hidden: !!l?.hidden,
    featured: !!l?.featured, start: DT.test(l?.start || "") ? l.start : "", end: DT.test(l?.end || "") ? l.end : "",
    password: String(l?.password || "").slice(0, 64), lock
  };
}
// Is a scheduled link visible right now?
export const linkLive = (l, now = new Date()) => (!l.start || new Date(l.start) <= now) && (!l.end || new Date(l.end) > now);

export function normalizeProfile(raw) {
  const p = isObj(raw) ? raw : {};
  const handle = String(p.handle || "tuonome").toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20) || "tuonome";
  const clans = (Array.isArray(p.clans) ? p.clans : []).map(t => String(t).toUpperCase()).filter(t => /^[A-Z0-9]{2,4}$/.test(t)).filter((t, i, a) => a.indexOf(t) === i).slice(0, 3);
  return {
    handle,
    displayName: String(p.displayName || handle).slice(0, 40),
    bio: String(p.bio ?? "").slice(0, 300),
    tags: (Array.isArray(p.tags) ? p.tags : []).map(t => String(t).slice(0, 20)).filter(Boolean).slice(0, 5),
    location: String(p.location || "").slice(0, 60),
    // Old names someone was known by, separated by "/"
    aka: String(p.aka || "").replace(/\s*\/\s*/g, "/").replace(/\s+/g, "/").replace(/\/{2,}/g, "/").replace(/^\/|\/$/g, "").slice(0, 80),
    avatarUrl: safeUrl(p.avatarUrl, true) || "",
    links: (Array.isArray(p.links) ? p.links : []).slice(0, 30).map(normLink),
    clans, primaryClan: clans.includes(String(p.primaryClan || "").toUpperCase()) ? String(p.primaryClan).toUpperCase() : (clans[0] || ""),
    gallery: (Array.isArray(p.gallery) ? p.gallery : []).filter(isObj).map(g => ({ url: safeUrl(g.url, true) || "", caption: String(g.caption || "").slice(0, 80), path: String(g.path || "").slice(0, 200) })).filter(g => g.url).slice(0, 12),
    socials: isObj(p.socials) ? Object.fromEntries(Object.entries(p.socials).filter(([k, v]) => SOCIALS.some(s => s.key === k) && v).map(([k, v]) => [k, String(v).slice(0, 200)])) : {},
    badges: (Array.isArray(p.badges) ? p.badges : []).filter(b => BADGES[b]).slice(0, 8),
    weekly: isObj(p.weekly) ? { week: String(p.weekly.week || ""), text: String(p.weekly.text || "").slice(0, 200), link: String(p.weekly.link || "").slice(0, 600), image: String(p.weekly.image || "").slice(0, 600), show: !!p.weekly.show } : null,
    views: Math.max(0, Math.floor(+p.views || 0)),
    likes: Math.max(0, Math.floor(+p.likes || 0)),
    card: cardData(p.card),
    appearance: normalizeAppearance(p.appearance)
  };
}

// The identity card (card-kit.js checks every field when it draws it); here only shape and size
function cardData(c) {
  if (!isObj(c)) return null;
  try { return JSON.stringify(c).length < 400000 ? JSON.parse(JSON.stringify(c)) : null; } catch (_) { return null; }
}
// Images saved only on this device (data: URLs) never go to the public page
function cardPublic(c) {
  if (!c) return null;
  const out = JSON.parse(JSON.stringify(c));
  if (out.bg && typeof out.bg.image === "string" && out.bg.image.startsWith("data:")) out.bg.image = "";
  if (Array.isArray(out.stickers)) out.stickers = out.stickers.filter(s => !(s && typeof s.src === "string" && s.src.startsWith("data:")));
  return out;
}

export const BADGES = {
  staff: ["staff 18k", '<path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>'],
  beta: ["beta", '<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/>'],
  early: ["della prima ora", '<path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"/>'],
  verified: ["verificato", '<path d="M20 6L9 17l-5-5"/>'],
  partner: ["partner", '<path d="M3 15h15v4H3zM18 15h3v4h-3M7 11c0-2 2-2 2-4s-2-2-2-4M12 11c0-2 2-2 2-4s-2-2-2-4"/>'],
  premium: ["premium", '<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M12 21L8 9l4-6 4 6z"/>'],
  winner: ["vincitore del topic", '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/>']
};

/* ---------- Templates ---------- */

const PX = id => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`;
const GF = id => `https://media.giphy.com/media/${id}`;
// Templates built on real media, like the profiles on guns.lol: a looping clip (GIPHY gives an mp4,
// a still frame and a small animated preview for every GIF) or a real photo. "thumb" is what the
// template lists show, so forty cards never play forty videos at once.
const clip = (id, name, tags, gif, a = {}) => ({
  id, name, tags, thumb: `${GF(gif)}/200w.webp`,
  a: { enter: { on: true, text: "clicca per entrare", style: "blur" }, ...a, bg: { type: "video", video: `${GF(gif)}/giphy.mp4`, poster: `${GF(gif)}/giphy_s.gif`, dim: 35, blur: 0, ...(a.bg || {}) } }
});
const photo = (id, name, tags, src, a = {}) => ({
  id, name, tags, thumb: src,
  a: { enter: { on: true, text: "clicca per entrare", style: "blur" }, ...a, bg: { type: "image", image: src, dim: 40, blur: 0, ...(a.bg || {}) } }
});
// Colours in one call: accent, text, then the rest follows the accent
const pal = (accent, text = "#ffffff", muted = "#a8a8a8", dark = "#0a0a0a") => ({ accent, text, muted, icon: accent, primary: dark, secondary: dark, border: accent });
// The glass card most guns.lol profiles use
const GLASS = { opacity: 22, blur: 16, radius: 18, border: "solid" };
const enter = text => ({ on: true, text, style: "blur" });
export const TEMPLATES = [
  clip("pioggia", "Pioggia", ["pioggia", "sad", "notte"], "t7Qb8655Z1VfBGr5XB", { effect: "rain", effectColor: "#ffffff", intensity: 35, card: GLASS, font: { name: "instrument", nameSize: 130 }, nameFx: "glow", glow: { username: true }, enter: enter("piove anche oggi") }),
  clip("finestra", "Finestra appannata", ["pioggia", "chill", "b&w"], "W0d6nJlthOq88", { effect: "none", card: { opacity: 30, blur: 22, radius: 22, border: "none" }, font: { name: "space-mono", body: "space-mono" }, bioFx: "typewriter", buttons: { variant: "glass", shape: "pill" }, enter: enter("> guarda fuori <") }),
  clip("auto-pioggia", "Auto sotto la pioggia", ["pioggia", "auto", "sad"], "3o6YfWvDokAcsmUfni", { effect: "rain", effectColor: "#9fb3c8", intensity: 50, bg: { dim: 45 }, colors: pal("#9fb3c8", "#eef3f8"), font: { name: "bebas", nameSize: 150, spacing: 2 }, nameFx: "outline", card: GLASS, buttons: { variant: "outline", palette: "accent", shape: "square" }, enter: enter("non scrivermi") }),
  clip("tramonto", "Tramonto bagnato", ["tramonto", "caldo", "pioggia"], "B2czf5h7JtjNe", { effect: "none", colors: pal("#ffb36b", "#fff4ea", "#e0b894", "#1a0d06"), font: { name: "syne" }, nameFx: "gradient", nameGradient: ["#fff1df", "#ff9a4d"], card: GLASS, buttons: { variant: "glass", shape: "pill", hover: "glow" }, enter: enter("golden hour") }),
  clip("inverno", "Inverno B&N", ["b&w", "sad", "inverno"], "A9dCxwH4iflw4", { effect: "snow", effectColor: "#ffffff", intensity: 30, bg: { dim: 40 }, font: { name: "bodoni", nameSize: 140 }, nameFx: "blur", card: { opacity: 15, blur: 10, radius: 4, border: "none" }, buttons: { variant: "ghost", shape: "square", hover: "lift" }, enter: enter("freddo dentro") }),
  clip("night-drive", "Night drive", ["auto", "notte", "phonk"], "wjjvv8CEWSdAcdlgtP", { effect: "none", bg: { dim: 40 }, colors: pal("#ff3b6b", "#ffe9ef", "#c78a9a"), font: { name: "audiowide" }, nameFx: "neon", glow: { username: true, socials: true }, card: GLASS, buttons: { variant: "outline", palette: "accent", shape: "rounded", hover: "glow" }, socialsStyle: { style: "glow" }, enter: enter(">> guida piano <<") }),
  clip("tokyo-drive", "Tokyo drive", ["giappone", "notte", "viola"], "KfOdjTchcDEku203WE", { effect: "scanlines", intensity: 25, colors: pal("#c89bff", "#f6edff", "#b9a3d6", "#12051f"), font: { name: "audiowide" }, nameFx: "chrome", card: GLASS, buttons: { variant: "glass", palette: "accent", shape: "pill", hover: "shine" }, enter: enter("東京") }),
  clip("neon-streets", "Neon streets", ["anime", "città", "neon"], "J3BlD4W2r1mcK1vMWW", { effect: "none", colors: pal("#ff3df2", "#fde9ff", "#c7a3d6"), font: { name: "syne" }, nameFx: "neon", glow: { username: true, socials: true, badges: true }, card: GLASS, buttons: { variant: "glass", palette: "accent", shape: "pill", hover: "glow" }, socialsStyle: { style: "glow" }, enter: enter("click to enter") }),
  clip("drift", "Drift", ["auto", "jdm", "fumo"], "69iv77x8e5NMA", { effect: "noise", intensity: 30, bg: { dim: 45 }, colors: pal("#ff2a2a", "#ffffff", "#b0b0b0"), font: { name: "blackops", upper: true }, nameFx: "3d", card: { opacity: 40, blur: 8, radius: 4, border: "solid" }, buttons: { variant: "solid", palette: "accent", shape: "square", shadow: "hard", hover: "lift" }, enter: enter("full send") }),
  clip("sigari", "18k smoke", ["fumo", "b&w", "18k"], "3o6gE4tv9znhlbqy1W", { effect: "none", bg: { dim: 30 }, font: { name: "unifraktur", body: "geist", nameSize: 140 }, nameFx: "glow", badges: { custom: { on: true, icon: "cig", label: "404", color: "" } }, card: { opacity: 18, blur: 14, radius: 14, border: "solid" }, buttons: { variant: "glass", shape: "rounded", hover: "shine" }, enter: enter("accendi") }),
  clip("fumo-nero", "Fumo nero", ["fumo", "dark", "b&w"], "G6VPpxqLN6pYB1lxGC", { effect: "none", bg: { dim: 20 }, font: { name: "instrument", nameSize: 150 }, nameFx: "float", card: { opacity: 10, blur: 6, radius: 0, border: "none" }, buttons: { variant: "ghost", shape: "square", hover: "lift" }, enter: enter("...") }),
  clip("vhs", "VHS", ["glitch", "retro", "b&w"], "jVXFZ0BwDKutTDiVWf", { effect: "scanlines", intensity: 45, bg: { dim: 40 }, font: { name: "vt323", body: "vt323", nameSize: 170 }, nameFx: "shuffle", entrance: "glitch", card: { opacity: 50, blur: 0, radius: 0, border: "solid" }, buttons: { variant: "outline", shape: "square", hover: "none" }, enter: enter("▶ PLAY") }),
  clip("glitch-rosso", "Glitch rosso", ["glitch", "rosso", "dark"], "l1J3GNSlIloTZCAhi", { effect: "noise", intensity: 40, colors: pal("#ff2a2a", "#ffe5e5", "#b36b6b", "#0a0000"), font: { name: "glitch" }, nameFx: "glitch", card: { opacity: 45, blur: 6, radius: 2, border: "glow" }, buttons: { variant: "outline", palette: "accent", shape: "square", hover: "glow" }, enter: enter("ERROR 404") }),
  clip("lofi-90", "Lofi anni 90", ["anime", "lofi", "chill"], "fUpvkRuLKE4xMBJLvH", { effect: "noise", intensity: 20, colors: pal("#ffd7a8", "#fff7ee", "#d9c2a8", "#1a120c"), font: { name: "space-mono" }, bioFx: "typewriter", card: GLASS, buttons: { variant: "glass", shape: "rounded", hover: "lift" }, enter: enter("lofi beats to chill to") }),
  clip("anime-tramonto", "Anime tramonto", ["anime", "tramonto", "aesthetic"], "RcRYrpC1pBvIB0icDm", { effect: "particles", effectColor: "#ffd1a8", intensity: 30, colors: pal("#ffb38a", "#fff3ea", "#e3b9a0", "#1c0d10"), font: { name: "syne" }, nameFx: "glow", card: GLASS, buttons: { variant: "glass", shape: "pill" }, enter: enter("tramonto") }),
  clip("anime-pioggia", "Anime pioggia", ["anime", "pioggia", "sad"], "sTzAXLbAnZ5NvpHd6m", { effect: "rain", effectColor: "#cfe3ff", intensity: 40, colors: pal("#9cc6ff", "#eef5ff", "#9fb3cc", "#060b14"), font: { name: "instrument", nameSize: 140 }, nameFx: "blur", card: GLASS, buttons: { variant: "glass", shape: "pill" }, enter: enter("stop the rain") }),
  clip("chillhop", "Chillhop", ["lofi", "chill", "caldo"], "MU56lYT1Ov07fVTsnM", { effect: "none", colors: pal("#f4c27a", "#fff6e6", "#d0b48c", "#1c140a"), font: { name: "space-mono", body: "space-mono" }, card: { opacity: 55, blur: 10, radius: 16, border: "none" }, buttons: { variant: "solid", palette: "accent", shape: "rounded", hover: "lift" }, enter: enter("☕") }),
  clip("sakura", "Sakura", ["anime", "rosa", "cute"], "PoHVT5kEyNWcN0CWNj", { effect: "hearts", effectColor: "#ffd1e6", intensity: 25, colors: pal("#ff7eb6", "#fff0f7", "#e0a7c2", "#1a0710"), font: { name: "pinyon", body: "instrument", nameSize: 150 }, avatar: { ring: "glow", deco: "sparkles" }, card: GLASS, buttons: { variant: "glass", palette: "accent", shape: "pill", hover: "grow" }, enter: enter("✿ entra ✿") }),
  clip("fuji", "Fuji in fiore", ["giappone", "rosa", "natura"], "CynSSsYOxHZn2", { effect: "none", bg: { dim: 25 }, colors: pal("#ffb3cf", "#ffffff", "#f0d0dc", "#140a0e"), font: { name: "bodoni", nameSize: 140 }, nameFx: "glow", card: GLASS, buttons: { variant: "glass", shape: "pill" }, enter: enter("春") }),
  clip("dreamcore", "Dreamcore", ["dreamcore", "strano", "nostalgia"], "EUXFNYKJ4kkor0SACJ", { effect: "dither", intensity: 30, colors: pal("#c8f0ff", "#ffffff", "#c6d8e0"), font: { name: "marker" }, nameFx: "wave", card: { opacity: 25, blur: 12, radius: 26, border: "none" }, buttons: { variant: "glass", shape: "pill", hover: "grow" }, enter: enter("sei già stato qui") }),
  clip("galassia", "Galassia", ["spazio", "stelle", "dark"], "zMaCuiamKtuMM", { effect: "stars", effectColor: "#e6d9ff", intensity: 40, colors: pal("#b9a3ff", "#f4efff", "#a99cc8", "#07040f"), font: { name: "syne" }, nameFx: "gradient", nameGradient: ["#ffffff", "#a78bfa"], avatar: { deco: "orbit" }, card: GLASS, buttons: { variant: "glass", shape: "pill" }, enter: enter("✦") }),
  clip("luna", "Luna", ["notte", "spazio", "calmo"], "8swygam0zNHfxnZtSV", { effect: "none", colors: pal("#cfe0ff", "#ffffff", "#aab8d0", "#050812"), font: { name: "instrument", nameSize: 150 }, nameFx: "glow", avatar: { deco: "halo" }, card: GLASS, buttons: { variant: "ghost", shape: "pill", hover: "glow" }, enter: enter("buonanotte") }),
  clip("mare", "Mare che brilla", ["mare", "notte", "blu"], "A7QlDPIVzmml4lkwby", { effect: "none", bg: { dim: 25 }, colors: pal("#4de8ff", "#effcff", "#8fc6d0", "#02121a"), font: { name: "syne" }, nameFx: "glow", glow: { username: true, socials: true }, card: GLASS, buttons: { variant: "glass", palette: "accent", shape: "rounded", hover: "glow" }, enter: enter("~ onde ~") }),
  clip("temporale", "Temporale", ["tempesta", "dark", "viola"], "69zkZcvtDiyqVkBMQX", { effect: "rain", effectColor: "#d8ccff", intensity: 45, colors: pal("#b49cff", "#f1ecff", "#9b8cc0", "#07040f"), font: { name: "anton", upper: true, spacing: 3 }, nameFx: "shake", card: GLASS, buttons: { variant: "outline", palette: "accent", shape: "square", hover: "shine" }, enter: enter("⚡") }),
  clip("neve", "Neve", ["inverno", "b&w", "calmo"], "NEqxBcejKE68U", { effect: "snow", effectColor: "#ffffff", intensity: 25, font: { name: "inter" }, nameFx: "ice", card: { opacity: 20, blur: 18, radius: 22, border: "solid" }, buttons: { variant: "glass", palette: "white", shape: "pill" }, enter: enter("❅ click to enter ❅") }),
  clip("fuoco", "Fuoco", ["fuoco", "dark", "arancione"], "q4voi8znbYANE5GtYI", { effect: "particles", effectColor: "#ff9a3c", intensity: 40, bg: { dim: 30 }, colors: pal("#ff7a1a", "#fff2e6", "#c08a66", "#120500"), font: { name: "blackops" }, nameFx: "fire", avatar: { deco: "flames" }, card: GLASS, buttons: { variant: "solid", palette: "accent", shape: "rounded", shadow: "glow" }, enter: enter("🔥") }),
  clip("aurora", "Aurora", ["natura", "verde", "notte"], "pkVHZKcnzzkmA", { effect: "none", colors: pal("#4dffc3", "#effff9", "#8fc7b5", "#02110c"), font: { name: "syne" }, nameFx: "float", card: GLASS, buttons: { variant: "glass", shape: "rounded" }, enter: enter("nord") }),
  clip("nebbia", "Bosco nella nebbia", ["natura", "dark", "nebbia"], "26xBwlGgyeQjxx09G", { effect: "noise", intensity: 25, bg: { dim: 35 }, colors: pal("#cfd8cf", "#f0f4f0", "#9aa59a", "#070a07"), font: { name: "unifraktur", body: "instrument", nameSize: 140 }, nameFx: "blur", card: { opacity: 25, blur: 20, radius: 6, border: "none" }, buttons: { variant: "ghost", shape: "square", hover: "lift" }, enter: enter("non perderti") }),
  clip("soldi", "Soldi", ["rap", "soldi", "verde"], "BfFFYPSVYr9UR6EtEL", { effect: "none", bg: { dim: 40 }, colors: pal("#3ddc84", "#eafff0", "#7fae8c", "#03110a"), font: { name: "anton", upper: true, spacing: 2 }, nameFx: "chrome", badges: { color: "#3ddc84" }, card: GLASS, buttons: { variant: "solid", palette: "accent", shape: "rounded", shadow: "glow", hover: "grow" }, enter: enter("$$$") }),
  clip("ice", "Ice", ["rap", "ice", "lusso"], "piT4C88HsdLQqy6jlS", { effect: "snow", effectColor: "#cfeaff", intensity: 20, colors: pal("#bfe7ff", "#f2fbff", "#8fa9bb", "#05090c"), font: { name: "anton", upper: true, spacing: 3 }, nameFx: "ice", avatar: { deco: "sparkles", ring: "glow" }, glow: { username: true, badges: true }, card: GLASS, buttons: { variant: "glass", palette: "accent", shape: "rounded", hover: "shine" }, enter: enter("above you, below zero") }),
  clip("cattedrale", "Cattedrale", ["gothic", "luce", "chiesa"], "ZQWo2YZmmm0cKVH7JR", { effect: "particles", effectColor: "#fff1c9", intensity: 25, colors: pal("#ffe3a3", "#fffaf0", "#cbb88c", "#0d0904"), font: { name: "unifraktur", body: "instrument", nameSize: 140 }, avatar: { deco: "halo" }, nameFx: "glow", card: { opacity: 30, blur: 12, radius: 4, border: "solid" }, buttons: { variant: "outline", palette: "accent", shape: "square", hover: "glow" }, enter: enter("✝") }),
  clip("dark-fantasy", "Dark fantasy", ["gothic", "dark", "nuvole"], "JdgjzVM2hn1THCOGZV", { effect: "none", bg: { dim: 35 }, font: { name: "pirata", nameSize: 150 }, nameFx: "glow", avatar: { deco: "crown" }, card: { opacity: 30, blur: 10, radius: 4, border: "animated" }, buttons: { variant: "outline", shape: "square", hover: "glow" }, enter: enter("entra se hai coraggio") }),
  clip("gatto-nero", "Gatto nero", ["gatto", "dark", "cute"], "YJ85eVpdZDy7e", { effect: "none", bg: { dim: 30 }, font: { name: "cherry", body: "inter" }, nameFx: "bounce", avatar: { deco: "cat", ring: "solid" }, card: GLASS, buttons: { variant: "glass", shape: "pill", hover: "grow" }, enter: enter("miao") }),
  clip("rose", "Rose", ["rosso", "love", "fiori"], "2JwGnUN7PvdtK", { effect: "none", bg: { dim: 30 }, colors: pal("#ff3355", "#fff0f2", "#d39aa4", "#120206"), font: { name: "pinyon", body: "instrument", nameSize: 150 }, nameFx: "glow", avatar: { deco: "hearts" }, card: GLASS, buttons: { variant: "solid", palette: "accent", shape: "pill", hover: "glow" }, enter: enter("♡") }),
  clip("matrix", "Matrix", ["hacker", "verde", "codice"], "10zxDv7Hv5RF9C", { layout: "terminal", effect: "none", bg: { dim: 45 }, colors: pal("#00ff66", "#00ff66", "#0aa045", "#000000"), font: { name: "vt323", body: "vt323", nameSize: 150 }, nameFx: "typewriter", card: { opacity: 70, blur: 0, radius: 2, border: "solid" }, buttons: { variant: "outline", palette: "accent", shape: "square", hover: "none" }, enter: enter("wake up...") }),
  clip("pastel", "Pastel grunge", ["rosa", "pastello", "y2k"], "Ku2Sh2XKrCYeI", { effect: "none", bg: { dim: 10 }, colors: pal("#ff7eb6", "#3d2350", "#7d6a92", "#fff0f8"), font: { name: "cherry", body: "inter" }, card: { opacity: 60, blur: 12, radius: 28, border: "none" }, buttons: { variant: "solid", palette: "accent", shape: "pill", hover: "grow" }, enter: enter("₊˚⊹♡") }),
  clip("farfalle", "Farfalle", ["fairy", "natura", "sogno"], "qzIBpKegEc1Qn8pTQ3", { effect: "particles", effectColor: "#d9f2ff", intensity: 25, colors: pal("#a8e6ff", "#f2fbff", "#a9c3cc", "#04101a"), font: { name: "pinyon", body: "instrument", nameSize: 150 }, avatar: { deco: "sparkles" }, card: GLASS, buttons: { variant: "glass", shape: "pill" }, enter: enter("𓆩♡𓆪") }),
  clip("cyberpunk", "Cyberpunk", ["neon", "città", "anime"], "eFvs5iE6a6ntVIRaEN", { effect: "scanlines", intensity: 20, colors: pal("#fcee0a", "#fffbd1", "#c9c27a", "#0d0d00"), font: { name: "blackops", body: "geist-mono" }, nameFx: "glitch", card: { opacity: 55, blur: 6, radius: 0, border: "solid" }, buttons: { variant: "solid", palette: "accent", shape: "square", shadow: "hard", hover: "lift" }, enter: enter("// connessione") }),
  clip("pixel", "Pixel city", ["pixel", "gaming", "retro"], "NKEt9elQ5cR68", { effect: "none", bg: { dim: 25 }, colors: pal("#ffd23f", "#ffffff", "#c7c9e8", "#101024"), font: { name: "silkscreen", body: "silkscreen" }, entrance: "pixel", sfx: { hover: "8bit", click: "8bit" }, card: { opacity: 60, blur: 0, radius: 0, border: "solid" }, buttons: { variant: "solid", palette: "accent", shape: "square", shadow: "hard", hover: "lift" }, enter: enter("PRESS START") }),
  clip("synthwave", "Synthwave", ["retro", "neon", "80s"], "9zExs2Q2h1EHfE4P6G", { effect: "none", colors: pal("#ff71ce", "#ffffff", "#e0b8f0", "#14041f"), font: { name: "audiowide" }, nameFx: "chrome", card: GLASS, buttons: { variant: "outline", palette: "accent", shape: "square", hover: "shine" }, socialsStyle: { style: "glow" }, enter: enter("1986") })
];

// A light version of a template for small previews: the video becomes its animated thumbnail
// (or its still frame), canvas effects and the enter screen are switched off.
export function previewAppearance(tplAppearance, thumb = "") {
  const a = applyTemplate(DEFAULT_APPEARANCE, tplAppearance || {}, "all");
  if (a.bg.type === "video") {
    const img = safeUrl(thumb) || a.bg.poster;
    a.bg = { ...a.bg, type: img ? "image" : "color", image: img || "" };
  }
  if (["snow", "rain", "stars", "particles", "hearts", "matrix", "ascii"].includes(a.effect)) a.effect = "none";
  a.enter.on = false;
  a.card.blur = 0;
  return a;
}

// Parts a template can lend without overwriting the whole look.
export const TEMPLATE_PARTS = {
  all: null,
  bg: ["bg", "effect", "effectColor", "intensity"],
  colors: ["colors"],
  fonts: ["font", "nameFx", "nameGradient"],
  layout: ["layout", "card", "avatar", "entrance"],
  buttons: ["buttons", "socialsStyle"]
};
const PERSONAL = ["music", "lastfm", "widgets", "title", "seo", "privacy", "link"];

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
export function deezerEmbed(url) {
  const m = String(url || "").match(/deezer\.com\/(?:[a-z]{2}\/)?(track|album|playlist)\/(\d{1,15})/i);
  return m ? { src: `https://widget.deezer.com/widget/dark/${m[1]}/${m[2]}?tracklist=false`, height: m[1] === "track" ? 150 : 300 } : null;
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
// Where a cursor image points: "center" = middle, "auto" = its first visible pixel from the top-left
// (the tip of an arrow). Cursor images bigger than 128px are ignored by browsers, so they are made smaller.
const HOT = {};
function cursorHot(url, mode) {
  return new Promise(res => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const w = img.naturalWidth || 32, h = img.naturalHeight || 32;
      if (mode === "center") return res([Math.floor(w / 2), Math.floor(h / 2)]);
      try {
        const c = document.createElement("canvas"); c.width = w; c.height = h;
        const x = c.getContext("2d"); x.drawImage(img, 0, 0);
        const d = x.getImageData(0, 0, w, h).data;
        let best = null;
        for (let y = 0; y < h && !best; y++) for (let i = 0; i < w; i++) if (d[(y * w + i) * 4 + 3] > 100) { best = [i, y]; break; }
        // pick the visible pixel nearest to the top-left corner (the arrow tip)
        let bd = 1e9;
        for (let y = 0; y < h; y++) for (let i = 0; i < w; i++) if (d[(y * w + i) * 4 + 3] > 100) { const dd = i + y; if (dd < bd) { bd = dd; best = [i, y]; } }
        res(best || [0, 0]);
      } catch (_) { res([0, 0]); }
    };
    img.onerror = () => res([0, 0]);
    img.src = url;
  });
}
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
.pk-bg img,.pk-bg video{position:absolute;inset:-24px;width:calc(100% + 48px);height:calc(100% + 48px);object-fit:cover;object-position:var(--pk-bgx,50%) var(--pk-bgy,50%);transform:scale(var(--pk-bgz,1));transform-origin:var(--pk-bgx,50%) var(--pk-bgy,50%);filter:blur(var(--pk-bgblur,0px)) grayscale(var(--pk-bggray,0)) saturate(var(--pk-bgsat,1))}
.pk-tint{position:absolute;inset:0;z-index:0;background:var(--pk-tint,#000);opacity:var(--pk-tinta,0);pointer-events:none}
.pk-vig{position:absolute;inset:0;z-index:0;background:radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,var(--pk-vig,0)) 100%);pointer-events:none}
.pk-bg[data-fit=contain] img,.pk-bg[data-fit=contain] video{object-fit:contain}
.pk-bg .pk-tile{position:absolute;inset:0;background-repeat:repeat;background-size:auto;filter:blur(var(--pk-bgblur,0px)) grayscale(var(--pk-bggray,0)) saturate(var(--pk-bgsat,1))}
.pk-dim{position:absolute;inset:0;z-index:0;background:#000;opacity:var(--pk-dim,0);pointer-events:none}
.pk-fx{position:absolute;inset:0;z-index:1;pointer-events:none;overflow:hidden}
.pk-fx canvas{position:absolute;inset:0;width:100%;height:100%}
.pk-lava i{position:absolute;border-radius:50%;background:radial-gradient(closest-side,var(--pk-fxc),transparent);opacity:var(--pk-fxa);animation:pk-drift 34s ease-in-out infinite alternate;will-change:transform}
.pk-lava i:nth-child(1){width:55%;aspect-ratio:1;left:-15%;top:-12%}
.pk-lava i:nth-child(2){width:65%;aspect-ratio:1;right:-25%;top:28%;animation-duration:42s;animation-delay:-8s}
.pk-lava i:nth-child(3){width:45%;aspect-ratio:1;left:25%;bottom:-20%;animation-duration:48s;animation-delay:-20s}
.pk-lava i:nth-child(4){width:38%;aspect-ratio:1;left:55%;top:5%;animation-duration:40s;animation-delay:-14s}
@keyframes pk-drift{0%{transform:translate(0,0) scale(1)}50%{transform:translate(18%,-12%) scale(1.12)}100%{transform:translate(-10%,14%) scale(.9)}}
.pk-aurora i{position:absolute;width:90%;height:60%;left:5%;top:-10%;border-radius:50%;background:radial-gradient(closest-side,var(--pk-fxc),transparent);mix-blend-mode:screen;opacity:var(--pk-fxa);animation:pk-aur 18s ease-in-out infinite alternate;will-change:transform}
.pk-aurora i:nth-child(1){background:radial-gradient(closest-side,var(--pk-fxc),transparent)}
.pk-aurora i:nth-child(2){background:radial-gradient(closest-side,var(--pk-accent),transparent);top:20%;left:-20%;animation-duration:24s;animation-delay:-6s}
.pk-aurora i:nth-child(3){background:radial-gradient(closest-side,var(--pk-fxc),transparent);top:45%;left:30%;animation-duration:28s;animation-delay:-12s;opacity:calc(var(--pk-fxa)*.7)}
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
.pk-card{position:relative;width:100%;max-width:var(--pk-w);min-height:min(var(--pk-minh,0px),92vh);translate:var(--pk-cx,0) var(--pk-cy,0);scale:var(--pk-cz,1);rotate:var(--pk-cr,0deg);margin:auto 0;padding:28px 20px 22px;border-radius:var(--pk-radius);background:rgba(var(--pk-card-rgb),var(--pk-card-a));-webkit-backdrop-filter:var(--pk-card-bf,none);backdrop-filter:var(--pk-card-bf,none);border:1px solid transparent}
.pk[data-border=solid] .pk-card{border-color:var(--pk-border)}
.pk[data-border=glow] .pk-card{border-color:color-mix(in srgb,var(--pk-accent) 60%,transparent);box-shadow:0 0 34px color-mix(in srgb,var(--pk-accent) 30%,transparent)}
.pk[data-border=animated] .pk-card::before{content:"";position:absolute;inset:-1px;border-radius:inherit;padding:1px;pointer-events:none;background:conic-gradient(from var(--pk-a,0deg),transparent 0 62%,var(--pk-accent) 82%,transparent);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:pk-spin-a 4s linear infinite}
@property --pk-a{syntax:"<angle>";inherits:false;initial-value:0deg}
@keyframes pk-spin-a{to{--pk-a:360deg}}
.pk[data-cardgrad="1"] .pk-card{background:linear-gradient(var(--pk-gang,160deg),rgba(var(--pk-card-rgb),var(--pk-card-a)),var(--pk-g2,color-mix(in srgb,var(--pk-accent) 22%,transparent)))}
.pk .pk-card{border-width:var(--pk-bw,1px);padding:calc(var(--pk-pad,24px) + 4px) var(--pk-pad,24px) var(--pk-pad,24px);box-shadow:var(--pk-cshadow,none);transition:transform .25s ease-out}
.pk[data-bcustom="1"] .pk-card{border-color:var(--pk-bc)!important}
.pk[data-calign=left] .pk-card{text-align:left}.pk[data-calign=left] .pk-head{align-items:flex-start}.pk[data-calign=left] .pk-soc{justify-content:flex-start}
.pk[data-cpos=top] .pk-card{margin:6vh 0 auto}
.pk[data-tilt="1"] .pk-card{will-change:transform}
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
.pk-name.fx-glow,.pk[data-gname="1"] .pk-name{text-shadow:0 0 6px var(--pk-accent),0 0 16px var(--pk-accent),0 0 36px color-mix(in srgb,var(--pk-accent) 70%,transparent),0 0 70px color-mix(in srgb,var(--pk-accent) 40%,transparent)}
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
.pk-aka{margin-top:2px;font-size:11px;color:var(--pk-muted);opacity:.6;letter-spacing:.02em}
.pk-badges{display:flex;gap:6px;justify-content:center;margin-top:9px}
.pk-badge{position:relative;width:24px;height:24px;display:grid;place-items:center;border-radius:7px;background:var(--pk-surface);border:1px solid var(--pk-border);color:var(--pk-accent)}
.pk[data-gbadges="1"] .pk-badge{box-shadow:0 0 10px var(--pk-accent),0 0 22px color-mix(in srgb,var(--pk-accent) 60%,transparent);filter:drop-shadow(0 0 4px var(--pk-accent))}
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
.pk[data-soc=glow] .pk-soc i,.pk[data-gsoc="1"] .pk-soc i{filter:drop-shadow(0 0 3px var(--pk-icon)) drop-shadow(0 0 8px var(--pk-icon)) drop-shadow(0 0 16px color-mix(in srgb,var(--pk-icon) 60%,transparent))}
.pk-links{display:flex;flex-direction:column;gap:10px;margin-top:18px}
.pk-link{position:relative;overflow:hidden;min-height:50px;display:flex;align-items:center;justify-content:var(--pk-link-align,center);gap:10px;padding:10px 16px;font-size:14px;font-weight:500;text-decoration:none;background:var(--btn-bg);color:var(--btn-fg)!important;border:var(--btn-border);border-radius:var(--btn-radius);box-shadow:var(--btn-shadow);-webkit-backdrop-filter:var(--btn-blur,none);backdrop-filter:var(--btn-blur,none);transition:transform .2s,box-shadow .2s,filter .2s}
.pk-link img{width:18px;height:18px;border-radius:4px;flex-shrink:0}
.pk[data-hover=lift] .pk-link:hover{transform:translateY(-2px)}
.pk[data-hover=grow] .pk-link:hover{transform:scale(1.025)}
.pk[data-hover=glow] .pk-link:hover,.pk[data-glinks="1"] .pk-link{box-shadow:0 0 0 1px color-mix(in srgb,var(--pk-accent) 70%,transparent),0 0 16px color-mix(in srgb,var(--pk-accent) 75%,transparent),0 0 40px color-mix(in srgb,var(--pk-accent) 40%,transparent)}
.pk[data-hover=shine] .pk-link::after{content:"";position:absolute;top:0;bottom:0;width:40%;left:-60%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.35),transparent);transition:left .6s}
.pk[data-hover=shine] .pk-link:hover::after{left:120%}
.pk-w{display:flex;align-items:center;gap:12px;margin-top:12px;padding:11px 12px;border-radius:var(--pk-w-radius,14px);background:var(--pk-surface);border:1px solid var(--pk-border);text-align:left;font-size:13px;text-decoration:none}
.pk-w .pic{position:relative;width:44px;height:44px;border-radius:10px;background:#222;flex-shrink:0;overflow:visible}
.pk-w .pic img{width:100%;height:100%;border-radius:inherit;object-fit:cover;display:block}
.pk-w .txt{flex:1;min-width:0}
.pk-w .pic[hidden]{display:none}
.pk-w .pk-emo{position:absolute;inset:0;display:grid;place-items:center;font-size:22px;line-height:1}
.pk-w-note{align-items:flex-start}.pk-note-t{margin:2px 0 0;font-size:13px;line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere}
.pk-w .pk-join{flex:none;padding:6px 12px;border-radius:999px;background:var(--pk-accent);color:var(--pk-accent-on,#000);font-size:12px;font-weight:700}
.pk-w b{display:block;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pk-w small{display:block;color:var(--pk-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pk-w .tag{font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--pk-accent)}
.pk[data-wtag="0"] .pk-w .tag{color:var(--pk-muted)}
.pk[data-wstyle=glass] .pk-w{background:rgba(255,255,255,.06);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-color:rgba(255,255,255,.14)}
.pk[data-wstyle=outline] .pk-w{background:transparent;border:1.5px solid var(--pk-accent)}
.pk[data-wstyle=minimal] .pk-w{background:transparent;border-color:transparent;padding-left:0;padding-right:0}
.pk[data-wstyle=neon] .pk-w{background:rgba(0,0,0,.35);border:1px solid var(--pk-accent);box-shadow:0 0 18px color-mix(in srgb,var(--pk-accent) 40%,transparent),inset 0 0 12px color-mix(in srgb,var(--pk-accent) 15%,transparent)}
.pk[data-wsize=compact] .pk-w{padding:7px 9px;gap:9px;font-size:12px}.pk[data-wsize=compact] .pk-w .pic{width:32px;height:32px}
.pk[data-wsize=large] .pk-w{padding:15px 16px;gap:14px;font-size:14.5px}.pk[data-wsize=large] .pk-w .pic{width:60px;height:60px}
.pk-embed{border-radius:var(--pk-w-radius,14px)!important;overflow:hidden}
.pk-link{min-height:var(--btn-h,50px)!important;font-size:var(--btn-fs,14px)!important;font-family:var(--btn-font,inherit)!important;text-transform:var(--btn-tt,none);letter-spacing:var(--btn-ls,0)}
.pk[data-banim=shine] .pk-link::after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.35) 50%,transparent 70%);transform:translateX(-120%);animation:pkShine 3.2s ease-in-out infinite;pointer-events:none}
@keyframes pkShine{60%,100%{transform:translateX(120%)}}
.pk[data-banim=pulse] .pk-link{animation:pkPulse 2.4s ease-in-out infinite}
@keyframes pkPulse{50%{transform:scale(1.025)}}
.pk[data-banim=border] .pk-link{border-color:transparent!important;background-image:linear-gradient(var(--pk-surface),var(--pk-surface)),conic-gradient(from var(--pk-ang,0deg),var(--pk-accent),transparent 40%,var(--pk-accent));background-origin:border-box;background-clip:padding-box,border-box;border:2px solid transparent!important;animation:pkAng 3s linear infinite}
@property --pk-ang{syntax:"<angle>";inherits:false;initial-value:0deg}
@keyframes pkAng{to{--pk-ang:360deg}}
@media (prefers-reduced-motion:reduce){.pk .pk-link,.pk .pk-link::after{animation:none!important}}
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
.pk-pick [data-pk-hot]{outline:1.5px dashed rgba(255,255,255,.6);outline-offset:5px;border-radius:10px;cursor:pointer}
.pk-pick .pk-bg{cursor:pointer}
.pk-cardbtn{display:flex;align-items:center;gap:8px;margin:16px auto 0;padding:9px 16px;border-radius:999px;border:1px solid rgba(255,255,255,.18);background:rgba(0,0,0,.45);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#fff;font:500 13px/1 inherit;cursor:pointer;transition:transform .2s,border-color .2s}
.pk-cardbtn:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.5)}
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
.pk-ban{position:relative;height:var(--pk-banh,120px);margin:-28px -20px 0;border-radius:var(--pk-radius) var(--pk-radius) 0 0;overflow:hidden;background:var(--pk-surface)}
.pk-ban img,.pk-ban video{width:100%;height:100%;object-fit:cover;display:block}
.pk-s-banner:not(:empty)+.pk-s-head .pk-head{margin-top:calc(var(--pk-av)*-.5)}
.pk[data-layout=left] .pk-s-banner:not(:empty)+.pk-s-head .pk-head{margin-top:calc(var(--pk-av)*-.35)}
.pk-s-banner:not(:empty)+.pk-s-head .pk-av{box-shadow:0 0 0 4px rgba(var(--pk-card-rgb),1)}
.pk[data-layout=terminal] .pk-s-banner:not(:empty)+.pk-s-head .pk-head,.pk[data-layout=minimal] .pk-s-banner:not(:empty)+.pk-s-head .pk-head{margin-top:16px}
.pk[data-layout=minimal] .pk-ban{margin:0 0 4px;border-radius:14px}
.pk-av-deco{scale:var(--pk-dsz,1);position:absolute;inset:-34%;width:168%;height:168%;pointer-events:none;overflow:visible;color:var(--pk-accent);z-index:2}
.pk-dc-deco{scale:var(--pk-dsz,1);position:absolute;inset:-12%;width:124%!important;height:124%!important;border-radius:0!important;pointer-events:none;z-index:2}
.pk-av-deco .spin{transform-origin:50% 50%;animation:pk-spin 9s linear infinite}
.pk-av-deco .rev{animation-direction:reverse}
.pk-av-deco .flk{animation:pk-flk 1.6s steps(2) infinite}
@keyframes pk-flk{0%,70%{opacity:1}85%{opacity:.15}}
.pk-av-deco .rise{transform-box:fill-box;animation:pk-rise 3.5s ease-in infinite}
@keyframes pk-rise{0%{transform:translateY(0);opacity:0}15%{opacity:.9}100%{transform:translateY(-62px);opacity:0}}
.pk-av-deco .flap{transform-box:fill-box;transform-origin:center;animation:pk-flap .35s ease-in-out infinite alternate}
@keyframes pk-flap{to{transform:scaleX(.35)}}
.pk-av-deco .dash{animation:pk-dash 3s linear infinite}
@keyframes pk-dash{to{stroke-dashoffset:-276}}
.pk-av-ideco{scale:var(--pk-dsz,1);position:absolute;inset:-17%;width:134%!important;height:134%!important;border-radius:0!important;object-fit:contain;pointer-events:none;z-index:2}
.ideco-float{animation:idFloat 4s ease-in-out infinite}
.ideco-breathe{animation:idBreathe 3.2s ease-in-out infinite}
.ideco-sway{animation:idSway 5s ease-in-out infinite;transform-origin:50% 50%}
.ideco-spin{animation:idSpin 40s linear infinite}
.ideco-flicker{animation:idFlicker 1.6s steps(1,end) infinite}
.ideco-shine{-webkit-mask:linear-gradient(110deg,#000 40%,rgba(0,0,0,.65) 50%,#000 60%) 0 0/300% 100%;mask:linear-gradient(110deg,#000 40%,rgba(0,0,0,.65) 50%,#000 60%) 0 0/300% 100%;animation:idShine 3.5s ease-in-out infinite}
.ideco-sparkle{animation:idSparkle 2.4s ease-in-out infinite}
.ideco-hue{animation:idHue 6s linear infinite}
.ideco-steps{animation:idSteps 1.2s steps(2,end) infinite}
@keyframes idFloat{50%{transform:translateY(-2.5%)}}
@keyframes idBreathe{50%{transform:scale(1.03)}}
@keyframes idSway{25%{transform:rotate(-2deg)}75%{transform:rotate(2deg)}}
@keyframes idSpin{to{transform:rotate(360deg)}}
@keyframes idFlicker{0%,100%{filter:brightness(1)}20%{filter:brightness(1.18)}45%{filter:brightness(.92)}70%{filter:brightness(1.1)}}
@keyframes idShine{0%{-webkit-mask-position:100% 0;mask-position:100% 0}60%,100%{-webkit-mask-position:0 0;mask-position:0 0}}
@keyframes idSparkle{50%{filter:brightness(1.25) saturate(1.15)}}
@keyframes idHue{to{filter:hue-rotate(360deg)}}
@keyframes idSteps{50%{transform:translateY(-1.5%)}}
@media (prefers-reduced-motion:reduce){.pk-av-ideco{animation:none!important}}
.pk-av-cdeco{scale:var(--pk-dsz,1);position:absolute;inset:-10%;width:120%!important;height:120%!important;border-radius:0!important;object-fit:contain;pointer-events:none;z-index:2}
@media (prefers-reduced-motion:reduce){.pk-av-deco *{animation:none!important}}
.pk-av-deco .flick{transform-origin:50% 100%;animation:pk-flick .5s ease-in-out infinite alternate}
@keyframes pk-flick{from{transform:scaleY(.86) skewX(-3deg)}to{transform:scaleY(1.08) skewX(3deg)}}
.pk-av-deco .tw{animation:pk-sp 1.8s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
.pk-av-deco .bob{animation:pk-bob 3s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes pk-bob{50%{transform:translateY(-4%)}}
.pk-av.deco-glitch img,.pk-av.deco-glitch{animation:pk-avgl 3s steps(1) infinite}
@keyframes pk-avgl{0%,90%{filter:none;transform:none}92%{filter:drop-shadow(-3px 0 0 #f0f) drop-shadow(3px 0 0 #0ff);transform:translateX(2px)}95%{filter:drop-shadow(3px 0 0 #f0f) drop-shadow(-3px 0 0 #0ff);transform:translateX(-2px)}}
.pk-clans{display:flex;gap:5px;justify-content:center;flex-wrap:wrap;margin-top:7px}
.pk[data-layout=left] .pk-clans,.pk[data-layout=terminal] .pk-clans{justify-content:flex-start}
.pk-clans a{font:600 10.5px/1 ui-monospace,monospace;letter-spacing:.08em;padding:4px 7px;border-radius:6px;border:1px solid var(--pk-border);color:var(--pk-muted);text-decoration:none}
.pk-clans a.primary{background:var(--pk-accent);border-color:var(--pk-accent);color:var(--pk-on-accent,#000)}
.pk[data-bstyle=round] .pk-badge{border-radius:50%}
.pk[data-bstyle=plain] .pk-badge{background:none;border-color:transparent}
.pk-badge.custom{width:auto;padding:0 8px 0 6px;gap:4px;display:inline-flex;align-items:center;font-size:11px;font-weight:600;color:var(--pk-cb,var(--pk-badge,var(--pk-accent)))}
.pk-badge{color:var(--pk-badge,var(--pk-accent))}
.pk-rt b{font-weight:700}.pk-rt i{font-style:italic}.pk-rt u{text-decoration:underline}.pk-rt s{text-decoration:line-through}
.pk-rt code{font-family:ui-monospace,monospace;font-size:.92em;padding:1px 5px;border-radius:5px;background:var(--pk-surface);border:1px solid var(--pk-border)}
.pk-rt .sp{background:var(--pk-text);color:transparent;border-radius:3px;cursor:pointer;transition:background .2s,color .2s}
.pk-rt .sp.on{background:transparent;color:inherit}
.pk-rt .gl{text-shadow:0 0 10px color-mix(in srgb,var(--pk-accent) 85%,transparent)}
.pk-rt .rb,.pk-bio.fx-rainbow{background:linear-gradient(90deg,#ff5f6d,#ffc371,#47e891,#3bb3ff,#b56bff,#ff5f6d);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:pk-rb 4s linear infinite}
.pk-rt a{text-decoration:underline;text-underline-offset:2px}
.pk-bio.fx-glitch{animation:pk-biogl 4s steps(1) infinite}
@keyframes pk-biogl{0%,88%{transform:none;text-shadow:none}90%{transform:translateX(-2px);text-shadow:2px 0 var(--pk-accent),-2px 0 var(--pk-muted)}93%{transform:translateX(2px);text-shadow:-2px 0 var(--pk-accent),2px 0 var(--pk-muted)}96%{transform:none}}
.pk-ch{display:inline-block;white-space:pre}
.pk-name.fx-wave .pk-ch,.pk-bio.fx-wave .pk-ch{animation:pk-wave 1.6s ease-in-out infinite;animation-delay:calc(var(--i)*.07s)}
@keyframes pk-wave{0%,100%{transform:translateY(0)}50%{transform:translateY(-.18em)}}
.pk-name.fx-bounce .pk-ch{animation:pk-bounce 2.2s cubic-bezier(.3,1.6,.5,1) infinite;animation-delay:calc(var(--i)*.06s)}
@keyframes pk-bounce{0%,60%,100%{transform:translateY(0)}20%{transform:translateY(-.32em)}40%{transform:translateY(.04em)}}
.pk-name.fx-neon{color:#fff;text-shadow:0 0 4px #fff,0 0 12px var(--pk-accent),0 0 28px var(--pk-accent),0 0 52px var(--pk-accent);animation:pk-neon 4s steps(1) infinite}
@keyframes pk-neon{0%,18%,22%,62%,64%,100%{opacity:1}20%,63%{opacity:.35}}
.pk-name.fx-float{animation:pk-float 3.4s ease-in-out infinite}
@keyframes pk-float{50%{transform:translateY(-6px) rotate(-1deg)}}
.pk-name.fx-shake .pk-ch{animation:pk-shake .35s steps(2) infinite;animation-delay:calc(var(--i)*-.05s)}
@keyframes pk-shake{0%{transform:translate(0,0)}50%{transform:translate(1px,-1px) rotate(2deg)}100%{transform:translate(-1px,1px) rotate(-2deg)}}
.pk-name.fx-chrome{background:linear-gradient(180deg,#fff 0%,#c9c9c9 38%,#5b5b5b 50%,#e9e9e9 62%,#8a8a8a 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 1px 0 rgba(0,0,0,.6))}
.pk-name.fx-fire{color:#fff6d0;text-shadow:0 -2px 4px #fff3a0,0 -4px 10px #ffb300,0 -10px 18px #ff5a00,0 -16px 28px #c4000099;animation:pk-fire .18s steps(2) infinite alternate}
@keyframes pk-fire{to{text-shadow:0 -3px 5px #fff3a0,0 -6px 12px #ffb300,0 -12px 20px #ff3c00,0 -20px 30px #c4000099}}
.pk-name.fx-ice{background:radial-gradient(circle,#fff 0 .6px,transparent 1.3px) 0 0/3px 3px,linear-gradient(115deg,#8ea3b6,#fff 20%,#bfe7ff 36%,#fff 50%,#7b92a7 64%,#e9f7ff 80%,#9db2c5) 0 0/220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 6px rgba(170,225,255,.6));animation:pk-ice 3.2s linear infinite}
@keyframes pk-ice{to{background-position:0 0,-220% 0}}
.pk-name.fx-3d{text-shadow:1px 1px 0 var(--pk-accent),2px 2px 0 var(--pk-accent),3px 3px 0 color-mix(in srgb,var(--pk-accent) 70%,#000),4px 4px 0 color-mix(in srgb,var(--pk-accent) 50%,#000),6px 7px 10px rgba(0,0,0,.6)}
.pk-name.fx-blur{animation:pk-blurin 3.6s ease-in-out infinite}
@keyframes pk-blurin{0%,100%{filter:blur(0);letter-spacing:var(--pk-name-ls)}50%{filter:blur(3px);letter-spacing:calc(var(--pk-name-ls) + .08em)}}
.pk-sec{margin:8px 0 -2px;font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--pk-muted);display:flex;align-items:center;gap:10px}
.pk-sec::before,.pk-sec::after{content:"";flex:1;height:1px;background:var(--pk-border)}
.pk[data-layout=left] .pk-sec::before,.pk[data-layout=terminal] .pk-sec::before{display:none}
.pk-link.featured{animation:pk-feat 2.6s ease-in-out infinite}
@keyframes pk-feat{0%,70%,100%{transform:none}74%{transform:rotate(-1.2deg) scale(1.02)}78%{transform:rotate(1.2deg) scale(1.02)}82%{transform:rotate(-.6deg)}86%{transform:none}}
.pk-link.featured::before{content:"";position:absolute;inset:-1px;border-radius:inherit;pointer-events:none;box-shadow:0 0 0 1px var(--pk-accent),0 0 18px color-mix(in srgb,var(--pk-accent) 55%,transparent);opacity:.9}
.pk-link .lk{margin-left:auto;opacity:.75;display:inline-flex}
.pk-link.soon{opacity:.45;border-style:dashed}
.pk-link small{font-size:10.5px;opacity:.7;font-weight:500;margin-left:6px}
.pk-unlock{display:flex;gap:6px;margin-top:-4px}
.pk-unlock input{flex:1;min-width:0;height:38px;padding:0 12px;border-radius:10px;border:1px solid var(--pk-border);background:var(--pk-surface);color:var(--pk-text);font:inherit;font-size:13px;outline:0}
.pk-unlock button,.pk-form button{height:38px;padding:0 14px;border:0;border-radius:10px;background:var(--pk-accent);color:var(--pk-on-accent,#000);font:inherit;font-size:13px;font-weight:600;cursor:pointer}
.pk-unlock.bad input{border-color:#ff4d4d;animation:pk-no .3s}
@keyframes pk-no{25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
.pk-gal{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:14px}
.pk-gal button{position:relative;aspect-ratio:1;border:0;padding:0;border-radius:10px;overflow:hidden;cursor:zoom-in;background:var(--pk-surface)}
.pk-gal img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s}
.pk-gal button:hover img{transform:scale(1.06)}
.pk-gal[data-style=row]{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}
.pk-gal[data-style=row] button{flex:0 0 46%;scroll-snap-align:start}
.pk-gal[data-style=stack]{display:block;height:170px;position:relative}
.pk-gal[data-style=stack] button{position:absolute;width:44%;left:28%;top:6px;box-shadow:0 10px 24px rgba(0,0,0,.5);transition:transform .35s}
.pk-lb{position:absolute;inset:0;z-index:8;display:grid;place-items:center;background:rgba(0,0,0,.86);padding:20px;cursor:zoom-out}
.pk-lb img{max-width:100%;max-height:82%;border-radius:12px;display:block}
.pk-lb p{margin-top:10px;font-size:13px;color:#ddd}
.pk-mp{--mp-a:var(--mp-acc,var(--pk-accent));position:relative;overflow:hidden;margin-top:12px;border-radius:var(--mp-r,16px);border:1px solid var(--pk-border);background:color-mix(in srgb,var(--pk-surface) calc(var(--mp-bga,.7)*100%),transparent);text-align:left}
.pk-mp .mp-bg{position:absolute;inset:-30px;background-size:cover;background-position:center;filter:blur(26px) saturate(1.4);opacity:.55;transform:scale(1.1)}
.pk-mp .mp-in{position:relative;padding:12px;display:grid;gap:10px}
.pk-mp .mp-top{display:flex;gap:12px;align-items:center}
.pk-mp .mp-cov{width:54px;height:54px;border-radius:10px;flex-shrink:0;background:#111 center/cover;display:grid;place-items:center;color:var(--pk-accent);box-shadow:0 6px 18px rgba(0,0,0,.4)}
.pk-mp .mp-t{flex:1;min-width:0}
.pk-mp .mp-t b{display:block;font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pk-mp .mp-t small{display:block;font-size:12px;color:var(--pk-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pk-mp .mp-viz{display:block;width:100%;height:26px}
.pk-mp .mp-bar{position:relative;height:4px;border-radius:4px;background:color-mix(in srgb,var(--pk-text) 18%,transparent);cursor:pointer}
.pk-mp .mp-bar i{position:absolute;left:0;top:0;bottom:0;width:0;border-radius:inherit;background:var(--pk-accent)}
.pk-mp .mp-time{display:flex;justify-content:space-between;font:500 10.5px ui-monospace,monospace;color:var(--pk-muted);margin-top:-4px}
.pk-mp .mp-ctl{display:flex;align-items:center;justify-content:center;gap:6px}
.pk-mp .mp-ctl button{width:32px;height:32px;border:0;border-radius:50%;background:none;color:var(--pk-text);display:grid;place-items:center;cursor:pointer;opacity:.8}
.pk-mp .mp-ctl button:hover{opacity:1}
.pk-mp .mp-ctl button.on{color:var(--pk-accent);opacity:1}
.pk-mp .mp-ctl .mp-play{width:40px;height:40px;background:var(--pk-accent);color:var(--pk-on-accent,#000);opacity:1}
.pk-mp .mp-ctl input{width:70px;accent-color:var(--pk-accent);margin-left:6px}
.pk-mp .mp-lrc{min-height:40px;text-align:center;font-size:14px;font-weight:600;line-height:1.35}
.pk-mp .mp-lrc small{display:block;font-size:12px;font-weight:400;color:var(--pk-muted)}
.pk-mp .mp-lrc .now{animation:pk-lrc .4s ease both}
@keyframes pk-lrc{from{opacity:0;transform:translateY(6px)}}
.pk-mp .mp-list{display:flex;flex-direction:column;gap:2px;max-height:120px;overflow-y:auto;scrollbar-width:thin}
.pk-mp .mp-list button{display:flex;gap:8px;align-items:center;border:0;background:none;color:var(--pk-muted);font:inherit;font-size:12px;padding:5px 6px;border-radius:7px;cursor:pointer;text-align:left}
.pk-mp .mp-list button.on{color:var(--pk-text);background:color-mix(in srgb,var(--pk-text) 8%,transparent)}
.pk-mp .mp-list span{font-family:ui-monospace,monospace;font-size:10.5px;opacity:.6;width:16px}
.pk-mp .mp-bar i,.pk-mp .mp-ctl .mp-play{background:var(--mp-a)}.pk-mp .mp-ctl button.on{color:var(--mp-a)}.pk-mp .mp-ctl input{accent-color:var(--mp-a)}.pk-mp .mp-cov{color:var(--mp-a)}
.pk-mp[data-hcover="1"] .mp-cov,.pk-mp[data-cov=none] .mp-cov,.pk-mp[data-htitle="1"] .mp-t,.pk-mp[data-htime="1"] .mp-time,.pk-mp[data-hbar="1"] .mp-bar,.pk-mp[data-bar=none] .mp-bar,.pk-mp[data-hvolume="1"] .mp-ctl input,.pk-mp[data-hlist="1"] .mp-list{display:none!important}
.pk-mp[data-hskip="1"] .mp-ctl [data-k=prev],.pk-mp[data-hskip="1"] .mp-ctl [data-k=next],.pk-mp[data-hskip="1"] .mp-ctl [data-k=shuffle],.pk-mp[data-hskip="1"] .mp-ctl [data-k=loop]{display:none!important}
.pk-mp[data-cov=round] .mp-cov{border-radius:50%}
.pk-mp[data-cov=vinyl] .mp-cov{border-radius:50%;background-color:#0a0a0a;box-shadow:0 0 0 3px #111,0 0 0 4px rgba(255,255,255,.15),0 6px 18px rgba(0,0,0,.5);-webkit-mask:radial-gradient(circle,transparent 9%,#000 10%);mask:radial-gradient(circle,transparent 9%,#000 10%);animation:pk-spin 4s linear infinite;animation-play-state:paused}
.pk-mp.is-on[data-cov=vinyl] .mp-cov,.pk-mp.is-on[data-st=vinyl] .mp-cov{animation-play-state:running}
@keyframes pk-spin{to{transform:rotate(360deg)}}
.pk-mp[data-bar=thick] .mp-bar{height:8px}
.pk-mp[data-bar=dots] .mp-bar{height:6px;background:radial-gradient(circle,color-mix(in srgb,var(--pk-text) 30%,transparent) 1.5px,transparent 2px) 0 50%/8px 6px repeat-x}
.pk-mp[data-bar=dots] .mp-bar i{background:radial-gradient(circle,var(--mp-a) 2px,transparent 2.5px) 0 50%/8px 6px repeat-x}
.pk-mp[data-sz=s] .mp-in{padding:8px;gap:6px}.pk-mp[data-sz=s] .mp-cov{width:38px;height:38px}.pk-mp[data-sz=s] .mp-viz{height:16px}
.pk-mp[data-sz=l] .mp-in{padding:18px;gap:14px}.pk-mp[data-sz=l] .mp-cov{width:84px;height:84px}.pk-mp[data-sz=l] .mp-t b{font-size:16px}
.pk-mp[data-mq="1"] .mp-t b{text-overflow:clip}.pk-mp[data-mq="1"] .mp-t b span{display:inline-block;padding-left:100%;animation:pk-mq 9s linear infinite}
@keyframes pk-mq{to{transform:translateX(-100%)}}
.pk-mp[data-st=glass]{background:rgba(255,255,255,calc(var(--mp-bga,.7)*.12));-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);border-color:rgba(255,255,255,.18)}
.pk-mp[data-st=minimal]{background:none;border-color:transparent}.pk-mp[data-st=minimal] .mp-bg,.pk-mp[data-st=minimal] .mp-viz,.pk-mp[data-st=minimal] .mp-list{display:none}.pk-mp[data-st=minimal] .mp-in{padding:4px 0}
.pk-mp[data-st=pill]{border-radius:999px}.pk-mp[data-st=pill] .mp-in{display:flex;align-items:center;gap:10px;padding:6px 8px 6px 6px}.pk-mp[data-st=pill] .mp-top{flex:1;min-width:0}.pk-mp[data-st=pill] .mp-cov{width:36px;height:36px;border-radius:50%}
.pk-mp[data-st=pill] .mp-viz,.pk-mp[data-st=pill] .mp-time,.pk-mp[data-st=pill] .mp-lrc,.pk-mp[data-st=pill] .mp-list,.pk-mp[data-st=pill] .mp-ctl input,.pk-mp[data-st=pill] .mp-bar,.pk-mp[data-st=pill] .mp-ctl [data-k=shuffle],.pk-mp[data-st=pill] .mp-ctl [data-k=loop]{display:none!important}
.pk-mp[data-st=pill] .mp-ctl .mp-play{width:34px;height:34px}
.pk-mp[data-st=vinyl] .mp-top{flex-direction:column;text-align:center}.pk-mp[data-st=vinyl] .mp-cov{width:132px;height:132px;border-radius:50%;background-color:#0a0a0a;box-shadow:0 0 0 6px #111,0 0 0 7px rgba(255,255,255,.12),0 14px 34px rgba(0,0,0,.6);-webkit-mask:radial-gradient(circle,transparent 8%,#000 9%);mask:radial-gradient(circle,transparent 8%,#000 9%);animation:pk-spin 5s linear infinite;animation-play-state:paused}
.pk-mp[data-st=vinyl] .mp-t{width:100%}
.pk-mp[data-st=vinyl] .mp-cov,.pk-mp[data-cov=vinyl] .mp-cov{background-image:repeating-radial-gradient(circle,#111 0 2px,#1c1c1c 2px 3px)}
.pk-mp[data-st=vinyl] .mp-cov svg,.pk-mp[data-cov=vinyl] .mp-cov svg{display:none}
.pk-mp[data-st=retro]{border-radius:0;border:2px solid var(--mp-a);background:#000;font-family:ui-monospace,monospace}.pk-mp[data-st=retro] .mp-bg{display:none}.pk-mp[data-st=retro] .mp-cov{border-radius:0;filter:grayscale(1) contrast(1.3)}.pk-mp[data-st=retro] .mp-t b{text-transform:uppercase;letter-spacing:.06em;color:var(--mp-a)}.pk-mp[data-st=retro] .mp-bar{border-radius:0;height:10px;border:1px solid var(--mp-a);background:none}.pk-mp[data-st=retro] .mp-bar i{border-radius:0}.pk-mp[data-st=retro] .mp-ctl .mp-play{border-radius:0}
.pk-mp[data-st=neon]{border-color:var(--mp-a);box-shadow:0 0 18px color-mix(in srgb,var(--mp-a) 55%,transparent),inset 0 0 18px color-mix(in srgb,var(--mp-a) 20%,transparent)}.pk-mp[data-st=neon] .mp-t b{text-shadow:0 0 10px var(--mp-a)}.pk-mp[data-st=neon] .mp-bar i{box-shadow:0 0 10px var(--mp-a)}
.pk-mp[data-st=cassette]{background:linear-gradient(180deg,#1b1b1b,#0c0c0c);border:1px solid #333;border-radius:10px}.pk-mp[data-st=cassette] .mp-bg{display:none}
.pk-mp[data-st=cassette] .mp-top{background:#e8e2d0;color:#111;border-radius:6px;padding:8px 10px}.pk-mp[data-st=cassette] .mp-t small{color:#555}.pk-mp[data-st=cassette] .mp-cov{width:40px;height:40px;border-radius:50%;box-shadow:0 0 0 4px #222;animation:pk-spin 3s linear infinite;animation-play-state:paused}.pk-mp.is-on[data-st=cassette] .mp-cov{animation-play-state:running}
.pk-s-music.mp-float{position:absolute;bottom:16px;z-index:30;width:min(320px,calc(100% - 32px));margin:0;text-align:left}
.pk-s-music.mp-float.r{right:16px}.pk-s-music.mp-float.l{left:16px}
.pk-s-music.mp-float .pk-mp{margin:0;box-shadow:0 18px 40px -12px rgba(0,0,0,.7)}
.pk-s-music.mp-float .pk-embed{margin:0}
.pk-embed.pk-embed-hidden{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden;opacity:0;pointer-events:none;margin:0!important;clip-path:inset(50%)}
.pk-form{display:grid;gap:7px;margin-top:12px;padding:12px;border-radius:14px;background:var(--pk-surface);border:1px solid var(--pk-border);text-align:left}
.pk-form .tag{font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--pk-accent)}
.pk-form input,.pk-form textarea{width:100%;padding:9px 11px;border-radius:9px;border:1px solid var(--pk-border);background:rgba(var(--pk-card-rgb),.6);color:var(--pk-text);font:inherit;font-size:13px;outline:0;resize:vertical}
.pk-form textarea{min-height:64px}
.pk-form .row{display:flex;gap:7px}
.pk-form .row input{flex:1;min-width:0}
.pk-form .msg{font-size:12px;color:var(--pk-muted)}
.pk-form button:disabled{opacity:.5;cursor:not-allowed}
.pk-gb{display:flex;flex-direction:column;gap:6px;max-height:220px;overflow-y:auto}
.pk-gb div{padding:8px 10px;border-radius:10px;background:rgba(var(--pk-card-rgb),.5);font-size:13px;overflow-wrap:anywhere}
.pk-gb a{font-weight:600;text-decoration:none;color:var(--pk-accent)}
.pk-gb small{display:block;color:var(--pk-muted);font-size:10.5px;margin-top:2px}
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
  const RAMP = " .,:;-=+*#%@";
  function ascii(now) {
    // Characters picked from a slow moving wave field, redrawn about 12 times a second
    if (now - last < 80) return;
    last = now;
    c.clearRect(0, 0, W, H);
    c.font = "12px ui-monospace, monospace";
    c.fillStyle = color;
    const t = now / 1000, cw = 9, chh = 14;
    for (let y = 0; y < H / chh; y++) {
      for (let x = 0; x < W / cw; x++) {
        const v = (Math.sin(x * .16 + t * .7) + Math.sin(y * .21 - t * .5) + Math.sin((x + y) * .09 + t * .35) + Math.sin(Math.hypot(x - W / cw / 2, y - H / chh / 2) * .25 - t)) / 4;
        const k = Math.floor((v * .5 + .5) * mul * .9 * RAMP.length);
        const ch = RAMP[Math.max(0, Math.min(RAMP.length - 1, k))];
        if (ch === " ") continue;
        c.globalAlpha = .25 + (k / RAMP.length) * .6;
        c.fillText(ch, x * cw, y * chh + 11);
      }
    }
    c.globalAlpha = 1;
  }
  function frame(now) {
    if (kind === "ascii") { ascii(now); if (on) raf = requestAnimationFrame(frame); return; }
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

let PIC_OVER = {};
function widgetShell(href, kind) {
  const w = el(href ? "a" : "div", "pk-w");
  if (href) { w.href = href; w.target = "_blank"; w.rel = "noopener noreferrer"; }
  const pic = el("div", "pic"), txt = el("div", "txt");
  w.append(pic, txt);
  if (kind) w.dataset.wk = kind;
  const o = kind && PIC_OVER[kind];
  if (o && o.mode === "none") pic.hidden = true;
  if (o && o.mode === "custom" && o.url) pic.dataset.fixed = o.url;
  if (pic.dataset.fixed) { const img = el("img"); img.src = pic.dataset.fixed; img.alt = ""; img.loading = "lazy"; pic.prepend(img); }
  return { w, pic, txt };
}
const picKey = (k, o) => o ? `${k}:${o.mode}:${o.url}` : k;
function setLines(txt, tag, title, sub) {
  txt.replaceChildren();
  if (tag) txt.appendChild(el("span", "tag", tag));
  txt.appendChild(el("b", null, title));
  if (sub) txt.appendChild(el("small", null, sub));
}
function setPic(pic, url) {
  if (pic.hidden || pic.dataset.fixed) return;
  pic.querySelector("img")?.remove();
  const u = safeUrl(url);
  if (!u) return;
  const img = el("img"); img.src = u; img.alt = ""; img.loading = "lazy";
  pic.prepend(img);
}

function discordWidget(id) {
  const { w, pic, txt } = widgetShell(null, "dc");
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
  const { w, pic, txt } = widgetShell(`https://github.com/${user}`, "gh");
  setLines(txt, "github", user, "");
  cached("gh:" + user, 600000, () => getJSON(`https://api.github.com/users/${user}`)).then(g => {
    setPic(pic, g.avatar_url);
    setLines(txt, "github", g.name || g.login, `${g.public_repos} repo · ${g.followers} follower`);
  }).catch(() => {});
  return w;
}

function discordServerWidget(code) {
  const { w, pic, txt } = widgetShell(`https://discord.gg/${code}`, "ds");
  setLines(txt, "server discord", "discord.gg/" + code, "");
  cached("ds:" + code, 300000, () => getJSON(`/api/discord-invite?code=${encodeURIComponent(code)}`)).then(j => {
    setPic(pic, j.icon);
    setLines(txt, "server discord", j.name || code, `${j.online.toLocaleString("it-IT")} online · ${j.members.toLocaleString("it-IT")} membri`);
    const b = el("span", "pk-join", "Entra"); w.appendChild(b);
  }).catch(() => setLines(txt, "server discord", "discord.gg/" + code, "Invito non disponibile"));
  return w;
}
function robloxWidget(user) {
  const { w, pic, txt } = widgetShell(`https://www.roblox.com/search/users?keyword=${user}`, "rb");
  setLines(txt, "roblox", user, "");
  cached("rb:" + user, 600000, () => getJSON(`/api/lookup?p=roblox&u=${encodeURIComponent(user)}`)).then(j => {
    if (!j.found) return setLines(txt, "roblox", user, "Utente non trovato");
    setPic(pic, j.avatar); if (j.url) w.href = j.url;
    setLines(txt, "roblox", j.name, "@" + j.handle);
  }).catch(() => {});
  return w;
}
function lastfmWidget(user) {
  const { w, pic, txt } = widgetShell(`https://www.last.fm/user/${user}`, "lf");
  w.classList.add("pk-w-lf");
  setLines(txt, "last.fm", user, "Carico il profilo…");
  // Through our server (api/lastfm.js), which keeps the key; refreshed every 30 s while on screen
  const load = () => cached("lf:" + user, 25000, () => getJSON(`/api/lastfm?user=${encodeURIComponent(user)}`)).then(j => {
    const t = j && j.track, u = j && j.profile;
    setPic(pic, (u && u.image) || (t && t.image));
    const head = u ? `${u.name}${u.plays ? " · " + Number(u.plays).toLocaleString("it-IT") + " ascolti" : ""}` : user;
    if (!t) return setLines(txt, "last.fm", head, "Nessun ascolto ancora");
    setLines(txt, t.now ? "last.fm · in ascolto ora" : "last.fm · ultimo ascolto", head, `${t.name} — ${t.artist}`);
    w.querySelector(".pk-eq")?.remove();
    if (t.now) { const eq = el("div", "pk-eq"); eq.innerHTML = "<i></i><i></i><i></i>"; w.appendChild(eq); }
  }).catch(() => setLines(txt, "last.fm", user, "Ascolti su Last.fm"));
  load();
  const timer = setInterval(() => { if (!w.isConnected) return clearInterval(timer); if (!document.hidden) { cache.delete("lf:" + user); load(); } }, 30000);
  return w;
}

/* ---------- Small live widgets: countdown, weather, mood, note ---------- */
const WX = { 0: ["☀️", "sereno"], 1: ["🌤️", "poco nuvoloso"], 2: ["⛅", "nuvoloso"], 3: ["☁️", "coperto"], 45: ["🌫️", "nebbia"], 48: ["🌫️", "nebbia"], 51: ["🌦️", "pioviggine"], 53: ["🌦️", "pioviggine"], 55: ["🌦️", "pioviggine"], 61: ["🌧️", "pioggia"], 63: ["🌧️", "pioggia"], 65: ["🌧️", "pioggia forte"], 71: ["🌨️", "neve"], 73: ["🌨️", "neve"], 75: ["❄️", "neve forte"], 80: ["🌦️", "rovesci"], 81: ["🌧️", "rovesci"], 82: ["⛈️", "rovesci forti"], 95: ["⛈️", "temporale"], 96: ["⛈️", "temporale"], 99: ["⛈️", "temporale"] };
function emojiPic(pic, e) { if (pic.hidden || pic.dataset.fixed) return; pic.querySelector(".pk-emo")?.remove(); pic.appendChild(el("span", "pk-emo", e)); }
function weatherWidget(city) {
  const { w, pic, txt } = widgetShell(null, "wx");
  setLines(txt, "meteo", city, "…");
  cached("wx:" + city, 900000, async () => {
    const g = await getJSON(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=it`);
    const r = g.results && g.results[0]; if (!r) throw new Error("city");
    const f = await getJSON(`https://api.open-meteo.com/v1/forecast?latitude=${r.latitude}&longitude=${r.longitude}&current=temperature_2m,weather_code&timezone=auto`);
    return { name: r.name, temp: f.current.temperature_2m, code: f.current.weather_code };
  }).then(d => {
    const [e, label] = WX[d.code] || ["🌡️", ""];
    emojiPic(pic, e);
    setLines(txt, "meteo", `${Math.round(d.temp)}° a ${d.name}`, label);
  }).catch(() => setLines(txt, "meteo", city, "Meteo non disponibile"));
  return w;
}
function countdownWidget(cd) {
  const { w, pic, txt } = widgetShell(null, "cd");
  emojiPic(pic, "⏳");
  const end = new Date(cd.date.length === 10 ? cd.date + "T00:00" : cd.date);
  const tick = () => {
    let s = Math.max(0, Math.floor((end - Date.now()) / 1000));
    const d = Math.floor(s / 86400); s %= 86400;
    const hh = String(Math.floor(s / 3600)).padStart(2, "0"), mm = String(Math.floor(s % 3600 / 60)).padStart(2, "0"), ss = String(s % 60).padStart(2, "0");
    setLines(txt, "conto alla rovescia", cd.label || end.toLocaleDateString("it-IT", { day: "numeric", month: "long" }), end <= Date.now() ? "è arrivato il giorno" : `${d}g ${hh}:${mm}:${ss}`);
  };
  tick();
  const timer = setInterval(() => { if (!w.isConnected) return clearInterval(timer); tick(); }, 1000);
  return w;
}
function moodWidget(text) {
  const { w, pic, txt } = widgetShell(null, "md");
  const m = text.match(/^\p{Extended_Pictographic}\uFE0F?/u);
  emojiPic(pic, m ? m[0] : "💭");
  setLines(txt, "adesso", m ? text.slice(m[0].length).trim() || text : text, "");
  return w;
}
function noteWidget(text) {
  const { w, pic, txt } = widgetShell(null, "nt");
  w.classList.add("pk-w-note");
  emojiPic(pic, "📌");
  txt.replaceChildren(el("span", "tag", "nota"), el("p", "pk-note-t", text));
  return w;
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

/* ---------- Rich text bio: **bold** *italic* __under__ ~~strike~~ ||spoiler|| `code` [glow]…[/glow] [rainbow]…[/rainbow] [#ff00aa]…[/] [text](https://…) ---------- */

const RT = [
  [/\*\*(.+?)\*\*/s, "b"], [/__(.+?)__/s, "u"], [/~~(.+?)~~/s, "s"], [/\|\|(.+?)\|\|/s, "sp"], [/`([^`\n]+?)`/, "code"], [/\*([^*\n]+?)\*/, "i"],
  [/\[glow\](.+?)\[\/glow\]/is, "gl"], [/\[rainbow\](.+?)\[\/rainbow\]/is, "rb"], [/\[(#[0-9a-f]{6})\](.+?)\[\/\]/is, "color"],
  [/\[([^\]\n]{1,60})\]\((https?:\/\/[^\s)]{1,300})\)/i, "a"]
];
function richText(parent, text, depth = 0) {
  let best = null;
  if (depth < 6) for (const [re, kind] of RT) { const m = re.exec(text); if (m && (!best || m.index < best.m.index)) best = { m, kind }; }
  if (!best) { parent.append(text); return; }
  const { m, kind } = best;
  if (m.index) parent.append(text.slice(0, m.index));
  let node;
  if (kind === "a") {
    const u = safeLinkUrl(m[2]);
    node = el(u ? "a" : "span");
    if (u) { node.href = u; node.target = "_blank"; node.rel = "noopener noreferrer"; }
    richText(node, m[1], depth + 1);
  } else if (kind === "color") { node = el("span"); node.style.color = m[1]; richText(node, m[2], depth + 1); }
  else if (kind === "sp") { node = el("span", "sp"); node.title = "spoiler"; node.addEventListener("click", () => node.classList.toggle("on")); richText(node, m[1], depth + 1); }
  else if (kind === "gl" || kind === "rb") { node = el("span", kind); richText(node, m[1], depth + 1); }
  else if (kind === "code") node = el("code", null, m[1]);
  else { node = el(kind); richText(node, m[1], depth + 1); }
  parent.appendChild(node);
  richText(parent, text.slice(m.index + m[0].length), depth);
}
export function plainText(text) {
  let s = String(text || ""), prev;
  do {
    prev = s;
    for (const [re, kind] of RT) s = s.replace(re, (...g) => kind === "color" ? g[2] : g[1]);
  } while (s !== prev);
  return s;
}
// One span per character, for the per-letter animations
function splitChars(node, text) {
  node.replaceChildren(...[...text].map((ch, i) => { const s = el("span", "pk-ch", ch); s.style.setProperty("--i", i); return s; }));
}

/* ---------- Avatar decorations (drawn around the avatar, 100x100 box, avatar in the middle) ---------- */

const RING = (n, f) => Array.from({ length: n }, (_, i) => f(i, i * 360 / n)).join("");
export const decoSvg = kind => DECO[kind] || (DECO_IMG_BY[kind] ? `<image href="${decoImgSrc(DECO_IMG_BY[kind])}" x="-17" y="-17" width="134" height="134"/>` : "");
export { DECO_GROUPS, DECO_GROUP_OF };
function decoNode(kind) {
  const im = DECO_IMG_BY[kind];
  if (im && im.ready) {
    const d = el("img", "pk-av-ideco ideco-" + (im.anim || "float"));
    d.src = decoImgSrc(im); d.alt = ""; d.decoding = "async"; d.setAttribute("aria-hidden", "true");
    return d;
  }
  if (!DECO[kind]) return null;
  const n = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  n.setAttribute("viewBox", "0 0 100 100");
  n.setAttribute("class", "pk-av-deco");
  n.setAttribute("aria-hidden", "true");
  n.innerHTML = DECO[kind];
  return n;
}

/* ---------- Sound effects, synthesised (no files to load) ---------- */

let actx = null;
export function playSfx(kind, volume) {
  if (!kind || kind === "none" || typeof window === "undefined") return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === "suspended") actx.resume();
    const t = actx.currentTime, g = actx.createGain(), o = actx.createOscillator();
    o.connect(g); g.connect(actx.destination);
    const v = Math.max(.0002, volume / 100 * .22);
    const env = (a, d) => { g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + a); g.gain.exponentialRampToValueAtTime(.0001, t + a + d); };
    const f = o.frequency;
    if (kind === "tick") { o.type = "square"; f.setValueAtTime(2400, t); env(.002, .03); }
    if (kind === "pop") { o.type = "sine"; f.setValueAtTime(620, t); f.exponentialRampToValueAtTime(170, t + .09); env(.004, .1); }
    if (kind === "blip") { o.type = "triangle"; f.setValueAtTime(880, t); f.setValueAtTime(1320, t + .045); env(.004, .1); }
    if (kind === "8bit") { o.type = "square"; f.setValueAtTime(523, t); f.setValueAtTime(784, t + .05); f.setValueAtTime(1046, t + .1); env(.003, .16); }
    if (kind === "glass") { o.type = "sine"; f.setValueAtTime(2093, t); env(.002, .4); }
    if (kind === "bass") { o.type = "sine"; f.setValueAtTime(120, t); f.exponentialRampToValueAtTime(48, t + .22); env(.006, .26); }
    o.start(t); o.stop(t + .6);
  } catch (_) { /* no audio */ }
}

/* ---------- Uploaded font ---------- */

const fontFaces = new Map();
function loadCustomFont(url) {
  if (!url || fontFaces.has(url) || typeof FontFace !== "function") return;
  const fam = "sigari-custom-" + (fontFaces.size + 1);
  fontFaces.set(url, fam);
  try { new FontFace(fam, `url("${url.replace(/"/g, "%22")}")`).load().then(f => document.fonts.add(f)).catch(() => {}); } catch (_) { /* bad font */ }
}
const fontStack = (id, a) => id === "custom" ? `'${fontFaces.get(a.font.custom) || "sigari-custom"}', system-ui, sans-serif` : FONT[id][2];

/* ---------- Music player: playlist, shuffle, loop, synced lyrics, blurred cover, visualiser ---------- */

export function parseLrc(s) {
  const out = [];
  String(s || "").split(/\r?\n/).forEach(line => {
    const tags = [...line.matchAll(/\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g)];
    const text = line.replace(/\[[^\]]*\]/g, "").trim();
    tags.forEach(t => out.push({ t: +t[1] * 60 + +t[2] + (t[3] ? +("0." + t[3]) : 0), text }));
  });
  return out.sort((a, b) => a.t - b.t);
}
const fmtTime = s => Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00";
const ICO = {
  play: '<path d="M7 4v16l13-8z"/>', pause: '<path d="M6 4h4v16H6zM14 4h4v16h-4z"/>',
  prev: '<path d="M6 5v14M19 5L9 12l10 7z"/>', next: '<path d="M18 5v14M5 5l10 7-10 7z"/>',
  shuffle: '<path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>', loop: '<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
  note: '<path d="M9 18V6l11-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>'
};
function playlistPlayer(onEvent) {
  const node = el("div", "pk-mp");
  node.innerHTML = '<div class="mp-bg"></div><div class="mp-in"><div class="mp-top"><div class="mp-cov"></div><div class="mp-t"><b></b><small></small></div></div><canvas class="mp-viz" height="26"></canvas><div class="mp-bar"><i></i></div><div class="mp-time"><span>0:00</span><span>0:00</span></div><div class="mp-lrc"></div><div class="mp-ctl"></div><div class="mp-list"></div></div>';
  const q = s => node.querySelector(s);
  const audio = new Audio();
  audio.preload = "none";
  let m = null, order = [], pos = 0, lrc = [], lrcIdx = -1, played = new Set(), raf = 0;
  const ctl = q(".mp-ctl");
  const btn = (name, label) => { const b = el("button"); b.type = "button"; b.dataset.k = name; b.setAttribute("aria-label", label); b.innerHTML = svg(ICO[name] || "", name === "play" ? 14 : 15, name === "play" || name === "prev" || name === "next"); ctl.appendChild(b); return b; };
  const bShuffle = btn("shuffle", "Ordine casuale"), bPrev = btn("prev", "Precedente"), bPlay = btn("play", "Riproduci"), bNext = btn("next", "Successiva"), bLoop = btn("loop", "Ripeti");
  bPlay.classList.add("mp-play");
  const vol = el("input"); vol.type = "range"; vol.min = 0; vol.max = 100; vol.setAttribute("aria-label", "Volume"); ctl.appendChild(vol);
  const cur = () => m.tracks[order[pos]] || m.tracks[0];
  function makeOrder(keep) {
    const idx = m.tracks.map((_, i) => i);
    if (m.shuffle) for (let i = idx.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [idx[i], idx[j]] = [idx[j], idx[i]]; }
    if (keep != null) { idx.splice(idx.indexOf(keep), 1); idx.unshift(keep); pos = 0; }
    order = idx;
  }
  function load(i, autoplay) {
    pos = i;
    const t = cur();
    if (!t) return;
    const src = safeUrl(t.url, true) || "";
    if (audio.getAttribute("src") !== src) audio.src = src;
    lrc = m.lyrics ? parseLrc(t.lrc) : []; lrcIdx = -1;
    paint();
    if (autoplay) audio.play().catch(() => {});
  }
  function paint() {
    const t = cur();
    if (!t) return;
    const tb = q(".mp-t b"), tt = t.title || "Senza titolo";
    if (m.player && m.player.marquee) tb.replaceChildren(el("span", null, tt)); else tb.textContent = tt;
    q(".mp-t small").textContent = t.artist || (m.tracks.length > 1 ? `${order[pos] + 1} di ${m.tracks.length}` : "");
    const cov = q(".mp-cov");
    cov.style.backgroundImage = t.cover ? `url("${t.cover.replace(/"/g, "%22")}")` : "";
    cov.innerHTML = t.cover ? "" : svg(ICO.note, 20);
    q(".mp-bg").style.backgroundImage = t.cover && m.blurCover ? `url("${t.cover.replace(/"/g, "%22")}")` : "";
    q(".mp-lrc").style.display = lrc.length ? "" : "none";
    if (lrc.length && lrcIdx < 0) q(".mp-lrc").innerHTML = "<small>♪</small>";
    bShuffle.classList.toggle("on", m.shuffle); bLoop.classList.toggle("on", m.loop !== "none");
    bLoop.title = { all: "Ripeti la playlist", one: "Ripeti il brano", none: "Non ripetere" }[m.loop];
    bLoop.style.position = "relative";
    bLoop.dataset.one = m.loop === "one" ? "1" : "";
    [bPrev, bNext, bShuffle].forEach(b => { b.style.display = m.tracks.length > 1 ? "" : "none"; });
    const list = q(".mp-list");
    list.style.display = m.tracks.length > 1 ? "" : "none";
    list.replaceChildren(...m.tracks.map((tr, i) => { const b = el("button"); b.type = "button"; b.className = i === order[pos] ? "on" : ""; b.append(el("span", null, String(i + 1)), tr.title || "Senza titolo"); b.addEventListener("click", () => { makeOrder(i); load(0, true); }); return b; }));
    q(".mp-viz").style.display = m.visualizer === "none" ? "none" : "";
    playIcon();
  }
  const playIcon = () => { bPlay.innerHTML = svg(audio.paused ? ICO.play : ICO.pause, 14, true); bPlay.setAttribute("aria-label", audio.paused ? "Riproduci" : "Pausa"); };
  bPlay.addEventListener("click", () => { if (!audio.getAttribute("src")) load(pos, false); audio.paused ? audio.play().catch(() => {}) : audio.pause(); });
  // Fade in: the volume climbs to its value in about a second and a half
  let fadeT = 0;
  audio.addEventListener("play", () => {
    if (!m || !m.player.fadeIn) return;
    const target = m.volume / 100; let v = 0; audio.volume = 0; clearInterval(fadeT);
    fadeT = setInterval(() => { v = Math.min(target, v + target / 15); audio.volume = v; if (v >= target) clearInterval(fadeT); }, 100);
  });
  bNext.addEventListener("click", () => next(true));
  bPrev.addEventListener("click", () => { if (audio.currentTime > 3) audio.currentTime = 0; else load((pos - 1 + order.length) % order.length, !audio.paused); });
  bShuffle.addEventListener("click", () => { m.shuffle = !m.shuffle; makeOrder(order[pos]); paint(); });
  bLoop.addEventListener("click", () => { m.loop = { all: "one", one: "none", none: "all" }[m.loop]; paint(); });
  vol.addEventListener("input", () => { audio.volume = vol.value / 100; });
  q(".mp-bar").addEventListener("click", e => { const r = e.currentTarget.getBoundingClientRect(); if (audio.duration) audio.currentTime = (e.clientX - r.left) / r.width * audio.duration; });
  function next(manual) {
    if (!manual && m.loop === "one") { audio.currentTime = 0; audio.play().catch(() => {}); return; }
    if (pos + 1 >= order.length) {
      if (m.loop === "none" && !manual) return;
      if (m.shuffle) makeOrder(null);
      load(0, true);
    } else load(pos + 1, true);
  }
  audio.addEventListener("ended", () => next(false));
  audio.addEventListener("play", () => { playIcon(); const k = order[pos]; if (!played.has(k)) { played.add(k); onEvent && onEvent("p", ""); } loop(); });
  audio.addEventListener("pause", playIcon);
  audio.addEventListener("timeupdate", () => {
    const d = audio.duration;
    q(".mp-bar i").style.width = d ? (audio.currentTime / d * 100) + "%" : "0";
    const sp = q(".mp-time").children; sp[0].textContent = fmtTime(audio.currentTime); sp[1].textContent = fmtTime(d);
    if (lrc.length) {
      let i = -1;
      for (let k = 0; k < lrc.length && lrc[k].t <= audio.currentTime + .15; k++) i = k;
      if (i !== lrcIdx) {
        lrcIdx = i;
        const box = q(".mp-lrc"); box.replaceChildren();
        const now = el("div", "now", i >= 0 ? (lrc[i].text || "♪") : "♪");
        box.append(now);
        if (lrc[i + 1]) box.append(el("small", null, lrc[i + 1].text));
      }
    }
  });
  // Bars that follow the playback; the real spectrum is not readable from files on other domains
  const cv = q(".mp-viz"), c2 = cv.getContext("2d"), bars = new Float32Array(36);
  function loop() {
    cancelAnimationFrame(raf);
    const w = cv.clientWidth || 300;
    if (cv.width !== w) cv.width = w;
    const color = getComputedStyle(node).getPropertyValue("--pk-accent").trim() || "#fff";
    c2.clearRect(0, 0, cv.width, 26);
    c2.fillStyle = c2.strokeStyle = color;
    const t = performance.now() / 1000, playing = !audio.paused;
    if (m.visualizer === "wave") {
      c2.beginPath(); c2.lineWidth = 1.5;
      for (let x = 0; x <= cv.width; x += 3) { const a = playing ? (Math.sin(x * .05 + t * 6) * .5 + Math.sin(x * .013 - t * 3.3) * .5) * 9 : 0; x ? c2.lineTo(x, 13 + a) : c2.moveTo(x, 13 + a); }
      c2.stroke();
    } else {
      const n = bars.length, bw = cv.width / n;
      for (let i = 0; i < n; i++) {
        const target = playing ? .25 + .75 * Math.abs(Math.sin(t * (2 + i % 5) + i * 1.7) * Math.sin(t * 1.3 + i * .4)) : .06;
        bars[i] += (target - bars[i]) * .25;
        const h = Math.max(2, bars[i] * 24);
        c2.globalAlpha = .55 + bars[i] * .45;
        c2.fillRect(i * bw + 1, 26 - h, bw - 2, h);
      }
      c2.globalAlpha = 1;
    }
    if (playing || bars.some(b => b > .07)) raf = requestAnimationFrame(loop);
  }
  return {
    node, audio,
    update(nm) {
      const sameList = m && JSON.stringify(m.tracks.map(t => t.url)) === JSON.stringify(nm.tracks.map(t => t.url));
      const keep = m ? order[pos] : 0;
      m = structuredClone(nm);
      const P = m.player, ds = node.dataset;
      ds.st = P.style; ds.sz = P.size; ds.cov = P.cover; ds.bar = P.bar; ds.mq = P.marquee ? "1" : "0";
      ["Cover", "Title", "Time", "Bar", "Skip", "Volume", "List"].forEach(k => { ds["h" + k.toLowerCase()] = P["show" + k] ? "0" : "1"; });
      node.style.setProperty("--mp-r", P.radius + "px");
      node.style.setProperty("--mp-bga", (P.bg / 100).toFixed(2));
      if (P.color) node.style.setProperty("--mp-acc", P.color); else node.style.removeProperty("--mp-acc");
      audio.volume = m.volume / 100;
      vol.value = m.volume;
      if (!sameList) { makeOrder(null); pos = 0; load(0, false); }
      else { makeOrder(keep); lrc = m.lyrics ? parseLrc(cur().lrc) : []; lrcIdx = -1; paint(); }
      requestAnimationFrame(loop);
    },
    stop() { cancelAnimationFrame(raf); audio.pause(); },
    playing: () => !audio.paused
  };
}

/* ---------- Video widgets ---------- */

function twitchEmbed(channel) {
  const host = typeof location !== "undefined" ? location.hostname : "18k.bio";
  return { src: `https://player.twitch.tv/?channel=${encodeURIComponent(channel)}&parent=${encodeURIComponent(host)}&muted=true&autoplay=false`, height: 210 };
}
export function youtubeWidget(v) {
  const yt = youtubeEmbed(v);
  if (yt) return yt;
  const ch = String(v || "").match(/(UC[\w-]{22})/);
  return ch ? { src: `https://www.youtube-nocookie.com/embed/videoseries?list=UU${ch[1].slice(2)}`, height: 210 } : null;
}

/* ---------- Gallery ---------- */

function galleryNode(items, style, root) {
  const g = el("div", "pk-gal");
  g.dataset.style = style;
  items.forEach((it, i) => {
    const b = el("button"); b.type = "button"; b.setAttribute("aria-label", it.caption || "Apri immagine " + (i + 1));
    const img = el("img"); img.src = it.url; img.alt = it.caption || ""; img.loading = "lazy";
    b.appendChild(img);
    if (style === "stack") { b.style.transform = `translateX(${(i - (Math.min(items.length, 3) - 1) / 2) * 38}%) rotate(${(i - 1) * 7}deg)`; b.style.zIndex = 10 - i; if (i > 2) b.style.display = "none"; }
    b.addEventListener("click", () => {
      const lb = el("div", "pk-lb");
      const box = el("div");
      const big = el("img"); big.src = it.url; big.alt = it.caption || "";
      box.appendChild(big);
      if (it.caption) box.appendChild(el("p", null, it.caption));
      lb.appendChild(box);
      lb.addEventListener("click", () => lb.remove());
      root.appendChild(lb);
    });
    g.appendChild(b);
  });
  return g;
}

/* ---------- Forms: contact, newsletter, guestbook. The page passes the actions; the preview only shows them. ---------- */

function formShell(tag) { const f = el("form", "pk-form"); f.noValidate = true; f.appendChild(el("span", "tag", tag)); return f; }
function contactForm(actions) {
  const f = formShell("scrivimi");
  f.innerHTML += '<div class="row"><input name="name" maxlength="60" placeholder="Il tuo nome"><input name="contact" maxlength="120" placeholder="Email o social (per risponderti)"></div><textarea name="text" maxlength="1000" placeholder="Il tuo messaggio"></textarea><div class="row"><span class="msg"></span><button type="submit">Invia</button></div>';
  const msg = f.querySelector(".msg"), bt = f.querySelector("button");
  if (!actions?.contact) { bt.disabled = true; msg.textContent = "Anteprima: i messaggi arrivano nella dashboard."; }
  f.addEventListener("submit", async e => {
    e.preventDefault();
    if (!actions?.contact) return;
    const text = f.text.value.trim();
    if (!text) { msg.textContent = "Scrivi un messaggio."; return; }
    bt.disabled = true; msg.textContent = "Invio…";
    try { await actions.contact({ name: f.name.value.trim(), contact: f.contact.value.trim(), text }); f.reset(); msg.textContent = "Inviato. Grazie!"; }
    catch (_) { msg.textContent = "Non inviato. Riprova tra poco."; }
    bt.disabled = false;
  });
  return f;
}
function newsletterForm(actions, text) {
  const f = formShell("newsletter");
  f.appendChild(el("div", "msg", text || "Lascia la tua email: ti scrivo quando esce qualcosa di nuovo."));
  f.innerHTML += '<div class="row"><input name="email" type="email" maxlength="120" placeholder="la-tua@email.it" autocomplete="email"><button type="submit">Iscriviti</button></div><span class="msg out"></span>';
  const out = f.querySelector(".out"), bt = f.querySelector("button");
  if (!actions?.subscribe) { bt.disabled = true; out.textContent = "Anteprima: gli iscritti li vedi nella dashboard."; }
  f.addEventListener("submit", async e => {
    e.preventDefault();
    if (!actions?.subscribe) return;
    const email = f.email.value.trim().toLowerCase();
    if (!/^[^@\s]{1,64}@[^@\s]{1,120}\.[a-z]{2,}$/i.test(email)) { out.textContent = "Questa email non sembra valida."; return; }
    bt.disabled = true; out.textContent = "…";
    try { await actions.subscribe(email); f.reset(); out.textContent = "Fatto, sei iscritto."; }
    catch (_) { out.textContent = "Sei già iscritto, oppure qualcosa non va. Riprova."; }
    bt.disabled = false;
  });
  return f;
}
function guestbookNode(actions) {
  const f = formShell("guestbook");
  const list = el("div", "pk-gb"); list.appendChild(el("div", null, "Carico le firme…"));
  f.appendChild(list);
  f.innerHTML += '<div class="row"><input name="text" maxlength="200" placeholder="Lascia una firma"><button type="submit">Firma</button></div><span class="msg out"></span>';
  const out = f.querySelector(".out"), bt = f.querySelector("button"), gb = f.querySelector(".pk-gb");
  const paint = rows => {
    gb.replaceChildren(...(rows.length ? rows.map(r => {
      const d = el("div");
      const a = el("a", null, "@" + r.author); a.href = "/" + r.author;
      d.append(a, " " + r.text);
      if (r.date) d.appendChild(el("small", null, r.date));
      return d;
    }) : [el("div", null, "Ancora nessuna firma. La prima può essere la tua.")]));
  };
  if (!actions?.guestbook) { paint([{ author: "un_fan", text: "che pagina assurda", date: "esempio" }]); bt.disabled = true; out.textContent = "Anteprima: le firme arrivano dai visitatori con un account."; return f; }
  actions.guestbook.list().then(paint).catch(() => paint([]));
  f.addEventListener("submit", async e => {
    e.preventDefault();
    const text = f.text.value.trim();
    if (!text) return;
    bt.disabled = true; out.textContent = "…";
    try { await actions.guestbook.sign(text); f.reset(); out.textContent = "Firmato."; paint(await actions.guestbook.list()); }
    catch (err) { out.innerHTML = ""; if (err && err.login) { out.append("Per firmare serve un account. "); const a = el("a", null, "Accedi"); a.href = "/login.html?mode=login"; out.appendChild(a); } else out.textContent = "Non firmato. Riprova."; }
    bt.disabled = false;
  });
  return f;
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
  root.innerHTML = '<div class="pk-bg"></div><div class="pk-tint"></div><div class="pk-dim"></div><div class="pk-vig"></div><div class="pk-fx"></div><div class="pk-scroll"><article class="pk-card"></article></div>';
  const bgEl = root.querySelector(".pk-bg"), fxEl = root.querySelector(".pk-fx"), card = root.querySelector(".pk-card");
  // 3D tilt of the profile box (only when switched on, never with reduced motion)
  root.addEventListener("pointermove", e => {
    if (root.dataset.tilt !== "1" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(900px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg)`;
  });
  root.addEventListener("pointerleave", () => { card.style.transform = ""; });
  const SLOTS = ["banner", "head", "badges", "bio", "meta", "soctop", "widgets", "music", "embeds", "topic", "links", "gallery", "socbot", "forms", "tags"];
  const slot = Object.fromEntries(SLOTS.map(n => { const d = el("div", "pk-s pk-s-" + n); card.appendChild(d); return [n, d]; }));
  // Editor preview: every part of the profile is a shortcut to the setting that changes it
  if (opts.onPick) {
    root.classList.add("pk-pick");
    const partOf = t => {
      if (!t || t.closest(".pk-enter")) return null;
      // buttons work as on the real page (the card button opens the card, also in the dashboard preview)
      if (t.closest("button, input, textarea, select, audio, video, iframe, label")) return null;
      const av = t.closest(".pk-av"); if (av) return ["avatar", av];
      const nm = t.closest(".pk-name"); if (nm) return ["name", nm];
      const hd = t.closest(".pk-handle"); if (hd) return ["handle", hd];
      const ak = t.closest(".pk-aka"); if (ak) return ["aka", ak];
      const lk = t.closest(".pk-link"); if (lk && lk.dataset.li) return ["link:" + lk.dataset.li, lk];
      const so = t.closest(".pk-soc a, .pk-soc span"); if (so) return ["social:" + (so.getAttribute("aria-label") || ""), so];
      const wd = t.closest(".pk-w"); if (wd) return ["widget:" + (wd.dataset.wk || ""), wd];
      const bd = t.closest(".pk-badge"); if (bd) return ["badges", bd];
      const mp = t.closest(".pk-mp, .pk-s-music"); if (mp) return ["music", mp];
      const sl = t.closest(".pk-s"); if (sl) return [[...sl.classList].find(c => c.startsWith("pk-s-")).slice(5), sl];
      if (t.closest(".pk-card")) return ["box", card];
      return ["bg", null];
    };
    let hot = null;
    root.addEventListener("pointerover", e => {
      const p = partOf(e.target), n = p && p[1];
      if (n === hot) return;
      if (hot) hot.removeAttribute("data-pk-hot");
      hot = n; if (hot) hot.setAttribute("data-pk-hot", "");
    });
    root.addEventListener("pointerleave", () => { if (hot) hot.removeAttribute("data-pk-hot"); hot = null; });
    root.addEventListener("click", e => {
      const p = partOf(e.target);
      if (!p) return;
      e.preventDefault(); e.stopPropagation();
      opts.onPick(p[0]);
    }, true);
  }
  // Replaces a slot's children only when they actually differ, so live iframes stay put.
  const fill = (name, nodes) => {
    const box = slot[name], cur = [...box.childNodes];
    if (cur.length === nodes.length && cur.every((n, i) => n === nodes[i])) return;
    box.replaceChildren(...nodes);
  };
  const st = { bgKey: "", fxKey: "", fx: null, timers: [], keyed: new Map(), entered: !!opts.preview, first: true, audio: null, enterEl: null, trail: null, visible: true, last: input };
  const later = (fn, ms) => { const t = setTimeout(fn, ms); st.timers.push(t); return t; };
  const every = (fn, ms) => { const t = setInterval(fn, ms); st.timers.push(t); return t; };

  const io = typeof IntersectionObserver === "function" ? new IntersectionObserver(([e]) => { st.visible = e.isIntersecting; syncFx(); }) : null;
  io && io.observe(root);
  const onVis = () => syncFx();
  document.addEventListener("visibilitychange", onVis);
  function syncFx() { if (!st.fx) return; st.visible && !document.hidden ? st.fx.play() : st.fx.pause(); }

  const track = (kind, key) => { try { o.onEvent && o.onEvent(kind, key); } catch (_) { /* stats are best effort */ } };

  // Sound effects on links, socials and pictures
  const SFX_SEL = ".pk-link, .pk-soc a, .pk-gal button, .pk-mp button, .pk-clans a";
  root.addEventListener("pointerover", e => {
    const t = e.target.closest(SFX_SEL);
    if (t && !t.contains(e.relatedTarget) && st.sfx) playSfx(st.sfx.hover, st.sfx.volume);
  });
  root.addEventListener("click", e => { if (e.target.closest(SFX_SEL) && st.sfx) playSfx(st.sfx.click, st.sfx.volume); });

  // Password links: a small field opens under the button
  function toggleUnlock(btn, l) {
    const open = btn.nextElementSibling;
    if (open && open.classList.contains("pk-unlock")) { open.remove(); return; }
    const f = el("form", "pk-unlock");
    f.innerHTML = '<input type="password" placeholder="Password" autocomplete="off"><button type="submit">Apri</button>';
    f.addEventListener("submit", async e => {
      e.preventDefault();
      const pw = f.querySelector("input").value;
      let url = null;
      try { url = l.lock ? await unlockUrl(l.lock, pw) : pw === l.password ? l.url : null; } catch (_) { url = null; }
      url = safeLinkUrl(url);
      if (!url) { f.classList.remove("bad"); void f.offsetWidth; f.classList.add("bad"); return; }
      track("c", l.id);
      window.open(url, "_blank", "noopener");
      f.remove();
    });
    btn.after(f);
    f.querySelector("input").focus();
  }

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
    ensureFonts([a.font.name, a.font.body].filter(f => FONT[f]));
    loadCustomFont(a.font.custom);
    st.sfx = a.sfx;

    // Tokens
    const c = a.colors, s = root.style;
    s.setProperty("--pk-accent", c.accent); s.setProperty("--pk-text", c.text); s.setProperty("--pk-muted", c.muted);
    s.setProperty("--pk-icon", c.icon); s.setProperty("--pk-surface", c.secondary); s.setProperty("--pk-border", c.border);
    s.setProperty("--pk-card-rgb", hexRgb(c.primary)); s.setProperty("--pk-card-a", (a.card.opacity / 100).toFixed(2));
    s.setProperty("--pk-card-blur", a.card.blur + "px"); s.setProperty("--pk-card-bf", a.card.blur > 0 ? `blur(${Math.min(a.card.blur, 16)}px)` : "none"); s.setProperty("--pk-radius", a.card.radius + "px"); s.setProperty("--pk-w", a.card.width + "px"); s.setProperty("--pk-minh", a.card.minH ? a.card.minH + "px" : "0px");
    s.setProperty("--pk-name-font", fontStack(a.font.name, a)); s.setProperty("--pk-body-font", fontStack(a.font.body, a));
    s.setProperty("--pk-on-accent", readableOn(c.accent)); s.setProperty("--pk-badge", a.badges.color || c.accent); s.setProperty("--pk-banh", a.banner.height + "px");
    s.setProperty("--pk-name-scale", (a.font.nameSize / 100).toFixed(2)); s.setProperty("--pk-name-ls", (a.font.spacing / 100) + "em");
    s.setProperty("--pk-av", a.avatar.size + "px"); s.setProperty("--pk-dsz", String(a.avatar.decoSize / 100));
    s.setProperty("--pk-cx", `calc(${a.card.x / 100} * var(--pk-rw, 100vw))`); s.setProperty("--pk-cy", `calc(${a.card.y / 100} * var(--pk-rh, 100vh))`); s.setProperty("--pk-cz", String(a.card.zoom / 100)); s.setProperty("--pk-cr", a.card.rot + "deg"); s.setProperty("--pk-soc", a.socialsStyle.size + "px");
    s.setProperty("--pk-soc-align", { left: "flex-start", center: "center", right: "flex-end" }[a.socialsStyle.align]);
    s.setProperty("--pk-link-align", a.buttons.align === "left" ? "flex-start" : "center");
    s.setProperty("--pk-w-radius", a.widgetStyle.radius + "px");
    s.setProperty("--pk-accent-on", readableOn(a.colors.accent));

    s.setProperty("--pk-g1", a.nameGradient[0]); s.setProperty("--pk-g2", a.nameGradient[1]);
    s.setProperty("--pk-dim", (a.bg.dim / 100).toFixed(2)); s.setProperty("--pk-bgblur", a.bg.blur + "px");
    s.setProperty("--pk-bgx", a.bg.x + "%"); s.setProperty("--pk-bgy", a.bg.y + "%"); s.setProperty("--pk-bgz", (a.bg.zoom / 100).toFixed(2));
    s.setProperty("--pk-bggray", (a.bg.gray / 100).toFixed(2)); s.setProperty("--pk-bgsat", (a.bg.sat / 100).toFixed(2));
    s.setProperty("--pk-tint", a.bg.tint); s.setProperty("--pk-tinta", (a.bg.tintA / 100).toFixed(2)); s.setProperty("--pk-vig", (a.bg.vignette / 100).toFixed(2));
    const ds = root.dataset;
    ds.wstyle = a.widgetStyle.style; ds.wsize = a.widgetStyle.size; ds.wtag = a.widgetStyle.accentTag ? "1" : "0"; ds.banim = a.buttons.anim;
    s.setProperty("--pk-bw", a.card.borderWidth + "px"); s.setProperty("--pk-pad", a.card.padding + "px");
    s.setProperty("--pk-gang", a.card.gradAngle + "deg");
    if (a.card.grad2) s.setProperty("--pk-g2", a.card.grad2); else s.removeProperty("--pk-g2");
    if (a.card.borderColor) s.setProperty("--pk-bc", a.card.borderColor);
    s.setProperty("--pk-cshadow", { none: "none", soft: "0 18px 50px rgba(0,0,0,.45)", strong: "0 30px 90px rgba(0,0,0,.85)", glow: `0 0 44px color-mix(in srgb, ${a.colors.accent} 45%, transparent)` }[a.card.shadow]);
    ds.bcustom = a.card.borderColor ? "1" : "0"; ds.calign = a.card.align; ds.cpos = a.card.pos; ds.tilt = a.card.tilt ? "1" : "0";
    ds.layout = a.layout; ds.border = a.card.border; ds.cardgrad = a.card.gradient ? "1" : "0"; ds.avshape = a.avatar.shape; ds.avring = a.avatar.ring;
    ds.upper = a.font.upper ? "1" : "0"; ds.soc = a.socialsStyle.style; ds.hover = a.buttons.hover; ds.bstyle = a.badges.style;
    ds.gname = a.glow.username ? "1" : "0"; ds.gsoc = a.glow.socials ? "1" : "0"; ds.gbadges = a.glow.badges ? "1" : "0"; ds.glinks = a.glow.links ? "1" : "0";
    applyButtons(s, a);
    setCursor(a);

    // Background (rebuilt only when it changes)
    // Only what changes the media rebuilds it; sliders (position, zoom, filters, tint) are CSS variables
    const bgKey = JSON.stringify([a.bg.type, a.bg.color, a.bg.gradient, a.bg.image, a.bg.video, a.bg.poster, a.bg.fit]);
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
        else {
          const img = el("img"); img.src = a.bg.image; img.alt = ""; img.decoding = "async";
          // a GIF or photo that no longer exists: fall back to the profile colours instead of a black hole
          img.addEventListener("error", () => { img.remove(); bgEl.style.background = grad; }, { once: true });
          bgEl.appendChild(img);
        }
      }
      if (a.bg.type === "video" && a.bg.video) {
        const v = el("video"); if (a.bg.poster) v.poster = a.bg.poster; v.src = a.bg.video; v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true; v.setAttribute("playsinline", "");
        v.addEventListener("error", () => { v.remove(); bgEl.style.background = a.bg.poster ? `url("${a.bg.poster.replace(/"/g, "%22")}") center/cover, ${grad}` : grad; }, { once: true });
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
    const ban = a.banner;
    if ((ban.type === "image" || ban.type === "video") && ban.url) {
      fill("banner", [keyedNode("ban:" + ban.type + ban.url, () => {
        const b = el("div", "pk-ban");
        const m = el(ban.type === "video" ? "video" : "img");
        m.src = ban.url;
        if (ban.type === "video") { m.muted = true; m.loop = true; m.autoplay = true; m.playsInline = true; m.setAttribute("playsinline", ""); m.play?.().catch(() => {}); } else m.alt = "";
        b.appendChild(m);
        return b;
      })]);
    } else fill("banner", a.layout === "banner" ? [el("div", "pk-banner")] : []);
    const head = el("div", "pk-head");
    if (a.avatar.show) {
      const av = el("div", "pk-av" + (a.avatar.deco === "glitch" ? " deco-glitch" : ""));
      if (p.avatarUrl) { const img = el("img"); img.src = p.avatarUrl; img.alt = ""; av.appendChild(img); }
      else av.textContent = p.handle[0].toUpperCase();
      // Discord avatar and decoration through Lanyard
      if (a.widgets.discordPresence && (a.avatar.discord || a.avatar.discordDeco) && a.widgets.discordId) {
        const id = a.widgets.discordId;
        cached("ly:" + id, 30000, () => getJSON(`https://api.lanyard.rest/v1/users/${id}`)).then(j => {
          const u = j && j.success && j.data && j.data.discord_user;
          if (!u || !av.isConnected) return;
          if (a.avatar.discord && u.avatar) { av.textContent = ""; const img = el("img"); img.src = `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.${u.avatar.startsWith("a_") ? "gif" : "png"}?size=256`; img.alt = ""; av.prepend(img); }
          const asset = u.avatar_decoration_data && u.avatar_decoration_data.asset;
          if (a.avatar.discordDeco && asset) { const d = el("img", "pk-dc-deco"); d.src = `https://cdn.discordapp.com/avatar-decoration-presets/${asset}.png?size=240&passthrough=true`; d.alt = ""; av.appendChild(d); }
        }).catch(() => {});
      }
      if (a.avatar.deco === "custom" && a.avatar.decoUrl) { const d = el("img", "pk-av-cdeco"); d.src = a.avatar.decoUrl; d.alt = ""; d.decoding = "async"; av.appendChild(d); }
      const deco = decoNode(a.avatar.deco);
      if (deco) av.appendChild(deco);
      head.appendChild(av);
    }
    const nameBox = el("div", "pk-name-wrap");
    const nameEl = el("h1", "pk-name");
    const name = p.displayName || p.handle;
    nameEl.dataset.text = name;
    nameBox.appendChild(nameEl);
    nameBox.appendChild(el("div", "pk-handle", "@" + p.handle));
    if (p.aka) nameBox.appendChild(el("div", "pk-aka", "aka " + p.aka.split("/").join(" / ")));
    if (p.clans.length) {
      const cl = el("div", "pk-clans");
      [p.primaryClan, ...p.clans.filter(t => t !== p.primaryClan)].forEach(t => {
        const x = el("a", t === p.primaryClan ? "primary" : "", "[" + t + "]");
        x.href = "/clan.html?tag=" + t; x.title = t === p.primaryClan ? "Clan principale" : "Clan";
        cl.appendChild(x);
      });
      nameBox.appendChild(cl);
    }
    head.appendChild(nameBox);
    fill("head", [head]);
    nameText(nameEl, name, a);

    const badges = [];
    const cb = a.badges.custom;
    if (a.badges.show && !a.privacy.hideBadges && (p.badges.length || (cb.on && cb.label))) {
      const bx = el("div", "pk-badges");
      p.badges.forEach(b => { const [tip, path] = BADGES[b]; const n = el("span", "pk-badge"); n.dataset.tip = tip; n.innerHTML = svg(path, 13); bx.appendChild(n); });
      if (cb.on && cb.label) {
        const n = el("span", "pk-badge custom");
        n.innerHTML = svg(BADGE_ICONS[cb.icon], 12);
        n.append(cb.label);
        if (cb.color) n.style.setProperty("--pk-cb", cb.color);
        bx.appendChild(n);
      }
      badges.push(bx);
    }
    fill("badges", badges);

    const lines = a.bioLines.length ? a.bioLines : p.bio ? p.bio.split("\n").filter(Boolean) : [];
    if (lines.length || p.bio) {
      const bio = el("p", "pk-bio pk-rt");
      const plainLines = lines.map(plainText);
      if (a.bioFx === "typewriter" && plainLines.length && !reduceMotion()) typewriter(bio, plainLines, a.typeSpeed);
      else if (a.bioFx === "cycle" && plainLines.length > 1 && !reduceMotion()) cycleLines(bio, plainLines);
      else if (a.bioFx === "wave" && !reduceMotion()) { bio.classList.add("fx-wave"); splitChars(bio, plainText(p.bio || lines[0])); }
      else { richText(bio, p.bio || lines.join("\n")); if (a.bioFx === "glitch" || a.bioFx === "rainbow") bio.classList.add("fx-" + a.bioFx); }
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
      const url = socialHref(sd, raw);
      const n = el(url ? "a" : "span");
      if (url) { n.href = url; n.target = "_blank"; n.rel = "noopener noreferrer"; n.addEventListener("click", () => track("s", sd.key)); }
      n.title = url ? sd.label : `${sd.label}: ${raw}`;
      n.setAttribute("aria-label", sd.label);
      const i = el("i"); i.style.setProperty("--ico", `url("${socialIcon(sd)}")`); i.style.setProperty("--brand", sd.color);
      n.appendChild(i);
      socials.appendChild(n);
    });
    const hasSocials = socials.childNodes.length > 0;
    fill("soctop", hasSocials && a.socialsStyle.position === "top" ? [socials] : []);
    fill("socbot", hasSocials && a.socialsStyle.position === "bottom" ? [socials] : []);

    const widgets = [], W = a.widgets, PO = W.pics;
    PIC_OVER = PO;
    const wk = (k, v) => picKey(k, PO[k]) + ":" + v;
    if (W.discordPresence && W.discordId) widgets.push(keyedNode(wk("dc", W.discordId), () => discordWidget(W.discordId)));
    if (a.lastfm.show && a.lastfm.user) widgets.push(keyedNode(wk("lf", a.lastfm.user), () => lastfmWidget(a.lastfm.user)));
    if (W.github) widgets.push(keyedNode(wk("gh", W.github), () => githubWidget(W.github)));
    if (W.discordServer) widgets.push(keyedNode(wk("ds", W.discordServer), () => discordServerWidget(W.discordServer)));
    if (W.roblox) widgets.push(keyedNode(wk("rb", W.roblox), () => robloxWidget(W.roblox)));
    if (W.weather) widgets.push(keyedNode(wk("wx", W.weather), () => weatherWidget(W.weather)));
    if (W.countdown.date) widgets.push(keyedNode(wk("cd", W.countdown.date + W.countdown.label), () => countdownWidget(W.countdown)));
    if (W.mood) widgets.push(keyedNode(wk("md", W.mood), () => moodWidget(W.mood)));
    if (W.note) widgets.push(keyedNode(wk("nt", W.note), () => noteWidget(W.note)));
    fill("widgets", widgets);

    const m = a.music, music = [];
    if (m.type === "spotify" && spotifyEmbed(m.url)) music.push(keyedNode("sp:" + m.url, () => embed(spotifyEmbed(m.url), "Spotify")));
    // SoundCloud and YouTube: their player, hidden when asked (it keeps playing), controlled with their own API
    const sc = m.type === "soundcloud" && soundcloudEmbed(m.url), yt = m.type === "youtube" && youtubeEmbed(m.url);
    if (sc || yt) {
      const info = sc ? { ...sc } : { ...yt, src: yt.src + "?enablejsapi=1&playsinline=1&rel=0" + (typeof location !== "undefined" ? "&origin=" + encodeURIComponent(location.origin) : "") };
      const node = keyedNode((sc ? "sc:" : "yt:") + m.url, () => embed(info, sc ? "SoundCloud" : "YouTube"));
      node.classList.toggle("pk-embed-hidden", !m.showPlayer);
      const fr = node.querySelector("iframe"); if (fr) fr.loading = "eager";
      node.dataset.kind = sc ? "sc" : "yt";
      music.push(node);
    }
    // Deezer songs (from the search) play in the 18k player: their 30-second preview, through a stable link
    const dz = m.type === "deezer" && String(m.url).match(/deezer\.com\/(?:[a-z]{2}\/)?track\/(\d{1,15})/i);
    const am = dz ? { ...m, tracks: [{ url: `${typeof location !== "undefined" ? location.origin : "https://18kbio.xyz"}/api/music-search?preview=${dz[1]}`, title: (m.title || "").split(" — ")[0], artist: (m.title || "").split(" — ")[1] || "", cover: m.cover || "", lrc: "" }] } : m;
    if (m.type === "deezer" && !dz && deezerEmbed(m.url)) music.push(keyedNode("dz:" + m.url, () => embed(deezerEmbed(m.url), "Deezer")));
    if ((m.type === "audio" || dz) && am.tracks.length) {
      const node = keyedNode("mp", () => { const x = playlistPlayer(track); x.node.player = x; return x.node; });
      const pl = node.player;
      pl.update(am);
      st.audio = pl.audio;
      node.style.display = m.showPlayer ? "" : "none";
      music.push(node);
      // the record / cassette turns only while playing
      if (!pl.audio.__on) { pl.audio.__on = 1; pl.audio.addEventListener("play", () => node.classList.add("is-on")); pl.audio.addEventListener("pause", () => node.classList.remove("is-on")); }
    } else st.audio = null;
    fill("music", music);
    // Where the music sits: moved inside the card, or floating in a corner of the page
    {
      const ms = slot.music, where = m.pos;
      ms.classList.toggle("mp-float", where.startsWith("float"));
      ms.classList.toggle("r", where === "float-r"); ms.classList.toggle("l", where === "float-l");
      const ref = { top: slot.banner.nextSibling, name: slot.badges, bio: slot.meta, bottom: null }[where];
      if (where.startsWith("float")) { if (ms.parentNode !== root) root.appendChild(ms); }
      else if (where === "bottom") { if (ms.parentNode !== card || card.lastChild !== ms) card.appendChild(ms); }
      else if (ref && ref !== ms && ms.nextSibling !== ref) card.insertBefore(ms, ref);
    }
    // Starts by itself: right away if the browser lets it, otherwise at the first touch, click, key or scroll
    if (!opts.preview && m.autoplay && !st.autoArmed && (!needsEnter(a) || st.entered)) {
      const au = st.audio, frame = slot.music.querySelector(".pk-embed[data-kind] iframe");
      if (au || frame) {
        st.autoArmed = true;
        const evs = ["pointerdown", "keydown", "touchstart", "wheel"];
        const off = () => evs.forEach(e => removeEventListener(e, go, true));
        const go = () => { off(); startMusic(); };
        const arm = () => evs.forEach(e => addEventListener(e, go, { capture: true, passive: true }));
        if (au) au.play().then(off).catch(arm);
        else { startMusic(); arm(); }
      }
    }

    const embeds = [];
    if (a.widgets.spotify && spotifyEmbed(a.widgets.spotify)) embeds.push(keyedNode("spw:" + a.widgets.spotify, () => embed(spotifyEmbed(a.widgets.spotify), "Spotify")));
    if (a.widgets.twitch) embeds.push(keyedNode("tw:" + a.widgets.twitch, () => embed(twitchEmbed(a.widgets.twitch), "Twitch")));
    const ytw = youtubeWidget(a.widgets.youtube);
    if (ytw) embeds.push(keyedNode("ytw:" + ytw.src, () => embed(ytw, "YouTube")));
    fill("embeds", embeds);

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

    const now = new Date();
    const links = p.links.filter(l => !l.hidden && l.title && (l.type === "header" || l.lock || (l.password && safeLinkUrl(l.url)) || safeLinkUrl(l.url)) && (o.preview || linkLive(l, now)));
    if (links.length) {
      const box = el("div", "pk-links");
      links.forEach(l => {
        if (l.type === "header") { box.appendChild(el("div", "pk-sec", l.title)); return; }
        const locked = !!(l.lock || l.password);
        const url = locked ? null : safeLinkUrl(l.url);
        const n = el("a", "pk-link" + (l.featured ? " featured" : "") + (linkLive(l, now) ? "" : " soon"));
        n.dataset.li = p.links.indexOf(l);
        if (url) { n.href = url; n.target = "_blank"; n.rel = "noopener noreferrer"; }
        else n.href = "#";
        const iconUrl = url || (l.password && safeLinkUrl(l.url));
        if (a.buttons.icons && iconUrl && /^https?:/.test(iconUrl) && !l.lock) {
          const ic = el("img"); ic.alt = ""; ic.loading = "lazy";
          ic.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(new URL(iconUrl).hostname)}&sz=64`;
          ic.addEventListener("error", () => ic.remove(), { once: true });
          n.appendChild(ic);
        }
        n.append(l.title);
        if (!linkLive(l, now)) n.appendChild(el("small", null, l.start && new Date(l.start) > now ? "dal " + new Date(l.start).toLocaleDateString("it-IT", { day: "numeric", month: "short" }) : "scaduto"));
        if (locked) {
          const lk = el("span", "lk"); lk.innerHTML = svg('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>', 14); n.appendChild(lk);
          n.addEventListener("click", e => { e.preventDefault(); toggleUnlock(n, l); });
        } else n.addEventListener("click", () => track("c", l.id));
        box.appendChild(n);
      });
      fill("links", [box]);
    } else fill("links", []);

    fill("gallery", a.widgets.gallery && p.gallery.length ? [keyedNode("gal:" + a.widgets.galleryStyle + JSON.stringify(p.gallery), () => galleryNode(p.gallery, a.widgets.galleryStyle, root))] : []);

    const forms = [];
    if (a.widgets.guestbook) forms.push(keyedNode("gb", () => guestbookNode(o.actions)));
    if (a.widgets.contact) forms.push(keyedNode("ct", () => contactForm(o.actions)));
    if (a.widgets.newsletter) forms.push(keyedNode("nl:" + a.widgets.newsletterText, () => newsletterForm(o.actions, a.widgets.newsletterText)));
    fill("forms", forms);

    const tagNodes = [];
    if (p.tags.length) {
      const tg = el("div", "pk-tags");
      p.tags.forEach(t => tg.appendChild(el("span", null, t)));
      tagNodes.push(tg);
    }
    // The identity card made in the dashboard: a button that shows it full screen
    // Shown also before the card is designed (the default card), unless it was switched off
    if (!p.card || p.card.on !== false) {
      tagNodes.push(keyedNode("cardbtn", () => {
        const b = el("button", "pk-cardbtn");
        b.type = "button"; b.setAttribute("aria-label", "Apri la carta");
        b.innerHTML = '<svg width="16" height="12" viewBox="0 0 24 18" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="1" y="1" width="22" height="16" rx="3"/><path d="M5 12h7M5 8h4"/></svg><span>mostra la mia carta</span>';
        b.addEventListener("click", () => {
          const cur = st.last;
          import("./card-kit.js").then(m => m.openCardViewer(cur.card, { handle: cur.handle, avatarUrl: cur.avatarUrl, displayName: cur.displayName }));
        });
        return b;
      }));
    }
    fill("tags", tagNodes);

    st.keyed.forEach((v, k) => { if (!v.used) { v.node.querySelectorAll("audio,video").forEach(x => x.pause()); v.node.player?.stop(); st.keyed.delete(k); } });

    // Entrance (first render only) and enter splash
    if (st.first && o.entrance && a.entrance !== "none" && !reduceMotion()) {
      const cls = "in-" + a.entrance;
      card.classList.add(cls);
      later(() => card.classList.remove(cls), 1200);
    }
    st.first = false;
    if (needsEnter(a) && !st.entered) showEnter(a);
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
    if (["wave", "bounce", "shake"].includes(a.nameFx) && !reduceMotion()) splitChars(nameEl, name);
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

  function cycleLines(node, lines) {
    const G = "abcdefghijklmnopqrstuvwxyz#$%&@";
    let li = 0;
    node.textContent = lines[0];
    const swap = () => {
      li = (li + 1) % lines.length;
      const target = [...lines[li]], start = performance.now();
      const tick = () => {
        const p = Math.min(1, (performance.now() - start) / 600);
        node.textContent = target.map((ch, i) => (i / target.length < p || ch === " ") ? ch : G[(Math.random() * G.length) | 0]).join("");
        if (p < 1) later(tick, 35); else later(swap, 2800);
      };
      tick();
    };
    later(swap, 2800);
  }

  function showEnter(a) {
    if (!st.enterEl) {
      st.enterEl = el("button", "pk-enter");
      st.enterEl.type = "button";
      st.enterEl.appendChild(el("span"));
      st.enterEl.addEventListener("click", () => {
        st.entered = true;
        st.enterEl.classList.add("out");
        if (!o.preview && st.lastAutoplay) startMusic();
        o.onEnter && o.onEnter();
      });
      root.appendChild(st.enterEl);
    }
    st.lastAutoplay = ["audio", "deezer", "youtube", "soundcloud"].includes(a.music.type) && a.music.autoplay;
    st.enterEl.dataset.style = a.enter.style;
    st.enterEl.firstChild.textContent = a.enter.text;
    st.enterEl.classList.remove("out");
  }
  // Starts whatever music the profile has: the 18k player, or YouTube / SoundCloud through their player API
  function startMusic() {
    if (st.audio) { if (st.audio.paused) st.audio.play().catch(() => {}); return; }
    const box = slot.music.querySelector(".pk-embed[data-kind]"), f = box && box.querySelector("iframe");
    if (!f || !f.contentWindow) return;
    const vol = (st.last && st.last.appearance && st.last.appearance.music && st.last.appearance.music.volume) || 60;
    if (box.dataset.kind === "yt") {
      ["unMute", "playVideo"].forEach(func => f.contentWindow.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*"));
      f.contentWindow.postMessage(JSON.stringify({ event: "command", func: "setVolume", args: [vol] }), "*");
    } else {
      f.contentWindow.postMessage(JSON.stringify({ method: "setVolume", value: vol }), "*");
      f.contentWindow.postMessage(JSON.stringify({ method: "play" }), "*");
    }
  }
  function hideEnter(instant) {
    if (!st.enterEl) return;
    if (instant) { st.enterEl.remove(); st.enterEl = null; }
  }

  // Custom cursor: the click point ("hotspot") must be where the image really points,
  // otherwise the arrow you see and the real mouse don't match.
  function setCursor(a) {
    if (a.cursor.type === "crosshair") { root.style.cursor = "crosshair"; return; }
    if (a.cursor.type !== "custom" || !a.cursor.url) { root.style.cursor = ""; return; }
    const url = a.cursor.url, mode = a.cursor.hot, key = mode + "|" + url;
    const apply = h => { root.style.cursor = `url("${url.replace(/"/g, "%22")}") ${h[0]} ${h[1]}, auto`; };
    if (HOT[key]) { apply(HOT[key]); return; }
    apply([0, 0]);
    st.curKey = key;
    cursorHot(url, mode).then(h => { HOT[key] = h; if (st.curKey === key) apply(h); });
  }

  function setupTrail(a) {
    const want = a.cursor.trail !== "none" && finePointer() && !reduceMotion() ? a.cursor.trail : "none";
    if (st.trail && st.trail.kind === want) return;
    if (st.trail) { st.trail.stop(); st.trail = null; }
    if (want === "none") return;
    const dots = Array.from({ length: want === "ghost" ? 5 : 10 }, () => { const d = el("span", "pk-trail " + want); d.style.opacity = "0"; root.appendChild(d); return d; });
    const pts = dots.map(() => ({ x: 0, y: 0 }));
    let tx = -99, ty = -99, raf = 0, active = false;
    const move = e => { const r = root.getBoundingClientRect(); const sx = r.width / (root.offsetWidth || r.width) || 1, sy = r.height / (root.offsetHeight || r.height) || 1; tx = (e.clientX - r.left) / sx; ty = (e.clientY - r.top) / sy; if (!active) { active = true; raf = requestAnimationFrame(tick); } };
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
  // the size of the profile area itself (not the browser window): "sposta" moves by a % of it,
  // so the dashboard preview and the real page move the same way
  if (typeof ResizeObserver === "function") {
    const sizeVars = () => { root.style.setProperty("--pk-rw", root.clientWidth + "px"); root.style.setProperty("--pk-rh", root.clientHeight + "px"); };
    sizeVars(); new ResizeObserver(sizeVars).observe(root);
  }
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
      st.keyed.forEach(v => { v.node.querySelectorAll("audio,video").forEach(x => x.pause()); v.node.player?.stop(); });
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
  s.setProperty("--btn-bg", v === "solid" ? col : v === "glass" ? "color-mix(in srgb," + col + " 22%, rgba(0,0,0,.28))" : "transparent");
  s.setProperty("--btn-fg", v === "solid" ? fg : v === "glass" ? c.text : col);
  s.setProperty("--btn-border", v === "outline" ? `1px solid ${col}` : v === "glass" ? `1px solid color-mix(in srgb, ${col} 35%, transparent)` : v === "ghost" ? "1px solid transparent" : `1px solid ${col}`);
  s.setProperty("--btn-blur", "none");
  s.setProperty("--btn-radius", { square: "4px", rounded: "14px", pill: "999px" }[b.shape]);
  s.setProperty("--btn-h", { s: "42px", m: "50px", l: "60px" }[b.size]);
  s.setProperty("--btn-fs", { s: "13px", m: "14px", l: "16px" }[b.size]);
  s.setProperty("--btn-font", b.font === "name" ? "var(--pk-name-font)" : b.font === "mono" ? "'Geist Mono',ui-monospace,monospace" : "var(--pk-body-font)");
  s.setProperty("--btn-tt", b.upper ? "uppercase" : "none"); s.setProperty("--btn-ls", b.upper ? ".06em" : "0");
  if (b.gradient) s.setProperty("--btn-bg", `linear-gradient(120deg, ${col}, ${c.accent === col ? c.primary : c.accent})`);
  if (v !== "ghost") s.setProperty("--btn-border", b.border ? (v === "outline" ? `${b.border}px solid ${col}` : `${b.border}px solid color-mix(in srgb, ${col} ${v === "glass" ? 35 : 100}%, transparent)`) : "0 solid transparent");
  s.setProperty("--btn-shadow", { none: "none", soft: "0 8px 24px rgba(0,0,0,.35)", glow: `0 0 24px color-mix(in srgb, ${col} 45%, transparent)`, hard: `4px 4px 0 ${c.border}` }[b.shadow]);
}

// Black or white text, whichever reads better on the given colour.
export function readableOn(hex) {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return .2126 * r + .7152 * g + .0722 * b > .4 ? "#000000" : "#ffffff";
}

/* ---------- Public profile fields (what the public mirror stores) ---------- */
// Links with a password must be locked with lockLinks() before they get here: the password never goes public.
export function publicFields(p) {
  const n = normalizeProfile(p);
  return {
    handle: n.handle, displayName: n.displayName, bio: n.bio, tags: n.tags, location: n.location, aka: n.aka,
    avatarUrl: n.avatarUrl.startsWith("data:") ? "" : n.avatarUrl,
    links: n.links.filter(l => !l.hidden && (!l.password || l.lock)).map(({ password, ...l }) => l),
    socials: n.socials, badges: n.badges, clans: n.clans, primaryClan: n.primaryClan,
    gallery: n.gallery.filter(g => !g.url.startsWith("data:")).map(({ url, caption }) => ({ url, caption })),
    weekly: n.weekly, card: cardPublic(n.card), appearance: n.appearance
  };
}

/* ---------- Password links: the url is encrypted with the password, AES-GCM ---------- */
const b64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function linkKey(pw, salt) {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 120000, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}
export async function lockUrl(url, pw) {
  const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await linkKey(pw, salt), new TextEncoder().encode(url));
  return { s: b64(salt), iv: b64(iv), ct: b64(ct) };
}
export async function unlockUrl(lock, pw) {
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(lock.iv) }, await linkKey(pw, unb64(lock.s)), unb64(lock.ct));
  return new TextDecoder().decode(pt);
}
// Returns a copy of the links with every password link encrypted (and its url removed)
export async function lockLinks(links) {
  return Promise.all((links || []).map(async l => {
    const n = normLink(l);
    if (!n.password || !n.url) return { ...n, lock: null };
    return { ...n, url: "", lock: await lockUrl(n.url, n.password) };
  }));
}
