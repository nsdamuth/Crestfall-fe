"use client";

// THE asset picker for Media Studio (FE/MEDIA-STUDIO session 2,
// Brian's note 3, 9 Sep 2026): one layout and one component for every
// asset type, Character, Pose, Outfit, Location, Preset, and Camera
// framing. Eyebrow "Select asset", the asset word as the title, one
// sentence, then a short search field with one filter dropdown beside
// it, then the grid with Custom as the first card. Camera framing
// uses the rows layout (text options under their group's section
// title, no art), ruled at the session 2 plan gate (option A). Under
// 700px the picker opens as the same bottom sheet the composer uses.
// Review round 1 (10 Sep 2026): one fixed panel width and one fixed
// grid height for every picker, so the modals match; every card the
// same size; the empty state sits inline beside Custom. Tokens only;
// no fetch anywhere; search and filtering are the caller's job.
import { Check, ChevronLeft, PenLine, Search } from "lucide-react";

import KitModalFrame from "../KitModalFrame";
import KitArtPlaceholderView from "../art-placeholder/KitArtPlaceholder.view";
import KitDropdownView from "../dropdown/KitDropdown.view";
import { usePhoneWidth } from "../modal-frame/usePhoneWidth";

// Card recipe shared by the asset cards, the Custom card, and the
// inline empty cell, so the grid reads as one set of equal tiles: the
// art area is a fixed 4/3, the text block always reserves a title and
// a subtitle line. Selection law (docs/BUILD-BLUEPRINT.md 2.16(i)):
// --fill wash plus --gold-bright title, never a bold border.
const CARD_RECIPE =
  "flex flex-col overflow-hidden rounded-[var(--radius-md)] border bg-[var(--surface-2)] text-left transition-colors";

// The grid region is one height on every picker (700px and up) so the
// modals match from asset type to asset type; under 700px the sheet
// stays content-height with the same cap.
const GRID_HEIGHT = "max-h-[50vh] min-[700px]:h-[50vh]";

function cardStateClass(isSelected) {
  return isSelected
    ? "border-[var(--line-whisper)] bg-[var(--fill)]"
    : "border-[var(--line)] hover:border-[var(--line-strong)]";
}

function CardText({ title, subtitle, isSelected, centered = false }) {
  return (
    <div className={`p-[var(--space-4)] ${centered ? "text-center" : ""}`}>
      <p
        className={`truncate font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] ${isSelected ? "text-[var(--gold-bright)]" : "text-[var(--ink)]"}`}
      >
        {title}
      </p>
      <p className="mt-[var(--space-1)] min-h-[var(--lh-label)] truncate text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
        {subtitle || ""}
      </p>
    </div>
  );
}

// Short and beside the filter dropdown (review round 1), on the
// dropdown's filter-line height (--control-filter on fine pointers,
// --control-md on coarse) so the two controls align.
function SearchField({ value, placeholder, onChange }) {
  return (
    <div className="kit-search-field flex min-h-[var(--control-filter)] w-full min-w-0 items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-3)] min-[700px]:max-w-[24rem] [@media(pointer:coarse)]:min-h-[var(--control-md)]">
      <Search size={16} className="flex-none text-[var(--ink-faint)]" aria-hidden="true" />
      <input
        type="search"
        name="asset-picker-search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="kit-search-input w-full min-w-0 bg-transparent text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none"
      />
    </div>
  );
}

function IngredientCard({ item, onChoose }) {
  const hasImage = Boolean(item.imageSrc);

  return (
    <button
      type="button"
      onClick={() => onChoose?.(item.id)}
      aria-pressed={Boolean(item.isSelected)}
      className={`${CARD_RECIPE} ${cardStateClass(item.isSelected)}`}
    >
      {hasImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.imageSrc} alt="" className="aspect-[4/3] w-full object-cover" />
      ) : (
        <div className="aspect-[4/3] w-full">
          <KitArtPlaceholderView size="md" />
        </div>
      )}
      <CardText title={item.title} subtitle={item.subtitle} isSelected={item.isSelected} />
    </button>
  );
}

