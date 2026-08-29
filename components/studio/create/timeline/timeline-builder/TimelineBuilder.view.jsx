"use client";

import {
  ArrowLeft,
  BookOpenText,
  CalendarDays,
  Globe2,
  ListOrdered,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

const inputClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50";

function Field({ label, help = "", children }) {
  return (
    <label className="block min-w-0">
      <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
        {label}
      </span>
      {children}
      {help ? (
        <span className="mt-2 block text-xs leading-5 text-[var(--ink-dim)]">
          {help}
        </span>
      ) : null}
    </label>
  );
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-white/10 bg-black/25 p-4">
      <span className="min-w-0">
        <span className="block text-sm font-medium text-[var(--ink)]">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-[var(--ink-dim)]">
          {description}
        </span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange?.(event.target.checked)}
        className="mt-1 h-5 w-5 shrink-0 accent-[var(--gold-ornament)]"
      />
    </label>
  );
}

function EntryRow({ entry, onUpdateOrderOverride, onRemoveLore }) {
  const chronology = entry.displayDate || entry.era || "Undated / unplaced";

  return (
    <article className="rounded-xl border border-white/10 bg-black/25 p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 text-xs font-semibold text-[var(--gold-bright)]">
            {entry.index}
          </div>
          <div className="min-w-0">
            <p className="break-words font-display text-xl text-[var(--ink)]">{entry.title}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--ink-dim)]">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={13} /> {chronology}
              </span>
              {entry.era && entry.displayDate ? <span>{entry.era}</span> : null}
              {entry.availability === "MISSING" ? (
                <span className="text-amber-200">Referenced Lore is unavailable</span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid shrink-0 gap-2 sm:grid-cols-[10rem_auto]">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
              Order override
            </span>
            <input
              type="number"
              step="any"
              value={entry.orderOverride ?? ""}
              onChange={(event) =>
                onUpdateOrderOverride?.(entry.id, event.target.value)
              }
              placeholder={
                entry.timelineOrder === null ? "Unplaced" : String(entry.timelineOrder)
              }
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/35 px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--gold-ornament)]/50"
            />
          </label>
          <button
            type="button"
            onClick={() => onRemoveLore?.(entry.id)}
            className="cf-btn cf-btn--danger self-end"
          >
            <Trash2 size={14} /> Remove
          </button>
        </div>
      </div>
    </article>
  );
}

