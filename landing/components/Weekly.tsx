"use client";
// Profile of the week: the most voted in the Discord "profili" channel (api/photos?profili=top).
import { useEffect, useState } from "react";
import { motion } from "motion/react";

type Top = { handle: string; name?: string; bio?: string; avatar?: string; banner?: string; accent?: string; yes: number };
const url = (u: string) => `url("${u.replace(/"/g, "%22")}")`;

export default function Weekly() {
  const [t, setT] = useState<Top | null>(null);
  useEffect(() => {
    fetch("/api/photos?profili=top").then(r => r.ok ? r.json() : null).then(j => setT(j?.top || null)).catch(() => {});
  }, []);
  const accent = t?.accent && t.accent.toLowerCase() !== "#ffffff" ? t.accent + "66" : undefined;

  return (
    <section id="weekly" aria-label="Profilo della settimana" className="px-4 py-24 sm:px-[clamp(16px,6vw,96px)]">
      <div className="mx-auto grid max-w-[1000px] items-center gap-10 md:grid-cols-[1fr_360px]">
        <div>
          <h2 className="text-[clamp(36px,5vw,56px)] font-bold leading-[1.02] tracking-[-.045em]">Il profilo della settimana</h2>
          <p className="mt-4 max-w-[48ch] leading-[1.55] text-muted">Il più votato sul nostro Discord. Condividi il tuo con <code className="font-mono text-white">/condividi</code> nel canale profili: ogni settimana il vincitore finisce qui.</p>
          <a className="btn-2 mt-6" href="https://discord.gg/18k" target="_blank" rel="noopener">Entra nel Discord</a>
        </div>
        <motion.a href={t ? "/" + t.handle : "https://discord.gg/18k"} target={t ? undefined : "_blank"} rel={t ? undefined : "noopener"}
          aria-label={t ? "Apri il profilo di @" + t.handle : "Condividi il tuo profilo sul Discord"}
          initial={{ opacity: 0, rotate: -3, y: 30 }} whileInView={{ opacity: 1, rotate: 0, y: 0 }} viewport={{ once: true, amount: .4 }}
          whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 120, damping: 16 }}
          className="block overflow-hidden rounded-[18px] border border-line-2 bg-s1" style={{ borderColor: accent }}>
          <div className="h-[110px] bg-s2 bg-cover bg-center" style={t?.banner ? { backgroundImage: url(t.banner) } : undefined} />
          <div className="relative px-[22px] pb-[22px]">
            <div className="-mt-9 grid size-[66px] place-items-center rounded-full border-4 border-s1 bg-[#1c1c1c] bg-cover bg-center text-2xl font-bold"
              style={t?.avatar ? { backgroundImage: url(t.avatar) } : undefined}>{t && !t.avatar ? (t.name || t.handle)[0].toUpperCase() : null}</div>
            <b className="mt-3 block text-lg tracking-[-.02em]">{t ? t.name || t.handle : "Ancora nessun vincitore"}</b>
            <span className="font-mono text-xs text-muted">{t ? "18kbio.xyz/" + t.handle : "sii il primo: /condividi"}</span>
            {t?.bio && <p className="mt-2 line-clamp-2 text-sm text-muted">{t.bio}</p>}
            {t && <span className="mt-3 block font-mono text-xs">✅ {t.yes} {t.yes === 1 ? "voto" : "voti"} questa settimana</span>}
          </div>
        </motion.a>
      </div>
    </section>
  );
}
