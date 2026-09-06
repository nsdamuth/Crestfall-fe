"use client";

import { Coins, Layers, Plus } from "lucide-react";

import CrestfallSelect from "@/components/ui/CrestfallSelect";
import IngredientSlotView from "@/components/studio/image-studio/ingredient-slot/IngredientSlot.view";

export default function RemixComposerView({
  title = "Remix a Scene",
  characterSlots = [],
  maxCharacters = 4,
  addCharacterLabel = "Add Character",
  canAddCharacter = true,
  locationSlot = null,
  directionValue = "",
  directionPlaceholder = "Who is where, what is happening, what the light is doing.",
  ratioField = null,
  manifest = [],
  coinBalanceLabel = "0",
  coinCostLabel = "8",
  canRemix = false,
  helpText = "",
  remixLabel = "Remix scene",
  onAddCharacter = null,
  onChangeDirection = null,
  onRemix = null,
}) {
  return (
    <aside className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-[var(--surface-2)] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
            Remix
          </p>
          <h2 className="mt-1 font-display text-2xl text-[var(--ink)]">{title}</h2>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 text-[var(--gold-ornament)]">
          <Layers size={16} aria-hidden="true" />
        </span>
      </div>

      <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
        Two or more Characters, one Location, an Outfit per Character. Each asset
        carries its own description, so nothing is copied into the prompt.
      </p>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--ink-dim)]">
            Characters ({characterSlots.length} of {maxCharacters})
          </span>
          <button
            type="button"
            disabled={!canAddCharacter}
            onClick={() => onAddCharacter?.()}
            className="flex items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--line)] px-2.5 py-1 text-xs text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)]"
          >
            <Plus size={12} aria-hidden="true" />
            {addCharacterLabel}
          </button>
        </div>
        <ul className="mt-2 grid grid-cols-2 gap-3">
          {characterSlots.map((slot) => (
            <li
              key={slot.id}
              className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-1)] p-2"
            >
              <IngredientSlotView {...slot.character} />
              <div className="mt-2">
                <IngredientSlotView {...slot.outfit} />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[140px_1fr]">
        <div>
          <span className="text-xs text-[var(--ink-dim)]">Location</span>
          <div className="mt-1">
            {locationSlot ? <IngredientSlotView {...locationSlot} /> : null}
          </div>
        </div>
        <label className="block">
          <span className="text-xs text-[var(--ink-dim)]">Scene direction</span>
          <textarea
            value={directionValue}
            onChange={(event) => onChangeDirection?.(event.target.value)}
            placeholder={directionPlaceholder}
            rows={6}
            className="mt-1 w-full resize-none rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-1)] p-3 text-sm leading-6 text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none focus-visible:shadow-[var(--focus-ring)]"
          />
        </label>
      </div>

      {ratioField ? (
        <div className="mt-4">
          <CrestfallSelect {...ratioField} />
        </div>
      ) : null}

      {manifest.length ? (
        <div className="mt-4 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-1)] p-3">
          <p className="text-xs text-[var(--ink-dim)]">Sent with this remix</p>
          <ul className="mt-2 space-y-1 text-xs">
            {manifest.map((entry) => (
              <li key={entry.id} className="flex justify-between gap-3">
                <span className="text-[var(--ink-dim)]">{entry.role}</span>
                <span className="truncate text-[var(--ink)]">{entry.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {helpText ? (
        <p className="mt-3 text-xs leading-5 text-[var(--status-warning-text)]">{helpText}</p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
        <p className="flex items-center gap-1.5 text-xs text-[var(--ink-dim)]">
          <Coins size={13} aria-hidden="true" />
          <span>
            {coinCostLabel} coins per remix. Balance {coinBalanceLabel}.
          </span>
        </p>
        <button
          type="button"
          disabled={!canRemix}
          onClick={() => onRemix?.()}
          className="cf-btn cf-btn--primary"
        >
          <Layers size={14} aria-hidden="true" />
          {remixLabel}
        </button>
      </div>
    </aside>
  );
}