// Custom is the first card of the grid, the same size as an asset
// card (note 3: "like OD"), its copy centered. It carries the pen mark
// where an asset carries its art, and reads as selected while the
// slot holds a once-only custom description.
function CustomCard({ isSelected, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick?.()}
      aria-pressed={Boolean(isSelected)}
      className={`${CARD_RECIPE} ${cardStateClass(isSelected)}`}
    >
      <div className="flex aspect-[4/3] w-full items-center justify-center bg-[var(--fill-whisper)]">
        <span className="flex h-[var(--control-lg)] w-[var(--control-lg)] items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--gold-ornament)]">
          <PenLine size={20} aria-hidden="true" />
        </span>
      </div>
      <CardText title="Custom" subtitle="Write your own" isSelected={isSelected} centered />
    </button>
  );
}

// The empty state sits on the Custom card's row, filling the rest of
// it at the same height (review round 1), never a full-width block
// under the grid.
function EmptyCell({ message, spanAll = false }) {
  return (
    <p
      className={`flex items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--line-strong)] bg-[var(--surface-2)] p-[var(--space-4)] text-center text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)] ${
        spanAll ? "col-span-full min-h-[var(--space-24)]" : "min-[700px]:col-span-2 min-[1100px]:col-span-3"
      }`}
    >
      {message}
    </p>
  );
}

// Rows layout: a text option with a one-line description and a check
// mark, for catalogs that have no art (camera framing). Options sit
// under their group's section title (review round 1), never with the
// group repeated on every row.
function OptionRow({ item, onChoose }) {
  return (
    <button
      type="button"
      onClick={() => onChoose?.(item.id)}
      aria-pressed={Boolean(item.isSelected)}
      className={`group flex min-h-[var(--control-lg)] w-full items-start justify-between gap-[var(--space-3)] rounded-[var(--radius-md)] border px-[var(--space-4)] py-[var(--space-3)] text-left transition-colors duration-[var(--dur-hover)] ${
        item.isSelected
          ? "border-[var(--line-whisper)] bg-[var(--fill)]"
          : "border-[var(--line-whisper)] bg-[var(--surface-1)] hover:border-[var(--line)] hover:bg-[var(--state-hover-fill)] active:bg-[var(--state-pressed-fill)]"
      }`}
    >
      <span className="min-w-0 flex-1">
        <span
          className={`block truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] ${item.isSelected ? "text-[var(--gold-bright)]" : "text-[var(--ink)]"}`}
        >
          {item.title}
        </span>
        {item.description ? (
          <span className="mt-[var(--space-1)] block line-clamp-2 text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
            {item.description}
          </span>
        ) : null}
      </span>
      <span
        aria-hidden="true"
        className={`mt-0.5 flex h-[var(--control-sm)] w-[var(--control-sm)] flex-none items-center justify-center rounded-[var(--radius-full)] border ${
          item.isSelected
            ? "border-[var(--gold-ornament)] bg-[var(--gold-ornament)] text-[var(--tag-fill-ink)]"
            : "border-[var(--line-whisper)] text-transparent group-hover:border-[var(--line)]"
        }`}
      >
        <Check size={14} />
      </span>
    </button>
  );
}

// Groups rows by their subtitle in first-seen order; items with no
// subtitle form one untitled section.
function groupRows(items) {
  const sections = [];
  const byTitle = new Map();
  items.forEach((item) => {
    const key = item.subtitle || "";
    if (!byTitle.has(key)) {
      const section = { title: key, items: [] };
      byTitle.set(key, section);
      sections.push(section);
    }
    byTitle.get(key).items.push(item);
  });
  return sections;
}

