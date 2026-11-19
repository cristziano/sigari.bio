# Specifica Landing 18kbio.xyz — Rilascio Pubblico
> Unico riferimento per chi costruisce. Se non è scritto qui, non si fa.

---

## 1. COPY ESATTO — Ogni parola, in ordine

### HERO (above the fold, mobile & desktop)
| Elemento | Testo |
|---|---|
| **H1** | Il tuo @, tutto il tuo mondo in una pagina. |
| **Sottotitolo** | Link, social, musica e stile in un solo indirizzo: 18kbio.xyz/tuonome. Gratis, per sempre. |
| **CTA Primaria** | Scegli il tuo @ |
| **CTA Secondaria** | Esplora i profili |
| **Visual** | Screenshot reale 320×560px della **card aperta** con pulsante «mostra la mia carta». Alt: «Esempio card profilo 18kbio con foto, @ e pulsante mostra la mia carta». |

> **Regola mobile**: H1, sottotitolo, CTA primaria visibili senza scroll (viewport ≤ 667px).

---

### PROBLEMA (H2)
I tuoi link sono sparsi ovunque.
Instagram, TikTok, Discord, YouTube: ognuno ha la sua bio, nessuna li unisce.

---

### SOLUZIONE (H2)
18kbio li riunisce in un indirizzo solo tuo.
Una pagina personale con il tuo @, i tuoi link, la tua musica e il tuo stile. La condividi ovunque con un solo link.

---

### COME FUNZIONA (H2) — 3 step, icone + screenshot reali 160×280px
| Step | Titolo | Descrizione | Visual |
|---|---|---|---|
| 1 | Scegli il tuo @ | Cerca un nome libero su 18kbio.xyz e registralo in 30 secondi. | Screenshot: pagina claim @ con input e bottone |
| 2 | Personalizza | Colori, font, sfondo, foto, video, musica, link, sezioni. Vedi le modifiche in tempo reale. | Screenshot: editor aperto con pannello stili |
| 3 | Condividi | Copia 18kbio.xyz/tuonome e mettilo in bio, nelle storie, su Discord, dove vuoi. | Screenshot: profilo finito con bottone copia link |

---

### FUNZIONALITÀ CHIAVE (H2) — Max 4 card, una riga ciascuna
| Funzione | Descrizione (1 riga) |
|---|---|
| La tua card | Un biglietto da visita digitale con il tuo @, foto e sticker: si apre con un tap. |
| Statistiche vere | Visite, click, provenienza, dispositivi — nella tua dashboard, aggiornate ogni giorno. |
| Stile tuo | 20 font, 8 effetti testo, colori liberi, foto/GIF/video fino a 40 MB. |
| Musica integrata | Un player sulla pagina: i visitatori ascoltano senza uscire. |

---

### PROVE SOCIALI (H2)
> **Regola**: solo profili reali, con permesso scritto. Numero utenti = query DB reale, non hardcoded.

| Elemento | Contenuto |
|---|---|
| Contatore | `{{total_users}}` persone hanno già il loro @ (renderizzato server-side) |
| Profilo 1 | Screenshot + @ + frase: «Uso 18kbio per raccogliere tutti i miei link da quando ho iniziato a streammare.» |
| Profilo 2 | Screenshot + @ + frase: «La card è la cosa più figa: la mando in chat e la gente la apre subito.» |
| Profilo 3 | Screenshot + @ + frase: «Finalmente i miei follower su TikTok trovano anche il mio Discord e Spotify.» |

---

### PREZZI (H2) — Tabella Gratis vs Premium
| | Gratis | Premium |
|---|---|---|
| **Prezzo** | €0 / per sempre | €`{{premium_price}}` / una volta |
| **Il tuo @** | 1–20 caratteri | 1–3 caratteri (se liberi) |
| **Domini** | 1 (18kbio.xyz) | Tutti + 1 alias personalizzato |
| **Layout** | 3 | Tutti |
| **Effetti & font** | Base | Tutti + esclusivi |
| **Musica** | 1 brano | Playlist + testi sincronizzati |
| **Widget** | 3 | Illimitati |
| **Analytics** | Visite, click 7/30gg | Paesi, fonti, dispositivi, storico illimitato |
| **Salvataggi** | 1 look | 3 look |
| **Watermark** | Sì | No |
| **CTA** | Inizia gratis | Attiva Premium |

