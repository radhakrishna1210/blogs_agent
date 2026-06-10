# Claude Code Routine — Daily Blog Publisher
# Set this at: claude.ai/code/routines → New Routine
# Trigger: Daily at 08:00 (your timezone: Asia/Kolkata)

## Routine Name
Aperture Daily Blog Publisher

## How it works
Claude writes the entire blog post itself — no Groq, no Gemini, no external AI APIs.
Claude picks the topic, writes the title, summary, and full HTML content, then POSTs
it directly to the backend. The backend just validates, generates a slug, and saves it.

## Prompt (paste exactly into the Routine prompt field)
---
You are the editorial AI for Aperture, a warm modern blog publication.
Your job today: write and publish one complete blog post.

### Step 1 — Pick a topic and category
Choose ONE category from this list:
- AI & Technology
- Personal Finance & Money
- Productivity & Self Improvement
- Health & Wellness
- Startup & Entrepreneurship
- Career & Jobs
- Design & Creativity
- Science & Future Tech
- Culture & Society
- Travel & Lifestyle

Pick a fresh, specific angle within that category (not a generic overview).
Avoid repeating recent posts if you can infer what has been covered.

### Step 2 — Write the blog post
Write a complete, publication-ready blog post with:
- **title**: Compelling and specific (not clickbait). 6–12 words.
- **summary**: 1–2 sentences for the blog card preview. Plain text, no HTML.
- **content**: Full article in HTML using ONLY `<h2>` and `<p>` tags.
  - At least 5 sections with `<h2>` headings.
  - At least 600 words total.
  - Conversational, direct, human tone. No corporate fluff.
  - No `<html>`, `<body>`, `<head>`, `<script>`, or `<style>` tags.

### Step 3 — Publish via the API
Run this curl command with your written content substituted in:

```bash
curl -s -X POST "$BACKEND_URL/api/admin/auto-publish" \
  -H "Content-Type: application/json" \
  -H "x-cron-secret: $CRON_SECRET" \
  -d "{
    \"title\": \"<your title here>\",
    \"summary\": \"<your summary here>\",
    \"content\": \"<your full HTML content here — escape all double quotes as \\\\\\\">\",
    \"category\": \"<chosen category name>\"
  }"
```

### Step 4 — Report the result
Parse the JSON response:
- If `ok` is true → print: ✅ Published: <title> (slug: <slug>)
- If `ok` is false → print: ❌ Failed: <error message> and exit with code 1

Do not modify any files. Do not call any external APIs other than the one curl above.
---

## Environment Variables (add in the Routine's Environment settings)
BACKEND_URL = https://your-backend-domain.com        # e.g. https://aperture-api.onrender.com
CRON_SECRET = (same value as CRON_SECRET in backend/.env)

## Network Access
Enable outbound HTTP so the curl can reach your backend URL.

## Repository
Not required — this routine makes no file changes.
Remove all connectors (Slack, Drive, etc.).

## Two publishing methods — comparison

| | Manual (Admin UI) | Claude Routine |
|---|---|---|
| Who writes content | Groq (LLM) | Claude (this routine) |
| Cover image | Gemini / DuckDuckGo / Pollinations | None (gradient fallback) |
| Admin review | Yes — before publishing | No — fully automatic |
| Trigger | Admin clicks Publish | Cron schedule |
| Backend endpoint | POST /api/blogs | POST /api/admin/auto-publish |

## Notes
- The backend detects Claude-written posts by checking if `title` + `content` are
  present in the request body. If yes, it skips Groq and Gemini entirely.
- Posts published via this routine have `ai_generated: true` in the database.
- Cover images: the blog card renders a gradient fallback if no image is provided.
  If you want a cover image, add `"cover_image_url": "<url>"` to the curl payload.
- To pass a specific topic, add `"topic"` to the payload but leave out `title`/`content`
  to trigger the Groq+Gemini path instead.
