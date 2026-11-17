"use client";
// "Tre passi. Un minuto." as a sticky scroll reveal (the 21st.dev / Aceternity pattern, rebuilt here):
// on computers the steps scroll on the left while one fixed panel on the right plays the matching scene;
// on phones each step shows its scene right under it.
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useHandle } from "@/lib/handle";
import { rarity } from "@/lib/site";
import { topProfiles, type Pro } from "./Proof";
import { useT } from "@/lib/i18n";

const ease = [0.23, 1, 0.32, 1] as const;
const ICONS = "https://cdn.jsdelivr.net/npm/simple-icons@11.14.0/icons/";
/** the most visited real profiles (none invented); empty until they arrive or if they can't be read */
function useTop() {
  const [l, setL] = useState<Pro[]>([]);
  useEffect(() => { topProfiles().then(d => setL(d.list)).catch(() => {}); }, []);
  return l;
}
const bgUrl = (u: string) => `url("${u.replace(/"/g, "%22")}")`;
// eslint-disable-next-line @next/next/no-img-element
const Logo = ({ s, className = "size-4" }: { s: string; className?: string }) => <img src={`${ICONS}${s}.svg`} alt={s} className={`${className} [filter:invert(1)]`} loading="lazy" onError={e => { e.currentTarget.style.visibility = "hidden"; }} />;
const QR = () => (
  <svg viewBox="0 0 24 24" aria-label="QR" className="size-4 fill-white"><path d="M3 3h8v8H3zm2 2v4h4V5zm8-2h8v8h-8zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zm8-2h2v2h-2zm2 2h2v2h-2zm2-2h2v2h-2zm2 2h2v2h-2zm-6 2h2v2h-2zm4 0h2v4h-2zm-4 2h2v2h-2zm4 2h2v2h-2z" /></svg>
);

/** on the sides of the panel: two columns of real profile photos sliding up and down */
function Rails({ list }: { list: Pro[] }) {
  if (list.length < 3) return null;
  const col = (l: Pro[], down: boolean) => (
    <div className="h-full overflow-hidden [mask-image:linear-gradient(transparent,#000_18%,#000_82%,transparent)]">
      <div className={`rail grid gap-3 ${down ? "down" : ""}`}>
        {[...l, ...l].map((p, i) => (
          <a key={i} href={"/" + p.handle} tabIndex={-1} title={"@" + p.handle} className="block size-12 rounded-2xl border border-white/10 bg-[#111] bg-cover bg-center opacity-60 transition-opacity hover:opacity-100" style={{ backgroundImage: bgUrl(p.avatar) }} />
        ))}
      </div>
    </div>
  );
  const half = Math.ceil(list.length / 2);
  return (
    <>
      <div className="absolute inset-y-0 left-4 hidden w-12 sm:block">{col(list.slice(0, half), false)}</div>
      <div className="absolute inset-y-0 right-4 hidden w-12 sm:block">{col([...list.slice(half), ...list.slice(0, 1)], true)}</div>
    </>
  );
}

