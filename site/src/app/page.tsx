import Link from "next/link";
import { EmailCapture } from "@/components/email-capture";
import { TestimonialGrid } from "@/components/tweet-embed";

const CHECK = (
  <svg
    className="h-5 w-5 shrink-0 text-red-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const SHIELD = (
  <svg
    className="h-6 w-6 text-red-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top banner */}
      <div className="bg-red-600/90 px-4 py-2 text-center text-sm text-white">
        📍 In-person AI employee placement across Dallas/Fort Worth · Remote
        available nationwide
      </div>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <span className="text-lg font-bold tracking-tight text-gray-100">
          Open<span className="text-red-500">Claw</span>{" "}
          <span className="font-semibold text-gray-500">DFW</span>
        </span>
        <div className="flex items-center gap-4">
          <Link
            href="/book"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Book Your Audit
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 pt-12 pb-20 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm font-medium text-red-400">
          <span className="text-xs">📍</span> Serving Dallas/Fort Worth
        </span>
        <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-gray-100 sm:text-5xl lg:text-6xl">
          Hire an{" "}
          <span className="text-red-500">AI&nbsp;Executive&nbsp;Assistant</span>
          . I&rsquo;ll Place&nbsp;It&nbsp;&amp;&nbsp;Manage&nbsp;It.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-400">
          I deploy{" "}
          <a
            href="https://openclaw.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-red-500/50 underline-offset-2 hover:text-red-400"
          >
            OpenClaw
          </a>{" "}
          — the open-source AI that manages your email, calendar, and workflows
          — on hardware in your office or a server you control. Think of it as
          hiring a supercharged employee that works 24/7, responds instantly, and
          only gets smarter.
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Uptown · Deep Ellum · Las Colinas · Frisco · Fort Worth · Southlake ·
          Colleyville · Plano · Arlington
        </p>
        <div className="mt-10">
          <Link
            href="/book"
            className="rounded-lg bg-red-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-red-700"
          >
            Book Your Free AI Opportunity Audit →
          </Link>
          <p className="mt-3 text-sm text-gray-500">
            30 minutes · No obligation · We&rsquo;ll map out exactly how an AI
            employee fits your business
          </p>
        </div>
      </section>

      {/* The "Holy Shit" Moment */}
      <section className="border-t border-gray-800 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-gray-100 sm:text-3xl">
            Imagine Saying This to Your Assistant
          </h2>
          <div className="mt-8 rounded-xl border border-gray-800 bg-gray-900/50 p-6 text-left">
            <p className="text-lg italic text-gray-300">
              &ldquo;Who was the guy I had lunch with last week? Schedule a
              meeting with him for Wednesday or Thursday — I want to talk about
              the PDF that Lauren just sent me.&rdquo;
            </p>
          </div>
          <p className="mt-6 text-gray-400">
            Your AI employee pieces together your calendar, email, contacts, and
            files — then handles it. Instantly. At 2 AM or 2 PM. No follow-up
            needed.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-gray-800 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-gray-100 sm:text-3xl">
            How It Works
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "AI Opportunity Audit",
                desc: "We hop on a 30-minute call. I learn your business, identify the 2–3 workflows where AI will save you the most time, and show you what your AI employee would look like.",
              },
              {
                step: "2",
                title: "Placement",
                desc: "I come to your DFW office (or set up remotely) and install your AI employee on hardware you control. We test everything together — email, calendar, your business tools — before I leave.",
              },
              {
                step: "3",
                title: "Agent Management",
                desc: "I'm the ongoing manager of your AI employee. Monitoring, security updates, performance reviews, and training — so it keeps getting better at its job.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-gray-800 p-6"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
                  {item.step}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-gray-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Your AI Employee Can Do */}
      <section className="border-t border-gray-800 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-gray-100 sm:text-3xl">
            What Your AI Employee Can Do
          </h2>
          <ul className="mt-10 space-y-4">
            {[
              "Triage your inbox — flag what matters, draft replies, archive the noise",
              "Schedule meetings by coordinating across calendars and time zones",
              "Prep meeting briefs from your email, CRM, and recent documents",
              "Draft follow-ups after calls and meetings",
              "Look up customer data in your CRM, case management, or intake system",
              "Generate reports by pulling from multiple business tools",
              "Handle recurring workflows you define — daily, weekly, or triggered by events",
              "Respond via text (Signal or iMessage) like a real assistant",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                {CHECK}
                <span className="text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-sm text-gray-500">
            If you can do it on a computer, your AI employee can learn it.
            Complex integrations are scoped on the call.
          </p>
        </div>
      </section>

      {/* Social Proof: What Real People Are Doing */}
      <section className="border-t border-gray-800 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-gray-100 sm:text-3xl">
            Real People. Real Tasks. Handled&nbsp;by&nbsp;AI.
          </h2>
          <p className="mt-4 text-center text-gray-400">
            OpenClaw is already working as an executive assistant for thousands
            of people. Here&rsquo;s what that looks like.
          </p>
          <div className="mt-12">
            <TestimonialGrid
              tweets={[
                {
                  name: "Dan Peguine",
                  handle: "danpeguine",
                  tweetId: "2012565160586625345",
                  verified: false,
                  text: `Things my OpenClaw does for me:\n\n• Timeblocks tasks in my calendar based on importance\n• Gives a morning daily brief: weather, objectives, meetings agenda, key reminders\n• Researches people before meetings and creates briefing docs\n• Manages the calendar for any conflicts autonomously\n• Creates invoices and summarizes work beautifully`,
                },
                {
                  name: "JD Rhyne",
                  handle: "jdrhyne",
                  tweetId: "2012778049406742632",
                  verified: false,
                  text: `What my OpenClaw army does:\n\n• Cleared 10,000 emails from my inbox (Day 1)\n• Reviewed and summarized 122 Google Slides for town hall\n• Drafts LinkedIn/X posts in my voice\n• Reviews, analyzes and optimized Google Ads\n• Daily roll call across 10+ agents`,
                },
                {
                  name: "Armand du Plessis",
                  handle: "armanddp",
                  tweetId: "2008767951340794245",
                  verified: false,
                  text: `Finds my next flight in email, runs through check-in, finds me a window seat.\n\nWhile I'm driving.`,
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Social Proof: Credibility */}
      <section className="border-t border-gray-800 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-gray-100 sm:text-3xl">
            Endorsed by the People Who Know&nbsp;AI&nbsp;Best
          </h2>
          <div className="mt-12">
            <TestimonialGrid
              tweets={[
                {
                  name: "Dave Morin",
                  handle: "davemorin",
                  tweetId: "2013723700668096605",
                  verified: true,
                  text: `At this point I don't even know what to call OpenClaw. It is something new.\n\nAfter a few weeks in with it, this is the first time I have felt like I am living in the future since the launch of ChatGPT.`,
                  subtitle: "Co-founder of Facebook, founder of Path",
                },
                {
                  name: "Andrej Karpathy",
                  handle: "karpathy",
                  tweetId: "2005692186470514904",
                  verified: true,
                  text: `Excellent reading thank you. Love oracle and Claw.`,
                  subtitle: "Former Tesla AI Director, OpenAI founding member",
                },
                {
                  name: "crossi",
                  handle: "crossiBuilds",
                  tweetId: "2008478023826153665",
                  verified: false,
                  text: `Everything Siri was supposed to be.\n\nAnd it goes so much further.`,
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="border-t border-gray-800 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="flex items-center justify-center gap-3 text-2xl font-bold text-gray-100 sm:text-3xl">
            {SHIELD} Security-Fanatical by Default
          </h2>
          <p className="mt-4 text-center text-gray-400">
            I treat every deployment like it handles privileged data — because it
            probably does.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Your Hardware, Your Data",
                desc: "Runs on a device in your office or a server you control. Not a SaaS black box. You can literally unplug it.",
              },
              {
                title: "New Employee Onboarding",
                desc: "Starts read-only. Drafts but doesn't send. Approval flows for anything sensitive. You escalate access as trust builds.",
              },
              {
                title: "Own Identity",
                desc: "Gets its own email address and credentials. You never hand over your personal login to the AI.",
              },
              {
                title: "Hardened from Day One",
                desc: "Industry best practices plus my own paranoid threat modeling. I think through every way this could go wrong so you don't have to.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-gray-800 p-5">
                <h3 className="font-semibold text-gray-100">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="border-t border-gray-800 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-gray-100 sm:text-3xl">
            Built for Business Owners Who Call the Shots
          </h2>
          <ul className="mt-10 space-y-4">
            {[
              "Founders and managing partners drowning in email and scheduling",
              "Exec teams at companies with 4–50+ employees",
              "Business owners who don't want to get left behind on AI",
              "Leaders who've tried ChatGPT but want something that actually runs their day",
              "Anyone who'd hire a great executive assistant — if they could find one that works 24/7",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                {CHECK}
                <span className="text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Lead Magnet / Email Capture */}
      <section className="border-t border-gray-800 px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <EmailCapture />
        </div>
      </section>

      {/* About / Trust */}
      <section className="border-t border-gray-800 px-6 py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 sm:flex-row sm:items-start">
          <img
            src="https://christian.gen.co/images/profile.square.small.jpg"
            alt="Christian Genco"
            className="h-32 w-32 shrink-0 rounded-full border-2 border-gray-700 object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-100">
              Hi, I&rsquo;m Christian Genco
            </h2>
            <p className="mt-3 text-gray-400">
              I&rsquo;ve been building software for over a decade. I built my
              own AI assistant before OpenClaw even existed. I play with these
              tools all day and I know exactly what they&rsquo;re capable of —
              and where the dangerous edges are.
            </p>
            <p className="mt-3 text-gray-400">
              I&rsquo;m based in Dallas/Fort Worth. I show up in person, shake
              your hand, and don&rsquo;t leave until everything works. After
              that, I&rsquo;m your AI employee&rsquo;s manager — making sure
              it keeps performing and stays secure.
            </p>
            <div className="mt-4 flex gap-4">
              <a
                href="https://x.com/cgenco"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-red-500 hover:text-red-400"
              >
                @cgenco on X →
              </a>
              <a
                href="https://christian.gen.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-red-500 hover:text-red-400"
              >
                christian.gen.co →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-800 px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-100 sm:text-3xl">
          Ready to Hire Your AI Employee?
        </h2>
        <p className="mt-4 text-gray-400">
          Book a free 30-minute AI Opportunity Audit. I&rsquo;ll map out the
          top workflows an AI employee can take off your plate — and show you
          exactly what it looks like.
        </p>
        <Link
          href="/book"
          className="mt-8 inline-block rounded-lg bg-red-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-red-700"
        >
          Book Your Free AI Opportunity Audit →
        </Link>
        <p className="mt-3 text-sm text-gray-500">
          No pitch deck. No obligation. Just a conversation about your business.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()} OpenClaw DFW. Powered by{" "}
          <a
            href="https://openclaw.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-300"
          >
            OpenClaw
          </a>
          .
        </p>
        <p className="mt-2">
          <Link href="/privacy" className="underline hover:text-gray-300">
            Privacy Policy
          </Link>
          {" · "}
          <Link href="/terms" className="underline hover:text-gray-300">
            Terms of Service
          </Link>
        </p>
      </footer>
    </div>
  );
}
