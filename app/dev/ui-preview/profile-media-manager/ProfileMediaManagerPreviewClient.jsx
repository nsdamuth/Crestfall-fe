"use client";

import ProfileMediaManagerView from "@/components/studio/profile/profile-media-manager/ProfileMediaManager.view";
import {
  profileMediaManagerDefaultFixture,
  profileMediaManagerGenericFallbackFixture,
  profileMediaManagerLongContentFixture,
  profileMediaManagerMinimalCopyFixture,
  profileMediaManagerUsernameFixture,
} from "@/components/studio/profile/profile-media-manager/ProfileMediaManager.fixtures";

const PREVIEW_STATES = [
  {
    label: "Display Name",
    props: profileMediaManagerDefaultFixture,
  },
  {
    label: "Username Fallback",
    props: profileMediaManagerUsernameFixture,
  },
  {
    label: "Generic Fallback",
    props: profileMediaManagerGenericFallbackFixture,
  },
  {
    label: "Long Content",
    props: profileMediaManagerLongContentFixture,
  },
  {
    label: "Minimal Copy",
    props: profileMediaManagerMinimalCopyFixture,
  },
];

export default function ProfileMediaManagerPreviewClient() {
  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Profile Media Manager
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Profile Media View directly from
            contract-shaped fixtures. It does not load a profile, upload or
            generate media, call an API, or persist avatar or banner choices.
          </p>
        </header>

        <section className="grid gap-6">
          {PREVIEW_STATES.map((state) => (
            <article
              key={state.label}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                {state.label}
              </p>
              <ProfileMediaManagerView {...state.props} />
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only display-ready panel, avatar, banner, and
            disabled-action values. Raw profile fields, generated-media
            selection, upload, storage, permissions, APIs, and persistence
            remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
