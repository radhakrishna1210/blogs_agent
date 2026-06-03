# Aperture Backend

Express API for the Aperture blog platform.

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- Supabase project with the Aperture schema applied

## Environment Variables

Create a `.env` file with:

- `PORT`
- `NODE_ENV`
- `JWT_SECRET`
- `GROQ_API_KEY`
- `ADMIN_EMAIL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`
- `FRONTEND_URL`

`DATABASE_URL` is optional for the current setup. The backend uses Supabase through the client keys above, so you do not need a PostgreSQL connection string unless you add direct database access later.

## Run Locally

```bash
npm install
npm run dev
```

The API runs at `http://localhost:4000`.
