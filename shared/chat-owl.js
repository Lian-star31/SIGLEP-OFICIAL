(function() {
  var WA = 'https://wa.me/525661755112';
  var chatOpened = false;

  function scrollChat() {
    var el = document.getElementById('chatPanelBody') || document.getElementById('chatMessages');
    if (el) el.scrollTop = el.scrollHeight;
  }

  function addMsg(html, type) {
    var msgs = document.getElementById('chatMessages');
    var d = document.createElement('div');
    d.className = 'chat-msg ' + type;
    if (type === 'user') d.textContent = html;
    else d.innerHTML = html;
    msgs.appendChild(d);
    scrollChat();
  }

  function showTyping() {
    var msgs = document.getElementById('chatMessages');
    var t = document.createElement('div');
    t.className = 'chat-msg bot chat-typing';
    t.id = 'owlTyping';
    t.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(t);
    scrollChat();
  }

  function hideTyping() {
    var t = document.getElementById('owlTyping');
    if (t) t.remove();
  }

  function setOpts(opts) {
    var el = document.getElementById('chatOptions');
    el.innerHTML = opts.map(function(o) {
      if (o.wa) {
        var txt = encodeURIComponent(o.wa);
        return '<a class="chat-opt chat-opt-wa" href="' + WA + '?text=' + txt + '" target="_blank" rel="noopener noreferrer">📲 ' + o.label + '</a>';
      }
      if (o.href) {
        return '<a class="chat-opt" href="' + o.href + '">' + o.label + '</a>';
      }
      return '<button type="button" class="chat-opt" onclick="optSelected(\'' + o.k + '\', this.textContent.trim())">' + o.label + '</button>';
    }).join('');
    scrollChat();
  }

  function clearOpts() {
    document.getElementById('chatOptions').innerHTML = '';
  }

  function optSelected(k, label) {
    clearOpts();
    document.getElementById('chatMessages').innerHTML = '';
    addMsg(label, 'user');
    step(k);
  }

  function bot(html, delay, cb) {
    setTimeout(function() { hideTyping(); addMsg(html, 'bot'); if (cb) cb(); }, delay || 500);
  }

  function step(k) {
    clearOpts();
    showTyping();

    if (k === '__init__') {
      hideTyping();
      addMsg('Hola, soy el asistente legal de <strong>SIGLEP</strong> 🦉. Estoy aquí para orientarte — sin importar dónde estés en México.<br><br>¿Sobre qué necesitas orientación hoy?', 'bot');
      setOpts([
        { k: 'expediente', label: '🗂️ Diagnóstico gratuito de mi caso' },
        { k: 'laboral',    label: '⚖️ Asunto laboral' },
        { k: 'familiar',   label: '👨‍👩‍👧 Asunto familiar' },
        { k: 'penal',      label: '🔒 Asunto penal' },
        { k: 'financiero', label: '💳 Deudas / cobranza' },
        { k: 'mercantil',  label: '📋 Contratos / negocios' },
        { k: 'cobertura',  label: '📍 ¿Atienden desde mi ciudad?' },
        { k: 'costos',     label: '💰 ¿Cuánto cobran?' },
      ]);
      return;
    }

    if (k === 'laboral') {
      bot('Los asuntos laborales tienen plazos legales — actuar rápido marca la diferencia. ¿Qué está pasando?', 400, function() { setOpts([
        { k: 'lab_despido',     label: '🚪 Me despidieron' },
        { k: 'lab_liquidacion', label: '💵 Revisión de liquidación o finiquito' },
        { k: 'lab_renuncia',    label: '✍️ Quiero renunciar / me presionan a renunciar' },
        { k: 'lab_acoso',       label: '😤 Acoso o presión laboral' },
        { k: 'lab_nomina',      label: '📉 Descuentos o incumplimientos de nómina' },
        { k: 'lab_contrato',    label: '📄 Contrato laboral o incumplimiento' },
        { k: 'lab_otro',        label: '💬 Otra situación laboral' },
      ]); });

    } else if (k === 'lab_despido') {
      bot('Un despido injustificado te da derecho a <strong>liquidación completa: 3 meses de salario + 20 días por año trabajado + partes proporcionales</strong>. También puedes demandar ante la Junta de Conciliación.<br><br>⚠️ El plazo para actuar es de <strong>2 meses</strong> — después, prescribe el derecho.', 500, function() { setOpts([
        { wa: 'Hola SIGLEP, me despidieron y quiero asesoría sobre mi liquidación', label: '📲 Revisar mi caso gratis' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'lab_liquidacion') {
      bot('Una liquidación mal calculada puede significar <strong>miles de pesos menos de lo que realmente te corresponde</strong>. Revisamos tu propuesta sin costo y te decimos si está completa o si hay diferencias a tu favor.', 500, function() { setOpts([
        { wa: 'Hola SIGLEP, quiero que revisen mi liquidación o finiquito', label: '📲 Revisar mi liquidación gratis' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'lab_renuncia') {
      bot('Antes de firmar cualquier documento, es importante que sepas que <strong>una renuncia voluntaria puede hacerte perder derechos</strong>. Si te están presionando, existe la figura de "despido indirecto" que te protege legalmente.', 500, function() { setOpts([
        { wa: 'Hola SIGLEP, me están presionando a renunciar y necesito orientación', label: '📲 Quiero orientación urgente' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'lab_acoso') {
      bot('El acoso laboral o mobbing es una violación grave a tus derechos. Puedes <strong>levantar acta, demandar por daño moral y exigir rescisión con responsabilidad para el patrón</strong> — sin perder tu derecho a liquidación.', 500, function() { setOpts([
        { wa: 'Hola SIGLEP, estoy sufriendo acoso laboral y quiero asesoría', label: '📲 Hablar con un abogado' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'lab_nomina') {
      bot('Los descuentos indebidos, pagos incompletos o retención de IMSS son <strong>infracciones patronales que pueden reclamarse con retroactividad de hasta 1 año</strong>. Guardamos constancia de cada evidencia que tengas.', 500, function() { setOpts([
        { wa: 'Hola SIGLEP, tengo descuentos o problemas con mi nómina', label: '📲 Revisar mi caso' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'lab_contrato') {
      bot('Tanto los contratos verbales como los escritos generan obligaciones legales. Si el patrón incumple condiciones pactadas, <strong>tienes derecho a exigir cumplimiento o rescindir con indemnización</strong>.', 500, function() { setOpts([
        { wa: 'Hola SIGLEP, tengo un problema con mi contrato laboral', label: '📲 Revisar mi contrato' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'lab_otro') {
      bot('Cuéntanos tu situación directamente — un abogado laboral la revisará y te orientará sin compromiso. La primera consulta es <strong>completamente gratuita</strong>.', 400, function() { setOpts([
        { wa: 'Hola SIGLEP, tengo una situación laboral que necesito consultar', label: '📲 Consulta gratuita' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'familiar') {
      bot('El derecho familiar protege lo que más importa. ¿Cuál es tu situación?', 400, function() { setOpts([
        { k: 'fam_divorcio',  label: '💔 Divorcio o separación' },
        { k: 'fam_pension',   label: '🍼 Pensión alimentaria' },
        { k: 'fam_custodia',  label: '👶 Custodia de menores' },
        { k: 'fam_violencia', label: '🚨 Violencia familiar' },
        { k: 'fam_herencia',  label: '📜 Herencia o sucesión' },
        { k: 'fam_otro',      label: '💬 Otro asunto familiar' },
      ]); });

    } else if (k === 'fam_divorcio') {
      bot('El divorcio en México puede tramitarse de forma <strong>incausada (sin expresar motivo)</strong> — unilateral o de común acuerdo. Si hay bienes o hijos de por medio, la estrategia legal cambia. Te asesoramos desde el inicio.', 500, function() { setOpts([
        { wa: 'Hola SIGLEP, necesito orientación sobre un divorcio', label: '📲 Consulta gratuita' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'fam_pension') {
      bot('La pensión alimentaria puede solicitarse de forma <strong>urgente mediante medida cautelar</strong> mientras se resuelve el juicio. El monto considera ingresos del obligado, necesidades del menor y capacidad económica.', 500, function() { setOpts([
        { wa: 'Hola SIGLEP, necesito orientación sobre pensión alimentaria', label: '📲 Consulta gratuita' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'fam_custodia') {
      bot('En México, la custodia se determina en función del <strong>interés superior del menor</strong>. Podemos ayudarte a documentar tu caso, solicitar medidas cautelares o modificar un convenio existente.', 500, function() { setOpts([
        { wa: 'Hola SIGLEP, necesito orientación sobre custodia de mis hijos', label: '📲 Consulta gratuita' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'fam_violencia') {
      bot('Si hay riesgo inmediato, llama al <strong>911</strong>. En SIGLEP podemos tramitar <strong>órdenes de protección de emergencia</strong> y representarte en el proceso legal para garantizar tu seguridad y la de tu familia.', 400, function() { setOpts([
        { wa: 'Hola SIGLEP, necesito orientación urgente por violencia familiar', label: '📲 Orientación urgente' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'fam_herencia') {
      bot('Una sucesión sin testamento puede complicar y alargar el proceso. Con testamento, el trámite es más ágil. Te ayudamos con <strong>sucesiones intestamentarias, juicios sucesorios y trámites notariales</strong>.', 500, function() { setOpts([
        { wa: 'Hola SIGLEP, necesito orientación sobre una herencia o sucesión', label: '📲 Consulta gratuita' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'fam_otro') {
      bot('Cuéntanos tu situación — un abogado familiar la revisará y te orientará. La primera consulta es <strong>completamente gratuita</strong>.', 400, function() { setOpts([
        { wa: 'Hola SIGLEP, tengo un asunto familiar que necesito consultar', label: '📲 Consulta gratuita' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'penal') {
      bot('En materia penal, contar con defensa desde el primer momento puede cambiar el resultado. ¿Cuál es tu situación?', 400, function() { setOpts([
        { k: 'pen_detenido',  label: '🚔 Me detuvieron o me citaron' },
        { k: 'pen_denunciar', label: '📝 Quiero presentar una denuncia' },
        { k: 'pen_victima',   label: '🛡️ Soy víctima de un delito' },
        { k: 'pen_amparo',    label: '⚖️ Amparo o recurso penal' },
        { k: 'pen_otro',      label: '💬 Otra situación penal' },
      ]); });

    } else if (k === 'pen_detenido') {
      bot('Si fuiste detenido o citado ante el Ministerio Público, tienes derecho a <strong>guardar silencio y a un abogado desde el primer momento</strong>. No firmes nada sin asesoría. Actuamos de forma inmediata.', 400, function() { setOpts([
        { wa: 'Hola SIGLEP, me detuvieron o me citaron al Ministerio Público y necesito defensa', label: '📲 Defensa urgente' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'pen_denunciar') {
      bot('Presentar una denuncia correctamente documentada es clave para que proceda. Te ayudamos a <strong>redactar la denuncia, reunir evidencias y darle seguimiento ante el Ministerio Público</strong>.', 500, function() { setOpts([
        { wa: 'Hola SIGLEP, quiero presentar una denuncia y necesito orientación', label: '📲 Consulta gratuita' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'pen_victima') {
      bot('Como víctima tienes derechos: <strong>asesoría jurídica gratuita, coadyuvancia en el proceso y reparación del daño</strong>. Te acompañamos durante todo el procedimiento penal.', 500, function() { setOpts([
        { wa: 'Hola SIGLEP, soy víctima de un delito y quiero orientación legal', label: '📲 Consulta gratuita' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'pen_amparo') {
      bot('El amparo penal es una herramienta poderosa para <strong>impugnar detenciones ilegales, autos de vinculación o sentencias</strong>. Los plazos son muy cortos — es urgente actuar.', 400, function() { setOpts([
        { wa: 'Hola SIGLEP, necesito orientación sobre amparo o recurso penal', label: '📲 Orientación urgente' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'pen_otro') {
      bot('Cuéntanos tu situación — un abogado penalista la revisará. En materia penal, la asesoría temprana marca la diferencia. Primera consulta <strong>gratuita</strong>.', 400, function() { setOpts([
        { wa: 'Hola SIGLEP, tengo una situación penal que quiero consultar', label: '📲 Consulta gratuita' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'financiero') {
      bot('Las deudas tienen solución legal — desde <strong>negociación directa hasta defensa ante demandas o embargos</strong>. No tienes que enfrentarlo solo. ¿Cuál es tu situación?', 500, function() { setOpts([
        { k: 'fin_cobradores', label: '📞 Me llaman cobradores o me amenazan' },
        { k: 'fin_embargo',    label: '🔒 Embargo o demanda en mi contra' },
        { k: 'fin_negociar',   label: '🤝 Quiero negociar mi deuda' },
        { k: 'fin_otro',       label: '💬 Otra situación de deuda' },
      ]); });

    } else if (k === 'fin_cobradores') {
      bot('Las llamadas intimidatorias y las amenazas de cobradores <strong>son ilegales en México</strong>. Puedes denunciarlas ante la CONDUSEF y PROFECO. Además, podemos revisar si la deuda ya prescribió o si hay vicios en el cobro.', 500, function() { setOpts([
        { wa: 'Hola SIGLEP, me están llamando cobradores y quiero orientación legal', label: '📲 Consulta gratuita' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'fin_embargo') {
      bot('Si hay una demanda o embargo en tu contra, los <strong>plazos para contestar son muy cortos</strong>. Podemos revisar la demanda, impugnarla si tiene vicios o negociar una solución favorable.', 400, function() { setOpts([
        { wa: 'Hola SIGLEP, tengo una demanda o embargo y necesito defensa', label: '📲 Defensa urgente' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'fin_negociar') {
      bot('Una negociación bien gestionada puede reducir capital, intereses o ambos. Te representamos ante bancos, financieras o despachos de cobranza para obtener <strong>condiciones reales y por escrito</strong>.', 500, function() { setOpts([
        { wa: 'Hola SIGLEP, quiero negociar una deuda con asesoría legal', label: '📲 Consulta gratuita' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'fin_otro') {
      bot('Cuéntanos tu situación financiera — un abogado la revisará sin costo. Tenemos soluciones para deudas bancarias, hipotecas, tarjetas y más.', 400, function() { setOpts([
        { wa: 'Hola SIGLEP, tengo un problema financiero o de deudas que quiero consultar', label: '📲 Consulta gratuita' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'mercantil') {
      bot('Los negocios y contratos requieren asesoría precisa para evitar conflictos costosos. ¿En qué podemos ayudarte?', 400, function() { setOpts([
        { k: 'mer_contrato',      label: '📄 Revisar o redactar un contrato' },
        { k: 'mer_incumplimiento', label: '⚠️ Incumplimiento de contrato' },
        { k: 'mer_pagare',        label: '📋 Pagaré o documento de deuda' },
        { k: 'mer_otro',          label: '💬 Otro asunto mercantil' },
      ]); });

    } else if (k === 'mer_contrato') {
      bot('Un contrato mal redactado puede generar conflictos y pérdidas. Revisamos o redactamos tus contratos para que <strong>protejan tus intereses y sean ejecutables legalmente</strong>.', 500, function() { setOpts([
        { wa: 'Hola SIGLEP, necesito revisar o redactar un contrato', label: '📲 Consulta gratuita' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'mer_incumplimiento') {
      bot('Si la otra parte no cumplió lo pactado, tienes derecho a <strong>exigir cumplimiento forzoso, rescisión del contrato y/o daños y perjuicios</strong>. Revisamos tu caso sin costo.', 500, function() { setOpts([
        { wa: 'Hola SIGLEP, tengo un incumplimiento de contrato y necesito asesoría', label: '📲 Consulta gratuita' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'mer_pagare') {
      bot('Los pagarés tienen fuerza ejecutiva — pueden usarse para demandar o defender. Te ayudamos a <strong>cobrar un pagaré, impugnar uno indebido o estructurar el documento correctamente</strong>.', 500, function() { setOpts([
        { wa: 'Hola SIGLEP, tengo un asunto relacionado con un pagaré', label: '📲 Consulta gratuita' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'mer_otro') {
      bot('Cuéntanos tu situación mercantil o empresarial — un abogado la revisará. Primera consulta <strong>gratuita</strong>.', 400, function() { setOpts([
        { wa: 'Hola SIGLEP, tengo un asunto mercantil que quiero consultar', label: '📲 Consulta gratuita' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'cobertura') {
      bot('SIGLEP tiene <strong>cobertura nacional</strong>. Atendemos de forma remota por videollamada y WhatsApp desde cualquier estado de México. Para asuntos que requieren presencia física, coordinamos en tu región.', 500, function() { setOpts([
        { wa: 'Hola SIGLEP, quiero saber si atienden en mi ciudad', label: '📲 Preguntar por mi ciudad' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'costos') {
      bot('La <strong>primera consulta es siempre gratuita</strong>. Los honorarios dependen del tipo y complejidad del caso — en la consulta inicial te damos una propuesta clara, sin sorpresas ni compromisos.', 500, function() { setOpts([
        { wa: 'Hola SIGLEP, quiero agendar mi consulta gratuita', label: '📲 Agendar consulta gratuita' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else if (k === 'expediente') {
      bot('Para hacer un diagnóstico de tu caso, cuéntanos brevemente qué está pasando y un abogado lo revisará. <strong>Sin costo, sin compromiso</strong>.', 400, function() { setOpts([
        { wa: 'Hola SIGLEP, quiero un diagnóstico gratuito de mi caso', label: '📲 Enviar mi caso' },
        { k: '__init__', label: '↩ Volver al menú' },
      ]); });

    } else {
      bot('Puedes escribirnos directamente — respondemos a la brevedad en horario de atención. La primera consulta es <strong>gratuita</strong>.', 500, function() { setOpts([
        { wa: 'Hola SIGLEP, quiero una consulta gratuita', label: '📲 Contactar a SIGLEP' },
        { k: '__init__', label: '↩ Volver al menú principal' },
      ]); });
    }
  }

  function sendMsg() {
    var input = document.getElementById('chatInput');
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    addMsg(text, 'user');
    clearOpts();
    showTyping();
    var t = text.toLowerCase();
    setTimeout(function() {
      hideTyping();
      if (/(despido|liquidaci|finiquito|patron|trabajo|laboral|nomina|renuncia|acoso laboral|contrato de trabajo|vacacion|incapacidad)/.test(t)) {
        step('laboral');
      } else if (/(custodia|pension|divorcio|hijos|familiar|violencia|paternidad|convenio familiar|alimento)/.test(t)) {
        step('familiar');
      } else if (/(denuncia|penal|delito|carpeta|imputado|ministerio|querella|defensa penal)/.test(t)) {
        step('penal');
      } else if (/(deuda|banco|cobrador|embargo|tarjeta|credito|reestructura|cobranza|pagare mercantil)/.test(t)) {
        step('financiero');
      } else if (/(contrato|pagare|incumplimiento|demanda mercantil|negocio|empresa|adeudo)/.test(t)) {
        step('mercantil');
      } else if (/(ciudad|estado|donde|dónde|presencial|remoto|oficina|cobertura)/.test(t)) {
        step('cobertura');
      } else if (/(costo|precio|cobran|honorario|cuanto|cuánto|pago)/.test(t)) {
        step('costos');
      } else if (/(expediente|diagnos|mi caso|situacion legal|situación legal|formulario|evalua|evalúa)/.test(t)) {
        step('expediente');
      } else if (/(hola|buenas|buen dia|buenas tardes|buenas noches|buenos)/.test(t)) {
        step('__init__');
      } else {
        showTyping();
        fetch('https://siglep-chat.lic-palafox31.workers.dev', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text }),
        })
          .then(function(r) { return r.json(); })
          .then(function(d) {
            hideTyping();
            if (d.reply) {
              addMsg(d.reply, 'bot');
            } else {
              addMsg('Para orientarte mejor, escríbenos directamente — la primera consulta es gratuita.', 'bot');
            }
            setOpts([
              { wa: 'Hola SIGLEP, quiero una consulta gratuita sobre mi caso', label: '📲 Consulta gratuita con SIGLEP' },
              { k: 'expediente', label: '🗂️ Diagnóstico gratuito de mi caso' },
            ]);
          })
          .catch(function() {
            hideTyping();
            addMsg('Para orientarte mejor, escríbenos directamente — la primera consulta es gratuita.', 'bot');
            setOpts([
              { wa: 'Hola SIGLEP, quiero una consulta gratuita sobre mi caso', label: '📲 Consulta gratuita con SIGLEP' },
              { k: 'expediente', label: '🗂️ Diagnóstico gratuito de mi caso' },
            ]);
          });
      }
    }, 600);
  }

  function resetChat() {
    chatOpened = false;
    document.getElementById('chatMessages').innerHTML = '';
    clearOpts();
    step('__init__');
    chatOpened = true;
  }

  function toggleChat() {
    var panel = document.getElementById('chatPanel');
    var badge = document.querySelector('.owl-badge');
    var isOpen = panel.classList.contains('open');
    if (!isOpen) {
      panel.classList.add('open');
      if (!chatOpened) { step('__init__'); chatOpened = true; }
    } else {
      panel.classList.remove('open');
    }
    if (badge) badge.style.display = 'none';
  }

  window.toggleChat = toggleChat;
  window.sendMsg = sendMsg;
  window.resetChat = resetChat;
  window.optSelected = optSelected;
})();