> **Nota**: il prezzo Premium lo definisce Cristiano. Non inventarlo. Il markup usa `{{premium_price}}` come placeholder.

---

### FAQ (H2) — 5 domande, risposta max 2 righe
| Domanda | Risposta |
|---|---|
| Quanto costa davvero? | Gratis per sempre. Premium è un pagamento unico, niente abbonamenti. |
| Posso cambiare il mio @ dopo? | Sì, una volta ogni 30 giorni se il nuovo è libero. |
| La mia pagina è pubblica? | Sì, chiunque con il link la vede. Nessun login richiesto per i visitatori. |
| Posso usare il mio dominio? | Con Premium: sì, un alias tuo (es. tuonome.com). |
| Come cancello l'account? | In impostazioni → Elimina account. I dati spariscono in 24h. |

---

### CTA FINALE (H2)
Il tuo @ ti aspetta.
[Scegli il tuo @] — stessa CTA dell'hero.

---

### FOOTER (obbligatorio per rilascio)
| Colonna 1 | Colonna 2 | Colonna 3 | Colonna 4 |
|---|---|---|---|
| **Prodotto** | **Azienda** | **Legale** | **Community** |
| Esplora profili | Chi siamo | Termini | Discord |
| Funzionalità | Blog | Privacy | Twitter/X |
| Prezzi | Lavora con noi | Cookie | GitHub |
| Changelog | Stampa | Contatti | |
| Status | | | |

Copyright: © 2025 18kbio. Tutti i diritti riservati.

---

## 2. COSA TAGLIARE (dal sito attuale)

| Sezione attuale | Motivo |
|---|---|
| Titolo «Prendi la tua @» | Dice cosa fare, non perché. Sostituito da H1 benefit-driven. |
| CTA primaria «Esplora i profili» | Porta via dall'azione principale. Diventa link secondario. |
| «LA TUA CARTA» con link a @1 | Sembra un ticker interno. Sostituito da sezione Prove Sociali con profili reali scelti. |
| «Tre passi. Un minuto.» (testo nudo) | Struttura ok, ma serve visual: screenshot reali per ogni step. |
| «Lo cambi come vuoi. Lo vedi subito.» + elenco 4 voci | Frase generica + elenco lungo. Confluito in Funzionalità Chiave (4 card). |
| «Ogni visita conta. Davvero.» + numeri finti | **Distrugge la fiducia**. Esplicitamente scritto «numeri finti». Sostituito da screenshot dashboard reale o rimosso. |
| Sezione Gratis: elenco 7 bullet (20 font, 8 effetti, 30 link…) | Troppo da leggere. Massimo 4 vantaggi chiave in home, resto in pagina Funzionalità. |
| Premium «Via Discord» + ticket | Non professionale per lancio pubblico. Spostato in pagina Prezzi con bottone acquisto reale. |
| Nessun navbar, nessun footer legale | Obbligatori prima del rilascio. |

---

## 3. COMPONENTI UI — Specifica per sviluppatore

### Design Tokens (CSS Custom Properties)
```css
:root {
  /* Colori */
  --color-bg: #0a0a0b;
  --color-bg-elevated: #141416;
  --color-border: #27272a;
  --color-text: #fafafa;
  --color-text-muted: #a1a1aa;
  --color-accent: #e879f9;        /* viola 18kbio */
  --color-accent-hover: #d946ef;
  --color-accent-soft: rgba(232,121,249,0.12);
  --color-success: #22c55e;
  --color-error: #ef4444;
  
  /* Tipografia */
  --font-display: 'Space Grotesk', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --text-display: clamp(2.5rem, 5vw + 1rem, 4rem);
  --text-body: 1.0625rem;
  --text-sm: 0.9375rem;
  --line-height-tight: 1.15;
  --line-height-relaxed: 1.6;
  
  /* Spazi */
  --space-xs: 0.375rem;
  --space-sm: 0.75rem;
  --space-md: 1.5rem;
  --space-lg: 3rem;
  --space-xl: 6rem;
  --container-max: 72rem;
  --container-pad: 1.5rem;
  
  /* Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;
  
  /* Ombre */
  --shadow-card: 0 4px 24px rgba(0,0,0,0.35);
  --shadow-hover: 0 8px 40px rgba(0,0,0,0.45);
  
  /* Transizioni */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
}
```

