# Khaemenes Academy Calculus I

A complete open-age, placement-based 36-week Calculus I course.

## Included
- 180 study sessions
- 13 units
- 92 detailed printable lessons
- 92 matching teacher keys
- Foundation, Core, and Extended pathways
- 13 investigations and mastery checks
- 40-question readiness diagnostic
- 156-question course bank
- 60-question midterm and 100-question final
- dashboard, gradebook, portfolio, records, and completion document
- Scientific Calculator v4 and OHMIC CAD integration
- local-first PWA architecture

## Repository path
`courses/mathematics/calculus-1/`

Curriculum credit: Jennifer Pearl · 2026


## Academy 80% sequential mastery policy

The established Khaemenes Academy standard is **80% at every required mastery step**: the next lesson/activity remains locked until its prerequisite is mastered, the next unit requires all prior required lessons plus its unit assessment at 80%, and an overall weighted grade cannot override a failed required gate.

**October 18, 2026 hardening status:**
- Unit 01: seven lesson-specific ten-question formative checks, 80% next-lesson gates and a balanced 21-question cumulative unit check, also requiring 80%.
- Unit 02 admission: requires all seven Unit 01 lesson gates and the Unit 01 unit check.
- All 13 unit pages, the main course navigator and direct lesson URLs now include route/step checks.
- Units 02–13: lesson-specific assessment banks are **not yet ready for full sequential release**. These instructional materials remain accessible as non-credit study previews; progression cannot be self-awarded by a completion checkbox.
- Individual learner attempt snapshots and randomized answer order are saved locally when a Calculus I learner is selected.
- Browser-side practice scores are not secure credential evidence; no accreditation or transferable credit is claimed.

See [Assessment and Progression Contract](docs/ASSESSMENT_MODEL.md) and run `node tools/validate-prealgebra-mastery-parity.mjs` in a checkout to test the structural mastery controls. This is modeled on the existing Khaemenes Pre-Algebra sequential mastery pathway.
