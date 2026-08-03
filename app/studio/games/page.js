import StudioPageHeader from "@/components/studio/StudioPageHeader";
import GamesHub from "@/components/studio/games/GamesHub";

export default function GamesPage() {
  return (
    <>
      <div className="hidden md:block">
        <StudioPageHeader eyebrow="Play" title="Games">
          Start official Crestfall experiences, continue active sessions, or
          explore curated playable rooms.
        </StudioPageHeader>
      </div>

      <div className="md:hidden">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
          Play
        </p>
        <h1 className="mt-2 font-display text-4xl">Games</h1>
      </div>

      <GamesHub />
    </>
  );
}