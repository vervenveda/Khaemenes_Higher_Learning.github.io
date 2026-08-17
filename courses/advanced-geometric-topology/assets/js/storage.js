"use strict";
(function () {
  const COURSE_ID = "KH-HL-AGTGMP";
  const KEY_V1 = "khaemenes-hl-agtgmp-progress-v1";
  const KEY_V2 = "khaemenes-hl-agtgmp-progress-v2";
  const SCHEMA_VERSION = 2;

  function emptyState() {
    return {
      schemaVersion: SCHEMA_VERSION,
      courseId: COURSE_ID,
      pathway: "Core",
      learner: {},
      sessions: {},
      units: {},
      exams: {},
      capstone: {},
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        migratedFrom: null
      }
    };
  }

  function normaliseSession(raw) {
    const session = raw && typeof raw === "object" ? raw : {};
    return {
      viewed: Boolean(session.viewed),
      concept: {
        score: Number.isFinite(Number(session.concept?.score)) ? Number(session.concept.score) : null,
        passed: Boolean(session.concept?.passed),
        attempts: Array.isArray(session.concept?.attempts) ? session.concept.attempts : []
      },
      practice: {
        completed: Boolean(session.practice?.completed),
        responses: session.practice?.responses && typeof session.practice.responses === "object"
          ? session.practice.responses : {}
      },
      proof: {
        submitted: Boolean(session.proof?.submitted),
        reviewed: Boolean(session.proof?.reviewed),
        status: session.proof?.status || "not-submitted",
        evidence: String(session.proof?.evidence || "")
      },
      lab: {
        required: Boolean(session.lab?.required),
        completed: Boolean(session.lab?.completed),
        evidence: String(session.lab?.evidence || "")
      },
      correction: {
        required: Boolean(session.correction?.required),
        completed: Boolean(session.correction?.completed)
      },
      reflection: String(session.reflection || ""),
      mastery: {
        conceptual: Boolean(session.mastery?.conceptual),
        proof: Boolean(session.mastery?.proof),
        lab: Boolean(session.mastery?.lab),
        correction: Boolean(session.mastery?.correction),
        defense: Boolean(session.mastery?.defense),
        overall: Boolean(session.mastery?.overall)
      }
    };
  }

  function normaliseState(raw) {
    const state = emptyState();
    if (!raw || typeof raw !== "object") return state;

    state.pathway = ["Foundation", "Core", "Research"].includes(raw.pathway) ? raw.pathway : "Core";
    state.learner = raw.learner && typeof raw.learner === "object" ? raw.learner : {};
    state.units = raw.units && typeof raw.units === "object" ? raw.units : {};
    state.exams = raw.exams && typeof raw.exams === "object" ? raw.exams : {};
    state.capstone = raw.capstone && typeof raw.capstone === "object" ? raw.capstone : {};
    state.metadata = {
      ...state.metadata,
      ...(raw.metadata && typeof raw.metadata === "object" ? raw.metadata : {})
    };

    if (raw.sessions && typeof raw.sessions === "object") {
      Object.entries(raw.sessions).forEach(([id, value]) => {
        state.sessions[id] = normaliseSession(value);
      });
    }
    return state;
  }

  function migrateV1(v1) {
    const state = emptyState();
    state.pathway = ["Foundation", "Core", "Research"].includes(v1?.pathway) ? v1.pathway : "Core";
    state.metadata.migratedFrom = KEY_V1;

    const ids = new Set([
      ...Object.keys(v1?.scores || {}),
      ...Object.keys(v1?.reflections || {}),
      ...Object.keys(v1?.evidence || {}),
      ...(Array.isArray(v1?.completed) ? v1.completed : [])
    ]);

    ids.forEach(id => {
      const scoreRaw = Number(v1?.scores?.[id]);
      const score = Number.isFinite(scoreRaw) ? scoreRaw : null;
      const record = normaliseSession();
      record.viewed = true;
      record.concept.score = score;
      record.concept.passed = score !== null && score >= 80;
      record.reflection = String(v1?.reflections?.[id] || "");
      record.proof.evidence = String(v1?.evidence?.[id] || "");
      record.proof.submitted = Boolean(record.proof.evidence);
      record.proof.status = record.proof.submitted ? "submitted-unreviewed" : "not-submitted";
      state.sessions[id] = record;
    });

    return state;
  }

  function parseStorage(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn("Could not parse learner record:", key, error);
      return null;
    }
  }

  let state;
  const existingV2 = parseStorage(KEY_V2);
  if (existingV2) {
    state = normaliseState(existingV2);
  } else {
    const existingV1 = parseStorage(KEY_V1);
    state = existingV1 ? migrateV1(existingV1) : emptyState();
  }

  function save() {
    state.metadata.updatedAt = new Date().toISOString();
    localStorage.setItem(KEY_V2, JSON.stringify(state));
  }

  function getState() {
    return state;
  }

  function ensureSession(sessionId, options = {}) {
    if (!state.sessions[sessionId]) {
      state.sessions[sessionId] = normaliseSession();
    }
    if (options.labRequired !== undefined) {
      state.sessions[sessionId].lab.required = Boolean(options.labRequired);
    }
    return state.sessions[sessionId];
  }

  function setPathway(pathway) {
    if (["Foundation", "Core", "Research"].includes(pathway)) {
      state.pathway = pathway;
      save();
    }
  }

  function exportRecord() {
    return {
      exportedAt: new Date().toISOString(),
      schemaVersion: SCHEMA_VERSION,
      courseId: COURSE_ID,
      state
    };
  }

  function resetV2() {
    state = emptyState();
    save();
  }

  save();

  window.KHAEMENES_STORAGE = Object.freeze({
    COURSE_ID,
    KEY_V1,
    KEY_V2,
    SCHEMA_VERSION,
    getState,
    save,
    ensureSession,
    setPathway,
    exportRecord,
    resetV2
  });
})();
