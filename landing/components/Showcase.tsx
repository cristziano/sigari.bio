"use client";
// "Profili veri": a ring of real profiles that turns by itself (WarpCarousel).
// Only the profiles that Esplora already shows (public and listed, the owner's own choice),
// the most visited first. Each card is painted from the profile: background, photo, name, @, bio, visits.
// Click the front card (or the link under it) to open that profile. If profiles can't be read, the section hides.
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { WarpCarousel, type WarpCard } from "@/components/ui/warp-carousel";
import { firebase } from "@/lib/site";
import { useT } from "@/lib/i18n";

const MAX = 8; // enough to fill the ring with no repeats
type Shown = { handle: string; card: WarpCard };

const profileUrl = (h: string) => (/^(localhost|127\.)/.test(location.hostname) ? `/sigari-bio/profile.html?u=${h}` : `/${h}`);

// our own photo links work from the same site (no cross-site rules), other sites only if they allow it
const sameSite = (u: string) => u.replace(/^https?:\/\/(www\.)?18kbio\.(xyz|vercel\.app)(?=\/api\/photo)/, "");
function loadImg(src: string | undefined, retry = true): Promise<HTMLImageElement | null> {
  if (!src || !/^(https?:|\/api\/)/.test(src)) return Promise.resolve(null);
  const url = sameSite(src);
  return new Promise(res => {
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.decoding = "async";
    const t = setTimeout(() => res(null), 7000);
    im.onload = () => { clearTimeout(t); res(im); };
    im.onerror = () => { clearTimeout(t); res(retry && url.startsWith("/api/photo") ? loadImg(url + "&raw=1", false) : null); };
    im.src = url;
  });
}

/** draws an image over the box, filling it (like object-fit: cover) */
function cover(ctx: CanvasRenderingContext2D, im: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const s = Math.max(w / im.naturalWidth, h / im.naturalHeight);
  const iw = im.naturalWidth * s, ih = im.naturalHeight * s;
  ctx.drawImage(im, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
}

/** cuts the text with "…" so it fits in `max` */
function fit(ctx: CanvasRenderingContext2D, text: string, max: number) {
  if (ctx.measureText(text).width <= max) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + "…").width > max) t = t.slice(0, -1);
  return t.trimEnd() + "…";
}

