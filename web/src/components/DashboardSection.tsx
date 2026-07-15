"use client";

import {
  getCategoryMeaning,
  getScoreBand,
  impactLabelFromScore,
  type LighthouseReport,
  type RecommendationItem,
} from "@/src/lib/lighthouse";
import { ScoreRing } from "@/src/components/ScoreRing";

function statusBadge(scorePct: number | null) {
  const band = getScoreBand(scorePct);
  if (band === "good") {
    return {
      className: "bg-secondary-container/30 text-secondary border-secondary/30",
      icon: "check_circle",
      label: "Looking Good!",
    };
  }
  if (band === "needs-improvement") {
    return {
      className: "bg-tertiary-container/20 text-tertiary border-tertiary-container/40",
      icon: "warning",
      label: "Needs Improvement",
    };
  }
  if (band === "poor") {
    return {
      className: "bg-error-container text-error border-error/30",
      icon: "error",
      label: "Needs Work",
    };
  }
  return {
    className: "bg-surface-low text-on-surface-variant border-border",
    icon: "help",
    label: "No score",
  };
}

function impactClass(label: string) {
  if (label === "High Impact") return "bg-error-container/40 text-error border-error/20";
  if (label === "Medium Impact") return "bg-tertiary-container/25 text-tertiary border-tertiary-container/40";
  return "bg-secondary-container/25 text-secondary border-secondary/20";
}

export function DashboardSection({
  overallScorePct,
  quickWins,
  categories,
  selectedCategoryId,
  onSelectCategory,
}: {
  report: LighthouseReport;
  overallScorePct: number | null;
  quickWins: RecommendationItem[];
  categories: Array<{ id: string; title: string; scorePct: number | null }>;
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
}) {
  const badge = statusBadge(overallScorePct);
  const selected = categories.find((c) => c.id === selectedCategoryId) ?? null;

  return (
    <section className="section-fade-in space-y-8">
      <div className="card-surface flex flex-col items-center p-8 text-center">
        <h2 className="mb-2 text-3xl font-bold text-foreground">Overall Site Health</h2>
        <p className="mb-6 max-w-2xl text-lg text-on-surface-variant">
          A consolidated view of your website&apos;s performance, accessibility, best practices, and SEO.
        </p>
        <ScoreRing scorePct={overallScorePct} size="lg" />
        <div
          className={`mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${badge.className}`}
        >
          <span className="material-symbols-outlined text-base">{badge.icon}</span>
          {badge.label}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-7 w-7 shrink-0 text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 2 4.5 13.2c-.35.46-.03 1.1.55 1.1H11l-1 7.7c-.08.6.68.96 1.08.5L20.5 10.3c.38-.45.05-1.1-.55-1.1H13l1-6.7c.1-.58-.6-.95-1-.5z" />
          </svg>
          Quick Wins
        </h3>
        {quickWins.length === 0 ? (
          <div className="card-surface p-6 text-on-surface-variant">No high-impact recommendations found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {quickWins.map((item) => {
              const impact = impactLabelFromScore(item.score);
              return (
                <div key={item.auditId} className="card-surface flex flex-col justify-between p-6">
                  <div>
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h4 className="text-lg font-semibold text-foreground">{item.title}</h4>
                      <span
                        className={`shrink-0 rounded-full border px-2 py-1 text-xs font-semibold ${impactClass(impact)}`}
                      >
                        {impact}
                      </span>
                    </div>
                    <p className="mb-4 line-clamp-3 text-base text-on-surface-variant">
                      {item.explain || "No description available."}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-tertiary">
                      {item.displayValue ? item.displayValue : `Category: ${item.categoryId}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
          <span className="material-symbols-outlined text-primary">category</span>
          Category Breakdown
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((c) => {
            const active = selectedCategoryId === c.id;
            const hasSelection = selectedCategoryId != null;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={active}
                onClick={() => onSelectCategory(c.id)}
                className={[
                  "relative flex cursor-pointer flex-col items-center rounded-xl border p-4 text-center transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  active
                    ? "scale-[1.02] border-primary bg-surface shadow-[0_8px_30px_rgba(249,115,22,0.18)] ring-2 ring-primary/30"
                    : hasSelection
                      ? "cursor-pointer border-transparent bg-surface-low/80 opacity-55 shadow-none hover:opacity-80 hover:border-outline-variant"
                      : "cursor-pointer border-surface-variant bg-surface shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:border-outline-variant hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]",
                ].join(" ")}
              >
                <ScoreRing scorePct={c.scorePct} size="sm" />
                <span
                  className={`mt-2 text-sm font-semibold ${active ? "text-primary" : "text-foreground"}`}
                >
                  {c.title}
                </span>
                {!hasSelection ? (
                  <span className="mt-1 text-[11px] font-medium text-on-surface-variant">Click to expand</span>
                ) : null}
              </button>
            );
          })}
        </div>

        {selected ? (
          <div className="card-surface section-fade-in flex flex-col items-center p-8 text-center">
            <ScoreRing scorePct={selected.scorePct} size="lg" />
            <h4 className="mt-4 text-2xl font-bold text-foreground">{selected.title}</h4>
            <div
              className={`mt-3 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${statusBadge(selected.scorePct).className}`}
            >
              <span className="material-symbols-outlined text-base">
                {statusBadge(selected.scorePct).icon}
              </span>
              {statusBadge(selected.scorePct).label}
            </div>
            <div className="mt-8 w-full max-w-2xl text-left">
              <h5 className="mb-2 text-xl font-semibold text-foreground">What this means</h5>
              <p className="text-base text-on-surface-variant">{getCategoryMeaning(selected.scorePct)}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-on-surface-variant">Select a category to see detail.</p>
        )}
      </div>
    </section>
  );
}
