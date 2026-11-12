/* SIGLEP — Parámetros civiles y familiares por entidad federativa.
 * Fuente de cada dato: el código civil (o familiar) de la entidad, en la compilación oficial indicada en `fuente`
 * (Orden Jurídico Nacional de la Secretaría de Gobernación, salvo que se indique el congreso o poder judicial local).
 * `reforma` es la última reforma que consigna esa compilación. Si un código fue reformado después, el dato debe revisarse.
 * Ningún valor de este archivo es estimado: si la ley no fija una cifra, el campo queda en null y la calculadora lo dice.
 */
(function (root) {
  'use strict';

  var UMA_DIARIA = 117.31;            // INEGI, DOF 09-01-2026 (vigente desde 01-02-2026)
  var UMA_MENSUAL = 3566.22;
  var SM_GENERAL = 315.04;            // CONASAMI, DOF 09-12-2025
  var SM_ZLFN = 440.87;

  var OJN = 'Orden Jurídico Nacional (Segob)';

  // Código de cada entidad: [nombre del código, fuente de la compilación, última reforma consignada]
  var CODIGOS = {
    FED:  ['Código Civil Federal', 'Cámara de Diputados', '14-11-2025'],
    AGS:  ['Código Civil del Estado de Aguascalientes', OJN, '23-09-2024'],
    BC:   ['Código Civil para el Estado de Baja California', OJN, '28-06-2024'],
    BCS:  ['Código Civil para el Estado Libre y Soberano de Baja California Sur', OJN, '20-07-2022'],
    CAM:  ['Código Civil del Estado de Campeche', OJN, '28-04-2022'],
    COAH: ['Código Civil para el Estado de Coahuila de Zaragoza', OJN, '27-06-2023'],
    COL:  ['Código Civil para el Estado de Colima', OJN, '21-09-2023'],
    CHIS: ['Código Civil del Estado de Chiapas', OJN, '23-01-2019'],
    CHIH: ['Código Civil del Estado de Chihuahua', OJN, '16-01-2021'],
    CDMX: ['Código Civil para el Distrito Federal (Ciudad de México)', OJN, '28-08-2024'],
    DGO:  ['Código Civil del Estado de Durango', OJN, '10-03-2024'],
    GTO:  ['Código Civil para el Estado de Guanajuato', OJN, '26-05-2017'],
    GRO:  ['Código Civil del Estado Libre y Soberano de Guerrero Número 358', OJN, '26-09-2019'],
    HGO:  ['Código Civil para el Estado de Hidalgo', OJN, '17-09-2024'],
    JAL:  ['Código Civil del Estado de Jalisco', OJN, '25-06-2024'],
    MEX:  ['Código Civil del Estado de México', 'Legislación del Estado de México (legislacion.edomex.gob.mx)', '09-11-2026'],
    MICH: ['Código Civil para el Estado de Michoacán de Ocampo', OJN, '29-12-2016'],
    MOR:  ['Código Civil para el Estado Libre y Soberano de Morelos', 'Consejería Jurídica de Morelos (marcojuridico.morelos.gob.mx)', 'versión publicada en 2026'],
    NAY:  ['Código Civil para el Estado de Nayarit', OJN, '11-06-2024'],
    NL:   ['Código Civil para el Estado de Nuevo León', 'H. Congreso de Nuevo León (hcnl.gob.mx)', '26-06-2026'],
    OAX:  ['Código Civil para el Estado de Oaxaca', OJN, '29-10-2022'],
    PUE:  ['Código Civil para el Estado Libre y Soberano de Puebla', OJN, '27-07-2023'],
    QRO:  ['Código Civil del Estado de Querétaro', 'Poder Judicial de Querétaro (compilación 2020)', '2020'],
    QROO: ['Código Civil para el Estado de Quintana Roo', OJN, '10-07-2024'],
    SLP:  ['Código Civil para el Estado de San Luis Potosí', OJN, '16-05-2024'],
    SIN:  ['Código Civil para el Estado de Sinaloa', OJN, '11-03-2022'],
    SON:  ['Código Civil para el Estado de Sonora', 'Supremo Tribunal de Justicia de Sonora (stjsonora.gob.mx)', 'sin fecha en la compilación'],
    TAB:  ['Código Civil para el Estado de Tabasco', OJN, '31-12-2014'],
    TAMS: ['Código Civil para el Estado de Tamaulipas', 'H. Congreso de Tamaulipas (congresotamaulipas.gob.mx)', '30-03-2026'],
    TLAX: ['Código Civil para el Estado Libre y Soberano de Tlaxcala', OJN, '11-03-2010'],
    VER:  ['Código Civil para el Estado de Veracruz de Ignacio de la Llave', OJN, '13-06-2022'],
    YUC:  ['Código Civil del Estado de Yucatán', OJN, '07-06-2022'],
    ZAC:  ['Código Civil del Estado de Zacatecas', OJN, '08-07-2023'],
  };

  /* Interés legal civil.
   * tasa: % anual fijo; tipo 'variable' cuando la ley remite a un indicador del Banco de México (el usuario debe capturar el dato publicado).
   */
  var INTERES = {
    FED:  { tasa: 9, art: '2395' },
    AGS:  { tasa: 9, art: '2266' },
    BC:   { tasa: null, tipo: 'variable', art: '2269', regla: 'costo porcentual promedio (CPP) que fija el Banco de México o su instrumento equivalente' },
    BCS:  { tasa: 9, art: '2300' },
    CAM:  { tasa: 9, art: '2294' },
    COAH: { tasa: 12, art: '2810' },
    COL:  { tasa: 9, art: '2285' },
    CHIS: { tasa: 9, art: '2369' },
    CHIH: { tasa: 9, art: '2291' },
    CDMX: { tasa: 9, art: '2395' },
    DGO:  { tasa: 9, art: '2276' },
    GTO:  { tasa: 6, art: '1570 y 1895', regla: 'la falta de pago puntual causa el interés legal del 6% anual si no hay pacto' },
    GRO:  { tasa: 12, art: '2311' },
    HGO:  { tasa: 9, art: '2377' },
    JAL:  { tasa: 9, art: '1976' },
    MEX:  { tasa: null, tipo: 'variable', art: '7.665', regla: 'costo porcentual promedio de captación (CPP) que registra el Banco de México' },
    MICH: { tasa: 9, art: '1556' },
    MOR:  { tasa: 9, art: '1871 y 1518' },
    NAY:  { tasa: 9, art: '1767' },
    NL:   { tasa: 9, moratorio: 12, art: '2289 (mutuo) y 17 Bis', regla: 'en el mutuo, 9% legal y 12% moratorio; en las demás obligaciones el art. 17 Bis remite al promedio del CPP del Banco de México (moratorio: CPP + 25%)' },
    OAX:  { tasa: 9, art: '2270' },
    PUE:  { tasa: 18, art: '2015', regla: 'si el contrato no fijó interés y la sentencia condena a pagarlo, la tasa es 18% anual' },
    QRO:  { tasa: 20, art: '2280' },
    QROO: { tasa: 12, art: '2659' },
    SLP:  { tasa: 9, art: '2224' },
    SIN:  { tasa: 9, art: '2277' },
    SON:  { tasa: 9, art: '2660' },
    TAB:  { tasa: null, tipo: 'variable', art: '2659', regla: 'variable: costo porcentual promedio de captación (CPP) que registra el Banco de México' },
    TAMS: { tasa: null, tipo: 'variable', art: '1173', regla: 'el interés más alto que el Banco de México haya fijado para depósitos a plazo fijo durante el periodo del incumplimiento' },
    TLAX: { tasa: 9, art: '2003' },
    VER:  { tasa: 9, art: '2328', regla: '9% anual mientras el Ejecutivo del Estado no fije otro' },
    YUC:  { tasa: 9, art: '1558' },
    ZAC:  { tasa: 9, art: '1751' },
  };

  /* Reparación del daño a personas (muerte o incapacidad).
   * tipo:
   *  'base'     → base diaria fija: mult × UMA (unidad 'UMA') o mult × salario mínimo (unidad 'SM'), por los días de la LFT.
   *  'salario'  → salario diario de la víctima acotado entre min y max veces el salario mínimo, por los días de la LFT.
   *  'dias'     → muerte e incapacidad total permanente: `dias` × ingreso de la víctima (tope `maxSM` salarios mínimos).
   *  'pension'  → pensión mensual igual al ingreso promedio de la víctima por el tiempo que fije el juez.
   *  'juez'     → la ley no fija tarifa; la cuantía la determina el juez.
   * Los días de la Ley Federal del Trabajo: muerte 5,000 (art. 502) + 2 meses de gastos funerarios (art. 500);
   * incapacidad permanente total 1,095 (art. 495); parcial: % de la tabla sobre 1,095 (art. 492); temporal: días de incapacidad (art. 491).
   */
  var REPARACION = {
    FED:  { tipo: 'base', unidad: 'UMA', mult: 1, art: '1915' },
    AGS:  { tipo: 'salario', min: 1, max: 2, sinIngreso: 1, art: '1789', nota: 'remite a las reglas de la LFT, que toman el salario de la víctima con mínimo de un salario mínimo (art. 485) y máximo de dos (art. 486).' },
    BC:   { tipo: 'base', unidad: 'UMA', mult: 1, art: '1793', moralTope: 'itp', nota: 'el daño moral no puede exceder la indemnización por incapacidad permanente total.' },
    BCS:  { tipo: 'base', unidad: 'UMA', mult: 4, art: '1820' },
    CAM:  { tipo: 'base', unidad: 'SM', mult: 4, art: '1810', nota: 'el código dice “cuádruplo del salario mínimo diario más alto en vigor en la región”.' },
    COAH: { tipo: 'base', unidad: 'SM', mult: 1, art: '1891', nota: 'base: salario mínimo diario más alto en vigor en la región, además de la reparación del art. 1890.' },
    COL:  { tipo: 'salario', min: null, max: 2, sinIngreso: 1, art: '1806' },
    CHIS: { tipo: 'juez', art: '1891 y 1892', moralTope: 'tercio', nota: 'no fija tarifa; la reparación moral no puede exceder la tercera parte de la responsabilidad civil (art. 1892).' },
    CHIH: { tipo: 'salario', min: 2, max: null, sinIngreso: 2, art: '1800', nota: 'si la víctima no está en edad o condiciones de trabajar, la base es el 75% del doble del salario mínimo.' },
    CDMX: { tipo: 'base', unidad: 'SM', mult: 4, art: '1915', nota: 'el código dice “cuádruplo del salario mínimo diario más alto que esté en vigor”.' },
    DGO:  { tipo: 'juez', art: '1799', nota: 'toma el salario de la víctima, pero fija un tope literal de veinticinco pesos diarios que no ha sido actualizado; por eso no se calcula.' },
    GTO:  { tipo: 'base', unidad: 'UMA', mult: 1, art: '1405' },
    GRO:  { tipo: 'base', unidad: 'SM', mult: 4, art: '1767' },
    HGO:  { tipo: 'juez', art: '—', nota: 'el código no contiene una tarifa para daños a personas.' },
    JAL:  { tipo: 'base', unidad: 'UMA', mult: 5, multMuerte: 1, art: '1390', nota: 'incapacidades: cinco tantos de la UMA diaria; muerte: art. 502 LFT con base en la UMA diaria.' },
    MEX:  { tipo: 'dias', dias: 730, maxSM: 3, sinIngreso: 1, art: '7.150 y 7.151', nota: 'otras incapacidades: el juez fija la indemnización con las reglas de la LFT y puede aumentarla.' },
    MICH: { tipo: 'base', unidad: 'UMA', mult: 4, art: '1081' },
    MOR:  { tipo: 'pension', art: '1347' },
    NAY:  { tipo: 'salario', min: 1, max: 2, sinIngreso: 1, muerteUMA: 2500, art: '1288', nota: 'incapacidades conforme a la LFT; en caso de muerte, 2,500 veces la UMA.' },
    NL:   { tipo: 'juez', art: '1812 Bis', nota: 'remite a la LFT, pero la indemnización debe ser proporcional a la necesidad de la víctima y a la capacidad de quien paga.' },
    OAX:  { tipo: 'salario', min: 2, max: null, sinIngreso: 2, muerteMin: { dias: 790, mult: 3 }, minSoloIncap: true, art: '1786', nota: 'por muerte, mínimo 790 días del triple del salario mínimo (doble si la víctima era menor de 18 años o incapaz).' },
    PUE:  { tipo: 'dias', dias: 1200, maxSM: 4, sinIngreso: 1, art: '1988', nota: 'el excedente sobre cuatro salarios mínimos se toma si el obligado tiene posibilidades de indemnizar totalmente.' },
    QRO:  { tipo: 'base', unidad: 'SM', mult: 4, art: '1796' },
    QROO: { tipo: 'juez', art: '124 y 132', nota: 'incapacidad temporal: gastos de curación más lo que la víctima deje de percibir; daño moral: parámetros de la LFT con incremento de hasta 80%.' },
    SLP:  { tipo: 'base', unidad: 'UMA', mult: 4, art: '1751' },
    SIN:  { tipo: 'salario', min: 1, max: 4, sinIngreso: 1, art: '1799' },
    SON:  { tipo: 'pension', art: '2086' },
    TAB:  { tipo: 'dias', dias: 1460, maxSM: 4, sinIngreso: 1, art: '2055' },
    TAMS: { tipo: 'salario', min: 1, max: 2, sinIngreso: 1, muerteUMA: 3000, itpUMA: 3000, funeralUMAMensual: 4, art: '1390 y 1391', nota: 'muerte: 3,000 UMA diarias más 4 UMA mensuales de gastos funerarios; incapacidad permanente total: prestaciones del art. 487 LFT más 3,000 UMA.' },
    TLAX: { tipo: 'dias', dias: 1100, maxSM: 4, sinIngreso: 1, art: '1406' },
    VER:  { tipo: 'juez', art: '—', nota: 'el código no contiene una tarifa para daños a personas.' },
    YUC:  { tipo: 'base', unidad: 'UMA', mult: 4, art: '1103' },
    ZAC:  { tipo: 'salario', min: null, max: 1, sinIngreso: 1, art: '1200', moralTope: 'tercio', nota: 'la reparación moral no puede exceder la tercera parte de la responsabilidad civil (art. 1201).' },
  };

  /* Compensación al cónyuge que se dedicó al hogar en separación de bienes: tope legal (fracción del valor de los bienes
   * adquiridos durante el matrimonio). null = no se localizó la regla en el código consultado. */
  var COMPENSACION = {
    AGS: { max: 0.5, art: '289 fr. VI' }, BC: { max: 0.5, art: '279 Bis' }, COL: { max: 0.5, art: '268 fr. VI' },
    CHIS: { max: 0.5, art: '269 fr. VII' }, CDMX: { max: 0.5, art: '267 fr. VI' }, DGO: { max: 0.5, art: '202' },
    GTO: { max: 0.5, art: '342-A' }, NAY: { max: 0.5, art: '281 A' }, NL: { max: 0.5, art: '288' },
    PUE: { max: 0.5, art: '443 fr. VIII' }, QROO: { max: 0.5, art: '822' }, VER: { max: 0.5, art: 'capítulo III A del divorcio' },
    MICH: { max: 0.5, art: '258 del Código Familiar' }, SLP: { max: 0.5, art: '86 Bis fr. VI del Código Familiar' }, SIN: { max: 0.5, art: '182 fr. VI del Código Familiar' },
  };


  /* Reglas numéricas de pensión alimenticia que fija la ley local (las demás entidades sólo prevén proporcionalidad). */
  var ALIMENTOS = {
    TAMS: { minPct: 0.30, maxPct: 0.50, art: '288', regla: 'no menos del 30% ni más del 50% del sueldo o salario del deudor, incluidas sus prestaciones' },
    GRO:  { art: '397', regla: 'nunca inferior al 40% del salario mínimo vigente o del salario percibido y sus prestaciones' },
    MEX:  { art: '4.129', regla: 'entre concubinos: no menos del 40% del sueldo para quien se dedicó preponderantemente al hogar (20% si está imposibilitado para trabajar)' },
  };

  /* Sucesión legítima: 1 si se localizó en el código local el texto equivalente a la regla del CCF.
   * Orden: [cónyuge con descendientes = porción de un hijo (1624-1625), cónyuge con hermanos = dos tercios (1627),
   *         cónyuge con ascendientes = mitad (1626), sólo hijos = partes iguales (1607)]. 0 = no localizado (puede tener otra redacción o regla). */
  var SUCESION = {
    AGS: [1,1,1,1], BC: [1,1,1,1], BCS: [1,1,1,1], CAM: [1,1,1,1], COAH: [1,0,1,1], COL: [1,1,1,0],
    CHIS: [1,1,1,1], CHIH: [1,1,0,1], CDMX: [1,1,1,1], DGO: [0,1,1,0], GTO: [1,1,1,1], GRO: [1,0,1,1],
    HGO: [1,0,0,1], JAL: [1,0,1,1], MEX: [1,0,0,1], MICH: [1,1,1,1], MOR: [1,1,1,0], NAY: [1,0,0,1],
    NL: [0,1,1,0], OAX: [0,0,0,0], PUE: [1,0,0,1], QRO: [1,0,1,1], QROO: [1,0,0,1], SLP: [1,1,1,1],
    SIN: [0,0,0,0], SON: [1,1,1,0], TAB: [1,0,1,1], TAMS: [1,0,1,1], TLAX: [1,0,1,1], VER: [1,0,1,1],
    YUC: [0,0,0,0], ZAC: [1,0,0,1],
  };


  function codigo(clave) { var c = CODIGOS[clave] || CODIGOS.FED; return { nombre: c[0], fuente: c[1], reforma: c[2] }; }
  /* Días que fija la Ley Federal del Trabajo por tipo de daño (arts. 491, 492, 495, 500 y 502). */
  var DIAS_LFT = { muerte: 5000, funeral: 60, itp: 1095 };

  function diasLFT(dano, pct, dias) {
    if (dano === 'muerte') return DIAS_LFT.muerte;
    if (dano === 'itp') return DIAS_LFT.itp;
    if (dano === 'ipp') return DIAS_LFT.itp * Math.max(0, Math.min(100, pct || 0)) / 100;
    return Math.max(0, dias || 0); // temporal
  }

  /* Indemnización por daño a personas según el código de la entidad.
   * d: { dano: 'muerte'|'itp'|'ipp'|'temporal', pct, dias, salario (diario de la víctima, 0 si no tiene), sm (salario mínimo del lugar), menor }
   * Devuelve { calculable, monto, base, diasAplicados, funeral, filas: [[concepto, valor]], equivalenteUMA } */
  function reparacion(clave, d) {
    var r = REPARACION[clave] || REPARACION.FED;
    var sm = d.sm || SM_GENERAL;
    var sal = d.salario > 0 ? d.salario : 0;
    var out = { regla: r, calculable: true, monto: 0, base: 0, dias: 0, funeral: 0, equivalenteUMA: null, detalle: '' };
    if (r.tipo === 'juez') { out.calculable = false; return out; }
    if (r.tipo === 'pension') {
      out.base = sal > 0 ? sal : sm;
      out.pensionMensual = out.base * 365 / 12;
      out.monto = out.pensionMensual;
      out.detalle = d.dano === 'muerte' || d.dano === 'itp' ? 'pensión mensual vitalicia o por el término probable de vida que fije el juez' : 'pensión mensual mientras dure la incapacidad';
      return out;
    }
    var dias = diasLFT(d.dano, d.pct, d.dias);
    var base;
    if (r.tipo === 'base') {
      var unidad = r.unidad === 'UMA' ? UMA_DIARIA : sm;
      var mult = (d.dano === 'muerte' && r.multMuerte) ? r.multMuerte : r.mult;
      base = unidad * mult;
      if (r.unidad === 'SM') out.equivalenteUMA = UMA_DIARIA * mult * (dias + (d.dano === 'muerte' ? DIAS_LFT.funeral : 0));
    } else if (r.tipo === 'salario') {
      base = sal > 0 ? sal : r.sinIngreso * sm;
      if (r.min && !(r.minSoloIncap && d.dano === 'muerte')) base = Math.max(base, r.min * sm);
      if (r.max) base = Math.min(base, r.max * sm);
    } else { // 'dias'
      base = sal > 0 ? Math.min(sal, r.maxSM * sm) : r.sinIngreso * sm;
      if (d.dano === 'muerte' || d.dano === 'itp') dias = r.dias;
      else { // demás incapacidades: reglas de la LFT (salario entre 1 y 2 salarios mínimos, arts. 485-486)
        base = Math.min(Math.max(sal > 0 ? sal : sm, sm), 2 * sm);
        out.detalle = 'referencia LFT: el juez fija el monto y puede aumentarlo';
      }
    }
    out.base = base;
    out.dias = dias;
    out.monto = base * dias;
    if (d.dano === 'muerte' && r.tipo !== 'dias') { out.funeral = base * DIAS_LFT.funeral; out.monto += out.funeral; }
    // Reglas especiales con cantidades fijas en la ley local
    if (d.dano === 'muerte' && r.muerteUMA) {
      out.base = UMA_DIARIA; out.dias = r.muerteUMA; out.funeral = r.funeralUMAMensual ? r.funeralUMAMensual * UMA_MENSUAL : 0;
      out.monto = r.muerteUMA * UMA_DIARIA + out.funeral;
    }
    if (d.dano === 'itp' && r.itpUMA) { out.base = UMA_DIARIA; out.dias = r.itpUMA; out.monto = r.itpUMA * UMA_DIARIA; }
    if (d.dano === 'muerte' && r.muerteMin) {
      var minimo = r.muerteMin.dias * (d.menor ? 2 : r.muerteMin.mult) * sm;
      if (out.monto < minimo) { out.monto = minimo; out.detalle = 'se aplica el mínimo legal por muerte'; }
    }
    return out;
  }

  function cita(clave, art) {
    var c = codigo(clave);
    return c.nombre + (art ? ', art. ' + art : '') + ' (' + c.fuente + '; última reforma consignada: ' + c.reforma + ')';
  }

  root.__SIGLEP_LOCAL__ = {
    UMA_DIARIA: UMA_DIARIA, UMA_MENSUAL: UMA_MENSUAL, SM_GENERAL: SM_GENERAL, SM_ZLFN: SM_ZLFN,
    CODIGOS: CODIGOS, INTERES: INTERES, REPARACION: REPARACION, COMPENSACION: COMPENSACION,
    ALIMENTOS: ALIMENTOS, SUCESION: SUCESION, DIAS_LFT: DIAS_LFT, codigo: codigo, cita: cita, reparacion: reparacion,
  };
})(typeof window !== 'undefined' ? window : globalThis);
