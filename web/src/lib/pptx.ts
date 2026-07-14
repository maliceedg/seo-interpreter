import pptxgen from "pptxgenjs";
import type {
  LighthouseReport,
  RecommendationItem,
  DiagnosticsItem,
} from "./lighthouse";

function sanitizeText(input: string): string {
  // pptxgenjs is sensitive to very long strings; truncate.
  const cleaned = (input ?? "").replace(/\s+/g, " ").trim();
  return cleaned.length > 250 ? cleaned.slice(0, 247) + "…" : cleaned;
}

function addBulletText(
  slide: pptxgen.Slide,
  text: string,
  x: number,
  y: number,
  w: number,
  fontSize: number
) {
  slide.addText(text, { x, y, w, fontSize, fontFace: "Arial", color: "1f2937" });
}

export async function generatePptxReport(args: {
  report: LighthouseReport;
  topItems: RecommendationItem[];
  diagnostics: DiagnosticsItem[];
}): Promise<Blob> {
  const { report, topItems, diagnostics } = args;

  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Lighthouse Insights";
  pptx.company = "Local Report Builder";

  const url = report.finalDisplayedUrl ?? report.requestedUrl ?? "URL";
  const fetchTime = report.fetchTime ? new Date(report.fetchTime).toLocaleString() : "";

  // Cover slide
  const cover = pptx.addSlide();
  cover.addText("Lighthouse Report", { x: 0.5, y: 0.5, w: 12, h: 0.6, fontSize: 26, bold: true, color: "111827" });
  cover.addText(url, { x: 0.5, y: 1.2, w: 12, h: 0.5, fontSize: 14, color: "374151" });
  if (fetchTime) {
    cover.addText(`Generated: ${fetchTime}`, { x: 0.5, y: 1.75, w: 12, h: 0.4, fontSize: 12, color: "6b7280" });
  }

  cover.addText("Top 10: most impactful issues", { x: 0.5, y: 2.6, w: 12, h: 0.4, fontSize: 16, bold: true, color: "111827" });

  // Top 10 slides
  for (let i = 0; i < topItems.length; i++) {
    const item = topItems[i]!;
    const slide = pptx.addSlide();
    slide.addText(`Top ${i + 1}`, { x: 0.5, y: 0.4, w: 2, h: 0.4, fontSize: 14, bold: true, color: "111827" });
    slide.addText(sanitizeText(item.title), { x: 0.5, y: 0.9, w: 12, h: 0.6, fontSize: 18, bold: true, color: "111827" });

    slide.addText("Explain the problem", { x: 0.5, y: 1.6, w: 12, h: 0.35, fontSize: 12, bold: true, color: "374151" });
    const explain = sanitizeText(item.explain);
    slide.addText(explain, { x: 0.5, y: 1.95, w: 6.2, h: 1.2, fontSize: 11, color: "111827" });

    slide.addText("Next steps", { x: 7, y: 1.6, w: 5.6, h: 0.35, fontSize: 12, bold: true, color: "374151" });
    const steps = (item.nextSteps ?? []).slice(0, 4);
    const stepsText =
      steps.length > 0 ? steps.map((s) => `• ${sanitizeText(s)}`).join("\n") : "• (No next steps found in the report description)";
    addBulletText(slide, stepsText, 7, 1.95, 5.6, 11);

    slide.addText("Evidence (Lighthouse details)", { x: 0.5, y: 3.2, w: 12, h: 0.35, fontSize: 12, bold: true, color: "374151" });
    const evidence = item.evidence?.summary ? sanitizeText(item.evidence.summary) : "No evidence preview available.";
    slide.addText(evidence, { x: 0.5, y: 3.55, w: 12, h: 0.8, fontSize: 10.5, color: "111827" });
  }

  // Diagnostics slide(s)
  const diagSlide = pptx.addSlide();
  diagSlide.addText("Diagnostics (Lighthouse)", { x: 0.5, y: 0.5, w: 12, h: 0.5, fontSize: 18, bold: true, color: "111827" });

  const diagnosticsSorted = diagnostics.slice(0, 10);
  const diagLines = diagnosticsSorted.map((d, idx) => {
    const score = d.scoreDisplayMode && d.scoreDisplayMode !== "notApplicable" && typeof d.score === "number" ? `${Math.round(d.score * 100)}%` : "";
    const badge = score ? ` (${score})` : "";
    return `${idx + 1}. ${sanitizeText(d.title)}${badge}`;
  });

  const diagText = diagLines.join("\n") || "No diagnostics items found.";
  diagSlide.addText(diagText, { x: 0.5, y: 1.15, w: 12, h: 5, fontSize: 12, color: "111827" });

  const out = await pptx.write({ outputType: "blob" });
  // pptxgenjs types allow multiple output types; we explicitly request "blob".
  return out as Blob;
}

