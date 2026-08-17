"use strict";
(function () {
  const DATA = window.KHAE_ADVANCED_COURSE_DATA;
  const STORAGE = window.KHAEMENES_STORAGE;
  const MASTERY = window.KHAEMENES_MASTERY;
  const MENTOR = window.KHAEMENES_MENTOR;
  const UTILS = window.KHAEMENES_UTILS;

  if (!DATA || !Array.isArray(DATA.sessions)) {
    throw new Error("Course data could not be loaded.");
  }

  const week = UTILS.getQueryInt("week", 1, 1, 36);
  const day = UTILS.getQueryInt("day", 1, 1, 5);
  const session = DATA.sessions.find(item => item.week === week && item.day === day);

  if (!session) throw new Error(`Session not found for Week ${week}, Day ${day}.`);

  const state = STORAGE.getState();
  const record = STORAGE.ensureSession(session.id, { labRequired: Boolean(session.lab) });
  record.viewed = true;
  MASTERY.recalculate(record);
  STORAGE.save();

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value ?? "";
  }

  function setHtml(id, value) {
    const element = document.getElementById(id);
    if (element) element.innerHTML = value ?? "";
  }

  function renderMastery() {
    MASTERY.recalculate(record);
    const mastery = record.mastery;
    const rows = [
      ["Conceptual threshold", mastery.conceptual],
      ["Proof reviewed", mastery.proof],
      ["Required lab", mastery.lab],
      ["Corrections", mastery.correction],
      ["Defense/explanation", mastery.defense]
    ];
    setHtml("masteryChecklist", rows.map(([label, pass]) =>
      `<li><strong>${pass ? "✓" : "○"}</strong> ${UTILS.esc(label)}</li>`
    ).join(""));

    setText("masteryStatus",
      mastery.overall
        ? "Session mastery verified."
        : "Mastery remains evidence-based. Reading a lesson or passing one objective check does not certify the session."
    );
  }

  function render() {
    document.title = `${session.id} · ${session.topic}`;
    setText("eyebrow", `Week ${week} · Day ${day} · Unit ${session.unit}`);
    setText("title", session.title);
    setText("purpose", session.purpose);

    setHtml("objectives", (session.objectives || []).map(x => `<li>${UTILS.esc(x)}</li>`).join(""));
    setHtml("warmup", (session.warmup || []).map(x => `<li>${UTILS.esc(x)}</li>`).join(""));
    setHtml("evidence", (session.evidence || []).map(x => `<li>${UTILS.esc(x)}</li>`).join(""));

    const pathway = document.getElementById("pathway");
    if (pathway) pathway.value = state.pathway;

    setText("pathwayText", session.pathways?.[state.pathway] || "");
    setText("mentorText", MENTOR.mentorMessage(session, state.pathway));

    const reflection = document.getElementById("reflection");
    if (reflection) reflection.value = record.reflection || "";

    const evidenceNote = document.getElementById("evidenceNote");
    if (evidenceNote) evidenceNote.value = record.proof.evidence || "";

    const conceptSummary = record.concept.score === null
      ? "No objective assessment score has been recorded."
      : `Latest objective score: ${record.concept.score}%. ${record.concept.passed ? "Concept threshold met." : "Threshold not yet met."}`;
    setText("conceptSummary", conceptSummary);

    if (session.lab) {
      setHtml("lab", `<div class="notice"><strong>Assigned laboratory:</strong> ${UTILS.esc(session.lab)}. <a href="labs/">Open lab registry</a>.</div>`);
    } else {
      setHtml("lab", "");
    }

    const prevDay = day > 1
      ? `lesson.html?week=${week}&day=${day - 1}`
      : (week > 1 ? `lesson.html?week=${week - 1}&day=5` : "index.html");

    const nextDay = day < 5
      ? `lesson.html?week=${week}&day=${day + 1}`
      : (week < 36 ? `lesson.html?week=${week + 1}&day=1` : "assessments/");

    const prev = document.getElementById("prev");
    const next = document.getElementById("next");
    if (prev) prev.href = prevDay;
    if (next) next.href = nextDay;

    renderMastery();
    MENTOR.buildContext(session, state, window.KHAEMENES_MATH_CONTEXT || null);
  }

  document.getElementById("pathway")?.addEventListener("change", event => {
    STORAGE.setPathway(event.target.value);
    render();
  });

  document.getElementById("askMentor")?.addEventListener("click", () => {
    setText("mentorText", MENTOR.mentorMessage(session, state.pathway));
  });

  document.getElementById("saveReflection")?.addEventListener("click", () => {
    record.reflection = document.getElementById("reflection").value.trim();
    STORAGE.save();
    render();
    setText("status", "Reflection saved locally in the V2 learner record.");
  });

  document.getElementById("saveEvidence")?.addEventListener("click", () => {
    record.proof.evidence = document.getElementById("evidenceNote").value.trim();
    record.proof.submitted = Boolean(record.proof.evidence);
    record.proof.status = record.proof.submitted ? "submitted-unreviewed" : "not-submitted";
    STORAGE.save();
    render();
    setText("status", record.proof.submitted
      ? "Written evidence saved. It remains unreviewed and is not automatically treated as proof mastery."
      : "Written evidence cleared.");
  });

  document.getElementById("exportRecord")?.addEventListener("click", () => {
    MENTOR.buildContext(session, state, window.KHAEMENES_MATH_CONTEXT || null);
    UTILS.downloadJson(`${session.id}-scholar-record-v2.json`, {
      ...STORAGE.exportRecord(),
      currentContext: window.ARCHAEMENES_LEARNING_CONTEXT
    });
  });

  window.KHAEMENES_CURRENT_SESSION = session;
  window.KHAEMENES_RENDER_LESSON = render;
  render();
})();
