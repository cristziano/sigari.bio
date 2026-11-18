"use client";
// Hero: title, subtitle and the field. While you type, under the field you see live if the @ is free;
// when it is, a small card with your @ appears under it (and points to "La tua carta"). Clear the name and the card goes away.
// The placeholder types example names by itself while the field is empty. Plain matte black behind (the page background).
import { useEffect, useRef, useState } from "react";
import { HANDLE_RE, reducedMotion, sanitize } from "@/lib/site";
import Showcase from "@/components/Showcase";
import { useHandle } from "@/lib/handle";
import { useT } from "@/lib/i18n";

const EXAMPLES = ["giulia_", "marco", "darkwave", "sofi", "lorenzo99", "angelo_"];

// a word that rises out of its own box (CSS animation: it starts as soon as the page is painted, before the scripts load)
function Word({ children, i }: { children: React.ReactNode; i: number }) {
  return (
    <span className="inline-block overflow-hidden pb-[.08em] -mb-[.08em] align-top">
      <span className="word-up inline-block" style={{ animationDelay: `${.08 + i * .05}s` }}>{children}</span>
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
  const field = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const valid = HANDLE_RE.test(handle);
  const card = valid && avail === true; // the card shows only when the name is free
  const placeholder = usePlaceholder(!handle, t("placeholder"));

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
    <section id="top" aria-label={t("h1a")} className="vh relative isolate flex items-center justify-center overflow-hidden max-lg:min-h-[740px]">

      {/* computer: the title and the field on the left, the ring of real profiles on the right */}
      <div className="relative z-[2] mx-auto grid w-full max-w-[1440px] grid-cols-[minmax(0,1fr)] items-center lg:[zoom:1.25] gap-4 px-4 pb-16 pt-[96px] lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] lg:pl-10 lg:pr-0 lg:pb-10">
      <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
        <a href="/esplora" style={{ animationDelay: ".05s" }}
          className="rise mb-7 inline-flex items-center gap-2 rounded-full border border-white/[.1] bg-white/[.04] px-3 py-1 text-[13px] text-muted transition-colors hover:border-white/25 hover:text-white">
          <i aria-hidden className="size-2 rounded-full bg-white/80" /> {t("exploreBtn")} <span aria-hidden>→</span>
        </a>
        {/* one line: "La tua identità, su 18kbio" */}
        <h1 aria-label={`${t("h1a")} ${t("h1b")} 18kbio`} className="whitespace-nowrap text-[clamp(23px,8.4vw,44px)] font-bold leading-[1.05] tracking-[-.045em] sm:text-[clamp(36px,6.6vw,60px)] lg:text-[clamp(32px,3.2vw,56px)]">
          <span aria-hidden>
            {words.map((w, i) => <span key={w + i}><Word i={i}>{w}</Word>{" "}</span>)}
            <Word i={words.length}>{t("h1b")}</Word>{" "}
            <b className="hx-name">{[..."18kbio"].map((ch, i) => <i key={i} style={{ ["--d" as string]: `${(.3 + i * .05).toFixed(2)}s` }}>{ch}</i>)}</b>
          </span>
        </h1>
        <p style={{ animationDelay: ".3s" }}
          className="rise mt-5 max-w-[46ch] text-[clamp(15px,1.4vw,18px)] leading-[1.55] text-muted [text-wrap:pretty]">
          {t("heroDesc")}
        </p>

        {/* the field */}
        <form onSubmit={submit} noValidate className="rise relative mt-8 w-full max-w-[470px] text-left" style={{ animationDelay: ".4s" }}>
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

          {/* the card with your @ when the name is free (it never pushes the page: it sits under the field) */}
          <div aria-hidden={!card} className={`absolute inset-x-0 top-full z-10 mx-auto mt-3 w-full max-w-[400px] lg:mx-0 rounded-[22px] border border-white/15 bg-[#0b0b0b] p-4 shadow-[0_30px_60px_-30px_rgba(0,0,0,1)] transition-[opacity,transform] duration-300 motion-reduce:transition-none ${card ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}>
            <div className="flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-[20px] font-bold uppercase text-black">{handle.slice(0, 1)}</span>
              <span className="min-w-0">
                <b className="block truncate text-[17px] font-semibold">{handle}</b>
                <span className="block truncate text-[13px] text-[#8a8a8a]">18kbio.xyz/{handle}</span>
              </span>
            </div>
            <a href="#cards" tabIndex={card ? 0 : -1} className="mt-4 block border-t border-white/10 pt-3 text-center text-[13px] font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">{t("heroCard")}</a>
          </div>
        </form>
      </div>
      <Showcase className="h-[420px] max-lg:mt-28 sm:h-[480px] lg:h-[min(640px,calc(78svh*var(--vz,1)))]" />
      </div>
    </section>
  );
}
