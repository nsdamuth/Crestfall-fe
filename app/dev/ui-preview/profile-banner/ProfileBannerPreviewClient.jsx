"use client";

import ProfileBannerView from "@/components/studio/profile/profile-banner/ProfileBanner.view";
import {
  profileBannerCompactEmptyFixture,
  profileBannerCompactImageFixture,
  profileBannerEmptyFixture,
  profileBannerImageFixture,
  profileBannerLongTitleFixture,
} from "@/components/studio/profile/profile-banner/ProfileBanner.fixtures";

const PREVIEW_STATES = [
  {
    label: "Supplied Image",
    props: profileBannerImageFixture,
  },
  {
    label: "Compact Image",
    props: profileBannerCompactImageFixture,
  },
  {
    label: "Empty Banner Slot",
    props: profileBannerEmptyFixture,
  },
  {
    label: "Compact Empty Slot",
    props: profileBannerCompactEmptyFixture,
  },
  {
    label: "Long Accessible Title",
    props: profileBannerLongTitleFixture,
  },
];

export default function ProfileBannerPreviewClient() {
  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Profile Banner</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable banner View directly from
            contract-shaped fixtures. It does not load a profile, generate or
            upload media, call an API, or persist a banner.
          </p>
        </header>

        <section className="grid gap-5">
          {PREVIEW_STATES.map((state) => (
            <article
              key={state.label}
              className="rounded-2xl border border-white/10 bg-black/25 p-5"
            >
              <ProfileBannerView {...state.props} />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                  {state.label}
                </p>
                <p className="text-xs text-[var(--muted)]">
                  {state.props.compact ? "Compact" : "Regular"}
                </p>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only an optional banner URL, accessible title,
            and compact presentation flag. Profile loading, media generation,
            selection, storage, permissions, editing, APIs, and persistence
            remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
