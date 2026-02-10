import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendEmail } from "@/lib/mailgun";
import { unsubscribeUrl } from "@/lib/unsubscribe";
import { DRIP_SEQUENCE, TOTAL_DRIP_STEPS } from "@/lib/emails/drip";

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sends this as Authorization: Bearer <secret>)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sql = getDb();

    // Find subscribers who are due for their next drip email
    const subscribers = await sql`
      SELECT id, email, drip_step
      FROM subscribers
      WHERE status = 'active'
        AND drip_step < ${TOTAL_DRIP_STEPS}
        AND drip_next_at <= NOW()
      LIMIT 50
    `;

    let sent = 0;
    let errors = 0;

    for (const sub of subscribers) {
      try {
        const step = DRIP_SEQUENCE[sub.drip_step];
        if (!step) {
          // No more steps — mark as complete
          await sql`
            UPDATE subscribers
            SET drip_next_at = NULL
            WHERE id = ${sub.id}
          `;
          continue;
        }

        const unsub = unsubscribeUrl(sub.email);
        const { subject, html, text } = step.email({ unsubscribeUrl: unsub });

        await sendEmail({ to: sub.email, subject, html, text });

        // Advance to next step
        const nextStep = sub.drip_step + 1;
        const nextDelay = DRIP_SEQUENCE[nextStep]?.delayDays;

        if (nextStep >= TOTAL_DRIP_STEPS || nextDelay === undefined) {
          // Drip sequence complete
          await sql`
            UPDATE subscribers
            SET drip_step = ${nextStep},
                drip_next_at = NULL
            WHERE id = ${sub.id}
          `;
        } else {
          await sql`
            UPDATE subscribers
            SET drip_step = ${nextStep},
                drip_next_at = NOW() + (${nextDelay} || ' days')::interval
            WHERE id = ${sub.id}
          `;
        }

        sent++;
      } catch (err) {
        console.error(`Drip error for subscriber ${sub.id}:`, err);
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      processed: subscribers.length,
      sent,
      errors,
    });
  } catch (error) {
    console.error("Drip cron error:", error);
    return NextResponse.json(
      { error: "Drip cron failed" },
      { status: 500 }
    );
  }
}
