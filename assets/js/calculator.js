/* Appliance Energy Calculator — vanilla JavaScript, no libraries.
   Reads user input from the DOM, validates it, calculates consumption and
   cost, then updates the results panel in place. */

(function () {
  'use strict';

  var DAYS_PER_MONTH = 30.44;
  var DAYS_PER_YEAR = 365;
  var STORAGE_KEY = 'applianceEnergyCalculator';

  var form = document.getElementById('calc-form');
  if (!form) return;

  var modelSelect = document.getElementById('calc-model');
  var wattsInput = document.getElementById('calc-watts');
  var hoursInput = document.getElementById('calc-hours');
  var priceInput = document.getElementById('calc-price');

  var statusBox = document.getElementById('calc-status');
  var resultsList = document.getElementById('calc-output');

  var output = {
    daily: document.getElementById('out-daily'),
    monthly: document.getElementById('out-monthly'),
    yearly: document.getElementById('out-yearly'),
    costMonthly: document.getElementById('out-cost-monthly'),
    costYearly: document.getElementById('out-cost-yearly')
  };

  var rules = [
    { input: wattsInput, error: 'err-watts', label: 'Power rating', unit: 'watts', min: 1, max: 10000 },
    { input: hoursInput, error: 'err-hours', label: 'Hours of use per day', unit: 'hours', min: 0, max: 24 },
    { input: priceInput, error: 'err-price', label: 'Electricity price', unit: 'cents per kWh', min: 0.1, max: 200 }
  ];

  var currency = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' });

  function formatKwh(value) {
    var decimals = value < 10 ? 2 : 1;
    return value.toLocaleString('en-AU', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }) + ' kWh';
  }

  function checkField(rule) {
    var raw = rule.input.value.trim();

    if (raw === '') {
      return 'Please enter a value for ' + rule.label.toLowerCase() + '.';
    }

    var value = Number(raw);

    if (!isFinite(value)) {
      return rule.label + ' must be a number.';
    }
    if (value < rule.min || value > rule.max) {
      return rule.label + ' must be between ' + rule.min + ' and ' + rule.max + ' ' + rule.unit + '.';
    }
    return '';
  }

  function showFieldError(rule, message) {
    var slot = document.getElementById(rule.error);

    slot.textContent = message;
    slot.classList.toggle('is-visible', message !== '');

    if (message) {
      rule.input.setAttribute('aria-invalid', 'true');
    } else {
      rule.input.removeAttribute('aria-invalid');
    }
  }

  function setStatus(message, state) {
    statusBox.textContent = message;
    statusBox.classList.remove('is-error', 'is-ok');
    if (state) statusBox.classList.add(state);
  }

  function saveInputs() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        model: modelSelect.value,
        watts: wattsInput.value,
        hours: hoursInput.value,
        price: priceInput.value
      }));
    } catch (err) {
      /* Storage can be unavailable in private browsing — the calculator still works. */
    }
  }

  function restoreInputs() {
    try {
      var saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
      if (!saved) return;

      if (saved.model) modelSelect.value = saved.model;
      if (saved.watts) wattsInput.value = saved.watts;
      if (saved.hours) hoursInput.value = saved.hours;
      if (saved.price) priceInput.value = saved.price;
    } catch (err) {
      /* Ignore unreadable or corrupted saved data and keep the HTML defaults. */
    }
  }

  function calculate(showErrors) {
    var messages = [];

    rules.forEach(function (rule) {
      var message = checkField(rule);
      if (message) messages.push(message);
      showFieldError(rule, showErrors ? message : '');
    });

    if (messages.length > 0) {
      resultsList.hidden = true;
      setStatus(
        showErrors
          ? 'Could not calculate: ' + messages[0]
          : 'Enter your appliance details, then select Calculate.',
        showErrors ? 'is-error' : null
      );
      return;
    }

    var watts = Number(wattsInput.value);
    var hours = Number(hoursInput.value);
    var centsPerKwh = Number(priceInput.value);

    var dailyKwh = (watts / 1000) * hours;
    var monthlyKwh = dailyKwh * DAYS_PER_MONTH;
    var yearlyKwh = dailyKwh * DAYS_PER_YEAR;
    var dollarsPerKwh = centsPerKwh / 100;

    output.daily.textContent = formatKwh(dailyKwh);
    output.monthly.textContent = formatKwh(monthlyKwh);
    output.yearly.textContent = formatKwh(yearlyKwh);
    output.costMonthly.textContent = currency.format(monthlyKwh * dollarsPerKwh);
    output.costYearly.textContent = currency.format(yearlyKwh * dollarsPerKwh);

    resultsList.hidden = false;
    setStatus(
      'Based on ' + watts + ' W running ' + hours + ' hour(s) a day at ' + centsPerKwh + 'c/kWh.',
      'is-ok'
    );
    saveInputs();
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    calculate(true);
  });

  form.addEventListener('reset', function () {
    window.setTimeout(function () {
      rules.forEach(function (rule) { showFieldError(rule, ''); });
      resultsList.hidden = true;
      setStatus('Enter your appliance details, then select Calculate.', null);
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        /* Nothing to clear when storage is unavailable. */
      }
    }, 0);
  });

  /* Picking a model fills in its known wattage. Setting .value in script does
     not fire an input event, so this will not fight the listener below. */
  modelSelect.addEventListener('change', function () {
    var option = modelSelect.options[modelSelect.selectedIndex];
    var watts = option.getAttribute('data-watts');

    if (watts) {
      wattsInput.value = watts;
      calculate(true);
    }
  });

  /* Typing a wattage by hand means the user is no longer on a listed model. */
  wattsInput.addEventListener('input', function () {
    modelSelect.value = 'custom';
  });

  rules.forEach(function (rule) {
    rule.input.addEventListener('input', function () { calculate(false); });
    rule.input.addEventListener('blur', function () {
      showFieldError(rule, checkField(rule));
    });
  });

  restoreInputs();
  calculate(false);
})();
