"use client";

import { Plus } from "lucide-react";

import KitArtPlaceholder from "@/components/kit/KitArtPlaceholder";
import KitSearchFieldView from "@/components/kit/studio-filter-bar/KitSearchField.view";

const ROW_BASE_CLASS =
  "flex w-full min-h-[3.5rem] items-center gap-[var(--space-3)] border-l-2 px-[var(--space-3)] py-[var(--space-2)] text-left transition-[background-color,border-color] duration-[var(--dur-hover)] hover:bg-[var(--step-above)]";

function StoryListRow({ item, onSelect }) {
  const rowClass = item.isCurrent
    ? `${ROW_BASE_CLASS} border-[var(--gold-action)] bg-[var(--fill-whisper)]`
    : `${ROW_BASE_CLASS} border-transparent`;

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect?.(item.roomId)}
        aria-current={item.isCurrent ? "page" : undefined}
        className={rowClass}
      >
        <span className="h-10 w-10 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--surface-2)]">
          {item.imageSrc ? (
            <img
              src={item.imageSrc}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <KitArtPlaceholder size="sm" identityKey={item.id} />
          )}
        </span>

        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)]">
            {item.title}
          </span>
          {item.lastLine ? (
            <span className="truncate text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
              {item.lastLine}
            </span>
          ) : null}
        </span>

        {item.relativeDay ? (
          <span className="shrink-0 self-start text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
            {item.relativeDay}
          </span>
        ) : null}
      </button>
    </li>
  );
}

function SkeletonRows() {
  return (
    <ul aria-hidden="true" className="flex flex-col gap-[var(--space-1)]">
      {[0, 1, 2].map((index) => (
        <li
          key={`story-list-skeleton-${index}`}
          className="mx-[var(--space-3)] h-[3.5rem] rounded-[var(--radius-md)] bg-[var(--surface-2)]"
        />
      ))}
    </ul>
  );
}

export default function StoryRoomStoryListView({
  items = [],
  query = "",
  onQueryChange = null,
  newStoryHref = "/studio/v2/stories",
  newStoryLabel = "New story",
  searchPlaceholder = "Search stories",
  recentHeading = "Recent",
  emptyMessage = "No stories yet.",
  isLoading = false,
  errorMessage = "",
  onSelect = null,
  LinkComponent = "a",
}) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <nav
      aria-label="Stories"
      className="flex h-full min-h-0 flex-col bg-[var(--surface-1)]"
    >
      <div className="flex flex-col gap-[var(--space-2)] px-[var(--space-3)] pb-[var(--space-3)]">
        <KitSearchFieldView
          value={query}
          placeholder={searchPlaceholder}
          onChange={(nextValue) => onQueryChange?.(nextValue)}
          name="story-room-story-list-search"
        />

        <LinkComponent
          href={newStoryHref}
          className="cf-btn cf-btn--secondary w-full justify-center"
        >
          <Plus size={16} aria-hidden="true" />
          {newStoryLabel}
        </LinkComponent>
      </div>

      <p className="px-[var(--space-3)] pb-[var(--space-1)] text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
        {recentHeading}
      </p>

      <div className="min-h-0 flex-1 overflow-y-auto pb-[var(--space-3)]">
        {isLoading ? (
          <SkeletonRows />
        ) : errorMessage ? (
          <p
            role="status"
            className="px-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--status-danger-text)]"
          >
            {errorMessage}
          </p>
        ) : safeItems.length === 0 ? (
          <p className="px-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {emptyMessage}
          </p>
        ) : (
          <ul className="flex flex-col">
            {safeItems.map((item) => (
              <StoryListRow key={item.id} item={item} onSelect={onSelect} />
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
