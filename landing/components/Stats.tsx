"use client";
// "Ogni visita conta": an odometer and a dot-matrix chart of 30 days (example data, said on screen).
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { reducedMotion } from "@/lib/site";
import { useT } from "@/lib/i18n";

const DAYS = 30, ROWS = 16;
const rng = (s: number) => () => (s = (s * 16807) % 2147483647) / 2147483647;
const make = (base: number, amp: number, s: number) => { const r = rng(s); return Array.from({ length: DAYS }, (_, i) => Math.round((base + amp * (.4 + .3 * Math.sin(i / 4.3) + .3 * r())) * (.75 + i / DAYS * .5))); };
const SETS = {
  views: { data: make(260, 380, 7), delta: "+18%" },
  clicks: { data: make(70, 150, 11), delta: "+9%" },
  plays: { data: make(30, 110, 23), delta: "+31%" },
};
type Metric = keyof typeof SETS;
const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);

function Odometer({ n, loc }: { n: number; loc: string }) {
  const s = n.toLocaleString(loc);
  return (
    <div className="odo tabnum" aria-label={s}>
      {[...s].map((c, i) => /\d/.test(c)
        ? <span key={i + "-" + s.length} className="d" aria-hidden><span style={{ transform: `translateY(-${+c}em)` }}>{[..."0123456789"].map(d => <i key={d}>{d}</i>)}</span></span>
        : <span key={i + "-" + s.length} aria-hidden>{c}</span>)}
    </div>
  );
}

