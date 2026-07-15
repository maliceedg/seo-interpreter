import {
  buildAdditionalIssues,
  buildDiagnostics,
  buildTopRecommendations,
  getCategoryScores,
  getOverallHealthScore,
  parseLighthouseJson,
  type DiagnosticsItem,
  type LighthouseReport,
  type RecommendationItem,
} from "@/src/lib/lighthouse";

export const ReportAnalysisService = {
  parse(jsonText: string): LighthouseReport {
    return parseLighthouseJson(jsonText);
  },

  getCategoryScores(report: LighthouseReport) {
    return getCategoryScores(report);
  },

  getOverallHealthScore(report: LighthouseReport) {
    return getOverallHealthScore(report);
  },

  getTopRecommendations(report: LighthouseReport, n = 10): RecommendationItem[] {
    return buildTopRecommendations(report, n);
  },

  getDiagnosticsDeduped(report: LighthouseReport, topItems: RecommendationItem[]): DiagnosticsItem[] {
    const topIds = new Set(topItems.map((i) => i.auditId));
    const diagnostics = buildDiagnostics(report).filter((d) => !topIds.has(d.auditId));
    const additional = buildAdditionalIssues(report, topIds, 12);
    const seen = new Set<string>();
    const unique: DiagnosticsItem[] = [];
    for (const d of [...diagnostics, ...additional]) {
      if (seen.has(d.auditId)) continue;
      seen.add(d.auditId);
      unique.push(d);
    }
    return unique;
  },
};
