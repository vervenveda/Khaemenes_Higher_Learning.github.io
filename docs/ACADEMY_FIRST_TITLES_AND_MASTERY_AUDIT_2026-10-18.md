# Higher Learning · Academy-First Titles, 80% Mastery Integrity & Assessment Clarity

**Implementation date:** October 18, 2026  
**Branch:** `main` · **Canonical repository:** `vervenveda/Khaemenes_Higher_Learning.github.io`

## The Academy's existing rule
A required next learning activity or lesson remains **locked until 80% mastery on its preceding required evidence**. Studying, visiting, printing, clicking "complete", marking sessions, scoring public practice quizzes and manually entering scores are not equivalent to externally verified collegiate assessment. Free instruction and remediation remain open.

### Repair 1 — Mastery integrity
- Calculus I `assets/app.js` shows session checklist counts explicitly as **activity**; no longer describes them as completed academic mastery. Separately displays Unit 01's locally scored seven lesson gates, cumulative practice gate and actual Unit 02 route state, along with formal academic verification still pending.
- The main Calculus I page now loads `calculus1-progress-gates-v1.js` **before** the app, preventing the initial dashboard from rendering without the available local gate state.
- Calculus I and Precalculus lesson-tool checkbox statuses now say "study activity", not confirmed mastery; no saved state or student data was reset.
- In nine other mature Higher Learning mathematics courses, `Mark Lesson Complete` is now `Mark Study Activity Reviewed` and no longer **automatically marks all five study stages** complete. Prior records are preserved.
- Across ten other mathematics dashboards, locally marked activity checklists, manually reported grades and generated practice averages are visibly separated from the still-unverified 80% mastery gates. This is a truthful **status presentation repair**, not a claim to have implemented the complete course-level gate engine for those ten programs.

### Repair 2 — Assessment clarity
- Calculus I's thirteen unit assessment pages and its midterm/final now identify themselves as **formative practice** with prominent notices distinguishing local 80% practice gates from verified exam credit or certificates.
- The ten other mathematics assessment-center dashboards now call public exam links *Midterm Practice Form* and *Final Practice Form*, label completion templates *unverified*, and mark self-entered scores as informational rather than 80% unlock authority.
- No actual exam answers, learner grades, enrollment records or question-bank data were modified.

### Repair 3 — Institutional title hierarchy
- Added `assets/khaemenes-academy-title-v1.js`: an accessible **Khaemenes Academy** primary H1 at a light-weight 33px maximum, with the specific lesson/course/portal title demoted to a lightweight H2 at 24px maximum. The original topic text, headings, links, and content are preserved. Print styling is included.
- Connected this script to all **11 mathematical course landing pages**, all **143** mathematics unit landing pages, the shared lesson script of **11 tracks** (used by **1,012 individual mathematics lessons**), plus eleven named Academy/Higher Learning portal/core pages and the native Limits Laboratory.
- The existing Khaemenes Academy Adult Learner Portal and Adult Enrollment pages already have the primary Academy title and a smaller subtitle; they were not unnecessarily rewritten.
- The branding change is visual and semantic only: **no academic storage keys, app settings, answers, mastery thresholds, routing rules, or private infrastructure were touched.**

### Scope boundary and outstanding work
The institution title rollout covers the primary learning journey and the common lesson rendering scripts; **it is not yet a byte-for-byte HTML rewrite of all 3,172 files**. Some standalone printable worksheets, faculty key pages, assessment subpages outside Calculus I, and specialty app pages may still contain their older independent heading hierarchy. They should be checked and incorporated in a separate bulk-layout sweep. This report does **not** call that pending work complete.

The other ten math courses' independent, enforceable lesson → unit 80% release engines still require academic and technical review. Changing a visible label never establishes secure mastery or grants credit.

### Source-level QA performed
1. Script syntax checked for the 11 common mathematics lesson loaders, 11 dashboard engines, shared heading renderer, and additional localized application changes.
2. Rendered a simplified DOM model where `Limits Laboratory` is correctly made an H2 after an inserted `Khaemenes Academy` H1; an existing Academy H1 is preserved and its subtitle is styled.
3. Verified representative root, unit and lesson loader script paths at their actual relative folder depth, including the corrections to the 11 lesson-tool loaders.
4. Confirmed the Calculus I 80% gate script precedes the dashboard app on its homepage.
5. Read-back after commits and `main` tree inspection. The verified source tree contains 1,012 mathematics lesson HTML files, 143 mathematics unit homepages and the Academy heading asset.
6. **Not performed:** real deployed-browser acceptance; keyboard/screen reader and print-layout visual QA; device-specific profile regression; exhaustive check of every standalone printable/answer key. Do not claim these have passed.

### Next QA queue
1. Bring remaining printable, instructor key and specialty subpages into the same accessible title hierarchy without obscuring print content.
2. Deep-audit all other mathematics tracks' true sequential 80% mastery engines, failing closed wherever a self-marked activity currently acts as a course unlock.
3. Complete secure summative assessment workflows and independent academic review appropriate to future, legally authorized credentials.

**Steward:** Jennifer Kay Pearl · Khaemenes Academy. Free learning for all.
