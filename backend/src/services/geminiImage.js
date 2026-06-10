import fs from 'fs';
import path from 'path';
import { env } from '../config/env.js';

// Gemini models that support native image generation (free tier)
// Falls back through models in order; each model has independent rate limits
const GEMINI_MODELS = [
  'gemini-2.5-flash-image',
  'gemini-3.1-flash-image',
  'gemini-3-pro-image',
];

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

// Retry config for 429 rate-limit errors
const MAX_RETRIES = 1;
const BASE_RETRY_DELAY_MS = 5_000;

function ensureGeminiConfigured() {
  if (!env.geminiApiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Add it to your .env file.');
  }
}

/**
 * Build a rich image prompt from the description and optional blog title.
 */
function buildImagePrompt(description, blogTitle) {
  return [
    'Generate a high-quality, visually striking blog cover image.',
    'The image should be modern, professional, and suitable as a hero/banner image for a blog post.',
    'Style: photographic or cinematic digital art, vibrant colors, clean composition, dramatic lighting.',
    'Do NOT include any text, words, letters, watermarks, logos, or overlays in the image.',
    'Only generate the image, do not include any text response.',
    '',
    blogTitle ? `Blog title for context: "${blogTitle}"` : '',
    `Image description: ${description}`,
  ].filter(Boolean).join('\n');
}

/**
 * Parse a retry delay from the API error response.
 */
function parseRetryDelay(payload) {
  const details = payload?.error?.details || [];
  for (const detail of details) {
    if (detail['@type']?.includes('RetryInfo') && detail.retryDelay) {
      const seconds = parseFloat(detail.retryDelay);
      if (Number.isFinite(seconds) && seconds > 0) {
        return Math.min(seconds * 1000, 60_000);
      }
    }
  }
  return null;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Call Gemini's generateContent endpoint with image generation enabled.
 * Includes retry logic for 429 rate-limit errors.
 */
async function callGeminiImageGen(modelName, imagePrompt) {
  const url = `${BASE_URL}/${modelName}:generateContent?key=${env.geminiApiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: imagePrompt },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ['IMAGE', 'TEXT'],
      responseMimeType: 'text/plain',
    },
  };

  let lastError = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      console.log(`[GeminiImage] Retry ${attempt}/${MAX_RETRIES} for ${modelName}...`);
    } else {
      console.log(`[GeminiImage] Calling model: ${modelName}`);
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = payload?.error?.message || `Status ${response.status}`;

      // Retry on 429 rate limit only if it's not a permanent daily quota exhaustion
      if (response.status === 429 && attempt < MAX_RETRIES) {
        const isDailyExhausted = message.toLowerCase().includes('quota') || message.toLowerCase().includes('limit: 0');
        if (isDailyExhausted) {
          console.warn(`[GeminiImage] Daily quota is fully exhausted for ${modelName}. Skipping retries...`);
        } else {
          const retryDelay = parseRetryDelay(payload) || BASE_RETRY_DELAY_MS * (attempt + 1);
          console.warn(`[GeminiImage] Rate limited (${modelName}). Waiting ${Math.round(retryDelay / 1000)}s before retry...`);
          await sleep(retryDelay);
          lastError = new Error(`${modelName}: ${message}`);
          continue;
        }
      }

      throw new Error(`${modelName}: ${message}`);
    }

    // Extract inline image data from candidates
    const candidates = payload?.candidates || [];
    const parts = candidates[0]?.content?.parts || [];

    const imagePart = parts.find(
      (p) => p.inlineData && p.inlineData.mimeType?.startsWith('image/')
    );

    if (!imagePart) {
      console.warn(`[GeminiImage] Response parts:`, JSON.stringify(parts.map(p => ({
        hasText: !!p.text,
        hasInlineData: !!p.inlineData,
        mimeType: p.inlineData?.mimeType,
      }))));
      throw new Error(`${modelName}: No image data found in response parts.`);
    }

    return {
      data: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType,
    };
  }

  throw lastError || new Error(`${modelName}: Max retries exceeded.`);
}

/**
 * Save base64 image data to disk and return the public URL.
 */
function saveImageToDisk(imageData, mimeType, modelLabel) {
  const ext = mimeType === 'image/png' ? '.png' : '.jpg';
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const filename = `cover-${uniqueSuffix}${ext}`;
  const filePath = path.join(uploadDir, filename);

  const buffer = Buffer.from(imageData, 'base64');
  fs.writeFileSync(filePath, buffer);

  const backendUrl = process.env.BACKEND_URL || `http://localhost:${env.port}`;
  const publicUrl = `${backendUrl}/uploads/${filename}`;

  console.log(`[ImageGen] ✓ Image saved: ${filename} (source: ${modelLabel}, size: ${buffer.length} bytes)`);
  return publicUrl;
}

/**
 * Extract 2-3 relevant keywords from title and description for image searching.
 */
function extractKeywords(blogTitle, description) {
  const text = `${blogTitle || ''} ${description || ''}`.toLowerCase();
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'else', 'for', 'to', 'in', 'on', 'at', 'by', 'from', 'with', 'about',
    'image', 'blog', 'cover', 'article', 'titled', 'generate', 'high-quality', 'visually', 'striking', 'style', 'cinematic',
    'digital', 'art', 'vibrant', 'colors', 'clean', 'composition', 'dramatic', 'lighting', 'modern', 'professional',
    'suitable', 'as', 'hero', 'banner', 'post', 'illustration', 'description', 'person', 'interacting', 'warm', 'minimalist'
  ]);
  
  const tokens = text.match(/[a-z0-9]+/g) || [];
  const uniqueKeywords = [];
  for (const token of tokens) {
    if (token.length > 2 && !stopWords.has(token) && !uniqueKeywords.includes(token)) {
      uniqueKeywords.push(token);
      if (uniqueKeywords.length >= 3) break;
    }
  }
  
  if (uniqueKeywords.length === 0) {
    uniqueKeywords.push('office', 'work');
  }
  return uniqueKeywords;
}

