import { generatePptxReport } from "@/src/lib/pptx";
import type { DiagnosticsItem, LighthouseReport, RecommendationItem } from "@/src/lib/lighthouse";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function reportSlug(report: LighthouseReport): string {
  return (report.finalDisplayedUrl ?? report.requestedUrl ?? "report")
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .slice(0, 40);
}

export const ExportService = {
  downloadBlob,

  exportPdf(report: LighthouseReport) {
    const originalTitle = document.title;
    document.title = `${reportSlug(report)}-lighthouse-report`;
    setTimeout(() => {
      window.print();
      document.title = originalTitle;
    }, 50);
  },

  async exportPptx(opts: {
    report: LighthouseReport;
    topItems: RecommendationItem[];
    diagnostics: DiagnosticsItem[];
  }): Promise<void> {
    const blob = await generatePptxReport(opts);
    downloadBlob(blob, `${reportSlug(opts.report)}-lighthouse-report.pptx`);
  },
};
