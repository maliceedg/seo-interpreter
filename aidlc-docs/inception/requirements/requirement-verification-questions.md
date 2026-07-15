# Requirements Clarification Questions — Bolt: lighthouse-insights-v2

Please answer each question by placing a letter (and optional notes) after `[Answer]:`.
Example: `[Answer]: A` or `[Answer]: X — we want ...`

When all answers are filled, reply in chat with **Answers complete** (or similar) so we can generate `requirements.md`.

---

## Intent already captured (for reference)
Rebuild **Lighthouse Insights** UI to match Stitch v2 (`design/stitch-v2/`): Import, Dashboard (Overall Health + Quick Wins + Category Breakdown), and Category Detail — while keeping existing Lighthouse parsing and PDF/PPTX export. Brownfield Next.js app in `web/`.

---

## Question 1
How should the v2 information architecture ship?

A) Full Stitch IA — Import / Dashboard / Categories (+ category detail), desktop sidebar + mobile bottom nav

B) Hybrid — new design system + dashboard-first layout, Import remains inline on one page (no bottom nav yet)

C) Visual restyle only — keep current single-page flow; apply colors/type/cards only

X) Other (please describe after [Answer]: tag below)

[Answer]: 
B
---

## Question 2
Should **Recent Reports** persist in the browser via `localStorage` (hostname + timestamp + JSON snapshot, ~5 entries)?

A) Yes — full JSON snapshots in localStorage (as planned)

B) Yes — metadata only (hostname/time); user must re-upload JSON to reload

C) No — skip Recent Reports for this bolt

X) Other (please describe after [Answer]: tag below)

[Answer]: 
C
---

## Question 3
What should the **Settings** gear / sidebar Settings entry do in this bolt?

A) Panel with Export PDF, Export PPTX, and Reset report only

B) Same as A, plus link to portfolio / GitHub credits

C) Decorative only for now (no settings behavior)

X) Other (please describe after [Answer]: tag below)

[Answer]: 
X: this comes in a future update
---

## Question 4
How should **Overall Site Health** score be computed?

A) Average of available category scores (Performance, Accessibility, Best Practices, SEO)

B) Performance score only (as the “primary” health signal)

C) Weighted average (Performance heavier than the others)

X) Other (please describe after [Answer]: tag below)

[Answer]: 
A
---

## Question 5
For icons matching Stitch (Material Symbols), what should we use?

A) Load Material Symbols Outlined via Google Fonts (match mockups)

B) Inline SVG / simple Unicode only (no third-party icon font)

X) Other (please describe after [Answer]: tag below)

[Answer]: 
A
---

## Question 6
Header brand mark — what should replace the circular avatar in the mocks?

A) Keep existing logo.svg linking to portfolio (current brand)

B) Use a simple circular monogram / Material person icon as in Stitch

C) Text-only “Lighthouse Insights” in primary color (no mark)

X) Other (please describe after [Answer]: tag below)

[Answer]: 
X: no user icons at the moment. This will come with future user auth functionalities
---

## Question 7
Is preserving **PDF + PPTX export** with the current content structure (cover, Top 10, Diagnostics) a hard requirement for this bolt?

A) Yes — must keep both exports working with existing slide/print content

B) Keep PDF only for this bolt; PPTX can wait

C) Keep both exports, but redesign export content to match v2 tone later (out of scope if timeboxed)

X) Other (please describe after [Answer]: tag below)

[Answer]: 
C
---

## Question 8
Primary delivery surface for this bolt?

A) Responsive — mobile bottom nav + desktop sidebar equally important

B) Desktop-first — sidebar required; mobile bottom nav nice-to-have if time allows

C) Mobile-first — match Stitch phone frames; desktop can be a wider single column

X) Other (please describe after [Answer]: tag below)

[Answer]: 
A
---

## Question 9 — Security Extensions
Should security extension rules be enforced for this project?

A) Yes — enforce all SECURITY rules as blocking constraints (recommended for production-grade applications)

B) No — skip all SECURITY rules (suitable for PoCs, prototypes, and experimental projects)

X) Other (please describe after [Answer]: tag below)

[Answer]: 
A
---

## Question 10 — Property-Based Testing Extension
Should property-based testing (PBT) rules be enforced for this project?

A) Yes — enforce all PBT rules as blocking constraints (recommended for projects with business logic, data transformations, serialization, or stateful components)

B) Partial — enforce PBT rules only for pure functions and serialization round-trips (suitable for projects with limited algorithmic complexity)

C) No — skip all PBT rules (suitable for simple CRUD applications, UI-only projects, or thin integration layers with no significant business logic)

X) Other (please describe after [Answer]: tag below)

[Answer]: 
C
---

## Question 11 — Resiliency Extensions
Should the resiliency baseline be applied to this project?

A) Yes — apply the resiliency baseline as directional best practices and design-time guidance

B) No — skip the resiliency baseline (suitable for PoCs, prototypes, and experimental projects where rapid iteration matters more than reliability)

X) Other (please describe after [Answer]: tag below)

[Answer]: 
A