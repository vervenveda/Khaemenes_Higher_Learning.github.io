# Higher Learning Adult Ecosystem Resource Audit — 2026-11-17

## Scope

Full scan of the canonical Verve N Veda master ecosystem directory against the current Khaemenes Higher Learning campus resource layer.

Canonical directory scanned:
- KhaemenesAcademy/vervenveda.github.io/ecosystem/master-ecosystem-directory.json

Active, directory-visible, free-public entries found: 183.

## Directory category inventory

- education: 77
- civic: 28
- creative: 15
- research: 8
- games: 8
- professional: 8
- communication: 7
- finance: 7
- health: 6
- weather: 6
- news: 6
- environmental: 3
- diplomacy: 3
- gateway: 1

## Adult-course ecosystem families confirmed

### Research, archives, discovery
- ARSHIF Archives
- ARSHIF Faith Hall
- Bible Context
- Yahushua Study
- Biblical Web Directory
- PLERA Search
- PLERA Search Gate
- PLERA Search Pro
- Evidence & Citation Studio
- Evidence Citation Lab Resource Cloud

### Health, wellness, medicine
- Medicament Hub
- Health Is Wealth
- Wellness Workshop
- Workout Builder
- Additional health courses in the Medicament branch

### Civic life, government, public service
- One Nation For All
- Pulse · One Nation
- Firmament
- Law & Governance Hall
- Veterans Resource Hub
- Veterans Hub · National
- Veterans Hub · Florida
- additional civic and diplomacy resources in the directory

### News, media, verification
- The Verifier
- Modern News Engine
- Global News Digest
- Science News
- World Wire

### Finance, business, nonprofit study
- Finance Academy & Hall
- Financial Hall
- Nonprofit Hall
- Budget Planner
- Small Business Budget
- 6-Week Personal Finance
- Investment Foundations

### Professional and technical tools
- ProReSources
- DailySpark Task Studio
- Evidence & Citation Studio
- KhaeClean
- KhaeZip
- Khaemenes Scientific Calculator
- Ohmic CAD Studio
- Higher Learning Career Portal
- Career Assessment
- Career Mentor Hub
- Career Directory AGI

### Arts, music, creative practice
- Bazaar Art
- Bazaar Art Live
- Art Hall
- Music Hall
- Art 101
- Photo Album Studio
- SpinSpire Art Prompt Generator
- The Refrain
- Music 101 Workshop
- Music 201 Workshop
- Composer Studio
- My Art Gallery

### Environment, weather, Earth systems
- Solanar
- Solanar Live Weather
- Solanar Planetarium
- Solanar TraceLab
- River to Road and environmental tools

### Communication and collaboration
- 333 Network
- E=Ven Mail
- HOLLO 333 Direct Connect
- KANSEE 333 Meeting Rooms
- SIte Builder
- Bunya Digital Infrastructure
- Bazaar Art Live

### Language and cultural study
- Khaemenes Linguistics
- Linguistics Halls
- Language Learning Hall
- Arabic 365
- Qur'an Root Explorer
- additional language resources should remain eligible as adult study tools

## Current Higher Learning gap

The current Higher Learning resource library is hard-coded to approximately ten resources:
Career Portal, ProResource Hub, Scientific Calculator, OHMIC CAD, ARSHIF, PLERA Search, Arcade, Sacred Geometry, High School, and Khaemenes Academy.

The current Connected Learning Halls strip is also limited to:
Verve N Veda, Khaemenes Academy, Career Portal, ProResource Hub, Arcade, and Science & Discovery.

Therefore the existing campus mechanism is functional but under-connected relative to the canonical ecosystem directory.

## Recommended adult architecture

Higher Learning should not maintain a second hand-written ecosystem catalogue.

Instead:

1. The canonical master ecosystem directory remains the source of truth.
2. Higher Learning loads active, public, directory-visible entries dynamically.
3. Adult-course resources are grouped into academic families:
   - Research & Archives
   - Civic, Law & Public Service
   - Health & Wellness
   - Finance & Enterprise
   - Professional & Technical
   - News & Media Literacy
   - Arts, Music & Creative Practice
   - Environment, Weather & Earth Systems
   - Communication & Collaboration
   - Languages & Cultural Study
   - Career & Lifelong Learning
4. Child-only resources should not appear in the default adult catalogue merely because they are public.
5. High School may remain available as prerequisite/review, but Preschool, Kindergarten, and elementary child tools should not populate the adult resource shelf by default.
6. Higher Learning resource favorites should continue to be learner-scoped/local, while directory data remains read-only navigation metadata.
7. The adult resource toolbar may be broader than K–12 and should include direct access to:
   Research, Civic/Law, Health, Finance, Creative, and Full Ecosystem Search.
8. Resource categories should be filterable and searchable, with the directory automatically absorbing future ecosystem additions.

## Priority adult gateways

The following should be promoted prominently in the Higher Learning adult resource experience:

- ARSHIF Archives
- PLERA Search
- Medicament Hub
- One Nation For All
- Firmament / Law & Governance
- Veterans Resource Hub
- Finance Academy
- ProReSources
- The Verifier
- Solanar
- Bazaar Art
- The Refrain
- 333 Network
- Khaemenes Linguistics
- Higher Learning Career Portal

## Next implementation pass

Replace the hard-coded Higher Learning RESOURCES catalogue with a directory-backed adult resource adapter while preserving:
- My Shelf favorites
- search
- category filtering
- random resource discovery
- existing course and profile state
- no grading/mastery mutations

Then expand the Connected Learning Halls section into balanced adult ecosystem gateway cards driven by the same canonical directory.
