'use strict';
(() => {
  const printButton = document.getElementById('printLesson');
  if (printButton) {
    printButton.addEventListener('click', () => window.print());
  }
})();
