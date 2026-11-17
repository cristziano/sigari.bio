"use client";
// "Lo cambi come vuoi": a profile built step by step on a phone, in stop motion.
// The visitor picks a vibe (our real templates, with real video backgrounds) and the phone shows THEIR typed name.
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { HANDLE_RE, kit, profileOfOne, reducedMotion } from "@/lib/site";
import { useHandle } from "@/lib/handle";
import { useT } from "@/lib/i18n";

const STEP_MS = 3200;
const VIBES = ["night-drive", "pioggia", "sakura", "matrix", "inverno", "synthwave"];
const EXAMPLE_SOCIALS = { discord: "18k", instagram: "18k", tiktok: "18k", spotify: "18k" };

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function EditDemo() {
  const sec = useRef<HTMLElement>(null);
  const pv = useRef<HTMLDivElement>(null);
  const phone = useRef<HTMLDivElement>(null);
  const inView = useInView(sec, { amount: .25 });
  const [step, setStep] = useState(-1);
  const [auto, setAuto] = useState(true);
  const [vibe, setVibe] = useState(VIBES[0]);
  const [names, setNames] = useState<Record<string, string>>({});
  const pk = useRef<any>(null);
  const view = useRef<any>(null);
  const frames = useRef<any[]>([]);
  const base = useRef<any>(null); // @1, when it has something to show
  const { handle, guestHref } = useHandle();
  const { t } = useT();
  const steps = t("demoSteps").split("\n").map(s => s.split("|"));

  const who = () => {
    const h = HANDLE_RE.test(handle) ? handle : null;
    const b = base.current;
    return {
      handle: h || (b ? "1" : "tuonome"), displayName: h || (b ? b.displayName || "1" : "tuonome"),
      bio: b?.bio || t("demoBio"), avatarUrl: h ? "" : b?.avatarUrl || "", badges: b?.badges || ["beta"], views: b?.views || 3200,
      socials: b && Object.keys(b.socials || {}).length ? b.socials : EXAMPLE_SOCIALS,
    };
  };

  // the four frames of a vibe: colours, then background, then fonts, then everything
  const build = (id: string) => {
    const k = pk.current; if (!k) return;
    const plain = k.normalizeAppearance({ ...k.DEFAULT_APPEARANCE, effect: "none" });
    let full: any;
    if (id === "one" && base.current) full = k.normalizeAppearance({ ...(base.current.appearance || {}) });
    else {
      const tpl = k.TEMPLATES.find((x: any) => x.id === id) || k.TEMPLATES[0];
      full = k.normalizeAppearance(k.applyTemplate(plain, tpl.a, "all"));
    }
    // in the demo: no "click to enter" screen, no music, no sounds
    const quiet = (a: any) => ({ ...a, enter: { ...a.enter, on: false }, music: { ...(a.music || {}), type: "none" }, sfx: { ...(a.sfx || {}), on: false } });
    const f0 = k.applyTemplate(plain, full, "colors"), f1 = k.applyTemplate(f0, full, "bg"), f2 = k.applyTemplate(f1, full, "fonts");
    frames.current = [f0, f1, f2, full].map(quiet);
  };

  const show = (n: number) => {
    const v = view.current; if (!v || n < 0) return;
    const w = who();
    try { v.update({ ...w, links: [], socials: n < 3 ? {} : w.socials, appearance: frames.current[n] }); } catch { /* preview only */ }
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      const k = await kit.profile(); pk.current = k;
      setNames(Object.fromEntries(VIBES.map(id => [id, (k.TEMPLATES.find((x: any) => x.id === id) || {}).name || id])));
      const p = await profileOfOne();
      // @1 is used only if it has something to show (a photo or a background)
      if (p && (p.avatarUrl || (p.appearance?.bg?.type && p.appearance.bg.type !== "color"))) { base.current = p; setVibe("one"); build("one"); } else build(VIBES[0]);
      if (!alive || !pv.current) return;
      view.current = k.mountProfile(pv.current, { ...who(), links: [], socials: {}, appearance: frames.current[0] }, { preview: true, entrance: false });
    })().catch(() => {});
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // show a step: the phone jumps a few still frames while the profile changes
  useEffect(() => {
    if (step < 0) return;
    if (phone.current && !reducedMotion()) { phone.current.classList.remove("snap"); void phone.current.offsetWidth; phone.current.classList.add("snap"); }
    const id = setTimeout(() => show(step), reducedMotion() ? 0 : 120);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, vibe]);

  // the name typed in the hero appears on the phone
  useEffect(() => {
    const id = setTimeout(() => show(step < 0 ? 0 : step), 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle, t]);

  // auto play while on screen; a click pauses it for one extra step
  useEffect(() => {
    if (!inView || reducedMotion()) return;
    if (step < 0) { const id = setTimeout(() => setStep(0), 400); return () => clearTimeout(id); }
    const id = setTimeout(() => { setAuto(true); setStep(s => (s + 1) % 4); }, auto ? STEP_MS : STEP_MS * 2);
    return () => clearTimeout(id);
  }, [inView, step, auto]);

  const pickVibe = (id: string) => { build(id); setVibe(id); setAuto(false); setStep(3); };

  return (
    <section ref={sec} id="index" aria-label={`${t("demoT1")} ${t("demoT2")}`} className="flex items-center px-4 py-24 sm:px-[clamp(16px,6vw,96px)] min-[901px]:vh">
      <div className="mx-auto grid w-full max-w-[1180px] items-center gap-[clamp(32px,6vw,96px)] min-[901px]:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <div>
          <h2 className="text-[clamp(36px,5vw,64px)] font-bold leading-[1.02] tracking-[-.045em]">{t("demoT1")}<br /><span className="text-quiet">{t("demoT2")}</span></h2>
          <ol className="demo-steps mt-10 grid">
            {steps.map(([b, s], i) => (
              <li key={i}>
                <button type="button" aria-pressed={i === step} className={`${i === step ? "on" : ""} ${i === step && auto ? "run" : ""}`}
                  onClick={() => { setAuto(false); setStep(i); }}>
                  <b>{b}</b><span>{s}</span><i className="dbar" aria-hidden key={i === step ? `${step}${auto}${vibe}` : "x"} />
                </button>
              </li>
            ))}
          </ol>
          {Object.keys(names).length > 0 && (
            <div className="mt-6">
              <p className="font-mono text-[11.5px] text-muted">{t("demoVibe")}</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {base.current && <VibeChip on={vibe === "one"} onClick={() => pickVibe("one")}>@1</VibeChip>}
                {VIBES.map(id => <VibeChip key={id} on={vibe === id} onClick={() => pickVibe(id)}>{names[id]}</VibeChip>)}
              </div>
            </div>
          )}
          <a href={guestHref("/dashboard")} className="group mt-7 inline-flex min-h-[46px] items-center gap-2.5 rounded-xl border border-white/55 px-5 text-[15px] font-semibold transition-colors active:scale-[.97] hover:border-white hover:bg-white/14">
            {t("demoTry")} <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
          </a>
        </div>
        <div className="grid place-items-center max-[900px]:-order-1">
          <div ref={phone} className="demo-phone relative aspect-[9/17.5] w-[min(300px,78vw)] overflow-hidden rounded-[40px] border border-line-2 bg-[#050505] shadow-[0_40px_90px_-40px_rgba(0,0,0,.95)] min-[901px]:w-[min(360px,84vw)]">
            <div ref={pv} className="demo-pv absolute inset-0" />
          </div>
        </div>
      </div>
    </section>
  );
}

function VibeChip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick}
      className={`min-h-9 rounded-lg border px-3 text-[13px] transition-[background,border-color,transform] duration-200 active:scale-[.97] ${on ? "border-white bg-white text-black" : "border-line-2 text-muted hover:border-white/50 hover:text-white"}`}>
      {children}
    </button>
  );
}
