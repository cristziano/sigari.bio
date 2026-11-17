"use client";
// "Advanced Stats" (21st.dev), adapted to 18kbio. It shows only what the dashboard really has
// (Statistiche page): visits / clicks / plays per day, the five numbers on top of that page,
// devices and the "in diretta, oggi" feed. The numbers are examples and the block says so.
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { ClippedAreaChart, type DayPoint } from "@/components/ui/advanced-stats-utils/charts";
import { TimelineAnimation } from "@/components/ui/advanced-stats-utils/timeline-animation";
import { reducedMotion } from "@/lib/site";
import { useT } from "@/lib/i18n";

// example data, same shape as the dashboard's daily stats
function series(loc: string): DayPoint[] {
  let s = 4;
  const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i));
    const v = Math.round((38 + 46 * (.35 + .3 * Math.sin(i / 3.2 + 4) + .35 * r())) * (.72 + i / 30 * .56));
    return { day: d.toLocaleDateString(loc, { day: "numeric", month: "short" }), v, c: Math.round(v * (.26 + r() * .12)), p: Math.round(v * (.1 + r() * .08)) };
  });
}
const DEVICES: [string, number][] = [["devPhone", 74], ["devDesktop", 22], ["devTablet", 4]];

/** "In diretta, oggi": the same kind of lines the dashboard writes, one every few seconds */
function LiveFeed() {
  const { t, list } = useT();
  const lines = list("statsFeed", "\n");
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { amount: .3 });
  const [shown, setShown] = useState<{ id: number; text: string; time: string }[]>([]);
  useEffect(() => {
    if (!seen) return;
    let n = shown.length;
    const add = () => {
      const d = new Date();
      setShown(s => [{ id: n, text: lines[n % lines.length], time: d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) }, ...s].slice(0, 4));
      n++;
    };
    if (!n) add();
    if (reducedMotion()) return;
    const id = setInterval(add, 2600);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen, lines.join()]);
  return (
    <div ref={ref}>
      <div className="mb-4 flex items-center gap-2">
        <span className="relative flex size-2"><span className="absolute inset-0 animate-ping rounded-full bg-white/60" /><span className="relative size-2 rounded-full bg-white" /></span>
        <h4 className="font-bold">{t("statsLive")}</h4>
      </div>
      <ul className="grid gap-2.5">
        <AnimatePresence initial={false}>
          {shown.map(l => (
            <motion.li key={l.id} layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .35 }}
              className="flex gap-3 text-[13px] leading-[1.4]">
              <time className="shrink-0 font-mono text-[12px] leading-[1.6] text-quiet">{l.time}</time><span className="text-muted">{l.text}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export default function AdvancedStats() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { t, list, lang } = useT();
  const loc = lang === "it" ? "it-IT" : "en-US";
  const data = useMemo(() => series(loc), [loc]);
  const [mv, mc, mp] = list("statsMetrics");
  const fmt = (n: number) => n.toLocaleString(loc, { useGrouping: "always" } as unknown as Intl.NumberFormatOptions);

  // the five numbers on top of the dashboard's Statistiche page
  const v = data.reduce((s, d) => s + d.v, 0), c = data.reduce((s, d) => s + d.c, 0), p = data.reduce((s, d) => s + d.p, 0);
  const names = list("statsKpis"), subs = list("statsKpiSubs");
  const kpis = [fmt(v), fmt(c), Math.round(c / v * 100) + "%", fmt(p), "48s"];

  return (
    <div ref={timelineRef} className="mx-auto max-w-[1180px]">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* main chart */}
        <TimelineAnimation animationNum={1} timelineRef={timelineRef} className="rounded-3xl border border-line bg-s1 p-6 sm:p-8 lg:col-span-2">
          <ClippedAreaChart data={data} labels={{ v: mv, c: mc, p: mp }} total={t("statsTotal")} badge={t("statsSample")} loc={loc} />
        </TimelineAnimation>

        <div className="flex flex-col gap-4">
          {/* devices */}
          <TimelineAnimation animationNum={2} timelineRef={timelineRef} className="rounded-3xl bg-white p-6 text-black shadow-lg">
            <p className="mb-4 text-[12px] font-semibold uppercase tracking-[.18em] text-black/45">{t("statsDevices")}</p>
            <ul className="grid gap-3">
              {DEVICES.map(([k, pct]) => (
                <li key={k}>
                  <div className="mb-1.5 flex items-baseline justify-between text-sm"><span className="font-medium">{t(k as "devPhone")}</span><span className="font-semibold tabnum">{pct}%</span></div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-black/10"><div className="h-full rounded-full bg-black" style={{ width: `${pct}%` }} /></div>
                </li>
              ))}
            </ul>
          </TimelineAnimation>

          {/* live feed */}
          <TimelineAnimation animationNum={3} timelineRef={timelineRef} className="flex-1 rounded-3xl border border-line bg-s1 p-6">
            <LiveFeed />
          </TimelineAnimation>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 pt-4 md:grid-cols-5">
        {kpis.map((k, i) => (
          <TimelineAnimation key={i} animationNum={4 + i} timelineRef={timelineRef}
            className={`rounded-2xl border border-line bg-s1 p-5 transition-colors hover:border-white/40 hover:bg-white/[.04] ${i === 4 ? "col-span-2 md:col-span-1" : ""}`}>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[.14em] text-muted">{names[i]}</p>
            <p className="text-2xl font-bold tracking-tighter tabnum">{k}</p>
            <p className="mt-1 text-[12px] text-quiet">{subs[i]}</p>
          </TimelineAnimation>
        ))}
      </div>
    </div>
  );
}
