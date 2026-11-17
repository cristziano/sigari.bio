"use client";
// "Advanced Stats" (21st.dev), adapted to 18kbio: dark, black and white, Italian/English texts,
// our example numbers (said on screen). The big wave is the visits of the last 30 days.
import { useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { ClippedAreaChart, type DayPoint } from "@/components/ui/advanced-stats-utils/charts";
import { TimelineAnimation } from "@/components/ui/advanced-stats-utils/timeline-animation";
import { useT } from "@/lib/i18n";

// example data, not real numbers
const KPIS = [
  { v: "9.742", change: "+6,1%", up: true },
  { v: "6.118", change: "+3,4%", up: true },
  { v: "2.860", change: "+14%", up: true },
  { v: "0:52", change: "+5s", up: true },
];
const PHONE = 79;

function visitsSeries(loc: string): DayPoint[] {
  let s = 4;
  const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i));
    const v = Math.round((210 + 260 * (.35 + .3 * Math.sin(i / 3.2 + 4) + .35 * r())) * (.72 + i / 30 * .56));
    return { day: d.toLocaleDateString(loc, { day: "numeric", month: "short" }), visits: v };
  });
}

export default function AdvancedStats() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { t, list, lang } = useT();
  const loc = lang === "it" ? "it-IT" : "en-US";
  const data = useMemo(() => visitsSeries(loc), [loc]);
  const names = list("statsTiles");

  return (
    <div ref={timelineRef} className="mx-auto max-w-[1180px]">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* main chart */}
        <TimelineAnimation animationNum={1} timelineRef={timelineRef} className="rounded-3xl border border-line bg-s1 p-6 sm:p-8 lg:col-span-2">
          <ClippedAreaChart data={data} title={t("statsChartTitle")} subtitle={t("statsSample")} loc={loc} />
        </TimelineAnimation>

        {/* breakdown */}
        <div className="flex flex-col gap-4">
          <TimelineAnimation animationNum={2} timelineRef={timelineRef} className="flex flex-1 flex-col justify-between rounded-3xl bg-white p-6 text-black shadow-lg">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[.18em] text-black/45">{t("statsDevices")}</p>
              <h4 className="text-xl font-bold tracking-tight">{t("statsPhoneTitle")}</h4>
            </div>
            <div className="mt-8">
              <div className="mb-2 flex items-end justify-between">
                <span className="text-3xl font-semibold tracking-tighter">{PHONE}%</span>
                <span className="mb-1 text-xs font-medium text-black/50">{t("statsDesktop")} {100 - PHONE}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10">
                <div className="h-full rounded-full bg-black" style={{ width: `${PHONE}%` }} />
              </div>
            </div>
          </TimelineAnimation>

          <TimelineAnimation animationNum={3} timelineRef={timelineRef} className="rounded-3xl border border-line bg-s1 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg border border-line bg-black">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-5" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M15 8C15 9.65685 13.6569 11 12 11C10.3431 11 9 9.65685 9 8C9 6.34315 10.3431 5 12 5C13.6569 5 15 6.34315 15 8Z" />
                  <path d="M16 4C17.6569 4 19 5.34315 19 7C19 8.22309 18.2681 9.27523 17.2183 9.7423" />
                  <path d="M13.7143 14H10.2857C7.91876 14 5.99998 15.9188 5.99998 18.2857C5.99998 19.2325 6.76749 20 7.71426 20H16.2857C17.2325 20 18 19.2325 18 18.2857C18 15.9188 16.0812 14 13.7143 14Z" />
                  <path d="M17.7143 13C20.0812 13 22 14.9188 22 17.2857C22 18.2325 21.2325 19 20.2857 19" />
                  <path d="M8 4C6.34315 4 5 5.34315 5 7C5 8.22309 5.73193 9.27523 6.78168 9.7423" />
                  <path d="M3.71429 19C2.76751 19 2 18.2325 2 17.2857C2 14.9188 3.91878 13 6.28571 13" />
                </svg>
              </div>
              <h4 className="font-bold">{t("statsGrowth")}</h4>
            </div>
            <p className="text-sm leading-[1.5] text-muted">{t("statsGrowthA")} <span className="font-semibold text-white">+27%</span> {t("statsGrowthB")}</p>
          </TimelineAnimation>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 pt-4 md:grid-cols-4">
        {KPIS.map((k, i) => (
          <TimelineAnimation key={i} animationNum={4 + i} timelineRef={timelineRef}
            className={cn("rounded-2xl border border-line bg-s1 p-5 transition-colors hover:border-white/40 hover:bg-white/[.04]")}>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[.14em] text-muted">{names[i]}</p>
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-2xl font-bold tracking-tighter tabnum">{k.v}</p>
              <span className={cn("rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold", k.up ? "bg-white text-black" : "bg-white/10 text-muted")}>{k.change}</span>
            </div>
          </TimelineAnimation>
        ))}
      </div>
    </div>
  );
}
