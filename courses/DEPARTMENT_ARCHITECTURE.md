# Higher Learning Course Architecture

**Canonical campus:** `/`  
**Canonical Mathematics Department:** `/courses/`  
**Compatibility mathematics subtree:** `/courses/mathematics/`  
**Canonical Science Department:** `/courses/science/`  
**Compatibility legacy science route:** `/Science/` → `/courses/science/`

## Rules

- Existing verified course folders are not relocated merely to make URLs look uniform.
- `courses/index.html` is the public Mathematics Department landing page.
- `courses/mathematics/index.html` remains a compatibility redirect.
- Precalculus & Trigonometry and Calculus I retain their migrated nested locations.
- Direct-root mathematics courses retain their current `courses/<course>/` routes.
- Non-mathematics course folders under `courses/` are classified by the campus directory; folder location alone does not determine department membership.
- New collegiate Science courses live under `courses/science/<course>/` and follow the advanced-Mathematics full-course package standard.
- The older top-level `Science/` route is compatibility-only and must not contain a competing curriculum core.
- Student pins use `khaemenes-higher-learning-pinned-courses-v1`.
- Public internal links should prefer the canonical `https://vervenveda.com/Khaemenes_Higher_Learning.github.io/` host.
- Every mathematics course should provide a visible return route to both Higher Learning and the Mathematics Department.

This contract preserves bookmarks while allowing the collegiate curriculum to expand without a disruptive repository migration.

**Curriculum and campus architecture:** Jennifer Pearl
