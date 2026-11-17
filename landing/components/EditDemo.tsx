"use client";
// "Lo cambi come vuoi": a profile composed on a phone (with the name typed in the hero);
// the four steps (colours, background, fonts, socials) build the style in stop motion.
// The style is @1's when it has a photo or a background, otherwise a ready-made one.
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { HANDLE_RE, kit, profileOfOne, reducedMotion } from "@/lib/site";
import { useHandle } from "@/lib/handle";
import { useT } from "@/lib/i18n";

const STEP_MS = 3400;
const EXAMPLE_STYLE = "night-drive";
const ICONS = "https://cdn.jsdelivr.net/npm/simple-icons@11.14.0/icons/";
const ease = [0.23, 1, 0.32, 1] as const;

/** a small picture of the tool each step uses in the dashboard */
function Tool({ i }: { i: number }) {
  const chip = "rounded-lg border border-line-2 px-2.5 py-1 text-[12px] text-muted";
  if (i === 0) return (
    <div className="flex flex-wrap gap-1.5">{["#ffffff", "#ff3b6b", "#3b82f6", "#3ddc84", "#ffb547"].map(c => (
      <span key={c} className="size-6 rounded-full border border-white/20" style={{ background: c }} />))}</div>
  );
  if (i === 1) return <div className="flex flex-wrap gap-2">{["foto", "GIF", "video", "colore"].map(x => <span key={x} className={chip}>{x}</span>)}</div>;
  if (i === 2) return (
    <div className="flex flex-wrap gap-1.5">{[["Aa", "Geist"], ["Aa", "Instrument Serif"], ["Aa", "Unbounded"], ["Aa", "Geist Mono"]].map(([a, f]) => (
      <span key={f} className="grid size-8 place-items-center rounded-lg border border-line-2 text-[15px]" style={{ fontFamily: f, fontStyle: f.includes("Serif") ? "italic" : undefined }}>{a}</span>))}</div>
  );
  return (
    <div className="flex flex-wrap gap-1.5">{["discord", "instagram", "tiktok", "spotify"].map(s => (
      // eslint-disable-next-line @next/next/no-img-element
      <span key={s} className="grid size-8 place-items-center rounded-lg border border-line-2"><img src={`${ICONS}${s}.svg`} alt="" className="size-4 [filter:invert(1)]" loading="lazy" /></span>))}</div>
  );
}


