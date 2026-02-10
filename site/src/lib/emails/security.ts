/**
 * Step 3: "The security question your IT team will ask"
 * Sent 8 days after welcome.
 */

import { emailLayout, textFooter } from "./layout";

const BOOK_URL = "https://openclawdfw.com/book";

export function securityEmail({
  unsubscribeUrl,
}: {
  unsubscribeUrl: string;
}) {
  const subject = "Your IT team is going to ask about this";

  const html = emailLayout({
    preheader: "How OpenClaw passes your CISO's security review.",
    unsubscribeUrl,
    body: `
      <h1>Your IT team is going to ask about this</h1>
      <p>If you're at a company with an IT team (or even just a security-conscious co-founder), the first thing they'll say when you mention an AI assistant is:</p>

      <p><em>"Where does the data go?"</em></p>

      <p>Fair question. Here's why OpenClaw is different from every other AI tool:</p>

      <ul>
        <li><strong>It runs on your hardware.</strong> Your emails, calendar, and documents never leave your network (except for model API calls, which you control).</li>
        <li><strong>It follows an official hardening guide.</strong> 10-point security checklist covering sandboxing, credential management, gateway auth, and more.</li>
        <li><strong>It has a built-in security audit.</strong> Run <code>openclaw security audit --deep</code> anytime. It checks for misconfigurations, exposed credentials, and policy violations.</li>
        <li><strong>It passes CISO review.</strong> We provide the audit report as part of every deployment.</li>
      </ul>

      <p>We handle all of this during setup — and your IT team gets the audit report showing everything is locked down.</p>

      <p style="text-align: center;">
        <a href="${BOOK_URL}" class="cta-button">Book a Call — Let's Talk Security →</a>
      </p>

      <p>— Christian</p>
    `,
  });

  const text = `Your IT team is going to ask about this

If you're at a company with an IT team, the first thing they'll say when you mention an AI assistant is: "Where does the data go?"

Fair question. Here's why OpenClaw is different:

• It runs on your hardware. Your emails, calendar, and documents never leave your network.
• It follows an official hardening guide. 10-point security checklist.
• It has a built-in security audit. Run "openclaw security audit --deep" anytime.
• It passes CISO review. We provide the audit report with every deployment.

We handle all of this during setup — and your IT team gets the audit report.

Book a call to talk security: ${BOOK_URL}

— Christian${textFooter(unsubscribeUrl)}`;

  return { subject, html, text };
}
