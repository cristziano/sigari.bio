# sigari.bio — catalogo completo delle feature

Ricerca fatta il 2026-10-29 su guns.lol, feds.lol, haunt.gg, fakecrime.bio, e-z.bio, lnk.bio, Linktree, Beacons, bio.link e Carrd.
Stato aggiornato il 2026-10-30, dopo il secondo giro di feature, controllato sul codice, nel browser e con Firebase simulato (regole e login veri):

- **FUNZIONA** (57): c'è ed è stata provata.
- **DA ATTIVARE** (31): c'è, ma serve un passaggio (scritto nella nota) oppure qui non si poteva provare.
- **MANCA** (11): da costruire.

La landing mostra solo le feature principali; la lista completa sta qui.

## 1. Identità e @
| Feature | Stato | Nota | Chi ce l'ha |
|---|---|---|---|
| Prendi la tua @ (sigari.bio/@nome) | FUNZIONA |  | tutti |
| Controllo dal vivo se il nome è libero | FUNZIONA |  | guns, feds |
| Rarità del nome (3 / 4 / 5 / 6+ lettere) | FUNZIONA | solo sulla landing | haunt |
| Una @ per account, bloccata | FUNZIONA |  | — |
| Badge dello staff (beta, prima ora, verificato, partner, vincitore) | DA ATTIVARE | regole Firebase; si assegnano dalla console | guns |
| Nomi extra: fino a 3 @ che portano a te | DA ATTIVARE | regole Firebase (provata con Firebase simulato) | guns |
| Dominio personale | MANCA |  | haunt, lnk.bio, Carrd |
| Badge personalizzato (14 icone, nome, colore) | FUNZIONA |  | guns |
| Colore e forma dei badge | FUNZIONA |  | guns |
| Mercato dei nomi rari | MANCA |  | haunt |
| Domini dei partner (sigari.gin/@nome, tuoserver.gg/nome) | MANCA | c'è solo la presentazione sulla landing | idea sigari.bio |
| Condividi: un link per ogni social, QR code personalizzabile, anteprima Discord | FUNZIONA |  | idea sigari.bio |
| Preset del link con il dominio dei partner | MANCA | serve configurare i domini | idea sigari.bio |

## 2. Contenuto del profilo
| Feature | Stato | Nota | Chi ce l'ha |
|---|---|---|---|
| Nome, bio, posizione, tag | FUNZIONA |  | tutti |
| Link | FUNZIONA |  | tutti |
| Link nascosti senza cancellarli, riordino | FUNZIONA |  | guns |
| 38 social, più email e sito | FUNZIONA |  | fakecrime (100+), lnk.bio |
| Bio con effetto macchina da scrivere | FUNZIONA |  | guns |
| Avatar caricato | DA ATTIVARE | per gli account serve Storage attivo | tutti |
| Sfondo immagine o video | FUNZIONA | il caricamento dei file per gli account serve Storage; il link funziona sempre | guns, feds |
| Video e musica incorporati (Spotify, YouTube, SoundCloud) | DA ATTIVARE | non provabile qui: i player sono bloccati | lnk.bio |
| Banner immagine / GIF / video | FUNZIONA | il caricamento per gli account serve Storage | fakecrime |
| Bio formattata: grassetto, corsivo, spoiler, glow, arcobaleno, colori, link | FUNZIONA |  | feds, fakecrime |
| Sezioni di link (titoli) | FUNZIONA |  | lnk.bio, Linktree |
| Link in evidenza (si muove e brilla) | FUNZIONA |  | Linktree |
| Link programmati (visibile dal / fino al) | FUNZIONA |  | lnk.bio |
| Link con password (il link vero è cifrato) | FUNZIONA |  | lnk.bio |
| Modulo contatti, messaggi nella dashboard | DA ATTIVARE | regole Firebase (provata con Firebase simulato) | lnk.bio, Carrd |
| Newsletter: iscritti, copia email, CSV | DA ATTIVARE | regole Firebase (provata con Firebase simulato) | Beacons, bio.link |
| Più profili per account | MANCA |  | haunt |

