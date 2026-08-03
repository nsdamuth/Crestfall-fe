"use client";

import { Grid2X2, Search } from "lucide-react";

export default function MyCreationsHubView({
  eyebrow = "Creation Library",
  filterBody =
    "Creations start private by default. Publish, share, submit for review, or submit to canon later from the individual creation.",
  queryPlaceholder = "Search your creations...",
  createHref = "/studio/create",
  createLabel = "Create New",
  emptyActionLabel = "Start Creating",
  tagFilterLabel = "Your Tags",
  allTagValue = "ALL",
  tabs = [],
  activeTab = "ALL",
  activeTag = "ALL",
  query = "",
  ownedCreationTags = [],
  visibleCreations = [],
  filteredCreationCount = 0,
  remainingCreationCount = 0,
  nextLoadCount = 0,
  isMobileCompactGrid = true,
  mobileGridToggleLabel = "Large",
  creationGridClass =
    "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
  engagementMessage = "",
  eagerCreationImageCount = 4,
  isCreationLiked = () => false,
  isCreationBookmarked = () => false,
  toggleCreationLike = null,
  toggleCreationBookmark = null,
  onActiveTabChange = null,
  onActiveTagChange = null,
  onQueryChange = null,
  onToggleMobileGridMode = null,
  onLoadMore = null,
  InternalLinkComponent = "a",
  FilterPanelComponent = "div",
  TagFilterComponent = null,
  CreationCardComponent = null,
}) {
  const safeTabs = Array.isArray(tabs) ? tabs : [];
  const safeTags = Array.isArray(ownedCreationTags)
    ? ownedCreationTags
    : [];
  const safeCreations = Array.isArray(visibleCreations)
    ? visibleCreations
    : [];
  const hasActiveTag =
    activeTag && String(activeTag).toLowerCase() !== "all";

  return (
    <section className="mt-8">
      <FilterPanelComponent
        eyebrow={eyebrow}
        body={filterBody}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onToggleMobileGridMode || undefined}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)] md:hidden"
            >
              <Grid2X2 size={14} />
              {mobileGridToggleLabel}
            </button>

            <InternalLinkComponent
              href={createHref}
              className="rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
            >
              {createLabel}
            </InternalLinkComponent>
          </div>
        }
      >
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3">
          <Search size={16} className="text-[var(--muted-gold)]" />
          <input
            value={query}
            onChange={(event) => onQueryChange?.(event.target.value)}
            placeholder={queryPlaceholder}
            className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
          />
        </div>

        {TagFilterComponent ? (
          <div className="mt-5">
            <TagFilterComponent
              tags={safeTags}
              activeTag={activeTag}
              onTagChange={onActiveTagChange}
              allValue={allTagValue}
              label={tagFilterLabel}
            />
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
          {safeTabs.map((tab) => {
            const active = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onActiveTabChange?.(tab.id)}
                className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
                  active
                    ? "border-[var(--muted-gold)]/55 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                    : "border-white/10 bg-black/25 text-[var(--muted)] hover:border-[var(--muted-gold)]/30 hover:text-[var(--foreground)]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </FilterPanelComponent>

      {engagementMessage ? (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {engagementMessage}
        </p>
      ) : null}

      <div className={`mt-6 grid gap-3 sm:gap-5 ${creationGridClass}`}>
        {filteredCreationCount > 0 && CreationCardComponent ? (
          safeCreations.map((creation, index) => (
            <CreationCardComponent
              key={creation.id}
              creation={creation}
              context="owner"
              mobileCompact={isMobileCompactGrid}
              priority={index < eagerCreationImageCount}
              liked={isCreationLiked(creation)}
              bookmarked={isCreationBookmarked(creation)}
              onToggleLike={toggleCreationLike}
              onToggleBookmark={toggleCreationBookmark}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/25 p-8 text-center sm:col-span-2 lg:col-span-3 2xl:col-span-4">
            <p className="font-display text-3xl">No creations here yet</p>
            <p className="mx-auto mt-3 max-w-2xl leading-7 text-[var(--muted)]">
              This section will populate once creation drafts are saved. Current
              tab:{" "}
              <span className="text-[var(--muted-gold)]">{activeTab}</span>
              {hasActiveTag ? (
                <>
                  {" "}/ active tag:{" "}
                  <span className="text-[var(--muted-gold)]">
                    {activeTag}
                  </span>
                </>
              ) : null}
              .
            </p>

            <InternalLinkComponent
              href={createHref}
              className="mt-6 inline-block rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
            >
              {emptyActionLabel}
            </InternalLinkComponent>
          </div>
        )}
      </div>

      {remainingCreationCount > 0 ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore || undefined}
            className="rounded-xl border border-[var(--muted-gold)]/30 bg-[var(--muted-gold)]/10 px-5 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
          >
            Load {nextLoadCount} More
          </button>
        </div>
      ) : null}
    </section>
  );
}
