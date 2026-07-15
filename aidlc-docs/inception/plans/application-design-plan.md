# Application Design Plan — lighthouse-insights-v2

Fill every `[Answer]:`, then reply **Plan approved**. Design artifacts are generated after approval.

---

## Checklist (after approval)

- [x] `aidlc-docs/inception/application-design/components.md`
- [x] `aidlc-docs/inception/application-design/component-methods.md`
- [x] `aidlc-docs/inception/application-design/services.md`
- [x] `aidlc-docs/inception/application-design/component-dependency.md`

---

## Proposed component map (baseline)

| Component | Responsibility |
|-----------|----------------|
| `AppShell` | Logo header, export/reset actions, footer, page frame |
| `ImportSection` | Drop zone, paste, analyze, how-to |
| `DashboardSection` | Overall health, Quick Wins, category breakdown |
| `CategoryDetailSection` | Large gauge + “what this means” for selected category |
| `IssueList` | Virtualized expandable issue cards |
| `ScoreRing` | Circular score gauge (shared) |
| `lighthouse.ts` | Parse + rankings + `getOverallHealthScore` |
| `pptx.ts` / `PrintableReport` | Unchanged export engines |
| `page.tsx` | Compose sections + hold report state |

---

## Question 1 — Component organization

A) Place UI under `web/src/components/` (recommended)

B) Place under `web/app/_components/`

C) Keep most UI in `page.tsx`; extract only VirtualIssueList + ScoreRing

X) Other (please describe after [Answer]: tag below)

[Answer]: 
A
---

## Question 2 — Category detail UX (US-08)

A) Clicking a Category Breakdown card expands an inline detail block below the grid (same page)

B) Clicking scrolls to / reveals a dedicated Category Detail section further down the page

C) Skip interactive category selection for this bolt — show static Performance-style detail using Performance score only

X) Other (please describe after [Answer]: tag below)

[Answer]: 
A
---

## Question 3 — State ownership

A) Keep all report/UI state in `page.tsx` and pass props down (simple, recommended)

B) Introduce a small React context provider for report + selected category

X) Other (please describe after [Answer]: tag below)

[Answer]: 
A
---

## Question 4 — Services layer

For this client-only app, “services” are thin helpers (not HTTP services).

A) Document `ReportAnalysisService` (wraps lighthouse.ts) + `ExportService` (pdf print + pptx) as logical services in services.md — no new runtime classes required

B) Create actual `web/src/services/*.ts` modules wrapping the libs

C) Skip formal services.md content beyond “N/A — libs only”

X) Other (please describe after [Answer]: tag below)

[Answer]: 
B
---

## Question 5 — Motion / polish

Stitch feels static-premium; earlier UI had light transitions.

A) Minimal — hover/shadow only; no entrance animations

B) Light — score ring animate + subtle section fade (2–3 motions)

X) Other (please describe after [Answer]: tag below)

[Answer]: 
B