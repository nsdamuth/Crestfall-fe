"use client";

import { useState } from "react";
import PublicProfileActivityFeedView from "@/components/studio/profile/public-profile-activity-feed/PublicProfileActivityFeed.view";
import {
  PUBLIC_PROFILE_ACTIVITY_FEED_FIXTURES,
  getPublicProfileActivityFeedFixture,
} from "@/components/studio/profile/public-profile-activity-feed/PublicProfileActivityFeed.fixtures";

export default function PublicProfileActivityFeedPreviewClient() {
  const [fixtureId, setFixtureId] = useState(
    PUBLIC_PROFILE_ACTIVITY_FEED_FIXTURES[0].id
  );
  const fixture = getPublicProfileActivityFeedFixture(fixtureId);

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-white/10 bg-black/35 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Loom Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Public Profile Activity Feed
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">
            Fixture events are display-only. Creation links use local preview
            hashes and no profile, creation, donation, or engagement data is
            loaded.
          </p>

          <label className="mt-5 block max-w-sm">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
              Fixture
            </span>
            <select
              value={fixtureId}
              onChange={(event) => setFixtureId(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-[var(--foreground)] outline-none"
            >
              {PUBLIC_PROFILE_ACTIVITY_FEED_FIXTURES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <PublicProfileActivityFeedView {...fixture.props} />
      </div>
    </main>
  );
}
