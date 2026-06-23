import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SITE_URL = 'https://siglep.lat';
const WA_LINK = 'https://wa.me/527352169503';
const LEGAL_CONSTANTS = {
  salaryMinGeneral2026: 315.04,
  salaryMinFrontier2026: 440.87,
  uma2026: 117.31,
};
const SHELL_SCRIPT = '/shared/site-shell.js';
const SHELL_INCLUDE = `<script defer src="${SHELL_SCRIPT}"></script>`;
const SHELL_NAV_STYLE = `
  <style>
    nav.siglep-shell-nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 2000;
      height: 76px;
      background: rgba(5, 8, 16, 0.96);
      border-bottom: 1px solid rgba(197, 160, 89, 0.18);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }
    .siglep-shell-nav-inner {
      max-width: 1240px;
      height: 100%;
      margin: 0 auto;
      padding: 0 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
    .siglep-shell-brand {
      display: inline-flex;
      align-items: center;
      gap: 0.8rem;
      text-decoration: none;
      color: inherit;
      min-width: 0;
    }
    .siglep-shell-shield {
      width: 36px;
      height: 42px;
      flex: 0 0 auto;
    }
    .siglep-shell-brand-copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      line-height: 1;
    }
    .siglep-shell-mark {
      font-family: var(--font-display, Georgia, serif);
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #c5a059;
    }
    .siglep-shell-sub {
      margin-top: 0.2rem;
      font-size: 0.61rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.45);
      white-space: nowrap;
    }
    .siglep-shell-links {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      align-items: center;
      gap: 1.15rem;
    }
    .siglep-shell-links > li {
      position: relative;
    }
    .siglep-shell-services {
      position: relative;
      padding-bottom: 28px;
      margin-bottom: -28px;
    }
    .siglep-shell-services::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 28px;
      background: transparent;
    }
    .siglep-shell-links a,
    .siglep-shell-links button {
      appearance: none;
      border: 0;
      background: none;
      color: rgba(255, 255, 255, 0.68);
      text-decoration: none;
      text-transform: uppercase;
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      cursor: pointer;
      white-space: nowrap;
      padding: 0;
      transition: color 0.2s ease;
    }
    .siglep-shell-links a:hover,
    .siglep-shell-links button:hover,
    .siglep-shell-links a[aria-current="page"] {
      color: #c5a059;
    }
    .siglep-shell-cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.78rem 1.15rem !important;
      border-radius: 2px;
      background: #c0392b !important;
      color: #fff !important;
    }
    .siglep-shell-cta:hover {
      background: #96281b !important;
      color: #fff !important;
    }
    .siglep-shell-dropdown {
      position: absolute;
      top: calc(100% - 20px);
      left: 0;
      min-width: 260px;
      padding: 0.75rem;
      border-radius: 8px;
      border: 1px solid rgba(197, 160, 89, 0.18);
      background: rgba(8, 12, 20, 0.98);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.28);
      display: none;
      pointer-events: auto;
      z-index: 5;
    }
    .siglep-shell-dropdown::before {
      content: '';
      position: absolute;
      top: -28px;
      left: -10px;
      right: -10px;
      height: 28px;
    }
    .siglep-shell-services:hover .siglep-shell-dropdown,
    .siglep-shell-services:focus-within .siglep-shell-dropdown {
      display: block;
    }
    .siglep-shell-dropdown a {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.72rem 0.8rem;
      border-radius: 6px;
      font-size: 0.66rem;
      letter-spacing: 0.12em;
    }
    .siglep-shell-dropdown a:hover {
      background: rgba(197, 160, 89, 0.08);
    }
    .siglep-shell-dropdown a span {
      color: rgba(197, 160, 89, 0.7);
      letter-spacing: 0.04em;
    }
    .siglep-shell-burger {
      display: none;
      width: 44px;
      height: 44px;
      border-radius: 10px;
      border: 1px solid rgba(197, 160, 89, 0.18);
      background: rgba(255, 255, 255, 0.02);
      color: #fff;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .siglep-shell-burger svg {
      width: 20px;
      height: 20px;
    }
    .siglep-shell-mobile {
      display: none;
      position: fixed;
      top: 76px;
      left: 0;
      right: 0;
      z-index: 1999;
      background: rgba(5, 8, 16, 0.98);
      border-bottom: 1px solid rgba(197, 160, 89, 0.15);
      padding: 1rem 1.15rem 1.2rem;
      max-height: calc(100vh - 76px);
      overflow: auto;
    }
    .siglep-shell-mobile.open {
      display: block;
    }
    .siglep-shell-mobile-group {
      display: grid;
      gap: 0.4rem;
      margin-bottom: 1rem;
    }
    .siglep-shell-mobile-title {
      font-size: 0.58rem;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: rgba(197, 160, 89, 0.72);
      margin: 0.45rem 0 0.2rem;
    }
    .siglep-shell-mobile a,
    .siglep-shell-mobile button {
      display: block;
      width: 100%;
      text-align: left;
      padding: 0.92rem 0.2rem;
      border: 0;
      border-bottom: 1px solid rgba(197, 160, 89, 0.08);
      background: none;
      color: rgba(255, 255, 255, 0.78);
      text-decoration: none;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .siglep-shell-mobile a:last-child,
    .siglep-shell-mobile button:last-child {
      border-bottom: 0;
    }
    .siglep-shell-mobile .siglep-shell-cta {
      margin-top: 0.65rem;
    }
    @media (max-width: 980px) {
      .siglep-shell-links {
        display: none;
      }
      .siglep-shell-burger {
        display: inline-flex;
      }
    }
    @media (max-width: 680px) {
      nav.siglep-shell-nav {
        height: 70px;
      }
      .siglep-shell-nav-inner {
        padding-inline: 0.9rem;
      }
      .siglep-shell-brand-copy {
        display: none;
      }
      .siglep-shell-mobile {
        top: 70px;
        max-height: calc(100vh - 70px);
      }
    }
  </style>
`;
const SHELL_NAV_HTML = `
  <nav class="siglep-shell-nav" id="navbar">
    <div class="siglep-shell-nav-inner">
      <a class="siglep-shell-brand" href="/" aria-label="SIGLEP">
        <svg class="siglep-shell-shield" viewBox="0 0 40 46" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M20 2L4 9V22C4 31.4 11.1 40.2 20 43C28.9 40.2 36 31.4 36 22V9L20 2Z" fill="#1A365D" stroke="#C5A059" stroke-width="1.5"></path>
          <text x="20" y="28" text-anchor="middle" font-family="Cormorant Garamond, serif" font-size="13" font-weight="700" fill="#C5A059">SL</text>
        </svg>
        <span class="siglep-shell-brand-copy">
          <span class="siglep-shell-mark">SIGLEP</span>
          <span class="siglep-shell-sub">Sistemas Integrales de Gestión Legal</span>
        </span>
      </a>
      <ul class="siglep-shell-links">
        <li><a href="/" data-nav="home">Inicio</a></li>
        <li class="siglep-shell-services">
          <button type="button" aria-haspopup="true" aria-expanded="false" data-nav="services">Servicios ▼</button>
          <div class="siglep-shell-dropdown">
            <a href="/laboral/">Laboral <span>→</span></a>
            <a href="/familiar/">Familiar <span>→</span></a>
            <a href="/civil/">Civil <span>→</span></a>
            <a href="/migratorio/">Migratorio <span>→</span></a>
            <a href="/patrimonial/">Patrimonial <span>→</span></a>
            <a href="/penal/">Penal <span>→</span></a>
            <a href="/seguridad-social/">Seguridad Social <span>→</span></a>
          </div>
        </li>
        <li><a href="/calculadoras/" data-nav="calculadoras">Calculadoras</a></li>
        <li><a href="/expediente/" data-nav="expediente">Expediente</a></li>
        <li><a href="/nosotros/" data-nav="nosotros">Nosotros</a></li>
        <li><a class="siglep-shell-cta" href="${WA_LINK}?text=${encodeURIComponent('Hola SIGLEP, quiero una consulta gratuita')}" target="_blank" rel="noopener noreferrer">Consulta Gratis</a></li>
      </ul>
      <button type="button" class="siglep-shell-burger" aria-label="Abrir menú" onclick="toggleMobileNav()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M4 6h16"></path>
          <path d="M4 12h16"></path>
          <path d="M4 18h16"></path>
        </svg>
      </button>
    </div>
    <div class="siglep-shell-mobile" id="navMobile" aria-hidden="true">
      <div class="siglep-shell-mobile-group">
        <a href="/" onclick="closeMobileNav()">Inicio</a>
      </div>
      <div class="siglep-shell-mobile-title">Servicios</div>
      <div class="siglep-shell-mobile-group">
        <a href="/laboral/" onclick="closeMobileNav()">Laboral</a>
        <a href="/familiar/" onclick="closeMobileNav()">Familiar</a>
        <a href="/civil/" onclick="closeMobileNav()">Civil</a>
        <a href="/migratorio/" onclick="closeMobileNav()">Migratorio</a>
        <a href="/patrimonial/" onclick="closeMobileNav()">Patrimonial</a>
        <a href="/penal/" onclick="closeMobileNav()">Penal</a>
        <a href="/seguridad-social/" onclick="closeMobileNav()">Seguridad Social</a>
      </div>
      <div class="siglep-shell-mobile-group">
        <a href="/calculadoras/" onclick="closeMobileNav()">Calculadoras</a>
        <a href="/expediente/" onclick="closeMobileNav()">Expediente</a>
        <a href="/nosotros/" onclick="closeMobileNav()">Nosotros</a>
        <a class="siglep-shell-cta" href="${WA_LINK}?text=${encodeURIComponent('Hola SIGLEP, quiero una consulta gratuita')}" target="_blank" rel="noopener noreferrer">Consulta Gratis</a>
      </div>
    </div>
  </nav>
`;

const pagesToPatch = [
  'index.html',
  'laboral/index.html',
  'familiar/index.html',
  'migratorio/index.html',
  'patrimonial/index.html',
  'penal/index.html',
  'liquidacion-laboral/index.html',
  'despido-injustificado/index.html',
  'expediente/index.html',
  'nosotros/index.html',
  'gracias/index.html',
  'blog/index.html',
  'blog/acoso-laboral-mobbing-mexico/index.html',
  'blog/citatorio-ministerio-publico/index.html',
  'blog/despido-injustificado-liquidacion/index.html',
  'blog/herencia-sin-testamento-mexico/index.html',
  'blog/pension-alimentaria-mexico/index.html',
  'blog/visa-trabajo-mexico/index.html',
];

const seoOnlyPages = [
  { file: 'index.html', canonical: `${SITE_URL}/` },
  { file: 'gracias/index.html', canonical: `${SITE_URL}/gracias/` },
  { file: 'blog/index.html' },
  { file: 'blog/acoso-laboral-mobbing-mexico/index.html' },
  { file: 'blog/citatorio-ministerio-publico/index.html' },
  { file: 'blog/despido-injustificado-liquidacion/index.html' },
  { file: 'blog/herencia-sin-testamento-mexico/index.html' },
  { file: 'blog/pension-alimentaria-mexico/index.html' },
  { file: 'blog/visa-trabajo-mexico/index.html' },
  { file: 'despido-injustificado/index.html' },
  { file: 'expediente/index.html' },
  { file: 'familiar/index.html' },
  { file: 'laboral/index.html' },
  { file: 'liquidacion-laboral/index.html' },
  { file: 'migratorio/index.html' },
  { file: 'nosotros/index.html' },
  { file: 'patrimonial/index.html' },
  { file: 'penal/index.html' },
];

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, content, 'utf8');
}

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function insertShellInclude(html) {
  if (html.includes(SHELL_INCLUDE)) return html;
  return html.replace(/<\/head>/i, `  ${SHELL_INCLUDE}\n</head>`);
}

function insertShellNavStyles(html) {
  if (html.includes('nav.siglep-shell-nav {')) return html;
  return html.replace(/<\/head>/i, `${SHELL_NAV_STYLE}\n</head>`);
}

function replaceLegacyNav(html) {
  if (/<nav class="siglep-shell-nav"/i.test(html)) return html;

  const navWithMobile = /<nav[^>]*>[\s\S]*?<\/nav>\s*<div class="nav-mobile"[\s\S]*?<\/div>/i;
  if (navWithMobile.test(html)) {
    return html.replace(navWithMobile, SHELL_NAV_HTML);
  }

  const bareNav = /<nav>\s*<\/nav>/i;
  if (bareNav.test(html)) {
    return html.replace(bareNav, SHELL_NAV_HTML);
  }

  return html;
}

function replaceOnce(html, search, replacement) {
  if (!html.includes(search)) return html;
  return html.replace(search, replacement);
}

function replaceMany(html, pairs) {
  return pairs.reduce((acc, [search, replacement]) => replaceOnce(acc, search, replacement), html);
}

function insertBeforeHeadClose(html, snippet) {
  if (html.includes(snippet)) return html;
  return html.replace(/<\/head>/i, `  ${snippet}\n</head>`);
}

function extractMetaValue(html, name) {
  const regex = new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']*)["']`, 'i');
  const match = html.match(regex);
  return match ? match[1] : '';
}

function extractTitle(html) {
  const match = html.match(/<title>([^<]*)<\/title>/i);
  return match ? match[1] : '';
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i);
  return match ? match[1] : '';
}

function buildWebPageSchema(html, canonicalOverride) {
  const title = extractTitle(html);
  const description = extractMetaValue(html, 'description');
  const canonical = canonicalOverride || extractCanonical(html);
  if (!title || !canonical) return '';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    url: canonical,
  };
  if (description) schema.description = description;
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

function patchSeoOnlyPages() {
  seoOnlyPages.forEach(({ file, canonical }) => {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) return;
    let html = readFile(filePath);
    if (canonical && !/rel=["']canonical["']/i.test(html)) {
      html = insertBeforeHeadClose(html, `<link rel="canonical" href="${canonical}">`);
    }
    if (!/<script[^>]+type=["']application\/ld\+json["']/i.test(html)) {
      const schema = buildWebPageSchema(html, canonical);
      if (schema) {
        html = insertBeforeHeadClose(html, schema);
      }
    }
    writeFile(filePath, html);
  });
}

function patchExistingPages() {
  pagesToPatch.forEach((relPath) => {
    const filePath = path.join(ROOT, relPath);
    if (!fs.existsSync(filePath)) return;
    let html = readFile(filePath);
    html = insertShellInclude(html);
    html = replaceLegacyNav(html);
    html = insertShellNavStyles(html);
    html = replaceMany(html, [
      ['Te respondemos con rapidez.', 'Respondemos a la brevedad posible en horario de atención.'],
      ['Te respondemos en menos de 24 horas · Sin costo · Sin compromiso', 'Respondemos a la brevedad posible en horario de atención · Sin costo · Sin compromiso'],
      ['te responderá en minutos', 'respondemos a la brevedad posible en horario de atención'],
      ['Te respondemos en minutos', 'Respondemos a la brevedad posible en horario de atención'],
      ['te contactará en menos de 24 horas', 'respondemos a la brevedad posible en horario de atención'],
      ['menos de 24 horas en días hábiles', 'a la brevedad posible en horario de atención'],
      ['analiza tu situación en minutos', 'analiza tu situación con rapidez'],
    ]);
    writeFile(filePath, html);
  });
}

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isLaborMoneyField(field, isLaborCalculator) {
  if (!isLaborCalculator || field.type !== 'number') return false;
  return /(salario|tarifa|monto|importe|cantidad|sueldo)/i.test(`${field.id} ${field.label}`);
}

function calcFieldMarkup(field, cfg = {}) {
  const isLaborCalculator = cfg.categorySlug === 'laboral' && String(cfg.formulaKey || '').startsWith('labor-');
  if (field.type === 'select') {
    return `
      <div class="field">
        <label for="${field.id}">${esc(field.label)}</label>
        <select id="${field.id}">
          ${(field.options || []).map((opt) => `<option value="${esc(opt.value)}">${esc(opt.label)}</option>`).join('')}
        </select>
        ${field.help ? `<p class="help">${esc(field.help)}</p>` : ''}
      </div>
    `;
  }

  const moneyField = isLaborMoneyField(field, isLaborCalculator);
  const inputAttrs = field.type === 'date'
    ? isLaborCalculator
      ? `type="text" inputmode="numeric" maxlength="10" placeholder="${esc(field.placeholder || 'DD/MM/AAAA')}" autocomplete="off" data-date-input="true"`
      : 'type="date"'
    : moneyField
      ? `type="text" inputmode="decimal" placeholder="${esc(field.placeholder || '')}" autocomplete="off" data-money-input="true"`
      : `type="${field.type || 'number'}" inputmode="decimal" placeholder="${esc(field.placeholder || '')}" min="${field.min ?? 0}" step="${field.step || 'any'}"${isLaborCalculator ? ' autocomplete="off"' : ''}`;

  return `
    <div class="field">
      <label for="${field.id}">${esc(field.label)}</label>
      <input id="${field.id}" ${inputAttrs}>
      ${field.help ? `<p class="help">${esc(field.help)}</p>` : ''}
    </div>
  `;
}

function legalBasisForCalculator(cfg) {
  if (cfg.legalBasis && cfg.legalBasis.length) {
    return cfg.legalBasis;
  }

  if (cfg.categorySlug === 'laboral') {
    return [
      'Ley Federal del Trabajo: artículos 47, 48, 50, 66, 67, 68, 76, 80 y 87, según el tipo de cálculo.',
      `Valores 2026 de referencia: salario mínimo general $${LEGAL_CONSTANTS.salaryMinGeneral2026.toFixed(2)}, frontera norte $${LEGAL_CONSTANTS.salaryMinFrontier2026.toFixed(2)} y UMA diaria $${LEGAL_CONSTANTS.uma2026.toFixed(2)}.`,
    ];
  }

  if (cfg.categorySlug === 'seguridad-social') {
    return [
      'Ley del Seguro Social y Ley del ISSSTE, según la prestación consultada.',
      `Valores 2026 de referencia: UMA diaria $${LEGAL_CONSTANTS.uma2026.toFixed(2)} y salario mínimo 2026 vigente según la zona aplicable.`,
    ];
  }

  if (cfg.categorySlug === 'civil') {
    return ['Código Civil y legislación procesal aplicable en la entidad federativa correspondiente.'];
  }

  if (cfg.categorySlug === 'familiar') {
    return ['Código Civil o familiar aplicable en la entidad federativa correspondiente.'];
  }

  if (cfg.categorySlug === 'patrimonial') {
    return ['Código Civil, legislación notarial y reglas sucesorias aplicables en la entidad federativa correspondiente.'];
  }

  return [];
}

function daysBetween(start, end) {
  if (!start || !end) return 0;
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);
  const diff = endDate - startDate;
  if (!Number.isFinite(diff) || diff <= 0) return 0;
  return Math.floor(diff / 86400000);
}

function yearsBetween(start, end) {
  return daysBetween(start, end) / 365;
}

function vacationDaysForYears(years) {
  const fullYears = Math.max(0, Math.floor(years));
  if (fullYears <= 0) return 0;
  if (fullYears === 1) return 12;
  if (fullYears === 2) return 14;
  if (fullYears === 3) return 16;
  if (fullYears === 4) return 18;
  if (fullYears === 5) return 20;
  return 20 + Math.ceil((fullYears - 5) / 5) * 2;
}

function faqMarkup(faq) {
  return faq
    .map(
      (item) => `
        <details class="faq-item">
          <summary>${esc(item.q)}</summary>
          <p>${esc(item.a)}</p>
        </details>
      `,
    )
    .join('');
}

function relatedMarkup(items) {
  return items
    .map(
      (item) => `
        <a class="card-link" href="${item.href}">
          <div class="card-kicker">${esc(item.kicker)}</div>
          <h3>${esc(item.title)}</h3>
          <p>${esc(item.desc)}</p>
        </a>
      `,
    )
    .join('');
}

function redirectPage(cfg) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: cfg.title,
    url: `${SITE_URL}${cfg.url}`,
    description: cfg.description || '',
  };

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(cfg.title)}</title>
  <meta name="description" content="${esc(cfg.description || '')}">
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="${SITE_URL}${cfg.redirectTo}">
  <meta http-equiv="refresh" content="0; url=${cfg.redirectTo}">
  <meta property="og:title" content="${esc(cfg.title)}">
  <meta property="og:description" content="${esc(cfg.description || '')}">
  <meta property="og:url" content="${SITE_URL}${cfg.url}">
  <meta property="og:type" content="website">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
  <script>
    window.location.replace(${JSON.stringify(cfg.redirectTo)});
  </script>
</head>
<body>
  <p>Redirigiendo a <a href="${cfg.redirectTo}">${esc(cfg.redirectTo)}</a>...</p>
</body>
</html>`;
}

