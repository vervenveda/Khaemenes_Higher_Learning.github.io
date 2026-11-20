# 2026-11-20 · Higher Learning mathematics handoff and authority hardening

Repository: `vervenveda/Khaemenes_Higher_Learning.github.io`

## Scope
Focused first on Precalculus & Trigonometry and Calculus I because High School hands learners into these courses, then formalized the entire Higher Learning mathematics continuum.

## Precalculus & Trigonometry
- Added explicit assessment contract to `course-map.json`:
  - canonical profile id `precalculus-trigonometry`
  - scoped assessment prefix `khaemenes-precalculus-trigonometry-assessment-records-v2`
  - legacy unscoped key retained for provenance only
  - return-record status explicitly exportable but High School import uncertified
- New assessment attempts are stored by active local course learner.
- Historical v1 evidence is not automatically reassigned.
- Diagnostic attempts publish a minimal Academy-scoped compatibility summary to the legacy readiness key so the existing math-entry gate continues to function.
- Full attempt history remains in v2.

## Calculus I
- Canonical profile/pin id is now consistently `calculus-i`.
- `calculus-1` is retained as an explicit alias for route/history compatibility.
- Added explicit assessment prefix `khaemenes-calculus1-assessment-records-v2`.
- Diagnostic v2 history now publishes only a minimal scoped compatibility summary to the existing readiness key.
- No existing course records were migrated or rewritten.

## Standardized evidence receipt
Added `courses/shared/higher-math-evidence-receipt-v1.js`.
- Supports Precalculus and Calculus I.
- Reads course-local progress and assessment history.
- Excludes assessment answers.
- Records local-course learner and Academy learner separately.
- Treats identity as bound only on an exact ID match; names are never used to infer identity.
- Marks self/instructor-entered formal scores as unverified notes.
- Does not write source records, award credit, or claim a certified High School import.
- Exposed through both course Teacher/Home-Education tool panels.

## Mathematics execution matrix
Added `courses/mathematics-execution-matrix-v1.json` covering 12 mathematics pathways.

Eleven are full-map courses:
- Precalculus & Trigonometry
- Calculus I
- Calculus II
- Differential Equations
- Discrete Mathematics
- Introduction to Proofs
- Linear Algebra
- Statistics
- Abstract Algebra
- Real & Complex Analysis
- Topology & Differential Geometry

Each full-map course currently reports:
- 36 weeks
- 180 sessions
- 92 lessons
- 13 units
- 80% mastery target

Advanced Geometric Topology is explicitly classified `hybrid-legacy-v2`. Its own README states W01D1 is the hardened module while remaining sessions continue through legacy fallback. It is not represented as equivalent to the eleven full-map courses.

## Department routing
Canonical mathematics department content remains owned by `courses/index-core.txt` rendered through `courses/index.html`.
`courses/mathematics/` remains a compatibility redirect rather than becoming a second department implementation.

## Regression coverage
Added:
- `tools/validate-higher-math-execution-matrix.mjs`
- `tools/validate-higher-math-handoff-records.mjs`

Expanded `.github/workflows/advanced-math-migration-validation.yml` to watch the full mathematics continuum and run both validators in addition to the existing migration validator.

## Verification boundary
Source/static contracts are hardened. Hosted GitHub Actions and real-browser/device acceptance remain separate evidence stages. The High School receiving/import side of the evidence receipt is still not certified.
