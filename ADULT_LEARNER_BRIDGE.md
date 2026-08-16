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

## Public entry points

- Academy adult enrollment: `/Khaemenes_Academy.github.io/adult/enroll/`
- Higher Learning scholar entry: `/Khaemenes_Higher_Learning.github.io/start/`
- Higher Learning campus: `/Khaemenes_Higher_Learning.github.io/`

## Runtime bridge

`assets/khaemenes-higher-learning-bridge.js`

The bridge reads the Academy registry when available on the shared `vervenveda.com` origin and exposes a public-safe Higher Learning context.

It does not authenticate a person, expose credentials, change placement, award mastery, or silently alter grades.

## Course record convention

Higher Learning courses should progressively scope local records to the canonical learner ID:

`khaemenes.course:<learnerId>:higher:<courseId>`

Existing course-local records should be migrated carefully and never silently overwritten.

## Future protected account layer

A future authorized server may provide secure cross-device accounts. That transport should preserve the same canonical learner identity contract so public course code does not need to know protected backend topology.
