# sigari.bio

Landing page, login, dashboard e pagina pubblica del profilo. Ogni pagina è un unico file HTML; il profilo viene disegnato da un solo modulo condiviso (`profile-kit.js`), così l'anteprima della dashboard e la pagina pubblica sono identiche.

## Struttura

```
sigari-bio/
├── index.html        Landing: hero con profilo da personalizzare dal vivo, statistiche, template, topic, clan, partner, FAQ
├── login.html        Login e registrazione (?handle=nome, ?mode=login, ?from=ospite porta il profilo dell'ospite nell'account)
├── dashboard.html    Dashboard: anche senza account (modalità ospite, salva nel browser)
├── profile.html      Pagina pubblica, servita su sigari.bio/@nome (in locale: profile.html?u=nome)
├── profile-kit.js    Il renderer dei profili: font, effetti, layout, musica, widget, template, topic
├── FEATURES.md       Catalogo delle feature (fatte / da fare)
├── firestore.rules   Regole di Firestore
├── storage.rules     Regole di Storage
└── vercel.json       Rewrite di /@nome quando la Root Directory di Vercel è sigari-bio
```

## Setup Firebase (una volta sola)

1. **Authentication > Sign-in method**: attiva **Google** e **Email/Password**. In **Settings > Authorized domains** aggiungi `localhost` e i domini di produzione (anche quello `.vercel.app`).
2. **Firestore > Rules**: incolla `firestore.rules` e pubblica. Serve per la pagina pubblica, il contatore delle visite, i template e la classifica.
3. **Storage > Rules**: incolla `storage.rules` e pubblica. Serve per avatar, sfondi, cursori e audio caricati dalla dashboard.
4. **Discord (opzionale)**: provider OpenID Connect con ID `oidc.discord`, issuer `https://discord.com`, scope `identify email`; poi `DISCORD_ENABLED = true` in `login.html`.
5. **Google Cloud Console > Credenziali**: limita la API key ai domini del sito.

## Come funziona

- **Profilo privato e pubblico.** `users/{uid}` è il documento privato. Ogni salvataggio dalla dashboard aggiorna anche `profiles/{handle}`, la copia pubblica letta da `profile.html`. Le visite (`views`) e i **badge** stanno solo nella copia pubblica: le regole impediscono al proprietario di cambiarli. I badge (`beta`, `early`, `verified`, `partner`, `winner`) si assegnano dalla console di Firebase.
- **Modalità ospite.** Senza account la dashboard salva nel browser (`localStorage`, chiave `sigari-draft`). Alla registrazione `login.html` copia quella bozza nel nuovo account; le immagini dell'ospite vengono poi spostate su Storage al primo accesso.
- **Template.** Collezione `templates`: pubblici, non in elenco (solo con il link `dashboard.html?template=ID`) o privati. I template già pronti sono in `profile-kit.js` (`TEMPLATES`).
- **Topic della settimana.** La lista è `TOPICS` in `profile-kit.js` e cambia ogni lunedì. I vincitori si premiano con il badge `winner`.
- **Last.fm.** Per mostrare la canzone in ascolto serve una API key gratuita (https://www.last.fm/api/account/create): mettila in `LASTFM_API_KEY` in `profile-kit.js`. Senza key il widget è solo un link.
- **Discord e Spotify in diretta.** Il widget Discord usa Lanyard: l'utente entra in discord.gg/lanyard e incolla il suo ID nella dashboard.
- **Pinterest.** Non ha una ricerca pubblica da integrare: la dashboard apre la ricerca di Pinterest (o Pexels) e l'utente incolla il link dell'immagine.

## Avvio in locale

Apri la cartella in VS Code e avvia **Live Server** su `index.html`. La pagina pubblica in locale: `profile.html?u=nome`.
