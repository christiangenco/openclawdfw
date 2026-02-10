/**
 * Step 0: Welcome email with PDF download link.
 * Sent immediately after double opt-in confirmation.
 */

import { emailLayout, textFooter } from "./layout";

const PLAYBOOK_URL = "https://openclawdfw.com/playbook.pdf";

export function welcomeEmail({
  unsubscribeUrl,
}: {
  unsubscribeUrl: string;
}) {
  const subject = "Your AI Employee Playbook is ready";

  const html = emailLayout({
    preheader: "Download your free AI Employee Playbook.",
    unsubscribeUrl,
    body: `
      <h1>Your playbook is ready 🎉</h1>
      <p>Hey! I'm Christian from OpenClaw DFW. Thanks for confirming — here's your download:</p>
      <p style="text-align: center;">
        <a href="${PLAYBOOK_URL}" class="cta-button">Download the Playbook (PDF) →</a>
      </p>
      <p>It covers 87 ways your AI employee can work for you — organized by department, with Dallas-specific examples. Keep it on your desk and scan it whenever you're wondering "could the AI do this?"</p>
      <p>Over the next couple of weeks, I'll send you a few quick emails about how DFW business owners are using AI employees to get 10+ hours/week back. If that's not your thing, unsubscribe anytime — no hard feelings.</p>
      <p>— Christian</p>
    `,
  });

  const text = `Your playbook is ready!

Hey! I'm Christian from OpenClaw DFW. Thanks for confirming — here's your download:

${PLAYBOOK_URL}

It covers 87 ways your AI employee can work for you — organized by department, with Dallas-specific examples. Keep it on your desk and scan it whenever you're wondering "could the AI do this?"

Over the next couple of weeks, I'll send you a few quick emails about how DFW business owners are using AI employees to get 10+ hours/week back. If that's not your thing, unsubscribe anytime — no hard feelings.

— Christian${textFooter(unsubscribeUrl)}`;

  return { subject, html, text };
}
