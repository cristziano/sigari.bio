"use client";
// "Tre passi. Un minuto.": a guided scroll. The stage stays still on screen while you scroll through the three steps;
// when you stop between two steps the page settles on the nearest one, so you never land half way.
// Left: the steps (the current one open, with its facts); right: the scene of that step, built with the name typed at the top.
// No other user's profile: the scenes show your own @ (or "iltuonome").
import { Fragment, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useHandle } from "@/lib/handle";
import { rarity, reducedMotion } from "@/lib/site";
import { useT } from "@/lib/i18n";

const ease = [0.23, 1, 0.32, 1] as const;
// social icons (simple-icons, CC0) saved inside the site, no external requests
const ICONS = "/sigari-bio/landing/icons/";
const NAMES: Record<string, string> = {"discord":"Discord","instagram":"Instagram","tiktok":"TikTok","spotify":"Spotify","youtube":"YouTube","x":"X","whatsapp":"WhatsApp"};
// eslint-disable-next-line @next/next/no-img-element
const Logo = ({ s, className = "size-4" }: { s: string; className?: string }) => <img src={`${ICONS}${s}.svg`} alt={NAMES[s] ?? s} className={`${className} [filter:invert(1)]`} loading="lazy" onError={e => { e.currentTarget.style.visibility = "hidden"; }} />;
const piece = (d: number) => ({ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: .45, delay: d, ease } });

/** the name typed at the top, or example names that type themselves while it is empty */
const EXAMPLES = ["iltuonome", "giulia_", "darkwave", "marco", "sofi"];
function useTypedName() {
  const { handle } = useHandle();
  const [demo, setDemo] = useState(EXAMPLES[0]);
  useEffect(() => {
    if (handle || reducedMotion()) return;
    let w = 0, n = EXAMPLES[0].length, del = true, id: ReturnType<typeof setTimeout>;
    const step = () => {
      if (del) { n--; if (n <= 0) { del = false; w = (w + 1) % EXAMPLES.length; } }
      else { n++; if (n >= EXAMPLES[w].length) { del = true; setDemo(EXAMPLES[w]); id = setTimeout(step, 1600); return; } }
      setDemo(EXAMPLES[w].slice(0, Math.max(0, n)));
      id = setTimeout(step, del ? 45 : 90);
    };
    id = setTimeout(step, 1400);
    return () => clearTimeout(id);
  }, [handle]);
  return handle || demo;
}

