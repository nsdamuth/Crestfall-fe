"use client";

import { Plus, Trash2 } from "lucide-react";

export default function ItemEquipmentModifierReferencesEditorView({
  title = "Equipment Effects",
  description = "",
  referenceContractVersion = "item_equipment_modifier_reference_v0",
  references = [],
  maxReferences = 16,
  canAdd = true,
  emptyState = "No equipment modifier references.",
  onAdd = null,
  onUpdate = null,
  onRemove = null,
} = {}) {
  return (
    <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/25 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            {title}
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onAdd?.()}
          disabled={!canAdd || references.length >= maxReferences}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus size={14} />
          Add Modifier Reference
        </button>
      </div>

      {references.length ? (
        <div className="mt-4 space-y-3">
          {references.map((reference, index) => (
            <div
              key={reference.id || `equipment-reference-${index}`}
              className="rounded-xl border border-white/10 bg-black/35 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="inline-flex items-center gap-2 text-sm text-[var(--foreground)]">
                  <input
                    type="checkbox"
                    checked={reference.enabled !== false}
                    onChange={(event) =>
                      onUpdate?.(index, { enabled: event.target.checked })
                    }
                    className="h-4 w-4 rounded border-white/20 bg-black/40"
                  />
                  Enabled
                </label>

                <button
                  type="button"
                  onClick={() => onRemove?.(index)}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs uppercase tracking-[0.12em] text-red-200 transition hover:border-red-400/40 hover:bg-red-500/15"
                >
                  <Trash2 size={13} />
                  Remove
                </button>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <Field label="Reference ID">
                  <TextInput
                    value={reference.id || ""}
                    onChange={(event) =>
                      onUpdate?.(index, { id: event.target.value })
                    }
                    placeholder="equipment.shield-strength"
                  />
                </Field>

                <Field label="Stats & Pools binding ID">
                  <TextInput
                    value={reference.statsPoolsBindingId || ""}
                    onChange={(event) =>
                      onUpdate?.(index, {
                        statsPoolsBindingId: event.target.value,
                      })
                    }
                    placeholder="stats"
                  />
                </Field>

                <Field label="Modifier definition ID">
                  <TextInput
                    value={reference.modifierDefinitionId || ""}
                    onChange={(event) =>
                      onUpdate?.(index, {
                        modifierDefinitionId: event.target.value,
                      })
                    }
                    placeholder="modifier.shield-strength"
                  />
                </Field>

                <Field label="Stacks">
                  <TextInput
                    type="number"
                    min="1"
                    max="1000"
                    step="1"
                    value={reference.stacks ?? 1}
                    onChange={(event) =>
                      onUpdate?.(index, { stacks: event.target.value })
                    }
                  />
                </Field>
              </div>

              <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
                Contract: <code>{referenceContractVersion}</code>. The binding ID
                is resolved against the equipping actor&apos;s Actor Mechanics
                Profile at runtime.
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-white/10 bg-black/20 p-4 text-sm leading-6 text-[var(--muted)]">
          {emptyState}
        </p>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]">
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
      className="w-full rounded-xl border border-white/10 bg-black/45 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition hover:border-[var(--muted-gold)]/35 focus:border-[var(--muted-gold)]/45"
    />
  );
}