/** 1: your address, with the real check of the name typed at the top of the page and its rarity */
function SceneClaim() {
  const { handle, status } = useHandle();
  const { t, list } = useT();
  const [name, pips] = rarity(handle || "tuonome");
  const names = list("howRarities"), idx = ["leggendaria", "epica", "rara", "classica"].indexOf(name);
  return (
    <div className="grid w-full max-w-[400px] gap-4">
      {/* a browser bar with your address */}
      <div className="overflow-hidden rounded-2xl border border-line-2 bg-black">
        <div className="flex items-center gap-1.5 border-b border-line px-3 py-2.5">{[0, 1, 2].map(i => <i key={i} className="size-2.5 rounded-full bg-white/15" />)}</div>
        <div className="flex items-center gap-2 px-4 py-4 font-mono text-[clamp(15px,1.8vw,22px)] tracking-[-.02em]">
          <svg viewBox="0 0 16 16" aria-hidden className="size-3.5 shrink-0 fill-none stroke-quiet [stroke-width:1.6]"><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" /></svg>
          <span className="truncate"><span className="text-quiet">18kbio.xyz/</span><span className="text-white">{handle || t("placeholder")}</span></span>
          <span className="inline-block h-[1em] w-[2px] shrink-0 animate-pulse bg-white" />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="flex items-center gap-2 rounded-full border border-line-2 px-3 py-1.5 font-mono text-[12px] text-muted">
          <i className={`size-1.5 rounded-full ${status.kind === "ok" ? "bg-[#3ddc84]" : status.kind === "no" ? "bg-[#ff5a5a]" : "bg-[#555]"}`} />
          {handle ? t(status.code, { h: handle }) : t("howTypeTop")}
        </span>
        {/* shorter names are rarer */}
        <span className="flex items-center gap-2 font-mono text-[12px] text-muted">{t("howRarity")} <b className="font-medium text-white">{names[idx]}</b>
          <span className="flex gap-0.5">{[0, 1, 2, 3].map(i => <i key={i} className={`h-3 w-1.5 rounded-sm ${i < pips ? "bg-white" : "bg-white/15"}`} />)}</span>
        </span>
      </div>
      <div className="flex flex-wrap gap-2">{list("howChips").map(c => <span key={c} className="rounded-full bg-white/[.06] px-3 py-1 text-[12px] text-muted">✓ {c}</span>)}</div>
    </div>
  );
}

/** 2: a real profile of the site, built piece by piece, with its socials as logos */
function SceneCompose() {
  const top = useTop();
  const { t, lang } = useT();
  const p = top[0];
  if (!p) return null;
  const acc = p.accent && p.accent.toLowerCase() !== "#ffffff" ? p.accent : "#ffffff";
  const socials = (p.socials.length ? p.socials : []).slice(0, 5);
  const piece = (d: number) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: .5, delay: d, ease } });
  return (
    <a href={"/" + p.handle} className="block w-[min(280px,78%)] overflow-hidden rounded-[26px] border bg-black text-center" style={{ borderColor: acc + "66" }}>
      <motion.div {...piece(0)} className="h-20 bg-s2 bg-cover bg-center" style={p.banner ? { backgroundImage: bgUrl(p.banner) } : undefined} />
      <div className="px-5 pb-5">
        <motion.div {...piece(.1)} className="mx-auto -mt-8 size-16 rounded-full border-4 border-black bg-[#1c1c1c] bg-cover bg-center" style={{ backgroundImage: bgUrl(p.avatar) }} />
        <motion.b {...piece(.25)} className="mt-2 block truncate text-lg">{p.name}</motion.b>
        <motion.p {...piece(.35)} className="font-mono text-[12px] text-muted">18kbio.xyz/{p.handle}</motion.p>
        {socials.length > 0 && (
          <motion.div {...piece(.45)} className="mt-3 flex justify-center gap-2">
            {socials.map(s => <span key={s} className="grid size-8 place-items-center rounded-full border border-line-2"><Logo s={s} className="size-3.5" /></span>)}
          </motion.div>
        )}
        <motion.span {...piece(.55)} className="mt-4 block rounded-xl border py-2.5 text-[13px]" style={{ borderColor: acc + "55", color: acc }}>{p.views.toLocaleString(lang === "it" ? "it-IT" : "en-US")} {t("howVisits")}</motion.span>
      </div>
    </a>
  );
}

