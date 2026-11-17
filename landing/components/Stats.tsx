"use client";
// "Ogni visita conta": what the dashboard shows, with example data (said on screen).
// Left: the month in four numbers, each with its 30 days as a smooth curve that draws itself.
// Right: where visitors come from and from which device.
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { reducedMotion } from "@/lib/site";
import { useT } from "@/lib/i18n";

const DAYS = 30;
const rng = (s: number) => () => (s = (s * 16807) % 2147483647) / 2147483647;
const series = (base: number, amp: number, s: number, up = true) => {
  const r = rng(s);
  return Array.from({ length: DAYS }, (_, i) => Math.round((base + amp * (.35 + .3 * Math.sin(i / 3.7 + s) + .35 * r())) * (up ? .7 + i / DAYS * .6 : 1.15 - i / DAYS * .3)));
};

const TILES = [
  { v: 12480, d: "+4,2%", data: series(260, 300, 7) },
  { v: 8306, d: "+9,8%", data: series(170, 200, 3) },
  { v: 3912, d: "+12%", data: series(80, 120, 11) },
  { v: 41, d: "−3s", data: series(30, 20, 5, false), time: true },
];
const SOURCES: [string, number][] = [["Discord", 38], ["TikTok", 24], ["", 17], ["Instagram", 12], ["Google", 9]];
const TOTAL_VIEWS = 12480;
const ease = [0.23, 1, 0.32, 1] as const;

/** points -> a smooth path (Catmull-Rom turned into Bézier curves) */
function smooth(pts: [number, number][]) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[Math.max(0, i - 1)], [x1, y1] = pts[i], [x2, y2] = pts[i + 1], [x3, y3] = pts[Math.min(pts.length - 1, i + 2)];
    d += ` C${(x1 + (x2 - x0) / 6).toFixed(1)},${(y1 + (y2 - y0) / 6).toFixed(1)} ${(x2 - (x3 - x1) / 6).toFixed(1)},${(y2 - (y3 - y1) / 6).toFixed(1)} ${x2},${y2}`;
  }
  return d;
}

/** 30 days as a curve that draws itself, with a soft fill below and a dot on today */
function Curve({ data, live, id }: { data: number[]; live: boolean; id: string }) {
  const W = 300, H = 90, pad = 6;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => [+(i / (DAYS - 1) * W).toFixed(1), +(pad + (1 - (v - min) / (max - min || 1)) * (H - pad * 2)).toFixed(1)] as [number, number]);
  const line = smooth(pts), last = pts[pts.length - 1];
  const fast = reducedMotion();
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 h-[84px] w-full overflow-visible" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id={`f-${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".22" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
      </defs>
      {[.25, .5, .75].map(g => <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="#fff" strokeOpacity=".06" strokeDasharray="2 4" vectorEffect="non-scaling-stroke" />)}
      <motion.path d={`${line} L${W},${H} L0,${H} Z`} fill={`url(#f-${id})`} initial={{ opacity: 0 }} animate={live ? { opacity: 1 } : undefined} transition={{ duration: fast ? 0 : .9, delay: fast ? 0 : .6 }} />
      <motion.path d={line} fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }} animate={live ? { pathLength: 1 } : undefined} transition={{ duration: fast ? 0 : 1.4, ease }} />
      <motion.circle cx={last[0]} cy={last[1]} r="3.2" fill="#fff" initial={{ scale: 0 }} animate={live ? { scale: 1 } : undefined} transition={{ delay: fast ? 0 : 1.3 }} />
    </svg>
  );
}

