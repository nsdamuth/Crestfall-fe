"use client";

import PublicProfileTabsView from "@/components/studio/profile/public-profile-tabs/PublicProfileTabs.view";
import {
  publicProfileTabsActivityFixture,
  publicProfileTabsBadgesFixture,
} from "@/components/studio/profile/public-profile-tabs/PublicProfileTabs.fixtures";
import { usePublicProfileTabsViewModel } from "@/components/studio/profile/public-profile-tabs/usePublicProfileTabsViewModel";

function PreviewSlot({ label, description }) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-black/25 p-8">
      <p className="font-display text-2xl">{label}</p>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
        {description}
      </p>
    </div>
  );
}

function InteractivePreview() {
  const viewProps = usePublicProfileTabsViewModel();
  const descriptions = {
    creations: "The application-owned public Creation grid is injected here.",
    activity: "The application-owned public Activity feed is injected here.",
    badges: "The application-owned badge collection is injected here.",
  };

  return (
    <PublicProfileTabsView
      {...viewProps}
      contentSlot={
        <PreviewSlot
          label={`${viewProps.title} slot`}
          description={descriptions[viewProps.activeTab]}
        />
      }
    />
  );
}

function StaticFixture({ fixture }) {
  return (
    <PublicProfileTabsView
      {...fixture}
      contentSlot={
        <PreviewSlot
          label={fixture.contentLabel}
          description="Static fixture showing the display-ready contract for this selected state."
        />
      }
    />
  );
}

export default function PublicProfileTabsPreviewClient() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-5 py-10 text-[var(--foreground)] md:px-10">
      <div className="mx-auto max-w-6xl space-y-14">
        <header>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            LOOM Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Public Profile Tabs</h1>
          <p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">
            Portable tab navigation with application-owned profile surfaces injected through one semantic slot.
          </p>
        </header>

        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-gold)]">
            Interactive Tabs
          </p>
          <InteractivePreview />
        </section>

        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-gold)]">
            Activity Fixture
          </p>
          <StaticFixture fixture={publicProfileTabsActivityFixture} />
        </section>

        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-gold)]">
            Badges Fixture
          </p>
          <StaticFixture fixture={publicProfileTabsBadgesFixture} />
        </section>
      </div>
    </main>
  );
}