function calculatorPage(cfg) {
  const isLaborCalculator = cfg.categorySlug === 'laboral' && String(cfg.formulaKey || '').startsWith('labor-');
  const fields = cfg.fields.map((field) => calcFieldMarkup(field, cfg)).join('\n');
  const faq = faqMarkup(cfg.faq);
  const faqLead = cfg.faqLead || 'Respuestas rápidas para ubicar el escenario y decidir el siguiente paso.';
  const legalBasis = legalBasisForCalculator(cfg);
  const legalBasisMarkup = isLaborCalculator
    ? `
      <div class="legal-basis">
        <div class="legal-basis-kicker">Sustento legal 2026</div>
        <ul id="legalBasisList">
          <li>Completa la simulación para ver los artículos aplicados.</li>
        </ul>
      </div>
    `
    : legalBasis.length
    ? `
      <div class="legal-basis">
        <div class="legal-basis-kicker">Sustento legal 2026</div>
        <ul>
          ${legalBasis.map((item) => `<li>${esc(item)}</li>`).join('')}
        </ul>
      </div>
    `
    : '';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: cfg.title,
    url: `${SITE_URL}${cfg.url}`,
    description: cfg.description,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: cfg.breadcrumb.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${SITE_URL}${item.href}`,
      })),
    },
  };

  const fieldConfig = JSON.stringify(cfg.fields, null, 2);
  const formAttrs = isLaborCalculator
    ? 'id="calc-form" novalidate autocomplete="off"'
    : 'id="calc-form" onsubmit="return false;"';
  const actionButtonsMarkup = isLaborCalculator
    ? `<div class="calc-actions">
                  <button class="calc-button" type="submit" id="calcButton">${esc(cfg.buttonLabel || 'Calcular estimación')}</button>
                  <button class="calc-button calc-button-secondary" type="button" id="resetCalcButton">${esc(cfg.resetButtonLabel || 'Nueva simulación')}</button>
                </div>`
    : `<button class="calc-button" type="button" id="calcButton">${esc(cfg.buttonLabel || 'Calcular estimación')}</button>`;
  const laborActionStyles = isLaborCalculator
    ? '.calc-actions{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:0.8rem;align-items:center;}.calc-button-secondary{width:auto;background:transparent;border:1px solid rgba(197,160,89,0.45);color:var(--gold);padding-inline:1.1rem;}.calc-button-secondary:hover{background:rgba(197,160,89,0.12);color:var(--white);}'
    : '';
  const laborMobileActionStyles = isLaborCalculator ? '.calc-actions{grid-template-columns:1fr;}' : '';
  const inlineRuntime = isLaborCalculator ? '' : `const calcConfig = window.__SIGLEP_CALC__;
    const calcMeta = window.__SIGLEP_CALC_META__ || {};
    const money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

    function num(id) {
      const el = document.getElementById(id);
      return el && el.value !== '' ? Number(el.value) || 0 : 0;
    }

    function dateValue(id) {
      const el = document.getElementById(id);
      return el && el.value ? el.value : '';
    }

    function selectedMultiplier(field) {
      const el = document.getElementById(field.id);
      const value = el ? el.value : '';
      if (field.multiplierMap && Object.prototype.hasOwnProperty.call(field.multiplierMap, value)) {
        return field.multiplierMap[value];
      }
      return field.multiplier ?? 1;
    }

    function daysBetween(start, end) {
      if (!start || !end) return 0;
      const startDate = new Date(start + 'T00:00:00');
      const endDate = new Date(end + 'T00:00:00');
      const diff = endDate - startDate;
      if (!Number.isFinite(diff) || diff <= 0) return 0;
      return Math.floor(diff / 86400000);
    }

    function yearsBetween(start, end) {
      return daysBetween(start, end) / 365;
    }

    function vacationDaysForYears(years) {
      const fullYears = Math.max(0, Math.floor(years));
      if (fullYears <= 0) return 0;
      if (fullYears === 1) return 12;
      if (fullYears === 2) return 14;
      if (fullYears === 3) return 16;
      if (fullYears === 4) return 18;
      if (fullYears === 5) return 20;
      return 20 + Math.ceil((fullYears - 5) / 5) * 2;
    }

    function runCalc() {
      const breakdown = [];
      let total = ${cfg.baseAmount || 0};

      if (calcMeta.formulaKey === 'labor-liquidation') {
        const salary = num('salario_diario');
        const years = yearsBetween(dateValue('fecha_ingreso'), dateValue('fecha_terminacion'));
        const vacationDays = vacationDaysForYears(years);
        const termination = selectedMultiplier({ id: 'terminacion', multiplierMap: { injustificado: 22000, renuncia: 6500, mutuo: 12000 } });
        const indemnizacion = salary * 90;
        const seniority = salary * 20 * years;
        const proporcional = salary * vacationDays * 0.25 * Math.max(0.25, Math.min(1, years / 5));
        breakdown.push(['Indemnización base', money.format(Math.round(indemnizacion))]);
        breakdown.push(['Antigüedad estimada', money.format(Math.round(seniority))]);
        breakdown.push(['Vacaciones y prima', money.format(Math.round(proporcional))]);
        breakdown.push(['Tipo de terminación', money.format(Math.round(termination))]);
        total += indemnizacion + seniority + proporcional + termination;
      } else if (calcMeta.formulaKey === 'labor-finiquito') {
        const salary = num('salario_diario');
        const years = yearsBetween(dateValue('fecha_ingreso'), dateValue('fecha_terminacion'));
        const days = daysBetween(dateValue('fecha_ingreso'), dateValue('fecha_terminacion'));
        const vacationDays = vacationDaysForYears(years);
        const aguinaldo = salary * 15 * (days / 365);
        const vacaciones = salary * vacationDays * 0.25 * (days / 365);
        const salariosPendientes = salary * Math.max(0, Math.min(15, days % 15));
        breakdown.push(['Salarios pendientes', money.format(Math.round(salariosPendientes))]);
        breakdown.push(['Aguinaldo proporcional', money.format(Math.round(aguinaldo))]);
        breakdown.push(['Vacaciones proporcionales', money.format(Math.round(vacaciones))]);
        total += salariosPendientes + aguinaldo + vacaciones;
      } else if (calcMeta.formulaKey === 'labor-despido') {
        const salary = num('salario_diario');
        const years = yearsBetween(dateValue('fecha_ingreso'), dateValue('fecha_terminacion'));
        const vacationDays = vacationDaysForYears(years);
        const termination = selectedMultiplier({ id: 'terminacion', multiplierMap: { sin_causa: 28000, verbal: 18000, escrita: 22000 } });
        const indemnizacion = salary * 90;
        const seniority = salary * 20 * years;
        const proporcional = salary * vacationDays * 0.25;
        breakdown.push(['Indemnización base', money.format(Math.round(indemnizacion))]);
        breakdown.push(['Prima de antigüedad', money.format(Math.round(seniority))]);
        breakdown.push(['Vacaciones y prima', money.format(Math.round(proporcional))]);
        breakdown.push(['Tipo de terminación', money.format(Math.round(termination))]);
        total += indemnizacion + seniority + proporcional + termination;
      } else if (calcMeta.formulaKey === 'labor-hours') {
        const tarifa = num('tarifa_hora');
        const horas = num('horas_extras');
        const semanas = num('semanas');
        const factor = selectedMultiplier({ id: 'recargo', multiplierMap: { simple: 1.5, doble: 2, triple: 3 } });
        const totalHoras = tarifa * horas * semanas * factor;
        breakdown.push(['Tarifa base', money.format(Math.round(tarifa))]);
        breakdown.push(['Horas extra', money.format(Math.round(horas))]);
        breakdown.push(['Semanas trabajadas', money.format(Math.round(semanas))]);
        breakdown.push(['Recargo aplicado', factor.toFixed(1) + 'x']);
        total += totalHoras;
      } else if (calcMeta.formulaKey === 'labor-aguinaldo') {
        const salary = num('salario_diario');
        const years = yearsBetween(dateValue('fecha_ingreso'), dateValue('fecha_terminacion'));
        const days = daysBetween(dateValue('fecha_ingreso'), dateValue('fecha_terminacion'));
        const vacationDays = vacationDaysForYears(years);
        const aguinaldo = salary * 15 * (days / 365);
        const prima = salary * vacationDays * 0.25 * (days / 365);
        breakdown.push(['Aguinaldo legal', money.format(Math.round(aguinaldo))]);
        breakdown.push(['Prima vacacional', money.format(Math.round(prima))]);
        total += aguinaldo + prima;
      } else {
        calcConfig.forEach((field) => {
          let contribution = 0;
          if (field.type === 'select') {
            const el = document.getElementById(field.id);
            const label = el && el.options[el.selectedIndex] ? el.options[el.selectedIndex].textContent : field.label;
            const factor = selectedMultiplier(field);
            contribution = factor;
            breakdown.push([label, money.format(Math.round(contribution))]);
            total += contribution;
            return;
          }

          const value = num(field.id);
          contribution = value * (field.multiplier ?? 1);
          breakdown.push([field.label, money.format(Math.round(contribution))]);
          total += contribution;
        });
      }

      document.getElementById('resultAmount').textContent = money.format(Math.max(0, Math.round(total)));
      document.getElementById('resultBreakdown').innerHTML = breakdown
        .map(([label, amount]) => '<div class="breakdown-row"><span>' + label + '</span><strong>' + amount + '</strong></div>')
        .join('');
    }

    document.getElementById('calcButton').addEventListener('click', runCalc);
    runCalc();`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(cfg.title)}</title>
  <meta name="description" content="${esc(cfg.description)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${SITE_URL}${cfg.url}">
  <meta property="og:title" content="${esc(cfg.ogTitle || cfg.title)}">
  <meta property="og:description" content="${esc(cfg.ogDescription || cfg.description)}">
  <meta property="og:url" content="${SITE_URL}${cfg.url}">
  <meta property="og:type" content="website">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --navy:#1A365D;--navy-deep:#0F2240;--gold:#C5A059;--gold-light:#D4B878;--red:#C0392B;--red-dark:#96281B;
      --black:#080C14;--white:#FAFAF8;--gray-light:#F0EEE8;--text-body:#2D3748;--font-display:'Cormorant Garamond',serif;--font-body:'Montserrat',sans-serif;
    }
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    html{scroll-behavior:smooth;}
    body{font-family:var(--font-body);background:var(--white);color:var(--text-body);overflow-x:hidden;}
    main{display:block;}
    .hero{min-height:72vh;padding:8rem 1.25rem 4rem;background:linear-gradient(145deg,#050810 0%,#0A1628 40%,#0F2240 70%,#111B30 100%);position:relative;overflow:hidden;}
    .hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 55% 55% at 75% 45%,rgba(197,160,89,0.07) 0%,transparent 65%),radial-gradient(ellipse 35% 50% at 10% 85%,rgba(192,57,43,0.07) 0%,transparent 60%);pointer-events:none;}
    .hero-inner,.section-inner,.footer-inner,.footer-bottom{max-width:1180px;margin:0 auto;position:relative;z-index:1;}
    .eyebrow{font-size:0.66rem;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:var(--gold);margin-bottom:1rem;display:flex;align-items:center;gap:0.7rem;}
    .eyebrow::before{content:'';width:34px;height:1px;background:var(--gold);display:block;}
    h1{font-family:var(--font-display);font-size:clamp(2.4rem,5.8vw,4.6rem);line-height:1.05;color:var(--white);margin-bottom:1rem;}
    h1 em{font-style:italic;color:var(--gold);}
    .lead{max-width:760px;font-size:1rem;line-height:1.85;color:${isLaborCalculator ? '#E2E8F0' : 'rgba(255,255,255,0.68)'};font-weight:300;margin-bottom:2rem;}
    .breadcrumbs{display:flex;flex-wrap:wrap;gap:0.55rem;align-items:center;font-size:0.65rem;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:1.5rem;}
    .breadcrumbs a{color:rgba(197,160,89,0.75);text-decoration:none;}
    .breadcrumbs span.sep{color:rgba(255,255,255,0.18);}
    .hero-actions{display:flex;flex-wrap:wrap;gap:0.9rem;align-items:center;}
    .btn{display:inline-flex;align-items:center;justify-content:center;padding:0.95rem 1.35rem;border-radius:2px;text-decoration:none;font-size:0.78rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;transition:transform .2s ease,background .2s ease,color .2s ease;border:1px solid transparent;}
    .btn-primary{background:var(--red);color:#fff;box-shadow:0 4px 18px rgba(192,57,43,0.35);}
    .btn-primary:hover{background:var(--red-dark);transform:translateY(-2px);}
    .btn-secondary{background:transparent;border-color:rgba(197,160,89,0.5);color:var(--gold);}
    .btn-secondary:hover{background:var(--gold);color:var(--navy-deep);transform:translateY(-2px);}
    .section{padding:5rem 1.25rem;}
    .section h2{font-family:var(--font-display);font-size:clamp(1.9rem,4vw,3rem);line-height:1.1;color:var(--navy-deep);margin-bottom:0.9rem;}
    .section h2 em{font-style:italic;color:var(--gold);}
    .section p.lead{color:#4A5568;max-width:800px;margin-bottom:0;}
    .calc-grid{display:grid;grid-template-columns:1.1fr 0.9fr;gap:1.5rem;margin-top:2.5rem;align-items:start;}
    .panel{background:var(--white);border:1px solid rgba(197,160,89,0.16);border-radius:14px;box-shadow:0 12px 40px rgba(15,34,64,0.08);overflow:hidden;}
    .panel.dark{background:linear-gradient(180deg,#0F2240 0%,#08111f 100%);border-color:rgba(197,160,89,0.18);}
    .panel-head{padding:1.35rem 1.35rem 1rem;border-bottom:1px solid rgba(197,160,89,0.12);}
    .panel-head .kicker{font-size:0.62rem;letter-spacing:0.22em;text-transform:uppercase;font-weight:700;color:var(--gold);}
    .panel-head h3{font-family:var(--font-display);font-size:1.6rem;line-height:1.1;color:inherit;margin-top:0.4rem;}
    .panel-head p{color:inherit;font-size:0.86rem;line-height:1.7;font-weight:300;opacity:0.86;margin-top:0.55rem;}
    .panel.dark .panel-head p,
    .panel.dark .help,
    .panel.dark .note{
      color:#E2E8F0;
      opacity:0.96;
    }
    .panel-body{padding:1.35rem;}
    .field{display:grid;gap:0.45rem;margin-bottom:1rem;}
    .field label{font-size:0.66rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--gold);}
    .field input,.field select{width:100%;padding:0.92rem 0.95rem;border-radius:10px;border:1px solid rgba(197,160,89,0.22);background:rgba(255,255,255,0.08);color:inherit;font-family:var(--font-body);font-size:0.92rem;outline:none;}
    .panel.dark .field input,
    .panel.dark .field select{
      color:var(--white);
      -webkit-text-fill-color:var(--white);
      caret-color:var(--gold);
      background:rgba(255,255,255,0.06);
    }
    .panel.dark .field input::placeholder{
      color:rgba(250,250,248,0.55);
    }
    .panel.dark .field select option{
      color:var(--navy-deep);
    }
    .field select{appearance:none;}
    .help{font-size:0.72rem;line-height:1.55;color:#718096;}
    .calc-button{width:100%;margin-top:0.4rem;padding:0.95rem 1rem;border:0;border-radius:10px;background:var(--red);color:#fff;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;transition:transform .2s ease,background .2s ease;}
    .calc-button:hover{background:var(--red-dark);transform:translateY(-1px);}${laborActionStyles}
    .result{display:grid;gap:1rem;}
    .result-box{padding:1.3rem;border-radius:14px;background:rgba(197,160,89,0.06);border:1px solid rgba(197,160,89,0.16);}
    .result-kicker{font-size:0.62rem;letter-spacing:0.22em;text-transform:uppercase;font-weight:700;color:var(--gold);margin-bottom:0.6rem;}
    .result-amount{font-family:var(--font-display);font-size:clamp(2.2rem,5vw,3.6rem);line-height:1;color:var(--navy-deep);}
    .result-note{font-size:0.78rem;line-height:1.7;color:#4A5568;margin-top:0.8rem;}
    .legal-basis{
      margin-top:1rem;
      padding-top:1rem;
      border-top:1px solid rgba(197,160,89,0.16);
    }
    .legal-basis-kicker{
      font-size:0.6rem;
      letter-spacing:0.22em;
      text-transform:uppercase;
      font-weight:700;
      color:var(--gold);
      margin-bottom:0.55rem;
    }
    .legal-basis ul{
      list-style:none;
      display:grid;
      gap:0.55rem;
    }
    .legal-basis li{
      font-size:0.76rem;
      line-height:1.65;
      color:#4A5568;
      padding-left:0.9rem;
      position:relative;
    }
    .legal-basis li::before{
      content:'•';
      position:absolute;
      left:0;
      color:var(--gold);
    }
    .breakdown{display:grid;gap:0.55rem;margin-top:1rem;}
    .breakdown-row{display:flex;justify-content:space-between;gap:1rem;font-size:0.84rem;color:#334155;border-top:1px solid rgba(197,160,89,0.12);padding-top:0.55rem;}
    .breakdown-row strong{color:var(--navy-deep);}
    .faq-grid{display:grid;gap:0.85rem;margin-top:2rem;}
    .faq-item{border:1px solid rgba(197,160,89,0.16);border-radius:14px;background:var(--white);overflow:hidden;}
    .faq-item summary{cursor:pointer;list-style:none;padding:1rem 1.1rem;font-weight:600;color:var(--navy-deep);}
    .faq-item summary::-webkit-details-marker{display:none;}
    .faq-item p{padding:0 1.1rem 1.1rem;color:#4A5568;font-size:0.86rem;line-height:1.75;}
    .cta-band{padding:4rem 1.25rem;background:linear-gradient(135deg,#0a1628 0%,#0f2240 55%,#0a1628 100%);border-top:1px solid rgba(197,160,89,0.15);border-bottom:1px solid rgba(197,160,89,0.15);text-align:center;}
    .cta-band h2{color:var(--white);}
    .cta-band p{margin:0 auto 1.8rem;color:rgba(255,255,255,0.62);max-width:760px;}
    .alt-band{background:var(--gray-light);}
    .note{font-size:0.8rem;line-height:1.7;color:#718096;margin-top:1rem;}
    .footer-space{height:1px;}
    @media (max-width: 900px){.calc-grid{grid-template-columns:1fr}${laborMobileActionStyles}.hero{padding-top:7.6rem}}
  </style>
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
  ${SHELL_NAV_STYLE}
  <script defer src="${SHELL_SCRIPT}"></script>
</head>
<body>
  ${SHELL_NAV_HTML}
  <main>
    <section class="hero">
      <div class="hero-inner">
        <div class="breadcrumbs">
          ${cfg.breadcrumb.map((item, index) => `${index ? '<span class="sep">›</span>' : ''}${index < cfg.breadcrumb.length - 1 ? `<a href="${item.href}">${esc(item.name)}</a>` : `<span>${esc(item.name)}</span>`}`).join('')}
        </div>
        <div class="eyebrow">${esc(cfg.eyebrow)}</div>
        <h1>${cfg.heroTitle}</h1>
        <p class="lead">${esc(cfg.heroLead)}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="${areaNavigationFor(cfg.categorySlug).href}">${esc(areaNavigationFor(cfg.categorySlug).label)}</a>
          <a class="btn btn-secondary" href="${CONSULTATION_URL}" target="_blank" rel="noopener noreferrer">Agendar Consulta</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-inner">
        <h2>${cfg.sectionTitle}</h2>
        <p class="lead">${esc(cfg.sectionLead)}</p>
        <div class="calc-grid">
          <div class="panel dark">
            <div class="panel-head">
              <div class="kicker">${esc(cfg.formKicker)}</div>
              <h3>${esc(cfg.formTitle)}</h3>
              <p>${esc(cfg.formLead)}</p>
            </div>
            <div class="panel-body">
              <form ${formAttrs}>
                ${fields}
                ${actionButtonsMarkup}
              </form>
            </div>
          </div>
          <div class="panel">
            <div class="panel-head">
              <div class="kicker">${esc(cfg.resultKicker || 'Resultado orientativo')}</div>
              <h3>${esc(cfg.resultTitle)}</h3>
              <p>${esc(cfg.resultLead)}</p>
            </div>
            <div class="panel-body">
              <div class="result">
                <div class="result-box">
                  <div class="result-kicker">${esc(cfg.resultLabel)}</div>
                  <div class="result-amount" id="resultAmount">$0 MXN</div>
                  <div class="breakdown" id="resultBreakdown"></div>
                  <p class="result-note">${esc(cfg.resultNote)}</p>
                  ${legalBasisMarkup}
                </div>
                <div class="note">${esc(cfg.note)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt-band">
      <div class="section-inner">
        <h2>Preguntas frecuentes</h2>
        <p class="lead">${esc(faqLead)}</p>
        <div class="faq-grid">
          ${faq}
        </div>
      </div>
    </section>

    <section class="cta-band">
      <div class="section-inner">
        <h2>${cfg.ctaBandTitle}</h2>
        <p>${esc(cfg.ctaBandLead)}</p>
        <div class="hero-actions" style="justify-content:center;">
          <a class="btn btn-primary" href="${areaNavigationFor(cfg.categorySlug).href}">Ir al Área Correspondiente</a>
          <a class="btn btn-secondary" href="${CONSULTATION_URL}" target="_blank" rel="noopener noreferrer">Agendar Consulta</a>
        </div>
      </div>
    </section>
    <div class="footer-space"></div>
  </main>
  <footer></footer>
  <script>
    window.__SIGLEP_CALC__ = ${fieldConfig};
    window.__SIGLEP_CALC_META__ = ${JSON.stringify({ formulaKey: cfg.formulaKey || null })};
    ${inlineRuntime}
  </script>${isLaborCalculator ? `
  <script defer src="/shared/labor-calculator.js"></script>` : ''}
</body>
</html>`;
}

