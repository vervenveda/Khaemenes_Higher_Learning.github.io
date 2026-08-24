# Academy → Higher Learning Bridge

Status: active public-safe bridge

## Purpose

Khaemenes Higher Learning accepts two canonical entry paths:

1. Grade 12 progression from the Khaemenes K–12 continuum.
2. Direct adult entry for a learner beginning, returning to, or resuming study later in life.

Higher Learning does **not** create an artificial Grade 13.

## Identity contract

The Academy Family Registry remains the identity authority for the current public/local implementation.

An adult learner keeps two linked roles:

- adult account/profile identity;
- learner/scholar identity.

The learner identity uses:

- `stage: "higher"`
- `grade: null`
- `selfDirectedAdult: true`
- `linkedAdultId: <adultId>`

This allows an adult to manage their own study without conflating guardian/family authority with learner records.

## Mentor contract

Archaemenes remains the single continuous Khaemenes Academy educational Mentor. Higher Learning uses his **Scholar** expression.

Canonical Mentor doorway:

`https://vervenveda.com/Khaemenes_Academy.github.io/mentor/`

Higher Learning does not maintain a competing `/mentor/` application. The Higher Learning bridge may add public-safe stage, subject, course, and source context to the canonical Mentor doorway, but it does not place learner IDs, family IDs, credentials, grades, or protected records in the URL.

The established Career application names — including **Career Mentor Hub** and **Assessment Mentor** — remain unchanged. They are program/tool names in the Master Directory and do not replace Archaemenes as the Academy Mentor.

## Public entry points

- Academy adult enrollment: `/Khaemenes_Academy.github.io/adult/enroll/`
- Higher Learning scholar entry: `/Khaemenes_Higher_Learning.github.io/start/`
- Higher Learning campus: `/Khaemenes_Higher_Learning.github.io/`
- Canonical Academy Mentor: `/Khaemenes_Academy.github.io/mentor/`

## Runtime bridge

`assets/khaemenes-higher-learning-bridge.js`

The bridge reads the Academy registry when available on the shared `vervenveda.com` origin and exposes a public-safe Higher Learning context.

It also loads the Academy NAIB mentor-assignment router when needed so the Scholar expression is assigned through the same Academy routing contract used by the other Khaemenes stages.

It does not authenticate a person, expose credentials, change placement, award mastery, silently alter grades, or create a second Mentor identity.

## Course record convention

Higher Learning courses should progressively scope local records to the canonical learner ID:

`khaemenes.course:<learnerId>:higher:<courseId>`

Existing course-local records should be migrated carefully and never silently overwritten.

## Authority boundary

- **Family Registry** — learner identity and Higher Learning stage
- **NAIB** — routing / assignment
- **Archaemenes** — Scholar Mentor expression
- **Career Mentor Hub / Assessment Mentor** — established Career tools whose names remain stable
- **Course engine / faculty** — mastery, assessments, progression, and protected academic decisions

## Future protected account layer

A future authorized server may provide secure cross-device accounts. That transport should preserve the same canonical learner identity contract so public course code does not need to know protected backend topology.
