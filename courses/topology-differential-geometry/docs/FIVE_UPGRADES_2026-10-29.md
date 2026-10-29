# Topology & Differential Geometry — Five-Upgrade Implementation Record
Date: 2026-10-29
Branch: audit/topology-five-upgrades-2026-10-29
Status: source-reviewed development changes; published browser testing and faculty sign-off remain necessary.

## 1. Depth of instruction
- Added an original, fully worked foundational proof studio to Unit 01 Lesson 01.
- Added worked mathematical evidence, independent proof tasks, and faculty review criteria to the first lesson of each of Units 02–13.
- Existing course structure and other lessons were preserved.
- Follow-up: extend this deeper lesson standard to the other 79 lessons after checking student comprehension and faculty feedback.

## 2. Monte Carlo assessment quality
- Retired 276 repeated generic proof-habit questions from the active 368-item pool.
- Retained and revised 92 topic-named original concept questions with unit-specific misconception distractors.
- Authored 78 new unit-specific mathematics questions, six for each of the 13 units.
- Active pool: 170 questions total; 13 or 14 per unit. Original content remains in source history; revised answer key JSON matches active runtime.
- Every active question has four distinct choices, a valid answer index, matching answer_text and explanation.
- Formal assessments sample units approximately evenly by round-robin.
- Follow-up: item-by-item faculty mathematics review, greater question diversity and student-response statistics before treating these as high-stakes examinations.

## 3. 80% local practice progression
- The assessment engine now retains the current question set and selected answers when a learner scores under 80%; learners can correct and resubmit.
- At 80% or above, radio answers are locked for that submitted attempt, with saved history. A new attempt starts a different set.
- The individual lesson 'reviewed' action now requires 80% on its formative quick check.
- **Important**: This is an 80% practice gate, not a secure independent verification of proof competence or a site-wide authorization boundary. Direct lesson URLs remain accessible for free study. Faculty proof review and verified academic unlocking remain distinct work.

## 4. Learner-scoped records
- Formal assessment records now use local-storage keys namespaced to an active Higher Learning learner, with a fallback to the active course learner.
- Lesson records also use per-learner keys; the learner profile reads the scoped assessment store.
- Original legacy keys and records are not deleted or silently copied to a new student.
- **Important**: Legacy lesson/assessment records need an explicit, supervised import/assignment workflow. Current course dashboard classwork and teacher-entered scores remain self-reported and must not be represented as registrar-verified credentials.

## 5. Labs and integration
- Added offline-compatible Polygon Gluing & Surface Classification Studio (vertex equivalence classes, orientability, Euler characteristic, genus).
- Added offline-compatible Simplicial Homology Studio (H0/H1, chain ranks, Euler–Poincaré, filled versus unfilled triangles).
- Linked both in course lab menus and cards; updated service-worker cache version and precache entries.
- Removed copied Calculus I/II assessment descriptions from the course dashboard.

## Source-level validation performed
- Compiled patched JS source and landing/record/laboratory inline scripts successfully.
- Loaded the revised question-bank script to confirm 170 active questions, 13 units, unique identifiers, valid options and matching answer_text.
- Verified polygon-gluing computations: torus (χ=0, orientable genus 1); Klein bottle (χ=0, nonorientable genus 2); sphere (χ=2, orientable genus 0); aabb (χ=0, nonorientable genus 2).
- Check exact lesson count and internal paths after the merge candidate is deployed.

## Before merging to main
1. Test desktop and 255px mobile layouts with browser rendering.
2. Verify formative retry, persisted choices, 80% lock, separate learners, refresh, and JSON export end-to-end.
3. Test that existing legacy learner records remain readable and recoverable.
4. Verify both labs in an iframe and as standalone pages, online and offline after installation.
5. Have a faculty reviewer validate all 78 new questions, revised distractors, and each of the 13 mathematical workshops.

No credential or credit claim is implied by self-scored local practice.