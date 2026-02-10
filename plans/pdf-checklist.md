# PDF Lead Magnet: "The OpenClaw Deployment Checklist"

## Title
**The OpenClaw Deployment Checklist: 27 Steps to a Secure, Production-Ready AI Executive Assistant**

## Format
- Clean, single-column PDF (letter size)
- Branded header with OpenClaw DFW logo/name
- Numbered checklist with checkbox squares
- Each item: 1–2 sentence description + why it matters
- Footer on every page: "Need help? Book a free strategy call → openclawdfw.com/book"
- Final page: about OpenClaw DFW + CTA

## Sections & Items

### Pre-Deployment (Steps 1–5)
1. **Choose your hardware** — Mac Mini M4 ($600) or existing server. Minimum 16GB RAM recommended.
2. **Verify network requirements** — Static IP or dynamic DNS, port availability, firewall rules.
3. **Select your model provider** — Anthropic, OpenAI, or local models. Each has tradeoffs (cost, speed, privacy).
4. **Inventory your tools** — List every email account, calendar, messaging app, and CRM that needs integration.
5. **Identify your first 3 workflows** — Pick the highest-ROI automations (inbox triage, meeting prep, follow-ups).

### Installation (Steps 6–9)
6. **Run the one-liner installer** — `curl -fsSL https://openclaw.ai/install | sh`
7. **Complete the onboarding wizard** — Set identity, timezone, model provider API keys.
8. **Configure the daemon** — Set OpenClaw to start on boot, configure restart policies.
9. **Verify the install** — Run `openclaw status` and confirm all services are healthy.

### Security Hardening (Steps 10–19)
10. **Set DM pairing policy to `pairing`** — Never use `open` mode in production.
11. **Bind gateway to loopback only** — Prevent external network access to the admin interface.
12. **Enable gateway authentication** — Token or password auth, fail-closed by default.
13. **Lock file permissions** — 700 on directories, 600 on config files.
14. **Configure per-agent sandboxing** — Scope each agent's workspace access and tool permissions.
15. **Set up credential management** — Use environment variables, never prompt-based. Redact from logs.
16. **Audit and pin plugins** — Explicit allowlists, pinned versions, no auto-update.
17. **Enable prompt injection mitigations** — Mention gating, tool blast radius limits, reader agent isolation.
18. **Disable or minimize mDNS/Bonjour** — Prevent network service discovery disclosure.
19. **Configure log redaction** — Enable PII redaction, set transcript retention policy.

### Integration (Steps 20–23)
20. **Connect email** — Gmail (OAuth2) or Outlook (Graph API). Test send/receive/draft.
21. **Connect calendar** — Google Calendar or Outlook. Verify read/write/create permissions.
22. **Connect messaging** — WhatsApp, Telegram, Slack, or iMessage. Test bidirectional messaging.
23. **Connect CRM / other tools** — Salesforce, HubSpot, Notion, etc. as needed.

### Go-Live (Steps 24–26)
24. **Run the security audit** — `openclaw security audit --deep` and resolve all findings.
25. **Test each workflow end-to-end** — Send test emails, create test calendar events, trigger each automation.
26. **Set up monitoring** — Configure alerts for agent failures, unusual activity, or resource exhaustion.

### Ongoing (Step 27)
27. **Schedule recurring maintenance** — Weekly: check logs, review agent performance. Monthly: apply updates, run security audit, check for prompt drift.

## Production Notes
- Tool: Create with Typst (programmatic, version-controlled) or export from a well-formatted Google Doc
- Host at: `site/public/checklist.pdf`
- Download URL: `https://openclawdfw.com/checklist.pdf`
- For now: placeholder PDF with cover page + "Full checklist coming soon" message

## Design Guidelines
- Dark background matching site theme (gray-900) or clean white for print-friendliness
- Red (#ef4444) accent color matching site brand
- Include OpenClaw DFW branding at top
- Every page includes the CTA URL
- Final page: "This checklist covers the basics. For a production-grade deployment with custom workflows, security hardening, and ongoing managed care, book a free strategy call with Christian."
