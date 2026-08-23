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
import {
  SelectField,
  SHORT_LONGFORM_MAX_LENGTH,
  TextAreaField,
  TextField,
} from "../../SharedFields";

const EYEBROW_CLASS =
  "flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]";

function valueToInput(value) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function SmallActionButton({ children, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="cf-btn cf-btn--primary cf-btn--sm"
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
        <p className={EYEBROW_CLASS}>
          Condition {conditionIndex + 1}
        </p>
        <button
          type="button"
          onClick={removeCondition}
          className="cf-btn cf-btn--danger cf-btn--sm"
          title="Remove condition"
        >
          <Trash2 size={13} />
          Remove
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <SelectField
          label="Condition Type"
          value={condition.conditionType}
          onChange={(value) => patchCondition({ conditionType: value })}
          options={MECHANICS_GUARD_CONDITION_TYPES.map((type) => ({
            value: type,
            label: type,
          }))}
        />

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

        <SelectField
          label="Operator"
          value={condition.operator}
          onChange={(value) => patchCondition({ operator: value })}
          options={MECHANICS_GUARD_OPERATORS.map((operator) => ({
            value: operator,
            label: operator,
          }))}
        />

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
    <article className="overflow-hidden rounded-[var(--radius-md)] border border-white/10 bg-black/25">
      <div className="flex items-start justify-between gap-3 px-5 py-4">
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
          className="min-w-0 flex-1 text-left"
        >
          <p className={EYEBROW_CLASS}>
            Guard
          </p>
          <div className="mt-1 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="truncate text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">
                {guard.label || guard.id || `Guard ${guardIndex + 1}`}
              </h4>
              <p className="mt-1 text-xs leading-5 text-[var(--ink-dim)]">
                {guard.summary}
              </p>
            </div>
            <ChevronDown
              size={18}
              className={`mt-1 shrink-0 text-[var(--gold-ornament)] transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>
        <button
          type="button"
          onClick={() => removeGuard(guardIndex)}
          className="cf-btn cf-btn--danger cf-btn--sm"
          title="Remove guard"
        >
          <Trash2 size={13} />
          Remove
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

            <SelectField
              label="Enforcement"
              value={guard.enforcement}
              onChange={(value) => patchGuard(guardIndex, { enforcement: value })}
              options={MECHANICS_GUARD_ENFORCEMENTS.map((enforcement) => ({
                value: enforcement,
                label: enforcement,
              }))}
            />

            <SelectField
              label="Condition Mode"
              value={guard.mode}
              onChange={(value) => patchGuard(guardIndex, { mode: value })}
              options={MECHANICS_GUARD_MODES.map((mode) => ({
                value: mode,
                label: mode,
              }))}
            />

            <SelectField
              label="Composer Visibility"
              value={guard.composerVisibility}
              onChange={(value) =>
                patchGuard(guardIndex, { composerVisibility: value })
              }
              options={MECHANICS_GUARD_COMPOSER_VISIBILITIES.map((visibility) => ({
                value: visibility,
                label: visibility,
              }))}
            />

            <SelectField
              label="Public Visibility"
              value={guard.publicVisibility}
              onChange={(value) => patchGuard(guardIndex, { publicVisibility: value })}
              options={MECHANICS_GUARD_PUBLIC_VISIBILITIES.map((visibility) => ({
                value: visibility,
                label: visibility,
              }))}
            />
          </div>

          <div className="mt-5 border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className={EYEBROW_CLASS}>
                Conditions
              </p>
              <SmallActionButton onClick={() => addCondition(guardIndex)}>
                <Plus size={14} />
                Add condition
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
              <p className="mt-4 text-sm text-[var(--ink-faint)]">
                No conditions yet. Add at least one condition for the guard to evaluate.
              </p>
            )}
          </div>

          <div className="mt-5 grid gap-4">
            <TextAreaField
              label="On Fail Summary"
              value={guard.onFail.summary}
              onChange={(value) =>
                patchGuard(guardIndex, {
                  onFail: { summary: value },
                })
              }
              placeholder="The player has reached too many boundary warnings."
              maxLength={SHORT_LONGFORM_MAX_LENGTH}
            />

            <TextAreaField
              label="On Fail Composer Guidance"
              value={guard.onFail.composerGuidance}
              onChange={(value) =>
                patchGuard(guardIndex, {
                  onFail: { composerGuidance: value },
                })
              }
              placeholder="Do not continue warm, intimate, trusting, or emotionally escalating content."
              maxLength={SHORT_LONGFORM_MAX_LENGTH}
            />

            <TextAreaField
              label="On Pass Summary"
              value={guard.onPass.summary}
              onChange={(value) =>
                patchGuard(guardIndex, {
                  onPass: { summary: value },
                })
              }
              placeholder="Boundary warning count is below the lock threshold."
              maxLength={SHORT_LONGFORM_MAX_LENGTH}
            />
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
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className={EYEBROW_CLASS}>
            Visual Builder
          </p>
          <h3 className="mt-2 font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)]">Guards</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
            Define deterministic lock and guidance rules. Guards save into
            instanceData.guards and are evaluated by middleware before the
            composer response is finalized.
          </p>
        </div>
        <SmallActionButton onClick={addGuard}>
          <Plus size={14} />
          Add guard
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
        <p className="mt-6 text-sm leading-6 text-[var(--ink-faint)]">
          No guards defined yet. Add a hard lock, soft lock, or guidance rule.
        </p>
      )}
    </div>
  );
}
