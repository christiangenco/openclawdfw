import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — OpenClaw DFW",
  description:
    "Terms governing the use of OpenClaw DFW placement and agent management services.",
};

export default function TermsOfService() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/"
        className="text-sm text-red-500 hover:text-red-400"
      >
        ← Back
      </Link>

      <article className="prose prose-invert mt-8 max-w-none prose-headings:text-gray-100 prose-p:text-gray-300 prose-li:text-gray-300 prose-a:text-red-500 hover:prose-a:text-red-400 prose-strong:text-gray-200">
        <h1>Terms of Service</h1>
        <p>Last updated: February 10, 2026</p>

        <h2>1. Scope</h2>
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) apply to all services
          offered by OpenClaw DFW (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;), including in-person and remote OpenClaw
          installation, configuration, and post-deployment support
          (collectively, the &ldquo;Services&rdquo;). By purchasing or using any
          of our Services you (&ldquo;Customer&rdquo; or &ldquo;you&rdquo;)
          agree to these Terms.
        </p>

        <h2>2. What We Provide</h2>
        <p>OpenClaw DFW offers:</p>
        <ul>
          <li>
            In-person deployment across the Dallas/Fort Worth metroplex, or
            remote installation for customers anywhere in the U.S.
          </li>
          <li>
            Security hardening, email and calendar integration, and up to three
            custom workflow configurations per engagement.
          </li>
          <li>
            An onboarding period after go-live (including a 1-week follow-up
            call) covering issues directly related to the initial placement.
          </li>
          <li>
            Optional month-to-month Agent Management plans for ongoing
            monitoring, updates, performance reviews, and support (billed
            monthly under separate plan terms).
          </li>
        </ul>
        <p>
          In-person Services are currently offered within the DFW metroplex.
          Remote Services are available nationwide. We reserve the right to
          adjust scope, pricing, and availability at any time.
        </p>

        <h2>3. Pricing &amp; Refunds</h2>
        <p>
          Placement fees are one-time charges; Agent Management fees are
          recurring monthly charges. Pricing is provided during your AI
          Opportunity Audit and may change without prior notice.
        </p>
        <ul>
          <li>
            If you cancel before your scheduled appointment, you will receive a
            full refund.
          </li>
          <li>
            Once a placement appointment has been completed, placement fees are
            non-refundable.
          </li>
          <li>
            Agent Management plans may be cancelled with 30 days&rsquo; written
            notice.
          </li>
          <li>
            If we are unable to finish a deployment due to circumstances within
            our control, we will reschedule at no extra cost or provide a full
            refund at your request.
          </li>
        </ul>

        <h2>4. Your Responsibilities</h2>
        <ul>
          <li>
            <strong>Backups:</strong> You are solely responsible for backing up
            all data, files, and configurations on your systems before any
            deployment. We are not liable for data loss that occurs during or
            after the setup process.
          </li>
          <li>
            <strong>Access:</strong> You must provide timely physical or remote
            access to the deployment location, along with the credentials,
            network access, and hardware needed for installation.
          </li>
          <li>
            <strong>Accuracy:</strong> Any information you supply (hardware
            specs, network topology, account details, etc.) must be accurate and
            complete.
          </li>
          <li>
            <strong>Legal compliance:</strong> You are responsible for ensuring
            that your use of OpenClaw and any connected services complies with
            all applicable laws and third-party terms of service.
          </li>
        </ul>

        <h2>5. OpenClaw &amp; Third-Party Software</h2>
        <p>
          OpenClaw is open-source software created and maintained by independent
          third parties. OpenClaw DFW is not the developer, owner, or maintainer
          of the OpenClaw project. We make no guarantees regarding the
          functionality, security, uptime, or continued development of OpenClaw
          or any of its third-party integrations. Problems that originate in the
          OpenClaw codebase, its upstream updates, or external services it
          connects to fall outside the scope of our liability. All third-party
          software is used at your own risk and is subject to its own licenses
          and terms.
        </p>

        <h2>6. Hardware</h2>
        <p>
          If we procure hardware on your behalf (for example, a Mac Mini), it is
          delivered with only the manufacturer&rsquo;s standard warranty.
          OpenClaw DFW is not responsible for hardware defects, failures, or
          damage after delivery. If you supply your own hardware, you are
          responsible for confirming it meets the minimum requirements for
          running OpenClaw. We are not liable for damage to customer-provided
          hardware during or after setup except in cases of gross negligence.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          TO THE FULLEST EXTENT ALLOWED BY LAW, OPENCLAW DFW AND ITS OWNERS,
          EMPLOYEES, AND CONTRACTORS SHALL NOT BE LIABLE FOR ANY INDIRECT,
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES — INCLUDING
          BUT NOT LIMITED TO LOSS OF DATA, REVENUE, OR PROFITS; BUSINESS
          INTERRUPTION; UNAUTHORIZED ACCESS TO YOUR SYSTEMS; SECURITY INCIDENTS;
          OR DAMAGES CAUSED BY THIRD-PARTY SOFTWARE OR HARDWARE — REGARDLESS OF
          THE THEORY OF LIABILITY.
        </p>
        <p>
          OUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS ARISING FROM OR RELATED
          TO THESE TERMS OR THE SERVICES SHALL NOT EXCEED THE FEES YOU ACTUALLY
          PAID TO OPENCLAW DFW FOR THE SPECIFIC SERVICE GIVING RISE TO THE
          CLAIM.
        </p>

        <h2>8. No Warranty</h2>
        <p>
          THE SERVICES ARE PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS
          AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS,
          IMPLIED, OR STATUTORY, INCLUDING IMPLIED WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
          NON-INFRINGEMENT. WE DO NOT WARRANT THAT DEPLOYMENTS WILL BE
          ERROR-FREE, THAT OPENCLAW WILL OPERATE WITHOUT INTERRUPTION, OR THAT
          THE SOFTWARE WILL SATISFY YOUR SPECIFIC REQUIREMENTS.
        </p>

        <h2>9. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless OpenClaw DFW and its
          owners, employees, and contractors from any claims, damages, losses,
          liabilities, costs, and expenses (including reasonable attorney&rsquo;s
          fees) arising out of or related to: (a) your use of the Services or
          the OpenClaw software after deployment; (b) a breach of these Terms;
          (c) a violation of any applicable law or regulation; or (d) any
          third-party claim connected to your use of OpenClaw or integrated
          services.
        </p>

        <h2>10. Data &amp; Security During Deployment</h2>
        <p>
          We may need temporary access to your network, accounts, or devices
          while performing a setup. We will not intentionally access, copy, or
          retain personal data beyond what is necessary to complete the
          installation. That said, we cannot guarantee the security of data
          residing on your devices or network. You should change any credentials
          shared with us once the deployment is finished. See our{" "}
          <Link href="/privacy">Privacy Policy</Link> for additional details on
          how we handle information.
        </p>

        <h2>11. Onboarding &amp; Ongoing Support</h2>
        <p>
          The onboarding period (including the 1-week follow-up) covers issues
          directly attributable to the initial placement. It does not cover:
        </p>
        <ul>
          <li>OpenClaw software updates or new releases.</li>
          <li>Feature requests or customization beyond the original scope.</li>
          <li>Problems caused by changes you make after setup.</li>
          <li>Third-party service outages.</li>
          <li>Hardware failures or local network changes.</li>
        </ul>
        <p>
          Continued monitoring, maintenance, and support beyond the onboarding
          period requires an active Agent Management plan.
        </p>

        <h2>12. Resolving Disputes</h2>
        <p>
          Any dispute arising from these Terms or the Services should first be
          addressed through good-faith negotiation. If it cannot be resolved
          informally within 30 days, the matter will be submitted to binding
          arbitration in Dallas, Texas, under the rules of the American
          Arbitration Association. Each party will bear its own costs. You agree
          that any dispute-resolution proceeding will be conducted individually
          and not as part of a class action.
        </p>

        <h2>13. Governing Law</h2>
        <p>
          These Terms are governed by the laws of the State of Texas, without
          regard to conflict-of-law principles.
        </p>

        <h2>14. Changes</h2>
        <p>
          We may update these Terms at any time. Revisions will be posted on
          this page with a new &ldquo;Last updated&rdquo; date. Your continued
          use of the Services after any update constitutes acceptance of the
          revised Terms.
        </p>

        <h2>15. Contact Us</h2>
        <p>
          Have questions about these Terms? Get in touch at{" "}
          <Link href="/book">openclawdfw.com/book</Link>.
        </p>
      </article>
    </main>
  );
}
