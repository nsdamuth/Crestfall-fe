"use client";

import { useState } from "react";

import CreationTagFilterRowView from "@/components/studio/creations/creation-tag-filter-row/CreationTagFilterRow.view";
import {
  creationTagFilterRowActiveFixture,
  creationTagFilterRowCaseInsensitiveFixture,
  creationTagFilterRowCustomLabelsFixture,
  creationTagFilterRowDefaultFixture,
  creationTagFilterRowEmptyFixture,
  creationTagFilterRowLongContentFixture,
  creationTagFilterRowSingleTagFixture,
} from "@/components/studio/creations/creation-tag-filter-row/CreationTagFilterRow.fixtures";

const PREVIEW_STATES = {
  default: {
    label: "Default",
    props: creationTagFilterRowDefaultFixture,
  },
  active: {
    label: "Active Tag",
    props: creationTagFilterRowActiveFixture,
  },
  single: {
    label: "Single Tag",
    props: creationTagFilterRowSingleTagFixture,
  },
  custom: {
    label: "Custom Labels",
    props: creationTagFilterRowCustomLabelsFixture,
  },
  caseInsensitive: {
    label: "Case Match",
    props: creationTagFilterRowCaseInsensitiveFixture,
  },
  longContent: {
    label: "Long Content",
    props: creationTagFilterRowLongContentFixture,
  },
  empty: {
    label: "Empty",
    props: creationTagFilterRowEmptyFixture,
  },
};

function cloneFixture(fixture) {
  return {
    ...fixture,
    tags: [...fixture.tags],
  };
}

export default function CreationTagFilterRowPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("default");
  const [rowProps, setRowProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.default.props)
  );
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No creation filter is connected."
  );

  function openState(stateKey) {
    const nextState = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setRowProps(cloneFixture(nextState.props));
    setLastAction(`Opened the ${nextState.label} fixture.`);
  }

  function chooseTag(tagValue) {
    setRowProps((current) => ({
      ...current,
      activeTag: tagValue,
    }));
    setLastAction(`Selected ${tagValue} in local preview state.`);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Creation Tag Filter Row
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the shared portable View directly from
            contract-shaped fixtures. Tag selection changes local preview
            state only; Community and My Creations filtering are not connected.
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
                className={`rounded-xl border px-4 py-3 text-xs uppercase tracking-[0.16em] transition ${
                  activeStateKey === stateKey
                    ? "border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/10 text-[var(--foreground)]"
                    : "border-white/10 text-[var(--muted)] hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
                }`}
              >
                {state.label}
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            {lastAction}
          </p>
        </section>

        <section className="min-h-36 rounded-2xl border border-white/10 bg-black/25 p-5">
          <CreationTagFilterRowView
            {...rowProps}
            onTagChange={chooseTag}
          />

          {!rowProps.tags.length ? (
            <p className="text-sm leading-6 text-[var(--muted)]">
              The portable View correctly returned no UI for the empty fixture.
            </p>
          ) : null}
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only tag strings, the active value, display labels,
            and semantic tag-selection intent. Filtering, routing, APIs,
            visibility rules, and persistence remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
