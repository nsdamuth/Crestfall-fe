"use client";

import { Check, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { MENU_PANEL_RECIPE } from "@/components/kit/form-field/menuRecipe";

import StoryRoomGalleryViewer from "./StoryRoomGalleryViewer";
import StoryRoomMark from "./StoryRoomMark";

const CIRCLE_BUTTON_CLASS =
  "flex h-[var(--control-md)] w-[var(--control-md)] shrink-0 touch-manipulation items-center justify-center rounded-[var(--radius-full)] transition-colors duration-[var(--dur-hover)]";

const ROW_CLASS =
  "flex min-h-[var(--control-md)] w-full items-center justify-between gap-[var(--space-3)] px-[var(--space-4)] text-left text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] transition-colors duration-[var(--dur-hover)] hover:bg-[var(--step-above)]";

// The right rail (fe/chat-studio item 6, 12 Sep 2026): gallery on top,
// then title with the three-dot menu, the rating and visibility chips,
// byline and description when the Chassis serves them, Export and Share,
// then the drill-in rows. A drill-in replaces the rail content in place
// under a 44px back row. The same View renders inside the right sheet
// below md. Presentation only: the panels arrive as nodes.
export default function StoryRoomDetailsRailView({
  title = "",
  chips = [],
  byline = null,
  description = "",
  descriptionExpanded = false,
  onToggleDescription = null,
  gallery = null,
  menu = null,
  deleteError = "",
  actionsSlot = null,
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
        <Gallery gallery={gallery} />

        <div className="px-[var(--space-4)] pt-[var(--space-4)]">
          <div className="flex items-start gap-[var(--space-2)]">
            <h2 className="min-w-0 flex-1 font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]">
              {title}
            </h2>
            {menu?.items?.length ? <TitleMenu menu={menu} /> : null}
          </div>

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

          {description ? (
            <div className="mt-[var(--space-3)]">
              <p
                className={`text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)] ${
                  descriptionExpanded ? "" : "line-clamp-3"
                }`}
              >
                {description}
              </p>
              <button
                type="button"
                onClick={() => onToggleDescription?.()}
                className="mt-[var(--space-1)] min-h-[var(--control-md)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--gold-action)]"
              >
                {descriptionExpanded ? "See less" : "See more"}
              </button>
            </div>
          ) : null}

          {deleteError ? (
            <p className="mt-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--status-danger-text)]">
              {deleteError}
            </p>
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
      </div>
    </div>
  );
}

// The gallery (brief 3 item 4, replaced by brief 4 item 1). One bed at
// every state: --surface-2 with --radius-md corners, --space-3 margin
// each side, 4:5. No media: the circular geometric Crestfall mark
// (StoryRoomMark, icons-v7 symbol i-59, the sidebar lockup's mark)
// centered on the bed. With media: the image fills the bed edge to edge
// inside the rounding, previous and next as 44px circles over the art,
// an "n / total" counter chip centered at the bottom on the
// tag-over-art recipe (--tag-bed-art bed, 1px --line, --art-ink), and,
// when the story resolves to a creation page, one extra stop after the
// last image: an end card on the asset detail popup's "Want to see
// more" recipe whose primary link opens the creation page in a new tab
// so the chat stays open. The brief 3 thumbnail strip is retired; the
// counter chip carries the position.
function Gallery({ gallery }) {
  const items = Array.isArray(gallery?.items) ? gallery.items : [];
  const activeIndex = Math.min(gallery?.activeIndex || 0, Math.max(items.length - 1, 0));
  const active = items[activeIndex] || null;
  const showEndCard = Boolean(gallery?.showEndCard && gallery?.catalogueHref && active);
  const canPage = items.length > 1 || (items.length === 1 && Boolean(gallery?.catalogueHref));

  return (
    <div className="p-[var(--space-3)]">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-md)] bg-[var(--surface-2)]">
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

        {active && canPage ? (
          <>
            <button
              type="button"
              onClick={() => gallery?.onPrevious?.()}
              aria-label="Previous image"
              className={`${CIRCLE_BUTTON_CLASS} absolute left-[var(--space-2)] top-1/2 -translate-y-1/2 bg-[var(--panel-glass)] text-[var(--art-ink)] backdrop-blur-[var(--blur-panel)] hover:text-[var(--art-gold)]`}
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => gallery?.onNext?.()}
              aria-label="Next image"
              className={`${CIRCLE_BUTTON_CLASS} absolute right-[var(--space-2)] top-1/2 -translate-y-1/2 bg-[var(--panel-glass)] text-[var(--art-ink)] backdrop-blur-[var(--blur-panel)] hover:text-[var(--art-gold)]`}
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </>
        ) : null}

        {active && !showEndCard ? (
          <span
            aria-live="polite"
            className="absolute bottom-[var(--space-2)] left-1/2 -translate-x-1/2 rounded-[var(--radius-full)] border border-[var(--line)] bg-[var(--tag-bed-art)] px-[var(--space-2)] py-px text-[length:var(--text-label)] leading-[var(--lh-label)] tabular-nums text-[var(--art-ink)] backdrop-blur-[var(--blur-panel)]"
          >
            {activeIndex + 1} / {items.length}
          </span>
        ) : null}
      </div>

      {gallery?.viewerIndex !== null && gallery?.viewerIndex !== undefined && items.length ? (
        <StoryRoomGalleryViewer
          items={items}
          index={gallery.viewerIndex}
          onClose={gallery.onCloseViewer}
          onPrevious={gallery.onViewerPrevious}
          onNext={gallery.onViewerNext}
        />
      ) : null}
    </div>
  );
}

// The end card (brief 3 item 4): the asset detail popup's "Want to see
// more" recipe (components/kit/asset-detail-popup, CatalogueSlide): the
// last image scrimmed under a glass card, the eyebrow, one line, and the
// primary View catalogue, a link to the creation page in a new tab
// (target _blank, rel noopener) so the chat stays open.
function GalleryEndCard({ backgroundSrc = "", href = "" }) {
  return (
    <div className="absolute inset-0">
      {backgroundSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={backgroundSrc} alt="" className="absolute inset-0 h-full w-full object-cover object-[center_18%]" />
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

// The three-dot menu beside the title on the shared menu recipe. Its
// one row today is Delete story; the danger ink uses the ruled running
// text tier because the base danger token as normal text on the glass
// surface is blocked by the contrast law.
function TitleMenu({ menu }) {
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => menu.onToggle?.()}
        aria-haspopup="menu"
        aria-expanded={Boolean(menu.open)}
        aria-label="More actions"
        title="More"
        className={`${CIRCLE_BUTTON_CLASS} bg-[var(--step-above)] text-[var(--ink-dim)] hover:text-[var(--ink)]`}
      >
        <MoreHorizontal size={18} aria-hidden="true" />
      </button>

      {menu.open ? (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close menu"
            onClick={() => menu.onClose?.()}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div role="menu" className={`${MENU_PANEL_RECIPE} right-0 top-full mt-[var(--space-1)] w-[12rem]`}>
            {menu.items.map((item) => (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                disabled={Boolean(item.disabled)}
                onClick={() => item.onSelect?.()}
                className={`flex min-h-[var(--control-md)] w-full items-center justify-between gap-[var(--space-3)] rounded-[var(--radius-sm)] px-[var(--space-3)] text-left text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition-colors duration-[var(--dur-hover)] hover:bg-[var(--state-hover-fill)] disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)] ${
                  item.tone === "danger" ? "text-[var(--status-danger-text)]" : "text-[var(--ink-dim)] hover:text-[var(--ink)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      ) : null}
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
