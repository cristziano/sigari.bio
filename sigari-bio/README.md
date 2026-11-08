# 18k.bio

Landing page, login, dashboard e pagina pubblica del profilo. Ogni pagina è un unico file HTML; il profilo viene disegnato da un solo modulo condiviso (`profile-kit.js`), così l'anteprima della dashboard e la pagina pubblica sono identiche.

## Struttura

```
sigari-bio/
├── index.html        Landing: hero con profilo da personalizzare dal vivo, statistiche, template, topic, clan, partner, FAQ
├── login.html        Login e registrazione (?handle=nome, ?mode=login, ?from=ospite porta il profilo dell'ospite nell'account)
├── dashboard.html    Dashboard: anche senza account (modalità ospite, salva nel browser)
├── profile.html      Pagina pubblica, servita su 18k.bio/nome (in locale: profile.html?u=nome)
├── explore.html      Esplora i profili: nuovi, più visti, cerca una @
├── clan.html         Pagina di un clan (?tag=18K) o classifica dei clan
├── paste.html        Un testo condiviso con un link (?id=…)
├── profile-kit.js    Il renderer dei profili: font, effetti, layout, musica, widget, template, topic
├── vendor/qrcode.mjs Generatore di QR code (qrcode-generator, licenza MIT)
├── FEATURES.md       Catalogo delle feature (fatte / da fare)
├── firestore.rules   Regole di Firestore
├── storage.rules     Regole di Storage
└── vercel.json       Rewrite di /@nome quando la Root Directory di Vercel è sigari-bio
```

## Setup Firebase (una volta sola)

1. **Authentication > Sign-in method**: attiva **Google** e **Email/Password**. In **Settings > Authorized domains** aggiungi `localhost` e i domini di produzione (anche quello `.vercel.app`).
2. **Firestore > Rules**: incolla `firestore.rules` e pubblica. Serve per la pagina pubblica, il contatore delle visite, i template e la classifica.
3. **Storage > Rules**: incolla `storage.rules` e pubblica. Serve per avatar, sfondi, banner, galleria, font, cursori e audio caricati dalla dashboard. Se Storage non è attivo, Firebase può chiedere il piano Blaze; senza Storage si usano i link delle immagini.
4. **Discord (opzionale)**: provider OpenID Connect con ID `oidc.discord`, issuer `https://discord.com`, scope `identify email`; poi `DISCORD_ENABLED = true` in `login.html`.
5. **Google Cloud Console > Credenziali**: limita la API key ai domini del sito.

Fuori da questa cartella: `api/profile.js` è una funzione di Vercel. Quando qualcuno apre 18k.bio/nome, mette nella pagina titolo, descrizione, foto e colore del profilo, così l'anteprima del link su Discord, WhatsApp e Telegram mostra il profilo. Se qualcosa non va, serve la pagina normale.

## Come funziona

