// Pruebas independientes de las 14 calculadoras civiles, familiares, patrimoniales y de seguridad social.
// Los valores esperados se calcularon a mano con los textos legales citados en cada caso.
import { readFileSync } from 'node:fs';
const raiz = new URL('../', import.meta.url);
globalThis.window = globalThis;
new Function(readFileSync(new URL('shared/parametros-locales.js', raiz), 'utf8'))();
const L = globalThis.__SIGLEP_LOCAL__;
function cargar(ruta, nombres) {
  const html = readFileSync(new URL('calculadoras/' + ruta + '/index.html', raiz), 'utf8');
  const code = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].pop()[1].split('function runCalc()')[0];
  return new Function(code + '; return {' + nombres.join(',') + '};')();
}
let fallas = 0, total = 0;
const near = (a, b, tol = 0.01) => Math.abs(a - b) <= tol;
function igual(nombre, obtenido, esperado, tol) {
  total++;
  const ok = typeof esperado === 'number' ? near(obtenido, esperado, tol) : obtenido === esperado;
  if (!ok) fallas++;
  console.log((ok ? 'OK  ' : 'FAIL') + ' ' + nombre + ' → ' + obtenido + (ok ? '' : ' (esperado ' + esperado + ')'));
}
const SM = 315.04, UMA = 117.31, UMAM = 3566.22, M = 365 / 12;

// ── Responsabilidad civil (art. 1915 CCF, códigos locales y LFT arts. 491-502)
const R = (k, d) => L.reparacion(k, Object.assign({ sm: SM }, d));
igual('RC federal, muerte: UMA × (5,000 + 60)', R('FED', { dano: 'muerte' }).monto, UMA * 5060);
igual('RC CDMX, IPT: 4 SM × 1,095', R('CDMX', { dano: 'itp' }).monto, 4 * SM * 1095);
igual('RC CDMX, IPT con UMA (desindexación)', R('CDMX', { dano: 'itp' }).equivalenteUMA, 4 * UMA * 1095);
igual('RC Edomex, muerte: 730 días con tope de 3 SM', R('MEX', { dano: 'muerte', salario: 1200 }).monto, 730 * 3 * SM);
igual('RC Tamaulipas 2026, muerte: 3,000 UMA + 4 UMA mensuales', R('TAMS', { dano: 'muerte' }).monto, 3000 * UMA + 4 * UMAM);
igual('RC Oaxaca, muerte con ingreso bajo: mínimo 790 × 3 SM', R('OAX', { dano: 'muerte', salario: 100 }).monto, 790 * 3 * SM);
igual('RC Oaxaca, muerte de menor: mínimo 790 × 2 SM', R('OAX', { dano: 'muerte', salario: 50, menor: true }).monto, 790 * 2 * SM);
igual('RC Sinaloa, IPP 25% con tope de 4 SM', R('SIN', { dano: 'ipp', pct: 25, salario: 2000 }).monto, 0.25 * 1095 * 4 * SM);
igual('RC Zacatecas, temporal 30 días con tope de 1 SM', R('ZAC', { dano: 'temporal', dias: 30, salario: 500 }).monto, 30 * SM);
igual('RC Chihuahua, temporal con mínimo de 2 SM', R('CHIH', { dano: 'temporal', dias: 10, salario: 300 }).monto, 10 * 2 * SM);
igual('RC Nayarit, muerte: 2,500 UMA', R('NAY', { dano: 'muerte' }).monto, 2500 * UMA);
igual('RC Jalisco, IPT: 5 UMA × 1,095', R('JAL', { dano: 'itp' }).monto, 5 * UMA * 1095);
igual('RC Jalisco, muerte: UMA × 5,060', R('JAL', { dano: 'muerte' }).monto, UMA * 5060);
igual('RC Morelos: pensión mensual = ingreso', R('MOR', { dano: 'muerte', salario: 400 }).pensionMensual, 400 * M);
igual('RC Hidalgo: sin tarifa legal', R('HGO', { dano: 'muerte' }).calculable, false);
igual('RC frontera: base salarial con SM de la ZLFN', L.reparacion('SIN', { dano: 'temporal', dias: 1, salario: 5000, sm: 440.87 }).monto, 4 * 440.87);

