"use client";

import AccountStubPageView from "@/components/studio/account/account-stub-page/AccountStubPage.view";
import {
  accountStubLongContentFixture,
  accountStubNoCardsFixture,
  accountStubNoDescriptionFixture,
  accountStubNoNoticeFixture,
  accountStubSubscriptionFixture,
} from "@/components/studio/account/account-stub-page/AccountStubPage.fixtures";

const PREVIEW_STATES = [
  {
    label: "Subscription Placeholder",
    props: accountStubSubscriptionFixture,
  },
  {
    label: "No Cards",
    props: accountStubNoCardsFixture,
  },
  {
    label: "No Description",
    props: accountStubNoDescriptionFixture,
  },
  {
    label: "No Notice",
    props: accountStubNoNoticeFixture,
  },
  {
    label: "Long Content",
    props: accountStubLongContentFixture,
  },
];

export default function AccountStubPagePreviewClient() {
  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-12">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Account Stub Page</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Account placeholder View directly
            from contract-shaped fixtures. It does not connect billing,
            preferences, notifications, privacy, moderation, APIs, services,
            or persistence.
          </p>
        </header>

        {PREVIEW_STATES.map((state) => (
          <section
            key={state.label}
            className="rounded-2xl border border-white/10 bg-black/15 p-4 sm:p-6"
          >
            <p className="mb-6 text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              {state.label}
            </p>
            <AccountStubPageView {...state.props} />
          </section>
        ))}

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only visible page copy, placeholder cards, and
            local hash navigation. Account services and all saved-setting
            behavior remain application-owned and intentionally disconnected.
          </p>
        </section>
      </div>
    </main>
  );
}
