"use client";
// ClippedAreaChart: one metric of the last 30 days as a soft wave (visits, clicks or plays, like the dashboard).
// Move over it: the part up to that day stays bright, the rest fades, and the header shows that day.
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";

export type DayPoint = { day: string; v: number; c: number; p: number };
export type Metric = "v" | "c" | "p";

const chartConfig = { value: { label: "value", color: "#ffffff" } } satisfies ChartConfig;

export function ClippedAreaChart({ data, labels, total, badge, loc }: {
  data: DayPoint[];
  labels: Record<Metric, string>;
  total: string;
  badge: string;
  loc: string;
}) {
  const [metric, setMetric] = useState<Metric>("v");
  const [at, setAt] = useState<number | null>(null);
  const cut = at === null ? 100 : (at / (data.length - 1)) * 100;
  const sum = data.reduce((s, d) => s + d[metric], 0);
  const fmt = (n: number) => n.toLocaleString(loc, { useGrouping: "always" } as unknown as Intl.NumberFormatOptions);
  const rows = data.map(d => ({ day: d.day, value: d[metric] }));

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div role="group" className="flex gap-1 rounded-full border border-line p-1 text-[13px]">
            {(Object.keys(labels) as Metric[]).map(m => (
              <button key={m} type="button" aria-pressed={metric === m} onClick={() => setMetric(m)}
                className={`rounded-full px-3 py-1 transition-colors ${metric === m ? "bg-white text-black" : "text-muted-foreground hover:text-white"}`}>{labels[m]}</button>
            ))}
          </div>
          <p className="mt-5 text-[clamp(30px,3.6vw,44px)] font-semibold leading-none tracking-[-.04em] tabnum">{fmt(at === null ? sum : data[at][metric])}</p>
          <p className="mt-2 font-mono text-[12px] text-muted-foreground">{at === null ? total : data[at].day}</p>
        </div>
        <Badge variant="secondary" className="font-mono">{badge}</Badge>
      </div>
      <ChartContainer config={chartConfig} className="mt-6 aspect-auto h-[clamp(200px,24vw,280px)] w-full">
        <AreaChart data={rows} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}
          onMouseMove={s => { if (typeof s?.activeTooltipIndex === "number") setAt(s.activeTooltipIndex); }}
          onMouseLeave={() => setAt(null)}>
          <defs>
            {/* bright up to the chosen day, faint after it */}
            <linearGradient id="clip-stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset={`${cut}%`} stopColor="#fff" stopOpacity={1} />
              <stop offset={`${cut}%`} stopColor="#fff" stopOpacity={.18} />
            </linearGradient>
            <linearGradient id="clip-fill" x1="0" y1="0" x2="1" y2="0">
              <stop offset={`${cut}%`} stopColor="#fff" stopOpacity={.16} />
              <stop offset={`${cut}%`} stopColor="#fff" stopOpacity={.03} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,.06)" strokeDasharray="3 5" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} minTickGap={48} />
          <Area key={metric} dataKey="value" type="natural" stroke="url(#clip-stroke)" strokeWidth={2} fill="url(#clip-fill)" isAnimationActive animationDuration={1000}
            activeDot={{ r: 5, fill: "#000", stroke: "#fff", strokeWidth: 2 }} />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
