"use client";

import {
  formatFetchTime,
  getCategoryScores,
  type DiagnosticsItem,
  type LighthouseReport,
  type RecommendationItem,
} from "@/src/lib/lighthouse";

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
              URL:{" "}
              <span className="font-medium">{report.finalDisplayedUrl ?? report.requestedUrl ?? ""}</span>
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
                  <div className="mt-1 whitespace-pre-wrap text-sm text-zinc-800">{item.explain}</div>
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
                <div className="mt-3 whitespace-pre-wrap text-sm text-zinc-800">
                  <span className="font-bold text-zinc-900">Explain the problem: </span>
                  {d.explain || "No additional description available."}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
