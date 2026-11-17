"use client";
// ClippedAreaChart: 30 days of visits as a soft wave. Move over it: the part up to that day stays bright,
// the rest fades, and the header shows that day's number. Written for advanced-stats (its source was not in the prompt).
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";

export type DayPoint = { day: string; visits: number };

const chartConfig = { visits: { label: "visits", color: "#ffffff" } } satisfies ChartConfig;

export function ClippedAreaChart({ data, title, subtitle, loc }: { data: DayPoint[]; title: string; subtitle: string; loc: string }) {
  const [at, setAt] = useState<number | null>(null);
  const i = at ?? data.length - 1;
  const cut = data.length > 1 ? (i / (data.length - 1)) * 100 : 100;
  // compared with the day before
  const change = useMemo(() => {
    const prev = data[Math.max(0, i - 1)]?.visits || 1;
    return ((data[i].visits - prev) / prev) * 100;
  }, [data, i]);
  const fmt = (n: number) => n.toLocaleString(loc, { useGrouping: "always" } as unknown as Intl.NumberFormatOptions);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[13px] text-muted-foreground">{title}</p>
          <p className="mt-1 text-[clamp(30px,3.6vw,44px)] font-semibold leading-none tracking-[-.04em] tabnum">{fmt(data[i].visits)}</p>
          <p className="mt-2 font-mono text-[11px] text-muted-foreground">{at === null ? subtitle : data[i].day}</p>
        </div>
        <Badge variant="secondary" className="font-mono tabnum">{change >= 0 ? "+" : ""}{change.toLocaleString(loc, { maximumFractionDigits: 1 })}%</Badge>
      </div>
      <ChartContainer config={chartConfig} className="mt-6 aspect-auto h-[clamp(200px,24vw,280px)] w-full">
        <AreaChart data={data} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}
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
          <Area dataKey="visits" type="natural" stroke="url(#clip-stroke)" strokeWidth={2} fill="url(#clip-fill)" isAnimationActive animationDuration={1200}
            activeDot={{ r: 5, fill: "#000", stroke: "#fff", strokeWidth: 2 }} />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