- **Profilo privato e pubblico.** `users/{uid}` è il documento privato. Ogni salvataggio dalla dashboard aggiorna anche `profiles/{handle}`, la copia pubblica letta da `profile.html`. Le visite (`views`) e i **badge** stanno solo nella copia pubblica: le regole impediscono al proprietario di cambiarli. I badge (`beta`, `early`, `verified`, `partner`, `winner`) si assegnano dalla console di Firebase.
- **Modalità ospite.** Senza account la dashboard salva nel browser (`localStorage`, chiave `sigari-draft`). Alla registrazione `login.html` copia quella bozza nel nuovo account; le immagini dell'ospite vengono poi spostate su Storage al primo accesso.
- **Template.** Collezione `templates`: pubblici, non in elenco (solo con il link `dashboard.html?template=ID`) o privati. I template già pronti sono in `profile-kit.js` (`TEMPLATES`).
- **Topic della settimana.** La lista è `TOPICS` in `profile-kit.js` e cambia ogni lunedì. I vincitori si premiano con il badge `winner`.
- **Last.fm.** Crea un'app gratuita su https://www.last.fm/api/account/create e metti in Vercel `LASTFM_API_KEY` e `LASTFM_SHARED_SECRET`. Nell'app di Last.fm il "Callback URL" è `https://18kbio.vercel.app/api/lastfm-connect`. Così funziona il tasto "Collega Last.fm" e il widget mostra foto, ascolti e la canzone di adesso.
- **Ricerca canzoni (Musica).** Funziona subito con Deezer e trova il link Spotify da solo (song.link). Facoltativo: con `SPOTIFY_CLIENT_ID` e `SPOTIFY_CLIENT_SECRET` in Vercel cerca direttamente su Spotify.
- **Pagina Pubblica.** È un componente React: il sorgente è `src/publish-panel.jsx`, il file usato dal sito è `publish-panel.js`. Per rigenerarlo: `npm i react@18.3.1 react-dom@18.3.1 esbuild` in una cartella a parte, poi `esbuild src/publish-panel.jsx --bundle --minify --format=esm --jsx=automatic --define:process.env.NODE_ENV='"production"' --outfile=publish-panel.js`.
- **Discord e Spotify in diretta.** Il widget Discord usa Lanyard: l'utente entra in discord.gg/lanyard e incolla il suo ID nella dashboard.
- **Statistiche.** La pagina pubblica scrive dei contatori giornalieri in `stats/{nome}/days/{AAAA-MM-GG}`: visite, clic su ogni link e social, ascolti, provenienza (anche dai link `?utm_source=`), dispositivo, zona (dal fuso orario) e tempo sulla pagina. Le regole lasciano solo aggiungere 1, e solo il proprietario le legge.
- **Link con password.** Il link vero viene cifrato con la password (AES) prima di andare nella copia pubblica: nel database pubblico non c'è né il link né la password.
- **Clan.** `clans/{TAG}` con i membri in `clans/{TAG}/members/{nome}`. Il conteggio dei membri resta giusto perché le regole controllano ogni entrata e uscita.
- **Messaggi, newsletter, guestbook.** `inbox/{nome}/messages`, `inbox/{nome}/subscribers`, `guestbook/{nome}/entries`: si scrivono solo se il proprietario li ha accesi; i messaggi e gli iscritti li legge solo lui.
- **Nomi extra.** Stanno in `usernames` con `aliasOf`: la pagina pubblica e la funzione su Vercel portano al profilo principale.
- **Paste.** Collezione `pastes`, leggibili da chi ha il link.
- **Pinterest.** Non ha una ricerca pubblica da integrare: la dashboard apre la ricerca di Pinterest (o Pexels) e l'utente incolla il link dell'immagine.

## Avvio in locale

Apri la cartella in VS Code e avvia **Live Server** su `index.html`. La pagina pubblica in locale: `profile.html?u=nome`.

## Dominio e prefissi

Il sito si chiama **18k.bio** ed è il dominio principale. Ogni profilo è sempre **prefisso/nomeutente**:

- predefinito: `18k.bio/nomeutente` (anche `18k.bio/@nomeutente`);
- prefissi 18k: `18k.gin`, `18k.gg`, `18k.lol`, `18k.wtf`, `18k.rip`, `18k.fm`, `18k.vip`, `18k.ink`, `18k.cc`, `18kt.bio`, `x18k.bio`, sempre con `/nomeutente` dopo.

Niente domini esterni (tipo il dominio di un server) e niente sottodomini (nome.18k.bio).

Per accenderli (lo fa chi gestisce Vercel e Firebase, ancora da fare):

- **Comprare** 18k.bio e i prefissi che si vogliono usare.
- **Vercel → Settings → Domains**: aggiungere ogni dominio. Il codice funziona su tutti senza modifiche, perché le rotte `/nome` e `/@nome` valgono per qualsiasi dominio.
- **Firebase → Authentication → Settings → Authorized domains**: aggiungerli (senza, il login con Google non va).
- **Indirizzi assoluti**: `og:image` in index.html, `robots.txt`, `sitemap.xml` (oggi puntano a 18kbio.vercel.app, che funziona): passarli a 18k.bio.

Tutto il resto (link interni, profili, foto, API) usa l'indirizzo da cui si apre il sito, quindi funziona con qualsiasi dominio.

## Premium e look salvati

- Gli slot "i tuoi look" (Personalizza) sono 1 per tutti e 3 per i premium. Il limite è anche nelle regole di Firestore (`slots/{uid}`).
- Per dare il premium a qualcuno: Firebase → Firestore → `profiles/<nome>` → campo `badges` → aggiungi `premium`. Solo dalla console: l'utente non può darselo da solo.

## Richieste dall'app

- Serve un account, una richiesta a settimana per account. Il bot cerca 3 foto su Pinterest dal testo della richiesta e le mette nel messaggio del canale richieste.
