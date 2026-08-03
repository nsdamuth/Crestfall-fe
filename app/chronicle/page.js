import SiteHeader from "@/components/SiteHeader";
import SiteShell from "@/components/SiteShell";
import FilterableIndex from "@/components/FilterableIndex";
import { Suspense } from "react";

export default function ChroniclePage() {
    let chronicles = []
    return (
    <>
      <SiteHeader />

      <SiteShell eyebrow="The Story So Far" title="Chronicle">
        <p className="font-serif text-xl leading-9 text-[var(--muted)]">
          The ongoing living record of Crestfall’s active story, current arcs,
          major developments, and chapter-by-chapter progression.
        </p>
        <Suspense fallback={<p className="mt-10 text-[var(--muted)]">Loading archive...</p>}>
            <FilterableIndex
                entries={chronicles}
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
            The current age is still unfolding.
          </h2>

          <p className="mt-6 max-w-3xl font-serif text-xl leading-9 text-[var(--muted)]">
            When the active narrative begins, its major events and chapter
            updates will be recorded here.
          </p>
        </div>
      </SiteShell>
    </>
  );
}