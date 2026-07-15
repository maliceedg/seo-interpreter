# Component Methods — lighthouse-insights-v2

High-level contracts (TypeScript signatures; implementation in Construction).

## page.tsx (state + handlers)

```ts
// state
jsonText: string
report: LighthouseReport | null
error: string | null
selectedCategoryId: string | null
isParsing: boolean
isExportingPptx: boolean

handleLoadFromText(): Promise<void>
handleLoadFromFile(file: File): Promise<void>
handlePasteJson(): Promise<void>
handleReset(): void
handleExportPdf(): void
handleExportPptx(): Promise<void>
setSelectedCategoryId(id: string | null): void
```

## AppShell props

```ts
type AppShellProps = {
  hasReport: boolean
  isExportingPptx: boolean
  onExportPdf: () => void
  onExportPptx: () => void
  onReset: () => void
  children: React.ReactNode
}
```

## ImportSection props

```ts
type ImportSectionProps = {
  jsonText: string
  onJsonTextChange: (v: string) => void
  error: string | null
  isParsing: boolean
  onAnalyze: () => void
  onUploadFile: (file: File) => void
  onPaste: () => void
}
```

## DashboardSection props

```ts
type DashboardSectionProps = {
  report: LighthouseReport
  overallScorePct: number | null
  quickWins: RecommendationItem[]
  categories: ReturnType<typeof getCategoryScores>
  selectedCategoryId: string | null
  onSelectCategory: (id: string) => void
}
```

## CategoryDetailSection props

```ts
type CategoryDetailSectionProps = {
  category: { id: string; title: string; scorePct: number | null }
  // short static/copy based on score band
}
```

## IssueList props

```ts
type IssueListProps = {
  items: Array<RecommendationItem | DiagnosticsItem>
  mode: "priority" | "score"
}
```

## ScoreRing props

```ts
type ScoreRingProps = {
  scorePct: number | null
  size?: "sm" | "md" | "lg"
}
```

## Domain additions (`lighthouse.ts`)

```ts
getOverallHealthScore(report: LighthouseReport): number | null
// mean of available category scorePct values

getCategoryMeaning(scorePct: number | null): string
// short “what this means” blurb by band
```
