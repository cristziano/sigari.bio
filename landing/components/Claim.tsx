"use client";
// The box where you write the @ you want. Both copies (hero and end of page) share the same name.
import { useRef } from "react";
import { HANDLE_RE, rarity, sanitize } from "@/lib/site";
import { useHandle } from "@/lib/handle";
import { useT } from "@/lib/i18n";

/** big = the end of the page: the address itself, huge, is the box you type in */
export default function Claim({ id, className = "", big = false }: { id: string; className?: string; big?: boolean }) {
  const { handle, setHandle, status, setStatus, avail } = useHandle();
  const { t, list } = useT();
  const bar = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const pips = rarity(handle)[1];
  const rName = list("rarity")[4 - pips];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!HANDLE_RE.test(handle) || avail === false) {
      const b = bar.current;
      if (b) { b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake"); }
      input.current?.focus();
      if (!handle) setStatus({ kind: "", code: "stEmpty" });
      return;
    }
    location.href = "/login?handle=" + encodeURIComponent(handle);
  };

  return (
    <form className={`w-full ${big ? "max-w-[1100px]" : "max-w-[470px]"} ${className}`} onSubmit={submit} noValidate>
      <label className="sr-only" htmlFor={id}>{t("claimLabel")}</label>
      <div ref={bar} className={big ? "claim-big" : "claim-bar"} data-kind={status.kind}>
        <span className="pre">18kbio.xyz/</span>
        <input ref={input} id={id} type="text" autoComplete="off" autoCapitalize="off" spellCheck={false} maxLength={20} placeholder={t("placeholder")}
          value={handle} onChange={e => setHandle(sanitize(e.target.value))} />
        <button className="btn" type="submit">{t("take")}</button>
      </div>
      <div className="mt-2.5 flex min-h-5 items-center justify-between gap-3 font-mono text-[11.5px]">
        <span aria-live="polite" className={`flex items-center gap-2 ${status.kind === "no" ? "text-[#ff7a7a]" : status.kind === "ok" ? "text-white" : "text-muted"}`}>
          <i aria-hidden className={`inline-block size-1.5 shrink-0 ${status.kind === "wait" ? "animate-pulse" : ""} ${status.kind === "no" ? "bg-[#ff5a5a]" : "bg-current"}`} />
          {t(status.code, { h: handle })}
        </span>
        {HANDLE_RE.test(handle) && (
          <span className="flex shrink-0 items-center gap-2 text-muted" title={t("rarityTitle")}>
            {rName}
            <span aria-hidden className="flex gap-[3px]">{[0, 1, 2, 3].map(i => <i key={i} className={`h-2.5 w-1 ${i < pips ? "bg-white" : "bg-white/15"}`} />)}</span>
          </span>
        )}
      </div>
    </form>
  );
}
