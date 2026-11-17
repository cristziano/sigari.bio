"use client";
// "Già su 18kbio": real public profiles (the most visited ones) and the real number of profiles.
// Read straight from Firestore, like the explore page. If nothing can be read, the section hides itself.
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { firebase } from "@/lib/site";
import { useT } from "@/lib/i18n";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Pro = { handle: string; name: string; avatar: string; banner: string; views: number; accent: string };

let topP: Promise<{ list: Pro[]; count: number | null }> | null = null;
/** The most visited public profiles with a photo, plus how many profiles exist (shared with the Weekly section) */
export function topProfiles() {
  topP ??= firebase().then(async ({ db, fs }) => {
    const snap = await fs.getDocs(fs.query(fs.collection(db, "profiles"), fs.orderBy("views", "desc"), fs.limit(24)));
    const list: Pro[] = snap.docs.map((d: any) => {
      const p = d.data() || {};
      const bg = p.appearance?.bg || {};
      return { handle: d.id, name: String(p.displayName || d.id).slice(0, 40), avatar: p.avatarUrl || "", banner: p.banner || bg.poster || (bg.type === "image" ? bg.image || "" : ""),
        views: Number(p.views) || 0, accent: p.appearance?.colors?.accent || "" };
    }).filter((p: Pro) => p.avatar && !p.handle.startsWith("_")).slice(0, 8);
    let count: number | null = null;
    try { count = (await fs.getCountFromServer(fs.collection(db, "profiles"))).data().count; } catch { count = null; }
    return { list, count };
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

  // a quiet strip, not a showcase: small faces, the count, a link to explore
  return (
    <section aria-label={t("proofTitle")} className="px-4 py-10 sm:px-[clamp(16px,6vw,96px)]">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: .8 }}
        className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[13px] text-muted opacity-70 transition-opacity hover:opacity-100">
        <span className="flex -space-x-2">
          {data.list.map(p => (
            <a key={p.handle} href={"/" + p.handle} title={"@" + p.handle} aria-label={"@" + p.handle}
              className="size-8 rounded-full border-2 border-black bg-[#1c1c1c] bg-cover bg-center grayscale transition-[filter,transform] duration-200 hover:z-10 hover:-translate-y-0.5 hover:grayscale-0"
              style={{ backgroundImage: url(p.avatar) }} />
          ))}
        </span>
        <span>{data.count ? t("proofCount", { n: fmt(data.count) }) : t("proofTitle")}</span>
        <a href="/esplora" className="underline-offset-4 transition-colors hover:text-white hover:underline">{t("proofAll")} →</a>
      </motion.div>
    </section>
  );
}