// ── Intereses moratorios
const im = cargar('civil/intereses-moratorios', ['tasaAplicable', 'interesSimple']);
igual('Interés legal Querétaro 20%', im.tasaAplicable('civil', 'QRO', 0, 0).tasa, 20);
igual('Interés legal Coahuila 12%', im.tasaAplicable('civil', 'COAH', 0, 0).tasa, 12);
igual('Interés legal Guanajuato 6%', im.tasaAplicable('civil', 'GTO', 0, 0).tasa, 6);
igual('Edomex variable sin dato → pide tasa', im.tasaAplicable('civil', 'MEX', 0, 0).tasa, null);
igual('Edomex variable con dato publicado', im.tasaAplicable('civil', 'MEX', 0, 7).tasa, 7);
igual('Mercantil sin pacto 6% (art. 362 CCo)', im.tasaAplicable('mercantil', 'CDMX', 0, 0).tasa, 6);
igual('Pagaré sin tasa: tipo legal 6%', im.tasaAplicable('pagare', 'CDMX', 0, 0).tasa, 6);
igual('Interés simple 10,000 × 20% × 365 días', im.interesSimple(10000, 20, 365), 2000);

// ── Daños y perjuicios (art. 2117 CCF)
const dp = cargar('civil/danos-perjuicios', ['tasaAplicable', 'interesSimple']);
igual('Art. 2117: tope = interés legal CDMX 9% × 100,000 × 120 días', dp.interesSimple(100000, dp.tasaAplicable('civil', 'CDMX', 0, 0).tasa, 120), 100000 * 0.09 * 120 / 365);

// ── Pensión alimenticia y custodia (arts. 303 y 311 CCF; art. 288 CC Tamaulipas)
const pa = cargar('familiar/pension-alimenticia', ['reparto', 'ajusteLocal']);
igual('Proporcionalidad 75% de 10,000', pa.reparto(10000, 30000, 10000).obligado, 7500);
igual('Tamaulipas: mínimo 30% del salario', pa.ajusteLocal('TAMS', 7500, 30000).monto, 9000);
igual('Tamaulipas: máximo 50% del salario', pa.ajusteLocal('TAMS', 20000, 30000).monto, 15000);
igual('CDMX: sin porcentaje legal, sin ajuste', pa.ajusteLocal('CDMX', 7500, 30000).monto, 7500);
const cm = cargar('familiar/custodia-menores', ['reparto']);
igual('Custodia: aportación de B (40%)', cm.reparto(8000, 15000, 10000).otro, 3200);

// ── Divorcio, liquidación y régimen (arts. 183, 189, 204 CCF; compensación local)
const dv = cargar('familiar/divorcio', ['liquidarSociedad', 'compensacion']);
igual('Sociedad conyugal 50%', dv.liquidarSociedad(500000, 80000, 50).a, 210000);
igual('Compensación CDMX limitada al 50%', dv.compensacion('CDMX', 1200000, 60).monto, 600000);
igual('Compensación CDMX 30%', dv.compensacion('CDMX', 1200000, 30).monto, 360000);
igual('Sonora: sin tope localizado', dv.compensacion('SON', 1200000, 30).aplica, false);
const lsc = cargar('familiar/liquidacion-sociedad-conyugal', ['liquidar']);
igual('Liquidación: devuelve aportación y reparte sobrante (A)', lsc.liquidar(900000, 160000, 100000, 0, 50).a, 420000);
igual('Liquidación: B', lsc.liquidar(900000, 160000, 100000, 0, 50).b, 320000);
igual('Liquidación con pérdida: A absorbe lo que B no cubre', lsc.liquidar(200000, 50000, 200000, 0, 50).a, 150000);

// ── Herencia (arts. 1607, 1624-1627 CCF)
const hs = cargar('patrimonial/herencia-sucesion', ['porciones', 'masaNeta']);
igual('Cónyuge sin bienes + 3 hijos: porción de un hijo', hs.porciones(900000, 3, true, 0, 0, 0).filas[0][1], 225000);
igual('Cónyuge con bienes 100,000: lo que falta para igualar', hs.porciones(900000, 3, true, 100000, 0, 0).filas[0][1], 150000);
igual('…y cada hijo', hs.porciones(900000, 3, true, 100000, 0, 0).filas[1][1], 250000);
igual('Cónyuge con bienes suficientes: nada', hs.porciones(900000, 3, true, 400000, 0, 0).filas[0][1], 0);
igual('Cónyuge + padres: mitad', hs.porciones(900000, 0, true, 0, 2, 0).filas[0][1], 450000);
igual('Cónyuge + hermanos: dos tercios', hs.porciones(900000, 0, true, 0, 0, 2).filas[0][1], 600000);
igual('Masa neta tras deudas', hs.masaNeta(1000000, 30000, 20000, 50000), 900000);

