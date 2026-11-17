"use client";
// Hero: the social bubbles are the heart of it.
// - at rest they float slowly;
// - while you type your @ they are pulled towards the field;
// - when the name is free they snap into a profile card with your @ (avatar, name, the bubbles become its links);
// - if you clear the name the card melts and the bubbles go back to floating.
// A soft light follows the mouse; the placeholder types example names by itself while the field is empty.
// Animations: GSAP, transform/opacity only. With prefers-reduced-motion it all works the same, without movement.
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { HANDLE_RE, reducedMotion, sanitize } from "@/lib/site";
import { useHandle } from "@/lib/handle";
import { useT } from "@/lib/i18n";

const EASE = [0.23, 1, 0.32, 1] as const;
const ICONS = "https://cdn.jsdelivr.net/npm/simple-icons@11.14.0/icons/";
const EXAMPLES = ["giulia_", "marco", "darkwave", "sofi", "lorenzo99", "angelo_"];

type Bubble = { icon: string; x: number; y: number; size: number };
// home positions (% of the hero), out of the text's way
const BUBBLES: Bubble[] = [
  { icon: "discord", x: 9, y: 24, size: 78 },
  { icon: "whatsapp", x: 18, y: 52, size: 58 },
  { icon: "spotify", x: 11, y: 78, size: 64 },
  { icon: "tiktok", x: 26, y: 13, size: 46 },
  { icon: "instagram", x: 89, y: 20, size: 72 },
  { icon: "youtube", x: 86, y: 76, size: 84 },
  { icon: "x", x: 74, y: 12, size: 44 },
  { icon: "telegram", x: 91, y: 49, size: 50 },
  { icon: "twitch", x: 27, y: 90, size: 48 },
  { icon: "kick", x: 72, y: 91, size: 52 },
];
// phones: only 5 bubbles, along the top and bottom edges
const PHONE: Bubble[] = [
  { icon: "discord", x: 12, y: 14, size: 56 },
  { icon: "instagram", x: 87, y: 13, size: 52 },
  { icon: "spotify", x: 12, y: 92, size: 48 },
  { icon: "youtube", x: 86, y: 90, size: 58 },
  { icon: "tiktok", x: 50, y: 96, size: 40 },
];

// a word that rises out of its own box
function Word({ children, i }: { children: React.ReactNode; i: number }) {
  return (
    <span className="inline-block overflow-hidden pb-[.08em] -mb-[.08em] align-top">
      <motion.span className="inline-block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: .9, ease: EASE, delay: .3 + i * .06 }}>{children}</motion.span>
    </span>
  );
}

/** the placeholder types example names by itself while the field is empty */
function usePlaceholder(active: boolean, base: string) {
  const [ph, setPh] = useState(base);
  useEffect(() => {
    setPh(base);
    if (!active || reducedMotion()) return;
    const words = [base, ...EXAMPLES];
    let w = 0, n = base.length, del = true, id: ReturnType<typeof setTimeout>;
    const step = () => {
      if (del) {
        n--; setPh(words[w].slice(0, n));
        if (n <= 0) { del = false; w = (w + 1) % words.length; }
        id = setTimeout(step, 40);
      } else {
        n++; setPh(words[w].slice(0, n));
        if (n >= words[w].length) { del = true; id = setTimeout(step, 1700); } else id = setTimeout(step, 80);
      }
    };
    id = setTimeout(step, 2000);
    return () => clearTimeout(id);
  }, [active, base]);
  return ph;
}

