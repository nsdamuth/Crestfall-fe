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

function normalizeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function TextField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
      />
    </label>
  );
}

function EffectTargetBindingFields({ effect, argumentOptions, onPatch }) {
  const binding = normalizeMechanicsEffectTargetBinding(effect.targetBinding);
  const safeOptions = Array.isArray(argumentOptions) ? argumentOptions : [];

  return (
    <>
      <label className="grid gap-2 text-sm text-[var(--muted)]">
        <span>Apply Mechanics State To</span>
        <select
          value={binding.mode}
          onChange={(event) => {
            const mode = event.target.value;
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
          className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
        >
          <option value="FIXED">Command / Module Scope</option>
          <option value="ARGUMENT" disabled={!safeOptions.length}>
            Resolved Command Argument
          </option>
        </select>
      </label>

      {binding.mode === "ARGUMENT" ? (
        safeOptions.length ? (
          <label className="grid gap-2 text-sm text-[var(--muted)]">
            <span>Resolved Argument</span>
            <select
              value={binding.argumentName}
              onChange={(event) =>
                onPatch({
                  targetBinding: normalizeMechanicsEffectTargetBinding({
                    ...binding,
                    mode: "ARGUMENT",
                    argumentName: event.target.value,
                  }),
                })
              }
              className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
            >
              <option value="">Select an argument</option>
              {safeOptions.map((argument) => (
                <option key={argument.name} value={argument.name}>
                  {argument.label} · {argument.type}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <p className="rounded-xl border border-amber-300/20 bg-amber-500/10 px-4 py-3 text-xs leading-5 text-amber-100 md:col-span-2">
            Add a Character, Item, or Location command argument before binding an effect to a resolved target.
          </p>
        )
      ) : (
        <p className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs leading-5 text-[var(--muted)]">
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
      <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs leading-5 text-[var(--muted)]">
        FLAG_CLEAR does not need a value. It clears the target flag.
      </div>
    );
  }

  if (effect.type === "FLAG_SET") {
    return (
      <label className="grid gap-2 text-sm text-[var(--muted)]">
        <span>Value</span>
        <select
          value={effect.value === false ? "false" : "true"}
          onChange={(event) => onPatch({ value: event.target.value === "true" })}
          className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      </label>
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
        <label className="grid gap-2 text-sm text-[var(--muted)]">
          <span>Numeric Value Source</span>
          <select
            value={valueBinding.mode}
            onChange={(event) => {
              const mode = event.target.value;
              patchValueBinding({
                mode,
                argumentName:
                  mode === "ARGUMENT"
                    ? valueBinding.argumentName || options[0]?.name || ""
                    : "",
              });
            }}
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
          >
            {MECHANICS_EFFECT_VALUE_BINDING_MODES.map((mode) => (
              <option
                key={mode}
                value={mode}
                disabled={mode === "ARGUMENT" && !options.length}
              >
                {mode === "FIXED" ? "Fixed Authored Value" : "NUMBER Command Argument"}
              </option>
            ))}
          </select>
        </label>

        {valueBinding.mode === "FIXED" ? (
          fixedValueField()
        ) : (
          <label className="grid gap-2 text-sm text-[var(--muted)]">
            <span>NUMBER Argument</span>
            <select
              value={valueBinding.argumentName}
              onChange={(event) =>
                patchValueBinding({ argumentName: event.target.value })
              }
              className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
            >
              <option value="">Select a NUMBER argument</option>
              {options.map((argument) => (
                <option key={argument.name} value={argument.name}>
                  {argument.label} · NUMBER
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {valueBinding.mode === "ARGUMENT" ? (
        <>
          {!options.length ? (
            <p className="rounded-xl border border-amber-300/20 bg-amber-500/10 px-4 py-3 text-xs leading-5 text-amber-100">
              Add a NUMBER command argument before binding this effect value.
            </p>
          ) : null}
          <div className="grid gap-4 md:grid-cols-3">
            <TextField label="Multiplier" type="number" value={String(valueBinding.multiplier)} onChange={(value) => patchValueBinding({ multiplier: normalizeNumber(value, 1) })} placeholder="1" />
            <TextField label="Divisor" type="number" value={String(valueBinding.divisor)} onChange={(value) => patchValueBinding({ divisor: normalizeNumber(value, 1) || 1 })} placeholder="1" />
            <TextField label="Offset" type="number" value={String(valueBinding.offset)} onChange={(value) => patchValueBinding({ offset: normalizeNumber(value, 0) })} placeholder="0" />
            <label className="grid gap-2 text-sm text-[var(--muted)]">
              <span>Rounding</span>
              <select value={valueBinding.rounding} onChange={(event) => patchValueBinding({ rounding: event.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]">
                {MECHANICS_EFFECT_VALUE_BINDING_ROUNDING.map((rounding) => <option key={rounding} value={rounding}>{rounding}</option>)}
              </select>
            </label>
            <TextField label="Minimum Bound Value" type="number" value={valueBinding.minValue ?? ""} onChange={(value) => patchValueBinding({ minValue: value === "" ? null : normalizeNumber(value, 0) })} placeholder="Optional" />
            <TextField label="Maximum Bound Value" type="number" value={valueBinding.maxValue ?? ""} onChange={(value) => patchValueBinding({ maxValue: value === "" ? null : normalizeNumber(value, 0) })} placeholder="Optional" />
            <label className="grid gap-2 text-sm text-[var(--muted)] md:col-span-3">
              <span>Missing Argument Policy</span>
              <select value={valueBinding.missingPolicy} onChange={(event) => patchValueBinding({ missingPolicy: event.target.value })} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]">
                {MECHANICS_EFFECT_VALUE_BINDING_MISSING_POLICIES.map((policy) => <option key={policy} value={policy}>{policy}</option>)}
              </select>
              <span className="text-[11px] leading-5 text-[var(--muted)]">
                REJECT blocks the command before rolling. IGNORE keeps the authored fixed value as a fallback.
              </span>
            </label>
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
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
          {eyebrow} {effectIndex + 1}
        </p>
        <button type="button" onClick={removeEffect} className="rounded-xl border border-white/10 bg-transparent p-2 text-[var(--status-danger)] transition hover:bg-white/5" title="Remove effect">
          <Trash2 size={13} />
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <TextField label="Effect ID" value={safeEffect.id} onChange={(value) => patchEffect({ id: normalizeMechanicsEffectIdentifier(value, `effect_${effectIndex + 1}`) })} placeholder="set_player_settled" />
        <label className="grid gap-2 text-sm text-[var(--muted)]">
          <span>Effect Type</span>
          <select value={safeEffect.type} onChange={(event) => patchEffect(normalizeMechanicsCommandEffect({ ...safeEffect, type: event.target.value }, event.target.value))} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]">
            {MECHANICS_COMMAND_EFFECT_TYPES.map((effectType) => <option key={effectType} value={effectType}>{effectType}</option>)}
          </select>
        </label>
        <TextField label="Mechanics State ID" value={safeEffect.targetId} onChange={(value) => patchEffect({ targetId: normalizeMechanicsEffectIdentifier(value, value) })} placeholder="player_settled" />
        <EffectTargetBindingFields effect={safeEffect} argumentOptions={argumentOptions} onPatch={patchEffect} />
        <EffectValueFields effect={safeEffect} numericArgumentOptions={numericArgumentOptions} onPatch={patchEffect} ProgressionProfileFieldsComponent={ProgressionProfileFieldsComponent} />
        <label className="block md:col-span-2">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">Effect Reason</span>
          <textarea value={safeEffect.reason} onChange={(event) => patchEffect({ reason: event.target.value })} rows={2} placeholder="Describe why this Mechanics effect occurs." className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50" />
        </label>
      </div>
    </div>
  );
}
