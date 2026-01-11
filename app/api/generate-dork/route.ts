import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { checkDorkRateLimit } from '@/lib/rate-limit';
import { getDorkUser, createDorkUser, incrementDorkUsage, logDorkUsage } from '@/lib/db';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: NextRequest) {
    try {
        const { platform, parameters, templateInfo } = await req.json();

        // Auth and Rate Limiting
        const { userId: clerkId } = await auth();
        const user = await currentUser();
        const email = user?.emailAddresses[0]?.emailAddress || null;
        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

        const rateLimit = await checkDorkRateLimit(clerkId, email, ip);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: 'Rate limit exceeded',
                    details: 'Has alcanzado tu límite de generaciones. Actualiza a Pro para obtener más.',
                    rateLimit
                },
                { status: 429 }
            );
        }

        if (!process.env.ANTHROPIC_API_KEY) {
            return NextResponse.json(
                { error: 'API Key not configured. Please set ANTHROPIC_API_KEY in .env.local' },
                { status: 500 }
            );
        }

        // Get or create user in Supabase to track usage
        let dbUser = null;
        if (clerkId && email) {
            dbUser = await getDorkUser(clerkId);
            if (!dbUser) {
                dbUser = await createDorkUser(clerkId, email);
            }
        }

        // Platform-specific instructions (Same as before...)
        const platformInstructions: Record<string, string> = {
            google: `Operadores disponibles: site:, inurl:, intitle:, filetype:, intext:, cache:, link:, related:, info:. Considera técnicas avanzadas como combinaciones booleanas y wildcards.`,
            shodan: `Operadores disponibles: hostname:, port:, country:, city:, org:, os:, product:, version:, vuln:, http.title:, ssl:, net:. Enfócate en identificación de servicios y vulnerabilidades.`,
            zoomeye: `Operadores disponibles: app:, ver:, os:, service:, port:, country:, city:, cidr:, hostname:, device:. Especialízate en detección de dispositivos IoT y servicios expuestos.`,
            censys: `Operadores disponibles: AND, OR, NOT, ip:, services.port:, location.country_code:, services.http.response.html_title:. Syntax is SQL-like.`,
            fofa: `Operadores disponibles: title=, header=, body=, domain=, host=, port=, ip=, protocol=, city=, region=, country=. Use base64 encoding if necessary for strings but provide clear text logic.`,
        };

        const instructions = platformInstructions[platform as string] || 'Generate standard OSINT queries.';

        const systemPrompt = `Eres un experto en OSINT (Open Source Intelligence) y reconocimiento de infraestructuras con especialización en:
- Cámaras IP y sistemas de videovigilancia (Hikvision, Dahua, Axis, webcamXP, Foscam)
- Directory listing y archivos expuestos (Index Of, backups, configs, logs)
- Dispositivos IoT vulnerables (routers, impresoras, NAS, Smart TVs)
- Servicios críticos sin autenticación (RDP, VNC, MongoDB, Elasticsearch, Redis, Docker)
- Paneles de administración expuestos (Jenkins, phpMyAdmin, GitLab, WordPress)
- Archivos sensibles (.env, .git, AWS credentials, SSH keys)

${templateInfo ? `
🎯 TEMPLATE APLICADO: ${templateInfo.name}
📂 CATEGORÍA: ${templateInfo.category}
⚠️ SEVERIDAD: ${templateInfo.severity}
📝 DESCRIPCIÓN: ${templateInfo.description}
${templateInfo.credentials ? `🔑 CREDENCIALES COMUNES: ${templateInfo.credentials}` : ''}

Genera dorks específicos para este tipo de objetivo, considerando las credenciales por defecto y vectores de ataque comunes.
` : ''}

Tu tarea es generar dorks de búsqueda altamente efectivos y precisos para la plataforma: ${platform.toUpperCase()}.

INSTRUCCIONES ESPECÍFICAS DE LA PLATAFORMA:
${instructions}

REQUERIMIENTOS:
1. Genera 3-5 variaciones de dorks optimizados para el objetivo
2. Explica brevemente la lógica de cada operador usado
3. Indica el nivel de especificidad (Bajo/Medio/Alto)
4. Incluye advertencias sobre falsos positivos si aplica
5. Si hay credenciales por defecto conocidas, menciόnalas
6. Añade recomendaciones de seguridad cuando sea relevante
7. NO incluyas introducciones largas, ve directo a los dorks

FORMATO DE SALIDA (Markdown):
### 1. [Nombre descriptivo dork]
\`\`\`text
[Sintaxis del dork]
\`\`\`
*Explicación*: ...
*Efectividad*: ...
*Advertencia*: ...
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
            model: "claude-3-5-sonnet-20241022",
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

        // Track usage in DB if user is logged in
        if (dbUser) {
            try {
                await incrementDorkUsage(dbUser.id);
                await logDorkUsage(dbUser.id, 'generate_dork', true, { platform, parameters });
            } catch (usageError) {
                console.error('Error logging usage:', usageError);
            }
        }

        return NextResponse.json({
            dorks: textContent,
            remaining: rateLimit.remaining - 1,
            limit: rateLimit.limit
        });
    } catch (error) {
        console.error('Error generating dorks:', error);
        return NextResponse.json({ error: 'Failed to generate dorks' }, { status: 500 });
    }
}
