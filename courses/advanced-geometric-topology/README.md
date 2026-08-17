# Advanced Geometric Topology, Global Geometry & Mathematical Physics

A 36-week / 180-session Khaemenes Higher Learning sequel to **Topology & Differential Geometry**.

## Instructional lineage

This package deliberately combines three existing Khaemenes patterns:

1. **ArchaemenesCore canon** — one Archaemenes identity matures from Wise Owl → Academy Mentor → Scholar.
2. **Kinder Garden lesson-aware companion logic** — recommendations depend on the actual current lesson rather than a fixed week-to-tool table.
3. **Pre-Algebra interactive lesson logic** — concept before procedure, worked reasoning, pathway support, practice with explanations, reflection, local progress, exportable learner records, and domain-aware mastery.

For Higher Learning, the same pattern matures into:

**definition architecture → theorem/proof workshop → computation/lab → research/application → mastery/revision**

## Mastery rule

A score of 80% or higher on conceptual/objective work is necessary but not sufficient.

A unit is considered mathematically mastered only after:
- conceptual threshold is reached;
- written proof/problem evidence exists;
- required lab/reproducibility evidence exists;
- significant errors have been corrected;
- the learner can explain or defend the work.

The static browser engine records evidence. It does **not** pretend to auto-grade a proof.

## Files

- `index.html` — course dashboard
- `lesson.html?week=N&day=N` — reusable interactive lesson shell for all 180 sessions
- `course-map.json` — 13 units / 36 weeks
- `mentor-manifest.json` — Archaemenes Scholar behavior and continuity contract
- `resource-manifest.json` — metadata-driven lab/resource registry
- `assets/course-data.js` — 180 session records
- `assets/course.js` — progress, lesson rendering, Archaemenes local fallback, export
- `labs/index.html` — lab registry
- `assessments/index.html` — assessment architecture

## Archaemenes integration

The local page exposes:

`window.ARCHAEMENES_LEARNING_CONTEXT`

This object contains the learner's current course, unit, week, session, pathway, evidence requirements, scores, and reflection. A future connected ArchaemenesCore adapter can consume that context directly.

The local fallback mentor panel follows the same clue-first teaching policy without pretending to be a remote AI service.

## Continuity

Suggested local key:

`khaemenes-hl-agtgmp-progress-v1`

A Family Registry / Academy record adapter can later replace local-only persistence without changing the lesson data model.

Advanced Geometric Topology — Curriculum Starter Pack
This starter pack is intentionally curriculum-only.

It is designed to help us revise the Advanced Geometric Topology, Global Geometry & Mathematical Physics course without changing the surrounding Khaemenes ecosystem.

Current course baseline
36 weeks
180 sessions
Advanced upper-level / graduate-preparatory level
Prerequisite: Topology & Differential Geometry or equivalent
13 curriculum units
Mastery threshold: 80%, with written mathematical evidence and required lab/reproducibility evidence
How to use this folder
Read docs/CURRICULUM_AUDIT_FRAMEWORK.md.
Review curriculum/COURSE_MASTER_PLAN.md.
Use planning/WEEKLY_AUDIT_TEMPLATE.md for each week.
Use planning/SESSION_AUDIT_TEMPLATE.md for individual sessions.
Record proposed changes rather than editing the live course immediately.
Narrow the list of changes after the curriculum audit is complete.
Important
This pack does not replace the existing repository files. It is a working curriculum-planning layer.

The goal is to preserve what is strong, identify what is missing, and make deliberate revisions before implementation.
