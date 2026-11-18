"use client";
// "Profili veri": a ring of real profiles that turns by itself (WarpCarousel).
// Only the profiles that Esplora already shows (public and listed, the owner's own choice),
// the most visited first. Each card is painted from the profile: background, photo, name, @, bio, visits.
// Click the front card (or the link under it) to open that profile. If profiles can't be read, the section hides.
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { WarpCarousel, WARP_CAROUSEL_CARDS, paintMesh, type WarpCard } from "@/components/ui/warp-carousel";
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

// the morphing mesh gradients of the component (its blue, green-orange and red cards; no violet) with their glow and accent
const LOOKS = [0, 2, 3].map(i => WARP_CAROUSEL_CARDS[i]);
// the green-orange card's own glow is lavender: a warm yellow instead (no violet on the site)
const GLOWS = ["#12b0e8", "#f2c76b", "#6cc0ea"];

/** a profile card in the component's own layout: mesh gradient, two-line title top left, ring of ticks
 *  (here around the profile photo), thin footer bottom left */
function painter(p: any, av: HTMLImageElement | null, look: WarpCard, font: string, visits: string) {
  const a = p.appearance || {};
  const name = (p.displayName || p.handle || "").trim() || p.handle;
  const bio = String((a.bioLines && a.bioLines[0]) || p.bio || "").replace(/\s+/g, " ").trim();
  const showViews = !(a.privacy && a.privacy.hideViews) && typeof p.views === "number";
  const accent = look.accent || "#ffffff";
  return (ctx: CanvasRenderingContext2D) => {
    // the mesh gradient fills the whole card (painted in pixels, so drawn without the card scale)
    const m = ctx.getTransform();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    paintMesh(ctx, ctx.canvas.width, ctx.canvas.height, look.mesh);
    ctx.setTransform(m);
    ctx.textBaseline = "alphabetic";

    // title, top left: name and @
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,255,255,.92)";
    ctx.font = `300 11px ${font}`;
    ctx.fillText(fit(ctx, name, 222), 17, 37);
    ctx.fillStyle = "rgba(255,255,255,.7)";
    ctx.fillText(fit(ctx, "@" + p.handle, 222), 17, 51);

    // ring of ticks around the photo, brighter on top (as the component's "ring" card)
    const cx = 128, cy = 156, r = 56;
    for (let i = 0; i < 132; i++) {
      const ang = (i / 132) * Math.PI * 2 - Math.PI / 2;
      const seed = 0.5 + 0.5 * Math.sin(i * 12.9898) * Math.sin(i * 4.1414 + 1.3);
      const top = 0.5 + 0.5 * Math.cos(ang + Math.PI / 2);
      const len = 4 + 4.5 * Math.abs(seed) + 2 * top;
      ctx.strokeStyle = accent;
      ctx.globalAlpha = 0.22 + 0.5 * top * top;
      ctx.lineWidth = 1 + 0.7 * top;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(ang) * (r + 8), cy + Math.sin(ang) * (r + 8));
      ctx.lineTo(cx + Math.cos(ang) * (r + 8 + len), cy + Math.sin(ang) * (r + 8 + len));
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // the photo
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    if (av) cover(ctx, av, cx - r, cy - r, r * 2, r * 2);
    else {
      ctx.fillStyle = "rgba(0,0,0,.35)";
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      ctx.fillStyle = "#fff";
      ctx.font = `300 46px ${font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(name.charAt(0).toUpperCase(), cx, cy + 2);
    }
    ctx.restore();
    ctx.textBaseline = "alphabetic";

    // first line of the bio under the ring
    if (bio) {
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255,255,255,.8)";
      ctx.font = `300 9.5px ${font}`;
      ctx.fillText(fit(ctx, bio, 220), 128, 254);
    }

    // footer, bottom left (and visits on the right)
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,255,255,.88)";
    ctx.font = `300 9.5px ${font}`;
    ctx.fillText(fit(ctx, "18kbio.xyz/" + p.handle, showViews ? 140 : 222), 17, 295);
    if (showViews) {
      ctx.textAlign = "right";
      ctx.fillStyle = "rgba(255,255,255,.65)";
      ctx.fillText(visits, 239, 295);
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
        const out = await Promise.all(rows.map(async (p: any, i: number) => {
          const av = await loadImg(p.avatarUrl);
          const look = LOOKS[i % LOOKS.length];
          return { handle: p.handle, card: { title: p.displayName || p.handle, value: "@" + p.handle, footer: p.bio || "", glow: GLOWS[i % GLOWS.length], paint: painter(p, av, look, font, fmt(p.views || 0)) } };
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
    <section ref={sec} id="profili" aria-label={t("showTitle")} className="relative pt-20 pb-8 md:pt-28">
      <div className="text-center">
        <h2 className="px-4 text-[clamp(32px,5vw,64px)] font-bold leading-[1.02] tracking-[-.04em]">
          {t("showT1")} <span className="chrome">{t("showT2")}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-[48ch] px-4 text-[15px] leading-[1.55] text-muted">{t("showSub")}</p>
        <div className="mt-6 h-[360px] w-full sm:h-[480px] md:h-[min(760px,calc(88svh*var(--vz,1)))]">
          {shown && (
            <WarpCarousel cards={shown.map(s => s.card)} index={idx} onIndexChange={setIdx} onFrontClick={open}
              step={1} interval={3.4} background="#0b0b0b" warp={1} ariaLabel={t("showTitle")}
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
