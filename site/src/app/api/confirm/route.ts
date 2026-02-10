import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyToken, unsubscribeUrl } from "@/lib/unsubscribe";
import { sendEmail } from "@/lib/mailgun";
import { welcomeEmail } from "@/lib/emails/welcome";
import { DRIP_SEQUENCE } from "@/lib/emails/drip";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  if (!email || !token) {
    return htmlResponse("Invalid Link", "This confirmation link is invalid or expired.", 400);
  }

  if (!verifyToken(email, token)) {
    return htmlResponse("Invalid Link", "This confirmation link is invalid or expired.", 400);
  }

  try {
    const sql = getDb();

    // Calculate when to send step 1 (2 days from now)
    const nextStepDelay = DRIP_SEQUENCE[1]?.delayDays ?? 2;

    // Activate the subscriber and set up drip
    const rows = await sql`
      UPDATE subscribers
      SET status = 'active',
          confirmed_at = NOW(),
          drip_step = 1,
          drip_next_at = NOW() + (${nextStepDelay} || ' days')::interval
      WHERE email = ${email} AND status = 'pending'
      RETURNING id, email
    `;

    if (rows.length === 0) {
      // Already confirmed or doesn't exist
      return htmlResponse(
        "Already Confirmed",
        "Your email is already confirmed! Check your inbox for the checklist.",
        200
      );
    }

    // Send welcome email (step 0) immediately
    const unsub = unsubscribeUrl(email);
    const { subject, html, text } = welcomeEmail({ unsubscribeUrl: unsub });
    await sendEmail({ to: email, subject, html, text });

    return htmlResponse(
      "Email Confirmed! 🎉",
      "Thanks for confirming! Your OpenClaw Deployment Checklist is on the way — check your inbox.",
      200
    );
  } catch (error) {
    console.error("Confirm error:", error);
    return htmlResponse("Error", "Something went wrong. Please try again.", 500);
  }
}

function htmlResponse(title: string, message: string, status: number) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — OpenClaw DFW</title>
  <style>
    body { margin: 0; padding: 0; background: #111; color: #d1d5db; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { max-width: 480px; padding: 48px 32px; text-align: center; }
    h1 { color: #f3f4f6; font-size: 24px; margin-bottom: 16px; }
    p { font-size: 16px; line-height: 1.6; }
    a { color: #ef4444; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .home-link { display: inline-block; margin-top: 24px; padding: 12px 28px; background: #ef4444; color: #fff; border-radius: 8px; font-weight: 600; }
    .home-link:hover { background: #dc2626; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="https://openclawdfw.com" class="home-link">Back to OpenClaw DFW</a>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status,
    headers: { "Content-Type": "text/html" },
  });
}
