"use client";

import { MessageSquarePlus, Plus } from "lucide-react";

import KitSearchFieldView from "@/components/kit/studio-filter-bar/KitSearchField.view";

import StoryRoomMark from "../story-room-details-rail/StoryRoomMark";

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
        {/* Placeholder rows carry the circular geometric Crestfall mark
            (brief 3 item 5, the same StoryRoomMark as the gallery
            placeholder), never the six-petal rosette. */}
        <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-sm)] bg-[var(--surface-2)]">
          {item.imageSrc ? (
            <img
              src={item.imageSrc}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <StoryRoomMark className="h-[var(--space-7)] w-[var(--space-7)]" />
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
  newChat = null,
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
    // The rail column paints the surface (brief 2 item 6); the list
    // carries none of its own, so it reads on --surface-2 in the rail
    // and on the sheet's own surface below md.
    <nav aria-label="Stories" className="flex h-full min-h-0 flex-col">
      <div className="flex flex-col gap-[var(--space-2)] px-[var(--space-3)] pb-[var(--space-3)]">
        <KitSearchFieldView
          value={query}
          placeholder={searchPlaceholder}
          onChange={(nextValue) => onQueryChange?.(nextValue)}
          name="story-room-story-list-search"
        />

        {/* New chat (brief 4 item 3) above New story: starts a fresh
            chat from this story's source creation through the launch
            flow the Stories page uses; disabled with "not available
            yet" when the story resolves to no source creation. */}
        {newChat ? (
          <button
            type="button"
            onClick={() => newChat.onPress?.()}
            disabled={Boolean(newChat.disabled)}
            title={newChat.title || newChat.label || "New chat"}
            aria-label={newChat.title || newChat.label || "New chat"}
            className="cf-btn cf-btn--secondary w-full justify-center"
          >
            <MessageSquarePlus size={16} aria-hidden="true" />
            {newChat.pending ? newChat.pendingLabel || "Starting" : newChat.label || "New chat"}
          </button>
        ) : null}

        {newChat?.errorMessage ? (
          <p role="alert" className="text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--status-danger-text)]">
            {newChat.errorMessage}
          </p>
        ) : null}

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