function categoryPage(cfg) {
  const cards = cfg.cards
    .map(
      (card) => `
        <a class="card-link" href="${card.href}">
          <div class="card-kicker">${esc(card.kicker)}</div>
          <h3>${esc(card.title)}</h3>
          <p>${esc(card.desc)}</p>
        </a>
      `,
    )
    .join('');
  const breadcrumb = cfg.breadcrumb || [];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: cfg.title,
    url: `${SITE_URL}${cfg.url}`,
    description: cfg.description,
  };

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(cfg.title)}</title>
  <meta name="description" content="${esc(cfg.description)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${SITE_URL}${cfg.url}">
  <meta property="og:title" content="${esc(cfg.ogTitle || cfg.title)}">
  <meta property="og:description" content="${esc(cfg.ogDescription || cfg.description)}">
  <meta property="og:url" content="${SITE_URL}${cfg.url}">
  <meta property="og:type" content="website">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --navy:#1A365D;--navy-deep:#0F2240;--gold:#C5A059;--gold-light:#D4B878;--red:#C0392B;--red-dark:#96281B;
      --black:#080C14;--white:#FAFAF8;--gray-light:#F0EEE8;--text-body:#2D3748;--font-display:'Cormorant Garamond',serif;--font-body:'Montserrat',sans-serif;
    }
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    html{scroll-behavior:smooth;}
    body{font-family:var(--font-body);background:var(--white);color:var(--text-body);overflow-x:hidden;}
    .hero{min-height:64vh;padding:8rem 1.25rem 4rem;background:linear-gradient(145deg,#050810 0%,#0A1628 40%,#0F2240 70%,#111B30 100%);position:relative;overflow:hidden;}
    .hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 55% 55% at 75% 45%,rgba(197,160,89,0.07) 0%,transparent 65%);pointer-events:none;}
    .hero-inner,.section-inner{max-width:1180px;margin:0 auto;position:relative;z-index:1;}
    .eyebrow{font-size:0.66rem;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:var(--gold);margin-bottom:1rem;display:flex;align-items:center;gap:0.7rem;}
    .eyebrow::before{content:'';width:34px;height:1px;background:var(--gold);display:block;}
    h1{font-family:var(--font-display);font-size:clamp(2.4rem,5.8vw,4.6rem);line-height:1.05;color:var(--white);margin-bottom:1rem;}
    h1 em{font-style:italic;color:var(--gold);}
    .lead{max-width:760px;font-size:1rem;line-height:1.85;color:rgba(255,255,255,0.68);font-weight:300;margin-bottom:2rem;}
    .breadcrumbs{display:flex;flex-wrap:wrap;gap:0.55rem;align-items:center;font-size:0.65rem;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:1.5rem;}
    .breadcrumbs a{color:rgba(197,160,89,0.75);text-decoration:none;}
    .breadcrumbs span.sep{color:rgba(255,255,255,0.18);}
    .btn{display:inline-flex;align-items:center;justify-content:center;padding:0.95rem 1.35rem;border-radius:2px;text-decoration:none;font-size:0.78rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;transition:transform .2s ease,background .2s ease,color .2s ease;border:1px solid transparent;}
    .btn-primary{background:var(--red);color:#fff;box-shadow:0 4px 18px rgba(192,57,43,0.35);}
    .btn-primary:hover{background:var(--red-dark);transform:translateY(-2px);}
    .btn-secondary{background:transparent;border-color:rgba(197,160,89,0.5);color:var(--gold);}
    .btn-secondary:hover{background:var(--gold);color:var(--navy-deep);transform:translateY(-2px);}
    .section{padding:5rem 1.25rem;}
    .section h2{font-family:var(--font-display);font-size:clamp(1.9rem,4vw,3rem);line-height:1.1;color:var(--navy-deep);margin-bottom:0.9rem;}
    .section h2 em{font-style:italic;color:var(--gold);}
    .section p.lead{color:#4A5568;max-width:800px;margin-bottom:0;}
    .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:1rem;margin-top:2rem;}
    .card-link{display:block;padding:1.15rem;border-radius:14px;border:1px solid rgba(197,160,89,0.16);background:var(--white);text-decoration:none;color:inherit;transition:transform .2s ease,background .2s ease,border-color .2s ease;}
    .card-link:hover{transform:translateY(-2px);background:#0F2240;border-color:rgba(197,160,89,0.35);}
    .card-link:hover h3,.card-link:hover p{color:#fff;}
    .card-link h3{font-family:var(--font-display);font-size:1.25rem;color:var(--navy-deep);margin:0.2rem 0 0.4rem;}
    .card-link p{font-size:0.82rem;line-height:1.7;color:#4A5568;}
    .card-kicker{font-size:0.6rem;letter-spacing:0.2em;text-transform:uppercase;font-weight:700;color:var(--gold);}
    .faq-grid{display:grid;gap:0.85rem;margin-top:2rem;}
    .faq-item{border:1px solid rgba(197,160,89,0.16);border-radius:14px;background:var(--white);overflow:hidden;}
    .faq-item summary{cursor:pointer;list-style:none;padding:1rem 1.1rem;font-weight:600;color:var(--navy-deep);}
    .faq-item summary::-webkit-details-marker{display:none;}
    .faq-item p{padding:0 1.1rem 1.1rem;color:#4A5568;font-size:0.86rem;line-height:1.75;}
    .cta-band{padding:4rem 1.25rem;background:linear-gradient(135deg,#0a1628 0%,#0f2240 55%,#0a1628 100%);border-top:1px solid rgba(197,160,89,0.15);border-bottom:1px solid rgba(197,160,89,0.15);text-align:center;}
    .cta-band h2{color:var(--white);}
    .cta-band p{margin:0 auto 1.8rem;color:rgba(255,255,255,0.62);max-width:760px;}
    .footer-space{height:1px;}
    @media (max-width: 900px){.hero{padding-top:7.6rem}}
  </style>
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
  ${SHELL_NAV_STYLE}
  <script defer src="${SHELL_SCRIPT}"></script>
</head>
<body>
  ${SHELL_NAV_HTML}
  <main>
    <section class="hero">
      <div class="hero-inner">
        <div class="breadcrumbs">
          ${breadcrumb.map((item, index) => `${index ? '<span class="sep">›</span>' : ''}${index < breadcrumb.length - 1 ? `<a href="${item.href}">${esc(item.name)}</a>` : `<span>${esc(item.name)}</span>`}`).join('')}
        </div>
        <div class="eyebrow">${esc(cfg.eyebrow)}</div>
        <h1>${cfg.heroTitle}</h1>
        <p class="lead">${esc(cfg.heroLead)}</p>
        <div style="display:flex;gap:0.9rem;flex-wrap:wrap;">
          <a class="btn btn-primary" href="${cfg.primaryHref}">${esc(cfg.primaryLabel)}</a>
          <a class="btn btn-secondary" href="${cfg.secondaryHref}" target="_blank" rel="noopener noreferrer">${esc(cfg.secondaryLabel)}</a>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="section-inner">
        <h2>${cfg.sectionTitle}</h2>
        <p class="lead">${esc(cfg.sectionLead)}</p>
        <div class="cards">
          ${cards}
        </div>
      </div>
    </section>
    <section class="section" style="background:var(--gray-light);">
      <div class="section-inner">
        <h2>Preguntas frecuentes</h2>
        <p class="lead">${esc(cfg.faqLead)}</p>
        <div class="faq-grid">
          ${faqMarkup(cfg.faq)}
        </div>
      </div>
    </section>
    <section class="cta-band">
      <div class="section-inner">
        <h2>${cfg.ctaBandTitle}</h2>
        <p>${esc(cfg.ctaBandLead)}</p>
        <div style="display:flex;gap:0.9rem;justify-content:center;flex-wrap:wrap;">
          <a class="btn btn-primary" href="${cfg.primaryHref}">${esc(cfg.primaryLabel)}</a>
          <a class="btn btn-secondary" href="${cfg.secondaryHref}" target="_blank" rel="noopener noreferrer">${esc(cfg.secondaryLabel)}</a>
        </div>
      </div>
    </section>
    <div class="footer-space"></div>
  </main>
  <footer></footer>
</body>
</html>`;
}

function hubPage(cfg) {
  const categoryCards = cfg.categories
    .map(
      (cat) => `
        <a class="card-link" href="${cat.href}">
          <div class="card-kicker">${esc(cat.kicker)}</div>
          <h3>${esc(cat.title)}</h3>
          <p>${esc(cat.desc)}</p>
        </a>
      `,
    )
    .join('');

  const calcCards = cfg.calculators
    .map(
      (calc) => `
        <a class="card-link" href="${calc.href}">
          <div class="card-kicker">${esc(calc.category)}</div>
          <h3>${esc(calc.title)}</h3>
          <p>${esc(calc.desc)}</p>
        </a>
      `,
    )
    .join('');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: cfg.title,
    url: `${SITE_URL}${cfg.url}`,
    description: cfg.description,
  };

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(cfg.title)}</title>
  <meta name="description" content="${esc(cfg.description)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${SITE_URL}${cfg.url}">
  <meta property="og:title" content="${esc(cfg.title)}">
  <meta property="og:description" content="${esc(cfg.description)}">
  <meta property="og:url" content="${SITE_URL}${cfg.url}">
  <meta property="og:type" content="website">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --navy:#1A365D;--navy-deep:#0F2240;--gold:#C5A059;--gold-light:#D4B878;--red:#C0392B;--red-dark:#96281B;
      --black:#080C14;--white:#FAFAF8;--gray-light:#F0EEE8;--text-body:#2D3748;--font-display:'Cormorant Garamond',serif;--font-body:'Montserrat',sans-serif;
    }
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    html{scroll-behavior:smooth;}
    body{font-family:var(--font-body);background:var(--white);color:var(--text-body);overflow-x:hidden;}
    .hero{min-height:68vh;padding:8rem 1.25rem 4rem;background:linear-gradient(145deg,#050810 0%,#0A1628 40%,#0F2240 70%,#111B30 100%);position:relative;overflow:hidden;}
    .hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 55% 55% at 75% 45%,rgba(197,160,89,0.07) 0%,transparent 65%);pointer-events:none;}
    .hero-inner,.section-inner{max-width:1180px;margin:0 auto;position:relative;z-index:1;}
    .eyebrow{font-size:0.66rem;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:var(--gold);margin-bottom:1rem;display:flex;align-items:center;gap:0.7rem;}
    .eyebrow::before{content:'';width:34px;height:1px;background:var(--gold);display:block;}
    h1{font-family:var(--font-display);font-size:clamp(2.4rem,5.8vw,4.6rem);line-height:1.05;color:var(--white);margin-bottom:1rem;}
    h1 em{font-style:italic;color:var(--gold);}
    .lead{max-width:760px;font-size:1rem;line-height:1.85;color:rgba(255,255,255,0.68);font-weight:300;margin-bottom:2rem;}
    .btn{display:inline-flex;align-items:center;justify-content:center;padding:0.95rem 1.35rem;border-radius:2px;text-decoration:none;font-size:0.78rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;transition:transform .2s ease,background .2s ease,color .2s ease;border:1px solid transparent;}
    .btn-primary{background:var(--red);color:#fff;box-shadow:0 4px 18px rgba(192,57,43,0.35);}
    .btn-primary:hover{background:var(--red-dark);transform:translateY(-2px);}
    .btn-secondary{background:transparent;border-color:rgba(197,160,89,0.5);color:var(--gold);}
    .btn-secondary:hover{background:var(--gold);color:var(--navy-deep);transform:translateY(-2px);}
    .section{padding:5rem 1.25rem;}
    .section h2{font-family:var(--font-display);font-size:clamp(1.9rem,4vw,3rem);line-height:1.1;color:var(--navy-deep);margin-bottom:0.9rem;}
    .section p.lead{color:#4A5568;max-width:800px;margin-bottom:0;}
    .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:1rem;margin-top:2rem;}
    .card-link{display:block;padding:1.15rem;border-radius:14px;border:1px solid rgba(197,160,89,0.16);background:var(--white);text-decoration:none;color:inherit;transition:transform .2s ease,background .2s ease,border-color .2s ease;}
    .card-link:hover{transform:translateY(-2px);background:#0F2240;border-color:rgba(197,160,89,0.35);}
    .card-link:hover h3,.card-link:hover p{color:#fff;}
    .card-link h3{font-family:var(--font-display);font-size:1.25rem;color:var(--navy-deep);margin:0.2rem 0 0.4rem;}
    .card-link p{font-size:0.82rem;line-height:1.7;color:#4A5568;}
    .card-kicker{font-size:0.6rem;letter-spacing:0.2em;text-transform:uppercase;font-weight:700;color:var(--gold);}
    .cta-band{padding:4rem 1.25rem;background:linear-gradient(135deg,#0a1628 0%,#0f2240 55%,#0a1628 100%);border-top:1px solid rgba(197,160,89,0.15);border-bottom:1px solid rgba(197,160,89,0.15);text-align:center;}
    .cta-band h2{color:var(--white);}
    .cta-band p{margin:0 auto 1.8rem;color:rgba(255,255,255,0.62);max-width:760px;}
    .footer-space{height:1px;}
    @media (max-width: 900px){.hero{padding-top:7.6rem}}
  </style>
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
  ${SHELL_NAV_STYLE}
  <script defer src="${SHELL_SCRIPT}"></script>
</head>
<body>
  ${SHELL_NAV_HTML}
  <main>
    <section class="hero">
      <div class="hero-inner">
        ${cfg.eyebrow ? `<div class="eyebrow">${esc(cfg.eyebrow)}</div>` : ''}
        <h1>${cfg.heroTitle}</h1>
        ${cfg.heroLead ? `<p class="lead">${esc(cfg.heroLead)}</p>` : ''}
        ${cfg.primaryLabel || cfg.secondaryLabel ? `
        <div style="display:flex;gap:0.9rem;flex-wrap:wrap;">
          ${cfg.primaryLabel ? `<a class="btn btn-primary" href="${cfg.primaryHref}">${esc(cfg.primaryLabel)}</a>` : ''}
          ${cfg.secondaryLabel ? `<a class="btn btn-secondary" href="${cfg.secondaryHref}" target="_blank" rel="noopener noreferrer">${esc(cfg.secondaryLabel)}</a>` : ''}
        </div>` : ''}
      </div>
    </section>
    <section class="section">
      <div class="section-inner">
        <h2>${cfg.sectionTitle}</h2>
        <p class="lead">${esc(cfg.sectionLead)}</p>
        <div class="cards">
          ${categoryCards}
        </div>
      </div>
    </section>
    <section class="section" style="background:var(--gray-light);">
      <div class="section-inner">
        <h2>Calculadoras destacadas</h2>
        <p class="lead">Todas las calculadoras nuevas están agrupadas por área para facilitar la navegación.</p>
        <div class="cards">
          ${calcCards}
        </div>
      </div>
    </section>
    ${cfg.ctaBandTitle || cfg.ctaBandLead ? `
    <section class="cta-band">
      <div class="section-inner">
        <h2>${cfg.ctaBandTitle}</h2>
        <p>${esc(cfg.ctaBandLead)}</p>
        <div style="display:flex;gap:0.9rem;justify-content:center;flex-wrap:wrap;">
          ${cfg.primaryLabel ? `<a class="btn btn-primary" href="${cfg.primaryHref}">${esc(cfg.primaryLabel)}</a>` : ''}
          ${cfg.secondaryLabel ? `<a class="btn btn-secondary" href="${cfg.secondaryHref}" target="_blank" rel="noopener noreferrer">${esc(cfg.secondaryLabel)}</a>` : ''}
        </div>
      </div>
    </section>` : ''}
    <div class="footer-space"></div>
  </main>
  <footer></footer>
</body>
</html>`;
}

function categoryCardsFor(calculators) {
  return calculators.map((calc) => ({
    href: calc.url,
    kicker: calc.categoryName,
    title: calc.title,
    desc: calc.description ?? calc.desc ?? '',
  }));
}

const CONSULTATION_URL = 'https://calendly.com/hola-siglep/30min';
const AREA_NAVIGATION = {
  laboral: { label: 'Ir al Área Laboral', href: '/laboral/' },
  familiar: { label: 'Ir al Área Familiar', href: '/familiar/' },
  civil: { label: 'Ir al Área Civil', href: '/civil/' },
  patrimonial: { label: 'Ir al Área Patrimonial', href: '/patrimonial/' },
  'seguridad-social': { label: 'Ir al Área de Seguridad Social', href: '/seguridad-social/' },
};

function areaNavigationFor(slug) {
  return AREA_NAVIGATION[slug] || AREA_NAVIGATION.laboral;
}

const calculatorPages = [
  {
    categorySlug: 'laboral',
    categoryName: 'Laboral',
    title: 'Calculadora de Liquidación Laboral | SIGLEP',
    url: '/calculadoras/laboral/liquidacion-laboral/',
    eyebrow: 'Calculadora Laboral',
    heroTitle: 'Liquidación laboral <em>sin perder derechos.</em>',
    heroLead: 'Calcula una referencia orientativa de indemnización y partes proporcionales para llegar mejor preparado a tu revisión legal.',
    description: 'Calculadora orientativa de liquidación laboral en México con salario diario, antigüedad y tipo de terminación.',
    ogTitle: 'Calculadora de Liquidación Laboral | SIGLEP',
    ogDescription: 'Estimación orientativa de liquidación laboral con enfoque en despido injustificado y partes proporcionales.',
    shortTopic: 'liquidación laboral',
    waText: 'Hola SIGLEP, quiero revisar mi liquidación laboral',
    ctaBandTitle: 'Revisa tu liquidación antes de firmar',
    ctaBandLead: 'Una estimación útil te ayuda a no aceptar menos de lo que corresponde. Si el resultado te genera dudas, podemos revisarlo contigo.',
    sectionTitle: 'Estimación rápida para revisar tu escenario',
    sectionLead: 'Introduce datos básicos para obtener una referencia. El resultado es orientativo y debe contrastarse con tu caso real.',
    formKicker: 'Datos base',
    formTitle: 'Cálculo orientativo',
    formLead: 'Captura salario mensual o diario y fechas reales en formato DD/MM/AAAA; el sistema calcula antigüedad y proporcionales automáticamente.',
    resultTitle: 'Monto estimado',
    resultLead: 'Usa esta referencia como punto de partida para tu negociación o revisión legal.',
    resultLabel: 'Estimación orientativa',
    resultNote: 'El cálculo es una aproximación. La cifra final depende de salario integrado, prestaciones y documentos firmados.',
    note: 'Si te despidieron o te pidieron firmar algo, la revisión legal sigue siendo el paso correcto.',
    formulaKey: 'labor-liquidation',
    legalBasis: [
      'Ley Federal del Trabajo: artículos 48, 50, 76, 80 y 87.',
    ],
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Calculadoras', href: '/calculadoras/' },
      { name: 'Laboral', href: '/calculadoras/laboral/' },
      { name: 'Liquidación laboral', href: '/calculadoras/laboral/liquidacion-laboral/' },
    ],
    fields: [
      { id: 'modo_salario', label: 'Tipo de salario', type: 'select', options: [
        { value: 'mensual', label: 'Salario mensual' },
        { value: 'diario', label: 'Salario diario' },
      ], help: 'Selecciona si el monto capturado corresponde al salario mensual o al diario.' },
      { id: 'salario_base', label: 'Salario capturado (mensual o diario)', type: 'number', placeholder: 'Ej. 13500 o 450', help: 'Ingresa el salario que tengas a la mano; el sistema convierte el valor diario cuando corresponde.' },
      { id: 'fecha_ingreso', label: 'Fecha de ingreso (DD/MM/AAAA)', type: 'date', placeholder: 'DD/MM/AAAA', help: 'Sirve para calcular la antiguedad exacta en dias y años.' },
      { id: 'fecha_terminacion', label: 'Fecha de terminacion (DD/MM/AAAA)', type: 'date', placeholder: 'DD/MM/AAAA', help: 'Se usa como fecha de salida o despido para cerrar el periodo laboral.' },
      { id: 'terminacion', label: 'Tipo de terminacion', type: 'select', options: [
        { value: 'injustificado', label: 'Despido injustificado' },
        { value: 'renuncia', label: 'Renuncia voluntaria' },
      ], help: 'Si eliges despido injustificado, el sistema agrega la indemnizacion constitucional y la prima de antiguedad.' },
      { id: 'zona_salario_minimo', label: 'Zona salarial 2026', type: 'select', options: [
        { value: 'general', label: 'Resto del pais' },
        { value: 'frontera', label: 'Frontera norte' },
      ], help: 'Se usa solo para el tope legal de prima de antiguedad con salarios minimos vigentes de 2026.' },
    ],
    faq: [
      { q: '¿La estimación es exacta?', a: 'No. Es una referencia útil para entender el rango general de tu posible liquidación antes de la revisión profesional.' },
      { q: '¿Sirve si ya firmé?', a: 'Sí. Aun si ya firmaste, conviene revisar qué se firmó y si todavía hay margen de acción.' },
      { q: '¿Puedo usarla para negociar?', a: 'Sí. La calculadora sirve como punto de partida para negociar con más información.' },
    ],
  },
  {
    categorySlug: 'laboral',
    categoryName: 'Laboral',
    title: 'Calculadora de Finiquito | SIGLEP',
    url: '/calculadoras/laboral/finiquito/',
    eyebrow: 'Calculadora Laboral',
    heroTitle: 'Finiquito <em>claro y revisable.</em>',
    heroLead: 'Estima conceptos pendientes para una renuncia, terminación o salida negociada sin perder de vista lo que te deben.',
    description: 'Calculadora orientativa de finiquito laboral en México para revisar conceptos pendientes y proporcionales.',
    shortTopic: 'finiquito laboral',
    ctaBandTitle: 'Antes de firmar, revisa el finiquito',
    ctaBandLead: 'Un finiquito puede parecer simple, pero los conceptos proporcionales cambian el monto final.',
    sectionTitle: 'Calcula una referencia de finiquito',
    sectionLead: 'El finiquito no es una cortesía: integra pagos proporcionales y conceptos pendientes.',
    formKicker: 'Escenario',
    formTitle: 'Estimación de finiquito',
    formLead: 'Captura salario mensual o diario y fechas reales en formato DD/MM/AAAA; el sistema calcula los proporcionales automaticamente.',
    resultTitle: 'Monto de referencia',
    resultLead: 'Compara esta referencia con lo que te ofrezcan.',
    resultLabel: 'Finiquito orientativo',
    resultNote: 'Si hubo descuentos, adeudos o conceptos omitidos, la cifra real puede variar.',
    note: 'Un finiquito mal calculado suele ocultar conceptos proporcionales omitidos.',
    formulaKey: 'labor-finiquito',
    legalBasis: [
      'Ley Federal del Trabajo: artículos 76, 80 y 87.',
    ],
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Calculadoras', href: '/calculadoras/' },
      { name: 'Laboral', href: '/calculadoras/laboral/' },
      { name: 'Finiquito', href: '/calculadoras/laboral/finiquito/' },
    ],
    fields: [
      { id: 'modo_salario', label: 'Tipo de salario', type: 'select', options: [
        { value: 'mensual', label: 'Salario mensual' },
        { value: 'diario', label: 'Salario diario' },
      ], help: 'Selecciona si el monto capturado corresponde al salario mensual o al diario.' },
      { id: 'salario_base', label: 'Salario capturado (mensual o diario)', type: 'number', placeholder: 'Ej. 9000 o 300', help: 'Ingresa el salario que conozcas; el sistema obtiene el valor diario automaticamente.' },
      { id: 'fecha_ingreso', label: 'Fecha de ingreso (DD/MM/AAAA)', type: 'date', placeholder: 'DD/MM/AAAA', help: 'Sirve para calcular la antiguedad exacta y el ciclo vacacional vigente.' },
      { id: 'fecha_terminacion', label: 'Fecha de terminacion (DD/MM/AAAA)', type: 'date', placeholder: 'DD/MM/AAAA', help: 'Se usa para cerrar el periodo trabajado y calcular los proporcionales.' },
      { id: 'terminacion', label: 'Tipo de terminacion', type: 'select', options: [
        { value: 'renuncia', label: 'Renuncia voluntaria' },
        { value: 'injustificado', label: 'Despido injustificado' },
      ], help: 'Si eliges despido injustificado, el sistema suma indemnizacion constitucional y prima de antiguedad.' },
      { id: 'zona_salario_minimo', label: 'Zona salarial 2026', type: 'select', options: [
        { value: 'general', label: 'Resto del pais' },
        { value: 'frontera', label: 'Frontera norte' },
      ], help: 'Se usa solo cuando aplica el tope legal de prima de antiguedad en 2026.' },
    ],
    faq: [
      { q: '¿Finiquito y liquidación son lo mismo?', a: 'No. El finiquito cubre prestaciones pendientes; la liquidación incluye indemnización cuando procede.' },
      { q: '¿Debo aceptar la primera oferta?', a: 'No sin revisar. La primera propuesta suele omitirse conceptos que sí te corresponden.' },
      { q: '¿Se puede negociar?', a: 'Sí. Si detectas diferencias, tienes base para negociar o pedir revisión formal.' },
    ],
  },
  {
    categorySlug: 'laboral',
    categoryName: 'Laboral',
    title: 'Calculadora de Despido Injustificado | SIGLEP',
    url: '/calculadoras/laboral/despido-injustificado/',
    eyebrow: 'Calculadora Laboral',
    heroTitle: 'Despido injustificado <em>con números reales.</em>',
    heroLead: 'Obtén una referencia inicial de indemnización para entender el tamaño del reclamo antes de sentarte a negociar.',
    description: 'Calculadora orientativa de despido injustificado en México con indemnización básica y proporcionales.',
    shortTopic: 'despido injustificado',
    ctaBandTitle: 'No firmes nada antes de revisar tu despido',
    ctaBandLead: 'Una cifra orientativa te ayuda a detectar cuando la oferta está por debajo de la ley.',
    sectionTitle: 'Referencia de indemnización',
    sectionLead: 'La liquidación por despido puede cambiar de forma importante según salario, antigüedad y prestaciones.',
    formKicker: 'Variables',
    formTitle: 'Cálculo orientativo de despido',
    formLead: 'Captura salario mensual o diario y fechas reales en formato DD/MM/AAAA; el sistema estima antiguedad y conceptos legales.',
    resultTitle: 'Indemnización estimada',
    resultLead: 'Compárala con la propuesta de tu empleador.',
    resultLabel: 'Indemnización orientativa',
    resultNote: 'El salario integrado, bonos y prestaciones pueden elevar el resultado real.',
    note: 'Si hubo presión para firmar, la revisión legal debe ser inmediata.',
    formulaKey: 'labor-despido',
    legalBasis: [
      'Ley Federal del Trabajo: artículos 47, 48, 50, 76 y 87.',
    ],
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Calculadoras', href: '/calculadoras/' },
      { name: 'Laboral', href: '/calculadoras/laboral/' },
      { name: 'Despido injustificado', href: '/calculadoras/laboral/despido-injustificado/' },
    ],
    fields: [
      { id: 'modo_salario', label: 'Tipo de salario', type: 'select', options: [
        { value: 'mensual', label: 'Salario mensual' },
        { value: 'diario', label: 'Salario diario' },
      ], help: 'Selecciona si el monto capturado corresponde al salario mensual o al diario.' },
      { id: 'salario_base', label: 'Salario capturado (mensual o diario)', type: 'number', placeholder: 'Ej. 15600 o 520', help: 'Ingresa el salario disponible; el sistema calcula el salario diario cuando partes del mensual.' },
      { id: 'fecha_ingreso', label: 'Fecha de ingreso (DD/MM/AAAA)', type: 'date', placeholder: 'DD/MM/AAAA', help: 'Define la antiguedad exacta en dias y años.' },
      { id: 'fecha_terminacion', label: 'Fecha de terminacion (DD/MM/AAAA)', type: 'date', placeholder: 'DD/MM/AAAA', help: 'Se usa como fecha de despido o salida para cerrar el calculo.' },
      { id: 'terminacion', label: 'Tipo de terminacion', type: 'select', options: [
        { value: 'injustificado', label: 'Despido injustificado' },
        { value: 'renuncia', label: 'Renuncia voluntaria' },
      ], help: 'La opcion de despido injustificado agrega automaticamente 3 meses y prima de antiguedad.' },
      { id: 'zona_salario_minimo', label: 'Zona salarial 2026', type: 'select', options: [
        { value: 'general', label: 'Resto del pais' },
        { value: 'frontera', label: 'Frontera norte' },
      ], help: 'Se usa para aplicar el tope legal de prima de antiguedad con salario minimo general o de frontera.' },
    ],
    faq: [
      { q: '¿Qué incluye esta referencia?', a: 'Una estimación de los rubros más frecuentes en despido injustificado; no sustituye la revisión completa.' },
      { q: '¿Qué pasa si me ofrecieron menos?', a: 'Tienes base para revisar la diferencia y decidir si conviene negociar o reclamar.' },
      { q: '¿Sirve para juicio?', a: 'Sirve como orientación inicial para entrar mejor preparado a una revisión formal.' },
    ],
  },
  {
    categorySlug: 'laboral',
    categoryName: 'Laboral',
    title: 'Calculadora de Horas Extras | SIGLEP',
    url: '/calculadoras/laboral/horas-extras/',
    eyebrow: 'Calculadora Laboral',
    heroTitle: 'Horas extras <em>que sí deben pagarse.</em>',
    heroLead: 'Estima una referencia del pago pendiente por horas adicionales, recargos y semanas acumuladas.',
    description: 'Calculadora orientativa de horas extras laborales en México para revisar recargos y pagos pendientes.',
    shortTopic: 'horas extras',
    ctaBandTitle: 'Las horas extra se documentan y se cobran',
    ctaBandLead: 'Si el patrón no pagó tiempo adicional, la referencia te ayuda a dimensionar el reclamo.',
    sectionTitle: 'Estimación de horas extras',
    sectionLead: 'Acumula lo que trabajaste de más y compara el resultado con lo que realmente te pagaron.',
    formKicker: 'Horas',
    formTitle: 'Cálculo orientativo',
    formLead: 'Captura salario mensual o diario, horas extra de la semana y tipo de jornada; el sistema separa horas dobles y triples automaticamente.',
    resultTitle: 'Pago pendiente estimado',
    resultLead: 'El cálculo es orientativo y sirve como registro inicial.',
    resultLabel: 'Horas extra estimadas',
    resultNote: 'Si hubo cambios de jornada o salario, el monto real puede subir.',
    note: 'Conviene documentar horarios, mensajes y testigos desde el inicio.',
    formulaKey: 'labor-hours',
    legalBasis: [
      'Ley Federal del Trabajo: artículos 66, 67 y 68.',
    ],
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Calculadoras', href: '/calculadoras/' },
      { name: 'Laboral', href: '/calculadoras/laboral/' },
      { name: 'Horas extras', href: '/calculadoras/laboral/horas-extras/' },
    ],
    fields: [
      { id: 'modo_salario', label: 'Tipo de salario', type: 'select', options: [
        { value: 'mensual', label: 'Salario mensual' },
        { value: 'diario', label: 'Salario diario' },
      ], help: 'Selecciona si el monto capturado corresponde al salario mensual o al diario.' },
      { id: 'salario_base', label: 'Salario capturado (mensual o diario)', type: 'number', placeholder: 'Ej. 12000 o 400', help: 'El sistema convierte el salario a valor hora segun el tipo de jornada elegido.' },
      { id: 'horas_extras_semana', label: 'Horas extras totales (las primeras 9 se consideran dobles por ley)', type: 'number', placeholder: 'Ej. 11', help: 'Captura las horas extra realmente laboradas en la semana que quieres revisar.' },
      { id: 'tipo_jornada', label: 'Tipo de jornada', type: 'select', options: [
        { value: 'diurna', label: 'Diurna (8 h)' },
        { value: 'nocturna', label: 'Nocturna (7 h)' },
        { value: 'mixta', label: 'Mixta (7.5 h)' },
      ], help: 'La jornada define el valor de la hora base antes de aplicar dobles y triples.' },
    ],
    faq: [
      { q: '¿Siempre se pagan al triple?', a: 'No. Depende de la jornada, el exceso y el contexto del trabajo realizado.' },
      { q: '¿Sirven mensajes o horarios?', a: 'Sí. Cualquier evidencia que pruebe el tiempo extra ayuda a sostener el reclamo.' },
      { q: '¿Puedo reclamar meses anteriores?', a: 'Sí, si el plazo legal y la evidencia del caso lo permiten.' },
    ],
  },
  {
    categorySlug: 'laboral',
    categoryName: 'Laboral',
    title: 'Calculadora de Aguinaldo y Prima Vacacional | SIGLEP',
    url: '/calculadoras/laboral/aguinaldo-prima-vacacional/',
    eyebrow: 'Calculadora Laboral',
    heroTitle: 'Aguinaldo y prima <em>bien prorrateados.</em>',
    heroLead: 'Revisa el proporcional de aguinaldo y prima vacacional con base en días trabajados y salario diario.',
    description: 'Calculadora orientativa de aguinaldo y prima vacacional en México para estimar proporcionales.',
    shortTopic: 'aguinaldo y prima vacacional',
    ctaBandTitle: 'Las prestaciones proporcionales también se cobran',
    ctaBandLead: 'No dejes que las prestaciones del año se queden fuera del cálculo final.',
    sectionTitle: 'Proporcional de prestaciones',
    sectionLead: 'Una salida laboral también deja prestaciones pendientes; aquí dimensionas ese proporcional.',
    formKicker: 'Prestaciones',
    formTitle: 'Cálculo orientativo',
    formLead: 'Captura salario mensual o diario y fechas reales en formato DD/MM/AAAA; la calculadora estima prestaciones proporcionales automaticamente.',
    resultTitle: 'Total estimado de prestaciones',
    resultLead: 'Suma de aguinaldo y prima vacacional.',
    resultLabel: 'Prestaciones proporcionales',
    resultNote: 'Si hay bonos, comisiones o salario variable, el cálculo cambia.',
    note: 'El objetivo es detectar si la oferta omite prestaciones proporcionales.',
    formulaKey: 'labor-aguinaldo',
    legalBasis: [
      'Ley Federal del Trabajo: artículos 76, 80 y 87.',
    ],
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Calculadoras', href: '/calculadoras/' },
      { name: 'Laboral', href: '/calculadoras/laboral/' },
      { name: 'Aguinaldo y prima vacacional', href: '/calculadoras/laboral/aguinaldo-prima-vacacional/' },
    ],
    fields: [
      { id: 'modo_salario', label: 'Tipo de salario', type: 'select', options: [
        { value: 'mensual', label: 'Salario mensual' },
        { value: 'diario', label: 'Salario diario' },
      ], help: 'Selecciona si el monto capturado corresponde al salario mensual o al diario.' },
      { id: 'salario_base', label: 'Salario capturado (mensual o diario)', type: 'number', placeholder: 'Ej. 13800 o 460', help: 'El sistema obtiene el salario diario de referencia para calcular prestaciones proporcionales.' },
      { id: 'fecha_ingreso', label: 'Fecha de ingreso (DD/MM/AAAA)', type: 'date', placeholder: 'DD/MM/AAAA', help: 'Sirve para ubicar la antiguedad real y el ciclo vacacional vigente.' },
      { id: 'fecha_terminacion', label: 'Fecha de terminacion (DD/MM/AAAA)', type: 'date', placeholder: 'DD/MM/AAAA', help: 'Se usa como corte del periodo trabajado para calcular aguinaldo, vacaciones y prima.' },
    ],
    faq: [
      { q: '¿Aguinaldo y prima se pagan aunque renuncie?', a: 'Sí, de forma proporcional a lo trabajado durante el año.' },
      { q: '¿Sirve si trabajé medio año?', a: 'Sí. Precisamente para eso se usa el proporcional.' },
      { q: '¿Puedo reclamar diferencias?', a: 'Sí, si el cálculo del patrón omitió días o aplicó mal el salario base.' },
    ],
  },
  {
    categorySlug: 'familiar',
    categoryName: 'Familiar',
    title: 'Calculadora de Pensión Alimenticia | SIGLEP',
    url: '/calculadoras/familiar/pension-alimenticia/',
    eyebrow: 'Calculadora Familiar',
    heroTitle: 'Pensión alimenticia <em>con base real.</em>',
    heroLead: 'Estima una referencia de pensión con ingresos, dependientes y gastos básicos para prepararte mejor.',
    description: 'Calculadora orientativa de pensión alimenticia en México para revisar proporción de ingresos y dependientes.',
    shortTopic: 'pensión alimenticia',
    ctaBandTitle: 'La pensión se revisa con números y evidencia',
    ctaBandLead: 'Si quieres exigirla o revisarla, una estimación útil ayuda a orientar la estrategia.',
    sectionTitle: 'Referencia de pensión',
    sectionLead: 'La pensión depende de ingresos, necesidades y número de dependientes.',
    formKicker: 'Ingreso y dependientes',
    formTitle: 'Cálculo orientativo',
    formLead: 'Usa datos básicos para obtener una referencia de pensión.',
    resultTitle: 'Pensión estimada',
    resultLead: 'La cifra es una guía, no una sentencia.',
    resultLabel: 'Pensión orientativa',
    resultNote: 'El monto final puede cambiar por gastos médicos, escolares y medidas de convivencia.',
    note: 'Una valoración legal completa toma en cuenta pruebas de ingreso y necesidades reales.',
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Calculadoras', href: '/calculadoras/' },
      { name: 'Familiar', href: '/calculadoras/familiar/' },
      { name: 'Pensión alimenticia', href: '/calculadoras/familiar/pension-alimenticia/' },
    ],
    fields: [
      { id: 'ingreso', label: 'Ingreso mensual del obligado', type: 'number', placeholder: 'Ej. 22000', multiplier: 0.22 },
      { id: 'dependientes', label: 'Número de dependientes', type: 'number', placeholder: 'Ej. 2', multiplier: 1800 },
      { id: 'gastos_escolares', label: 'Gastos escolares y médicos', type: 'number', placeholder: 'Ej. 3500', multiplier: 1 },
      { id: 'custodia', label: 'Tipo de custodia', type: 'select', multiplierMap: { compartida: 1200, exclusiva: 2500, temporal: 1800 }, options: [
        { value: 'compartida', label: 'Custodia compartida' },
        { value: 'exclusiva', label: 'Custodia exclusiva' },
        { value: 'temporal', label: 'Custodia temporal' },
      ] },
    ],
    faq: [
      { q: '¿La pensión es fija?', a: 'Puede revisarse cuando cambian los ingresos, las necesidades o la convivencia.' },
      { q: '¿Sirve para aumentar una pensión?', a: 'Sí. La referencia ayuda a explicar si el monto está por debajo de lo razonable.' },
      { q: '¿Puedo usarla si no sé el ingreso exacto?', a: 'Sí, como aproximación inicial, pero lo ideal es documentar ingresos reales.' },
    ],
  },
  {
    categorySlug: 'familiar',
    categoryName: 'Familiar',
    title: 'Calculadora de Divorcio | SIGLEP',
    url: '/calculadoras/familiar/divorcio/',
    eyebrow: 'Calculadora Familiar',
    heroTitle: 'Divorcio <em>con visión patrimonial.</em>',
    heroLead: 'Dimensiona el escenario de bienes, hijos y acuerdos para llegar mejor preparado al proceso.',
    description: 'Calculadora orientativa de divorcio en México con variables de hijos, bienes y acuerdos.',
    shortTopic: 'divorcio',
    ctaBandTitle: 'El divorcio se resuelve mejor con estrategia',
    ctaBandLead: 'Antes de iniciar, conviene revisar el peso de bienes, hijos y acuerdos previos.',
    sectionTitle: 'Escenario de divorcio',
    sectionLead: 'Una referencia general puede ayudarte a entender el nivel de conflicto y negociación.',
    formKicker: 'Variables familiares',
    formTitle: 'Cálculo orientativo',
    formLead: 'Estimamos a partir de patrimonio, hijos y cooperación de las partes.',
    resultTitle: 'Escenario estimado',
    resultLead: 'Úsalo para entender la complejidad del asunto.',
    resultLabel: 'Escenario de divorcio',
    resultNote: 'La estimación no sustituye el análisis de convenio, custodia y reparto de bienes.',
    note: 'Cada divorcio tiene una estrategia distinta; la cifra es solo una guía inicial.',
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Calculadoras', href: '/calculadoras/' },
      { name: 'Familiar', href: '/calculadoras/familiar/' },
      { name: 'Divorcio', href: '/calculadoras/familiar/divorcio/' },
    ],
    fields: [
      { id: 'bienes', label: 'Valor aproximado de bienes comunes', type: 'number', placeholder: 'Ej. 500000', multiplier: 0.03 },
      { id: 'hijos', label: 'Número de hijos', type: 'number', placeholder: 'Ej. 2', multiplier: 4200 },
      { id: 'acuerdo', label: 'Nivel de acuerdo', type: 'select', multiplierMap: { mutuo: 4500, parcial: 9000, contencioso: 16000 }, options: [
        { value: 'mutuo', label: 'Mutuo acuerdo' },
        { value: 'parcial', label: 'Acuerdo parcial' },
        { value: 'contencioso', label: 'Contencioso' },
      ] },
    ],
    faq: [
      { q: '¿El divorcio siempre es caro?', a: 'No necesariamente. El costo sube cuando hay conflicto, bienes o temas de hijos.' },
      { q: '¿La calculadora sustituye al convenio?', a: 'No. Solo orienta sobre el escenario general.' },
      { q: '¿Se puede ajustar si cambian las condiciones?', a: 'Sí. El divorcio puede requerir ajustes según el caso.' },
    ],
  },
  {
    categorySlug: 'familiar',
    categoryName: 'Familiar',
    title: 'Calculadora de Custodia de Menores | SIGLEP',
    url: '/calculadoras/familiar/custodia-menores/',
    eyebrow: 'Calculadora Familiar',
    heroTitle: 'Custodia de menores <em>con enfoque real.</em>',
    heroLead: 'Revisa un escenario de custodia y convivencia para entender qué tan urgente es tu caso.',
    description: 'Calculadora orientativa de custodia de menores en México para revisar complejidad y urgencia.',
    shortTopic: 'custodia de menores',
    ctaBandTitle: 'La custodia se trabaja con urgencia y cuidado',
    ctaBandLead: 'Si hay riesgo o incumplimiento, la prioridad es actuar con orden y evidencia.',
    sectionTitle: 'Escenario de custodia',
    sectionLead: 'La custodia prioriza el interés superior del menor y las condiciones reales de cuidado.',
    formKicker: 'Contexto',
    formTitle: 'Cálculo orientativo',
    formLead: 'Evaluamos urgencia, dependientes y recursos familiares.',
    resultTitle: 'Urgencia y escenario',
    resultLead: 'Útil para preparar medidas y documentos.',
    resultLabel: 'Escenario de custodia',
    resultNote: 'La calificación es orientativa y no sustituye medidas de protección o pruebas.',
    note: 'Si existe violencia, la prioridad es la protección inmediata.',
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Calculadoras', href: '/calculadoras/' },
      { name: 'Familiar', href: '/calculadoras/familiar/' },
      { name: 'Custodia de menores', href: '/calculadoras/familiar/custodia-menores/' },
    ],
    fields: [
      { id: 'menores', label: 'Número de menores', type: 'number', placeholder: 'Ej. 1', multiplier: 2800 },
      { id: 'ingreso', label: 'Ingreso mensual del cuidador', type: 'number', placeholder: 'Ej. 18000', multiplier: 0.08 },
      { id: 'riesgo', label: 'Nivel de urgencia', type: 'select', multiplierMap: { bajo: 1500, medio: 7000, alto: 15000 }, options: [
        { value: 'bajo', label: 'Bajo' },
        { value: 'medio', label: 'Medio' },
        { value: 'alto', label: 'Alto' },
      ] },
    ],
    faq: [
      { q: '¿Custodia y convivencia son lo mismo?', a: 'No. La custodia se refiere al cuidado principal; la convivencia al régimen de visitas y tiempo con el otro progenitor.' },
      { q: '¿Qué pasa si hay riesgo?', a: 'La prioridad es protección y medidas inmediatas.' },
      { q: '¿Se puede modificar?', a: 'Sí, cuando cambian las circunstancias del menor o de las partes.' },
    ],
  },
  {
    categorySlug: 'familiar',
    categoryName: 'Familiar',
    title: 'Calculadora de Régimen Matrimonial | SIGLEP',
    url: '/calculadoras/familiar/regimen-matrimonial/',
    eyebrow: 'Calculadora Familiar',
    heroTitle: 'Régimen matrimonial <em>sin confusiones.</em>',
    heroLead: 'Evalúa el escenario patrimonial para entender si conviene revisar capitulaciones o acuerdos.',
    description: 'Calculadora orientativa de régimen matrimonial en México para estimar complejidad patrimonial.',
    shortTopic: 'régimen matrimonial',
    ctaBandTitle: 'El régimen matrimonial define el reparto futuro',
    ctaBandLead: 'Conviene revisar el alcance patrimonial antes de que exista un conflicto.',
    sectionTitle: 'Escenario patrimonial conyugal',
    sectionLead: 'Una buena definición del régimen evita problemas más adelante.',
    formKicker: 'Patrimonio',
    formTitle: 'Cálculo orientativo',
    formLead: 'Mide valor patrimonial, deudas y convivencia económica.',
    resultTitle: 'Complejidad estimada',
    resultLead: 'Una lectura inicial del tipo de régimen y su impacto.',
    resultLabel: 'Complejidad patrimonial',
    resultNote: 'No sustituye la revisión de capitulaciones o acuerdos matrimoniales.',
    note: 'La planeación patrimonial previene litigios futuros.',
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Calculadoras', href: '/calculadoras/' },
      { name: 'Familiar', href: '/calculadoras/familiar/' },
      { name: 'Régimen matrimonial', href: '/calculadoras/familiar/regimen-matrimonial/' },
    ],
    fields: [
      { id: 'patrimonio', label: 'Valor del patrimonio común', type: 'number', placeholder: 'Ej. 700000', multiplier: 0.02 },
      { id: 'deudas', label: 'Deudas conjuntas', type: 'number', placeholder: 'Ej. 120000', multiplier: 0.03 },
      { id: 'capitulaciones', label: 'Capitulaciones previas', type: 'select', multiplierMap: { no: 12000, si: 4500, parcial: 8500 }, options: [
        { value: 'no', label: 'No existen' },
        { value: 'si', label: 'Sí existen' },
        { value: 'parcial', label: 'Parciales' },
      ] },
    ],
    faq: [
      { q: '¿El régimen se cambia?', a: 'En algunos casos sí, pero requiere revisión legal y documental.' },
      { q: '¿Influye en divorcio?', a: 'Sí, porque impacta el reparto de bienes y deudas.' },
      { q: '¿Sirve para revisar capitulaciones?', a: 'Sí, como guía inicial para detectar el nivel de complejidad.' },
    ],
  },
  {
    categorySlug: 'familiar',
    categoryName: 'Familiar',
    title: 'Calculadora de Liquidación de Sociedad Conyugal | SIGLEP',
    url: '/calculadoras/familiar/liquidacion-sociedad-conyugal/',
    eyebrow: 'Calculadora Familiar',
    heroTitle: 'Sociedad conyugal <em>bien liquidada.</em>',
    heroLead: 'Estima el escenario económico de una liquidación conyugal y el peso de bienes y deudas.',
    description: 'Calculadora orientativa de liquidación de sociedad conyugal en México para revisar bienes y pasivos.',
    shortTopic: 'liquidación de sociedad conyugal',
    ctaBandTitle: 'El patrimonio también necesita orden',
    ctaBandLead: 'Si hubo bienes en común, conviene revisar el reparto y la documentación desde el inicio.',
    sectionTitle: 'Escenario de liquidación',
    sectionLead: 'La liquidación conyugal requiere ordenar bienes, deudas y aportaciones de cada parte.',
    formKicker: 'Bienes y pasivos',
    formTitle: 'Cálculo orientativo',
    formLead: 'Combina valor de bienes, deudas y tipo de reparto.',
    resultTitle: 'Reparto estimado',
    resultLead: 'Útil como referencia inicial para negociación.',
    resultLabel: 'Reparto conyugal',
    resultNote: 'La liquidación real depende de la naturaleza del bien y de pruebas de propiedad.',
    note: 'Una revisión patrimonial previa evita sorpresas durante el proceso.',
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Calculadoras', href: '/calculadoras/' },
      { name: 'Familiar', href: '/calculadoras/familiar/' },
      { name: 'Liquidación de sociedad conyugal', href: '/calculadoras/familiar/liquidacion-sociedad-conyugal/' },
    ],
    fields: [
      { id: 'bienes', label: 'Valor de bienes a repartir', type: 'number', placeholder: 'Ej. 900000', multiplier: 0.025 },
      { id: 'deudas', label: 'Deudas asociadas', type: 'number', placeholder: 'Ej. 160000', multiplier: 0.04 },
      { id: 'reparto', label: 'Tipo de reparto', type: 'select', multiplierMap: { igualitario: 9000, negociado: 6500, litigioso: 17000 }, options: [
        { value: 'igualitario', label: 'Igualitario' },
        { value: 'negociado', label: 'Negociado' },
        { value: 'litigioso', label: 'Litigioso' },
      ] },
    ],
    faq: [
      { q: '¿La sociedad conyugal siempre se divide a la mitad?', a: 'No siempre; depende de bienes, deudas, aportaciones y pruebas.' },
      { q: '¿Pueden existir bienes excluidos?', a: 'Sí, por ejemplo por herencia o reglas patrimoniales específicas.' },
      { q: '¿La calculadora me dice la parte exacta?', a: 'No. Solo orienta sobre el escenario general.' },
    ],
  },
  {
    categorySlug: 'civil',
    categoryName: 'Civil',
    title: 'Calculadora de Daño Moral | SIGLEP',
    url: '/calculadoras/civil/dano-moral/',
    eyebrow: 'Calculadora Civil',
    heroTitle: 'Daño moral <em>medible con criterio.</em>',
    heroLead: 'Obtén una referencia de daño moral con base en afectación, exposición pública y consecuencia económica.',
    description: 'Calculadora orientativa de daño moral en México con enfoque en gravedad y exposición.',
    shortTopic: 'daño moral',
    ctaBandTitle: 'El daño moral también se valora legalmente',
    ctaBandLead: 'Si hubo afectación a imagen, honra o reputación, conviene estimar el reclamo desde el inicio.',
    sectionTitle: 'Valoración inicial de daño moral',
    sectionLead: 'La referencia te ayuda a organizar el caso y preparar pruebas.',
    formKicker: 'Afectación',
    formTitle: 'Cálculo orientativo',
    formLead: 'Mide la severidad, exposición y posible impacto económico.',
    resultTitle: 'Monto de referencia',
    resultLead: 'La cifra es solo una guía de trabajo.',
    resultLabel: 'Daño moral orientativo',
    resultNote: 'El monto real depende de pruebas, contexto y valoración judicial.',
    note: 'La documentación de publicaciones, mensajes y testigos es clave.',
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Calculadoras', href: '/calculadoras/' },
      { name: 'Civil', href: '/calculadoras/civil/' },
      { name: 'Daño moral', href: '/calculadoras/civil/dano-moral/' },
    ],
    fields: [
      { id: 'gravedad', label: 'Gravedad de la afectación', type: 'number', placeholder: 'Ej. 4', multiplier: 7000 },
      { id: 'exposicion', label: 'Exposición pública', type: 'select', multiplierMap: { baja: 3500, media: 9500, alta: 18000 }, options: [
        { value: 'baja', label: 'Baja' },
        { value: 'media', label: 'Media' },
        { value: 'alta', label: 'Alta' },
      ] },
      { id: 'perdida', label: 'Pérdida económica asociada', type: 'number', placeholder: 'Ej. 20000', multiplier: 0.4 },
    ],
    faq: [
      { q: '¿El daño moral requiere pruebas?', a: 'Sí. Capturas, testigos, publicaciones y contexto ayudan mucho.' },
      { q: '¿Siempre hay cantidad fija?', a: 'No. La valoración depende del caso concreto.' },
      { q: '¿Sirve para negociar?', a: 'Sí. Una cifra orientativa ayuda a preparar la reclamación.' },
    ],
  },
  {
    categorySlug: 'civil',
    categoryName: 'Civil',
    title: 'Calculadora de Daños y Perjuicios | SIGLEP',
    url: '/calculadoras/civil/danos-perjuicios/',
    eyebrow: 'Calculadora Civil',
    heroTitle: 'Daños y perjuicios <em>con orden probatorio.</em>',
    heroLead: 'Estima una referencia de pérdida material, reparación y tiempo de afectación.',
    description: 'Calculadora orientativa de daños y perjuicios en México para revisar pérdidas y reparación.',
    shortTopic: 'daños y perjuicios',
    ctaBandTitle: 'El daño material necesita cálculo y evidencia',
    ctaBandLead: 'Si hubo gasto, reparación o pérdida de oportunidad, conviene dimensionarlo desde el inicio.',
    sectionTitle: 'Estimación de daños y perjuicios',
    sectionLead: 'Usa la calculadora para ordenar pérdidas y costos de reparación.',
    formKicker: 'Pérdidas',
    formTitle: 'Cálculo orientativo',
    formLead: 'Incluye daño económico, reparación y tiempo de afectación.',
    resultTitle: 'Pérdida estimada',
    resultLead: 'La referencia te ayuda a documentar el reclamo.',
    resultLabel: 'Daños y perjuicios',
    resultNote: 'La cuantía final depende de facturas, dictámenes y pruebas de causalidad.',
    note: 'Guarda facturas, presupuestos y evidencia del gasto.',
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Calculadoras', href: '/calculadoras/' },
      { name: 'Civil', href: '/calculadoras/civil/' },
      { name: 'Daños y perjuicios', href: '/calculadoras/civil/danos-perjuicios/' },
    ],
    fields: [
      { id: 'perdida', label: 'Pérdida económica', type: 'number', placeholder: 'Ej. 30000', multiplier: 0.9 },
      { id: 'reparacion', label: 'Costo de reparación', type: 'number', placeholder: 'Ej. 18000', multiplier: 1 },
      { id: 'meses', label: 'Meses de afectación', type: 'number', placeholder: 'Ej. 6', multiplier: 1200 },
    ],
    faq: [
      { q: '¿Puedo reclamar gastos de reparación?', a: 'Sí, siempre que estén documentados y vinculados al daño.' },
      { q: '¿La calculadora ve intereses?', a: 'No. Solo una referencia base del daño y la afectación.' },
      { q: '¿Sirve si hubo pérdida de oportunidad?', a: 'Sí, como guía inicial para dimensionar la demanda.' },
    ],
  },
  {
    categorySlug: 'civil',
    categoryName: 'Civil',
    title: 'Calculadora de Responsabilidad Civil | SIGLEP',
    url: '/calculadoras/civil/responsabilidad-civil/',
    eyebrow: 'Calculadora Civil',
    heroTitle: 'Responsabilidad civil <em>sin improvisar.</em>',
    heroLead: 'Evalúa la magnitud del reclamo cuando existe daño a terceros y necesidad de reparación.',
    description: 'Calculadora orientativa de responsabilidad civil en México para dimensionar daño y cobertura.',
    shortTopic: 'responsabilidad civil',
    ctaBandTitle: 'La responsabilidad civil se calcula con cuidado',
    ctaBandLead: 'Un reclamo bien documentado evita errores de estrategia y cuantificación.',
    sectionTitle: 'Escenario de responsabilidad',
    sectionLead: 'La referencia se enfoca en el daño y la cobertura potencial.',
    formKicker: 'Cobertura',
    formTitle: 'Cálculo orientativo',
    formLead: 'Mide daño, número de afectados y cobertura de seguro.',
    resultTitle: 'Cobertura y reclamo',
    resultLead: 'Una guía para negociar o demandar.',
    resultLabel: 'Responsabilidad civil',
    resultNote: 'La cobertura real depende de pólizas, contratos y peritajes.',
    note: 'Revisa pólizas y responsabilidades antes de mover cualquier cifra.',
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Calculadoras', href: '/calculadoras/' },
      { name: 'Civil', href: '/calculadoras/civil/' },
      { name: 'Responsabilidad civil', href: '/calculadoras/civil/responsabilidad-civil/' },
    ],
    fields: [
      { id: 'danio', label: 'Daño estimado', type: 'number', placeholder: 'Ej. 60000', multiplier: 0.85 },
      { id: 'victimas', label: 'Número de afectados', type: 'number', placeholder: 'Ej. 2', multiplier: 5500 },
      { id: 'seguro', label: 'Cobertura de seguro', type: 'select', multiplierMap: { ninguna: 15000, parcial: 9000, completa: 3500 }, options: [
        { value: 'ninguna', label: 'Sin seguro' },
        { value: 'parcial', label: 'Cobertura parcial' },
        { value: 'completa', label: 'Cobertura completa' },
      ] },
    ],
    faq: [
      { q: '¿La responsabilidad civil siempre implica juicio?', a: 'No. A veces se resuelve por cobertura, convenio o negociación.' },
      { q: '¿El seguro reduce el reclamo?', a: 'Puede ayudar, pero no elimina la necesidad de cuantificar el daño.' },
      { q: '¿Sirve para acordar una cifra?', a: 'Sí, como base inicial para la negociación.' },
    ],
  },
  {
    categorySlug: 'civil',
    categoryName: 'Civil',
    title: 'Calculadora de Intereses Moratorios | SIGLEP',
    url: '/calculadoras/civil/intereses-moratorios/',
    eyebrow: 'Calculadora Civil',
    heroTitle: 'Intereses moratorios <em>sin perder el control.</em>',
    heroLead: 'Calcula una referencia de intereses por pago tardío, capital y plazo de mora.',
    description: 'Calculadora orientativa de intereses moratorios en México para revisar capital, plazo y tasa.',
    shortTopic: 'intereses moratorios',
    ctaBandTitle: 'Los intereses moratorios también se pueden calcular',
    ctaBandLead: 'Si hubo demora en el pago, una referencia clara ayuda a ordenar la reclamación.',
    sectionTitle: 'Cálculo de mora',
    sectionLead: 'Revisa capital, días de retraso y la tasa aplicable para formar una base de reclamación.',
    formKicker: 'Mora',
    formTitle: 'Cálculo orientativo',
    formLead: 'Introduce monto, tiempo y tasa para obtener la referencia.',
    resultTitle: 'Intereses estimados',
    resultLead: 'Ideal para revisar contratos y pagos pendientes.',
    resultLabel: 'Intereses moratorios',
    resultNote: 'La tasa real depende del contrato, el documento base y el criterio aplicable.',
    note: 'Conserva contratos, facturas y pruebas del atraso.',
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Calculadoras', href: '/calculadoras/' },
      { name: 'Civil', href: '/calculadoras/civil/' },
      { name: 'Intereses moratorios', href: '/calculadoras/civil/intereses-moratorios/' },
    ],
    fields: [
      { id: 'capital', label: 'Capital adeudado', type: 'number', placeholder: 'Ej. 45000', multiplier: 0.02 },
      { id: 'dias', label: 'Días de mora', type: 'number', placeholder: 'Ej. 90', multiplier: 55 },
      { id: 'tasa', label: 'Tasa anual', type: 'number', placeholder: 'Ej. 24', multiplier: 260 },
    ],
    faq: [
      { q: '¿Los intereses siempre son iguales?', a: 'No. Dependen del documento base, plazo y tasa pactada.' },
      { q: '¿Puedo reclamar mora por contrato?', a: 'Sí, si el contrato o la obligación lo permiten.' },
      { q: '¿La calculadora toma en cuenta tasa compuesta?', a: 'No, solo una referencia simple.' },
    ],
  },
  {
    categorySlug: 'patrimonial',
    categoryName: 'Patrimonial',
    title: 'Calculadora de Herencia y Sucesión | SIGLEP',
    url: '/calculadoras/patrimonial/herencia-sucesion/',
    eyebrow: 'Calculadora Patrimonial',
    heroTitle: 'Herencia y sucesión <em>con visión ordenada.</em>',
    heroLead: 'Obtén una referencia para dimensionar el tamaño de la sucesión y los factores que la hacen más compleja.',
    description: 'Calculadora orientativa de herencia y sucesión en México para revisar tamaño del patrimonio y herederos.',
    shortTopic: 'herencia y sucesión',
    ctaBandTitle: 'La sucesión se ordena mejor si entiendes el patrimonio',
    ctaBandLead: 'Una referencia útil te permite preparar documentos y decisiones antes de iniciar el trámite.',
    sectionTitle: 'Estimación de sucesión',
    sectionLead: 'El tamaño del patrimonio y el número de herederos influye en la estrategia.',
    formKicker: 'Patrimonio',
    formTitle: 'Cálculo orientativo',
    formLead: 'Introduce valor patrimonial, número de herederos y si existe testamento.',
    resultTitle: 'Complejidad sucesoria',
    resultLead: 'La base para preparar la sucesión o el juicio correspondiente.',
    resultLabel: 'Herencia orientativa',
    resultNote: 'La sucesión depende de testamento, parentesco y documentos de propiedad.',
    note: 'Ordena escrituras, cuentas, seguros y actas antes de iniciar.',
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Calculadoras', href: '/calculadoras/' },
      { name: 'Patrimonial', href: '/calculadoras/patrimonial/' },
      { name: 'Herencia y sucesión', href: '/calculadoras/patrimonial/herencia-sucesion/' },
    ],
    fields: [
      { id: 'patrimonio', label: 'Valor del patrimonio', type: 'number', placeholder: 'Ej. 1500000', multiplier: 0.015 },
      { id: 'herederos', label: 'Número de herederos', type: 'number', placeholder: 'Ej. 3', multiplier: 4500 },
      { id: 'testamento', label: '¿Existe testamento?', type: 'select', multiplierMap: { si: 4200, no: 11800, duda: 7600 }, options: [
        { value: 'si', label: 'Sí' },
        { value: 'no', label: 'No' },
        { value: 'duda', label: 'No lo sé' },
      ] },
    ],
    faq: [
      { q: '¿La herencia siempre requiere juicio?', a: 'No. A veces puede tramitarse por notaría cuando existe acuerdo y documentos claros.' },
      { q: '¿El testamento cambia el escenario?', a: 'Sí, suele simplificar o aclarar la sucesión.' },
      { q: '¿La calculadora divide porcentajes exactos?', a: 'No. Solo ayuda a dimensionar la carga del caso.' },
    ],
  },
  {
    categorySlug: 'seguridad-social',
    categoryName: 'Seguridad Social',
    title: 'Calculadora de Pensión IMSS | SIGLEP',
    url: '/calculadoras/seguridad-social/pension-imss/',
    eyebrow: 'Calculadora de Seguridad Social',
    heroTitle: 'Pensión IMSS <em>con base de cálculo clara.</em>',
    heroLead: 'Revisa edad, semanas cotizadas y salario promedio para obtener una referencia preliminar.',
    description: 'Calculadora orientativa de pensión IMSS en México para revisar edad, semanas y salario promedio.',
    shortTopic: 'pensión IMSS',
    ctaBandTitle: 'Tu pensión merece revisión antes de solicitarla',
    ctaBandLead: 'Una referencia te ayuda a entender si ya estás listo para el trámite o si conviene esperar.',
    sectionTitle: 'Referencia de pensión IMSS',
    sectionLead: 'Los parámetros básicos de seguridad social cambian el monto y la elegibilidad.',
    formKicker: 'Cotización',
    formTitle: 'Cálculo orientativo',
    formLead: 'Introduce edad, semanas cotizadas y salario promedio.',
    resultTitle: 'Pensión estimada',
    resultLead: 'Un punto de partida para la planeación del trámite.',
    resultLabel: 'Pensión IMSS',
    resultNote: 'La cifra final depende de la modalidad, salario promedio y reglas vigentes.',
    note: 'Conviene revisar semanas registradas y correcciones antes de iniciar el trámite.',
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Calculadoras', href: '/calculadoras/' },
      { name: 'Seguridad social', href: '/calculadoras/seguridad-social/' },
      { name: 'Pensión IMSS', href: '/calculadoras/seguridad-social/pension-imss/' },
    ],
    fields: [
      { id: 'edad', label: 'Edad', type: 'number', placeholder: 'Ej. 60', multiplier: 600 },
      { id: 'semanas', label: 'Semanas cotizadas', type: 'number', placeholder: 'Ej. 1250', multiplier: 18 },
      { id: 'salario', label: 'Salario promedio', type: 'number', placeholder: 'Ej. 950', multiplier: 3.8 },
    ],
    faq: [
      { q: '¿La pensión IMSS depende de semanas?', a: 'Sí, es uno de los factores principales.' },
      { q: '¿Sirve para revisar si ya puedo pensionarme?', a: 'Sí, como referencia preliminar.' },
      { q: '¿Puedo corregir semanas antes?', a: 'Sí, y suele ser recomendable revisar el historial antes de tramitar.' },
    ],
  },
  {
    categorySlug: 'seguridad-social',
    categoryName: 'Seguridad Social',
    title: 'Calculadora de Modalidad 40 | SIGLEP',
    url: '/calculadoras/seguridad-social/modalidad-40/',
    eyebrow: 'Calculadora de Seguridad Social',
    heroTitle: 'Modalidad 40 <em>para proyectar mejor tu pensión.</em>',
    heroLead: 'Estima un escenario orientativo de aportaciones y proyección de pensión futura.',
    description: 'Calculadora orientativa de Modalidad 40 en México para revisar semanas, salario objetivo y aportación.',
    shortTopic: 'Modalidad 40',
    ctaBandTitle: 'La Modalidad 40 se planea, no se improvisa',
    ctaBandLead: 'La referencia te ayuda a saber si conviene continuar o ajustar la estrategia de cotización.',
    sectionTitle: 'Proyección de Modalidad 40',
    sectionLead: 'La planeación correcta depende de semanas previas y salario objetivo.',
    formKicker: 'Planeación',
    formTitle: 'Cálculo orientativo',
    formLead: 'Revisa semanas previas, salario deseado y periodo de aportación.',
    resultTitle: 'Aportación estimada',
    resultLead: 'Útil para comparar escenarios de cotización.',
    resultLabel: 'Modalidad 40',
    resultNote: 'La proyección es referencial; la cifra real depende del salario base y del periodo elegido.',
    note: 'Antes de pagar, conviene revisar el historial de semanas y el objetivo de pensión.',
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Calculadoras', href: '/calculadoras/' },
      { name: 'Seguridad social', href: '/calculadoras/seguridad-social/' },
      { name: 'Modalidad 40', href: '/calculadoras/seguridad-social/modalidad-40/' },
    ],
    fields: [
      { id: 'semanas', label: 'Semanas cotizadas', type: 'number', placeholder: 'Ej. 1100', multiplier: 14 },
      { id: 'salario_objetivo', label: 'Salario objetivo', type: 'number', placeholder: 'Ej. 1000', multiplier: 4.5 },
      { id: 'periodo', label: 'Periodo en meses', type: 'number', placeholder: 'Ej. 60', multiplier: 220 },
    ],
    faq: [
      { q: '¿La Modalidad 40 siempre conviene?', a: 'No. Depende del historial de semanas y del objetivo de pensión.' },
      { q: '¿Necesito revisar semanas previas?', a: 'Sí, porque son la base del escenario.' },
      { q: '¿Puedo cambiar el salario objetivo?', a: 'Sí, para comparar escenarios de aportación.' },
    ],
  },
  {
    categorySlug: 'seguridad-social',
    categoryName: 'Seguridad Social',
    title: 'Calculadora de Pensión ISSSTE | SIGLEP',
    url: '/calculadoras/seguridad-social/pension-issste/',
    eyebrow: 'Calculadora de Seguridad Social',
    heroTitle: 'Pensión ISSSTE <em>con revisión previa.</em>',
    heroLead: 'Revisa años de servicio, edad y salario base para obtener una orientación inicial.',
    description: 'Calculadora orientativa de pensión ISSSTE en México para revisar años de servicio y salario base.',
    shortTopic: 'pensión ISSSTE',
    ctaBandTitle: 'Antes de iniciar el trámite, revisa tu escenario ISSSTE',
    ctaBandLead: 'Los años de servicio y el salario base hacen que la planeación previa sea esencial.',
    sectionTitle: 'Referencia ISSSTE',
    sectionLead: 'Una previsión inicial ayuda a evitar trámites prematuros o mal calculados.',
    formKicker: 'Servicio público',
    formTitle: 'Cálculo orientativo',
    formLead: 'Introduce edad, años de servicio y salario base.',
    resultTitle: 'Pensión estimada',
    resultLead: 'Sirve para dimensionar el escenario antes de iniciar el trámite.',
    resultLabel: 'Pensión ISSSTE',
    resultNote: 'La pensión real depende de la modalidad de retiro y de las reglas aplicables al expediente.',
    note: 'Conviene revisar documentos de nombramiento, nóminas y expediente laboral.',
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Calculadoras', href: '/calculadoras/' },
      { name: 'Seguridad social', href: '/calculadoras/seguridad-social/' },
      { name: 'Pensión ISSSTE', href: '/calculadoras/seguridad-social/pension-issste/' },
    ],
    fields: [
      { id: 'edad', label: 'Edad', type: 'number', placeholder: 'Ej. 58', multiplier: 550 },
      { id: 'anios', label: 'Años de servicio', type: 'number', placeholder: 'Ej. 25', multiplier: 680 },
      { id: 'salario', label: 'Salario base', type: 'number', placeholder: 'Ej. 14000', multiplier: 0.18 },
    ],
    faq: [
      { q: '¿El ISSSTE se calcula igual que IMSS?', a: 'No. Las reglas y variables son diferentes.' },
      { q: '¿Sirve para revisar si ya me toca?', a: 'Sí, como orientación inicial.' },
      { q: '¿Puedo usarla para planeación?', a: 'Sí, especialmente si estás cerca de retirarte.' },
    ],
  },
  {
    categorySlug: 'seguridad-social',
    categoryName: 'Seguridad Social',
    title: 'Calculadora de Pensión por Invalidez | SIGLEP',
    url: '/calculadoras/seguridad-social/pension-invalidez/',
    eyebrow: 'Calculadora de Seguridad Social',
    heroTitle: 'Pensión por invalidez <em>con control de variables.</em>',
    heroLead: 'Dimensiona un escenario de invalidez con base en salario, semanas y grado de afectación.',
    description: 'Calculadora orientativa de pensión por invalidez en México para revisar semanas, salario y grado de incapacidad.',
    shortTopic: 'pensión por invalidez',
    ctaBandTitle: 'La invalidez requiere estrategia y documentación médica',
    ctaBandLead: 'Una referencia inicial ayuda a preparar el expediente y revisar posibilidades de pensión.',
    sectionTitle: 'Escenario de invalidez',
    sectionLead: 'La calificación médica y las semanas cotizadas influyen en el resultado.',
    formKicker: 'Salud y cotización',
    formTitle: 'Cálculo orientativo',
    formLead: 'Revisa salario, semanas y grado de afectación.',
    resultTitle: 'Pensión estimada',
    resultLead: 'Usa la referencia para ordenar el expediente.',
    resultLabel: 'Pensión por invalidez',
    resultNote: 'La evaluación real depende de dictámenes médicos y requisitos del instituto.',
    note: 'Conserva dictámenes, certificados y resoluciones médicas.',
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Calculadoras', href: '/calculadoras/' },
      { name: 'Seguridad social', href: '/calculadoras/seguridad-social/' },
      { name: 'Pensión por invalidez', href: '/calculadoras/seguridad-social/pension-invalidez/' },
    ],
    fields: [
      { id: 'salario', label: 'Salario promedio', type: 'number', placeholder: 'Ej. 12000', multiplier: 0.22 },
      { id: 'semanas', label: 'Semanas cotizadas', type: 'number', placeholder: 'Ej. 900', multiplier: 15 },
      { id: 'grado', label: 'Grado de invalidez', type: 'select', multiplierMap: { parcial: 6000, total: 14000, temporal: 9000 }, options: [
        { value: 'parcial', label: 'Parcial' },
        { value: 'total', label: 'Total' },
        { value: 'temporal', label: 'Temporal' },
      ] },
    ],
    faq: [
      { q: '¿La incapacidad médica es determinante?', a: 'Sí. El dictamen médico tiene mucho peso en el trámite.' },
      { q: '¿Sirve si aún no tengo resolución?', a: 'Sí, como referencia previa para preparar el expediente.' },
      { q: '¿Puedo revisar semanas primero?', a: 'Sí, y conviene hacerlo antes del trámite formal.' },
    ],
  },
  {
    categorySlug: 'seguridad-social',
    categoryName: 'Seguridad Social',
    title: 'Calculadora de Pensión por Viudez | SIGLEP',
    url: '/calculadoras/seguridad-social/pension-viudez/',
    eyebrow: 'Calculadora de Seguridad Social',
    heroTitle: 'Pensión por viudez <em>con visión clara.</em>',
    heroLead: 'Calcula una referencia del escenario de viudez con base en la pensión original y dependientes.',
    description: 'Calculadora orientativa de pensión por viudez en México para revisar base pensional y dependientes.',
    shortTopic: 'pensión por viudez',
    ctaBandTitle: 'La pensión por viudez se revisa con evidencia',
    ctaBandLead: 'Un escenario claro ayuda a preparar documentos y a verificar derechos.',
    sectionTitle: 'Referencia de viudez',
    sectionLead: 'La base pensional y el número de dependientes cambian el escenario.',
    formKicker: 'Base de pensión',
    formTitle: 'Cálculo orientativo',
    formLead: 'Revisa pensión base, dependientes y edad del beneficiario.',
    resultTitle: 'Pensión estimada',
    resultLead: 'Útil para preparar el expediente con más claridad.',
    resultLabel: 'Pensión por viudez',
    resultNote: 'La cifra final depende del régimen, del expediente y de la documentación disponible.',
    note: 'Guarda acta de defunción, matrimonio y documentos de seguridad social.',
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Calculadoras', href: '/calculadoras/' },
      { name: 'Seguridad social', href: '/calculadoras/seguridad-social/' },
      { name: 'Pensión por viudez', href: '/calculadoras/seguridad-social/pension-viudez/' },
    ],
    fields: [
      { id: 'pension_base', label: 'Pensión base', type: 'number', placeholder: 'Ej. 13000', multiplier: 0.12 },
      { id: 'dependientes', label: 'Número de dependientes', type: 'number', placeholder: 'Ej. 2', multiplier: 2200 },
      { id: 'edad', label: 'Edad del beneficiario', type: 'number', placeholder: 'Ej. 45', multiplier: 210 },
    ],
    faq: [
      { q: '¿La viudez siempre tiene el mismo porcentaje?', a: 'No. Depende del régimen y del expediente concreto.' },
      { q: '¿Sirve para preparar documentos?', a: 'Sí, ayuda a ver qué tan fuerte es el escenario.' },
      { q: '¿Puedo revisar dependientes?', a: 'Sí, porque influyen en el resultado.' },
    ],
  },
];