/** the four step icons, all drawn with the same thin line */
const PATHS = [
  "M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4A4.6 4.6 0 0 0 21 9.8C21 6 17 3 12 3ZM7.5 11.5h.01M10 7.5h.01M15 7.5h.01",
  "M4 5h16v14H4zM4 15l4.5-4.5 4 4 2.5-2.5L20 17",
  "M4 19 9.5 5h1L16 19M6.3 14h7.4M17 19v-5.5a2.5 2.5 0 0 1 5 0V19",
  "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
];
function StepIcon({ i }: { i: number }) {
  return <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.6]"><path d={PATHS[i]} /></svg>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function EditDemo() {
  const sec = useRef<HTMLElement>(null);
  const pv = useRef<HTMLDivElement>(null);
  const phone = useRef<HTMLDivElement>(null);
  const inView = useInView(sec, { amount: .25 });
  const near = useInView(sec, { once: true, margin: "600px 0px" }); // the profile is built only when you get close (lighter page load)
  const [step, setStep] = useState(-1);
  const [auto, setAuto] = useState(true);
  const view = useRef<any>(null);
  const frames = useRef<any[]>([]);
  const base = useRef<any>(null); // @1, when it has something to show
  const { handle, guestHref } = useHandle();
  const { t } = useT();
  const steps = t("demoSteps").split("\n").map(s => s.split("|"));

  // whose profile is shown: the name typed at the top, else @1 (the owner's, when it has something to show), else "iltuonome".
  // No other user's profile on the home page.
  const who = () => {
    const h = HANDLE_RE.test(handle) ? handle : null;
    const b = base.current, ph = t("placeholder");
    const name = h || (b ? b.displayName || "1" : ph);
    return {
      handle: h || (b ? "1" : ph), displayName: name,
      bio: b?.bio || "", avatarUrl: h ? "" : b?.avatarUrl || "", badges: b?.badges || [], views: b?.views || 0,
      socials: b && Object.keys(b.socials || {}).length ? b.socials : {},
    };
  };

  const show = (n: number) => {
    const v = view.current; if (!v || !frames.current.length) return;
    const w = who(), k = Math.max(0, n);
    try { v.update({ ...w, links: [], socials: k < 3 ? {} : w.socials, appearance: frames.current[k] }); } catch { /* preview only */ }
  };

  // build the four frames once: colours, then background, then fonts, then everything
  useEffect(() => {
    if (!near) return;
    let alive = true;
    (async () => {
      const k = await kit.profile();
      const p = await profileOfOne();
      if (p && (p.avatarUrl || (p.appearance?.bg?.type && p.appearance.bg.type !== "color"))) base.current = p;
      const plain = k.normalizeAppearance({ ...k.DEFAULT_APPEARANCE, effect: "none" });
      const full = base.current
        ? k.normalizeAppearance({ ...(base.current.appearance || {}) })
        : k.normalizeAppearance(k.applyTemplate(plain, (k.TEMPLATES.find((x: any) => x.id === EXAMPLE_STYLE) || k.TEMPLATES[0]).a, "all"));
      // in the demo: no "click to enter" screen, no music, no sounds
      const quiet = (a: any) => ({ ...a, enter: { ...a.enter, on: false }, music: { ...(a.music || {}), type: "none" }, sfx: { ...(a.sfx || {}), on: false } });
      const f0 = k.applyTemplate(plain, full, "colors"), f1 = k.applyTemplate(f0, full, "bg"), f2 = k.applyTemplate(f1, full, "fonts");
      frames.current = [f0, f1, f2, full].map(quiet);
      if (!alive || !pv.current) return;
      view.current = k.mountProfile(pv.current, { ...who(), links: [], socials: {}, appearance: frames.current[0] }, { preview: true, entrance: false });
    })().catch(() => {});
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [near]);

  // a step: the phone jumps a few still frames while the profile changes
  useEffect(() => {
    if (step < 0) return;
    if (phone.current && !reducedMotion()) { phone.current.classList.remove("snap"); void phone.current.offsetWidth; phone.current.classList.add("snap"); }
    const id = setTimeout(() => show(step), reducedMotion() ? 0 : 120);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // the name typed in the hero is written on the phone
  useEffect(() => {
    const id = setTimeout(() => show(step), 200);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle, t]);

  // auto play while on screen; a click (or typing) pauses it for one extra step
  useEffect(() => {
    if (!inView || reducedMotion()) return;
    if (step < 0) { const id = setTimeout(() => setStep(0), 400); return () => clearTimeout(id); }
    const id = setTimeout(() => { setAuto(true); setStep(s => (s + 1) % 4); }, auto ? STEP_MS : STEP_MS * 2);
    return () => clearTimeout(id);
  }, [inView, step, auto]);

  const cur = Math.max(0, step);
  const pick = (i: number) => { setAuto(false); setStep(((i % 4) + 4) % 4); };

  // the arrow keys move the carousel while this section is on screen (not while typing in a field)
  useEffect(() => {
    if (!inView) return;
    const key = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      if (e.key === "ArrowRight") { e.preventDefault(); pick(cur + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); pick(cur - 1); }
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, cur]);

  // the four tiles sit on a ring seen from the front: the current one in front, the two next ones tilted on the sides, the last one behind
  const [ring, setRing] = useState(300);
  useEffect(() => { const r = () => setRing(Math.min(300, innerWidth * .34)); r(); addEventListener("resize", r); return () => removeEventListener("resize", r); }, []);
  const place = (i: number) => {
    const a = (((i - cur) % 4) + 4) % 4 * (Math.PI / 2); // 0 front, 90 right, 180 back, 270 left
    const c = Math.cos(a), sn = Math.sin(a);
    return { x: sn * ring, y: (1 - c) * (c < -.5 ? -14 : 26), rotate: sn * 12, scale: .78 + .22 * (c + 1) / 2 + (c > .5 ? .04 : 0), opacity: c < -.5 ? .22 : c > .5 ? 1 : .7, zIndex: Math.round(10 + c * 10) };
  };

  return (
    <section ref={sec} id="index" aria-label={`${t("demoT1")} ${t("demoT2")}`} className="overflow-x-clip px-4 py-14 sm:px-[clamp(16px,6vw,96px)] md:py-24">
      <div className="mx-auto max-w-[1180px]">
        <h2 className="text-center text-[clamp(34px,5vw,64px)] font-bold leading-[1.02] tracking-[-.045em]">{t("demoT1")}<br /><span className="chrome">{t("demoT2")}</span></h2>

        {/* the phone, on top in the middle */}
        <div className="mt-10 grid place-items-center">
          <div ref={phone} className="demo-phone relative w-[min(240px,62vw,calc(56svh*.53))] rounded-[46px] bg-[linear-gradient(145deg,#2a2a2a,#0c0c0c_40%,#1c1c1c)] p-[9px] shadow-[0_50px_100px_-40px_rgba(0,0,0,1),inset_0_0_0_1px_rgba(255,255,255,.12)] min-[901px]:w-[min(300px,calc(58svh*.53))]">
            <span aria-hidden className="absolute -left-[3px] top-[22%] h-12 w-[3px] rounded-l bg-[#2a2a2a]" />
            <span aria-hidden className="absolute -right-[3px] top-[28%] h-16 w-[3px] rounded-r bg-[#2a2a2a]" />
            <div className="relative aspect-[9/16.5] overflow-hidden rounded-[38px] bg-[#050505]">
              <div className="demo-pv absolute left-0 top-0"><div ref={pv} className="absolute inset-0" /></div>
              <span aria-hidden className="pointer-events-none absolute left-1/2 top-2.5 z-10 h-[22px] w-[34%] -translate-x-1/2 rounded-full bg-black" />
              <span aria-hidden className="pointer-events-none absolute inset-0 z-10 rounded-[38px] bg-[linear-gradient(120deg,rgba(255,255,255,.07),transparent_35%)]" />
            </div>
          </div>
        </div>

        {/* the four steps on a ring under the phone; the current one has a moving chrome frame */}
        <div role="tablist" aria-label={t("demoT1")} className="relative mx-auto -mt-6 h-[210px] w-full max-w-[900px] md:h-[200px]">
          {steps.map(([title], i) => {
            const on = i === cur, p = place(i);
            return (
              <motion.button key={i} type="button" role="tab" aria-selected={on} tabIndex={on ? 0 : -1} onClick={() => pick(i)}
                initial={false} animate={{ x: p.x, y: p.y, rotate: p.rotate, scale: p.scale, opacity: p.opacity }} transition={reducedMotion() ? { duration: 0 } : { type: "spring", stiffness: 140, damping: 20 }}
                style={{ zIndex: p.zIndex }}
                className={`demo-tile absolute left-1/2 top-6 -ml-[100px] flex w-[200px] flex-col gap-4 rounded-2xl border p-4 text-left md:-ml-[120px] md:w-[240px] ${on ? "chrome-frame border-transparent bg-[#141414]" : "border-white/10 bg-[#0d0d0d]"}`}>
                {on && <><i aria-hidden className="spark left-2 top-1.5" /><i aria-hidden className="spark spark-2 bottom-2 right-3" /></>}
                <span className="flex items-center gap-2.5">
                  <span aria-hidden className={`grid size-8 shrink-0 place-items-center rounded-lg ${on ? "bg-white text-black" : "border border-white/15 text-[#bdbdbd]"}`}><StepIcon i={i} /></span>
                  <b className={`text-[17px] font-semibold tracking-[-.02em] ${on ? "text-white" : "text-[#9a9a9a]"}`}>{title}</b>
                </span>
                <span className="block"><Tool i={i} /></span>
                <i aria-hidden key={on ? `${step}${auto}` : "x"} className={`absolute bottom-0 left-4 right-4 h-[2px] origin-left rounded bg-white/80 ${on && auto && step >= 0 ? "tile-bar" : "scale-x-0"}`} />
              </motion.button>
            );
          })}
        </div>

        {/* arrows (also ← → on the keyboard) and the try button */}
        <div className="mt-2 flex flex-col items-center gap-5">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => pick(cur - 1)} aria-label={t("demoPrev")} className="grid size-11 place-items-center rounded-full border border-white/15 text-[18px] transition-colors hover:border-white/50">←</button>
            <span className="min-w-[64px] text-center text-[13px] text-[#8a8a8a]">{cur + 1} / 4</span>
            <button type="button" onClick={() => pick(cur + 1)} aria-label={t("demoNext")} className="grid size-11 place-items-center rounded-full border border-white/15 text-[18px] transition-colors hover:border-white/50">→</button>
          </div>
          <a href={guestHref("/dashboard")} className="group inline-flex min-h-[48px] items-center gap-2.5 rounded-xl bg-white px-5 text-[15px] font-semibold text-black transition-transform active:scale-[.97]">
            {t("demoTry")} <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
