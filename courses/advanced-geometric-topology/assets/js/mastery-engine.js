"use strict";
(function () {
  const THRESHOLD = 80;

  function recalculate(record) {
    if (!record) return null;

    const conceptScore = Number(record.concept?.score);
    record.mastery.conceptual = Number.isFinite(conceptScore) && conceptScore >= THRESHOLD;
    record.concept.passed = record.mastery.conceptual;

    record.mastery.proof = Boolean(record.proof?.reviewed && record.proof?.status === "approved");
    record.mastery.lab = !record.lab?.required || Boolean(record.lab?.completed);
    record.mastery.correction = !record.correction?.required || Boolean(record.correction?.completed);

    record.mastery.overall = Boolean(
      record.mastery.conceptual &&
      record.mastery.proof &&
      record.mastery.lab &&
      record.mastery.correction &&
      record.mastery.defense
    );

    return record.mastery;
  }

  function status(record) {
    recalculate(record);
    if (record.mastery.overall) return "mastered";
    if (record.mastery.conceptual) return "concept-threshold-met";
    if (record.viewed) return "in-progress";
    return "not-started";
  }

  window.KHAEMENES_MASTERY = Object.freeze({
    THRESHOLD,
    recalculate,
    status
  });
})();
