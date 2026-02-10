# AGENTS.md

## Development Rules

- **Always run `cd site && npx next build` and verify it succeeds before committing and pushing.** Vercel deploys from git — if it doesn't build locally, it won't build in production.

## What OpenClaw DFW Is

OpenClaw DFW (openclawdfw.com) is a white-glove AI staffing consultancy run by **Christian Genco** that deploys and manages [OpenClaw](https://openclaw.ai) — an open-source AI executive assistant — for founders and business owners in the Dallas/Fort Worth metro. Remote available nationwide.

**Core metaphor:** We're a staffing agency for AI. We *place* an AI employee in your business and serve as its ongoing *Agent Manager* — training, tuning, and managing it so it keeps performing.

Christian built his own AI assistant before OpenClaw existed, has been in tech for over a decade, and is fanatical about security. He shows up in person, shakes your hand, and makes sure the thing works before he leaves.

## The Pitch (One Sentence)

You hire an AI executive assistant. I place it, secure it, and manage it — like a staffing agency for AI.

## Competitor Reference: SetupClaw

SetupClaw (setupclaw.com) is a white-glove consultancy run by Michael Chomsky in SF Bay Area that does a similar thing. Their pricing (for reference, NOT published on our site):

- **In-person implementation** ($2,400) or **remote** ($1,200): install, harden, integrate email/calendar/messaging, build up to 3 workflows, and 14-day "hypercare" via Slack Connect.
- **Additional Executive Agents** ($1,200 each): one OpenClaw instance per identity.
- **Managed Care plans** ($1,875–$7,500+/mo): ongoing monitoring, updates, drift checks, support hours, and security reviews.

We take inspiration from their positioning and pricing but use our own terminology and never publish prices on the site.

## Target Customer

- **Who:** Business owners, founders, managing partners — people with autonomy to deploy something like this without needing committee approval. Companies with 4–50+ employees.
- **Industries:** Law firms, real estate, mortgage companies, insurance agencies, SMBs of all kinds. Anyone whose leadership drowns in email, calendar, and coordination.
- **Psychographic:** They don't want to get left behind on AI. They've heard about ChatGPT but want something that actually *does work* for them, not just answers questions. Dropping a few thousand dollars a month on what could become their most valuable employee is nothing.
- **Dream client example:** Managing partner at a 15-person personal injury law firm in Dallas. Spends 3 hours a day in his inbox. Has autonomy to deploy. Wants to experiment with AI. Needs to trust the person setting it up.

## The Offer

### No Prices on the Website

Following Alex Hormozi's playbook: qualify on the call, price based on value of the outcome not cost of delivery. Willing to walk away from people who can't afford it. In the beginning, take early jobs to get feet wet, then scale up pricing aggressively.

Prices are quoted live on the call based on complexity and value. Internal floor is ~$2k for setup, ~$2k/mo for ongoing management.

### 1. AI Opportunity Audit (Free, 30 min)

The discovery/sales call. Framework:
1. Understand their situation — "Tell me about your week. What takes the most time?"
2. Identify the gap — where they are vs. where they want to be
3. Show them the bridge — "Here's what your AI employee would look like"
4. Make the offer — one big number for placement, one big number for monthly management
5. Close on the call

Christian has experience with this format from custom software consulting.

### 2. Placement (One-Time Setup)

**What it is:** We come to your office (or set up remotely) and install your AI employee.

**Deliverables:**
- Hardware: Raspberry Pi, Mac Mini (if iMessage support needed), or managed VPS
- OpenClaw installed, hardened, secured following industry best practices + Christian's own paranoid threat modeling
- Integrated with email, calendar, messaging (Signal or iMessage)
- Custom workflow buildout (scoped on the call — email triage, meeting prep, follow-up drafts, report generation, etc.)
- Integration with business software (CRM, case management, intake systems) — scoped per engagement, may require custom quote for complex integrations
- Training: how to talk to it, how to ask for new things, where the dangerous edges are
- Security walkthrough: "This could absolutely delete all your emails — here are the guardrails"
- 1-week follow-up call included (part of Onboarding)

**The "new employee" onboarding approach:**
- Give it its own email address — don't hand over your credentials
- Start read-only / draft-only — it generates but doesn't send
- Approval flows for anything sensitive
- Escalate access as trust builds — that's where the magic shines
- Treat it like onboarding a human EA

**Why in-person matters:**
- Trust building — handshake, eye contact, real person in DFW
- "You can always unplug it" — the hardware is in your office
- Easier for clients to understand (Paul framed it as "a server in my office")
- Technical reasons: iMessage support requires local Mac, complex integrations may need on-site network access
- DFW business culture is relationship-driven

**Price:** Quoted on call. Floor ~$2k. One number, no line items. Scales with complexity (especially business software integrations).

### 3. Agent Management (Monthly Retainer)

**What it is:** Christian is the ongoing manager of your AI employee.

**Automated (zero hours when running smoothly):**
- Monitoring: auto-detect if the bot stops responding, auto-restart, notify client only if manual intervention needed
- Security patches applied automatically
- Software updates managed via automated scripts
- Remote SSH access for bug fixes without driving out to client site

**Human touch:**
- **Performance Reviews:** Weekly calls at first ("How is it doing? What's working? What do you want it to do better?"), tapering to monthly/as-needed as things stabilize. Client talks to Christian as if he's the manager of their AI employee.
- **Newsletter:** Regular updates to all managed clients — "Here's what's new in OpenClaw, here are ideas for new workflows, here's what other businesses are doing with it"
- **Request hours:** "I want it to do X and I've tried this but it's not working" — included up to tier limit
- **Community access:** Invites to DFW meetups and group calls (these are open to everyone but managed clients get priority)

**Rough tier structure (quoted on call, NOT on website):**
- ~$2k/mo — 2 hrs/month, monthly performance review, monitoring + updates
- ~$4k/mo — 6 hrs/month, weekly performance reviews, priority support
- ~$7.5k/mo — dedicated attention, enhanced security review, compliance support

**Price:** Quoted on call. One number.

### Integration Capabilities

- Anything people can access on a computer, OpenClaw can theoretically access
- Best case: API integration (clean, fast, reliable)
- Worst case: screen control + screen recording (clunky but works)
- Evaluated case-by-case; complex integrations get custom scoped/quoted
- Examples: CRM lookups, case management systems (Clio, MyCase), intake forms, report generation, cross-referencing data from multiple sources

### The "Holy Shit" Moment

The demo should show tasks that require piecing together information from multiple sources:
- "What was the name of the guy I had lunch with last week? Can you schedule a meeting with him for Wednesday or Thursday — I want to talk about the PDF that Lauren just sent me."
- Cross-referencing calendar + email + documents + contacts in one natural language request
- Instant response, 24/7, only getting smarter

### Why Not Just Hire a VA?

- OpenClaw is faster (instant response), more reliable (never calls in sick), and available 24/7
- Already smarter than humans in many ways, and only getting smarter
- Christian is a real person who's been in tech for a decade, plays with these tools all day, knows exactly what they're capable of
- The VA sets up OpenClaw for you; OpenClaw does the actual work

## Terminology

| Concept | Our Term | NOT this |
|---|---|---|
| The initial setup | **Placement** | "Implementation" |
| The monthly retainer | **Agent Management** | "Managed Care" |
| Christian's role | **Agent Manager** | "Account Manager" |
| The weekly/monthly calls | **Performance Reviews** | "Check-ins" |
| The first ~2 weeks of intensive tuning | **Onboarding** | "Hypercare" |
| The free discovery call | **AI Opportunity Audit** | "Strategy Call" |

## Safety & Security Positioning (This Is Our Moat)

- "I'm fanatical about security" — lead with this
- Runs on YOUR hardware (or a VPS you control) — not some SaaS black box
- Follows OpenClaw hardening guide + Christian's own paranoid additions
- Onboarded like a new employee: starts with read-only, drafts not sends, approval flows
- Own email address so you're not handing over your credentials
- You can literally unplug it
- In-person setup means you've looked me in the eye and shaken my hand
- Main guardrail unique to on-prem: if it's on a computer in your office, you can always just unplug it

## Brand

- **Company:** OpenClaw DFW
- **Person:** Christian Genco — face on the website, personal X account (@cgenco), personal site (christian.gen.co)
- **Positioning:** "Built my own AI assistant before OpenClaw existed. Been in tech for a decade. I show up in person."
- **Doesn't shy away from:** posting face, X profile, personal credibility on the site
- **For now:** using personal X account, not a separate brand account

## The Funnel

```
Content (X, Reddit, Google Ads, blog posts, PDF lead magnets)
    ↓
Website (no prices, builds trust, captures emails, CTA = book a call)
    ↓
AI Opportunity Audit (30-min free call, close on the call)
    ↓
Placement (one-time setup, in-person or remote)
    ↓
Agent Management (monthly retainer, performance reviews, community)
```

### Content Strategy
- Publish everything — thinking out loud about AI assistants, OpenClaw, automation
- Blog posts / articles on the site
- PDF lead magnets gated behind email capture (e.g., "5 Tasks Your AI Executive Assistant Can Take Over This Week")
- X posts (personal account @cgenco)
- Reddit posts in relevant communities
- Google Ads geo-fenced to DFW for intent keywords

### Community (Marketing Play, Not Paid)
- DFW AI Executive Assistant meetups (monthly at a co-working space)
- Group calls among Dallas businesses with OpenClaw installations
- Open to everyone including prospects — retention tool AND lead gen machine
- Managed clients get priority / VIP treatment at events

## Capacity & Scaling

- Christian can handle initial clients solo
- Has local people he can hire if things get busy
- At $2k–$7.5k/mo per client, doesn't need many clients to make this work
- Goal: book first call this week, first paying client this month

## Contact / CAN-SPAM Address

Christian Genco · 2028 E Ben White Blvd #240-8529, Austin TX 78741

## Domains (Purchased)

All registered on Namecheap, expiring Feb 10, 2027.

**Primary domain:** `openclawdfw.com` (deployed on Vercel)
**Fallback brand:** `dfwclaw.com` (short/memorable, swap to primary if needed)

| # | Domain | Role |
|---|--------|------|
| 1 | `openclawdfw.com` | **Primary** — Vercel deployment |
| 2 | `dfwclaw.com` | Alias → 301 redirect to primary |
| 3 | `clawdallas.com` | Alias → 301 redirect to primary |
| 4 | `clawdfw.com` | Alias → 301 redirect to primary |
| 5 | `openclawdallas.com` | Alias → 301 redirect to primary |
| 6 | `openclawtx.com` | Alias → 301 redirect to primary |
| 7 | `setupclawdallas.com` | Alias → 301 redirect to primary |
| 8 | `setupclawdfw.com` | Alias → 301 redirect to primary |
