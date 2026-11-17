"use client";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import Claim from "./Claim";
import { kit } from "@/lib/site";
import { useHandle } from "@/lib/handle";
import { useT } from "@/lib/i18n";

const EASE = [0.23, 1, 0.32, 1] as const;

// a word that rises out of its own box
function Word({ children, i }: { children: React.ReactNode; i: number }) {
  return (
    <span className="inline-block overflow-hidden pb-[.08em] -mb-[.08em] align-top">
      <motion.span className="inline-block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: .9, ease: EASE, delay: .08 + i * .06 }}>{children}</motion.span>
    </span>
  );
}

function Globe() {
  const ref = useRef<HTMLCanvasElement>(null);
  const api = useRef<{ setName(n: string): void } | null>(null);
  const { handle } = useHandle();
  useEffect(() => {
    let alive = true;
    kit.globe().then(m => { if (alive && ref.current) { api.current = m.mountGlobe(ref.current); api.current?.setName(handle); } }).catch(() => {});
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { api.current?.setName(handle); }, [handle]);
  return (
    <motion.canvas ref={ref} aria-hidden initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.6, ease: EASE, delay: .2 }}
      className="pointer-events-none absolute z-[1] max-[860px]:bottom-[-22%] max-[860px]:h-[62%] max-[860px]:w-full max-[860px]:!opacity-55 min-[861px]:right-0 min-[861px]:top-0 min-[861px]:h-full min-[861px]:w-[62%]" />
  );
}

export default function Hero() {
  const name = "18kbio";
  const { t } = useT();
  const words = t("h1a").split(" ");
  return (
    <section id="top" aria-label={t("h1a")} className="vh relative isolate flex flex-col justify-center overflow-hidden bg-black max-[860px]:min-h-[770px]">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(55%_60%_at_20%_40%,rgba(255,255,255,.07),transparent_70%)]" />
      <Globe />
      <div className="relative z-[2] flex flex-col items-start px-4 pb-24 pt-[110px] text-left sm:px-[clamp(16px,6vw,96px)] sm:pt-[120px]">
        <h1 aria-label={`${t("h1a")} ${t("h1b")} 18kbio`} className="flex flex-col items-start text-[clamp(40px,6.4vw,92px)] font-bold leading-[1.02] tracking-[-.045em]">
          <span aria-hidden>{words.map((w, i) => <span key={w + i}><Word i={i}>{w}</Word>{i < words.length - 1 ? " " : ""}</span>)}</span>
          <span aria-hidden>
            <Word i={words.length}>{t("h1b")}</Word>{" "}
            <b className="hx-name">{[...name].map((ch, i) => <i key={i} style={{ ["--d" as string]: `${(.47 + i * .07).toFixed(2)}s` }}>{ch}</i>)}</b>
          </span>
        </h1>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: EASE, delay: .55 }}
          className="mt-[22px] max-w-[46ch] text-[clamp(15px,1.4vw,17px)] leading-[1.55] text-muted [text-wrap:pretty]">
          {t("heroDesc")}
        </motion.p>
        <motion.div className="mt-[30px] w-full" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: EASE, delay: .68 }}>
          <Claim id="h1in" />
        </motion.div>
        <motion.a href="/esplora" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .8, delay: .85 }}
          className="group mt-7 inline-flex min-h-[46px] items-center gap-2.5 rounded-xl border border-white/55 px-5 text-[15px] font-semibold transition-colors active:scale-[.97] hover:border-white hover:bg-white/14">
          {t("exploreBtn")} <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
        </motion.a>
      </div>
    </section>
  );
}
