# Services — lighthouse-insights-v2

Runtime modules under `web/src/services/` (wrap existing libs; no HTTP).

## ReportAnalysisService (`web/src/services/reportAnalysis.ts`)

| Method | Behavior |
|--------|----------|
| `parse(jsonText: string): LighthouseReport` | Delegates to `parseLighthouseJson` |
| `getCategoryScores(report)` | Delegates to lib |
| `getOverallHealthScore(report)` | Mean of category scorePct |
| `getTopRecommendations(report, n?)` | `buildTopRecommendations` |
| `getDiagnostics(report, excludeTopIds)` | Diagnostics + additional issues, deduped |

## ExportService (`web/src/services/exportReport.ts`)

| Method | Behavior |
|--------|----------|
| `exportPdf(opts)` | Sets document title + `window.print()` via `#print-root` |
| `exportPptx(opts): Promise<Blob>` | Delegates to `generatePptxReport` |
| `downloadBlob(blob, filename)` | Trigger browser download |

## Notes
- UI calls services from `page.tsx` handlers; presentational components stay prop-driven
- Do not log full Lighthouse JSON on happy paths
