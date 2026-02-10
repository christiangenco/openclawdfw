/**
 * Drip sequence configuration.
 * Maps each step to its email template and the delay (in days)
 * before the *next* step fires.
 *
 * Step 0 (welcome) is sent immediately on confirmation.
 * Steps 1–4 are sent by the cron job.
 */

import { welcomeEmail } from "./welcome";
import { threeMistakesEmail } from "./three-mistakes";
import { inboxZeroEmail } from "./inbox-zero";
import { securityEmail } from "./security";
import { bookCallEmail } from "./book-call";

export interface DripStep {
  /** Days after the previous step to send this email */
  delayDays: number;
  /** Generate the email content */
  email: (params: { unsubscribeUrl: string }) => {
    subject: string;
    html: string;
    text: string;
  };
}

export const DRIP_SEQUENCE: DripStep[] = [
  { delayDays: 0, email: welcomeEmail },       // step 0: immediate on confirm
  { delayDays: 2, email: threeMistakesEmail },  // step 1: +2 days
  { delayDays: 3, email: inboxZeroEmail },      // step 2: +3 days (day 5 total)
  { delayDays: 3, email: securityEmail },       // step 3: +3 days (day 8 total)
  { delayDays: 4, email: bookCallEmail },       // step 4: +4 days (day 12 total)
];

export const TOTAL_DRIP_STEPS = DRIP_SEQUENCE.length;
