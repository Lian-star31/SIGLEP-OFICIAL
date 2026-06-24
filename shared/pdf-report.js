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

  function buildBreakdownRows() {
    var container = document.getElementById('resultBreakdown');
    if (!container) return '';
    var html = '';
    container.querySelectorAll('.breakdown-row').forEach(function (row) {
      var label = (row.querySelector('span') || {}).textContent || '';
      var value = (row.querySelector('strong') || {}).textContent || '';
      html +=
        '<tr>'
        + '<td style="padding:9px 14px;border-bottom:1px solid #E2E8F0;color:#2D3748;font-size:13px;">' + esc(label) + '</td>'
        + '<td style="padding:9px 14px;border-bottom:1px solid #E2E8F0;text-align:right;font-weight:600;color:#0F2240;font-size:13px;">' + esc(value) + '</td>'
        + '</tr>';
    });
    return html;
  }

  function buildLegalItems() {
    var list = document.getElementById('legalBasisList');
    if (!list) return '';
    var html = '';
    list.querySelectorAll('li').forEach(function (li) {
      html += '<li style="margin-bottom:5px;color:#4A5568;font-size:12px;line-height:1.55;">' + esc(li.textContent) + '</li>';
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

    return '<!DOCTYPE html>'
      + '<html lang="es"><head>'
      + '<meta charset="UTF-8">'
      + '<title>SIGLEP.LAT — Reporte Orientativo</title>'
      + '<style>'
      + '*{margin:0;padding:0;box-sizing:border-box;}'
      + 'body{font-family:Arial,Helvetica,sans-serif;background:#fff;color:#1A202C;padding:32px 40px;}'
      + '@media print{'
      + 'body{padding:20px 28px;}'
      + '.no-print{display:none!important;}'
      + '-webkit-print-color-adjust:exact;print-color-adjust:exact;'
      + '}'
      + '.header{border-bottom:3px solid #C5A059;padding-bottom:16px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:flex-end;}'
      + '.brand{font-size:22px;font-weight:700;color:#0F2240;letter-spacing:0.08em;}'
      + '.brand-sub{font-size:10px;color:#718096;letter-spacing:0.12em;text-transform:uppercase;margin-top:3px;}'
      + '.meta{text-align:right;}'
      + '.meta .doc-title{font-size:13px;font-weight:600;color:#C5A059;text-transform:uppercase;letter-spacing:0.1em;}'
      + '.meta .doc-date{font-size:11px;color:#718096;margin-top:3px;}'
      + '.monto-box{background:#0F2240;border-radius:8px;padding:18px 24px;text-align:center;margin-bottom:20px;}'
      + '.monto-label{font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#C5A059;}'
      + '.monto-value{font-size:28px;font-weight:700;color:#C5A059;margin-top:6px;}'
      + '.section{margin-bottom:20px;}'
      + '.section-label{font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#C5A059;margin-bottom:8px;}'
      + '.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}'
      + '.info-item{background:#F7FAFC;border:1px solid #E2E8F0;border-radius:6px;padding:10px 14px;}'
      + '.info-item .label{font-size:10px;color:#718096;text-transform:uppercase;letter-spacing:0.1em;}'
      + '.info-item .value{font-size:14px;font-weight:600;color:#0F2240;margin-top:3px;}'
      + 'table{width:100%;border-collapse:collapse;border:1px solid #E2E8F0;}'
      + 'thead{background:#0F2240;}'
      + 'thead th{padding:10px 14px;text-align:left;color:#C5A059;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;}'
      + 'thead th:last-child{text-align:right;}'
      + 'tbody tr:last-child td{border-bottom:none;}'
      + '.legal-box{padding:14px 16px;background:#FFFBF0;border:1px solid rgba(197,160,89,0.3);border-radius:6px;}'
      + '.legal-box ul{padding-left:16px;}'
      + '.disclaimer{margin-top:24px;padding:12px 16px;background:#F7FAFC;border-left:3px solid #CBD5E0;font-size:11px;color:#718096;line-height:1.6;}'
      + '.footer{margin-top:24px;padding-top:14px;border-top:1px solid #E2E8F0;display:flex;justify-content:space-between;font-size:10px;color:#A0AEC0;}'
      + '</style>'
      + '</head><body>'

      + '<div class="header">'
      + '<div><div class="brand">SIGLEP.</div>'
      + '<div class="brand-sub">Sistemas Integrales de Gestión Legal · siglep.lat</div></div>'
      + '<div class="meta">'
      + '<div class="doc-title">Reporte Orientativo</div>'
      + '<div class="doc-date">' + esc(fecha) + '</div>'
      + '</div></div>'

      + '<div class="monto-box">'
      + '<div class="monto-label">Monto de Referencia — ' + esc(title) + '</div>'
      + '<div class="monto-value">' + esc(monto) + '</div>'
      + '</div>'

      + '<div class="section">'
      + '<div class="section-label">Datos de la estimación</div>'
      + '<div class="info-grid">'
      + '<div class="info-item"><div class="label">Tipo de cálculo</div><div class="value">' + esc(title) + '</div></div>'
      + '<div class="info-item"><div class="label">Estado / Municipio</div><div class="value">' + esc(estadoTxt) + '</div></div>'
      + '</div></div>'

      + (rows
        ? '<div class="section"><div class="section-label">Desglose detallado</div>'
          + '<table><thead><tr>'
          + '<th>Concepto</th>'
          + '<th style="text-align:right;">Monto</th>'
          + '</tr></thead><tbody>' + rows + '</tbody></table></div>'
        : '')

      + (legal
        ? '<div class="section"><div class="section-label">Fundamento legal aplicado</div>'
          + '<div class="legal-box"><ul>' + legal + '</ul></div></div>'
        : '')

      + '<div class="disclaimer">'
      + '<strong>Aviso legal:</strong> Este documento es una estimación orientativa generada con los datos capturados. '
      + 'No constituye asesoría jurídica vinculante ni reemplaza la revisión documental por un abogado. '
      + 'Los montos reales pueden variar según las circunstancias específicas del caso y la resolución de autoridad competente.'
      + '</div>'

      + '<div class="footer">'
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
      window.gtag('event', 'pdf_descargado', {
        tipo_calculo:  meta.formulaKey || 'desconocido',
        estado_clave:  estado ? estado.clave : 'no_seleccionado',
        page_location: location.href,
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
