/**
 * Step 2: "From 200 unread emails to inbox zero"
 * Sent 5 days after welcome.
 */

import { emailLayout, textFooter } from "./layout";

const BOOK_URL = "https://openclawdfw.com/book";

export function inboxZeroEmail({
  unsubscribeUrl,
}: {
  unsubscribeUrl: string;
}) {
  const subject = "From 200 unread emails to inbox zero — automatically";

  const html = emailLayout({
    preheader: "What one founder's inbox looks like after OpenClaw.",
    unsubscribeUrl,
    body: `
      <h1>What inbox zero actually looks like</h1>
      <p>Here's a typical morning for a founder running OpenClaw:</p>

      <p><strong>7:00 AM</strong> — Your phone buzzes with a morning briefing via WhatsApp. Three meetings today: one investor call, one product review, one 1:1 with your head of sales. OpenClaw already pulled context from prior email threads for each one.</p>

      <p><strong>7:15 AM</strong> — You open your inbox. Instead of 200 unread messages, you see 12. OpenClaw already handled the routine stuff overnight: auto-drafted replies to scheduling requests, categorized newsletters, flagged the two messages that actually need your brain.</p>

      <p><strong>7:30 AM</strong> — You review the drafted replies, approve them with one click each, and you're done. Inbox zero before your first coffee.</p>

      <p>One early user cleared <strong>6,000 emails on day one</strong>. That's not a typo.</p>

      <p>Want to see what this would look like for your inbox?</p>

      <p style="text-align: center;">
        <a href="${BOOK_URL}" class="cta-button">Book a Free Strategy Call →</a>
      </p>

      <p>— Christian</p>
    `,
  });

  const text = `What inbox zero actually looks like

Here's a typical morning for a founder running OpenClaw:

7:00 AM — Your phone buzzes with a morning briefing via WhatsApp. Three meetings today. OpenClaw already pulled context from prior email threads for each one.

7:15 AM — You open your inbox. Instead of 200 unread messages, you see 12. OpenClaw handled the routine stuff overnight: auto-drafted replies, categorized newsletters, flagged the two messages that need your brain.

7:30 AM — You review the drafted replies, approve them with one click each, and you're done. Inbox zero before your first coffee.

One early user cleared 6,000 emails on day one. That's not a typo.

Want to see what this would look like for your inbox?

Book a free strategy call: ${BOOK_URL}

— Christian${textFooter(unsubscribeUrl)}`;

  return { subject, html, text };
}
