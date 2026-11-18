"use client";
// "Lo cambi come vuoi": a profile composed on a phone (with the name typed in the hero);
// the four steps (colours, background, fonts, socials) build the style in stop motion.
// The style is @1's when it has a photo or a background, otherwise a ready-made one.
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { HANDLE_RE, kit, profileOfOne, reducedMotion } from "@/lib/site";
import { useHandle } from "@/lib/handle";
import { useT } from "@/lib/i18n";

const STEP_MS = 3400;
const EXAMPLE_STYLE = "night-drive";
// social icons (simple-icons, CC0) saved inside the site, no external requests
const ICONS = "/sigari-bio/landing/icons/";
const NAMES: Record<string, string> = {"discord":"Discord","instagram":"Instagram","tiktok":"TikTok","spotify":"Spotify","youtube":"YouTube","x":"X","whatsapp":"WhatsApp"};
const ease = [0.23, 1, 0.32, 1] as const;

/** a small picture of the tool each step uses in the dashboard */
function Tool({ i }: { i: number }) {
  const chip = "rounded-lg border border-line-2 px-2.5 py-1 text-[12px] text-muted";
  if (i === 0) return null;
  if (i === 1) return <div className="flex flex-wrap gap-2">{["foto", "GIF", "video", "colore"].map(x => <span key={x} className={chip}>{x}</span>)}</div>;
  if (i === 2) return (
    <div className="flex flex-wrap gap-1.5">{[["Aa", "Geist"], ["Aa", "Instrument Serif"], ["Aa", "Unbounded"], ["Aa", "Geist Mono"]].map(([a, f]) => (
      <span key={f} className="grid size-8 place-items-center rounded-lg border border-line-2 text-[15px]" style={{ fontFamily: f, fontStyle: f.includes("Serif") ? "italic" : undefined }}>{a}</span>))}</div>
  );
  return (
    <div className="flex flex-wrap gap-1.5">{["discord", "instagram", "tiktok", "spotify"].map(s => (
      // eslint-disable-next-line @next/next/no-img-element
      <span key={s} className="grid size-8 place-items-center rounded-lg border border-line-2"><img src={`${ICONS}${s}.svg`} alt={NAMES[s] ?? s} className="size-4 [filter:invert(1)]" loading="lazy" /></span>))}</div>
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
    if (step >= 3) return; // it stops on the last step: never back to the start by itself
    const id = setTimeout(() => { setAuto(true); setStep(s => Math.min(3, s + 1)); }, auto ? STEP_MS : STEP_MS * 2);
    return () => clearTimeout(id);
  }, [inView, step, auto]);

  const cur = Math.max(0, step);
  // forward only, one step at a time: no jumping ahead, no going back
  const next = () => { if (cur < 3) { setAuto(false); setStep(cur + 1); } };

  // the → key moves to the next step while this section is on screen (not while typing in a field)
  useEffect(() => {
    if (!inView) return;
    const key = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, cur]);

  return (
    <section ref={sec} id="index" aria-label={`${t("demoT1")} ${t("demoT2")}`} className="px-4 py-12 sm:px-[clamp(16px,6vw,96px)] md:py-16">
      {/* left: the phone that changes; right: the title on top and the steps under it */}
      <div className="mx-auto grid max-w-[1080px] items-center gap-x-[clamp(24px,5vw,72px)] gap-y-6 md:grid-cols-[auto_minmax(0,1fr)]">
        <h2 className="text-[clamp(30px,4.4vw,56px)] font-bold leading-[1.02] tracking-[-.045em] md:col-start-2 md:row-start-1 md:self-end">{t("demoT1")}<br /><span className="chrome">{t("demoT2")}</span></h2>

        {/* the phone: the same frame as the dashboard preview (360 px wide, up to 720 px tall, thin border, 34 px corners),
            with the profile drawn at its real size, exactly like there */}
        <div className="grid place-items-center md:col-start-1 md:row-span-2 md:row-start-1">
          <div ref={phone} className="demo-phone relative h-[min(560px,72svh)] w-full max-w-[360px] overflow-hidden rounded-[34px] border border-[#2c2c2c] bg-black md:h-[min(720px,calc(84svh*var(--vz,1)))] md:w-[360px]">
            <div ref={pv} className="demo-pv absolute inset-0" />
          </div>
        </div>

        {/* the steps, one line each; the current one is open and has the moving chrome frame */}
        <div className="min-w-0 md:col-start-2 md:row-start-2 md:self-start">
          <ol className="grid gap-2">
            {steps.map(([title], i) => {
              const on = i === cur, done = i < cur;
              return (
                <li key={i} aria-current={on ? "step" : undefined}
                  className={`relative rounded-2xl border px-3.5 py-3 transition-colors duration-300 md:px-4 ${on ? "chrome-frame border-transparent bg-[#141414]" : "border-white/10 bg-[#0d0d0d]/80"}`}>
                  {on && <><i aria-hidden className="spark left-2 top-1.5" /><i aria-hidden className="spark spark-2 bottom-2 right-3" /></>}
                  <span className="flex items-center gap-2.5">
                    <span aria-hidden className={`grid size-7 shrink-0 place-items-center rounded-lg md:size-8 ${on ? "bg-white text-black" : done ? "border border-white/30 text-white" : "border border-white/12 text-[#6f6f6f]"}`}>{done ? "✓" : <StepIcon i={i} />}</span>
                    <b className={`text-[15px] font-semibold tracking-[-.02em] md:text-[17px] ${on ? "text-white" : done ? "text-[#bdbdbd]" : "text-[#6f6f6f]"}`}>{title}</b>
                  </span>
                  {on && i > 0 && <span className="mt-3 block max-md:hidden"><Tool i={i} /></span>}
                  <i aria-hidden key={on ? `${step}${auto}` : "x"} className={`absolute bottom-0 left-4 right-4 h-[2px] origin-left rounded bg-white/80 ${on && auto && step >= 0 && i < 3 ? "tile-bar" : "scale-x-0"}`} />
                </li>
              );
            })}
          </ol>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {cur < 3
              ? <button type="button" onClick={next} className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/20 px-4 text-[14px] font-semibold transition-colors hover:border-white/60">{t("demoNext")} <span aria-hidden>→</span></button>
              : null}
            <a href={guestHref("/dashboard")} className={`group inline-flex min-h-[44px] items-center gap-2.5 rounded-xl px-4 text-[14px] font-semibold transition-transform active:scale-[.97] ${cur === 3 ? "bg-white text-black" : "border border-white/20 text-white"}`}>
              {t("demoTry")} <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
