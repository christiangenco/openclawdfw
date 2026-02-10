import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — OpenClaw DFW",
  description:
    "How OpenClaw DFW collects, uses, and safeguards your information.",
};

export default function PrivacyPolicy() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/"
        className="text-sm text-red-500 hover:text-red-400"
      >
        ← Back
      </Link>

      <article className="prose prose-invert mt-8 max-w-none prose-headings:text-gray-100 prose-p:text-gray-300 prose-li:text-gray-300 prose-a:text-red-500 hover:prose-a:text-red-400 prose-strong:text-gray-200">
        <h1>Privacy Policy</h1>
        <p>Last updated: February 10, 2026</p>

        <h2>1. About This Policy</h2>
        <p>
          OpenClaw DFW (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;) is committed to protecting your privacy. This
          policy describes the types of information we collect through our
          website (openclawdfw.com) and our deployment services, how that
          information is used, and the steps we take to keep it safe.
        </p>

        <h2>2. What We Collect</h2>
        <p>We may gather the following categories of information:</p>
        <ul>
          <li>
            <strong>Scheduling details:</strong> Your name, email, phone number,
            and preferred appointment times submitted through our booking system
            (Calendly).
          </li>
          <li>
            <strong>Payment data:</strong> Billing information processed by
            Stripe. We never store credit-card numbers on our own servers.
          </li>
          <li>
            <strong>Deployment details:</strong> Network credentials, account
            information, and device specs shared with us solely for the purpose
            of installing and configuring OpenClaw.
          </li>
          <li>
            <strong>Site analytics:</strong> Aggregated, anonymous traffic data
            collected via Vercel Analytics to help us understand how visitors
            interact with the site.
          </li>
          <li>
            <strong>Support messages:</strong> Any correspondence you send us
            through email, text, Slack, or social media during hypercare or a
            Managed Care engagement.
          </li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <ul>
          <li>Scheduling and carrying out your deployment appointment.</li>
          <li>Processing payments for services rendered.</li>
          <li>
            Delivering post-deployment support during the hypercare window and
            any active Managed Care plan.
          </li>
          <li>
            Communicating with you about your engagement, including status
            updates and follow-ups.
          </li>
          <li>Improving our website and refining our service offerings.</li>
        </ul>
        <p>
          We do not sell, rent, or otherwise share your personal information with
          third parties for their own marketing.
        </p>

        <h2>4. Third-Party Services</h2>
        <p>We rely on the following external platforms:</p>
        <ul>
          <li>
            <strong>Stripe</strong> — payment processing (
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe Privacy Policy
            </a>
            ).
          </li>
          <li>
            <strong>Calendly</strong> — appointment scheduling (
            <a
              href="https://calendly.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Calendly Privacy Policy
            </a>
            ).
          </li>
          <li>
            <strong>Vercel Analytics</strong> — anonymous web analytics (
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vercel Privacy Policy
            </a>
            ).
          </li>
        </ul>

        <h2>5. What Happens During a Deployment</h2>
        <p>
          When we perform an in-person or remote setup we may temporarily access
          your network, devices, and accounts. During that process we commit to:
        </p>
        <ul>
          <li>
            Accessing only the information strictly required to complete the
            installation.
          </li>
          <li>
            Not copying, storing, or keeping any of your personal files,
            credentials, or data once the engagement is finished.
          </li>
          <li>
            Installing only software that is necessary for OpenClaw to operate.
          </li>
        </ul>
        <p>
          We strongly recommend changing any passwords or credentials you shared
          with us as soon as the deployment is complete.
        </p>

        <h2>6. Retention</h2>
        <p>
          We keep your booking and contact information for as long as it is
          needed to deliver our services and provide support. Payment records are
          retained in accordance with applicable tax and accounting requirements.
          You may ask us to delete your data at any time by reaching out through
          our contact information below.
        </p>

        <h2>7. Security</h2>
        <p>
          We use reasonable administrative and technical safeguards to protect
          your information; however, no transmission or storage method is
          completely secure and we cannot guarantee absolute protection. OpenClaw
          itself is designed to run locally on your own hardware — after
          deployment your data stays on your machine and is not sent back to us.
        </p>

        <h2>8. Your Rights</h2>
        <p>
          Depending on where you are located, you may have the right to:
        </p>
        <ul>
          <li>Access the personal data we hold about you.</li>
          <li>Request that inaccurate data be corrected.</li>
          <li>Request deletion of your data.</li>
          <li>Object to or restrict certain processing activities.</li>
        </ul>
        <p>To exercise any of these rights, please contact us below.</p>

        <h2>9. Cookies &amp; Tracking</h2>
        <p>
          Our site uses only the minimal cookies necessary for basic
          functionality. We do not deploy advertising cookies or cross-site
          trackers. Vercel Analytics gathers anonymous, aggregated metrics and
          does not use cookies to identify individual visitors.
        </p>

        <h2>10. Children</h2>
        <p>
          Our services are intended for business professionals and are not
          directed at anyone under 18. We do not knowingly collect personal
          information from minors.
        </p>

        <h2>11. Updates to This Policy</h2>
        <p>
          We may revise this Privacy Policy periodically. Any changes will be
          posted on this page with a new &ldquo;Last updated&rdquo; date.
          Continued use of our services after a revision constitutes your
          acceptance of the updated terms.
        </p>

        <h2>12. Contact Us</h2>
        <p>
          Questions or concerns? Reach us at{" "}
          <Link href="/book">openclawdfw.com/book</Link>.
        </p>
      </article>
    </main>
  );
}
