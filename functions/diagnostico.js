export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  const { area, situacion, tiempo, descripcion } = body;

  if (!area || !descripcion || descripcion.trim().length < 10) {
    return new Response(JSON.stringify({ error: 'Descripción insuficiente' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const tiempoTexto = {
    menos7: 'hace menos de 7 días',
    menos1mes: 'hace entre 1 semana y 1 mes',
    menos6meses: 'hace entre 1 y 6 meses',
    menos2anios: 'hace entre 6 meses y 2 años',
    mas2anios: 'hace más de 2 años'
  }[tiempo] || tiempo;

  const systemPrompt = `Eres un asistente jurídico de SIGLEP, firma legal mexicana especializada en derecho laboral, migratorio y patrimonial.

Tu función es leer la situación que describe el usuario y generar un diagnóstico preliminar breve que genere confianza real — sin dar asesoría jurídica completa ni estrategia detallada.

REGLAS ESTRICTAS:
- Máximo 3 párrafos cortos. Sin listas, sin bullets, sin encabezados.
- Tono humano, cálido y profesional. Como una abogada experimentada que revisa un caso en 2 minutos — nunca robótico.
- Menciona algo específico de lo que escribió el usuario para que sienta que lo leíste de verdad.
- Da UNA observación legal concreta y real que el usuario probablemente no sabía — ese es el gancho de confianza.
- Termina con una frase que genere urgencia suave y abra la puerta a SIGLEP de forma natural, sin sonar a anuncio.
- NUNCA des pasos completos, montos exactos, estrategia detallada ni nombres de leyes específicas con artículos.
- NUNCA digas "Como IA", "como modelo de lenguaje" ni menciones inteligencia artificial.
- NUNCA uses frases genéricas como "cada caso es único" o "te recomendamos consultar a un abogado".
- Escribe en español mexicano natural. Sin tecnicismos innecesarios.
- La respuesta debe hacer que el usuario piense: "sí saben de lo que hablan, quiero hablar con ellos."`;

  const userPrompt = `Área legal: ${area}
Situación identificada: ${situacion}
Tiempo transcurrido: ${tiempoTexto}

Lo que el usuario describe con sus propias palabras:
"${descripcion.trim()}"

Genera el diagnóstico preliminar.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        messages: [{ role: 'user', content: userPrompt }],
        system: systemPrompt
      })
    });

    const data = await response.json();
    const diagnostico = data.content?.[0]?.text || '';

    return new Response(JSON.stringify({ diagnostico }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
