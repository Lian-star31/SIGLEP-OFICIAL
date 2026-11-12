// Pruebas independientes de la calculadora de pensión IMSS.
// Valores esperados calculados a mano con los textos oficiales:
// LSS 1973 arts. 164, 167 (DOF 27-12-1990), 169, 171; transitorio Décimo Cuarto (DOF 05-01-2004);
// LSS vigente art. 170 y transitorio Cuarto (DOF 16-12-2020); INPC INEGI dic-2019 105.934 / dic-2025 143.042.
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../calculadoras/seguridad-social/pension-imss/index.html', import.meta.url), 'utf8');
const code = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].pop()[1].split('function runCalc()')[0];
const f = new Function(code + '; return { pensionLey73, pensionGarantizada97, incrementos, edadEfectiva };')();
const M = 365 / 12;
const near = (a, b, tol = 0.02) => Math.abs(a - b) <= tol;
let fail = 0;
const check = (name, got, want, tol) => { const ok = near(got, want, tol); if (!ok) fail++; console.log((ok ? 'OK  ' : 'FAIL') + ' ' + name + ' → ' + got.toFixed(2) + ' (esperado ' + want.toFixed(2) + ')'); };

// Remanente de semanas (art. 167 incisos a y b)
check('incrementos 564 sem (52+12)', f.incrementos(564), 1);
check('incrementos 565 sem (52+13)', f.incrementos(565), 1.5);
check('incrementos 578 sem (52+26)', f.incrementos(578), 1.5);
check('incrementos 579 sem (52+27)', f.incrementos(579), 2);
check('edad 64 + 6 meses = 65 (art. 171)', f.edadEfectiva(64, 6), 65);

// A) 600/día (1.90 SM → grupo 1.76–2.00: 42.67% / 1.615%), 1,200 semanas (13.5 incrementos), 65 años, sin beneficiarios (15%)
const A = (600 * 0.4267 + 600 * 0.01615 * 13.5) * 1.15 * M * 1.11;
check('Ley 73 caso A', f.pensionLey73(600, 1200, 65, false, 0, 0).final, A);

// B) salario mínimo, 500 semanas, 60 años: cálculo < SM → se eleva a SM y × 1.11 = monto mínimo publicado por el IMSS 2026
check('Ley 73 caso B (mínimo 2026 publicado $10,636.54)', f.pensionLey73(315.04, 500, 60, false, 0, 0).final, 10636.54, 0.05);

// C) 2,000/día (6.35 SM → 13.00% / 2.450%), 2,000 semanas (29 incrementos), 65 años, cónyuge + 3 hijos (45%) → tope 100% salario (art. 169)
const cC = 2000 * 0.13 + 2000 * 0.0245 * 29;
const C = Math.min(cC * 1.45, Math.max(2000, cC)) * M * 1.11;
check('Ley 73 caso C (tope art. 169)', f.pensionLey73(2000, 2000, 65, true, 3, 0).final, C);

// D) 450/día (1.43 SM → 58.18% / 1.178%), 900 semanas (7.5 incrementos), 62 años (85%), un solo padre: 10% asignación + 10% ayuda
// el resultado ($9,356 antes del factor) queda bajo el salario mínimo mensual → se eleva a $9,582.47 y × 1.11
const Draw = (450 * 0.5818 + 450 * 0.01178 * 7.5) * 1.20 * 0.85 * M;
const D = Math.max(Draw, 315.04 * M) * 1.11;
check('Ley 73 caso D (un ascendiente, elevado al mínimo)', f.pensionLey73(450, 900, 62, false, 0, 1).final, D);
// D2) mismo caso con 1,300 semanas (15.5 incrementos) queda sobre el mínimo
const D2 = (450 * 0.5818 + 450 * 0.01178 * 15.5) * 1.20 * 0.85 * M * 1.11;
check('Ley 73 caso D2 (sobre el mínimo)', f.pensionLey73(450, 1300, 62, false, 0, 1).final, D2);

// E) Ley 97: 400/día = 3.41 UMA (rango 3.0–3.99), 1,000 semanas (columna 6 de 2026), 62 años → $5,064 de la tabla × INPC
check('Ley 97 caso E', f.pensionGarantizada97(400, 1000, 62).monto, 5064 * 143.042 / 105.934);
// F) Ley 97 extremos de la tabla 2026: mínimo y máximo
// En 2026 el salario mínimo ($315.04) equivale a 2.69 UMA: quien gana el mínimo cae en el rango 2.0–2.99 UMA
check('Ley 97 salario mínimo (2.0–2.99 UMA, 875 sem, 60)', f.pensionGarantizada97(315.04, 875, 60).monto, 3409 * 143.042 / 105.934);
check('Ley 97 máximo (5+ UMA, 1,125+ sem, 65+)', f.pensionGarantizada97(1000, 1300, 70).monto, 8241 * 143.042 / 105.934);

console.log(fail ? `\n${fail} prueba(s) fallaron` : '\nTodas las pruebas pasaron');
process.exit(fail ? 1 : 0);
