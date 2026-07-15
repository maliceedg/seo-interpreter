"use client";

import type { CSSProperties } from "react";
import { getScoreBand } from "@/src/lib/lighthouse";

const SIZES = {
  sm: { px: 64, stroke: 6, text: "text-sm" },
  md: { px: 96, stroke: 8, text: "text-2xl" },
  lg: { px: 180, stroke: 10, text: "text-5xl" },
} as const;

function ringStroke(scorePct: number | null) {
  const band = getScoreBand(scorePct);
  if (band === "good") return "var(--score-good)";
  if (band === "needs-improvement") return "var(--score-warn)";
  if (band === "poor") return "var(--score-poor)";
  return "var(--surface-variant)";
}

export function ScoreRing({
  scorePct,
  size = "md",
}: {
  scorePct: number | null;
  size?: keyof typeof SIZES;
}) {
  const { px, stroke, text } = SIZES[size];
  const radius = (px - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalized = Math.max(0, Math.min(100, scorePct ?? 0));
  const dashOffset = circumference * (1 - (scorePct === null ? 0 : normalized) / 100);

  return (
    <div className="relative" style={{ width: px, height: px }}>
      <svg width={px} height={px} className="-rotate-90" aria-hidden>
        <circle
          cx={px / 2}
          cy={px / 2}
          r={radius}
          strokeWidth={stroke}
          className="fill-none"
          style={{ stroke: "var(--surface-variant)" }}
        />
        <circle
          cx={px / 2}
          cy={px / 2}
          r={radius}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="fill-none score-ring-progress"
          style={
            {
              stroke: ringStroke(scorePct),
              "--ring-circumference": circumference,
            } as CSSProperties
          }
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-bold tabular-nums text-foreground ${text}`}>
          {scorePct === null ? "n/a" : Math.round(scorePct)}
        </span>
      </div>
    </div>
  );
}