const categoryPages = [
  {
    title: 'Derecho Civil México | SIGLEP',
    url: '/civil/',
    eyebrow: 'Área Civil',
    heroTitle: 'Derecho civil <em>con estrategia y orden.</em>',
    heroLead: 'Reclamos por daño moral, daños y perjuicios, responsabilidad civil e intereses moratorios, con una ruta clara para revisar tu caso.',
    description: 'SIGLEP en Derecho Civil: daño moral, daños y perjuicios, responsabilidad civil e intereses moratorios en México.',
    ogTitle: 'Derecho Civil México | SIGLEP',
    ogDescription: 'Daño moral, daños y perjuicios, responsabilidad civil e intereses moratorios. Estrategia civil con enfoque práctico.',
    primaryHref: '/calculadoras/civil/',
    primaryLabel: 'Ir al Área Civil',
    secondaryHref: CONSULTATION_URL,
    secondaryLabel: 'Agendar Consulta',
    sectionTitle: 'Cuatro herramientas para organizar tu reclamo civil',
    sectionLead: 'Cada calculadora está pensada para darte una referencia útil antes de la revisión legal.',
    ctaBandTitle: 'Si hubo daño, hay que cuantificarlo',
    ctaBandLead: 'El siguiente paso es ordenar pruebas, contratos y facturas para sostener la reclamación.',
    faqLead: 'Las respuestas siguientes están pensadas para ayudarte a decidir si el asunto es civil y qué tan urgente es.',
    cards: categoryCardsFor(calculatorPages.filter((page) => page.categorySlug === 'civil')),
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Civil', href: '/civil/' },
    ],
    faq: [
      { q: '¿Qué tipo de asuntos cubre el área civil?', a: 'Daño moral, daños y perjuicios, responsabilidad civil e intereses moratorios.' },
      { q: '¿Debo llevar facturas o contratos?', a: 'Sí. Cualquier soporte documental mejora la revisión inicial.' },
      { q: '¿Puedo ir directo a calculadoras?', a: 'Sí, las calculadoras por área agrupan todo por categoría.' },
    ],
  },
  {
    title: 'Seguridad Social México | SIGLEP',
    url: '/seguridad-social/',
    eyebrow: 'Área Seguridad Social',
    heroTitle: 'Seguridad social <em>para planear el retiro con claridad.</em>',
    heroLead: 'Pensión IMSS, Modalidad 40, Pensión ISSSTE, invalidez y viudez en una sola ruta de navegación.',
    description: 'SIGLEP en Seguridad Social: pensión IMSS, Modalidad 40, pensión ISSSTE, invalidez y viudez en México.',
    ogTitle: 'Seguridad Social México | SIGLEP',
    ogDescription: 'Pensión IMSS, Modalidad 40, pensión ISSSTE, invalidez y viudez. Planeación de seguridad social en México.',
    primaryHref: '/calculadoras/seguridad-social/',
    primaryLabel: 'Ir al Área de Seguridad Social',
    secondaryHref: CONSULTATION_URL,
    secondaryLabel: 'Agendar Consulta',
    sectionTitle: 'Cinco calculadoras para planear mejor tu pensión',
    sectionLead: 'Cada herramienta da una referencia distinta según la institución o el tipo de prestación.',
    ctaBandTitle: 'Tu retiro se prepara con anticipación',
    ctaBandLead: 'Revisar semanas, salario base y expediente antes de iniciar puede cambiar el resultado.',
    faqLead: 'Las preguntas frecuentes te ayudan a ubicar qué calculadora usar en cada momento.',
    cards: categoryCardsFor(calculatorPages.filter((page) => page.categorySlug === 'seguridad-social')),
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Seguridad social', href: '/seguridad-social/' },
    ],
    faq: [
      { q: '¿Las calculadoras sustituyen al instituto?', a: 'No. Son una referencia para planear y revisar el expediente.' },
      { q: '¿Cuál debo usar primero?', a: 'Depende del instituto y del tipo de pensión que buscas.' },
      { q: '¿Puedo revisar semanas y salario antes?', a: 'Sí, y conviene hacerlo antes de cualquier trámite.' },
    ],
  },
];

