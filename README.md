# AI Photo Enhancer

Production-ready starter for an AI image enhancement SaaS using Next.js App Router, Prisma, NextAuth, Paddle, and Tailwind.

## Features

- App Router marketing/auth/dashboard architecture
- NextAuth with credentials + optional Google/GitHub OAuth
- Prisma data model for users, images, enhancements, billing, and API keys
- Auth-protected upload, enhance, history, billing, and admin endpoints
- Request validation with `zod`
- Basic per-user rate limiting for expensive API endpoints
- Signed Cloudinary upload config endpoint
- Replicate async prediction + webhook completion handling
- Hardened security headers and middleware route protection
- Lint/build ready for CI pipelines

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env
```

3. Set required env vars:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`

4. Generate prisma client:

```bash
npm run db:generate
```

5. Push schema to DB:

```bash
npm run db:push
```

6. Start dev server:

```bash
npm run dev
```

## Production Checklist

- Use managed Postgres with backups and PITR
- Add real object upload (Cloudinary signed upload)
- Replace inline enhancement completion with async queue + worker
- Implement Paddle webhook signature verification + idempotent event store
- Add Sentry/Datadog and structured logging
- Add integration tests and endpoint smoke tests
- Configure CI/CD secrets and environment-based deploy promotion

## Scripts

- `npm run dev` - local development
- `npm run lint` - eslint
- `npm run build` - production build
- `npm run db:generate` - generate prisma client
- `npm run db:push` - push schema to database
