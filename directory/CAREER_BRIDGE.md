# Higher Learning ↔ Career Assessment Bridge

**Date:** 2026-10-18  
**Target branch:** `main`  
**Scope:** Interactive course exploration across the existing 131-entry academic inventory. No course lessons, question banks, gradebooks, assessments, or student registrations were altered by this bridge.

## User experience

- The Higher Learning campus links to `directory/` and the Career Portal links back to `directory/?view=career`.
- `directory/index.html` offers searchable, filterable course records; all records link back to their original federated source repository and remain under the source owner.
- `directory/career-map.json` maps each of the Career Assessment's **13 existing pathway codes** to relevant preexisting academic schools.
- `directory/course-directory.js` reads **only the active scholar's** completed Optimized v2 assessment bundle from its existing storage location; it does not read partial responses, re-score career results, create a new assessment, or expose private assessment responses in the page.
- The 13 interests can also be selected manually to browse connected courses. This permits exploration without finishing the assessment.
- All courses remain browsable regardless of assessment scores. Saved results influence only ordering/visibility in the optional **Connected to My Interests** view.
- **My Shortlist** bookmarks record only course identifiers in browser-local storage, scoped to the Academy's active Higher Learning scholar. Guest browsing does not persist records.
- Each course preserves its actual availability class (instructional portal, Hall pathway, catalog outline, foundation bridge, resource hall). Neither a high career-alignment score nor a bookmarked course means admission, credit, credential, assessed mastery, or employment suitability.

## Data contracts

- Canonical course inventory: `directory/catalog.json` (131 entries at inventory creation).
- Career crosswalk: `directory/career-map.json` (13 existing assessment pathway codes).
- Completed Career Assessment v2 is written to logical key `khaeCareerAssessmentBundle_v1` by the existing optimized assessment. Under Higher Learning's canonical app scope, the actual browser key is:
  `khaemenes.higher.app:<active-learner-id>:khaeCareerAssessmentBundle_v1`.
- The directory **does not** fall back to unscoped/global assessment keys. Legacy migration remains the existing Career app scope's responsibility.
- The directory requires v2 engine identity, an array of recognized pathway codes, and 300 recorded responses. If no verified scoped bundle is present, career results are not displayed; learners can browse manually instead.
- Shortlist key: `khaemenes.higher.directory.shortlist.v1:<active-learner-id>`. It stores a bounded list of course IDs, not career responses or identity details.
- Local records are origin- and browser-specific. They are not automatically available on a different device.

## Verification

- All 131 original inventory entries were previously checked against real source files in nine source repositories.
- Confirmed 13/13 Career Assessment pathway codes have crosswalk definitions, and all referenced academic school labels exist in the current catalog.
- JavaScript syntax checked for the directory application and existing Career Assessment optimizer.
- Mocked runtime test (not a live browser): completed v2 bundle + selected scholar opened `?view=career`, displayed 89 relevant entries, rendered 24 cards on the first page, saved a course ID to that scholar's local shortlist, and displayed exactly one card in **My Shortlist**. No mocked runtime errors.
- Source controls and navigation links checked after updates.
- **Not yet verified:** real browser deployment, iframe-to-directory navigation on each supported host, mobile and screen-reader interaction, actual live Family Registry switching, real user localStorage upgrade/recovery, or full end-to-end assessment completion. Public site availability could not be independently verified from this execution environment.

## Next hardening bubbles

1. Live browser and mobile/keyboard regression after deployment, including Career Portal overlay navigation, profile switching, and guest-mode fallback.
2. Add reviewed `catalog.json` enrichment fields for prerequisites, academic faculty review, workload, degree-path relevance, and distinction between formal assessment and study resources—without confusing completion certificates with accredited academic credit.
3. Connect course bookmarks to an opt-in export/import facility or an authorized Academy learner-owned portfolio without weakening profile boundaries; do not introduce unrequested hosted data services or expose backend/STOS internals.

**Owner:** Khaemenes Academy Higher Learning · Jennifer Kay Pearl.  
**Policy:** Preserve original source-owned courses and keep all updates on `main`.
