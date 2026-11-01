/* 404.bio card kit.
   The identity card people design in the dashboard (Carta) and show on their profile.
   One renderer for the editor, the profile button and the full screen view. */

import { FONTS, safeUrl, safeColor, clamp, ensureFonts } from "./profile-kit.js";

const isObj = v => v && typeof v === "object" && !Array.isArray(v);

export const CARD_PATTERNS = [["none", "Niente"], ["grain", "Grana"], ["dots", "Puntini"], ["grid", "Griglia"], ["lines", "Righe"], ["scan", "Scanline"], ["dither", "Dither"], ["stars", "Stelle"], ["checker", "Scacchi"]];
export const CARD_BORDERS = [["none", "Nessuno"], ["line", "Linea"], ["double", "Doppio"], ["neon", "Neon"], ["chrome", "Cromo"]];
export const CARD_NAME_POS = [["bl", "In basso"], ["tl", "In alto"], ["c", "Al centro"], ["br", "A destra"]];
export const STICKER_STYLES = [["diecut", "Sticker (bordo bianco)"], ["plain", "Solo ombra"], ["round", "Tondo"], ["polaroid", "Polaroid"], ["glow", "Bagliore"]];
export const STICKER_EMOJI = ["★", "♥", "✦", "☾", "⚡", "☠", "♛", "✿", "☯", "♠", "404", "XO", "OK", "#1"];

export const DEFAULT_CARD = {
  on: true,
  preset: "nero",
  bg: { type: "gradient", color: "#0b0b0b", kind: "linear", angle: 135, stops: ["#1c1c1c", "#000000", "#3a3a3a"], image: "", dim: 20, blur: 0, gray: false, zoom: 100, x: 50, y: 50 },
  rays: { on: false, color: "#ffffff", count: 14, x: 85, y: 0, strength: 30, spin: true },
  holo: { on: true, strength: 35 },
  shine: { on: true },
  pattern: "grain", patternAmt: 35,
  border: "line", borderColor: "#ffffff", radius: 18,
  glow: { on: false, color: "#ffffff", size: 30 },
  font: "geist", nameSize: 100, upper: false, spacing: 0,
  textColor: "#ffffff", accent: "#ffffff",
  namePos: "bl",
  showBrand: true, showAvatar: true, showNumber: true, showDate: true,
  number: "", line: "",
  stickers: []
};

// Ready-made looks; everything stays editable after
export const CARD_PRESETS = [
  { id: "nero", name: "Nero", c: {} },
  { id: "cromo", name: "Cromo", c: { bg: { type: "gradient", kind: "conic", angle: 30, stops: ["#f5f5f5", "#6f6f6f", "#fdfdfd", "#3c3c3c"] }, textColor: "#0b0b0b", accent: "#0b0b0b", pattern: "none", border: "chrome", holo: { on: true, strength: 55 } } },
  { id: "aurora", name: "Aurora", c: { bg: { type: "gradient", kind: "radial", stops: ["#2dffb3", "#0b3d55", "#05050f"] }, rays: { on: true, color: "#b9fff0", count: 10, x: 20, y: 0, strength: 25, spin: true }, pattern: "stars", patternAmt: 40 } },
  { id: "neon", name: "Neon", c: { bg: { type: "gradient", kind: "linear", angle: 160, stops: ["#12001f", "#3d0066", "#00264d"] }, accent: "#ff3df2", border: "neon", borderColor: "#ff3df2", glow: { on: true, color: "#ff3df2", size: 30 }, font: "audiowide", pattern: "scan", patternAmt: 30 } },
  { id: "tramonto", name: "Tramonto", c: { bg: { type: "gradient", kind: "linear", angle: 200, stops: ["#ff7e5f", "#feb47b", "#6a2c70"] }, rays: { on: true, color: "#fff1d6", count: 18, x: 50, y: 110, strength: 35, spin: false }, font: "instrument", pattern: "grain" } },
  { id: "ghiaccio", name: "Ghiaccio", c: { bg: { type: "gradient", kind: "radial", stops: ["#1b2a36", "#0a1016", "#000000"] }, accent: "#bfe7ff", textColor: "#f2fbff", rays: { on: true, color: "#cfeaff", count: 22, x: 80, y: 10, strength: 30, spin: true }, holo: { on: true, strength: 60 }, font: "anton", upper: true, spacing: 2 } },
  { id: "oro", name: "Oro", c: { bg: { type: "gradient", kind: "linear", angle: 120, stops: ["#3a2a06", "#d4a017", "#fff3b0", "#7a5a10"] }, textColor: "#1a1204", accent: "#1a1204", border: "double", borderColor: "#fff3b0", pattern: "lines", patternAmt: 20, font: "bodoni" } },
  { id: "gotico", name: "Gotico", c: { bg: { type: "color", color: "#050505" }, font: "unifraktur", nameSize: 120, pattern: "dither", patternAmt: 40, border: "double" } },
  { id: "pixel", name: "Pixel", c: { bg: { type: "gradient", kind: "linear", angle: 180, stops: ["#101024", "#24244a"] }, font: "silkscreen", accent: "#ffd23f", textColor: "#ffffff", pattern: "checker", patternAmt: 25, radius: 4, holo: { on: false, strength: 0 } } },
  { id: "rosa", name: "Rosa", c: { bg: { type: "gradient", kind: "linear", angle: 135, stops: ["#fbc2eb", "#a6c1ee"] }, textColor: "#3d2350", accent: "#ff5c8d", font: "cherry", pattern: "dots", patternAmt: 30, radius: 26 } }
];

