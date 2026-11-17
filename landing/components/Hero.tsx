"use client";
// Hero: the title, the claim box and glass spheres with social logos all around
// (near ones big and sharp, far ones small and faint; they float and move a little with the mouse; each moving piece has its own layer, so scrolling stays smooth) and a fine dot grid behind.
import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import Claim from "./Claim";
import { reducedMotion } from "@/lib/site";
import { useT } from "@/lib/i18n";

const EASE = [0.23, 1, 0.32, 1] as const;
const ICONS = "https://cdn.jsdelivr.net/npm/simple-icons@11.14.0/icons/";

// a word that rises out of its own box
function Word({ children, i }: { children: React.ReactNode; i: number }) {
  return (
    <span className="inline-block overflow-hidden pb-[.08em] -mb-[.08em] align-top">
      <motion.span className="inline-block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: .9, ease: EASE, delay: .3 + i * .06 }}>{children}</motion.span>
    </span>
  );
}

type Orb = { icon: string; x: string; y: string; size: number; depth: number; dur: number; mobile?: boolean };
// near = big and sharp, far = small, blurred, faint
const ORBS: Orb[] = [
  { icon: "discord", x: "6%", y: "22%", size: 84, depth: 1, dur: 7, mobile: true },
  { icon: "spotify", x: "14%", y: "68%", size: 58, depth: .6, dur: 9 },
  { icon: "tiktok", x: "3%", y: "84%", size: 40, depth: .3, dur: 11 },
  { icon: "instagram", x: "88%", y: "18%", size: 72, depth: .9, dur: 8, mobile: true },
  { icon: "youtube", x: "80%", y: "74%", size: 92, depth: 1, dur: 10 },
  { icon: "twitch", x: "93%", y: "52%", size: 44, depth: .35, dur: 12 },
  { icon: "x", x: "24%", y: "10%", size: 36, depth: .25, dur: 13 },
  { icon: "telegram", x: "70%", y: "8%", size: 40, depth: .3, dur: 9 },
  { icon: "whatsapp", x: "17%", y: "40%", size: 62, depth: .8, dur: 10 },
  { icon: "kick", x: "83%", y: "40%", size: 56, depth: .7, dur: 11 },
];

function GlassOrb({ o, mx, my, live }: { o: Orb; mx: MotionValue<number>; my: MotionValue<number>; live: boolean }) {
  const x = useTransform(mx, v => v * 26 * o.depth), y = useTransform(my, v => v * 20 * o.depth);
  const far = o.depth < .5;
  return (
    <motion.div aria-hidden style={{ left: o.x, top: o.y, x, y, opacity: .35 + o.depth * .55 }}
      className={`absolute -translate-x-1/2 -translate-y-1/2 will-change-transform ${o.mobile ? "" : "max-md:hidden"}`}
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: EASE, delay: .4 + o.depth * .5 }}>
      <motion.div animate={live && !reducedMotion() ? { y: [0, -14, 0], rotate: [0, 4, 0] } : { y: 0, rotate: 0 }} transition={{ duration: o.dur, repeat: live ? Infinity : 0, ease: "easeInOut" }}
        style={{ width: o.size, height: o.size }}
        className="grid place-items-center rounded-full border border-white/15 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,.38),rgba(255,255,255,.07)_42%,rgba(0,0,0,.55)_100%)] shadow-[inset_0_-8px_18px_rgba(0,0,0,.6),inset_0_2px_6px_rgba(255,255,255,.25),0_18px_40px_rgba(0,0,0,.6)] ">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${ICONS}${o.icon}.svg`} alt="" className="size-[42%] opacity-90 [filter:invert(1)]" loading="lazy" />
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const name = "18kbio";
  const { t } = useT();
  const words = t("h1a").split(" ");
  const sec = useRef<HTMLElement>(null);
  const live = useInView(sec, { amount: .1 }); // the floating stops when the hero is off screen
  const mxRaw = useMotionValue(0), myRaw = useMotionValue(0);
  const mx = useSpring(mxRaw, { stiffness: 40, damping: 18 }), my = useSpring(myRaw, { stiffness: 40, damping: 18 });

  useEffect(() => {
    if (reducedMotion()) return;
    const move = (e: PointerEvent) => { if (e.pointerType !== "mouse") return; mxRaw.set(e.clientX / innerWidth - .5); myRaw.set(e.clientY / innerHeight - .5); };
    addEventListener("pointermove", move, { passive: true });
    return () => removeEventListener("pointermove", move);
  }, [mxRaw, myRaw]);

  return (
    <section ref={sec} id="top" aria-label={t("h1a")} className="vh relative isolate flex items-center justify-center overflow-hidden max-md:min-h-[720px]">
      {/* dot grid + a soft light in the middle + two big soft spheres on the sides (still: no cost while scrolling) */}
      <div aria-hidden className="absolute inset-0 -z-10 opacity-60 [background-image:radial-gradient(rgba(255,255,255,.09)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(70%_60%_at_50%_45%,#000,transparent)]" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_42%,rgba(255,255,255,.07),transparent_70%)]" />
      {["-left-[14%] top-[18%]", "-right-[12%] top-[38%]"].map(pos => (
        <div key={pos} aria-hidden className={`absolute -z-10 size-[44vw] max-w-[620px] rounded-full bg-[radial-gradient(circle_at_40%_35%,rgba(255,255,255,.14),rgba(255,255,255,.03)_55%,transparent_70%)] ${pos}`}
        />
      ))}

      <div aria-hidden className="absolute inset-0 overflow-hidden">
        {ORBS.map(o => <GlassOrb key={o.icon} o={o} mx={mx} my={my} live={live} />)}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />

      <div className="relative z-[2] flex w-full flex-col items-center px-4 pb-20 pt-[110px] text-center">
        <motion.a href="/esplora" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: .2 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[.1] bg-white/[.04] px-3 py-1 text-[13px] text-muted transition-colors hover:border-white/25 hover:text-white">
          <i aria-hidden className="size-2 rounded-full bg-white/80" /> {t("exploreBtn")} <span aria-hidden>→</span>
        </motion.a>
        <h1 aria-label={`${t("h1a")} ${t("h1b")} 18kbio`} className="text-[clamp(44px,7.4vw,108px)] font-bold leading-[1.02] tracking-[-.045em]">
          <span aria-hidden className="block">{words.map((w, i) => <span key={w + i}><Word i={i}>{w}</Word>{i < words.length - 1 ? " " : ""}</span>)}</span>
          <span aria-hidden className="block">
            <Word i={words.length}>{t("h1b")}</Word>{" "}
            <b className="hx-name">{[...name].map((ch, i) => <i key={i} style={{ ["--d" as string]: `${(.7 + i * .07).toFixed(2)}s` }}>{ch}</i>)}</b>
          </span>
        </h1>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, ease: EASE, delay: .75 }}
          className="mt-6 max-w-[46ch] text-[clamp(15px,1.4vw,18px)] leading-[1.55] text-muted [text-wrap:pretty]">
          {t("heroDesc")}
        </motion.p>
        <motion.div className="mt-9 flex w-full justify-center text-left" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, ease: EASE, delay: .9 }}>
          <Claim id="h1in" />
        </motion.div>
      </div>
    </section>
  );
}
