export type CategoryId =
  | "performance"
  | "accessibility"
  | "best-practices"
  | "seo"
  | (string & {});

export type ScoreDisplayMode =
  | "numeric"
  | "binary"
  | "notApplicable"
  | "informative"
  | "metricSavings"
  | "manual"
  | (string & {});

export type AuditDetailsType =
  | "table"
  | "opportunity"
  | "debugdata"
  | "screenshot"
  | "filmstrip"
  | (string & {});

export interface AuditHeading {
  key?: string;
  valueType?: string;
  label?: string;
  subItemsHeading?: { key?: string; valueType?: string; label?: string };
}

export interface AuditDetails {
  type?: AuditDetailsType;
  items?: unknown[];
  headings?: AuditHeading[];
  overallSavingsMs?: number;
  overallSavingsBytes?: number;
  metricSavings?: Record<string, unknown>;
  debugData?: unknown;
  guidanceLevel?: number;
  data?: string; // screenshot data URL
}

export interface Audit {
  id?: string;
  title: string;
  description?: string;
  manualDescription?: string;
  score?: number | null;
  scoreDisplayMode?: ScoreDisplayMode;
  numericValue?: number;
  numericUnit?: string;
  displayValue?: string;
  details?: AuditDetails;
}

export interface AuditRef {
  id: string;
  weight?: number;
  group?: string;
  acronym?: string;
}

export interface LighthouseCategory {
  title?: string;
  description?: string;
  manualDescription?: string;
  score?: number | null;
  auditRefs?: AuditRef[];
}

export interface LighthouseReport {
  requestedUrl?: string;
  finalDisplayedUrl?: string;
  fetchTime?: string;
  categories?: Record<string, LighthouseCategory>;
  audits?: Record<string, Audit>;
  categoryGroups?: Record<
    string,
    {
      title?: string;
      description?: string;
    }
  >;
}

export interface EvidenceSummary {
  type?: AuditDetailsType;
  summary: string;
  bullets?: string[];
}

export interface RecommendationItem {
  auditId: string;
  categoryId: CategoryId;
  group?: string;
  weight: number;
  score?: number | null;
  scoreDisplayMode?: ScoreDisplayMode;
  displayValue?: string;
  title: string;
  explain: string; // "Explain the problem"
  nextSteps: string[];
  evidence?: EvidenceSummary;
  priority: number; // used for Top 10 ordering
}

export interface DiagnosticsItem {
  auditId: string;
  categoryId: CategoryId;
  title: string;
  score?: number | null;
  scoreDisplayMode?: ScoreDisplayMode;
  displayValue?: string;
  explain: string;
  evidence?: EvidenceSummary;
}

const CATEGORY_ORDER: CategoryId[] = [
  "performance",
  "accessibility",
  "best-practices",
  "seo",
];

