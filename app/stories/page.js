
import SiteHeader from "@/components/SiteHeader";
import SiteShell from "@/components/SiteShell";
import FilterableIndex from "@/components/FilterableIndex";
import { Suspense } from "react";

export default function StoriesPage() {
    let stories = []
  return (
    <>
      <SiteHeader />

      <SiteShell eyebrow="Inserted Fiction" title="Stories">
        <p className="font-serif text-xl leading-9 text-[var(--muted)]">
          Recovered fragments, letters, rumors, witness accounts, myths, songs,
          and sourcebook vignettes will be collected here.
        </p>
        <Suspense fallback={<p className="mt-10 text-[var(--muted)]">Loading archive...</p>}>
        <FilterableIndex
            entries={stories}
            filters={[
                { key: "realm", label: "Realm" },
                { key: "factions", label: "Faction" },
            ]}
            emptyText="No factions records match the selected filters."
        />
        </Suspense>
        <div className="inserted-story mt-10">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-[var(--muted-gold)]">
            Coming Soon
          </p>

          <h2 className="mt-4 font-display text-4xl">
            The fragments are still being catalogued.
          </h2>

          <p className="mt-6 max-w-3xl font-serif text-xl leading-9 text-[var(--muted)]">
            Some stories survive as letters. Some as rumors. Some as testimony
            from people who understood only part of what they saw.
          </p>
        </div>
      </SiteShell>

    </>
  );
}