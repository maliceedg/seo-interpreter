# Story Generation Plan — lighthouse-insights-v2

Fill every `[Answer]:` below, then reply **Plan approved** (or request changes).
Stories will be generated only after this plan is approved.

---

## Methodology checklist (execute after approval)

- [x] Generate `aidlc-docs/inception/user-stories/personas.md`
- [x] Generate `aidlc-docs/inception/user-stories/stories.md` (INVEST + acceptance criteria)
- [x] Map personas → stories
- [x] Trace each story to requirement IDs (FR-xx / NFR-xx)

---

## Question 1 — Breakdown approach

How should we organize stories?

A) **User Journey-Based** — Import → Analyze → Explore issues → Export (recommended for this bolt)

B) **Feature-Based** — Design system, Import UI, Dashboard, Issues list, Header/Footer, Exports as separate feature stories

C) **Hybrid** — Journey epics with feature-sized stories underneath

X) Other (please describe after [Answer]: tag below)

[Answer]: 
A
---

## Question 2 — Personas

Who should we model? (Auth is deferred; no avatar/settings.)

A) Single persona: **SEO / Performance Analyst** who imports JSON and exports client deliverables

B) Two personas: **Analyst** (above) + **Client Stakeholder** (receives PDF/PPTX only — out-of-app)

C) Skip named personas; use role “User” only

X) Other (please describe after [Answer]: tag below)

[Answer]: 
B
---

## Question 3 — Story granularity

A) **Coarse** — ~5–7 stories (faster Construction kickoff)

B) **Standard** — ~8–12 stories with clear AC per section

C) **Fine** — 15+ stories (more planning overhead)

X) Other (please describe after [Answer]: tag below)

[Answer]: 
B
---

## Question 4 — Acceptance criteria style

A) Checklist bullets (Given/When/Then optional) — concise, testable

B) Full Gherkin for every story

X) Other (please describe after [Answer]: tag below)

[Answer]: 
A
---

## Question 5 — Priority for Construction sequencing

A) Design system + chrome first, then Import, then Dashboard/health, then issues, then verify exports

B) Import + parse path first (keep behavior), then visual restyle outward

C) No preference — AI chooses optimal order in Workflow Planning

X) Other (please describe after [Answer]: tag below)

[Answer]: 
A