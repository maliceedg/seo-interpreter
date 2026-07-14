"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  buildAdditionalIssues,
  buildDiagnostics,
  buildTopRecommendations,
  formatFetchTime,
  formatTopScore,
  getCategoryScores,
  parseLighthouseJson,
  type DiagnosticsItem,
  type LighthouseReport,
  type RecommendationItem,
} from "@/src/lib/lighthouse";
import { generatePptxReport } from "@/src/lib/pptx";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  return typeof e === "string" ? e : "Unknown error";
}

function PriorityBadge({ item }: { item: RecommendationItem }) {
  const pct = item.score === null || item.score === undefined ? null : Math.round(item.score * 100);
  const mode = item.scoreDisplayMode ?? "";
  const label =
    pct === null ? "n/a" : `${pct}%${mode === "binary" ? "" : ""}`;
  const severity = pct === null ? 0 : 100 - pct;
  const color =
    severity >= 80 ? "bg-red-500/15 text-red-700 border-red-500/30" : severity >= 50 ? "bg-amber-500/15 text-amber-700 border-amber-500/30" : "bg-emerald-500/15 text-emerald-700 border-emerald-500/30";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${color}`}
      title={`Priority heuristic: (100 - scorePct) * weight`}
    >
      Priority: {label}
    </span>
  );
}

function EvidenceBlock({ item }: { item: RecommendationItem | DiagnosticsItem }) {
  if (!item.evidence) return null;
  return (
    <div className="mt-2 rounded-xl border border-zinc-200 bg-white/60 p-3">
      <div className="text-xs font-semibold text-zinc-900">Evidence</div>
      <div className="mt-1 text-sm text-zinc-800">{item.evidence.summary}</div>
      {item.evidence.bullets && item.evidence.bullets.length > 0 ? (
        <ul className="mt-2 space-y-1 text-sm text-zinc-800">
          {item.evidence.bullets.slice(0, 4).map((b, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-zinc-500" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function getScoreColor(scorePct: number | null) {
  if (scorePct === null) return {
    ring: "stroke-zinc-300",
    text: "text-zinc-700",
    badge: "bg-zinc-100 text-zinc-700 border-zinc-200",
  };
  if (scorePct >= 90) {
    return {
      ring: "stroke-emerald-500",
      text: "text-emerald-700",
      badge: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
    };
  }
  if (scorePct >= 50) {
    return {
      ring: "stroke-amber-500",
      text: "text-amber-700",
      badge: "bg-amber-500/15 text-amber-700 border-amber-500/30",
    };
  }
  return {
    ring: "stroke-red-500",
    text: "text-red-700",
    badge: "bg-red-500/15 text-red-700 border-red-500/30",
  };
}

function ScoreRing({ scorePct }: { scorePct: number | null }) {
  const size = 62;
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalized = Math.max(0, Math.min(100, scorePct ?? 0));
  const dashOffset = circumference * (1 - normalized / 100);
  const color = getScoreColor(scorePct);

  return (
    <div className="relative h-[62px] w-[62px]">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          className="fill-none stroke-zinc-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className={`fill-none transition-all duration-500 ${color.ring}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-sm font-bold ${color.text}`}>
          {scorePct === null ? "n/a" : Math.round(scorePct)}
        </span>
      </div>
    </div>
  );
}

function CategoryScoreCards({ report }: { report: LighthouseReport }) {
  const scores = getCategoryScores(report);
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {scores.map((s) => (
        <div
          key={s.id}
          className="rounded-2xl border border-zinc-200 bg-white/60 p-4 shadow-sm backdrop-blur"
        >
          <div className="text-sm font-semibold text-zinc-900">{s.title}</div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ScoreRing scorePct={s.scorePct} />
              <div className="text-3xl font-semibold text-zinc-900">
                {s.scorePct === null ? "n/a" : Math.round(s.scorePct)}
                <span className="ml-1 text-base text-zinc-600">/100</span>
              </div>
            </div>
            <div
              className={`rounded-full border px-2 py-1 text-xs font-semibold ${getScoreColor(s.scorePct).badge}`}
              title="Lighthouse thresholds: 90-100 good, 50-89 needs improvement, 0-49 poor"
            >
              {formatTopScore(s.score)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PrintableReport({
  report,
  topItems,
  diagnostics,
}: {
  report: LighthouseReport | null;
  topItems: RecommendationItem[];
  diagnostics: DiagnosticsItem[];
}) {
  const categoryScores = report ? getCategoryScores(report) : [];
  return (
    <div className="px-8 py-10">
      {!report ? (
        <div className="print-no-break rounded-2xl border border-zinc-200 bg-white p-8 text-zinc-900">
          No report loaded. Paste Lighthouse JSON and try again.
        </div>
      ) : (
        <div className="space-y-8">
          <div className="print-no-break rounded-2xl border border-zinc-200 bg-white p-7">
            <div className="text-2xl font-bold text-zinc-900">Lighthouse Report</div>
            <div className="mt-1 text-sm text-zinc-700">
              URL: <span className="font-medium">{report.finalDisplayedUrl ?? report.requestedUrl ?? ""}</span>
            </div>
            <div className="mt-1 text-sm text-zinc-700">
              Generated: <span className="font-medium">{formatFetchTime(report.fetchTime)}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {categoryScores.map((s) => (
                <div key={s.id} className="rounded-xl border border-zinc-200 bg-white p-4">
                  <div className="text-sm font-semibold text-zinc-900">{s.title}</div>
                  <div className="mt-1 text-3xl font-bold text-zinc-900">
                    {s.scorePct === null ? "n/a" : Math.round(s.scorePct)}
                    <span className="ml-2 text-base font-medium text-zinc-600">/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="text-lg font-bold text-zinc-900">Top 10: most impactful issues</div>
            {topItems.map((item) => (
              <div key={item.auditId} className="print-no-break rounded-2xl border border-zinc-200 bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-zinc-600">
                      Category: <span className="font-medium text-zinc-900">{item.categoryId}</span>
                    </div>
                    <div className="mt-1 text-xl font-bold text-zinc-900">{item.title}</div>
                  </div>
                  <div className="text-sm font-medium text-zinc-700">
                    Score:{" "}
                    {item.score === null || item.score === undefined
                      ? "n/a"
                      : `${Math.round(item.score * 100)}%`}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-sm font-bold text-zinc-900">Explain the problem</div>
                  <div className="mt-1 text-sm text-zinc-800 whitespace-pre-wrap">{item.explain}</div>
                </div>

                {item.nextSteps.length > 0 ? (
                  <div className="mt-3">
                    <div className="text-sm font-bold text-zinc-900">Next steps</div>
                    <ul className="mt-1 list-disc pl-5 text-sm text-zinc-800">
                      {item.nextSteps.slice(0, 6).map((s, idx) => (
                        <li key={idx} className="mt-1">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {item.evidence ? (
                  <div className="mt-3">
                    <div className="text-sm font-bold text-zinc-900">Diagnostics / Evidence</div>
                    <div className="mt-1 text-sm text-zinc-800">{item.evidence.summary}</div>
                    {item.evidence.bullets && item.evidence.bullets.length > 0 ? (
                      <ul className="mt-2 list-disc pl-5 text-sm text-zinc-800">
                        {item.evidence.bullets.slice(0, 6).map((b, idx) => (
                          <li key={idx} className="mt-1">
                            {b}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="space-y-5">
            <div className="text-lg font-bold text-zinc-900">Diagnostics (Lighthouse)</div>
            {diagnostics.map((d) => (
              <div key={d.auditId} className="print-no-break rounded-2xl border border-zinc-200 bg-white p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-zinc-600">
                      Category: <span className="font-medium text-zinc-900">{d.categoryId}</span>
                    </div>
                    <div className="mt-1 text-xl font-bold text-zinc-900">{d.title}</div>
                  </div>
                  <div className="text-sm font-medium text-zinc-700">
                    {typeof d.score === "number" ? `${Math.round(d.score * 100)}%` : ""}
                  </div>
                </div>
                <div className="mt-3 text-sm text-zinc-800 whitespace-pre-wrap">
                  <span className="font-bold text-zinc-900">Explain the problem: </span>
                  {d.explain || "No additional description available."}
                </div>
                {d.evidence ? (
                  <div className="mt-3 text-sm text-zinc-800">
                    <span className="font-bold text-zinc-900">Evidence: </span>
                    {d.evidence.summary}
                    {d.evidence.bullets && d.evidence.bullets.length > 0 ? (
                      <ul className="mt-2 list-disc pl-5">
                        {d.evidence.bullets.slice(0, 6).map((b, idx) => (
                          <li key={idx} className="mt-1">
                            {b}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<LighthouseReport | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isExportingPptx, setIsExportingPptx] = useState(false);
  const [isDraggingJson, setIsDraggingJson] = useState(false);
  const [isPasting, setIsPasting] = useState(false);
  const dragDepthRef = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const topItems = useMemo(() => {
    if (!report) return [];
    return buildTopRecommendations(report, 10);
  }, [report]);

  const topAuditIdSet = useMemo(() => {
    return new Set(topItems.map((i) => i.auditId));
  }, [topItems]);

  const diagnostics = useMemo(() => {
    if (!report) return [];
    return buildDiagnostics(report).filter((d) => !topAuditIdSet.has(d.auditId));
  }, [report, topAuditIdSet]);

  const additionalIssues = useMemo(() => {
    if (!report) return [];
    return buildAdditionalIssues(report, topAuditIdSet, 12);
  }, [report, topAuditIdSet]);

  const diagnosticsAll = useMemo(() => {
    return [...diagnostics, ...additionalIssues];
  }, [diagnostics, additionalIssues]);

  const diagnosticsDeduped = useMemo(() => {
    const seen = new Set<string>();
    const unique: typeof diagnosticsAll = [];
    for (const d of diagnosticsAll) {
      if (seen.has(d.auditId)) continue;
      seen.add(d.auditId);
      unique.push(d);
    }
    return unique;
  }, [diagnosticsAll]);

  async function handleLoadFromText() {
    setError(null);
    setIsParsing(true);
    try {
      const trimmed = jsonText.trim();
      if (!trimmed) throw new Error("Paste Lighthouse JSON first.");
      const parsed = parseLighthouseJson(trimmed);
      setReport(parsed);
    } catch (e: unknown) {
      setError(getErrorMessage(e) || "Failed to parse Lighthouse JSON.");
      setReport(null);
    } finally {
      setIsParsing(false);
    }
  }

  function handleResetReport() {
    setError(null);
    setJsonText("");
    setReport(null);
  }

  async function handleLoadFromFile(file: File) {
    setError(null);
    setIsParsing(true);
    try {
      const isJson = file.type === "application/json" || file.name.toLowerCase().endsWith(".json");
      if (!isJson) throw new Error("Please upload a valid .json Lighthouse report.");
      const text = await file.text();
      setJsonText(text);
      const parsed = parseLighthouseJson(text);
      setReport(parsed);
    } catch (e: unknown) {
      setError(getErrorMessage(e) || "Failed to read/parse the JSON file.");
      setReport(null);
    } finally {
      setIsParsing(false);
    }
  }

  async function handleExportPptx() {
    if (!report) return;
    setIsExportingPptx(true);
    try {
      const blob = await generatePptxReport({
        report,
        topItems,
        diagnostics: diagnosticsDeduped,
      });
      const url = (report.finalDisplayedUrl ?? report.requestedUrl ?? "report").replace(/https?:\/\//g, "").replace(/[^a-z0-9]+/gi, "-").slice(0, 40);
      downloadBlob(blob, `${url}-lighthouse-report.pptx`);
    } catch (e: unknown) {
      setError(getErrorMessage(e) || "Failed to generate PPTX.");
    } finally {
      setIsExportingPptx(false);
    }
  }

  function handleExportPdf() {
    // Print uses @media print to show #print-root only.
    if (!report) return;
    const originalTitle = document.title;
    const url = (report.finalDisplayedUrl ?? report.requestedUrl ?? "report")
      .replace(/https?:\/\//g, "")
      .replace(/[^a-z0-9]+/gi, "-")
      .slice(0, 40);
    document.title = `${url}-lighthouse-report`;
    setTimeout(() => {
      window.print();
      // Restore to avoid side effects if user prints again later
      document.title = originalTitle;
    }, 50);
  }

  function handlePasteJsonClick() {
    void (async () => {
      setError(null);
      setIsPasting(true);
      try {
        // Prefer the modern Clipboard API (works on localhost in most browsers).
        const clipboardText = await navigator.clipboard?.readText?.();
        if (clipboardText && clipboardText.trim().length > 0) {
          setJsonText(clipboardText);
          textareaRef.current?.focus();
          textareaRef.current?.setSelectionRange(0, clipboardText.length);
          // Try to parse immediately; if it fails, keep the text visible.
          try {
            const parsed = parseLighthouseJson(clipboardText);
            setReport(parsed);
          } catch {
            setReport(null);
          }
          return;
        }

        // Fallback: focus/select so the user can Ctrl+V.
        textareaRef.current?.focus();
        textareaRef.current?.select();
        setError("Clipboard is empty or not readable. You can paste manually with Ctrl+V.");
      } catch (e: unknown) {
        textareaRef.current?.focus();
        textareaRef.current?.select();
        setError(getErrorMessage(e) || "Clipboard access blocked by the browser. Paste manually with Ctrl+V.");
      } finally {
        setIsPasting(false);
      }
    })();
  }

  async function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    dragDepthRef.current = 0;
    setIsDraggingJson(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await handleLoadFromFile(file);
  }

  return (
    <div>
      <div id="app-shell" className="min-h-screen bg-zinc-50 px-5 py-8 font-sans">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-zinc-600">Local • Lighthouse → Client-ready export</div>
              <div className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
                Lighthouse Insights (Top 10 + Diagnostics)
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={!report}
                className="cursor-pointer rounded-full border border-zinc-200 bg-white/70 px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Export PDF
              </button>
              <button
                type="button"
                onClick={handleExportPptx}
                disabled={!report || isExportingPptx}
                className="cursor-pointer rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isExportingPptx ? "Exporting PPTX..." : "Export PPTX"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div
                className="relative rounded-2xl border border-zinc-200 bg-white/60 p-4 shadow-sm backdrop-blur"
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  dragDepthRef.current += 1;
                  setIsDraggingJson(true);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
                  if (dragDepthRef.current === 0) setIsDraggingJson(false);
                }}
                onDrop={(e) => void handleDrop(e)}
              >
                {isDraggingJson ? (
                  <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-zinc-900/20 bg-white/80 backdrop-blur flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-zinc-900">Drop Lighthouse JSON to import</div>
                      <div className="mt-1 text-xs text-zinc-600">We will parse it and generate Top 10 + Diagnostics</div>
                    </div>
                  </div>
                ) : null}
                <div className="text-sm font-semibold text-zinc-900">Import Lighthouse</div>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <label className="cursor-pointer rounded-xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-semibold text-zinc-900">
                      Upload .json
                      <input
                        type="file"
                        accept="application/json,.json"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void handleLoadFromFile(file);
                        }}
                      />
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePasteJsonClick}
                        disabled={isParsing || isPasting}
                        className="cursor-pointer rounded-xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPasting ? "Pasting..." : "Paste JSON"}
                      </button>
                      <button
                      type="button"
                      onClick={handleLoadFromText}
                      disabled={isParsing}
                      className="cursor-pointer rounded-xl bg-zinc-900 px-3 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isParsing ? "Parsing..." : "Load Report"}
                      </button>
                      <button
                        type="button"
                        onClick={handleResetReport}
                        disabled={isParsing}
                        className="cursor-pointer rounded-xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  <textarea
                    ref={textareaRef}
                    value={jsonText}
                    onChange={(e) => {
                      setJsonText(e.target.value);
                      // If user starts editing a new payload, clear previous parsed output.
                      if (report) setReport(null);
                    }}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                        e.preventDefault();
                        void handleLoadFromText();
                      }
                    }}
                    placeholder="Paste Lighthouse JSON here (performance/accessibility/best-practices/seo)..."
                    className="min-h-[260px] w-full resize-y rounded-xl border border-zinc-200 bg-white/70 p-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900/20"
                  />

                  <div className="text-xs text-zinc-600">
                    `Load Report` parses the current textarea JSON and refreshes the dashboard. Shortcut: <span className="font-semibold">Ctrl+Enter</span>.
                  </div>

                  {error ? (
                    <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-900">
                      {error}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-4">
              {report ? (
                <div className="space-y-4">
                  <CategoryScoreCards report={report} />

                  <div className="rounded-2xl border border-zinc-200 bg-white/60 p-4 shadow-sm backdrop-blur">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-zinc-900">Top 10</div>
                        <div className="mt-1 text-sm text-zinc-600">
                          Ordered by: (100 - score) × weight (where available)
                        </div>
                      </div>
                      <div className="text-xs font-medium text-zinc-500">
                        {topItems.length} item(s)
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {topItems.map((item) => (
                        <details key={item.auditId} className="group rounded-2xl border border-zinc-200 bg-white/70 p-4">
                          <summary className="cursor-pointer list-none">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <div className="text-sm font-semibold text-zinc-900">{item.title}</div>
                                <div className="mt-1 text-xs font-medium text-zinc-600">
                                  Category: <span className="font-semibold">{item.categoryId}</span>
                                </div>
                              </div>
                              <PriorityBadge item={item} />
                            </div>
                          </summary>

                          <div className="mt-3 space-y-3">
                            <div>
                              <div className="text-xs font-semibold text-zinc-900">Explain the problem</div>
                              <div className="mt-1 text-sm text-zinc-800 whitespace-pre-wrap">
                                {item.explain || "No description available."}
                              </div>
                            </div>

                            {item.nextSteps.length ? (
                              <div>
                                <div className="text-xs font-semibold text-zinc-900">Next steps</div>
                                <ul className="mt-2 list-disc pl-5 text-sm text-zinc-800">
                                  {item.nextSteps.slice(0, 5).map((s, idx) => (
                                    <li key={idx} className="mt-1">
                                      {s}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : null}

                            <EvidenceBlock item={item} />
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-white/60 p-4 shadow-sm backdrop-blur">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-zinc-900">Diagnostics</div>
                        <div className="mt-1 text-sm text-zinc-600">
                          Lighthouse items with <span className="font-semibold">group: diagnostics</span>
                        </div>
                      </div>
                      <div className="text-xs font-medium text-zinc-500">
                        {diagnosticsDeduped.length} item(s)
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {diagnosticsDeduped.map((d) => (
                        <details key={d.auditId} className="rounded-2xl border border-zinc-200 bg-white/70 p-4">
                          <summary className="cursor-pointer list-none">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <div className="text-sm font-semibold text-zinc-900">{d.title}</div>
                                <div className="mt-1 text-xs font-medium text-zinc-600">
                                  Category: <span className="font-semibold">{d.categoryId}</span>
                                </div>
                              </div>
                              <div className="text-xs font-medium text-zinc-600">
                                Score: {typeof d.score === "number" ? `${Math.round(d.score * 100)}%` : "n/a"}
                              </div>
                            </div>
                          </summary>
                          <div className="mt-3">
                            <div className="text-xs font-semibold text-zinc-900">Explain the problem</div>
                            <div className="mt-1 text-sm text-zinc-800 whitespace-pre-wrap">
                              {d.explain || "No description available."}
                            </div>
                            <EvidenceBlock item={d} />
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-zinc-200 bg-white/60 p-10 text-center shadow-sm backdrop-blur">
                  <div className="text-sm font-semibold text-zinc-900">Upload or paste a Lighthouse JSON</div>
                  <div className="mt-2 text-sm text-zinc-600">
                    You’ll get a client-ready <span className="font-semibold">Top 10</span> plus <span className="font-semibold">Diagnostics</span>, with Export PDF and PPTX.
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-xs text-zinc-500">
            Tip: For best results, use a Lighthouse JSON export from the Performance/Lighthouse panel. This app runs fully locally in your browser.
          </div>
        </div>
      </div>

      <div id="print-root" className="bg-white">
        <PrintableReport report={report} topItems={topItems} diagnostics={diagnosticsDeduped} />
      </div>
    </div>
  );
}
