/**
 * Cloudflare Worker — SIGLEP Diagnóstico (Expediente Inteligente)
 * Publicado como: siglep-diagnostico.lic-palafox31.workers.dev
 * Secreto requerido: ANTHROPIC_API_KEY
 * No almacena datos: solo reenvía la descripción al modelo y devuelve el texto.
 */
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...CORS } });

const SYSTEM_PROMPT = `Eres un asistente jurídico de SIGLEP, firma legal mexicana que atiende derecho laboral, familiar, penal, civil y patrimonial.

Tu función es leer la situación que describe el usuario y generar un diagnóstico preliminar breve que genere confianza real — sin dar asesoría jurídica completa ni estrategia detallada.

REGLAS ESTRICTAS:
- Máximo 3 párrafos cortos. Sin listas, sin bullets, sin encabezados.
- Tono humano, cálido y profesional. Como una abogada experimentada que revisa un caso en 2 minutos — nunca robótico.
- Menciona algo específico de lo que escribió el usuario para que sienta que lo leíste de verdad.
- Da UNA observación legal concreta y real que el usuario probablemente no sabía — ese es el gancho de confianza.
- Habla solo de la materia indicada en "Área legal"; no menciones juicios, autoridades ni plazos de otra materia (por ejemplo, nada laboral en un caso de deudas).
- NUNCA inventes cifras, porcentajes ni plazos; si no estás seguro de un dato, no lo menciones.
- Termina con una frase que genere urgencia suave y abra la puerta a SIGLEP de forma natural, sin sonar a anuncio.
- NUNCA des pasos completos, montos exactos, estrategia detallada ni nombres de leyes específicas con artículos.
- NUNCA digas "Como IA", "como modelo de lenguaje" ni menciones inteligencia artificial.
- NUNCA uses frases genéricas como "cada caso es único" o "te recomendamos consultar a un abogado".
- Escribe en español mexicano natural. Sin tecnicismos innecesarios.
- La respuesta debe hacer que el usuario piense: "sí saben de lo que hablan, quiero hablar con ellos."`;

const TIEMPO = {
  menos7: 'hace menos de 7 días',
  menos1mes: 'hace entre 1 semana y 1 mes',
  menos6meses: 'hace entre 1 y 6 meses',
  menos2anios: 'hace entre 6 meses y 2 años',
  mas2anios: 'hace más de 2 años',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });
    if (request.method !== 'POST') return json({ error: 'Method Not Allowed' }, 405);

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Bad Request' }, 400);
    }

    const area = String(body.area || '').slice(0, 80);
    const situacion = String(body.situacion || '').slice(0, 120);
    const tiempo = String(body.tiempo || '');
    const descripcion = String(body.descripcion || '').trim().slice(0, 2000);

    if (!area || descripcion.length < 10) return json({ error: 'Descripción insuficiente' }, 400);
    if (!env.ANTHROPIC_API_KEY) return json({ error: 'API key no configurada' }, 500);

    const userPrompt = `Área legal: ${area}
Situación identificada: ${situacion}
Tiempo transcurrido: ${TIEMPO[tiempo] || tiempo}

Lo que el usuario describe con sus propias palabras:
"${descripcion}"

Genera el diagnóstico preliminar.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 400,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      });
      if (!response.ok) return json({ error: 'Servicio no disponible' }, 502);
      const data = await response.json();
      return json({ diagnostico: data.content?.[0]?.text || '' });
    } catch {
      return json({ error: 'Error' }, 500);
    }
  },
};
