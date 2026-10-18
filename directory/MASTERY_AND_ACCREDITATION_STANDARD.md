# Khaemenes Higher Learning — 80% Mastery & Collegiate Quality Standard
**Established Khaemenes Academy academic mastery policy; implementation and accreditation-readiness audit · 2026-10-18**

## Mission and truthful public status
High-quality education is free to every learner. A public lesson, practice tool, reference Hall or workshop may be open even when it has not been approved as an assessed collegiate certificate course. No document, grade threshold, internal course number, virtual certificate, or portfolio auto-confers accreditation, institutional authority, state authorization, transfer credit, occupational licensure, or a government-recognized degree.

**Institutional certificate awarding and public advertising must be reviewed for applicable state laws before launch.** The goal is to seek appropriate state authorization and accreditation; neither is represented here as obtained.

## Established Academy policy: 80% noncompensatory mastery

The mandatory progression rule for **every Khaemenes Academy lesson, activity, and required assessment** is that the next step stays locked until at least **80% mastery** is recorded. Higher Learning inherits this established policy. Formal collegiate credential eligibility additionally requires independently verified evidence; the rule is not merely an overall grade target. Implementation criteria are:

1. **Entry/readiness:** Offer a placement diagnostic. A low entry score supplies recommended free bridging and tutoring, not permanent exclusion from learning.
2. **Instruction access:** Give all students free visibility into lessons, resources, laboratories and demonstrations. Gating may regulate progression and issuance of an academic completion record, not hide basic educational opportunity behind payment.
3. **Sequential lesson, activity, weekly and unit mastery gates:** Lock each successive required learning step until its immediately preceding required competency assessment meets **80%**. All essential competencies must be demonstrated, and missing/unreviewed evidence must fail closed. At least **80%** on every required assessed checkpoint, plus all essential competencies demonstrated. An 84% average cannot offset a 65% essential lab or unit.
4. **Question-bank quality:** Reviewed banks larger than any one delivered quiz form; random sampling and randomized answer order where applicable, deterministic saved attempt snapshots, distinct retake forms, answer explanations, difficulty calibration and content-domain coverage. Multiple-choice alone is not appropriate for every field.
5. **Written/practical evidence:** Labs, papers, coding projects, oral language work, studio performance and other required artifacts must each reach **80% on an explicit rubric** and meet all safety/ethics critical criteria. A rubric may require minimum subdomain scores.
6. **Midterm and final:** Separate, individual **80%** pass thresholds on both wherever the course plan requires them; final cumulative assessment cannot be waived by a high formative average. Closed-book or proctored constraints must not be called secure if all prompts/keys exist in public JavaScript.
7. **Capstone and defense:** When required, **80%** separately on faculty-reviewed final project/portfolio and oral/practical defense. Independent evaluator/moderator or auditable rubric required for academic release.
8. **Retakes and remediation:** Free practice, explanations, individualized remediation, accommodation, alternate equivalent assessment forms and fair appeal rights. A failed gate stays pending until independently reassessed; no silent score overwrite.
9. **Faculty and learning integrity:** Qualified subject reviewer signs off on accuracy, prerequisites, teaching sequence, evidence grading and assessment alignment. Detect and escalate academic integrity concerns without presuming misconduct.
10. **Completion:** A course becomes *eligible* for a truthful institutional completion record **only after every required gate is passed**, verified, dated, attributable to the correct learner, and retained under the approved records policy. Policy/authorization governs whether formal institutional certificates may be awarded.

## Proposed course completion object (for future engine implementation)
```json
{
  "courseId":"example-course",
  "learnerId":"academy-learner-id",
  "thresholdPercent":80,
  "required": {
    "units":[{"id":"unit-01","score":85,"passed":true}],
    "labs":[{"id":"lab-01","rubricPercent":82,"safetyPassed":true}],
    "midterm":{"score":80,"verified":true},
    "final":{"score":86,"verified":true},
    "capstone":{"rubricPercent":90,"verified":true}
  },
  "facultyReview":{"approved":false,"reviewerRef":null},
  "complete":false
}
```
The example is **design-only**. Do not make it a public self-awarding certificate algorithm. The future canonical registrar must verify all assessments, signoffs, identity, accessibility and authorization before finalizing an academic completion record.

## Technical safeguards to audit at every owning source repository

