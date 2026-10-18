# Calculus I — Fresh Verification & Three Resolved Bubbles

**Date:** 2026-10-18  
**Canonical source:** `vervenveda/Khaemenes_Higher_Learning.github.io`, branch `main`  
**Reference:** Khaemenes High Pre-Algebra — sequential, noncompensatory **80% mastery policy**.  
**Assurance:** Source-tree and simulated JavaScript interaction tests; real deployed-site/browser/mobile acceptance is not demonstrated.

## Repository integrity
- **92 lesson pages**, **13 unit landing pages**, and **39 differentiated unit practice printables** remained present.
- The seven Unit 01 lesson checks, the Unit 01 cumulative assessment, and the source-owned High School mathematics-tool integration remained in `main`.
- 15 tools now appear in the Calculus I study tool mappings (14 previously linked High School resources + 1 new original Limits Laboratory).
- No changes were made to High School game repositories, Academy grades or STOS/private backend files.

## Bubble 1 — BLOCKER: units could advance on a cumulative practice score alone

**Observed:** `assets/calculus1-progress-gates-v1.js` accepted `unitBest(n)` for Units 02–13 without checking a complete sequence of individual lesson mastery assessments. An arbitrary positive practice result could therefore make the next unit appear unlocked.

**Repair:** Fail closed for unreviewed Units 02–13. Unit 02 opens only after all seven Unit 01 lesson gates **and** its 21-question cumulative assessment reach **80% or higher**. Unit 03 does **not** open just because Unit 02's publicly available practice quiz scores 100%; it needs the unbuilt Unit 02 lesson-level 80% assessment sequence first. No existing learner's scores or earlier successful attempts were erased.

**Regression evidence:** Seven Unit 01 scores at 80% without the unit assessment keep Unit 02 locked. Adding the passing unit assessment opens Unit 02. A 100% Unit 02 practice score does **not** open Unit 03. Switching to a different local learner locks Unit 02 again. This is local formative gating, **not** secure institutional/credential verification.

## Bubble 2 — HIGH: repetitive printables and generic graphical evidence

**Observed (before):** 12 Foundation prompts had 2 repeats, 16 Core prompts had 9 repeats, and 12 Extended prompts had 2 repeats. Each sheet contained generic SVG illustrations unrelated to the individual prompt.

**Repair:** Replace all 40 tasks with mathematically distinct, tier-appropriate limits exercises:
- Foundation: 12/12 unique, scaffolded substitution, factoring, one-sided reasoning and asymptote foundations.
- Core: 16/16 unique, mixed rationalization, standard trigonometric limits, removable/jump discontinuities, and rational function behavior.
- Extended: 12/12 unique, higher-order factoring, parameterized continuity, radical/exponential and signed-infinity reasoning.
- Remove 40 generic diagrams that could be confused for evidence for the specific function. Retain worksheet space and print CSS.
- Create a synchronized `teacher-practice-key.json` **and printable** `teacher-practice-key.html`, with one worked mathematical explanation for every question.
- Link the key from `units/unit-02/teacher-guide.html`.

**Regression evidence:** New Foundation 12/12 unique, Core 16/16 unique, Extended 12/12 unique, keys match question text by tier and number, with zero legacy generic graphs remaining. Faculty subject review and manual print preview still required.

## Bubble 3 — MEDIUM: no native Calculus I limits investigation

**Observed:** The federated High School resources are valuable math bridges, but none of the selected resources is an actual two-sided limits laboratory. Unit 02 needs numerical + graphical comparison, not only prerequisite exercises.

**Repair:** Create `tools/limits-laboratory/index.html` in the Higher Learning owning repository:
- Six actual limit cases: removable hole, assigned-point discrepancy, continuous polynomial, jump, vertical asymptote, and infinite oscillation.
- Five left/right paired numerical rows per case; an SVG-generated two-sided graph with asymptote and holes/assigned points as applicable.
- Accessible native controls, text alternatives, a written-explanation activity, model reasoning reveal/hide, and printable worksheets.
- Dependency-free, no third-party tracking, no learner profiles or grade mutations.
- Connect as a **local** Calculus I tool into the existing curated math tool directory for Units 02 and 03, including relevant individual lessons. High School tools remain source-owned and unduplicated.

**Regression evidence:** Six cases initialize, produce five paired table rows and a graph each, and display model reasoning. The 15-tool directory maps the original lab correctly to Units 02/03 and Unit 02 Lesson 01. Source JavaScript parses. Real display/iframe/mobile testing remains pending.

## Remaining high-priority academic issues (not counted as resolved)

1. **Unit 02 lesson-by-lesson curriculum depth and strict mastery:** Eight lesson-specific high-quality instructional builds and Monte Carlo question banks, plus integrated locked progression, are still needed. The older publicly distributed Unit 02 cumulative quiz is only formative practice and does not release Unit 03.
2. **Faculty subject review:** Verify correctness and pedagogic difficulty of the 40 revised print problems/answers and all existing unit question banks; no unreviewed public quiz grants college credit or an institutional certificate.
3. **Browser acceptance:** Verify that the deployed `vervenveda.com` URLs are live, that the interactive lab, source-owned High School game dialogs, printing, keyboard/screen reader, Linux/tablet/mobile, and learner switching work in real browsers. The public website could not be fetched reliably during this audit.

### Next recommended sequence
**Unit 02 Lesson 01 → Lesson 08**: instruction depth and multiple worked examples; interactive limits model linked with explicit exercises; a mathematically reviewed randomized assessment bank; 80% independent mastery per lesson; then a separately gated unit cumulative assessment with a saved attempt snapshot and faculty rubric.

**Steward:** Jennifer Kay Pearl · Khaemenes Higher Learning.  
**Invariant:** Educational access stays free; formal progression requires the Academy's established 80% mastery policy.
