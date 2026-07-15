import pptxgen from "pptxgenjs";
import type {
  LighthouseReport,
  RecommendationItem,
  DiagnosticsItem,
} from "./lighthouse";
import { getCategoryScores, getOverallHealthScore, getScoreBand } from "./lighthouse";
import {
  ExportTheme,
  scorePctBandColor,
  scorePctBandSoft,
} from "./exportTheme";

function sanitizeText(input: string): string {
  const cleaned = (input ?? "").replace(/\s+/g, " ").trim();
  return cleaned.length > 250 ? cleaned.slice(0, 247) + "…" : cleaned;
}

function bandLabel(scorePct: number | null): string {
  const band = getScoreBand(scorePct);
  if (band === "good") return "Good";
  if (band === "needs-improvement") return "Needs improvement";
  if (band === "poor") return "Poor";
  return "n/a";
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
  const categories = getCategoryScores(report);
  const overall = getOverallHealthScore(report);
  const overallRounded = overall === null ? null : Math.round(overall);

  // Cover slide
  const cover = pptx.addSlide();
  cover.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.18,
    fill: { color: ExportTheme.brand },
    line: { color: ExportTheme.brand },
  });
  cover.addText("LIGHTHOUSE INSIGHTS", {
    x: 0.5,
    y: 0.45,
    w: 12,
    h: 0.35,
    fontSize: 12,
    bold: true,
    color: ExportTheme.brand,
    fontFace: "Arial",
  });
  cover.addText("Lighthouse Report", {
    x: 0.5,
    y: 0.85,
    w: 12,
    h: 0.55,
    fontSize: 28,
    bold: true,
    color: ExportTheme.ink,
    fontFace: "Arial",
  });
  cover.addText(url, {
    x: 0.5,
    y: 1.45,
    w: 12,
    h: 0.35,
    fontSize: 14,
    color: ExportTheme.muted,
    fontFace: "Arial",
  });
  if (fetchTime) {
    cover.addText(`Generated: ${fetchTime}`, {
      x: 0.5,
      y: 1.85,
      w: 12,
      h: 0.3,
      fontSize: 12,
      color: ExportTheme.muted,
      fontFace: "Arial",
    });
  }

  // Overall score callout
  cover.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 2.4,
    w: 3.2,
    h: 1.35,
    fill: { color: scorePctBandSoft(overall) },
    line: { color: scorePctBandColor(overall), width: 1.25 },
    rectRadius: 0.12,
  });
  cover.addText("Overall health", {
    x: 0.7,
    y: 2.55,
    w: 2.8,
    h: 0.3,
    fontSize: 11,
    color: ExportTheme.muted,
    fontFace: "Arial",
  });
  cover.addText(overallRounded === null ? "n/a" : String(overallRounded), {
    x: 0.7,
    y: 2.85,
    w: 2.8,
    h: 0.5,
    fontSize: 32,
    bold: true,
    color: scorePctBandColor(overall),
    fontFace: "Arial",
  });
  cover.addText(bandLabel(overall), {
    x: 0.7,
    y: 3.35,
    w: 2.8,
    h: 0.25,
    fontSize: 11,
    bold: true,
    color: scorePctBandColor(overall),
    fontFace: "Arial",
  });

  // Category score cards
  const cardW = 2.15;
  const gap = 0.2;
  categories.forEach((cat, i) => {
    const x = 4.0 + i * (cardW + gap);
    const pct = cat.scorePct === null ? null : Math.round(cat.scorePct);
    cover.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 2.4,
      w: cardW,
      h: 1.35,
      fill: { color: ExportTheme.surface },
      line: { color: ExportTheme.border, width: 1 },
      rectRadius: 0.1,
    });
    cover.addText(cat.title, {
      x: x + 0.12,
      y: 2.55,
      w: cardW - 0.24,
      h: 0.35,
      fontSize: 11,
      color: ExportTheme.muted,
      fontFace: "Arial",
    });
    cover.addText(pct === null ? "n/a" : String(pct), {
      x: x + 0.12,
      y: 2.95,
      w: cardW - 0.24,
      h: 0.45,
      fontSize: 24,
      bold: true,
      color: scorePctBandColor(cat.scorePct),
      fontFace: "Arial",
    });
  });

  cover.addText("Top 10: most impactful issues", {
    x: 0.5,
    y: 4.1,
    w: 12,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: ExportTheme.ink,
    fontFace: "Arial",
  });
  cover.addText("Detail slides follow — color shows score band (green / yellow / red).", {
    x: 0.5,
    y: 4.5,
    w: 12,
    h: 0.3,
    fontSize: 11,
    color: ExportTheme.muted,
    fontFace: "Arial",
  });

  // Top 10 slides
  for (let i = 0; i < topItems.length; i++) {
    const item = topItems[i]!;
    const scorePct =
      item.score === null || item.score === undefined ? null : Math.round(item.score * 100);
    const slide = pptx.addSlide();

    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 13.333,
      h: 0.12,
      fill: { color: ExportTheme.brand },
      line: { color: ExportTheme.brand },
    });

    slide.addText(`TOP ${i + 1}`, {
      x: 0.5,
      y: 0.35,
      w: 2,
      h: 0.35,
      fontSize: 12,
      bold: true,
      color: ExportTheme.brand,
      fontFace: "Arial",
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 10.4,
      y: 0.35,
      w: 2.4,
      h: 0.4,
      fill: { color: scorePctBandSoft(scorePct) },
      line: { color: scorePctBandColor(scorePct), width: 1 },
      rectRadius: 0.15,
    });
    slide.addText(scorePct === null ? "Score n/a" : `Score ${scorePct}%`, {
      x: 10.4,
      y: 0.35,
      w: 2.4,
      h: 0.4,
      fontSize: 12,
      bold: true,
      color: scorePctBandColor(scorePct),
      align: "center",
      valign: "middle",
      fontFace: "Arial",
    });

    slide.addText(sanitizeText(item.title), {
      x: 0.5,
      y: 0.85,
      w: 12.3,
      h: 0.55,
      fontSize: 18,
      bold: true,
      color: ExportTheme.ink,
      fontFace: "Arial",
    });
    slide.addText(`Category: ${item.categoryId}`, {
      x: 0.5,
      y: 1.4,
      w: 12,
      h: 0.3,
      fontSize: 12,
      color: ExportTheme.muted,
      fontFace: "Arial",
    });

    slide.addText("Explain the problem", {
      x: 0.5,
      y: 1.9,
      w: 6.2,
      h: 0.35,
      fontSize: 12,
      bold: true,
      color: ExportTheme.ink,
      fontFace: "Arial",
    });
    slide.addText(sanitizeText(item.explain), {
      x: 0.5,
      y: 2.25,
      w: 6.2,
      h: 1.4,
      fontSize: 11,
      color: ExportTheme.ink,
      fontFace: "Arial",
    });

    slide.addText("Next steps", {
      x: 7,
      y: 1.9,
      w: 5.6,
      h: 0.35,
      fontSize: 12,
      bold: true,
      color: ExportTheme.ink,
      fontFace: "Arial",
    });
    const steps = (item.nextSteps ?? []).slice(0, 4);
    const stepsText =
      steps.length > 0
        ? steps.map((s) => `• ${sanitizeText(s)}`).join("\n")
        : "• (No next steps found in the report description)";
    slide.addText(stepsText, {
      x: 7,
      y: 2.25,
      w: 5.6,
      h: 1.4,
      fontSize: 11,
      color: ExportTheme.ink,
      fontFace: "Arial",
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.5,
      y: 3.9,
      w: 12.3,
      h: 1.5,
      fill: { color: ExportTheme.brandSoft },
      line: { color: ExportTheme.border, width: 1 },
      rectRadius: 0.1,
    });
    slide.addText("Evidence (Lighthouse details)", {
      x: 0.7,
      y: 4.05,
      w: 11.9,
      h: 0.3,
      fontSize: 12,
      bold: true,
      color: ExportTheme.brand,
      fontFace: "Arial",
    });
    const evidence = item.evidence?.summary
      ? sanitizeText(item.evidence.summary)
      : "No evidence preview available.";
    slide.addText(evidence, {
      x: 0.7,
      y: 4.4,
      w: 11.9,
      h: 0.8,
      fontSize: 11,
      color: ExportTheme.ink,
      fontFace: "Arial",
    });
  }

  // Diagnostics slide
  const diagSlide = pptx.addSlide();
  diagSlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.12,
    fill: { color: ExportTheme.brand },
    line: { color: ExportTheme.brand },
  });
  diagSlide.addText("Diagnostics (Lighthouse)", {
    x: 0.5,
    y: 0.4,
    w: 12,
    h: 0.45,
    fontSize: 20,
    bold: true,
    color: ExportTheme.ink,
    fontFace: "Arial",
  });

  const diagnosticsSorted = diagnostics.slice(0, 10);
  let y = 1.05;
  diagnosticsSorted.forEach((d, idx) => {
    const scorePct = typeof d.score === "number" ? Math.round(d.score * 100) : null;
    diagSlide.addText(`${idx + 1}. ${sanitizeText(d.title)}`, {
      x: 0.5,
      y,
      w: 10.2,
      h: 0.35,
      fontSize: 13,
      color: ExportTheme.ink,
      fontFace: "Arial",
    });
    if (scorePct !== null) {
      diagSlide.addShape(pptx.ShapeType.roundRect, {
        x: 10.9,
        y: y + 0.02,
        w: 1.8,
        h: 0.32,
        fill: { color: scorePctBandSoft(scorePct) },
        line: { color: scorePctBandColor(scorePct), width: 1 },
        rectRadius: 0.12,
      });
      diagSlide.addText(`${scorePct}%`, {
        x: 10.9,
        y: y + 0.02,
        w: 1.8,
        h: 0.32,
        fontSize: 11,
        bold: true,
        color: scorePctBandColor(scorePct),
        align: "center",
        valign: "middle",
        fontFace: "Arial",
      });
    }
    y += 0.42;
  });

  if (diagnosticsSorted.length === 0) {
    diagSlide.addText("No diagnostics items found.", {
      x: 0.5,
      y: 1.15,
      w: 12,
      h: 0.4,
      fontSize: 12,
      color: ExportTheme.muted,
      fontFace: "Arial",
    });
  }

  const out = await pptx.write({ outputType: "blob" });
  return out as Blob;
}