function collapseWhitespace(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

function stripMarkdownLinks(input: string): string {
  // Turns: "Improve [stuff](url)" -> "Improve stuff"
  return input.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

function normalizeText(input: string): string {
  return collapseWhitespace(stripMarkdownLinks(input));
}

function splitIntoSentences(input: string): string[] {
  const normalized = normalizeText(input);
  if (!normalized) return [];
  // Basic sentence split: period + space, exclamation, question.
  return normalized
    .split(/(?<=[.!?])\s+/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function toScorePct(score: number | null | undefined): number | null {
  if (score === null || score === undefined || Number.isNaN(score)) return null;
  // Lighthouse scores are usually 0..1 for numeric/binary; convert to 0..100.
  return Math.max(0, Math.min(100, score * 100));
}

function computePriority(auditScore: number | null | undefined, weight: number) {
  const scorePct = toScorePct(auditScore);
  if (scorePct === null) return 0;
  const severity = (100 - scorePct) / 100; // 0..1
  const w = weight > 0 ? weight : 1;
  return severity * w;
}

function evidenceFromDetails(audit: Audit): EvidenceSummary | undefined {
  const type = audit.details?.type;
  const items = audit.details?.items ?? [];
  const headings = audit.details?.headings ?? [];

  const title = audit.title ?? "Item";

  if (!type) return undefined;

  if (type === "opportunity") {
    const overallSavingsMs = audit.details?.overallSavingsMs;
    const overallSavingsBytes = audit.details?.overallSavingsBytes;
    const top3 = items.slice(0, 3);
    const bullets = top3.map((unknownItem) => {
      const it = unknownItem as Record<string, unknown> | undefined;
      const maybeUrl = typeof it?.url === "string" ? `URL: ${it.url}` : "";
      const wastedBytes = typeof it?.wastedBytes === "number" ? `Estimated savings: ${formatBytes(it.wastedBytes)}` : "";
      const totalBytes = typeof it?.totalBytes === "number" ? `Total: ${formatBytes(it.totalBytes)}` : "";
      const responseTime =
        typeof it?.responseTime === "number"
          ? `Time spent: ${Math.round(it.responseTime)} ms`
          : "";
      const expectedSize = typeof it?.expectedSize === "string" ? `Expected: ${it.expectedSize}` : "";
      const actualSize = typeof it?.actualSize === "string" ? `Actual: ${it.actualSize}` : "";
      const displayedSize = typeof it?.displayedSize === "string" ? `Displayed: ${it.displayedSize}` : "";
      const parts = [maybeUrl, responseTime, wastedBytes, totalBytes, expectedSize, actualSize, displayedSize].filter(Boolean);
      return parts.join(" · ");
    });

    const summaryParts: string[] = [];
    if (typeof overallSavingsMs === "number" && overallSavingsMs > 0) {
      summaryParts.push(`Overall savings (ms): ${Math.round(overallSavingsMs)}`);
    }
    if (typeof overallSavingsBytes === "number" && overallSavingsBytes > 0) {
      summaryParts.push(`Overall savings (bytes): ${formatBytes(overallSavingsBytes)}`);
    }
    const summary = summaryParts.length ? summaryParts.join(" · ") : `Opportunity details for ${title}`;

    return {
      type,
      summary,
      bullets: bullets.length ? bullets : undefined,
    };
  }

  if (type === "table") {
    const top3 = items.slice(0, 3);
    const rowToText = (row: Record<string, unknown>) => {
      if (!headings.length) return JSON.stringify(row).slice(0, 140);
      const visible = headings.slice(0, 4).map((h) => {
        const key = h.key as string | undefined;
        if (!key) return null;
        const label = h.label ?? key;
        const val = row[key];
        const display =
          typeof val === "string" || typeof val === "number" ? String(val) : "";
        return display ? `${label}: ${display}` : null;
      });
      return visible.filter(Boolean).join(" · ");
    };

    return {
      type,
      summary: `Evidence table (${top3.length} row(s) preview)`,
      bullets: top3
        .map((r) => (r && typeof r === "object" ? rowToText(r as Record<string, unknown>) : ""))
        .filter(Boolean),
    };
  }

  if (type === "debugdata") {
    const first = items[0];
    if (!first || typeof first !== "object")
      return { type, summary: "Debug data (no preview available)" };
    const entries = Object.entries(first).slice(0, 6);
    const bullets = entries.map(([k, v]) => `${k}: ${formatMaybeSimpleValue(v)}`);
    return {
      type,
      summary: "Debug data (preview key/value pairs)",
      bullets,
    };
  }

  if (type === "screenshot") {
    return {
      type,
      summary: "Screenshot evidence available in details (avoid rendering in PDF by default).",
    };
  }

  return { type, summary: `Evidence type: ${type}` };
}

function formatMaybeSimpleValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") return Number.isInteger(value) ? String(value) : String(Math.round(value * 1000) / 1000);
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "string") return value.length > 120 ? value.slice(0, 120) + "…" : value;
  try {
    return JSON.stringify(value).slice(0, 160);
  } catch {
    return String(value);
  }
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes)) return "";
  const units = ["B", "KiB", "MiB", "GiB"];
  let v = bytes;
  let idx = 0;
  while (v >= 1024 && idx < units.length - 1) {
    v /= 1024;
    idx++;
  }
  const decimals = idx === 0 ? 0 : 1;
  return `${v.toFixed(decimals)} ${units[idx]}`;
}

function buildExplain(audit: Audit): string {
  if (audit.manualDescription) return normalizeText(audit.manualDescription);
  if (audit.description) return normalizeText(audit.description);
  return "";
}

function buildNextSteps(audit: Audit, maxBullets = 5): string[] {
  const source = audit.manualDescription ?? audit.description;
  if (!source) return [];
  const sentences = splitIntoSentences(source);
  // Heuristic: drop the last "Learn more" style sentence if present.
  const filtered = sentences.filter(
    (s) =>
      !/learn more/i.test(s) &&
      !/\[learn more\]/i.test(s) &&
      !/https?:\/\//i.test(s)
  );
  const bullets = filtered.slice(0, maxBullets);
  return bullets;
}

export function parseLighthouseJson(input: string): LighthouseReport {
  const obj = JSON.parse(input) as LighthouseReport;
  if (!obj || typeof obj !== "object") throw new Error("Invalid JSON object");
  if (!obj.categories || !obj.audits) throw new Error("Missing lighthouse fields: categories/audits");
  return obj;
}

export function getCategoryScores(report: LighthouseReport) {
  const categories = report.categories ?? {};
  return CATEGORY_ORDER.filter((id) => categories[id]).map((id) => {
    const cat = categories[id]!;
    const scorePct = toScorePct(cat.score ?? null);
    return {
      id,
      title: cat.title ?? id,
      score: typeof cat.score === "number" ? cat.score : null,
      scorePct,
    };
  });
}

