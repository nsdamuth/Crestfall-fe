import StudioPageHeader from "@/components/studio/StudioPageHeader";
import StudioActionCard from "@/components/studio/StudioActionCard";

export default async function PlayCanonPage() {
  return (
    <>
      <StudioPageHeader
        eyebrow="Play Canon"
        title="Official Story Mode"
        descriptions="Enter guided canon-aware sessions with official characters, persistent story flags, continuity rules, and active Chronicle events."
      >
      </StudioPageHeader>

      <section className="mt-8 grid gap-6 md:grid-cols-3">
        <StudioActionCard
          eyebrow="Canon Session"
          title="Start Canon Session"
          disabled
        >
          Begin a new continuity-aware Chronicle session using official
          Crestfall characters and story rules.
        </StudioActionCard>

        <StudioActionCard
          eyebrow="Progression"
          title="Continue Chronicle"
          disabled
        >
          Resume active storylines, ongoing events, and persistent canon arcs.
        </StudioActionCard>

        <StudioActionCard
          eyebrow="World State"
          title="Current Events"
          disabled
        >
          Follow active world developments, faction conflicts, and seasonal
          Chronicle events.
        </StudioActionCard>
      </section>
    </>
  );
}