# 18k.bio — catalogo completo delle feature

Stato aggiornato il 2026-10-30, dopo il secondo giro di feature, controllato sul codice, nel browser e con Firebase simulato (regole e login veri):

- **FUNZIONA** (57): c'è ed è stata provata.
- **SOSPESO**: tutto quello che dipende dal dominio: il nome è 18k.bio, manca comprarlo e collegarlo (vedi README, "Dominio e prefissi").
- **DA ATTIVARE** (31): c'è, ma serve un passaggio (scritto nella nota) oppure qui non si poteva provare.
- **MANCA** (11): da costruire.

La landing mostra solo le feature principali; la lista completa sta qui.

## 1. Identità e @
| Feature | Stato | Nota |
|---|---|---|
| Prendi la tua @ (18kbio.xyz/nome) | FUNZIONA |  |
| Controllo dal vivo se il nome è libero | FUNZIONA |  |
| Rarità del nome (3 / 4 / 5 / 6+ lettere) | FUNZIONA | solo sulla landing |
| Una @ per account, bloccata | FUNZIONA |  |
| Badge dello staff (beta, prima ora, verificato, partner, vincitore) | DA ATTIVARE | regole Firebase; si assegnano dalla console |
| Nomi extra: fino a 3 @ che portano a te | DA ATTIVARE | regole Firebase (provata con Firebase simulato) |
| Dominio personale | SOSPESO | sarà sempre prefisso/nome (18kbio.xyz/nome o un prefisso 18k): manca collegare i domini |  |
| Badge personalizzato (14 icone, nome, colore) | FUNZIONA |  |
| Colore e forma dei badge | FUNZIONA |  |
| Mercato dei nomi rari | MANCA |  |
| Prefissi 18k (18k.gin, 18k.gg, 18k.lol, 18k.wtf, 18k.rip, 18k.fm, 18k.vip, 18k.ink, 18k.cc, 18kt.bio, x18k.bio) + /nome | SOSPESO | c'è la presentazione sulla landing, mancano i domini |
| Condividi: un link per ogni social, QR code personalizzabile, anteprima Discord | FUNZIONA |  |
| Preset del link con il dominio dei partner | SOSPESO | serve configurare i domini |

## 2. Contenuto del profilo
| Feature | Stato | Nota |
|---|---|---|
| Nome, bio, posizione, tag | FUNZIONA |  |
| Link | FUNZIONA |  |
| Link nascosti senza cancellarli, riordino | FUNZIONA |  |
| 38 social, più email e sito | FUNZIONA |  |
| Bio con effetto macchina da scrivere | FUNZIONA |  |
| Avatar caricato | DA ATTIVARE | per gli account serve Storage attivo |
| Sfondo immagine o video | FUNZIONA | il caricamento dei file per gli account serve Storage; il link funziona sempre |
| Video e musica incorporati (Spotify, YouTube, SoundCloud) | DA ATTIVARE | non provabile qui: i player sono bloccati |
| Banner immagine / GIF / video | FUNZIONA | il caricamento per gli account serve Storage |
| Bio formattata: grassetto, corsivo, spoiler, glow, arcobaleno, colori, link | FUNZIONA |  |
| Sezioni di link (titoli) | FUNZIONA |  |
| Link in evidenza (si muove e brilla) | FUNZIONA |  |
| Link programmati (visibile dal / fino al) | FUNZIONA |  |
| Link con password (il link vero è cifrato) | FUNZIONA |  |
| Modulo contatti, messaggi nella dashboard | DA ATTIVARE | regole Firebase (provata con Firebase simulato) |
| Newsletter: iscritti, copia email, CSV | DA ATTIVARE | regole Firebase (provata con Firebase simulato) |
| Più profili per account | MANCA |  |

