import SiteHeader from "@/components/SiteHeader";
import SiteShell from "@/components/SiteShell";
import PolicyIndex from "@/components/policies/PolicyIndex";

export const metadata = {
  title: "Terms & Policies | Crestfall",
  description:
    "Draft placeholder index for Crestfall terms, privacy, content, moderation, safety, and platform trust policies.",
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader />

      <SiteShell eyebrow="Platform Trust" title="Terms & Policies">
        <p className="font-serif text-xl leading-9 text-[var(--muted)]">
          Draft policy placeholders for Crestfall&apos;s future legal, privacy,
          safety, moderation, and platform trust surfaces. These are not final
          legal documents and must be reviewed before launch.
        </p>

        <PolicyIndex />
      </SiteShell>
    </>
  );
}