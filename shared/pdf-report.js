(function () {
  'use strict';

  var CALC_TITLES = {
    'labor-liquidation':     'Liquidación Laboral',
    'labor-finiquito':       'Finiquito Laboral',
    'labor-hours':           'Horas Extra',
    'labor-aguinaldo':       'Aguinaldo y Prima Vacacional',
    'labor-despido':         'Despido Injustificado',
    'civil-danos':           'Daños y Perjuicios',
    'civil-dano-moral':      'Daño Moral',
    'civil-intereses':       'Intereses Moratorios',
    'civil-responsabilidad': 'Responsabilidad Civil',
    'familiar-pension':      'Pensión Alimenticia',
    'familiar-divorcio':     'Divorcio',
    'familiar-custodia':     'Custodia de Menores',
    'familiar-herencia':     'Herencia y Sucesión',
    'familiar-regimen':      'Régimen Matrimonial',
    'familiar-sociedad':     'Liquidación de Sociedad Conyugal',
    'patrimonial-herencia':  'Herencia Patrimonial',
    'ss-pension-imss':       'Pensión IMSS',
    'ss-pension-issste':     'Pensión ISSSTE',
    'ss-pension-viudez':     'Pensión por Viudez',
    'ss-pension-invalidez':  'Pensión por Invalidez',
    'ss-modalidad-40':       'Modalidad 40',
  };

  function esc(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function getSalaryRange() {
    var ids = ['salario_base', 'salario_mensual', 'salario_diario'];
    var val = 0;
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el && el.value) {
        val = parseFloat(String(el.value).replace(/[,$\s]/g, '')) || 0;
        if (val > 0) break;
      }
    }
    if (val <= 0) return 'desconocido';
    if (val < 10000) return 'menos_10k';
    if (val < 20000) return '10k_20k';
    if (val < 40000) return '20k_40k';
    return 'mas_40k';
  }

  function buildBreakdownRows() {
    var container = document.getElementById('resultBreakdown');
    if (!container) return '';
    var html = '';
    container.querySelectorAll('.breakdown-row').forEach(function (row) {
      var label = (row.querySelector('span') || {}).textContent || '';
      var value = (row.querySelector('strong') || {}).textContent || '';
      html +=
        '<tr>'
        + '<td>' + esc(label) + '</td>'
        + '<td style="text-align:right;font-weight:600;color:#0F2240;">' + esc(value) + '</td>'
        + '</tr>';
    });
    return html;
  }

  function buildLegalItems() {
    var list = document.getElementById('legalBasisList');
    if (!list) return '';
    var html = '';
    list.querySelectorAll('li').forEach(function (li) {
      html += '<li>' + esc(li.textContent) + '</li>';
    });
    return html;
  }

  function buildReportHTML() {
    var meta      = window.__SIGLEP_CALC_META__ || {};
    var estado    = window.__SIGLEP_ESTADO_ACTIVO__;
    var monto     = (document.getElementById('resultAmount') || {}).textContent || '—';
    var title     = CALC_TITLES[meta.formulaKey] || 'Estimación Legal';
    var estadoTxt = estado ? estado.nombre : 'No especificado';
    var fecha     = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
    var rows      = buildBreakdownRows();
    var legal     = buildLegalItems();

    var css =
      '@page{size:letter;margin:8mm;}'
      + '*{margin:0;padding:0;box-sizing:border-box;}'
      + 'body{font-family:Arial,Helvetica,sans-serif;font-size:10px;color:#1A202C;background:#fff;}'
      + '@media print{-webkit-print-color-adjust:exact;print-color-adjust:exact;}'
      + '.hdr{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #C5A059;padding-bottom:5px;margin-bottom:7px;}'
      + '.brand{font-size:14px;font-weight:700;color:#0F2240;letter-spacing:0.06em;}'
      + '.brand-sub{font-size:7px;color:#718096;letter-spacing:0.1em;text-transform:uppercase;margin-top:2px;}'
      + '.doc-title{font-size:11px;font-weight:600;color:#C5A059;text-transform:uppercase;letter-spacing:0.08em;text-align:right;}'
      + '.doc-date{font-size:8px;color:#718096;margin-top:2px;text-align:right;}'
      + '.monto-box{background:#0F2240;border-radius:4px;padding:7px 12px;text-align:center;margin-bottom:7px;}'
      + '.monto-label{font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:#C5A059;}'
      + '.monto-value{font-size:16px;font-weight:700;color:#C5A059;margin-top:3px;}'
      + '.sec{margin-bottom:7px;}'
      + '.sec-lbl{font-size:8px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#C5A059;margin-bottom:3px;}'
      + '.grid{display:grid;grid-template-columns:1fr 1fr;gap:5px;}'
      + '.ibox{background:#F7FAFC;border:1px solid #E2E8F0;border-radius:3px;padding:4px 7px;}'
      + '.ilbl{font-size:7px;color:#718096;text-transform:uppercase;letter-spacing:0.08em;}'
      + '.ival{font-size:10px;font-weight:600;color:#0F2240;margin-top:2px;}'
      + 'table{width:100%;border-collapse:collapse;border:1px solid #E2E8F0;}'
      + 'thead{background:#0F2240;}'
      + 'thead th{padding:4px 8px;font-size:8px;letter-spacing:0.1em;text-transform:uppercase;color:#C5A059;text-align:left;}'
      + 'thead th:last-child{text-align:right;}'
      + 'tbody td{padding:4px 8px;font-size:10px;color:#2D3748;border-bottom:1px solid #E2E8F0;}'
      + 'tbody tr:last-child td{border-bottom:none;}'
      + '.lbox{padding:5px 9px;background:#FFFBF0;border:1px solid rgba(197,160,89,0.3);border-radius:3px;}'
      + '.lbox ul{padding-left:11px;}'
      + '.lbox li{font-size:8px;color:#4A5568;line-height:1.4;margin-bottom:1px;}'
      + '.disc{margin-top:7px;padding:5px 9px;background:#F7FAFC;border-left:2px solid #CBD5E0;font-size:8px;color:#718096;line-height:1.5;}'
      + '.ftr{margin-top:6px;padding-top:5px;border-top:1px solid #E2E8F0;display:flex;justify-content:space-between;font-size:7px;color:#A0AEC0;}';

    return '<!DOCTYPE html>'
      + '<html lang="es"><head><meta charset="UTF-8">'
      + '<title>SIGLEP.LAT - Reporte Orientativo</title>'
      + '<style>' + css + '</style>'
      + '</head><body>'

      + '<div class="hdr">'
      + '<div><div class="brand">SIGLEP.LAT</div>'
      + '<div class="brand-sub">Sistemas Integrales de Gestión Legal · siglep.lat</div></div>'
      + '<div><div class="doc-title">Reporte Orientativo</div>'
      + '<div class="doc-date">' + esc(fecha) + '</div></div>'
      + '</div>'

      + '<div class="monto-box">'
      + '<div class="monto-label">Monto de Referencia — ' + esc(title) + '</div>'
      + '<div class="monto-value">' + esc(monto) + '</div>'
      + '</div>'

      + '<div class="sec">'
      + '<div class="sec-lbl">Datos de la estimación</div>'
      + '<div class="grid">'
      + '<div class="ibox"><div class="ilbl">Tipo de cálculo</div><div class="ival">' + esc(title) + '</div></div>'
      + '<div class="ibox"><div class="ilbl">Estado / Municipio</div><div class="ival">' + esc(estadoTxt) + '</div></div>'
      + '</div></div>'

      + (rows
        ? '<div class="sec"><div class="sec-lbl">Desglose detallado</div>'
          + '<table><thead><tr><th>Concepto</th><th style="text-align:right;">Monto</th></tr></thead>'
          + '<tbody>' + rows + '</tbody></table></div>'
        : '')

      + (legal
        ? '<div class="sec"><div class="sec-lbl">Fundamento legal aplicado</div>'
          + '<div class="lbox"><ul>' + legal + '</ul></div></div>'
        : '')

      + '<div class="disc"><strong>Aviso legal:</strong> Estimación orientativa generada con los datos capturados. '
      + 'No constituye asesoría jurídica vinculante ni reemplaza la revisión documental por un abogado. '
      + 'Los montos reales pueden variar según las circunstancias del caso y la resolución de autoridad competente.</div>'

      + '<div class="ftr">'
      + '<span>SIGLEP — Sistemas Integrales de Gestión Legal · siglep.lat</span>'
      + '<span>Generado el ' + esc(fecha) + ' · Solo para referencia orientativa</span>'
      + '</div>'

      + '</body></html>';
  }

  function generarReportePDF() {
    var win = window.open('', '_blank', 'width=900,height=700');
    if (!win) return;
    win.document.open();
    win.document.write(buildReportHTML());
    win.document.close();
    win.focus();
    setTimeout(function () { win.print(); }, 500);
    if (typeof window.gtag === 'function') {
      var meta   = window.__SIGLEP_CALC_META__ || {};
      var estado = window.__SIGLEP_ESTADO_ACTIVO__;
      window.gtag('event', 'calculo_ejecutado', {
        accion:        'pdf',
        tipo_calculo:  meta.formulaKey || 'desconocido',
        estado_clave:  estado ? estado.clave : 'no_seleccionado',
        estado_nombre: estado ? estado.nombre : 'No seleccionado',
        rango_salario: getSalaryRange(),
      });
    }
  }

  function injectPDFButton() {
    if (document.getElementById('siglep-pdf-btn')) return;
    var resultBox = document.querySelector('.result-box');
    if (!resultBox) return;
    var btn = document.createElement('button');
    btn.id   = 'siglep-pdf-btn';
    btn.type = 'button';
    btn.textContent = '↓  Descargar reporte PDF';
    btn.style.cssText =
      'display:block;width:100%;margin-top:0.75rem;padding:0.78rem 1rem;'
      + 'border:1px solid rgba(197,160,89,0.45);border-radius:10px;background:transparent;'
      + 'color:#C5A059;font-size:0.74rem;font-weight:700;letter-spacing:0.1em;'
      + 'text-transform:uppercase;cursor:pointer;transition:background 0.2s ease,color 0.2s ease;';
    btn.addEventListener('mouseenter', function () {
      btn.style.background = 'rgba(197,160,89,0.1)';
      btn.style.color = '#d4b878';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.background = 'transparent';
      btn.style.color = '#C5A059';
    });
    btn.addEventListener('click', generarReportePDF);
    resultBox.insertAdjacentElement('afterend', btn);
  }

  document.addEventListener('siglep:calc-done', injectPDFButton);
})();
