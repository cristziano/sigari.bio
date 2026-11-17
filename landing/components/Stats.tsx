"use client";
// "Ogni visita conta": the title, then the stats block (components/ui/advanced-stats, from 21st.dev, adapted).
import { useRef } from "react";
import { useInView } from "motion/react";
import AdvancedStats from "@/components/ui/advanced-stats";
import { useT } from "@/lib/i18n";

export default function Stats() {
  const { t } = useT();
  const sec = useRef<HTMLElement>(null);
  const near = useInView(sec, { once: true, margin: "600px 0px" }); // the charts are built only when you get close (lighter page load)
  return (
    <section ref={sec} id="stats" aria-label={t("statsT1")} className="px-4 py-14 sm:px-[clamp(16px,6vw,96px)] md:py-24">
      <div className="mx-auto mb-10 flex max-w-[1180px] flex-wrap items-end justify-between gap-6">
        <h2 className="text-[clamp(36px,5vw,64px)] font-bold leading-[1.02] tracking-[-.045em]">{t("statsT1")} <span className="text-quiet">{t("statsT2")}</span></h2>
        <p className="max-w-[40ch] text-[15px] leading-[1.55] text-muted">{t("statsSub")}</p>
      </div>
      {near ? <AdvancedStats /> : <div className="min-h-[640px]" />}
    </section>
  );
}
