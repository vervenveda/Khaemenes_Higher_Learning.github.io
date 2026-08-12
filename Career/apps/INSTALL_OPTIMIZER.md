# Khaemenes Career Assessment — Optimizer v2.0

This package upgrades the existing:

`Khaemenes_Higher_Learning.github.io/Career/apps/career-assessment_index.html`

without replacing the 300-question bank.

## Install

1. Upload `career-assessment-optimizer.js` into the same `Career/apps/` folder.
2. Open `career-assessment_index.html`.
3. Immediately before the closing `</body>` tag, add:

```html
<script src="./career-assessment-optimizer.js"></script>
```

That is the only edit required to the existing assessment page.

## What v2 changes

- Preserves all 300 existing prompts, pagination, randomized question order, autosave, resume behavior, and the 13 career pathways.
- Changes the score transform from the old `mean / 5 × 100` to a true 0–100 Likert alignment:
  - 1 = 0%
  - 2 = 25%
  - 3 = 50%
  - 4 = 75%
  - 5 = 100%
- Keeps **alignment** and **evidence coverage** separate.
- Adds profile differentiation: range, spread, and top-two gap.
- Adds response-quality review for very low variance, excessive neutral use, long identical-answer runs, and near-uniform endorsement/rejection.
- Response-quality flags never change the score; they only prompt review.
- Removes the three bipolar anchor domains from pathway formulas where opposite-direction prompts were originally fed into the same positive domain:
  - `arts_vs_stem_anchor`
  - `people_vs_things_anchor`
  - `indoor_vs_outdoor_anchor`
- Reconstructs those preferences separately as directional orientation diagnostics.
- Replaces the old "collapse" weighting with a transparent softmax probability-weighted exploratory draw.
- Keeps the familiar **Quantum Career Lens** name while explicitly stating that it is stochastic exploration, not quantum computing or prediction.
- Preserves the existing `khaeCareerAssessmentBundle_v1` localStorage key for downstream compatibility while adding `schemaVersion: 2`, engine metadata, quality data, orientations, coverage, and exploration probabilities.
- Adds optimized JSON export.

## Important boundary

The assessment remains educational career exploration. It is **not** a validated clinical, psychological, diagnostic, employment-selection, or psychometric instrument.

## Why this is packaged as a drop-in optimizer

The current 300-question bank is already substantial. Rather than rewriting it and risking accidental question loss, v2 reads the existing bank directly from the page source and upgrades the analytical layer underneath it. No `eval()` is used.

## QA

Open the browser console after loading the assessment. A healthy installation reports:

`[Career Assessment v2] Parsed 300 questions.`

If the parser does not find exactly 300 items, it warns instead of silently pretending the bank is complete.
