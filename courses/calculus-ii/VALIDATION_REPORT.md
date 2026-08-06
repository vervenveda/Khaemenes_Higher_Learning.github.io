# Calculus II Validation Report — Version 2.1.0

Date: 2026-08-06

Files: 395  
HTML pages: 303

## Corrections completed during verification

- Corrected every Scientific Calculator v4 link to the repository's extensionless `courses/mathematics/tools/calculator` file.
- Corrected the dynamic midterm description so it names Calculus II Units 01–06 rather than inherited Precalculus topics.
- Advanced the service-worker cache from `khaemenes-calculus-ii-college-v1` to `khaemenes-calculus-ii-college-v2-1` so revised assets replace stale cached copies.
- Applied the centered black–gold–blue mathematics landing design with Cinzel and Brandon Grotesque-first font stacks.

## Landing-page structural checks

- PASS — valid HTML parse
- PASS — no duplicate IDs
- PASS — all required application view containers present
- PASS — Profile, Pin to Profile, theme, College Menu, and Math Labs & Tools controls present
- PASS — six laboratory/tool cards and embedded activity dialog present
- PASS — all 19 local landing-page references resolve
- PASS — both inline scripts pass JavaScript syntax validation
- PASS — no stale Algebra II identifiers
- PASS — Jennifer Pearl is the sole named curriculum credit

## Complete-course structural checks

- PASS — 303 HTML pages scanned
- PASS — 2,254 local HTML references checked; zero missing
- PASS — 13 units
- PASS — 36 weeks
- PASS — 180 study sessions
- PASS — 92 student lessons
- PASS — 92 matching faculty keys
- PASS — 184 unique assessment-bank questions
- PASS — every assessment item has four unique choices and a valid answer index
- PASS — every lesson and key path referenced by course data exists
- PASS — every JavaScript file passes `node --check`
- PASS — every JSON and web-manifest file parses successfully
- PASS — all 243 service-worker core cache targets exist
- PASS — no duplicate HTML IDs in the revised landing page

## Chromium interaction checks

The landing application was executed in headless Chromium with its local scripts inlined because this environment blocks direct localhost and `file://` browser navigation.

- PASS — learner dashboard rendered
- PASS — dashboard laboratory card injected once
- PASS — light/dark theme toggled
- PASS — Calculus II profile pin added and removed with one click per action
- PASS — Weekly Classroom rendered all 36 week selectors
- PASS — Units view rendered the diagnostic plus 13 units
- PASS — Labs & Tools view rendered six cards
- PASS — laboratory dialog opened and closed
- PASS — College Menu and Labs Menu remained mutually exclusive
- PASS — no desktop horizontal overflow at 1440 px
- PASS — no mobile horizontal overflow at 390 px
- PASS — no page errors or console errors during landing-page interaction tests

## Representative subpage interaction checks

- PASS — Integration Methods Lab initialized and ran
- PASS — Series & Convergence Lab initialized and ran
- PASS — Polar Curve Lab initialized and ran
- PASS — Unit 01 Lesson 01 pathway selection worked
- PASS — Unit 01 Lesson 01 quick check scored 2/2 and 100%
- PASS — lesson reflection saved locally
- PASS — lesson completion status saved locally
- PASS — Calculus II midterm rendered all 60 questions with its submit control
- PASS — no page or console errors in these representative subpage tests

## Hosting note

Deployment headers and third-party iframe policies are controlled by the live host. External tools may decline iframe embedding; the activity dialog includes an **Open separately** fallback. A final live smoke test should be performed after GitHub Pages publishes the upload.
