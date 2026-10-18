# Calculus I — Curriculum Depth, Printables, Exercises & Federated Tools Audit
**Source inspected:** `vervenveda/Khaemenes_Higher_Learning.github.io` / `courses/mathematics/calculus-1` and `vervenveda/Khaemenes_High.github.io` shared mathematics library  
**Date:** 2026-10-18 · Source-code audit, not independent classroom or live-browser acceptance

## What already exists
- 36-week curriculum (180 sessions), **92 individual lesson HTML files**, and **92 matching teacher keys** organized into 13 units.
- Every unit contains **three practice tiers** (Foundation, Core, Extended), a unit investigation/project, teacher guide, family guide, vocabulary, and an assessment route.
- Lessons include learning intentions, an essential question, a vector-style visual model, conceptual worked-reasoning notes, printable six-problem worksheets, vocabulary and portfolio prompts.
- An explicit US Letter print standard and print CSS are implemented; print-window behavior has **not** yet been manually verified across mobile/browser/printers.
- The calculator is already linked from lessons and an OHMIC CAD resource is documented in the course materials.
- Unit 01 has seven sequential local 80% mastery checks and a separate cumulative check; later-unit lesson-specific assessment QA remains pending.

## Deep findings — evidenced weaknesses

### 1. Instructional explanations frequently stop before a complete worked calculation

Source samples: Unit 02 Lesson 01 ("Approaching a Value"), Unit 06 Lesson 01 ("Chain Rule"), Unit 09 Lesson 01 ("Accumulation and Area"), Unit 12 Lesson 01 ("Differential Equations and Slope Fields"). Each includes important correct mathematical ideas and worksheet prompts, but the **Worked Reasoning** paragraphs generally explain the *method* rather than showing an explicit, line-by-line calculation from an initial problem to the checked answer.

**Academic repair:** For every lesson add at least two complete worked problems, one visual/numerical comparison with a labeled figure or table, and a misconception diagnosis and corrected example. Preserve the conceptual narratives, but ensure the learner actually sees how the calculations work.

### 2. Tiered printables repeat questions rather than raising cognitive depth

The three print-friendly unit practice tiers exist, but the inspected Unit 02 Core printable repeats "Evaluate lim x→3 of (x+1)" several times on one sheet; Unit 12 Extended repeats Euler-step, equilibrium and exponential-solution prompts. The Foundation/Core/Extended tiers sometimes differ mainly in their generic instruction sentence, not the complexity of the mathematics.

**Academic repair:** Deduplicate prompts throughout all 39 unit practice printables and curate progression:
- **Foundation:** scaffolded retrieval, variable identification, and guided calculations.
- **Core:** mixed independent procedures, representations, exact justification and unit checks.
- **Extended:** proofs/counterexamples, challenging models, parameter changes, error bounds, and interpretation.
- Every printed problem should receive a matched worked instructor solution, and at least one fully documented alternative method when applicable.
- Preserve generous working space, grayscale legibility and print-to-PDF behavior.

### 3. Unit projects are structured, but insufficiently distinct

Projects exist for all 13 units, each with rubric components totaling 100 points. Inspected projects include "Limit Evidence Laboratory," "Accumulation & Numerical Estimation Laboratory" and the final Calculus Modelling Capstone. Their **Plan–Analyze–Validate**, evidence checklist and rubric language are virtually identical. They lack the unit-specific measurements, example dataset, calculation requirements and model validation needed for exemplary laboratories.

**Academic repair:** Give each project a concrete reproducible brief and unique evidence criteria (for example: two-sided numerical/graphical limit laboratory; Riemann sum spreadsheet including error analysis; optimization design model; Euler-method scenario with step-size error). A teacher-reviewed project reaches mastery only at **80% or higher**, with every safety-critical requirement also satisfied.

### 4. Teacher guides need direct instructional support

Teachers have answer keys, but inspected Unit 02 and Unit 12 guides mostly describe high-level teaching principles and evidence cycles. Add pacing, diagnostic misconception probes, model worked solutions, differentiation, guided questions, scoring exemplars, feedback scripts and reteaching/reassessment decisions.

### 5. Visuals are present but rarely manipulable

The current SVG diagrams are useful on paper but are mostly conceptual/static. The shared High School mathematical studios now provide graphs, models and games **without copying their code**. Nonetheless, a full Calculus I set still lacks verified dedicated secant-to-tangent, numerical limit, derivative-graph, Riemann-sum, accumulation, optimization, and slope-field manipulatives.

**Academic repair:** Audit for any existing calculus-specific manipulatives elsewhere in the ecosystem, then build only genuine gaps.

### 6. Assessment-grade separation remains essential

The High School studios deliberately save independent practice scores and must **never unlock a Calculus I step**. The Academy's already established policy remains: the next required lesson or activity stays locked until its preceding assessed mastery reaches **80%**. A unit requires every constituent lesson and its cumulative assessment to pass. Public HTML scores, a completion checkbox, and teacher-key access do not create verified collegiate certificate credits.

## Implemented this pass — shared source-owned tools

Created `assets/calculus1-shared-math-tools-v1.js` and connected it to:
1. Every existing lesson through the canonical shared `assets/lesson-tools.js` loader.
2. Every unit landing page through `assets/calculus1-unit-route-gates-v1.js`.
3. The main course's existing **Math Games & Tools** page, adding a filter by all 13 units and integrating with the activity-launch dialog and independent "Open" links.

**Verified 14 exact source HTML targets in the High School GitHub `main` tree.** The centrally curated set includes Scientific Calculator v4, Function Transformation, Slope & Rate, Quadratic Graph, Polynomial Zeros, Unit Circle, Trigonometric Wave, Trigonometric Identity, Exponential/Logarithm, Sequence/Series, Statistics Detective, Functions/Systems, Interval Evidence, and Right Triangle Trigonometry.

All links point to `vervenveda/Khaemenes_High.github.io` and remain owned/maintained there. The source JavaScript contains no third-party libraries, third-party telemetry, duplicated lesson code, or imported score data. Unit 01 lessons receive individual curricular assignments. Other lessons receive explicit matches where available, or relevant unit-level prerequisite studios.

**Scope disclaimer:** These are often prerequisite *bridge games*, not a substitute for Calculus I worked instruction or native calculus laboratories. Scores are not transferred across repositories. Tools require network when following external origin links; local lessons retain their existing offline path when cached. Source paths were verified, but live launch, iframe permissions, screen reader, and mobile acceptance are still pending.

## Three next concrete academic upgrades (without replacing established material)
1. **Unit 02 worked-instruction and printable repair.** Enrich all eight Limits lessons with complete computations and real data/graph examples. Deduplicate Foundation/Core/Extended practice; create matched full teacher solutions; add a limit-table + hole/jump graph workshop.
2. **Unit 02 proof-of-mastery.** Replace generic question distractors with reviewed mathematics-specific banks and ensure each lesson/activity respects the sequential 80% progression. Preserve question-form snapshots, free retakes, and learner-scoped records.
3. **Course-wide repeatability sweep.** Programmatically inspect all 92 lesson printables and 39 practice sheets for repeated examples/prompts, unworked techniques, mislabeled visuals and dead links; rank Units 03–13 by severity, then harden in dependency order.

*Steward: Jennifer Kay Pearl · Khaemenes Higher Learning. No STOS or private system details are published.*