function merge(base, over) {
  const out = Array.isArray(base) ? base.slice() : { ...base };
  if (!isObj(over)) return out;
  for (const [k, v] of Object.entries(over)) out[k] = isObj(v) && isObj(base[k]) ? merge(base[k], v) : v;
  return out;
}
const pick = (v, list, f) => list.some(x => x[0] === v) ? v : f;

export function normalizeSticker(s) {
  if (!isObj(s)) return null;
  const kind = s.kind === "text" ? "text" : "img";
  const out = {
    id: String(s.id || Math.random().toString(36).slice(2, 9)).slice(0, 12), kind,
    x: clamp(s.x, -10, 110, 50), y: clamp(s.y, -10, 110, 50), s: clamp(s.s, 5, 120, 30), r: clamp(s.r, -180, 180, 0),
    style: pick(s.style, STICKER_STYLES, "diecut"), z: clamp(s.z, 0, 99, 1), flip: !!s.flip
  };
  if (kind === "img") { out.src = safeUrl(s.src, true) || ""; if (!out.src) return null; }
  else { out.text = String(s.text || "★").slice(0, 6); out.color = safeColor(s.color, "#ffffff"); }
  return out;
}

export function normalizeCard(raw) {
  const c = merge(DEFAULT_CARD, isObj(raw) ? raw : {});
  const d = DEFAULT_CARD;
  c.on = c.on !== false;
  c.bg.type = ["color", "gradient", "image"].includes(c.bg.type) ? c.bg.type : "gradient";
  c.bg.color = safeColor(c.bg.color, d.bg.color);
  c.bg.kind = ["linear", "radial", "conic"].includes(c.bg.kind) ? c.bg.kind : "linear";
  c.bg.angle = clamp(c.bg.angle, 0, 360, 135);
  c.bg.stops = (Array.isArray(c.bg.stops) ? c.bg.stops : []).map(x => safeColor(x, null)).filter(Boolean).slice(0, 5);
  if (c.bg.stops.length < 2) c.bg.stops = d.bg.stops.slice();
  c.bg.image = safeUrl(c.bg.image, true) || "";
  c.bg.dim = clamp(c.bg.dim, 0, 90, 20); c.bg.blur = clamp(c.bg.blur, 0, 20, 0); c.bg.gray = !!c.bg.gray;
  c.bg.zoom = clamp(c.bg.zoom, 100, 300, 100); c.bg.x = clamp(c.bg.x, 0, 100, 50); c.bg.y = clamp(c.bg.y, 0, 100, 50);
  c.rays.on = !!c.rays.on; c.rays.color = safeColor(c.rays.color, "#ffffff"); c.rays.count = clamp(c.rays.count, 4, 40, 14);
  c.rays.x = clamp(c.rays.x, -20, 120, 85); c.rays.y = clamp(c.rays.y, -20, 120, 0); c.rays.strength = clamp(c.rays.strength, 0, 100, 30); c.rays.spin = !!c.rays.spin;
  c.holo.on = !!c.holo.on; c.holo.strength = clamp(c.holo.strength, 0, 100, 35);
  c.shine.on = !!c.shine.on;
  c.pattern = pick(c.pattern, CARD_PATTERNS, "grain"); c.patternAmt = clamp(c.patternAmt, 0, 100, 35);
  c.border = pick(c.border, CARD_BORDERS, "line"); c.borderColor = safeColor(c.borderColor, "#ffffff"); c.radius = clamp(c.radius, 0, 40, 18);
  c.glow.on = !!c.glow.on; c.glow.color = safeColor(c.glow.color, "#ffffff"); c.glow.size = clamp(c.glow.size, 0, 80, 30);
  c.font = FONTS.some(f => f[0] === c.font) ? c.font : "geist";
  c.nameSize = clamp(c.nameSize, 50, 200, 100); c.upper = !!c.upper; c.spacing = clamp(c.spacing, -2, 10, 0);
  c.textColor = safeColor(c.textColor, "#ffffff"); c.accent = safeColor(c.accent, "#ffffff");
  c.namePos = pick(c.namePos, CARD_NAME_POS, "bl");
  ["showBrand", "showAvatar", "showNumber", "showDate"].forEach(k => { c[k] = c[k] !== false; });
  c.number = String(c.number || "").slice(0, 24); c.line = String(c.line || "").slice(0, 60);
  c.stickers = (Array.isArray(c.stickers) ? c.stickers : []).map(normalizeSticker).filter(Boolean).slice(0, 12);
  c.preset = String(c.preset || "").slice(0, 20);
  return c;
}

