"use client";

import { useState } from "react";

import FilterableIndexView from "@/components/filterable-index/FilterableIndex.view";
import {
  filterableIndexFixture,
  filterableIndexFixtureStates,
} from "@/components/filterable-index/FilterableIndex.fixtures";
import useFilterableIndexViewModel from "@/components/filterable-index/useFilterableIndexViewModel";

const STATE_OPTIONS = [
  { id: "all", label: "All records" },
  { id: "search", label: "Search" },
  { id: "filtered", label: "Dropdown filters" },
  { id: "tagged", label: "Multiple tags" },
  { id: "empty", label: "Empty result" },
];

export default function FilterableIndexPreviewClient() {
  const [stateKey, setStateKey] = useState("all");
  const [queryString, setQueryString] = useState(
    filterableIndexFixtureStates.all
  );

  const viewProps = useFilterableIndexViewModel({
    ...filterableIndexFixture,
    pathname: "/dev/ui-preview/filterable-index",
    queryString,
    onReplaceUrl: (href) => {
      const queryIndex = href.indexOf("?");
      setQueryString(queryIndex >= 0 ? href.slice(queryIndex + 1) : "");
    },
  });

  function selectState(nextStateKey) {
    setStateKey(nextStateKey);
    setQueryString(filterableIndexFixtureStates[nextStateKey]);
  }

  return (
    <main className="min-h-screen bg-[#050403] p-4 text-[var(--foreground)] sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Development-only LOOM preview
          </p>
          <h1 className="mt-2 font-display text-3xl">Filterable Index</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Exercises URL-shaped search, dropdown filters, tag intersections,
            empty results, and injected cards using local fixtures only.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {STATE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => selectState(option.id)}
                className={`rounded-xl border px-3 py-2 text-xs uppercase tracking-[0.14em] ${
                  stateKey === option.id
                    ? "border-[var(--muted-gold)]/55 bg-[var(--muted-gold)]/15"
                    : "border-white/10 bg-black/25 text-[var(--muted)]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <p className="mt-4 break-all font-mono text-xs text-[var(--muted)]">
            Query: {queryString || "(none)"}
          </p>
        </div>

        <FilterableIndexView
          {...viewProps}
          renderCard={(card) => (
            <article
              key={card.key}
              className="border border-[var(--border)] bg-[rgba(12,10,8,0.82)] p-6"
            >
              <p className="font-display text-xs uppercase tracking-[0.32em] text-[var(--muted-gold)]">
                {card.eyebrow}
              </p>
              <h2 className="mt-4 font-display text-2xl">{card.title}</h2>
              <p className="mt-4 font-serif text-lg leading-7 text-[var(--muted)]">
                {card.text}
              </p>
              <p className="mt-4 text-xs text-[var(--muted)]">{card.href}</p>
            </article>
          )}
        />
      </div>
    </main>
  );
}