### Componenti Richiesti
| Componente | Props | Stati | Note |
|---|---|---|---|
| **Button** | variant: 'primary' \| 'secondary' \| 'ghost', size: 'md' \| 'lg', disabled?, loading? | hover, focus-visible, active, disabled, loading | Primary: bg accent, text bg. Secondary: border accent, text accent. Ghost: text accent. |
| **Card** | variant: 'default' \| 'featured', image?, children | hover | Featured: border accent, shadow accent-soft. |
| **Section** | id, className, children | — | Wrapper con padding Y = var(--space-xl), container max-width. |
| **Navbar** | links: {label, href}[], cta: {label, href} | scroll (bg elevated + border), mobile menu | Sticky top, z-index 50. |
| **Footer** | columns: {title, links: {label, href}[]}[], copyright | — | Grid 4 colonne desktop, 2 tablet, 1 mobile. |
| **PricingTable** | tiers: {name, price, period, features: string[], cta, popular?}[] | hover card | Highlight tier popular con border accent + badge. |
| **FAQItem** | question, answer, open? | open/close animato | Accordion, una aperta alla volta. |
| **SocialProof** | count, profiles: {image, handle, quote}[] | — | Carousel mobile, griglia 3 desktop. |

---

## 4. STRUTTURA HTML — Ordine esatto dei blocchi

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>18kbio — Il tuo @, tutto il tuo mondo in una pagina</title>
  <meta name="description" content="Link, social, musica e stile in un solo indirizzo: 18kbio.xyz/tuonome. Gratis, per sempre.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <!-- CSS critico inline, resto async -->
