"use client";
// "Lo cambi come vuoi": the real profile of @1 built step by step on a phone, in stop motion.
// If @1 can't be read or is still plain, a full example profile is shown, never an empty phone.
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { kit, profileOfOne, reducedMotion } from "@/lib/site";
import { useHandle } from "@/lib/handle";

const STEPS = [
  ["Colori", "Ogni colore del profilo è tuo: testo, bottoni, bordi."],
  ["Sfondo", "Una foto, una GIF o un video dietro al profilo."],
  ["Font ed effetti", "20 font e gli effetti sul nome."],
  ["Social", "Discord, Instagram, TikTok, Spotify e tutti gli altri."],
] as const;
const STEP_MS = 3200;
const EXAMPLE_SOCIALS = { discord: "18k", instagram: "18k", tiktok: "18k", spotify: "18k" };

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function EditDemo() {
  const sec = useRef<HTMLElement>(null);
  const pv = useRef<HTMLDivElement>(null);
  const phone = useRef<HTMLDivElement>(null);
  const inView = useInView(sec, { amount: .25 });
  const [step, setStep] = useState(-1);
  const [auto, setAuto] = useState(true);
  const demo = useRef<{ view: any; frames: any[]; who: any } | null>(null);
  const { guestHref } = useHandle();

  // build the four frames once: colours, then background, then fonts, then everything
  useEffect(() => {
    let alive = true;
    (async () => {
      const pk = await kit.profile();
      const p = await profileOfOne();
      const plain = pk.normalizeAppearance({ ...pk.DEFAULT_APPEARANCE, effect: "none" });
      let full: any, who: any;
      // @1 is used only if it has something to show (a photo or a background); otherwise the example
      const rich = p && (p.avatarUrl || (p.appearance?.bg && p.appearance.bg.type && p.appearance.bg.type !== "color"));
      if (rich) {
        const pa = p.appearance || {};
        full = pk.normalizeAppearance({ ...pa, effect: pa.effect || "none", music: { ...(pa.music || {}), type: "none" }, sfx: { ...(pa.sfx || {}), on: false } });
        who = { handle: "1", displayName: p.displayName || "1", bio: p.bio || "", avatarUrl: p.avatarUrl || "", banner: p.banner, badges: p.badges || [], views: p.views || 0,
          socials: Object.keys(p.socials || {}).length ? p.socials : EXAMPLE_SOCIALS };
      } else {
        // no @1: a ready-made style with an example name
        const tpl = pk.TEMPLATES.find((t: any) => t.id === "night-drive") || pk.TEMPLATES[0];
        full = pk.normalizeAppearance(pk.applyTemplate(plain, tpl.a, "all"));
        who = { handle: "tuonome", displayName: "tuonome", bio: "nero, bianco e senza filtri", avatarUrl: "", badges: ["beta"], views: 3200, socials: EXAMPLE_SOCIALS };
      }
      const noEnter = (a: any) => ({ ...a, enter: { ...a.enter, on: false } });
      const f0 = pk.applyTemplate(plain, full, "colors"), f1 = pk.applyTemplate(f0, full, "bg"), f2 = pk.applyTemplate(f1, full, "fonts");
      const frames = [f0, f1, f2, full].map(noEnter);
      if (!alive || !pv.current) return;
      const view = pk.mountProfile(pv.current, { ...who, links: [], socials: {}, appearance: noEnter(plain) }, { preview: true, entrance: false });
      demo.current = { view, frames, who };
    })().catch(() => {});
    return () => { alive = false; };
  }, []);

  // show a step: the phone jumps a few still frames while the profile changes
  useEffect(() => {
    const d = demo.current;
    if (step < 0 || !d) return;
    if (phone.current && !reducedMotion()) { phone.current.classList.remove("snap"); void phone.current.offsetWidth; phone.current.classList.add("snap"); }
    const t = setTimeout(() => { try { d.view.update({ ...d.who, links: [], socials: step < 3 ? {} : d.who.socials, appearance: d.frames[step] }); } catch { /* preview only */ } }, reducedMotion() ? 0 : 120);
    return () => clearTimeout(t);
  }, [step]);

  // auto play while the section is on screen; a click pauses it for one extra step
  useEffect(() => {
    if (!inView || reducedMotion()) return;
    if (step < 0) { const t = setTimeout(() => setStep(0), 400); return () => clearTimeout(t); }
    const t = setTimeout(() => { setAuto(true); setStep(s => (s + 1) % STEPS.length); }, auto ? STEP_MS : STEP_MS * 2);
    return () => clearTimeout(t);
  }, [inView, step, auto]);

  return (
    <section ref={sec} id="index" aria-label="Come si modifica un profilo" className="flex items-center px-4 py-24 sm:px-[clamp(16px,6vw,96px)] min-[901px]:vh">
      <div className="mx-auto grid w-full max-w-[1180px] items-center gap-[clamp(32px,6vw,96px)] min-[901px]:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <div>
          <h2 className="text-[clamp(36px,5vw,64px)] font-bold leading-[1.02] tracking-[-.045em]">Lo cambi come vuoi.<br /><span className="text-quiet">Lo vedi subito.</span></h2>
          <ol className="demo-steps mt-10 grid">
            {STEPS.map(([b, s], i) => (
              <li key={b}>
                <button type="button" aria-pressed={i === step} className={`${i === step ? "on" : ""} ${i === step && auto ? "run" : ""}`}
                  onClick={() => { setAuto(false); setStep(i); }}>
                  <b>{b}</b><span>{s}</span><i className="dbar" aria-hidden key={i === step ? step + (auto ? "a" : "m") : "x"} />
                </button>
              </li>
            ))}
          </ol>
          <a href={guestHref("/dashboard")} className="group mt-6 inline-flex min-h-[46px] items-center gap-2.5 rounded-xl border border-white/55 px-5 text-[15px] font-semibold transition-colors active:scale-[.97] hover:border-white hover:bg-white/14">
            Prova a modificarlo tu <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
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
