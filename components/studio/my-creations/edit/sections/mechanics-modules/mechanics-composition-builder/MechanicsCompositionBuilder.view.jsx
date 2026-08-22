import {
  ArrowDown,
  ArrowUp,
  GitBranch,
  Plus,
  Trash2,
  Workflow,
} from "lucide-react";
import {
  MECHANICS_EFFECT_VALUE_BINDING_MISSING_POLICIES,
  MECHANICS_EFFECT_VALUE_BINDING_ROUNDING,
  normalizeMechanicsEffectValueBindingBuilder,
  supportsMechanicsEffectValueBinding,
} from "../mechanicsEffectValueBindingBuilder.js";
import { CheckboxField, SelectField as SharedSelectField } from "../../SharedFields";

const EYEBROW_CLASS =
  "flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]";

function TextField({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <label className="grid gap-2 text-sm text-[var(--ink-dim)]">
      <span>{label}</span>
      <input
        type={type}
        value={value ?? ""}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--ink)] transition placeholder:text-[var(--ink-dim)]"
      />
    </label>
  );
}

// 4.4: native select retired for the branded kit dropdown grammar.
// This wrapper keeps its own id-based option shape (every call site
// in this file already uses it, including the disabled-with-reason
// suffix) and translates to SharedFields.SelectField underneath.
function SelectField({ label, value, options = [], onChange, disabled = false }) {
  const normalizedOptions = options.map((option) => {
    const normalized =
      typeof option === "string"
        ? { id: option, label: option.replaceAll("_", " ") }
        : option;
    const optionLabel =
      normalized.disabled && normalized.reason
        ? `${normalized.label} · ${normalized.reason}`
        : normalized.label;

    return { value: normalized.id, label: optionLabel, isDisabled: normalized.disabled === true };
  });

  return (
    <SharedSelectField
      label={label}
      value={value ?? ""}
      disabled={disabled}
      options={normalizedOptions}
      onChange={(nextValue) => onChange?.(nextValue)}
    />
  );
}

function OutcomeChecks({ options, selected, onToggle }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {options.map((outcome) => (
        <CheckboxField
          key={outcome}
          label={outcome.replaceAll("_", " ")}
          checked={selected.includes(outcome)}
          onChange={(checked) => onToggle?.(outcome, checked)}
        />
      ))}
    </div>
  );
}

function DependencyChecks({ options, selected, onToggle }) {
  if (!options.length) {
    return (
      <p className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs leading-5 text-[var(--ink-dim)]">
        No earlier composition steps are available as dependencies.
      </p>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => (
        <CheckboxField
          key={option.id}
          checked={selected.includes(option.id)}
          onChange={(checked) => onToggle?.(option.id, checked)}
          label={
            <span className="min-w-0">
              <span className="block truncate text-[var(--ink)]">
                {option.label}
              </span>
              {option.group ? (
                <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--ink-dim)]">
                  {option.group}
                </span>
              ) : null}
            </span>
          }
        />
      ))}
    </div>
  );
}

function StepActions({ canMoveUp, canMoveDown, onMoveUp, onMoveDown, onRemove }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={!canMoveUp}
        onClick={onMoveUp}
        className="rounded-lg border border-white/10 p-2 text-[var(--ink-dim)] transition hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-30"
        title="Move step up"
      >
        <ArrowUp size={14} />
      </button>
      <button
        type="button"
        disabled={!canMoveDown}
        onClick={onMoveDown}
        className="rounded-lg border border-white/10 p-2 text-[var(--ink-dim)] transition hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-30"
        title="Move step down"
      >
        <ArrowDown size={14} />
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="cf-btn cf-btn--danger cf-btn--sm"
        title="Remove step"
      >
        <Trash2 size={14} />
        Remove
      </button>
    </div>
  );
}

function ConditionValueField({ condition, onPatch }) {
  if (["TRUTHY", "FALSY"].includes(condition.operator)) {
    return (
      <p className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs leading-5 text-[var(--ink-dim)]">
        {condition.operator} does not require a comparison value.
      </p>
    );
  }

  if (["IN", "NOT_IN"].includes(condition.operator)) {
    return (
      <TextField
        label="Allowed Values"
        value={condition.values.join(", ")}
        onChange={(value) =>
          onPatch?.({
            values: String(value || "")
              .split(",")
              .map((entry) => entry.trim())
              .filter(Boolean),
          })
        }
        placeholder="ready, active, complete"
      />
    );
  }

  if (condition.bucket === "FLAG") {
    return (
      <SelectField
        label="Expected Value"
        value={condition.value === false ? "false" : "true"}
        options={[
          { id: "true", label: "true" },
          { id: "false", label: "false" },
        ]}
        onChange={(value) => onPatch?.({ value: value === "true" })}
      />
    );
  }

  return (
    <TextField
      label="Comparison Value"
      value={String(condition.value ?? "")}
      type={["METER", "COUNTER"].includes(condition.bucket) ? "number" : "text"}
      onChange={(value) =>
        onPatch?.({
          value: ["METER", "COUNTER"].includes(condition.bucket)
            ? Number(value)
            : value,
        })
      }
      placeholder={condition.bucket === "STAGE" ? "ready" : "1"}
    />
  );
}

