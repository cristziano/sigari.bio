"use client";
// Profile of the week: the most voted in the Discord "profili" channel (api/photos?profili=top).
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useT } from "@/lib/i18n";
import { topProfiles } from "./Proof";

type Top = { handle: string; name?: string; bio?: string; avatar?: string; banner?: string; accent?: string; yes: number };
const url = (u: string) => `url("${u.replace(/"/g, "%22")}")`;

export default function Weekly() {
  const [t, setT] = useState<Top | null>(null);
  const [most, setMost] = useState(false); // no winner yet: the most viewed profile, said clearly
  const { t: tr } = useT();
  useEffect(() => {
    fetch("/api/photos?profili=top").then(r => r.ok ? r.json() : null).then(async j => {
      if (j?.top) return setT(j.top);
      const { list } = await topProfiles();
      const p = list[0]; if (!p) return;
      setMost(true);
      setT({ handle: p.handle, name: p.name, avatar: p.avatar, banner: p.banner, accent: p.accent, yes: 0 });
    }).catch(() => {});
  }, []);
  const accent = t?.accent && t.accent.toLowerCase() !== "#ffffff" ? t.accent + "66" : undefined;

  return (
    <section id="weekly" aria-label={tr("wkTitle")} className="px-4 py-24 sm:px-[clamp(16px,6vw,96px)]">
      <div className="mx-auto grid max-w-[1000px] items-center gap-10 md:grid-cols-[1fr_360px]">
        <div>
          <h2 className="text-[clamp(36px,5vw,56px)] font-bold leading-[1.02] tracking-[-.045em]">{tr("wkTitle")}</h2>
          <p className="mt-4 max-w-[48ch] leading-[1.55] text-muted">{tr("wkSub")}</p>
          <a className="btn-2 mt-6" href="https://discord.gg/18k" target="_blank" rel="noopener">{tr("wkBtn")}</a>
        </div>
        <motion.a href={t ? "/" + t.handle : "https://discord.gg/18k"} target={t ? undefined : "_blank"} rel={t ? undefined : "noopener"}
          aria-label={t ? tr("wkOpen", { h: t.handle }) : tr("wkBtn")}
          initial={{ opacity: 0, rotate: -3, y: 30 }} whileInView={{ opacity: 1, rotate: 0, y: 0 }} viewport={{ once: true, amount: .4 }}
          whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 120, damping: 16 }}
          className="block overflow-hidden rounded-[18px] border border-line-2 bg-s1" style={{ borderColor: accent }}>
          <div className="h-[110px] bg-s2 bg-cover bg-center" style={t?.banner ? { backgroundImage: url(t.banner) } : undefined} />
          <div className="relative px-[22px] pb-[22px]">
            <div className="-mt-9 grid size-[66px] place-items-center rounded-full border-4 border-s1 bg-[#1c1c1c] bg-cover bg-center text-2xl font-bold"
              style={t?.avatar ? { backgroundImage: url(t.avatar) } : undefined}>{t && !t.avatar ? (t.name || t.handle)[0].toUpperCase() : null}</div>
            <b className="mt-3 block text-lg tracking-[-.02em]">{t ? t.name || t.handle : "—"}</b>
            <span className="font-mono text-xs text-muted">{t ? "18kbio.xyz/" + t.handle : "/condividi"}</span>
            {t?.bio && <p className="mt-2 line-clamp-2 text-sm text-muted">{t.bio}</p>}
            {t && !most && <span className="mt-3 block font-mono text-xs">{t.yes === 1 ? tr("wkVote1") : tr("wkVotes", { n: t.yes })}</span>}
            {most && <span className="mt-3 block font-mono text-[11px] leading-[1.5] text-muted">{tr("wkMost")}</span>}
          </div>
        </motion.a>
      </div>
    </section>
  );
}
