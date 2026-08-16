# Lesson 03 — Verification Notes

## Mathematical checks
The worked examples preserve the established course convention and benchmark words:
- sphere: `aa^-1`;
- torus: `aba^-1b^-1`;
- real projective plane: `aa`;
- Klein bottle: `abab^-1`;
- orientable genus two: `aba^-1b^-1cdc^-1d^-1`.

The lesson correctly:
- counts quotient vertices and edges after identifications;
- computes χ from quotient cell counts;
- distinguishes torus and Klein bottle despite equal χ;
- retains the local Euclidean check for suspicious quotients;
- avoids using the full classification theorem before it is established;
- teaches that presentation complexity is not a topological invariant.

## Precision adjustment
Example 5 now explicitly describes removal of the adjacent inverse pair as an elementary polygonal-scheme simplification already established in the course, rather than leaving “cancellable” informal and unsupported.

## Architecture/hardening
- replaced Week 1 labeling with Self-Paced Lesson 03;
- updated metadata to Arc 01 / Lesson 03;
- corrected the downstream Problem Set reference to `KH-MATH-AGT-L06-PS01`;
- converted the HTML fragment into a standalone responsive page;
- made the invariant table responsive and printable;
- added printable response space to the Independent Try section;
- added local CSS/JS and restrictive CSP;
- regenerated the SHA-256 release manifest.

External references remain editorial verification only; no outside learner dependency is introduced.