const calculatorCategoryPages = [
  {
    title: 'Calculadoras Laborales | SIGLEP',
    url: '/calculadoras/laboral/',
    redirectTo: '/calculadoras/laboral/liquidacion-laboral/',
    eyebrow: 'Categoría Laboral',
    heroTitle: 'Calculadoras laborales <em>para revisar tus números.</em>',
    heroLead: 'Agrupamos liquidación, finiquito, despido, horas extras y prestaciones proporcionales en una sola ruta de calculadoras.',
    description: 'Calculadoras laborales SIGLEP para liquidación, finiquito, despido injustificado, horas extras y prestaciones proporcionales.',
    primaryHref: '/laboral/',
    primaryLabel: 'Ir al Área Laboral',
    secondaryHref: CONSULTATION_URL,
    secondaryLabel: 'Agendar Consulta',
    sectionTitle: 'Cinco calculadoras laborales',
    sectionLead: 'Empieza por la herramienta que mejor se alinee con tu escenario y luego revisa las demás si el caso se complica.',
    ctaBandTitle: 'Todo lo laboral, en una sola ruta',
    ctaBandLead: 'La categoría laboral concentra los cálculos más usados para preparar una revisión o negociación.',
    faqLead: 'Estas preguntas te ayudan a elegir la calculadora correcta antes de entrar a fondo en el caso.',
    cards: categoryCardsFor(calculatorPages.filter((page) => page.categorySlug === 'laboral')),
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Calculadoras', href: '/calculadoras/' },
      { name: 'Laboral', href: '/calculadoras/laboral/' },
    ],
    faq: [
      { q: '¿Estas calculadoras sustituyen una revisión legal?', a: 'No. Son referencias orientativas para entender el rango general del caso.' },
      { q: '¿Sirven para negociar?', a: 'Sí. Te ayudan a llegar con números y evitar ofertas mal calculadas.' },
      { q: '¿Puedo usar varias calculadoras?', a: 'Sí. Si tu caso tiene varios componentes, conviene revisar más de una.' },
    ],
  },
  {
    title: 'Calculadoras Familiares | SIGLEP',
    url: '/calculadoras/familiar/',
    redirectTo: '/calculadoras/familiar/pension-alimenticia/',
    eyebrow: 'Categoría Familiar',
    heroTitle: 'Calculadoras familiares <em>con enfoque práctico.</em>',
    heroLead: 'Pensión alimenticia, divorcio, custodia, régimen matrimonial y sociedad conyugal agrupados para revisar escenarios familiares con orden.',
    description: 'Calculadoras familiares SIGLEP para pensión alimenticia, divorcio, custodia de menores, régimen matrimonial y liquidación de sociedad conyugal.',
    primaryHref: '/familiar/',
    primaryLabel: 'Ir al Área Familiar',
    secondaryHref: CONSULTATION_URL,
    secondaryLabel: 'Agendar Consulta',
    sectionTitle: 'Cinco calculadoras familiares',
    sectionLead: 'Selecciona la herramienta que corresponda a tu situación y revisa el contexto completo del asunto familiar.',
    ctaBandTitle: 'Los asuntos familiares se preparan con claridad',
    ctaBandLead: 'Un cálculo orientativo ayuda a ordenar la conversación antes de la revisión formal.',
    faqLead: 'Elegir bien la herramienta ahorra tiempo y evita mezclar escenarios distintos.',
    cards: categoryCardsFor(calculatorPages.filter((page) => page.categorySlug === 'familiar')),
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Calculadoras', href: '/calculadoras/' },
      { name: 'Familiar', href: '/calculadoras/familiar/' },
    ],
    faq: [
      { q: '¿Las cifras son definitivas?', a: 'No. Son una guía para entender el escenario antes de revisar pruebas y contexto.' },
      { q: '¿Puedo revisar varios temas a la vez?', a: 'Sí, sobre todo cuando pensión, custodia y divorcio se cruzan en el mismo asunto.' },
      { q: '¿Sirven para preparar una mediación?', a: 'Sí. Ayudan a llevar una base más ordenada a la conversación.' },
    ],
  },
  {
    title: 'Calculadoras Civiles | SIGLEP',
    url: '/calculadoras/civil/',
    redirectTo: '/calculadoras/civil/dano-moral/',
    eyebrow: 'Categoría Civil',
    heroTitle: 'Calculadoras civiles <em>para cuantificar el daño.</em>',
    heroLead: 'Daño moral, daños y perjuicios, responsabilidad civil e intereses moratorios en un solo bloque de navegación.',
    description: 'Calculadoras civiles SIGLEP para daño moral, daños y perjuicios, responsabilidad civil e intereses moratorios.',
    primaryHref: '/civil/',
    primaryLabel: 'Ir al Área Civil',
    secondaryHref: CONSULTATION_URL,
    secondaryLabel: 'Agendar Consulta',
    sectionTitle: 'Cuatro calculadoras civiles',
    sectionLead: 'Úsalas para revisar cuantías y preparar mejor un reclamo o una negociación.',
    ctaBandTitle: 'Si hubo daño, también hay que cuantificarlo',
    ctaBandLead: 'Una referencia inicial ayuda a sostener el reclamo con más orden y menos improvisación.',
    faqLead: 'Estas preguntas te ubican en el tipo de cálculo civil que más se acerca a tu caso.',
    cards: categoryCardsFor(calculatorPages.filter((page) => page.categorySlug === 'civil')),
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Calculadoras', href: '/calculadoras/' },
      { name: 'Civil', href: '/calculadoras/civil/' },
    ],
    faq: [
      { q: '¿Estas herramientas sustituyen una pericial?', a: 'No. Sirven como referencia inicial y no reemplazan el análisis técnico del caso.' },
      { q: '¿Necesito pruebas documentales?', a: 'Sí. Contratos, facturas, dictámenes y comunicaciones ayudan a sostener el reclamo.' },
      { q: '¿Puedo usar el resultado para negociar?', a: 'Sí, como base para ordenar la conversación y comparar escenarios.' },
    ],
  },
  {
    title: 'Calculadoras Patrimoniales | SIGLEP',
    url: '/calculadoras/patrimonial/',
    redirectTo: '/calculadoras/patrimonial/herencia-sucesion/',
    eyebrow: 'Categoría Patrimonial',
    heroTitle: 'Calculadoras patrimoniales <em>para ordenar herencias.</em>',
    heroLead: 'Herencia y sucesión en una sola ruta para revisar un escenario patrimonial con más claridad y continuidad.',
    description: 'Calculadora patrimonial SIGLEP para herencia y sucesión en México.',
    primaryHref: '/patrimonial/',
    primaryLabel: 'Ir al Área Patrimonial',
    secondaryHref: CONSULTATION_URL,
    secondaryLabel: 'Agendar Consulta',
    sectionTitle: 'Una calculadora patrimonial',
    sectionLead: 'La herramienta te da una primera referencia antes de ordenar bienes, testamentos y herederos.',
    ctaBandTitle: 'La sucesión se revisa con orden',
    ctaBandLead: 'Un criterio patrimonial claro reduce fricción en decisiones sensibles.',
    faqLead: 'La categoría patrimonial concentra el cálculo más útil para herencias y sucesiones.',
    cards: categoryCardsFor(calculatorPages.filter((page) => page.categorySlug === 'patrimonial')),
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Calculadoras', href: '/calculadoras/' },
      { name: 'Patrimonial', href: '/calculadoras/patrimonial/' },
    ],
    faq: [
      { q: '¿La calculadora define la sucesión?', a: 'No. Solo da una referencia para entender el escenario patrimonial.' },
      { q: '¿Sirve si no hay testamento?', a: 'Sí. Ayuda a ubicar la ruta general de la sucesión.' },
      { q: '¿Conviene revisar documentos primero?', a: 'Sí. Actas, testamentos y títulos de propiedad cambian el análisis.' },
    ],
  },
  {
    title: 'Calculadoras de Seguridad Social | SIGLEP',
    url: '/calculadoras/seguridad-social/',
    redirectTo: '/calculadoras/seguridad-social/pension-imss/',
    eyebrow: 'Categoría Seguridad Social',
    heroTitle: 'Calculadoras de seguridad social <em>para planear el retiro.</em>',
    heroLead: 'IMSS, Modalidad 40, ISSSTE, invalidez y viudez agrupados para revisar el expediente con anticipación.',
    description: 'Calculadoras de seguridad social SIGLEP para pensión IMSS, Modalidad 40, pensión ISSSTE, invalidez y viudez.',
    primaryHref: '/seguridad-social/',
    primaryLabel: 'Ir al Área de Seguridad Social',
    secondaryHref: CONSULTATION_URL,
    secondaryLabel: 'Agendar Consulta',
    sectionTitle: 'Cinco calculadoras de seguridad social',
    sectionLead: 'Revisa la que corresponda a tu régimen y usa el resultado como guía de planeación.',
    ctaBandTitle: 'Tu retiro se prepara con anticipación',
    ctaBandLead: 'La revisión temprana de semanas, salario base y documentos puede cambiar el resultado final.',
    faqLead: 'Las preguntas frecuentes te ayudan a distinguir entre IMSS, ISSSTE y escenarios especiales.',
    cards: categoryCardsFor(calculatorPages.filter((page) => page.categorySlug === 'seguridad-social')),
    breadcrumb: [
      { name: 'Inicio', href: '/' },
      { name: 'Calculadoras', href: '/calculadoras/' },
      { name: 'Seguridad social', href: '/calculadoras/seguridad-social/' },
    ],
    faq: [
      { q: '¿Estas calculadoras sustituyen al instituto?', a: 'No. Son una guía para revisar el caso antes del trámite formal.' },
      { q: '¿Cuál debo usar primero?', a: 'La que coincida con tu régimen y con el beneficio que buscas.' },
      { q: '¿Conviene revisar semanas y salario antes?', a: 'Sí, porque esos datos cambian mucho el escenario.' },
    ],
  },
];

