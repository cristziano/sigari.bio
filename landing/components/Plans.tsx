"use client";
import { motion } from "motion/react";
import { focusClaim } from "@/lib/handle";

const FREE: [string, string][] = [
  ["La tua @ su 18kbio.xyz", "Un indirizzo corto e tuo, più gli alias per i nomi vecchi."],
  ["Sfondo come vuoi", "Colori, gradienti, foto, GIF o video fino a 40 MB."],
  ["13 effetti, 20 font, 5 layout", "Animazioni del testo, cursore personalizzato e il tuo font caricato."],
  ["Link e social senza limiti", "Sezioni, link programmati e link con password."],
  ["Musica sul profilo", "Playlist, testi sincronizzati e quello che ascolti su Last.fm."],
  ["Widget", "Discord, Twitch, YouTube e altri, con la grafica che scegli tu."],
  ["La tua carta", "Una carta da condividere, con 10 animazioni di apertura."],
  ["Statistiche vere", "Visite, clic, da dove arrivano e da che dispositivo, più QR e link tracciati."],
  ["Template e community", "Tanti stili pronti da usare, clan, guestbook ed esplora."],
  ["Prova senza account", "Costruisci tutto prima di registrarti: lo salvi quando ti piace."],
];
const PRO: [string, string][] = [
  ["Tutto quello del piano Gratis", "Niente di quello che hai oggi diventa a pagamento."],
  ["Effetti e font esclusivi", "Animazioni e caratteri che nel piano Gratis non ci sono."],
  ["Decorazioni e badge esclusivi", "Cornici per la foto profilo e badge che si notano."],
  ["Statistiche complete", "Più storico e più dettagli su chi visita e cosa clicca."],
  ["Il tuo dominio", "Il profilo anche su un indirizzo tutto tuo."],
  ["Caricamenti più grandi", "Più spazio per video, foto e musica."],
  ["Novità in anteprima", "Le funzioni nuove arrivano prima a te."],
  ["Supporto prioritario", "Le tue richieste su Discord passano davanti."],
];

function List({ items }: { items: [string, string][] }) {
  return (
    <ul className="mt-5 grid gap-x-6 gap-y-3.5 border-t border-line pt-5 sm:grid-cols-2">
      {items.map(([b, s], i) => (
        <motion.li key={b} className="flex gap-3" initial={{ opacity: 0, x: -6 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          transition={{ duration: .4, delay: i * .04, ease: [0.23, 1, 0.32, 1] }}>
          <svg viewBox="0 0 16 16" aria-hidden className="mt-0.5 size-4 shrink-0 fill-none stroke-[#bdbdbd] [stroke-width:1.6]"><path d="M3.5 8.5l3 3 6-7" /></svg>
          <span><b className="block text-sm font-medium">{b}</b><small className="mt-1 block text-[12.5px] leading-[1.45] text-muted">{s}</small></span>
        </motion.li>
      ))}
    </ul>
  );
}

export default function Plans() {
  return (
    <section id="plans" aria-label="Piani" className="px-4 py-24 sm:px-[clamp(16px,6vw,96px)]">
      <div className="mx-auto max-w-[1120px]">
        <h2 className="text-center text-[clamp(36px,5vw,56px)] font-bold tracking-[-.045em]">Piani</h2>
        <p className="mx-auto mt-3 max-w-[64ch] text-center leading-[1.55] text-muted">Il piano Gratis ha già tutto per una pagina completa e resta gratis per sempre. Premium arriverà presto per chi vuole qualcosa in più: chi è già iscritto lo saprà per primo.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-[18px] border border-line bg-s1 p-6">
            <b className="text-lg">Gratis</b>
            <p className="mt-2 text-sm leading-[1.5] text-muted">Tutto quello che serve per una pagina che parla di te: stile, musica, link e statistiche. Niente carta di credito, niente prova che scade.</p>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[40px] font-extrabold tracking-[-.04em]">0€ <small className="text-sm font-normal tracking-normal text-muted">/ per sempre</small></div>
              <a href="#top" onClick={e => { e.preventDefault(); focusClaim(); }} className="btn-2 min-w-[200px]">Prendi la tua @</a>
            </div>
            <List items={FREE} />
          </div>
          <div className="rounded-[18px] border border-line-2 p-6">
            <div className="flex items-center justify-between"><b className="text-lg">Premium</b><span className="rounded-md bg-white px-2 py-1 text-[11px] font-semibold text-black">In arrivo</span></div>
            <p className="mt-2 text-sm leading-[1.5] text-muted">Per chi vuole un profilo che non ha nessun altro: più effetti, più dettagli, più spazio. Il prezzo lo diciamo appena è pronto.</p>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[40px] font-extrabold tracking-[-.04em]">Soon</div>
              <span aria-disabled className="btn min-w-[200px] cursor-default">Presto disponibile</span>
            </div>
            <List items={PRO} />
          </div>
        </div>
      </div>
    </section>
  );
}
