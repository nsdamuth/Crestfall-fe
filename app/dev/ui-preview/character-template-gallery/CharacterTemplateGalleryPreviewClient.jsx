"use client";

import CharacterTemplateGalleryView from "@/components/studio/templates/character-template-gallery/CharacterTemplateGallery.view";
import {
  characterTemplateGalleryDefaultFixture,
  characterTemplateGalleryEmptyFixture,
  characterTemplateGalleryLongContentFixture,
  characterTemplateGalleryMissingOptionalCopyFixture,
  characterTemplateGalleryNoCreateRouteFixture,
  characterTemplateGallerySingleFixture,
} from "@/components/studio/templates/character-template-gallery/CharacterTemplateGallery.fixtures";

const PREVIEW_STATES = [
  {
    label: "Current Built-In Gallery",
    props: characterTemplateGalleryDefaultFixture,
  },
  {
    label: "Single Template",
    props: characterTemplateGallerySingleFixture,
  },
  {
    label: "Missing Optional Copy",
    props: characterTemplateGalleryMissingOptionalCopyFixture,
  },
  {
    label: "No Create Route",
    props: characterTemplateGalleryNoCreateRouteFixture,
  },
  {
    label: "Empty Gallery",
    props: characterTemplateGalleryEmptyFixture,
  },
  {
    label: "Long Content",
    props: characterTemplateGalleryLongContentFixture,
  },
];

export default function CharacterTemplateGalleryPreviewClient() {
  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-12">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Character Template Gallery
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable gallery View directly from
            contract-shaped fixtures. Use Template and Duplicate remain disabled,
            and preview Create Template links use a local hash destination.
          </p>
        </header>

        {PREVIEW_STATES.map((state) => (
          <section key={state.label} className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              {state.label}
            </p>
            <CharacterTemplateGalleryView {...state.props} />
          </section>
        ))}

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only display-ready template cards, sidebar copy,
            future-action labels, and a safe preview destination. Template
            loading, use, duplication, permissions, APIs, and persistence remain
            application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
