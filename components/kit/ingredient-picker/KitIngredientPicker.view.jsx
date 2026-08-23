"use client";

// Fixture-driven mirror of the live ingredient picker's function
// (docs/SPRINT-E-PLAN.md section 1.2, R6), never its code
// (components/studio/image-studio/ingredient-picker/, READ ONLY
// reference). Standing on KitModalFrame variant="modal" (bottom-
// anchored at content height under 700px per A4). Tokens only; no
// fetch anywhere.
import { BookOpen, ChevronLeft, Plus, Search } from "lucide-react";

import KitModalFrame from "../KitModalFrame";
import KitArtPlaceholderView from "../art-placeholder/KitArtPlaceholder.view";

function SearchField({ value, placeholder, onChange }) {
  return (
    <div className="kit-search-field flex min-h-[var(--control-md)] items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-3)]">
      <Search size={16} className="flex-none text-[var(--ink-faint)]" aria-hidden="true" />
      <input
        type="search"
        name="ingredient-picker-search"
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
      className={`overflow-hidden rounded-[var(--radius-md)] border bg-[var(--surface-2)] text-left transition-colors ${
        item.isSelected
          ? "border-[var(--line-whisper)] bg-[var(--fill)]"
          : "border-[var(--line)] hover:border-[var(--line-strong)]"
      }`}
    >
      {hasImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.imageSrc} alt="" className="aspect-[4/3] w-full object-cover" />
      ) : (
        <div className="aspect-[4/3] w-full">
          <KitArtPlaceholderView size="md" />
        </div>
      )}
      <div className="p-[var(--space-3)]">
        <p
          className={`truncate font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] ${item.isSelected ? "text-[var(--gold-bright)]" : "text-[var(--ink)]"}`}
        >
          {item.title}
        </p>
        {item.subtitle && (
          <p className="mt-[var(--space-1)] truncate text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
            {item.subtitle}
          </p>
        )}
      </div>
    </button>
  );
}

function ActionCard({ icon: Icon, eyebrow, title, body, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick?.()}
      className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--fill-whisper)] p-[var(--space-4)] text-left transition-colors hover:border-[var(--line)]"
    >
      <p className="inline-flex items-center gap-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
        <Icon size={14} aria-hidden="true" />
        {eyebrow}
      </p>
      <p className="mt-[var(--space-2)] font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">
        {title}
      </p>
      <p className="mt-[var(--space-1)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
        {body}
      </p>
    </button>
  );
}

export default function KitIngredientPickerView({
  slotLabel = "Ingredient",
  searchValue = "",
  searchPlaceholder = "Search ingredients...",
  onSearchChange = null,
  items = [],
  emptyMessage = "No ingredient assets found.",
  loadErrorMessage = "",
  onChooseIngredient = null,
  showUseCustomAction = true,
  onUseCustom = null,
  showCreatePresetAction = false,
  onCreatePreset = null,
  backLabel = null,
  onClose = null,
}) {
  const introParts = ["Choose a reusable Crestfall creation"];
  if (showUseCustomAction) introParts.push(", or use a custom prompt once");
  introParts.push(
    showCreatePresetAction
      ? ", or start a future reusable preset without leaving Image Studio."
      : "."
  );

  return (
    <KitModalFrame
      variant="modal"
      panelClassName="w-full max-w-4xl"
      onClose={onClose}
      ariaLabel={`Select ${slotLabel}`}
    >
      <div className="flex flex-col gap-[var(--space-5)] p-[var(--space-6)] pt-[var(--space-8)]">
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

        <div>
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Select Ingredient
          </p>
          <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
            {slotLabel}
          </h2>
          <p className="mt-[var(--space-2)] max-w-[var(--measure)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {introParts.join("")}
          </p>
        </div>

        <SearchField value={searchValue} placeholder={searchPlaceholder} onChange={onSearchChange} />

        {loadErrorMessage && (
          <p className="rounded-[var(--radius-md)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--status-danger)]">
            {loadErrorMessage}
          </p>
        )}

        {items.length === 0 ? (
          <p className="rounded-[var(--radius-md)] border border-dashed border-[var(--line-strong)] bg-[var(--surface-2)] p-[var(--space-6)] text-center text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {emptyMessage}
          </p>
        ) : (
          <div className="grid max-h-[48vh] grid-cols-2 gap-[var(--space-4)] overflow-y-auto min-[700px]:grid-cols-3 min-[1100px]:grid-cols-4">
            {items.map((item) => (
              <IngredientCard key={item.id} item={item} onChoose={onChooseIngredient} />
            ))}
          </div>
        )}

        {(showUseCustomAction || showCreatePresetAction) && (
          <div
            className={`grid gap-[var(--space-3)] ${
              showUseCustomAction && showCreatePresetAction ? "min-[700px]:grid-cols-2" : "min-[700px]:grid-cols-1"
            }`}
          >
            {showUseCustomAction && (
              <ActionCard
                icon={BookOpen}
                eyebrow="Custom"
                title="Use Once"
                body="Switch this slot into custom text mode and write guidance in the composer panel."
                onClick={onUseCustom}
              />
            )}
            {showCreatePresetAction && (
              <ActionCard
                icon={Plus}
                eyebrow="Create"
                title="New Preset"
                body="Start a custom preset save flow for this ingredient type. Save remains stubbed until persistence exists."
                onClick={onCreatePreset}
              />
            )}
          </div>
        )}
      </div>
    </KitModalFrame>
  );
}
