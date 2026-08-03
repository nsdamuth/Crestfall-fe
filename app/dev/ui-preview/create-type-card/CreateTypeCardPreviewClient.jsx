"use client";

import CreateTypeCardView from "@/components/studio/create/create-type-card/CreateTypeCard.view";
import {
  createTypeCardCharacterFixture,
  createTypeCardDisabledFixture,
  createTypeCardLongContentFixture,
  createTypeCardNoEyebrowFixture,
  createTypeCardNoImageFixture,
  createTypeCardRegistryFixture,
} from "@/components/studio/create/create-type-card/CreateTypeCard.fixtures";

const PREVIEW_STATES = [
  {
    label: "Image-Backed Character",
    props: createTypeCardCharacterFixture,
  },
  {
    label: "Registry",
    props: createTypeCardRegistryFixture,
  },
  {
    label: "Disabled",
    props: createTypeCardDisabledFixture,
  },
  {
    label: "No Image",
    props: createTypeCardNoImageFixture,
  },
  {
    label: "No Eyebrow",
    props: createTypeCardNoEyebrowFixture,
  },
  {
    label: "Long Content",
    props: createTypeCardLongContentFixture,
  },
];

export default function CreateTypeCardPreviewClient() {
  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Create Type Card</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable creation-type card directly from
            contract-shaped fixtures. Enabled cards use preview hashes; no real
            builder, route workflow, API, or persistence is connected.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {PREVIEW_STATES.map((state) => (
            <div key={state.label} className="space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
                {state.label}
              </p>
              <CreateTypeCardView {...state.props} />
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only visible card content, an optional image, a
            supplied destination, and disabled state. Creation-type discovery,
            section grouping, route selection, permissions, builder startup,
            APIs, and persistence remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
