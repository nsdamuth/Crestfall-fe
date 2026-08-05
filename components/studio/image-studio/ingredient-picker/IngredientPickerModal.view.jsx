import {
  BookOpen,
  MapPin,
  Plus,
  Shirt,
  Sparkles,
  Theater,
  User,
  Users,
  X,
} from "lucide-react";

import CreationPickerPanel from "@/components/studio/creations/pickers/CreationPickerPanel";
import ModalShell from "@/components/ui/ModalShell";

const ICON_BY_NAME = Object.freeze({
  users: Users,
  user: User,
  theater: Theater,
  shirt: Shirt,
  "map-pin": MapPin,
  sparkles: Sparkles,
});

export default function IngredientPickerModalView({
  ingredientLabel = "Ingredient",
  headerIconName = "sparkles",
  items = [],
  selectedItemId = "",
  loadErrorMessage = "",
  searchPlaceholder = "Search ingredients...",
  emptyMessage = "No ingredient assets found.",
  showUseCustomAction = true,
  showCreatePresetAction = false,
  onClose = null,
  onChooseIngredient = null,
  onUseCustom = null,
  onCreatePreset = null,
}) {
  const HeaderIcon = ICON_BY_NAME[headerIconName] || Sparkles;

  return (
    <ModalShell
      onClose={onClose}
      panelClassName="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[var(--radius-md)] border border-[var(--muted-gold)]/25 bg-[#080706] shadow-2xl"
    >
      <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
        <div>
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
            <HeaderIcon size={15} />
            Select Ingredient
          </p>

          <h2 className="mt-2 font-display text-4xl">{ingredientLabel}</h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Choose a reusable Crestfall creation
            {showUseCustomAction ? ", or use a custom prompt once" : ""}
            {showCreatePresetAction
              ? ", or start a future reusable preset without leaving Image Studio."
              : "."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onClose?.()}
          className="rounded-[var(--radius-full)] border border-white/10 p-2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
          aria-label="Close picker"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-5">
        {loadErrorMessage ? (
          <p className="mb-4 rounded-xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {loadErrorMessage}
          </p>
        ) : null}

        <CreationPickerPanel
          items={items}
          selectedIds={selectedItemId ? [selectedItemId] : []}
          searchPlaceholder={searchPlaceholder}
          emptyMessage={emptyMessage}
          gridClassName="max-h-[48vh] sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          onSelect={(item) => onChooseIngredient?.(item?.id)}
          actions={
            showUseCustomAction || showCreatePresetAction ? (
              <div
                className={`grid gap-3 ${
                  showUseCustomAction && showCreatePresetAction
                    ? "sm:grid-cols-2"
                    : "sm:grid-cols-1"
                }`}
              >
                {showUseCustomAction ? (
                  <button
                    type="button"
                    onClick={() => onUseCustom?.()}
                    className="rounded-[var(--radius-md)] border border-[var(--muted-gold)]/30 bg-[var(--muted-gold)]/10 p-4 text-left transition hover:border-[var(--muted-gold)]/60 hover:bg-[var(--muted-gold)]/15"
                  >
                    <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
                      <BookOpen size={14} />
                      Custom
                    </p>
                    <h3 className="mt-2 font-display text-2xl text-[var(--foreground)]">
                      Use Once
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      Switch this slot into custom text mode and write guidance
                      in the composer panel.
                    </p>
                  </button>
                ) : null}

                {showCreatePresetAction ? (
                  <button
                    type="button"
                    onClick={() => onCreatePreset?.()}
                    className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4 text-left transition hover:border-[var(--muted-gold)]/35 hover:bg-[var(--muted-gold)]/10"
                  >
                    <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
                      <Plus size={14} />
                      Create
                    </p>
                    <h3 className="mt-2 font-display text-2xl text-[var(--foreground)]">
                      New Preset
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      Start a custom preset save flow for this ingredient type.
                      Save remains stubbed until persistence exists.
                    </p>
                  </button>
                ) : null}
              </div>
            ) : null
          }
        />
      </div>
    </ModalShell>
  );
}
