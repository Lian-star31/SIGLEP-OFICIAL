/**
 * SIGLEP — Sistema territorial común para todas las calculadoras.
 *
 * Cada calculadora declara qué legislación la rige (federal, estatal o municipal)
 * y el lugar seleccionado aporta los parámetros que la ley hace depender del
 * territorio. Solo se usan parámetros publicados oficialmente:
 *   - Salario mínimo 2026 por área geográfica y municipios de la Zona Libre de la
 *     Frontera Norte: Resolución del Consejo de Representantes de la CONASAMI,
 *     DOF 09-12-2025 (ZLFN $440.87; resto del país $315.04).
 *   - UMA 2026: INEGI, DOF 09-01-2026 ($117.31 diarios).
 * Lo que la ley deja a cada estado o municipio (códigos civiles y familiares,
 * aranceles notariales, impuestos locales) se identifica por entidad y se indica
 * como parámetro local; no se inventan tasas por estado.
 */
(function () {
  'use strict';

  var FEDERAL = {
    uma_diaria: 117.31,
    uma_mensual: 3566.22,
    salario_minimo_general: 315.04,
    salario_minimo_zlfn: 440.87,
    fuente_salario: 'CONASAMI, DOF 09-12-2025',
    fuente_uma: 'INEGI, DOF 09-01-2026',
  };

  var ENTIDADES = [
    ['AGS', 'Aguascalientes'], ['BC', 'Baja California'], ['BCS', 'Baja California Sur'],
    ['CAM', 'Campeche'], ['CHIS', 'Chiapas'], ['CHIH', 'Chihuahua'], ['CDMX', 'Ciudad de México'],
    ['COAH', 'Coahuila de Zaragoza'], ['COL', 'Colima'], ['DGO', 'Durango'], ['GTO', 'Guanajuato'],
    ['GRO', 'Guerrero'], ['HGO', 'Hidalgo'], ['JAL', 'Jalisco'], ['MEX', 'Estado de México'],
    ['MICH', 'Michoacán de Ocampo'], ['MOR', 'Morelos'], ['NAY', 'Nayarit'], ['NL', 'Nuevo León'],
    ['OAX', 'Oaxaca'], ['PUE', 'Puebla'], ['QRO', 'Querétaro'], ['QROO', 'Quintana Roo'],
    ['SLP', 'San Luis Potosí'], ['SIN', 'Sinaloa'], ['SON', 'Sonora'], ['TAB', 'Tabasco'],
    ['TAMS', 'Tamaulipas'], ['TLAX', 'Tlaxcala'], ['VER', 'Veracruz de Ignacio de la Llave'],
    ['YUC', 'Yucatán'], ['ZAC', 'Zacatecas'],
  ];

  // Municipios de la Zona Libre de la Frontera Norte (CONASAMI, DOF 09-12-2025).
  var ZLFN = {
    BC: ['Ensenada', 'Playas de Rosarito', 'Mexicali', 'Tecate', 'Tijuana', 'San Quintín', 'San Felipe'],
    SON: ['San Luis Río Colorado', 'Puerto Peñasco', 'General Plutarco Elías Calles', 'Caborca', 'Altar',
      'Sáric', 'Nogales', 'Santa Cruz', 'Cananea', 'Naco', 'Agua Prieta'],
    CHIH: ['Janos', 'Ascensión', 'Juárez', 'Práxedis G. Guerrero', 'Guadalupe', 'Coyame del Sotol',
      'Ojinaga', 'Manuel Benavides'],
    COAH: ['Ocampo', 'Acuña', 'Zaragoza', 'Jiménez', 'Piedras Negras', 'Nava', 'Guerrero', 'Hidalgo'],
    NL: ['Anáhuac'],
    TAMS: ['Nuevo Laredo', 'Guerrero', 'Mier', 'Miguel Alemán', 'Camargo', 'Gustavo Díaz Ordaz',
      'Reynosa', 'Río Bravo', 'Valle Hermoso', 'Matamoros'],
  };
  var OTRO_MUNICIPIO = '__otro__';

  // Legislación aplicable por área de calculadora.
  var JURISDICCION = {
    laboral: {
      nivel: 'Federal',
      ley: 'Ley Federal del Trabajo (artículo 123, apartado A, constitucional)',
      local: 'El lugar define el salario mínimo aplicable: Zona Libre de la Frontera Norte o resto del país.',
      municipal: true,
    },
    'seguridad-social': {
      nivel: 'Federal',
      ley: 'Ley del Seguro Social (régimen 1973 o 1997) y Ley del ISSSTE',
      local: 'Las pensiones del IMSS y del ISSSTE son iguales en todo el país. Si trabajaste para un gobierno estatal o municipal, tu pensión puede depender del instituto de seguridad social de tu estado.',
      municipal: false,
    },
    familiar: {
      nivel: 'Estatal',
      ley: 'Legislación civil y familiar de la entidad seleccionada',
      local: 'Pensión alimenticia, divorcio, custodia y régimen matrimonial se resuelven con el código de tu estado y ante el juez familiar local; los porcentajes de la calculadora son orientativos.',
      municipal: false,
    },
    civil: {
      nivel: 'Estatal',
      ley: 'Código Civil de la entidad seleccionada (Código Civil Federal en asuntos federales)',
      local: 'Daño moral, responsabilidad civil e intereses legales se rigen por el código civil de tu estado; la tasa de interés legal de la calculadora es la del Código Civil Federal (9% anual) salvo que captures otra.',
      municipal: false,
    },
    patrimonial: {
      nivel: 'Estatal y municipal',
      ley: 'Código Civil y ley del notariado de la entidad; impuestos locales del municipio',
      local: 'La sucesión se tramita conforme al código civil de tu estado; los honorarios notariales dependen del arancel estatal y el impuesto por adquisición de inmuebles lo cobra el municipio donde está el bien.',
      municipal: false,
    },
    'patrimonial/deuda-bancaria': {
      nivel: 'Federal',
      ley: 'Código de Comercio, Ley General de Títulos y Operaciones de Crédito y Ley de Protección y Defensa al Usuario de Servicios Financieros',
      local: 'Los créditos bancarios se rigen por leyes federales en todo el país; el lugar solo define el juzgado competente.',
      municipal: false,
    },
  };

  function areaActual() {
    var partes = location.pathname.split('/').filter(Boolean); // ['calculadoras', area, herramienta]
    if (partes[0] !== 'calculadoras' || !partes[1]) return null;
    var especifica = partes[1] + '/' + (partes[2] || '');
    return JURISDICCION[especifica] ? especifica : (JURISDICCION[partes[1]] ? partes[1] : null);
  }

  function esc(v) {
    return String(v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 });

  function resolver(clave, municipio) {
    var ent = ENTIDADES.find(function (e) { return e[0] === clave; });
    if (!ent) return null;
    var zlfn = !!(ZLFN[clave] && municipio && municipio !== OTRO_MUNICIPIO && ZLFN[clave].indexOf(municipio) >= 0);
    return {
      clave: ent[0],
      nombre: ent[1],
      municipio: municipio && municipio !== OTRO_MUNICIPIO ? municipio : null,
      zona: zlfn ? 'frontera' : 'general',
      salario_minimo: zlfn ? FEDERAL.salario_minimo_zlfn : FEDERAL.salario_minimo_general,
      requiere_municipio: !!ZLFN[clave],
    };
  }

  function pintarJurisdiccion(box, area, lugar) {
    var j = JURISDICCION[area];
    if (!j) { box.hidden = true; return; }
    var html = '<div class="siglep-terr-kicker">Legislación aplicable · ' + esc(j.nivel) + '</div>' +
      '<p><strong>' + esc(j.ley) + '</strong></p><p>' + esc(
        area === 'laboral' && !document.getElementById('zona_salario_minimo')
          ? 'La Ley Federal del Trabajo aplica igual en todo el país; este cálculo no depende del lugar.'
          : j.local) + '</p>';
    if (lugar) {
      html += '<p class="siglep-terr-lugar">Lugar: ' + esc(lugar.municipio ? lugar.municipio + ', ' : '') + esc(lugar.nombre);
      if (area === 'laboral' && document.getElementById('zona_salario_minimo')) {
        html += ' · Salario mínimo 2026: ' + money.format(lugar.salario_minimo) + ' diarios (' +
          (lugar.zona === 'frontera' ? 'Zona Libre de la Frontera Norte' : 'resto del país') + ', ' + esc(FEDERAL.fuente_salario) + ')';
      }
      html += '</p>';
    }
    box.innerHTML = html;
    box.hidden = false;
  }

  function aplicarParametros(area, lugar) {
    window.__SIGLEP_ESTADO_ACTIVO__ = lugar;
    if (area === 'laboral' && lugar) {
      var zona = document.getElementById('zona_salario_minimo');
      if (zona && zona.value !== lugar.zona) {
        zona.value = lugar.zona;
        zona.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
    document.dispatchEvent(new CustomEvent('siglep:estado-change', { detail: lugar }));
  }

  function injectStyles() {
    if (document.getElementById('siglep-terr-style')) return;
    var st = document.createElement('style');
    st.id = 'siglep-terr-style';
    st.textContent =
      '.siglep-terr{margin:0 0 1rem;padding:0.85rem 0.95rem;border-radius:10px;border:1px solid rgba(197,160,89,0.28);background:rgba(197,160,89,0.08);font-size:0.78rem;line-height:1.6;color:inherit}' +
      '.siglep-terr p{margin:0.25rem 0 0}' +
      '.siglep-terr-kicker{font-size:0.6rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#C5A059}' +
      '.siglep-terr-lugar{font-weight:600}';
    document.head.appendChild(st);
  }

  function init() {
    var area = areaActual();
    // Formulario estándar (#calc-form) o, en su defecto, el primer panel de captura de la calculadora.
    var form = document.getElementById('calc-form') ||
      (document.querySelector('.calc-grid .panel-body input, .calc-grid .panel-body select') || {}).closest &&
      document.querySelector('.calc-grid .panel-body input, .calc-grid .panel-body select').closest('.panel-body');
    if (!form || !area) return;
    injectStyles();

    var wrap = document.createElement('div');
    wrap.className = 'siglep-territorio';
    wrap.innerHTML =
      '<div class="field">' +
        '<label for="estado_republica">Entidad federativa</label>' +
        '<select id="estado_republica" name="estado_republica">' +
          '<option value="">Selecciona tu estado</option>' +
          ENTIDADES.map(function (e) { return '<option value="' + e[0] + '">' + esc(e[1]) + '</option>'; }).join('') +
        '</select>' +
      '</div>' +
      '<div class="field" id="siglep-municipio-field" hidden>' +
        '<label for="municipio">Municipio</label>' +
        '<select id="municipio" name="municipio"></select>' +
        '<span class="help">Solo cambia el cálculo en los municipios de la Zona Libre de la Frontera Norte.</span>' +
      '</div>' +
      '<div class="siglep-terr" id="siglep-terr-info" role="status"></div>';
    form.insertBefore(wrap, form.firstChild);

    var selEstado = wrap.querySelector('#estado_republica');
    var campoMun = wrap.querySelector('#siglep-municipio-field');
    var selMun = wrap.querySelector('#municipio');
    var info = wrap.querySelector('#siglep-terr-info');
    var lugar = null;
    var zonaManual = document.getElementById('zona_salario_minimo');

    function actualizar() {
      var clave = selEstado.value;
      var usaMunicipio = JURISDICCION[area].municipal && zonaManual && ZLFN[clave];
      campoMun.hidden = !usaMunicipio;
      lugar = clave ? resolver(clave, usaMunicipio ? selMun.value : null) : null;
      pintarJurisdiccion(info, area, lugar);
      aplicarParametros(area, lugar);
    }

    selEstado.addEventListener('change', function () {
      var clave = selEstado.value;
      if (JURISDICCION[area].municipal && zonaManual && ZLFN[clave]) {
        selMun.innerHTML = ZLFN[clave].map(function (m) { return '<option value="' + esc(m) + '">' + esc(m) + ' (frontera norte)</option>'; }).join('') +
          '<option value="' + OTRO_MUNICIPIO + '" selected>Otro municipio de ' + esc(selEstado.options[selEstado.selectedIndex].text) + '</option>';
      }
      actualizar();
    });
    selMun.addEventListener('change', actualizar);
    // En laborales el área salarial la determina el lugar: se oculta el selector manual para evitar contradicciones.
    if (area === 'laboral' && zonaManual) {
      var campoZona = zonaManual.closest('.field') || zonaManual.parentElement;
      if (campoZona) campoZona.hidden = true;
    }
    if (form.tagName === 'FORM') form.addEventListener('reset', function () { setTimeout(function () { selEstado.value = ''; actualizar(); }, 0); });
    actualizar();
  }

  window.__SIGLEP_TERRITORIO__ = { federal: FEDERAL, entidades: ENTIDADES, zlfn: ZLFN, jurisdiccion: JURISDICCION, resolver: resolver };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
