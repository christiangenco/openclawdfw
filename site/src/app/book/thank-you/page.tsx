import Link from "next/link";

export const metadata = {
  title: "You're Booked — OpenClaw DFW",
  description:
    "Your AI Opportunity Audit is confirmed. We'll see you soon.",
};

export default function ThankYouPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-gray-100"
        >
          Open<span className="text-red-500">Claw</span>{" "}
          <span className="font-semibold text-gray-500">DFW</span>
        </Link>
      </nav>

      {/* Confirmation */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="text-5xl">🎉</div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-gray-100 sm:text-4xl">
          You&rsquo;re Booked!
        </h1>
        <p className="mt-4 max-w-lg text-lg text-gray-400">
          Your AI Opportunity Audit is confirmed. Check your email for the
          calendar invite and Zoom link. We&rsquo;ll spend 30 minutes mapping
          out exactly how an AI employee can take work off your plate.
        </p>
        <p className="mt-6 text-gray-500">
          Questions before the call?{" "}
          <a
            href="mailto:christian@openclawdfw.com"
            className="text-red-400 underline hover:text-red-300"
          >
            Shoot me an email
          </a>
          .
        </p>
        <Link
          href="/"
          className="mt-10 inline-block rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-red-500"
        >
          ← Back to Home
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} OpenClaw DFW.
      </footer>
    </div>
  );
}
