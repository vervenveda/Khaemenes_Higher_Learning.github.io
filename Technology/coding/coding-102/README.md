# Coding 102 — Inside the Machine v2

Coding 102 v2 is a logic-verified, data-driven upgrade of the original four-module course.

## Preserved curriculum

The original course structure is preserved:

1. Inside the Machine — Hardware
2. Bits, Bytes & Data
3. Files, Folders & Operating Systems
4. Networks & the Internet

The original **4 × 15 = 60 question quiz bank** is preserved as the assessment source.

## Logic repairs

### Hard prerequisite enforcement
The original dashboard calculated whether a module was unlocked, but `openModule(num)` itself did not independently check the prerequisite. v2 performs the prerequisite test inside `openModule()` so later modules cannot be opened merely by calling the function directly.

### Best-score preservation
The original `submitQuiz()` overwrote a previous module score even when a retake was lower. v2 stores the highest score achieved.

The same rule applies to the Final Exam.

### Immutable assessment bank
The original Coding 102 already improved over Coding 101 by keeping `quizBank` immutable and generating shuffled working sets. v2 preserves that correct design.

### Final exam
The Final Exam selects 25 unique questions without replacement from the 60-question master bank. Each question's answers are independently randomized while preserving the correct answer.

### Certificate guard
v2 refuses to show a certificate until the stored best Final Exam score is at least 80%.

## Dynamic lab upgrades

### Module 1 — Hardware
- Input → process → store → output trace lab
- Hardware comparison
- App-loading pipeline
- Bottleneck diagnosis
- Upgrade reasoning
- Hardware explorer

### Module 2 — Data
- Byte / KiB converter
- Interactive 8-bit binary builder
- Random binary targets from 0–255
- Character code-point / binary inspector
- Image raw-size estimator
- Compression-size simulator

### Module 3 — Files & OS
- OS resource model
- Simple scheduling/load visualization
- File-path builder
- Extension/file-type lesson
- Read/write/execute permission simulator
- File matching
- Project organization / backup reasoning

### Module 4 — Networks
- Local network / internet model
- Packet routing animation with alternate paths
- DNS learning simulator
- Client/server request-response lab
- Conceptual packet-trip simulator
- Internet safety / HTTPS clarification

## Progress architecture

One structured localStorage object is used:

`khaemenes_coding102_v2`

It stores:
- best module scores
- current lesson per module
- visited lessons
- best final score
- certificate name
- last module

Progress can also be exported as:

`coding-102-progress.json`

## Mastery rules

- Module 1: always open
- Module 2: Module 1 ≥ 80%
- Module 3: Module 2 ≥ 80%
- Module 4: Module 3 ≥ 80%
- Final Exam: all four modules ≥ 80%
- Certificate: Final Exam ≥ 80%

## Sovereign architecture

Single-file HTML/CSS/vanilla JavaScript.

No external libraries, APIs, analytics, trackers, ads, remote AI, cloud accounts, `eval()`, or `Function()`.

## Validation

Generated JavaScript is checked with Node using `node --check`.

Structural checks confirm:
- 4 modules
- 60-question bank
- 25-question final
- hard prerequisite enforcement
- best-score preservation
- binary lab
- hardware lab
- OS/file lab
- network lab
- certificate guard
- JSON export

Copyright © 2026 Jennifer Kay Pearl. All Rights Reserved.
