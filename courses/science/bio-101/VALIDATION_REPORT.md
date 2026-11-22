# BIO 101 Foundation Validation Report

Date: 2026-10-25  
Validation type: source-level architecture validation

## PASS
- 13 units
- 36 instructional weeks represented
- Weeks 1–36 continuous
- 180 planned sessions
- 92 planned lessons
- 92 unique lesson IDs
- 13 physical unit-map files
- all unit maps aligned to the 80% / 10-question mastery contract
- 13 investigation/laboratory entries covering all 13 units
- 40-question readiness diagnostic
- 0 malformed readiness items
- five diagnostic domains with 8 items each
- 36 vocabulary weeks
- exactly 6 planned vocabulary terms per week
- 216 total vocabulary placements
- 13 unit mastery checks planned
- 60-question midterm
- 100-question final
- minimum assessment-bank target: 260
- Unit 13 research capstone and oral defense

## Not yet certified
- individual lesson content
- complete vocabulary definitions/distractors
- unit mastery question banks
- midterm/final banks
- faculty keys
- laboratory activity pages
- learner-record persistence
- offline/service-worker package
- accessibility/browser interaction
- live GitHub Pages behavior

Foundation architecture is ready for lesson development. This report does not certify the course as complete.


## Fresh forensic audit — 2026-10-25

Three architecture bubbles were identified and repaired before lesson writing:

1. **Cross-system architecture authority**
   - Added `architecture-contract.json` linking the course map, diagnostic, assessment framework, laboratory spine, and vocabulary system.
   - Locked 36 weeks, 180 sessions, 13 units, 92 lesson records, 13 investigations, 216 vocabulary placements, 40 diagnostic questions, 13 unit mastery checks, 60-question midterm, and 100-question final.

2. **Advanced Mathematics package parity**
   - Added records, teacher, teacher-keys, tools, and assets namespaces.
   - Added manifest, service worker, offline page, file manifest, update notes, and upload map.
   - These are architecture scaffolds only; they do not imply instructional completion.

3. **Architecture regression protection**
   - Added `tools/validate-architecture.mjs`.
   - The validator checks required package paths and exact structural counts across the course map, diagnostic, assessment map, laboratory spine, and vocabulary map.

Individual lesson writing remains intentionally pending until this foundation is treated as the governing BIO 101 contract.


## Fresh forensic audit — 2026-11-22

Three additional architecture bubbles were identified and repaired before individual lesson writing:

1. **Advanced-Math lesson-metadata parity**
   - Promoted all 13 unit maps to `khaemenes-bio101-unit-map-v2`.
   - Every planned lesson now carries an application context, evidence target, and its six-term week vocabulary binding.
   - This prevents lesson writing from drifting away from the course evidence and vocabulary architecture.

2. **Laboratory portfolio / review contract**
   - Promoted `labs/laboratory-spine.json` to v2.
   - Every investigation now has a stable lab ID, permitted data-mode description, seven required portfolio artifacts, eight faculty-review criteria, and an explicit faculty-reviewed completion gate.
   - Safety approval is required before any wet-lab activity; no investigation is auto-certified.

3. **Balanced assessment-bank architecture**
   - Promoted `assessments/assessment-map.json` to v2.
   - Raised the original bank target from 220 to **260 items**: at least 20 reviewed items per unit.
   - Every 10-question unit mastery form samples concept, evidence, quantitative, model, and application reasoning evenly.
   - Midterm and final now have explicit balanced type distributions and protected-bank boundaries.

The architecture validator now fails if any of these three contracts regress.

This remains source-level architecture certification, not instructional or live-browser certification.
