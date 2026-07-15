# Requirements Follow-Up Questions — Ambiguity Resolution

Two answers conflict. Please resolve so we can finalize `requirements.md`.

---

## Question F1
**Navigation vs layout:** You chose **Hybrid** (Q1-B: single page / Import inline, **no bottom nav yet**) and also **Responsive** (Q8-A: **mobile bottom nav + desktop sidebar equally important**).

Which interpretation should we lock for this bolt?

A) Hybrid chrome — single-page / Import inline; desktop gets a left nav/sidebar for section jump (Dashboard / Categories / Import anchors); **no** mobile bottom nav yet; mobile uses stacked sections

B) Full chrome now — ship desktop sidebar **and** mobile bottom nav, but keep **Import content inline** (not a separate route) when that tab is active

C) Pure hybrid — one continuous page (Import + results); **neither** sidebar nor bottom nav; rely on scroll + in-page section headers only

X) Other (please describe after [Answer]: tag below)

[Answer]: 
X: I'd like to import the coming screens annd also add the simple footer. No nav needed for this ocation unless you deem that a nav with a logo should be implemented.
---

## Question F2
Settings (Q3) and user/avatar icons (Q6) are deferred. For export/reset in this bolt, where should those actions live?

A) Primary actions in the top header of the results/Dashboard area (Export PDF, Export PPTX, Reset) — no Settings entry

B) Same as A, plus duplicate compact actions near the Import form

C) Other placement (describe)

X) Other (please describe after [Answer]: tag below)

[Answer]: 
X: I don't really have a preference. I would like for you to do the most optimal conclusion