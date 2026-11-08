// The "Pubblica" page of the dashboard: a React component, built into ../publish-panel.js
// (npx esbuild src/publish-panel.jsx --bundle --minify --format=esm --outfile=publish-panel.js).
// The dashboard calls mount(el) once and then render(props) every time something changes.
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

const STATUS = {
  live: { title: "Online", sub: "Chiunque apra il tuo link vede il profilo.", tone: "live" },
  draft: { title: "Bozza", sub: "Il profilo è salvato ma nessuno lo vede.", tone: "draft" },
  never: { title: "Mai pubblicato", sub: "Quando sei pronto, tieni premuto il bottone.", tone: "draft" },
  disabled: { title: "Disattivato", sub: "Il profilo è in pausa. Riattivalo dalle impostazioni.", tone: "off" },
  guest: { title: "Senza account", sub: "Registrati per prendere la tua @ e pubblicare.", tone: "off" }
};

function ago(t) {
  if (!t) return "";
  const s = Math.max(1, Math.round((Date.now() - t) / 1000));
  if (s < 60) return "pochi secondi fa";
  const m = Math.round(s / 60); if (m < 60) return m === 1 ? "un minuto fa" : `${m} minuti fa`;
  const h = Math.round(m / 60); if (h < 24) return h === 1 ? "un'ora fa" : `${h} ore fa`;
  const d = Math.round(h / 24); return d === 1 ? "ieri" : `${d} giorni fa`;
}

// Press and hold: the bar fills, at the end it publishes (no accidental clicks)
function HoldButton({ label, doneLabel, onDone, disabled }) {
  const [p, setP] = useState(0), [ok, setOk] = useState(false);
  const raf = useRef(0), start = useRef(0);
  const HOLD = 900;
  const stop = () => { cancelAnimationFrame(raf.current); if (!ok) setP(0); };
  const go = e => {
    if (disabled || ok) return;
    e.preventDefault();
    start.current = performance.now();
    const step = now => {
      const v = Math.min(1, (now - start.current) / HOLD);
      setP(v);
      if (v < 1) raf.current = requestAnimationFrame(step);
      else { setOk(true); onDone(); setTimeout(() => { setOk(false); setP(0); }, 1800); }
    };
    raf.current = requestAnimationFrame(step);
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const key = e => { if ((e.key === "Enter" || e.key === " ") && !disabled && !ok) { e.preventDefault(); setOk(true); onDone(); setTimeout(() => setOk(false), 1800); } };
  return (
    <button type="button" className={"pp-hold" + (ok ? " ok" : "")} disabled={disabled}
      onPointerDown={go} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop} onKeyDown={key}>
      <span className="pp-fill" style={{ transform: `scaleX(${ok ? 1 : p})` }} />
      <span className="pp-hold-t">{ok ? doneLabel : p > 0 ? "continua a tenere…" : label}</span>
    </button>
  );
}

function Ring({ value }) {
  const r = 26, c = 2 * Math.PI * r;
  return (
    <svg className="pp-ring" width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r={r} fill="none" stroke="var(--b)" strokeWidth="5" />
      <circle cx="32" cy="32" r={r} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - value)} transform="rotate(-90 32 32)" style={{ transition: "stroke-dashoffset .6s cubic-bezier(.2,.8,.2,1)" }} />
      <text x="32" y="37" textAnchor="middle" fontSize="14" fontWeight="600" fill="currentColor">{Math.round(value * 100)}%</text>
    </svg>
  );
}

