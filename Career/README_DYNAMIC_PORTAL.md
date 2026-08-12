# Khaemenes Career Portal — Dynamic Directory AGI

Upload this `Career/` folder into:

`vervenveda/Khaemenes_Higher_Learning.github.io`

The package contains:

- `Career/index.html` — VNV-style Career landing page with ticker, 72px sticky header, breadcrumbs, dynamic dropdown menu, contained iframe workspace, local progress indicators, and the four permanent Career workflow tools.
- `Career/assets/career-directory-agi.js` — reusable Career Directory AGI instance.
- `Career/directory-agi/index.html` — full standalone Career Directory AGI interface.

## Dynamic behavior

The page reads:

`https://vervenveda.com/assessment-engine/mentor/registry/ecosystem-resources.json`

It does not maintain a hard-coded app list.

Eligible resources are categorized automatically using their existing manifest/registry metadata:
title, description, repository, classification, domains, skills, tags, subjects, resourceType, and learningValue.

Explicit manifest records outrank supplemental file-discovery records when both identify the same URL.

## Career workflow spine

These remain permanent local Career tools:

1. Career Assessment
2. Career Mentor Hub
3. Career Star
4. Mentor Review

Everything else is supplied by the ecosystem federation.

## Portal containment

Resource buttons open in the Career workspace modal/iframe. The learner returns with `Back to Portal`.
The only deliberate top-level exit is the footer link back to Higher Learning.

## Existing storage keys are preserved

- `khaeCareerProgress_v1`
- `khaeCareerAssessmentBundle_v1`
- `khae_career_star_v2`
- `khaemenes_mentor_review_checklist_v2`
