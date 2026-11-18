"use client";
// A ring of real profiles that turns by itself (WarpCarousel), on the right of the hero. No title, no text.
// The cards are ready-made pictures of the profiles (sigari-bio/ring/, taken by Vercel at every publish with
// landing/scripts/ring-shots.mjs): the page only downloads them, so the ring shows at once.
// Only the profiles that Esplora already shows (public and listed, the owner's choice), the most visited first.
// Click the front card to open that profile. If the pictures can't be read, nothing is shown.
import { useEffect, useState } from "react";
import { WarpCarousel, type WarpCard } from "@/components/ui/warp-carousel";
import { useT } from "@/lib/i18n";

const RING = "/sigari-bio/ring/";
type Shown = { handle: string; card: WarpCard };

const profileUrl = (h: string) => (/^(localhost|127\.)/.test(location.hostname) ? `/sigari-bio/profile.html?u=${h}` : `/${h}`);

const loadImg = (src: string) => new Promise<HTMLImageElement | null>(res => {
  const im = new Image();
  im.decoding = "async";
  im.onload = () => res(im);
  im.onerror = () => res(null);
  im.src = src;
});

export default function Showcase({ className = "" }: { className?: string }) {
  const { t } = useT();
  const [shown, setShown] = useState<Shown[] | null>(null);

  useEffect(() => {
    let off = false;
    fetch(RING + "ring.json", { cache: "no-cache" })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(async ({ list }: { list: { h: string; title: string; v: string }[] }) => {
        const ims = await Promise.all(list.map(x => loadImg(`${RING}${x.h}.jpg?v=${x.v}`)));
        const out = list.flatMap((x, i) => {
          const im = ims[i];
          return im ? [{ handle: x.h, card: { title: x.title, value: "@" + x.h, footer: "", paint: (ctx: CanvasRenderingContext2D) => ctx.drawImage(im, 0, 0, 256, 320) } }] : [];
        });
        if (!off) setShown(out.length >= 3 ? out : []);
      })
      .catch(() => { if (!off) setShown([]); });
    return () => { off = true; };
  }, []);

  const open = (i: number) => { const s = shown && shown[i]; if (s) location.href = profileUrl(s.handle); };
  if (shown && !shown.length) return null; // nothing to show: no empty box

  return (
    <section id="profili" aria-label={t("showTitle")} className={`relative w-full overflow-hidden [mask-image:linear-gradient(transparent,#000_12%,#000_88%,transparent)] ${className}`}>
      {/* soft left and right edges, so the stage melts into the page */}
      <div className="relative size-full [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
        {shown && (
          // on phones the ring is a bit wider than the screen: bigger cards, and the morph at the edges still shows
          <WarpCarousel className="max-sm:!absolute max-sm:!left-[-12.5%] max-sm:!w-[125%]" cards={shown.map(s => s.card)} onFrontClick={open} step={1} interval={3}
            background="#0b0b0b" glow="#8c8c8c" warp={0.5} chroma={false} plainBack clear maxDpr={1} ariaLabel={t("showTitle")}
            style={{ minHeight: 0, aspectRatio: "auto" }} />
        )}
      </div>
    </section>
  );
}
