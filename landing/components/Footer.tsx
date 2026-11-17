"use client";
// End of the page: the footer and the page-wide behaviours.
import { useEffect, useState } from "react";
import { focusClaim } from "@/lib/handle";
import { useT } from "@/lib/i18n";

export function Footer() {
  const { t } = useT();
  const claim = (e: React.MouseEvent) => { e.preventDefault(); focusClaim(); };
  const col = "grid content-start gap-1 text-sm";
  const link = "py-1.5 text-muted capitalize transition-colors hover:text-white";
  return (
    <footer id="footer" className="relative overflow-hidden border-t border-line px-4 pt-16 sm:px-[clamp(16px,6vw,96px)]">
      <div className="mx-auto grid max-w-[1180px] grid-cols-3 gap-x-4 gap-y-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div className="col-span-3 md:col-span-1">
          <a href="#top" onClick={claim} className="font-brand text-[22px] font-semibold tracking-[-.02em]">18k<span className="font-normal text-[#8a8a8a]">bio</span></a>
          <p className="mt-3 max-w-[30ch] text-sm leading-[1.55] text-muted">{t("footTag")}</p>
          <a href="#top" onClick={claim} className="btn mt-6">{t("claimNav")}</a>
        </div>
        <nav aria-label={t("footProduct")} className={col}>
          <b className="mb-1 text-[13px] font-semibold text-white">{t("footProduct")}</b>
          <a href="/esplora" className={link}>{t("explore")}</a>
          <a href="/dashboard" className={link}>{t("dashboard")}</a>
          <a href="/accedi" className={link}>{t("login")}</a>
          <a href="/paste" className={link}>Paste</a>
        </nav>
        <nav aria-label={t("footCommunity")} className={col}>
          <b className="mb-1 text-[13px] font-semibold text-white">{t("footCommunity")}</b>
          <a href="https://discord.gg/18k" target="_blank" rel="noopener" className={link}>Discord</a>
          <a href="/clan" className={link}>Clan</a>
        </nav>
        <nav aria-label={t("footNav")} className={col}>
          <b className="mb-1 text-[13px] font-semibold text-white">{t("footLegal")}</b>
          <a href="/privacy" className={link}>{t("privacy")}</a>
          <a href="/termini" className={link}>{t("terms")}</a>
        </nav>
      </div>
      <div className="mx-auto mt-14 flex max-w-[1180px] flex-wrap justify-between gap-3 border-t border-line py-6 text-[13px] text-quiet">
        <span>{t("rights")}</span><span>18kbio.xyz</span>
      </div>
    </footer>
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