## 3. Aspetto
| Feature | Stato | Nota |
|---|---|---|
| Colori liberi (7 colori) e palette rapide | FUNZIONA |  |
| Sfondo: colore, gradiente 2-4 colori, immagine, video, scurisci, sfoca | FUNZIONA |  |
| Opacità, sfocatura e bordo della card | FUNZIONA |  |
| Glow su nome, social, badge, link | FUNZIONA |  |
| Stile bottoni (variante, forma, ombra, hover, icone) | FUNZIONA |  |
| 11 effetti di sfondo con colore e intensità | FUNZIONA | lava, aurora, neve, pioggia, stelle, costellazione, cuori, matrix, grana, scanline, dither |
| Cursore normale, mirino o personalizzato | FUNZIONA |  |
| Scia del cursore (punti, scintille, fantasma) | FUNZIONA |  |
| Effetti sul nome (glow, gradiente, arcobaleno, glitch, scintille, macchina da scrivere, shuffle, contorno) | FUNZIONA |  |
| 20 font per nome e testo | FUNZIONA |  |
| 5 layout (classico, a sinistra, banner, minimal, terminale) | FUNZIONA |  |
| Animazione d'ingresso del profilo (pixel, glitch, pop…) | FUNZIONA |  |
| Schermata "clicca per entrare" | FUNZIONA |  |
| Template già pronti (14) | FUNZIONA |  |
| Template della community | DA ATTIVARE | regole Firebase |
| Effetto ASCII sul profilo | FUNZIONA |  |
| Caricare un font proprio (TTF, OTF, WOFF) | FUNZIONA | per gli account serve Storage |
| Animazioni del testo: 19 sul nome, 6 sulla bio | FUNZIONA |  |
| Decorazioni avatar (aureola, corna, orecchie, corona, fiamme…) | FUNZIONA |  |
| Effetti sonori su link e social (6 suoni) | FUNZIONA |  |

## 4. Musica
| Feature | Stato | Nota |
|---|---|---|
| Musica: Spotify, SoundCloud, YouTube o mp3, con volume | DA ATTIVARE | l'mp3 caricato serve Storage; i player non provabili qui |
| Parte dopo "clicca per entrare" | FUNZIONA |  |
| Playlist fino a 20 brani, ordine casuale, ripeti | FUNZIONA |  |
| Testi sincronizzati (LRC), con ricerca su LRCLIB | FUNZIONA | la ricerca non è provabile qui |
| Copertina sfocata come sfondo del player | FUNZIONA |  |
| Visualizzatore audio (barre o onda) | FUNZIONA | segue la riproduzione, non legge lo spettro vero |

## 5. Widget dal vivo
| Feature | Stato | Nota |
|---|---|---|
| Stato Discord (Lanyard) | DA ATTIVARE | l'utente entra una volta in discord.gg/lanyard; non provabile qui |
| Spotify "sto ascoltando" (via Discord) | DA ATTIVARE | come sopra |
| Last.fm | DA ATTIVARE | serve la API key di Last.fm |
| Statistiche GitHub | DA ATTIVARE | non provabile qui |
| Orologio con fuso orario | FUNZIONA |  |
| Rank Valorant | MANCA |  |
| Live Twitch e ultimi video di YouTube | DA ATTIVARE | non provabile qui: i player sono bloccati |
| Telegram, Roblox, Steam come icone social | FUNZIONA |  |

## 6. Community
| Feature | Stato | Nota |
|---|---|---|
| Topic della settimana | DA ATTIVARE | regole Firebase (per vedere le risposte sulla landing) |
| Pubblicare template: pubblici, non in elenco, privati; usarne solo una parte | DA ATTIVARE | regole Firebase |
| Classifica profili per visite | DA ATTIVARE | regole Firebase; finché non ci sono 3 profili mostra un esempio |
| Contatore visite pubblico | DA ATTIVARE | regole Firebase |
| Statistiche: visite, clic, social, ascolti, tempo, grafico 7/30 giorni | DA ATTIVARE | regole Firebase (provata con Firebase simulato) |
| Feed delle interazioni in diretta | DA ATTIVARE | regole Firebase (provata con Firebase simulato) |
| Clan con TAG riservata e pagina del clan | DA ATTIVARE | regole Firebase (provata con Firebase simulato) |
| Fino a 3 clan per profilo, 1 principale | DA ATTIVARE | regole Firebase |
| Classifica dei clan | DA ATTIVARE | regole Firebase |
| Guestbook (firme di chi ha un account) | DA ATTIVARE | regole Firebase (provata con Firebase simulato) |
| Esplora profili: nuovi, più visti, cerca una @ | DA ATTIVARE | regole Firebase |
| Regala il premium | MANCA |  |
| Codice affiliato | MANCA |  |
| Ruolo sul server Discord | MANCA |  |

