"use client";

import ProfileAvatarView from "@/components/studio/profile/profile-avatar/ProfileAvatar.view";
import {
  profileAvatarEmptyNameFixture,
  profileAvatarImageFixture,
  profileAvatarLargeInitialFixture,
  profileAvatarLongNameFixture,
  profileAvatarMediumInitialFixture,
  profileAvatarSmallInitialFixture,
} from "@/components/studio/profile/profile-avatar/ProfileAvatar.fixtures";

const PREVIEW_STATES = [
  {
    label: "Supplied Image",
    props: profileAvatarImageFixture,
  },
  {
    label: "Large Initial",
    props: profileAvatarLargeInitialFixture,
  },
  {
    label: "Medium Initial",
    props: profileAvatarMediumInitialFixture,
  },
  {
    label: "Small Initial",
    props: profileAvatarSmallInitialFixture,
  },
  {
    label: "Empty Display Name",
    props: profileAvatarEmptyNameFixture,
  },
  {
    label: "Long Accessible Name",
    props: profileAvatarLongNameFixture,
  },
];

export default function ProfileAvatarPreviewClient() {
  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Profile Avatar</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable avatar View directly from
            contract-shaped fixtures. It does not load a profile, upload media,
            call an API, or persist an avatar.
          </p>
        </header>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PREVIEW_STATES.map((state) => (
            <article
              key={state.label}
              className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/25 p-6 text-center"
            >
              <ProfileAvatarView {...state.props} />
              <p className="mt-5 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                {state.label}
              </p>
              <p className="mt-2 text-xs text-[var(--muted)]">
                Size: {state.props.size}
              </p>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only a display name, optional avatar URL, and
            visual size. Profile loading, uploads, storage, permissions,
            editing, APIs, and persistence remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
