# sigari.bio

Landing page, pagina di login e dashboard, ognuna in un unico file HTML.

## Struttura

```
sigari-bio/
├── index.html        Landing page (hero WebGL con 3 mood, @ di particelle, catalogo feature, anteprima profilo, FAQ)
├── login.html        Login e registrazione (accetta ?handle=nome e ?mode=login)
├── dashboard.html    Dashboard con anteprima live
├── FEATURES.md       Catalogo di tutte le feature (live / in arrivo) dai concorrenti
├── firestore.rules   Regole di sicurezza Firestore
└── README.md         Questo file
```

## Setup Firebase (una volta sola)

1. **Authentication > Sign-in method**
   - Attiva **Google**. Verifica che il Client ID mostrato sia quello del progetto (`435137114163-…`).
   - Attiva **Email/Password**.
   - In **Settings > Authorized domains** aggiungi `localhost` e il tuo dominio di produzione.
2. **Discord (opzionale)**
   - Aggiungi un provider OpenID Connect con ID `oidc.discord`, issuer `https://discord.com`, scope `identify email`.
   - Quando è pronto imposta `DISCORD_ENABLED = true` in `login.html`.
3. **Firestore > Rules**: incolla il contenuto di `firestore.rules` e pubblica.
4. **Google Cloud Console > Credenziali**: limita la API key ai domini in cui gira il sito.

## Avvio in locale

Apri la cartella in VS Code e avvia **Live Server** su `index.html`.

## Note

- I nomi utente vengono riservati in una transazione sulla collezione `usernames`.
- Se la registrazione fallisce dopo la creazione dell'account, l'account viene eliminato per evitare utenze orfane.
- Le viste diverse da Appearance mostrano solo un avviso "coming soon".
