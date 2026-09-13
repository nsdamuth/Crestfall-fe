"use client";

import { Check, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import KitArtPlaceholder from "@/components/kit/KitArtPlaceholder";
import { MENU_PANEL_RECIPE } from "@/components/kit/form-field/menuRecipe";

import StoryRoomGalleryViewer from "./StoryRoomGalleryViewer";

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
        <Gallery gallery={gallery} title={title} />

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
                  descriptionExpanded ? "" : "line-clamp-4"
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

function Gallery({ gallery, title }) {
  const items = Array.isArray(gallery?.items) ? gallery.items : [];
  const activeIndex = Math.min(gallery?.activeIndex || 0, Math.max(items.length - 1, 0));
  const active = items[activeIndex] || null;

  return (
    <div>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--surface-2)]">
        {active ? (
          <button
            type="button"
            onClick={() => gallery?.onOpenViewer?.(activeIndex)}
            aria-label={`Open ${active.altText}`}
            className="block h-full w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active.url} alt={active.altText} className="h-full w-full object-cover" />
          </button>
        ) : (
          <KitArtPlaceholder size="lg" identityKey={title || null} />
        )}

        {items.length > 1 ? (
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
      </div>

      {items.length > 1 ? (
        <div className="flex gap-[var(--space-2)] overflow-x-auto px-[var(--space-3)] py-[var(--space-2)]">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => gallery?.onSelect?.(index)}
              aria-label={item.altText}
              aria-current={index === activeIndex ? "true" : undefined}
              className={`h-14 w-14 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--surface-2)] ${
                index === activeIndex ? "ring-2 ring-[var(--gold-action)]" : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}

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