const hubConfig = {
  title: 'Calculadoras SIGLEP | Áreas',
  url: '/calculadoras/',
  description: 'Hub de calculadoras legales SIGLEP para Laboral, Familiar, Civil, Patrimonial y Seguridad Social.',
  eyebrow: '',
  heroTitle: 'CALCULADORAS <em>LEGALES</em>',
  heroLead: '',
  primaryHref: WA_LINK,
  primaryLabel: 'Consulta Gratuita por WhatsApp',
  secondaryHref: CONSULTATION_URL,
  secondaryLabel: 'Agendar Consulta',
  sectionTitle: 'Áreas disponibles',
  sectionLead: 'Seleccione el área jurídica que corresponda a su asunto.',
  ctaBandTitle: '',
  ctaBandLead: '',
  categories: [
    { href: '/calculadoras/laboral/', kicker: 'Área', title: 'Laboral', desc: 'Liquidación, finiquito, despido, horas extras y prestaciones proporcionales.' },
    { href: '/calculadoras/familiar/', kicker: 'Área', title: 'Familiar', desc: 'Pensión alimenticia, divorcio, custodia, régimen matrimonial y sociedad conyugal.' },
    { href: '/calculadoras/civil/', kicker: 'Área', title: 'Civil', desc: 'Daño moral, daños y perjuicios, responsabilidad civil e intereses moratorios.' },
    { href: '/calculadoras/patrimonial/', kicker: 'Área', title: 'Patrimonial', desc: 'Herencia y sucesión con enfoque de orden y continuidad patrimonial.' },
    { href: '/calculadoras/seguridad-social/', kicker: 'Área', title: 'Seguridad Social', desc: 'Pensión IMSS, Modalidad 40, pensión ISSSTE, invalidez y viudez.' },
  ],
  calculators: calculatorPages.map((page) => ({
    href: page.url,
    category: page.categoryName,
    title: page.title.replace(' | SIGLEP', ''),
    desc: page.description,
  })),
};

