"use client";

import { Plus, Trash2 } from "lucide-react";

import CrestfallSelect from "@/components/ui/CrestfallSelect";

function labelForToken(value) {
  return String(value || "")
    .replace(/^ITEM_/, "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
}

function option(value, label = labelForToken(value)) {
  return { value, label };
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
          <span>{labelForToken(actionType)}</span>
        </label>
      ))}
    </div>
  );
}

function patchArguments(reference, patch, onUpdate, index) {
  onUpdate?.(index, {
    arguments: {
      ...(reference.arguments || {}),
      ...patch,
    },
  });
}

function TypedArgumentsEditor({ reference, index, onUpdate }) {
  const args = reference.arguments || {};
  const key = `${reference.domain}/${reference.operation}`;
  const bindingField = (
    <Field label="Actor Mechanics binding ID">
      <TextInput
        value={args.bindingId || ""}
        onChange={(event) =>
          patchArguments(
            reference,
            { bindingId: event.target.value },
            onUpdate,
            index
          )
        }
        placeholder={
          reference.domain === "PROGRESSION"
            ? "progression"
            : reference.domain === "SKILLS"
              ? "skills"
              : reference.domain === "WALLET"
                ? "wallet"
                : "stats"
        }
      />
    </Field>
  );

  if (key === "STATS_POOLS/MUTATE_POOL") {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        <SelectField
          label="Pool mutation"
          value={args.mutationType || "RESTORE"}
          options={["DAMAGE", "HEAL", "SPEND", "RESTORE"].map(option)}
          onChange={(mutationType) =>
            patchArguments(reference, { mutationType }, onUpdate, index)
          }
        />
        <Field label="Pool definition ID">
          <TextInput
            value={args.poolQuery || ""}
            onChange={(event) =>
              patchArguments(
                reference,
                { poolQuery: event.target.value },
                onUpdate,
                index
              )
            }
            placeholder="pool.health"
          />
        </Field>
        <NumberField
          label="Amount"
          value={args.amount ?? 1}
          onChange={(amount) =>
            patchArguments(reference, { amount }, onUpdate, index)
          }
        />
        {bindingField}
      </div>
    );
  }

  if (["STATS_POOLS/APPLY_CONDITION", "STATS_POOLS/APPLY_MODIFIER"].includes(key)) {
    const isCondition = reference.operation === "APPLY_CONDITION";
    return (
      <div className="grid gap-3 md:grid-cols-2">
        <Field label={isCondition ? "Condition definition ID" : "Modifier definition ID"}>
          <TextInput
            value={isCondition ? args.conditionQuery || "" : args.modifierQuery || ""}
            onChange={(event) =>
              patchArguments(
                reference,
                isCondition
                  ? { conditionQuery: event.target.value }
                  : { modifierQuery: event.target.value },
                onUpdate,
                index
              )
            }
            placeholder={isCondition ? "condition.injured" : "modifier.focused"}
          />
        </Field>
        <NumberField
          label="Stacks"
          value={args.stacks ?? 1}
          onChange={(stacks) =>
            patchArguments(reference, { stacks }, onUpdate, index)
          }
        />
        <SelectField
          label="Duration policy"
          value={args.durationPolicy || "PERSISTENT"}
          options={["PERSISTENT", "TURN_COUNT"].map(option)}
          onChange={(durationPolicy) =>
            patchArguments(
              reference,
              {
                durationPolicy,
                durationTurns:
                  durationPolicy === "TURN_COUNT" ? args.durationTurns || 1 : null,
              },
              onUpdate,
              index
            )
          }
        />
        {args.durationPolicy === "TURN_COUNT" ? (
          <NumberField
            label="Duration turns"
            value={args.durationTurns ?? 1}
            onChange={(durationTurns) =>
              patchArguments(reference, { durationTurns }, onUpdate, index)
            }
          />
        ) : null}
        {bindingField}
      </div>
    );
  }

  if (["STATS_POOLS/REMOVE_CONDITION", "STATS_POOLS/REMOVE_MODIFIER"].includes(key)) {
    const isCondition = reference.operation === "REMOVE_CONDITION";
    return (
      <div className="grid gap-3 md:grid-cols-2">
        <Field label={isCondition ? "Condition definition ID" : "Modifier definition ID"}>
          <TextInput
            value={isCondition ? args.conditionQuery || "" : args.modifierQuery || ""}
            onChange={(event) =>
              patchArguments(
                reference,
                isCondition
                  ? { conditionQuery: event.target.value }
                  : { modifierQuery: event.target.value },
                onUpdate,
                index
              )
            }
            placeholder={isCondition ? "condition.injured" : "modifier.focused"}
          />
        </Field>
        <NumberField
          label="Stacks to remove"
          value={args.removeStacks ?? 1}
          onChange={(removeStacks) =>
            patchArguments(reference, { removeStacks }, onUpdate, index)
          }
        />
        <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--muted)]">
          <input
            type="checkbox"
            checked={args.removeAll === true}
            onChange={(event) =>
              patchArguments(
                reference,
                { removeAll: event.target.checked },
                onUpdate,
                index
              )
            }
          />
          Remove every matching active stack
        </label>
        {bindingField}
      </div>
    );
  }

  if (key === "PROGRESSION/MUTATE_EXPERIENCE") {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        <SelectField
          label="Experience mutation"
          value={args.mutationType || "AWARD_EXPERIENCE"}
          options={["AWARD_EXPERIENCE", "REMOVE_EXPERIENCE"].map(option)}
          onChange={(mutationType) =>
            patchArguments(reference, { mutationType }, onUpdate, index)
          }
        />
        <NumberField
          label="Experience amount"
          value={args.amount ?? 1}
          onChange={(amount) =>
            patchArguments(reference, { amount }, onUpdate, index)
          }
        />
        {bindingField}
      </div>
    );
  }

  if (key === "SKILLS/ADVANCE_RANK") {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Skill definition ID">
          <TextInput
            value={args.skillQuery || ""}
            onChange={(event) =>
              patchArguments(
                reference,
                { skillQuery: event.target.value },
                onUpdate,
                index
              )
            }
            placeholder="skill.blade-mastery"
          />
        </Field>
        {bindingField}
      </div>
    );
  }

  if (key === "WALLET/MUTATE_BALANCE") {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        <SelectField
          label="Wallet mutation"
          value={args.mutationType || "CREDIT"}
          options={["CREDIT", "DEBIT"].map(option)}
          onChange={(mutationType) =>
            patchArguments(reference, { mutationType }, onUpdate, index)
          }
        />
        <Field label="Currency definition ID">
          <TextInput
            value={args.currencyQuery || ""}
            onChange={(event) =>
              patchArguments(
                reference,
                { currencyQuery: event.target.value },
                onUpdate,
                index
              )
            }
            placeholder="currency.crowns"
          />
        </Field>
        <NumberField
          label="Amount"
          value={args.amount ?? 1}
          onChange={(amount) =>
            patchArguments(reference, { amount }, onUpdate, index)
          }
        />
        {bindingField}
      </div>
    );
  }

  if (key === "ABILITY_SPELL/SET_KNOWLEDGE") {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Ability / Spell definition ID or title">
          <TextInput
            value={args.abilityQuery || ""}
            onChange={(event) =>
              patchArguments(
                reference,
                { abilityQuery: event.target.value },
                onUpdate,
                index
              )
            }
            placeholder="ability.power-strike"
          />
        </Field>
        <SelectField
          label="Known state"
          value={args.knowledgeState || "KNOWN"}
          options={["KEEP", "KNOWN", "UNKNOWN"].map(option)}
          onChange={(knowledgeState) =>
            patchArguments(reference, { knowledgeState }, onUpdate, index)
          }
        />
        <SelectField
          label="Unlock state"
          value={args.unlockState || "UNLOCKED"}
          options={["KEEP", "UNLOCKED", "LOCKED"].map(option)}
          onChange={(unlockState) =>
            patchArguments(reference, { unlockState }, onUpdate, index)
          }
        />
      </div>
    );
  }

  return (
    <p className="rounded-xl border border-dashed border-white/10 bg-black/20 p-3 text-sm text-[var(--muted)]">
      Select a registered typed operation to author its arguments.
    </p>
  );
}