## 3. Aspetto
| Feature | Stato | Nota | Chi ce l'ha |
|---|---|---|---|
| Colori liberi (7 colori) e palette rapide | FUNZIONA |  | guns, feds |
| Sfondo: colore, gradiente 2-4 colori, immagine, video, scurisci, sfoca | FUNZIONA |  | guns, feds |
| Opacità, sfocatura e bordo della card | FUNZIONA |  | guns |
| Glow su nome, social, badge, link | FUNZIONA |  | guns, fakecrime |
| Stile bottoni (variante, forma, ombra, hover, icone) | FUNZIONA |  | feds |
| 11 effetti di sfondo con colore e intensità | FUNZIONA | lava, aurora, neve, pioggia, stelle, costellazione, cuori, matrix, grana, scanline, dither | guns, feds |
| Cursore normale, mirino o personalizzato | FUNZIONA |  | guns, feds |
| Scia del cursore (punti, scintille, fantasma) | FUNZIONA |  | guns, feds |
| Effetti sul nome (glow, gradiente, arcobaleno, glitch, scintille, macchina da scrivere, shuffle, contorno) | FUNZIONA |  | guns |
| 20 font per nome e testo | FUNZIONA |  | guns, feds |
| 5 layout (classico, a sinistra, banner, minimal, terminale) | FUNZIONA |  | guns, feds |
| Animazione d'ingresso del profilo (pixel, glitch, pop…) | FUNZIONA |  | feds |
| Schermata "clicca per entrare" | FUNZIONA |  | guns |
| Template già pronti (14) | FUNZIONA |  | feds |
| Template della community | DA ATTIVARE | regole Firebase | feds |
| Effetto ASCII sul profilo | FUNZIONA |  | feds |
| Caricare un font proprio (TTF, OTF, WOFF) | FUNZIONA | per gli account serve Storage | guns, feds |
| Animazioni del testo: 19 sul nome, 6 sulla bio | FUNZIONA |  | feds |
| Decorazioni avatar (aureola, corna, orecchie, corona, fiamme…) | FUNZIONA |  | feds |
| Effetti sonori su link e social (6 suoni) | FUNZIONA |  | haunt |

## 4. Musica
| Feature | Stato | Nota | Chi ce l'ha |
|---|---|---|---|
| Musica: Spotify, SoundCloud, YouTube o mp3, con volume | DA ATTIVARE | l'mp3 caricato serve Storage; i player non provabili qui | feds, haunt, fakecrime |
| Parte dopo "clicca per entrare" | FUNZIONA |  | guns |
| Playlist fino a 20 brani, ordine casuale, ripeti | FUNZIONA |  | haunt |
| Testi sincronizzati (LRC), con ricerca su LRCLIB | FUNZIONA | la ricerca non è provabile qui | haunt |
| Copertina sfocata come sfondo del player | FUNZIONA |  | haunt |
| Visualizzatore audio (barre o onda) | FUNZIONA | segue la riproduzione, non legge lo spettro vero | feds |

## 5. Widget dal vivo
| Feature | Stato | Nota | Chi ce l'ha |
|---|---|---|---|
| Stato Discord (Lanyard) | DA ATTIVARE | l'utente entra una volta in discord.gg/lanyard; non provabile qui | fakecrime, haunt |
| Spotify "sto ascoltando" (via Discord) | DA ATTIVARE | come sopra | haunt |
| Last.fm | DA ATTIVARE | serve la API key di Last.fm | haunt |
| Statistiche GitHub | DA ATTIVARE | non provabile qui | haunt |
| Orologio con fuso orario | FUNZIONA |  | guns |
| Rank Valorant | MANCA |  | haunt |
| Live Twitch e ultimi video di YouTube | DA ATTIVARE | non provabile qui: i player sono bloccati | guns |
| Telegram, Roblox, Steam come icone social | FUNZIONA |  | guns |

