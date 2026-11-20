# 2026-11-20 · Higher Learning proof-sequence mathematics hardening

Scope: Introduction to Proofs, Abstract Algebra, Real & Complex Analysis.

## Assessment isolation
New standalone assessment attempts now write to learner-scoped v2 histories:
- Introduction to Proofs -> `khaemenes-introduction-to-proofs-assessment-v2:<localLearnerId>`
- Abstract Algebra -> `khaemenes-abstract-algebra-assessment-v2:<localLearnerId>`
- Real & Complex Analysis -> `khaemenes-real-complex-analysis-assessment-v2:<localLearnerId>`

Legacy v1 histories remain untouched and are never silently reassigned.

Each new browser-scored attempt records:
- local learner id
- score/right/total
- pathway
- source = public-formative-practice
- practicePassed = score >= 80
- proofReviewSatisfied = false

## Noncompensatory proof mastery
All three course maps now declare a proof mastery contract:
- 80% objective-practice threshold remains a formative learning threshold.
- Objective/browser practice is formative-only.
- Written proof evidence requires evaluator review.
- Proof review is noncompensatory: a high weighted average cannot replace missing written-proof competency.

The learner dashboards, Formal Evidence cards, and gradebook language now state the same boundary.

## Evidence receipts
The shared Higher Math evidence receipt supports all three proof-based courses and includes:
- proofReviewRequired = true
- proofReviewStatus = requires-evaluator-review

Receipts remain read-only, exclude assessment answers, do not award credit, and do not convert objective scores into proof mastery.

## Progression graph
The mathematics execution matrix now records:
- Introduction to Proofs as the transition gateway.
- Abstract Algebra requires Introduction to Proofs, with Linear Algebra and Discrete Mathematics as supporting preparation.
- Real & Complex Analysis requires Introduction to Proofs, with Linear Algebra and Calculus II as supporting preparation.

## Regression
Added `tools/validate-higher-math-proof-sequence.mjs` and wired it into the advanced mathematics CI workflow.

## Verification boundary
Source/static contracts are hardened. Hosted GitHub Actions and browser/device acceptance remain separate evidence stages.
