"use strict";
(function () {
  const STORAGE = window.KHAEMENES_STORAGE;
  const MASTERY = window.KHAEMENES_MASTERY;

  function recordObjectiveAttempt(sessionId, result) {
    const record = STORAGE.ensureSession(sessionId);
    const score = Number(result?.score);
    if (!Number.isFinite(score) || score < 0 || score > 100) {
      throw new Error("Assessment score must be between 0 and 100.");
    }

    const attempt = {
      attemptedAt: new Date().toISOString(),
      score: Math.round(score * 10) / 10,
      correct: Number(result?.correct) || null,
      total: Number(result?.total) || null,
      assessmentId: String(result?.assessmentId || `${sessionId}-concept`)
    };

    record.concept.attempts.push(attempt);
    record.concept.score = attempt.score;
    MASTERY.recalculate(record);
    STORAGE.save();
    return attempt;
  }

  function getBestScore(sessionId) {
    const record = STORAGE.ensureSession(sessionId);
    const scores = record.concept.attempts
      .map(a => Number(a.score))
      .filter(Number.isFinite);
    return scores.length ? Math.max(...scores) : record.concept.score;
  }

  function hasAssessment(sessionId) {
    return Boolean(
      window.KHAEMENES_ASSESSMENTS &&
      window.KHAEMENES_ASSESSMENTS[sessionId]
    );
  }

  window.KHAEMENES_ASSESSMENT_ENGINE = Object.freeze({
    recordObjectiveAttempt,
    getBestScore,
    hasAssessment
  });
})();
