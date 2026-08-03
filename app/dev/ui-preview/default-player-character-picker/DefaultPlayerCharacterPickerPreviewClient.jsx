"use client";

import { useMemo, useState } from "react";

import DefaultPlayerCharacterPickerModalView from "@/components/studio/account/default-player-character-picker/DefaultPlayerCharacterPickerModal.view";
import {
  defaultPlayerCharacterPickerEmptyFixture,
  defaultPlayerCharacterPickerErrorFixture,
  defaultPlayerCharacterPickerFixtureItems,
  defaultPlayerCharacterPickerLoadingFixture,
  defaultPlayerCharacterPickerLongContentFixture,
  defaultPlayerCharacterPickerPopulatedFixture,
  defaultPlayerCharacterPickerSearchEmptyFixture,
} from "@/components/studio/account/default-player-character-picker/DefaultPlayerCharacterPickerModal.fixtures";

const PREVIEW_STATES = {
  populated: {
    label: "Populated",
    props: defaultPlayerCharacterPickerPopulatedFixture,
  },
  loading: {
    label: "Loading",
    props: defaultPlayerCharacterPickerLoadingFixture,
  },
  empty: {
    label: "Empty",
    props: defaultPlayerCharacterPickerEmptyFixture,
  },
  error: {
    label: "Load Error",
    props: defaultPlayerCharacterPickerErrorFixture,
  },
  searchEmpty: {
    label: "No Search Results",
    props: defaultPlayerCharacterPickerSearchEmptyFixture,
  },
  longContent: {
    label: "Long Content",
    props: defaultPlayerCharacterPickerLongContentFixture,
  },
};

export default function DefaultPlayerCharacterPickerPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No Crestfall account, creation list, or story room is connected."
  );

  const activeState = activeStateKey ? PREVIEW_STATES[activeStateKey] : null;

  const previewProps = useMemo(() => {
    if (!activeState) return null;

    if (activeStateKey !== "populated") {
      return {
        ...activeState.props,
        searchQuery,
      };
    }

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const playerCharacters = normalizedQuery
      ? defaultPlayerCharacterPickerFixtureItems.filter((item) =>
          [item.title, item.description]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        )
      : defaultPlayerCharacterPickerFixtureItems;

    return {
      ...activeState.props,
      searchQuery,
      playerCharacters,
    };
  }, [activeState, activeStateKey, searchQuery]);

  function openState(stateKey) {
    const state = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setSearchQuery(state.props.searchQuery || "");
    setLastAction(`Opened the ${state.label} fixture.`);
  }

  function closePreview() {
    setActiveStateKey(null);
    setSearchQuery("");
    setLastAction("Modal closed. No application data was changed.");
  }

  function recordSelection(playerCharacterId) {
    setLastAction(
      `Player Character ${playerCharacterId || "unknown"} selected. This was fixture-only and was not assigned or saved.`
    );
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Default Player Character Picker
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from fixtures. It
            does not authenticate a user, load owned creations, update an
            account profile, or assign a story-room Player Character.
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
            Fixture cards contain only display-ready identity content. Owned
            creation loading, raw data-field search, image fallback rules,
            profile defaults, and story-room assignment remain outside the
            View.
          </p>
        </section>
      </div>

      {previewProps ? (
        <DefaultPlayerCharacterPickerModalView
          {...previewProps}
          onSearchQueryChange={(value) => {
            setSearchQuery(value);
            setLastAction(`Search changed to “${value}”.`);
          }}
          onClose={closePreview}
          onChoosePlayerCharacter={recordSelection}
        />
      ) : null}
    </main>
  );
}
