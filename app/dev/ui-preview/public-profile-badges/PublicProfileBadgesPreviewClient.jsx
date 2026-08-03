"use client";

import { useState } from "react";
import PublicProfileBadgesView from "@/components/studio/profile/public-profile-badges/PublicProfileBadges.view";
import {
  PUBLIC_PROFILE_BADGES_FIXTURES,
  getPublicProfileBadgesFixture,
} from "@/components/studio/profile/public-profile-badges/PublicProfileBadges.fixtures";

export default function PublicProfileBadgesPreviewClient() {
  const [fixtureId, setFixtureId] = useState(
    PUBLIC_PROFILE_BADGES_FIXTURES[0].id
  );
  const fixture = getPublicProfileBadgesFixture(fixtureId);

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-white/10 bg-black/35 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Loom Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Public Profile Badges
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">
            Fixtures are display-only and do not load profiles, badge
            assignments, services, or database records.
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
              {PUBLIC_PROFILE_BADGES_FIXTURES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <PublicProfileBadgesView {...fixture.props} />
      </div>
    </main>
  );
}
