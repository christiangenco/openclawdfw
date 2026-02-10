/**
 * Step 0: Welcome email with PDF download link.
 * Sent immediately after double opt-in confirmation.
 */

import { emailLayout, textFooter } from "./layout";

const CHECKLIST_URL = "https://openclawdfw.com/checklist.pdf";

export function welcomeEmail({
  unsubscribeUrl,
}: {
  unsubscribeUrl: string;
}) {
  const subject = "Your 27-step OpenClaw checklist is ready";

  const html = emailLayout({
    preheader: "Download your free OpenClaw deployment checklist.",
    unsubscribeUrl,
    body: `
      <h1>Your checklist is ready 🎉</h1>
      <p>Hey! I'm Christian from OpenClaw DFW. Thanks for confirming — here's your download:</p>
      <p style="text-align: center;">
        <a href="${CHECKLIST_URL}" class="cta-button">Download the Checklist (PDF) →</a>
      </p>
      <p>It covers 27 steps across pre-deployment, installation, security hardening, integration, go-live, and ongoing maintenance. It's everything you need for a production-ready OpenClaw setup.</p>
      <p>Over the next couple of weeks, I'll send you a few quick emails about how DFW founders are using OpenClaw to get 10+ hours/week back. If that's not your thing, unsubscribe anytime — no hard feelings.</p>
      <p>— Christian</p>
    `,
  });

  const text = `Your checklist is ready!

Hey! I'm Christian from OpenClaw DFW. Thanks for confirming — here's your download:

${CHECKLIST_URL}

It covers 27 steps across pre-deployment, installation, security hardening, integration, go-live, and ongoing maintenance. It's everything you need for a production-ready OpenClaw setup.

Over the next couple of weeks, I'll send you a few quick emails about how DFW founders are using OpenClaw to get 10+ hours/week back. If that's not your thing, unsubscribe anytime — no hard feelings.

— Christian${textFooter(unsubscribeUrl)}`;

  return { subject, html, text };
}