## 7. Pagina pubblica e statistiche
| Feature | Stato | Nota |
|---|---|---|
| Anteprima dal vivo mentre modifichi (desktop e telefono) | FUNZIONA |  |
| Pagina pubblica 18kbio.xyz/nome | DA ATTIVARE | regole Firebase |
| Carta d'identità personale (editor a schermo pieno: opzioni a sinistra, solo la carta al centro) | FUNZIONA |  |
| Carta: 10 stili pronti, gradienti a 2-5 colori, foto di sfondo con zoom/posizione/sfocatura/b&n | FUNZIONA |  |
| Carta: raggi di luce (colore, numero, posizione, rotazione), riflesso olografico, punto di luce, bagliore | FUNZIONA |  |
| Carta: texture (grana, puntini, griglia, righe, scanline, dither, stelle, scacchi), 5 bordi, angoli | FUNZIONA |  |
| Carta: foto trasformata in sticker (sfondo tolto da solo, ritaglio, bordo bianco), simboli e testi, trascina/ruota/ingrandisci | FUNZIONA |  |
| Bottone "la mia carta" sul profilo, carta a schermo intero che si inclina col mouse | DA ATTIVARE | regole Firebase (pagina pubblica) |
| Schermo intero e link 18kbio.xyz/nome cliccabile nell'anteprima | FUNZIONA |  |
| Indirizzo corto 18kbio.xyz/nome (resta valido anche /@nome) | DA ATTIVARE | regole Firebase (pagina pubblica) |
| Password dimenticata (link via email) | DA ATTIVARE | regole Firebase già ok; l'email la manda Firebase |
| Verifica email all'iscrizione | FUNZIONA |  |
| Elimina account (profilo, @, nomi extra, file, account) | DA ATTIVARE | pubblicare le nuove regole Firebase |
| Scarica i miei dati (file JSON) | FUNZIONA |  |
| Privacy e Termini, consenso all'iscrizione (14 anni) | FUNZIONA | farli controllare da un esperto |
| Segnala un profilo (motivo + dettagli, li legge lo staff dalla console) | DA ATTIVARE | pubblicare le nuove regole Firebase |
| Una sola @ principale per account, nomi riservati anche nel database | DA ATTIVARE | pubblicare le nuove regole Firebase |
| Carta scaricabile come immagine e come storia Instagram | FUNZIONA |  |
| Icona, anteprima di condivisione, robots.txt, sitemap, installabile sul telefono | FUNZIONA |  |
| Sfondo di riserva se una GIF/foto non esiste più | FUNZIONA |  |
| Se il nome è libero la pagina dice "è libera, prendila" | FUNZIONA |  |
| Profilo privato o fuori dalla classifica | FUNZIONA |  |
| Nascondi visite e badge | FUNZIONA |  |
| Titolo della scheda (anche animato) e favicon | FUNZIONA |  |
| Anteprima del link su Discord / WhatsApp con titolo, foto e colore | DA ATTIVARE | regole Firebase; la fa una funzione su Vercel |
| Clic sui link e sui social | DA ATTIVARE | regole Firebase |
| Provenienza, dispositivi, zone (dal fuso orario) | DA ATTIVARE | regole Firebase |
| QR code (quadrati, punti, arrotondato, colori, @ al centro) | FUNZIONA |  |
| Link tracciati per ogni social (UTM) | FUNZIONA |  |

## 8. Hosting file
| Feature | Stato | Nota |
|---|---|---|
| Image host: carichi e hai subito il link diretto | DA ATTIVARE | serve Storage attivo |
| Dominio personale per gli upload | SOSPESO |  |
| Galleria sul profilo (griglia, scorrevole, polaroid) | FUNZIONA |  |
| Text paste con link | DA ATTIVARE | regole Firebase (provata con Firebase simulato) |

## 9. Account
| Feature | Stato | Nota |
|---|---|---|
| Accesso con Google | FUNZIONA | serve il dominio .vercel.app tra i domini autorizzati |
| Email e password | FUNZIONA |  |
| Dashboard senza account, profilo portato nell'account alla registrazione | FUNZIONA |  |
| Dashboard chiara / scura | FUNZIONA |  |
| Accesso con Discord | DA ATTIVARE | il codice c'è ma è spento: va configurato in Firebase |
| Premium a vita, paghi una volta | MANCA |  |

## Idee tutte di 18kbio
- **Moods**: la stessa estetica bianco e nero in tre texture (fumo, dither, ASCII), scelta dal visitatore. Sulla landing.
- **Anteprima del link prima di registrarti**: scrivi la @ e vedi come appare su Discord, Instagram e TikTok. Sulla landing.
- **Rarità visibile del nome**: sulla landing; da portare sul profilo come badge.
- **Link con password cifrato**: nel database c'è solo la versione cifrata del link.
- **Clan con TAG riservata**: fatti. **Partner con dominio proprio**: da costruire (serve configurare i domini).
- **Prova senza account**: la dashboard funziona da ospite e il profilo passa nell'account alla registrazione.
- **Topic della settimana** con badge per chi vince.