function ConditionCard({
  stepId,
  condition,
  conditionBucketOptions,
  conditionScopeOptions,
  conditionOperatorOptions,
  targetArgumentOptions,
  onPatchCondition,
  onRemoveCondition,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/35 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className={EYEBROW_CLASS}>
          Condition
        </p>
        <button
          type="button"
          onClick={() => onRemoveCondition?.(stepId, condition.id)}
          className="cf-btn cf-btn--danger cf-btn--sm"
          title="Remove condition"
        >
          <Trash2 size={13} />
          Remove
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <TextField
          label="Condition ID"
          value={condition.id}
          onChange={(value) =>
            onPatchCondition?.(stepId, condition.id, { id: value })
          }
          placeholder="resource_ready"
        />
        <SelectField
          label="Bucket"
          value={condition.bucket}
          options={conditionBucketOptions}
          onChange={(value) =>
            onPatchCondition?.(stepId, condition.id, { bucket: value })
          }
        />
        <TextField
          label="Mechanics State ID"
          value={condition.mechanicsId}
          onChange={(value) =>
            onPatchCondition?.(stepId, condition.id, { mechanicsId: value })
          }
          placeholder="focus"
        />
        <SelectField
          label="Scope"
          value={condition.scopeMode}
          options={conditionScopeOptions}
          onChange={(value) =>
            onPatchCondition?.(stepId, condition.id, { scopeMode: value })
          }
        />
        {condition.scopeMode === "EXPLICIT" ? (
          <TextField
            label="Explicit Scope Key"
            value={condition.scopeKey}
            onChange={(value) =>
              onPatchCondition?.(stepId, condition.id, { scopeKey: value })
            }
            placeholder="PARTICIPANT:..."
          />
        ) : null}
        {condition.scopeMode === "TARGET_ARGUMENT" ? (
          <SelectField
            label="Resolved Target Argument"
            value={condition.argumentName}
            options={[
              { id: "", label: "Select an argument" },
              ...targetArgumentOptions.map((argument) => ({
                id: argument.id,
                label: `${argument.label} · ${argument.type}`,
              })),
            ]}
            onChange={(value) =>
              onPatchCondition?.(stepId, condition.id, {
                argumentName: value,
              })
            }
          />
        ) : null}
        <TextField
          label="Field"
          value={condition.field}
          onChange={(value) =>
            onPatchCondition?.(stepId, condition.id, { field: value })
          }
          placeholder="value"
        />
        <SelectField
          label="Operator"
          value={condition.operator}
          options={conditionOperatorOptions}
          onChange={(value) =>
            onPatchCondition?.(stepId, condition.id, { operator: value })
          }
        />
        <ConditionValueField
          condition={condition}
          onPatch={(patch) =>
            onPatchCondition?.(stepId, condition.id, patch)
          }
        />
        <div className="md:col-span-2 xl:col-span-3">
          <TextField
            label="Skip Message"
            value={condition.message}
            onChange={(value) =>
              onPatchCondition?.(stepId, condition.id, { message: value })
            }
            placeholder="Optional audit explanation when this condition fails."
          />
        </div>
      </div>
    </div>
  );
}

