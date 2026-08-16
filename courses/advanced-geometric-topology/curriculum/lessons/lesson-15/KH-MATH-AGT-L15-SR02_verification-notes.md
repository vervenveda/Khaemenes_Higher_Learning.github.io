# Lesson 15 — Forensic Verification Notes

## Alignment
The commentary is keyed one-to-one to all 36 Lesson 14 problems.

## Mathematical spot checks
PASS:
- Problem 1 identifies only `{b,c}` as the missing face.
- Problem 2 generated complex has vertices 5, edges 7, triangles 3.
- Problem 4 gives `(4,5,2)` and χ=1.
- Problems 7–12 use correct link criteria.
- Problem 13 edge-subdivision counts `(4,5,2)` and χ=1.
- Problem 15 barycentric subdivision counts `(7,12,6)` and χ=1.
- Problem 18 midpoint link is the cycle a-c-b-d-a.
- Problem 19 valid simplicial map is checked facet by facet.
- Problem 22 uses the affine barycentric realization formula.
- Problem 25 correctly rejects `{x,z}` when xz is absent from the target path.
- Problem 31 correctly retains the Lesson 09 correction: `ab, ac, ad, ae` are the two-triangle edges. The vertex-link audit shows the complex is locally a 2-manifold with boundary and boundary cycle b-c-d-e-b.
- Problem 35 correctly separates direct combinatorial verification from theorem-based conclusions.

## Remediation architecture
Each content cluster maps back to Lessons 09–13. The correction protocol requires learners to identify the first invalid step, repair it, name the failed concept, and state a transfer rule.

## Delivery
Standalone HTML, local CSS/JS, restrictive CSP, printable commentary, metadata, README, verification notes, and SHA-256 manifest.
