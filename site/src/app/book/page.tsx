import Link from "next/link";
import CalendlyEmbed from "./calendly-embed";

export const metadata = {
  title: "Book Your AI Opportunity Audit — OpenClaw DFW",
  description:
    "Schedule a free 30-minute AI Opportunity Audit to see how an AI employee can manage your email, calendar, and workflows. Serving Dallas/Fort Worth.",
};

export default function BookPage() {
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

      {/* Booking section */}
      <section className="flex flex-1 flex-col items-center px-6 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-100 sm:text-4xl">
          Book Your AI Opportunity Audit
        </h1>
        <p className="mt-4 max-w-lg text-center text-gray-400">
          Pick a time that works for you. We&rsquo;ll spend 30 minutes mapping
          out the top workflows an AI employee can take off your plate — and
          what it looks like to get one deployed in your business.
        </p>

        {/* Calendly embed */}
        <div className="mt-10 w-full max-w-3xl">
          <CalendlyEmbed />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} OpenClaw DFW.{" "}
        <Link href="/" className="underline hover:text-gray-300">
          ← Back to home
        </Link>
      </footer>
    </div>
  );
}
