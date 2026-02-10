# Security Guide Lead Magnet / Blog Post

## Purpose

Establish Christian / OpenClaw DFW as "the paranoid security guy" in the OpenClaw space. This is the credibility piece that handles the #1 buyer objection ("is this safe?") and positions the managed service as the secure choice.

## Title Options

- "The OpenClaw Security Checklist: What Your IT Team Needs to See Before Approving Your AI Employee"
- "How to Secure Your AI Employee: The OpenClaw Hardening Guide for Business Owners"
- "OpenClaw Security for the Paranoid: A Business Owner's Guide"

## Format

**Ungated blog post** (not a PDF lead magnet) — the goal is credibility, not email capture. This piece says "I know security cold, hire me to do it right."

Could also be a secondary PDF for IT/CISO types who want to download and share internally.

## Content Outline

### 1. Why Security Matters for AI Assistants
- This thing has access to your email, calendar, passwords, files
- One misconfiguration = data breach, shadow AI flag from IT, or worse
- The Gary Marcus / XDA "please stop using OpenClaw" critiques are about this

### 2. The Threat Model
- What could go wrong? (prompt injection, credential exposure, unauthorized access)
- Who are you protecting against? (external attackers, internal mistakes, AI hallucinations)

### 3. The 10-Point Hardening Checklist
Pull from official OpenClaw security docs + Christian's own paranoid additions:

1. **DM pairing policy** — never use `open` mode
2. **Loopback-only gateway binding** — no external network access to admin
3. **Gateway authentication** — token/password, fail-closed
4. **File permissions** — 700 dirs, 600 configs
5. **Per-agent sandboxing** — scope workspace access and tool permissions
6. **Credential management** — env vars, never prompts; redact from logs
7. **Plugin auditing** — explicit allowlists, pinned versions
8. **Prompt injection mitigations** — mention gating, tool blast radius, reader agents
9. **mDNS/Bonjour** — disable or minimize network discovery
10. **Log redaction** — PII filtering, retention policies

### 4. The "New Employee" Onboarding Model
- Give it its own email address (don't hand over your credentials)
- Start read-only / draft-only
- Approval flows for sensitive actions
- Escalate access as trust builds
- Treat it like onboarding a human EA

### 5. The Security Audit
- `openclaw security audit --deep`
- What it checks
- How to interpret results
- VirusTotal partnership for skill scanning

### 6. Why In-Person Setup Matters for Security
- You can literally unplug it
- Hardware in your office vs. SaaS black box
- Eye contact, handshake, trust
- DFW business culture is relationship-driven

### 7. CTA
- "Want this done right? Book a free AI Opportunity Audit"
- Link to /book

## Sources

- `content/docs/security-raw.txt` — official hardening guide
- `content/docs/start-security.txt` — security quickstart
- `content/articles/innfactory-security.txt` — balanced security analysis
- `content/articles/gary-marcus-critique.txt` — the skeptic view (know the objections)
- `content/articles/zeroleaks-analysis.pdf` — 14-page security analysis
- `content/articles/openclaw-blog-virustotal-raw.txt` — VirusTotal partnership

## Dallas Angle

- "In Dallas, we do business on a handshake. That's why I show up in person."
- Reference DFW's relationship-driven business culture
- Contrast with remote-only SaaS providers

## Execution

- [ ] Read all security source docs
- [ ] Draft the blog post
- [ ] Add to site at /blog/security-guide or /security
- [ ] Optionally create PDF version for IT/CISO download
