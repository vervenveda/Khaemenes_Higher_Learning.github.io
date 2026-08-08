# Coding 101 Portal v2

This is a logic-verified, data-driven upgrade of the original Coding 101 portal.

## Important repairs from the original

The original file contained a stray template-style `<button ${...}>` fragment directly in the HTML between the Final Exam and Certificate sections. It did not belong there and was removed.

The original module-lock buttons were visually locked, but `openModule(2)` / `openModule(3)` did not independently enforce the prerequisite. v2 checks the prerequisite inside the navigation function itself.

The original quiz loader replaced each module's quiz bank with the shuffled copy. v2 keeps the source question bank immutable and creates a fresh randomized working copy for every attempt.

The original Final Exam sampled from whatever shuffled quiz state happened to exist at the time. v2 samples from immutable source questions and then independently randomizes each answer set.

The original web preview wrote directly into an iframe document. v2 uses a sandboxed iframe with `srcdoc`, so student preview code cannot reach the Coding 101 parent page.

## Upgraded course architecture

The curriculum still contains the same three instructional stages:

1. Coding Foundations
2. Block Coding Logic
3. Web Basics — HTML + CSS

The course is now data-driven. Module cards, lesson navigation, quizzes, progress, and final-exam questions are generated from one structured course definition rather than being duplicated across many independent HTML sections.

## New dynamic features

- Resume the last lesson in each module
- Per-lesson visited progress
- Interactive lesson dots
- Keyboard previous/next lesson navigation
- Accessible ordering activities with both drag-and-drop and Up/Down controls
- Adjustable loop visualization
- Event demo
- Robot loop demo
- Condition + variable mini-game
- Cause/effect matching
- Sandboxed live HTML/CSS preview
- Immutable quiz banks
- Fresh answer randomization per attempt
- Best-score persistence
- Hard prerequisite enforcement
- 25 unique final-exam questions
- Printable certificate
- JSON progress export

## Mastery logic

Module 1 is always open.

Module 2 requires:

`Module 1 score >= 80%`

Module 3 requires:

`Module 2 score >= 80%`

Final Exam requires:

`Modules 1, 2, and 3 >= 80%`

Certificate requires:

`Final Exam >= 80%`

Best scores are preserved when a learner retakes a quiz.

## Local storage

v2 stores one structured state object under:

`khaemenes_coding101_v2`

No external account is required.

## Privacy / sovereignty

The portal uses only:
- HTML
- CSS
- vanilla JavaScript
- localStorage
- sandboxed iframe `srcdoc`
- Blob export
- browser printing

No:
- external libraries
- external fonts
- trackers
- analytics
- advertisements
- cloud accounts
- remote AI
- third-party storage
- `eval()`
- `Function()`

## Validation

The generated JavaScript was checked with Node's parser using:

`node --check`

The file also received structural integrity checks for:
- dashboard
- all 3 modules
- quizzes
- final exam
- certificate
- local save
- export
- sandboxed preview
- prerequisite enforcement

Copyright © 2026 Jennifer Kay Pearl. All Rights Reserved.
