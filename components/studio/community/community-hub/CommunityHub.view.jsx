"use client";

import { LayoutGrid, List, Search } from "lucide-react";

function PillButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick || undefined}
      className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
        active
          ? "border-[var(--muted-gold)]/55 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
          : "border-white/10 bg-black/25 text-[var(--muted)] hover:border-[var(--muted-gold)]/30 hover:text-[var(--foreground)]"
      }`}
    >
      {children}
    </button>
  );
}

function LoadMoreButton({ nextLoadCount, onClick }) {
  return (
    <div className="mt-6 flex justify-center">
      <button
        type="button"
        onClick={onClick || undefined}
        className="rounded-xl border border-[var(--muted-gold)]/30 bg-[var(--muted-gold)]/10 px-5 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
      >
        Load {nextLoadCount} More
      </button>
    </div>
  );
}

export default function CommunityHubView({
  eyebrow = "Community Browser",
  filterBody =
    "Browse public creations and creator profiles. Featured is a curation layer, not a separate content type.",
  mode = "CREATIONS",
  query = "",
  queryPlaceholder = "Search creations, creators, tags...",
  activeTag = "ALL",
  activeType = "ALL",
  activeCreationFilter = "ALL",
  activeCreatorFilter = "ALL",
  creatorView = "GRID",
  creationTypes = [],
  creationFilters = [],
  creatorFilters = [],
  sortOptions = [],
  ratingOptions = [],
  renderingOptions = [],
  topCommunityTags = [],
  sort = "RECOMMENDED",
  rating = "ALL",
  rendering = "ALL",
  visibleCommunityCreations = [],
  visibleCommunityCreators = [],
  filteredCreationCount = 0,
  filteredCreatorCount = 0,
  remainingCommunityCreationCount = 0,
  remainingCommunityCreatorCount = 0,
  nextCreationLoadCount = 0,
  nextCreatorLoadCount = 0,
  isMobileCompactCreationGrid = true,
  mobileCreationGridToggleLabel = "Large",
  creationGridClass =
    "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
  creatorGridClass = "grid-cols-1 lg:grid-cols-2",
  engagementMessage = "",
  eagerCreationImageCount = 4,
  isCreationLiked = () => false,
  isCreationBookmarked = () => false,
  toggleCreationLike = null,
  toggleCreationBookmark = null,
  isProfileLiked = () => false,
  isProfileBookmarked = () => false,
  isProfileFollowed = () => false,
  toggleProfileLike = null,
  toggleProfileBookmark = null,
  toggleProfileFollow = null,
  onModeChange = null,
  onQueryChange = null,
  onActiveTagChange = null,
  onActiveTypeChange = null,
  onActiveCreationFilterChange = null,
  onActiveCreatorFilterChange = null,
  onCreatorViewChange = null,
  onSortChange = null,
  onRatingChange = null,
  onRenderingChange = null,
  onToggleMobileCreationGridMode = null,
  onLoadMoreCreations = null,
  onLoadMoreCreators = null,
  FilterPanelComponent = "div",
  SelectComponent = "select",
  TagFilterComponent = null,
  CreationCardComponent = null,
  CreatorCardComponent = null,
  CreatorListRowComponent = null,
}) {
  const safeCreationTypes = Array.isArray(creationTypes) ? creationTypes : [];
  const safeCreationFilters = Array.isArray(creationFilters)
    ? creationFilters
    : [];
  const safeCreatorFilters = Array.isArray(creatorFilters) ? creatorFilters : [];
  const safeCreations = Array.isArray(visibleCommunityCreations)
    ? visibleCommunityCreations
    : [];
  const safeCreators = Array.isArray(visibleCommunityCreators)
    ? visibleCommunityCreators
    : [];

  return (
    <section className="mt-8">
      <FilterPanelComponent
        eyebrow={eyebrow}
        body={filterBody}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {mode === "CREATIONS" ? (
              <button
                type="button"
                onClick={onToggleMobileCreationGridMode || undefined}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)] md:hidden"
              >
                <LayoutGrid size={14} />
                {mobileCreationGridToggleLabel}
              </button>
            ) : null}

            <div className="flex rounded-xl border border-white/10 bg-black/30 p-1">
              {[
                ["CREATIONS", "Creations"],
                ["CREATORS", "Creators"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onModeChange?.(id)}
                  className={`rounded-lg px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
                    mode === id
                      ? "bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
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

        {mode === "CREATIONS" ? (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              {TagFilterComponent ? (
                <TagFilterComponent
                  tags={topCommunityTags}
                  activeTag={activeTag}
                  onTagChange={onActiveTagChange}
                  label="Popular Tags"
                />
              ) : null}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {safeCreationTypes.map((type) => (
                <PillButton
                  key={type.id}
                  active={activeType === type.id}
                  onClick={() => onActiveTypeChange?.(type.id)}
                >
                  {type.label}
                </PillButton>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {safeCreationFilters.map((filter) => (
                <PillButton
                  key={filter.id}
                  active={activeCreationFilter === filter.id}
                  onClick={() => onActiveCreationFilterChange?.(filter.id)}
                >
                  {filter.label}
                </PillButton>
              ))}
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <SelectComponent
                label="Sort"
                value={sort}
                onChange={onSortChange}
                options={sortOptions}
              />
              <SelectComponent
                label="Rating"
                value={rating}
                onChange={onRatingChange}
                options={ratingOptions}
              />
              <SelectComponent
                label="Rendering"
                value={rendering}
                onChange={onRenderingChange}
                options={renderingOptions}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {safeCreatorFilters.map((filter) => (
                <PillButton
                  key={filter.id}
                  active={activeCreatorFilter === filter.id}
                  onClick={() => onActiveCreatorFilterChange?.(filter.id)}
                >
                  {filter.label}
                </PillButton>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                View
              </span>
              <div className="flex rounded-xl border border-white/10 bg-black/30 p-1">
                <button
                  type="button"
                  onClick={() => onCreatorViewChange?.("GRID")}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs uppercase tracking-[0.14em] transition ${
                    creatorView === "GRID"
                      ? "bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <LayoutGrid size={14} />
                  Grid
                </button>
                <button
                  type="button"
                  onClick={() => onCreatorViewChange?.("LIST")}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs uppercase tracking-[0.14em] transition ${
                    creatorView === "LIST"
                      ? "bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <List size={14} />
                  List
                </button>
              </div>
            </div>
          </div>
        )}
      </FilterPanelComponent>

      {engagementMessage ? (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {engagementMessage}
        </p>
      ) : null}

      {mode === "CREATIONS" ? (
        <>
          <div className={`mt-6 grid gap-3 sm:gap-5 ${creationGridClass}`}>
            {filteredCreationCount ? (
              safeCreations.map((creation, index) =>
                CreationCardComponent ? (
                  <CreationCardComponent
                    key={creation.id}
                    creation={creation}
                    context="community"
                    mobileCompact={isMobileCompactCreationGrid}
                    priority={index < eagerCreationImageCount}
                    liked={isCreationLiked(creation)}
                    bookmarked={isCreationBookmarked(creation)}
                    onToggleLike={toggleCreationLike}
                    onToggleBookmark={toggleCreationBookmark}
                  />
                ) : null
              )
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-black/25 p-8 text-center sm:col-span-2 lg:col-span-3 2xl:col-span-4">
                <p className="font-display text-3xl">No public creations yet</p>
                <p className="mx-auto mt-3 max-w-2xl leading-7 text-[var(--muted)]">
                  Community will populate once creations are public and approved.
                </p>
              </div>
            )}
          </div>

          {remainingCommunityCreationCount > 0 ? (
            <LoadMoreButton
              nextLoadCount={nextCreationLoadCount}
              onClick={onLoadMoreCreations}
            />
          ) : null}
        </>
      ) : (
        <>
          {filteredCreatorCount ? (
            creatorView === "LIST" ? (
              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black/25">
                {safeCreators.map((creator) =>
                  CreatorListRowComponent ? (
                    <CreatorListRowComponent
                      key={creator.id}
                      creator={creator}
                      liked={isProfileLiked(creator)}
                      bookmarked={isProfileBookmarked(creator)}
                      followed={isProfileFollowed(creator)}
                      onToggleLike={toggleProfileLike}
                      onToggleBookmark={toggleProfileBookmark}
                      onToggleFollow={toggleProfileFollow}
                    />
                  ) : null
                )}
              </div>
            ) : (
              <div className={`mt-6 grid gap-5 ${creatorGridClass}`}>
                {safeCreators.map((creator) =>
                  CreatorCardComponent ? (
                    <CreatorCardComponent
                      key={creator.id}
                      creator={creator}
                      liked={isProfileLiked(creator)}
                      bookmarked={isProfileBookmarked(creator)}
                      followed={isProfileFollowed(creator)}
                      onToggleLike={toggleProfileLike}
                      onToggleBookmark={toggleProfileBookmark}
                      onToggleFollow={toggleProfileFollow}
                    />
                  ) : null
                )}
              </div>
            )
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-black/25 p-8 text-center">
              <p className="font-display text-3xl">No public creators yet</p>
              <p className="mx-auto mt-3 max-w-2xl leading-7 text-[var(--muted)]">
                Public creator profiles will appear here once profiles are made public.
              </p>
            </div>
          )}

          {remainingCommunityCreatorCount > 0 ? (
            <LoadMoreButton
              nextLoadCount={nextCreatorLoadCount}
              onClick={onLoadMoreCreators}
            />
          ) : null}
        </>
      )}
    </section>
  );
}
