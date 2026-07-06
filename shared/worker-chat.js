/**
 * Cloudflare Worker — SIGLEP Chat AI
 * Despliega en: https://dash.cloudflare.com → Workers → Crear Worker
 * Nombre sugerido: siglep-chat
 * Variable de entorno requerida: ANTHROPIC_API_KEY
 */

const SYSTEM_PROMPT = `Eres el asistente legal del despacho SIGLEP, ubicado en México (CDMX, Cuernavaca, Cuautla y Yautepec), con atención remota a todo el país.

Tu función es orientar brevemente al usuario sobre su situación legal y SIEMPRE terminar invitándolo a contactar a SIGLEP para una consulta gratuita.

Reglas estrictas:
- Responde en español, máximo 3 oraciones cortas.
- No des asesoría legal detallada ni cites artículos específicos.
- Siempre cierra con una frase que invite a contactar a SIGLEP (ej: "Te recomendamos hablar con un abogado de SIGLEP — la primera consulta es gratuita y sin compromiso.").
- Si el tema no es legal, redirige amablemente a un tema legal o a contactar directamente.
- Nunca inventes información sobre el despacho.
- Áreas que atiende SIGLEP: laboral, familiar, penal, migratorio, patrimonial, mercantil, cobranza/deudas.`;

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': 'https://siglep.lat',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response('Bad request', { status: 400 });
    }

    const userMessage = (body.message || '').trim().slice(0, 500);
    if (!userMessage) {
      return new Response('Missing message', { status: 400 });
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5',
          max_tokens: 200,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userMessage }],
        }),
      });

      const data = await response.json();
      const text = data?.content?.[0]?.text || '';

      return new Response(JSON.stringify({ reply: text }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://siglep.lat',
        },
      });
    } catch {
      return new Response(JSON.stringify({ reply: '' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://siglep.lat',
        },
      });
    }
  },
};