function painter(p: any, av: HTMLImageElement | null, bg: HTMLImageElement | null, font: string, visits: string) {
  const a = p.appearance || {};
  const name = (p.displayName || p.handle || "").trim() || p.handle;
  const bio = String((a.bioLines && a.bioLines[0]) || p.bio || "").replace(/\s+/g, " ").trim();
  const showViews = !(a.privacy && a.privacy.hideViews) && typeof p.views === "number";
  return (ctx: CanvasRenderingContext2D) => {
    // background: the profile's own image, darkened so the text reads; otherwise plain dark
    ctx.fillStyle = "#121212";
    ctx.fillRect(0, 0, 256, 320);
    if (bg) {
      ctx.save();
      ctx.filter = "blur(1.5px)";
      cover(ctx, bg, -4, -4, 264, 328);
      ctx.restore();
      ctx.fillStyle = "rgba(0,0,0,.38)";
      ctx.fillRect(0, 0, 256, 320);
    } else {
      const g = ctx.createRadialGradient(128, 110, 10, 128, 110, 220);
      g.addColorStop(0, "#2a2a2a");
      g.addColorStop(1, "#0d0d0d");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 320);
    }
    const shade = ctx.createLinearGradient(0, 150, 0, 320);
    shade.addColorStop(0, "rgba(0,0,0,0)");
    shade.addColorStop(1, "rgba(0,0,0,.85)");
    ctx.fillStyle = shade;
    ctx.fillRect(0, 150, 256, 170);

    // photo in a circle with a thin white ring
    const cx = 128, cy = 118, r = 40;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    if (av) cover(ctx, av, cx - r, cy - r, r * 2, r * 2);
    else {
      ctx.fillStyle = "#222";
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      ctx.fillStyle = "#fff";
      ctx.font = `600 34px ${font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(name.charAt(0).toUpperCase(), cx, cy + 2);
    }
    ctx.restore();
    ctx.strokeStyle = "rgba(255,255,255,.85)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 1, 0, Math.PI * 2);
    ctx.stroke();

    // name, @, first line of the bio
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#fff";
    ctx.font = `700 21px ${font}`;
    ctx.fillText(fit(ctx, name, 224), 128, 192);
    ctx.fillStyle = "rgba(255,255,255,.62)";
    ctx.font = `500 11.5px ${font}`;
    ctx.fillText("@" + p.handle, 128, 210);
    if (bio) {
      ctx.fillStyle = "rgba(255,255,255,.85)";
      ctx.font = `400 11px ${font}`;
      ctx.fillText(fit(ctx, bio, 212), 128, 236);
    }

    // bottom line: the link and the visits
    ctx.strokeStyle = "rgba(255,255,255,.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(16, 276);
    ctx.lineTo(240, 276);
    ctx.stroke();
    ctx.font = `500 10px ${font}`;
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,255,255,.7)";
    ctx.fillText(fit(ctx, "18kbio.xyz/" + p.handle, showViews ? 140 : 220), 16, 298);
    if (showViews) {
      ctx.textAlign = "right";
      ctx.fillStyle = "rgba(255,255,255,.55)";
      ctx.fillText(visits, 240, 298);
    }
  };
}

export default function Showcase() {
  const { t, lang } = useT();
  const sec = useRef<HTMLElement>(null);
  const near = useInView(sec, { once: true, margin: "500px 0px" }); // read and draw only when you get close
  const [shown, setShown] = useState<Shown[] | null>(null);
  const [idx, setIdx] = useState(0);

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
          const a = p.appearance || {};
          const bgSrc = a.bg && a.bg.type === "image" ? a.bg.image : (a.bg && a.bg.poster) || (a.banner && a.banner.type !== "none" ? a.banner.url : "");
          const [av, bg] = await Promise.all([loadImg(p.avatarUrl), loadImg(bgSrc)]);
          return { handle: p.handle, card: { title: p.displayName || p.handle, value: "@" + p.handle, footer: p.bio || "", paint: painter(p, av, bg, font, fmt(p.views || 0)) } };
        }));
        if (!off) setShown(out.length >= 3 ? out : []);
      })
      .catch(() => { if (!off) setShown([]); });
    return () => { off = true; };
  }, [near, lang, t]);

  const open = (i: number) => { const s = shown && shown[i]; if (s) location.href = profileUrl(s.handle); };
  if (shown && !shown.length) return null; // nothing to show: no empty box
  const cur = shown ? shown[idx % shown.length] : null;

  return (
    <section ref={sec} id="profili" aria-label={t("showTitle")} className="relative px-4 pt-20 pb-8 md:pt-28">
      <div className="mx-auto max-w-[1100px] text-center">
        <h2 className="text-[clamp(32px,5vw,64px)] font-bold leading-[1.02] tracking-[-.04em]">
          {t("showT1")} <span className="chrome">{t("showT2")}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-[48ch] text-[15px] leading-[1.55] text-muted">{t("showSub")}</p>
        <div className="mt-8 h-[300px] overflow-hidden sm:h-[420px] rounded-[28px] border border-white/10 md:h-[min(560px,calc(68svh*var(--vz,1)))]">
          {shown && (
            <WarpCarousel cards={shown.map(s => s.card)} index={idx} onIndexChange={setIdx} onFrontClick={open}
              step={1} interval={3.4} background="#0b0b0b" glow="#cfcfcf" warp={1} ariaLabel={t("showTitle")}
              font={getComputedStyle(document.body).fontFamily} style={{ minHeight: 0, aspectRatio: "auto" }} />
          )}
        </div>
        <div className="mt-5 flex min-h-11 flex-wrap items-center justify-center gap-3 text-[14px]">
          {cur && <a href={profileUrl(cur.handle)} className="btn-2">{t("showOpen", { n: cur.handle })} <span aria-hidden>↗</span></a>}
          <a href="/esplora" className="px-2 text-muted transition-colors hover:text-white">{t("proofAll")} →</a>
        </div>
      </div>
    </section>
  );
}
