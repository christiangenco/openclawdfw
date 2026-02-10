/**
 * Step 4: "Ready to stop managing your inbox?"
 * Sent 12 days after welcome. Final email in the drip sequence.
 */

import { emailLayout, textFooter } from "./layout";

const BOOK_URL = "https://openclawdfw.com/book";

export function bookCallEmail({
  unsubscribeUrl,
}: {
  unsubscribeUrl: string;
}) {
  const subject = "Let's get you set up this week";

  const html = emailLayout({
    preheader: "Ready to stop managing your inbox? Let's get OpenClaw running for you.",
    unsubscribeUrl,
    body: `
      <h1>Ready to get your time back?</h1>
      <p>Over the last couple weeks, I've shared how OpenClaw can:</p>

      <ul>
        <li>Take you from 200 unread emails to inbox zero — automatically</li>
        <li>Prep meeting briefs, draft follow-ups, and manage your calendar</li>
        <li>Run securely on your own hardware, passing IT/CISO review</li>
      </ul>

      <p>If you're in Dallas/Fort Worth, I'll come to your office to set everything up in person. You go live the same day, and I'm on Slack with you for 14 days of hypercare to make sure everything sticks.</p>

      <p>Remote setup is available too if you're outside DFW.</p>

      <p>I take on 2–3 new clients per month in DFW. If you've been thinking about this, let's find a time to talk.</p>

      <p style="text-align: center;">
        <a href="${BOOK_URL}" class="cta-button">Book Your Free 30-Min Strategy Call →</a>
      </p>

      <p>No pressure, no pitch deck. Just a conversation about your workflow and whether OpenClaw is a good fit.</p>

      <p>— Christian</p>
    `,
  });

  const text = `Ready to get your time back?

Over the last couple weeks, I've shared how OpenClaw can:

• Take you from 200 unread emails to inbox zero — automatically
• Prep meeting briefs, draft follow-ups, and manage your calendar
• Run securely on your own hardware, passing IT/CISO review

If you're in Dallas/Fort Worth, I'll come to your office to set everything up in person. You go live the same day, and I'm on Slack with you for 14 days of hypercare.

Remote setup is available too if you're outside DFW.

I take on 2-3 new clients per month in DFW. If you've been thinking about this, let's find a time to talk.

Book your free 30-min strategy call: ${BOOK_URL}

No pressure, no pitch deck. Just a conversation about your workflow and whether OpenClaw is a good fit.

— Christian${textFooter(unsubscribeUrl)}`;

  return { subject, html, text };
}
