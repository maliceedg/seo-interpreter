"use client";

import { useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  getScoreBand,
  impactLabelFromScore,
  type DiagnosticsItem,
  type RecommendationItem,
} from "@/src/lib/lighthouse";

type IssueItem = RecommendationItem | DiagnosticsItem;

function isRecommendation(item: IssueItem): item is RecommendationItem {
  return "priority" in item && "nextSteps" in item;
}

function urgencyPct(scorePct: number | null): number | null {
  if (scorePct === null) return null;
  return Math.max(0, Math.min(100, 100 - scorePct));
}

/** Color by urgency: 0 gray, then green → yellow → red as urgency rises. */
function urgencyPillClass(urgency: number | null) {
  if (urgency === null) return "border-border bg-surface-low text-on-surface-variant";
  if (urgency <= 0) return "border-border bg-surface-low text-on-surface-variant";
  if (urgency < 40) return "border-score-good/25 bg-score-good/10 text-score-good";
  if (urgency < 70) return "border-amber-500/30 bg-score-warn/20 text-amber-800";
  return "border-score-poor/25 bg-score-poor/10 text-score-poor";
}

function urgencyIconTone(urgency: number | null) {
  if (urgency === null || urgency <= 0) return "bg-surface-low text-on-surface-variant";
  if (urgency < 40) return "bg-score-good/10 text-score-good";
  if (urgency < 70) return "bg-score-warn/20 text-amber-700";
  return "bg-score-poor/10 text-score-poor";
}

function scorePillClass(scorePct: number | null) {
  const band = getScoreBand(scorePct);
  if (band === "good") {
    return "border-score-good/25 bg-score-good/10 text-score-good";
  }
  if (band === "needs-improvement") {
    return "border-amber-500/30 bg-score-warn/20 text-amber-800";
  }
  if (band === "poor") {
    return "border-score-poor/25 bg-score-poor/10 text-score-poor";
  }
  return "border-border bg-surface-low text-on-surface-variant";
}

function scoreIconTone(scorePct: number | null) {
  const band = getScoreBand(scorePct);
  if (band === "good") return "bg-score-good/10 text-score-good";
  if (band === "needs-improvement") return "bg-score-warn/20 text-amber-700";
  if (band === "poor") return "bg-score-poor/10 text-score-poor";
  return "bg-surface-low text-on-surface-variant";
}

function EvidenceBlock({ item }: { item: IssueItem }) {
  if (!item.evidence) return null;
  return (
    <div className="mt-3 rounded-lg border border-border bg-surface-low/80 p-3">
      <div className="text-xs font-semibold text-foreground">Evidence</div>
      <div className="mt-1 text-sm text-on-surface-variant">{item.evidence.summary}</div>
      {item.evidence.bullets && item.evidence.bullets.length > 0 ? (
        <ul className="mt-2 space-y-1 text-sm text-on-surface-variant">
          {item.evidence.bullets.slice(0, 4).map((b, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-outline" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function IssueCard({ item, mode }: { item: IssueItem; mode: "priority" | "score" }) {
  const [open, setOpen] = useState(false);
  const scorePct =
    item.score === null || item.score === undefined ? null : Math.round(item.score * 100);
  const urgency = urgencyPct(scorePct);
  const impact = impactLabelFromScore(item.score);
  const badge =
    mode === "priority"
      ? `Priority: ${urgency === null ? "n/a" : `${urgency}%`}`
      : `Score: ${scorePct === null ? "n/a" : `${scorePct}%`}`;
  const pillClass = mode === "priority" ? urgencyPillClass(urgency) : scorePillClass(scorePct);
  const toneClass = mode === "priority" ? urgencyIconTone(urgency) : scoreIconTone(scorePct);

  return (
    <div className="card-surface overflow-hidden p-4 transition-shadow duration-300">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer list-none flex-wrap items-start justify-between gap-3 text-left"
      >
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${toneClass}`}
          >
            <span className="material-symbols-outlined text-xl" aria-hidden>
              {item.categoryId === "performance"
                ? "speed"
                : item.categoryId === "accessibility"
                  ? "accessibility"
                  : item.categoryId === "seo"
                    ? "travel_explore"
                    : "verified"}
            </span>
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-foreground">{item.title}</div>
            <div className="mt-1 text-xs font-medium text-on-surface-variant">
              Category: <span className="font-semibold text-foreground">{item.categoryId}</span>
              {impact !== "n/a" ? ` · ${impact}` : ""}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold tabular-nums ${pillClass}`}
            title={
              mode === "priority"
                ? "Priority = how urgent the issue is (100 − Lighthouse score). Higher = more urgent."
                : "Lighthouse audit score (higher = better)"
            }
          >
            {badge}
          </span>
          <span
            className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              open ? "rotate-180" : "rotate-0"
            }`}
            aria-hidden
          >
            expand_more
          </span>
        </div>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="mt-3 space-y-3 border-t border-border pt-3">
            <div>
              <div className="text-xs font-semibold text-foreground">Explain the problem</div>
              <div className="mt-1 whitespace-pre-wrap text-sm text-on-surface-variant">
                {item.explain || "No description available."}
              </div>
            </div>

            {isRecommendation(item) && item.nextSteps.length > 0 ? (
              <div>
                <div className="text-xs font-semibold text-foreground">Next steps</div>
                <ul className="mt-2 list-disc pl-5 text-sm text-on-surface-variant">
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
        </div>
      </div>
    </div>
  );
}

export function IssueList({
  title,
  subtitle,
  items,
  mode,
}: {
  title: string;
  subtitle?: string;
  items: IssueItem[];
  mode: "priority" | "score";
}) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 96,
    overscan: 6,
    gap: 12,
  });

  if (items.length === 0) {
    return (
      <section className="space-y-3">
        <div>
          <h3 className="text-2xl font-semibold text-foreground">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-on-surface-variant">{subtitle}</p> : null}
        </div>
        <div className="card-surface p-6 text-on-surface-variant">No items.</div>
      </section>
    );
  }

  const useVirtual = items.length > 6;

  return (
    <section className="section-fade-in space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h3 className="text-2xl font-semibold text-foreground">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-on-surface-variant">{subtitle}</p> : null}
        </div>
        <div className="text-xs font-medium text-on-surface-variant">{items.length} item(s)</div>
      </div>

      {useVirtual ? (
        <div
          ref={parentRef}
          className="overflow-y-auto overscroll-contain pr-1"
          style={{ maxHeight: 560 }}
        >
          <div className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
            {virtualizer.getVirtualItems().map((row) => {
              const item = items[row.index];
              return (
                <div
                  key={item.auditId}
                  data-index={row.index}
                  ref={virtualizer.measureElement}
                  className="absolute top-0 left-0 w-full"
                  style={{ transform: `translateY(${row.start}px)` }}
                >
                  <IssueCard item={item} mode={mode} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <IssueCard key={item.auditId} item={item} mode={mode} />
          ))}
        </div>
      )}
    </section>
  );
}