export function applyCardPreset(card, id) {
  const p = CARD_PRESETS.find(x => x.id === id);
  if (!p) return normalizeCard(card);
  const cur = normalizeCard(card);
  // A preset changes the look, never your stickers and texts
  const keep = { stickers: cur.stickers, number: cur.number, line: cur.line, on: cur.on, showBrand: cur.showBrand, showAvatar: cur.showAvatar, showNumber: cur.showNumber, showDate: cur.showDate };
  return normalizeCard({ ...merge(DEFAULT_CARD, p.c), ...keep, preset: id });
}

/* ---------- Rendering ---------- */
const CSS = `
@property --k4-spin { syntax:"<angle>"; inherits:false; initial-value:0deg; }
.k4{position:relative;width:100%;aspect-ratio:1.586;border-radius:var(--k4-r);overflow:hidden;isolation:isolate;container-type:inline-size;color:var(--k4-text);font-family:var(--k4-font);transform-style:preserve-3d;transition:transform .5s cubic-bezier(.2,.7,.2,1),box-shadow .4s;box-shadow:0 30px 80px -24px rgba(0,0,0,.9),var(--k4-glow,0 0 0 transparent);user-select:none;-webkit-user-select:none;touch-action:none}
.k4 *{box-sizing:border-box}
.k4-bg{position:absolute;inset:0;z-index:0;background:var(--k4-bgc)}
.k4-bg img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:scale(var(--k4-zoom));transform-origin:var(--k4-bx) var(--k4-by);object-position:var(--k4-bx) var(--k4-by);filter:var(--k4-imgf)}
.k4-dim{position:absolute;inset:0;z-index:1;background:#000;opacity:var(--k4-dim);pointer-events:none}
.k4-pat{position:absolute;inset:0;z-index:2;pointer-events:none;opacity:var(--k4-pat)}
.k4-pat[data-p=grain]{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.k4-pat[data-p=dots]{background:radial-gradient(circle,var(--k4-text) 0 .9px,transparent 1.4px) 0 0/9px 9px}
.k4-pat[data-p=grid]{background:linear-gradient(var(--k4-text) 1px,transparent 1px) 0 0/16px 16px,linear-gradient(90deg,var(--k4-text) 1px,transparent 1px) 0 0/16px 16px;opacity:calc(var(--k4-pat)*.45)}
.k4-pat[data-p=lines]{background:repeating-linear-gradient(45deg,var(--k4-text) 0 1px,transparent 1px 7px);opacity:calc(var(--k4-pat)*.5)}
.k4-pat[data-p=scan]{background:repeating-linear-gradient(0deg,rgba(0,0,0,.7) 0 1px,transparent 1px 3px)}
.k4-pat[data-p=dither]{background:repeating-conic-gradient(#000 0 25%,transparent 0 50%) 0 0/3px 3px}
.k4-pat[data-p=checker]{background:repeating-conic-gradient(var(--k4-text) 0 25%,transparent 0 50%) 0 0/22px 22px;opacity:calc(var(--k4-pat)*.25)}
.k4-pat[data-p=stars]{background:radial-gradient(circle,#fff 0 .8px,transparent 1.3px) 7px 11px/47px 41px,radial-gradient(circle,#fff 0 .6px,transparent 1.1px) 29px 3px/61px 53px,radial-gradient(circle,#fff 0 1.1px,transparent 1.6px) 13px 31px/97px 89px}
.k4-rays{position:absolute;inset:-50%;z-index:3;pointer-events:none;mix-blend-mode:screen;opacity:var(--k4-rays);
  background:repeating-conic-gradient(from var(--k4-spin) at var(--k4-rx) var(--k4-ry),var(--k4-rc) 0 calc(var(--k4-rstep)*.35),transparent calc(var(--k4-rstep)*.35) var(--k4-rstep));
  -webkit-mask:radial-gradient(circle at var(--k4-rx) var(--k4-ry),#000,transparent 55%);mask:radial-gradient(circle at var(--k4-rx) var(--k4-ry),#000,transparent 55%)}
.k4-rays.spin{animation:k4spin 40s linear infinite}
@keyframes k4spin{to{--k4-spin:360deg}}
.k4-stk{position:absolute;inset:0;z-index:5}
.k4-s{position:absolute;left:0;top:0;width:calc(var(--s)*1cqw);transform:translate(-50%,-50%) translate(calc(var(--x)*1cqw),calc(var(--y)*.6305cqw)) rotate(calc(var(--r)*1deg)) scaleX(var(--fx,1));transform-origin:center;cursor:default;line-height:1}
.k4-s img{display:block;width:100%;height:auto;pointer-events:none;-webkit-user-drag:none}
.k4-s[data-st=diecut] img{filter:drop-shadow(1.2px 0 0 #fff) drop-shadow(-1.2px 0 0 #fff) drop-shadow(0 1.2px 0 #fff) drop-shadow(0 -1.2px 0 #fff) drop-shadow(0 4px 6px rgba(0,0,0,.55))}
.k4-s[data-st=plain] img{filter:drop-shadow(0 4px 8px rgba(0,0,0,.6))}
.k4-s[data-st=round] img{aspect-ratio:1;object-fit:cover;border-radius:50%;border:max(2px,.5cqw) solid #fff;box-shadow:0 4px 10px rgba(0,0,0,.5)}
.k4-s[data-st=polaroid]{background:#f4f4f4;padding:5% 5% 18%;box-shadow:0 6px 14px rgba(0,0,0,.55)}
.k4-s[data-st=polaroid] img{aspect-ratio:1;object-fit:cover}
.k4-s[data-st=glow] img{filter:drop-shadow(0 0 6px var(--k4-acc)) drop-shadow(0 0 2px var(--k4-acc))}
.k4-s .k4-t{display:block;text-align:center;font-weight:800;font-size:calc(var(--s)*.62cqw);color:var(--c);white-space:nowrap}
.k4-s[data-st=diecut] .k4-t{-webkit-text-stroke:max(1.5px,.35cqw) #fff;paint-order:stroke fill;filter:drop-shadow(0 3px 5px rgba(0,0,0,.5))}
.k4-s[data-st=glow] .k4-t{text-shadow:0 0 8px var(--c),0 0 2px var(--c)}
.k4-s[data-st=round] .k4-t,.k4-s[data-st=polaroid] .k4-t{filter:drop-shadow(0 3px 5px rgba(0,0,0,.5))}
.k4.edit .k4-s{cursor:grab}
.k4.edit .k4-s.sel{outline:1.5px dashed var(--k4-acc);outline-offset:3px}
.k4-txt{position:absolute;inset:0;z-index:6;pointer-events:none}
.k4-brand{position:absolute;left:6%;top:8%;font:600 3.4cqw var(--k4-sans);letter-spacing:-.02em}
.k4-brand i{font-style:normal;opacity:.55}
.k4-av{position:absolute;right:6%;top:8%;width:13cqw;aspect-ratio:1;border-radius:50%;overflow:hidden;border:.45cqw solid var(--k4-acc);display:grid;place-items:center;background:rgba(0,0,0,.4);font:700 5cqw var(--k4-sans);color:var(--k4-text)}
.k4-av img{width:100%;height:100%;object-fit:cover}
.k4-num{position:absolute;left:6%;bottom:27%;font:500 3.6cqw var(--k4-mono);letter-spacing:.14em;opacity:.85;white-space:nowrap}
.k4-name{position:absolute;left:6%;bottom:9%;line-height:.95;font-size:calc(9cqw*var(--k4-ns));letter-spacing:var(--k4-sp);white-space:nowrap;transform-origin:0 100%;color:var(--k4-text)}
.k4-name b{color:var(--k4-acc);font-weight:inherit}
.k4[data-pos=tl] .k4-name{top:22%;bottom:auto;transform-origin:0 0}
.k4[data-pos=tl] .k4-num{bottom:9%}
.k4[data-pos=c] .k4-name{left:50%;top:50%;bottom:auto;transform:translate(-50%,-50%);transform-origin:center}
.k4[data-pos=br] .k4-name{left:auto;right:6%;transform-origin:100% 100%}
.k4-meta{position:absolute;right:6%;top:30%;font:500 2.4cqw/1.45 var(--k4-mono);text-align:right;opacity:.8;max-width:42%;overflow-wrap:anywhere}
.k4[data-pos=tl] .k4-meta{top:auto;bottom:9%}
.k4[data-pos=c] .k4-meta{top:auto;bottom:8%}
.k4-holo{position:absolute;inset:0;z-index:7;pointer-events:none;mix-blend-mode:overlay;opacity:var(--k4-holo);transition:background-position .25s;
  background:linear-gradient(115deg,transparent 30%,#ff4fa3 38%,#ffe95c 43%,#5cffc1 48%,#5cc8ff 53%,#c45cff 58%,transparent 66%) var(--k4-mx,15%) 50%/260% 100%}
.k4-shine{position:absolute;inset:0;z-index:8;pointer-events:none;mix-blend-mode:overlay;opacity:.6;background:radial-gradient(circle at var(--k4-mx,30%) var(--k4-my,20%),rgba(255,255,255,.55),transparent 45%)}
.k4-edge{position:absolute;inset:0;z-index:9;pointer-events:none;border-radius:inherit}
.k4[data-border=line] .k4-edge{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--k4-bc) 35%,transparent)}
.k4[data-border=double] .k4-edge{box-shadow:inset 0 0 0 1px var(--k4-bc),inset 0 0 0 5px transparent,inset 0 0 0 6px color-mix(in srgb,var(--k4-bc) 60%,transparent)}
.k4[data-border=neon] .k4-edge{box-shadow:inset 0 0 0 1.5px var(--k4-bc),inset 0 0 18px color-mix(in srgb,var(--k4-bc) 60%,transparent)}
.k4[data-border=chrome] .k4-edge{border:2px solid transparent;background:linear-gradient(135deg,#fff,#777,#fff,#444,#eee) border-box;-webkit-mask:linear-gradient(#000 0 0) padding-box exclude,linear-gradient(#000 0 0);mask:linear-gradient(#000 0 0) padding-box exclude,linear-gradient(#000 0 0)}
@media (prefers-reduced-motion:reduce){.k4-rays.spin{animation:none}}
`;
function ensureCss() {
  if (typeof document === "undefined" || document.getElementById("k4-style")) return;
  const s = document.createElement("style"); s.id = "k4-style"; s.textContent = CSS; document.head.appendChild(s);
}
const h = (tag, cls) => { const e = document.createElement(tag); if (cls) e.className = cls; return e; };
const fontStack = id => (FONTS.find(f => f[0] === id) || FONTS[0])[2];
const grad = b => b.kind === "radial" ? `radial-gradient(circle at 30% 20%, ${b.stops.join(",")})`
  : b.kind === "conic" ? `conic-gradient(from ${b.angle}deg at 50% 50%, ${b.stops.join(",")}, ${b.stops[0]})`
  : `linear-gradient(${b.angle}deg, ${b.stops.join(",")})`;

