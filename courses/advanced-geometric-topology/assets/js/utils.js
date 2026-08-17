"use strict";
(function () {
  const Utils = {
    esc(value) {
      return String(value ?? "").replace(/[&<>"']/g, ch => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[ch] || ch));
    },

    clamp(value, min, max) {
      const n = Number(value);
      if (!Number.isFinite(n)) return min;
      return Math.min(max, Math.max(min, n));
    },

    safeUrl(value) {
      try {
        const url = new URL(value, location.href);
        return /^https?:$/.test(url.protocol) ? url.href : "";
      } catch {
        return "";
      }
    },

    deepClone(value) {
      return JSON.parse(JSON.stringify(value));
    },

    downloadJson(filename, payload) {
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const anchor = document.createElement("a");
      const url = URL.createObjectURL(blob);
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 750);
    },

    getQueryInt(name, fallback, min, max) {
      const params = new URLSearchParams(location.search);
      return Utils.clamp(params.get(name) ?? fallback, min, max);
    }
  };

  window.KHAEMENES_UTILS = Object.freeze(Utils);
})();
