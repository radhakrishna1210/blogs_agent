import { env } from '../config/env.js';

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = env.groqModel || 'llama-3.1-8b-instant';

function ensureGroqConfigured() {
  if (!env.groqApiKey) {
    throw new Error('GROQ_API_KEY is not configured.');
  }
}

function extractTextFromResponse(responseJson) {
  return String(responseJson?.choices?.[0]?.message?.content || '').trim();
}

function stripCodeFences(value) {
  return String(value || '')
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '');
}

function parseJsonResponse(text) {
  const cleaned = stripCodeFences(text);

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error('Groq did not return valid JSON.');
    }

    return JSON.parse(match[0]);
  }
}

async function callGroq({ system, prompt, model = DEFAULT_MODEL, maxTokens = 2048 }) {
  ensureGroqConfigured();

  const response = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${env.groqApiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: system,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload?.error?.message || `Groq request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return payload;
}

export async function generateGroqBlog({ prompt, categoryName }) {
  const systemPrompt = [
    'You are a human journalist writing for a modern blog publication.',
    'Write in a conversational tone that sounds natural and direct.',
    'Vary sentence length and rhythm.',
    'Include thoughtful personal opinions where appropriate.',
    'Avoid sounding robotic, generic, repetitive, or overly polished.',
    'Return only valid JSON with the fields title, summary, content, and suggested_cover_image_description.',
    'The content field must be HTML formatted and use proper h2 and p tags only for structure.',
    'Do not include markdown fences, commentary, or extra keys.',
  ].join(' ');

  const draftPrompt = [
    `Category: ${categoryName}`,
    'Write a complete blog post based on the following prompt.',
    'Keep the content substantial, well structured, and publication-ready.',
    'Prompt:',
    prompt,
  ].join('\n\n');

  const draftResponse = await callGroq({
    system: systemPrompt,
    prompt: draftPrompt,
  });

  const draftText = extractTextFromResponse(draftResponse);
  const draftBlog = parseJsonResponse(draftText);

  if (!draftBlog || typeof draftBlog !== 'object') {
    throw new Error('Groq did not return a valid blog draft.');
  }

  const humanizeSystemPrompt = [
    'You rewrite blog content so it sounds more natural and human.',
    'Fix repetitive phrasing, add conversational transitions, and make the prose feel like it was written by a real person, not an AI.',
    'Preserve the same overall meaning, title, summary, and suggested_cover_image_description.',
    'Keep the content as valid HTML with h2 and p tags only.',
    'Return only valid JSON with the fields title, summary, content, and suggested_cover_image_description.',
    'Do not add markdown fences or commentary.',
  ].join(' ');

  const humanizePrompt = [
    'Here is the blog draft to rewrite:',
    JSON.stringify(draftBlog, null, 2),
    '',
    'Rewrite the content field only if needed to make it more human and natural, while preserving the structure and meaning.',
  ].join('\n');

  const humanizedResponse = await callGroq({
    system: humanizeSystemPrompt,
    prompt: humanizePrompt,
  });

  const humanizedText = extractTextFromResponse(humanizedResponse);
  const humanizedBlog = parseJsonResponse(humanizedText);

  if (!humanizedBlog || typeof humanizedBlog !== 'object') {
    throw new Error('Groq did not return a valid humanized blog.');
  }

  return {
    draft: draftBlog,
    humanized: humanizedBlog,
  };
}