/* data: { handle, displayName, avatarUrl }   opts: { editable, onSticker(id, patch), onSelect(id), tilt } */
export function mountCard(root, card, data, opts = {}) {
  ensureCss();
  const el = h("div", "k4");
  const bg = h("div", "k4-bg"), dim = h("div", "k4-dim"), pat = h("div", "k4-pat"), rays = h("div", "k4-rays");
  const stk = h("div", "k4-stk"), txt = h("div", "k4-txt"), holo = h("div", "k4-holo"), shine = h("div", "k4-shine"), edge = h("div", "k4-edge");
  el.append(bg, dim, pat, rays, stk, txt, holo, shine, edge);
  root.replaceChildren(el);
  let cur = null, info = data, selected = "";
  const nodes = new Map();

  function render(c, d) {
    cur = normalizeCard(c); info = d || info || {};
    const s = el.style;
    ensureFonts([cur.font]);
    s.setProperty("--k4-r", (cur.radius / 4.2).toFixed(2) + "cqw");
    s.setProperty("--k4-text", cur.textColor); s.setProperty("--k4-acc", cur.accent);
    s.setProperty("--k4-font", fontStack(cur.font)); s.setProperty("--k4-sans", fontStack("geist")); s.setProperty("--k4-mono", fontStack("geist-mono"));
    s.setProperty("--k4-bgc", cur.bg.type === "color" ? cur.bg.color : cur.bg.type === "gradient" ? grad(cur.bg) : "#000");
    s.setProperty("--k4-dim", cur.bg.type === "image" ? (cur.bg.dim / 100).toFixed(2) : 0);
    s.setProperty("--k4-zoom", (cur.bg.zoom / 100).toFixed(2)); s.setProperty("--k4-bx", cur.bg.x + "%"); s.setProperty("--k4-by", cur.bg.y + "%");
    s.setProperty("--k4-imgf", `${cur.bg.blur ? `blur(${cur.bg.blur / 4}cqw)` : ""} ${cur.bg.gray ? "grayscale(1) contrast(1.1)" : ""}`.trim() || "none");
    s.setProperty("--k4-pat", cur.pattern === "none" ? 0 : (cur.patternAmt / 100).toFixed(2));
    s.setProperty("--k4-rays", cur.rays.on ? (cur.rays.strength / 100).toFixed(2) : 0);
    s.setProperty("--k4-rc", cur.rays.color); s.setProperty("--k4-rstep", (360 / cur.rays.count).toFixed(2) + "deg");
    // the rays layer is twice the card, so the centre is remapped into it
    s.setProperty("--k4-rx", (25 + cur.rays.x / 2) + "%"); s.setProperty("--k4-ry", (25 + cur.rays.y / 2) + "%");
    s.setProperty("--k4-holo", cur.holo.on ? (cur.holo.strength / 100 * .85).toFixed(2) : 0);
    s.setProperty("--k4-ns", (cur.nameSize / 100).toFixed(2)); s.setProperty("--k4-sp", (cur.spacing / 20).toFixed(2) + "em");
    s.setProperty("--k4-bc", cur.borderColor);
    s.setProperty("--k4-glow", cur.glow.on ? `0 0 ${cur.glow.size}px ${Math.round(cur.glow.size / 4)}px color-mix(in srgb, ${cur.glow.color} 70%, transparent)` : "0 0 0 transparent");
    el.dataset.pos = cur.namePos; el.dataset.border = cur.border;
    el.classList.toggle("edit", !!opts.editable);
    pat.dataset.p = cur.pattern;
    rays.classList.toggle("spin", cur.rays.on && cur.rays.spin);
    shine.style.display = cur.shine.on ? "" : "none";
    holo.style.display = cur.holo.on ? "" : "none";
    rays.style.display = cur.rays.on ? "" : "none";
    // background photo (kept when unchanged so it doesn't flash)
    const img = bg.querySelector("img");
    if (cur.bg.type === "image" && cur.bg.image) {
      if (!img) { const i = h("img"); i.alt = ""; i.decoding = "async"; i.src = cur.bg.image; bg.appendChild(i); }
      else if (img.getAttribute("src") !== cur.bg.image) img.src = cur.bg.image;
    } else if (img) img.remove();
    // texts
    const handle = info.handle || "tuonome";
    const name = `@${handle}`;
    txt.replaceChildren();
    if (cur.showBrand) { const b = h("div", "k4-brand"); b.innerHTML = "404<i>.bio</i>"; txt.appendChild(b); }
    if (cur.showAvatar) {
      const a = h("div", "k4-av");
      if (info.avatarUrl) { const i = h("img"); i.alt = ""; i.src = info.avatarUrl; i.onerror = () => { a.textContent = handle[0].toUpperCase(); }; a.appendChild(i); }
      else a.textContent = handle[0].toUpperCase();
      txt.appendChild(a);
    }
    if (cur.showNumber) { const n = h("div", "k4-num"); n.textContent = cur.number || "N° " + String([...handle].reduce((x, ch) => (x * 31 + ch.charCodeAt(0)) % 10000, 7)).padStart(4, "0"); txt.appendChild(n); }
    const nm = h("div", "k4-name");
    nm.innerHTML = `<b>@</b>`; nm.appendChild(document.createTextNode(cur.upper ? handle.toUpperCase() : handle));
    txt.appendChild(nm);
    const meta = h("div", "k4-meta");
    const lines = [];
    if (cur.line) lines.push(cur.line);
    if (cur.showDate) lines.push("404.bio/" + handle);
    meta.textContent = lines.join("\n"); meta.style.whiteSpace = "pre-line";
    if (lines.length) txt.appendChild(meta);
    renderStickers();
    requestAnimationFrame(() => fit(nm));
  }
  // The name always fits on one line
  function fit(nm) {
    nm.style.scale = "";
    const room = el.clientWidth * (cur.namePos === "c" ? .88 : .86) - (cur.namePos === "c" ? 0 : el.clientWidth * .06), need = nm.scrollWidth;
    if (room > 0 && need > room) nm.style.scale = (room / need).toFixed(3);
  }
  function renderStickers() {
    const seen = new Set();
    cur.stickers.forEach(sk => {
      seen.add(sk.id);
      let n = nodes.get(sk.id);
      if (!n) {
        n = h("div", "k4-s"); n.dataset.id = sk.id; nodes.set(sk.id, n);
        if (opts.editable) attachDrag(n);
      }
      if (sk.kind === "img") {
        let i = n.querySelector("img");
        if (!i) { n.replaceChildren(); i = h("img"); i.alt = ""; i.draggable = false; n.appendChild(i); }
        if (i.getAttribute("src") !== sk.src) i.src = sk.src;
      } else {
        let t = n.querySelector(".k4-t");
        if (!t) { n.replaceChildren(); t = h("span", "k4-t"); n.appendChild(t); }
        t.textContent = sk.text;
        n.style.setProperty("--c", sk.color);
      }
      n.dataset.st = sk.style;
      n.style.setProperty("--x", sk.x); n.style.setProperty("--y", sk.y); n.style.setProperty("--s", sk.s); n.style.setProperty("--r", sk.r);
      n.style.setProperty("--fx", sk.flip ? -1 : 1); n.style.zIndex = sk.z;
      n.classList.toggle("sel", sk.id === selected);
      if (n.parentNode !== stk) stk.appendChild(n);
    });
    for (const [id, n] of nodes) if (!seen.has(id)) { n.remove(); nodes.delete(id); }
  }
  // Drag stickers around the card in the editor
  function attachDrag(n) {
    n.addEventListener("pointerdown", e => {
      e.preventDefault(); e.stopPropagation();
      const id = n.dataset.id;
      selected = id; renderStickers(); opts.onSelect && opts.onSelect(id);
      const r = el.getBoundingClientRect();
      const sk = cur.stickers.find(x => x.id === id); if (!sk) return;
      const ox = sk.x - (e.clientX - r.left) / r.width * 100, oy = sk.y - (e.clientY - r.top) / r.height * 100;
      n.setPointerCapture(e.pointerId);
      const move = ev => {
        sk.x = Math.round(Math.max(-5, Math.min(105, (ev.clientX - r.left) / r.width * 100 + ox)) * 10) / 10;
        sk.y = Math.round(Math.max(-5, Math.min(105, (ev.clientY - r.top) / r.height * 100 + oy)) * 10) / 10;
        n.style.setProperty("--x", sk.x); n.style.setProperty("--y", sk.y);
      };
      const up = () => { n.removeEventListener("pointermove", move); n.removeEventListener("pointerup", up); n.removeEventListener("pointercancel", up); opts.onSticker && opts.onSticker(id, { x: sk.x, y: sk.y }); };
      n.addEventListener("pointermove", move); n.addEventListener("pointerup", up); n.addEventListener("pointercancel", up);
    });
  }
  if (opts.editable) el.addEventListener("pointerdown", e => { if (!e.target.closest(".k4-s")) { selected = ""; renderStickers(); opts.onSelect && opts.onSelect(""); } });
  // Light follows the pointer; the card tilts a little
  const finePointer = typeof matchMedia !== "undefined" && matchMedia("(pointer: fine)").matches;
  const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const onMove = e => {
    const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--k4-mx", (x * 100).toFixed(1) + "%"); el.style.setProperty("--k4-my", (y * 100).toFixed(1) + "%");
    if (opts.tilt !== false && !reduce && !opts.editable) el.style.transform = `perspective(1200px) rotateY(${((x - .5) * 14).toFixed(2)}deg) rotateX(${((.5 - y) * 10).toFixed(2)}deg)`;
  };
  const onLeave = () => { el.style.transform = ""; el.style.removeProperty("--k4-mx"); el.style.removeProperty("--k4-my"); };
  if (finePointer || opts.editable) { el.addEventListener("pointermove", onMove); el.addEventListener("pointerleave", onLeave); }
  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => { const nm = el.querySelector(".k4-name"); nm && fit(nm); }) : null;
  ro && ro.observe(el);

  render(card, data);
  return {
    el,
    update(c, d) { render(c, d); },
    select(id) { selected = id || ""; renderStickers(); },
    destroy() { ro && ro.disconnect(); root.replaceChildren(); }
  };
}

