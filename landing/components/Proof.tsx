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
  // no grey placeholders while loading (site rule): the section appears when the profiles arrive
  if (!data || !data.list.length) return null;
  const fmt = (n: number) => n.toLocaleString(lang === "it" ? "it-IT" : "en-US");

  return (
    <section aria-label={t("proofTitle")} className="border-y border-line px-4 py-14 sm:px-[clamp(16px,6vw,96px)]">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[clamp(28px,3.4vw,44px)] font-bold leading-[1.05] tracking-[-.04em]">{t("proofTitle")} <span className="text-quiet">{t("proofGrey")}</span></h2>
          <div className="flex items-center gap-4">
            {data.count ? <span className="flex items-center gap-2 font-mono text-xs text-muted"><i aria-hidden className="size-1.5 rounded-full bg-[#3ddc84]" />{t("proofCount", { n: fmt(data.count) })}</span> : null}
            <a href="/esplora" className="btn-2">{t("proofAll")} →</a>
          </div>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {data.list.map((p, i) => (
            <motion.li key={p.handle} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: .5, delay: (i % 4) * .06, ease: [0.23, 1, 0.32, 1] }}>
              <a href={"/" + p.handle} className="group block overflow-hidden rounded-[14px] border border-line bg-s1 transition-[border-color,transform] duration-200 hover:-translate-y-1 hover:border-line-2"
                  style={p.accent && p.accent.toLowerCase() !== "#ffffff" ? { ["--acc" as string]: p.accent } : undefined}>
                  <div className="h-[72px] bg-s2 bg-cover bg-center opacity-80 transition-opacity group-hover:opacity-100" style={p.banner ? { backgroundImage: url(p.banner) } : undefined} />
                  <div className="px-3.5 pb-3.5">
                    <div className="-mt-6 size-12 rounded-full border-[3px] border-s1 bg-[#1c1c1c] bg-cover bg-center" style={{ backgroundImage: url(p.avatar) }} />
                    <b className="mt-2 block truncate text-sm">{p.name}</b>
                    <span className="flex items-center justify-between gap-2 font-mono text-[11px] text-muted">
                      <span className="truncate">/{p.handle}</span><span className="shrink-0 tabnum">{fmt(p.views)} {t("proofViews")}</span>
                    </span>
                  </div>
                </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
