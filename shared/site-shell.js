(function () {
  const SERVICES = [
    ['Laboral', '/laboral/'],
    ['Familiar', '/familiar/'],
    ['Civil', '/civil/'],
    ['Migratorio', '/migratorio/'],
    ['Patrimonial', '/patrimonial/'],
    ['Penal', '/penal/'],
    ['Seguridad Social', '/seguridad-social/'],
  ];

  const CALCULATOR_AREAS = [
    ['Calculadoras', '/calculadoras/'],
    ['Laboral', '/calculadoras/laboral/'],
    ['Familiar', '/calculadoras/familiar/'],
    ['Civil', '/calculadoras/civil/'],
    ['Patrimonial', '/calculadoras/patrimonial/'],
    ['Seguridad Social', '/calculadoras/seguridad-social/'],
  ];

  const PHONE = '527352169503';
  const WA = `https://wa.me/${PHONE}`;
  const SHELL_STYLE_ID = 'siglep-shell-style';

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function pageIs(prefix) {
    return location.pathname === prefix || location.pathname.startsWith(prefix.replace(/\/$/, '') + '/');
  }

  function injectStyles() {
    if (document.getElementById(SHELL_STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = SHELL_STYLE_ID;
    style.textContent = `
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
        padding-bottom: 28px;
        margin-bottom: -28px;
        position: relative;
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
      .siglep-shell-services.is-open .siglep-shell-dropdown {
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
      footer.siglep-shell-footer {
        background: #050810;
        border-top: 1px solid rgba(197, 160, 89, 0.12);
        padding: 4rem 1.25rem 1.5rem;
      }
      .siglep-shell-footer-inner {
        max-width: 1240px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1.6fr 1fr 1fr 1fr;
        gap: 2.25rem;
      }
      .siglep-shell-footer-brand .siglep-shell-mark {
        display: block;
        margin-bottom: 0.85rem;
      }
      .siglep-shell-footer-brand p {
        max-width: 320px;
        color: rgba(255, 255, 255, 0.38);
        font-size: 0.8rem;
        line-height: 1.8;
        font-weight: 300;
      }
      .siglep-shell-footer h5 {
        margin: 0 0 0.9rem;
        color: #c5a059;
        font-size: 0.62rem;
        font-weight: 700;
        letter-spacing: 0.22em;
        text-transform: uppercase;
      }
      .siglep-shell-footer ul {
        margin: 0;
        padding: 0;
        list-style: none;
        display: grid;
        gap: 0.55rem;
      }
      .siglep-shell-footer a,
      .siglep-shell-footer span {
        color: rgba(255, 255, 255, 0.38);
        font-size: 0.78rem;
        text-decoration: none;
      }
      .siglep-shell-footer a:hover {
        color: #c5a059;
      }
      .siglep-shell-footer-bottom {
        max-width: 1240px;
        margin: 2rem auto 0;
        padding-top: 1.4rem;
        border-top: 1px solid rgba(197, 160, 89, 0.08);
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
        font-size: 0.72rem;
        color: rgba(255, 255, 255, 0.26);
      }
      .siglep-shell-footer-bottom a {
        color: rgba(255, 255, 255, 0.35);
      }
      .siglep-shell-footer-bottom a:hover {
        color: #c5a059;
      }
      @media (max-width: 980px) {
        .siglep-shell-links {
          display: none;
        }
        .siglep-shell-burger {
          display: inline-flex;
        }
        .siglep-shell-footer-inner {
          grid-template-columns: 1fr 1fr;
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
        .siglep-shell-footer {
          padding-inline: 0.9rem;
        }
        .siglep-shell-footer-inner {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function createBrand() {
    return `
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
    `;
  }

  function createDesktopNav() {
    const services = SERVICES.map(([label, href]) => `<a href="${href}">${escapeHtml(label)} <span>→</span></a>`).join('');
    return `
      <ul class="siglep-shell-links">
        <li><a href="/" data-nav="home">Inicio</a></li>
        <li class="siglep-shell-services">
          <button type="button" aria-haspopup="true" aria-expanded="false" data-nav="services">Servicios ▼</button>
          <div class="siglep-shell-dropdown">
            ${services}
          </div>
        </li>
        <li><a href="/calculadoras/" data-nav="calculadoras">Calculadoras</a></li>
        <li><a href="/expediente/" data-nav="expediente">Expediente</a></li>
        <li><a href="/nosotros/" data-nav="nosotros">Nosotros</a></li>
        <li><a class="siglep-shell-cta" href="${WA}?text=${encodeURIComponent('Hola SIGLEP, quiero una consulta gratuita')}" target="_blank" rel="noopener noreferrer">Consulta Gratis</a></li>
      </ul>
      <button type="button" class="siglep-shell-burger" aria-label="Abrir menú" onclick="toggleMobileNav()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M4 6h16"></path>
          <path d="M4 12h16"></path>
          <path d="M4 18h16"></path>
        </svg>
      </button>
    `;
  }

  function createMobileNav() {
    const serviceLinks = SERVICES.map(([label, href]) => `<a href="${href}" onclick="closeMobileNav()">${escapeHtml(label)}</a>`).join('');
    return `
      <div class="siglep-shell-mobile" id="navMobile" aria-hidden="true">
        <div class="siglep-shell-mobile-group">
          <a href="/" onclick="closeMobileNav()">Inicio</a>
        </div>
        <div class="siglep-shell-mobile-title">Servicios</div>
        <div class="siglep-shell-mobile-group">
          ${serviceLinks}
        </div>
        <div class="siglep-shell-mobile-group">
          <a href="/calculadoras/" onclick="closeMobileNav()">Calculadoras</a>
          <a href="/expediente/" onclick="closeMobileNav()">Expediente</a>
          <a href="/nosotros/" onclick="closeMobileNav()">Nosotros</a>
          <a class="siglep-shell-cta" href="${WA}?text=${encodeURIComponent('Hola SIGLEP, quiero una consulta gratuita')}" target="_blank" rel="noopener noreferrer">Consulta Gratis</a>
        </div>
      </div>
    `;
  }

  function createFooter() {
    return `
      <div class="siglep-shell-footer-inner">
        <div class="siglep-shell-footer-brand">
          <span class="siglep-shell-mark">SIGLEP.</span>
          <p>Sistemas Integrales de Gestión Legal. Acompañamiento legal para personas y familias en todo México. Atención nacional · México 2026.</p>
        </div>
        <div>
          <h5>Áreas</h5>
          <ul>
            ${SERVICES.map(([label, href]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`).join('')}
          </ul>
        </div>
        <div>
          <h5>Calculadoras</h5>
          <ul>
            ${CALCULATOR_AREAS.map(([label, href]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`).join('')}
          </ul>
        </div>
        <div>
          <h5>Contacto</h5>
          <ul>
            <li><a href="${WA}" target="_blank" rel="noopener noreferrer">+52 735 216 9503</a></li>
            <li><a href="mailto:hola@siglep.lat">hola@siglep.lat</a></li>
            <li><a href="mailto:juridico@siglep.lat">juridico@siglep.lat</a></li>
            <li><span>Atención nacional</span></li>
          </ul>
        </div>
      </div>
      <div class="siglep-shell-footer-bottom">
        <span>© 2026 SIGLEP — Sistemas Integrales de Gestión Legal. Todos los derechos reservados.</span>
        <span>Consulta inicial gratuita · Respuesta en horario de atención</span>
      </div>
    `;
  }

  function replaceNavAndFooter() {
    const isBlog = location.pathname.startsWith('/blog/');
    const nav = document.querySelector('nav') || document.body.querySelector('header');
    if (nav) {
      nav.classList.add('siglep-shell-nav');
      nav.id = 'navbar';
      nav.innerHTML = `
        <div class="siglep-shell-nav-inner">
          ${createBrand()}
          ${createDesktopNav()}
        </div>
        ${createMobileNav()}
      `;
    } else {
      const newNav = document.createElement('nav');
      newNav.className = 'siglep-shell-nav';
      newNav.id = 'navbar';
      newNav.innerHTML = `
        <div class="siglep-shell-nav-inner">
          ${createBrand()}
          ${createDesktopNav()}
        </div>
        ${createMobileNav()}
      `;
      document.body.prepend(newNav);
    }

    if (!isBlog) {
      const footer = document.querySelector('footer');
      if (footer) {
        footer.className = 'siglep-shell-footer';
        footer.innerHTML = createFooter();
      } else {
        const newFooter = document.createElement('footer');
        newFooter.className = 'siglep-shell-footer';
        newFooter.innerHTML = createFooter();
        document.body.appendChild(newFooter);
      }
    }
  }

  function addMobileHelpers() {
    window.toggleMobileNav = function () {
      const menu = document.getElementById('navMobile');
      if (!menu) return;
      menu.classList.toggle('open');
      menu.setAttribute('aria-hidden', menu.classList.contains('open') ? 'false' : 'true');
    };

    window.closeMobileNav = function () {
      const menu = document.getElementById('navMobile');
      if (!menu) return;
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
    };

    document.addEventListener('click', function (event) {
      const menu = document.getElementById('navMobile');
      if (!menu || !menu.classList.contains('open')) return;
      const nav = document.getElementById('navbar');
      if (nav && !nav.contains(event.target)) {
        window.closeMobileNav();
      }
    });
  }

  function addServicesDropdownHelpers() {
    const item = document.querySelector('.siglep-shell-services');
    if (!item) return;

    const button = item.querySelector('button[data-nav="services"]');
    const dropdown = item.querySelector('.siglep-shell-dropdown');
    let closeTimer = null;

    const setOpen = (open) => {
      item.classList.toggle('is-open', open);
      if (button) button.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    const open = () => {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
      setOpen(true);
    };

    const scheduleClose = () => {
      if (closeTimer) clearTimeout(closeTimer);
      closeTimer = setTimeout(() => setOpen(false), 500);
    };

    item.addEventListener('pointerenter', open);
    item.addEventListener('pointerleave', scheduleClose);
    item.addEventListener('focusin', open);
    item.addEventListener('focusout', (event) => {
      if (!item.contains(event.relatedTarget)) scheduleClose();
    });
    if (dropdown) {
      dropdown.addEventListener('pointerenter', open);
      dropdown.addEventListener('pointerleave', scheduleClose);
    }

    if (button) {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        setOpen(!item.classList.contains('is-open'));
      });
    }

    document.addEventListener('click', (event) => {
      if (!item.contains(event.target)) setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });
  }

  function normalizeCopy() {
    const replacements = [
      [/te responder[aá] en minutos\.?/gi, 'Respondemos a la brevedad posible en horario de atención.'],
      [/te respondemos en minutos\.?/gi, 'Respondemos a la brevedad posible en horario de atención.'],
      [/te respondemos con rapidez\.?/gi, 'Respondemos a la brevedad posible en horario de atención.'],
      [/te contacta en menos de 24 horas\.?/gi, 'Respondemos a la brevedad posible en horario de atención.'],
      [/te contactará en menos de 24 horas\.?/gi, 'Respondemos a la brevedad posible en horario de atención.'],
      [/menos de 24 horas en días hábiles\.?/gi, 'a la brevedad posible en horario de atención.'],
    ];

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((node) => {
      const original = node.nodeValue;
      let next = original;
      replacements.forEach(([pattern, replacement]) => {
        next = next.replace(pattern, replacement);
      });
      if (next !== original) {
        node.nodeValue = next;
      }
    });
  }

  function markActiveLinks() {
    const path = location.pathname.replace(/\/+$/, '/') || '/';
    document.querySelectorAll('[data-nav]').forEach((el) => {
      const navKey = el.getAttribute('data-nav');
      let active = false;
      if (navKey === 'home') active = path === '/';
      if (navKey === 'expediente') active = path.startsWith('/expediente/');
      if (navKey === 'nosotros') active = path.startsWith('/nosotros/');
      if (navKey === 'services') active = [
        '/laboral/',
        '/familiar/',
        '/civil/',
        '/migratorio/',
        '/patrimonial/',
        '/penal/',
        '/seguridad-social/',
      ].some((prefix) => path.startsWith(prefix));
      if (navKey === 'calculators') active = path.startsWith('/calculadoras/');
      if (active) {
        el.setAttribute('aria-current', 'page');
      }
    });
  }

  function ensureCalculatorAnchors() {
    if (pageIs('/laboral/')) {
      document.querySelectorAll('a[href="/laboral/#calculadora"]').forEach((link) => {
        link.setAttribute('href', '/calculadoras/laboral/');
      });
      document.querySelectorAll('a[href="#calculadora"]').forEach((link) => {
        link.setAttribute('href', '/calculadoras/laboral/');
      });
    }
  }

  function init() {
    injectStyles();
    replaceNavAndFooter();
    addMobileHelpers();
    addServicesDropdownHelpers();
    normalizeCopy();
    markActiveLinks();
    ensureCalculatorAnchors();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
