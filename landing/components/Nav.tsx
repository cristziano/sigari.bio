"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { firebase } from "@/lib/site";
import { focusClaim } from "@/lib/handle";
import { useT } from "@/lib/i18n";

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [float, setFloat] = useState(false); // past the hero: the bar comes off the top and follows you, a bit smaller
  const [logged, setLogged] = useState(false);
  const { t } = useT();
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: .001 });

  useEffect(() => {
    const on = () => { setSolid(scrollY > 30); setFloat(scrollY > innerHeight * .8); };
    on(); addEventListener("scroll", on, { passive: true });
    // logged in? the main button becomes "Dashboard" (checked when the browser is idle: the page works without it)
    const idle = (window.requestIdleCallback || ((fn: () => void) => setTimeout(fn, 1200))) as (fn: () => void) => void;
    let off: (() => void) | undefined;
    idle(() => { firebase().then(({ auth, au }) => { off = au.onAuthStateChanged(auth, (u: unknown) => setLogged(!!u)); }).catch(() => {}); });
    return () => { removeEventListener("scroll", on); off?.(); };
  }, []);

  return (
    <>
      <motion.div aria-hidden className="fixed left-0 right-0 top-0 z-[60] h-px origin-left bg-white" style={{ scaleX: bar }} />
      <header className={`fixed inset-x-0 z-50 mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-4 transition-[top,width,padding,border-radius,background-color,border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(.23,1,.32,1)] motion-reduce:transition-none ${
        float ? "top-3 w-[min(1080px,calc(100%-24px))] scale-[.97] rounded-full border border-white/12 bg-black/75 px-4 py-2 shadow-[0_18px_50px_-20px_rgba(0,0,0,.95)] backdrop-blur-md sm:px-6"
        : `top-0 w-full rounded-none px-4 py-2.5 sm:px-9 ${solid ? "border-b border-line bg-black/95" : "border-b border-transparent"}`}`}>
        <a href="#top" aria-label="18kbio, home" className="flex items-center justify-self-start font-brand text-[18px] font-semibold tracking-[-.02em]">
          <i aria-hidden className="mr-2 inline-block size-[7px] rounded-[1px] bg-white motion-safe:animate-[tick_2.4s_steps(1)_infinite]" />
          <span className="chrome">18k<span className="font-normal">bio</span></span>
        </a>
        <nav aria-label={t("sections")} className="hidden gap-6 text-[13px] text-muted md:flex">
          <a href="#index" className="transition-colors hover:text-white">{t("navFeatures")}</a>
          <a href="#stats" className="transition-colors hover:text-white">{t("navStats")}</a>
          <a href="#plans" className="transition-colors hover:text-white">{t("navPlans")}</a>
        </nav>
        <div className="col-start-3 flex items-center gap-2 justify-self-end sm:gap-3">
          <a href="/esplora" className="btn-2 !min-h-8 !px-3 !text-[13px]">{t("explore")}</a>
          {!logged && <a href="/accedi" className="hidden px-2 text-[13px] text-muted transition-colors hover:text-white sm:inline">{t("login")}</a>}
          {logged
            ? <a href="/dashboard" className="btn !min-h-9 !text-[13px]">{t("dashboard")}</a>
            : <a href="#h1in" onClick={e => { e.preventDefault(); focusClaim(); }} className="btn !min-h-9 !text-[13px]">{t("claimNav")}</a>}
        </div>
      </header>
    </>
  );
}
