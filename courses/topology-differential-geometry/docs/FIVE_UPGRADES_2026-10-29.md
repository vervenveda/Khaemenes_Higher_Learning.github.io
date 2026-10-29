# Topology & Differential Geometry — Five-Upgrade Implementation Record
Date: 2026-10-29
Branch: audit/topology-five-upgrades-2026-10-29
Status: source-reviewed development changes; published browser testing and faculty sign-off remain necessary.

## 1. Depth of instruction
- Added an original, fully worked foundational proof studio to Unit 01 Lesson 01.
- Added worked mathematical evidence, independent proof tasks, and faculty review criteria to the first lesson of each of Units 02–13.
- Existing course structure and other lessons were preserved.
- Follow-up: extend the deeper worked-proof standard to the remaining 72 lessons after checking student comprehension and faculty feedback.

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
- Using a small deterministic in-memory DOM/storage harness, confirmed below-80% assessment correction preserved question IDs, 80%+ locked the answer controls, and attempt histories remained in their learner-specific key.
- Verified simplicial homology presets: triangle boundary (β0=1, β1=1), filled triangle (β0=1, β1=0), square cycle (β0=1, β1=1), and disconnected edges (β0=2, β1=0); Euler–Poincaré matched each.
- Verified polygon-gluing computations: torus (χ=0, orientable genus 1); Klein bottle (χ=0, nonorientable genus 2); sphere (χ=2, orientable genus 0); aabb (χ=0, nonorientable genus 2).
- Check exact lesson count and internal paths after the merge candidate is deployed.

## Before merging to main
1. Test desktop and 255px mobile layouts with browser rendering.
2. Verify formative retry, persisted choices, 80% lock, separate learners, refresh, and JSON export end-to-end.
3. Test that existing legacy learner records remain readable and recoverable.
4. Verify both labs in an iframe and as standalone pages, online and offline after installation.
5. Have a faculty reviewer validate all 78 new questions, revised distractors, and each of the 13 mathematical workshops.

No credential or credit claim is implied by self-scored local practice.
## Follow-through, 2026-10-29: full Unit 01 / shared student experience
- Completed individually worked mathematical examples, counterexamples and proof-transfer tasks for Unit 01 Lessons 02–08. The full eight-lesson unit now has this deep instructional layer.
- Introduced `assets/topic-check.js`: five topical questions (one lesson-specific original and four content-specific unit items) generated consistently on all 92 lessons without replacing their existing pages or assessments. Eighty percent means at least four correct of five.
- Below 80%, save the answers and let the learner correct the same check; at/above 80%, lock the radios even after refresh.
- The legacy generic quick check remains as hidden fallback but no longer authorizes the new `Mark Study Activity Reviewed` threshold. Prior study records are preserved, and an old reviewed marker is not silently promoted to topic-specific verified mastery.
- Lesson records and topic results remain local and learner-scoped; the course learner profile summarizes topic passes and now exports the lesson evidence in JSON.
- Fixed the pre-existing JavaScript pathway rendering failure (`querySelectorAll` required), added 255px narrow-device CSS, and introduced an automated Playwright test workflow for draft PRs.
- New browser checks exercise multiple lessons, sub-80 retries, saved 80% locks, two learners, the new labs, evidence exports and 255px overflow. These checks are a test gate and their GitHub Actions status must be inspected before publishing.
- **Release boundary remains:** none of these self-scored local practice checks provides an authenticated final examination or independently reviewed proof. Faculty review and a deliberate legacy-record migration remain outstanding.

## Final curriculum expansion — Units 02–13, lessons 02–07
- Four mathematics-specific JavaScript data modules now cover **72 of 72** remaining lesson IDs. Each entry contains its own worked mathematical argument, independent proof or calculation, and a named mathematical misconception or hypothesis limitation.
- A shared renderer adds a proof workshop and an editable learner evidence area to each corresponding existing lesson; no lesson URLs, course map records or pre-existing HTML lesson content were replaced.
- The local learner record stores workshop proof and reflection separately by learner ID; proof editing clears any previous local reviewed marker rather than silently claiming approval. This is evidence collection, not faculty-verified credit.
- A print-friendly rubric and proof submission area accompanies each workshop. The rubric assigns definitions/hypotheses 20%, mathematical derivation 40%, counterexample/transfer 20%, and clarity/interpretation 20%.
- The service worker precaches the renderer and all four data modules, while the landing registration query was refreshed to prompt offline updates.
- Source inspection verified **72 unique workshop IDs, 18 in each data module, zero missing and zero orphaned IDs**, with valid JS parse. The first full Chromium suite with the new workshops reported **17 passed**.
- Added additional browser tests for A/B learner proof isolation, offline workshop access, and 255px workshop readability; their CI run must pass before release.
- The existing identity-boundary workflow reports three unrelated Science snapshot checks failing on the repository baseline; those are not repaired in this Topology scope.
- Faculty review of individual mathematical claims is still needed before accredited or verified academic certification claims.

## Placement and supported entry: supplemental 2026-10-29
- Retained the existing advanced 40-question diagnostic page and replaced its original answer-key-always-first question bank with a separate `assets/readiness-question-bank-v2.js` containing 40 distinctive, six-strand prerequisite questions and exactly ten correct answers in each A–D position.
- Diagnostic result `topology-readiness-v2` now carries an explicit assessment version. Old results and drafts are kept for historical review, never silently converted into evidence of passing the new assessment, and never used to lock newly authored question choices after refresh.
- Added six conditional Unit 00 advanced prerequisite lessons (logic, maps, analysis, multivariable calculus, linear algebra, algebraic structures). Their sixty new practice questions use ten-question lesson checks; eight correct out of ten plus independent written proof and misconception evidence opens the next lesson.
- The final bridge checkpoint samples four items from each lesson bank (24 total) and needs at least 20 correct with written mathematics and corrections. Scores are self-reported/local practice, not human-approved proof evaluation.
- A new readiness routing helper serves diagnostic, conditional Unit 00, and official Unit 01 (or grandfathered prior course work). Official sequence remains 13 units / 36 weeks / 92 lessons, with historical progress preserved.
- Learner profile now includes a readiness summary, direct diagnostic and bridge links, and a separate JSON evidence export. Offline service-worker seed downloads the 92 lesson routes and conditional prerequisites in bounded batches.
- Browser QA covers placement routes, six bridge lessons, 80% corrections/refresh locks, 24-item exit, isolated learner records, historic draft recovery, placement answer balancing, and fully offline pre-cached Unit 00.
- Site-wide existing Higher Learning identity validation involving unrelated Science snapshots must not be treated as a topology curriculum defect; it remains a separate release-blocking CI investigation.
- **Review caveat:** readable public JavaScript and browser-local storage cannot provide secure high-stakes assessment, secret answer keys, or accredited academic credit. A faculty member should sample item difficulty, inspect the original worked proofs, and review constructed responses before credential issuance.
