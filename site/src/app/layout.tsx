import type { Metadata } from "next";
import "./globals.css";
import { FathomAnalytics } from "./fathom";

const siteName = "OpenClaw DFW";
const title =
  "OpenClaw DFW — AI Executive Assistant Setup & Managed Care for Dallas/Fort Worth";
const description =
  "White-glove deployment of OpenClaw, the open-source AI executive assistant that manages your email, calendar, and workflows. In-person setup for Dallas/Fort Worth founders and exec teams.";
const url = "https://openclawdfw.com";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "OpenClaw setup",
    "OpenClaw deployment",
    "AI assistant Dallas",
    "AI assistant Fort Worth",
    "AI executive assistant DFW",
    "managed AI service",
    "OpenClaw security hardening",
    "Dallas Fort Worth",
    "DFW AI",
    "OpenClaw managed care",
  ],
  metadataBase: new URL(url),
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,
    description,
    url,
    siteName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${siteName} — OpenClaw setup, deployment & managed care in Dallas/Fort Worth`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${siteName} — OpenClaw setup, deployment & managed care in Dallas/Fort Worth`,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "theme-color": "#ff4d4d",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["Service", "LocalBusiness"],
              name: siteName,
              url,
              description:
                "Professional OpenClaw deployment and managed care for founders and exec teams in Dallas/Fort Worth. In-person or remote.",
              provider: {
                "@type": "Organization",
                name: siteName,
              },
              areaServed: [
                { "@type": "City", name: "Dallas" },
                { "@type": "City", name: "Fort Worth" },
                {
                  "@type": "Place",
                  name: "Dallas–Fort Worth metroplex",
                },
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                url: `${url}/book`,
              },
              priceRange: "$$$",
              offers: [
                {
                  "@type": "Offer",
                  name: "In-person Implementation",
                  price: "2400",
                  priceCurrency: "USD",
                  description:
                    "In-person deployment (DFW) — first Executive Agent, security hardening, 14-day hypercare.",
                },
                {
                  "@type": "Offer",
                  name: "Remote Implementation",
                  price: "1200",
                  priceCurrency: "USD",
                  description:
                    "Remote deployment — first Executive Agent, security hardening, 14-day hypercare.",
                },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What is OpenClaw?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "An open-source AI assistant that can triage email, schedule meetings, draft replies, and automate workflows across your tools — running on your own hardware.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What's included in implementation?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Install and security hardening, email and calendar integration, up to 3 mission-critical workflows, documentation, and 14-day hypercare. For in-person (DFW), we come to your location.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How long does setup take?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Expect 5–8 hours all-in for most teams, especially with multi-agent rollouts. You go live the same day.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do you offer support after setup?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Every customer gets a dedicated Slack Connect channel. Implementation includes 14-day hypercare. For ongoing monitoring, updates, and support, you'll want a Managed Care plan.",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="text-gray-100 antialiased">
        <FathomAnalytics />
        {children}
      </body>
    </html>
  );
}