function EffectValueField({
  effect,
  numericArgumentOptions = [],
  ProgressionProfileFieldsComponent = null,
  onPatch,
}) {
  if (effect.type === "PROGRESSION_RECONCILE") {
    if (!ProgressionProfileFieldsComponent) return null;

    return (
      <ProgressionProfileFieldsComponent
        profile={effect.progressionProfile}
        onChange={(nextProfile) =>
          onPatch?.({
            targetId: nextProfile.rankValueId,
            progressionProfile: nextProfile,
          })
        }
      />
    );
  }

  if (effect.type === "FLAG_CLEAR") {
    return (
      <p className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs leading-5 text-[var(--ink-dim)]">
        FLAG_CLEAR needs no value.
      </p>
    );
  }

  if (effect.type === "FLAG_SET") {
    return (
      <SelectField
        label="Value"
        value={effect.value === false ? "false" : "true"}
        options={[
          { id: "true", label: "true" },
          { id: "false", label: "false" },
        ]}
        onChange={(value) => onPatch?.({ value: value === "true" })}
      />
    );
  }

  function fixedValueField() {
    if (effect.type === "METER_DELTA") {
      return (
        <TextField
          label="Delta"
          value={String(effect.delta ?? effect.amount ?? 0)}
          type="number"
          onChange={(value) =>
            onPatch?.({ delta: Number(value), amount: Number(value) })
          }
          placeholder="-2"
        />
      );
    }

    if (effect.type === "COUNTER_INCREMENT") {
      return (
        <TextField
          label="Amount"
          value={String(effect.amount ?? 1)}
          type="number"
          onChange={(value) => onPatch?.({ amount: Number(value) })}
          placeholder="1"
        />
      );
    }

    if (effect.type === "COUNTER_SET") {
      return (
        <TextField
          label="Value"
          value={String(effect.value ?? 0)}
          type="number"
          onChange={(value) => onPatch?.({ value: Number(value) })}
          placeholder="0"
        />
      );
    }

    return (
      <TextField
        label="Value"
        value={String(effect.value ?? "")}
        onChange={(value) => onPatch?.({ value })}
        placeholder="ready"
      />
    );
  }

  if (!supportsMechanicsEffectValueBinding(effect.type)) {
    return fixedValueField();
  }

  const binding = normalizeMechanicsEffectValueBindingBuilder(
    effect.valueBinding,
    effect.type
  );

  function patchBinding(patch) {
    onPatch?.({
      valueBinding: normalizeMechanicsEffectValueBindingBuilder(
        { ...binding, ...patch },
        effect.type
      ),
    });
  }

  return (
    <div className="grid gap-4 rounded-xl border border-white/10 bg-black/25 p-4 md:col-span-2 xl:col-span-3">
      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          label="Numeric Value Source"
          value={binding.mode}
          options={[
            { id: "FIXED", label: "Fixed Authored Value" },
            {
              id: "ARGUMENT",
              label: "NUMBER Command Argument",
              disabled: !numericArgumentOptions.length,
              reason: "Add a NUMBER argument first",
            },
          ]}
          onChange={(mode) =>
            patchBinding({
              mode,
              argumentName:
                mode === "ARGUMENT"
                  ? binding.argumentName || numericArgumentOptions[0]?.id || ""
                  : "",
            })
          }
        />
        {binding.mode === "FIXED" ? fixedValueField() : (
          <SelectField
            label="NUMBER Argument"
            value={binding.argumentName}
            options={[
              { id: "", label: "Select a NUMBER argument" },
              ...numericArgumentOptions.map((argument) => ({
                id: argument.id,
                label: argument.label,
              })),
            ]}
            onChange={(argumentName) => patchBinding({ argumentName })}
          />
        )}
      </div>

      {binding.mode === "ARGUMENT" ? (
        <div className="grid gap-4 md:grid-cols-3">
          <TextField
            label="Multiplier"
            type="number"
            value={String(binding.multiplier)}
            onChange={(value) => patchBinding({ multiplier: Number(value) })}
          />
          <TextField
            label="Divisor"
            type="number"
            value={String(binding.divisor)}
            onChange={(value) => patchBinding({ divisor: Number(value) || 1 })}
          />
          <TextField
            label="Offset"
            type="number"
            value={String(binding.offset)}
            onChange={(value) => patchBinding({ offset: Number(value) })}
          />
          <SelectField
            label="Rounding"
            value={binding.rounding}
            options={MECHANICS_EFFECT_VALUE_BINDING_ROUNDING}
            onChange={(rounding) => patchBinding({ rounding })}
          />
          <TextField
            label="Minimum Bound Value"
            type="number"
            value={binding.minValue ?? ""}
            onChange={(value) =>
              patchBinding({ minValue: value === "" ? null : Number(value) })
            }
            placeholder="Optional"
          />
          <TextField
            label="Maximum Bound Value"
            type="number"
            value={binding.maxValue ?? ""}
            onChange={(value) =>
              patchBinding({ maxValue: value === "" ? null : Number(value) })
            }
            placeholder="Optional"
          />
          <div className="md:col-span-3">
            <SelectField
              label="Missing Argument Policy"
              value={binding.missingPolicy}
              options={MECHANICS_EFFECT_VALUE_BINDING_MISSING_POLICIES}
              onChange={(missingPolicy) => patchBinding({ missingPolicy })}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function EffectCard({
  stepId,
  effect,
  effectTypeOptions,
  targetArgumentOptions,
  numericArgumentOptions,
  onPatchEffect,
  onRemoveEffect,
  ProgressionProfileFieldsComponent,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/35 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className={EYEBROW_CLASS}>
          Mechanics Effect
        </p>
        <button
          type="button"
          onClick={() => onRemoveEffect?.(stepId, effect.id)}
          className="cf-btn cf-btn--danger cf-btn--sm"
          title="Remove effect"
        >
          <Trash2 size={13} />
          Remove
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <TextField
          label="Effect ID"
          value={effect.id}
          onChange={(value) =>
            onPatchEffect?.(stepId, effect.id, { id: value })
          }
          placeholder="spend_focus"
        />
        <SelectField
          label="Effect Type"
          value={effect.type}
          options={effectTypeOptions}
          onChange={(value) =>
            onPatchEffect?.(stepId, effect.id, { type: value })
          }
        />
        {effect.type === "PROGRESSION_RECONCILE" ? (
          <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs leading-5 text-[var(--ink-dim)]">
            Rank state is configured inside the progression profile below.
          </div>
        ) : (
          <TextField
            label="Mechanics State ID"
            value={effect.targetId}
            onChange={(value) =>
              onPatchEffect?.(stepId, effect.id, { targetId: value })
            }
            placeholder="focus"
          />
        )}
        <SelectField
          label="Apply Mechanics State To"
          value={effect.targetBinding?.mode || "FIXED"}
          options={[
            { id: "FIXED", label: "Command / Module Scope" },
            { id: "ARGUMENT", label: "Resolved Command Argument" },
          ]}
          onChange={(value) =>
            onPatchEffect?.(stepId, effect.id, {
              targetBinding: {
                ...effect.targetBinding,
                mode: value,
                argumentName:
                  value === "ARGUMENT"
                    ? effect.targetBinding?.argumentName || targetArgumentOptions[0]?.id || ""
                    : "",
              },
            })
          }
        />
        {effect.targetBinding?.mode === "ARGUMENT" ? (
          <SelectField
            label="Resolved Target Argument"
            value={effect.targetBinding.argumentName}
            options={[
              { id: "", label: "Select an argument" },
              ...targetArgumentOptions.map((argument) => ({
                id: argument.id,
                label: `${argument.label} · ${argument.type}`,
              })),
            ]}
            onChange={(value) =>
              onPatchEffect?.(stepId, effect.id, {
                targetBinding: {
                  ...effect.targetBinding,
                  mode: "ARGUMENT",
                  argumentName: value,
                },
              })
            }
          />
        ) : null}
        <EffectValueField
          effect={effect}
          numericArgumentOptions={numericArgumentOptions}
          ProgressionProfileFieldsComponent={ProgressionProfileFieldsComponent}
          onPatch={(patch) => onPatchEffect?.(stepId, effect.id, patch)}
        />
        <div className="md:col-span-2 xl:col-span-3">
          <TextField
            label="Effect Reason"
            value={effect.reason}
            onChange={(value) =>
              onPatchEffect?.(stepId, effect.id, { reason: value })
            }
            placeholder="Explain why this effect applies."
          />
        </div>
      </div>
    </div>
  );
}

function MechanicsStepCard({
  step,
  phaseOptions,
  outcomeOptions,
  failurePolicyOptions,
  conditionModeOptions,
  conditionBucketOptions,
  conditionScopeOptions,
  conditionOperatorOptions,
  effectTypeOptions,
  onPatchMechanicsStep,
  onRemoveMechanicsStep,
  onMoveMechanicsStep,
  onToggleMechanicsDependency,
  onToggleMechanicsOutcome,
  onAddCondition,
  onPatchCondition,
  onRemoveCondition,
  onAddEffect,
  onPatchEffect,
  onRemoveEffect,
  ProgressionProfileFieldsComponent,
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-black/25 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={EYEBROW_CLASS}>
            Mechanics Step {step.index + 1}
          </p>
          <h5 className="mt-1 text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">
            {step.label || step.id}
          </h5>
        </div>
        <StepActions
          canMoveUp={step.canMoveUp}
          canMoveDown={step.canMoveDown}
          onMoveUp={() => onMoveMechanicsStep?.(step.id, "UP")}
          onMoveDown={() => onMoveMechanicsStep?.(step.id, "DOWN")}
          onRemove={() => onRemoveMechanicsStep?.(step.id)}
        />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <TextField
          label="Step ID"
          value={step.id}
          onChange={(value) => onPatchMechanicsStep?.(step.id, { id: value })}
          placeholder="spend_focus"
        />
        <TextField
          label="Label"
          value={step.label}
          onChange={(value) => onPatchMechanicsStep?.(step.id, { label: value })}
          placeholder="Spend Focus"
        />
        <SelectField
          label="Phase"
          value={step.phase}
          options={phaseOptions}
          onChange={(value) => onPatchMechanicsStep?.(step.id, { phase: value })}
        />
        <SelectField
          label="Failure Policy"
          value={step.failurePolicy}
          options={failurePolicyOptions}
          onChange={(value) =>
            onPatchMechanicsStep?.(step.id, { failurePolicy: value })
          }
        />
        <SelectField
          label="Condition Mode"
          value={step.conditionMode}
          options={conditionModeOptions}
          onChange={(value) =>
            onPatchMechanicsStep?.(step.id, { conditionMode: value })
          }
        />
        <CheckboxField
          label="Step enabled"
          checked={step.enabled !== false}
          onChange={(checked) =>
            onPatchMechanicsStep?.(step.id, { enabled: checked })
          }
        />
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
        <p className={EYEBROW_CLASS}>
          Dependencies
        </p>
        <div className="mt-3">
          <DependencyChecks
            options={step.dependencyOptions}
            selected={step.dependsOnStepIds}
            onToggle={(dependencyId, checked) =>
              onToggleMechanicsDependency?.(step.id, dependencyId, checked)
            }
          />
        </div>
      </div>

      {step.phase === "OUTCOME" ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
          <p className={EYEBROW_CLASS}>
            Apply On Outcomes
          </p>
          <div className="mt-3">
            <OutcomeChecks
              options={outcomeOptions}
              selected={step.applyOnOutcomes}
              onToggle={(outcome, checked) =>
                onToggleMechanicsOutcome?.(step.id, outcome, checked)
              }
            />
          </div>
        </div>
      ) : null}

      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className={EYEBROW_CLASS}>
              Step Conditions
            </p>
            <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
              Conditions inspect authoritative Mechanics state when this step is reached. Later steps see earlier pending mutations.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onAddCondition?.(step.id)}
            className="cf-btn cf-btn--primary cf-btn--sm"
          >
            <Plus size={14} />
            Add condition
          </button>
        </div>
        {step.conditions.length ? (
          <div className="mt-4 grid gap-3">
            {step.conditions.map((condition) => (
              <ConditionCard
                key={condition.id}
                stepId={step.id}
                condition={condition}
                conditionBucketOptions={conditionBucketOptions}
                conditionScopeOptions={conditionScopeOptions}
                conditionOperatorOptions={conditionOperatorOptions}
                targetArgumentOptions={step.targetArgumentOptions}
                onPatchCondition={onPatchCondition}
                onRemoveCondition={onRemoveCondition}
              />
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs text-[var(--ink-dim)]">
            No conditions. This step is eligible whenever its phase, outcome routing, dependencies, and enabled state allow it.
          </p>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className={EYEBROW_CLASS}>
              Ordered Effects
            </p>
            <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
              Effects execute in authored order against the pending Mechanics state produced by prior effects and steps.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onAddEffect?.(step.id)}
            className="cf-btn cf-btn--primary cf-btn--sm"
          >
            <Plus size={14} />
            Add effect
          </button>
        </div>
        {step.effects.length ? (
          <div className="mt-4 grid gap-3">
            {step.effects.map((effect) => (
              <EffectCard
                key={effect.id}
                stepId={step.id}
                effect={effect}
                effectTypeOptions={effectTypeOptions}
                targetArgumentOptions={step.targetArgumentOptions}
                numericArgumentOptions={step.numericArgumentOptions}
                onPatchEffect={onPatchEffect}
                onRemoveEffect={onRemoveEffect}
                ProgressionProfileFieldsComponent={ProgressionProfileFieldsComponent}
              />
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs text-[var(--ink-dim)]">
            No effects. An eligible empty step remains auditable but is treated as a failed application for continuation-policy purposes.
          </p>
        )}
      </div>
    </article>
  );
}

function ArgumentSelect({ label, value, options, onChange, optional = false }) {
  return (
    <SelectField
      label={label}
      value={value}
      options={[
        {
          id: "",
          label: optional ? "Optional / default" : "Select an argument",
        },
        ...options.map((argument) => ({
          id: argument.id,
          label: `${argument.label} · ${argument.type}`,
        })),
      ]}
      onChange={onChange}
    />
  );
}

function DomainActionFields({ step, travelOperationOptions, onPatchDomainStep }) {
  const action = step.action;
  const groups = step.argumentGroups;
  const usesVisibleItem = ["ITEM_TAKE", "ITEM_DAMAGE", "ITEM_REPAIR"].includes(
    action.type
  );
  const itemOptions = usesVisibleItem ? groups.ITEM_VISIBLE : groups.ITEM_HELD;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <SelectField
        label="Domain Action"
        value={action.type}
        options={step.actionTypeOptions}
        onChange={(value) =>
          onPatchDomainStep?.(step.id, { actionType: value })
        }
      />

      {action.type.startsWith("ITEM_") ? (
        <ArgumentSelect
          label={usesVisibleItem ? "Visible Item Argument" : "Held Item Argument"}
          value={action.itemArgumentName}
          options={itemOptions}
          onChange={(value) =>
            onPatchDomainStep?.(step.id, {
              action: { itemArgumentName: value },
            })
          }
        />
      ) : null}

      {action.type === "ITEM_GIVE" ? (
        <ArgumentSelect
          label="Recipient Argument"
          value={action.targetArgumentName}
          options={groups.CHARACTER_PRESENT}
          onChange={(value) =>
            onPatchDomainStep?.(step.id, {
              action: { targetArgumentName: value },
            })
          }
        />
      ) : null}

      {["ITEM_STORE", "ITEM_PLACE"].includes(action.type) ? (
        <ArgumentSelect
          label="Placement Argument"
          value={action.placementArgumentName}
          options={groups.TEXT}
          onChange={(value) =>
            onPatchDomainStep?.(step.id, {
              action: { placementArgumentName: value },
            })
          }
        />
      ) : null}

      {action.type === "ITEM_CONSUME" ? (
        <ArgumentSelect
          label="Quantity Argument"
          value={action.quantityArgumentName}
          options={groups.NUMBER}
          optional
          onChange={(value) =>
            onPatchDomainStep?.(step.id, {
              action: { quantityArgumentName: value },
            })
          }
        />
      ) : null}

      {["ITEM_DAMAGE", "ITEM_REPAIR"].includes(action.type) ? (
        <ArgumentSelect
          label="Amount Argument"
          value={action.amountArgumentName}
          options={groups.NUMBER}
          onChange={(value) =>
            onPatchDomainStep?.(step.id, {
              action: { amountArgumentName: value },
            })
          }
        />
      ) : null}

      {action.type === "LOCATION_TRANSITION" ? (
        <ArgumentSelect
          label="Connected Destination Argument"
          value={action.destinationArgumentName}
          options={groups.LOCATION_CONNECTED}
          onChange={(value) =>
            onPatchDomainStep?.(step.id, {
              action: { destinationArgumentName: value },
            })
          }
        />
      ) : null}

      {action.type === "LOCATION_TRAVEL_OPERATION" ? (
        <SelectField
          label="Active Journey Operation"
          value={action.travelOperation || "CONTINUE"}
          options={travelOperationOptions}
          onChange={(value) =>
            onPatchDomainStep?.(step.id, {
              action: { travelOperation: value },
            })
          }
        />
      ) : null}

      {action.type.startsWith("PARTICIPANT_CONDITION_") ? (
        <>
          <ArgumentSelect
            label="Present Character Argument"
            value={action.targetArgumentName}
            options={groups.CHARACTER_PRESENT}
            onChange={(value) =>
              onPatchDomainStep?.(step.id, {
                action: { targetArgumentName: value },
              })
            }
          />
          <ArgumentSelect
            label="Condition Text Argument"
            value={action.conditionArgumentName}
            options={groups.TEXT}
            onChange={(value) =>
              onPatchDomainStep?.(step.id, {
                action: { conditionArgumentName: value },
              })
            }
          />
        </>
      ) : null}
    </div>
  );
}

function DomainStepCard({
  step,
  outcomeOptions,
  failurePolicyOptions,
  travelOperationOptions,
  onPatchDomainStep,
  onRemoveDomainStep,
  onMoveDomainStep,
  onToggleDomainDependency,
  onToggleDomainOutcome,
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-black/25 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={EYEBROW_CLASS}>
            Domain Step {step.index + 1}
          </p>
          <h5 className="mt-1 text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">
            {step.label || step.id}
          </h5>
          {step.lane ? (
            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
              {step.lane.replaceAll("_", " ")}
            </p>
          ) : null}
        </div>
        <StepActions
          canMoveUp={step.canMoveUp}
          canMoveDown={step.canMoveDown}
          onMoveUp={() => onMoveDomainStep?.(step.id, "UP")}
          onMoveDown={() => onMoveDomainStep?.(step.id, "DOWN")}
          onRemove={() => onRemoveDomainStep?.(step.id)}
        />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <TextField
          label="Step ID"
          value={step.id}
          onChange={(value) => onPatchDomainStep?.(step.id, { id: value })}
          placeholder="give_item"
        />
        <TextField
          label="Label"
          value={step.label}
          onChange={(value) => onPatchDomainStep?.(step.id, { label: value })}
          placeholder="Give Item"
        />
        <SelectField
          label="Failure Policy"
          value={step.failurePolicy}
          options={failurePolicyOptions}
          onChange={(value) =>
            onPatchDomainStep?.(step.id, { failurePolicy: value })
          }
        />
        <CheckboxField
          label="Step enabled"
          checked={step.enabled !== false}
          onChange={(checked) =>
            onPatchDomainStep?.(step.id, { enabled: checked })
          }
        />
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
        <p className={EYEBROW_CLASS}>
          Dependencies
        </p>
        <div className="mt-3">
          <DependencyChecks
            options={step.dependencyOptions}
            selected={step.dependsOnStepIds}
            onToggle={(dependencyId, checked) =>
              onToggleDomainDependency?.(step.id, dependencyId, checked)
            }
          />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
        <DomainActionFields
          step={step}
          travelOperationOptions={travelOperationOptions}
          onPatchDomainStep={onPatchDomainStep}
        />
      </div>

      {step.action.type !== "NONE" ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
          <p className={EYEBROW_CLASS}>
            Apply On Outcomes
          </p>
          <div className="mt-3">
            <OutcomeChecks
              options={outcomeOptions}
              selected={step.action.applyOnOutcomes}
              onToggle={(outcome, checked) =>
                onToggleDomainOutcome?.(step.id, outcome, checked)
              }
            />
          </div>
        </div>
      ) : null}
    </article>
  );
}

export default function MechanicsCompositionBuilderView({
  title = "Advanced Composition",
  description = "",
  summary = {},
  referenceId = "",
  referenceOptions = [],
  mechanicsSteps = [],
  domainSteps = [],
  phaseOptions = [],
  outcomeOptions = [],
  failurePolicyOptions = [],
  conditionModeOptions = [],
  conditionBucketOptions = [],
  conditionScopeOptions = [],
  conditionOperatorOptions = [],
  effectTypeOptions = [],
  travelOperationOptions = [],
  canAddMechanicsStep = true,
  canAddDomainStep = true,
  validationMessages = [],
  ProgressionProfileFieldsComponent = null,
  onChooseReference = null,
  onApplyReference = null,
  onAddMechanicsStep = null,
  onPatchMechanicsStep = null,
  onRemoveMechanicsStep = null,
  onMoveMechanicsStep = null,
  onToggleMechanicsDependency = null,
  onToggleMechanicsOutcome = null,
  onAddCondition = null,
  onPatchCondition = null,
  onRemoveCondition = null,
  onAddEffect = null,
  onPatchEffect = null,
  onRemoveEffect = null,
  onAddDomainStep = null,
  onPatchDomainStep = null,
  onRemoveDomainStep = null,
  onMoveDomainStep = null,
  onToggleDomainDependency = null,
  onToggleDomainOutcome = null,
}) {
  const selectedReference = referenceOptions.find(
    (reference) => reference.id === referenceId
  );

  return (
    <section className="rounded-2xl border border-[var(--gold-ornament)]/25 bg-black/20 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className={EYEBROW_CLASS}>
            <Workflow size={15} />
            Command Composition
          </p>
          <h4 className="mt-2 font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">
            {title}
          </h4>
          {description ? (
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
              {description}
            </p>
          ) : null}
        </div>

        <div className="grid min-w-[240px] md:grid-cols-2 gap-2 text-center text-[10px] uppercase tracking-[0.14em] text-[var(--ink-dim)]">
          <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">
            <span className="block text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">
              {summary.enabledMechanicsStepCount ?? 0}
            </span>
            Mechanics Steps
          </div>
          <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">
            <span className="block text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">
              {summary.enabledDomainStepCount ?? 0}
            </span>
            Domain Steps
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-[var(--gold-ornament)]/20 bg-[var(--gold-ornament)]/5 p-4">
        <p className={EYEBROW_CLASS}>
          Reference Composition
        </p>
        <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
          Applying a reference replaces only this command&apos;s composition block. Resolution, requirements, legacy effects, outcomes, arguments, and legacy Domain Adapter remain unchanged.
        </p>
        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="min-w-0 flex-1">
            <SharedSelectField
              label="Reference composition"
              value={referenceId}
              placeholder="Select a reference composition"
              onChange={(nextValue) => onChooseReference?.(nextValue)}
              options={referenceOptions.map((reference) => ({
                value: reference.id,
                label: `${reference.label} · ${reference.available ? reference.description : reference.unavailableReason}`,
                isDisabled: !reference.available,
              }))}
            />
          </div>
          <button
            type="button"
            disabled={!referenceId || selectedReference?.available === false}
            onClick={() => onApplyReference?.()}
            className="cf-btn cf-btn--primary"
          >
            Apply reference
          </button>
        </div>
      </div>

      {validationMessages.length ? (
        <div className="mt-5 rounded-xl border border-[var(--status-warning-border)] bg-[var(--status-warning-bed)] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--status-warning-text)]">
            Composition Review
          </p>
          <div className="mt-3 grid gap-2">
            {validationMessages.map((message, index) => (
              <p
                key={`${message.path}-${index}`}
                className={`rounded-lg border px-3 py-2 text-xs leading-5 ${
                  message.level === "error"
                    ? "border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] text-[var(--status-danger-text)]"
                    : "border-[var(--status-warning-border)] bg-black/20 text-[var(--status-warning-text)]"
                }`}
              >
                <span className="font-mono text-[10px] text-[var(--ink-dim)]">
                  {message.path}
                </span>
                <span className="ml-2">{message.message}</span>
              </p>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className={EYEBROW_CLASS}>
              <GitBranch size={14} />
              Ordered Mechanics Steps
            </p>
            <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
              Legacy attempt effects execute first. Authored ATTEMPT steps follow, then selected legacy outcome effects, then authored OUTCOME steps.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!canAddMechanicsStep}
              onClick={() => onAddMechanicsStep?.("ATTEMPT")}
              className="cf-btn cf-btn--secondary cf-btn--sm"
            >
              <Plus size={14} />
              Attempt step
            </button>
            <button
              type="button"
              disabled={!canAddMechanicsStep}
              onClick={() => onAddMechanicsStep?.("OUTCOME")}
              className="cf-btn cf-btn--primary cf-btn--sm"
            >
              <Plus size={14} />
              Outcome step
            </button>
          </div>
        </div>

        {mechanicsSteps.length ? (
          <div className="mt-5 grid gap-4">
            {mechanicsSteps.map((step) => (
              <MechanicsStepCard
                key={step.id}
                step={step}
                phaseOptions={phaseOptions}
                outcomeOptions={outcomeOptions}
                failurePolicyOptions={failurePolicyOptions}
                conditionModeOptions={conditionModeOptions}
                conditionBucketOptions={conditionBucketOptions}
                conditionScopeOptions={conditionScopeOptions}
                conditionOperatorOptions={conditionOperatorOptions}
                effectTypeOptions={effectTypeOptions}
                onPatchMechanicsStep={onPatchMechanicsStep}
                onRemoveMechanicsStep={onRemoveMechanicsStep}
                onMoveMechanicsStep={onMoveMechanicsStep}
                onToggleMechanicsDependency={onToggleMechanicsDependency}
                onToggleMechanicsOutcome={onToggleMechanicsOutcome}
                onAddCondition={onAddCondition}
                onPatchCondition={onPatchCondition}
                onRemoveCondition={onRemoveCondition}
                onAddEffect={onAddEffect}
                onPatchEffect={onPatchEffect}
                onRemoveEffect={onRemoveEffect}
                ProgressionProfileFieldsComponent={ProgressionProfileFieldsComponent}
              />
            ))}
          </div>
        ) : (
          <p className="mt-5 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-[var(--ink-dim)]">
            No authored Mechanics steps. Existing attempt effects and outcome branches continue to work unchanged.
          </p>
        )}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className={EYEBROW_CLASS}>
              Ordered Domain Steps
            </p>
            <p className="mt-2 max-w-3xl text-xs leading-5 text-[var(--ink-dim)]">
              Add at most three actions, with one action per Item, participant-condition, or Location runtime lane. A Location action must be last. These execute before the legacy Domain Adapter.
            </p>
          </div>
          <button
            type="button"
            disabled={!canAddDomainStep}
            onClick={() => onAddDomainStep?.()}
            className="cf-btn cf-btn--primary cf-btn--sm"
          >
            <Plus size={14} />
            Add domain step
          </button>
        </div>

        {domainSteps.length ? (
          <div className="mt-5 grid gap-4">
            {domainSteps.map((step) => (
              <DomainStepCard
                key={step.id}
                step={step}
                outcomeOptions={outcomeOptions}
                failurePolicyOptions={failurePolicyOptions}
                travelOperationOptions={travelOperationOptions}
                onPatchDomainStep={onPatchDomainStep}
                onRemoveDomainStep={onRemoveDomainStep}
                onMoveDomainStep={onMoveDomainStep}
                onToggleDomainDependency={onToggleDomainDependency}
                onToggleDomainOutcome={onToggleDomainOutcome}
              />
            ))}
          </div>
        ) : (
          <p className="mt-5 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-[var(--ink-dim)]">
            No authored domain steps. The command may still use its existing single Domain Adapter.
          </p>
        )}
      </div>

      <p className="mt-5 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs leading-5 text-[var(--ink-dim)]">
        Cross-lane composition is explicitly non-transactional. A STOP policy prevents later steps but does not roll back earlier successful mutations.
      </p>
    </section>
  );
}
