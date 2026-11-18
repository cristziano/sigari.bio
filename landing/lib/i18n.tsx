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
  heroDesc: ["Link, social, musica e il tuo stile su un solo indirizzo: 18kbio.xyz/iltuonome. Gratis, per sempre.", "Links, socials, music and your own style on one address: 18kbio.xyz/yourname. Free, forever."],
  exploreBtn: ["Esplora i profili", "Browse profiles"],
  claimLabel: ["Scegli la tua @", "Pick your @"], placeholder: ["iltuonome", "yourname"], take: ["Prendila", "Claim it"],
  stHint: ["da 1 a 20 tra lettere, numeri o _", "1 to 20 letters, numbers or _"], stWait: ["controllo…", "checking…"],
  stFree: ["@{h} è libera", "@{h} is free"], stTaken: ["@{h} è già presa", "@{h} is taken"], stReserved: ["@{h} è riservata", "@{h} is reserved"],
  stOffline: ["non riesco a controllare ora, lo vediamo all'iscrizione", "can't check right now, we'll see at sign up"], stEmpty: ["prima scrivi la @ che vuoi", "first type the @ you want"],
  rarityTitle: ["Più è corta, più è rara", "The shorter, the rarer"],
  rarity: [["leggendaria", "epica", "rara", "classica"].join("|"), ["legendary", "epic", "rare", "classic"].join("|")],
  proofTitle: ["Già su 18kbio.", "Already on 18kbio."], proofGrey: ["Profili veri, adesso.", "Real profiles, right now."],
  showTitle: ["Profili veri", "Real profiles"],
  proofCount: ["{n} profili creati", "{n} profiles created"], proofViews: ["visite", "views"], proofAll: ["Vedi tutti i profili", "See every profile"],
  cardsT1: ["LA TUA", "YOUR"], cardsT2: ["CARTA", "CARD"], cardsQ: ["Cos'è la carta?", "What is the card?"],
  cardsA: ["La cosa più tua di 18kbio: una carta d'identità con la tua @, la tua foto e i tuoi sticker. Sul profilo c'è il tasto \"mostra la mia carta\": chi lo preme la vede aprirsi. Bordo, sticker e apertura li scegli tu.",
    "The most personal thing on 18kbio: an ID card with your @, your photo and your stickers. Your profile gets a \"show my card\" button: whoever presses it watches it open. You pick the border, stickers and how it opens."],
  cardsSee: ["Questa è la carta di @1 ↗", "This is @1's card ↗"], cardsCta: ["CREA LA TUA", "MAKE YOURS"],
  howT1: ["Tre passi.", "Three steps."], howT2: ["Un minuto.", "One minute."],
  howChips: ["Gratis|Solo tuo|Pronto in un minuto", "Free|Only yours|Ready in a minute"],
  howRarity: ["rarità", "rarity"], howRarityWhy: ["più è corta, più è rara", "the shorter, the rarer"], howRarities: ["leggendaria|epica|rara|classica", "legendary|epic|rare|classic"],
  howFeats: ["Link|Musica|Statistiche|Carta|QR", "Links|Music|Stats|Card|QR"],
  howReal: ["profili veri su 18kbio", "real profiles on 18kbio"],
  howVisits: ["visite", "visits"],
  howFacts: [["da 1 a 20 caratteri|controllo in diretta|solo tua", "20 font|8 effetti sul nome|foto, GIF o video di sfondo", "un link solo|il tuo QR|statistiche di chi arriva"].join("\n"),
    ["1 to 20 characters|checked live|only yours", "20 fonts|8 name effects|photo, GIF or video background", "one single link|your QR|stats on who comes"].join("\n")],
  howState: ["stato", "status"], howFree: ["libera", "free"], howTaken: ["già presa", "taken"],
  howBio: ["La tua bio: due righe su chi sei e cosa fai.", "Your bio: two lines on who you are and what you do."],
  howLinks: ["Il tuo primo link|Un altro link", "Your first link|Another link"],
  howTry: ["prova a scriverla", "try typing it"], howLen: ["lunghezza", "length"], howNow: ["in ascolto", "now playing"], howNew: ["nuovo", "new"],
  howArtist: ["il tuo artista", "your artist"], howCardBtn: ["mostra la mia carta", "show my card"], howCopy: ["copia", "copy"], howCopied: ["copiato", "copied"],
  heroCard: ["E in più la tua carta ↓", "Plus your own card ↓"],
  howYou: ["il tuo profilo", "your profile"], howMusic: ["la tua musica", "your music"],
  howTypeTop: ["scrivi la tua @ in cima alla pagina", "type your @ at the top of the page"],
  howSteps: [["Prendi la tua @|Scegli il nome: 18kbio.xyz/iltuonome è tuo, nessun altro può averlo.", "Componi il profilo|Colori, sfondo, musica, link e la tua carta. Lo vedi cambiare mentre lo fai.", "Condividilo ovunque|Nella bio di TikTok e Instagram, nello stato di Discord o con il QR."].join("\n"),
    ["Claim your @|Pick the name: 18kbio.xyz/yourname is yours, nobody else can have it.", "Build your profile|Colours, background, music, links and your card. You watch it change as you go.", "Share it everywhere|In your TikTok and Instagram bio, your Discord status or with the QR."].join("\n")],
  demoT1: ["Lo cambi come vuoi.", "Change it your way."], demoT2: ["Lo vedi subito.", "See it right away."],
  demoSteps: [["Colori|Ogni colore del profilo è tuo: testo, bottoni, bordi.", "Sfondo|Una foto, una GIF o un video dietro al profilo.", "Font ed effetti|20 font e gli effetti sul nome.", "Social|Discord, Instagram, TikTok, Spotify e tutti gli altri."].join("\n"),
    ["Colours|Every colour is yours: text, buttons, borders.", "Background|A photo, a GIF or a video behind your profile.", "Fonts and effects|20 fonts and effects on your name.", "Socials|Discord, Instagram, TikTok, Spotify and all the rest."].join("\n")],
  demoNext: ["Avanti", "Next"],
  demoTry: ["Prova a modificarlo tu", "Try editing it yourself"],
  statsT1: ["Ogni visita conta.", "Every visit counts."], statsT2: ["Davvero.", "Really."],
  statsSub: ["Un contatore pubblico sulla tua pagina e, nella dashboard, ogni giorno in un colpo d'occhio: visite, clic, ascolti, da dove arrivano e da cosa. Qui sotto, un esempio.",
    "A public counter on your page and, in your dashboard, every day at a glance: visits, clicks, where they come from and on what. Below, an example."],
  statsMetrics: ["visite|clic|ascolti", "visits|clicks|plays"], statsTotal: ["totale degli ultimi 30 giorni", "total of the last 30 days"],
  statsFake: ["Nota: i numeri di questa sezione sono finti, solo un esempio. I tuoi veri li vedi nella dashboard.", "Note: the numbers in this section are fake, just an example. Your real ones are in your dashboard."],
  statsSample: ["esempio", "example"],
  statsKpis: ["visite|clic sui link|clic per visita|ascolti|tempo medio", "visits|link clicks|clicks per visit|plays|average time"],
  statsKpiSubs: ["ultimi 30 giorni|totali|quanti cliccano|musica avviata|sulla pagina", "last 30 days|total|who clicks|music started|on the page"],
  statsDevices: ["Dispositivi", "Devices"], devPhone: ["Telefono", "Phone"], devDesktop: ["Computer", "Computer"], devTablet: ["Tablet", "Tablet"],
  statsLive: ["Esempio di attività", "Example activity"],
  statsFeed: [["Nuova visita da TikTok, telefono", "Clic su «Ultima uscita»", "Nuova visita da Discord, computer", "Clic sul tuo Instagram", "Qualcuno ha fatto partire la tua musica", "Nuova visita, link diretto, telefono"].join("\n"),
    ["New visit from TikTok, phone", "Click on «New release»", "New visit from Discord, computer", "Click on your Instagram", "Someone started your music", "New visit, direct link, phone"].join("\n")],
  plansT: ["Gratis, per sempre.", "Free, forever."],
  plansLead: ["Tutto quello che 18kbio sa fare oggi è gratis. Premium porterà solo cose nuove: niente di quello che è gratis diventerà a pagamento.",
    "Everything 18kbio can do today is free. Premium will only bring new things: nothing free today will become paid."],
  freeName: ["Gratis", "Free"], freeSub: ["Tutto quello che serve per una pagina che parla di te: stile, musica, link e statistiche. Niente carta di credito, niente prova che scade.", "Everything you need for a page that is you: style, music, links and stats. No credit card, no trial that runs out."],
  forever: ["/ per sempre", "/ forever"],
  freeList: [[
    "La tua @|18kbio.xyz/iltuonome, da 1 a 20 caratteri. Più è corta, più è rara.", "20 font e 8 effetti sul nome|Più colori liberi per testo, bottoni e bordi.",
    "Sfondi foto, GIF e video|Immagini fino a 12 MB, video fino a 40 MB.", "Fino a 30 link e sezioni|Più i tuoi social e la tua musica.",
    "Statistiche|Visite, clic, ascolti e da dove arrivano.", "La tua carta|Con la tua @ sopra, da condividere."].join("\n"), [
    "Your @|18kbio.xyz/yourname, 1 to 20 characters. The shorter, the rarer.", "20 fonts and 8 name effects|Plus free colours for text, buttons and borders.",
    "Photo, GIF and video backgrounds|Images up to 12 MB, videos up to 40 MB.", "Up to 30 links and sections|Plus your socials and your music.",
    "Stats|Visits, clicks, plays and where they come from.", "Your card|With your @ on it, to share."].join("\n")],
  proName: ["Premium", "Premium"], proTag: ["In arrivo", "Coming"], proPrice: ["2,99 €/mese", "€2.99/month"],
  proSub: ["Per chi vuole un profilo che non ha nessun altro. Iscriviti: ti scriviamo quando esce, prima di tutti.", "For a profile nobody else has. Sign up: we'll write to you when it launches, before anyone else."],
  proBtn: ["Crea l'account gratis", "Create your free account"],
  proList: [["3 look salvati invece di 1", "Effetti e stili esclusivi", "Novità in anteprima"].join("\n"), ["3 saved looks instead of 1", "Exclusive effects and styles", "New things first"].join("\n")],
  rights: ["Fatto dal team di 18kbio, tutti i diritti riservati.", "Made by the 18kbio team, all rights reserved."], privacy: ["Privacy", "Privacy"], terms: ["Termini", "Terms"],
  footTag: ["Un nome, una pagina, tutto quello che fai.", "One name, one page, everything you do."], footProduct: ["Prodotto", "Product"], footCommunity: ["Community", "Community"], footLegal: ["Legale", "Legal"],
  footNav: ["Piè di pagina", "Footer"], sections: ["Sezioni", "Sections"],
  bye: ["Account eliminato. Ci dispiace vederti andare: la tua @ adesso è libera.", "Account deleted. Sorry to see you go: your @ is free again."],
} satisfies Record<string, Pair | Item>;

export type Key = keyof typeof D;
type Ctx = { lang: Lang; t: (k: Key, vars?: Record<string, string | number>) => string; list: (k: Key, sep?: string) => string[] };
const LangCtx = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("it");
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("lang");
    // Italian is the default; English only when the browser asks for English and Italian is not among its languages
    const langs = (navigator.languages?.length ? navigator.languages : [navigator.language]).map(l => l.toLowerCase());
    const auto = langs.some(l => l.startsWith("it")) ? "it" : langs[0]?.startsWith("en") ? "en" : "it";
    const pick = (q === "en" || q === "it" ? q : auto) as Lang;
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
