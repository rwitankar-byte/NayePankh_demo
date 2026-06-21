# NayePankh AI Volunteer Assistant

A full-stack volunteer assistant for NayePankh Foundation. The app combines a React/Vite public website, a Hono + tRPC API, Kimi OAuth admin authentication, OpenRouter-backed chat with safe fallback responses, and a MySQL database managed by Drizzle ORM.

## Architecture overview

- Frontend: React 19, React Router 7, Vite 7, Tailwind CSS 3, shadcn/Radix UI, React Query, tRPC client.
- Backend: Hono 4 running inside Vite dev server locally and as a Node server in production.
- API layer: tRPC 11 at `/api/trpc`, plus `/api/health` and Kimi OAuth callback at `/api/oauth/callback`.
- Database: MySQL 8.4.
- ORM: Drizzle ORM + Drizzle Kit migrations.
- Auth: Kimi OAuth -> signed HTTP-only `kimi_sid` session cookie using `jose`; admin role is assigned by `OWNER_UNION_ID`.
- AI chat: OpenRouter API when `OPENROUTER_API_KEY` is set; built-in NayePankh fallback answers when it is not.
- Deployment: frontend can be deployed to Vercel as static Vite output; backend can be deployed to Railway as a Node web service with Railway MySQL.

## Folder structure

```
api/                Hono app, tRPC routers, auth, env, database connection
api/kimi/           Kimi OAuth/session/platform integration
api/queries/        Drizzle query helpers
contracts/          Shared constants, types, and error helpers
db/                 Drizzle schema, relations, migrations, seed script
src/                React frontend
src/components/     App components and generated UI primitives
src/pages/          Route pages
src/providers/      tRPC + React Query provider
public/             Static images
compose.yaml        Local MySQL service
vercel.json         Vercel static frontend config
```

## Local setup

Requires Node.js 22.x and npm 10.x.

```bash
nvm use
npm ci
cp .env.example .env
docker compose up -d mysql
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Open http://127.0.0.1:3000.

## Database commands

```bash
docker compose up -d mysql
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:seed
```

Use `db:migrate` for migration-based deployment. Use `db:push` only when you intentionally want Drizzle Kit to push schema state directly.

## Scripts

- `npm run dev` - start Vite + Hono local dev server on port 3000.
- `npm run build:client` - build only the Vite static frontend for Vercel.
- `npm run build` - build frontend plus bundled backend server.
- `npm start` - run the production backend/server bundle.
- `npm run check` - TypeScript project references.
- `npm run lint` - ESLint.
- `npm test` - Vitest.
- `npm run db:generate` - generate Drizzle SQL migrations.
- `npm run db:migrate` - apply Drizzle migrations.
- `npm run db:seed` - seed initial events.

## Routes

Frontend:

- `/` - home page with embedded assistant.
- `/chat` - full chat page.
- `/volunteer` - volunteer registration flow.
- `/internship` - internship information.
- `/events` - events list from MySQL.
- `/contact` - contact form.
- `/login` - Kimi OAuth login.
- `/admin` - protected admin dashboard.
- `*` - not found page.

Backend:

- `GET /api/health` - deployment health check.
- `GET /api/oauth/callback` - Kimi OAuth callback.
- `/api/trpc/*` - tRPC API.

## Environment variables

See [.env.example](./.env.example). Never commit real values in `.env`.

## Production notes

- The app needs a real Kimi OAuth app before login/admin can work in production.
- `OWNER_UNION_ID` must be set to the Kimi union ID of the admin user before first admin login.
- Supabase is not a drop-in database target for this codebase because the schema and Drizzle config are MySQL-specific. Use Railway MySQL unless you intentionally migrate the schema to PostgreSQL.
- If frontend and backend are on different domains, set `VITE_API_URL` on Vercel and `FRONTEND_URL` on Railway.

