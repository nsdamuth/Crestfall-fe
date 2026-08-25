import Link from "next/link";
import {
  Bug,
  ExternalLink,
  MessageSquare,
  ScrollText,
  Sparkles,
} from "lucide-react";
import StudioPageHeader from "@/components/studio/StudioPageHeader";

const feedbackCards = [
  {
    title: "Public Roadmap",
    eyebrow: "Coming Soon",
    icon: Sparkles,
    image: "/assets/covers/crestfall-compass-cover.png",
    body: "A high-level production roadmap for major Crestfall platform work, upcoming systems, and public milestones.",
  },
  {
    title: "Bug Reports",
    eyebrow: "Coming Soon",
    icon: Bug,
    image: "/assets/covers/crestfall-sundial-cover.png",
    body: "Report broken flows, visual bugs, mobile issues, save problems, and other defects that need investigation.",
  },
  {
    title: "Suggestions",
    eyebrow: "Coming Soon",
    icon: MessageSquare,
    image: "/assets/covers/crestfall-drawings-cover.png",
    body: "Submit ideas for creation tools, story rooms, community systems, image workflows, and quality-of-life improvements.",
  },
  {
    title: "Release Notes",
    eyebrow: "Coming Soon",
    icon: ScrollText,
    image: "/assets/covers/crestfall-scrolls-cover.png",
    body: "Track updates, shipped features, polish passes, known issues, and platform changes as Crestfall evolves.",
  },
];

function FeedbackDestinationCard({ card }) {
  const Icon = card.icon;

  return (
    <article className="group relative flex min-h-[13rem] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-1)] md:min-h-[18rem]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={card.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center opacity-70 transition-transform duration-300 group-hover:scale-[1.015]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[var(--canvas)] via-[color-mix(in_srgb,var(--canvas)_72%,transparent)] to-[color-mix(in_srgb,var(--canvas)_28%,transparent)]"
      />

      <div className="relative z-[1] mt-auto w-full p-[var(--space-4)] md:p-[var(--space-5)]">
        <div className="flex items-center justify-between gap-[var(--space-3)]">
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--art-gold)]">
            {card.eyebrow}
          </p>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line-whisper)] bg-[color-mix(in_srgb,var(--canvas)_66%,transparent)] text-[var(--art-gold)]">
            <Icon size={17} />
          </span>
        </div>

        <h2 className="mt-[var(--space-2)] font-[family-name:var(--font-display)] text-[clamp(1.65rem,2.6vw,2.55rem)] leading-[1.05] font-medium text-[var(--art-ink)]">
          {card.title}
        </h2>
        <p className="mt-[var(--space-3)] max-w-[42rem] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--art-ink-dim)]">
          {card.body}
        </p>
      </div>
    </article>
  );
}

export default function StudioFeedbackPage() {
  return (
    <>
      <StudioPageHeader
        eyebrow="Feedback & Updates"
        title="Roadmap, Feedback & Updates"
        description="Follow Crestfall development, report issues, suggest improvements, and find official community channels."
      />

      <section className="mt-[var(--space-6)] space-y-[var(--space-5)]">
        <header className="flex flex-col gap-[var(--space-3)] border-b border-[var(--line)] pb-[var(--space-5)] lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-action)]">
              Development Hub
            </p>
            <h2 className="mt-[var(--space-2)] font-[family-name:var(--font-display)] text-[clamp(1.8rem,3vw,2.65rem)] leading-[1.05] font-medium text-[var(--ink)]">
              Help shape Crestfall.
            </h2>
            <p className="mt-[var(--space-3)] max-w-[64rem] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
              Roadmaps, release notes, bug reporting, and suggestion tracking will live here as the public development hub grows. Discord remains the active community channel while those tools are being built.
            </p>
          </div>
        </header>

        <div className="grid gap-[var(--space-4)] md:grid-cols-2">
          {feedbackCards.map((card) => (
            <FeedbackDestinationCard key={card.title} card={card} />
          ))}
        </div>

        <section className="relative min-h-[16rem] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-1)] md:min-h-[20rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/covers/banner.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center opacity-65"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[var(--canvas)] via-[color-mix(in_srgb,var(--canvas)_78%,transparent)] to-[color-mix(in_srgb,var(--canvas)_32%,transparent)]"
          />

          <div className="relative z-[1] flex min-h-[16rem] max-w-[52rem] flex-col justify-center p-[clamp(1.5rem,4vw,3.25rem)] md:min-h-[20rem]">
            <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--art-gold)]">
              Community now
            </p>
            <h2 className="mt-[var(--space-2)] font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,3.4rem)] leading-[1] font-medium text-[var(--art-ink)]">
              Join the Discord
            </h2>
            <p className="mt-[var(--space-4)] max-w-[44rem] text-[length:var(--text-lead)] leading-[1.55] text-[var(--art-ink-dim)]">
              Use Discord for early feedback, bug notes, suggestions, development discussion, announcements, and direct community conversation while the formal feedback tools come online.
            </p>
            <div className="mt-[var(--space-5)] flex flex-wrap gap-[var(--space-3)]">
              <a
                href="https://discord.com/channels/1482041132874727579/1482041133700878529"
                target="_blank"
                rel="noreferrer"
                className="cf-btn cf-btn--primary"
              >
                <ExternalLink size={14} />
                Open Discord
              </a>
              <Link href="/studio" className="cf-btn cf-btn--secondary">
                Back to Studio
              </Link>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
