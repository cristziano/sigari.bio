"use client";
// "Già su 18kbio": real public profiles (the most visited ones) and the real number of profiles.
// Read straight from Firestore, like the explore page. If nothing can be read, the section hides itself.
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { firebase } from "@/lib/site";
import { useT } from "@/lib/i18n";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Pro = { handle: string; name: string; avatar: string; banner: string; views: number; accent: string; socials: string[] };

let topP: Promise<{ list: Pro[]; count: number | null; handles: string[] }> | null = null;
/** The most visited public profiles with a photo, plus how many profiles exist (shared with the Weekly section) */
export function topProfiles() {
  topP ??= firebase().then(async ({ db, fs }) => {
    const snap = await fs.getDocs(fs.query(fs.collection(db, "profiles"), fs.orderBy("views", "desc"), fs.limit(24)));
    const handles: string[] = snap.docs.map((d: any) => d.id).filter((h: string) => !h.startsWith("_"));
    const list: Pro[] = snap.docs.map((d: any) => {
      const p = d.data() || {};
      const bg = p.appearance?.bg || {};
      return { handle: d.id, name: String(p.displayName || d.id).slice(0, 40), avatar: p.avatarUrl || "", banner: p.banner || bg.poster || (bg.type === "image" ? bg.image || "" : ""),
        views: Number(p.views) || 0, accent: p.appearance?.colors?.accent || "", socials: Object.keys(p.socials || {}).filter(k => p.socials[k]) };
    }).filter((p: Pro) => p.avatar && !p.handle.startsWith("_")).slice(0, 8);
    let count: number | null = null;
    try { count = (await fs.getCountFromServer(fs.collection(db, "profiles"))).data().count; } catch { count = null; }
    return { list, count, handles };
  });
  topP.catch(() => { topP = null; });
  return topP;
}

const url = (u: string) => `url("${u.replace(/"/g, "%22")}")`;

export default function Proof() {
  const { t, lang } = useT();
  const [data, setData] = useState<{ list: Pro[]; count: number | null } | null>(null);
  useEffect(() => { topProfiles().then(setData).catch(() => setData({ list: [], count: null })); }, []);
  // no grey placeholders while loading (site rule): the strip appears when the profiles arrive
  if (!data || !data.list.length) return null;
  const fmt = (n: number) => n.toLocaleString(lang === "it" ? "it-IT" : "en-US");

  // one button: the faces of real profiles, how many there are, and the way to explore them
  return (
    <section aria-label={t("proofTitle")} className="flex justify-center px-4 py-12">
      <motion.a href="/esplora" whileHover={{ y: -2 }} whileTap={{ scale: .97 }}
        className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.02))] py-2 pl-2 pr-5 shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_14px_40px_-18px_rgba(0,0,0,.9)] transition-colors hover:border-white/35">
        {/* a light that slides across on hover */}
        <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-[left,opacity] duration-700 group-hover:left-[110%] group-hover:opacity-100" />
        <span className="flex -space-x-2.5">
          {data.list.slice(0, 6).map((p, i) => (
            <span key={p.handle} className={`size-10 rounded-full border-2 border-[#0b0b0b] ${i > 3 ? "max-sm:hidden" : ""} bg-[#1c1c1c] bg-cover bg-center grayscale transition-[filter] duration-300 group-hover:grayscale-0`}
              style={{ backgroundImage: url(p.avatar) }} />
          ))}
        </span>
        <span className="text-left leading-tight">
          <b className="block whitespace-nowrap text-[15px] font-semibold">{data.count ? t("proofCount", { n: data.count >= 10 ? fmt(Math.floor(data.count / 10) * 10) + "+" : fmt(data.count) }) : t("proofTitle")}</b>
          <span className="whitespace-nowrap text-[13px] text-muted transition-colors group-hover:text-white">{t("proofAll")}</span>
        </span>
        <span aria-hidden className="ml-1 grid size-9 place-items-center rounded-full bg-white text-black transition-transform duration-300 group-hover:translate-x-1">→</span>
      </motion.a>
    </section>
  );
}
