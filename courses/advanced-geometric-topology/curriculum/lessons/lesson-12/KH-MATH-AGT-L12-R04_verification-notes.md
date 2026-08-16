# Lesson 12 — Forensic Verification Notes

## Architecture
Lesson 12 follows the frozen self-paced identifier architecture: `KH-MATH-AGT-L12-R04`.

## External mathematical verification
University of Chicago algebraic-topology notes describe a simplicial map as a vertex map sending simplices into simplices and state that it extends linearly to a map on realizations. The same notes state the finite-complex simplicial approximation theorem: after sufficiently many barycentric subdivisions of the source, a continuous map is homotopic to a simplicial map.

## Internal logic checks — PASS
- repeated image vertices are correctly permitted;
- a source simplex may collapse to lower dimension;
- the facet-check shortcut is valid for finite complexes because of face closure;
- the realization formula using barycentric coordinates is compatible on shared faces;
- composition and identity are handled correctly;
- simplicial isomorphism is distinguished from a general simplicial map;
- simpliciality is not confused with injectivity or homeomorphism;
- the approximation theorem is stated as a homotopy conclusion, not literal equality.

## Worked-example checks
For K facets `abc, acd` and target triangle `xyz`, the rule
`a→x, b→y, c→z, d→y`
sends both source facets to the target simplex and is simplicial.

For the later audit, K facets `abc, acd, ade`, L facets `pqr, prs`, and
`a→p, b→q, c→r, d→s, e→r`,
the images are `{p,q,r}`, `{p,r,s}`, `{p,r,s}`. All are target simplices; the map is noninjective since `c,e→r`.

## Precision safeguards
The lesson does not claim every continuous map is already simplicial.
It does not replace “homotopic to” with “equal to.”
It does not infer a homeomorphism from simpliciality.
Stronger local-map properties are explicitly left for additional hypotheses.

## Delivery
Standalone HTML, local CSS/JS, restrictive CSP, printable Knowledge Check, Map Laboratory, accessibility statement, metadata, README, verification notes, and SHA-256 manifest are included.