/**
 * Helper to build a highly relevant, high-quality search query for search engine fallbacks.
 * Adapt the query based on the blog title and the category context.
 */
function getSearchQuery(blogTitle, categoryName) {
  let categoryKeyword = '';
  if (categoryName) {
    const cat = categoryName.toLowerCase();
    if (cat.includes('design') || cat.includes('creativity') || cat.includes('art')) {
      categoryKeyword = 'product design office UI UX creative team website';
    } else if (cat.includes('technology') || cat.includes('ai') || cat.includes('science') || cat.includes('future')) {
      categoryKeyword = 'technology computer software developer office work code';
    } else if (cat.includes('finance') || cat.includes('money') || cat.includes('personal finance')) {
      categoryKeyword = 'business analysis startup workplace strategy';
    } else if (cat.includes('startup') || cat.includes('entrepreneur')) {
      categoryKeyword = 'startup meeting workshop business strategy office';
    } else if (cat.includes('productivity') || cat.includes('self improvement') || cat.includes('career') || cat.includes('job')) {
      categoryKeyword = 'productivity desk workspace laptop notebook focus';
    } else {
      categoryKeyword = `${categoryName} workspace team professional`;
    }
  } else {
    categoryKeyword = 'creative work professional desk notebook office';
  }

  // Clean the blog title: remove Aperture prefixes if any, and keep alphanumeric words
  let cleanTitle = String(blogTitle || '')
    .replace(/^aperture\s*:\s*/i, '') // remove brand prefix if any
    .replace(/[^a-zA-Z0-9\s-]/g, '')  // remove special characters
    .trim();

  // If title is too long, take the first 4 words to prevent over-constraining the search results
  const words = cleanTitle.split(/\s+/).filter(Boolean);
  if (words.length > 4) {
    cleanTitle = words.slice(0, 4).join(' ');
  }

  // Build query: we want editorial photography and real-world workspace scenes
  return `${cleanTitle} ${categoryKeyword} photography editorial`.trim();
}

/**
 * Fallback: Search DuckDuckGo for the blog topic and download a highly relevant, high-quality image.
 */
