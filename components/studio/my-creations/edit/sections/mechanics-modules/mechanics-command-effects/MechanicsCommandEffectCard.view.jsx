"use client";

import { Trash2 } from "lucide-react";

import {
  MECHANICS_COMMAND_EFFECT_TYPES,
} from "./MechanicsCommandEffects.contract.js";
import {
  normalizeMechanicsCommandEffect,
  normalizeMechanicsEffectIdentifier,
  normalizeMechanicsEffectTargetBinding,
  normalizeMechanicsEffectValueBinding,
  supportsCommandEffectValueBinding,
} from "./mechanicsCommandEffectsNormalization.js";
import {
  MECHANICS_EFFECT_VALUE_BINDING_MISSING_POLICIES,
  MECHANICS_EFFECT_VALUE_BINDING_MODES,
  MECHANICS_EFFECT_VALUE_BINDING_ROUNDING,
} from "../mechanicsEffectValueBindingBuilder.js";
import {
  SelectField,
  SHORT_LONGFORM_MAX_LENGTH,
  TextAreaField,
} from "../../SharedFields";

function normalizeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function TextField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] transition placeholder:text-[var(--ink-dim)]"
      />
    </label>
  );
}

function EffectTargetBindingFields({ effect, argumentOptions, onPatch }) {
  const binding = normalizeMechanicsEffectTargetBinding(effect.targetBinding);
  const safeOptions = Array.isArray(argumentOptions) ? argumentOptions : [];

  return (
    <>
      <SelectField
        label="Apply Mechanics State To"
        value={binding.mode}
        onChange={(mode) => {
          onPatch({
            targetBinding: normalizeMechanicsEffectTargetBinding({
              ...binding,
              mode,
              argumentName:
                mode === "ARGUMENT"
                  ? binding.argumentName || safeOptions[0]?.name || ""
                  : "",
            }),
          });
        }}
        options={[
          { value: "FIXED", label: "Command / Module Scope" },
          {
            value: "ARGUMENT",
            label: "Resolved Command Argument",
            isDisabled: !safeOptions.length,
          },
        ]}
      />

      {binding.mode === "ARGUMENT" ? (
        safeOptions.length ? (
          <SelectField
            label="Resolved Argument"
            value={binding.argumentName}
            placeholder="Select an argument"
            onChange={(value) =>
              onPatch({
                targetBinding: normalizeMechanicsEffectTargetBinding({
                  ...binding,
                  mode: "ARGUMENT",
                  argumentName: value,
                }),
              })
            }
            options={safeOptions.map((argument) => ({
              value: argument.name,
              label: `${argument.label} · ${argument.type}`,
            }))}
          />
        ) : (
          <p className="rounded-xl border border-[var(--status-warning-border)] bg-[var(--status-warning-bed)] px-4 py-3 text-xs leading-5 text-[var(--status-warning-text)] md:col-span-2">
            Add a Character, Item, or Location command argument before binding an effect to a resolved target.
          </p>
        )
      ) : (
        <p className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs leading-5 text-[var(--ink-dim)]">
          Uses the command’s normal Mechanics scope. Choose a resolved argument to keep separate state for the targeted Character, Item, or Location.
        </p>
      )}
    </>
  );
}

