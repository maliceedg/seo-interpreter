import { getScoreBand, type ScoreBand } from "./lighthouse";

/** Shared brand + score colors for PDF/PPTX (hex without # for pptxgenjs). */
export const ExportTheme = {
  brand: "F97316",
  brandSoft: "FFF7ED",
  ink: "191C1E",
  muted: "5C6570",
  border: "E0E3E5",
  surface: "FFFFFF",
  surfaceSoft: "F8F9FB",
  good: "16A34A",
  goodSoft: "DCFCE7",
  warn: "CA8A04",
  warnSoft: "FEF9C3",
  poor: "DC2626",
  poorSoft: "FEE2E2",
  white: "FFFFFF",
} as const;

export function scoreBandColor(band: ScoreBand): string {
  if (band === "good") return ExportTheme.good;
  if (band === "needs-improvement") return ExportTheme.warn;
  if (band === "poor") return ExportTheme.poor;
  return ExportTheme.muted;
}

export function scoreBandSoft(band: ScoreBand): string {
  if (band === "good") return ExportTheme.goodSoft;
  if (band === "needs-improvement") return ExportTheme.warnSoft;
  if (band === "poor") return ExportTheme.poorSoft;
  return ExportTheme.surfaceSoft;
}

export function scorePctBandColor(scorePct: number | null | undefined): string {
  return scoreBandColor(getScoreBand(scorePct));
}

export function scorePctBandSoft(scorePct: number | null | undefined): string {
  return scoreBandSoft(getScoreBand(scorePct));
}

/** Tailwind-friendly class sets for print HTML. */
export function scoreTextClass(scorePct: number | null | undefined): string {
  const band = getScoreBand(scorePct);
  if (band === "good") return "text-score-good";
  if (band === "needs-improvement") return "text-amber-700";
  if (band === "poor") return "text-score-poor";
  return "text-zinc-600";
}

export function scoreBadgeClass(scorePct: number | null | undefined): string {
  const band = getScoreBand(scorePct);
  if (band === "good") return "border-score-good/30 bg-score-good/10 text-score-good";
  if (band === "needs-improvement") return "border-amber-500/35 bg-score-warn/25 text-amber-800";
  if (band === "poor") return "border-score-poor/30 bg-score-poor/10 text-score-poor";
  return "border-zinc-200 bg-zinc-50 text-zinc-600";
}