async function generateWithDuckDuckGo(blogTitle, description, categoryName) {
  const searchQuery = getSearchQuery(blogTitle, categoryName);
  console.log(`[DuckDuckGo] Searching for relevant image for query: "${searchQuery}"...`);

  // 1. Get the vqd token
  const htmlUrl = `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`;
  const htmlRes = await fetch(htmlUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
  });
  
  if (!htmlRes.ok) {
    throw new Error(`DuckDuckGo page fetch returned status ${htmlRes.status}`);
  }
  
  const html = await htmlRes.text();
  const m = html.match(/vqd=([0-9-]+)/);
  if (!m) {
    throw new Error('Could not find vqd token in DuckDuckGo HTML');
  }
  const vqd = m[1];

  // 2. Query the image endpoint
  const imgUrl = `https://duckduckgo.com/i.js?q=${encodeURIComponent(searchQuery)}&vqd=${vqd}&s=0&o=json`;
  const imgRes = await fetch(imgUrl, {
    headers: { 
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://duckduckgo.com/'
    }
  });

  if (!imgRes.ok) {
    throw new Error(`DuckDuckGo image search API returned status ${imgRes.status}`);
  }

  const data = await imgRes.json();
  const results = data.results || [];

  if (results.length === 0) {
    throw new Error('No image results found on DuckDuckGo');
  }

  // Try downloading the first 5 results in sequence until one succeeds
  for (let i = 0; i < Math.min(results.length, 5); i++) {
    const imageUrl = results[i].image;
    try {
      console.log(`[DuckDuckGo] Attempting to download image ${i + 1}/${Math.min(results.length, 5)}: ${imageUrl}`);
      const downloadRes = await fetch(imageUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
      });

      if (!downloadRes.ok) continue;

      const arrayBuffer = await downloadRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (buffer.length < 5000) {
        console.warn(`[DuckDuckGo] Image too small (${buffer.length} bytes), skipping`);
        continue;
      }

      // Determine file extension from content-type or URL
      const contentType = downloadRes.headers.get('content-type') || 'image/jpeg';
      let ext = '.jpg';
      if (contentType.includes('png')) ext = '.png';
      else if (contentType.includes('webp')) ext = '.webp';

      // Save to disk
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = `cover-${uniqueSuffix}${ext}`;
      const filePath = path.join(uploadDir, filename);

      fs.writeFileSync(filePath, buffer);

      const backendUrl = process.env.BACKEND_URL || `http://localhost:${env.port}`;
      const publicUrl = `${backendUrl}/uploads/${filename}`;

      console.log(`[DuckDuckGo] ✓ Fallback image successfully downloaded and saved: ${filename}`);
      return publicUrl;
    } catch (err) {
      console.warn(`[DuckDuckGo] Failed to download image from ${imageUrl}: ${err.message}`);
    }
  }

  throw new Error('Could not download any relevant image from DuckDuckGo search results');
}

/**
 * Fallback: Generate image using Pollinations.ai (free, no API key required).
 * Downloads the image and saves it locally.
 */
async function generateWithPollinations(description, blogTitle) {
  const promptParts = [
    'high quality blog cover image, modern professional editorial style,',
    'cinematic digital art, vibrant colors, dramatic lighting, clean composition,',
    'no text no words no letters no watermarks,',
    blogTitle ? `blog about "${blogTitle}",` : '',
    description,
  ].filter(Boolean).join(' ');

  const encodedPrompt = encodeURIComponent(promptParts.slice(0, 500));
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=630&nologo=true&seed=${Date.now()}`;

  console.log(`[Pollinations] Generating fallback cover image...`);

  const response = await fetch(pollinationsUrl, {
    method: 'GET',
    headers: { 'Accept': 'image/*' },
  });

  if (!response.ok) {
    throw new Error(`Pollinations returned status ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || 'image/jpeg';
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (buffer.length < 1000) {
    throw new Error(`Pollinations returned a suspiciously small image (${buffer.length} bytes)`);
  }

  // Save to disk
  const ext = contentType.includes('png') ? '.png' : '.jpg';
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const filename = `cover-${uniqueSuffix}${ext}`;
  const filePath = path.join(uploadDir, filename);

  fs.writeFileSync(filePath, buffer);

  const backendUrl = process.env.BACKEND_URL || `http://localhost:${env.port}`;
  const publicUrl = `${backendUrl}/uploads/${filename}`;

  console.log(`[Pollinations] ✓ Fallback image saved: ${filename} (${buffer.length} bytes)`);
  return publicUrl;
}

/**
 * Fallback: Download a topical placeholder image from LoremFlickr based on keywords.
 */
