/**
 * Shared email layout wrapper. All emails get consistent branding,
 * CAN-SPAM footer with physical address, and unsubscribe link.
 */

const PHYSICAL_ADDRESS = "2028 E Ben White Blvd #240-8529, Austin TX 78741";

export function emailLayout({
  preheader,
  body,
  unsubscribeUrl,
}: {
  preheader: string;
  body: string;
  unsubscribeUrl: string;
}): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OpenClaw DFW</title>
  <style>
    body { margin: 0; padding: 0; background: #111; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 32px 20px; }
    .header { text-align: center; padding-bottom: 24px; border-bottom: 1px solid #333; margin-bottom: 24px; }
    .header a { color: #f3f4f6; text-decoration: none; font-size: 18px; font-weight: 700; }
    .header .accent { color: #ef4444; }
    .header .dim { color: #6b7280; font-weight: 600; }
    .content { color: #d1d5db; font-size: 16px; line-height: 1.6; }
    .content h1, .content h2 { color: #f3f4f6; }
    .content a { color: #ef4444; }
    .cta-button { display: inline-block; background: #ef4444; color: #fff !important; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #333; color: #6b7280; font-size: 13px; text-align: center; line-height: 1.5; }
    .footer a { color: #6b7280; }
    .preheader { display: none !important; max-height: 0; overflow: hidden; mso-hide: all; }
  </style>
</head>
<body>
  <div class="preheader">${preheader}</div>
  <div class="wrapper">
    <div class="header">
      <a href="https://openclawdfw.com">Open<span class="accent">Claw</span> <span class="dim">DFW</span></a>
    </div>
    <div class="content">
      ${body}
    </div>
    <div class="footer">
      <p>OpenClaw DFW · ${PHYSICAL_ADDRESS}</p>
      <p><a href="${unsubscribeUrl}">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Plain text footer for text-only emails.
 */
export function textFooter(unsubscribeUrl: string): string {
  return `\n\n---\nOpenClaw DFW · ${PHYSICAL_ADDRESS}\nUnsubscribe: ${unsubscribeUrl}`;
}
