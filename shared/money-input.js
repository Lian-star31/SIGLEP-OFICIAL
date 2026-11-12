/* SIGLEP — Campos monetarios de las calculadoras.
 * Mismo comportamiento que Liquidación Laboral (shared/labor-calculator.js): captura libre de dígitos y punto decimal;
 * al salir del campo se muestra con signo, separadores de miles y dos decimales ($15,000.00); al volver a enfocarlo
 * se muestra el número limpio para editarlo. Sólo afecta a los campos marcados con data-money-input="true".
 * window.SIGLEP_parseMoney(valor) devuelve el número (o NaN) para los cálculos.
 */
(function () {
  'use strict';
  var currency = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function normalize(value) {
    var raw = String(value || '').trim();
    if (!raw) return '';
    var negative = raw.charAt(0) === '-' ? '-' : '';
    var n = raw.replace(/-/g, '').replace(/,/g, '').replace(/[^\d.]/g, '');
    if (!n) return '';
    var parts = n.split('.');
    if (parts.length > 2) n = parts.shift() + '.' + parts.join('');
    return negative + n;
  }
  function parse(value) {
    var n = normalize(value);
    if (!n || n === '-' || n === '.' || n === '-.') return NaN;
    var v = Number(n);
    return isFinite(v) ? v : NaN;
  }
  function format(value) {
    var v = parse(value);
    return isNaN(v) ? '' : currency.format(v);
  }

  function install(field) {
    if (field.dataset.moneyMask === '1') return;
    field.dataset.moneyMask = '1';
    field.addEventListener('focus', function () { var v = parse(field.value); field.value = isNaN(v) ? '' : String(v); });
    field.addEventListener('input', function () { var s = normalize(field.value); if (field.value !== s) field.value = s; });
    var fmt = function () { if (document.activeElement !== field) field.value = format(field.value); };
    field.addEventListener('blur', fmt);
    field.addEventListener('change', fmt);
    if (field.value) field.value = format(field.value);
  }

  function init() {
    // Las calculadoras laborales ya instalan esta misma máscara en shared/labor-calculator.js.
    if (document.querySelector('script[src*="labor-calculator"]')) return;
    document.querySelectorAll('input[data-money-input="true"]').forEach(install);
  }

  window.SIGLEP_parseMoney = parse;
  window.SIGLEP_formatMoney = format;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
