# Advanced Geometric Topology — A+++ Audit 01
## Lessons 01–08 · Foundational Surface Quotients

**Audit date:** 2026-08-16  
**Course model:** Self-paced  
**Canonical lesson root:** `courses/advanced-geometric-topology/curriculum/lessons/`

## Executive result

**Status: PASS WITH ARCHITECTURAL CLEANUP**

The first mastery cycle is pedagogically coherent and ready to serve as the prerequisite block for the next conceptual sequence. No destructive renaming is recommended.

### Verified repository sequence
- Lesson 01 — `KH-MATH-AGT-W01-R01_building-surfaces-from-polygons`
- Lesson 02 — `KH-MATH-AGT-W01-CR01_quotient-spaces-polygonal-schemas`
- Lesson 03 — `KH-MATH-AGT-W01-WE01_worked-surface-identification-examples`
- Lesson 04 — `KH-MATH-AGT-W01-PW01_edge-identification-proof-workshop`
- Lesson 05 — `KH-MATH-AGT-W01-LAB01_polygon-gluing-surface-classification-laboratory`
- Lesson 06 — `KH-MATH-AGT-L06-PS01_surface-identification-problem-set`
- Lesson 07 — `KH-MATH-AGT-L07-SC01_solutions-mathematical-commentary`
- Lesson 08 — `KH-MATH-AGT-L08-MA01_foundational-surface-quotients-mastery-assessment`

## A+++ dimensions

### 1. Progression — PASS
The sequence deliberately reduces scaffolding:

1. Learn the construction.
2. Consult a precise reference.
3. Observe worked reasoning.
4. Construct proofs.
5. Investigate and reproduce results.
6. Practice independently.
7. Diagnose and correct.
8. Demonstrate transfer/mastery.

This is stronger than eight unrelated lessons because each resource has a distinct cognitive role.

### 2. Mathematical scope — PASS WITH CONTINUING REVIEW
The arc consistently develops:
- equivalence relations and quotient maps;
- quotient topology;
- polygonal presentations;
- endpoint equivalence;
- quotient cell counts;
- Euler characteristic;
- orientability evidence;
- local Euclidean checks;
- invariant logic;
- proof-scope discipline.

The curriculum correctly resists treating Euler characteristic alone as a complete invariant and repeatedly separates visual evidence from proof.

### 3. Assessment alignment — PASS
Lesson 06 practices the same competencies developed in Lessons 01–05.
Lesson 07 supplies reasoning and remediation rather than answer-only feedback.
Lesson 08 uses transfer-focused prompts and an 80% mastery threshold with a critical-concept override.

### 4. Self-paced architecture — PASS
The repository now uses `curriculum/lessons/lesson-XX/`. Do not restore a week layer.

### 5. Identifier consistency — PASS WITH LEGACY ALIAS
Lessons 01–05 retain legacy `W01` IDs. Lessons 06 onward use `L##` IDs.

**Decision:** Do not rename Lessons 01–05. Treat their current IDs as stable legacy identifiers and map them to lesson numbers in the course manifest. This prevents broken metadata, manifests, hashes, and references.

### 6. README/path consistency — CLEANUP REQUIRED
Earlier packages were authored while the directory architecture was still changing. Any README text that references:
- `curriculum/weeks/...`
- `curriculum/lessons/weeks/...`
- a Week 1 canonical upload location

should eventually be changed to the stable lesson path:
`curriculum/lessons/lesson-XX/`

This is documentation cleanup, not a reason to rename resource folders.

### 7. Learner/instructor separation — ACTION REQUIRED
Lesson 08 contains an instructor scoring key in its package. In a public learner-facing repository, move instructor-only answer/scoring material outside the public learner path or omit it from the published deployment.

Lesson 07 is intentionally learner-facing remediation commentary and may remain public if the self-paced design allows learners to consult it after attempting Lesson 06.

### 8. Accessibility — PASS
The authored resources consistently provide textual polygon words and do not require color, physical manipulation, paid software, or external websites. Continue requiring textual equivalents for future diagrams.

### 9. Dependency sovereignty — PASS
The foundational cycle has no required external learner dependency. External mathematical sources may be used for editorial verification without becoming required course infrastructure.

### 10. Duplication — ACCEPTABLE / PURPOSEFUL
Repeated benchmark surfaces are pedagogically justified because their role changes across reading, reference, worked example, proof, lab, practice, feedback, and assessment.

Future lessons should now reduce repetition of the same elementary quotient audits and advance the theory.

## Critical cleanup checklist

- [ ] Preserve existing lesson folder names and IDs.
- [ ] Update stale README path language when convenient.
- [ ] Keep `curriculum/lessons/lesson-XX/` as canonical.
- [ ] Separate instructor-only Lesson 08 scoring material from public learner deployment.
- [ ] Add `course-manifest.json` at the curriculum level.
- [ ] Add a schema/version field to future resource metadata.
- [ ] Use `L09`, `L10`, ... for all new lesson-position IDs.
- [ ] Do not reintroduce calendar-week semantics.
- [ ] Continue 80% mastery + critical-concept override where a mastery gate is appropriate.
- [ ] Re-run a collection audit at the end of each conceptual arc.

## Next conceptual arc

Lesson 09 should advance beyond introductory polygon-gluing mechanics.

Recommended next arc:
**Triangulations, simplicial complexes, and combinatorial surfaces**

This creates the bridge from polygon presentations to a more general combinatorial language and prepares students for links, stars, subdivisions, Euler characteristic under triangulation, and eventually homology/fundamental-group work.

Suggested sequence:
- L09 — From Polygons to Simplicial Complexes
- L10 — Stars, Links & Local Manifold Tests
- L11 — Subdivision and Triangulation Invariance
- L12 — Combinatorial Surface Proof Workshop
- L13 — Triangulation Laboratory
- L14 — Problem Set
- L15 — Solutions & Commentary
- L16 — Mastery Assessment

## Lock decision

Lessons 01–08 may be treated as **Foundational Arc 01: Surface Quotients**.

Do not mark individual files as permanently immutable until the stale README paths and public instructor-key placement are resolved, but no mathematical-content rewrite is required merely because the course changed from week-based to self-paced organization.