/* ---------- Turning a photo into a sticker ---------- */
// Cuts away the background colour that touches the edges (flood fill from the border),
// trims the empty space and returns a PNG/WebP blob with transparency.
export async function makeSticker(file, { removeBg = true, tolerance = 42, max = 560 } = {}) {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const w = Math.max(1, Math.round(bmp.width * k)), hh = Math.max(1, Math.round(bmp.height * k));
  const cv = document.createElement("canvas"); cv.width = w; cv.height = hh;
  const cx = cv.getContext("2d", { willReadFrequently: true });
  cx.drawImage(bmp, 0, 0, w, hh);
  bmp.close && bmp.close();
  const img = cx.getImageData(0, 0, w, hh), px = img.data;
  if (removeBg) {
    // background colour = average of the four corners
    const at = (x, y) => (y * w + x) * 4;
    const corners = [at(0, 0), at(w - 1, 0), at(0, hh - 1), at(w - 1, hh - 1)];
    const ref = [0, 1, 2].map(c => corners.reduce((s, i) => s + px[i + c], 0) / 4);
    const alreadyClear = corners.every(i => px[i + 3] < 20);
    if (!alreadyClear) {
      const t2 = tolerance * tolerance * 3;
      const seen = new Uint8Array(w * hh), stack = [];
      for (let x = 0; x < w; x++) { stack.push(x, 0, x, hh - 1); }
      for (let y = 0; y < hh; y++) { stack.push(0, y, w - 1, y); }
      while (stack.length) {
        const y = stack.pop(), x = stack.pop();
        if (x < 0 || y < 0 || x >= w || y >= hh) continue;
        const p = y * w + x; if (seen[p]) continue; seen[p] = 1;
        const i = p * 4, dr = px[i] - ref[0], dg = px[i + 1] - ref[1], db = px[i + 2] - ref[2];
        if (dr * dr + dg * dg + db * db > t2) continue;
        px[i + 3] = 0;
        stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
      }
      // soften the cut edge a little
      for (let y = 1; y < hh - 1; y++) for (let x = 1; x < w - 1; x++) {
        const i = (y * w + x) * 4; if (px[i + 3] === 0) continue;
        if (px[i - 1] === 0 || px[i + 7] === 0 || px[i - w * 4 + 3] === 0 || px[i + w * 4 + 3] === 0) px[i + 3] = 170;
      }
      cx.putImageData(img, 0, 0);
    }
  }
  // trim transparent borders
  let x0 = w, y0 = hh, x1 = -1, y1 = -1;
  for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) if (px[(y * w + x) * 4 + 3] > 16) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  if (x1 < x0) { x0 = 0; y0 = 0; x1 = w - 1; y1 = hh - 1; }
  const out = document.createElement("canvas"); out.width = x1 - x0 + 1; out.height = y1 - y0 + 1;
  out.getContext("2d").drawImage(cv, x0, y0, out.width, out.height, 0, 0, out.width, out.height);
  const blob = await new Promise(r => out.toBlob(r, "image/webp", .9)) || await new Promise(r => out.toBlob(r, "image/png"));
  return new File([blob], "sticker." + (blob.type === "image/png" ? "png" : "webp"), { type: blob.type });
}