async function generateWithLoremFlickr(description, blogTitle) {
  const keywords = extractKeywords(blogTitle, description);
  const tagString = keywords.join(',');
  const flickrUrl = `https://loremflickr.com/1200/630/${tagString}`;

  console.log(`[LoremFlickr] Fetching fallback cover image for tags: ${tagString}...`);

  const response = await fetch(flickrUrl, { redirect: 'follow' });

  if (!response.ok) {
    throw new Error(`LoremFlickr returned status ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || 'image/jpeg';
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (buffer.length < 1000) {
    throw new Error(`LoremFlickr returned a suspiciously small image (${buffer.length} bytes)`);
  }

  // Save to disk
  const ext = contentType.includes('png') ? '.png' : '.jpg';
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const filename = `cover-${uniqueSuffix}${ext}`;
  const filePath = path.join(uploadDir, filename);

  fs.writeFileSync(filePath, buffer);

  const backendUrl = process.env.BACKEND_URL || `http://localhost:${env.port}`;
  const publicUrl = `${backendUrl}/uploads/${filename}`;

  console.log(`[LoremFlickr] ✓ Fallback image saved: ${filename} (${buffer.length} bytes)`);
  return publicUrl;
}

/**
 * Fallback: Download a high-quality placeholder photo from Picsum Photos.
 */
async function generateWithPicsum() {
  const picsumUrl = `https://picsum.photos/1200/630`;

  console.log(`[Picsum] Fetching basic fallback cover image...`);

  const response = await fetch(picsumUrl, { redirect: 'follow' });

  if (!response.ok) {
    throw new Error(`Picsum returned status ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || 'image/jpeg';
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (buffer.length < 1000) {
    throw new Error(`Picsum returned a suspiciously small image (${buffer.length} bytes)`);
  }

  // Save to disk
  const ext = contentType.includes('png') ? '.png' : '.jpg';
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const filename = `cover-${uniqueSuffix}${ext}`;
  const filePath = path.join(uploadDir, filename);

  fs.writeFileSync(filePath, buffer);

  const backendUrl = process.env.BACKEND_URL || `http://localhost:${env.port}`;
  const publicUrl = `${backendUrl}/uploads/${filename}`;

  console.log(`[Picsum] ✓ Fallback image saved: ${filename} (${buffer.length} bytes)`);
  return publicUrl;
}

/**
 * Generate a blog cover image using Google Gemini's image generation.
 * Always produces a unique image for each blog post.
 * Falls back to DuckDuckGo search, Pollinations, LoremFlickr, or Picsum if Gemini fails.
 *
 * @param {object} options
 * @param {string} options.description – A natural language description of the desired image.
 * @param {string} [options.blogTitle]  – Optional blog title for additional context.
 * @returns {Promise<string>} The public URL of the saved image.
 */
export async function generateBlogCoverImage({ description, blogTitle, categoryName }) {
  ensureGeminiConfigured();

  const imagePrompt = buildImagePrompt(description, blogTitle);
  const errors = [];

  // 1. Try Gemini models first
  for (const modelName of GEMINI_MODELS) {
    try {
      const { data: imageData, mimeType } = await callGeminiImageGen(modelName, imagePrompt);
      return saveImageToDisk(imageData, mimeType, modelName);
    } catch (err) {
      console.warn(`[GeminiImage] ✗ ${err.message}`);
      errors.push(err.message);
    }
  }

  // 2. Fallback to DuckDuckGo Image Search (highly relevant real cover photo for the blog topic, keyless)
  console.log(`[ImageGen] Gemini models failed/limit reached. Trying DuckDuckGo search fallback...`);
  try {
    return await generateWithDuckDuckGo(blogTitle, description, categoryName);
  } catch (fallbackErr) {
    console.warn(`[DuckDuckGo] ✗ ${fallbackErr.message}`);
    errors.push(`DuckDuckGo: ${fallbackErr.message}`);
  }

  // 3. Fallback to Pollinations.ai (free, dynamic AI generation)
  console.log(`[ImageGen] DuckDuckGo search failed. Trying Pollinations.ai fallback...`);
  try {
    return await generateWithPollinations(description, blogTitle);
  } catch (fallbackErr) {
    console.warn(`[Pollinations] ✗ ${fallbackErr.message}`);
    errors.push(`Pollinations: ${fallbackErr.message}`);
  }

  // 4. Fallback to LoremFlickr (free, search-based topical photo)
  console.log(`[ImageGen] Pollinations failed. Trying LoremFlickr fallback...`);
  try {
    return await generateWithLoremFlickr(description, blogTitle);
  } catch (fallbackErr) {
    console.warn(`[LoremFlickr] ✗ ${fallbackErr.message}`);
    errors.push(`LoremFlickr: ${fallbackErr.message}`);
  }

  // 5. Fallback to Picsum Photos (free, high-quality random photography)
  console.log(`[ImageGen] LoremFlickr failed. Trying Picsum Photos fallback...`);
  try {
    return await generateWithPicsum();
  } catch (fallbackErr) {
    console.warn(`[Picsum] ✗ ${fallbackErr.message}`);
    errors.push(`Picsum: ${fallbackErr.message}`);
  }

  throw new Error(`All image generation methods failed. Errors: ${errors.join(' | ')}`);
}
