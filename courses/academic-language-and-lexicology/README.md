# Academic Language and Lexicology — Higher Learning foundation

**Status:** Introductory master course, Phase 1. Four real modules and 16 English terms currently; not yet a complete collegiate-semester course or an accredited credential.

## Instructional model
- **Grades K–2:** oral language, images, context, conversation, repeated story usage. Do not impose written 80% tests on early readers.
- **Grades 3–5:** word families, basic prefixes and suffixes, morphology games, words across subjects.
- **Grades 6–8:** academic vocabulary shared by science, math, history, and English; argument, discussion, context and writing.
- **Grades 9–12:** weekly lesson-linked terms, source vocabulary, nuanced disciplinary uses, evidence-based explanations; teacher-reviewed work plus verified 80% objective gates.
- **Higher Learning:** lexical semantics, corpus selection, register, translation and cognates, semantic shift, terminology stewardship, academic writing, comparative case studies. Four foundation modules exist; advanced research units, annotated sources, formal rubrics, independent work and a capstone remain to build.

## Shared architecture
The course's `word-bank.json` provides `units[]` and `terms[]` with stable IDs, term, definition, contextual example, investigative prompt, and keyed choices. Extend with reviewed language tags, etymology, word families, source citations, accessibility notes, and grade-level scaffolds. Do not overwrite the existing High School Math vocabulary studio or Grade 9 Social Studies glossary. Future bridge should map into the canonical cross-subject vocabulary tool only after data-schema reconciliation.

## Mastery integrity
The current page shuffles question order and options in a unit, scores four objective items, and gates the next unit at a best score of at least 80%. Objective practice is distinct from teacher-reviewed written investigations, and completion of the latter is not falsely represented as an automated grade. Progress is browser-local and manually exportable/importable as JSON. Small four-item banks give coarse 25-point score increments; expand with larger reviewed pools and varied difficulty for fairer assessments before production deployment.

## Research-informed design
- [Reading Rockets: Teaching Vocabulary](https://www.readingrockets.org/topics/vocabulary/articles/teaching-vocabulary) — multiple exposures, explicit teaching, rich contexts, and word-learning strategies.
- [US IES/WWC: English learners and academic content](https://ies.ed.gov/ncee/WWC/PracticeGuide/19/Published) — sustained, varied vocabulary instruction and classroom discourse.
- [SERP Word Generation research](https://doi.org/10.1108/mgrj-04-2016-0004) — cross-disciplinary academic discussion and weekly shared terms.
- [Vocabulary.com for educators](https://www.vocabulary.com/for-educators/) — adaptive varied item formats and progress feedback as useful *design attributes* rather than code/content to copy.
- [IES PRISMS morphology module](https://ies.ed.gov/ncee/rel/reading-intervention-grades-6-8/pro-learning-module2) — roots, prefixes, suffixes, language structure.

## Next hardening
1. Real browser testing of questions, persistence, imports, and print/export.
2. Add teacher-review rubrics, more authentic reading passages, cited word histories, and 10+ varied questions per unit.
3. Build a complete higher-learning weekly syllabus (readings, assignments, midterm, final, capstone) and reusability contract for earlier grades.
4. Audit and reuse High School vocabulary studio and Grade 9 glossary as connected sibling resources, not silently replace them.

## Sovereign Dictionary and Creative Spark archive connection — 2026-11-21

- The course's original `word-bank.json` is the **sole** source for its four-unit lessons and grade assessments. Nothing in the dictionary sync modifies unit gates, word IDs, learner written work, or progress exports.
- The workspace now includes a read-only **Sovereign Dictionary · Word Inquiry** panel, backed by the canonical Linguistics browser assets (`sovereign-dictionary.generated.js`, dictionary errata, academic expansion, and `khaemenes-interlingual-core.js`). No competing dictionary implementation or auto-promotion was added.
- The shared lower-left universal toolbar includes a **Dictionary** shortcut to that panel.
- Creative Spark's unified archive has a separate, exact copy of this word bank at `artist1970/creative-spark.github.io/Dictionary/archive/higher-learning-academic-language-v1.json`. The archive manifest pins this repository's original source Git blob `e3f8ed4152956ef629bce8cf3265cb89b65e560a`.
- These 16 records are cataloged as **course-reviewed English vocabulary, other languages pending review**. Their definitions and contexts are study references, *not* verified bilingual translation pairs. Student assessment outcomes and answers are never exported into the archive.
- The encrypted Mac AGI Mini Cloud is a separate, owner-paired private vocabulary store. This course does not send browser or learner records to it or expose its terminal identity, credentials, or ciphertext.
- Offline/failed dictionary resource loading must leave the course's curriculum, grading and progress functionality available. Live end-to-end acceptance is still required.

### Source-contract checks

Confirm the archived and source `word-bank.json` match exactly, there remain four units and sixteen terms, and unit mastery requires 80%. The dictionary lookup must not touch the existing `KHAE_HL_ACADEMIC_LANGUAGE_V1` progress key or the objective checkpoint code.
