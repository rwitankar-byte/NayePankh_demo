# Deployment Guide

## Recommended topology

- Vercel: static Vite frontend.
- Railway: Hono/tRPC backend Node service.
- Railway MySQL: MySQL database.

Why Railway MySQL instead of Supabase: this repository uses Drizzle's MySQL dialect and MySQL column types. Supabase is PostgreSQL, so it is not a drop-in target without a schema/ORM migration.

## Frontend on Vercel

Vercel supports Vite deployments and project-level environment variables. The included `vercel.json` sets:

- Build command: `npm run build:client`
- Output directory: `dist/public`
- SPA rewrite: all routes -> `/index.html`

Steps:

1. Import the GitHub repository into Vercel.
2. Framework preset: Vite.
3. Build command: `npm run build:client`.
4. Output directory: `dist/public`.
5. Add environment variables:
   - `VITE_APP_ID` = Kimi OAuth app/client ID.
   - `VITE_KIMI_AUTH_URL` = Kimi OAuth base URL.
   - `VITE_API_URL` = Railway backend URL, for example `https://your-api.up.railway.app`.
6. Deploy.

References:

- Vercel Vite docs: https://vercel.com/docs/frameworks/frontend/vite
- Vercel build config docs: https://vercel.com/docs/deployments/configure-a-build
- Vercel rewrites docs: https://vercel.com/docs/rewrites

## Backend on Railway

Railway injects `PORT`; the backend already reads `process.env.PORT || "3000"`. The app exposes `GET /api/health` for Railway health checks.

Steps:

1. Create a Railway project.
2. Add a MySQL database service from Railway templates.
3. Add a Node app service from the GitHub repository.
4. Backend service settings:
   - Build command: `npm run build`
   - Start command: `npm start`
   - Health check path: `/api/health`
   - Pre-deploy command: `npm run db:migrate && npm run db:seed`
5. Add environment variables to the backend service:
   - `NODE_ENV=production`
   - `DATABASE_URL` = Railway MySQL internal connection string.
   - `APP_ID` = Kimi OAuth app/client ID.
   - `APP_SECRET` = Kimi OAuth client secret and session signing secret.
   - `KIMI_AUTH_URL` = Kimi OAuth base URL.
   - `KIMI_OPEN_URL` = Kimi Open Platform base URL.
   - `OWNER_UNION_ID` = Kimi union ID of the admin user.
   - `FRONTEND_URL` = Vercel frontend URL.
   - `OPENROUTER_API_KEY` = optional, OpenRouter API key.
6. Deploy backend.
7. Update the Kimi OAuth app callback URL to:
   - `https://your-api.up.railway.app/api/oauth/callback`

References:

- Railway variables docs: https://docs.railway.com/variables
- Railway start command docs: https://docs.railway.com/guides/start-command
- Railway health checks docs: https://docs.railway.com/guides/healthchecks-and-restarts
- Railway databases docs: https://docs.railway.com/databases

## GitHub publishing commands

```bash
git init
git add .
git commit -m "Initial production-ready setup"
git branch -M main
git remote add origin https://github.com/rwitankar-byte/NayePankh_demo.git
git push -u origin main
```

