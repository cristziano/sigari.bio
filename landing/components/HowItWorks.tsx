"use client";
// "Tre passi. Un minuto.": how it works, each step with a small picture of what happens.
import { motion } from "motion/react";
import { useHandle } from "@/lib/handle";
import { useT } from "@/lib/i18n";

const ease = [0.23, 1, 0.32, 1] as const;

function Picture({ i, handle }: { i: number; handle: string }) {
  if (i === 0) return (
    <div className="flex items-center gap-1 rounded-xl border border-line-2 bg-black py-2 pl-3 pr-2 font-mono text-[13px]">
      <span className="text-quiet">18kbio.xyz/</span><span className="truncate text-white">{handle || "iltuonome"}</span>
      <span className="ml-auto rounded-lg bg-white px-2.5 py-1 font-sans text-[12px] font-semibold text-black">✓</span>
    </div>
  );
  if (i === 1) return (
    <div className="flex items-center gap-3 rounded-xl border border-line-2 bg-black p-3">
      <span className="grid size-10 place-items-center rounded-full bg-white/10 text-sm font-semibold">{(handle || "t")[0].toUpperCase()}</span>
      <span className="grid flex-1 gap-1.5"><i className="h-2 w-3/4 rounded-full bg-white/70" /><i className="h-2 w-1/2 rounded-full bg-white/25" /></span>
      <span className="flex gap-1">{["#ff3b6b", "#7c5cff", "#3ddc84"].map(c => <i key={c} className="size-3 rounded-full" style={{ background: c }} />)}</span>
    </div>
  );
  return (
    <div className="flex flex-wrap gap-2">
      {["TikTok", "Instagram", "Discord", "QR"].map(x => <span key={x} className="rounded-full border border-line-2 bg-black px-3 py-1.5 text-[12px] text-muted">{x}</span>)}
    </div>
  );
}

export default function HowItWorks() {
  const { t } = useT();
  const { handle } = useHandle();
  const steps = t("howSteps").split("\n").map(s => s.split("|"));
  return (
    <section aria-label={`${t("howT1")} ${t("howT2")}`} className="px-4 py-14 sm:px-[clamp(16px,6vw,96px)] md:py-24">
      <div className="mx-auto max-w-[1180px]">
        <h2 className="text-[clamp(34px,5vw,64px)] font-bold leading-[1.02] tracking-[-.045em]">{t("howT1")} <span className="text-quiet">{t("howT2")}</span></h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map(([b, s], i) => (
            <motion.li key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .4 }} transition={{ duration: .6, delay: i * .1, ease }}
              className="flex flex-col rounded-3xl border border-line bg-s1 p-6">
              <span className="font-mono text-[12px] text-quiet">0{i + 1}</span>
              <b className="mt-3 text-[22px] font-semibold tracking-[-.03em]">{b}</b>
              <p className="mt-2 text-[15px] leading-[1.5] text-muted">{s}</p>
              <div className="mt-auto pt-6"><Picture i={i} handle={handle} /></div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