export default function KitIngredientPickerView({
  slotLabel = "Asset",
  description = "",
  searchValue = "",
  searchPlaceholder = "Search assets...",
  onSearchChange = null,
  filter = null,
  items = [],
  itemLayout = "cards",
  emptyMessage = "No assets found.",
  loadErrorMessage = "",
  onChooseIngredient = null,
  showUseCustomAction = true,
  customIsSelected = false,
  onUseCustom = null,
  backLabel = null,
  onClose = null,
}) {
  const isPhoneWidth = usePhoneWidth();
  const isRows = itemLayout === "rows";
  const lowerLabel = String(slotLabel || "asset").toLowerCase();
  const intro =
    description ||
    (showUseCustomAction
      ? `Choose a saved ${lowerLabel}, or write your own.`
      : `Choose a saved ${lowerLabel}.`);
  const hasFilter = Boolean(filter && Array.isArray(filter.options) && filter.options.length > 0);
  const showCustom = Boolean(showUseCustomAction && !isRows);
  const isEmpty = items.length === 0;
  const sections = isRows ? groupRows(items) : [];

  return (
    <KitModalFrame
      variant={isPhoneWidth ? "sheet" : "modal"}
      sheetGrabber={isPhoneWidth}
      panelWidth="56rem"
      onClose={onClose}
      ariaLabel={`Select ${slotLabel}`}
    >
      <div
        className={`flex flex-col gap-[var(--space-4)] ${
          isPhoneWidth ? "p-[var(--space-5)] pt-[var(--space-4)]" : "p-[var(--space-6)] pt-[var(--space-8)]"
        }`}
      >
        {backLabel && (
          <button
            type="button"
            onClick={() => onClose?.()}
            className="inline-flex w-fit items-center gap-[var(--space-1)] cf-btn cf-btn--secondary cf-btn--sm max-[699.98px]:min-h-[var(--control-md)]"
          >
            <ChevronLeft size={16} aria-hidden="true" />
            {backLabel}
          </button>
        )}

        <div className={isPhoneWidth ? "" : "pr-[var(--space-10)]"}>
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Select asset
          </p>
          <h2 className="mt-[var(--space-1)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
            {slotLabel}
          </h2>
          <p className="mt-[var(--space-1)] max-w-[var(--measure)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {intro}
          </p>
        </div>

        {/* Search on the left at its own short width, the filter
            pinned to the modal's right edge (Brian, session 3 review
            round 2); the filter's menu opens right-aligned so it
            stays inside the panel. */}
        <div className="flex items-center justify-between gap-[var(--space-2)]">
          <SearchField value={searchValue} placeholder={searchPlaceholder} onChange={onSearchChange} />
          {hasFilter ? (
            <KitDropdownView
              label={filter.label || "Filter"}
              options={filter.options}
              selectedValues={filter.value ? [filter.value] : []}
              isMultiSelect={false}
              restingValue={filter.restingValue ?? null}
              onToggleOption={(value) => filter.onChange?.(value)}
              ariaLabel={`Filter ${lowerLabel}`}
              align="right"
            />
          ) : null}
        </div>

        {loadErrorMessage && (
          <p className="rounded-[var(--radius-md)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--status-danger)]">
            {loadErrorMessage}
          </p>
        )}

        {isRows ? (
          <div className={`${GRID_HEIGHT} overflow-y-auto pr-[var(--space-1)]`}>
            {sections.map((section) => (
              <section key={section.title || "untitled"} className="mb-[var(--space-5)] last:mb-0">
                {section.title ? (
                  <h3 className="mb-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
                    {section.title}
                  </h3>
                ) : null}
                <div className="grid gap-[var(--space-2)] min-[760px]:grid-cols-2">
                  {section.items.map((item) => (
                    <OptionRow key={item.id} item={item} onChoose={onChooseIngredient} />
                  ))}
                </div>
              </section>
            ))}
            {isEmpty ? (
              <div className="grid">
                <EmptyCell message={emptyMessage} spanAll />
              </div>
            ) : null}
          </div>
        ) : (
          <div
            className={`${GRID_HEIGHT} grid auto-rows-max grid-cols-2 gap-[var(--space-3)] overflow-y-auto pr-[var(--space-1)] min-[700px]:grid-cols-3 min-[1100px]:grid-cols-4`}
          >
            {showCustom ? <CustomCard isSelected={customIsSelected} onClick={onUseCustom} /> : null}
            {items.map((item) => (
              <IngredientCard key={item.id} item={item} onChoose={onChooseIngredient} />
            ))}
            {isEmpty ? <EmptyCell message={emptyMessage} spanAll={!showCustom} /> : null}
          </div>
        )}
      </div>
    </KitModalFrame>
  );
}
