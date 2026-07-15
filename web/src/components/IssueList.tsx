"use client";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  impactLabelFromScore,
  type DiagnosticsItem,
  type RecommendationItem,
} from "@/src/lib/lighthouse";

type IssueItem = RecommendationItem | DiagnosticsItem;

function isRecommendation(item: IssueItem): item is RecommendationItem {
  return "priority" in item && "nextSteps" in item;
}

function EvidenceBlock({ item }: { item: IssueItem }) {
  if (!item.evidence) return null;
  return (
    <div className="mt-3 rounded-lg border border-border bg-surface-low p-3">
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
  const scorePct =
    item.score === null || item.score === undefined ? null : Math.round(item.score * 100);
  const impact = impactLabelFromScore(item.score);
  const badge =
    mode === "priority"
      ? `Priority: ${scorePct === null ? "n/a" : `${scorePct}%`}`
      : `Score: ${scorePct === null ? "n/a" : `${scorePct}%`}`;

  return (
    <details className="card-surface group p-4">
      <summary className="cursor-pointer list-none">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-error-container/50 text-error">
              <span className="material-symbols-outlined text-xl">
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
          <span className="shrink-0 rounded-full border border-border bg-surface-low px-2 py-1 text-xs font-medium tabular-nums text-on-surface-variant">
            {badge}
          </span>
        </div>
      </summary>

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
    </details>
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
