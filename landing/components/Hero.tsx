"use client";
// Hero: the title, the claim box and YOUR 18k card. The card writes the @ you type, live,
// rises from flat on load and follows the mouse.
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import Claim from "./Claim";
import { HANDLE_RE, kit, reducedMotion } from "@/lib/site";
import { useHandle } from "@/lib/handle";
import { useT } from "@/lib/i18n";

const EASE = [0.23, 1, 0.32, 1] as const;
const SPRING = { stiffness: 70, damping: 18 };

// a word that rises out of its own box
function Word({ children, i }: { children: React.ReactNode; i: number }) {
  return (
    <span className="inline-block overflow-hidden pb-[.08em] -mb-[.08em] align-top">
      <motion.span className="inline-block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: .9, ease: EASE, delay: .08 + i * .06 }}>{children}</motion.span>
    </span>
  );
}

/** "18kbio" in liquid chrome, letter by letter */
export function Chrome({ delay = 0 }: { delay?: number }) {
  return <b className="chrome" aria-hidden>{[..."18kbio"].map((c, i) => <i key={i} style={{ ["--d" as string]: `${(delay + i * .07).toFixed(2)}s` }}>{c}</i>)}</b>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function LiveCard() {
  const box = useRef<HTMLDivElement>(null);
  const card = useRef<{ api: any; data: any } | null>(null);
  const { handle } = useHandle();
  const rx = useMotionValue(70), rz = useMotionValue(0), ry = useMotionValue(0);
  const srx = useSpring(rx, SPRING), srz = useSpring(rz, SPRING), sry = useSpring(ry, SPRING);
  const live = useRef(false);
  const who = (h: string) => ({ handle: HANDLE_RE.test(h) ? h : "tuonome", avatarUrl: "", displayName: HANDLE_RE.test(h) ? h : "tuonome" });

  useEffect(() => {
    let alive = true;
    kit.card().then(k => {
      if (!alive || !box.current) return;
      card.current = { api: k.mountCard(box.current, k.DEFAULT_CARD, who(handle)), data: k.DEFAULT_CARD };
    }).catch(() => {});
    const t1 = setTimeout(() => { rx.set(22); rz.set(-9); }, 250);
    const t2 = setTimeout(() => { live.current = true; }, 1900);
    const move = (e: PointerEvent) => {
      if (!live.current || reducedMotion() || e.pointerType !== "mouse") return;
      const x = (innerWidth / 2 - e.clientX) / 40, y = (innerHeight / 2 - e.clientY) / 40;
      rx.set(22 + y / 2); rz.set(-9 + x / 3); ry.set(-x / 2);
    };
    addEventListener("pointermove", move, { passive: true });
    return () => { alive = false; clearTimeout(t1); clearTimeout(t2); removeEventListener("pointermove", move); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // the @ typed in the box is written on the card
  useEffect(() => {
    const id = setTimeout(() => { const c = card.current; if (c) try { c.api.update(c.data, who(handle)); } catch { /* card only */ } }, 120);
    return () => clearTimeout(id);
  }, [handle]);

  return (
    <div className="relative flex items-center justify-center [perspective:1600px]">
      <motion.div style={{ rotateX: srx, rotateZ: srz, rotateY: sry, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, scale: .86 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: .15 }}
        className="w-[min(86vw,420px)] lg:w-[min(42vw,600px)]">
        <div ref={box} className="aspect-[1.586] w-full [container-type:inline-size] [filter:drop-shadow(0_50px_60px_rgba(0,0,0,.75))] [&>*]:size-full" />
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const { t } = useT();
  const words = t("h1a").split(" ");
  return (
    <section id="top" aria-label={t("h1a")} className="vh relative isolate grid items-center overflow-hidden bg-black px-4 pb-16 pt-[96px] sm:px-[clamp(16px,6vw,96px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
      <div aria-hidden className="tc-grain pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden className="pointer-events-none absolute -inset-[20%] -z-10 opacity-40 [background-image:repeating-radial-gradient(circle_at_72%_50%,transparent_0,transparent_44px,rgba(255,255,255,.05)_45px,transparent_46px)]" />
      <div className="relative z-[2] flex flex-col items-start">
        <h1 aria-label={`${t("h1a")} ${t("h1b")} 18kbio`} className="text-[clamp(44px,6.6vw,96px)] font-bold leading-[1.02] tracking-[-.045em]">
          <span aria-hidden className="block">{words.map((w, i) => <span key={w + i}><Word i={i}>{w}</Word>{i < words.length - 1 ? " " : ""}</span>)}</span>
          <span aria-hidden className="block"><Word i={words.length}>{t("h1b")}</Word>{" "}<Chrome delay={.45} /></span>
        </h1>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: EASE, delay: .55 }}
          className="mt-[22px] max-w-[44ch] text-[clamp(15px,1.4vw,17px)] leading-[1.55] text-muted [text-wrap:pretty]">
          {t("heroDesc")}
        </motion.p>
        <motion.div className="mt-[30px] w-full" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: EASE, delay: .68 }}>
          <Claim id="h1in" />
        </motion.div>
        <motion.a href="/esplora" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .8, delay: .85 }}
          className="group mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-muted underline-offset-4 transition-colors hover:text-white hover:underline">
          {t("exploreBtn")} <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
        </motion.a>
      </div>
      <div className="relative z-[1] mt-14 lg:mt-0"><LiveCard /></div>
    </section>
  );
}
