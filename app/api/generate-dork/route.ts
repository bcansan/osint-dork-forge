import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: NextRequest) {
    try {
        const { platform, parameters } = await req.json();

        if (!process.env.ANTHROPIC_API_KEY) {
            return NextResponse.json(
                { error: 'API Key not configured. Please set ANTHROPIC_API_KEY in .env.local' },
                { status: 500 }
            );
        }

        // Platform-specific instructions
        const platformInstructions: Record<string, string> = {
            google: `Operadores disponibles: site:, inurl:, intitle:, filetype:, intext:, cache:, link:, related:, info:. Considera técnicas avanzadas como combinaciones booleanas y wildcards.`,
            shodan: `Operadores disponibles: hostname:, port:, country:, city:, org:, os:, product:, version:, vuln:, http.title:, ssl:, net:. Enfócate en identificación de servicios y vulnerabilidades.`,
            zoomeye: `Operadores disponibles: app:, ver:, os:, service:, port:, country:, city:, cidr:, hostname:, device:. Especialízate en detección de dispositivos IoT y servicios expuestos.`,
            censys: `Operadores disponibles: AND, OR, NOT, ip:, services.port:, location.country_code:, services.http.response.html_title:. Syntax is SQL-like.`,
            fofa: `Operadores disponibles: title=, header=, body=, domain=, host=, port=, ip=, protocol=, city=, region=, country=. Use base64 encoding if necessary for strings but provide clear text logic.`,
        };

        const instructions = platformInstructions[platform as string] || 'Generate standard OSINT queries.';

        const systemPrompt = `Eres un experto en OSINT (Open Source Intelligence) y reconocimiento de infraestructuras.
Tu tarea es generar dorks de búsqueda altamente efectivos y precisos para la plataforma: ${platform.toUpperCase()}.

INSTRUCCIONES ESPECÍFICAS DE LA PLATAFORMA:
${instructions}

REQUERIMIENTOS:
1. Genera 3-5 variaciones de dorks optimizados para el objetivo.
2. Explica brevemente la lógica de cada operador usado.
3. Indica el nivel de especificidad (Bajo/Medio/Alto).
4. Incluye advertencias sobre falsos positivos si aplica.
5. NO incluyas introducciones largas, ve directo a los dorks.

FORMATO DE SALIDA (Markdown):
### 1. [Nombre descriptivo dork]
\`\`\`text
[Sintaxis del dork]
\`\`\`
*Explicación*: ...
*Efectividad*: ...

_(Repetir para las variaciones)_
`;

        const userMessage = `
CONTEXTO DEL OBJETIVO:
- Dominio/IP: ${parameters.target}
- Tipo de información buscada: ${parameters.infoType}
- Filtros adicionales: ${parameters.filters}
- Exclusiones: ${parameters.exclusions}

Genera los dorks ahora.
`;

        const message = await anthropic.messages.create({
            model: "claude-sonnet-4-5-20250929",
            max_tokens: 1500,
            messages: [
                {
                    role: "user",
                    content: userMessage
                }
            ],
            system: systemPrompt
        });

        const textContent = message.content[0].type === 'text' ? message.content[0].text : '';

        return NextResponse.json({ dorks: textContent });
    } catch (error) {
        console.error('Error generating dorks:', error);
        return NextResponse.json({ error: 'Failed to generate dorks' }, { status: 500 });
    }
}
