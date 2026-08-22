"use client";

import { Plus } from "lucide-react";

import {
  COMMAND_OUTCOME_EFFECT_MODES,
} from "./MechanicsCommandOutcomes.contract.js";
import {
  getCommandOutcomeEffectModeDescription,
} from "./mechanicsCommandOutcomesNormalization.js";
import {
  SelectField,
  SHORT_LONGFORM_MAX_LENGTH,
  TextAreaField,
} from "../../SharedFields";

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
    <div className="rounded-xl border border-[var(--gold-ornament)]/20 bg-black/20 p-4">
      <div>
        <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
          Conditional Outcome Effects
        </p>
        <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
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
                  <p className="text-sm font-medium text-[var(--ink)]">
                    {outcome.replaceAll("_", " ")}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[var(--ink-dim)]">
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
                  className="cf-btn cf-btn--primary cf-btn--sm"
                >
                  <Plus size={14} />
                  Add effect
                </button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <SelectField
                  label="Effect Mode"
                  value={branch.effectMode}
                  onChange={(value) => patchOutcome(outcome, { effectMode: value })}
                  options={COMMAND_OUTCOME_EFFECT_MODES.map((mode) => ({
                    value: mode,
                    label: mode,
                  }))}
                />

                <TextAreaField
                  label="Outcome Summary"
                  value={branch.summary}
                  onChange={(value) =>
                    patchOutcome(outcome, {
                      summary: value,
                    })
                  }
                  maxLength={SHORT_LONGFORM_MAX_LENGTH}
                  placeholder="Optional deterministic result note."
                />
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
                        className="overflow-auto rounded-xl border border-white/10 bg-black/35 p-4 text-xs text-[var(--ink-dim)]"
                      >
                        {JSON.stringify(effect, null, 2)}
                      </pre>
                    )
                  )}
                </div>
              ) : (
                <p className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs leading-5 text-[var(--ink-dim)]">
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
