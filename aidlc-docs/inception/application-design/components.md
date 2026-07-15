# Components — lighthouse-insights-v2

## Location
`web/src/components/` (UI) · `web/src/services/` (wrappers) · `web/src/lib/` (domain)

## Component catalog

### AppShell
- **Responsibility**: Page frame — logo header, title, Export PDF / Export PPTX / Reset (when report), footer credits
- **Owns**: None of the report data (receives handlers + flags via props)

### ImportSection
- **Responsibility**: Stitch Import UX — drop zone, file input, paste, analyze, how-to steps, error display
- **Owns**: Local drag-depth / paste-busy UI only; JSON text may be controlled from page

### DashboardSection
- **Responsibility**: Overall Site Health gauge, Quick Wins cards, Category Breakdown grid
- **Owns**: Presentational; receives scores, quickWins, categories; emits `onSelectCategory(id)`

### CategoryDetailSection
- **Responsibility**: Inline expanded detail below category grid when a category is selected (US-08-A)
- **Owns**: Presentational — score, status badge, short “what this means”, filtered issues preview optional

### IssueList
- **Responsibility**: Virtualized list of expandable issue cards (Top recommendations + Diagnostics)
- **Owns**: Virtualizer scrollport; expand state is per-`<details>`

### ScoreRing
- **Responsibility**: Shared circular gauge with score color thresholds
- **Owns**: None

### PrintableReport
- **Responsibility**: Print-only markup for PDF export (existing behavior)
- **Owns**: None

### page.tsx (composer)
- **Responsibility**: Hold `jsonText`, `report`, `error`, `selectedCategoryId`, parsing/export flags; compose sections; `#print-root`

## Explicit non-components (this bolt)
- No sidebar / bottom nav / Settings / Recent Reports / avatar