export default function TimelineBuilderView({
  isEditing = false,
  loadStatus = "ready",
  loadMessage = "",
  title = "",
  description = "",
  visibility = "PRIVATE",
  visibilityOptions = [],
  publicEnabled = false,
  sortDirection = "ASC",
  sortOptions = [],
  groupByEra = true,
  entries = [],
  entryCount = 0,
  unplacedCount = 0,
  saveDisabled = true,
  saveStatus = "idle",
  saveMessage = "",
  lorePickerSlot = null,
  onUpdateField = null,
  onOpenLorePicker = null,
  onRemoveLore = null,
  onUpdateOrderOverride = null,
  onSave = null,
  onBackToLore = null,
}) {
  if (loadStatus === "loading") {
    return (
      <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/35 p-8 text-sm text-[var(--ink-dim)]">
        Loading Timeline…
      </div>
    );
  }

  if (loadStatus === "error") {
    return (
      <div className="rounded-[var(--radius-md)] border border-red-300/20 bg-red-300/5 p-6">
        <p className="text-sm text-red-100">{loadMessage || "Timeline could not be loaded."}</p>
        <button type="button" className="cf-btn mt-4" onClick={() => onBackToLore?.()}>
          <ArrowLeft size={14} /> Back to Lore
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-5">
        <button type="button" onClick={() => onBackToLore?.()} className="cf-btn">
          <ArrowLeft size={14} /> Back to Lore
        </button>
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.32fr_1fr]">
        <aside className="self-start rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-5 xl:sticky xl:top-24">
          <div className="flex items-center gap-2 text-[var(--gold-ornament)]">
            <ListOrdered size={18} />
            <p className="text-xs uppercase tracking-[0.18em]">
              {isEditing ? "Timeline Editor" : "Timeline Builder"}
            </p>
          </div>
          <h1 className="mt-3 break-words font-display text-4xl">
            {title.trim() || "Untitled Timeline"}
          </h1>
          <p className="mt-3 text-sm leading-7 text-[var(--ink-dim)]">
            Curate Lore Assets into one chronology. Lore keeps ownership of its text,
            dates, publication state, and images; this Timeline owns only membership and
            ordering.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-white/10 bg-black/25 p-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--gold-ornament)]">Lore</p>
              <p className="mt-2 text-lg">{entryCount}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/25 p-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--gold-ornament)]">Unplaced</p>
              <p className="mt-2 text-lg">{unplacedCount}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSave?.()}
            disabled={saveDisabled}
            className="cf-btn cf-btn--primary mt-6 w-full"
          >
            <Save size={15} /> {saveStatus === "saving" ? "Saving…" : isEditing ? "Save Timeline" : "Create Timeline"}
          </button>
          {saveMessage ? (
            <p className={`mt-3 text-sm ${saveStatus === "error" ? "text-red-200" : "text-emerald-200"}`}>
              {saveMessage}
            </p>
          ) : null}
        </aside>

        <div className="space-y-6">
          <section className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-5 sm:p-6">
            <div className="flex items-center gap-2 text-[var(--gold-ornament)]">
              <Globe2 size={17} />
              <p className="text-xs uppercase tracking-[0.18em]">Timeline Identity</p>
            </div>
            <h2 className="mt-2 font-display text-3xl">Name, access, and public projection</h2>

            <div className="mt-5 grid gap-5">
              <Field label="Title">
                <input
                  className={inputClass}
                  value={title}
                  maxLength={140}
                  onChange={(event) => onUpdateField?.("title", event.target.value)}
                  placeholder="Aethelgard History"
                />
              </Field>

              <Field label="Description">
                <textarea
                  className={`${inputClass} min-h-28 resize-y`}
                  value={description}
                  maxLength={2000}
                  onChange={(event) => onUpdateField?.("description", event.target.value)}
                  placeholder="Describe what this chronology covers."
                />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Workspace visibility" help="Controls owner/internal access to the Timeline asset itself.">
                  <select
                    className={inputClass}
                    value={visibility}
                    onChange={(event) => onUpdateField?.("visibility", event.target.value)}
                  >
                    {visibilityOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Chronology direction">
                  <select
                    className={inputClass}
                    value={sortDirection}
                    onChange={(event) => onUpdateField?.("sortDirection", event.target.value)}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <ToggleRow
                  label="Public Timeline"
                  description="No review is required for the Timeline itself. Public readers will see only attached Lore that has a published Lore release."
                  checked={publicEnabled}
                  onChange={(checked) => onUpdateField?.("publicEnabled", checked)}
                />
                <ToggleRow
                  label="Group by Era"
                  description="Keep era labels available to the Timeline viewer. Ordering still comes from numeric chronology or per-entry overrides."
                  checked={groupByEra}
                  onChange={(checked) => onUpdateField?.("groupByEra", checked)}
                />
              </div>
            </div>
          </section>

          <section className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[var(--gold-ornament)]">
                  <BookOpenText size={17} />
                  <p className="text-xs uppercase tracking-[0.18em]">Lore Entries</p>
                </div>
                <h2 className="mt-2 font-display text-3xl">Build the chronology</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
                  Lore with a numeric Timeline Order sorts automatically. Use Order Override only when this Timeline needs a different placement. Free-form display dates stay exactly as authored in Lore.
                </p>
              </div>
              <button type="button" onClick={() => onOpenLorePicker?.()} className="cf-btn cf-btn--primary">
                <Plus size={15} /> Add Lore
              </button>
            </div>

            {entries.length ? (
              <div className="mt-5 space-y-3">
                {entries.map((entry) => (
                  <EntryRow
                    key={entry.id}
                    entry={entry}
                    onUpdateOrderOverride={onUpdateOrderOverride}
                    onRemoveLore={onRemoveLore}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-white/15 bg-black/20 px-5 py-10 text-center">
                <p className="text-sm text-[var(--ink-dim)]">No Lore is attached yet.</p>
                <button type="button" onClick={() => onOpenLorePicker?.()} className="cf-btn mt-4">
                  <Plus size={14} /> Add the first Lore Asset
                </button>
              </div>
            )}
          </section>
        </div>
      </section>

      {lorePickerSlot}
    </>
  );
}