/* ---------- Full screen card viewer (profile button) ---------- */
export function openCardViewer(card, data) {
  ensureCss();
  const ov = h("div");
  ov.style.cssText = "position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:24px;background:rgba(0,0,0,.86);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);animation:k4in .35s steps(5,end)";
  const box = h("div"); box.style.cssText = "width:min(560px,92vw)";
  const close = h("button"); close.type = "button"; close.textContent = "chiudi";
  close.style.cssText = "position:absolute;top:16px;right:16px;border:1px solid rgba(255,255,255,.3);background:#000;color:#fff;border-radius:999px;padding:8px 14px;font:500 13px system-ui;cursor:pointer";
  ov.append(box, close);
  if (!document.getElementById("k4-in")) { const st = h("style"); st.id = "k4-in"; st.textContent = "@keyframes k4in{from{opacity:0}to{opacity:1}}"; document.head.appendChild(st); }
  document.body.appendChild(ov);
  const m = mountCard(box, card, data, {});
  const done = () => { m.destroy(); ov.remove(); removeEventListener("keydown", key); };
  const key = e => { if (e.key === "Escape") done(); };
  close.addEventListener("click", done);
  ov.addEventListener("click", e => { if (e.target === ov) done(); });
  addEventListener("keydown", key);
  return done;
}

