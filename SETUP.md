# Setup Guide

## Required tooling

- Node.js: 22.x (project includes `.nvmrc`)
- npm: 10.x
- Docker Desktop: for local MySQL 8.4
- Git: for repository publishing

## Installation report

Commands used during setup:

```bash
npm ci --registry=https://registry.npmjs.org
docker compose up -d mysql
npm run db:generate
npm run db:migrate
npm run db:seed
npm run check
npm test
npm run lint
npm run build
```

Dependency issue fixed:

- The downloaded `package-lock.json` pointed tarballs at `npm.mirrors.msh.team`, which produced incomplete package installs.
- The lockfile was minimally repaired to use `https://registry.npmjs.org/` while keeping the locked package versions.

## Local environment

Copy the example file:

```bash
cp .env.example .env
```

Set real values for Kimi/OpenRouter when available. The local app can run without OpenRouter because chat falls back to built-in NayePankh answers.

## Local database

Start MySQL:

```bash
docker compose up -d mysql
```

Create/apply schema:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

Verify tables:

```bash
docker exec -e MYSQL_PWD=nayepankh_local_dev app-mysql-1 mysql -unayepankh nayepankh -e 'SHOW TABLES;'
```

If using the default local `.env`, the database is available at:

```
mysql://nayepankh:nayepankh_local_dev@127.0.0.1:3306/nayepankh
```

## Run locally

```bash
npm run dev
```

Then open http://127.0.0.1:3000.

## Testing checklist

Verified locally:

- Home page loads.
- Chat submits and returns fallback assistant response.
- Volunteer registration writes to MySQL.
- Contact form writes to MySQL.
- Events page reads seeded MySQL events.
- Admin API rejects unauthenticated requests.
- Admin stats API works with a valid signed admin session.
- TypeScript check passes.
- Vitest passes.
- ESLint passes.
- Production build passes.

Requires real Kimi credentials:

- End-to-end Kimi OAuth login.
- Browser-level admin dashboard after OAuth callback.
