// Pruebas sólo de lo modificado en la auditoría del commit 9383510.
import { readFileSync } from 'node:fs';
globalThis.window = globalThis;
new Function(readFileSync(new URL('../shared/parametros-locales.js', import.meta.url), 'utf8'))();
const L = globalThis.__SIGLEP_LOCAL__;
const SM = 315.04, UMA = 117.31, UMAM = 3566.22;
let f = 0, n = 0;
const eq = (name, got, want, tol = 0.01) => { n++; const ok = typeof want === 'number' ? Math.abs(got - want) <= tol : got === want; if (!ok) f++; console.log((ok ? 'OK  ' : 'FAIL') + ' ' + name + ' → ' + got + (ok ? '' : ' (esperado ' + want + ')')); };
const R = (k, d) => L.reparacion(k, Object.assign({ sm: SM }, d));
// Salario mínimo frente a UMA (art. 123-A fr. VI constitucional; desindexación DOF 27-01-2016)
eq('CDMX IPT literal 4 SM × 1,095', R('CDMX', { dano: 'itp' }).monto, 4 * SM * 1095);
eq('CDMX IPT con UMA', R('CDMX', { dano: 'itp' }).equivalenteUMA, 4 * UMA * 1095);
eq('CDMX usa SM', R('CDMX', { dano: 'itp' }).usaSM, true);
eq('Edomex muerte con tope de 3 UMA', R('MEX', { dano: 'muerte', salario: 1200 }).equivalenteUMA, 730 * 3 * UMA);
eq('Sinaloa IPP: tope 4 UMA', R('SIN', { dano: 'ipp', pct: 25, salario: 2000 }).equivalenteUMA, 0.25 * 1095 * 4 * UMA);
eq('Federal (UMA): sin alternativa', R('FED', { dano: 'muerte' }).usaSM, false);
eq('Tamaulipas 2026 (UMA fija): sin alternativa', R('TAMS', { dano: 'muerte' }).usaSM, false);
eq('Tamaulipas 2026 muerte sin cambio', R('TAMS', { dano: 'muerte' }).monto, 3000 * UMA + 4 * UMAM);
eq('Zacatecas temporal: tope de 1 UMA', R('ZAC', { dano: 'temporal', dias: 30, salario: 500 }).equivalenteUMA, 30 * UMA);
// Parámetros actualizados
eq('Querétaro 20% (Legislatura, 18-08-2023)', L.INTERES.QRO.tasa, 20);
eq('Yucatán: compensación 50% (Código de Familia art. 192)', L.COMPENSACION.YUC.max, 0.5);
eq('Veracruz: compensación art. 142', L.COMPENSACION.VER.art, '142');
eq('Vigencia confirmada Veracruz', L.vigencia('VER').confirmada, true);
eq('Vigencia pendiente Michoacán', L.vigencia('MICH').confirmada, false);
eq('Entidades con vigencia confirmada', Object.keys(L.VIGENCIA).length, 10);
console.log('\n' + (n - f) + '/' + n + ' pruebas de lo modificado');
process.exit(f ? 1 : 0);
