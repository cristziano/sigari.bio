# sigari.bio — catalogo completo delle feature

Ricerca fatta il 2026-10-29 su guns.lol, feds.lol, haunt.gg, fakecrime.bio, e-z.bio, lnk.bio, Linktree, Beacons, bio.link e Carrd.
Stato controllato il 2026-10-30 sul codice e con i test nel browser:

- **FUNZIONA** (35): c'è ed è stata provata.
- **DA ATTIVARE** (15): c'è, ma serve un passaggio (scritto nella nota) oppure qui non si poteva provare.
- **MANCA** (47): da costruire.

La landing mostra solo le feature principali; la lista completa sta qui.

## 1. Identità e @
| Feature | Stato | Nota | Chi ce l'ha |
|---|---|---|---|
| Prendi la tua @ (sigari.bio/@nome) | FUNZIONA |  | tutti |
| Controllo dal vivo se il nome è libero | FUNZIONA |  | guns, feds |
| Rarità del nome (3 / 4 / 5 / 6+ lettere) | FUNZIONA | solo sulla landing | haunt |
| Una @ per account, bloccata | FUNZIONA |  | — |
| Badge dello staff (beta, prima ora, verificato, partner, vincitore) | DA ATTIVARE | regole Firebase; si assegnano dalla console | guns |
| Alias (altri nomi che portano a te) | MANCA |  | guns |
| Dominio personale | MANCA |  | haunt, lnk.bio, Carrd |
| Badge personalizzato (icona + nome) | MANCA |  | guns |
| Colori dei badge | MANCA |  | guns |
| Mercato dei nomi rari | MANCA |  | haunt |
| Domini dei partner (sigari.gin/@nome, tuoserver.gg/nome) | MANCA | c'è solo la presentazione sulla landing | idea sigari.bio |
| Preset del link da condividere (dominio, formato, anteprima) | MANCA | c'è solo la demo sulla landing | idea sigari.bio |

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
| Banner immagine / GIF / video | MANCA |  | fakecrime |
| Bio con testo formattato (grassetto, glow) | MANCA |  | feds, fakecrime |
| Gruppi e sezioni di link | MANCA |  | lnk.bio, Linktree |
| Link programmati | MANCA |  | lnk.bio |
| Link con password | MANCA |  | lnk.bio |
| Modulo contatti | MANCA |  | lnk.bio, Carrd |
| Newsletter | MANCA |  | Beacons, bio.link |
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
| Effetto ASCII sul profilo | MANCA | c'è solo sulla landing | feds |
| Caricare un font proprio | MANCA |  | guns, feds |
| Animazioni del testo (feds ne ha 25) | MANCA |  | feds |
| Overlay e decorazioni avatar | MANCA |  | feds |
| Effetti sonori | MANCA |  | haunt |

## 4. Musica
| Feature | Stato | Nota | Chi ce l'ha |
|---|---|---|---|
| Musica: Spotify, SoundCloud, YouTube o mp3, con volume | DA ATTIVARE | l'mp3 caricato serve Storage; i player non provabili qui | feds, haunt, fakecrime |
| Parte dopo "clicca per entrare" | FUNZIONA |  | guns |
| Playlist, shuffle, loop | MANCA |  | haunt |
| Testi sincronizzati | MANCA |  | haunt |
| Copertina sfocata come sfondo del player | MANCA |  | haunt |
| Visualizzatore audio | MANCA |  | feds |

## 5. Widget dal vivo
| Feature | Stato | Nota | Chi ce l'ha |
|---|---|---|---|
| Stato Discord (Lanyard) | DA ATTIVARE | l'utente entra una volta in discord.gg/lanyard; non provabile qui | fakecrime, haunt |
| Spotify "sto ascoltando" (via Discord) | DA ATTIVARE | come sopra | haunt |
| Last.fm | DA ATTIVARE | serve la API key di Last.fm | haunt |
| Statistiche GitHub | DA ATTIVARE | non provabile qui | haunt |
| Orologio con fuso orario | FUNZIONA |  | guns |
| Rank Valorant | MANCA |  | haunt |
| Canale YouTube, live Twitch | MANCA |  | guns |
| Telegram, Roblox, Steam | MANCA |  | guns |

## 6. Community
| Feature | Stato | Nota | Chi ce l'ha |
|---|---|---|---|
| Topic della settimana | DA ATTIVARE | regole Firebase (per vedere le risposte sulla landing) | idea sigari.bio |
| Pubblicare template: pubblici, non in elenco, privati; usarne solo una parte | DA ATTIVARE | regole Firebase | guns |
| Classifica profili per visite | DA ATTIVARE | regole Firebase; finché non ci sono 3 profili mostra un esempio | guns |
| Contatore visite pubblico | DA ATTIVARE | regole Firebase | guns, lnk.bio |
| Statistiche di clic, social, ascolti, tempo sulla pagina | MANCA | sulla landing sono dati di esempio | idea sigari.bio |
| Feed delle interazioni in tempo reale | MANCA |  | idea sigari.bio |
| Clan con TAG riservata | MANCA | c'è solo la presentazione sulla landing | idea sigari.bio |
| Fino a 3 tag per profilo, 1 gruppo primario | MANCA |  | idea sigari.bio |
| Classifica dei clan | MANCA | sulla landing è un esempio | fakecrime |
| Commenti / guestbook | MANCA |  | feds |
| Esplora profili | MANCA |  | fakecrime |
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
| Anteprima del link su Discord / WhatsApp con la tua foto | MANCA | ora mostra quella generica del sito: serve una pagina generata dal server | guns |
| Clic sui link | MANCA |  | tutti |
| Provenienza, paesi, dispositivi | MANCA |  | Linktree, lnk.bio |
| QR code | MANCA |  | Linktree, bio.link |
| UTM | MANCA |  | lnk.bio |

## 8. Hosting file
| Feature | Stato | Nota | Chi ce l'ha |
|---|---|---|---|
| Image host | MANCA |  | guns, fakecrime |
| Dominio personale per gli upload | MANCA |  | guns |
| Galleria | MANCA |  | guns |
| Text paste | MANCA |  | guns |

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
- **Partner con dominio proprio** e **clan con TAG riservata**: presentati sulla landing, da costruire.
- **Prova senza account**: la dashboard funziona da ospite e il profilo passa nell'account alla registrazione.
- **Topic della settimana** con badge per chi vince.
