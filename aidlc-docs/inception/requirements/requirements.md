# Requirements — Bolt: lighthouse-insights-v2

## Intent Analysis Summary
| Field | Value |
|-------|--------|
| **User request** | Rebuild Lighthouse Insights UI to match Stitch v2 screens; adopt AI-DLC process; keep parse + PDF/PPTX |
| **Request type** | Enhancement (brownfield UI / IA restyle toward Stitch designs) |
| **Scope estimate** | Multiple components within `web/` (layout, page sections, tokens, fonts, icons) |
| **Complexity estimate** | Moderate |
| **Requirements depth** | Standard |

## Decisions Locked (from Q&A)

| ID | Decision |
|----|----------|
| Q1 + F1 | **Continuous page, Stitch screens as sections** — Import the Import / Dashboard / Category-detail *visual patterns* into one scrollable experience. **No sidebar / bottom nav** for this bolt. Include a **simple footer**. A **minimal top bar with existing `logo.svg` + product name** is in scope (brand chrome, not multi-destination nav). |
| Q2 | **No Recent Reports** this bolt |
| Q3 + F2 | **Settings deferred.** Exports/Reset live as **primary actions in the top header** of the results area when a report is loaded (optimal default) |
| Q4 | **Overall Site Health** = mean of available category `scorePct` values |
| Q5 | **Material Symbols Outlined** via Google Fonts |
| Q6 | **No user/avatar icons**; keep portfolio-linked logo |
| Q7 | **Keep PDF + PPTX working** with current content structure; redesign of export decks is **out of scope** |
| Q8 | Superseded by F1: responsive **stacked single column** (mobile + desktop); widen content max-width on desktop without nav chrome |
| Ext Security | **Enabled** (blocking where applicable) |
| Ext PBT | **Disabled** |
| Ext Resiliency | **Enabled** as directional guidance; cloud/infra rules largely **N/A** for this client-only app |

## Functional Requirements

### FR-01 Design system
Apply Stitch tokens from `design/stitch-v2/lighthouse_insights/DESIGN.md`: surfaces, primary `#a04100` / primary-container `#ff6b00`, score colors, card elevation, rounded shapes. Flat non-tiling background.

### FR-02 Typography
Use **Public Sans** for UI; **Courier Prime** for JSON textarea / mono snippets.

### FR-03 Import section
Stitch Import patterns: drop zone, paste JSON, Analyze/Load, how-to steps. Keep existing parse/upload/paste/drag-drop behavior. No Recent Reports list.

### FR-04 Dashboard section (when report loaded)
- Overall Site Health hero gauge (average of categories) + status badge (good / needs improvement / poor)
- Quick Wins from Top recommendations (impact badges; savings/`displayValue` when present)
- Category Breakdown cards (4 gauges)

### FR-05 Category / issues presentation
Category score detail and impactful issues (existing Top 10 + Diagnostics data), styled like Stitch issue cards. Keep **virtualized scrolling** for long lists. Expandable details for explain / next steps / evidence.

### FR-06 Header / footer
- Top: logo → portfolio, title “Lighthouse Insights”, and when report loaded: Export PDF, Export PPTX, Reset
- Footer: simple credits (Edgardo / GitHub) as today

### FR-07 Out of scope this bolt
Sidebar, bottom nav, Settings panel, Recent Reports, export content redesign, auth/avatars

## Non-Functional Requirements

### NFR-01 Responsive layout
Usable from phone to desktop; stacked single composition; generous max-width on large screens.

### NFR-02 Client-only
No new backend. Parsing and exports remain in-browser.

### NFR-03 Accessibility
Preserve contrast (DESIGN.md slate on light surfaces); focus rings on controls; gauges use text scores not color-only.

### NFR-04 Performance
Virtualize long issue lists; avoid mounting full Lighthouse JSON in huge DOM trees beyond the textarea.

### NFR-05 Security (extension ON — applicable subset)
| Rule | Status |
|------|--------|
| SECURITY-01 Encryption at rest/transit (cloud stores) | **N/A** — no app data store; Recent Reports skipped |
| SECURITY-02 Access logging intermediaries | **N/A** — no LB/API GW in repo |
| SECURITY-03 App logging | **N/A**/light — no centralized logger; avoid logging full JSON to console in production paths |
| XSS / unsafe HTML | **Applicable** — render audit text as React text nodes (no `dangerouslySetInnerHTML` on report fields) |
| Dependency / secrets | **Applicable** — no secrets in client; continue local parse only |

### NFR-06 Resiliency (extension ON — applicable subset)
Most multi-AZ/DR/CI rules **N/A** (no cloud workload in scope). Applicable:
- Clear error states on invalid JSON / failed parse
- Disabled export buttons when no report
- Non-blocking UI if PPTX generation fails (surface error message)

## Acceptance Criteria (bolt-level)
1. Visual language matches Stitch tokens/typography (Public Sans, Material icons, orange primary)
2. Import + health + Quick Wins + categories + issues readable on mobile and desktop **without** sidebar/bottom nav
3. Logo header + simple footer present
4. Export PDF/PPTX and Reset available from header when report loaded
5. Overall score = average of present category scores
6. Existing `lighthouse.ts` / `pptx.ts` engines reused; print-root still works
7. Virtual list still used for long Diagnostics/issue lists

## Key Summary
Hybrid **content** (Stitch screens inlined), minimal **chrome** (logo bar + footer, no nav), design-system upgrade, keep exports structure, skip history/settings/auth.
