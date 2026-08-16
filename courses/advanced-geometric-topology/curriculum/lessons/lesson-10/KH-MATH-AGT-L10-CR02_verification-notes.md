# Lesson 10 — Forensic Verification Notes

## Live-source audit
The live repository contains the Lesson 10 HTML, metadata, verification notes, README, and SHA-256 manifest. Its intended role is a concept reference / local-topology lesson following Lesson 09.

## Mathematical logic — PASS WITH PRECISION HARDENING
The live lesson correctly states:
- the abstract link formula;
- cycle links for interior vertices of a triangulated 2-manifold;
- interval links for boundary vertices;
- two-point links for interior edges and one-point links for boundary edges;
- branching or disconnected vertex links as nonmanifold diagnostics;
- purity as useful but insufficient;
- connectedness as a separate global property;
- the disk, three-sheets-on-an-edge, and pinched-vertex examples.

## Precision hardening
The hardened version makes several statements more exact:
1. The open star is described using relative interiors of simplices containing σ.
2. For a finite pure 2-complex with circle vertex links, the realization has the local structure of a 2-manifold without boundary; connectedness is explicitly separated as a global question.
3. The higher-dimensional link statement is framed as an interior-simplex fact, with boundary variants deferred rather than compressed into one vague sentence.
4. The join/star language is phrased as a local model rather than an unrestricted identity in every context.

No mathematical contradiction was found in the live lesson.

## Print/accessibility hardening
- complete standalone HTML;
- responsive and printable local-model table;
- printable Knowledge Check response lines;
- structured Independent Investigation record;
- local CSS/JS only;
- restrictive CSP;
- no color, physical model, or outside website required;
- regenerated SHA-256 manifest.
