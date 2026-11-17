"use client";
// Plans, said plainly: everything is free today. No price cards.
import { motion } from "motion/react";
import { focusClaim } from "@/lib/handle";
import { useT } from "@/lib/i18n";

export default function Plans() {
  const { t } = useT();
  const free = t("freeList").split("\n").map(s => s.split("|"));
  return (
    <section id="plans" aria-label={t("plansT")} className="px-4 py-28 sm:px-[clamp(16px,6vw,96px)]">
      <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-end">
        <div>
          <h2 className="text-[clamp(64px,11vw,168px)] font-extrabold leading-[.86] tracking-[-.06em]">
            {t("plansBig1")}<br /><span className="text-quiet">{t("plansBig2")}</span>
          </h2>
          <p className="mt-8 max-w-[46ch] text-[17px] leading-[1.55] text-muted">{t("plansLead")}</p>
          <a href="#top" onClick={e => { e.preventDefault(); focusClaim(); }} className="btn mt-8 !min-h-12 !px-6 !text-[15px]">{t("claimNav")}</a>
        </div>
        <ol className="border-t border-line">
          {free.map(([b, s], i) => (
            <motion.li key={b} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .6 }}
              transition={{ duration: .5, delay: i * .05, ease: [0.23, 1, 0.32, 1] }}
              className="grid grid-cols-[2.2rem_1fr] items-baseline gap-2 border-b border-line py-4">
              <span className="font-mono text-xs text-quiet tabnum">{String(i + 1).padStart(2, "0")}</span>
              <span><b className="text-[clamp(18px,1.8vw,22px)] font-semibold tracking-[-.02em]">{b}</b><span className="mt-1 block text-sm text-muted">{s}</span></span>
            </motion.li>
          ))}
          <li className="grid grid-cols-[2.2rem_1fr] items-baseline gap-2 py-4 text-sm text-muted">
            <span className="font-mono text-xs text-quiet">+</span><span>{t("proLine")}</span>
          </li>
        </ol>
      </div>
    </section>
  );
}
