"use client";

import { useMemo, useState } from "react";

import OutfitPickerModalView from "@/components/studio/create/wardrobe/outfit-picker/OutfitPickerModal.view";
import {
  outfitPickerEmptyFixture,
  outfitPickerErrorFixture,
  outfitPickerLoadingFixture,
  outfitPickerLongContentFixture,
  outfitPickerPopulatedFixture,
  outfitPickerSearchEmptyFixture,
  outfitPickerWardrobeFixture,
} from "@/components/studio/create/wardrobe/outfit-picker/OutfitPickerModal.fixtures";

const PREVIEW_STATES = {
  populated: {
    label: "Outfits",
    props: outfitPickerPopulatedFixture,
  },
  wardrobe: {
    label: "Wardrobes",
    props: outfitPickerWardrobeFixture,
  },
  loading: {
    label: "Loading",
    props: outfitPickerLoadingFixture,
  },
  empty: {
    label: "Empty",
    props: outfitPickerEmptyFixture,
  },
  error: {
    label: "Load Error",
    props: outfitPickerErrorFixture,
  },
  searchEmpty: {
    label: "No Search Results",
    props: outfitPickerSearchEmptyFixture,
  },
  longContent: {
    label: "Long Content",
    props: outfitPickerLongContentFixture,
  },
};

export default function OutfitPickerPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No character, Outfit, Wardrobe, or wardrobe entry is connected."
  );

  const activeState = activeStateKey ? PREVIEW_STATES[activeStateKey] : null;

  const previewProps = useMemo(() => {
    if (!activeState) return null;

    const baseItems = activeState.props.items || [];
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filteredItems = normalizedQuery
      ? baseItems.filter((item) =>
          [item.title, item.subtitle, item.typeLabel, item.ratingLabel]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        )
      : baseItems;

    return {
      ...activeState.props,
      searchQuery,
      items: filteredItems.map((item) => ({
        ...item,
        isSelected: item.id === selectedId,
      })),
    };
  }, [activeState, searchQuery, selectedId]);

  function openState(stateKey) {
    const state = PREVIEW_STATES[stateKey];
    const initialSelection = (state.props.items || []).find(
      (item) => item.isSelected
    );

    setActiveStateKey(stateKey);
    setSearchQuery(state.props.searchQuery || "");
    setSelectedId(initialSelection?.id || "");
    setLastAction(`Opened the ${state.label} fixture.`);
  }

  function closePreview() {
    setActiveStateKey(null);
    setSearchQuery("");
    setSelectedId("");
    setLastAction("Modal closed. No clothing selection was changed.");
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Outfit Picker</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from fixtures. It
            does not authenticate a user, load owned creations, or update a
            character, Outfit, Wardrobe, or wardrobe entry.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Preview States
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {Object.entries(PREVIEW_STATES).map(([stateKey, state]) => (
              <button
                key={stateKey}
                type="button"
                onClick={() => openState(stateKey)}
                className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
              >
                {state.label}
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            {lastAction}
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixture cards contain display-ready clothing content only. Raw
            creations, creation-type queries, wardrobe-entry data, default
            clothing fields, and caller-specific normalization remain outside
            the View.
          </p>
        </section>
      </div>

      {previewProps ? (
        <OutfitPickerModalView
          {...previewProps}
          onSearchQueryChange={(value) => {
            setSearchQuery(value);
            setLastAction(`Search changed to “${value}”.`);
          }}
          onChooseItem={(itemId) => {
            setSelectedId(itemId || "");
            setLastAction(
              `Clothing item ${itemId || "unknown"} selected in fixture-only state.`
            );
          }}
          onClose={closePreview}
        />
      ) : null}
    </main>
  );
}
