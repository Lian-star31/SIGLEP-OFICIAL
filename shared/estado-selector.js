(function () {
  'use strict';

  var DATOS = window.__SIGLEP_ESTADOS__;
  if (!DATOS) return;

  var estados = DATOS.estados;

  function setEstadoActivo(clave) {
    var estado = estados.find(function (e) { return e.clave === clave; }) || null;
    window.__SIGLEP_ESTADO_ACTIVO__ = estado;
    document.dispatchEvent(new CustomEvent('siglep:estado-change', {
      detail: estado,
    }));
  }

  function buildOptions() {
    return estados.map(function (e) {
      return '<option value="' + e.clave + '">' + e.nombre + '</option>';
    }).join('');
  }

  function injectSelector(form) {
    if (document.getElementById('estado_republica')) return;

    var wrapper = document.createElement('div');
    wrapper.className = 'field';
    wrapper.innerHTML =
      '<label for="estado_republica">Estado / Municipio</label>' +
      '<select id="estado_republica" name="estado_republica" required>' +
        '<option value="" disabled selected>Selecciona tu estado</option>' +
        buildOptions() +
      '</select>';

    form.insertBefore(wrapper, form.firstChild);

    document.getElementById('estado_republica').addEventListener('change', function () {
      setEstadoActivo(this.value);
    });
  }

  function init() {
    var form = document.getElementById('calc-form');
    if (!form) return;
    injectSelector(form);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