function relatedForCategory(categorySlug, currentUrl) {
  const group = calculatorPages.filter((page) => page.categorySlug === categorySlug);
  const items = group.map((page) => ({
    href: page.url,
    kicker: page.categoryName,
    title: page.title.replace('Calculadora de ', '').replace(' | SIGLEP', ''),
    desc: page.description,
  })).filter((item) => item.href !== currentUrl);

  if (items.length > 0) return items;

  return [
    {
      href: '/calculadoras/',
      kicker: 'Hub',
      title: 'Ir a calculadoras relacionadas',
      desc: 'Explora todas las áreas y sigue una ruta más clara dentro del sitio.',
    },
  ];
}

function writeCalculatorPages() {
  calculatorPages.forEach((page) => {
    const pageHtml = calculatorPage({
      ...page,
      related: relatedForCategory(page.categorySlug, page.url),
    });
    writeFile(path.join(ROOT, page.url, 'index.html'), pageHtml);
  });
}

function writeCategoryPages() {
  categoryPages.forEach((page) => {
    writeFile(path.join(ROOT, page.url, 'index.html'), categoryPage(page));
  });
}

function writeCalculatorCategoryPages() {
  calculatorCategoryPages.forEach((page) => {
    writeFile(path.join(ROOT, page.url, 'index.html'), redirectPage(page));
  });
}