/* ---------- Download the card as an image (normal or Instagram story) ---------- */
const H2I = "https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.js";
let h2iLoading = null;
function loadHtmlToImage() {
  if (window.htmlToImage) return Promise.resolve(window.htmlToImage);
  if (!h2iLoading) h2iLoading = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = H2I; s.async = true;
    s.onload = () => resolve(window.htmlToImage);
    s.onerror = () => { h2iLoading = null; reject(new Error("Non riesco a caricare lo strumento per creare l'immagine. Controlla la connessione.")); };
    document.head.appendChild(s);
  });
  return h2iLoading;
}
const BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
// Returns a PNG data URL. Photos from sites that don't allow it are left out instead of breaking the image.
export async function cardImage(card, data, { story = false } = {}) {
  const lib = await loadHtmlToImage();
  const host = h("div");
  host.style.cssText = "position:fixed;left:-12000px;top:0;width:1200px;pointer-events:none";
  document.body.appendChild(host);
  const m = mountCard(host, card, data, { tilt: false });
  m.el.querySelector(".k4-rays")?.classList.remove("spin");
  m.el.style.boxShadow = "none";
  let url;
  try {
    if (document.fonts) await document.fonts.ready;
    await Promise.all([...host.querySelectorAll("img")].map(i => (i.decode ? i.decode() : Promise.resolve()).catch(() => {})));
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    url = await lib.toPng(m.el, { pixelRatio: 1, cacheBust: true, imagePlaceholder: BLANK });
  } finally { m.destroy(); host.remove(); }
  if (!story) return url;
  const img = new Image(); img.src = url; await img.decode();
  const cv = document.createElement("canvas"); cv.width = 1080; cv.height = 1920;
  const x = cv.getContext("2d");
  const c = normalizeCard(card);
  const g = x.createRadialGradient(540, 860, 80, 540, 900, 1200);
  g.addColorStop(0, "#1e1e1e"); g.addColorStop(1, "#000"); x.fillStyle = g; x.fillRect(0, 0, 1080, 1920);
  const w = 960, hh = w / 1.586;
  x.save(); x.translate(540, 860); x.rotate(-0.06);
  x.shadowColor = "rgba(0,0,0,.85)"; x.shadowBlur = 90; x.shadowOffsetY = 40;
  x.drawImage(img, -w / 2, -hh / 2, w, hh); x.restore();
  x.textAlign = "center";
  x.fillStyle = c.accent === "#000000" ? "#ffffff" : "#ffffff";
  x.font = "700 66px Geist, Arial, sans-serif"; x.fillText("404.bio/" + (data.handle || "tuonome"), 540, 1420);
  x.fillStyle = "#8a8a8a"; x.font = "500 34px 'Geist Mono', monospace"; x.fillText("prendi la tua @", 540, 1490);
  return cv.toDataURL("image/png");
}
export function downloadDataUrl(url, name) {
  const a = document.createElement("a"); a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
}
