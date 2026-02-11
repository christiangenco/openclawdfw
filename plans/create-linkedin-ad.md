# Create LinkedIn Ad — Plan & Status

## Goal

Run a $100 test LinkedIn ad campaign targeting DFW founders/owners to drive them to openclawdfw.com and book an AI Opportunity Audit call.

## Campaign Settings (Done ✅)

| Setting | Value |
|---|---|
| **Ad set name** | DFW Founders - AI Employee - Website Conversions |
| **Objective** | Website conversions |
| **Location** | Dallas-Fort Worth Metroplex |
| **Job Seniorities** | Owner, Partner, CXO, VP, Director |
| **Audience Expansion** | Off |
| **Ad format** | Single image |
| **Placement** | LinkedIn only (no Audience Network) |
| **Budget** | $10/day |
| **Schedule** | Feb 11–21, 2026 (11 days, ~$110 max) |
| **UTM params** | `utm_medium=paid_social&utm_campaign=dfw_founders_ai_employee` (plus account-level `utm_source=LinkedIn`) |
| **Audience size** | ~940,000 |

## What's Left

### 1. Get LinkedIn Insight Tag partner ID 🔴 BLOCKED

The Insight Tag is a JavaScript pixel that goes on every page of the site. It's required for "Website conversions" objective.

**To get it:**
- In the campaign editor, scroll to **Conversion Tracking** section
- Click **Create new conversion** → **Insight Tag**
- Fill in: Name = "Book a Call - /book/thank-you", Category = "Book appointment"
- Click **Next step** → select **Manual conversions setup**
- Expand **"Insight Tag code"** section
- **Copy the code** — it will contain a partner ID number (like `_linkedin_partner_id = "1234567"`)
- Paste it to Claude

### 2. Install LinkedIn Insight Tag on the site 🔴

Once we have the partner ID, add it to `site/src/app/layout.tsx` following the same pattern as the other tracking pixels:

- **Base script** in `<head>` via `<Script>` tag (like Google/Bing/Twitter)
- **SPA pageview tracker** as a client component in `<body>` (like Fathom's `usePathname`/`useSearchParams` pattern in `fathom.tsx` and `twitter-pixel.tsx`)

The LinkedIn Insight Tag needs to fire on every SPA navigation, not just initial page load — Next.js App Router doesn't do full page reloads on navigation.

### 3. Add LinkedIn conversion event to thank-you page 🔴

Add a conversion tracking component to `site/src/app/book/thank-you/page.tsx` (like the existing `<TrackBookCall />` for Fathom and `<TwitterEvent />` for X).

The conversion URL rule in LinkedIn Campaign Manager should match: `https://openclawdfw.com/book/thank-you` (starts with).

### 4. Build & deploy the site 🔴

```bash
cd site && npx next build
git add -A && git commit -m "Add LinkedIn Insight Tag" && git push
```

Must build successfully before pushing (Vercel deploys from git).

### 5. Finish conversion creation in LinkedIn 🔴

Back in the campaign editor:
- Enter URL rule: `https://openclawdfw.com/book/thank-you` (starts with)
- Click **Create**

### 6. Create the ad creative 🔴

After the ad set is configured, click **"Set up ads"** to create the actual ad:
- **Image**: Need a compelling 1200×627 image (the mascot? a screenshot? Christian's face?)
- **Headline**: Something like "Your AI Employee Is Ready to Start" or "Still Managing Your Own Inbox?"
- **Description**: Short pitch driving to book a call
- **CTA button**: "Learn More" or "Book Now"
- **Destination URL**: `https://openclawdfw.com` (UTM params auto-appended)

### 7. Review & Launch 🔴

## Alternative: Switch to "Website Visits" Objective

If the Insight Tag setup is too much friction for a $100 test, we can switch the objective to **Website visits** which doesn't require conversion tracking at all. LinkedIn would optimize for clicks instead of conversions. We'd still track everything via UTM params in Fathom/GA. Can always upgrade to conversion tracking later.
