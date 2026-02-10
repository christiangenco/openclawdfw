import Mailgun from "mailgun.js";
import FormData from "form-data";

let client: ReturnType<Mailgun["client"]> | null = null;

function getClient() {
  if (!client) {
    const mailgun = new Mailgun(FormData);
    client = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY!,
    });
  }
  return client;
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  const mg = getClient();
  const domain = process.env.MAILGUN_DOMAIN!;
  const from = process.env.MAILGUN_FROM!;

  return mg.messages.create(domain, {
    from,
    to: [to],
    subject,
    html,
    text,
  });
}