/** 1: a real browser window with your address, the live check of the name and its rarity */
function SceneClaim() {
  const { handle, status } = useHandle();
  const { t, list } = useT();
  const name = useTypedName();
  const [rname, pips] = rarity(handle || "tuonome");
  const names = list("howRarities"), idx = ["leggendaria", "epica", "rara", "classica"].indexOf(rname);
  const len = (handle || "").length;
  return (
    <div className="grid w-full max-w-[440px] gap-3">
      <motion.div {...piece(0)} className="overflow-hidden rounded-2xl border border-white/15 bg-[#050505] shadow-[0_30px_60px_-30px_rgba(0,0,0,1)]">
        {/* tab bar */}
        <div className="flex items-end gap-2 bg-[#111] px-3 pt-2.5">
          <span className="flex gap-1.5 pb-2.5">{["#3a3a3a", "#3a3a3a", "#3a3a3a"].map((c, i) => <i key={i} className="size-2.5 rounded-full" style={{ background: c }} />)}</span>
          <span className="ml-2 flex min-w-0 max-w-[60%] items-center gap-2 rounded-t-lg bg-[#050505] px-3 py-1.5 text-[11.5px] text-[#bdbdbd]">
            <b className="grid size-4 shrink-0 place-items-center rounded-[4px] bg-white text-[7px] font-black text-black">18k</b>
            <span className="truncate">@{name || "…"} · 18kbio</span><span aria-hidden className="text-[#666]">×</span>
          </span>
        </div>
        {/* address bar */}
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
          <span aria-hidden className="text-[13px] text-[#666]">↻</span>
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-[#141414] px-3 py-1.5 text-[clamp(13px,1.5vw,16px)]">
            <svg viewBox="0 0 16 16" aria-hidden className="size-3.5 shrink-0 fill-none stroke-[#8a8a8a] [stroke-width:1.6]"><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" /></svg>
            <span className="truncate"><span className="text-[#8a8a8a]">18kbio.xyz/</span><span className="font-medium text-white">{name}</span></span>
            <span className="inline-block h-[1em] w-[2px] shrink-0 animate-pulse bg-white" />
          </div>
        </div>
        {/* the page loading */}
        <div className="flex items-center gap-3 px-4 py-4">
          <span className="sk size-11 shrink-0 rounded-full" />
          <span className="grid flex-1 gap-2"><span className="sk h-2.5 w-2/5 rounded" /><span className="sk h-2 w-3/5 rounded" /></span>
        </div>
        <div className="grid gap-2 px-4 pb-4"><span className="sk h-8 rounded-lg" /><span className="sk h-8 rounded-lg" /></div>
      </motion.div>
      <motion.div {...piece(.12)} className="grid grid-cols-3 gap-2.5">
        <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#8a8a8a]">{t("howState")}</p>
          <p className={`mt-1.5 flex items-center gap-1.5 text-[13px] font-semibold ${status.kind === "ok" ? "text-[#3ddc84]" : "text-white"}`}>
            <i className={`size-2 shrink-0 rounded-full ${status.kind === "ok" ? "animate-pulse bg-[#3ddc84]" : status.kind === "no" ? "bg-white" : "bg-[#555]"}`} />
            <span className="truncate">{!handle ? t("howTry") : status.kind === "ok" ? t("howFree") : status.kind === "no" ? t("howTaken") : t("stWait")}</span>
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#8a8a8a]">{t("howRarity")}</p>
          <p className="mt-1.5 flex items-center gap-1.5 text-[13px] font-semibold">{names[idx]}
            <span className="flex gap-0.5">{[0, 1, 2, 3].map(i => <i key={i} className={`h-3 w-1 rounded-sm ${i < pips ? "bg-white" : "bg-white/15"}`} />)}</span>
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#8a8a8a]">{t("howLen")}</p>
          <p className="mt-1.5 text-[13px] font-semibold">{len}<span className="text-[#8a8a8a]">/20</span></p>
          <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-white/10"><span className="block h-full rounded-full bg-white transition-[width] duration-300" style={{ width: `${len * 5}%` }} /></span>
        </div>
      </motion.div>
      <p className="text-right text-[11px] text-[#8a8a8a]">{t("howRarityWhy")}</p>
    </div>
  );
}

/** 2: your profile, like a real one: moving banner, chrome ring on the photo, badges, links, the music player and the card button */
function SceneCompose() {
  const { t, list } = useT();
  const name = useTypedName();
  const [l1, l2] = list("howLinks");
  return (
    <div className="w-[min(320px,100%)] overflow-hidden rounded-[28px] border border-white/15 bg-[#0b0b0b] shadow-[0_40px_80px_-40px_rgba(0,0,0,1)]">
      <motion.div {...piece(0)} className="banner-silk relative h-24 border-b border-white/10">
        <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-[10.5px] font-medium text-white/80 backdrop-blur-sm">♪ {t("howNow")}</span>
      </motion.div>
      <div className="px-5 pb-5">
        <motion.div {...piece(.08)} className="relative z-10 -mt-10 w-fit">
          <span className="ring-chrome grid size-[78px] place-items-center rounded-full p-[3px]">
            <span className="grid size-full place-items-center rounded-full border-[3px] border-[#0b0b0b] bg-white text-[28px] font-bold uppercase text-black">{(name || "i").slice(0, 1)}</span>
          </span>
          <i aria-hidden className="absolute bottom-1.5 right-1.5 size-3.5 rounded-full border-[3px] border-[#0b0b0b] bg-[#3ddc84]" />
        </motion.div>
        <motion.div {...piece(.16)} className="mt-2">
          <span className="flex items-center gap-2">
            <b className="truncate text-[20px] tracking-[-.02em]">{name || "…"}</b>
            <span className="shrink-0 rounded-md border border-white/20 px-1.5 py-0.5 text-[10px] font-semibold">✦ {t("howNew")}</span>
          </span>
          <span className="text-[12.5px] text-[#8a8a8a]">18kbio.xyz/{name}</span>
          <p className="mt-2 text-[13px] leading-[1.45] text-[#bdbdbd]">{t("howBio")}</p>
        </motion.div>
        <motion.div {...piece(.24)} className="mt-3 flex gap-2">
          {["discord", "instagram", "tiktok", "spotify", "youtube"].map(n => <span key={n} className="grid size-9 place-items-center rounded-xl border border-white/12 bg-white/[.04] transition-colors hover:bg-white/15"><Logo s={n} className="size-4" /></span>)}
        </motion.div>
        <div className="mt-4 grid gap-2">
          {[[l1, "instagram"], [l2, "youtube"]].map(([l, ic], i) => (
            <motion.span key={l} {...piece(.32 + i * .08)} className={`${i ? "max-md:hidden " : ""}link-shine relative flex items-center gap-3 overflow-hidden rounded-xl border border-white/15 px-3 py-2.5 text-[13.5px] font-medium`}>
              <Logo s={ic} className="size-4" /><span className="flex-1">{l}</span><span aria-hidden className="text-[#8a8a8a]">↗</span>
            </motion.span>
          ))}
        </div>
        <motion.div {...piece(.48)} className="mt-2 flex items-center gap-3 rounded-xl bg-white px-2.5 py-2 text-black">
          <span aria-hidden className="flex h-9 w-9 shrink-0 items-end justify-center gap-[3px] rounded-lg bg-black px-1.5 pb-2">
            {[0, 1, 2, 3].map(i => <i key={i} className="eq-bar block w-[3px] rounded-sm bg-white" style={{ animationDelay: `${-i * .27}s` }} />)}
          </span>
          <span className="min-w-0 flex-1">
            <b className="block text-[13px] leading-tight">{t("howMusic")}</b>
            <span className="block text-[11px] text-black/55">{t("howArtist")}</span>
            <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-black/15"><span className="music-bar block h-full rounded-full bg-black" /></span>
          </span>
          <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-full bg-black text-[10px] text-white">❚❚</span>
        </motion.div>
        <motion.span {...piece(.56)} className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-white/20 py-2 text-[12.5px] font-medium">
          <svg viewBox="0 0 24 24" aria-hidden className="size-4 fill-none stroke-current [stroke-width:1.6]"><rect x="2" y="5" width="20" height="14" rx="3" /><path d="M6 15h6M6 11h3" /><circle cx="17" cy="11" r="2" /></svg>{t("howCardBtn")}
        </motion.span>
      </div>
    </div>
  );
}

/** 3: one link sent everywhere: light runs from your link to every app; "copia" turns into "copiato" */
function SceneShare() {
  const { t, list } = useT();
  const name = useTypedName();
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (reducedMotion()) return;
    const id = setInterval(() => setCopied(c => !c), 2200);
    return () => clearInterval(id);
  }, []);
  const APPS: [string, number, number, string][] = [["tiktok", 13, 14, "bio"], ["instagram", 87, 14, "bio"], ["discord", 7, 56, "stato"], ["x", 93, 56, "bio"], ["whatsapp", 30, 92, "storia"]];
  return (
    <div className="grid w-full max-w-[470px] gap-4">
      <div className="relative aspect-[4/3] w-full">
        <svg viewBox="0 0 100 75" className="absolute inset-0 size-full" aria-hidden>
          {APPS.map(([a, x, y], i) => (
            <g key={a}>
              <motion.line x1="50" y1="37.5" x2={x} y2={y * .75} stroke="#fff" strokeOpacity=".22" strokeWidth=".3" strokeDasharray="1 1"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: .7, delay: .1 + i * .08, ease }} />
              {!reducedMotion() && <motion.circle r=".9" fill="#fff" initial={{ cx: 50, cy: 37.5, opacity: 0 }} animate={{ cx: [50, x], cy: [37.5, y * .75], opacity: [0, 1, 0] }}
                transition={{ duration: 1.6, delay: .8 + i * .35, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }} />}
            </g>
          ))}
        </svg>
        <motion.div initial={{ scale: .85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: .45, ease }}
          className="absolute left-1/2 top-1/2 flex max-w-[86%] -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full bg-white py-1 pl-4 pr-1 text-black shadow-[0_0_0_6px_rgba(255,255,255,.08),0_0_50px_rgba(255,255,255,.15)]">
          <span className="truncate text-[13.5px] font-semibold">18kbio.xyz/{name}</span>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-semibold transition-colors ${copied ? "bg-[#3ddc84] text-black" : "bg-black text-white"}`}>{copied ? `✓ ${t("howCopied")}` : t("howCopy")}</span>
        </motion.div>
        {APPS.map(([a, x, y, label], i) => (
          <motion.span key={a} initial={{ opacity: 0, scale: .7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .35, delay: .4 + i * .08, ease }}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1" style={{ left: x + "%", top: y + "%" }}>
            <span className="grid size-11 place-items-center rounded-xl border border-white/15 bg-[#111]"><Logo s={a} /></span>
            <span className="rounded bg-black/60 px-1.5 text-[10px] text-[#bdbdbd]">{label}</span>
          </motion.span>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {list("howFeats").map((f, i) => <span key={f} style={{ ["--i" as string]: i }} className="feat-on rounded-full border border-white/15 px-3 py-1.5 text-[12px] font-medium text-muted">{f}</span>)}
      </div>
    </div>
  );
}

const SCENES = [SceneClaim, SceneCompose, SceneShare];

export default function HowItWorks() {
  const { t } = useT();
  const steps = t("howSteps").split("\n").map(s => s.split("|"));
  const facts = t("howFacts").split("\n").map(s => s.split("|"));
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const marks = useRef<(HTMLDivElement | null)[]>([]);
  const Scene = SCENES[active];

  // which step is on screen depends on how far you scrolled through the section;
  // when you stop between two steps, the page settles on the nearest one
  useEffect(() => {
    const w = wrap.current;
    if (!w) return;
    let idle: ReturnType<typeof setTimeout>, settling = false;
    const progress = () => { const r = w.getBoundingClientRect(); return -r.top / Math.max(1, r.height - innerHeight); };
    const onScroll = () => {
      const p = progress();
      setActive(Math.max(0, Math.min(2, Math.round(p * 2))));
      clearTimeout(idle);
      if (settling) return;
      idle = setTimeout(() => {
        const q = progress();
        if (q <= .01 || q >= .99) return; // outside the stage: leave the page alone
        const i = Math.round(q * 2);
        if (Math.abs(q - i / 2) < .015) return;
        settling = true;
        marks.current[i]?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
        setTimeout(() => { settling = false; }, 700);
      }, 220);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => { removeEventListener("scroll", onScroll); clearTimeout(idle); };
  }, []);

  return (
    <section aria-label={`${t("howT1")} ${t("howT2")}`} className="px-4 sm:px-[clamp(16px,6vw,96px)]">
      {/* three screens of scroll; the stage stays still while you go through them */}
      <div ref={wrap} className="relative mx-auto max-w-[1180px]" style={{ height: "calc(300svh * var(--vz, 1))" }}>
        {[0, 1, 2].map(i => <div key={i} ref={el => { marks.current[i] = el; }} aria-hidden className="absolute inset-x-0 h-px" style={{ top: `calc(${i * 100}svh * var(--vz, 1))` }} />)}
        <div className="sticky top-0 flex flex-col justify-center gap-4 pb-5 pt-[68px] md:gap-6 md:pb-6 md:pt-[72px] md:grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] md:items-center md:gap-12"
          style={{ height: "calc(100svh * var(--vz, 1))" }}>
          {/* right: the title on top, the steps under it (the current one is open); left: the scene of that step */}
          <div className="flex flex-col gap-4 md:col-start-2 md:row-start-1 md:gap-6">
          <h2 className="text-[clamp(28px,4.2vw,56px)] font-bold leading-[1.02] tracking-[-.045em]">{t("howT1")} <span className="chrome">{t("howT2")}</span></h2>
          {/* phones: the three numbers in a row, the current one white */}
          <div aria-hidden className="flex items-center gap-2 md:hidden">
            {steps.map((_, i) => <span key={i} className="flex items-center gap-2"><i className={`grid size-7 place-items-center rounded-full border text-[12px] font-semibold not-italic transition-colors duration-300 ${i <= active ? "border-white bg-white text-black" : "border-white/20 text-[#8a8a8a]"}`}>{i + 1}</i>{i < 2 && <i className={`h-px w-8 transition-colors duration-300 ${i < active ? "bg-white" : "bg-white/15"}`} />}</span>)}
          </div>
          <ol className="relative grid gap-1 md:gap-2">
            <span aria-hidden className="absolute bottom-3 left-[15px] top-3 w-px bg-white/10 max-md:hidden" />
            <motion.span aria-hidden className="absolute left-[15px] top-3 w-px origin-top bg-white max-md:hidden" style={{ height: "calc(100% - 24px)" }} animate={{ scaleY: active / 2 }} transition={{ duration: .4, ease }} />
            {steps.map(([title, text], i) => {
              const on = i === active;
              return (
                <li key={i} className={`relative pl-12 max-md:pl-0 ${on ? "" : "max-md:hidden"}`}>
                  <div aria-current={on ? "step" : undefined} className="block w-full py-2 text-left">
                    <span aria-hidden className={`absolute left-0 top-2.5 grid size-[31px] max-md:hidden place-items-center rounded-full border text-[13px] font-semibold transition-colors duration-300 ${i <= active ? "border-white bg-white text-black" : "border-white/20 bg-black text-[#8a8a8a]"}`}>{i + 1}</span>
                    <b className={`block text-[clamp(20px,2.2vw,30px)] font-semibold leading-[1.1] tracking-[-.035em] transition-colors duration-300 ${on ? "text-white" : "text-[#5f5f5f]"}`}>{title}</b>
                  </div>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div key="open" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .35, ease }} className="overflow-hidden">
                        <p className="max-w-[40ch] pb-3 text-[15px] leading-[1.55] text-[#bdbdbd] max-md:text-[14px]">{text}</p>
                        <div className="flex flex-wrap gap-2 pb-3 max-md:hidden">
                          {/* the space after each chip keeps the words apart when the text is read or copied (flex hides it) */}
                          {facts[i].map(f => <Fragment key={f}><span className="rounded-lg border border-white/15 bg-white/[.04] px-2.5 py-1.5 text-[12.5px] font-medium">{f}</span>{" "}</Fragment>)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ol>
          </div>
          {/* the scene of the current step */}
          <div className="relative grid min-h-0 flex-1 place-items-center overflow-hidden rounded-[28px] border border-white/10 bg-[#080808]/80 p-5 md:col-start-1 md:row-start-1 md:h-[min(600px,80%)] md:flex-none md:p-8">
            <AnimatePresence mode="wait">
              <motion.div key={active} className="grid w-full place-items-center max-md:scale-[.54]" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }} transition={{ duration: .3, ease }}>
                <Scene />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
