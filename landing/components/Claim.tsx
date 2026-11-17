"use client";
// The box where you write the @ you want. Both copies (hero and end of page) share the same name.
import { useRef } from "react";
import { HANDLE_RE, rarity, sanitize } from "@/lib/site";
import { useHandle } from "@/lib/handle";

export default function Claim({ id, className = "" }: { id: string; className?: string }) {
  const { handle, setHandle, status, setStatus, avail } = useHandle();
  const bar = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [rName, pips] = rarity(handle);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!HANDLE_RE.test(handle) || avail === false) {
      const b = bar.current;
      if (b) { b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake"); }
      input.current?.focus();
      if (!handle) setStatus({ kind: "", text: "prima scrivi la @ che vuoi" });
      return;
    }
    location.href = "/login?handle=" + encodeURIComponent(handle);
  };

  return (
    <form className={`w-full max-w-[470px] ${className}`} onSubmit={submit} noValidate>
      <label className="sr-only" htmlFor={id}>Scegli la tua @</label>
      <div ref={bar} className="claim-bar" data-kind={status.kind}>
        <span className="pre">18kbio.xyz/</span>
        <input ref={input} id={id} type="text" autoComplete="off" autoCapitalize="off" spellCheck={false} maxLength={20} placeholder="iltuonome"
          value={handle} onChange={e => setHandle(sanitize(e.target.value))} />
        <button className="btn" type="submit">Prendila</button>
      </div>
      <div className="mt-2.5 flex min-h-5 items-center justify-between gap-3 font-mono text-[11.5px]">
        <span aria-live="polite" className={`flex items-center gap-2 ${status.kind === "no" ? "text-[#ff7a7a]" : status.kind === "ok" ? "text-white" : "text-muted"}`}>
          <i aria-hidden className={`inline-block size-1.5 ${status.kind === "wait" ? "animate-pulse" : ""} ${status.kind === "no" ? "bg-[#ff5a5a]" : "bg-current"}`} />
          {status.text}
        </span>
        {HANDLE_RE.test(handle) && (
          <span className="flex items-center gap-2 text-muted" title="Più è corta, più è rara">
            {rName}
            <span aria-hidden className="flex gap-[3px]">{[0, 1, 2, 3].map(i => <i key={i} className={`h-2.5 w-1 ${i < pips ? "bg-white" : "bg-white/15"}`} />)}</span>
          </span>
        )}
      </div>
    </form>
  );
}
