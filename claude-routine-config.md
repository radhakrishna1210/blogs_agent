# Claude Code Routine — Daily Blog Publisher
# Set this at: claude.ai/code/routines → New Routine
# Trigger: Daily at 08:00 (your timezone: Asia/Kolkata)

## Routine Name
Aperture Daily Blog Publisher

## Prompt (paste exactly into the Routine prompt field)
---
Make a POST request to the Aperture backend to trigger a daily blog post.

Steps:
1. Run the following curl command using bash:

   curl -s -X POST "$BACKEND_URL/api/admin/auto-publish" \
     -H "Content-Type: application/json" \
     -H "x-cron-secret: $CRON_SECRET" \
     -d '{}'

2. Parse the JSON response.
   - If `ok` is true: print "✅ Published: <title> (slug: <slug>)"
   - If `ok` is false: print "❌ Failed: <error message>" and exit with code 1

Do not add any extra steps. Do not modify any files.
---

## Environment Variables (add in the Routine's Environment settings)
BACKEND_URL = https://your-backend-domain.com        # e.g. https://aperture-api.onrender.com
CRON_SECRET = (same value as in backend/.env)

## Network Access
Enable outbound HTTP in the cloud environment so the curl can reach your backend URL.

## Repository
Not required — this routine makes no file changes.
Remove all connectors (Slack, Drive, etc.) — this routine only needs bash + curl.

## Notes
- This is the Claude Code Routines alternative to the GitHub Actions workflow.
- Use one or the other, not both — you'll double-post.
- GitHub Actions (daily-publish.yml) is more reliable for production; Routines are in research preview.
- To pass an optional topic, change the -d payload to: '{"topic":"your topic here"}'
