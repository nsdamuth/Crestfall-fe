import { Cinzel, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://www.crestfall.net"),
  title: {
    default: "Crestfall Chronicles",
    template: "%s | Crestfall",
  },
  description:
    "A creator platform for persistent interactive fiction, story rooms, characters, lore, and reusable narrative systems.",
  applicationName: "Crestfall",
  openGraph: {
    type: "website",
    siteName: "Crestfall",
    title: "Crestfall Chronicles",
    description:
      "Create characters, story rooms, lore, templates, and persistent interactive fiction worlds.",
    url: "https://www.crestfall.net",
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
      { url: "/favicon.ico" },
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
  return (
    <html lang="en">
      <body
        className={`${cinzel.variable} ${cormorant.variable} ${inter.variable}`}
      >
        {children}
      </body>
    </html>
  );
}