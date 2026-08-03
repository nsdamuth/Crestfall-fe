import SiteHeader from "@/components/SiteHeader";
import SiteShell from "@/components/SiteShell";
import LoreArcAccordion from "@/components/LoreArcAccordion";
import { getLoreArcGroups } from "@/data/lore";

export default function LorePage() {
  const arcGroups = getLoreArcGroups();

  return (
    <>
      <SiteHeader />

      <SiteShell eyebrow="The Codex" title="Lore">
        <p className="font-serif text-xl leading-9 text-[var(--muted)]">
          The historical and cosmological archive of Crestfall: origins, eras,
          crossings, myths, records, and unresolved fragments arranged as a
          living timeline.
        </p>

        <LoreArcAccordion arcGroups={arcGroups} />
      </SiteShell>
    </>
  );
}