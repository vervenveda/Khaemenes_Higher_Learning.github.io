# Khaemenes Higher Learning Campus Contract

Effective: 2026-10-22

This contract protects the Higher Learning campus as one connected static-site institution.

## Authority and records

- Khaemenes Academy Family Registry is the learner identity authority.
- Higher Learning preferences, pins and course records remain learner-scoped.
- The shared logical pin key is `khaemenes-higher-learning-pinned-courses-v1`.
- Existing course-owned mastery and assessment runtimes remain authoritative; campus integrations may inventory or expose them but must not silently rewrite them.

## Campus department states

- **Active Department** — a verified learner-facing entrance exists now.
- **Developing Department** — verified instructional material exists, but the department is still expanding or consolidating.
- **Roadmap** — intentionally reserved architecture without a verified department-level curriculum entrance.

## Offline entrance contract

The root campus and Mathematics Department preserve their protected loader architecture. Their loader shells, protected cores, profile adapter, Family Registry fallback, layout CSS, manifests and service workers must remain available for repeat offline use after an online visit.

## Mathematics contract

The Mathematics Department recognizes twelve Higher Learning entrances: Precalculus & Trigonometry, Calculus I, Calculus II, Linear Algebra, Differential Equations, Statistics, Discrete Mathematics, Introduction to Proofs, Real & Complex Analysis, Abstract Algebra, Topology & Differential Geometry, and Advanced Geometric Topology & Mathematical Physics.

The shared Mathematics Evidence Vault must cover the collegiate/advanced sequence without replacing course-owned records.

Run `node scripts/campus-contract-audit.mjs` after architectural changes.