export default function Hero() {
  const { t } = useT();
  const { handle, setHandle, status, setStatus, avail } = useHandle();
  const words = t("h1a").split(" ");
  const sec = useRef<HTMLElement>(null);
  const field = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLSpanElement | null)[]>([]);
  const slots = useRef<(HTMLSpanElement | null)[]>([]);
  const floats = useRef<gsap.core.Tween[]>([]);
  const [phone, setPhone] = useState(false);
  const [size, setSize] = useState(0); // bumps when the window changes size, to put the bubbles back in place
  const shown = phone ? PHONE : BUBBLES;
  const valid = HANDLE_RE.test(handle);
  // what the bubbles do: float at rest, get pulled while you type, snap into the card when the name is free
  const mode: "rest" | "pull" | "card" = !handle ? "rest" : valid && avail === true ? "card" : "pull";
  const placeholder = usePlaceholder(!handle, t("placeholder"));

  useEffect(() => {
    const mq = matchMedia("(max-width: 767px)");
    const on = () => setPhone(mq.matches);
    on(); mq.addEventListener("change", on);
    let id: ReturnType<typeof setTimeout>;
    const re = () => { clearTimeout(id); id = setTimeout(() => setSize(s => s + 1), 150); };
    addEventListener("resize", re);
    return () => { mq.removeEventListener("change", on); removeEventListener("resize", re); clearTimeout(id); };
  }, []);

  // the bubbles appear, then float slowly
  useLayoutEffect(() => {
    const list = els.current.slice(0, shown.length).filter(Boolean) as HTMLSpanElement[];
    const still = reducedMotion();
    // three layers per bubble: outer = where it goes (mode), middle = how it appears, inner = how it floats
    const mid = list.map(el => el.firstElementChild as HTMLElement);
    gsap.fromTo(mid, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: still ? 0 : .9, ease: "back.out(1.6)", stagger: still ? 0 : .06, delay: still ? 0 : .4 });
    floats.current = still ? [] : mid.map((m, i) => gsap.to(m.firstElementChild, {
      y: i % 2 ? 14 : -14, rotation: i % 2 ? -5 : 5, duration: 3.6 + (i % 4) * .7, ease: "sine.inOut", yoyo: true, repeat: -1,
    }));
    return () => { floats.current.forEach(f => f.kill()); gsap.killTweensOf(mid); };
  }, [shown]);

  // where each bubble goes, depending on the mode
  useLayoutEffect(() => {
    const s = sec.current, f = field.current, c = card.current;
    if (!s || !f || !c) return;
    const list = els.current.slice(0, shown.length).filter(Boolean) as HTMLSpanElement[];
    const still = reducedMotion(), d = (n: number) => (still ? 0 : n);
    // on wide screens the page is zoomed to 90%: screen measures are divided by the zoom to get CSS pixels
    const box = s.getBoundingClientRect(), fr = f.getBoundingClientRect(), z = box.width / s.offsetWidth || 1;
    const fx = (fr.left - box.left + fr.width / 2) / z, fy = (fr.top - box.top + fr.height / 2) / z;
    const home = (el: HTMLSpanElement) => ({ x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop + el.offsetHeight / 2 });
    const calm = () => list.forEach(el => gsap.to(el.firstElementChild!.firstElementChild, { y: 0, rotation: 0, duration: d(.3), overwrite: true }));

    if (mode === "rest") {
      gsap.to(list, { x: 0, y: 0, scale: 1, duration: d(1.1), ease: "elastic.out(1, .75)", stagger: d(.03), overwrite: true });
      floats.current.forEach(tw => tw.invalidate().restart());
      gsap.to(c, { opacity: 0, y: 12, scale: .96, duration: d(.3), ease: "power2.in", overwrite: true });
      return;
    }
    floats.current.forEach(tw => tw.pause());
    calm();
    if (mode === "pull") {
      // pulled towards the field: part of the way, a bit closer for each letter
      const k = Math.min(.22 + handle.length * .035, .5);
      list.forEach(el => {
        const h = home(el);
        gsap.to(el, { x: (fx - h.x) * k, y: (fy - h.y) * k, scale: .85, duration: d(.7), ease: "power3.out", overwrite: true });
      });
      gsap.to(c, { opacity: 0, y: 12, scale: .96, duration: d(.25), overwrite: true });
      return;
    }
    // the name is free: each bubble snaps into its link slot in the card
    gsap.fromTo(c, { opacity: 0, y: 14, scale: .96 }, { opacity: 1, y: 0, scale: 1, duration: d(.45), ease: "power3.out", overwrite: true });
    list.forEach((el, i) => {
      const slot = slots.current[i];
      if (!slot) return;
      const r = slot.getBoundingClientRect(), h = home(el);
      gsap.to(el, {
        x: (r.left - box.left + r.width / 2) / z - h.x, y: (r.top - box.top + r.height / 2) / z - h.y, scale: r.width / z / el.offsetWidth,
        duration: d(.8), ease: "back.out(1.4)", delay: d(.05 + i * .035), overwrite: true,
      });
    });
  }, [mode, handle.length, shown, size]);

  // a soft light that follows the mouse (on phones it rests behind the field)
  useEffect(() => {
    const l = light.current, s = sec.current;
    if (!l || !s) return;
    gsap.set(l, { xPercent: -50, yPercent: -50, x: s.offsetWidth / 2, y: s.offsetHeight * .62 });
    if (reducedMotion() || !matchMedia("(pointer: fine)").matches) return;
    const qx = gsap.quickTo(l, "x", { duration: .9, ease: "power3" }), qy = gsap.quickTo(l, "y", { duration: .9, ease: "power3" });
    const move = (e: PointerEvent) => { const r = s.getBoundingClientRect(), z = r.width / s.offsetWidth || 1; qx((e.clientX - r.left) / z); qy((e.clientY - r.top) / z); };
    s.addEventListener("pointermove", move);
    return () => s.removeEventListener("pointermove", move);
  }, [size]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || avail === false) {
      const b = field.current;
      if (b) { b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake"); }
      input.current?.focus();
      if (!handle) setStatus({ kind: "", code: "stEmpty" });
      return;
    }
    location.href = "/login?handle=" + encodeURIComponent(handle);
  };

  return (
    <section ref={sec} id="top" aria-label={t("h1a")} className="vh relative isolate flex items-center justify-center overflow-hidden max-md:min-h-[740px]">
      <div aria-hidden className="absolute inset-0 -z-10 opacity-60 [background-image:radial-gradient(rgba(255,255,255,.09)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(70%_60%_at_50%_45%,#000,transparent)]" />
      <div ref={light} aria-hidden className="pointer-events-none absolute left-0 top-0 -z-10 size-[min(760px,140vw)] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,.12),rgba(255,255,255,.04)_45%,transparent)] will-change-transform" />

      {/* the social bubbles: above the card when they snap into it */}
      <div aria-hidden className={`pointer-events-none absolute inset-0 ${mode === "card" ? "z-[3]" : "z-[1]"}`}>
        {shown.map((b, i) => (
          <span key={b.icon} ref={el => { els.current[i] = el; }} className="absolute will-change-transform"
            style={{ left: b.x + "%", top: b.y + "%", width: b.size, height: b.size, marginLeft: -b.size / 2, marginTop: -b.size / 2 }}>
            <span className="block size-full"><span className="grid size-full place-items-center rounded-full border border-white/15 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,.36),rgba(255,255,255,.07)_42%,rgba(0,0,0,.6)_100%)] shadow-[inset_0_-8px_18px_rgba(0,0,0,.6),inset_0_2px_6px_rgba(255,255,255,.25),0_14px_32px_rgba(0,0,0,.55)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${ICONS}${b.icon}.svg`} alt="" className="size-[44%] [filter:invert(1)]" />
            </span></span>
          </span>
        ))}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

      <div className="relative z-[2] flex w-full flex-col items-center px-4 pb-44 pt-[100px] text-center md:pb-40">
        <motion.a href="/esplora" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: .2 }}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/[.1] bg-white/[.04] px-3 py-1 text-[13px] text-muted transition-colors hover:border-white/25 hover:text-white">
          <i aria-hidden className="size-2 rounded-full bg-white/80" /> {t("exploreBtn")} <span aria-hidden>→</span>
        </motion.a>
        <h1 aria-label={`${t("h1a")} ${t("h1b")} 18kbio`} className="text-[clamp(42px,7vw,100px)] font-bold leading-[1.02] tracking-[-.045em]">
          <span aria-hidden className="block">{words.map((w, i) => <span key={w + i}><Word i={i}>{w}</Word>{" "}</span>)}</span>
          <span aria-hidden className="block">
            <Word i={words.length}>{t("h1b")}</Word>{" "}
            <b className="hx-name">{[..."18kbio"].map((ch, i) => <i key={i} style={{ ["--d" as string]: `${(.7 + i * .07).toFixed(2)}s` }}>{ch}</i>)}</b>
          </span>
        </h1>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, ease: EASE, delay: .75 }}
          className="mt-5 max-w-[46ch] text-[clamp(15px,1.4vw,18px)] leading-[1.55] text-muted [text-wrap:pretty]">
          {t("heroDesc")}
        </motion.p>

        {/* the field */}
        <motion.form onSubmit={submit} noValidate className="relative mt-8 w-full max-w-[470px] text-left" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, ease: EASE, delay: .9 }}>
          <label className="sr-only" htmlFor="h1in">{t("claimLabel")}</label>
          <div ref={field} className="hero-field" data-kind={status.kind}>
            <span className="text-[#8a8a8a]">18kbio.xyz/</span>
            <input ref={input} id="h1in" type="text" autoComplete="off" autoCapitalize="off" spellCheck={false} maxLength={20} placeholder={placeholder}
              value={handle} onChange={e => setHandle(sanitize(e.target.value))} />
            <button className="btn" type="submit">{t("take")}</button>
          </div>
          <p aria-live="polite" className={`mt-3 min-h-5 text-[13.5px] ${status.kind === "ok" ? "text-[#3ddc84]" : status.kind === "no" ? "text-white" : "text-muted"}`}>
            {status.kind === "ok" ? "✓ " : status.kind === "no" ? "✗ " : ""}{t(status.code, { h: handle })}
          </p>

          {/* the card the bubbles snap into when the name is free (it never pushes the page: it sits under the field) */}
          <div ref={card} aria-hidden={mode !== "card"} className="pointer-events-none absolute inset-x-0 top-full mx-auto mt-3 w-full max-w-[400px] rounded-[22px] border border-white/15 bg-[#0b0b0b] p-4 opacity-0 shadow-[0_30px_60px_-30px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-[20px] font-bold uppercase text-black">{handle.slice(0, 1)}</span>
              <span className="min-w-0">
                <b className="block truncate text-[17px] font-semibold">{handle}</b>
                <span className="block truncate text-[13px] text-[#8a8a8a]">18kbio.xyz/{handle}</span>
              </span>
            </div>
            <div className="mt-4 flex justify-center gap-1.5 border-t border-white/10 pt-4">
              {shown.map((b, i) => <span key={b.icon} ref={el => { slots.current[i] = el; }} className="size-7 shrink-0 rounded-full" />)}
            </div>
            <a href="#cards" tabIndex={mode === "card" ? 0 : -1} className={`mt-3 block text-center text-[13px] font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white ${mode === "card" ? "pointer-events-auto" : ""}`}>{t("heroCard")}</a>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
