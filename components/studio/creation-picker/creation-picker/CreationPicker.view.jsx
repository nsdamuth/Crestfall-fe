"use client";

// The creation picker, docs/plans/FABLE-GATE-2-STUDIO.md wave SW1.
// Composes KitPickerModal (components/kit/picker-modal/) in grid
// layout for the populated states. Fixture-fed, portable: no
// Next.js, no data fetching, every state is caller-owned.
import KitModalFrame from "@/components/kit/KitModalFrame";
import KitPickerModalView from "@/components/kit/picker-modal/KitPickerModal.view";

function EmptyVaultState({ title, emptyCreateLabel, onCreateNew, onClose }) {
  return (
    <KitModalFrame variant="modal" panelClassName="w-full max-w-md" onClose={onClose} ariaLabel={title}>
      <div className="flex flex-col items-center gap-[var(--space-4)] p-[var(--space-8)] text-center">
        <h2 className="font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
          {title}
        </h2>
        <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          Nothing here yet.
        </p>
        <button type="button" onClick={() => onCreateNew?.()} className="cf-btn cf-btn--primary">
          {emptyCreateLabel}
        </button>
      </div>
    </KitModalFrame>
  );
}

export default function CreationPickerView({
  title = "Choose a creation",
  items = [],
  searchValue = "",
  searchPlaceholder = "Search your creations",
  filters = [],
  isSearching = false,
  isLoading = false,
  isEmpty = false,
  emptyCreateLabel = "Create your first creation",
  emptyMessage = "No matching creations found.",
  errorMessage = "",
  onSearchChange = null,
  onToggleFilter = null,
  onToggleItem = null,
  onConfirm = null,
  onClose = null,
  onCreateNew = null,
}) {
  if (isEmpty && !errorMessage && !isLoading) {
    return (
      <EmptyVaultState
        title={title}
        emptyCreateLabel={emptyCreateLabel}
        onCreateNew={onCreateNew}
        onClose={onClose}
      />
    );
  }

  return (
    <KitPickerModalView
      title={title}
      layout="grid"
      isMultiSelect={false}
      items={items}
      selectedIds={[]}
      searchValue={searchValue}
      searchPlaceholder={searchPlaceholder}
      filters={filters}
      isLoading={isLoading}
      hasMore={false}
      isSearching={isSearching}
      emptyMessage={emptyMessage}
      errorMessage={errorMessage}
      onSearchChange={onSearchChange}
      onToggleFilter={onToggleFilter}
      onToggleItem={onToggleItem}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
}
