# Career Assessment v2 — Change Log

## v2.0.0

### Scoring
- Corrected Likert normalization so neutral = 50%, not 60%.
- Separated pathway alignment from evidence coverage.
- Retained backward-friendly `score` and `scorePercent` fields in the saved bundle.

### Directional anchors
- Removed three bipolar anchor fields from pathway weighting.
- Added separate directional diagnostics for:
  - Arts ↔ STEM
  - People ↔ Things/Systems
  - Indoor ↔ Outdoor/Field

### Quality review
- Added low-variance detection.
- Added long-string / straight-line response detection.
- Added high-neutral-rate detection.
- Added near-uniform endorsement/rejection detection.
- Quality flags are descriptive only and never alter scores.

### Profile interpretation
- Added pathway-score range.
- Added pathway-score standard deviation.
- Added top-two gap.
- Added low/moderate/high differentiation label.
- Added flat-profile warning.

### Exploratory probability lens
- Replaced raw score-proportional random selection with a softmax distribution.
- Stores the probability at each exploratory draw.
- Explicitly labels the feature as stochastic exploration, not quantum computing or prediction.

### Compatibility
- Keeps `khaeCareerAssessmentBundle_v1`.
- Adds `schemaVersion: 2`.
- Preserves `pathways`, `domainScores`, `responses`, and `generatedAt`.
- Adds engine metadata, orientations, response-quality data, coverage, and differentiation.
