import Link from "next/link";

const CHECK = (
  <svg
    className="h-5 w-5 shrink-0 text-emerald-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <span className="text-lg font-bold tracking-tight">
          Setup<span className="text-emerald-600">Claw</span>{" "}
          <span className="text-sm font-normal text-gray-500">DFW</span>
        </span>
        <Link
          href="/book"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          Book a Call
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Your AI Executive Assistant,{" "}
          <span className="text-emerald-600">Deployed&nbsp;For&nbsp;You</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-gray-600">
          We set up and maintain{" "}
          <a
            href="https://openclaw.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-emerald-300 underline-offset-2 hover:text-emerald-700"
          >
            OpenClaw
          </a>{" "}
          — the open-source AI that manages your email, calendar, and workflows
          — so you can focus on running your business.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          White-glove service for Dallas/Fort Worth founders &amp; exec teams.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/book"
            className="rounded-lg bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            Book Your Free Strategy Call →
          </Link>
        </div>
      </section>

      {/* What You Get */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">
          What You Get
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {[
            {
              title: "In-Person Setup",
              desc: "We come to your office in DFW to install, harden, and integrate OpenClaw with your email, calendar, and messaging.",
            },
            {
              title: "Custom Workflows",
              desc: "Up to 3 tailored workflows — auto-triage your inbox, prep meeting briefs, draft follow-ups, and more.",
            },
            {
              title: "Security-First",
              desc: "Runs on your hardware. Follows the official OpenClaw hardening guide. Passes InfoSec / CISO review.",
            },
            {
              title: "14-Day Hypercare",
              desc: "After go-live, we're on Slack with you daily to fine-tune, fix edge cases, and make sure everything sticks.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who It's For */}
      <section className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            Built for Busy Leaders
          </h2>
          <ul className="mt-10 space-y-4">
            {[
              "Founders drowning in email and scheduling",
              "Exec teams at companies with 4–50+ employees",
              "Ops leaders who want AI leverage without the DIY headache",
              "Anyone who's tried ChatGPT but wants something that actually runs their day",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                {CHECK}
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Ready to Get Your Time Back?
        </h2>
        <p className="mt-4 text-gray-600">
          Book a free 30-minute call. We'll walk through your workflow and show
          you exactly how OpenClaw can help.
        </p>
        <Link
          href="/book"
          className="mt-8 inline-block rounded-lg bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          Book Your Free Strategy Call →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-6 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SetupClaw DFW. Powered by{" "}
        <a
          href="https://openclaw.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-700"
        >
          OpenClaw
        </a>
        .
      </footer>
    </div>
  );
}