function Panel(props) {
  const { status = "never", url = "", shownUrl = "", checks = [], dirty = false, lastAt = 0, busy = false, error = "", onPublish, onDraft, onOpen, onGo, onClaim } = props;
  const s = STATUS[status] || STATUS.never;
  const [copied, setCopied] = useState(false);
  const [, tick] = useState(0);
  useEffect(() => { const t = setInterval(() => tick(x => x + 1), 30000); return () => clearInterval(t); }, []);
  const done = checks.filter(c => c.ok).length, value = checks.length ? done / checks.length : 0;
  const copy = () => { navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1400); }).catch(() => {}); };
  const canPublish = status !== "guest" && status !== "disabled";
  return (
    <div className={"pp pp-" + s.tone}>
      <div className="pp-hero">
        <div className="pp-orb" aria-hidden="true"><i /><i /><i /></div>
        <div className="pp-st">
          <span className="pp-kick">stato del profilo</span>
          <b>{s.title}</b>
          <span className="pp-sub">{s.sub}</span>
          {lastAt ? <span className="pp-when">ultima pubblicazione {ago(lastAt)}</span> : null}
        </div>
      </div>

      <div className="pp-link">
        <span className="pp-kick">il tuo link</span>
        <div className="pp-url">
          <code>{shownUrl}</code>
          <button type="button" onClick={copy} className="pp-mini">{copied ? "copiato ✓" : "copia"}</button>
          <button type="button" onClick={onOpen} className="pp-mini" disabled={status !== "live"}>apri ↗</button>
        </div>
        <button type="button" className="pp-textbtn" onClick={() => onGo("page")}>cambia prefisso e anteprima →</button>
      </div>

      {dirty && status === "live" ? <div className="pp-dirty">Hai modifiche non ancora pubblicate.</div> : null}
      {error ? <div className="pp-err">{error}</div> : null}

      <div className="pp-actions">
        {status === "guest"
          ? <button type="button" className="pp-hold" onClick={onClaim}><span className="pp-hold-t">Registrati e pubblica</span></button>
          : <HoldButton disabled={!canPublish || busy}
              label={status === "live" ? (dirty ? "Tieni premuto per pubblicare le modifiche" : "Tieni premuto per ripubblicare") : "Tieni premuto per pubblicare"}
              doneLabel="Pubblicato ✓" onDone={onPublish} />}
        {status === "live" ? <button type="button" className="pp-ghost" disabled={busy} onClick={onDraft}>Togli dalla rete (torna bozza)</button> : null}
      </div>

      <div className="pp-check">
        <Ring value={value} />
        <div className="pp-list">
          <span className="pp-kick">prima di pubblicare · {done}/{checks.length}</span>
          {checks.map(c => (
            <button type="button" key={c.id} className={"pp-item" + (c.ok ? " ok" : "")} onClick={() => onGo(c.go)}>
              <span className="pp-tick">{c.ok ? "✓" : ""}</span>{c.label}{c.ok ? null : <em>aggiungi →</em>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const CSS = `
.pp{display:grid;gap:14px;margin-top:22px;--pp-tone:#3ddc84}
.pp-draft{--pp-tone:#f5b544}.pp-off{--pp-tone:#ff6b6b}
.pp>div{border:1px solid var(--b);border-radius:18px;background:var(--s1);padding:20px}
.pp-kick{display:block;font:500 11px "Geist Mono",monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--d)}
.pp-hero{display:flex;align-items:center;gap:22px;position:relative;overflow:hidden}
.pp-hero::after{content:"";position:absolute;inset:auto -20% -60% 30%;height:140%;background:radial-gradient(closest-side,color-mix(in srgb,var(--pp-tone) 22%,transparent),transparent);pointer-events:none}
.pp-orb{position:relative;width:74px;height:74px;flex:none}
.pp-orb i{position:absolute;inset:0;border-radius:50%;border:1.5px solid var(--pp-tone);animation:pp-pulse 2.4s cubic-bezier(.2,.7,.2,1) infinite;opacity:0}
.pp-orb i:nth-child(2){animation-delay:.8s}.pp-orb i:nth-child(3){animation-delay:1.6s}
.pp-orb::after{content:"";position:absolute;inset:26px;border-radius:50%;background:var(--pp-tone);box-shadow:0 0 24px var(--pp-tone)}
@keyframes pp-pulse{0%{transform:scale(.35);opacity:.9}100%{transform:scale(1);opacity:0}}
.pp-st b{display:block;font-size:30px;letter-spacing:-.03em;margin:4px 0 2px}
.pp-sub{color:var(--m);font-size:14px}.pp-when{display:block;margin-top:6px;font-size:12px;color:var(--d)}
.pp-url{display:flex;align-items:center;gap:8px;margin-top:8px;flex-wrap:wrap}
.pp-url code{flex:1;min-width:0;font:600 clamp(16px,2.6vw,22px) "Geist Mono",monospace;letter-spacing:-.02em;overflow-wrap:anywhere}
.pp-mini{border:1px solid var(--b);background:var(--bg);color:var(--fg);border-radius:999px;padding:7px 12px;font:500 12px inherit;cursor:pointer}
.pp-mini:disabled{opacity:.4;cursor:default}
.pp-textbtn{margin-top:10px;background:none;border:0;padding:0;color:var(--m);font:500 12.5px inherit;cursor:pointer;text-decoration:underline;text-underline-offset:3px}
.pp-dirty,.pp-err{padding:12px 16px!important;font-size:13.5px}
.pp-dirty{border-color:color-mix(in srgb,#f5b544 50%,var(--b))!important;color:#f5b544}
.pp-err{border-color:#7a2a2a!important;color:#ff8a8a}
.pp-actions{display:grid;gap:10px}
.pp-hold{position:relative;overflow:hidden;width:100%;padding:18px;border-radius:14px;border:1px solid var(--fg);background:var(--fg);color:var(--bg);font:600 15px inherit;cursor:pointer;touch-action:none;user-select:none;-webkit-user-select:none}
.pp-hold:disabled{opacity:.4;cursor:not-allowed}
.pp-fill{position:absolute;inset:0;background:var(--pp-tone);transform-origin:0 50%;transform:scaleX(0)}
.pp-hold-t{position:relative}
.pp-hold.ok{animation:pp-pop .5s cubic-bezier(.2,1.4,.4,1)}
@keyframes pp-pop{0%{transform:scale(.97)}100%{transform:scale(1)}}
.pp-ghost{width:100%;padding:13px;border-radius:14px;border:1px solid var(--b);background:none;color:var(--m);font:500 13.5px inherit;cursor:pointer}
.pp-check{display:flex;gap:18px;align-items:flex-start;color:var(--pp-tone)}
.pp-list{flex:1;display:grid;gap:4px;color:var(--fg)}
.pp-item{display:flex;align-items:center;gap:10px;text-align:left;background:none;border:0;border-radius:10px;padding:8px 6px;color:var(--fg);font:500 14px inherit;cursor:pointer}
.pp-item:hover{background:var(--s2)}
.pp-item em{margin-left:auto;font-style:normal;font-size:12px;color:var(--d)}
.pp-tick{width:20px;height:20px;border-radius:6px;border:1.5px solid var(--b);display:grid;place-items:center;font-size:12px;flex:none}
.pp-item.ok{color:var(--m)}.pp-item.ok .pp-tick{background:var(--pp-tone);border-color:var(--pp-tone);color:#000}
@media (max-width:520px){.pp-hero{gap:14px}.pp-orb{width:56px;height:56px}.pp-orb::after{inset:19px}.pp-st b{font-size:24px}.pp-check{flex-direction:column}}
@media (prefers-reduced-motion:reduce){.pp-orb i{animation:none;opacity:.4}}
`;

export function mount(el) {
  if (!document.getElementById("pp-css")) { const s = document.createElement("style"); s.id = "pp-css"; s.textContent = CSS; document.head.appendChild(s); }
  const root = createRoot(el);
  return { render: props => root.render(<Panel {...props} />), unmount: () => root.unmount() };
}
