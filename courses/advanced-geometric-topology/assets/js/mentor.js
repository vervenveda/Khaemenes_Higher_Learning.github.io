"use strict";
(function () {
  function mentorMessage(session, pathway) {
    const prompts = Array.isArray(session?.mentor_prompts)
      ? session.mentor_prompts
      : [
          "Name the mathematical objects involved.",
          "State the hypotheses before using a theorem.",
          "What evidence would distinguish an example from a proof?"
        ];

    let lead;
    if (pathway === "Foundation") {
      lead = "We will reduce the abstraction, not the standard. Recover the prerequisite objects first.";
    } else if (pathway === "Research") {
      lead = "Treat this as a seminar problem. Map theorem dependencies and decide what evidence would settle the claim.";
    } else {
      lead = "Name the objects, hypotheses, and target conclusion. Work from definitions before choosing a procedure.";
    }

    return `${lead}\n\nArchaemenes asks:\n• ${prompts.slice(0, 3).join("\n• ")}`;
  }

  function buildContext(session, state, mathematics) {
    const record = window.KHAEMENES_STORAGE.ensureSession(session.id, {
      labRequired: Boolean(session.lab)
    });

    const context = {
      mentor: "Archaemenes",
      expression: "Scholar",
      course: window.KHAEMENES_STORAGE.COURSE_ID,
      unit: session.unit,
      week: session.week,
      day: session.day,
      sessionId: session.id,
      topic: session.topic,
      pathway: state.pathway,
      objectives: session.objectives || [],
      evidenceRequired: session.evidence || [],
      conceptScore: record.concept.score,
      reflection: record.reflection,
      mastery: record.mastery,
      teachingPolicy: [
        "clue-first",
        "why-before-procedure",
        "respect learner voice",
        "proof-aware",
        "evidence-labeled-honestly"
      ],
      mathematics: mathematics || null
    };

    window.ARCHAEMENES_LEARNING_CONTEXT = context;
    return context;
  }

  window.KHAEMENES_MENTOR = Object.freeze({
    mentorMessage,
    buildContext
  });
})();
