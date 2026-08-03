"use client";

import { useMemo, useState } from "react";

import RegistryLinkedCreationPickerModalView from "@/components/studio/create/structured-registry/registry-linked-creation-picker/RegistryLinkedCreationPickerModal.view";
import {
  registryLinkedCreationPickerEmptyFixture,
  registryLinkedCreationPickerErrorFixture,
  registryLinkedCreationPickerFixtureItems,
  registryLinkedCreationPickerLoadingFixture,
  registryLinkedCreationPickerLongContentFixture,
  registryLinkedCreationPickerPopulatedFixture,
  registryLinkedCreationPickerSearchEmptyFixture,
} from "@/components/studio/create/structured-registry/registry-linked-creation-picker/RegistryLinkedCreationPickerModal.fixtures";

const PREVIEW_STATES = {
  populated: {
    label: "Populated",
    props: registryLinkedCreationPickerPopulatedFixture,
  },
  loading: {
    label: "Loading",
    props: registryLinkedCreationPickerLoadingFixture,
  },
  empty: {
    label: "Empty",
    props: registryLinkedCreationPickerEmptyFixture,
  },
  error: {
    label: "Load Error",
    props: registryLinkedCreationPickerErrorFixture,
  },
  searchEmpty: {
    label: "No Search Results",
    props: registryLinkedCreationPickerSearchEmptyFixture,
  },
  longContent: {
    label: "Long Content",
    props: registryLinkedCreationPickerLongContentFixture,
  },
};

export default function RegistryLinkedCreationPickerPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No Crestfall registry, creation list, or attachment data is connected."
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
    const creations = normalizedQuery
      ? registryLinkedCreationPickerFixtureItems.filter((item) =>
          [item.title, item.subtitle, item.typeLabel]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        )
      : registryLinkedCreationPickerFixtureItems;

    return {
      ...activeState.props,
      searchQuery,
      creations,
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
    setLastAction("Modal closed. No registry or creation data was changed.");
  }

  function recordSelection(creationId) {
    setLastAction(
      `Creation ${creationId || "unknown"} selected. This was fixture-only and was not linked or saved.`
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
            Registry Linked Creation Picker
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from fixtures. It
            does not authenticate a user, load owned creations, inspect a
            registry entry, or persist an attachment.
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
            Fixture cards contain only display-ready creation content. Allowed
            type queries, raw creation fields, image fallback rules, selected
            registry IDs, and caller-specific attachment storage remain outside
            the View.
          </p>
        </section>
      </div>

      {previewProps ? (
        <RegistryLinkedCreationPickerModalView
          {...previewProps}
          onSearchQueryChange={(value) => {
            setSearchQuery(value);
            setLastAction(`Search changed to “${value}”.`);
          }}
          onClose={closePreview}
          onChooseCreation={recordSelection}
        />
      ) : null}
    </main>
  );
}
