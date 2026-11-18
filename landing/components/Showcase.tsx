"use client";
// A ring of real profiles that turns by itself (WarpCarousel), right under the hero. No title, no text:
// only the profiles. Each card is drawn like the profile itself: its own background (image, a frame of its
// video, gradient or colour, with its dim and tint), its photo, name, @, bio and link buttons, in its colours.
// Only the profiles that Esplora already shows (public and listed, the owner's choice), the most visited first.
// Click the front card to open that profile. If profiles can't be read, nothing is shown.
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { WarpCarousel, type WarpCard } from "@/components/ui/warp-carousel";
import { firebase } from "@/lib/site";
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
  const links = (p.links || []).filter((l: any) => l && !l.hidden && l.title && l.type !== "header").slice(0, 2);
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

export default function Showcase() {
  const { t, lang } = useT();
  const sec = useRef<HTMLElement>(null);
  const near = useInView(sec, { once: true, margin: "500px 0px" }); // read and draw only when you get close
  const [shown, setShown] = useState<Shown[] | null>(null);

  useEffect(() => {
    if (!near) return;
    let off = false;
    const font = getComputedStyle(document.body).fontFamily || "system-ui, sans-serif";
    const fmt = (n: number) => `${n.toLocaleString(lang === "it" ? "it-IT" : "en-US")} ${t("proofViews")}`;
    firebase()
      .then(({ db, fs }) => fs.getDocs(fs.query(fs.collection(db, "profiles"), fs.orderBy("views", "desc"), fs.limit(40))))
      .then(async (snap: any) => {
        const rows = snap.docs.map((d: any) => ({ handle: d.id, ...d.data() }))
          .filter((p: any) => {
            const pr = (p.appearance && p.appearance.privacy) || {};
            return p.appearance && p.avatarUrl && !p.private && !p.unlisted && !pr.private && !pr.unlisted && !pr.disabled;
          })
          .slice(0, MAX);
        const out = await Promise.all(rows.map(async (p: any) => {
          const b = (p.appearance && p.appearance.bg) || {};
          const bgPic: Promise<Pic | null> = b.type === "image" ? loadImg(b.image)
            : b.type === "video" ? (b.poster ? loadImg(b.poster) : loadFrame(b.video))
            : Promise.resolve(null);
          const [av, bg] = await Promise.all([loadImg(p.avatarUrl), bgPic]);
          return { handle: p.handle, card: { title: p.displayName || p.handle, value: "@" + p.handle, footer: p.bio || "", paint: painter(p, av, bg, font, fmt(p.views || 0)) } };
        }));
        if (!off) setShown(out.length >= 3 ? out : []);
      })
      .catch(() => { if (!off) setShown([]); });
    return () => { off = true; };
  }, [near, lang, t]);

  const open = (i: number) => { const s = shown && shown[i]; if (s) location.href = profileUrl(s.handle); };
  if (shown && !shown.length) return null; // nothing to show: no empty box

  return (
    <section ref={sec} id="profili" aria-label={t("showTitle")} className="relative h-[480px] w-full overflow-hidden [mask-image:linear-gradient(transparent,#000_14%,#000_86%,transparent)] sm:h-[480px] md:h-[min(760px,calc(88svh*var(--vz,1)))]">
      {shown && (
        // on phones the ring is wider than the screen, so the front profile is big and the others peek in from the sides
        <WarpCarousel className="max-sm:!absolute max-sm:!left-[-45%] max-sm:!w-[190%]" cards={shown.map(s => s.card)} onFrontClick={open} step={1} interval={3}
          background="#0b0b0b" glow="#8c8c8c" warp={0} plainBack ariaLabel={t("showTitle")}
          font={getComputedStyle(document.body).fontFamily} style={{ minHeight: 0, aspectRatio: "auto" }} />
      )}
    </section>
  );
}