function writeHubPage() {
  writeFile(path.join(ROOT, hubConfig.url, 'index.html'), hubPage(hubConfig));
}

function updateSitemap() {
  const urls = [
    '/',
    '/laboral/',
    '/familiar/',
    '/civil/',
    '/migratorio/',
    '/patrimonial/',
    '/penal/',
    '/seguridad-social/',
    '/calculadoras/',
    '/expediente/',
    '/nosotros/',
    '/liquidacion-laboral/',
    '/despido-injustificado/',
    '/blog/',
    '/blog/despido-injustificado-liquidacion/',
    '/blog/pension-alimentaria-mexico/',
    '/blog/citatorio-ministerio-publico/',
    '/blog/herencia-sin-testamento-mexico/',
    '/blog/visa-trabajo-mexico/',
    '/blog/acoso-laboral-mobbing-mexico/',
    '/gracias/',
    ...categoryPages.map((page) => page.url),
    ...calculatorCategoryPages.map((page) => page.url),
    ...calculatorPages.map((page) => page.url),
  ];

  const uniqueUrls = [...new Set(urls)];
  const lines = uniqueUrls.map((url) => {
    const lastmod = url.startsWith('/calculadoras/') || url === '/civil/' || url === '/seguridad-social/' ? '2026-06-22' : '2026-06-22';
    const priority = url === '/' ? '1.0' : url.endsWith('/calculadoras/') ? '0.9' : url.includes('/blog/') ? '0.7' : '0.8';
    const changefreq = url === '/' ? 'weekly' : url.includes('/blog/') ? 'monthly' : 'monthly';
    return `  <url><loc>${SITE_URL}${url}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${lines.join('\n')}
</urlset>
`;
  writeFile(path.join(ROOT, 'sitemap.xml'), sitemap);
}

function patchHomePage() {
  const filePath = path.join(ROOT, 'index.html');
  if (!fs.existsSync(filePath)) return;

  let html = readFile(filePath);
  html = insertShellInclude(html);
  html = replaceLegacyNav(html);
  html = insertShellNavStyles(html);

  const powersOld = /<div class="poderes-grid reveal">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/m;
  const powersNew = `<div class="poderes-grid reveal">
      <!-- Laboral -->
      <div class="poder-card">
        <span class="poder-num">01</span>
        <div class="poder-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
        </div>
        <div class="poder-area">Derecho Laboral</div>
        <h3 class="poder-title">Derecho Laboral</h3>
        <p class="poder-desc">Despidos, liquidaciones, convenios, conflictos laborales y defensa de derechos laborales.</p>
        <ul class="poder-items">
          <li>Liquidaciones y finiquitos completos</li>
          <li>Despido injustificado y reinstalación</li>
          <li>Acoso laboral y conflictos con el patrón</li>
          <li>Convenios y negociación previa a juicio</li>
        </ul>
        <div class="poder-actions">
          <a href="/laboral/" class="poder-action">Ver área laboral <span>→</span></a>
          <a href="/calculadoras/laboral/" class="poder-action-secondary">Ir a calculadoras laborales <span>→</span></a>
        </div>
      </div>
      <!-- Familiar -->
      <div class="poder-card">
        <span class="poder-num">02</span>
        <div class="poder-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
        </div>
        <div class="poder-area">Derecho Familiar</div>
        <h3 class="poder-title">Derecho Familiar</h3>
        <p class="poder-desc">Divorcio, pensión alimentaria y custodia de menores.</p>
        <ul class="poder-items">
          <li>Divorcio y separación</li>
          <li>Custodia y patria potestad</li>
          <li>Pensión alimentaria</li>
        </ul>
        <div class="poder-actions">
          <a href="/familiar/" class="poder-action">Ver área familiar <span>→</span></a>
          <a href="/calculadoras/familiar/" class="poder-action-secondary">Ir a calculadoras familiares <span>→</span></a>
        </div>
      </div>
      <!-- Civil -->
      <div class="poder-card">
        <span class="poder-num">03</span>
        <div class="poder-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l3 6-9 12L3 9l3-6z"/><path d="M9 9h6"/></svg>
        </div>
        <div class="poder-area">Derecho Civil</div>
        <h3 class="poder-title">Derecho Civil</h3>
        <p class="poder-desc">Daño moral, daños y perjuicios, responsabilidad civil e intereses moratorios.</p>
        <ul class="poder-items">
          <li>Daño moral y reputacional</li>
          <li>Daños y perjuicios</li>
          <li>Responsabilidad civil</li>
          <li>Intereses moratorios</li>
        </ul>
        <div class="poder-actions">
          <a href="/civil/" class="poder-action">Ver área civil <span>→</span></a>
          <a href="/calculadoras/civil/" class="poder-action-secondary">Ir a calculadoras civiles <span>→</span></a>
        </div>
      </div>
    </div>
    <div class="areas-cta-wrap">
      <a class="areas-cta" href="#areas">Ver todas las áreas de práctica</a>
    </div>
  </div>
</section>`;

  if (powersOld.test(html)) {
    html = html.replace(powersOld, powersNew);
  }

  html = replaceMany(html, [
    ['<a href="/laboral/#calculadora">Calculadora</a>', '<a href="/calculadoras/">Calculadoras</a>'],
    ['<a href="/laboral/#calculadora" onclick="closeMobileNav()">Calculadora</a>', '<a href="/calculadoras/" onclick="closeMobileNav()">Calculadoras</a>'],
    ['Te respondemos con rapidez.', 'Respondemos a la brevedad posible en horario de atención.'],
    ['Te respondemos en menos de 24 horas · Sin costo · Sin compromiso', 'Respondemos a la brevedad posible en horario de atención · Sin costo · Sin compromiso'],
    ['te contacta en menos de 24 horas', 'respondemos a la brevedad posible en horario de atención'],
    ['Te respondemos en minutos', 'Respondemos a la brevedad posible en horario de atención'],
  ]);

  writeFile(filePath, html);
}

function patchGraciasPage() {
  const filePath = path.join(ROOT, 'gracias/index.html');
  if (!fs.existsSync(filePath)) return;
  let html = readFile(filePath);
  html = insertShellInclude(html);
  html = replaceMany(html, [
    ['Un especialista SIGLEP te contactará en menos de 24 horas.', 'Respondemos a la brevedad posible en horario de atención.'],
    ['Un especialista SIGLEP te contactará personalmente — generalmente en menos de 24 horas en días hábiles.', 'Respondemos a la brevedad posible en horario de atención.'],
  ]);
  writeFile(filePath, html);
}

function run() {
  patchSeoOnlyPages();
  patchExistingPages();
  patchHomePage();
  patchGraciasPage();
  writeHubPage();
  writeCategoryPages();
  writeCalculatorCategoryPages();
  writeCalculatorPages();
  updateSitemap();
  console.log('SIGLEP site generation complete.');
}

run();
