# Coding 103 — Problem Solving & Debugging v2

Coding 103 v2 is a logic-verified, data-driven upgrade of the original five-module course.

## Preserved curriculum

The original sequence is preserved:

1. Decomposition
2. Patterns & Repetition
3. Inputs, Outputs & State
4. Pseudocode & Flow
5. Debugging & Test Thinking

The original **5 × 10 = 50 question quiz bank** remains the assessment source.

## Important logic repairs

### Hard prerequisite enforcement
The original dashboard visually locked later modules, but `openModule(num)` did not independently enforce the prerequisite. v2 validates the 80% prerequisite inside `openModule()`.

### Best-score preservation
The original `submitQuiz()` replaced the stored score with the newest attempt, even if it was lower. v2 keeps the learner's highest score.

The Final Exam also preserves the highest score.

### Resumeable lessons
The original module loader reset every module to lesson/card 1 whenever it opened. v2 remembers the learner's last lesson in each module.

### Structured progress state
Instead of many separate localStorage keys, v2 uses one course-state object:

`khaemenes_coding103_v2`

### Immutable assessment source
The original course already separated a source quiz bank from shuffled working copies. v2 preserves this sound design and simplifies it into one immutable source bank.

### Certificate guard
The certificate cannot be opened unless the best Final Exam score is at least 80%.

## Dynamic learning upgrades

### Module 1 — Decomposition
- project decomposition hierarchy
- movable build sequence
- smallest-working-version reasoning
- big / medium / tiny classification lab

### Module 2 — Patterns & Repetition
- pattern prediction
- repeated-action compression into loop language
- arithmetic rule generator
- repetition reasoning

### Module 3 — Inputs, Outputs & State
- interactive state machine
- score / lives / level transitions
- input → state → output tracing
- event-order console

### Module 4 — Pseudocode & Flow
- reorderable pseudocode flow builder
- live condition branch simulator
- edge-case workshop
- sequence and branch reasoning

### Module 5 — Debugging & Testing
- reproduce-a-bug lab
- console/state inspector
- apply-one-fix demonstration
- boundary-value test cases
- one-change debugging challenge

## Assessment logic

- Each module has 10 questions.
- Answers are freshly randomized on each attempt.
- Correct answer mapping is preserved.
- Module best score is retained.
- 80% unlocks the next module.
- Final Exam requires all five modules at 80%+.
- Final Exam draws 20 unique questions from the 50-question bank.
- Final best score is retained.
- Certificate requires Final Exam ≥ 80%.

## Export

Progress can be exported as:

`coding-103-progress.json`

## Sovereign architecture

Single-file HTML/CSS/vanilla JavaScript.

No external libraries, APIs, trackers, analytics, advertisements, remote AI, cloud accounts, `eval()`, or `Function()`.

## Validation

The generated JavaScript was checked with `node --check`.

Structural checks confirm:
- five modules
- 50-question bank
- 20-question final
- hard prerequisite enforcement
- best-score preservation
- resumeable lessons
- decomposition lab
- pattern lab
- state-machine lab
- pseudocode flow lab
- debugging console/test lab
- certificate guard
- JSON export

Copyright © 2026 Jennifer Kay Pearl. All Rights Reserved.
