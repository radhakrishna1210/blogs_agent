# Aperture Monorepo

A full Aperture blog stack with a Next.js frontend and an Express backend.

## Structure

```text
.
├── frontend/              # Next.js + Tailwind frontend
├── backend/               # Node.js + Express API
├── supabase-schema.sql    # Database schema for Supabase
├── README.md              # Project-level setup guide
└── package.json           # Workspace root
```

## Local Setup

1. Install dependencies from the repo root.

```bash
npm install
```

2. Create env files.

- Copy [backend/.env.example](backend/.env.example) to [backend/.env](backend/.env) and fill in your backend credentials.
- Copy [frontend/.env.example](frontend/.env.example) to [frontend/.env.local](frontend/.env.local) and set your backend URL.

3. Apply the database schema.

Run [supabase-schema.sql](supabase-schema.sql) in Supabase SQL editor.

4. Start both apps.

```bash
npm run dev
```

If you want to run them separately:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

## Supabase Setup

1. Create a new Supabase project.
2. Open the project dashboard and go to **Project Settings > API**.
3. Copy these values into `backend/.env`:
	- `SUPABASE_URL` from the Project URL field.
	- `SUPABASE_ANON_KEY` from the anon/public API key.
	- `SUPABASE_SERVICE_ROLE_KEY` from the service role key. Keep this only in the backend.
4. Open the SQL editor and run [supabase-schema.sql](supabase-schema.sql).
5. If you want initial category data, run the category seed script after the env is filled.

### Database URL

`DATABASE_URL` is the direct PostgreSQL connection string for your Supabase database. You can find it in **Project Settings > Database > Connection string**.

It usually looks like this:

```text
postgresql://postgres:<your-password>@db.<project-ref>.supabase.co:5432/postgres
```

Use that exact string in `backend/.env` for `DATABASE_URL`.

## Groq API Key

For AI blog generation, set `GROQ_API_KEY` in `backend/.env`. The generator currently uses Groq’s OpenAI-compatible chat API.

## Required Environment Variables

Backend:

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

`DATABASE_URL` is optional for the current codebase. Use it only if you later add direct PostgreSQL access.

Frontend:

- `NEXT_PUBLIC_BACKEND_URL`

## Notes

- The UI uses the Aperture warm palette, serif/display typography, and editorial spacing.
- Protected frontend pages send the JWT in the `Authorization` header through the shared API helper.
- Backend errors return a consistent JSON shape with `ok`, `status`, `code`, and `error` fields.
