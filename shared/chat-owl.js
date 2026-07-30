const WA = 'https://wa.me/527352169503';
let chatOpened = false;

function addMsg(html, type) {
  const msgs = document.getElementById('chatMessages');
  const d = document.createElement('div');
  d.className = 'chat-msg ' + type;
  if (type === 'user') d.textContent = html;
  else d.innerHTML = html;
  msgs.appendChild(d);
  scrollChat();
}

function showTyping() {
  const msgs = document.getElementById('chatMessages');
  const t = document.createElement('div');
  t.className = 'chat-msg bot chat-typing';
  t.id = 'owlTyping';
  t.innerHTML = '<span></span><span></span><span></span>';
  msgs.appendChild(t);
  scrollChat();
}

function hideTyping() {
  const t = document.getElementById('owlTyping');
  if (t) t.remove();
}

function setOpts(opts) {
  const el = document.getElementById('chatOptions');
  el.innerHTML = opts.map(o => {
    if (o.wa) {
      const txt = encodeURIComponent(o.wa);
      return `<a class="chat-opt chat-opt-wa" href="${WA}?text=${txt}" target="_blank" rel="noopener noreferrer">📲 ${o.label}</a>`;
    }
    if (o.href) {
      return `<a class="chat-opt" href="${o.href}">${o.label}</a>`;
    }
    return `<button type="button" class="chat-opt" onclick="optSelected('${o.k}', this.textContent.trim())">${o.label}</button>`;
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
  setTimeout(() => { hideTyping(); addMsg(html, 'bot'); if (cb) cb(); }, delay || 500);
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
    bot('Los asuntos laborales tienen plazos legales — actuar rápido marca la diferencia. ¿Qué está pasando?', 400, () => setOpts([
      { k: 'lab_despido',   label: '🚪 Me despidieron' },
      { k: 'lab_liquidacion', label: '💵 Revisión de liquidación o finiquito' },
      { k: 'lab_renuncia',  label: '✍️ Quiero renunciar / me presionan a renunciar' },
      { k: 'lab_acoso',     label: '😤 Acoso o presión laboral' },
      { k: 'lab_nomina',    label: '📉 Descuentos o incumplimientos de nómina' },
      { k: 'lab_contrato',  label: '📄 Contrato laboral o incumplimiento' },
      { k: 'lab_otro',      label: '💬 Otra situación laboral' },
    ]));
  }

  else {
    bot('Puedes escribirnos directamente por WhatsApp. Respondemos a la brevedad posible en horario de atención. La primera consulta es gratuita.', 500, () => setOpts([
      { wa: 'Hola SIGLEP, quiero una consulta gratuita', label: '📲 Contactar a SIGLEP' },
      { k: '__init__', label: '↩ Volver al menú principal' },
    ]));
  }
}

function sendMsg() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  addMsg(text, 'user');
  clearOpts();
  showTyping();
  const t = text.toLowerCase();
  setTimeout(() => {
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
        .then(r => r.json())
        .then(d => {
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
        .catch(() => {
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
  const panel = document.getElementById('chatPanel');
  const badge = document.querySelector('.owl-badge');
  const isOpen = panel.classList.contains('open');
  if (!isOpen) {
    panel.classList.add('open');
    if (!chatOpened) { step('__init__'); chatOpened = true; }
  } else {
    panel.classList.remove('open');
  }
  if (badge) badge.style.display = 'none';
}
