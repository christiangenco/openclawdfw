# Newsletter & Email Lead Gen Implementation Plan

## Tech Stack

| Layer | Tool | Why |
|-------|------|-----|
| Database | **Neon Postgres** (via Vercel) | Already configured, free tier, serverless |
| Email sending | **Mailgun** | API-driven, great deliverability, free flex tier (1K/mo) |
| Migrations | **node-pg-migrate** | Rails-like timestamped migrations, plain SQL up/down |
| App framework | **Next.js** (existing) | API routes for form handling, cron for drip |
| Cron | **Vercel Cron Jobs** | Free on Pro plan, runs API routes on a schedule |

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Blog post / Landing page                           │
│  ┌───────────────────────────────────┐              │
│  │ "Get the free checklist" form     │              │
│  │ [email] [Submit]                  │              │
│  └──────────────┬────────────────────┘              │
└─────────────────┼───────────────────────────────────┘
                  │ POST /api/subscribe
                  ▼
┌─────────────────────────────────────────────────────┐
│  API Route: /api/subscribe                          │
│  1. Validate email                                  │
│  2. INSERT INTO subscribers (upsert)                │
│  3. Send welcome email via Mailgun (with PDF link)  │
│  4. Return success                                  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Vercel Cron: /api/cron/drip (every 6 hours)        │
│  1. SELECT subscribers WHERE drip_next_at <= NOW()  │
│  2. For each: send next email in sequence            │
│  3. UPDATE drip_step + 1, drip_next_at              │
│  4. Skip if status != 'active'                      │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  API Route: /api/unsubscribe?token=<hmac>           │
│  1. Verify HMAC token                               │
│  2. UPDATE subscribers SET status = 'unsubscribed'  │
│  3. Show confirmation page                          │
└─────────────────────────────────────────────────────┘
```

---

## Database Migrations (Rails-like with node-pg-migrate)

### Why node-pg-migrate

- **Timestamped migration files** — just like Rails (`YYYYMMDDHHMMSS_name.sql`)
- **Plain SQL up/down** — no ORM magic, you write the SQL you'd write in Neon Console
- **Tracks state** in a `pgmigrations` table — knows what's been run
- **CLI commands** mirror Rails:
  - `npm run migrate create <name>` → creates a new migration file
  - `npm run migrate up` → runs pending migrations
  - `npm run migrate down` → rolls back last migration

### Setup

```bash
cd site
npm install node-pg-migrate
```

Add to `package.json` scripts:
```json
{
  "scripts": {
    "migrate": "node-pg-migrate --database-url-var DATABASE_URL_UNPOOLED -j ts --tsconfig tsconfig.json",
    "migrate:create": "npm run migrate -- create",
    "migrate:up": "npm run migrate -- up",
    "migrate:down": "npm run migrate -- down"
  }
}
```

> **Note:** We use `DATABASE_URL_UNPOOLED` for migrations because pgbouncer
> (the pooled connection) doesn't support the advisory locks that migration
> tools use. Regular app queries use the pooled `DATABASE_URL`.

Migration files live in `site/migrations/` with the naming convention:
```
migrations/
  1739200000000_create-subscribers.ts
  1739200100000_add-lead-magnet-column.ts
  ...
```

### Migration 1: Create subscribers table

```ts
// migrations/TIMESTAMP_create-subscribers.ts
import type { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("subscribers", {
    id: "id",  // shorthand for SERIAL PRIMARY KEY
    email: { type: "text", notNull: true, unique: true },
    name: { type: "text" },
    lead_magnet: { type: "text", notNull: true },
    status: { type: "text", notNull: true, default: "'active'" },
    drip_step: { type: "integer", notNull: true, default: 0 },
    drip_next_at: { type: "timestamptz" },
    subscribed_at: { type: "timestamptz", notNull: true, default: pgm.func("NOW()") },
    unsubscribed_at: { type: "timestamptz" },
  });

  pgm.createIndex("subscribers", "status");
  pgm.createIndex("subscribers", "drip_next_at");
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("subscribers");
}
```

---

## Implementation Steps

### Phase 1: Database & Migration Setup

- [ ] `npm install @neondatabase/serverless node-pg-migrate`
- [ ] Add migration scripts to `package.json`
- [ ] Create first migration (subscribers table)
- [ ] Run `npm run migrate:up` against Neon
- [ ] Verify table exists in Neon Console

### Phase 2: Mailgun Setup

- [ ] Sign up at mailgun.com (Flex plan = free 1K emails/mo)
- [ ] Add & verify `openclawdfw.com` domain:
  - SPF record (TXT on `openclawdfw.com`)
  - DKIM records (two TXT records Mailgun provides)
  - MX records (for receiving, optional)
  - DMARC record (TXT `_dmarc.openclawdfw.com`)
- [ ] Get API key, add to `.env.local`:
  ```
  MAILGUN_API_KEY=key-xxxxx
  MAILGUN_DOMAIN=openclawdfw.com
  MAILGUN_FROM=Christian Genco <christian@openclawdfw.com>
  ```
- [ ] Add same env vars in Vercel dashboard
- [ ] `npm install mailgun.js form-data` (official Mailgun SDK)

### Phase 3: Core API Routes

#### `POST /api/subscribe`
```
site/src/app/api/subscribe/route.ts
```
- Accept `{ email, name?, lead_magnet }` from form
- Validate email format
- Upsert into `subscribers` table
- Set `drip_next_at` to NOW() (immediate welcome email)
- Send welcome email via Mailgun with PDF download link
- Return JSON `{ success: true }`

#### `GET /api/unsubscribe`
```
site/src/app/api/unsubscribe/route.ts
```
- Accept `?token=<hmac-signed-email>`
- Verify HMAC (using a `UNSUBSCRIBE_SECRET` env var)
- Update subscriber status to `unsubscribed`
- Return a simple HTML page confirming unsubscription

#### `GET /api/cron/drip`
```
site/src/app/api/cron/drip/route.ts
```
- Protected by `CRON_SECRET` env var (Vercel passes this automatically)
- Query: `SELECT * FROM subscribers WHERE status = 'active' AND drip_step < 5 AND drip_next_at <= NOW()`
- For each subscriber, look up the email template for their `drip_step`
- Send via Mailgun
- Update `drip_step = drip_step + 1` and `drip_next_at` to the next interval

### Phase 4: Email Templates

Drip schedule:
| Step | Delay | Subject | Content |
|------|-------|---------|---------|
| 0 | immediate | "Your 27-step OpenClaw checklist is ready" | Welcome + PDF link |
| 1 | +2 days | "Most OpenClaw installs break within a week" | 3 mistakes |
| 2 | +5 days | "From 200 unread emails to inbox zero" | Success story |
| 3 | +8 days | "Your IT team is going to ask about this" | Security angle |
| 4 | +12 days | "Let's get you set up this week" | Direct CTA |

Email templates stored as simple TypeScript functions in:
```
site/src/lib/emails/
  welcome.ts        // step 0
  three-mistakes.ts // step 1
  inbox-zero.ts     // step 2
  security.ts       // step 3
  book-call.ts      // step 4
