# 2026-11-20 · Canonical Higher Learning mathematics landing + lesson engine rollout

## Canonical sources traced
Verve N Veda gateway/ecosystem sources:
- 333 ticker: `https://vervenveda.com/assets/vnv-333-ticker.js`
- AutoPopulate ticker: `https://vervenveda.com/assets/vnv-ticker-autopopulate.js`
- Header: `https://vervenveda.com/assets/vnv-header-autopopulate.js`
- Branched hamburger/ecosystem menu: `https://vervenveda.com/assets/vnv-ecosystem-menu.js`
- Translator authority: Khaemenes Linguistics loader + VNV language UI
- Lower-left tools: `https://vervenveda.com/assets/vnv-class-tools-toolbar.js?v=1.6.1`
- Lower-right ecosystem toolbar: `https://vervenveda.com/assets/vnv-ecosystem-toolbar.js`

The Khaemenes Mathematics Engine Blueprint in the VNV ecosystem directory declares the engine canonical from foundational mathematics through Higher Learning.

## Shared Higher Learning implementation
Added:
- `courses/shared/higher-math-minimal-v1.css`
- `courses/shared/higher-math-shell-v1.js`
- `courses/shared/higher-math-lesson-engine-v1.js`

The class-tools configuration is `higher-learning-math-landing`. Translation is moved inside the lower-left class-tools dock rather than retained as a separate instructional band.

## Course landing contract
Each of the 12 mathematics programs now has a minimal public `index.html` containing only:
- two canonical top tickers (script-owned)
- official VNV header + hamburger (script-owned)
- charcoal hero
  - Khaemenes Academy 33px
  - course title 66px
  - course descriptor 24px
- Learner Profile / Parent Profile / Enrollment
- one concise About section
- one symmetrical 2x2 Course Features grid
- centered charcoal footer
- lower-left class tools with translator
- lower-right ecosystem toolbar

All cards/buttons use 7px corners and cream/charcoal contrast.

## Existing course consoles preserved
Before replacement, every former interactive `index.html` was copied to `course-console.html`.
No learner record, assessment engine, portfolio, gradebook or teacher/home-education console was deleted.

## Official Higher Learning Mathematics Engine
Every program now has `math-lesson.html`.

For the 11 full-map courses, the engine:
- reads `course-map.json`
- resolves the canonical 92 mapped lessons
- reads existing authoritative lesson HTML from `units/unit-XX/lessons/<lesson-id>.html`
- presents it through the shared mathematics cognitive spine
- supplies previous/next + lesson selector
- keeps an independent learner-owned reflection note
- does not replace assessment/mastery authority

Advanced Geometric Topology remains the declared hybrid exception. Its engine doorway resolves the 180-session course data but hands the active session into the protected existing hybrid runtime so its proof/lab/correction/defense state is preserved.

## Route audit
All 12 have:
- minimal landing
- preserved course console
- math engine doorway
- assessment route

The 11 full-map courses do not have literal `labs/` directories; their Math Labs & Tools cards route through `course-console.html#practice`.
Advanced Geometric Topology retains its real `labs/` registry.

## Regression
Added `tools/validate-higher-math-landing-engine-rollout.mjs` and wired it into the advanced mathematics CI workflow.

## Verification boundary
Source/static architecture is hardened. Hosted GitHub Actions and real browser/tablet acceptance remain separate evidence stages.
