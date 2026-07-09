# Blanka Koji — Interactive CV Dashboard

A hand-built, zero-dependency interactive CV: a single-page dashboard with an
embedded assistant that answers questions about Blanka's experience, impact,
education and skills — entirely in the visitor's browser.

**Live:** deploy `/` as a static site (Vercel, Netlify, GitHub Pages — no build step).

## What's inside

| Area | What it does |
|---|---|
| **Hero + KPI tiles** | Animated count-up stats; every figure traces to a CV line (shown under each tile) |
| **Career strip** | Custom SVG timeline 2018 → today with hover/focus tooltips |
| **Experience timeline** | Expandable role cards, role-progression stepper (intern → Manager) |
| **Impact explorer** | Filterable engagement cards + a value-identified bar chart with chart/table toggle |
| **Skills, with receipts** | No star ratings — clicking a skill lists the engagements that evidence it, deep-linking into the Impact grid |
| **CV assistant** | Client-side retrieval chat: tokeniser, synonym canonicalisation, light stemming, bounded-Levenshtein fuzzy matching, weighted keyword + regex-intent scoring, graceful fallback |
| **Command palette** | `⌘K` / `Ctrl+K` — jump to sections, toggle theme, copy email, ask the assistant |
| **60-second tour** | Spotlight walkthrough of the page with auto-advance (pauses on hover, arrow-key navigable, ends in the chat) |
| **Extras** | Light/dark theming with a View Transitions circular reveal, animated chart-line hero, pointer-tracking card glows, scroll progress bar, vCard download, copy-email, print stylesheet, reduced-motion support |

## Architecture

```
index.html          Semantic shell — all content rendered from data
css/styles.css      Design tokens (light/dark via [data-theme]) + components
js/data.js          Single source of truth: PROFILE model + chat knowledge base
js/charts.js        Hand-rolled SVG charts (bar chart, career strip) + tooltips
js/chat.js          Retrieval engine (ChatEngine) + chat UI (ChatUI)
js/app.js           Rendering, theme, filters, evidence links, ⌘K palette
```

Principles:

- **One data model.** Every section — hero, timeline, impact cards, skills,
  chat answers — renders from `js/data.js`. Update the CV there; the UI follows.
- **No dependencies.** No frameworks, no chart libraries, no fonts fetched, no
  tracking. First paint is one HTML + one CSS file.
- **Honest data-viz.** Single-measure magnitude → one-hue sequential ramp
  (more-is-darker), direct labels, an accessible table view behind a toggle,
  and no invented numbers (skills have evidence links instead of fake percentages).
- **Private by design.** The assistant is a deterministic retrieval engine over
  a structured knowledge base — questions never leave the page.
- **Accessible.** Keyboard-completable (palette, chat, chart rows are focusable
  with tooltips on focus), `aria-live` chat stream, `prefers-reduced-motion`
  honoured, safe DOM insertion (`textContent` everywhere; markdown-lite renders
  only after HTML-escaping).

## Updating the content

Edit `js/data.js`:

- `PROFILE` — roles, engagements, education, stats (each stat carries a `basis`
  so the number stays auditable).
- `CHAT_KB` — one entry per topic the assistant can answer: regex intents,
  weighted keywords, a markdown-lite answer, follow-up suggestions.
- `CHAT_SYNONYMS` — query-token canonicalisation ("uni" → "university").

## Running locally

Any static server works:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```
