"use client";
// "Ogni visita conta": what the dashboard shows, with example data (said on screen).
// Left: the month in four numbers, each with its 30 days drawn as square dots.
// Right: where visitors come from (dot bars) and from which device.
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { reducedMotion } from "@/lib/site";
import { useT } from "@/lib/i18n";

const DAYS = 30, ROWS = 9;
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

/** 30 days as columns of square dots; they light up row by row the first time they are seen */
function DotSpark({ data, live }: { data: number[]; live: boolean }) {
  const m = Math.max(...data), W = DAYS * 8, H = ROWS * 8;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 h-auto w-full" aria-hidden>
      {data.map((v, x) => {
        const lit = Math.max(1, Math.round(v / m * ROWS));
        return Array.from({ length: ROWS }, (_, y) => {
          const on = y < lit;
          return (
            <motion.rect key={x + "-" + y} x={x * 8 + 1.5} y={H - (y + 1) * 8 + 1.5} width={5} height={5}
              fill={on ? (x === DAYS - 1 ? "#ffffff" : "#cfcfcf") : "#1b1b1b"}
              initial={{ opacity: on ? 0 : 1 }} animate={live ? { opacity: 1 } : undefined}
              transition={{ duration: .01, delay: reducedMotion() ? 0 : y * .06 + x * .008 }} />
          );
        });
      })}
    </svg>
  );
}

/** a share as a row of 50 square dots */
function DotBar({ pct, live, i }: { pct: number; live: boolean; i: number }) {
  const n = Math.round(pct / 2);
  return (
    <span className="flex gap-[2px]" aria-hidden>
      {Array.from({ length: 50 }, (_, j) => (
        <motion.i key={j} className={`block h-2.5 flex-1 rounded-[1px] ${j < n ? "bg-white" : "bg-[#1b1b1b]"}`}
          initial={{ opacity: j < n ? 0 : 1 }} animate={live ? { opacity: 1 } : undefined}
          transition={{ duration: .01, delay: reducedMotion() ? 0 : i * .12 + j * .012 }} />
      ))}
    </span>
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
    <section id="stats" aria-label={t("statsT1")} className="px-4 py-24 sm:px-[clamp(16px,6vw,96px)]">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-[clamp(36px,5vw,64px)] font-bold leading-[1.02] tracking-[-.045em]">{t("statsT1")} <span className="text-quiet">{t("statsT2")}</span></h2>
          <p className="max-w-[40ch] text-[15px] leading-[1.55] text-muted">{t("statsSub")}</p>
        </div>

        <motion.div onViewportEnter={() => setLive(true)} viewport={{ once: true, amount: .25 }}
          className="mt-10 grid gap-px overflow-hidden rounded-[6px] border border-line bg-line lg:grid-cols-[1.25fr_1fr]">
          {/* the month: four numbers, each with its own 30 days */}
          <div className="bg-black p-5 sm:p-7">
            <div className="flex items-baseline justify-between gap-3 font-mono text-[11.5px]">
              <span className="text-white">{t("statsMonth")}</span>
              <span className="flex items-center gap-2 text-quiet"><i aria-hidden className="size-1.5 animate-pulse bg-[#555]" />{t("statsSample")}</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-8">
              {TILES.map((tile, i) => {
                const val = i === 0 ? views : tile.v;
                return (
                  <div key={i} className="min-w-0 border-t border-line pt-3">
                    <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-muted">
                      <span className="truncate">{names[i]}</span>
                      <span className={tile.d.startsWith("−") ? "text-quiet" : "text-white"}>{tile.d}</span>
                    </div>
                    <div className="mt-1.5 text-[clamp(30px,3.6vw,48px)] font-bold leading-none tracking-[-.05em] tabnum">{tile.time ? `0:${val}` : fmt(val)}</div>
                    <DotSpark data={tile.data} live={live} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* where they come from, and on what */}
          <div className="flex flex-col bg-black p-5 sm:p-7">
            <span className="font-mono text-[11.5px] text-white">{t("statsSources")}</span>
            <ol className="mt-5 grid gap-4">
              {SOURCES.map(([name, pct], i) => (
                <li key={i} className="grid grid-cols-[minmax(0,92px)_1fr_auto] items-center gap-3">
                  <span className="truncate text-sm font-medium">{name || t("statsDirect")}</span>
                  <DotBar pct={pct} live={live} i={i} />
                  <span className="w-[78px] text-right font-mono text-[11.5px] text-muted tabnum">{pct}% · <b className="font-semibold text-white">{fmtK(Math.round(TOTAL_VIEWS * pct / 100))}</b></span>
                </li>
              ))}
            </ol>
            <div className="mt-auto pt-8">
              <span className="font-mono text-[11.5px] text-white">{t("statsDevices")}</span>
              <div className="mt-3 flex h-10 overflow-hidden rounded-[4px] border border-line">
                <motion.div className="flex items-center whitespace-nowrap bg-white px-3 text-[13px] font-semibold text-black" initial={{ width: "50%" }} animate={live ? { width: "82%" } : undefined} transition={{ duration: 1.1, ease }}>
                  {t("statsPhone")} 82%
                </motion.div>
                <div className="flex flex-1 items-center justify-end whitespace-nowrap px-3 text-[13px] text-muted">{t("statsDesktop")} 18%</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
