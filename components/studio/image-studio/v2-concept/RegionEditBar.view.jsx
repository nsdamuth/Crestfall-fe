"use client";

import { Coins, Wand2 } from "lucide-react";

import IngredientSlotView from "@/components/studio/image-studio/ingredient-slot/IngredientSlot.view";

export default function RegionEditBarView({
  selectedSegmentLabel = "",
  promptValue = "",
  promptPlaceholder = "Describe the change for this region only.",
  quickActions = [],
  activeQuickActionId = "",
  ingredientSlot = null,
  coinCostLabel = "3",
  coinBalanceLabel = "0",
  canApply = false,
  helpText = "",
  applyLabel = "Apply edit",
  onChangePrompt = null,
  onSelectQuickAction = null,
  onApply = null,
}) {
  return (
    <aside className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-[var(--surface-2)] p-4">
      <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
        Region edit
      </p>
      <h2 className="mt-1 font-display text-2xl text-[var(--ink)]">
        {selectedSegmentLabel ? `Edit ${selectedSegmentLabel}` : "Select a segment"}
      </h2>

      {quickActions.length ? (
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Quick actions">
          {quickActions.map((action) => {
            const Icon = action.Icon;
            const isActive = action.id === activeQuickActionId;
            return (
              <button
                key={action.id}
                type="button"
                aria-pressed={isActive}
                disabled={!selectedSegmentLabel}
                onClick={() => onSelectQuickAction?.(action.id)}
                className={`flex items-center gap-1.5 rounded-[var(--radius-full)] border px-3 py-1.5 text-xs transition disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)] ${
                  isActive
                    ? "border-[var(--gold-ornament)]/45 bg-[var(--gold-ornament)]/10 text-[var(--ink)]"
                    : "border-[var(--line)] text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
                }`}
              >
                {Icon ? <Icon size={13} aria-hidden="true" /> : null}
                {action.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_140px]">
        <label className="block">
          <span className="text-xs text-[var(--ink-dim)]">Region prompt</span>
          <textarea
            value={promptValue}
            onChange={(event) => onChangePrompt?.(event.target.value)}
            placeholder={promptPlaceholder}
            rows={4}
            disabled={!selectedSegmentLabel}
            className="mt-1 w-full resize-none rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-1)] p-3 text-sm leading-6 text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none focus-visible:shadow-[var(--focus-ring)] disabled:opacity-[var(--state-disabled-opacity)]"
          />
        </label>

        <div>
          <span className="text-xs text-[var(--ink-dim)]">Ingredient driving the edit</span>
          <div className="mt-1">
            {ingredientSlot ? <IngredientSlotView {...ingredientSlot} /> : null}
          </div>
        </div>
      </div>

      {helpText ? (
        <p className="mt-3 text-xs leading-5 text-[var(--ink-dim)]">{helpText}</p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
        <p className="flex items-center gap-1.5 text-xs text-[var(--ink-dim)]">
          <Coins size={13} aria-hidden="true" />
          <span>
            {coinCostLabel} coins per edit. Balance {coinBalanceLabel}.
          </span>
        </p>
        <button
          type="button"
          disabled={!canApply}
          onClick={() => onApply?.()}
          className="cf-btn cf-btn--primary"
        >
          <Wand2 size={14} aria-hidden="true" />
          {applyLabel}
        </button>
      </div>
    </aside>
  );
}
