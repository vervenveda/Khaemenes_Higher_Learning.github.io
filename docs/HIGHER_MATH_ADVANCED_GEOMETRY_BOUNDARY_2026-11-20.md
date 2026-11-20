# 2026-11-20 · Higher Learning advanced geometry boundary hardening

Scope: Topology & Differential Geometry -> Advanced Geometric Topology & Mathematical Physics.

## Topology & Differential Geometry
The mature 36-week course now has contracts aligned to its existing runtime:
- assessment history: `khaemenes-topology-differential-geometry-assessment-v2:<higherLearnerId>`
- legacy v1 key preserved for provenance
- canonical profile id: `topology-differential-geometry`
- new v2 attempt records carry learner id, 80% practice metadata, source classification, and `proofReviewSatisfied=false`
- proof, required lab evidence, corrections, and defense are noncompensatory completion streams
- shared read-only Higher Math evidence receipt export is available

## Advanced Geometric Topology
Added `hybrid-runtime-contract-v1.json`.

The current architecture is explicitly:
- 36 weeks
- 180 sessions
- 13 units
- 1 rich V2 lesson module: W01D1
- 179 legacy fallback sessions
- `assets/course-data.js` remains the protected fallback source
- no full-V2 migration claim

Storage:
- legacy: `khaemenes-hl-agtgmp-progress-v1`
- current: `khaemenes-hl-agtgmp-progress-v2`
- Academy Family Registry identity scope
- legacy import allowed only through existing guarded identity behavior
- legacy proof evidence migrates as submitted/unreviewed, never approved

Mastery remains multi-stream:
- concept >=80%
- proof reviewed/approved
- assigned lab complete
- corrections complete when required
- defense/explanation complete

Objective score alone never certifies mastery.

## Progression
The mathematics matrix now declares Topology & Differential Geometry as the prerequisite for Advanced Geometric Topology, with Real & Complex Analysis, Abstract Algebra, and Linear Algebra as recommended supporting preparation.

## Regression
Added `tools/validate-higher-math-advanced-geometry-boundary.mjs` and wired it into the advanced mathematics CI workflow.

## Verification boundary
Source/static contracts are hardened. Advanced Geometric Topology remains intentionally hybrid. Hosted CI, browser/device acceptance, and migration of the remaining 179 sessions remain separate evidence stages.
