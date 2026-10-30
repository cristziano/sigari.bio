# Come è fatta la dashboard di guns.lol, e cosa abbiamo copiato

Analisi fatta il 2026-10-30 sul centro assistenza ufficiale (help.guns.lol: personalizzazione, link, template, badge, audio, caricamenti, layout, font, metadati, statistiche, account, changelog fino ad agosto 2026) e sulla pagina dei prezzi. La dashboard vera richiede l'accesso, quindi la struttura viene dalle loro guide, che citano le pagine una per una (`/account`, `/customize`, `/links`, `/premium`, `/templates`, `/imagehost`).

Lo stesso resoconto, con i bottoni per aprire ogni sezione, è nella dashboard alla voce **Guida**.

## Il menu di guns.lol

| Voce | Cosa contiene |
|---|---|
| Account › Overview | Nome utente, alias, UID, visite; "Manage your account" (nome, nome visualizzato, alias); collegamento a Discord |
| Account › Analytics | Visite, media al giorno, clic, percentuale di clic; grafico nel tempo, dispositivi, social più cliccati, provenienza, paesi |
| Account › Badges | Badge ufficiali, badge personalizzato, colori, ordine, mostra/nascondi |
| Account › Settings | Email, password, 2FA, sessioni, Discord, eliminazione account |
| Customize | Una sola pagina in quattro parti: **Assets Uploader** (sfondo, audio, avatar, cursore), **General Customization** (descrizione, Discord presence, effetti di sfondo e sul nome con menu a tendina, opacità e sfocatura del profilo, posizione, glow su nome/social/badge), **Color Customization** (accento, sfondo, testo, icone, gradiente del profilo), **Other Customization** (icone monocromatiche, titolo animato, colori dei riquadri invertiti, controllo volume, avatar e decorazione di Discord). In fondo "Save Changes". |
| Links | Griglia di icone social: tocchi, scrivi il nome utente; link personalizzato con icona; trascini per riordinare; modalità link o testo copiabile |
| Premium | Layout (Default, Modern, Simplistic, Sleek, Portfolio) con banner, bordi, bottoni, widget; font; scrittura animata; effetti del cursore; animazioni del profilo; metadati e SEO; nascondi visite e badge |
| Templates | Esplora con ricerca e filtri, anteprima prima di usarlo, "Use Template", preferiti, usati di recente, "My Uploads", crea; pubblico, non in elenco o privato; importare solo un pezzo (es. solo sfondo o audio) |
| Image Host | Galleria con cartelle, impostazioni dell'embed, domini, paste |
| In fondo | "Share Your Profile" (link e QR code), Help Center |

## Come l'abbiamo rifatto su sigari.bio

| guns.lol | sigari.bio |
|---|---|
| Account › Overview | Panoramica: nome utente, nomi extra, visite, link e social, "gestisci il tuo profilo", completamento |
| Account › Analytics | Statistiche |
| Account › Badges | Badge: ufficiali con spiegazione, colore e forma, badge personale (gratis) |
| Account › Settings | Impostazioni, con i nomi extra (alias) |
| Customize | **Personalizza**: Caricamenti (avatar, sfondo, audio, cursore, banner, font), Generale, Colori, Altro, con le stesse voci e menu a tendina per gli effetti |
| Links | Link: griglia dei social sopra, link personalizzati sotto, stile delle icone |
| Templates | Template: Esplora (ricerca, tag), Preferiti, Usati di recente, I miei, Crea; "Prova sul tuo profilo" prima di usarlo; "Usa" tutto o un pezzo |
| Premium | **Avanzate** (gratis): Layout e bottoni, Font ed effetti, Musica e audio, Widget, Metadati e privacy |
| Image Host | Galleria e Paste |
| Share Your Profile, Help Center | Condividi il profilo e Guida, in fondo al menu |

In più, per rendere la dashboard facile da girare:
- **ricerca delle impostazioni** in cima al menu (Ctrl K): scrivi "font", "glow", "sfondo" e ci arrivi;
- i gruppi del menu si chiudono e restano chiusi;
- le scorciatoie della Panoramica e della Guida aprono la pagina giusta già alla parte giusta;
- su telefono il menu è una tendina e la ricerca sta in alto.

## Template

40 stili pronti. I 26 nuovi riprendono i temi più usati su guns.lol: anime in bianco e nero, Neon Tokyo, Luna di sangue, Sakura, Iceman, Galassia, Lo-fi, Cyberpunk, Vaporwave, Chiesa (gothic), Vecchia TV, Vetro, Soldi, Demone, Kawaii, Pixel, Drill, Rose gold, Aurora boreale, Notte JDM, Carbonio, Toxic, Royal, Fantasma, Fiamme, Sigari & Gin.

## Cosa non abbiamo copiato

Pagamenti (premium, regali, badge a pagamento, crediti), più account per persona, domini personalizzati per le immagini, l'app per gli screenshot, il cambio del nome utente: servono server, pagamenti o regole che qui non ci sono.