// ── Deuda bancaria (art. 165 LGTOC, art. 1047 CCo, art. 362 CCo)
const db = cargar('patrimonial/deuda-bancaria', ['analizar']);
const p1 = db.analizar(50000, 'pagare', '2023-01-15', 0, '2026-11-11');
igual('Pagaré vencido en 2023: prescrito a los 3 años', p1.prescrita, true);
igual('Intereses al 6% legal', p1.intereses, 50000 * 0.06 * p1.dias / 365);
igual('Días de mora 15-01-2023 a 11-11-2026', p1.dias, 1396);
igual('Contrato de crédito: 10 años, no prescrito', db.analizar(50000, 'contrato', '2023-01-15', 0, '2026-11-11').prescrita, false);

// ── Invalidez (LSS 1973 art. 167; LSS arts. 122, 138, 141)
const inv = cargar('seguridad-social/pension-invalidez', ['invalidez73', 'invalidez97', 'PG_INVALIDEZ']);
const cu = 600 * 0.4267 + 600 * 0.01615 * 8;
igual('Ley 73: 600/día, 900 sem, cónyuge + 2 hijos, 52 años', inv.invalidez73(600, 900, 52, true, 2, 0, false).final, cu * 1.35 * M, 0.05);
igual('Ley 73: menor a 1 SM se eleva; 60+ años × 1.11', inv.invalidez73(315.04, 200, 61, false, 0, 0, false).final, SM * M * 1.11, 0.05);
igual('Ley 73: menos de 150 semanas', inv.invalidez73(500, 140, 50, false, 0, 0, false).requisito, false);
igual('Ley 97: mínimo legal (promedio PG fila 1 SM, 60 años, INPC)', inv.PG_INVALIDEZ, 3090.363636 * 143.042 / 105.934, 0.05);
igual('Ley 97: 400/día, cónyuge', inv.invalidez97(400, 300, 80, true, 0, 0, false).final, 0.35 * 400 * M * 1.15, 0.05);
igual('Ley 97: sube al mínimo legal', inv.invalidez97(200, 300, 80, false, 0, 0, false).final, inv.PG_INVALIDEZ, 0.05);
igual('Ley 97: 200 semanas y 50% → no cumple', inv.invalidez97(400, 200, 50, false, 0, 0, false).requisito, false);

// ── Viudez (LSS 1973 arts. 153, 157, 170; LSS arts. 131, 135, 144; transitorio Décimo Cuarto)
const vi = cargar('seguridad-social/pension-viudez', ['sobrevivencia']);
const v73 = vi.sobrevivencia('73', 10000, 1, 0, 62, false);
igual('Ley 73: reducción proporcional (art. 170)', v73.viudez, 9000 * 10000 / 11000);
igual('Ley 73: elevada a 1 SM y × 1.11', v73.viudezFinal, SM * M * 1.11, 0.05);
igual('Ley 73: orfandad × 1.11', v73.o1, 2000 * 10000 / 11000 * 1.11);
const v97 = vi.sobrevivencia('97', 10000, 0, 2, 40, false);
igual('Ley 97: viudez tras tope (art. 144)', v97.viudezFinal, 6000);
igual('Ley 97: orfandad doble tras tope', v97.o2, 2000);

// ── ISSSTE (transitorio Décimo)
const is = cargar('seguridad-social/pension-issste', ['pensionIssste', 'edadJubilacion']);
igual('Edad mínima de jubilación 2026, hombre', is.edadJubilacion('h', 2026), 59);
igual('Edad mínima de jubilación 2028, mujer', is.edadJubilacion('m', 2028), 58);
igual('Jubilación hombre 59 años, 30 de servicio', is.pensionIssste('retiro', 'h', 59, 30, 20000, 2026).monto, 20000);
igual('Hombre 58 años, 30 de servicio: no cumple edad', is.pensionIssste('retiro', 'h', 58, 30, 20000, 2026).cumple, false);
igual('Retiro por edad y tiempo: 60 años, 27 de servicio = 85%', is.pensionIssste('retiro', 'h', 60, 27, 20000, 2026).monto, 17000);
igual('Cesantía 66 años, 12 de servicio = 42%', is.pensionIssste('retiro', 'h', 66, 12, 20000, 2026).monto, 8400);
igual('Tope de 10 UMA', is.pensionIssste('retiro', 'm', 57, 28, 50000, 2026).monto, 10 * UMAM);
igual('Invalidez con 20 años = 62.5%', is.pensionIssste('invalidez', 'h', 45, 20, 20000, 2026).monto, 12500);

console.log('\n' + (total - fallas) + '/' + total + ' pruebas correctas');
process.exit(fallas ? 1 : 0);
