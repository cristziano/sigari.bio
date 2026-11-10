# 18k.bio — DESIGN

The site's visual rules. Every page follows them; the values live in `ui.css`.
Sources: the Taste, Impeccable (craft floor) and Emil Kowalski (design engineering) skills, plus Cristiano's own rules.

## Identity (keep)
- Black and white. Geist for text, Geist Mono **only** for @handles, links, numbers and code. Unbounded only for the "18k.bio" logo.
- The WebGL smoke behind the page, soft (stronger in the hero, faint after).
- User profiles keep their own colours: these rules are for the site around them.

## Never
- Labels above titles ("eyebrow"/kicker) and section numbers like "01 / funzioni".
- A fade, slide or pixel reveal on every section; parallax on text; scroll-jacking; random blinking.
- Glow, halos (zero-offset shadows), gradient text, glass/blur as decoration.
- Strips or tickers that scroll forever.
- Same-size cards of icon + title + text as the structure of a section (use an editorial list).
- Monospace used as a costume for "technical".
- Purple/lavender in the site's own design.
- Captions under pictures.

## Always
- Contrast: body text ≥ 4.5:1 (`--ui-fg`, `--ui-muted`), large grey title halves ≥ 3:1 (`--ui-quiet`).
- One button pair (`.ui-btn` white, `.ui-btn-2` outline), one card style (`.ui-card`), one radius scale (8 / 12 / 18 / pill).
- Controls at least 44px tall on touch; every control has a name; focus ring visible.
- Motion: custom curves (`--ui-ease-out` for enter/exit, `--ui-ease-in-out` for movement), UI under 300ms,
  press = `scale(.97)`, never animate from `scale(0)`, hover effects only under `(hover: hover) and (pointer: fine)`,
  stagger 30–80ms, exit faster than enter. Only `transform` and `opacity` for anything that runs often.
- One authored motion moment per page (landing: the 3D card of @1); the hero enters once on load.
- Under `prefers-reduced-motion` everything rests and nothing stays hidden.
- Browser surfaces in style: selection, caret, scrollbar, focus ring, tabular numbers.
- Grey half of a heading is its own sentence ("Il meglio. Già attivo.").

## Modes
- Landing, login: **Persuade** — one idea per screen, the claim box in the hero.
- Dashboard: **Operate** — scannable, consistent, quiet; brand only in details.
- Profile pages: the user's world; the site only frames it.