function EffectValueFields({
  effect,
  numericArgumentOptions,
  onPatch,
  ProgressionProfileFieldsComponent,
}) {
  if (effect.type === "PROGRESSION_RECONCILE") {
    return ProgressionProfileFieldsComponent ? (
      <ProgressionProfileFieldsComponent
        profile={effect.progressionProfile}
        onChange={(nextProfile) =>
          onPatch({
            targetId: nextProfile.rankValueId,
            progressionProfile: nextProfile,
          })
        }
      />
    ) : null;
  }

  if (effect.type === "FLAG_CLEAR") {
    return (
      <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs leading-5 text-[var(--ink-dim)]">
        FLAG_CLEAR does not need a value. It clears the target flag.
      </div>
    );
  }

  if (effect.type === "FLAG_SET") {
    return (
      <SelectField
        label="Value"
        value={effect.value === false ? "false" : "true"}
        onChange={(value) => onPatch({ value: value === "true" })}
        options={[
          { value: "true", label: "true" },
          { value: "false", label: "false" },
        ]}
      />
    );
  }

  const options = Array.isArray(numericArgumentOptions)
    ? numericArgumentOptions
    : [];
  const supportsBinding = supportsCommandEffectValueBinding(effect.type);
  const valueBinding = normalizeMechanicsEffectValueBinding(
    effect.valueBinding,
    effect.type
  );

  function patchValueBinding(patch) {
    onPatch({
      valueBinding: normalizeMechanicsEffectValueBinding(
        { ...valueBinding, ...patch },
        effect.type
      ),
    });
  }

  function fixedValueField() {
    if (effect.type === "METER_DELTA") {
      return (
        <TextField
          label="Delta"
          type="number"
          value={String(effect.delta ?? effect.amount ?? 1)}
          onChange={(value) => {
            const delta = normalizeNumber(value, 0);
            onPatch({ delta, amount: delta });
          }}
          placeholder="2"
        />
      );
    }
    if (effect.type === "COUNTER_INCREMENT") {
      return (
        <TextField
          label="Amount"
          type="number"
          value={String(effect.amount ?? 1)}
          onChange={(value) => onPatch({ amount: normalizeNumber(value, 1) })}
          placeholder="1"
        />
      );
    }
    if (effect.type === "COUNTER_SET") {
      return (
        <TextField
          label="Value"
          type="number"
          value={String(effect.value ?? 0)}
          onChange={(value) => onPatch({ value: normalizeNumber(value, 0) })}
          placeholder="0"
        />
      );
    }
    return (
      <TextField
        label="Value"
        value={String(effect.value ?? "")}
        onChange={(value) => onPatch({ value })}
        placeholder="ready"
      />
    );
  }

  if (!supportsBinding) return fixedValueField();

  return (
    <div className="grid gap-4 rounded-xl border border-white/10 bg-black/20 p-4 md:col-span-2">
      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          label="Numeric Value Source"
          value={valueBinding.mode}
          onChange={(mode) => {
            patchValueBinding({
              mode,
              argumentName:
                mode === "ARGUMENT"
                  ? valueBinding.argumentName || options[0]?.name || ""
                  : "",
            });
          }}
          options={MECHANICS_EFFECT_VALUE_BINDING_MODES.map((mode) => ({
            value: mode,
            label: mode === "FIXED" ? "Fixed Authored Value" : "NUMBER Command Argument",
            isDisabled: mode === "ARGUMENT" && !options.length,
          }))}
        />

        {valueBinding.mode === "FIXED" ? (
          fixedValueField()
        ) : (
          <SelectField
            label="NUMBER Argument"
            value={valueBinding.argumentName}
            placeholder="Select a NUMBER argument"
            onChange={(value) => patchValueBinding({ argumentName: value })}
            options={options.map((argument) => ({
              value: argument.name,
              label: `${argument.label} · NUMBER`,
            }))}
          />
        )}
      </div>

      {valueBinding.mode === "ARGUMENT" ? (
        <>
          {!options.length ? (
            <p className="rounded-xl border border-[var(--status-warning-border)] bg-[var(--status-warning-bed)] px-4 py-3 text-xs leading-5 text-[var(--status-warning-text)]">
              Add a NUMBER command argument before binding this effect value.
            </p>
          ) : null}
          <div className="grid gap-4 md:grid-cols-3">
            <TextField label="Multiplier" type="number" value={String(valueBinding.multiplier)} onChange={(value) => patchValueBinding({ multiplier: normalizeNumber(value, 1) })} placeholder="1" />
            <TextField label="Divisor" type="number" value={String(valueBinding.divisor)} onChange={(value) => patchValueBinding({ divisor: normalizeNumber(value, 1) || 1 })} placeholder="1" />
            <TextField label="Offset" type="number" value={String(valueBinding.offset)} onChange={(value) => patchValueBinding({ offset: normalizeNumber(value, 0) })} placeholder="0" />
            <SelectField
              label="Rounding"
              value={valueBinding.rounding}
              onChange={(value) => patchValueBinding({ rounding: value })}
              options={MECHANICS_EFFECT_VALUE_BINDING_ROUNDING.map((rounding) => ({
                value: rounding,
                label: rounding,
              }))}
            />
            <TextField label="Minimum Bound Value" type="number" value={valueBinding.minValue ?? ""} onChange={(value) => patchValueBinding({ minValue: value === "" ? null : normalizeNumber(value, 0) })} placeholder="Optional" />
            <TextField label="Maximum Bound Value" type="number" value={valueBinding.maxValue ?? ""} onChange={(value) => patchValueBinding({ maxValue: value === "" ? null : normalizeNumber(value, 0) })} placeholder="Optional" />
            <div className="md:col-span-3">
              <SelectField
                label="Missing Argument Policy"
                value={valueBinding.missingPolicy}
                onChange={(value) => patchValueBinding({ missingPolicy: value })}
                options={MECHANICS_EFFECT_VALUE_BINDING_MISSING_POLICIES.map((policy) => ({
                  value: policy,
                  label: policy,
                }))}
                helperText="REJECT blocks the command before rolling. IGNORE keeps the authored fixed value as a fallback."
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default function MechanicsCommandEffectCardView({
  effect,
  effectIndex = 0,
  eyebrow = "Effect",
  argumentOptions = [],
  numericArgumentOptions = [],
  patchEffect,
  removeEffect,
  ProgressionProfileFieldsComponent = null,
}) {
  const safeEffect = normalizeMechanicsCommandEffect(effect, effect?.type);

  return (
    <div className="rounded-xl border border-white/10 bg-black/35 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
          {eyebrow} {effectIndex + 1}
        </p>
        <button type="button" onClick={removeEffect} className="cf-btn cf-btn--danger cf-btn--sm" title="Remove effect">
          <Trash2 size={13} />
          Remove
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <TextField label="Effect ID" value={safeEffect.id} onChange={(value) => patchEffect({ id: normalizeMechanicsEffectIdentifier(value, `effect_${effectIndex + 1}`) })} placeholder="set_player_settled" />
        <SelectField
          label="Effect Type"
          value={safeEffect.type}
          onChange={(value) => patchEffect(normalizeMechanicsCommandEffect({ ...safeEffect, type: value }, value))}
          options={MECHANICS_COMMAND_EFFECT_TYPES.map((effectType) => ({
            value: effectType,
            label: effectType,
          }))}
        />
        <TextField label="Mechanics State ID" value={safeEffect.targetId} onChange={(value) => patchEffect({ targetId: normalizeMechanicsEffectIdentifier(value, value) })} placeholder="player_settled" />
        <EffectTargetBindingFields effect={safeEffect} argumentOptions={argumentOptions} onPatch={patchEffect} />
        <EffectValueFields effect={safeEffect} numericArgumentOptions={numericArgumentOptions} onPatch={patchEffect} ProgressionProfileFieldsComponent={ProgressionProfileFieldsComponent} />
        <div className="md:col-span-2">
          <TextAreaField
            label="Effect Reason"
            value={safeEffect.reason}
            onChange={(value) => patchEffect({ reason: value })}
            placeholder="Describe why this Mechanics effect occurs."
            maxLength={SHORT_LONGFORM_MAX_LENGTH}
          />
        </div>
      </div>
    </div>
  );
}
