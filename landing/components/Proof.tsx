"use client";
// "N profili creati": the real number of profiles (read from Firestore) and the way to explore them.
// If it can't be read, the button hides itself.
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { firebase } from "@/lib/site";
import { useT } from "@/lib/i18n";

export default function Proof() {
  const { t, lang } = useT();
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    firebase().then(({ db, fs }) => fs.getCountFromServer(fs.collection(db, "profiles"))).then(r => setCount(r.data().count)).catch(() => setCount(null));
  }, []);
  // no grey placeholders while loading (site rule): the button appears when the number arrives
  if (!count) return null;
  const fmt = (n: number) => n.toLocaleString(lang === "it" ? "it-IT" : "en-US");

  // one button: how many profiles there are (a real count) and the way to explore them.
  // No faces or names of other users on the home page without their OK.
  return (
    <section aria-label={t("proofTitle")} className="flex justify-center px-4 py-12">
      <motion.a href="/esplora" whileHover={{ y: -2 }} whileTap={{ scale: .97 }}
        className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.02))] py-2 pl-2 pr-5 shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_14px_40px_-18px_rgba(0,0,0,.9)] transition-colors hover:border-white/35">
        {/* a light that slides across on hover */}
        <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-[left,opacity] duration-700 group-hover:left-[110%] group-hover:opacity-100" />
        <span aria-hidden className="grid size-10 place-items-center rounded-full border border-white/15 text-[17px] font-semibold">@</span>
        <span className="text-left leading-tight">
          <b className="block whitespace-nowrap text-[15px] font-semibold">{t("proofCount", { n: count >= 10 ? fmt(Math.floor(count / 10) * 10) + "+" : fmt(count) })}</b>
          <span className="whitespace-nowrap text-[13px] text-muted transition-colors group-hover:text-white">{t("proofAll")}</span>
        </span>
        <span aria-hidden className="ml-1 grid size-9 place-items-center rounded-full bg-white text-black transition-transform duration-300 group-hover:translate-x-1">→</span>
      </motion.a>
    </section>
  );
}