</head>
<body>
  <header class="navbar" role="banner">
    <nav class="container" aria-label="Navigazione principale">
      <a href="/" class="logo" aria-label="18kbio home">18kbio</a>
      <ul class="nav-links" role="list">
        <li><a href="/esplora">Esplora</a></li>
        <li><a href="/funzionalita">Funzionalità</a></li>
        <li><a href="/prezzi">Prezzi</a></li>
      </ul>
      <div class="nav-actions">
        <a href="/login" class="btn ghost">Accedi</a>
        <a href="/claim" class="btn primary">Crea il tuo @</a>
      </div>
    </nav>
  </header>

  <main>
    <!-- HERO -->
    <section id="hero" class="section hero" aria-labelledby="hero-title">
      <div class="container hero-grid">
        <div class="hero-content">
          <h1 id="hero-title" class="hero-title">Il tuo @, tutto il tuo mondo in una pagina.</h1>
          <p class="hero-subtitle">Link, social, musica e stile in un solo indirizzo: 18kbio.xyz/tuonome. Gratis, per sempre.</p>
          <div class="hero-cta-group">
            <a href="/claim" class="btn primary btn-lg">Scegli il tuo @</a>
            <a href="/esplora" class="btn secondary btn-lg">Esplora i profili</a>
          </div>
          <p class="hero-trust" aria-live="polite">{{total_users}} persone hanno già il loro @</p>
        </div>
        <figure class="hero-visual" aria-label="Esempio di card profilo 18kbio">
          <img src="/assets/hero-card-demo.png" alt="Esempio di card profilo 18kbio con foto, @ e pulsante mostra la mia carta" width="320" height="560" loading="eager">
        </figure>
      </div>
    </section>

    <!-- PROBLEMA -->
    <section id="problema" class="section" aria-labelledby="problema-title">
      <div class="container text-center">
        <h2 id="problema-title" class="section-title">I tuoi link sono sparsi ovunque.</h2>
        <p class="section-body">Instagram, TikTok, Discord, YouTube: ognuno ha la sua bio, nessuna li unisce.</p>
      </div>
    </section>

    <!-- SOLUZIONE -->
    <section id="soluzione" class="section" aria-labelledby="soluzione-title">
      <div class="container text-center">
        <h2 id="soluzione-title" class="section-title">18kbio li riunisce in un indirizzo solo tuo.</h2>
        <p class="section-body">Una pagina personale con il tuo @, i tuoi link, la tua musica e il tuo stile. La condividi ovunque con un solo link.</p>
      </div>
    </section>

    <!-- COME FUNZIONA -->
    <section id="come-funziona" class="section" aria-labelledby="come-funziona-title">
      <div class="container">
        <header class="text-center">
          <h2 id="come-funziona-title" class="section-title">Come funziona in tre passi</h2>
        </header>
        <ol class="steps-grid" role="list">
          <li class="step-card">
            <span class="step-number" aria-hidden="true">1</span>
            <h3 class="step-title">Scegli il tuo @</h3>
            <p class="step-desc">Cerca un nome libero su 18kbio.xyz e registralo in 30 secondi.</p>
            <figure class="step-visual"><img src="/assets/step1-claim.png" alt="Pagina registrazione @ con input e bottone" loading="lazy"></figure>
          </li>
          <li class="step-card">
            <span class="step-number" aria-hidden="true">2</span>
            <h3 class="step-title">Personalizza</h3>
            <p class="step-desc">Colori, font, sfondo, foto, video, musica, link, sezioni. Vedi le modifiche in tempo reale.</p>
            <figure class="step-visual"><img src="/assets/step2-editor.png" alt="Editor aperto con pannello stili a sinistra e anteprima a destra" loading="lazy"></figure>
          </li>
          <li class="step-card">
            <span class="step-number" aria-hidden="true">3</span>
            <h3 class="step-title">Condividi</h3>
            <p class="step-desc">Copia 18kbio.xyz/tuonome e mettilo in bio, nelle storie, su Discord, dove vuoi.</p>
            <figure class="step-visual"><img src="/assets/step3-share.png" alt="Profilo finito con bottone copia link evidenziato" loading="lazy"></figure>
          </li>
        </ol>
      </div>
    </section>

    <!-- FUNZIONALITÀ CHIAVE -->
    <section id="funzionalita" class="section" aria-labelledby="funzionalita-title">
      <div class="container">
        <header class="text-center">
          <h2 id="funzionalita-title" class="section-title">Quattro cose che puoi fare</h2>
        </header>
        <ul class="features-grid" role="list">
          <li class="feature-card">
            <h3 class="feature-title">La tua card</h3>
            <p class="feature-desc">Un biglietto da visita digitale con il tuo @, foto e sticker: si apre con un tap.</p>
          </li>
          <li class="feature-card">
            <h3 class="feature-title">Statistiche vere</h3>
            <p class="feature-desc">Visite, click, provenienza, dispositivi — nella tua dashboard, aggiornate ogni giorno.</p>
          </li>
          <li class="feature-card">
            <h3 class="feature-title">Stile tuo</h3>
            <p class="feature-desc">20 font, 8 effetti testo, colori liberi, foto/GIF/video fino a 40 MB.</p>
          </li>
          <li class="feature-card">
            <h3 class="feature-title">Musica integrata</h3>
            <p class="feature-desc">Un player sulla pagina: i visitatori ascoltano senza uscire.</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- PROVE SOCIALI -->
    <section id="prove-sociali" class="section" aria-labelledby="prove-title">
      <div class="container">
        <header class="text-center">
          <h2 id="prove-title" class="section-title">Chi usa 18kbio</h2>
          <p class="section-body" aria-live="polite">{{total_users}} persone hanno già il loro @</p>
        </header>
        <div class="profiles-carousel" role="list" aria-label="Profili reali">
          <!-- 3 profili reali, server-side rendered -->
        </div>
      </div>
    </section>

    <!-- PREZZI -->
    <section id="prezzi" class="section" aria-labelledby="prezzi-title">
      <div class="container">
        <header class="text-center">
          <h2 id="prezzi-title" class="section-title">Scegli il tuo piano</h2>
          <p class="section-body">Gratis per sempre. Premium è un pagamento unico, niente abbonamenti.</p>
        </header>
        <div class="pricing-table" role="list">
          <!-- 2 tier: Gratis, Premium -->
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="section" aria-labelledby="faq-title">
      <div class="container">
        <header class="text-center">
          <h2 id="faq-title" class="section-title">Domande frequenti</h2>
        </header>
        <dl class="faq-list">
          <!-- 5 FAQ items -->
        </dl>
      </div>
    </section>

    <!-- CTA FINALE -->
    <section id="cta-finale" class="section cta-section" aria-labelledby="cta-title">
      <div class="container text-center">
        <h2 id="cta-title" class="section-title">Il tuo @ ti aspetta.</h2>
        <a href="/claim" class="btn primary btn-lg">Scegli il tuo @</a>
      </div>
    </section>
  </main>

  <footer class="footer" role="contentinfo">
    <div class="container footer-grid">
      <nav class="footer-col" aria-label="Prodotto">
        <h3>Prodotto</h3>
        <ul role="list"><li><a href="/esplora">Esplora profili</a></li><li><a href="/funzionalita">Funzionalità</a></li><li><a href="/prezzi">Prezzi</a></li><li><a href="/changelog">Changelog</a></li><li><a href="/status">Status</a></li></ul>
      </nav>
      <nav class="footer-col" aria-label="Azienda">
        <h3>Azienda</h3>
        <ul role="list"><li><a href="/chi-siamo">Chi siamo</a></li><li><a href="/blog">Blog</a></li><li><a href="/lavora-con-noi">Lavora con noi</a></li><li><a href="/stampa">Stampa</a></li></ul>
      </nav>
      <nav class="footer-col" aria-label="Legale">
        <h3>Legale</h3>
        <ul role="list"><li><a href="/termini">Termini</a></li><li><a href="/privacy">Privacy</a></li><li><a href="/cookie">Cookie</a></li><li><a href="/contatti">Contatti</a></li></ul>
      </nav>
      <nav class="footer-col" aria-label="Community">
        <h3>Community</h3>
        <ul role="list"><li><a href="https://discord.gg/18k" target="_blank" rel="noopener">Discord</a></li><li><a href="https://twitter.com/18kbio" target="_blank" rel="noopener">Twitter/X</a></li><li><a href="https://github.com/18kbio" target="_blank" rel="noopener">GitHub</a></li></ul>
      </nav>
    </div>
    <p class="copyright">© 2025 18kbio. Tutti i diritti riservati.</p>
  </footer>
