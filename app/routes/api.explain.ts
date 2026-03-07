import { type ActionFunctionArgs, json } from '@remix-run/cloudflare';
import { generateText } from 'ai';
import { getApiKeysFromCookie, getProviderSettingsFromCookie } from '~/lib/api/cookies';
import { LLMManager } from '~/lib/modules/llm/manager';
import { stripIndents } from '~/utils/stripIndent';

export async function action({ request, context }: ActionFunctionArgs) {
    if (request.method !== 'POST') {
        return json({ error: 'Method Not Allowed' }, { status: 405 });
    }

    const { code, fileName, model, provider } = await request.json<{
        code: string;
        fileName: string;
        model: string;
        provider: string;
    }>();

    if (!code || !code.trim()) {
        return json({ error: 'No code provided' }, { status: 400 });
    }

    if (!model || !provider) {
        return json({ error: 'Model and provider are required' }, { status: 400 });
    }

    const cookieHeader = request.headers.get('Cookie');
    const apiKeys = getApiKeysFromCookie(cookieHeader);
    const providerSettings = getProviderSettingsFromCookie(cookieHeader);

    try {
        const env = (context.cloudflare?.env as unknown as Record<string, string>) || {};
        const llmManager = LLMManager.getInstance(env);

        // Use the provider selected by the user
        const providerInstance = llmManager.getProvider(provider);

        if (!providerInstance) {
            return json({ error: `Provider "${provider}" not available` }, { status: 400 });
        }

        const modelInstance = providerInstance.getModelInstance({
            model,
            serverEnv: context.cloudflare?.env as any,
            apiKeys,
            providerSettings,
        });

        const prompt = stripIndents`
      You are a senior software engineer who explains code clearly and concisely.
      Analyze the following code file and return a structured JSON explanation.

      File: ${fileName}

      CODE:
      ${code.substring(0, 20000)}

      Return ONLY valid JSON in this exact format. No markdown, no code fences, just raw JSON:
      {
        "summary": "One-line description of what this file does",
        "componentType": "e.g. React Component, API Route, Utility, Style, Config",
        "patterns": ["pattern1", "pattern2"],
        "dependencies": ["dep1", "dep2"],
        "sections": [
          {
            "title": "Section title (e.g. Imports, State Management, Event Handlers, Render Logic)",
            "description": "2-3 sentence explanation of what this section does and why",
            "lineRange": "e.g. 1-15"
          }
        ],
        "insights": "A brief AI insight about the code quality, patterns, or potential improvements (2-3 sentences)"
      }

      Rules:
      - sections should cover the ENTIRE file logically, typically 4-8 sections
      - Be specific to THIS code, not generic descriptions
      - Reference actual variable names, function names, and patterns used
      - Keep descriptions concise but informative
    `;

        const { text } = await generateText({
            model: modelInstance,
            prompt,
        });

        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error('Failed to parse JSON from AI response');
        }

        const result = JSON.parse(jsonMatch[0]);
        return json({ ...result, usedModel: model, usedProvider: provider });
    } catch (error: any) {
        console.error('Explain Error:', error);
        return json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
