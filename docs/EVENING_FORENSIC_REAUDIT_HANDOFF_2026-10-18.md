# Khaemenes Higher Learning — Evening Forensic Re-Audit & Continuity Handoff
**Verified:** October 18, 2026 (late evening) · **Branch:** `main` · **Audit-only pass**

## What survived the interruption

The live repository's `main` head at the start of this independent pass was `fac0a729ef9c6a7efe051de2fc7ca1c568595167`. Its latest commit contains `docs/ACADEMY_FIRST_TITLES_AND_MASTERY_AUDIT_2026-10-18.md`, documenting implementation of the three prior repairs. Independent reading of the actual source confirms the changes are present. No classroom/browser production acceptance is claimed.

| Agreed priority | Independently verified | Limitation |
|---|---|---|
| **1. Study activity vs 80% mastery** | Calculus I `assets/app.js` explicitly presents 36-week checkboxes as *activity only*, reports the seven Unit 01 scored practice gates separately, calls manual scores unverified and exposes gate status; the shared Calculus I gate module is present. Other mathematics `assets/app-core.js` modules label local score/activity as informational. | The other ten principal math tracks **do not yet implement a verified sequential lesson → 80% → unit progression engine**. A clearer label is not enforcement. |
| **2. Formative vs verified assessment** | Calculus I's midterm/final/unit pages have prominent disclaimers that public-source tests are **formative practice**, not institutionally verified exams or certificates; dashboard labels the two public forms as practice. The other nine sampled mathematics `app-core.js` implementations distinguish local practice/self-entered evidence from verification. | Standalone older examination hubs still contain inconsistent older language (e.g. Calculus I midterm/final eyebrow **“Formal local assessment”** and footer **“Formal Assessment”**; Linear Algebra `assessments/index.html` says **“Formal assessments save attempts locally”**). |
| **3. Khaemenes Academy as primary title** | A shared `assets/khaemenes-academy-title-v1.js` presents a 33px maximum Academy H1 and 24px maximum course/portal H2. All eleven canonical math lesson-tool loaders include the shared script, math landing/unit templates contain it, and the Limits Laboratory and adult Academy portal title hierarchy were observed. | It does **not** yet cover every individual HTML file. Examples without the shared title loader include standalone Unit 02 Core printable, Calculus I midterm, a Linear Algebra assessment hub and individual faculty-key pages. Academy adult pages have the hierarchy but their own older larger sizing rules. |

## Verified inventory and static checks

- GitHub recursive `main` tree: **4,173 files**, including **3,172 HTML files**, **1,012 regular mathematics lesson HTML pages** (as matched by `units/unit-XX/lessons/uXX-lXX.html`), and **143 mathematics unit homepages**.
- Reviewed the primary institution-title script source and **11** mathematics `assets/lesson-tools.js` script loaders; JavaScript source syntax accepted by the audit runner for all 11.
- Reviewed **nine** mature mathematics `assets/app-core.js` engines (Abstract Algebra, Calculus II, Differential Equations, Discrete Mathematics, Introduction to Proofs, Linear Algebra, Real & Complex Analysis, Statistics, Topology & Differential Geometry); all parsed. The tenth companion program, Precalculus & Trigonometry, has a larger independent `assets/app.js` that explicitly distinguishes practice and manual records; no full technical/academic regression has been run here.
- The Calculus I assessment center and gradebook display *informational* averages; course dashboard explicitly explains that checking off five weekly sessions **does not** unlock the next lesson.
- The standalone `Khaemenes_Academy.github.io/adult/index.html` already contains H1 “Khaemenes Academy” and H2 “Adult Learner Portal”. Adult enrollment likewise has Academy-first hierarchy.
- No student records were modified. No source code was changed in this *verification-only* pass.

## Three next bubbles, in order

### P1 — Real 80% progression beyond Calculus I
**Risk: academic policy noncompliance.** Source examples: `courses/linear-algebra/assets/app-core.js`, `courses/calculus-ii/assets/app-core.js`, and their lesson pages. Student study checkboxes may be accurately called “activity”, but a complete prerequisite-linked, reviewed 80% lesson → next lesson gate remains absent. **Next action:** use Pre-Algebra's established behavior and the Calculus I Unit 01 release as reference; implement fail-closed identity-scoped lesson gates, reliable reviewed question banks, free retakes, and saved attempt snapshots. Do not promote a manually checked/entered or public quiz score to a verified credential.

### P2 — Honest standalone assessment labels and authorization
**Risk: contradictory student-facing messaging.** Specific mismatch: Calculus I `assessments/midterm.html` and `final.html` still call themselves formal in visible page chrome while the new notice correctly says *formative*. Linear Algebra assessment index similarly claims *formal assessments*. **Next action:** apply accurate “Practice Midterm / Practice Final” wording to standalone pages, leave actual question banks and learner records intact, and develop a separate supervised/authorized summative assessment process. No fake accreditation or transcript claims.

### P3 — Finish Academy-first heading hierarchy on independent HTML pages
**Risk: design inconsistency and mixed heading semantics.** The script covers most primary course-learning paths, but the full 3,172 HTML files were not rewritten. Printable worksheets, teacher keys, other assessment subpages and specialized applications can still present the subject as H1 without the Academy. **Next action:** an accessibility/print-aware content sweep adding “Khaemenes Academy” H1 with the relevant page title as a smaller H2; preserve readable printables, current IDs/bookmarks, mobile layout, and course scripts. Avoid blanket DOM edits that break form/heading labels. Normalize adult campus title spacing only after visual comparison.

## Academic invariant

**80% is the established Academy-wide, noncompensatory mastery policy**. The next required learning activity or lesson remains locked until the preceding required demonstration reaches 80%; every required unit, project, lab, midterm, final and capstone also must independently meet the threshold as specified. Review, practice and retakes remain free. A locally calculated mark does not establish independently verified collegiate credit or accreditation status.

## Next-session starting point

Begin with **P1: Linear Algebra** as the next mathematics collegiate fine-tuning course. Verify its question-bank quality and actual lesson navigation before altering any gate so that progress is neither wrongly unlocked nor permanently inaccessible. Then repair P2 standalone assessment wording and P3 missing independent title pages.

**Testing not performed here:** live website deployment/browser UI, mobile print preview, screen reader, student profile switching on real devices, independent mathematical faculty review, secure assessment administration. These remain open acceptance criteria.

*Jennifer Kay Pearl · Khaemenes Academy · audit/handoff only; educational access stays free.*
