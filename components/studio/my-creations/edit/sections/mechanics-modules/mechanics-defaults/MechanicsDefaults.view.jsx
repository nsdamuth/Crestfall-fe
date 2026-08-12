"use client";

import { Plus, Trash2 } from "lucide-react";

const EYEBROW_CLASS =
  "flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]";

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
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
      />
    </label>
  );
}

function SmallActionButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cf-btn cf-btn--primary cf-btn--sm"
    >
      {children}
    </button>
  );
}

function DefaultValueField({ bucketKey, entry, onPatch }) {
  if (bucketKey === "flags") {
    return (
      <label className="grid gap-2 text-sm text-[var(--ink-dim)]">
        <span>Initial Value</span>
        <select
          value={entry.initial ? "true" : "false"}
          onChange={(event) =>
            onPatch({ initial: event.target.value === "true" })
          }
          className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--ink)] outline-none transition focus:border-[var(--gold-ornament)]"
        >
          <option value="false">false</option>
          <option value="true">true</option>
        </select>
      </label>
    );
  }

  return (
    <TextField
      label="Initial Value"
      type={bucketKey === "counters" ? "number" : "text"}
      value={String(entry.initial ?? (bucketKey === "counters" ? 0 : "auto"))}
      onChange={(value) => onPatch({ initial: value })}
      placeholder={bucketKey === "counters" ? "0" : "auto"}
    />
  );
}

function DefaultCard({ bucket, entry, entryIndex, onPatch, onRemove }) {
  return (
    <article className="rounded-xl border border-white/10 bg-black/35 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className={EYEBROW_CLASS}>
          {bucket.singularLabel} {entryIndex + 1}
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="cf-btn cf-btn--danger cf-btn--sm"
          title={`Remove ${bucket.singularLabel.toLowerCase()}`}
          aria-label={`Remove ${bucket.singularLabel.toLowerCase()}`}
        >
          <Trash2 size={13} />
          <span className="text-xs">Remove</span>
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <TextField
          label={`${bucket.singularLabel} ID`}
          value={entry.id || ""}
          onChange={(value) => onPatch({ id: value })}
          placeholder={bucket.placeholderId}
        />
        <TextField
          label="Label"
          value={entry.label || ""}
          onChange={(value) =>
            onPatch({
              label: value,
              ...(entry.id ? {} : { id: value }),
            })
          }
          placeholder={bucket.placeholderLabel}
        />
        <DefaultValueField
          bucketKey={bucket.key}
          entry={entry}
          onPatch={onPatch}
        />
      </div>
    </article>
  );
}

function DefaultsBucket({ bucket, entries, onAdd, onPatch, onRemove }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className={EYEBROW_CLASS}>
            {bucket.title}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
            Defaults initialize missing status tokens without overwriting live
            state once commands or router actions have written values.
          </p>
        </div>
        <SmallActionButton onClick={onAdd}>
          <Plus size={14} />
          {bucket.addLabel}
        </SmallActionButton>
      </div>

      {entries.length ? (
        <div className="mt-4 grid gap-4">
          {entries.map((entry, entryIndex) => (
            <DefaultCard
              key={entry.id || entryIndex}
              bucket={bucket}
              entry={entry}
              entryIndex={entryIndex}
              onPatch={(patch) => onPatch(entryIndex, patch)}
              onRemove={() => onRemove(entryIndex)}
            />
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[var(--ink-dim)]">
          No defaults defined yet.
        </p>
      )}
    </div>
  );
}

export default function MechanicsDefaultsView({
  buckets = [],
  addEntry,
  patchEntry,
  removeEntry,
}) {
  return (
    <section className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/20 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className={EYEBROW_CLASS}>
            Visual Builder
          </p>
          <h3 className="mt-2 font-display text-3xl">
            Defaults: Flags, Counters, and Stages
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
            Define default runtime values used by status blocks before any
            command writes live state. Live room/session values still take
            precedence.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {buckets.map(({ config, entries }) => (
          <DefaultsBucket
            key={config.key}
            bucket={config}
            entries={entries}
            onAdd={() => addEntry(config.key)}
            onPatch={(entryIndex, patch) =>
              patchEntry(config.key, entryIndex, patch)
            }
            onRemove={(entryIndex) => removeEntry(config.key, entryIndex)}
          />
        ))}
      </div>
    </section>
  );
}
