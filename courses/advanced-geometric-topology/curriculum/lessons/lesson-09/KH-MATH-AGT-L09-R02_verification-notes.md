# Lesson 09 — Forensic Verification Notes

## Live-source audit
The live repository contains the lesson HTML, metadata, verification notes, README, and SHA-256 manifest. The lesson is correctly positioned as Arc 02 / Lesson 09 and requires Arc 01 mastery.

## Mathematical checks — PASS WITH ONE CORRECTION
The following are sound:
- abstract simplicial-complex face closure;
- simplex dimension as |σ|-1;
- distinction between K and |K|;
- triangulation as a simplicial complex together with a homeomorphism |K|→X;
- distinction between an ordinary simplicial complex and the two-triangle torus Δ-complex;
- f-vector notation and Euler-characteristic computation;
- edge-incidence as a preliminary boundary/nonmanifold diagnostic;
- postponement of the full vertex-local criterion to Lesson 10.

### Corrected live-source error
For facets `abc, acd, ade, aeb`, the live lesson listed the distinct edges correctly as:
`ab, bc, ac, cd, ad, de, ae, eb`.

However, it then said only `ac, ad, ae` occur in two triangles. This omits `ab`.

The correct incidence counts are:
- `ab`: in `abc` and `aeb` → 2 triangles
- `ac`: in `abc` and `acd` → 2
- `ad`: in `acd` and `ade` → 2
- `ae`: in `ade` and `aeb` → 2
- `bc, cd, de, eb` → 1 each

The conclusion that the complex has boundary edges and is not closed remains correct. The hardened lesson repairs the incidence list.

## Convention clarification
A brief note now states that this course uses the nonempty-face convention for abstract simplicial complexes; some texts include the empty simplex.

## Delivery hardening
- complete standalone HTML page;
- professional responsive shell;
- responsive and printable tables;
- printable Knowledge Check response lines;
- structured printable Mini-Investigation record;
- local CSS/JS only;
- restrictive CSP;
- regenerated SHA-256 manifest.

External references remain editorial verification only and are not learner dependencies.
