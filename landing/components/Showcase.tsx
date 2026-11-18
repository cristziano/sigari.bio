"use client";
// A ring of real profiles that turns by itself (WarpCarousel), on the right of the hero. No title, no text.
// Each card IS the profile: it is opened off screen with the same code as the profile page
// (profile-kit) and photographed (modern-screenshot); that photo is the card. If a browser won't let the
// photo be used (old Safari), the card is drawn from the profile's own data instead.
// Only the profiles that Esplora already shows (public and listed, the owner's choice), the most visited first.
// Click the front card to open that profile. If profiles can't be read, nothing is shown.
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { WarpCarousel, type WarpCard } from "@/components/ui/warp-carousel";
import { firebase, kit } from "@/lib/site";
import { useT } from "@/lib/i18n";

const MAX = 8; // enough to fill the ring with no repeats
type Pic = HTMLImageElement | HTMLVideoElement;
type Shown = { handle: string; card: WarpCard };

const profileUrl = (h: string) => (/^(localhost|127\.)/.test(location.hostname) ? `/sigari-bio/profile.html?u=${h}` : `/${h}`);

// our own photo links work from the same site (no cross-site rules), other sites only if they allow it
const sameSite = (u: string) => u.replace(/^https?:\/\/(www\.)?18kbio\.(xyz|vercel\.app)(?=\/api\/photo)/, "");
const usable = (src?: string) => !!src && /^(https?:|\/api\/)/.test(src);

function loadImg(src: string | undefined, retry = true): Promise<HTMLImageElement | null> {
  if (!usable(src)) return Promise.resolve(null);
  const url = sameSite(src!);
  return new Promise(res => {
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.decoding = "async";
    const t = setTimeout(() => res(null), 8000);
    im.onload = () => { clearTimeout(t); res(im); };
    im.onerror = () => { clearTimeout(t); res(retry && url.startsWith("/api/photo") ? loadImg(url + "&raw=1", false) : null); };
    im.src = url;
  });
}

/** one still frame of a video background (the card is a picture, so the video is shown paused) */
function loadFrame(src: string | undefined): Promise<HTMLVideoElement | null> {
  if (!usable(src)) return Promise.resolve(null);
  return new Promise(res => {
    const v = document.createElement("video");
    v.crossOrigin = "anonymous";
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";
    const done = (ok: boolean) => { clearTimeout(t); res(ok && v.videoWidth ? v : null); };
    const t = setTimeout(() => done(false), 9000);
    v.onloadeddata = () => { v.currentTime = Math.min(0.5, (v.duration || 1) / 3); };
    v.onseeked = () => done(true);
    v.onerror = () => done(false);
    v.src = sameSite(src!);
  });
}

const sizeOf = (p: Pic) => (p instanceof HTMLVideoElement ? [p.videoWidth, p.videoHeight] : [p.naturalWidth, p.naturalHeight]);

/** draws a picture over the box, filling it (like object-fit: cover), with the profile's focus point */
function cover(ctx: CanvasRenderingContext2D, im: Pic, x: number, y: number, w: number, h: number, fx = 50, fy = 50) {
  const [nw, nh] = sizeOf(im);
  const s = Math.max(w / nw, h / nh);
  const iw = nw * s, ih = nh * s;
  ctx.drawImage(im, x + (w - iw) * (fx / 100), y + (h - ih) * (fy / 100), iw, ih);
}

/** cuts the text with "…" so it fits in `max` */
function fit(ctx: CanvasRenderingContext2D, text: string, max: number) {
  if (ctx.measureText(text).width <= max) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + "…").width > max) t = t.slice(0, -1);
  return t.trimEnd() + "…";
}

/** splits the text in at most `lines` lines that fit in `max` */
function wrap(ctx: CanvasRenderingContext2D, text: string, max: number, lines: number) {
  const out: string[] = [];
  let cur = "";
  let used = 0;
  for (const w of text.split(" ")) {
    const next = cur ? cur + " " + w : w;
    if (ctx.measureText(next).width <= max || !cur) { cur = next; continue; }
    out.push(cur);
    used += cur.length + 1;
    cur = w;
    if (out.length === lines) break;
  }
  if (out.length < lines && cur) { out.push(cur); used += cur.length; }
  const cut = used < text.length;
  return out.map((l, i) => fit(ctx, i === out.length - 1 && cut ? l + "…" : l, max));
}

