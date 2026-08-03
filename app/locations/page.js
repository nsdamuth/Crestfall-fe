import SiteHeader from "@/components/SiteHeader";
import SiteShell from "@/components/SiteShell";
import { getLocations } from "@/data/locations";
import FilterableIndex from "@/components/FilterableIndex";
import { Suspense } from "react";

export default function LocationsPage() {
    const locations = getLocations();
  return (
    <>
      <SiteHeader />

      <SiteShell eyebrow="The Living Map" title="Locations">
        <p className="font-serif text-xl leading-9 text-[var(--muted)]">
          Roads, ruins, courts, crossings, hidden places, and dangerous old
          landmarks recorded across Crestfall.
        </p>
        <Suspense fallback={<p className="mt-10 text-[var(--muted)]">Loading archive...</p>}>
            <FilterableIndex
                entries={locations}
                filters={[
                    { key: "realm", label: "Realm" },
                    { key: "factions", label: "Faction" },
                    { key: "themes", label: "Theme" },
                    ]}
                emptyText="No locations records match the selected filters."
            />
        </Suspense>

      </SiteShell>
    </>
  );
}