/**
 * Double opt-in confirmation email (sent immediately on subscribe).
 * Subscriber must click the confirm link before receiving the welcome
 * email or any drip emails.
 */

import { emailLayout, textFooter } from "./layout";

export function confirmationEmail({
  confirmUrl,
  unsubscribeUrl,
}: {
  confirmUrl: string;
  unsubscribeUrl: string;
}) {
  const subject = "Confirm your email to get the OpenClaw checklist";

  const html = emailLayout({
    preheader: "One click to confirm, then your checklist is on the way.",
    unsubscribeUrl,
    body: `
      <h1>Almost there!</h1>
      <p>Thanks for signing up. Please confirm your email address so I can send you the <strong>27-step OpenClaw Deployment Checklist</strong>.</p>
      <p style="text-align: center;">
        <a href="${confirmUrl}" class="cta-button">Confirm My Email →</a>
      </p>
      <p style="color: #9ca3af; font-size: 14px;">If you didn't sign up at OpenClaw DFW, you can safely ignore this email.</p>
    `,
  });

  const text = `Almost there!

Thanks for signing up. Please confirm your email address so I can send you the 27-step OpenClaw Deployment Checklist.

Confirm here: ${confirmUrl}

If you didn't sign up at OpenClaw DFW, you can safely ignore this email.${textFooter(unsubscribeUrl)}`;

  return { subject, html, text };
}