export function buildTopRecommendations(report: LighthouseReport, n: number): RecommendationItem[] {
  const audits = report.audits ?? {};
  const categories = report.categories ?? {};

  const auditRefs: Array<{
    auditId: string;
    categoryId: CategoryId;
    weight: number;
    group?: string;
  }> = [];

  for (const [categoryIdRaw, category] of Object.entries(categories)) {
    const categoryId = categoryIdRaw as CategoryId;
    const refs = category.auditRefs ?? [];
    for (const ref of refs) {
      auditRefs.push({
        auditId: ref.id,
        categoryId,
        weight: typeof ref.weight === "number" ? ref.weight : 1,
        group: ref.group,
      });
    }
  }

  const items: RecommendationItem[] = auditRefs
    .map((ref) => {
      const audit = audits[ref.auditId];
      if (!audit) return null;

      const score = audit.score ?? null;
      const scoreDisplayMode = audit.scoreDisplayMode;
      const isNotApplicable = scoreDisplayMode === "notApplicable" || score === null;

      if (isNotApplicable) {
        // Exclude from Top 10 but it can still appear in diagnostics.
        return null;
      }

      const priority = computePriority(score, ref.weight);
      if (priority <= 0) {
        // If score is very high -> not impactful.
        return null;
      }

      const explain = buildExplain(audit);
      const nextSteps = buildNextSteps(audit);
      const evidence = evidenceFromDetails(audit);

      return {
        auditId: ref.auditId,
        categoryId: ref.categoryId,
        group: ref.group,
        weight: ref.weight,
        score,
        scoreDisplayMode,
        displayValue: audit.displayValue,
        title: audit.title,
        explain,
        nextSteps,
        evidence,
        priority,
      } satisfies RecommendationItem;
    })
    .filter(Boolean) as RecommendationItem[];

  items.sort((a, b) => b.priority - a.priority);
  return items.slice(0, n);
}

export function buildDiagnostics(report: LighthouseReport): DiagnosticsItem[] {
  const audits = report.audits ?? {};
  const categories = report.categories ?? {};
  const diagnostics: DiagnosticsItem[] = [];

  for (const [categoryIdRaw, category] of Object.entries(categories)) {
    const categoryId = categoryIdRaw as CategoryId;
    const refs = category.auditRefs ?? [];
    const diagnosticRefs = refs.filter((r) => r.group === "diagnostics");
    for (const ref of diagnosticRefs) {
      const audit = audits[ref.id];
      if (!audit) continue;
      const explain = buildExplain(audit);
      const evidence = evidenceFromDetails(audit);
      diagnostics.push({
        auditId: ref.id,
        categoryId,
        title: audit.title,
        score: audit.score ?? null,
        scoreDisplayMode: audit.scoreDisplayMode,
        displayValue: audit.displayValue,
        explain,
        evidence,
      });
    }
  }

  // Keep stable ordering (severity first) where possible.
  diagnostics.sort((a, b) => {
    const aScore = a.score ?? null;
    const bScore = b.score ?? null;
    const aPct = toScorePct(aScore);
    const bPct = toScorePct(bScore);
    if (aPct === null && bPct === null) return a.title.localeCompare(b.title);
    if (aPct === null) return 1;
    if (bPct === null) return -1;
    return (aPct < bPct ? -1 : aPct > bPct ? 1 : 0);
  });

  return diagnostics;
}

export function buildAdditionalIssues(
  report: LighthouseReport,
  excludeAuditIds: Set<string>,
  max: number
): DiagnosticsItem[] {
  const audits = report.audits ?? {};
  const categories = report.categories ?? {};

  const items: Array<{ diag: DiagnosticsItem; priority: number }> = [];

  for (const [categoryIdRaw, category] of Object.entries(categories)) {
    const categoryId = categoryIdRaw as CategoryId;
    const refs = category.auditRefs ?? [];
    for (const ref of refs) {
      if (excludeAuditIds.has(ref.id)) continue;
      const audit = audits[ref.id];
      if (!audit) continue;

      const score = audit.score ?? null;
      const scoreDisplayMode = audit.scoreDisplayMode;

      const isNotApplicable = scoreDisplayMode === "notApplicable";
      if (isNotApplicable) continue;

      const isManual = scoreDisplayMode === "manual";
      const isRealIssue = typeof score === "number" ? score < 1 : isManual;

      if (!isRealIssue) continue;

      const priority =
        typeof score === "number"
          ? computePriority(score, typeof ref.weight === "number" ? ref.weight : 1)
          : // manual items have no numeric score; still give them a baseline priority
            (ref.weight && ref.weight > 0 ? ref.weight : 1) * 0.6;

      if (priority <= 0) continue;

      const explain = buildExplain(audit);
      const evidence = evidenceFromDetails(audit);

      items.push({
        priority,
        diag: {
          auditId: ref.id,
          categoryId,
          title: audit.title,
          score,
          scoreDisplayMode,
          displayValue: audit.displayValue,
          explain,
          evidence,
        },
      });
    }
  }

  items.sort((a, b) => b.priority - a.priority);
  return items.slice(0, max).map((x) => x.diag);
}

export function formatTopScore(score: number | null | undefined): string {
  const pct = toScorePct(score ?? null);
  if (pct === null) return "n/a";
  return `${Math.round(pct)}%`;
}

export function formatFetchTime(fetchTime?: string): string {
  if (!fetchTime) return "";
  const d = new Date(fetchTime);
  if (Number.isNaN(d.getTime())) return fetchTime;
  return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

