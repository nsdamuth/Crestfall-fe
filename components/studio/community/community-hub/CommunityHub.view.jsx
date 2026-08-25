"use client";

import { LayoutGrid, List, Search } from "lucide-react";

function PillButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick || undefined}
      className={`min-h-[var(--control-sm)] rounded-[var(--radius-md)] border px-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] transition ${
        active
          ? "border-[var(--gold-action)] text-[var(--gold-bright)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
          : "border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
      }`}
    >
      {children}
    </button>
  );
}

function LoadMoreButton({ nextLoadCount, onClick }) {
  return (
    <div className="mt-[var(--space-8)] flex justify-center">
      <button
        type="button"
        onClick={onClick || undefined}
        className="cf-btn cf-btn--secondary"
      >
        Load {nextLoadCount} more
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
                className="inline-flex h-[var(--control-md)] items-center gap-2 rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)] transition hover:border-[var(--line)] hover:text-[var(--ink)] md:hidden"
              >
                <LayoutGrid size={14} />
                {mobileCreationGridToggleLabel}
              </button>
            ) : null}

            <div className="flex rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-1">
              {[
                ["CREATIONS", "Creations"],
                ["CREATORS", "Creators"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onModeChange?.(id)}
                  className={`rounded-[var(--radius-sm)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] transition ${
                    mode === id
                      ? "bg-[var(--fill-whisper)] text-[var(--gold-bright)]"
                      : "text-[var(--ink-dim)] hover:text-[var(--ink)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        }
      >
        <div className="flex min-h-[var(--control-md)] items-center gap-3 rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)]">
          <Search size={16} className="text-[var(--gold-ornament)]" />
          <input
            value={query}
            onChange={(event) => onQueryChange?.(event.target.value)}
            placeholder={queryPlaceholder}
            className="w-full bg-transparent text-[length:var(--text-body)] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
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
              <span className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
                View
              </span>
              <div className="flex rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-1">
                <button
                  type="button"
                  onClick={() => onCreatorViewChange?.("GRID")}
                  className={`inline-flex items-center gap-2 rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] transition ${
                    creatorView === "GRID"
                      ? "bg-[var(--fill-whisper)] text-[var(--gold-bright)]"
                      : "text-[var(--ink-dim)] hover:text-[var(--ink)]"
                  }`}
                >
                  <LayoutGrid size={14} />
                  Grid
                </button>
                <button
                  type="button"
                  onClick={() => onCreatorViewChange?.("LIST")}
                  className={`inline-flex items-center gap-2 rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] transition ${
                    creatorView === "LIST"
                      ? "bg-[var(--fill-whisper)] text-[var(--gold-bright)]"
                      : "text-[var(--ink-dim)] hover:text-[var(--ink)]"
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

      {/* SKIPPED: engagementMessage is a semantic error/warning banner —
          the red here is unmapped by any of the eight rulings (danger
          red was proposed for buttons only and isn't applied anywhere
          in this pass), so it's left as raw Tailwind red rather than
          inventing a token out of scope. */}
      {engagementMessage ? (
        <p className="mt-4 rounded-[var(--radius-md)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-4 py-3 text-sm text-[var(--status-danger)]">
          {engagementMessage}
        </p>
      ) : null}

      {mode === "CREATIONS" ? (
        <>
          <div
            className={`mt-[var(--space-5)] grid gap-[var(--space-3)] ${creationGridClass}`}
          >
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
              <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--line-strong)] p-[var(--space-8)] text-center sm:col-span-2 lg:col-span-3 2xl:col-span-4">
                <p className="font-display text-[length:var(--text-heading)] leading-[var(--lh-heading)] tabular-nums">
                  No public creations yet
                </p>
                <p className="mx-auto mt-3 max-w-2xl text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
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
              <div className="mt-[var(--space-5)] overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)]">
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
              <div
                className={`mt-[var(--space-5)] grid gap-[var(--space-3)] ${creatorGridClass}`}
              >
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
            <div className="mt-[var(--space-5)] rounded-[var(--radius-lg)] border border-dashed border-[var(--line-strong)] p-[var(--space-8)] text-center">
              <p className="font-display text-[length:var(--text-heading)] leading-[var(--lh-heading)] tabular-nums">
                No public creators yet
              </p>
              <p className="mx-auto mt-3 max-w-2xl text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
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
