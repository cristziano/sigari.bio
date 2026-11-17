"use client";
// End of the page: the claim again, the footer, the small bar on phones and the page-wide behaviours.
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import Claim from "./Claim";
import { focusClaim, useHandle } from "@/lib/handle";
import { useT, type Lang } from "@/lib/i18n";

export function Final({ onSeen }: { onSeen: (v: boolean) => void }) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { once: true, amount: .3 });
  const inView = useInView(ref, { amount: .2 });
  useEffect(() => onSeen(inView), [inView, onSeen]);
  const { t } = useT();
  return (
    <section ref={ref} id="final" className="flex flex-col items-center px-4 pb-28 pt-20 text-center">
      <h2 className="text-[clamp(36px,5.6vw,72px)] font-bold leading-[1.05] tracking-[-.045em]">
        {t("finalT")} <b className="hx-name">{seen ? [..."18kbio"].map((c, i) => <i key={i} style={{ ["--d" as string]: `${(.1 + i * .07).toFixed(2)}s` }}>{c}</i>) : <span className="opacity-0">18kbio</span>}</b>
      </h2>
      <Claim id="h2in" className="mt-8 text-left" />
    </section>
  );
}

export function Footer() {
  const { t, lang, setLang } = useT();
  return (
    <footer className="border-t border-line px-4 py-7 font-mono text-xs text-muted sm:px-[clamp(16px,10vw,144px)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span>{t("rights")} · <a href="/privacy" className="hover:text-white">{t("privacy")}</a> · <a href="/termini" className="hover:text-white">{t("terms")}</a></span>
        <nav aria-label={t("footNav")} className="flex flex-wrap items-center gap-5">
          <a href="/accedi" className="hover:text-white">{t("login")}</a>
          <a href="#top" onClick={e => { e.preventDefault(); focusClaim(); }} className="hover:text-white">{t("footClaim")}</a>
          <a href="https://discord.gg/18k" target="_blank" rel="noopener" className="hover:text-white">discord</a>
          <span role="group" aria-label={t("langSwitch")} className="flex gap-1">
            {(["it", "en"] as Lang[]).map(l => <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)} className={`uppercase ${lang === l ? "text-white underline underline-offset-4" : "hover:text-white"}`}>{l}</button>)}
          </span>
        </nav>
      </div>
    </footer>
  );
}

/** Phones: after the hero, a small bar at the bottom brings you back to the claim box */
export function Dock({ hidden }: { hidden: boolean }) {
  const { handle } = useHandle();
  const { t } = useT();
  const [past, setPast] = useState(false);
  useEffect(() => {
    const el = document.getElementById("h1in"); if (!el) return;
    const io = new IntersectionObserver(([e]) => setPast(!e.isIntersecting)); io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <AnimatePresence>
      {past && !hidden && (
        <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} transition={{ duration: .3, ease: [0.23, 1, 0.32, 1] }}
          className="fixed inset-x-3 bottom-3 z-40 md:hidden">
          <a href="#top" onClick={e => { e.preventDefault(); focusClaim(); }}
            className="flex items-center justify-between gap-3 rounded-[14px] border border-line-2 bg-black/90 py-2 pl-4 pr-2 backdrop-blur-md">
            <span className="truncate font-mono text-[13px] text-muted">18kbio.xyz/{handle || t("placeholder")}</span>
            <span className="btn !min-h-9">{t("take")}</span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Things the old page did on load: remember the referral, the "account deleted" notice, the smooth wheel */
export function PageEffects() {
  const [bye, setBye] = useState(false);
  const { t } = useT();
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    // ?ref=name: who invited you, remembered for 30 days (read at sign up)
    const r = q.get("ref");
    try { if (r && /^[a-z0-9_]{1,20}$/i.test(r)) localStorage.setItem("18k-ref", JSON.stringify({ h: r.toLowerCase(), t: Date.now() })); } catch { /* storage blocked */ }
    if (q.has("addio")) { setBye(true); history.replaceState(null, "", location.pathname); setTimeout(() => setBye(false), 6000); }
    return smoothWheel();
  }, []);
  return bye ? (
    <div role="status" className="fixed left-1/2 top-[76px] z-[200] -translate-x-1/2 rounded-full bg-white px-4 py-2.5 text-[13px] font-medium text-black shadow-[0_10px_30px_rgba(0,0,0,.5)]">
      {t("bye")}
    </div>
  ) : null;
}

// Computer only: the page glides a little after each turn of the wheel, no jumps between sections
function smoothWheel() {
  if (!matchMedia("(pointer:fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let target = scrollY, cur = scrollY, raf = 0, mine = false;
  const max = () => document.documentElement.scrollHeight - innerHeight;
  const tick = () => {
    cur += (target - cur) * .14;
    if (Math.abs(target - cur) < .5) cur = target;
    mine = true; scrollTo({ top: cur, behavior: "instant" });
    raf = cur !== target ? requestAnimationFrame(tick) : 0;
  };
  const wheel = (e: WheelEvent) => {
    if (e.ctrlKey || e.defaultPrevented || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    for (let el = e.target as HTMLElement | null; el && el !== document.body; el = el.parentElement)
      if (el.scrollHeight > el.clientHeight + 2 && /(auto|scroll)/.test(getComputedStyle(el).overflowY)) return;
    e.preventDefault();
    if (!raf) cur = target = scrollY;
    const d = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY;
    target = Math.max(0, Math.min(max(), target + d));
    if (!raf) raf = requestAnimationFrame(tick);
  };
  // scrollbar, links and keys move the page on their own: follow them
  const scroll = () => { if (mine) { mine = false; return; } if (!raf) cur = target = scrollY; };
  addEventListener("wheel", wheel, { passive: false });
  addEventListener("scroll", scroll, { passive: true });
  return () => { removeEventListener("wheel", wheel); removeEventListener("scroll", scroll); cancelAnimationFrame(raf); };
}
