"use strict";
(function () {
  const DATA = window.KHAE_ADVANCED_COURSE_DATA;
  const STORAGE = window.KHAEMENES_STORAGE;
  const MASTERY = window.KHAEMENES_MASTERY;
  const MENTOR = window.KHAEMENES_MENTOR;
  const UTILS = window.KHAEMENES_UTILS;
  const ASSESS = window.KHAEMENES_ASSESSMENT_ENGINE;

  if (!DATA || !Array.isArray(DATA.sessions)) throw new Error("Course data could not be loaded.");

  const week = UTILS.getQueryInt("week", 1, 1, 36);
  const day = UTILS.getQueryInt("day", 1, 1, 5);
  const baseSession = DATA.sessions.find(item => item.week === week && item.day === day);
  if (!baseSession) throw new Error(`Session not found for Week ${week}, Day ${day}.`);

  const richSession = window.KHAEMENES_LESSONS?.[baseSession.id] || {};
  const session = { ...baseSession, ...richSession };

  const state = STORAGE.getState();
  const record = STORAGE.ensureSession(session.id, { labRequired: Boolean(session.lab) });
  record.viewed = true;
  MASTERY.recalculate(record);
  STORAGE.save();

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value ?? "";
  }
  function setHtml(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = value ?? "";
  }

  function list(items) {
    return (items || []).map(x => `<li>${UTILS.esc(x)}</li>`).join("");
  }

  function renderRichContent() {
    const target = document.getElementById("richLesson");
    if (!target) return;
    if (!richSession.id) {
      target.innerHTML = `<article class="card"><h2>Lesson content migration pending</h2><p>This session is still using the legacy 180-session record while its full instructional module is prepared.</p></article>`;
      return;
    }

    const reading = (session.reading || []).map(sec => `
      <section class="lesson-block">
        <h3>${UTILS.esc(sec.heading)}</h3>
        ${(sec.paragraphs || []).map(p => `<p>${UTILS.esc(p)}</p>`).join("")}
      </section>`).join("");

    const definitions = (session.definitions || []).map(d =>
      `<div class="notice"><strong>${UTILS.esc(d.term)}.</strong> ${UTILS.esc(d.statement)}</div>`
    ).join("");

    const examples = (session.examples || []).map(ex =>
      `<section class="lesson-block"><h3>${UTILS.esc(ex.title)}</h3><p>${UTILS.esc(ex.body)}</p></section>`
    ).join("");

    const guided = (session.guidedPractice || []).map((p, i) =>
      `<li><strong>${i+1}.</strong> ${UTILS.esc(p.prompt)}<details><summary>Hint</summary><p>${UTILS.esc(p.hint)}</p></details></li>`
    ).join("");

    const proofs = (session.proofTasks || []).map(p =>
      `<section class="lesson-block"><h3>${UTILS.esc(p.title)}</h3><p>${UTILS.esc(p.prompt)}</p><details><summary>Reviewer criteria</summary><ul>${list(p.rubric)}</ul></details></section>`
    ).join("");

    const misconceptions = (session.misconceptions || []).map(m =>
      `<li><strong>Error:</strong> ${UTILS.esc(m.error)}<br><strong>Correction:</strong> ${UTILS.esc(m.correction)}</li>`
    ).join("");

    target.innerHTML = `
      <article class="card">
        <p class="eyebrow">Hardened instructional module · ${UTILS.esc(session.id)}</p>
        <h2>Core lesson</h2>
        <p><strong>Estimated study time:</strong> ${UTILS.esc(session.estimatedMinutes)} minutes</p>

        <h3>Prerequisites</h3><ul>${list(session.prerequisites)}</ul>
        ${reading}

        <h2>Definitions</h2>${definitions}

        <h2>Examples</h2>${examples}

        <h2>Nonexamples / cautions</h2><ul>${list(session.nonExamples)}</ul>

        <h2>${UTILS.esc(session.workedExample?.title || "Worked example")}</h2>
        <ol>${list(session.workedExample?.steps)}</ol>

        <h2>Guided practice</h2><ol>${guided}</ol>

        <h2>Independent practice</h2><ol>${list(session.independentPractice)}</ol>

        <h2>Proof workshop</h2>${proofs}

        <h2>Common errors</h2><ul>${misconceptions}</ul>

        <h2>Reflection prompts</h2><ul>${list(session.reflectionPrompts)}</ul>
      </article>`;
  }

  function renderAssessment() {
    const host = document.getElementById("assessmentHost");
    if (!host) return;
    const assessment = window.KHAEMENES_ASSESSMENTS?.[session.id];
    if (!assessment) {
      host.innerHTML = `<p class="notice">The objective assessment for this session is not yet migrated.</p>`;
      return;
    }

    host.innerHTML = `
      <h3>${UTILS.esc(assessment.title)}</h3>
      <form id="conceptForm">
        ${assessment.questions.map((q, qi) => `
          <fieldset class="lesson-block">
            <legend><strong>${qi+1}. ${UTILS.esc(q.prompt)}</strong></legend>
            ${q.choices.map((choice, ci) => `
              <label style="display:block;margin:.45rem 0">
                <input type="radio" name="${UTILS.esc(q.id)}" value="${ci}">
                ${UTILS.esc(choice)}
              </label>`).join("")}
          </fieldset>`).join("")}
        <button type="submit">Grade Concept Check</button>
      </form>
      <p id="assessmentResult" class="notice"></p>`;

    document.getElementById("conceptForm").addEventListener("submit", event => {
      event.preventDefault();
      let correct = 0;
      let answered = 0;
      assessment.questions.forEach(q => {
        const selected = event.target.querySelector(`input[name="${q.id}"]:checked`);
        if (selected) {
          answered++;
          if (Number(selected.value) === q.answer) correct++;
        }
      });
      if (answered !== assessment.questions.length) {
        setText("assessmentResult", `Answer all ${assessment.questions.length} questions before grading.`);
        return;
      }
      const score = correct / assessment.questions.length * 100;
      ASSESS.recordObjectiveAttempt(session.id, {
        score,
        correct,
        total: assessment.questions.length,
        assessmentId: assessment.id
      });
      setText("assessmentResult", `${correct}/${assessment.questions.length} correct · ${score.toFixed(0)}%. ${score >= assessment.threshold ? "Concept threshold met." : "Review and retry."}`);
      render();
    });
  }

  function renderMastery() {
    MASTERY.recalculate(record);
    const rows = [
      ["Conceptual threshold", record.mastery.conceptual],
      ["Proof reviewed", record.mastery.proof],
      ["Required lab", record.mastery.lab],
      ["Corrections", record.mastery.correction],
      ["Defense/explanation", record.mastery.defense]
    ];
    setHtml("masteryChecklist", rows.map(([label, pass]) =>
      `<li><strong>${pass ? "✓" : "○"}</strong> ${UTILS.esc(label)}</li>`).join(""));
    setText("masteryStatus", record.mastery.overall
      ? "Session mastery verified."
      : "Mastery remains multi-stream: a concept score alone never certifies proof mastery.");
  }

  function render() {
    document.title = `${session.id} · ${session.topic}`;
    setText("eyebrow", `Week ${week} · Day ${day} · Unit ${session.unit}`);
    setText("title", session.title);
    setText("purpose", session.purpose || session.topic);
    setHtml("objectives", list(session.objectives));
    setHtml("warmup", list(session.warmup));
    setHtml("evidence", list(session.evidence));

    const pathway = document.getElementById("pathway");
    if (pathway) pathway.value = state.pathway;
    setText("pathwayText", session.pathways?.[state.pathway] || "");
    setText("mentorText", MENTOR.mentorMessage(session, state.pathway));

    const reflection = document.getElementById("reflection");
    if (reflection) reflection.value = record.reflection || "";
    const evidenceNote = document.getElementById("evidenceNote");
    if (evidenceNote) evidenceNote.value = record.proof.evidence || "";

    setText("conceptSummary", record.concept.score === null
      ? "No objective assessment score has been recorded."
      : `Latest objective score: ${record.concept.score}%. ${record.concept.passed ? "Concept threshold met." : "Threshold not yet met."}`);

    if (session.lab) {
      setHtml("lab", `<div class="notice"><strong>Assigned laboratory:</strong> ${UTILS.esc(session.lab)}. <a href="labs/">Open lab registry</a>.</div>`);
    } else setHtml("lab", "");

    renderRichContent();
    renderAssessment();
    renderMastery();
    MENTOR.buildContext(session, state, window.KHAEMENES_MATH_CONTEXT || null);
  }

  document.getElementById("pathway")?.addEventListener("change", e => {
    STORAGE.setPathway(e.target.value);
    render();
  });
  document.getElementById("askMentor")?.addEventListener("click", () => {
    setText("mentorText", MENTOR.mentorMessage(session, state.pathway));
  });
  document.getElementById("saveReflection")?.addEventListener("click", () => {
    record.reflection = document.getElementById("reflection").value.trim();
    STORAGE.save(); render();
    setText("status", "Reflection saved locally.");
  });
  document.getElementById("saveEvidence")?.addEventListener("click", () => {
    record.proof.evidence = document.getElementById("evidenceNote").value.trim();
    record.proof.submitted = Boolean(record.proof.evidence);
    record.proof.status = record.proof.submitted ? "submitted-unreviewed" : "not-submitted";
    STORAGE.save(); render();
    setText("status", record.proof.submitted
      ? "Written evidence saved as submitted/unreviewed."
      : "Written evidence cleared.");
  });
  document.getElementById("exportRecord")?.addEventListener("click", () => {
    UTILS.downloadJson(`${session.id}-scholar-record-v2.json`, {
      ...STORAGE.exportRecord(),
      currentContext: window.ARCHAEMENES_LEARNING_CONTEXT
    });
  });

  const prev = document.getElementById("prev");
  const next = document.getElementById("next");
  if (prev) prev.href = day > 1 ? `lesson.html?week=${week}&day=${day-1}` : (week > 1 ? `lesson.html?week=${week-1}&day=5` : "index.html");
  if (next) next.href = day < 5 ? `lesson.html?week=${week}&day=${day+1}` : (week < 36 ? `lesson.html?week=${week+1}&day=1` : "assessments/");

  window.KHAEMENES_CURRENT_SESSION = session;
  render();
})();
