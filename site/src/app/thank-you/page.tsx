import Link from "next/link";
import { TrackChecklistSignup } from "./track-goal";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Check Your Email — OpenClaw DFW",
  description: "Confirm your email to get the free AI Employee Playbook.",
  robots: { index: false, follow: false },
};

export default function ThankYou() {
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

      <TrackChecklistSignup />

      {/* Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="mx-auto max-w-md">
          <div className="text-5xl">📬</div>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-gray-100">
            Check Your Email
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            I just sent you a confirmation link. Click it to get your{" "}
            <strong className="text-gray-200">
              AI Employee Playbook
            </strong>
            .
          </p>
          <div className="mt-8 rounded-xl border border-gray-800 bg-gray-900/50 p-5 text-left text-sm text-gray-400">
            <p className="font-medium text-gray-300">
              Don&rsquo;t see it?
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Check your spam/promotions folder</li>
              <li>
                Look for an email from{" "}
                <span className="text-gray-300">christian@openclawdfw.com</span>
              </li>
              <li>It should arrive within a minute or two</li>
            </ul>
          </div>
          <p className="mt-8 text-sm text-gray-500">
            After confirming, you&rsquo;ll also get a few short emails over the
            next two weeks about how DFW founders are using AI to get 10+
            hours/week back. Unsubscribe anytime.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block text-sm text-red-500 hover:text-red-400"
          >
            ← Back to OpenClaw DFW
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
