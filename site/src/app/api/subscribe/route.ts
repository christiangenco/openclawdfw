import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendEmail } from "@/lib/mailgun";
import { confirmUrl, unsubscribeUrl } from "@/lib/unsubscribe";
import { confirmationEmail } from "@/lib/emails/confirmation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, lead_magnet } = body as {
      email?: string;
      name?: string;
      lead_magnet?: string;
    };

    // Validate
    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const magnet = lead_magnet || "checklist";

    const sql = getDb();

    // Upsert: if they already exist and are active/confirmed, don't re-send.
    // If they exist but are pending, re-send confirmation.
    // If they exist but unsubscribed, reactivate as pending.
    const rows = await sql`
      INSERT INTO subscribers (email, name, lead_magnet, status, drip_step, drip_next_at)
      VALUES (${normalizedEmail}, ${name || null}, ${magnet}, 'pending', 0, NULL)
      ON CONFLICT (email) DO UPDATE SET
        name = COALESCE(EXCLUDED.name, subscribers.name),
        lead_magnet = EXCLUDED.lead_magnet,
        status = CASE
          WHEN subscribers.status = 'active' THEN 'active'
          ELSE 'pending'
        END,
        drip_step = CASE
          WHEN subscribers.status = 'active' THEN subscribers.drip_step
          ELSE 0
        END,
        drip_next_at = CASE
          WHEN subscribers.status = 'active' THEN subscribers.drip_next_at
          ELSE NULL
        END,
        unsubscribed_at = CASE
          WHEN subscribers.status = 'active' THEN subscribers.unsubscribed_at
          ELSE NULL
        END
      RETURNING id, status
    `;

    const subscriber = rows[0];

    // If already active (confirmed), no need to re-send confirmation
    if (subscriber.status === "active") {
      return NextResponse.json({
        success: true,
        message: "You're already subscribed! Check your inbox for the checklist.",
        already_subscribed: true,
      });
    }

    // Send double opt-in confirmation email
    const confirm = confirmUrl(normalizedEmail);
    const unsub = unsubscribeUrl(normalizedEmail);
    const { subject, html, text } = confirmationEmail({
      confirmUrl: confirm,
      unsubscribeUrl: unsub,
    });

    await sendEmail({ to: normalizedEmail, subject, html, text });

    return NextResponse.json({
      success: true,
      message: "Check your email to confirm your subscription!",
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Subscribe error:", msg);
    console.error("Subscribe stack:", error instanceof Error ? error.stack : "no stack");
    return NextResponse.json(
      { error: "Something went wrong. Please try again.", debug: msg },
      { status: 500 }
    );
  }
}