/** 3: one link sent everywhere (logos, not names) and what is behind it */
function SceneShare() {
  const p = useTop()[0];
  const { handle } = useHandle();
  const { t, list } = useT();
  const shown = handle || p?.handle || t("placeholder");
  const APPS: [string, number, number][] = [["tiktok", 14, 16], ["instagram", 86, 18], ["discord", 10, 62], ["x", 90, 60], ["whatsapp", 30, 88], ["qr", 70, 88]];
  return (
    <div className="grid w-full max-w-[460px] gap-5">
      <div className="relative aspect-[4/3] w-full">
        <svg viewBox="0 0 100 75" className="absolute inset-0 size-full" aria-hidden>
          {APPS.map(([a, x, y], i) => (
            <motion.line key={a} x1="50" y1="37.5" x2={x} y2={y * .75} stroke="#fff" strokeOpacity=".3" strokeWidth=".35" strokeDasharray="1.2 1.2"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: .9, delay: .2 + i * .12, ease }} />
          ))}
        </svg>
        <motion.span initial={{ scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: .5, ease }}
          className="absolute left-1/2 top-1/2 max-w-[80%] -translate-x-1/2 -translate-y-1/2 truncate whitespace-nowrap rounded-full bg-white px-4 py-2 font-mono text-[13px] font-semibold text-black shadow-[0_0_0_6px_rgba(255,255,255,.08),0_0_60px_rgba(255,255,255,.18)]">18kbio.xyz/{shown}</motion.span>
        {APPS.map(([a, x, y], i) => (
          <motion.span key={a} initial={{ opacity: 0, scale: .6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .4, delay: .6 + i * .12, ease }}
            className="absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,.22),rgba(255,255,255,.04)_50%,#000)] shadow-[0_10px_24px_rgba(0,0,0,.6)]" style={{ left: x + "%", top: y + "%" }}>
            {a === "qr" ? <QR /> : <Logo s={a} />}
          </motion.span>
        ))}
      </div>
      {/* what the link carries: each feature lights up in turn */}
      <div className="flex flex-wrap justify-center gap-2">
        {list("howFeats").map((f, i) => <span key={f} style={{ ["--i" as string]: i }} className="feat-on rounded-full border border-line-2 px-3 py-1.5 text-[12px] font-medium text-muted">{f}</span>)}
      </div>
    </div>
  );
}

const SCENES = [SceneClaim, SceneCompose, SceneShare];

function Step({ i, title, text, onActive, list }: { i: number; title: string; text: string; onActive: (i: number) => void; list: Pro[] }) {
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
      <div className="relative mt-6 grid min-h-[300px] place-items-center overflow-hidden rounded-3xl border border-line bg-s1 px-5 py-6 sm:px-20 md:hidden"><Rails list={list} /><div className="relative grid w-full place-items-center"><Scene /></div></div>
    </div>
  );
}

export default function HowItWorks() {
  const { t } = useT();
  const steps = t("howSteps").split("\n").map(s => s.split("|"));
  const [active, setActive] = useState(0);
  const top = useTop();
  const Scene = SCENES[active];
  return (
    <section aria-label={`${t("howT1")} ${t("howT2")}`} className="px-4 py-14 sm:px-[clamp(16px,6vw,96px)] md:py-24">
      <div className="mx-auto max-w-[1180px]">
        <h2 className="text-[clamp(34px,5vw,64px)] font-bold leading-[1.02] tracking-[-.045em]">{t("howT1")} <span className="text-quiet">{t("howT2")}</span></h2>
        <div className="mt-6 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            {steps.map(([b, s], i) => <Step key={i} i={i} title={b} text={s} onActive={setActive} list={top} />)}
          </div>
          {/* computers: one fixed panel that follows the step you are reading */}
          <div className="hidden md:block">
            <div className="sticky top-[18vh] grid h-[64vh] place-items-center overflow-hidden rounded-[28px] border border-line bg-[radial-gradient(120%_90%_at_50%_0%,#151515,#060606_70%)] px-24 py-8">
              <Rails list={top} />
              <div className="absolute left-6 top-5 flex gap-1.5" aria-hidden>
                {steps.map((_, i) => <i key={i} className={`h-1 rounded-full transition-all duration-500 ${i === active ? "w-8 bg-white" : "w-3 bg-white/20"}`} />)}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={active} className="relative grid w-full place-items-center" initial={{ opacity: 0, y: 16, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
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
