/* SIGLEP VISA — sección /visa/ de siglep.lat
 * El encabezado, el menú, el pie y GA4 los inyecta /shared/site-shell.js.
 * Aquí sólo vive lo propio de la sección: enlaces de WhatsApp con mensaje,
 * preselección del servicio desde los CTA y envío del formulario.
 * Contacto: mismo WhatsApp y mismo destino de formulario que el resto del sitio.
 */
(function () {
  'use strict';

  var PHONE = '525661755112';
  var WA = 'https://wa.me/' + PHONE;
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/hola@siglep.lat';

  /* ── Enlaces de WhatsApp con mensaje contextual ── */
  Array.prototype.forEach.call(document.querySelectorAll('[data-wa]'), function (a) {
    var msg = a.getAttribute('data-wa-msg') || 'Hola SIGLEP VISA, quiero información.';
    a.href = WA + '?text=' + encodeURIComponent(msg);
  });

  /* ── CTA diferenciados: preseleccionan el servicio ── */
  var PRESET = {
    visa: 'Visa americana B1/B2 (primera vez)',
    pasaporte: 'Pasaporte mexicano (primera vez)',
    ds160: 'Orientación y preparación del DS-160'
  };
  var servicio = document.getElementById('f-servicio');
  Array.prototype.forEach.call(document.querySelectorAll('[data-cta]'), function (a) {
    a.addEventListener('click', function () {
      var v = PRESET[a.getAttribute('data-cta')];
      if (!servicio || !v) return;
      servicio.value = v;
      setTimeout(function () {
        var nombre = document.getElementById('f-nombre');
        if (nombre) nombre.focus({ preventScroll: true });
      }, 450);
    });
  });

  /* ── Formulario ── */
  var form = document.getElementById('leadForm');
  if (!form) return;
  var btn = document.getElementById('formBtn');
  var boxErr = document.getElementById('formErr');
  var btnLabel = btn ? btn.textContent : '';

  function show(box, html) {
    box.innerHTML = html;
    box.classList.add('show');
  }
  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    boxErr.classList.remove('show');

    function fail(msg, id) {
      show(boxErr, msg);
      var el = document.getElementById(id);
      if (el) el.focus();
      return false;
    }

    var nombre = val('f-nombre');
    var telefono = val('f-telefono');
    var correo = val('f-correo');
    var serv = val('f-servicio');
    var comentarios = val('f-comentarios');
    var consent = document.getElementById('f-consent').checked;
    var digitos = telefono.replace(/\D/g, '');

    if (!nombre || nombre.length < 3) return fail('Escribe tu nombre completo.', 'f-nombre');
    if (digitos.length < 10) return fail('Escribe un teléfono a 10 dígitos para poder contactarte.', 'f-telefono');
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(correo)) return fail('Revisa tu correo electrónico.', 'f-correo');
    if (!serv) return fail('Selecciona el servicio que necesitas.', 'f-servicio');
    if (!consent) return fail('Necesitamos tu consentimiento para contactarte y tratar tus datos.', 'f-consent');

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Enviando…';
    }

    var waMsg =
      'Hola SIGLEP VISA, soy ' + nombre + '.\n' +
      'Teléfono: ' + telefono + '\n' +
      'Correo: ' + correo + '\n' +
      'Servicio: ' + serv +
      (comentarios ? '\nComentarios: ' + comentarios : '') +
      '\nEnvié mi solicitud desde siglep.lat/visa/.';
    var waLink = WA + '?text=' + encodeURIComponent(waMsg);

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', { seccion: 'visa', servicio: serv });
    }

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: 'SIGLEP VISA — nueva solicitud: ' + serv,
        _template: 'table',
        nombre: nombre,
        telefono: telefono,
        correo: correo,
        servicio: serv,
        comentarios: comentarios || '(sin comentarios)',
        consentimiento: 'Aceptó el aviso de privacidad',
        origen: 'siglep.lat/visa/ — formulario de contacto',
        fecha: new Date().toLocaleString('es-MX')
      })
    })
      .then(function (r) {
        return r.json().catch(function () { return { success: r.ok }; });
      })
      .then(function (data) {
        var ok = data && (data.success === true || data.success === 'true');
        if (!ok) throw new Error('No se pudo enviar.');
        try { sessionStorage.setItem('sv_wa', waLink); } catch (err) {}
        window.location.href = '/visa/gracias/';
      })
      .catch(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = btnLabel;
        }
        show(
          boxErr,
          'No pudimos enviar tu solicitud en este momento. ' +
            'Escríbenos directamente por <a href="' + waLink + '" target="_blank" rel="noopener noreferrer"><strong>WhatsApp</strong></a> ' +
            'o a <a href="mailto:hola@siglep.lat">hola@siglep.lat</a> y te atendemos igual.'
        );
      });
  });
})();
