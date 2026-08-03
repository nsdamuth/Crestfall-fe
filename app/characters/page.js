import SiteHeader from "@/components/SiteHeader";
import SiteShell from "@/components/SiteShell";
import { getCharacters } from "@/data/characters";
import FilterableIndex from "@/components/FilterableIndex";
import { Suspense } from "react";

export default function CharactersPage() {
    const characters = getCharacters();
  return (
    <>
      <SiteHeader />

      <SiteShell eyebrow="Dramatis Personae" title="Characters">
        <p className="font-serif text-xl leading-9 text-[var(--muted)]">
          Companions, rivals, patrons, monsters, outsiders, and strange souls
          whose choices shape the story of Crestfall.
        </p>
        <Suspense fallback={<p className="mt-10 text-[var(--muted)]">Loading archive...</p>}>
        <FilterableIndex
            entries={characters}
            filters={[
            { key: "realm", label: "Realm" },
            { key: "gender", label: "Gender" },
            { key: "race", label: "Race" },
            { key: "timePeriodActive", label: "Active Era" },
            ]}
            emptyText="No character records match the selected filters."
        />
        </Suspense>
      </SiteShell>
    </>
  );
}