# Interactly

Interactly is a live quiz platform for creating quizzes, hosting real-time sessions, and letting players join with a short code. It includes an admin dashboard, quiz editor, presenter view, player experience, leaderboards, and session analytics.

## Project Structure

This repository is a pnpm/Turborepo monorepo.

```text
apps/
  web/       Next.js app for admins, presenters, and players
  server/    Express API for auth, quizzes, sessions, gameplay, and analytics

packages/
  auth/      JWT, password, cookie, and auth helper utilities
  db/        Prisma schema, migrations, and database client
  types/     Shared TypeScript DTOs and domain types
  validation/Shared Zod schemas for request validation
  ui/        Shared React UI primitives
  eslint-config/
  typescript-config/
```

## Tech Stack

- pnpm workspaces and Turborepo
- Next.js, React, Tailwind CSS
- Express
- PostgreSQL
- Prisma
- Zod
- JWT auth with HTTP-only cookies

## Prerequisites

- Node.js 18 or newer
- pnpm 9
- PostgreSQL database

Install dependencies:

```sh
pnpm install
```

## Environment Variables

Create local environment files from the examples:

```sh
cp apps/server/.env.example apps/server/.env
cp packages/db/.env.example packages/db/.env
```

`apps/server/.env`:

```env
PORT=
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
CORS_ORIGIN=
NODE_ENV=
```

`packages/db/.env`:

```env
DATABASE_URL=
```

The same database URL is needed in both places because the API uses the database package at runtime, while Prisma CLI commands run from `packages/db`.

For the web app, set `NEXT_PUBLIC_API_URL` only when the API is not available at the default local URL:

```env
NEXT_PUBLIC_API_URL=
```

## Database Setup

Run Prisma commands from the database package:

```sh
pnpm --filter @repo/db db:generate
pnpm --filter @repo/db db:migrate
```

Useful database commands:

```sh
pnpm --filter @repo/db db:studio
pnpm --filter @repo/db db:push
```

Existing migrations live in `packages/db/prisma/migrations`.

## Development

Start all development services through Turbo:

```sh
pnpm dev
```


Run one app at a time:

```sh
pnpm --filter web dev
pnpm --filter @repo/server dev
```

## Common Commands

```sh
pnpm build        # Build apps and packages
pnpm check-types  # Run TypeScript checks
pnpm lint         # Run configured ESLint tasks
pnpm format       # Format TypeScript, TSX, and Markdown files
```

There is not currently a repository-wide test command. Add tests before relying on this project in production.

## Core Workflows

Admin workflow:

1. Register or log in.
2. Create a quiz.
3. Add questions and answer options.
4. Publish the quiz.
5. Create and host a session.
6. Present questions and advance through reveal, leaderboard, and final results.

Player workflow:

1. Open the join page.
2. Enter the session join code and nickname.
3. Answer each active question.
4. View reveal, leaderboard, and final results screens.

## API Overview

The Express API is mounted under `/api`.

Main modules:

- `auth`: admin registration, login, logout, and current-user lookup
- `quizzes`: quiz CRUD, question editing, option editing, publishing, and archiving
- `sessions`: game session creation, host controls, and session state
- `players`: join, reconnect, heartbeat, and player session state
- `gameplay`: answer submission, leaderboard, final results, and analytics

Request validation is handled with Zod schemas from `@repo/validation`. Shared response and DTO types live in `@repo/types`.

## Architecture Notes

The server follows a controller/service/repository split:

- Controllers parse request input and return API responses.
- Services contain domain rules such as publishing validation, session transitions, scoring, and ownership checks.
- Repositories contain Prisma queries and transactions.

The web app uses the Next.js app router and client-side API calls through `apps/web/lib/api-client.ts`. Shared types and validation schemas are imported from workspace packages to keep frontend and backend contracts aligned.

The database schema models:

- Admins
- Quizzes
- Questions
- Question options
- Game sessions
- Participants
- Answers

## Deployment Notes

Production deployments need:

- A PostgreSQL database
- `DATABASE_URL` configured for both server runtime and Prisma migration execution
- A strong `JWT_SECRET`
- `CORS_ORIGIN` set to the deployed web origin
- `NODE_ENV=production`
- Prisma migrations applied with `pnpm --filter @repo/db prisma migrate deploy` or an equivalent deployment step
- The API base URL exposed to the web app with `NEXT_PUBLIC_API_URL`

Suggested deployment split:

- Deploy `apps/web` to a Next.js-capable host.
- Deploy `apps/server` as a Node.js service.
- Run Prisma migrations during release before starting the new API version.