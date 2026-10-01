/* Shared behaviour for every page: footer year + FAQ accordion. */

(function () {
  'use strict';

  function setFooterYear() {
    var slot = document.getElementById('year');
    if (slot) slot.textContent = String(new Date().getFullYear());
  }

  function initAccordion() {
    var questions = document.querySelectorAll('.faq__question');

    Array.prototype.forEach.call(questions, function (button) {
      var panel = document.getElementById(button.getAttribute('aria-controls'));
      if (!panel) return;

      button.setAttribute('aria-expanded', 'false');
      panel.hidden = true;

      button.addEventListener('click', function () {
        var isOpen = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!isOpen));
        panel.hidden = isOpen;
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setFooterYear();
    initAccordion();
  });
})();
