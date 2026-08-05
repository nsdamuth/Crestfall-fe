import {
  ArrowDown,
  ArrowUp,
  Link2,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import CrestfallSelect from "@/components/ui/CrestfallSelect";

export default function ItemStartingAssignmentEditorView({
  holderType = "UNASSIGNED",
  holderTypeOptions = [],
  holderTypeLabel = "Unassigned",
  usesCreation = false,
  hasSelectedHolder = false,
  selectedHolderTitle = "Selected Holder",
  emptyHolderLabel = "holder",
  pickerAddLabel = "Select Holder",
  showUnassignedState = true,
  showStoryState = false,
  showPlacement = false,
  placementSpecificity = "UNSPECIFIED",
  placementSpecificityOptions = [],
  placementStepKindOptions = [],
  placementSteps = [],
  placementNote = "",
  canAddPlacementStep = true,
  onChangeHolderType = null,
  onOpenPicker = null,
  onClearHolderCreation = null,
  onChangePlacementSpecificity = null,
  onMovePlacementStepUp = null,
  onMovePlacementStepDown = null,
  onDeletePlacementStep = null,
  onChangePlacementStepKind = null,
  onChangePlacementStepLabel = null,
  onBlurPlacementStepLabel = null,
  onAddPlacementStep = null,
  onChangePlacementNote = null,
  pickerSlot = null,
} = {}) {
  return (
    <div className="mt-4 rounded-2xl border border-[var(--muted-gold)]/20 bg-black/25 p-4">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
          Starting Assignment
        </p>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
          Define where this item is when a new Story begins. Story runtime may
          move it later without changing this source registry.
        </p>
      </div>

      <div className="mt-4">
        <CrestfallSelect
          label="Starting Holder"
          value={holderType}
          options={holderTypeOptions}
          onChange={onChangeHolderType}
        />
      </div>

      {showUnassignedState ? (
        <p className="mt-4 rounded-xl border border-dashed border-white/10 bg-black/25 p-4 text-sm leading-6 text-[var(--muted)]">
          The item is defined, but it does not begin in any Character,
          Location, or Story inventory.
        </p>
      ) : null}

      {showStoryState ? (
        <p className="mt-4 rounded-xl border border-white/10 bg-black/25 p-4 text-sm leading-6 text-[var(--muted)]">
          The item begins in the general Story inventory. It is not initially
          held by a participant or placed at a specific Location.
        </p>
      ) : null}

      {usesCreation ? (
        <div className="mt-4">
          {hasSelectedHolder ? (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/30 p-4">
              <div>
                <p className="font-display text-2xl">{selectedHolderTitle}</p>

                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                  {holderTypeLabel}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onOpenPicker?.()}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
                >
                  <Link2 size={14} />
                  Change
                </button>

                <button
                  type="button"
                  onClick={() => onClearHolderCreation?.()}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--status-danger)] transition hover:border-[var(--status-danger)]/40"
                >
                  <X size={14} />
                  Clear
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 bg-black/25 p-4">
              <p className="text-sm leading-6 text-[var(--muted)]">
                No starting {emptyHolderLabel} selected.
              </p>

              <button
                type="button"
                onClick={() => onOpenPicker?.()}
                className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
              >
                <Link2 size={14} />
                {pickerAddLabel}
              </button>
            </div>
          )}
        </div>
      ) : null}

      {showPlacement ? (
        <div className="mt-5 rounded-xl border border-white/10 bg-black/25 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            Nested Starting Placement
          </p>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Use an explicit path only when the exact starting storage or carried
            position matters. Leave it unspecified to allow the composer to use
            reasonable narrative staging.
          </p>

          <div className="mt-4">
            <CrestfallSelect
              label="Placement Specificity"
              value={placementSpecificity}
              options={placementSpecificityOptions}
              onChange={onChangePlacementSpecificity}
            />
          </div>

          {placementSpecificity === "UNSPECIFIED" ? (
            <p className="mt-4 rounded-xl border border-dashed border-white/10 bg-black/30 p-4 text-sm leading-6 text-[var(--muted)]">
              The current holder is authoritative, but the exact pocket, bag,
              shelf, container, or surface is not defined.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {placementSteps.length ? (
                placementSteps.map((step) => (
                  <div
                    key={step.id}
                    className="rounded-xl border border-white/10 bg-black/30 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                        Placement Level {step.levelNumber}
                      </p>

                      <div className="flex gap-1">
                        <button
                          type="button"
                          disabled={step.isFirst}
                          onClick={() => onMovePlacementStepUp?.(step.index)}
                          className="rounded-lg border border-white/10 p-2 text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-35"
                          aria-label="Move placement level up"
                        >
                          <ArrowUp size={14} />
                        </button>

                        <button
                          type="button"
                          disabled={step.isLast}
                          onClick={() => onMovePlacementStepDown?.(step.index)}
                          className="rounded-lg border border-white/10 p-2 text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-35"
                          aria-label="Move placement level down"
                        >
                          <ArrowDown size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeletePlacementStep?.(step.id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--status-danger)] transition hover:border-[var(--status-danger)]/40"
                          aria-label="Delete placement level"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 grid gap-3 lg:grid-cols-[0.34fr_0.66fr]">
                      <CrestfallSelect
                        label="Level Type"
                        value={step.kind}
                        options={placementStepKindOptions}
                        onChange={(kind) =>
                          onChangePlacementStepKind?.(step.id, kind)
                        }
                      />

                      <label className="block">
                        <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                          Label
                        </span>

                        <input
                          value={step.label}
                          onChange={(event) =>
                            onChangePlacementStepLabel?.(
                              step.id,
                              event.target.value
                            )
                          }
                          onBlur={() => onBlurPlacementStepLabel?.(step.id)}
                          placeholder="Pants pocket, back closet, top shelf..."
                          className="mt-2 w-full rounded-xl border border-white/10 bg-black/45 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition hover:border-[var(--muted-gold)]/35 focus:border-[var(--muted-gold)]/45"
                        />
                      </label>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-xl border border-dashed border-white/10 bg-black/30 p-4 text-sm leading-6 text-[var(--muted)]">
                  No placement levels have been added yet.
                </p>
              )}

              <div className="rounded-xl border border-dashed border-[var(--muted-gold)]/20 bg-black/20 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]">
                      Add Placement Level
                    </p>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                      Add a new level to the placement path. The new row is
                      added to the registry immediately, and changes made to
                      that row are included when you use Save Changes.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAddPlacementStep?.()}
                    disabled={!canAddPlacementStep}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus size={14} />
                    Add New Level
                  </button>
                </div>
              </div>

              <label className="block">
                <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                  Placement Note
                </span>

                <textarea
                  rows={3}
                  value={placementNote}
                  onChange={(event) =>
                    onChangePlacementNote?.(event.target.value)
                  }
                  placeholder="Optional detail that does not fit cleanly into the placement path."
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/45 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition hover:border-[var(--muted-gold)]/35 focus:border-[var(--muted-gold)]/45"
                />
              </label>
            </div>
          )}
        </div>
      ) : null}

      {pickerSlot}
    </div>
  );
}
