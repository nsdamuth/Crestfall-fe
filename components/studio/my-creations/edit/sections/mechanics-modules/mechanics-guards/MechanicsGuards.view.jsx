"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

import {
  MECHANICS_GUARD_COMPOSER_VISIBILITIES,
  MECHANICS_GUARD_CONDITION_TYPES,
  MECHANICS_GUARD_ENFORCEMENTS,
  MECHANICS_GUARD_MODES,
  MECHANICS_GUARD_OPERATORS,
  MECHANICS_GUARD_PUBLIC_VISIBILITIES,
} from "./MechanicsGuards.contract.js";

function valueToInput(value) {
  if (value === null || value === undefined) return "";
  return String(value);
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

function SmallActionButton({ children, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function GuardConditionCard({
  condition,
  conditionIndex,
  patchCondition,
  removeCondition,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/35 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
          Condition {conditionIndex + 1}
        </p>
        <button
          type="button"
          onClick={removeCondition}
          className="rounded-lg border border-red-300/20 bg-red-500/10 p-2 text-red-200 transition hover:bg-red-500/20"
          title="Remove condition"
        >
          <Trash2 size={13} />
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-[var(--muted)]">
          <span>Condition Type</span>
          <select
            value={condition.conditionType}
            onChange={(event) =>
              patchCondition({ conditionType: event.target.value })
            }
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
          >
            {MECHANICS_GUARD_CONDITION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <TextField
          label="Target ID"
          value={condition.id}
          onChange={(value) => patchCondition({ id: value })}
          placeholder="boundary_warning_count"
        />

        <TextField
          label="Field"
          value={condition.field}
          onChange={(value) => patchCondition({ field: value })}
          placeholder="value"
        />

        <label className="grid gap-2 text-sm text-[var(--muted)]">
          <span>Operator</span>
          <select
            value={condition.operator}
            onChange={(event) => patchCondition({ operator: event.target.value })}
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
          >
            {MECHANICS_GUARD_OPERATORS.map((operator) => (
              <option key={operator} value={operator}>
                {operator}
              </option>
            ))}
          </select>
        </label>

        <TextField
          label="Value"
          value={valueToInput(condition.value)}
          onChange={(value) => patchCondition({ value })}
          placeholder="3"
        />
      </div>
    </div>
  );
}

function GuardCard({
  guard,
  guardIndex,
  foldSignal,
  patchGuard,
  removeGuard,
  addCondition,
  patchCondition,
  removeCondition,
}) {
  const [expanded, setExpanded] = useState(guardIndex === 0);

  useEffect(() => {
    if (!foldSignal?.revision) return;
    setExpanded(foldSignal.expanded === true);
  }, [foldSignal?.revision, foldSignal?.expanded]);

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-black/25">
      <div className="flex items-start justify-between gap-3 px-5 py-4">
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
          className="min-w-0 flex-1 text-left"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Guard
          </p>
          <div className="mt-1 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="truncate text-xl text-[var(--foreground)]">
                {guard.label || guard.id || `Guard ${guardIndex + 1}`}
              </h4>
              <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                {guard.summary}
              </p>
            </div>
            <ChevronDown
              size={18}
              className={`mt-1 shrink-0 text-[var(--muted-gold)] transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>
        <button
          type="button"
          onClick={() => removeGuard(guardIndex)}
          className="rounded-lg border border-red-300/20 bg-red-500/10 p-2 text-red-200 transition hover:bg-red-500/20"
          title="Remove guard"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {expanded ? (
        <div className="border-t border-white/10 p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Guard ID"
              value={guard.id}
              onChange={(value) => patchGuard(guardIndex, { id: value })}
              placeholder="boundary_warning_lock"
            />
            <TextField
              label="Label"
              value={guard.label}
              onChange={(value) =>
                patchGuard(guardIndex, {
                  label: value,
                  ...(guard.id ? {} : { id: value }),
                })
              }
              placeholder="Boundary Warning Lock"
            />

            <label className="grid gap-2 text-sm text-[var(--muted)]">
              <span>Enforcement</span>
              <select
                value={guard.enforcement}
                onChange={(event) =>
                  patchGuard(guardIndex, { enforcement: event.target.value })
                }
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
              >
                {MECHANICS_GUARD_ENFORCEMENTS.map((enforcement) => (
                  <option key={enforcement} value={enforcement}>
                    {enforcement}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm text-[var(--muted)]">
              <span>Condition Mode</span>
              <select
                value={guard.mode}
                onChange={(event) =>
                  patchGuard(guardIndex, { mode: event.target.value })
                }
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
              >
                {MECHANICS_GUARD_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm text-[var(--muted)]">
              <span>Composer Visibility</span>
              <select
                value={guard.composerVisibility}
                onChange={(event) =>
                  patchGuard(guardIndex, {
                    composerVisibility: event.target.value,
                  })
                }
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
              >
                {MECHANICS_GUARD_COMPOSER_VISIBILITIES.map((visibility) => (
                  <option key={visibility} value={visibility}>
                    {visibility}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm text-[var(--muted)]">
              <span>Public Visibility</span>
              <select
                value={guard.publicVisibility}
                onChange={(event) =>
                  patchGuard(guardIndex, { publicVisibility: event.target.value })
                }
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
              >
                {MECHANICS_GUARD_PUBLIC_VISIBILITIES.map((visibility) => (
                  <option key={visibility} value={visibility}>
                    {visibility}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
                Conditions
              </p>
              <SmallActionButton onClick={() => addCondition(guardIndex)}>
                <Plus size={14} />
                Add Condition
              </SmallActionButton>
            </div>

            {guard.conditions.length ? (
              <div className="mt-4 grid gap-4">
                {guard.conditions.map((condition, conditionIndex) => (
                  <GuardConditionCard
                    key={`${condition.id || conditionIndex}-${conditionIndex}`}
                    condition={condition}
                    conditionIndex={conditionIndex}
                    patchCondition={(patch) =>
                      patchCondition(guardIndex, conditionIndex, patch)
                    }
                    removeCondition={() =>
                      removeCondition(guardIndex, conditionIndex)
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[var(--muted)]">
                No conditions yet. Add at least one condition for the guard to evaluate.
              </p>
            )}
          </div>

          <div className="mt-5 grid gap-4">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
                On Fail Summary
              </span>
              <textarea
                value={guard.onFail.summary}
                onChange={(event) =>
                  patchGuard(guardIndex, {
                    onFail: { summary: event.target.value },
                  })
                }
                rows={2}
                placeholder="The player has reached too many boundary warnings."
                className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
                On Fail Composer Guidance
              </span>
              <textarea
                value={guard.onFail.composerGuidance}
                onChange={(event) =>
                  patchGuard(guardIndex, {
                    onFail: { composerGuidance: event.target.value },
                  })
                }
                rows={3}
                placeholder="Do not continue warm, intimate, trusting, or emotionally escalating content."
                className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
                On Pass Summary
              </span>
              <textarea
                value={guard.onPass.summary}
                onChange={(event) =>
                  patchGuard(guardIndex, {
                    onPass: { summary: event.target.value },
                  })
                }
                rows={2}
                placeholder="Boundary warning count is below the lock threshold."
                className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
              />
            </label>
          </div>
        </div>
      ) : null}
    </article>
  );
}

export default function MechanicsGuardsView({
  guards = [],
  foldSignal,
  addGuard,
  patchGuard,
  removeGuard,
  addCondition,
  patchCondition,
  removeCondition,
}) {
  return (
    <section className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/20 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            Visual Builder
          </p>
          <h3 className="mt-2 font-display text-3xl">Guards</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Define deterministic lock and guidance rules. Guards save into
            instanceData.guards and are evaluated by middleware before the
            composer response is finalized.
          </p>
        </div>
        <SmallActionButton onClick={addGuard}>
          <Plus size={14} />
          Add Guard
        </SmallActionButton>
      </div>

      {guards.length ? (
        <div className="mt-6 grid gap-4">
          {guards.map((guard, guardIndex) => (
            <GuardCard
              key={guard.id || guardIndex}
              guard={guard}
              guardIndex={guardIndex}
              foldSignal={foldSignal}
              patchGuard={patchGuard}
              removeGuard={removeGuard}
              addCondition={addCondition}
              patchCondition={patchCondition}
              removeCondition={removeCondition}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-sm leading-6 text-[var(--muted)]">
          No guards defined yet. Add a hard lock, soft lock, or guidance rule.
        </div>
      )}
    </section>
  );
}