## 6. Community
| Feature | Stato | Nota | Chi ce l'ha |
|---|---|---|---|
| Topic della settimana | DA ATTIVARE | regole Firebase (per vedere le risposte sulla landing) | idea sigari.bio |
| Pubblicare template: pubblici, non in elenco, privati; usarne solo una parte | DA ATTIVARE | regole Firebase | guns |
| Classifica profili per visite | DA ATTIVARE | regole Firebase; finché non ci sono 3 profili mostra un esempio | guns |
| Contatore visite pubblico | DA ATTIVARE | regole Firebase | guns, lnk.bio |
| Statistiche: visite, clic, social, ascolti, tempo, grafico 7/30 giorni | DA ATTIVARE | regole Firebase (provata con Firebase simulato) | idea sigari.bio |
| Feed delle interazioni in diretta | DA ATTIVARE | regole Firebase (provata con Firebase simulato) | idea sigari.bio |
| Clan con TAG riservata e pagina del clan | DA ATTIVARE | regole Firebase (provata con Firebase simulato) | idea sigari.bio |
| Fino a 3 clan per profilo, 1 principale | DA ATTIVARE | regole Firebase | idea sigari.bio |
| Classifica dei clan | DA ATTIVARE | regole Firebase | fakecrime |
| Guestbook (firme di chi ha un account) | DA ATTIVARE | regole Firebase (provata con Firebase simulato) | feds |
| Esplora profili: nuovi, più visti, cerca una @ | DA ATTIVARE | regole Firebase | fakecrime |
| Regala il premium | MANCA |  | guns |
| Codice affiliato | MANCA |  | haunt |
| Ruolo sul server Discord | MANCA |  | guns |

## 7. Pagina pubblica e statistiche
| Feature | Stato | Nota | Chi ce l'ha |
|---|---|---|---|
| Anteprima dal vivo mentre modifichi (desktop e telefono) | FUNZIONA |  | feds |
| Pagina pubblica sigari.bio/@nome | DA ATTIVARE | regole Firebase | tutti |
| Se il nome è libero la pagina dice "è libera, prendila" | FUNZIONA |  | idea sigari.bio |
| Profilo privato o fuori dalla classifica | FUNZIONA |  | guns |
| Nascondi visite e badge | FUNZIONA |  | guns |
| Titolo della scheda (anche animato) e favicon | FUNZIONA |  | guns, lnk.bio |
| Anteprima del link su Discord / WhatsApp con titolo, foto e colore | DA ATTIVARE | regole Firebase; la fa una funzione su Vercel | guns |
| Clic sui link e sui social | DA ATTIVARE | regole Firebase | tutti |
| Provenienza, dispositivi, zone (dal fuso orario) | DA ATTIVARE | regole Firebase | Linktree, lnk.bio |
| QR code (quadrati, punti, arrotondato, colori, @ al centro) | FUNZIONA |  | Linktree, bio.link |
| Link tracciati per ogni social (UTM) | FUNZIONA |  | lnk.bio |

## 8. Hosting file
| Feature | Stato | Nota | Chi ce l'ha |
|---|---|---|---|
| Image host: carichi e hai subito il link diretto | DA ATTIVARE | serve Storage attivo | guns, fakecrime |
| Dominio personale per gli upload | MANCA |  | guns |
| Galleria sul profilo (griglia, scorrevole, polaroid) | FUNZIONA |  | guns |
| Text paste con link | DA ATTIVARE | regole Firebase (provata con Firebase simulato) | guns |

## 9. Account
| Feature | Stato | Nota | Chi ce l'ha |
|---|---|---|---|
| Accesso con Google | FUNZIONA | serve il dominio .vercel.app tra i domini autorizzati | — |
| Email e password | FUNZIONA |  | — |
| Dashboard senza account, profilo portato nell'account alla registrazione | FUNZIONA |  | idea sigari.bio |
| Dashboard chiara / scura | FUNZIONA |  | — |
| Accesso con Discord | DA ATTIVARE | il codice c'è ma è spento: va configurato in Firebase | guns, feds |
| Premium a vita, paghi una volta | MANCA |  | guns, feds, haunt |

## Idee che i concorrenti NON hanno (vantaggio di sigari.bio)
- **Moods**: la stessa estetica bianco e nero in tre texture (fumo, dither, ASCII), scelta dal visitatore. Sulla landing.
- **Anteprima del link prima di registrarti**: scrivi la @ e vedi come appare su Discord, Instagram e TikTok. Sulla landing.
- **Rarità visibile del nome**: sulla landing; da portare sul profilo come badge.
- **Link con password cifrato**: gli altri siti nascondono il link solo nella pagina; qui nel database c'è solo la versione cifrata.
- **Clan con TAG riservata**: fatti. **Partner con dominio proprio**: da costruire (serve configurare i domini).
- **Prova senza account**: la dashboard funziona da ospite e il profilo passa nell'account alla registrazione.
- **Topic della settimana** con badge per chi vince.
