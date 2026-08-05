"use client";

import {
  Activity,
  AlertTriangle,
  ArrowDown,
  Braces,
  ArrowUp,
  Calculator,
  ChevronDown,
  ChevronRight,
  CircleGauge,
  Droplets,
  HeartPulse,
  Layers3,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";

import StatsPoolsJsonEditorModal from "../stats-pools-json-editor/StatsPoolsJsonEditorModal";

function humanize(value) {
  return String(value || "")
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function FieldLabel({ children, detail = "" }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-2">
      <label className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
        {children}
      </label>
      {detail ? (
        <span className="text-[11px] text-[var(--muted)]">{detail}</span>
      ) : null}
    </div>
  );
}

function TextInput({ value = "", onChange, placeholder = "", disabled = false, type = "text" }) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50 disabled:cursor-not-allowed disabled:opacity-55"
    />
  );
}

function TextArea({ value = "", onChange, placeholder = "", disabled = false, rows = 4 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50 disabled:cursor-not-allowed disabled:opacity-55"
    />
  );
}

function SelectInput({ value, onChange, children, disabled = false }) {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0907] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]/50 disabled:cursor-not-allowed disabled:opacity-55"
    >
      {children}
    </select>
  );
}

function CheckboxRow({ checked, onChange, label, description = "", disabled = false }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-black/25 px-4 py-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange?.(event.target.checked)}
        disabled={disabled}
        className="mt-1 h-4 w-4 accent-[var(--muted-gold)] disabled:cursor-not-allowed"
      />
      <span>
        <span className="block text-sm text-[var(--foreground)]">{label}</span>
        {description ? (
          <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}

function IssueList({ issues = [] }) {
  if (!issues.length) return null;

  return (
    <div className="space-y-2">
      {issues.map((issue, index) => {
        const warning = issue.severity === "WARNING";
        return (
          <div
            key={`${issue.code || "issue"}-${index}`}
            className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-xs leading-5 ${
              warning
                ? "border-amber-300/25 bg-amber-300/10 text-amber-100"
                : "border-red-300/25 bg-red-300/10 text-red-100"
            }`}
          >
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            <span>{issue.message}</span>
          </div>
        );
      })}
    </div>
  );
}

function MetricCard({ label, value, detail = "" }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-gold)]">
        {label}
      </p>
      <p className="mt-2 text-sm text-[var(--foreground)]">{value}</p>
      {detail ? (
        <p className="mt-1 text-[11px] leading-4 text-[var(--muted)]">{detail}</p>
      ) : null}
    </div>
  );
}

function OptionList({ options = [] }) {
  return options.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ));
}

function DefinitionHeader({
  title,
  id,
  enabled,
  expanded,
  first,
  last,
  issues = [],
  disabled,
  onToggleExpanded,
  onToggleEnabled,
  onMoveUp,
  onMoveDown,
  onRemove,
  icon: Icon = CircleGauge,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-4 sm:px-5">
      <button
        type="button"
        onClick={onToggleExpanded}
        className="rounded-lg border border-white/10 bg-black/25 p-2 text-[var(--muted-gold)] transition hover:border-[var(--muted-gold)]/35"
        aria-label={expanded ? "Collapse definition" : "Expand definition"}
      >
        {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      <Icon size={18} className="text-[var(--muted-gold)]" />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-medium text-[var(--foreground)]">
            {title || "Untitled definition"}
          </p>
          {!enabled ? (
            <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
              Disabled
            </span>
          ) : null}
          {issues.length ? (
            <span className="rounded-full border border-red-300/25 bg-red-300/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-red-100">
              {issues.length} issue{issues.length === 1 ? "" : "s"}
            </span>
          ) : null}
        </div>
        <p className="mt-1 truncate font-mono text-[11px] text-[var(--muted)]">
          {id}
        </p>
      </div>

      <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => onToggleEnabled?.(event.target.checked)}
          disabled={disabled}
          className="h-4 w-4 accent-[var(--muted-gold)]"
        />
        Enabled
      </label>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={disabled || first}
          className="rounded-lg border border-white/10 p-2 text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)] disabled:opacity-30"
          aria-label="Move up"
        >
          <ArrowUp size={15} />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={disabled || last}
          className="rounded-lg border border-white/10 p-2 text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)] disabled:opacity-30"
          aria-label="Move down"
        >
          <ArrowDown size={15} />
        </button>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="rounded-lg border border-white/10 p-2 text-[var(--status-danger)] transition hover:bg-white/5 disabled:opacity-30"
          aria-label="Remove definition"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

function FormulaEditor({
  kind,
  definitionId,
  formula,
  statOptions = [],
  poolOptions = [],
  operationOptions = [],
  roundingOptions = [],
  operandTypeOptions = [],
  referenceTypeOptions = [],
  referenceFieldOptions = [],
  disabled,
  onUpdateFormula,
  onUpdateOperand,
  onAddOperand,
  onRemoveOperand,
}) {
  const operands = Array.isArray(formula?.root?.operands)
    ? formula.root.operands
    : [];

  return (
    <div className="rounded-xl border border-[var(--muted-gold)]/20 bg-[var(--muted-gold)]/5 p-4">
      <div className="flex items-start gap-3">
        <Calculator size={17} className="mt-0.5 shrink-0 text-[var(--muted-gold)]" />
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            Declarative Formula
          </p>
          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
            Formulas reference definitions in this profile. They do not execute arbitrary code.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <FieldLabel>Operation</FieldLabel>
          <SelectInput
            value={formula?.root?.operation || "ADD"}
            onChange={(event) =>
              onUpdateFormula?.(kind, definitionId, "operation", event.target.value)
            }
            disabled={disabled}
          >
            <OptionList options={operationOptions} />
          </SelectInput>
        </div>
        <div>
          <FieldLabel>Rounding</FieldLabel>
          <SelectInput
            value={formula?.rounding || "NONE"}
            onChange={(event) =>
              onUpdateFormula?.(kind, definitionId, "rounding", event.target.value)
            }
            disabled={disabled}
          >
            <OptionList options={roundingOptions} />
          </SelectInput>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {operands.map((operand, index) => {
          const referenceOptions =
            operand.referenceType === "POOL" ? poolOptions : statOptions;
          return (
            <div
              key={`${definitionId}-operand-${index}`}
              className="rounded-xl border border-white/10 bg-black/25 p-3"
            >
              <div className="grid gap-3 md:grid-cols-[160px_minmax(0,1fr)_auto]">
                <div>
                  <FieldLabel>Operand {index + 1}</FieldLabel>
                  <SelectInput
                    value={operand.nodeType || "CONSTANT"}
                    onChange={(event) =>
                      onUpdateOperand?.(
                        kind,
                        definitionId,
                        index,
                        "nodeType",
                        event.target.value
                      )
                    }
                    disabled={disabled}
                  >
                    <OptionList options={operandTypeOptions} />
                  </SelectInput>
                </div>

                {operand.nodeType === "REFERENCE" ? (
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <FieldLabel>Source</FieldLabel>
                      <SelectInput
                        value={operand.referenceType || "STAT"}
                        onChange={(event) =>
                          onUpdateOperand?.(
                            kind,
                            definitionId,
                            index,
                            "referenceType",
                            event.target.value
                          )
                        }
                        disabled={disabled}
                      >
                        <OptionList options={referenceTypeOptions} />
                      </SelectInput>
                    </div>
                    <div>
                      <FieldLabel>Definition</FieldLabel>
                      <SelectInput
                        value={operand.referenceId || ""}
                        onChange={(event) =>
                          onUpdateOperand?.(
                            kind,
                            definitionId,
                            index,
                            "referenceId",
                            event.target.value
                          )
                        }
                        disabled={disabled}
                      >
                        <option value="">Select definition...</option>
                        <OptionList options={referenceOptions} />
                      </SelectInput>
                    </div>
                    <div>
                      <FieldLabel>Field</FieldLabel>
                      <SelectInput
                        value={operand.field || "CURRENT"}
                        onChange={(event) =>
                          onUpdateOperand?.(
                            kind,
                            definitionId,
                            index,
                            "field",
                            event.target.value
                          )
                        }
                        disabled={disabled}
                      >
                        <OptionList options={referenceFieldOptions} />
                      </SelectInput>
                    </div>
                  </div>
                ) : (
                  <div>
                    <FieldLabel>Constant Value</FieldLabel>
                    <TextInput
                      type="number"
                      value={operand.value ?? 0}
                      onChange={(event) =>
                        onUpdateOperand?.(
                          kind,
                          definitionId,
                          index,
                          "value",
                          event.target.value
                        )
                      }
                      disabled={disabled}
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onRemoveOperand?.(kind, definitionId, index)}
                  disabled={disabled || operands.length <= 2}
                  className="mt-7 self-start rounded-lg border border-white/10 p-2 text-[var(--status-danger)] transition hover:bg-white/5 disabled:opacity-30"
                  aria-label="Remove formula operand"
                >
                  <Minus size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onAddOperand?.(kind, definitionId)}
        disabled={disabled}
        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-xs text-[var(--foreground)] transition hover:border-[var(--muted-gold)]/35 disabled:opacity-50"
      >
        <Plus size={14} />
        Add Operand
      </button>

      <div className="mt-4">
        <FieldLabel>Formula Notes</FieldLabel>
        <TextArea
          value={formula?.notes || ""}
          onChange={(event) =>
            onUpdateFormula?.(kind, definitionId, "notes", event.target.value)
          }
          placeholder="Explain the intent of this derived value..."
          rows={2}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

function SharedDefinitionFields({
  definition,
  kind,
  disabled,
  onUpdateDefinition,
  showCategory = true,
  showTags = true,
}) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <FieldLabel>Stable Identifier</FieldLabel>
          <TextInput
            value={definition.id}
            onChange={(event) =>
              onUpdateDefinition?.(kind, definition.id, "id", event.target.value)
            }
            placeholder={`${kind}.identifier`}
            disabled={disabled}
          />
        </div>
        <div>
          <FieldLabel>Display Title</FieldLabel>
          <TextInput
            value={definition.title}
            onChange={(event) =>
              onUpdateDefinition?.(kind, definition.id, "title", event.target.value)
            }
            placeholder={`Name this ${kind}...`}
            disabled={disabled}
          />
        </div>
      </div>
      <div className="mt-4">
        <FieldLabel>Description</FieldLabel>
        <TextArea
          value={definition.description}
          onChange={(event) =>
            onUpdateDefinition?.(
              kind,
              definition.id,
              "description",
              event.target.value
            )
          }
          placeholder="Explain what this definition represents..."
          rows={3}
          disabled={disabled}
        />
      </div>
      {showCategory || showTags ? (
        <div className={`mt-4 grid gap-4 ${showCategory && showTags ? "md:grid-cols-2" : ""}`}>
          {showCategory ? (
            <div>
              <FieldLabel>Category</FieldLabel>
              <TextInput
                value={definition.category || ""}
                onChange={(event) =>
                  onUpdateDefinition?.(
                    kind,
                    definition.id,
                    "category",
                    event.target.value.toUpperCase()
                  )
                }
                placeholder={kind === "stat" ? "CORE" : "RESOURCE"}
                disabled={disabled}
              />
            </div>
          ) : null}
          {showTags ? (
            <div>
              <FieldLabel>Tags</FieldLabel>
              <TextInput
                value={definition.tagsInput || ""}
                onChange={(event) =>
                  onUpdateDefinition?.(kind, definition.id, "tags", event.target.value)
                }
                placeholder="combat, physical, core"
                disabled={disabled}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

function StatDefinitionCard({
  definition,
  index,
  total,
  disabled,
  valueTypeOptions,
  scaleModeOptions,
  statOptions,
  poolOptions,
  formulaProps,
  onToggleExpanded,
  onUpdateDefinition,
  onMoveDefinition,
  onRemoveDefinition,
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-white/10 bg-black/25">
      <DefinitionHeader
        title={definition.title}
        id={definition.id}
        enabled={definition.enabled}
        expanded={definition.expanded}
        first={index === 0}
        last={index === total - 1}
        issues={definition.issues}
        disabled={disabled}
        icon={Activity}
        onToggleExpanded={() => onToggleExpanded?.("stats", definition.id)}
        onToggleEnabled={(value) =>
          onUpdateDefinition?.("stat", definition.id, "enabled", value)
        }
        onMoveUp={() => onMoveDefinition?.("stat", definition.id, -1)}
        onMoveDown={() => onMoveDefinition?.("stat", definition.id, 1)}
        onRemove={() => onRemoveDefinition?.("stat", definition.id)}
      />

      {definition.expanded ? (
        <div className="border-t border-white/10 px-4 py-5 sm:px-5">
          <IssueList issues={definition.issues} />
          <div className={definition.issues.length ? "mt-5" : ""}>
            <SharedDefinitionFields
              definition={definition}
              kind="stat"
              disabled={disabled}
              onUpdateDefinition={onUpdateDefinition}
            />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div>
              <FieldLabel>Value Type</FieldLabel>
              <SelectInput
                value={definition.valueType}
                onChange={(event) =>
                  onUpdateDefinition?.(
                    "stat",
                    definition.id,
                    "valueType",
                    event.target.value
                  )
                }
                disabled={disabled}
              >
                <OptionList options={valueTypeOptions} />
              </SelectInput>
            </div>
            <div>
              <FieldLabel>Scale Mode</FieldLabel>
              <SelectInput
                value={definition.scale.mode}
                onChange={(event) =>
                  onUpdateDefinition?.(
                    "stat",
                    definition.id,
                    "scale.mode",
                    event.target.value
                  )
                }
                disabled={disabled}
              >
                <OptionList options={scaleModeOptions} />
              </SelectInput>
            </div>
            <div>
              <FieldLabel>Default Value</FieldLabel>
              <TextInput
                type="number"
                value={definition.scale.defaultValue ?? ""}
                onChange={(event) =>
                  onUpdateDefinition?.(
                    "stat",
                    definition.id,
                    "scale.defaultValue",
                    event.target.value
                  )
                }
                disabled={disabled || definition.scale.mode === "BEYOND_SCALE"}
              />
            </div>
          </div>

          {definition.scale.mode === "BOUNDED" ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <FieldLabel>Minimum</FieldLabel>
                <TextInput
                  type="number"
                  value={definition.scale.minimum ?? ""}
                  onChange={(event) =>
                    onUpdateDefinition?.(
                      "stat",
                      definition.id,
                      "scale.minimum",
                      event.target.value
                    )
                  }
                  disabled={disabled}
                />
              </div>
              <div>
                <FieldLabel>Maximum</FieldLabel>
                <TextInput
                  type="number"
                  value={definition.scale.maximum ?? ""}
                  onChange={(event) =>
                    onUpdateDefinition?.(
                      "stat",
                      definition.id,
                      "scale.maximum",
                      event.target.value
                    )
                  }
                  disabled={disabled}
                />
              </div>
            </div>
          ) : null}

          <div className="mt-5">
            <CheckboxRow
              checked={definition.derived.enabled}
              onChange={(value) =>
                onUpdateDefinition?.(
                  "stat",
                  definition.id,
                  "derivedEnabled",
                  value
                )
              }
              label="Derived Stat"
              description="Calculate this Stat from other definitions instead of storing mutable actor values."
              disabled={disabled}
            />
          </div>

          {definition.derived.enabled ? (
            <div className="mt-4">
              <FormulaEditor
                kind="stat"
                definitionId={definition.id}
                formula={definition.derived.formula}
                statOptions={statOptions}
                poolOptions={poolOptions}
                disabled={disabled}
                {...formulaProps}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function PoolDefinitionCard({
  definition,
  index,
  total,
  disabled,
  valueTypeOptions,
  maximumModeOptions,
  defaultCurrentOptions,
  statOptions,
  poolOptions,
  formulaProps,
  onToggleExpanded,
  onUpdateDefinition,
  onMoveDefinition,
  onRemoveDefinition,
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-white/10 bg-black/25">
      <DefinitionHeader
        title={definition.title}
        id={definition.id}
        enabled={definition.enabled}
        expanded={definition.expanded}
        first={index === 0}
        last={index === total - 1}
        issues={definition.issues}
        disabled={disabled}
        icon={Droplets}
        onToggleExpanded={() => onToggleExpanded?.("pools", definition.id)}
        onToggleEnabled={(value) =>
          onUpdateDefinition?.("pool", definition.id, "enabled", value)
        }
        onMoveUp={() => onMoveDefinition?.("pool", definition.id, -1)}
        onMoveDown={() => onMoveDefinition?.("pool", definition.id, 1)}
        onRemove={() => onRemoveDefinition?.("pool", definition.id)}
      />

      {definition.expanded ? (
        <div className="border-t border-white/10 px-4 py-5 sm:px-5">
          <IssueList issues={definition.issues} />
          <div className={definition.issues.length ? "mt-5" : ""}>
            <SharedDefinitionFields
              definition={definition}
              kind="pool"
              disabled={disabled}
              onUpdateDefinition={onUpdateDefinition}
            />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div>
              <FieldLabel>Value Type</FieldLabel>
              <SelectInput
                value={definition.valueType}
                onChange={(event) =>
                  onUpdateDefinition?.(
                    "pool",
                    definition.id,
                    "valueType",
                    event.target.value
                  )
                }
                disabled={disabled}
              >
                <OptionList options={valueTypeOptions} />
              </SelectInput>
            </div>
            <div>
              <FieldLabel>Minimum</FieldLabel>
              <TextInput
                type="number"
                value={definition.minimum ?? ""}
                onChange={(event) =>
                  onUpdateDefinition?.(
                    "pool",
                    definition.id,
                    "minimum",
                    event.target.value
                  )
                }
                disabled={disabled}
              />
            </div>
            <div>
              <FieldLabel>Maximum Mode</FieldLabel>
              <SelectInput
                value={definition.maximum.mode}
                onChange={(event) =>
                  onUpdateDefinition?.(
                    "pool",
                    definition.id,
                    "maximum.mode",
                    event.target.value
                  )
                }
                disabled={disabled}
              >
                <OptionList options={maximumModeOptions} />
              </SelectInput>
            </div>
          </div>

          {definition.maximum.mode === "FIXED" ? (
            <div className="mt-4">
              <FieldLabel>Fixed Maximum</FieldLabel>
              <TextInput
                type="number"
                value={definition.maximum.value ?? ""}
                onChange={(event) =>
                  onUpdateDefinition?.(
                    "pool",
                    definition.id,
                    "maximum.value",
                    event.target.value
                  )
                }
                disabled={disabled}
              />
            </div>
          ) : (
            <div className="mt-4">
              <FormulaEditor
                kind="pool"
                definitionId={definition.id}
                formula={definition.maximum.formula}
                statOptions={statOptions}
                poolOptions={poolOptions}
                disabled={disabled}
                {...formulaProps}
              />
            </div>
          )}

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <FieldLabel>Starting Value</FieldLabel>
              <SelectInput
                value={definition.defaultCurrent.mode}
                onChange={(event) =>
                  onUpdateDefinition?.(
                    "pool",
                    definition.id,
                    "defaultCurrent.mode",
                    event.target.value
                  )
                }
                disabled={disabled}
              >
                <OptionList options={defaultCurrentOptions} />
              </SelectInput>
            </div>
            {definition.defaultCurrent.mode === "FIXED" ? (
              <div>
                <FieldLabel>Fixed Starting Value</FieldLabel>
                <TextInput
                  type="number"
                  value={definition.defaultCurrent.value ?? ""}
                  onChange={(event) =>
                    onUpdateDefinition?.(
                      "pool",
                      definition.id,
                      "defaultCurrent.value",
                      event.target.value
                    )
                  }
                  disabled={disabled}
                />
              </div>
            ) : null}
          </div>

          <div className="mt-4">
            <CheckboxRow
              checked={definition.allowOverfill}
              onChange={(value) =>
                onUpdateDefinition?.(
                  "pool",
                  definition.id,
                  "allowOverfill",
                  value
                )
              }
              label="Allow Overfill"
              description="Permit current value to temporarily exceed the resolved maximum."
              disabled={disabled}
            />
          </div>
        </div>
      ) : null}
    </article>
  );
}

function ModifierCard({
  definition,
  index,
  total,
  disabled,
  statOptions,
  poolOptions,
  targetTypeOptions,
  operationOptions,
  stackPolicyOptions,
  durationPolicyOptions,
  onToggleExpanded,
  onUpdateDefinition,
  onMoveDefinition,
  onRemoveDefinition,
}) {
  const targetOptions = definition.target.targetType.startsWith("POOL_")
    ? poolOptions
    : statOptions;

  return (
    <article className="overflow-hidden rounded-xl border border-white/10 bg-black/25">
      <DefinitionHeader
        title={definition.title}
        id={definition.id}
        enabled={definition.enabled}
        expanded={definition.expanded}
        first={index === 0}
        last={index === total - 1}
        issues={definition.issues}
        disabled={disabled}
        icon={Sparkles}
        onToggleExpanded={() => onToggleExpanded?.("modifiers", definition.id)}
        onToggleEnabled={(value) =>
          onUpdateDefinition?.("modifier", definition.id, "enabled", value)
        }
        onMoveUp={() => onMoveDefinition?.("modifier", definition.id, -1)}
        onMoveDown={() => onMoveDefinition?.("modifier", definition.id, 1)}
        onRemove={() => onRemoveDefinition?.("modifier", definition.id)}
      />

      {definition.expanded ? (
        <div className="border-t border-white/10 px-4 py-5 sm:px-5">
          <IssueList issues={definition.issues} />
          <div className={definition.issues.length ? "mt-5" : ""}>
            <SharedDefinitionFields
              definition={definition}
              kind="modifier"
              disabled={disabled}
              onUpdateDefinition={onUpdateDefinition}
              showCategory={false}
              showTags={false}
            />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <FieldLabel>Target Type</FieldLabel>
              <SelectInput
                value={definition.target.targetType}
                onChange={(event) =>
                  onUpdateDefinition?.(
                    "modifier",
                    definition.id,
                    "target.targetType",
                    event.target.value
                  )
                }
                disabled={disabled}
              >
                <OptionList options={targetTypeOptions} />
              </SelectInput>
            </div>
            <div>
              <FieldLabel>Target Definition</FieldLabel>
              <SelectInput
                value={definition.target.definitionId}
                onChange={(event) =>
                  onUpdateDefinition?.(
                    "modifier",
                    definition.id,
                    "target.definitionId",
                    event.target.value
                  )
                }
                disabled={disabled}
              >
                <option value="">Select target...</option>
                <OptionList options={targetOptions} />
              </SelectInput>
            </div>
            <div>
              <FieldLabel>Operation</FieldLabel>
              <SelectInput
                value={definition.operation}
                onChange={(event) =>
                  onUpdateDefinition?.(
                    "modifier",
                    definition.id,
                    "operation",
                    event.target.value
                  )
                }
                disabled={disabled}
              >
                <OptionList options={operationOptions} />
              </SelectInput>
            </div>
            <div>
              <FieldLabel>Value</FieldLabel>
              <TextInput
                type="number"
                value={definition.value}
                onChange={(event) =>
                  onUpdateDefinition?.(
                    "modifier",
                    definition.id,
                    "value",
                    event.target.value
                  )
                }
                disabled={disabled}
              />
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <FieldLabel>Stack Policy</FieldLabel>
              <SelectInput
                value={definition.stackPolicy}
                onChange={(event) =>
                  onUpdateDefinition?.(
                    "modifier",
                    definition.id,
                    "stackPolicy",
                    event.target.value
                  )
                }
                disabled={disabled}
              >
                <OptionList options={stackPolicyOptions} />
              </SelectInput>
            </div>
            <div>
              <FieldLabel>Duration</FieldLabel>
              <SelectInput
                value={definition.durationPolicy}
                onChange={(event) =>
                  onUpdateDefinition?.(
                    "modifier",
                    definition.id,
                    "durationPolicy",
                    event.target.value
                  )
                }
                disabled={disabled}
              >
                <OptionList options={durationPolicyOptions} />
              </SelectInput>
            </div>
            {definition.durationPolicy === "TURN_COUNT" ? (
              <div>
                <FieldLabel>Default Turns</FieldLabel>
                <TextInput
                  type="number"
                  value={definition.defaultDurationTurns}
                  onChange={(event) =>
                    onUpdateDefinition?.(
                      "modifier",
                      definition.id,
                      "defaultDurationTurns",
                      event.target.value
                    )
                  }
                  disabled={disabled}
                />
              </div>
            ) : null}
            <div>
              <FieldLabel>Priority</FieldLabel>
              <TextInput
                type="number"
                value={definition.priority}
                onChange={(event) =>
                  onUpdateDefinition?.(
                    "modifier",
                    definition.id,
                    "priority",
                    event.target.value
                  )
                }
                disabled={disabled}
              />
            </div>
          </div>

          <div className="mt-4">
            <FieldLabel>Modifier Notes</FieldLabel>
            <TextArea
              value={definition.notes}
              onChange={(event) =>
                onUpdateDefinition?.(
                  "modifier",
                  definition.id,
                  "notes",
                  event.target.value
                )
              }
              placeholder="Clarify special stacking or source behavior..."
              rows={2}
              disabled={disabled}
            />
          </div>
        </div>
      ) : null}
    </article>
  );
}

function ConditionCard({
  definition,
  index,
  total,
  disabled,
  modifierOptions,
  stackPolicyOptions,
  onToggleExpanded,
  onUpdateDefinition,
  onMoveDefinition,
  onRemoveDefinition,
}) {
  const selected = new Set(definition.modifierDefinitionIds || []);

  return (
    <article className="overflow-hidden rounded-xl border border-white/10 bg-black/25">
      <DefinitionHeader
        title={definition.title}
        id={definition.id}
        enabled={definition.enabled}
        expanded={definition.expanded}
        first={index === 0}
        last={index === total - 1}
        issues={definition.issues}
        disabled={disabled}
        icon={HeartPulse}
        onToggleExpanded={() => onToggleExpanded?.("conditions", definition.id)}
        onToggleEnabled={(value) =>
          onUpdateDefinition?.("condition", definition.id, "enabled", value)
        }
        onMoveUp={() => onMoveDefinition?.("condition", definition.id, -1)}
        onMoveDown={() => onMoveDefinition?.("condition", definition.id, 1)}
        onRemove={() => onRemoveDefinition?.("condition", definition.id)}
      />

      {definition.expanded ? (
        <div className="border-t border-white/10 px-4 py-5 sm:px-5">
          <IssueList issues={definition.issues} />
          <div className={definition.issues.length ? "mt-5" : ""}>
            <SharedDefinitionFields
              definition={definition}
              kind="condition"
              disabled={disabled}
              onUpdateDefinition={onUpdateDefinition}
              showCategory={false}
              showTags
            />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <FieldLabel>Stack Policy</FieldLabel>
              <SelectInput
                value={definition.stackPolicy}
                onChange={(event) =>
                  onUpdateDefinition?.(
                    "condition",
                    definition.id,
                    "stackPolicy",
                    event.target.value
                  )
                }
                disabled={disabled}
              >
                <OptionList options={stackPolicyOptions} />
              </SelectInput>
            </div>
            <div>
              <FieldLabel>Maximum Stacks</FieldLabel>
              <TextInput
                type="number"
                value={definition.maximumStacks}
                onChange={(event) =>
                  onUpdateDefinition?.(
                    "condition",
                    definition.id,
                    "maximumStacks",
                    event.target.value
                  )
                }
                disabled={disabled}
              />
            </div>
          </div>

          <div className="mt-5">
            <FieldLabel>Applied Modifiers</FieldLabel>
            {modifierOptions.length ? (
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {modifierOptions.map((option) => (
                  <CheckboxRow
                    key={option.value}
                    checked={selected.has(option.value)}
                    onChange={(checked) => {
                      const next = checked
                        ? [...selected, option.value]
                        : [...selected].filter((value) => value !== option.value);
                      onUpdateDefinition?.(
                        "condition",
                        definition.id,
                        "modifierDefinitionIds",
                        next
                      );
                    }}
                    label={option.label}
                    description={option.value}
                    disabled={disabled}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-2 rounded-xl border border-dashed border-white/10 px-4 py-4 text-xs text-[var(--muted)]">
                Add a Modifier definition before linking it to this Condition.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </article>
  );
}

const PANEL_OPTIONS = [
  { value: "STATS", label: "Stats", icon: Activity },
  { value: "POOLS", label: "Pools", icon: Droplets },
  { value: "MODIFIERS", label: "Modifiers", icon: Sparkles },
  { value: "CONDITIONS", label: "Conditions", icon: HeartPulse },
];

export default function StatsPoolsEditorView({
  disabled = false,
  profile = {},
  enabled = true,
  title = "",
  description = "",
  profileMode = "SPARSE",
  capabilityPolicy = {},
  activePanel = "STATS",
  panelCounts = {},
  stats = [],
  pools = [],
  modifiers = [],
  conditions = [],
  statOptions = [],
  poolOptions = [],
  modifierOptions = [],
  profileModeOptions = [],
  capabilityModeOptions = [],
  numericResolutionOptions = [],
  valueTypeOptions = [],
  scaleModeOptions = [],
  poolMaximumModeOptions = [],
  poolDefaultCurrentOptions = [],
  formulaOperationOptions = [],
  formulaRoundingOptions = [],
  formulaOperandTypeOptions = [],
  formulaReferenceTypeOptions = [],
  formulaReferenceFieldOptions = [],
  modifierTargetTypeOptions = [],
  modifierOperationOptions = [],
  stackPolicyOptions = [],
  durationPolicyOptions = [],
  conditionStackPolicyOptions = [],
  limits = {},
  globalIssues = [],
  errorCount = 0,
  warningCount = 0,
  valid = false,
  jsonEditorOpen = false,
  onOpenJsonEditor = null,
  onCloseJsonEditor = null,
  onApplyJsonProfile = null,
  metrics = {},
  titleCharacterCount = 0,
  titleCharacterLimit = 0,
  descriptionCharacterCount = 0,
  descriptionCharacterLimit = 0,
  capabilityNotesCharacterCount = 0,
  capabilityNotesCharacterLimit = 0,
  onSetActivePanel,
  onSetEnabled,
  onUpdateProfile,
  onUpdateCapability,
  onToggleExpanded,
  onAddDefinition,
  onRemoveDefinition,
  onMoveDefinition,
  onUpdateDefinition,
  onUpdateFormula,
  onUpdateFormulaOperand,
  onAddFormulaOperand,
  onRemoveFormulaOperand,
}) {
  const formulaProps = {
    operationOptions: formulaOperationOptions,
    roundingOptions: formulaRoundingOptions,
    operandTypeOptions: formulaOperandTypeOptions,
    referenceTypeOptions: formulaReferenceTypeOptions,
    referenceFieldOptions: formulaReferenceFieldOptions,
    onUpdateFormula,
    onUpdateOperand: onUpdateFormulaOperand,
    onAddOperand: onAddFormulaOperand,
    onRemoveOperand: onRemoveFormulaOperand,
  };

  return (
    <section className="rounded-[var(--radius-md)] border border-[var(--muted-gold)]/25 bg-black/30 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-[var(--muted-gold)]">
            <CircleGauge size={18} />
            <p className="text-xs uppercase tracking-[0.22em]">
              Stats & Pools · Reusable Definitions
            </p>
          </div>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Stats and Pools Profile
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Define reusable attributes, HP, Stamina, Mana, custom resources,
            derived values, modifiers, and Conditions. Mutable values remain
            isolated to each actor through their Actor Mechanics Profile binding.
          </p>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => onOpenJsonEditor?.()}
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)] disabled:opacity-50"
          >
            <Braces size={15} />
            JSON Editor
          </button>

          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => onSetEnabled?.(!enabled)}
            disabled={disabled}
            className={`rounded-xl border px-4 py-3 text-xs uppercase tracking-[0.16em] transition disabled:opacity-50 ${
              enabled
                ? "border-[var(--muted-gold)]/50 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                : "border-white/10 bg-black/25 text-[var(--muted)]"
            }`}
          >
            {enabled ? "Profile Enabled" : "Enable Profile"}
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Profile Mode"
          value={humanize(profileMode)}
          detail={profileMode === "FULL" ? "Complete actor state required" : "Partial actor state allowed"}
        />
        <MetricCard
          label="Definitions"
          value={`${metrics.statCount || 0} Stats · ${metrics.poolCount || 0} Pools`}
          detail={`${metrics.derivedStatCount || 0} derived Stats · ${metrics.derivedPoolCount || 0} derived Pools`}
        />
        <MetricCard
          label="Effects"
          value={`${metrics.modifierCount || 0} Modifiers`}
          detail={`${metrics.conditionCount || 0} Conditions`}
        />
        <MetricCard
          label="Validation"
          value={valid ? "Ready" : `${errorCount} error${errorCount === 1 ? "" : "s"}`}
          detail={warningCount ? `${warningCount} warning${warningCount === 1 ? "" : "s"}` : "No warnings"}
        />
      </div>

      <div className="mt-5 rounded-xl border border-emerald-300/20 bg-emerald-300/5 px-4 py-3 text-sm text-emerald-100">
        <div className="flex items-start gap-3">
          <ShieldCheck size={17} className="mt-0.5 shrink-0" />
          <p className="leading-6">
            This editor defines reusable mechanics only. It does not create or mutate
            an actor’s live HP, Stats, Pools, modifiers, or Conditions.
          </p>
        </div>
      </div>

      {globalIssues.length ? (
        <div className="mt-4">
          <IssueList issues={globalIssues} />
        </div>
      ) : null}

      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        <div>
          <FieldLabel
            detail={`${titleCharacterCount.toLocaleString()} / ${titleCharacterLimit.toLocaleString()}`}
          >
            Profile Title
          </FieldLabel>
          <TextInput
            value={title}
            onChange={(event) => onUpdateProfile?.("title", event.target.value)}
            placeholder="Name this Stats and Pools profile..."
            disabled={disabled}
          />
        </div>
        <div>
          <FieldLabel>Profile Mode</FieldLabel>
          <SelectInput
            value={profileMode}
            onChange={(event) => onUpdateProfile?.("profileMode", event.target.value)}
            disabled={disabled}
          >
            <OptionList options={profileModeOptions} />
          </SelectInput>
        </div>
      </div>

      <div className="mt-5">
        <FieldLabel
          detail={`${descriptionCharacterCount.toLocaleString()} / ${descriptionCharacterLimit.toLocaleString()}`}
        >
          Description
        </FieldLabel>
        <TextArea
          value={description}
          onChange={(event) => onUpdateProfile?.("description", event.target.value)}
          placeholder="Explain the intended actors, scale, and gameplay role..."
          rows={4}
          disabled={disabled}
        />
      </div>

      <div className="mt-7 rounded-xl border border-white/10 bg-black/25 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Layers3 size={17} className="mt-0.5 shrink-0 text-[var(--muted-gold)]" />
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
              Capability Policy
            </p>
            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
              Beyond Scale profiles require a restricted working mode or narrative-only resolution.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div>
            <FieldLabel>Capability Mode</FieldLabel>
            <SelectInput
              value={capabilityPolicy.mode || "STANDARD"}
              onChange={(event) => onUpdateCapability?.("mode", event.target.value)}
              disabled={disabled}
            >
              <OptionList options={capabilityModeOptions} />
            </SelectInput>
          </div>
          <div>
            <FieldLabel>Numeric Resolution</FieldLabel>
            <SelectInput
              value={capabilityPolicy.numericResolutionPolicy || "DETERMINISTIC"}
              onChange={(event) =>
                onUpdateCapability?.("numericResolutionPolicy", event.target.value)
              }
              disabled={disabled || capabilityPolicy.mode === "STANDARD"}
            >
              <OptionList options={numericResolutionOptions} />
            </SelectInput>
          </div>
          <div>
            <FieldLabel>Working Mode Profile</FieldLabel>
            <TextInput
              value={capabilityPolicy.workingModeProfile || ""}
              onChange={(event) =>
                onUpdateCapability?.("workingModeProfile", event.target.value)
              }
              placeholder="LEVEL_100_EQUIVALENT"
              disabled={disabled || capabilityPolicy.mode !== "BEYOND_SCALE"}
            />
          </div>
        </div>

        <div className="mt-4">
          <FieldLabel
            detail={`${capabilityNotesCharacterCount.toLocaleString()} / ${capabilityNotesCharacterLimit.toLocaleString()}`}
          >
            Capability Notes
          </FieldLabel>
          <TextArea
            value={capabilityPolicy.notes || ""}
            onChange={(event) => onUpdateCapability?.("notes", event.target.value)}
            placeholder="Explain restricted manifestations or narrative limits..."
            rows={3}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="mt-7 flex flex-wrap gap-2 border-b border-white/10 pb-3">
        {PANEL_OPTIONS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => onSetActivePanel?.(value)}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs uppercase tracking-[0.14em] transition ${
              activePanel === value
                ? "border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/12 text-[var(--foreground)]"
                : "border-white/10 bg-black/20 text-[var(--muted)] hover:border-[var(--muted-gold)]/25"
            }`}
          >
            <Icon size={14} />
            {label}
            <span className="rounded-full bg-black/35 px-2 py-0.5 text-[10px]">
              {panelCounts[value] || 0}
            </span>
          </button>
        ))}
      </div>

      {activePanel === "STATS" ? (
        <div className="mt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-2xl">Stat Definitions</h3>
              <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                Core attributes and derived values. Limit: {limits.maxStats || 0}.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onAddDefinition?.("stat")}
              disabled={disabled || stats.length >= limits.maxStats}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/40 bg-[var(--muted-gold)]/10 px-4 py-2.5 text-xs uppercase tracking-[0.14em] text-[var(--foreground)] transition hover:bg-[var(--muted-gold)]/15 disabled:opacity-40"
            >
              <Plus size={15} />
              Add Stat
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {stats.length ? (
              stats.map((definition, index) => (
                <StatDefinitionCard
                  key={definition.id}
                  definition={definition}
                  index={index}
                  total={stats.length}
                  disabled={disabled}
                  valueTypeOptions={valueTypeOptions}
                  scaleModeOptions={scaleModeOptions}
                  statOptions={statOptions}
                  poolOptions={poolOptions}
                  formulaProps={formulaProps}
                  onToggleExpanded={onToggleExpanded}
                  onUpdateDefinition={onUpdateDefinition}
                  onMoveDefinition={onMoveDefinition}
                  onRemoveDefinition={onRemoveDefinition}
                />
              ))
            ) : (
              <EmptyPanel
                icon={Activity}
                title="No Stats Defined"
                body="Add only the attributes this profile needs. Sparse profiles may intentionally remain small."
              />
            )}
          </div>
        </div>
      ) : null}

      {activePanel === "POOLS" ? (
        <div className="mt-5">
          <PanelHeading
            title="Pool Definitions"
            body={`HP, Stamina, Mana, and custom actor resources. Limit: ${limits.maxPools || 0}.`}
            actionLabel="Add Pool"
            onAction={() => onAddDefinition?.("pool")}
            disabled={disabled || pools.length >= limits.maxPools}
          />
          <div className="mt-4 space-y-3">
            {pools.length ? (
              pools.map((definition, index) => (
                <PoolDefinitionCard
                  key={definition.id}
                  definition={definition}
                  index={index}
                  total={pools.length}
                  disabled={disabled}
                  valueTypeOptions={valueTypeOptions}
                  maximumModeOptions={poolMaximumModeOptions}
                  defaultCurrentOptions={poolDefaultCurrentOptions}
                  statOptions={statOptions}
                  poolOptions={poolOptions}
                  formulaProps={formulaProps}
                  onToggleExpanded={onToggleExpanded}
                  onUpdateDefinition={onUpdateDefinition}
                  onMoveDefinition={onMoveDefinition}
                  onRemoveDefinition={onRemoveDefinition}
                />
              ))
            ) : (
              <EmptyPanel
                icon={Droplets}
                title="No Pools Defined"
                body="Add Health, Stamina, Mana, or a custom resource when the actor needs mutable capacity."
              />
            )}
          </div>
        </div>
      ) : null}

      {activePanel === "MODIFIERS" ? (
        <div className="mt-5">
          <PanelHeading
            title="Modifier Definitions"
            body={`Reusable changes applied by Conditions, abilities, equipment, or other systems. Limit: ${limits.maxModifierDefinitions || 0}.`}
            actionLabel="Add Modifier"
            onAction={() => onAddDefinition?.("modifier")}
            disabled={disabled || modifiers.length >= limits.maxModifierDefinitions}
          />
          <div className="mt-4 space-y-3">
            {modifiers.length ? (
              modifiers.map((definition, index) => (
                <ModifierCard
                  key={definition.id}
                  definition={definition}
                  index={index}
                  total={modifiers.length}
                  disabled={disabled}
                  statOptions={statOptions}
                  poolOptions={poolOptions}
                  targetTypeOptions={modifierTargetTypeOptions}
                  operationOptions={modifierOperationOptions}
                  stackPolicyOptions={stackPolicyOptions}
                  durationPolicyOptions={durationPolicyOptions}
                  onToggleExpanded={onToggleExpanded}
                  onUpdateDefinition={onUpdateDefinition}
                  onMoveDefinition={onMoveDefinition}
                  onRemoveDefinition={onRemoveDefinition}
                />
              ))
            ) : (
              <EmptyPanel
                icon={Sparkles}
                title="No Modifiers Defined"
                body="Modifiers are optional. Add them only when another system needs a reusable numeric effect."
              />
            )}
          </div>
        </div>
      ) : null}

      {activePanel === "CONDITIONS" ? (
        <div className="mt-5">
          <PanelHeading
            title="Condition Definitions"
            body={`Named actor states that activate one or more Modifiers. Limit: ${limits.maxConditionDefinitions || 0}.`}
            actionLabel="Add Condition"
            onAction={() => onAddDefinition?.("condition")}
            disabled={disabled || conditions.length >= limits.maxConditionDefinitions}
          />
          <div className="mt-4 space-y-3">
            {conditions.length ? (
              conditions.map((definition, index) => (
                <ConditionCard
                  key={definition.id}
                  definition={definition}
                  index={index}
                  total={conditions.length}
                  disabled={disabled}
                  modifierOptions={modifierOptions}
                  stackPolicyOptions={conditionStackPolicyOptions}
                  onToggleExpanded={onToggleExpanded}
                  onUpdateDefinition={onUpdateDefinition}
                  onMoveDefinition={onMoveDefinition}
                  onRemoveDefinition={onRemoveDefinition}
                />
              ))
            ) : (
              <EmptyPanel
                icon={HeartPulse}
                title="No Conditions Defined"
                body="Conditions are optional. Add them when a named state should activate reusable Modifiers."
              />
            )}
          </div>
        </div>
      ) : null}

      {jsonEditorOpen ? (
        <StatsPoolsJsonEditorModal
          statsPoolsProfile={profile}
          onApply={onApplyJsonProfile}
          onClose={onCloseJsonEditor}
        />
      ) : null}
    </section>
  );
}

function PanelHeading({ title, body, actionLabel, onAction, disabled }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h3 className="font-display text-2xl">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{body}</p>
      </div>
      <button
        type="button"
        onClick={onAction}
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/40 bg-[var(--muted-gold)]/10 px-4 py-2.5 text-xs uppercase tracking-[0.14em] text-[var(--foreground)] transition hover:bg-[var(--muted-gold)]/15 disabled:opacity-40"
      >
        <Plus size={15} />
        {actionLabel}
      </button>
    </div>
  );
}

function EmptyPanel({ icon: Icon, title, body }) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 bg-black/20 px-5 py-10 text-center">
      <Icon size={28} className="mx-auto text-[var(--muted-gold)]/70" />
      <p className="mt-3 text-sm text-[var(--foreground)]">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-[var(--muted)]">
        {body}
      </p>
    </div>
  );
}
