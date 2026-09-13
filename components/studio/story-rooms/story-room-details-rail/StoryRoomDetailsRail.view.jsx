"use client";

import { Check, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

import StoryRoomMark from "./StoryRoomMark";

const CIRCLE_BUTTON_CLASS =
  "flex h-[var(--control-md)] w-[var(--control-md)] shrink-0 touch-manipulation items-center justify-center rounded-[var(--radius-full)] transition-colors duration-[var(--dur-hover)]";

const ROW_CLASS =
  "flex min-h-[var(--control-md)] w-full items-center justify-between gap-[var(--space-3)] px-[var(--space-4)] text-left text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] transition-colors duration-[var(--dur-hover)] hover:bg-[var(--step-above)]";

// The right rail (fe/chat-studio item 6, 12 Sep 2026): the authoritative
// latest-responder image first, optional secondary gallery, title, metadata,
// Export and Share, drill-in rows, then the explicit Delete story danger
// action at the bottom. A drill-in replaces the rail content in place under
// a 44px back row. The same View renders inside the right sheet below md.
// Presentation only: the panels and destructive handler arrive as props.
export default function StoryRoomDetailsRailView({
  title = "",
  chips = [],
  byline = null,
  description = "",
  descriptionExpanded = false,
  onToggleDescription = null,
  featuredSpeaker = null,
  gallery = null,
  viewerSlot = null,
  deleteError = "",
  actionsSlot = null,
  dangerAction = null,
  rows = [],
  activeDetail = null,
  onOpenDetail = null,
  onBack = null,
  detailPanels = {},
  LinkComponent = "a",
}) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const activeRow = safeRows.find((row) => row.id === activeDetail) || null;

  // The rail column paints the surface (brief 2 item 6); the rail views
  // carry none of their own, so the same View reads on --surface-2 in
  // the rail and on the sheet's own surface below md.
  if (activeRow) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <button
          type="button"
          onClick={() => onBack?.()}
          className="flex min-h-[var(--control-md)] w-full shrink-0 items-center gap-[var(--space-2)] border-b border-[var(--line-whisper)] px-[var(--space-2)] text-left text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] transition-colors duration-[var(--dur-hover)] hover:bg-[var(--step-above)]"
        >
          <span className={`${CIRCLE_BUTTON_CLASS} text-[var(--ink-dim)]`} aria-hidden="true">
            <ChevronLeft size={20} />
          </span>
          <span className="font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)]">
            {activeRow.label}
          </span>
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto p-[var(--space-4)]">
          {detailPanels?.[activeRow.id] || null}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {featuredSpeaker?.displayUrl ? (
          <FeaturedSpeakerMedia featuredSpeaker={featuredSpeaker} />
        ) : null}

        {gallery?.items?.length || !featuredSpeaker?.displayUrl ? (
          <Gallery gallery={gallery} viewerSlot={viewerSlot} />
        ) : (
          viewerSlot
        )}

        <div className="px-[var(--space-4)] pt-[var(--space-4)]">
          <h2 className="font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]">
            {title}
          </h2>

          {chips.length ? (
            <div className="mt-[var(--space-2)] flex flex-wrap gap-[var(--space-2)]">
              {chips.map((chip) => (
                <span
                  key={chip.id}
                  className="rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-2)] py-px text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)]"
                >
                  {chip.label}
                </span>
              ))}
            </div>
          ) : null}

          {byline?.handle ? (
            <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
              by{" "}
              {byline.href ? (
                <LinkComponent href={byline.href} className="text-[var(--gold-action)]">
                  {byline.handle}
                </LinkComponent>
              ) : (
                <span className="text-[var(--ink)]">{byline.handle}</span>
              )}
            </p>
          ) : null}

          {/* Description (review round 6): two lines, with See more on
              the second line after the text. Collapsed, the block is
              capped at two ui lines and a one-line float pushes the
              See more control to the right end of the second line, so
              the copy wraps around it and stops on a whole word;
              expanded, the block runs free and See less follows the
              text. No bed, no gradient: the text simply ends where the
              control begins. */}
          {description ? (
            <div
              className={`relative mt-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)] ${
                descriptionExpanded
                  ? ""
                  : "max-h-[calc(var(--lh-ui)*2)] overflow-hidden before:float-right before:h-[var(--lh-ui)] before:w-0 before:content-['']"
              }`}
            >
              {/* Collapsed, the control comes first in the markup so the
                  float lands on the second line; open, it follows the
                  text (review round 7: See less at the end). */}
              {!descriptionExpanded ? (
                <button
                  type="button"
                  onClick={() => onToggleDescription?.()}
                  className="float-right clear-right touch-manipulation pl-[var(--space-1)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--gold-action)]"
                >
                  {"… See more"}
                </button>
              ) : null}
              <span>{description}</span>
              {descriptionExpanded ? (
                <button
                  type="button"
                  onClick={() => onToggleDescription?.()}
                  className="ml-[var(--space-1)] touch-manipulation text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--gold-action)]"
                >
                  See less
                </button>
              ) : null}
            </div>
          ) : null}

          {actionsSlot ? <div className="mt-[var(--space-4)]">{actionsSlot}</div> : null}
        </div>

        <ul className="mt-[var(--space-4)] border-t border-[var(--line-whisper)]">
          {safeRows.map((row) => (
            <li key={row.id} className="border-b border-[var(--line-whisper)]">
              <button type="button" onClick={() => onOpenDetail?.(row.id)} className={ROW_CLASS}>
                <span>{row.label}</span>
                <ChevronRight size={18} aria-hidden="true" className="shrink-0 text-[var(--ink-dim)]" />
              </button>
            </li>
          ))}
        </ul>

        {dangerAction || deleteError ? (
          <div className="mx-[var(--space-4)] mb-[var(--space-6)] mt-[var(--space-6)] border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
            {deleteError ? (
              <p className="mb-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--status-danger-text)]">
                {deleteError}
              </p>
            ) : null}
            {dangerAction ? (
              <button
                type="button"
                onClick={() => dangerAction.onPress?.()}
                disabled={Boolean(dangerAction.busy)}
                className="cf-btn cf-btn--danger w-full justify-center disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)]"
              >
                <Trash2 size={18} aria-hidden="true" />
                <span>{dangerAction.busy ? dangerAction.busyLabel || dangerAction.label : dangerAction.label}</span>
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// The primary current-responder media surface is intentionally outside the
// pageable gallery. It is bound directly to room.featuredSpeakerImageUrl via
// the ViewModel, so user paging can never strand the visible primary image on
// a stale speaker after a new Character or Narrator response arrives.
function FeaturedSpeakerMedia({ featuredSpeaker }) {
  const src = featuredSpeaker?.displayUrl || "";
  if (!src) return null;

  return (
    <div className="px-[var(--space-3)] pt-[var(--space-3)]">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-md)] bg-[var(--canvas)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={featuredSpeaker?.altText || featuredSpeaker?.name || "Latest responder"}
          className="h-full w-full object-cover"
        />
        {featuredSpeaker?.name ? (
          <div className="absolute inset-x-0 bottom-0 bg-[var(--panel-glass)] px-[var(--space-3)] py-[var(--space-2)] backdrop-blur-[var(--blur-panel)]">
            <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--art-ink)]">
              Latest responder
            </p>
            <p className="mt-px truncate font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--art-ink)]">
              {featuredSpeaker.name}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// The gallery (brief 3 item 4, brief 4 item 1, review round 4 item 4).
// One bed at every state: --canvas, the darkest brown and the surface
// the community story slider paints behind its art (it reads as a bed
// against the --surface-2 rail; the brief 4 --surface-2 bed vanished
// into the rail, which is why its corners and margin never showed),
// --radius-md corners, --space-3 margin each side, 4:5. No media: the
// circular geometric Crestfall mark (StoryRoomMark, icons-v7 symbol
// i-59, the sidebar lockup's mark) centered on the bed. With media (at
// most four): the image fills the bed edge to edge inside the rounding,
// previous and next as 44px circles over the art, an "n/total" counter
// chip centered at the bottom on the tag-over-art recipe (--tag-bed-art
// bed, 1px --line, --art-ink), and, when the story resolves to a
// creation page, one extra stop after the last image: an end card on
// the asset detail popup's "Want to see more" recipe, its backdrop
// blurred, whose primary link opens that page in a new tab so the chat
// stays open. Review round 5 item 1: the first slide shows no previous
// arrow and the end card shows only the back arrow (paging never
// wraps); a tap on an image opens the community image viewer, which
// the binding shell mounts through `viewerSlot`.
function Gallery({ gallery, viewerSlot = null }) {
  const items = Array.isArray(gallery?.items) ? gallery.items : [];
  const activeIndex = Math.min(gallery?.activeIndex || 0, Math.max(items.length - 1, 0));
  const active = items[activeIndex] || null;
  const showEndCard = Boolean(gallery?.showEndCard && gallery?.catalogueHref && active);
  const canGoPrevious = Boolean(active && gallery?.canGoPrevious);
  const canGoNext = Boolean(active && gallery?.canGoNext);

  return (
    <div className="p-[var(--space-3)]">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-md)] bg-[var(--canvas)]">
        {!active ? (
          <div className="flex h-full w-full items-center justify-center">
            <StoryRoomMark className="h-[var(--space-16)] w-[var(--space-16)]" />
          </div>
        ) : showEndCard ? (
          <GalleryEndCard backgroundSrc={active.url} href={gallery.catalogueHref} />
        ) : (
          <button
            type="button"
            onClick={() => gallery?.onOpenViewer?.(activeIndex)}
            aria-label={`Open ${active.altText}`}
            className="block h-full w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active.url} alt={active.altText} className="h-full w-full object-cover" />
          </button>
        )}

        {/* Review round 6: on the end card the back control sits at the
            top left, off the card's own copy; on an image it stays at
            the left middle beside the next arrow. Both arrows sit above
            the end card's content layer (z-[2] over its z-[1], review
            round 7: that layer spans the whole card and was taking the
            tap, so the back control never fired). */}
        {canGoPrevious ? (
          <button
            type="button"
            onClick={() => gallery?.onPrevious?.()}
            aria-label={showEndCard ? "Back to the images" : "Previous image"}
            className={`${CIRCLE_BUTTON_CLASS} absolute left-[var(--space-2)] z-[2] bg-[var(--panel-glass)] text-[var(--art-ink)] backdrop-blur-[var(--blur-panel)] hover:text-[var(--art-gold)] ${
              showEndCard ? "top-[var(--space-2)]" : "top-1/2 -translate-y-1/2"
            }`}
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
        ) : null}
        {canGoNext ? (
          <button
            type="button"
            onClick={() => gallery?.onNext?.()}
            aria-label="Next image"
            className={`${CIRCLE_BUTTON_CLASS} absolute right-[var(--space-2)] top-1/2 z-[2] -translate-y-1/2 bg-[var(--panel-glass)] text-[var(--art-ink)] backdrop-blur-[var(--blur-panel)] hover:text-[var(--art-gold)]`}
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        ) : null}

        {active && !showEndCard ? (
          <span
            aria-live="polite"
            className="absolute bottom-[var(--space-2)] left-1/2 -translate-x-1/2 rounded-[var(--radius-full)] border border-[var(--line)] bg-[var(--tag-bed-art)] px-[var(--space-2)] py-px text-[length:var(--text-label)] leading-[var(--lh-label)] tabular-nums text-[var(--art-ink)] backdrop-blur-[var(--blur-panel)]"
          >
            {activeIndex + 1}/{items.length}
          </span>
        ) : null}
      </div>

      {viewerSlot}
    </div>
  );
}

// The end card (brief 3 item 4, review round 5 item 1): the asset detail
// popup's "Want to see more" recipe (components/kit/asset-detail-popup,
// CatalogueSlide) with its backdrop blurred as Brian ruled: the last
// image under --blur-panel (the veil blur, the one step legal over an
// image backdrop; the stronger steps are chrome and tooltip scoped),
// scaled a touch so the blur has no bright edge, then --scrim-strong, a
// glass card, the eyebrow, one line, and the primary View catalogue, a
// link to the creation page in a new tab (target _blank, rel noopener)
// so the chat stays open.
function GalleryEndCard({ backgroundSrc = "", href = "" }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {backgroundSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={backgroundSrc}
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover object-[center_18%] blur-[var(--blur-panel)]"
        />
      ) : null}
      <div className="absolute inset-0 bg-[var(--scrim-strong)]" aria-hidden="true" />
      <div className="relative z-[1] flex h-full items-center justify-center p-[var(--space-4)]">
        <div className="max-w-xs rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--panel-glass)] p-[var(--space-6)] text-center backdrop-blur-[var(--blur-panel)]">
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Want to see more?
          </p>
          <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            The full catalogue holds this story&apos;s media library and details.
          </p>
          <a
            href={href}
            target="_blank"
            rel="noopener"
            className="goldring cf-btn cf-btn--primary mt-[var(--space-4)]"
          >
            View catalogue
          </a>
        </div>
      </div>
    </div>
  );
}

// Preferences drill-in: the chat color, one of the 13 palette combos.
export function ChatColorPreferences({
  paletteId = "",
  creatorPaletteId = "",
  isOverridden = false,
  options = [],
  onChange = null,
  onReset = null,
}) {
  const safeOptions = Array.isArray(options) ? options : [];

  return (
    <div>
      <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
        Chat color
      </p>
      <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
        Your messages take this color. The creator picked the default for this story.
      </p>

      <ul className="mt-[var(--space-3)] flex flex-col gap-[var(--space-1)]" role="listbox" aria-label="Chat color">
        {safeOptions.map((option) => {
          const selected = option.id === paletteId;
          const isCreator = option.id === creatorPaletteId;

          return (
            <li key={option.id}>
              <button
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => onChange?.(option.id)}
                className={`flex min-h-[var(--control-md)] w-full items-center gap-[var(--space-3)] rounded-[var(--radius-md)] px-[var(--space-3)] text-left text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition-colors duration-[var(--dur-hover)] hover:bg-[var(--step-above)] ${
                  selected ? "bg-[var(--fill-whisper)] text-[var(--ink)]" : "text-[var(--ink-dim)]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-6 w-6 shrink-0 rounded-[var(--radius-full)] ${selected ? "ring-2 ring-[var(--gold-action)]" : ""}`}
                  style={{ backgroundColor: option.swatch }}
                />
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                {isCreator ? (
                  <span className="shrink-0 text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)]">
                    Creator default
                  </span>
                ) : null}
                {selected ? <Check size={16} aria-hidden="true" className="shrink-0 text-[var(--gold-action)]" /> : null}
              </button>
            </li>
          );
        })}
      </ul>

      {isOverridden ? (
        <button type="button" onClick={() => onReset?.()} className="cf-btn cf-btn--secondary mt-[var(--space-4)]">
          Use the creator default
        </button>
      ) : null}
    </div>
  );
}
