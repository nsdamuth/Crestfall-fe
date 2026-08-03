"use client";

import { Plus } from "lucide-react";

import {
  COMMAND_OUTCOME_EFFECT_MODES,
} from "./MechanicsCommandOutcomes.contract.js";
import {
  getCommandOutcomeEffectModeDescription,
} from "./mechanicsCommandOutcomesNormalization.js";

export default function MechanicsCommandOutcomesView({
  branches = [],
  patchOutcome,
  addOutcomeEffect,
  patchOutcomeEffect,
  removeOutcomeEffect,
  EffectCardComponent = null,
  argumentOptions = [],
  numericArgumentOptions = [],
}) {
  return (
    <div className="rounded-xl border border-[var(--muted-gold)]/20 bg-black/20 p-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
          Conditional Outcome Effects
        </p>
        <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
          Select the effect set for each authoritative resolution outcome. Existing Base Success Effects remain backward-compatible through INHERIT.
        </p>
      </div>

      <div className="mt-4 grid gap-4">
        {branches.map((branch) => {
          const outcome = branch.outcome;
          const branchEffects = Array.isArray(branch.effects)
            ? branch.effects
            : [];
          const canAddEffects = ["REPLACE", "APPEND"].includes(
            branch.effectMode
          );

          return (
            <div
              key={outcome}
              className="rounded-xl border border-white/10 bg-black/30 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {outcome.replaceAll("_", " ")}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                    {getCommandOutcomeEffectModeDescription(
                      outcome,
                      branch.effectMode
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => addOutcomeEffect(outcome)}
                  disabled={!canAddEffects}
                  title={
                    canAddEffects
                      ? `Add ${outcome} effect`
                      : "Choose REPLACE or APPEND before adding branch effects"
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus size={14} />
                  Add Effect
                </button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-[var(--muted)]">
                  <span>Effect Mode</span>
                  <select
                    value={branch.effectMode}
                    onChange={(event) =>
                      patchOutcome(outcome, {
                        effectMode: event.target.value,
                      })
                    }
                    className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
                  >
                    {COMMAND_OUTCOME_EFFECT_MODES.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
                    Outcome Summary
                  </span>
                  <textarea
                    value={branch.summary}
                    onChange={(event) =>
                      patchOutcome(outcome, {
                        summary: event.target.value,
                      })
                    }
                    rows={2}
                    placeholder="Optional deterministic result note."
                    className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
                  />
                </label>
              </div>

              {branchEffects.length ? (
                <div className="mt-4 grid gap-4">
                  {branchEffects.map((effect, effectIndex) =>
                    EffectCardComponent ? (
                      <EffectCardComponent
                        key={effect.id || effectIndex}
                        effect={effect}
                        effectIndex={effectIndex}
                        outcome={outcome}
                        argumentOptions={argumentOptions}
                        numericArgumentOptions={numericArgumentOptions}
                        onPatch={(patch) =>
                          patchOutcomeEffect(outcome, effectIndex, patch)
                        }
                        onRemove={() =>
                          removeOutcomeEffect(outcome, effectIndex)
                        }
                      />
                    ) : (
                      <pre
                        key={effect.id || effectIndex}
                        className="overflow-auto rounded-xl border border-white/10 bg-black/35 p-4 text-xs text-[var(--muted)]"
                      >
                        {JSON.stringify(effect, null, 2)}
                      </pre>
                    )
                  )}
                </div>
              ) : (
                <p className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs leading-5 text-[var(--muted)]">
                  No branch-specific effects configured.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