```

Each exports `{ subject: string, html: string, text: string }` given a subscriber record + unsubscribe URL.

### Phase 5: Frontend Components

#### Email capture form component
```
site/src/components/email-capture.tsx
```
- Client component with email input + submit button
- Posts to `/api/subscribe`
- Shows success/error state
- Prop: `leadMagnet` (which PDF they're opting into)
- Can be dropped into any blog post or landing page

#### Add to existing homepage
- Add a section between "Built for Busy Leaders" and the final CTA
- "Get the free OpenClaw deployment checklist" + email form

### Phase 6: Vercel Cron Configuration

```jsonc
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/drip",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

Vercel automatically adds a `CRON_SECRET` env var and sends it as
`Authorization: Bearer <secret>` — verify this in the route handler.

### Phase 7: PDF Lead Magnet

- Write the 27-step checklist content (see [content strategy](./content-strategy.md))
- Design as a simple, clean PDF (can use a tool like Typst, or just export from a well-formatted Google Doc/Notion page)
- Host as a static file at `/checklist.pdf` in the `public/` directory
- The download link in the welcome email points to `https://openclawdfw.com/checklist.pdf`

---

## File Structure (New Files)

```
site/
├── migrations/
│   └── TIMESTAMP_create-subscribers.ts
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── subscribe/
│   │       │   └── route.ts
│   │       ├── unsubscribe/
│   │       │   └── route.ts
│   │       └── cron/
│   │           └── drip/
│   │               └── route.ts
│   ├── components/
│   │   └── email-capture.tsx
│   └── lib/
│       ├── db.ts              # Neon connection helper
│       ├── mailgun.ts         # Mailgun client helper
│       ├── unsubscribe.ts     # HMAC token generation/verification
│       └── emails/
│           ├── welcome.ts
│           ├── three-mistakes.ts
│           ├── inbox-zero.ts
│           ├── security.ts
│           └── book-call.ts
├── vercel.json
└── package.json               # (updated with migration scripts + new deps)
```

---

## Environment Variables Needed

```bash
# Already have
DATABASE_URL=...            # Neon pooled (for app queries)
DATABASE_URL_UNPOOLED=...   # Neon direct (for migrations)

# Need to add
MAILGUN_API_KEY=key-xxxxx
MAILGUN_DOMAIN=openclawdfw.com
MAILGUN_FROM="Christian Genco <hello@openclawdfw.com>"
UNSUBSCRIBE_SECRET=<random-32-char-string>  # for HMAC signing unsubscribe links
CRON_SECRET=<auto-set-by-vercel>            # Vercel sets this automatically
BASE_URL=https://openclawdfw.com            # for generating full URLs in emails
```

---

## Migration Workflow (Day-to-Day)

```bash
# Create a new migration
npm run migrate:create -- add-click-tracking

# Edit the generated file in migrations/

# Run locally against Neon (safe — it's just your dev/prod db for now)
npm run migrate:up

# Roll back if needed
npm run migrate:down

# On deploy: add `npm run migrate:up` to your Vercel build command:
#   Build Command: npm run migrate:up && next build
# This ensures migrations run before the app starts on every deploy.
```

---

## Security Notes

- **Rate limiting on `/api/subscribe`**: Add simple IP-based rate limiting (e.g., 5 requests/minute per IP) to prevent abuse. Can do this with Vercel Edge Middleware or a simple in-memory counter.
- **Email validation**: Validate format client-side AND server-side. Consider a simple MX record check.
- **HMAC unsubscribe tokens**: Never expose raw email in URLs. Sign with `UNSUBSCRIBE_SECRET`.
- **CAN-SPAM compliance**: Every email must include physical address, unsubscribe link, and identify as promotional.
- **Double opt-in** (optional but nice): Could add a confirmation step where the welcome email has a "confirm your email" link before starting the drip. Adds a migration column `confirmed_at` and an API route.
