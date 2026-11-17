"use client";
// "Tre passi. Un minuto." as a sticky scroll reveal (the 21st.dev / Aceternity pattern, rebuilt here):
// on computers the steps scroll on the left while one fixed panel on the right plays the matching scene;
// on phones each step shows its scene right under it.
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useHandle } from "@/lib/handle";
import { topProfiles, type Pro } from "./Proof";
import { useT } from "@/lib/i18n";

const ease = [0.23, 1, 0.32, 1] as const;
/** the most visited real profile (none invented); null until it arrives or if it can't be read */
function useTopProfile() {
  const [p, setP] = useState<Pro | null>(null);
  useEffect(() => { topProfiles().then(d => setP(d.list[0] || null)).catch(() => {}); }, []);
  return p;
}
const bgUrl = (u: string) => `url("${u.replace(/"/g, "%22")}")`;

/** 1: your address, with the real check of the name typed at the top of the page */
function SceneClaim() {
  const { handle, status } = useHandle();
  const { t } = useT();
  return (
    <div className="grid w-full place-items-center gap-6">
      <div className="font-mono text-[clamp(20px,2.6vw,34px)] tracking-[-.02em]">
        <span className="text-quiet">18kbio.xyz/</span><span className="text-white">{handle || t("placeholder")}</span><span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[3px] animate-pulse bg-white" />
      </div>
      <span className="flex items-center gap-2 rounded-full border border-line-2 px-3 py-1.5 font-mono text-[12px] text-muted">
        <i className={`size-1.5 rounded-full ${status.kind === "ok" ? "bg-[#3ddc84]" : status.kind === "no" ? "bg-[#ff5a5a]" : "bg-[#555]"}`} />
        {handle ? t(status.code, { h: handle }) : t("howTypeTop")}
      </span>
    </div>
  );
}

/** 2: a real profile of the site, built piece by piece */
function SceneCompose() {
  const p = useTopProfile();
  if (!p) return null;
  const acc = p.accent && p.accent.toLowerCase() !== "#ffffff" ? p.accent : "#ffffff";
  const piece = (d: number) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: .5, delay: d, ease } });
  return (
    <a href={"/" + p.handle} className="block w-[min(280px,80%)] overflow-hidden rounded-[26px] border bg-black text-center" style={{ borderColor: acc + "66" }}>
      <motion.div {...piece(0)} className="h-20 bg-s2 bg-cover bg-center" style={p.banner ? { backgroundImage: bgUrl(p.banner) } : undefined} />
      <div className="px-5 pb-5">
        <motion.div {...piece(.1)} className="mx-auto -mt-8 size-16 rounded-full border-4 border-black bg-[#1c1c1c] bg-cover bg-center" style={{ backgroundImage: bgUrl(p.avatar) }} />
        <motion.b {...piece(.25)} className="mt-2 block truncate text-lg">{p.name}</motion.b>
        <motion.p {...piece(.35)} className="font-mono text-[12px] text-muted">18kbio.xyz/{p.handle}</motion.p>
        <motion.span {...piece(.5)} className="mt-4 block rounded-xl border py-2.5 text-[13px]" style={{ borderColor: acc + "55", color: acc }}>{p.views.toLocaleString("it-IT")} visite</motion.span>
      </div>
    </a>
  );
}

/** 3: one link sent everywhere (a real profile's address) */
function SceneShare() {
  const p = useTopProfile();
  const { handle } = useHandle();
  const { t } = useT();
  const shown = handle || p?.handle || t("placeholder");
  const APPS: [string, number, number][] = [["TikTok", 14, 18], ["Instagram", 86, 22], ["Discord", 12, 80], ["QR", 88, 78]];
  return (
    <div className="relative aspect-[4/3] w-full max-w-[460px]">
      <svg viewBox="0 0 100 75" className="absolute inset-0 size-full" aria-hidden>
        {APPS.map(([a, x, y], i) => (
          <motion.line key={a} x1="50" y1="37.5" x2={x} y2={y * .75} stroke="#fff" strokeOpacity=".35" strokeWidth=".35" strokeDasharray="1.2 1.2"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: .9, delay: .2 + i * .15, ease }} />
        ))}
      </svg>
      <motion.span initial={{ scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: .5, ease }}
        className="absolute left-1/2 top-1/2 max-w-[80%] -translate-x-1/2 -translate-y-1/2 truncate whitespace-nowrap rounded-full bg-white px-4 py-2 font-mono text-[13px] font-semibold text-black shadow-[0_0_0_6px_rgba(255,255,255,.08)]">18kbio.xyz/{shown}</motion.span>
      {APPS.map(([a, x, y], i) => (
        <motion.span key={a} initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .4, delay: .7 + i * .15, ease }}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-line-2 bg-black px-3 py-1.5 text-[12px] text-muted" style={{ left: x + "%", top: y + "%" }}>{a}</motion.span>
      ))}
    </div>
  );
}

const SCENES = [SceneClaim, SceneCompose, SceneShare];

function Step({ i, title, text, onActive }: { i: number; title: string; text: string; onActive: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: .6 });
  useEffect(() => { if (inView) onActive(i); }, [inView, i, onActive]);
  const Scene = SCENES[i];
  return (
    <div ref={ref} className="flex flex-col justify-center py-10 md:min-h-[62vh]">
      <span className="font-mono text-[12px] text-quiet">0{i + 1} / 03</span>
      <b className="mt-3 text-[clamp(26px,3vw,40px)] font-semibold leading-[1.05] tracking-[-.04em]">{title}</b>
      <p className="mt-3 max-w-[38ch] text-[16px] leading-[1.55] text-muted">{text}</p>
      {/* phones: the scene right under the step */}
      <div className="mt-6 grid min-h-[260px] place-items-center rounded-3xl border border-line bg-s1 p-5 md:hidden"><Scene /></div>
    </div>
  );
}

export default function HowItWorks() {
  const { t } = useT();
  const steps = t("howSteps").split("\n").map(s => s.split("|"));
  const [active, setActive] = useState(0);
  const Scene = SCENES[active];
  return (
    <section aria-label={`${t("howT1")} ${t("howT2")}`} className="px-4 py-14 sm:px-[clamp(16px,6vw,96px)] md:py-24">
      <div className="mx-auto max-w-[1180px]">
        <h2 className="text-[clamp(34px,5vw,64px)] font-bold leading-[1.02] tracking-[-.045em]">{t("howT1")} <span className="text-quiet">{t("howT2")}</span></h2>
        <div className="mt-6 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            {steps.map(([b, s], i) => <Step key={i} i={i} title={b} text={s} onActive={setActive} />)}
          </div>
          {/* computers: one fixed panel that follows the step you are reading */}
          <div className="hidden md:block">
            <div className="sticky top-[18vh] grid h-[64vh] place-items-center overflow-hidden rounded-[28px] border border-line bg-[radial-gradient(120%_90%_at_50%_0%,#151515,#060606_70%)] p-8">
              <div className="absolute left-6 top-5 flex gap-1.5" aria-hidden>
                {steps.map((_, i) => <i key={i} className={`h-1 rounded-full transition-all duration-500 ${i === active ? "w-8 bg-white" : "w-3 bg-white/20"}`} />)}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={active} className="grid w-full place-items-center" initial={{ opacity: 0, y: 16, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(6px)" }} transition={{ duration: .45, ease }}>
                  <Scene />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
