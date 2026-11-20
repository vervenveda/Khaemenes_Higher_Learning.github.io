# 2026-11-20 · Higher Learning College Core mathematics hardening

Scope: Calculus II, Differential Equations, Linear Algebra.

## Assessment isolation
All three standalone assessment engines previously wrote new attempts to browser-wide v1 histories.

Now:
- Calculus II -> `khaemenes-calculus2-assessment-records-v2:<localLearnerId>`
- Differential Equations -> `khaemenes-differential-equations-assessment-records-v2:<localLearnerId>`
- Linear Algebra -> `khaemenes-linear-algebra-assessment-records-v2:<localLearnerId>`

Legacy v1 histories remain untouched and are never silently reassigned.

Each new attempt carries:
- local learner id
- score/right/total
- pathway
- source = public-formative-practice
- practicePassed = score >= 80

## Course contracts
Each course map and PROFILE_INTEGRATION_NOTES now declares:
- v2 learner-scoped assessment history
- v1 legacy key
- local-course-learner scope
- preservation policy

## Portable evidence receipts
The shared read-only Higher Math evidence receipt exporter now supports:
- Precalculus & Trigonometry
- Calculus I
- Calculus II
- Differential Equations
- Linear Algebra

The College Core course teacher panels expose an Export Mathematics Evidence Receipt action.

Receipts do not:
- export answer content
- alter source records
- award mastery/credit
- infer learner identity from names

## Progression graph
The mathematics execution matrix now records a flexible College Core graph:
- Calculus II follows Calculus I and may be paired with Linear Algebra.
- Differential Equations requires Calculus I and recommends Calculus II plus Linear Algebra preparation.
- Linear Algebra may begin with strong algebraic fluency and can run alongside Calculus II.

This is recommendation metadata, not an automatic course lock.

## Regression
Added `tools/validate-higher-math-college-core-chain.mjs` and wired it into `.github/workflows/advanced-math-migration-validation.yml`.

## Verification boundary
Source/static contracts are hardened. Hosted GitHub Actions and browser/device acceptance remain separate verification stages.
