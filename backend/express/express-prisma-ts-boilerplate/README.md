# 🚀 Express + TypeScript + Prisma (v7) Starter Guide

> Reference: [cinetube-backend](https://github.com/arifucoder/cinetube-backend) — সেখানকার structure আর error handling এখানে core আকারে রাখা হয়েছে। Auth (Better Auth), Cloudinary, Stripe, Email এগুলো ইচ্ছামতো পরে add করা যাবে।

সব code `code/` ফোল্ডারে আলাদা ফাইল হিসেবে আছে। এই README শুধু **কী করতে হবে, কোন order-এ** — সেটা বলে।

---

## 📁 Final Folder Structure

```
project-root/
├── .env
├── .env.example
├── .gitignore
├── .vscode/settings.json
├── eslint.config.mjs
├── package.json
├── prisma.config.ts
├── tsconfig.json
├── tsup.config.ts
├── prisma/
│   ├── migrations/              # prisma migrate dev চালালে auto তৈরি হয়
│   └── schema/
│       ├── schema.prisma        # generator + datasource (শুধু এটা)
│       ├── enums.prisma         # সব enum এক জায়গায়
│       └── genre.prisma         # প্রতি model আলাদা ফাইল
└── src/
    ├── app.ts                   # express app, middleware, routes
    ├── server.ts                # server start + graceful shutdown
    ├── generated/prisma/        # prisma generate → auto (gitignored)
    └── app/
        ├── config/
        │   └── env.ts           # env validate + export
        ├── lib/
        │   └── prisma.ts        # PrismaClient (pg adapter)
        ├── errorHelpers/
        │   ├── AppError.ts
        │   ├── handlePrismaErrors.ts
        │   └── handleZodError.ts
        ├── interfaces/
        │   ├── error.interface.ts
        │   └── query.interface.ts
        ├── middleware/
        │   ├── globalErrorHandler.ts
        │   ├── notFound.ts
        │   └── validateRequest.ts
        ├── shared/
        │   ├── catchAsync.ts
        │   └── sendResponse.ts
        ├── utils/
        │   └── QueryBuilder.ts  # search / filter / sort / paginate
        ├── routes/
        │   └── index.ts         # central route registry
        └── module/
            └── genre/           # ← sample module, copy করে নতুন বানাও
                ├── genre.route.ts
                ├── genre.controller.ts
                ├── genre.service.ts
                ├── genre.validation.ts
                └── genre.interface.ts
```

---

## 🛠️ Step-by-Step Setup

### Step 1 — Project init

```bash
mkdir my-project && cd my-project
git init
pnpm init
```

`code/.gitignore` কপি করো। `package.json`-এ `"type": "module"` add করো (ESM ব্যবহার হচ্ছে)।

### Step 2 — Packages install

```bash
# runtime
pnpm add express cors cookie-parser dotenv http-status qs zod
pnpm add @prisma/client @prisma/adapter-pg pg
pnpm add tsup

# dev
pnpm add -D typescript tsx prisma
pnpm add -D @types/node @types/express @types/cors @types/cookie-parser @types/qs @types/pg
pnpm add -D eslint @eslint/js typescript-eslint
```

| Package | কেন লাগে |
|---|---|
| `express` (v5) | framework |
| `cors`, `cookie-parser` | CORS + cookie read |
| `dotenv` | `.env` load |
| `http-status` | `status.NOT_FOUND` টাইপ constant |
| `qs` | nested query parse (`?price[gte]=100`) |
| `zod` (v4) | request validation |
| `@prisma/client`, `prisma` | ORM |
| `@prisma/adapter-pg`, `pg` | Prisma 7-এ PostgreSQL driver adapter **must** |
| `tsx` | dev-এ TS run (watch mode) |
| `tsup` | production build (single ESM bundle) |
| `eslint` + `typescript-eslint` | lint |

**Optional (পরে লাগলে):**
```bash
pnpm add better-auth jsonwebtoken cloudinary stripe nodemailer pdfkit date-fns uuid
pnpm add -D @types/jsonwebtoken @types/nodemailer @types/pdfkit @types/uuid
```

### Step 3 — Config files কপি

`code/` থেকে root-এ কপি করো:

| ফাইল | কাজ |
|---|---|
| `tsconfig.json` | ESNext + bundler resolution |
| `tsup.config.ts` | `src/server.ts` → `dist/server.js` |
| `eslint.config.mjs` | flat config |
| `prisma.config.ts` | schema folder + migrations path + DATABASE_URL |
| `.env.example` → `.env` | values বসাও |
| `package.scripts.json` | এর `scripts` অংশ `package.json`-এ paste করো |
| `.vscode.settings.json` → `.vscode/settings.json` | format on save |

### Step 4 — Prisma setup

```bash
mkdir -p prisma/schema
```

`code/prisma/schema/schema.prisma` আর `genre.prisma` কপি করো। খেয়াল রাখো:

- `schema.prisma`-তে generator হচ্ছে `prisma-client` (নতুন), output `../../src/generated/prisma`
- datasource-এ `url` **নেই** — সেটা `prisma.config.ts` থেকে আসে
- multi-file schema: প্রতি model আলাদা `.prisma` ফাইল, একই folder-এ

```bash
pnpm generate        # client generate → src/generated/prisma
pnpm migrate         # migration name দিতে হবে
```

Import করবে এভাবে:
```ts
import { PrismaClient, Prisma } from "../../generated/prisma/client";
import { Role } from "../../generated/prisma/enums";
```

### Step 5 — src ফাইল কপি

`code/src/` পুরোটা `src/`-এ কপি করো। Order matter করে না, সব একসাথে দাও।

### Step 6 — Run

```bash
pnpm dev             # http://localhost:5000
pnpm build && pnpm start   # production
pnpm lint
```

Test: `GET http://localhost:5000/api/v1/genres`

---

## 🧩 নতুন Module বানানোর নিয়ম

`module/genre/` কপি করে rename করো। প্রতি module-এ ৫টা ফাইল:

| ফাইল | দায়িত্ব |
|---|---|
| `x.interface.ts` | payload type |
| `x.validation.ts` | zod schema (create + update) |
| `x.service.ts` | prisma query, business logic, `AppError` throw |
| `x.controller.ts` | `catchAsync` + `sendResponse` — logic নাই |
| `x.route.ts` | `validateRequest(schema)` → controller |

তারপর `routes/index.ts`-এ register:
```ts
router.use("/movies", MovieRoutes);
```

Prisma model → `prisma/schema/movie.prisma` → `pnpm migrate`

---

## ⚠️ Error Handling কীভাবে কাজ করে

```
controller (catchAsync) ──throw──▶ globalErrorHandler
                                        │
     ┌──────────────┬─────────────┬─────┴────────┬────────────┐
   Prisma*Error   ZodError     AppError       Error       unknown
   (P2002→409     (400 +       (তোমার দেওয়া   (500)        (500)
    P2025→404…)   field path)   statusCode)
```

- Service-এ custom error: `throw new AppError(status.NOT_FOUND, "Genre not found")`
- Zod fail → `validateRequest` নিজেই `next(error)` করে
- Prisma error code → HTTP status mapping `handlePrismaErrors.ts`-এ
- `development`-এ stack + raw error response-এ যায়, production-এ যায় না

Response shape (সব সময় একই):
```json
{ "success": false, "message": "...", "errorSources": [{ "path": "", "message": "" }] }
```

---

## 🔍 QueryBuilder Usage

```ts
new QueryBuilder(prisma.genre, query, {
  searchableFields: ["name"],          // ?searchTerm=act
  filterableFields: ["isDeleted"],     // ?isDeleted=false
})
  .where({ isDeleted: false })
  .search().filter().sort().paginate() // ?sortBy=name&sortOrder=asc&page=2&limit=5
  .execute();                          // → { data, meta }
```

Range: `?price[gte]=100&price[lte]=500` | Relation: `searchableFields: ["author.name"]`

---

## 🧱 app.ts middleware order (গুরুত্বপূর্ণ)

1. `cors`
2. Better Auth handler (থাকলে) — `express.json()`-এর **আগে**
3. Stripe webhook (থাকলে) — `express.raw()` লাগে, তাই `express.json()`-এর **আগে**
4. `express.json()`, `urlencoded`, `cookieParser`
5. `/api/v1` routes
6. `globalErrorHandler` → `notFound` (সবার শেষে)

---

## 🐛 Common Problems

| সমস্যা | সমাধান |
|---|---|
| `Cannot find module '../../generated/prisma/client'` | `pnpm generate` চালাও |
| `Environment variable X is required` | `.env` চেক করো, `env.ts`-এর `requiredEnvVariables` list-এ থাকলে দিতে হবে |
| Prisma: `url` not allowed in datasource | Prisma 7-এ url `prisma.config.ts`-এ, schema-তে না |
| `require is not defined` build-এর পর | `tsup.config.ts`-এর banner আছে কিনা দেখো |
| Nested query object হিসেবে আসছে না | `app.set("query parser", qs.parse)` আছে কিনা দেখো |
| Vercel-এ deploy | `vercel.json` → `dist/server.js`, build command `pnpm build` |

---

## ➕ পরে যা add করতে পারো (repo-তে আছে)

- **Auth**: `lib/auth.ts` (Better Auth + prismaAdapter), `middleware/checkAuth.ts`, `utils/jwt.ts`, `utils/seed.ts` (super admin)
- **Upload**: `config/cloudinary.config.ts`, `utils/deleteUploadedFilesFromGlobalErrorHandler.ts`
- **Payment**: `config/stripe.config.ts`, `module/payment/`, `/webhook` route
- **Email**: `utils/email.ts` (nodemailer), `templates/`
- **Deploy**: `Dockerfile` (multi-stage), `.github/workflows/deploy.yml`