export default function Stats() {
  const { t, list, lang } = useT();
  const loc = lang === "it" ? "it-IT" : "en-US";
  const [live, setLive] = useState(false);
  const [views, setViews] = useState(TILES[0].v);
  const names = list("statsTiles");

  // while the section is on screen, a few visits arrive live
  useEffect(() => {
    if (!live || reducedMotion()) return;
    let id = 0;
    const tick = () => { setViews(v => v + 1 + ((Math.random() * 3) | 0)); id = window.setTimeout(tick, 2200 + Math.random() * 2600); };
    id = window.setTimeout(tick, 1800);
    return () => clearTimeout(id);
  }, [live]);

  const fmt = (n: number) => n.toLocaleString(loc, { useGrouping: "always" } as unknown as Intl.NumberFormatOptions); // 8.306 like 12.481
  const fmtK = (n: number) => n >= 1000 ? (n / 1000).toLocaleString(loc, { maximumFractionDigits: 1 }) + "k" : String(n);

  return (
    <section id="stats" aria-label={t("statsT1")} className="relative px-4 py-24 sm:px-[clamp(16px,6vw,96px)]">
      <div className="relative mx-auto max-w-[1180px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-[clamp(36px,5vw,64px)] font-bold leading-[1.02] tracking-[-.045em]">{t("statsT1")} <span className="text-quiet">{t("statsT2")}</span></h2>
          <p className="max-w-[40ch] text-[15px] leading-[1.55] text-muted">{t("statsSub")}</p>
        </div>

        <motion.div onViewportEnter={() => setLive(true)} viewport={{ once: true, amount: .25 }} className="mt-10 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          {/* the month: four numbers, each with its own 30 days */}
          <div className="rounded-[22px] border border-line bg-gradient-to-b from-[#0e0e0e] to-[#070707] p-4 sm:p-5">
            <div className="flex items-baseline justify-between gap-3 px-1 pb-4 text-sm">
              <span><b className="font-semibold">{t("statsMonth")}</b></span>
              <span className="flex items-center gap-2 font-mono text-[11px] text-quiet"><i aria-hidden className="size-1.5 animate-pulse rounded-full bg-[#666]" />{t("statsSample")}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {TILES.map((tile, i) => (
                <div key={i} className="group min-w-0 rounded-[16px] border border-line bg-black/60 p-4 transition-colors hover:border-line-2">
                  <div className="flex items-center justify-between gap-2 text-[13px] text-muted">
                    <span className="truncate">{names[i]}</span>
                    <span className={`rounded-full px-2 py-0.5 font-mono text-[11px] ${tile.d.startsWith("−") ? "bg-white/5 text-muted" : "bg-white/10 text-white"}`}>{tile.d}</span>
                  </div>
                  <div className="mt-2 text-[clamp(28px,3vw,38px)] font-semibold leading-none tracking-[-.04em] tabnum">{tile.time ? `0:${tile.v}` : fmt(i === 0 ? views : tile.v)}</div>
                  <Curve data={tile.data} live={live} id={String(i)} />
                </div>
              ))}
            </div>
          </div>

          {/* where they come from, and on what */}
          <div className="flex flex-col rounded-[22px] border border-line bg-gradient-to-b from-[#0e0e0e] to-[#070707] p-4 sm:p-5">
            <div className="px-1 pb-4 text-sm"><b className="font-semibold">{t("statsSources")}</b></div>
            <ol className="grid gap-1 rounded-[16px] border border-line bg-black/60 p-2">
              {SOURCES.map(([name, pct], i) => (
                <li key={i} className="grid grid-cols-[1.4rem_minmax(0,90px)_1fr_auto] items-center gap-3 rounded-[10px] px-2.5 py-3 transition-colors hover:bg-white/[.03]">
                  <span className="font-mono text-[11px] text-quiet">{i + 1}</span>
                  <span className="truncate text-sm font-medium">{name || t("statsDirect")}</span>
                  <span className="relative h-1.5 overflow-hidden rounded-full bg-white/[.07]">
                    <motion.span className="absolute inset-y-0 left-0 rounded-full bg-white" initial={{ width: 0 }} animate={live ? { width: `${(pct / SOURCES[0][1]) * 100}%` } : undefined}
                      transition={{ duration: 1, ease, delay: reducedMotion() ? 0 : .2 + i * .1 }} style={{ opacity: 1 - i * .14 }} />
                  </span>
                  <span className="w-[86px] text-right text-[13px] tabnum"><span className="text-muted">{pct}%</span> <b className="ml-1 font-semibold">{fmtK(Math.round(TOTAL_VIEWS * pct / 100))}</b></span>
                </li>
              ))}
            </ol>
            <div className="mt-4 rounded-[16px] border border-line bg-black/60 p-4">
              <span className="text-[13px] text-muted">{t("statsDevices")}</span>
              <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-white/[.07]">
                <motion.span className="rounded-full bg-white" initial={{ width: 0 }} animate={live ? { width: "82%" } : undefined} transition={{ duration: 1.1, ease, delay: .4 }} />
              </div>
              <div className="mt-2.5 flex justify-between text-[13px]"><span>{t("statsPhone")} <b>82%</b></span><span className="text-muted">{t("statsDesktop")} 18%</span></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
