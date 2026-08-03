import SiteHeader from "@/components/SiteHeader";
import SiteShell from "@/components/SiteShell";
import { getFactions } from "@/data/factions";
import FilterableIndex from "@/components/FilterableIndex";
import { Suspense } from "react";

export default function FactionsPage() {
    const factions = getFactions();
  return (
    <>
      <SiteHeader />

      <SiteShell eyebrow="Powers & Patronage" title="Factions">
        <p className="font-serif text-xl leading-9 text-[var(--muted)]">
          Orders, tribes, courts, guilds, houses, faiths, patrons, and hidden
          powers moving beneath the visible world.
        </p>
        <Suspense fallback={<p className="mt-10 text-[var(--muted)]">Loading archive...</p>}>
            <FilterableIndex
                entries={factions}
                filters={[
                { key: "realm", label: "Realm" },
                ]}
                emptyText="No factions records match the selected filters."
            />
        </Suspense>
      </SiteShell>
    </>
  );
}