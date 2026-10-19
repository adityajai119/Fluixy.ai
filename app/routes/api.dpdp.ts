import type { ActionFunctionArgs } from 'react-router';
import { generateText } from 'ai';
import { getApiKeysFromCookie, getProviderSettingsFromCookie } from '~/lib/api/cookies';
import { LLMManager } from '~/lib/modules/llm/manager';
import { stripIndents } from '~/utils/stripIndent';

export async function action({ request, context }: ActionFunctionArgs) {
    if (request.method !== 'POST') {
        return Response.json({ error: 'Method Not Allowed' }, { status: 405 });
    }

    const { codeFiles, model, provider } = await request.json<{
        codeFiles: Record<string, string>;
        model: string;
        provider: string;
    }>();

    if (!model || !provider) {
        return Response.json({ error: 'Invalid model or provider' }, { status: 400 });
    }

    const cookieHeader = request.headers.get('Cookie');
    const apiKeys = getApiKeysFromCookie(cookieHeader);
    const providerSettings = getProviderSettingsFromCookie(cookieHeader);

    try {
        const env = (context.cloudflare?.env as unknown as Record<string, string>) || {};
        const llmManager = LLMManager.getInstance(env);

        // Force use Google Provider for this specialized instruction
        const providerInstance = llmManager.getProvider('Google');
        const fallbackProvider = llmManager.getProvider(provider);

        const activeProvider = providerInstance || fallbackProvider;

        if (!activeProvider) {
            return Response.json({ error: 'Provider not found' }, { status: 400 });
        }

        const modelInstance = activeProvider.getModelInstance({
            model: 'gemini-2.5-flash',
            serverEnv: context.cloudflare?.env as any,
            apiKeys,
            providerSettings,
        });

        // We join all significant files into a readable context
        const contextStr = Object.entries(codeFiles)
            .map(([path, content]) => `// File: ${path}\n${content}\n`)
            .join('\n');

        const prompt = stripIndents`
      You are a strict data privacy auditor specializing in the Digital Personal Data Protection Act (DPDP Act) of India.
      I will provide you with the source code of a web application. You must analyze the architecture, database schemas, API routes, and components to evaluate its compliance with data privacy regulations.

      Evaluate the following 5 strict criteria:
      1. data-minimalism: Does the code avoid collecting unnecessary user data?
      2. consent-manager: Is there explicit consent tracking before data collection or cookie usage?
      3. localization: Are there configurations pointing to India-based regions (like ap-south-1) for data localization?
      4. encryption: Are passwords hashed (e.g. bcrypt) or is sensitive data encrypted? Are there secure transport configurations?
      5. right-to-forget: Is there a deletion endpoint or a mechanism to wipe user data entirely?

      Return a JSON block containing the exact results. The format MUST be valid JSON, nothing else.
      Format:
      {
        "overallScore": number (0-100),
        "checks": {
          "data-minimalism": { "passed": boolean, "reason": "short explanation" },
          "consent-manager": { "passed": boolean, "reason": "short explanation" },
          "localization": { "passed": boolean, "reason": "short explanation" },
          "encryption": { "passed": boolean, "reason": "short explanation" },
          "right-to-forget": { "passed": boolean, "reason": "short explanation" }
        }
      }

      APPLICATION CODE:
      ${contextStr.substring(0, 30000)} // Truncated to avoid context limits
    `;

        const { text } = await generateText({
            model: modelInstance,
            prompt,
        });

        // Parse the JSON safely from the LLM output
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to parse JSON from AI response');
        }

        const result = JSON.parse(jsonMatch[0]);

        return Response.json(result);

    } catch (error: any) {
        console.error('DPDP Scan Error:', error);
        return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
