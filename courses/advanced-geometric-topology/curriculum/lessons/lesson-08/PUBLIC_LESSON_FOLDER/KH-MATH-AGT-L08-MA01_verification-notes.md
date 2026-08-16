# Lesson 08 — Forensic Verification Notes

## Live-source audit
The public repository currently contains the learner assessment, metadata, verification notes, README, SHA-256 manifest, and an instructor scoring key in the same public lesson folder.

## Assessment logic — PASS
The 100-point weighting sums correctly:
- Section I: 15
- Section II: 30
- Section III: 15
- Section IV: 20
- Section V: 20

The assessment correctly uses an 80% threshold plus a critical-concept override and permits reassessment.

## Fixed unseen-audit verification
Using the course convention:

### Problem 4
`a b c a^-1 b^-1 c^-1`
- a: v0~v4, v1~v3
- b: v1~v5, v2~v4
- c: v2~v0, v3~v5
This yields two vertex classes {v0,v2,v4} and {v1,v3,v5}.
Thus V=2, E=3, F=1, χ=0.

### Problem 5
`a b a^-1 b`
- a: v0~v3, v1~v2
- b: v1~v3, v2~v0
All four vertices lie in one class.
Thus V=1, E=2, F=1, χ=0.
The repeated b with the same exponent sign gives the intended nonorientable-pattern evidence under the course convention.

Problem 6 therefore legitimately compares two examples with equal χ but different quotient data.

## Proof logic
Problem 10 correctly tests the quotient-topology definition and distinguishes “q^-1(A) open whenever A is open” from the separate property that q itself be an open map.

## Hardening
- no answer key is embedded in the public assessment;
- professional printable response areas were added;
- student fields and score fields were added;
- each assessment section starts on a fresh printed page;
- the long reflection receives a dedicated essay page;
- local CSS/JS and restrictive CSP were added;
- schema/version metadata was standardized;
- instructor material is separated from the public lesson package.