export default function Stats() {
  const { t, list, lang } = useT();
  const loc = lang === "it" ? "it-IT" : "en-US";
  const KEYS = Object.keys(SETS) as Metric[];
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const seen = useInView(box, { once: true, amount: .2 });
  const visible = useInView(box, { amount: .2 });
  const [metric, setMetric] = useState<Metric>("views");
  const [total, setTotal] = useState(sum(SETS.views.data));
  const [tip, setTip] = useState<{ x: number; text: string } | null>(null);
  const st = useRef({ prog: 0, hover: -1, W: 0, H: 0 });

  const draw = () => {
    const c = cv.current, { prog, hover, W, H } = st.current;
    const ctx = c?.getContext("2d"); if (!ctx || !W) return;
    ctx.clearRect(0, 0, W, H);
    const data = SETS[metric].data, m = Math.max(...data);
    const cw = W / DAYS, ch = H / ROWS, s = Math.max(2, Math.min(cw, ch) * .56);
    const blink = Math.floor(performance.now() / 500) % 2;
    for (let x = 0; x < DAYS; x++) {
      const lit = Math.max(1, Math.round(data[x] / m * ROWS * prog));
      for (let y = 0; y < ROWS; y++) {
        const on = y < lit && prog > 0;
        let col = "#1a1a1a";
        if (on) col = hover === -1 || hover === x ? "#ffffff" : "#4a4a4a";
        if (on && x === DAYS - 1 && y === lit - 1 && blink) col = "#6a6a6a";
        ctx.fillStyle = col;
        ctx.fillRect(x * cw + (cw - s) / 2, H - (y + 1) * ch + (ch - s) / 2, s, s);
      }
    }
  };
  const drawRef = useRef(draw); drawRef.current = draw;

  // canvas size (sharp on retina)
  useEffect(() => {
    const size = () => {
      const c = cv.current; if (!c) return;
      const r = c.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
      st.current.W = r.width; st.current.H = r.height;
      c.width = Math.round(r.width * dpr); c.height = Math.round(r.height * dpr);
      c.getContext("2d")!.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawRef.current();
    };
    size();
    const ro = new ResizeObserver(size); if (cv.current) ro.observe(cv.current);
    return () => ro.disconnect();
  }, []);

  // the bars grow in steps when the chart first shows, and again on every tab change
  useEffect(() => {
    if (!seen) return;
    setTotal(sum(SETS[metric].data));
    const steps = reducedMotion() ? 1 : 10; let k = 0;
    st.current.prog = 0;
    const t = setInterval(() => { k++; st.current.prog = k / steps; drawRef.current(); if (k >= steps) clearInterval(t); }, 55);
    return () => clearInterval(t);
  }, [seen, metric]);

  // while on screen: the last dot blinks and a few visits arrive live
  useEffect(() => {
    if (!visible) return;
    const blink = setInterval(() => drawRef.current(), 500);
    let live = 0;
    const tick = () => {
      if (metric === "views" && !reducedMotion()) { SETS.views.data[DAYS - 1] += 1 + ((Math.random() * 3) | 0); setTotal(sum(SETS.views.data)); }
      live = window.setTimeout(tick, 2500 + Math.random() * 2500);
    };
    live = window.setTimeout(tick, 2000);
    return () => { clearInterval(blink); clearTimeout(live); };
  }, [visible, metric]);

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.min(DAYS - 1, Math.max(0, Math.floor((e.clientX - r.left) / r.width * DAYS)));
    if (x === st.current.hover) return;
    st.current.hover = x;
    const d = new Date(); d.setDate(d.getDate() - (DAYS - 1 - x));
    setTip({ x: (x + .5) / DAYS * 100, text: `${d.toLocaleDateString(loc, { day: "numeric", month: "short" })} · ${SETS[metric].data[x].toLocaleString(loc)} ${list("statsTabs")[KEYS.indexOf(metric)]}` });
    draw();
  };
  const leave = () => { st.current.hover = -1; setTip(null); draw(); };

  const totals = Object.fromEntries(KEYS.map(k => [k, k === metric ? total : sum(SETS[k].data)])) as Record<Metric, number>;
  return (
    <section id="stats" aria-label={t("statsT1")} className="px-4 py-28 sm:px-[clamp(16px,6vw,96px)]">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-[clamp(36px,5vw,64px)] font-bold leading-[1.02] tracking-[-.045em]">{t("statsT1")}<br /><span className="text-quiet">{t("statsT2")}</span></h2>
          <p className="max-w-[40ch] text-[15px] leading-[1.55] text-muted">{t("statsSub")}</p>
        </div>

        <div ref={box} className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:items-end">
          {/* the three numbers are the switch: press one to see its 30 days */}
          <div role="group" aria-label={t("statsGroup")} className="grid">
            {KEYS.map((k, i) => (
              <button key={k} type="button" aria-pressed={metric === k} onClick={() => setMetric(k)}
                className={`group grid border-t border-line py-4 text-left transition-colors first:border-t-0 ${metric === k ? "text-white" : "text-quiet hover:text-muted"}`}>
                <span className="flex items-center justify-between font-mono text-xs">
                  {list("statsTabs")[i]}
                  <span className={`rounded px-1.5 py-0.5 ${metric === k ? "bg-white text-black" : ""}`}>{SETS[k].delta}</span>
                </span>
                {metric === k ? <Odometer n={total} loc={loc} /> : <span className="text-[clamp(28px,3vw,40px)] font-bold tracking-[-.05em] tabnum">{totals[k].toLocaleString(loc)}</span>}
              </button>
            ))}
          </div>
          <div>
            <div className="relative h-[clamp(220px,30vw,340px)]">
              <canvas ref={cv} role="img" aria-label={t("statsChart")} className="size-full" onPointerMove={move} onPointerLeave={leave} />
              {tip && <div className="pointer-events-none absolute -top-2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-white px-2 py-1 font-mono text-[11px] text-black" style={{ left: tip.x + "%" }}>{tip.text}</div>}
            </div>
            <div className="mt-3 flex justify-between font-mono text-[11px] text-quiet">
              <span>{t("statsAgo")}</span><span className="flex items-center gap-2"><i aria-hidden className="size-1.5 animate-pulse rounded-full bg-[#555]" />{t("statsSample")}</span><span>{t("statsToday")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
