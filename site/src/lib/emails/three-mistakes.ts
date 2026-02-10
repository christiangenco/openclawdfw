/**
 * Step 1: "The 3 mistakes that kill most OpenClaw setups"
 * Sent 2 days after welcome.
 */

import { emailLayout, textFooter } from "./layout";

export function threeMistakesEmail({
  unsubscribeUrl,
}: {
  unsubscribeUrl: string;
}) {
  const subject = "Most OpenClaw installs break within a week — here's why";

  const html = emailLayout({
    preheader: "Three mistakes that kill most OpenClaw setups (and how to avoid them).",
    unsubscribeUrl,
    body: `
      <h1>3 mistakes that kill most OpenClaw setups</h1>
      <p>I've seen a pattern with founders who try to set up OpenClaw themselves. Most installs break within the first week — and it's almost always one of these three things:</p>

      <h2>1. Skipping security hardening</h2>
      <p>The default install works, but it's not production-ready. Without hardening (DM pairing policies, gateway auth, sandboxing), your IT team flags it as shadow AI and kills it. Or worse — it's actually insecure.</p>

      <h2>2. Not building workflows</h2>
      <p>Without custom workflows, OpenClaw is just another chat window. The magic happens when it's <em>proactively</em> triaging your inbox, prepping meeting briefs, and drafting follow-ups — not waiting for you to ask.</p>

      <h2>3. No ongoing maintenance</h2>
      <p>Model updates break prompts. Workflows drift. API tokens expire. Without someone checking in regularly, the whole thing quietly degrades until you stop using it.</p>

      <p>Each of these is fixable — and they're exactly what we handle during setup and managed care.</p>

      <p>If any of this sounds familiar, just reply to this email. I read every one.</p>

      <p>— Christian</p>
    `,
  });

  const text = `3 mistakes that kill most OpenClaw setups

I've seen a pattern with founders who try to set up OpenClaw themselves. Most installs break within the first week — and it's almost always one of these three things:

1. SKIPPING SECURITY HARDENING
The default install works, but it's not production-ready. Without hardening, your IT team flags it as shadow AI and kills it.

2. NOT BUILDING WORKFLOWS
Without custom workflows, OpenClaw is just another chat window. The magic happens when it's proactively triaging your inbox, prepping briefs, and drafting follow-ups.

3. NO ONGOING MAINTENANCE
Model updates break prompts. Workflows drift. API tokens expire. Without regular check-ins, the whole thing quietly degrades.

Each of these is fixable — and they're exactly what we handle during setup and managed care.

If any of this sounds familiar, just reply to this email. I read every one.

— Christian${textFooter(unsubscribeUrl)}`;

  return { subject, html, text };
}
