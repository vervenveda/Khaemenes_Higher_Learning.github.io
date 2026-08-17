"use strict";
(function () {
  const DATA = window.KHAE_ADVANCED_COURSE_DATA;
  const STORAGE = window.KHAEMENES_STORAGE;
  const MASTERY = window.KHAEMENES_MASTERY;
  const UTILS = window.KHAEMENES_UTILS;

  const grid = document.getElementById("weeks");
  if (!grid || !DATA?.weeks) return;

  const state = STORAGE.getState();

  function weekProgress(weekNumber) {
    const sessions = DATA.sessions.filter(s => s.week === weekNumber);
    const records = sessions.map(s => state.sessions[s.id]).filter(Boolean);
    const viewed = records.filter(r => r.viewed).length;
    const mastered = records.filter(r => MASTERY.status(r) === "mastered").length;
    return { total: sessions.length || 5, viewed, mastered };
  }

  grid.innerHTML = DATA.weeks.map(week => {
    const progress = weekProgress(week.week);
    return `
      <article class="card week">
        <span class="pill">Week ${week.week}</span>
        <span class="pill">Unit ${week.unit}</span>
        <h3>${UTILS.esc(week.topic)}</h3>
        <p class="meta">${UTILS.esc(week.unit_title)}</p>
        <p class="meta">Lab: ${UTILS.esc(week.lab || "No dedicated lab")}</p>
        <p class="meta">Viewed: ${progress.viewed}/${progress.total} · Mastered: ${progress.mastered}/${progress.total}</p>
        <a class="btn" href="lesson.html?week=${week.week}&day=1">${progress.viewed ? "Continue Week" : "Open Week"}</a>
      </article>`;
  }).join("");
})();
