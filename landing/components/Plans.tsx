"use client";
// Plans: everything 18kbio does today is free; Premium will only add new things.
import { motion } from "motion/react";
import { focusClaim } from "@/lib/handle";
import { useT } from "@/lib/i18n";

const Check = () => <svg viewBox="0 0 16 16" aria-hidden className="mt-0.5 size-4 shrink-0 fill-none stroke-[#bdbdbd] [stroke-width:1.6]"><path d="M3.5 8.5l3 3 6-7" /></svg>;
const claim = (e: React.MouseEvent) => { e.preventDefault(); focusClaim(); };

export default function Plans() {
  const { t } = useT();
  const free = t("freeList").split("\n").map(s => s.split("|"));
  const pro = t("proList").split("\n");
  return (
    <section id="plans" aria-label={t("plansT")} className="px-4 py-24 sm:px-[clamp(16px,6vw,96px)]">
      <div className="mx-auto max-w-[1120px]">
        <h2 className="text-center text-[clamp(36px,5vw,56px)] font-bold tracking-[-.045em]">{t("plansT")}</h2>
        <p className="mx-auto mt-3 max-w-[64ch] text-center leading-[1.55] text-muted">{t("plansLead")}</p>
        <div className="mt-8 grid items-start gap-4 lg:grid-cols-[1.7fr_1fr]">
          <div className="rounded-[18px] border border-line-2 bg-s1 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <b className="text-lg">{t("freeName")}</b>
                <p className="mt-2 max-w-[52ch] text-sm leading-[1.5] text-muted">{t("freeSub")}</p>
              </div>
              <div className="text-[44px] font-extrabold leading-none tracking-[-.04em]">0€ <small className="text-sm font-normal tracking-normal text-muted">{t("forever")}</small></div>
            </div>
            <ul className="mt-5 grid gap-x-6 gap-y-3.5 border-t border-line pt-5 sm:grid-cols-2">
              {free.map(([b, s], i) => (
                <motion.li key={b} className="flex gap-3" initial={{ opacity: 0, x: -6 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ duration: .4, delay: i * .03, ease: [0.23, 1, 0.32, 1] }}>
                  <Check /><span><b className="block text-sm font-medium">{b}</b><small className="mt-1 block text-[12.5px] leading-[1.45] text-muted">{s}</small></span>
                </motion.li>
              ))}
            </ul>
            <a href="#top" onClick={claim} className="btn mt-6 w-full sm:w-auto">{t("claimNav")}</a>
          </div>
          <div className="rounded-[18px] border border-line p-6">
            <div className="flex items-center justify-between"><b className="text-lg">{t("proName")}</b><span className="rounded-md border border-line-2 px-2 py-1 font-mono text-[11px] text-muted">{t("proTag")}</span></div>
            <p className="mt-2 text-sm leading-[1.5] text-muted">{t("proSub")}</p>
            <div className="mt-5 text-[32px] font-extrabold tracking-[-.04em] text-quiet">{t("proPrice")}</div>
            <ul className="mt-4 grid gap-2.5 border-t border-line pt-4">
              {pro.map(b => <li key={b} className="flex gap-3 text-sm text-muted"><Check />{b}</li>)}
            </ul>
            <a href="#top" onClick={claim} className="btn-2 mt-6 w-full">{t("proBtn")}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
