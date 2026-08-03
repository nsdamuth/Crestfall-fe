"use client";

import PaginatedCardGrid from "@/components/PaginatedCardGrid";
import StudioCharacterCardView from "@/components/studio/studio-character-card/StudioCharacterCard.view";

export default function OfficialCharactersGridView({
  query = "",
  resultCount = 0,
  totalCount = 0,
  cards = [],
  searchEyebrow = "Character Search",
  searchPlaceholder = "Search name, faction, tag, realm...",
  emptyTitle = "No characters found",
  emptyMessage =
    "Try searching by character name, faction, realm, tag, or theme.",
  LinkComponent = "a",
  onChangeQuery,
}) {
  const safeCards = Array.isArray(cards) ? cards : [];
  const safeResultCount = Number.isFinite(Number(resultCount))
    ? Number(resultCount)
    : safeCards.length;
  const safeTotalCount = Number.isFinite(Number(totalCount))
    ? Number(totalCount)
    : safeCards.length;

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-[var(--muted-gold)]/15 bg-black/35 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            {searchEyebrow}
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {safeResultCount} of {safeTotalCount} official characters shown
          </p>
        </div>

        <input
          type="search"
          value={query}
          onChange={(event) => onChangeQuery?.(event.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-full border border-[var(--muted-gold)]/20 bg-black/60 px-5 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)]/60 focus:border-[var(--muted-gold)]/60 sm:max-w-md"
        />
      </div>

      {safeCards.length > 0 ? (
        <PaginatedCardGrid
          items={safeCards}
          initialCount={24}
          batchSize={12}
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
          renderItem={(card) => (
            <StudioCharacterCardView
              key={card.id}
              {...card}
              LinkComponent={LinkComponent}
            />
          )}
        />
      ) : (
        <div className="rounded-2xl border border-white/10 bg-black/35 p-8 text-center">
          <h2 className="font-display text-2xl">{emptyTitle}</h2>
          <p className="mt-3 text-[var(--muted)]">{emptyMessage}</p>
        </div>
      )}
    </>
  );
}
