"use client";
// Italian and English. The language comes from the browser (Italian for Italian browsers, English otherwise)
// (?lang=it or ?lang=en forces one).
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "it" | "en";
type Pair = [string, string];
type Item = [string, string];

const D = {
  skip: ["Vai al contenuto", "Skip to content"],
  navFeatures: ["funzioni", "features"], navStats: ["statistiche", "stats"], navPlans: ["piani", "plans"],
  explore: ["esplora", "explore"], login: ["accedi", "log in"], claimNav: ["Prendi la tua @", "Claim your @"], dashboard: ["Dashboard", "Dashboard"],
  h1a: ["Prendi la tua @", "Claim your @"], h1b: ["su", "on"],
  heroDesc: ["Link, social, musica e il tuo stile su un solo indirizzo: 18kbio.xyz/iltuonome. Gratis, senza limiti.", "Links, socials, music and your own style on one address: 18kbio.xyz/yourname. Free, no limits."],
  exploreBtn: ["Esplora i profili", "Browse profiles"],
  claimLabel: ["Scegli la tua @", "Pick your @"], placeholder: ["iltuonome", "yourname"], take: ["Prendila", "Claim it"],
  stHint: ["da 1 a 20 tra lettere, numeri o _", "1 to 20 letters, numbers or _"], stWait: ["controllo…", "checking…"],
  stFree: ["@{h} è libera", "@{h} is free"], stTaken: ["@{h} è già presa", "@{h} is taken"], stReserved: ["@{h} è riservata", "@{h} is reserved"],
  stOffline: ["non riesco a controllare ora, lo vediamo all'iscrizione", "can't check right now, we'll see at sign up"], stEmpty: ["prima scrivi la @ che vuoi", "first type the @ you want"],
  rarityTitle: ["Più è corta, più è rara", "The shorter, the rarer"],
  rarity: [["leggendaria", "epica", "rara", "classica"].join("|"), ["legendary", "epic", "rare", "classic"].join("|")],
  proofTitle: ["Già su 18kbio.", "Already on 18kbio."], proofGrey: ["Profili veri, adesso.", "Real profiles, right now."],
  proofCount: ["{n} profili creati", "{n} profiles created"], proofViews: ["visite", "views"], proofAll: ["Vedi tutti i profili", "See every profile"],
  demoT1: ["Lo cambi come vuoi.", "Change it your way."], demoT2: ["Lo vedi subito.", "See it right away."],
  demoSteps: [["Colori|Ogni colore del profilo è tuo: testo, bottoni, bordi.", "Sfondo|Una foto, una GIF o un video dietro al profilo.", "Font ed effetti|20 font e gli effetti sul nome.", "Social|Discord, Instagram, TikTok, Spotify e tutti gli altri."].join("\n"),
    ["Colours|Every colour is yours: text, buttons, borders.", "Background|A photo, a GIF or a video behind your profile.", "Fonts and effects|20 fonts and effects on your name.", "Socials|Discord, Instagram, TikTok, Spotify and all the rest."].join("\n")],
  demoBio: ["nero, bianco e senza filtri", "black, white and no filters"],
  demoTry: ["Prova a modificarlo tu", "Try editing it yourself"],
  statsT1: ["Ogni visita conta.", "Every visit counts."], statsT2: ["Davvero.", "Really."],
  statsSub: ["Un contatore pubblico sulla tua pagina e, nella dashboard, ogni giorno in un colpo d'occhio: visite, clic, ascolti. Passa il mouse sui punti.",
    "A public counter on your page and, in your dashboard, every day at a glance: visits, clicks, plays. Hover the dots."],
  statsTabs: ["visite|clic|ascolti", "visits|clicks|plays"],
  statsSample: ["dati di esempio · ultimi 30 giorni", "sample data · last 30 days"], statsGroup: ["Cosa mostrare", "What to show"],
  statsChart: ["Grafico a punti degli ultimi 30 giorni", "Dot chart of the last 30 days"],
  statsAgo: ["30 giorni fa", "30 days ago"], statsToday: ["oggi", "today"],
  wkTitle: ["Il profilo della settimana", "Profile of the week"],
  wkSub: ["Il più votato sul nostro Discord. Condividi il tuo con /condividi nel canale profili: ogni settimana il vincitore finisce qui.", "The most voted on our Discord. Share yours with /condividi in the profiles channel: every week the winner lands here."],
  wkBtn: ["Entra nel Discord", "Join the Discord"], wkVotes: ["✅ {n} voti questa settimana", "✅ {n} votes this week"], wkVote1: ["✅ 1 voto questa settimana", "✅ 1 vote this week"],
  wkMost: ["Il più visto adesso: il vincitore della settimana arriva dai voti su Discord", "Most viewed right now: the weekly winner comes from Discord votes"],
  wkOpen: ["Apri il profilo di @{h}", "Open @{h}'s profile"],
  plansT: ["Piani", "Plans"],
  plansBig1: ["Gratis.", "Free."], plansBig2: ["Tutto.", "All of it."],
  plansLead: ["Tutto quello che 18kbio sa fare oggi è gratis, per sempre. Niente carta di credito, niente prova che scade.", "Everything 18kbio can do today is free, forever. No credit card, no trial that runs out."],
  freeList: [[
    "La tua @|Un indirizzo corto e tuo: 18kbio.xyz/iltuonome.", "Il tuo stile|Colori, sfondi, font ed effetti come vuoi tu.",
    "Link, social e musica|Tutto quello che fai, in una pagina sola.", "Widget e statistiche|Mostra cosa fai e guarda chi ti visita.",
    "La tua carta|Una carta da condividere con la tua @ sopra."].join("\n"), [
    "Your @|A short address of your own: 18kbio.xyz/yourname.", "Your style|Colours, backgrounds, fonts and effects your way.",
    "Links, socials and music|Everything you do, on one page.", "Widgets and stats|Show what you're up to and see who visits.",
    "Your card|A card to share, with your @ on it."].join("\n")],
  proLine: ["Premium arriverà più avanti, solo con cose nuove: niente di quello che è gratis diventerà a pagamento.", "Premium will come later, with new things only: nothing free today will become paid."],
  finalT: ["Scrivila qui. È tua prima che te la prendano.", "Type it here. It's yours before someone else takes it."],
  rights: ["Fatto da 18k, tutti i diritti riservati.", "Made by 18k, all rights reserved."], privacy: ["Privacy", "Privacy"], terms: ["Termini", "Terms"],
  footClaim: ["prendila", "claim it"], footNav: ["Piè di pagina", "Footer"], sections: ["Sezioni", "Sections"],
  bye: ["Account eliminato. Ci dispiace vederti andare: la tua @ adesso è libera.", "Account deleted. Sorry to see you go: your @ is free again."],
} satisfies Record<string, Pair | Item>;

export type Key = keyof typeof D;
type Ctx = { lang: Lang; t: (k: Key, vars?: Record<string, string | number>) => string; list: (k: Key, sep?: string) => string[] };
const LangCtx = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("it");
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("lang");
    const pick = (q === "en" || q === "it" ? q : navigator.language.toLowerCase().startsWith("it") ? "it" : "en") as Lang;
    setLangState(pick);
  }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const i = lang === "it" ? 0 : 1;
  const t: Ctx["t"] = (k, vars) => {
    let s = (D[k] as readonly string[])[i];
    if (vars) for (const [a, b] of Object.entries(vars)) s = s.replaceAll(`{${a}}`, String(b));
    return s;
  };
  const list: Ctx["list"] = (k, sep = "|") => t(k).split(sep);
  return <LangCtx.Provider value={{ lang, t, list }}>{children}</LangCtx.Provider>;
}

export function useT() {
  const c = useContext(LangCtx);
  if (!c) throw new Error("useT outside LangProvider");
  return c;
}