export default function ItemOperationEffectReferencesEditorView({
  references = [],
  actionTypes = [],
  targetRoles = [],
  operationOptions = [],
  effectCatalogVersion = "item_operation_effect_authoring_catalog_v0",
  maxReferences = 32,
  canAdd = true,
  onAdd = null,
  onUpdate = null,
  onRemove = null,
  onSelectOperation = null,
} = {}) {
  return (
    <section className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/25 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            Operation Effects
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Attach registered typed effects to successful Item Runtime actions.
            The Item Registry stores references and arguments only; each target
            domain remains authoritative for execution and mutation.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onAdd?.()}
          disabled={!canAdd || references.length >= maxReferences}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-gold)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={14} />
          Add Operation Effect
        </button>
      </div>

      {references.length ? (
        <div className="mt-4 space-y-4">
          {references.map((reference, index) => {
            const operationKey = `${reference.domain || ""}::${reference.operation || ""}`;
            return (
              <article
                key={reference.id || `item-effect-${index}`}
                className="rounded-xl border border-white/10 bg-black/30 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="grid flex-1 gap-3 md:grid-cols-2">
                    <Field label="Effect reference ID">
                      <TextInput
                        value={reference.id || ""}
                        onChange={(event) =>
                          onUpdate?.(index, { id: event.target.value })
                        }
                        placeholder="effect.potion-health"
                      />
                    </Field>
                    <SelectField
                      label="Registered typed operation"
                      value={operationKey}
                      options={operationOptions}
                      onChange={(value) => onSelectOperation?.(index, value)}
                    />
                    <SelectField
                      label="Target role"
                      value={reference.targetRole || "SOURCE_ACTOR"}
                      options={targetRoles.map(option)}
                      onChange={(targetRole) =>
                        onUpdate?.(index, { targetRole })
                      }
                    />
                    <label className="flex items-center gap-2 self-end rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--muted)]">
                      <input
                        type="checkbox"
                        checked={reference.enabled !== false}
                        onChange={(event) =>
                          onUpdate?.(index, { enabled: event.target.checked })
                        }
                      />
                      Enabled
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove?.(index)}
                    className="rounded-lg border border-red-500/25 bg-red-500/10 p-2 text-red-200"
                    aria-label="Remove operation effect"
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
                    selected={reference.actionTypes || []}
                    onChange={(nextActionTypes) =>
                      onUpdate?.(index, { actionTypes: nextActionTypes })
                    }
                  />
                </div>

                <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--muted)]">
                    <span>Executor: {reference.version || "Select an operation"}</span>
                    <span>Catalog: {effectCatalogVersion}</span>
                  </div>
                  <TypedArgumentsEditor
                    reference={reference}
                    index={index}
                    onUpdate={onUpdate}
                  />
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-white/10 bg-black/20 p-4 text-sm leading-6 text-[var(--muted)]">
          No operation effects. Successful Item actions mutate only Item Runtime
          unless another explicitly configured Item capability applies.
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

function NumberField({ label, value, onChange, minimum = 1 }) {
  return (
    <Field label={label}>
      <input
        type="number"
        min={minimum}
        step="1"
        value={value ?? ""}
        onChange={(event) => {
          const parsed = Number(event.target.value);
          onChange?.(
            Number.isFinite(parsed) && parsed >= minimum ? parsed : minimum
          );
        }}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]/45"
      />
    </Field>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <Field label={label}>
      <CrestfallSelect
        value={value || ""}
        options={options}
        onChange={onChange}
      />
    </Field>
  );
}
