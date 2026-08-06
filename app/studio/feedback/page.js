import Link from "next/link";
import {
  Bug,
  ExternalLink,
  Megaphone,
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
    body: "A high-level production roadmap for major Crestfall platform work, upcoming systems, and public milestones.",
  },
  {
    title: "Bug Reports",
    eyebrow: "Coming Soon",
    icon: Bug,
    body: "Report broken flows, visual bugs, mobile issues, save problems, and other defects that need investigation.",
  },
  {
    title: "Suggestions",
    eyebrow: "Coming Soon",
    icon: MessageSquare,
    body: "Submit ideas for creation tools, story rooms, community systems, image workflows, and quality-of-life improvements.",
  },
  {
    title: "Release Notes",
    eyebrow: "Coming Soon",
    icon: ScrollText,
    body: "Track updates, shipped features, polish passes, known issues, and platform changes as Crestfall evolves.",
  },
];

export default function StudioFeedbackPage() {
  return (
    <>
      <StudioPageHeader
        eyebrow="Feedback & Updates"
        title="Roadmap, Feedback & Updates"
        description="Follow Crestfall development, report issues, suggest improvements, and find official community channels."
      />

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black/45 p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            Development Hub
          </p>

          <h2 className="mt-2 font-display text-4xl">
            Help Shape Crestfall
          </h2>

          <p className="mt-4 max-w-4xl leading-8 text-[var(--muted)]">
            This page will become the public hub for roadmap updates, release
            notes, bug reporting, suggestion tracking, announcements, and known
            issues. For now, use Discord as the primary community channel.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {feedbackCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5"
                >
                  <Icon className="text-[var(--muted-gold)]" size={20} />

                  <p className="mt-4 text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
                    {card.eyebrow}
                  </p>

                  <h3 className="mt-2 font-display text-3xl">
                    {card.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    {card.body}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="self-start rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black/45 p-6 xl:sticky xl:top-24">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            Community Link
          </p>

          <h2 className="mt-2 font-display text-3xl">Join the Discord</h2>

          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            Use Discord for early feedback, bug notes, suggestions, and
            development discussion while the formal feedback tools are being
            built.
          </p>

          <a
            href="https://discord.com/channels/1482041132874727579/1482041133700878529"
            target="_blank"
            rel="noreferrer"
            className="cf-btn cf-btn--primary mt-6 w-full"
          >
            <ExternalLink size={14} />
            Open Discord
          </a>

          <Link
            href="/studio"
            className="cf-btn cf-btn--secondary mt-3 w-full"
          >
            Back to studio
          </Link>
        </aside>
      </section>
    </>
  );
}