</body>
</html>
```

---

## 5. REGOLE DI IMPLEMENTAZIONE — Non negoziabili

| Regola | Verifica |
|---|---|
| **Nessun numero hardcoded** | `{{total_users}}`, `{{premium_price}}` renderizzati server-side |
| **Nessun testo finto** | Screenshot reali, profili reali con permesso, numeri veri |
| **Una sola lingua** | Tutto in italiano. Niente inglese mischiato (via "Free", "Premium" come titoli sezione). |
| **CTA primaria una per sezione** | Hero, CTA finale = primary. Altre = secondary o ghost. |
| **Mobile first** | Hero visibile senza scroll su iPhone SE (375×667). Test obbligatorio. |
| **Accessibilità AA** | Contrasto ≥ 4.5:1, focus-visible su tutti gli interattivi, alt su tutte le immagini, landmark ARIA, heading hierarchy corretta. |
| **Performance** | LCP < 2.5s, CLS < 0.1, TBT < 200ms. Immagini WebP/AVIF, lazy tranne hero, font `font-display: swap`, CSS critico inline. |
| **Nessun riferimento a Discord per pagamenti** | Premium = pagina prezzi con bottone acquisto. Stripe/Paddle/quello che decide Cristiano. |
| **Footer legale completo** | Termini, Privacy, Cookie, Contatti linkati e raggiungibili. |
| **Meta tags completi** | title, description, og:title, og:description, og:image, og:url, twitter:card. |

---

## 6. ASSET RICHIESTI — Da preparare prima del dev

| Asset | Specifica | Quantità |
|---|---|---|
| Hero card screenshot | 320×560px, PNG/WebP, card **aperta** con «mostra la mia carta» | 1 |
| Step 1 claim @ | 160×280px, pagina registrazione | 1 |
| Step 2 editor | 160×280px, editor aperto pannello stili | 1 |
| Step 3 share | 160×280px, profilo finito con copia link | 1 |
| 3 profili reali | 400×600px ciascuno, con **permesso scritto** | 3 |
| Favicon set | 16, 32, 48, 192, 512px + SVG | 1 set |
| OG image | 1200×630px, brand + tagline | 1 |

---

## 7. CHECKLIST ACCETTAZIONE — Prima del deploy

- [ ] Hero: titolo, sottotitolo, CTA primaria visibili senza scroll su mobile (375px height)
- [ ] CTA primaria «Scegli il tuo @» porta a `/claim` e funziona
- [ ] Navbar: link Esplora, Funzionalità, Prezzi, Accedi, Crea il tuo @ funzionanti
- [ ] Sezione Problema → Soluzione → Come funziona in ordine, copy esatto
- [ ] 4 funzionalità chiave, copy esatto
- [ ] Contatore utenti = query DB reale, non hardcoded
- [ ] 3 profili reali con screenshot + quote + permesso documentato
- [ ] Tabella prezzi: Gratis vs Premium, placeholder `{{premium_price}}` sostituito
- [ ] 5 FAQ, copy esatto
- [ ] CTA finale identica a hero
- [ ] Footer: 4 colonne + copyright, tutti i link legali funzionanti
- [ ] Termini, Privacy, Cookie, Contatti pagine esistenti e linkate
- [ ] Nessun testo inglese in pagina italiana
- [ ] Nessun numero finto, nessun «esempio» dichiarato
- [ ] Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 90, SEO ≥ 90
- [ ] Test cross-browser: Chrome, Firefox, Safari (ultime 2 versioni)
- [ ] Test device: iPhone SE, iPhone 15 Pro, Galaxy S23, iPad, Desktop 1440px

---

## 8. PROMPT PER IL MODELLO/DEVELOPER — Copia-incolla

```
# Build: 18kbio.xyz Landing Page — Specifica Completa

