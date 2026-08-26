import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

// Dev-only Review Mode / Notes overlay (docs/_legacy-reference/design-system/proof
// port, 8 Aug 2026). RootLayout is a server component: the NODE_ENV
// check below means DevOnlyReviewMode is never mounted in a production
// render, so its dynamic import (see DevOnlyReviewMode.jsx) is never
// triggered and the real overlay's chunk is never requested by a
// production browser. Verified by grepping the production build
// output; see the mobile nav restyle brief report.
import DevOnlyReviewMode from "./dev/review-mode/DevOnlyReviewMode";

const cormorantDisplay = Cormorant_Garamond({
  variable: "--next-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--next-inter",
  subsets: ["latin"],
});

const PUBLIC_SITE_URL = String(
  process.env.NEXT_PUBLIC_SITE_URL || "https://crestfall-studio.com"
).replace(/\/+$/, "");

export const metadata = {
  metadataBase: new URL(PUBLIC_SITE_URL),
  title: {
    default: "Crestfall Chronicles",
    template: "%s | Crestfall",
  },
  description:
    "A creator platform for persistent interactive fiction, story rooms, characters, lore, and reusable narrative systems.",
  applicationName: "Crestfall",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Crestfall",
    title: "Crestfall Chronicles",
    description:
      "Create characters, story rooms, lore, templates, and persistent interactive fiction worlds.",
    url: "/",
    images: [
      {
        url: "/assets/branding/crestfall-og-v2.png",
        width: 1200,
        height: 630,
        alt: "Crestfall Chronicles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crestfall Chronicles",
    description:
      "Create characters, story rooms, lore, templates, and persistent interactive fiction worlds.",
    images: ["/assets/branding/crestfall-og-v2.png"],
  },
  icons: {
    icon: [
      {
        url: "/assets/branding/favicon.ico",
        type: "image/x-icon",
      },
      {
        url: "/assets/branding/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/assets/branding/favicon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/assets/branding/favicon-16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/assets/branding/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/assets/branding/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: ["/assets/branding/favicon.ico"],
    apple: [
      {
        url: "/assets/branding/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  // V2 convergence branch: the proof/review overlay is useful for design
  // review, but its fixed bottom controls can cover product actions while
  // we are actively integrating live builders. Keep the tooling available
  // as an explicit opt-in instead of mounting it on every dev page.
  const reviewModeEnabled =
    process.env.NODE_ENV !== "production" &&
    process.env.CRESTFALL_ENABLE_REVIEW_MODE === "true";

  return (
    <html lang="en">
      <body
        className={`${cormorantDisplay.variable} ${cormorant.variable} ${inter.variable}`}
      >
        {children}
        {reviewModeEnabled ? <DevOnlyReviewMode /> : null}
      </body>
    </html>
  );
}