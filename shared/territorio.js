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

  // Entidades con su clave INEGI (Catálogo Único de Claves Geoestadísticas).
  var ENTIDADES = [
    ['AGS', 'Aguascalientes', '01'], ['BC', 'Baja California', '02'], ['BCS', 'Baja California Sur', '03'],
    ['CAM', 'Campeche', '04'], ['COAH', 'Coahuila de Zaragoza', '05'], ['COL', 'Colima', '06'],
    ['CHIS', 'Chiapas', '07'], ['CHIH', 'Chihuahua', '08'], ['CDMX', 'Ciudad de México', '09'],
    ['DGO', 'Durango', '10'], ['GTO', 'Guanajuato', '11'], ['GRO', 'Guerrero', '12'], ['HGO', 'Hidalgo', '13'],
    ['JAL', 'Jalisco', '14'], ['MEX', 'Estado de México', '15'], ['MICH', 'Michoacán de Ocampo', '16'],
    ['MOR', 'Morelos', '17'], ['NAY', 'Nayarit', '18'], ['NL', 'Nuevo León', '19'], ['OAX', 'Oaxaca', '20'],
    ['PUE', 'Puebla', '21'], ['QRO', 'Querétaro', '22'], ['QROO', 'Quintana Roo', '23'],
    ['SLP', 'San Luis Potosí', '24'], ['SIN', 'Sinaloa', '25'], ['SON', 'Sonora', '26'], ['TAB', 'Tabasco', '27'],
    ['TAMS', 'Tamaulipas', '28'], ['TLAX', 'Tlaxcala', '29'], ['VER', 'Veracruz de Ignacio de la Llave', '30'],
    ['YUC', 'Yucatán', '31'], ['ZAC', 'Zacatecas', '32'],
  ];
  // Municipios por entidad: /shared/municipios/{clave INEGI}.json (2,478 municipios y demarcaciones, INEGI).
  // El tercer elemento (1) marca los 45 municipios de la Zona Libre de la Frontera Norte (CONASAMI, DOF 09-12-2025).
  var MUNICIPIOS_URL = '/shared/municipios/';
  var MUNICIPIOS_VERSION = '20261111c';
  var cacheMunicipios = {};
  function cargarMunicipios(cveEnt) {
    if (!cacheMunicipios[cveEnt]) {
      cacheMunicipios[cveEnt] = fetch(MUNICIPIOS_URL + cveEnt + '.json?v=' + MUNICIPIOS_VERSION)
        .then(function (r) { if (!r.ok) throw new Error('municipios'); return r.json(); })
        .then(function (d) { return d.municipios; });
    }
    return cacheMunicipios[cveEnt];
  }

  var ESTADOS_FRONTERA = ['BC', 'SON', 'CHIH', 'COAH', 'NL', 'TAMS'];

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

  // Estado de verificación de los parámetros que usa cada calculadora.
  var OFICIAL_LABORAL = 'Oficiales verificados: Ley Federal del Trabajo (última reforma DOF 14-05-2026) y salarios mínimos 2026 de CONASAMI (DOF 09-12-2025).';
  var ORIENTATIVO = 'Orientativos: los porcentajes, costos o factores de esta calculadora no provienen de una tabla oficial ni varían por entidad; sirven para dimensionar el caso, no para fijar un monto.';
  var PARAMETROS = {
    'laboral/aguinaldo-prima-vacacional': ['oficial', OFICIAL_LABORAL],
    'laboral/despido-injustificado': ['oficial', OFICIAL_LABORAL],
    'laboral/finiquito': ['oficial', OFICIAL_LABORAL],
    'laboral/horas-extras': ['oficial', 'Oficiales verificados: arts. 66 y 68 de la Ley Federal del Trabajo y transitorio Cuarto del decreto DOF 01-05-2026 (9 horas extra dobles por semana en 2026).'],
    'laboral/liquidacion-laboral': ['oficial', OFICIAL_LABORAL],
    'seguridad-social/pension-imss': ['oficial', 'Oficiales verificados: LSS 1973 (DOF 12-03-1973 y 27-12-1990), LSS vigente (DOF 15-01-2026), INPC de INEGI y factores URV de CONSAR.'],
    'seguridad-social/modalidad-40': ['oficial', 'Oficiales verificados: arts. 25, 147, 168 y 218 LSS, transitorio Segundo del decreto DOF 16-12-2020 y acuerdo ACDO.AS2.HCT.101026/302.P.DG (DOF 21-10-2026).'],
    'seguridad-social/pension-invalidez': ['orientativo', 'Sin verificar contra el texto oficial vigente en esta versión; úsala como referencia.'],
    'seguridad-social/pension-issste': ['orientativo', 'Sin verificar contra el texto oficial vigente en esta versión; úsala como referencia.'],
    'seguridad-social/pension-viudez': ['orientativo', 'Sin verificar contra el texto oficial vigente en esta versión; úsala como referencia.'],
    'patrimonial/herencia-sucesion': ['orientativo', 'Mixtos: arts. 1754 CCF y 93 y 150 LISR verificados; gastos notariales y funerarios son estimaciones si no capturas tus montos.'],
    'patrimonial/deuda-bancaria': ['orientativo', ORIENTATIVO],
    'civil/intereses-moratorios': ['orientativo', 'Mixtos: el 9% anual es el interés legal del Código Civil Federal (art. 2395); el de tu estado puede ser distinto.'],
  };

  function estadoParametros(area) {
    var partes = location.pathname.split('/').filter(Boolean);
    var clave = partes[1] + '/' + (partes[2] || '');
    return PARAMETROS[clave] || ['orientativo', ORIENTATIVO];
  }

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

  function resolver(clave, mun) {
    var ent = ENTIDADES.find(function (e) { return e[0] === clave; });
    if (!ent) return null;
    var zlfn = !!(mun && mun[2] === 1);
    return {
      clave: ent[0],
      nombre: ent[1],
      cve_inegi: ent[2],
      municipio: mun ? mun[1] : null,
      cve_mun: mun ? ent[2] + mun[0] : null,
      zona: zlfn ? 'frontera' : 'general',
      salario_minimo: zlfn ? FEDERAL.salario_minimo_zlfn : FEDERAL.salario_minimo_general,
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
    var est = estadoParametros(area);
    html += '<p class="siglep-terr-param siglep-terr-' + est[0] + '">Parámetros · ' + esc(est[1]) + '</p>';
    if (lugar) {
      html += '<p class="siglep-terr-lugar">Lugar: ' + esc(lugar.municipio ? lugar.municipio + ', ' : '') + esc(lugar.nombre);
      if (area === 'laboral' && document.getElementById('zona_salario_minimo')) {
        if (!lugar.municipio && ESTADOS_FRONTERA.indexOf(lugar.clave) >= 0) html += ' · Selecciona tu municipio: en la franja fronteriza el salario mínimo es distinto';
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
      '.siglep-terr-lugar{font-weight:600}' +
      '.siglep-terr-param{font-size:0.74rem}.siglep-terr-oficial{color:#2f855a}.siglep-terr-orientativo{color:#b7791f}';
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
        '<span class="help">Catálogo oficial del INEGI. Solo cambia el cálculo cuando la ley fija un parámetro municipal oficial (por ejemplo, el salario mínimo de la Zona Libre de la Frontera Norte en las calculadoras laborales).</span>' +
      '</div>' +
      '<div class="siglep-terr" id="siglep-terr-info" role="status"></div>';
    form.insertBefore(wrap, form.firstChild);

    var selEstado = wrap.querySelector('#estado_republica');
    var campoMun = wrap.querySelector('#siglep-municipio-field');
    var selMun = wrap.querySelector('#municipio');
    var info = wrap.querySelector('#siglep-terr-info');
    var lugar = null;
    var zonaManual = document.getElementById('zona_salario_minimo');

    var municipiosActuales = [];

    function actualizar() {
      var clave = selEstado.value;
      campoMun.hidden = !clave;
      var mun = municipiosActuales.find(function (m) { return m[0] === selMun.value; }) || null;
      lugar = clave ? resolver(clave, mun) : null;
      pintarJurisdiccion(info, area, lugar);
      aplicarParametros(area, lugar);
    }

    selEstado.addEventListener('change', function () {
      var clave = selEstado.value;
      municipiosActuales = [];
      selMun.innerHTML = '<option value="">Cargando municipios…</option>';
      actualizar();
      var ent = ENTIDADES.find(function (e) { return e[0] === clave; });
      if (!ent) return;
      cargarMunicipios(ent[2]).then(function (lista) {
        if (selEstado.value !== clave) return;
        municipiosActuales = lista;
        selMun.innerHTML = '<option value="">Selecciona tu municipio</option>' + lista.map(function (m) {
          return '<option value="' + m[0] + '">' + esc(m[1]) + (m[2] === 1 ? ' · frontera norte' : '') + '</option>';
        }).join('');
        actualizar();
      }).catch(function () {
        selMun.innerHTML = '<option value="">No se pudo cargar el catálogo de municipios</option>';
      });
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

  window.__SIGLEP_TERRITORIO__ = { parametros: PARAMETROS, federal: FEDERAL, entidades: ENTIDADES, jurisdiccion: JURISDICCION, resolver: resolver, cargarMunicipios: cargarMunicipios };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
