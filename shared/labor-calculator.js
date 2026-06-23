(function () {
  'use strict';

  const calcMeta = window.__SIGLEP_CALC_META__ || {};
  const formulaKey = String(calcMeta.formulaKey || '');
  if (!formulaKey.startsWith('labor-')) return;

  const form = document.getElementById('calc-form');
  const resultAmount = document.getElementById('resultAmount');
  const resultBreakdown = document.getElementById('resultBreakdown');
  const resultNote = document.querySelector('.result-note');
  const defaultResultNote = resultNote ? resultNote.textContent : '';
  const legalBasisList = document.getElementById('legalBasisList');
  const resetButton = document.getElementById('resetCalcButton');
  if (!form || !resultAmount || !resultBreakdown || !legalBasisList) return;

  const LABOR_2026 = {
    salaryMinGeneral: 315.04,
    salaryMinFrontier: 440.87,
    umaDaily: 117.31,
    isrWeeklyTable: [
      { lower: 0.01, upper: 194.46, fixed: 0, rate: 0.0192 },
      { lower: 194.47, upper: 1650.67, fixed: 3.71, rate: 0.064 },
      { lower: 1650.68, upper: 2900.87, fixed: 96.95, rate: 0.1088 },
      { lower: 2900.88, upper: 3372.11, fixed: 232.96, rate: 0.16 },
      { lower: 3372.12, upper: 4037.32, fixed: 308.35, rate: 0.1792 },
      { lower: 4037.33, upper: 8142.75, fixed: 427.56, rate: 0.2136 },
      { lower: 8142.76, upper: 12834.08, fixed: 1304.45, rate: 0.2352 },
      { lower: 12834.09, upper: 24502.45, fixed: 2407.86, rate: 0.3 },
      { lower: 24502.46, upper: 32669.91, fixed: 5908.35, rate: 0.32 },
      { lower: 32669.92, upper: 98009.66, fixed: 8521.94, rate: 0.34 },
      { lower: 98009.67, upper: Infinity, fixed: 30737.49, rate: 0.35 },
    ],
  };

  const currency = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const decimals = new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function findField(id) {
    return document.getElementById(id);
  }

  function readValue(id) {
    const field = findField(id);
    return field ? String(field.value || '').trim() : '';
  }

  function readNumber(id) {
    const raw = readValue(id)
      .replace(/\s+/g, '')
      .replace(/\.(?=.*\.)/g, '')
      .replace(',', '.');
    if (!raw) return 0;
    const value = Number(raw);
    return Number.isFinite(value) ? value : 0;
  }

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function addYears(date, years) {
    const target = new Date(date.getFullYear() + years, date.getMonth(), date.getDate());
    if (target.getMonth() !== date.getMonth()) {
      target.setDate(0);
    }
    return startOfDay(target);
  }

  function parseDateInput(value) {
    if (!value) return null;
    const normalized = value.trim();
    let day;
    let month;
    let year;

    if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
      const parts = normalized.split('-').map(Number);
      year = parts[0];
      month = parts[1];
      day = parts[2];
    } else {
      const match = normalized.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
      if (!match) return null;
      day = Number(match[1]);
      month = Number(match[2]);
      year = Number(match[3]);
    }

    const parsed = new Date(year, month - 1, day);
    if (
      parsed.getFullYear() !== year ||
      parsed.getMonth() !== month - 1 ||
      parsed.getDate() !== day
    ) {
      return null;
    }

    return startOfDay(parsed);
  }

  function daysBetween(start, end, inclusive) {
    if (!(start instanceof Date) || !(end instanceof Date)) return null;
    const diff = startOfDay(end) - startOfDay(start);
    if (!Number.isFinite(diff) || diff < 0) return null;
    const days = Math.round(diff / 86400000);
    return inclusive ? days + 1 : days;
  }

  function completedServiceYears(start, end) {
    let years = end.getFullYear() - start.getFullYear();
    if (addYears(start, years) > end) {
      years -= 1;
    }
    return Math.max(0, years);
  }

  function vacationDaysForYear(yearNumber) {
    if (yearNumber <= 0) return 0;
    if (yearNumber <= 5) return 10 + yearNumber * 2;
    return 20 + Math.floor((yearNumber - 1) / 5) * 2;
  }

  function getCurrentServiceCycle(start, end) {
    const fullYears = completedServiceYears(start, end);
    const cycleStart = addYears(start, fullYears);
    const nextCycleStart = addYears(start, fullYears + 1);
    const cycleWorkedDays = daysBetween(cycleStart, end, true) || 0;
    const cycleLengthDays = daysBetween(cycleStart, nextCycleStart, false) || 365;
    return {
      fullYears,
      cycleWorkedDays,
      cycleLengthDays,
      entitlementDays: vacationDaysForYear(fullYears + 1),
    };
  }

  function getDaysWorkedInCalendarYear(start, end) {
    const yearStart = new Date(end.getFullYear(), 0, 1);
    const effectiveStart = start > yearStart ? start : yearStart;
    return daysBetween(effectiveStart, end, true) || 0;
  }

  function daysInYear(year) {
    return new Date(year, 1, 29).getMonth() === 1 ? 366 : 365;
  }

  function calculateIsr(income, table) {
    if (!Number.isFinite(income) || income <= 0) return 0;
    const bracket = table.find((entry) => income >= entry.lower && income <= entry.upper) || table[table.length - 1];
    return bracket.fixed + (income - bracket.lower) * bracket.rate;
  }

  function getDailySalary() {
    if (findField('salario_diario') && !findField('modo_salario')) {
      return readNumber('salario_diario');
    }
    if (findField('salario_mensual') && !findField('modo_salario')) {
      return readNumber('salario_mensual') / 30;
    }

    const salary = readNumber('salario_base');
    const mode = readValue('modo_salario') || 'mensual';
    return mode === 'diario' ? salary : salary / 30;
  }

  function getSalaryLabel() {
    const mode = readValue('modo_salario') || 'mensual';
    return mode === 'diario' ? 'Salario diario de referencia' : 'Salario mensual de referencia';
  }

  function getTerminationType() {
    return readValue('terminacion') || 'renuncia';
  }

  function getMinimumSalaryZone() {
    return readValue('zona_salario_minimo') === 'frontera'
      ? LABOR_2026.salaryMinFrontier
      : LABOR_2026.salaryMinGeneral;
  }

  function renderRows(rows) {
    return rows
      .map(function (row) {
        return '<div class="breakdown-row"><span>' + escapeHtml(row.label) + '</span><strong>' + escapeHtml(row.value) + '</strong></div>';
      })
      .join('');
  }

  function setLegalBasis(items) {
    if (!items.length) {
      legalBasisList.innerHTML = '<li>Completa la simulacion para ver los articulos aplicados.</li>';
      return;
    }
    legalBasisList.innerHTML = items.map(function (item) {
      return '<li>' + escapeHtml(item) + '</li>';
    }).join('');
  }

  function setResult(total, rows, legalBasis, noteOverride) {
    resultAmount.textContent = Number.isFinite(total) && total > 0 ? currency.format(total) : '$0 MXN';
    resultBreakdown.innerHTML = renderRows(rows);
    setLegalBasis(legalBasis);
    if (resultNote) {
      resultNote.textContent = noteOverride || defaultResultNote;
    }
  }

  function renderValidation(message) {
    setResult(0, [{ label: 'Revision requerida', value: message }], [], defaultResultNote);
  }

  function renderEmpty() {
    resultAmount.textContent = '$0 MXN';
    resultBreakdown.innerHTML = '';
    setLegalBasis([]);
    if (resultNote) {
      resultNote.textContent = defaultResultNote;
    }
  }

  function clearLaborForm() {
    form.reset();
    Array.prototype.forEach.call(form.elements, function (element) {
      if (!element || !element.tagName) return;
      if (element.tagName === 'INPUT') {
        element.value = '';
      } else if (element.tagName === 'SELECT') {
        element.selectedIndex = 0;
      }
    });
    renderEmpty();
  }

  function buildTerminationLegalBasis(type) {
    if (type === 'injustificado') {
      return [
        'LFT: articulos 48 y 50 para indemnizacion constitucional.',
        'LFT: articulo 162 para prima de antiguedad topada a dos salarios minimos 2026.',
        'LFT: articulos 76, 80 y 87 para vacaciones, prima vacacional y aguinaldo proporcionales.',
      ];
    }

    return [
      'LFT: articulos 76, 80 y 87 para vacaciones, prima vacacional y aguinaldo proporcionales.',
    ];
  }

  function calculateSeparationCompensation() {
    const dailySalary = getDailySalary();
    const start = parseDateInput(readValue('fecha_ingreso'));
    const end = parseDateInput(readValue('fecha_terminacion'));
    const terminationType = getTerminationType();

    if (!Number.isFinite(dailySalary) || dailySalary <= 0) {
      renderValidation('Captura un salario valido para calcular la estimacion.');
      return;
    }
    if (!start || !end) {
      renderValidation('Captura fechas validas en formato DD/MM/AAAA.');
      return;
    }

    const serviceDays = daysBetween(start, end, true);
    if (!serviceDays) {
      renderValidation('La fecha de terminacion debe ser igual o posterior a la fecha de ingreso.');
      return;
    }

    const serviceYears = serviceDays / 365.2425;
    const cycle = getCurrentServiceCycle(start, end);
    const vacationDays = cycle.entitlementDays * (cycle.cycleWorkedDays / cycle.cycleLengthDays);
    const vacationPay = dailySalary * vacationDays;
    const vacationPremium = vacationPay * 0.25;
    const workedDaysThisYear = getDaysWorkedInCalendarYear(start, end);
    const aguinaldoDays = 15 * (workedDaysThisYear / daysInYear(end.getFullYear()));
    const aguinaldoPay = dailySalary * aguinaldoDays;

    const rows = [
      { label: getSalaryLabel(), value: currency.format((readValue('modo_salario') || 'mensual') === 'diario' ? dailySalary : dailySalary * 30) },
      { label: 'Salario diario calculado', value: currency.format(dailySalary) },
      { label: 'Antiguedad exacta', value: serviceDays + ' dias (' + decimals.format(serviceYears) + ' anos)' },
      { label: 'Aguinaldo proporcional (15 dias minimos)', value: currency.format(aguinaldoPay) },
      { label: 'Vacaciones proporcionales (' + decimals.format(vacationDays) + ' dias)', value: currency.format(vacationPay) },
      { label: 'Prima vacacional 25%', value: currency.format(vacationPremium) },
    ];

    let total = aguinaldoPay + vacationPay + vacationPremium;
    let note = 'La cifra es una referencia bruta con base en salario y fechas capturadas.';

    if (terminationType === 'injustificado') {
      const constitutionalIndemnity = dailySalary * 90;
      const cappedDaily = Math.min(dailySalary, getMinimumSalaryZone() * 2);
      const seniorityDays = (serviceDays / 365) * 12;
      const seniorityBonus = cappedDaily * seniorityDays;

      rows.push({ label: 'Indemnizacion constitucional (3 meses)', value: currency.format(constitutionalIndemnity) });
      rows.push({ label: 'Prima de antiguedad (' + decimals.format(seniorityDays) + ' dias)', value: currency.format(seniorityBonus) });
      total += constitutionalIndemnity + seniorityBonus;
      note = 'La cifra es una referencia bruta. El tratamiento fiscal del despido puede variar segun el caso concreto.';
    }

    setResult(total, rows, buildTerminationLegalBasis(terminationType), note);
  }

  function calculateExtraHours() {
    const dailySalary = getDailySalary();
    const extraHours = readNumber('horas_extras_semana') || readNumber('horas_extras');
    const shiftType = readValue('tipo_jornada') || 'diurna';
    const shiftHours = {
      diurna: 8,
      nocturna: 7,
      mixta: 7.5,
    };
    const ordinaryHours = shiftHours[shiftType] || 8;

    if (!Number.isFinite(dailySalary) || dailySalary <= 0) {
      renderValidation('Captura un salario mensual o diario valido.');
      return;
    }
    if (!Number.isFinite(extraHours) || extraHours <= 0) {
      renderValidation('Captura las horas extra realmente laboradas durante la semana.');
      return;
    }

    const hourlyRate = dailySalary / ordinaryHours;
    const doubleHours = Math.min(9, extraHours);
    const tripleHours = Math.max(0, extraHours - 9);
    const doublePay = doubleHours * hourlyRate * 2;
    const triplePay = tripleHours * hourlyRate * 3;
    const grossTotal = doublePay + triplePay;
    const exemptEstimate = Math.min(grossTotal * 0.5, LABOR_2026.umaDaily * 5);
    const taxableEstimate = Math.max(0, grossTotal - exemptEstimate);
    const baseWeeklySalary = dailySalary * 7;
    const estimatedIsr = Math.max(
      0,
      calculateIsr(baseWeeklySalary + taxableEstimate, LABOR_2026.isrWeeklyTable) -
        calculateIsr(baseWeeklySalary, LABOR_2026.isrWeeklyTable),
    );
    const netEstimate = Math.max(0, grossTotal - estimatedIsr);

    setResult(
      grossTotal,
      [
        { label: getSalaryLabel(), value: currency.format((readValue('modo_salario') || 'mensual') === 'diario' ? dailySalary : dailySalary * 30) },
        { label: 'Valor de la hora ordinaria', value: currency.format(hourlyRate) },
        { label: 'Primeras 9 horas dobles', value: currency.format(doublePay) },
        { label: 'Horas excedentes triples', value: currency.format(triplePay) },
        { label: '50% exento estimado (tope 5 UMA 2026)', value: currency.format(exemptEstimate) },
        { label: 'ISR semanal estimado 2026', value: currency.format(estimatedIsr) },
        { label: 'Pago neto estimado', value: currency.format(netEstimate) },
      ],
      [
        'LFT: articulo 66 para limite extraordinario de jornada.',
        'LFT: articulo 67 para pago doble dentro del maximo legal.',
        'LFT: articulo 68 para pago triple por excedente de nueve horas semanales.',
      ],
      'La retencion de ISR es referencial y se muestra por separado; el monto principal refleja la prestacion bruta.'
    );
  }

  function calculateAguinaldo() {
    const dailySalary = getDailySalary();
    const start = parseDateInput(readValue('fecha_ingreso'));
    const end = parseDateInput(readValue('fecha_terminacion'));

    if (!Number.isFinite(dailySalary) || dailySalary <= 0) {
      renderValidation('Captura un salario mensual o diario valido.');
      return;
    }
    if (!start || !end) {
      renderValidation('Captura fechas validas en formato DD/MM/AAAA.');
      return;
    }

    const serviceDays = daysBetween(start, end, true);
    if (!serviceDays) {
      renderValidation('La fecha de terminacion debe ser igual o posterior a la fecha de ingreso.');
      return;
    }

    const workedDaysThisYear = getDaysWorkedInCalendarYear(start, end);
    const aguinaldoDays = 15 * (workedDaysThisYear / daysInYear(end.getFullYear()));
    const cycle = getCurrentServiceCycle(start, end);
    const vacationDays = cycle.entitlementDays * (cycle.cycleWorkedDays / cycle.cycleLengthDays);
    const vacationPay = dailySalary * vacationDays;
    const vacationPremium = vacationPay * 0.25;
    const aguinaldoPay = dailySalary * aguinaldoDays;

    setResult(
      aguinaldoPay + vacationPay + vacationPremium,
      [
        { label: getSalaryLabel(), value: currency.format((readValue('modo_salario') || 'mensual') === 'diario' ? dailySalary : dailySalary * 30) },
        { label: 'Salario diario calculado', value: currency.format(dailySalary) },
        { label: 'Aguinaldo proporcional', value: currency.format(aguinaldoPay) },
        { label: 'Vacaciones proporcionales (' + decimals.format(vacationDays) + ' dias)', value: currency.format(vacationPay) },
        { label: 'Prima vacacional 25%', value: currency.format(vacationPremium) },
      ],
      [
        'LFT: articulos 76, 80 y 87 para vacaciones, prima vacacional y aguinaldo proporcionales.',
      ],
      'La cifra es una referencia bruta con base en dias trabajados dentro del ano y del ciclo vacacional vigente.'
    );
  }

  function runCalculation() {
    if (formulaKey === 'labor-hours') {
      calculateExtraHours();
      return;
    }
    if (formulaKey === 'labor-aguinaldo') {
      calculateAguinaldo();
      return;
    }
    calculateSeparationCompensation();
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    runCalculation();
  });

  if (resetButton) {
    resetButton.addEventListener('click', function () {
      clearLaborForm();
    });
  }

  window.addEventListener('pageshow', function () {
    window.setTimeout(clearLaborForm, 0);
  });

  clearLaborForm();
  window.setTimeout(clearLaborForm, 0);
})();
