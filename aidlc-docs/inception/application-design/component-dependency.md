# Component Dependencies — lighthouse-insights-v2

```mermaid
flowchart TB
  Page["page.tsx"]
  Shell["AppShell"]
  Import["ImportSection"]
  Dash["DashboardSection"]
  Cat["CategoryDetailSection"]
  Issues["IssueList"]
  Ring["ScoreRing"]
  Print["PrintableReport"]
  RA["ReportAnalysisService"]
  EX["ExportService"]
  LH["lighthouse.ts"]
  PPTX["pptx.ts"]

  Page --> Shell
  Page --> Import
  Page --> Dash
  Page --> Cat
  Page --> Issues
  Page --> Print
  Dash --> Ring
  Cat --> Ring
  Issues --> Ring
  Dash --> Cat
  Page --> RA
  Page --> EX
  RA --> LH
  EX --> PPTX
```

## Dependency rules
- **Presentational components** depend only on props + shared `ScoreRing` — never import services directly
- **page.tsx** is the only UI module that calls `ReportAnalysisService` / `ExportService`
- **Services** depend on `lib/*` only — not on React components
- **CategoryDetailSection** appears only when `selectedCategoryId` is set (inline under Dashboard grid)
- **Circular deps forbidden**: components ↛ services ↛ components

## Coupling notes
- Selecting a category updates page state → re-renders Dashboard highlight + CategoryDetailSection + optionally filters IssueList (Construction choice: filter vs show all below)
- Export/Reset disabled when `report === null`
