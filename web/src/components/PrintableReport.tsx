"use client";

import {
  formatFetchTime,
  getCategoryScores,
  getOverallHealthScore,
  getScoreBand,
  type DiagnosticsItem,
  type LighthouseReport,
  type RecommendationItem,
} from "@/src/lib/lighthouse";
import { scoreBadgeClass, scoreTextClass } from "@/src/lib/exportTheme";

function bandLabel(scorePct: number | null): string {
  const band = getScoreBand(scorePct);
  if (band === "good") return "Good";
  if (band === "needs-improvement") return "Needs improvement";
  if (band === "poor") return "Poor";
  return "n/a";
}

export function PrintableReport({
  report,
  topItems,
  diagnostics,
}: {
  report: LighthouseReport | null;
  topItems: RecommendationItem[];
  diagnostics: DiagnosticsItem[];
}) {
  const categoryScores = report ? getCategoryScores(report) : [];
  const overall = report ? getOverallHealthScore(report) : null;

  return (
    <div className="px-8 py-10 text-zinc-900">
      {!report ? (
        <div className="print-no-break rounded-2xl border border-zinc-200 bg-white p-8">
          No report loaded. Paste Lighthouse JSON and try again.
        </div>
      ) : (
        <div className="space-y-8">
          <div className="print-no-break overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            <div className="h-2 bg-primary" />
            <div className="p-7">
              <div className="text-xs font-semibold tracking-wide text-primary uppercase">
                Lighthouse Insights
              </div>
              <div className="mt-1 text-2xl font-bold text-zinc-900">Lighthouse Report</div>
              <div className="mt-2 text-sm text-zinc-700">
                URL:{" "}
                <span className="font-medium">
                  {report.finalDisplayedUrl ?? report.requestedUrl ?? ""}
                </span>
              </div>
              <div className="mt-1 text-sm text-zinc-700">
                Generated: <span className="font-medium">{formatFetchTime(report.fetchTime)}</span>
              </div>

              <div className="mt-5 flex flex-wrap items-end gap-6">
                <div>
                  <div className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
                    Overall health
                  </div>
                  <div className={`mt-1 text-4xl font-bold tabular-nums ${scoreTextClass(overall)}`}>
                    {overall === null ? "n/a" : Math.round(overall)}
                    <span className="ml-1 text-base font-medium text-zinc-500">/100</span>
                  </div>
                  <div
                    className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${scoreBadgeClass(overall)}`}
                  >
                    {bandLabel(overall)}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                {categoryScores.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-4"
                  >
                    <div className="text-sm font-semibold text-zinc-900">{s.title}</div>
                    <div className={`mt-1 text-3xl font-bold tabular-nums ${scoreTextClass(s.scorePct)}`}>
                      {s.scorePct === null ? "n/a" : Math.round(s.scorePct)}
                      <span className="ml-2 text-base font-medium text-zinc-500">/100</span>
                    </div>
                    <div
                      className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${scoreBadgeClass(s.scorePct)}`}
                    >
                      {bandLabel(s.scorePct)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <div className="h-5 w-1.5 rounded-full bg-primary" />
              <div className="text-lg font-bold text-zinc-900">Top 10: most impactful issues</div>
            </div>
            {topItems.map((item, idx) => {
              const scorePct =
                item.score === null || item.score === undefined
                  ? null
                  : Math.round(item.score * 100);
              return (
                <div
                  key={item.auditId}
                  className="print-no-break rounded-2xl border border-zinc-200 bg-white p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold text-primary">Top {idx + 1}</div>
                      <div className="mt-1 text-xs font-semibold text-zinc-600">
                        Category:{" "}
                        <span className="font-medium text-zinc-900">{item.categoryId}</span>
                      </div>
                      <div className="mt-1 text-xl font-bold text-zinc-900">{item.title}</div>
                    </div>
                    <div
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold tabular-nums ${scoreBadgeClass(scorePct)}`}
                    >
                      Score: {scorePct === null ? "n/a" : `${scorePct}%`}
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-bold text-zinc-900">Explain the problem</div>
                    <div className="mt-1 whitespace-pre-wrap text-sm text-zinc-800">{item.explain}</div>
                  </div>
                  {item.nextSteps.length > 0 ? (
                    <div className="mt-3">
                      <div className="text-sm font-bold text-zinc-900">Next steps</div>
                      <ul className="mt-1 list-disc pl-5 text-sm text-zinc-800">
                        {item.nextSteps.slice(0, 6).map((s, stepIdx) => (
                          <li key={stepIdx} className="mt-1">
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <div className="h-5 w-1.5 rounded-full bg-primary" />
              <div className="text-lg font-bold text-zinc-900">Diagnostics (Lighthouse)</div>
            </div>
            {diagnostics.map((d) => {
              const scorePct = typeof d.score === "number" ? Math.round(d.score * 100) : null;
              return (
                <div
                  key={d.auditId}
                  className="print-no-break rounded-2xl border border-zinc-200 bg-white p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold text-zinc-600">
                        Category:{" "}
                        <span className="font-medium text-zinc-900">{d.categoryId}</span>
                      </div>
                      <div className="mt-1 text-xl font-bold text-zinc-900">{d.title}</div>
                    </div>
                    {scorePct !== null ? (
                      <div
                        className={`rounded-full border px-2.5 py-1 text-xs font-semibold tabular-nums ${scoreBadgeClass(scorePct)}`}
                      >
                        Score: {scorePct}%
                      </div>
                    ) : null}
                  </div>
                  <div className="mt-3 whitespace-pre-wrap text-sm text-zinc-800">
                    <span className="font-bold text-zinc-900">Explain the problem: </span>
                    {d.explain || "No additional description available."}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