## Obiettivo
Costruire la landing page di 18kbio.xyz pronta per il rilascio pubblico. La pagina deve essere ambiziosa, seria, professionale. Questa specifica è l'unico riferimento: se non è scritto qui, non si fa.

## Cosa consegnare
1. HTML semantico, accessibile (WCAG AA), mobile-first
2. CSS con design tokens (custom properties) come da spec
3. Componenti riutilizzabili: Button, Card, Section, Navbar, Footer, PricingTable, FAQItem, SocialProof
4. Zero JavaScript per il rendering (solo enhancement: navbar mobile, FAQ accordion, carousel profili)
5. Server-side rendering per `{{total_users}}` e `{{premium_price}}`
6. Asset ottimizzati (WebP/AVIF, lazy loading, preload hero)

## Copy e struttura
USA ESATTAMENTE i testi, l'ordine dei blocchi e la struttura HTML forniti nella specifica. Non riscrivere, non accorciare, non aggiungere.

## Design tokens
Implementa ESATTAMENTE i token CSS forniti. Colori, tipografia (Space Grotesk + Inter), spazi, radius, ombre, transizioni.

## Regole non negoziabili
- Nessun numero hardcoded (total_users, premium_price = server-side)
- Nessun testo finto (screenshot reali, profili reali con permesso)
- Una sola lingua: italiano
- Una CTA primaria per sezione (primary button), altre secondary/ghost
- Hero visibile senza scroll su mobile (≤667px viewport height)
- Accessibilità AA: contrasto, focus-visible, alt, landmark ARIA, heading hierarchy
- Performance: LCP < 2.5s, CLS < 0.1, TBT < 200ms
- Nessun riferimento a Discord per pagamenti
- Footer legale completo: Termini, Privacy, Cookie, Contatti
- Meta tags completi (OG, Twitter, description)

## Asset richiesti (da fornire prima)
- Hero card 320×560px (card aperta)
- 3 step screenshots 160×280px
- 3 profili reali 400×600px + permesso scritto
- Favicon set + OG image 1200×630px

## Checklist accettazione (obbligatoria prima del merge)
Vedi sezione 7 della specifica. Tutti i 20 item devono passare.

## Fuori scope
- Dashboard, editor, claim flow, auth, API, backend
- Qualsiasi pagina diversa dalla landing (/)
- A/B testing, analytics (si aggiungono dopo il lancio)

## Consegna
PR su main con: HTML, CSS, componenti, asset, README con istruzioni deploy e variabili d'ambiente (TOTAL_USERS_QUERY, PREMIUM_PRICE_CENTS).
```

---

## 9. VARIABILI D'AMBIENTE PER IL DEPLOY

```env
# Rendering server-side
TOTAL_USERS_QUERY="SELECT COUNT(*) FROM users WHERE deleted_at IS NULL"
PREMIUM_PRICE_CENTS=299  # €2.99 = 299 centesimi, decide Cristiano

# Analytics (post-lancio)
PLAUSIBLE_DOMAIN=18kbio.xyz
# o GA4, o niente al lancio
```

---

## Prossimo passo
Se vuoi, genero lo scaffolding HTML/CSS/Componenti in una branch della repo di lavoro (`sigari.bio` o dove sta il progetto 18kbio). Dimmi tu.