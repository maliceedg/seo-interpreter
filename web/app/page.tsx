"use client";

import { useEffect, useMemo, useState } from "react";
import type { LighthouseReport } from "@/src/lib/lighthouse";
import { AppShell } from "@/src/components/AppShell";
import { ImportSection } from "@/src/components/ImportSection";
import { DashboardSection } from "@/src/components/DashboardSection";
import { IssueList } from "@/src/components/IssueList";
import { PrintableReport } from "@/src/components/PrintableReport";
import { ReportAnalysisService } from "@/src/services/reportAnalysis";
import { ExportService } from "@/src/services/exportReport";

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  return typeof e === "string" ? e : "Unknown error";
}

const IMPORT_EXIT_MS = 300;

export default function Page() {
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<LighthouseReport | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isExportingPptx, setIsExportingPptx] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(true);
  const [importExiting, setImportExiting] = useState(false);

  const topItems = useMemo(() => {
    if (!report) return [];
    return ReportAnalysisService.getTopRecommendations(report, 10);
  }, [report]);

  const quickWins = useMemo(() => topItems.slice(0, 4), [topItems]);

  const categories = useMemo(() => {
    if (!report) return [];
    return ReportAnalysisService.getCategoryScores(report);
  }, [report]);

  const overallScorePct = useMemo(() => {
    if (!report) return null;
    return ReportAnalysisService.getOverallHealthScore(report);
  }, [report]);

  const diagnosticsDeduped = useMemo(() => {
    if (!report) return [];
    return ReportAnalysisService.getDiagnosticsDeduped(report, topItems);
  }, [report, topItems]);

  const filteredIssues = useMemo(() => {
    if (!selectedCategoryId) return { top: topItems, diagnostics: diagnosticsDeduped };
    return {
      top: topItems.filter((i) => i.categoryId === selectedCategoryId),
      diagnostics: diagnosticsDeduped.filter((d) => d.categoryId === selectedCategoryId),
    };
  }, [selectedCategoryId, topItems, diagnosticsDeduped]);

  useEffect(() => {
    if (report) {
      setImportExiting(true);
      const t = window.setTimeout(() => {
        setShowImport(false);
        setImportExiting(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, IMPORT_EXIT_MS);
      return () => window.clearTimeout(t);
    }

    setShowImport(true);
    setImportExiting(false);
  }, [report]);

  async function handleAnalyze() {
    setError(null);
    setIsParsing(true);
    try {
      const trimmed = jsonText.trim();
      if (!trimmed) throw new Error("Paste Lighthouse JSON first.");
      const parsed = ReportAnalysisService.parse(trimmed);
      setReport(parsed);
      const cats = ReportAnalysisService.getCategoryScores(parsed);
      setSelectedCategoryId(cats[0]?.id ?? null);
    } catch (e: unknown) {
      setError(getErrorMessage(e) || "Failed to parse Lighthouse JSON.");
      setReport(null);
      setSelectedCategoryId(null);
    } finally {
      setIsParsing(false);
    }
  }

  function handleReset() {
    setError(null);
    setJsonText("");
    setReport(null);
    setSelectedCategoryId(null);
  }

  async function handleUploadFile(file: File) {
    setError(null);
    setIsParsing(true);
    try {
      const isJson = file.type === "application/json" || file.name.toLowerCase().endsWith(".json");
      if (!isJson) throw new Error("Please upload a valid .json Lighthouse report.");
      const text = await file.text();
      setJsonText(text);
      const parsed = ReportAnalysisService.parse(text);
      setReport(parsed);
      const cats = ReportAnalysisService.getCategoryScores(parsed);
      setSelectedCategoryId(cats[0]?.id ?? null);
    } catch (e: unknown) {
      setError(getErrorMessage(e) || "Failed to read/parse the JSON file.");
      setReport(null);
      setSelectedCategoryId(null);
    } finally {
      setIsParsing(false);
    }
  }

  async function handlePaste() {
    setError(null);
    try {
      const clipboardText = await navigator.clipboard?.readText?.();
      if (clipboardText && clipboardText.trim().length > 0) {
        setJsonText(clipboardText);
        try {
          const parsed = ReportAnalysisService.parse(clipboardText);
          setReport(parsed);
          const cats = ReportAnalysisService.getCategoryScores(parsed);
          setSelectedCategoryId(cats[0]?.id ?? null);
        } catch {
          setReport(null);
          setSelectedCategoryId(null);
        }
        return;
      }
      setError("Clipboard is empty or not readable. You can paste manually with Ctrl+V.");
    } catch (e: unknown) {
      setError(getErrorMessage(e) || "Clipboard access blocked. Paste manually with Ctrl+V.");
    }
  }

  async function handleExportPptx() {
    if (!report) return;
    setIsExportingPptx(true);
    setError(null);
    try {
      await ExportService.exportPptx({
        report,
        topItems,
        diagnostics: diagnosticsDeduped,
      });
    } catch (e: unknown) {
      setError(getErrorMessage(e) || "Failed to generate PPTX.");
    } finally {
      setIsExportingPptx(false);
    }
  }

  function handleExportPdf() {
    if (!report) return;
    ExportService.exportPdf(report);
  }

  const showResults = Boolean(report) && !showImport && !importExiting;

  return (
    <div>
      <AppShell
        hasReport={Boolean(report)}
        isExportingPptx={isExportingPptx}
        onExportPdf={handleExportPdf}
        onExportPptx={() => void handleExportPptx()}
        onReset={handleReset}
      >
        <div className="mx-auto max-w-5xl space-y-10">
          {showImport ? (
            <div className={importExiting ? "section-fade-out" : "section-fade-in"}>
              <ImportSection
                jsonText={jsonText}
                onJsonTextChange={setJsonText}
                error={error}
                isParsing={isParsing}
                onAnalyze={() => void handleAnalyze()}
                onUploadFile={(file) => void handleUploadFile(file)}
                onPaste={() => void handlePaste()}
              />
            </div>
          ) : null}

          {showResults ? (
            <div className="section-fade-in space-y-10">
              {error ? (
                <div className="rounded-lg border border-error/30 bg-error-container p-3 text-sm text-error">
                  {error}
                </div>
              ) : null}
              <DashboardSection
                report={report!}
                overallScorePct={overallScorePct}
                quickWins={quickWins}
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={(id) =>
                  setSelectedCategoryId((prev) => (prev === id ? null : id))
                }
              />

              <IssueList
                title="Top impactful issues"
                subtitle={
                  selectedCategoryId
                    ? `Filtered by category: ${selectedCategoryId}`
                    : "Ordered by impact heuristic"
                }
                items={filteredIssues.top}
                mode="priority"
              />

              <IssueList
                title="Diagnostics"
                subtitle="Lighthouse diagnostics and related findings"
                items={filteredIssues.diagnostics}
                mode="score"
              />
            </div>
          ) : null}
        </div>
      </AppShell>

      <div id="print-root" className="bg-white">
        <PrintableReport report={report} topItems={topItems} diagnostics={diagnosticsDeduped} />
      </div>
    </div>
  );
}