function painter(p: any, av: HTMLImageElement | null, bg: Pic | null, font: string, visits: string) {
  const a = p.appearance || {};
  const b = a.bg || {};
  const c = a.colors || {};
  const text = c.text || "#ffffff";
  const muted = c.muted || "#9a9a9a";
  const border = c.border || "#2a2a2a";
  const name = (p.displayName || p.handle || "").trim() || p.handle;
  const bio = String((a.bioLines && a.bioLines.join(" ")) || p.bio || "").replace(/\s+/g, " ").trim();
  const links = (p.links || []).filter((l: any) => l && !l.hidden && l.title && l.type !== "header" && l.url && l.url !== "#").slice(0, 2);
  const showViews = !(a.privacy && a.privacy.hideViews) && typeof p.views === "number";
  return (ctx: CanvasRenderingContext2D) => {
    // the profile's background, as the profile shows it
    ctx.fillStyle = b.color || "#000";
    ctx.fillRect(0, 0, 256, 320);
    if (bg) {
      ctx.save();
      if (b.blur) ctx.filter = `blur(${Math.min(8, b.blur / 2)}px)`;
      cover(ctx, bg, -6, -6, 268, 332, b.x ?? 50, b.y ?? 50);
      ctx.restore();
    } else if (b.type === "gradient" && b.gradient && b.gradient.stops && b.gradient.stops.length > 1) {
      const ang = ((b.gradient.angle ?? 180) - 90) * Math.PI / 180;
      const g = ctx.createLinearGradient(128 - Math.cos(ang) * 180, 160 - Math.sin(ang) * 180, 128 + Math.cos(ang) * 180, 160 + Math.sin(ang) * 180);
      b.gradient.stops.forEach((s: string, i: number, all: string[]) => g.addColorStop(i / (all.length - 1), s));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 320);
    }
    if (b.tintA) { ctx.globalAlpha = Math.min(1, b.tintA / 100); ctx.fillStyle = b.tint || "#000"; ctx.fillRect(0, 0, 256, 320); ctx.globalAlpha = 1; }
    ctx.fillStyle = `rgba(0,0,0,${Math.min(0.85, Math.max(0.15, (b.dim ?? 30) / 100))})`;
    ctx.fillRect(0, 0, 256, 320);

    // photo
    const cx = 128, cy = 92, r = 34;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    if (av) cover(ctx, av, cx - r, cy - r, r * 2, r * 2);
    else {
      ctx.fillStyle = "rgba(255,255,255,.12)";
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      ctx.fillStyle = text;
      ctx.font = `600 28px ${font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(name.charAt(0).toUpperCase(), cx, cy + 1);
    }
    ctx.restore();
    ctx.strokeStyle = "rgba(255,255,255,.18)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 1, 0, Math.PI * 2);
    ctx.stroke();

    // name, @, bio in the profile's colours
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = text;
    ctx.font = `700 19px ${font}`;
    ctx.fillText(fit(ctx, name, 224), cx, 152);
    ctx.fillStyle = muted;
    ctx.globalAlpha = 0.85;
    ctx.font = `500 10.5px ${font}`;
    ctx.fillText("@" + p.handle, cx, 168);
    ctx.globalAlpha = 1;
    let y = 190;
    if (bio) {
      ctx.fillStyle = text;
      ctx.globalAlpha = 0.85;
      ctx.font = `400 10px ${font}`;
      for (const line of wrap(ctx, bio, 210, 2)) { ctx.fillText(line, cx, y); y += 13; }
      ctx.globalAlpha = 1;
      y += 6;
    }

    // link buttons, as on the profile
    for (const l of links) {
      if (y > 270) break;
      ctx.fillStyle = "rgba(255,255,255,.07)";
      ctx.strokeStyle = border;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(28, y - 4, 200, 24, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = text;
      ctx.font = `500 10px ${font}`;
      ctx.fillText(fit(ctx, l.title, 180), cx, y + 11.5);
      y += 30;
    }

    // visits, bottom
    if (showViews) {
      ctx.fillStyle = muted;
      ctx.globalAlpha = 0.75;
      ctx.font = `500 9px ${font}`;
      ctx.fillText(visits, cx, 304);
      ctx.globalAlpha = 1;
    }
  };
}

// links to our own photos become same-site links, so the photo of the profile can read them
const localize = (p: any) => JSON.parse(JSON.stringify(p).replace(/https?:\/\/(www\.)?18kbio\.(xyz|vercel\.app)(?=\/api\/photo)/g, location.origin));
const BOX_W = 400, BOX_H = 500; // the card's 4:5 at a phone-like width
const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

/** opens the real profile off screen, waits for its pictures, and takes its photo */
async function photograph(k: any, shot: any, p: any): Promise<HTMLCanvasElement | null> {
  // on screen but invisible: off-screen pages don't load their pictures. The wrapper hides it (it is not
  // part of the photo); the profile itself stays fully opaque, so the photo is not see-through
  const wrap = document.createElement("div");
  wrap.setAttribute("aria-hidden", "true");
  wrap.style.cssText = `position:fixed;left:0;top:0;width:${BOX_W}px;height:${BOX_H}px;overflow:hidden;opacity:0;pointer-events:none;z-index:-1`;
  const host = document.createElement("div");
  host.style.cssText = `position:relative;width:${BOX_W}px;height:${BOX_H}px;overflow:hidden`;
  wrap.appendChild(host);
  document.body.appendChild(wrap);
  let view: any = null;
  try {
    const prof = localize(k.normalizeProfile ? k.normalizeProfile({ ...p }) : p);
    const a = prof.appearance || {};
    // a lighter profile: no sound of any kind, no entrance screen, no moving effects, no players or widgets
    // that load other sites (they would not be in the photo anyway), only the first links
    if (a.music) { a.music.type = "none"; a.music.autoplay = false; }
    if (a.sfx) { a.sfx.hover = "none"; a.sfx.click = "none"; a.sfx.volume = 0; }
    if (a.enter) a.enter.on = false;
    a.effect = "none";
    if (a.widgets) Object.assign(a.widgets, { twitch: "", youtube: "", spotify: "", roblox: "", discordServer: "", discordId: "", discordPresence: false, github: "", weather: "", gallery: false, guestbook: false, contact: false, newsletter: false });
    prof.gallery = [];
    if (Array.isArray(prof.links)) prof.links = prof.links.slice(0, 3);
    view = k.mountProfile(host, prof, { preview: true, entrance: false });
    // pictures and the first frame of a video background
    const imgs = [...host.querySelectorAll("img")].map(im => (im as HTMLImageElement).decode().catch(() => {}));
    const vids = [...host.querySelectorAll("video")].map(v => new Promise(r => { const vv = v as HTMLVideoElement; if (vv.readyState >= 2) r(0); else { vv.addEventListener("loadeddata", r, { once: true }); vv.addEventListener("error", r, { once: true }); } }));
    await Promise.race([Promise.all([...imgs, ...vids]), wait(2500)]);
    await wait(80); // the last layout
    const cv: HTMLCanvasElement = await shot(host, { width: BOX_W, height: BOX_H, scale: 1.25, backgroundColor: "#000", timeout: 4000 });
    cv.getContext("2d")!.getImageData(0, 0, 1, 1); // throws if the browser marked the photo as not usable
    return cv;
  } catch {
    return null;
  } finally {
    try { view && view.destroy && view.destroy(); } catch { /* already gone */ }
    wrap.remove();
  }
}

// the photos are kept in this browser, so the next visit shows the ring at once
type Saved = { handle: string; title: string; stamp: string; img: string };
const SAVE_KEY = "18kbio:ring:v1";
function readSaved(): Saved[] {
  try { const v = JSON.parse(localStorage.getItem(SAVE_KEY) || "[]"); return Array.isArray(v) ? v.filter(x => x && x.handle && x.img) : []; } catch { return []; }
}
function writeSaved(list: Saved[]) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(list)); } catch { /* full or blocked: next time they are taken again */ }
}
const dataImg = (src: string) => new Promise<HTMLImageElement | null>(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; });

export default function Showcase({ className = "" }: { className?: string }) {
  const { t, lang } = useT();
  const sec = useRef<HTMLElement>(null);
  const near = useInView(sec, { once: true, margin: "500px 0px" }); // read and draw only when you get close
  const [shown, setShown] = useState<Shown[] | null>(null);

  useEffect(() => {
    if (!near) return;
    let off = false;
    const font = getComputedStyle(document.body).fontFamily || "system-ui, sans-serif";
    const fmt = (n: number) => `${n.toLocaleString(lang === "it" ? "it-IT" : "en-US")} ${t("proofViews")}`;
    const card = (handle: string, title: string, paint: (ctx: CanvasRenderingContext2D) => void): Shown =>
      ({ handle, card: { title, value: "@" + handle, footer: "", paint } });
    const fromImg = (im: HTMLImageElement) => (ctx: CanvasRenderingContext2D) => ctx.drawImage(im, 0, 0, 256, 320);

    // 1. the photos of the last visit, saved in this browser: the ring shows at once
    const saved = readSaved();
    let shownSaved = false;
    if (saved.length >= 3) {
      Promise.all(saved.map(x => dataImg(x.img))).then(ims => {
        if (off || ims.some(im => !im)) return;
        setShown(saved.map((x, i) => card(x.handle, x.title, fromImg(ims[i]!))));
        shownSaved = true;
      });
    }

    // 2. the current list; only new or changed profiles are photographed again (two at a time)
    firebase()
      .then(({ db, fs }) => fs.getDocs(fs.query(fs.collection(db, "profiles"), fs.orderBy("views", "desc"), fs.limit(40))))
      .then(async (snap: any) => {
        const rows = snap.docs.map((d: any) => ({ handle: d.id, ...d.data() }))
          .filter((p: any) => {
            const pr = (p.appearance && p.appearance.privacy) || {};
            return p.appearance && p.avatarUrl && !p.private && !p.unlisted && !pr.private && !pr.unlisted && !pr.disabled;
          })
          .slice(0, MAX);
        const stamp = (p: any) => String((p.updatedAt && (p.updatedAt.seconds ?? p.updatedAt)) || "") + ":" + (p.views || 0);
        const same = rows.length === saved.length && rows.every((p: any, i: number) => saved[i].handle === p.handle && saved[i].stamp === stamp(p));
        if (same && saved.length >= 3) return; // nothing changed since the last visit
        const [k, { domToCanvas }] = await Promise.all([kit.profile().catch(() => null), import("modern-screenshot")]);
        const out: (Shown | null)[] = new Array(rows.length).fill(null);
        const keep: Saved[] = [];
        const one = async (p: any, i: number) => {
          const old = saved.find(x => x.handle === p.handle && x.stamp === stamp(p));
          const im = old ? await dataImg(old.img) : null;
          if (im) { out[i] = card(p.handle, p.displayName || p.handle, fromImg(im)); keep[i] = old!; return; }
          const photo = k ? await photograph(k, domToCanvas, p) : null;
          if (photo) {
            out[i] = card(p.handle, p.displayName || p.handle, ctx => ctx.drawImage(photo, 0, 0, 256, 320));
            try { keep[i] = { handle: p.handle, title: p.displayName || p.handle, stamp: stamp(p), img: photo.toDataURL("image/jpeg", .8) }; } catch { /* not saved */ }
            return;
          }
          const b = (p.appearance && p.appearance.bg) || {};
          const bgPic: Promise<Pic | null> = b.type === "image" ? loadImg(b.image) : b.type === "video" ? (b.poster ? loadImg(b.poster) : loadFrame(b.video)) : Promise.resolve(null);
          const [av, bg] = await Promise.all([loadImg(p.avatarUrl), bgPic]);
          out[i] = card(p.handle, p.displayName || p.handle, painter(p, av, bg, font, fmt(p.views || 0)));
        };
        let firstShown = shownSaved;
        for (let i = 0; i < rows.length; i += 2) {
          if (off) return;
          await Promise.all(rows.slice(i, i + 2).map((p: any, j: number) => one(p, i + j)));
          // the first three are enough to start turning (only when nothing was on screen yet)
          const ready = out.filter(Boolean) as Shown[];
          if (!firstShown && !shownSaved && ready.length >= 3 && i + 2 < rows.length) { setShown(ready); firstShown = true; }
        }
        if (off) return;
        const done = out.filter(Boolean) as Shown[];
        setShown(done.length >= 3 ? done : []);
        writeSaved(keep.filter(Boolean));
      })
      .catch(() => { if (!off && !shownSaved) setShown([]); });
    return () => { off = true; };
  }, [near, lang, t]);

  const open = (i: number) => { const s = shown && shown[i]; if (s) location.href = profileUrl(s.handle); };
  if (shown && !shown.length) return null; // nothing to show: no empty box

  return (
    <section ref={sec} id="profili" aria-label={t("showTitle")} className={`relative w-full overflow-hidden [mask-image:linear-gradient(transparent,#000_12%,#000_88%,transparent)] ${className}`}>
      {/* soft left and right edges, so the stage melts into the page */}
      <div className="relative size-full [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
        {shown && (
          // on phones the ring is a bit wider than the screen: bigger cards, and the morph at the edges still shows
          <WarpCarousel className="max-sm:!absolute max-sm:!left-[-12.5%] max-sm:!w-[125%]" cards={shown.map(s => s.card)} onFrontClick={open} step={1} interval={3}
            background="#0b0b0b" glow="#8c8c8c" warp={0.5} chroma={false} plainBack clear maxDpr={1} ariaLabel={t("showTitle")}
            font={getComputedStyle(document.body).fontFamily} style={{ minHeight: 0, aspectRatio: "auto" }} />
        )}
      </div>
    </section>
  );
}
