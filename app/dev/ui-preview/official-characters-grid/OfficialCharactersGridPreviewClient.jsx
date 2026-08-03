"use client";

import { useMemo, useState } from "react";

import OfficialCharactersGridView from "@/components/studio/official-characters-grid/OfficialCharactersGrid.view";
import {
  officialCharactersGridDefaultFixture,
  officialCharactersGridEmptyLibraryFixture,
  officialCharactersGridLongContentFixture,
  officialCharactersGridNoResultsFixture,
  officialCharactersGridPaginationFixture,
} from "@/components/studio/official-characters-grid/OfficialCharactersGrid.fixtures";

const PREVIEW_STATES = [
  {
    label: "Interactive Character Search",
    props: officialCharactersGridDefaultFixture,
    interactive: true,
  },
  {
    label: "No Search Results",
    props: officialCharactersGridNoResultsFixture,
  },
  {
    label: "Empty Official Library",
    props: officialCharactersGridEmptyLibraryFixture,
  },
  {
    label: "Pagination — 30 Characters",
    props: officialCharactersGridPaginationFixture,
    interactive: true,
  },
  {
    label: "Long Content",
    props: officialCharactersGridLongContentFixture,
    interactive: true,
  },
];

function PreviewState({ state }) {
  const [query, setQuery] = useState(state.props.query || "");
  const sourceCards = state.props.cards;

  const cards = useMemo(() => {
    if (!state.interactive) return sourceCards;

    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return sourceCards;

    return sourceCards.filter((card) =>
      [card.title, card.eyebrow, card.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [query, sourceCards, state.interactive]);

  return (
    <section className="space-y-4">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        {state.label}
      </p>
      <OfficialCharactersGridView
        {...state.props}
        query={query}
        cards={cards}
        resultCount={state.interactive ? cards.length : state.props.resultCount}
        onChangeQuery={state.interactive ? setQuery : undefined}
      />
    </section>
  );
}

export default function OfficialCharactersGridPreviewClient() {
  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-12">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Official Characters Grid
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable search and grid View directly from
            display-ready card fixtures. Search is local to the preview, Details
            links use safe hash destinations, and Start remains disabled.
          </p>
        </header>

        {PREVIEW_STATES.map((state) => (
          <PreviewState key={state.label} state={state} />
        ))}

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            The View receives display-ready official-character cards, counts,
            search copy, and semantic query changes. Raw character fields,
            searchable-field selection, asset paths, routes, APIs, and
            persistence remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
