# Constitutional Studies — Four-Week Forensic QA Ledger

Date: 2026-10-20

## Scope
Read-back of committed source for Weeks 01–04, gateway, and unified completion module. This is source inspection, not a browser automation pass or legal editorial certification.

## Implemented
- Four independent weekly records, each requiring an objective score >=80%, five >=60-character submitted responses, and reviewer confirmation.
- A new shared completion dashboard that reads all four same-origin localStorage records and prevents starting its final until weekly requirements are satisfied.
- A cumulative examination drawing 10 items from each weekly 20-item bank (40 questions), without replacement within each week; one answer can be scored per item.
- Qualification for a local, self-reported completion record requires completed weeks, >=32/40 on a complete final attempt, capstone reviewer approval/name, and matching non-empty names in all four weekly profiles.
- Unqualified certificate printing suppressed.

## Remaining risks / explicit limits
1. Weekly module pages themselves are directly navigable: the course dashboard gates its final but does not restrict direct access to later lessons. Add a non-destructive course gate or explanatory notice before claiming comprehensive sequential unlocking.
2. Weekly records and final completion are editable localStorage data, so they are not identity-proof, tamper-proof, independently proctored or formal academic accreditation.
3. Week assessments reveal corrections after each response; the cumulative final currently does too. Consider withholding answers until final submission if closed-book summative assessment is intended.
4. A >=60-character response and checked review checkbox cannot algorithmically establish evidence quality. A real human must review citations, case accuracy and final written work.
5. Verify all external source links and all constitutional case summaries against latest controlling doctrine before release.
6. Perform actual browser tests: keyboard navigation, 255px viewport, Safari/iOS, offline loads, storage-denied contexts, file import/export, all-five-day print, accessibility and graded retakes.
7. No cross-device account sync or centrally verified certificates. Local records remain browser/device-specific.
8. Import validation checks shape and week identity but needs stricter range and cross-field validations. Imported attempts in final dashboard receive additional score/length checks, not cryptographic provenance.

## Acceptance cases to execute in browser
- New browser profile: Week 1–4 pending; final locked; certificate hidden, including print preview.
- Pass one week only: final remains locked.
- Four weeks with written work incomplete: final remains locked.
- Four complete records with consistent student name: 40-question final enabled.
- Double-click an answer: score advances once.
- Final score 31/40: certificate remains hidden.
- Final score >=32/40, reviewer approval missing: certificate hidden.
- Final score >=32/40 and reviewer approved, matching names: local completion record appears.
- Export records and re-import to weekly page; refresh final overview.
- Check full portfolio print output for all five daily responses on each week.
