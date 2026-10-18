# Tool Integration

## Scientific Calculator v4

Used for tables, graph windows, numerical limits, tangent estimates, symbolic verification where available, regressions, definite-integral estimates, differential-equation exploration, and checking exact versus approximate results. A mathematical setup, settings, units, and interpretation remain required.

## OHMIC Foundry CAD Studio

Used in optimization, related rates, cross-section, area, volume, scale, tolerance, and capstone design tasks. Students may retain printed briefs and SVG, PDF, PNG, DXF, JSON, or CSV evidence where appropriate.

## Technology principle

Technology supports exploration and verification; it does not replace definitions, theorem conditions, symbolic reasoning, units, domain analysis, or written conclusions.


## Federated High School mathematics studios · October 2026

Calculus I now reuses fourteen verified, source-owned High School mathematics tools. No games, scorebooks, personal data, teacher keys, or curriculum files are duplicated into Higher Learning.

- **Canonical tool mappings / UI:** `assets/calculus1-shared-math-tools-v1.js`
- **Source library:** `vervenveda/Khaemenes_High.github.io/courses/mathematics/assets/learning-games/`
- **Scientific calculator:** `vervenveda/Khaemenes_High.github.io/courses/mathematics/tools/calculator/`
- **Lesson integration:** `assets/lesson-tools.js` loads the curated tool links into each lesson's right sidebar.
- **Unit integration:** `assets/calculus1-unit-route-gates-v1.js` loads unit-topic matches in every unit landing page.
- **Course integration:** `index.html` presents the same tools in the existing Math Games & Tools panel, with a unit selector and activity-window launch.

Students receive topic-relevant supporting tools, not a random list of every High School game. Calculus-specific worked instruction and native calculus visual experiments must still be developed/reviewed separately.

**Academic integrity:** Games and tools provide entirely optional independent practice. High School game scores do not satisfy any required 80% Calculus I gate, grade, formal assessment, college-credit claim or certificate requirement. Opening a tool does not alter progress. Links retain the High School repo's original storage, hosting and source ownership.

Source paths were verified in GitHub `main`. Live website deploy, iframe behavior, mobile/keyboard/screen-reader acceptance and the correctness of individual generated game rounds remain to be beta tested. If an activity cannot load in the embedded course window, open it in a separate tab. Links require connectivity to the owning repository's published site.

See [Curriculum Depth and Shared Tools Audit](CURRICULUM_DEPTH_AND_SHARED_TOOLS_AUDIT_2026-10-18.md) for the next lesson, printable, project and calculus-specific-tool priorities.
