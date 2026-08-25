import { createClient } from "@/lib/supabase/server";
import StudioShell from "@/components/studio/StudioShell";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const STUDIO_SHARE_DESCRIPTION =
  "Create characters, story rooms, lore, templates, and persistent interactive fiction worlds.";

export const metadata = {
  title: "Crestfall Chronicles",
  description: STUDIO_SHARE_DESCRIPTION,
  alternates: {
    canonical: "/studio",
  },
  openGraph: {
    type: "website",
    siteName: "Crestfall",
    title: "Crestfall Chronicles",
    description: STUDIO_SHARE_DESCRIPTION,
    url: "/studio",
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
    description: STUDIO_SHARE_DESCRIPTION,
    images: ["/assets/branding/crestfall-og-v2.png"],
  },
};

function SignedOutStudioGate() {
  return (
    <main className="min-h-screen bg-[var(--canvas)] px-[var(--space-5)] py-[var(--space-12)] text-[var(--ink)] sm:px-[var(--space-8)]">
      <section className="mx-auto max-w-5xl overflow-hidden rounded-[var(--radius-lg)] border border-[var(--gold-ornament)]/25 bg-[var(--surface-1)] shadow-[var(--shadow-modal)]">
        <div className="relative min-h-[24rem] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/branding/crestfall-og-v2.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center opacity-55"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40"
          />

          <div className="relative z-10 flex min-h-[24rem] max-w-3xl flex-col justify-center p-[clamp(1.5rem,5vw,4rem)]">
            <p className="text-[length:var(--text-eyebrow)] uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
              Crestfall Studio
            </p>
            <h1 className="mt-[var(--space-3)] font-display text-[clamp(2.5rem,7vw,5rem)] leading-none text-[var(--ink)]">
              Build worlds that remember.
            </h1>
            <p className="mt-[var(--space-5)] max-w-2xl text-[length:var(--text-lead)] leading-8 text-[var(--ink-dim)]">
              Create characters, story rooms, lore, templates, and persistent interactive fiction worlds.
            </p>
            <div className="mt-[var(--space-6)] flex flex-wrap gap-[var(--space-3)]">
              <a href="/login" className="cf-btn cf-btn--primary">
                Sign in to Studio →
              </a>
              <a href="/" className="cf-btn cf-btn--secondary">
                Explore Crestfall
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default async function StudioLayout({ children }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <SignedOutStudioGate />;
  }

  return <StudioShell user={user}>{children}</StudioShell>;
}
