# Advanced Geometric Topology — V2 Runtime Migration

## Purpose

This package replaces the monolithic lesson runtime while deliberately preserving
`assets/course-data.js` as the temporary source of truth for the existing 180 sessions.

This is a controlled migration, not a course-data rewrite.

## Install

Copy these files into:

`courses/advanced-geometric-topology/`

The package creates:

- `assets/js/utils.js`
- `assets/js/storage.js`
- `assets/js/mastery-engine.js`
- `assets/js/assessment-engine.js`
- `assets/js/mentor.js`
- `assets/js/lesson-engine.js`
- `assets/js/app.js`

and replaces:

- `index.html`
- `lesson.html`

Do **not** delete `assets/course-data.js` yet.

## What changes immediately

1. V1 learner data is automatically migrated to the V2 localStorage schema.
2. Evidence notes are restored after navigation/reload.
3. Manual conceptual-score entry is removed.
4. Concept scores are reserved for genuine assessments.
5. Proof evidence is explicitly marked submitted/unreviewed.
6. Mastery becomes multi-stream rather than a single score.
7. Dashboard cards report viewed/mastered session counts.
8. The old 180-session data map continues to work during migration.

## V2 localStorage key

`khaemenes-hl-agtgmp-progress-v2`

The V1 key is read for migration but is not deleted.

## Important temporary limitation

The existing Mathematics Continuum network adapter is not included in the first V2
runtime cut. The course remains fully usable in sovereign/local mode. Reconnect the
continuum only after the V2 learner-record and navigation behavior have been tested.

## Acceptance test

After uploading:

1. Open the course dashboard.
2. Open Week 1 Day 1.
3. Enter an evidence note and reflection.
4. Save both.
5. Navigate to Day 2.
6. Return to Day 1.
7. Confirm both values remain visible.
8. Refresh the browser and confirm they remain visible.
9. Confirm there is no manual concept-score input.
10. Export the Scholar Record and confirm `schemaVersion` is `2`.
11. Confirm Week 1 on the dashboard reports at least one viewed session.
12. Confirm all Week/Day navigation still resolves through Week 36 Day 5.

Only after these checks pass should the legacy `course.js` be archived.
