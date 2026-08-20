"use client";

import { Plus, Trash2 } from "lucide-react";

function labelForAction(value) {
  return String(value || "")
    .replace(/^ITEM_/, "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
}

function valueForInput(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function parseRequirementValue(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  if (text === "true") return true;
  if (text === "false") return false;
  const numeric = Number(text);
  return Number.isFinite(numeric) ? numeric : text;
}

function ActionTypeGrid({ actionTypes = [], selected = [], onChange = null }) {
  const selectedSet = new Set(selected);

  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {actionTypes.map((actionType) => (
        <label
          key={actionType}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-[var(--muted)]"
        >
          <input
            type="checkbox"
            checked={selectedSet.has(actionType)}
            onChange={(event) => {
              const next = new Set(selectedSet);
              if (event.target.checked) next.add(actionType);
              else next.delete(actionType);
              onChange?.([...next]);
            }}
          />
          <span>{labelForAction(actionType)}</span>
        </label>
      ))}
    </div>
  );
}

export default function ItemOperationRequirementSetsEditorView({
  requirementSets = [],
  actionTypes = [],
  requirementsVersion = "mechanics_command_requirements_v1",
  maxSets = 16,
  canAdd = true,
  onAdd = null,
  onUpdate = null,
  onRemove = null,
  onAddRequirement = null,
  onUpdateRequirement = null,
  onRemoveRequirement = null,
} = {}) {
  return (
    <section className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/25 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            Operation Requirements
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Gate specific Item Runtime actions with the shared Crestfall Mechanics
            requirement language. Runtime authorization and requirement evaluation
            remain authoritative outside this View.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onAdd?.()}
          disabled={!canAdd || requirementSets.length >= maxSets}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-gold)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={14} />
          Add Requirement Set
        </button>
      </div>

      {requirementSets.length ? (
        <div className="mt-4 space-y-4">
          {requirementSets.map((set, setIndex) => {
            const requirements = Array.isArray(set.requirements)
              ? set.requirements
              : [];

            return (
              <article
                key={set.id || `requirement-set-${setIndex}`}
                className="rounded-xl border border-white/10 bg-black/30 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="grid flex-1 gap-3 md:grid-cols-[1fr_auto]">
                    <Field label="Requirement set ID">
                      <TextInput
                        value={set.id || ""}
                        onChange={(event) =>
                          onUpdate?.(setIndex, { id: event.target.value })
                        }
                        placeholder="equip-strength-requirements"
                      />
                    </Field>

                    <label className="flex items-center gap-2 self-end rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--muted)]">
                      <input
                        type="checkbox"
                        checked={set.enabled !== false}
                        onChange={(event) =>
                          onUpdate?.(setIndex, { enabled: event.target.checked })
                        }
                      />
                      Enabled
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemove?.(setIndex)}
                    className="rounded-lg border border-red-500/25 bg-red-500/10 p-2 text-red-200"
                    aria-label="Remove requirement set"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-gold)]">
                    Applies to Item actions
                  </p>
                  <ActionTypeGrid
                    actionTypes={actionTypes}
                    selected={set.actionTypes || []}
                    onChange={(nextActionTypes) =>
                      onUpdate?.(setIndex, { actionTypes: nextActionTypes })
                    }
                  />
                </div>

                <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs leading-5 text-[var(--muted)]">
                      <p>Requirement mode: ALL</p>
                      <p>Contract: {requirementsVersion}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onAddRequirement?.(setIndex)}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-[var(--foreground)] transition hover:border-[var(--muted-gold)]/35"
                    >
                      <Plus size={13} />
                      Add Requirement Clause
                    </button>
                  </div>

                  {requirements.length ? (
                    <div className="mt-3 space-y-3">
                      {requirements.map((requirement, requirementIndex) => (
                        <div
                          key={requirement.id || `requirement-${requirementIndex}`}
                          className="rounded-xl border border-white/10 bg-black/30 p-3"
                        >
                          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            <Field label="Requirement ID">
                              <TextInput
                                value={requirement.id || ""}
                                onChange={(event) =>
                                  onUpdateRequirement?.(
                                    setIndex,
                                    requirementIndex,
                                    { id: event.target.value }
                                  )
                                }
                                placeholder="strength-minimum"
                              />
                            </Field>
                            <Field label="Requirement type">
                              <TextInput
                                value={requirement.type || ""}
                                onChange={(event) =>
                                  onUpdateRequirement?.(
                                    setIndex,
                                    requirementIndex,
                                    { type: event.target.value }
                                  )
                                }
                                placeholder="STATS_POOLS_STAT_CURRENT"
                              />
                            </Field>
                            <Field label="Actor Mechanics binding ID">
                              <TextInput
                                value={requirement.bindingId || ""}
                                onChange={(event) =>
                                  onUpdateRequirement?.(
                                    setIndex,
                                    requirementIndex,
                                    { bindingId: event.target.value }
                                  )
                                }
                                placeholder="stats"
                              />
                            </Field>
                            <Field label="Definition / target ID">
                              <TextInput
                                value={requirement.targetId || ""}
                                onChange={(event) =>
                                  onUpdateRequirement?.(
                                    setIndex,
                                    requirementIndex,
                                    { targetId: event.target.value }
                                  )
                                }
                                placeholder="stat.strength"
                              />
                            </Field>
                            <Field label="Operator">
                              <TextInput
                                value={requirement.operator || ""}
                                onChange={(event) =>
                                  onUpdateRequirement?.(
                                    setIndex,
                                    requirementIndex,
                                    { operator: event.target.value }
                                  )
                                }
                                placeholder="GTE"
                              />
                            </Field>
                            <Field label="Value">
                              <TextInput
                                value={valueForInput(requirement.value)}
                                onChange={(event) =>
                                  onUpdateRequirement?.(
                                    setIndex,
                                    requirementIndex,
                                    { value: parseRequirementValue(event.target.value) }
                                  )
                                }
                                placeholder="1"
                              />
                            </Field>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                            <p className="max-w-3xl text-xs leading-5 text-[var(--muted)]">
                              Common requirement fields are editable here. Any additional
                              authored fields on this requirement object are preserved when
                              these values change.
                            </p>
                            <button
                              type="button"
                              onClick={() =>
                                onRemoveRequirement?.(setIndex, requirementIndex)
                              }
                              className="inline-flex items-center gap-2 rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-200"
                            >
                              <Trash2 size={13} />
                              Remove Clause
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 rounded-lg border border-dashed border-white/10 bg-black/20 p-3 text-sm leading-6 text-[var(--muted)]">
                      No requirement clauses. Add a clause to make this set enforce an
                      authored eligibility rule.
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-white/10 bg-black/20 p-4 text-sm leading-6 text-[var(--muted)]">
          No operation requirements. Item actions use their normal runtime eligibility
          rules.
        </p>
      )}
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.14em] text-[var(--muted-gold)]">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]/45"
    />
  );
}
