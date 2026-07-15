# User Stories — lighthouse-insights-v2

**Organization**: User journey (Import → Analyze → Explore → Export)  
**AC style**: Concise checklists  
**Construction hint** (Q5-A): Design system + chrome → Import → Dashboard → Issues → Export verify

---

## Journey 1 — Arrive & orient

### US-01 — Apply Stitch design system
**As a** P1 Analyst, **I want** the app to use Stitch colors, Public Sans, and Material icons **so that** the product feels premium and readable.

**Traces**: FR-01, FR-02, NFR-01, NFR-03

**Acceptance criteria**
- [ ] Background is flat (no tiling gradient seams)
- [ ] Primary / surface tokens match DESIGN.md
- [ ] Public Sans on UI; Courier Prime on JSON textarea
- [ ] Material Symbols Outlined load for key icons

### US-02 — Brand chrome without multi-nav
**As a** P1 Analyst, **I want** a logo header and simple footer **so that** I recognize the product without learning a nav system.

**Traces**: FR-06, FR-07

**Acceptance criteria**
- [ ] Top bar: `logo.svg` (portfolio link) + “Lighthouse Insights”
- [ ] No sidebar; no bottom nav
- [ ] Footer with builder credits / GitHub
- [ ] No user/avatar icons

---

## Journey 2 — Import & analyze

### US-03 — Import Lighthouse JSON (Stitch-styled)
**As a** P1 Analyst, **I want** upload, drag-drop, paste, and analyze actions in a clear Import section **so that** I can load a report in seconds.

**Traces**: FR-03, NFR-02, NFR-06

**Acceptance criteria**
- [ ] Drop zone + file upload + paste JSON + Analyze/Load
- [ ] How-to steps present (Stitch-like)
- [ ] Invalid JSON shows a clear error (no silent failure)
- [ ] No Recent Reports UI

### US-04 — Overall Site Health
**As a** P1 Analyst, **I want** a single overall health score **so that** I can summarize the site at a glance for a client.

**Traces**: FR-04, Q4

**Acceptance criteria**
- [ ] Score = average of available category scorePct values
- [ ] Large gauge + numeric score (no overflow/clipping)
- [ ] Status badge: good / needs improvement / poor by thresholds (90 / 50)

### US-05 — Quick Wins
**As a** P1 Analyst, **I want** a short list of high-impact issues **so that** I can brief clients on priorities first.

**Traces**: FR-04

**Acceptance criteria**
- [ ] Cards derived from top recommendations
- [ ] Impact badge (e.g. High / Medium) from severity
- [ ] Show `displayValue` / savings text when available
- [ ] Empty state if no recommendations

### US-06 — Category Breakdown
**As a** P1 Analyst, **I want** four category gauges **so that** I can see Performance / A11y / Best Practices / SEO balance.

**Traces**: FR-04

**Acceptance criteria**
- [ ] Four cards with rings + labels
- [ ] Scores use tabular numerals; no badge overflow
- [ ] Missing category handled gracefully (hide or n/a)

---

## Journey 3 — Explore issues

### US-07 — Impactful issues & diagnostics
**As a** P1 Analyst, **I want** expandable issue cards with explain / next steps / evidence **so that** I can dig without leaving the page.

**Traces**: FR-05, NFR-04, NFR-05 (XSS)

**Acceptance criteria**
- [ ] Top issues + diagnostics rendered as Stitch-like cards
- [ ] Expand/collapse reveals explain, next steps, evidence
- [ ] Audit strings rendered as text (no `dangerouslySetInnerHTML`)
- [ ] Long lists use virtual scrolling

### US-08 — Category-focused detail pattern
**As a** P1 Analyst, **I want** category-level detail (score + meaning + related issues) patterned after Stitch Performance detail **so that** I can discuss one pillar deeply.

**Traces**: FR-05

**Acceptance criteria**
- [ ] Selecting/focusing a category shows large gauge + short “what this means”
- [ ] Related issues listed for that category (filter existing data)
- [ ] Works within the continuous page (no separate app routes required)

---

## Journey 4 — Export & reset

### US-09 — Export PDF & PPTX
**As a** P1 Analyst (for P2 Stakeholders), **I want** header Export actions **so that** I can deliver familiar PDF/PPTX without redesigning the deck this bolt.

**Traces**: FR-06, Q7, NFR-06

**Acceptance criteria**
- [ ] Export PDF / Export PPTX in results header when report loaded
- [ ] Disabled / hidden when no report
- [ ] Print-root PDF path still works
- [ ] PPTX uses existing pptx.ts content structure
- [ ] PPTX failure shows an error message without crashing the UI

### US-10 — Reset session
**As a** P1 Analyst, **I want** Reset in the header **so that** I can clear JSON and insights for the next client.

**Traces**: FR-06

**Acceptance criteria**
- [ ] Reset clears textarea + parsed report + error
- [ ] Available from header alongside exports (or clearly with them)
- [ ] Returns UI to import-focused empty state

---

## Story count
10 stories (within Standard 8–12). All INVEST-oriented; US-08 depends on shared report state with US-04–07 (acceptable journey coupling).