- Questions are pedagogically meaningful, answer keys are accurate and versioned, and no essential skill is evaluated by trivially repeatable prompts.
- The browser never grants mastery because of simply visiting, clicking Complete, opening a help card, or manipulating client-side stored values.
- All score saves are identity-scoped, atomically written when possible, protected from two-tab conflicts, versioned, and portable through learner-owned export and integrity-checked import.
- Imported snapshots may restore practice progress but do not blindly grant external/registrar-verified completions.
- Publicly accessible source repositories may contain practice questions and explanatory keys, **not secure unseen summative questions, secret answers, identity credentials, or signing keys**.
- Assessment accommodation paths do not compromise standards: accessible keyboard input, alternatives for sensory/motor impairments, extra time where approved, accessible media captions/transcripts, and equivalent methods.
- No third-party runtime is required to navigate a course where sovereign, no-dependency implementations work.
- Course-wide tests cover menu/link routes, offline fallback, local persistence, profile switching, display on mobile and Linux/macOS/Windows browsers, print, export/import, and error recovery.

## Four separate academic release states

| State | Public wording | Approval requirement |
| --- | --- | --- |
| Resource or workshop | Free self-directed learning | Accurate resources and safe access |
| Collegiate candidate | College-oriented course under review | Substantial taught content and preliminary assessments |
| Internal academic QA complete | Reviewed college-level course materials; accreditation not claimed | Faculty, integrity, access and mastery QA passed |
| Authorized credential offering | An explicitly named completion certificate under approved authority | Applicable legal authorization + institutional approvals + approved registrar and award process |

**Never automatically escalate** a course from the second to the fourth state because a script computes `>= 80`.

## Accreditation / authorization preparation

1. Determine the **actual legal institution**, ownership, business/charitable structure, physical state of operation, whether the activity legally constitutes a postsecondary institution, advertising claims and whether any state exemption is applicable.
2. Ask the applicable state regulator for a documented determination on a free-to-all *nondegree certificate* offering and any prerequisites for accepting students into formal certificate classes. Free tuition does not by itself establish a licensure exemption.
3. Choose a recognized accreditor whose actual scope and eligibility fit the plan. For distance-focused institutional accreditation, DEAC is one agency to investigate, *not a guarantee*.
4. Compile institution-wide evidence: governance/independence, policies, educational objectives, admissions and records, student protections, accessibility, faculty qualifications, financial sustainability and audits, legal authorization, enrollment history, course and program outcomes, longitudinal student success.
5. Form discipline-qualified curriculum advisory panels; map course outcomes to program outcomes, real workload, level, and credible external references; maintain faculty moderation of assessments.
6. Start with a **small number of exemplary, truthful, nondegree pathways** after legal approval rather than advertising multiple unapproved associate/bachelor/graduate degrees.
7. Preserve a documented quality-improvement cycle with course revisions, learner feedback, external review and audited evidence.

### Reference authorities verified October 2026

- U.S. Department of Education: [Accreditation in the United States](https://www.ed.gov/laws-and-policy/higher-education-laws-and-policy/college-accreditation/accreditation-in-the-us)
- U.S. Department of Education: [Recognized institutional accrediting agencies](https://www.ed.gov/laws-and-policy/higher-education-laws-and-policy/college-accreditation/institutional-accrediting-agencies)
- Distance Education Accrediting Commission: [Eligibility requirements](https://www.deac.org/seeking-accreditation/eligibility-requirements/)
- DEAC: [Accreditation handbook](https://www.deac.org/seeking-accreditation/the-deac-accreditation-handbook/)
- Florida Commission for Independent Education (if Florida is the institution's state): [Initial application](https://www.fldoe.org/policy/cie/new-institution-application.stml). Verify applicable exemptions/status with CIE rather than assuming free coursework is exempt.

**Do not claim these references endorse, accredit, authorize, or recognize Khaemenes Higher Learning.**

## Evidence pack required per course for the fine-tuning queue

- Course identity and source repository, faculty/discipline steward and accreditation-claim disclaimer.
- Learning outcome grid mapped to specific readings, worked instruction, exercises and assessment domains.
- Prerequisite diagnostic, complete syllabi, weekly workload estimates, source/copyright provenance.
- Reviewed large question bank and sample randomized trials with saved exact question/option permutations.
- Graded written/practical and summative evidence; defined 80% gate per essential domain.
- Quality rubric and faculty signoff; student support, accessibility, secure summative administration.
- Audit report containing objective pass/fail data, deficiencies, remediation dates, commits and verifiable test evidence.

**No new full courses should be authored until each candidate is inventoried and source reuse opportunities are confirmed.**

Steward: Jennifer Kay Pearl · Khaemenes Higher Learning.
