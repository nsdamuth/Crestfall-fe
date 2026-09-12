"use client";

import {
  ArrowLeft,
  BookOpenText,
  CalendarDays,
  Globe2,
  Layers3,
  ListOrdered,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import KitDropdownView from "@/components/kit/dropdown/KitDropdown.view";
import CreateActionBar from "@/components/studio/create/create-action-bar/CreateActionBar";

const inputClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50";

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
    <label className="flex min-h-[var(--control-md)] cursor-pointer items-start justify-between gap-4 rounded-xl border border-white/10 bg-[var(--surface-2)] p-4">
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

function EntryRow({
  entry,
  chapters = [],
  onUpdateOrderOverride,
  onUpdateEntryChapter,
  onRemoveLore,
}) {
  const chronology = entry.displayDate || entry.era || "Undated / unplaced";

  return (
    <article className="rounded-xl border border-white/10 bg-[var(--surface-2)] p-4 sm:p-5">
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

        <div className="grid min-w-0 gap-2 md:shrink-0 md:grid-cols-[12rem_10rem_auto]">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
              Chapter
            </span>
            <div className="mt-1 w-full [&>div]:w-full [&>div>button]:w-full [&_svg]:ml-auto">
              <KitDropdownView
                options={[
                  { value: "", label: "Unassigned" },
                  ...chapters.map((chapter) => ({
                    value: chapter.id,
                    label: chapter.title,
                  })),
                ]}
                selectedValues={[entry.chapterId || ""]}
                isMultiSelect={false}
                onToggleOption={(nextValue) => onUpdateEntryChapter?.(entry.id, nextValue)}
              />
            </div>
          </label>
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
              className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--gold-ornament)]/50"
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

function ChapterRow({ chapter, onUpdateChapter, onRemoveChapter }) {
  return (
    <article className="grid gap-3 rounded-xl border border-white/10 bg-[var(--surface-2)] p-4 md:grid-cols-[8rem_minmax(0,1fr)_auto] md:items-end">
      <label className="block">
        <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
          Order
        </span>
        <input
          type="number"
          step="any"
          value={chapter.order}
          onChange={(event) =>
            onUpdateChapter?.(chapter.id, "order", event.target.value)
          }
          className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--gold-ornament)]/50"
        />
      </label>
      <label className="block min-w-0">
        <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
          Chapter title
        </span>
        <input
          value={chapter.title}
          maxLength={160}
          onChange={(event) =>
            onUpdateChapter?.(chapter.id, "title", event.target.value)
          }
          className="mt-1 w-full rounded-lg border border-white/10 bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--gold-ornament)]/50"
          placeholder="Arc I, Origins to Bronze Age"
        />
      </label>
      <button
        type="button"
        onClick={() => onRemoveChapter?.(chapter.id)}
        className="cf-btn cf-btn--danger"
      >
        <Trash2 size={14} /> Remove
      </button>
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
  groupingMode = "ERA",
  groupingOptions = [],
  chapters = [],
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
  onUpdateEntryChapter = null,
  onAddChapter = null,
  onUpdateChapter = null,
  onRemoveChapter = null,
  onSave = null,
  onBackToLore = null,
}) {
  if (loadStatus === "loading") {
    return (
      <div className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--surface-2)] p-8 text-sm text-[var(--ink-dim)]">
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
        {/* MOBILE-SHELLS: min-w-0 on both grid children. Without it the
            implicit base column is sized by min-width:auto and any nowrap
            descendant becomes the page's horizontal scroll width. This is
            the single-column rule for this shell: one column in DOM order
            below xl, each panel free to shrink to the page gutter. */}
        <aside className="min-w-0 self-start rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-[var(--surface-2)] p-5 xl:sticky xl:top-24">
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

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm divide-x divide-[var(--line-whisper)]">
            <div className="pr-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--gold-ornament)]">Lore</p>
              <p className="mt-2 text-lg">{entryCount}</p>
            </div>
            <div className="pl-3">
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

        <div className="min-w-0 space-y-6">
          <section className="min-w-0 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-[var(--surface-2)] p-5 sm:p-6">
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

              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Workspace visibility" help="Controls owner/internal access to the Timeline asset itself.">
                  <div className="w-full [&>div]:w-full [&>div>button]:w-full [&_svg]:ml-auto">
                    <KitDropdownView
                      options={visibilityOptions}
                      selectedValues={visibility ? [visibility] : []}
                      isMultiSelect={false}
                      onToggleOption={(nextValue) => onUpdateField?.("visibility", nextValue)}
                    />
                  </div>
                </Field>

                <Field label="Chronology direction">
                  <div className="w-full [&>div]:w-full [&>div>button]:w-full [&_svg]:ml-auto">
                    <KitDropdownView
                      options={sortOptions}
                      selectedValues={sortDirection ? [sortDirection] : []}
                      isMultiSelect={false}
                      onToggleOption={(nextValue) => onUpdateField?.("sortDirection", nextValue)}
                    />
                  </div>
                </Field>

                <Field label="Viewer grouping" help="Chapters are authored by this Timeline; Lore eras remain owned by Lore.">
                  <div className="w-full [&>div]:w-full [&>div>button]:w-full [&_svg]:ml-auto">
                    <KitDropdownView
                      options={groupingOptions}
                      selectedValues={groupingMode ? [groupingMode] : []}
                      isMultiSelect={false}
                      onToggleOption={(nextValue) => onUpdateField?.("groupingMode", nextValue)}
                    />
                  </div>
                </Field>
              </div>

              <ToggleRow
                label="Public Timeline"
                description="No review is required for the Timeline itself. Public readers will see only attached Lore that has a published Lore release."
                checked={publicEnabled}
                onChange={(checked) => onUpdateField?.("publicEnabled", checked)}
              />
            </div>
          </section>

          <section className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-[var(--surface-2)] p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[var(--gold-ornament)]">
                  <Layers3 size={17} />
                  <p className="text-xs uppercase tracking-[0.18em]">Timeline Chapters</p>
                </div>
                <h2 className="mt-2 font-display text-3xl">Author collapsible sections</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
                  Chapters belong to this Timeline and do not modify Lore. When Viewer Grouping is Chapters, readers can expand and collapse these sections independently.
                </p>
              </div>
              <button type="button" onClick={() => onAddChapter?.()} className="cf-btn">
                <Plus size={15} /> Add Chapter
              </button>
            </div>

            {chapters.length ? (
              <div className="mt-5 space-y-3">
                {chapters.map((chapter) => (
                  <ChapterRow
                    key={chapter.id}
                    chapter={chapter}
                    onUpdateChapter={onUpdateChapter}
                    onRemoveChapter={onRemoveChapter}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-white/15 bg-[var(--surface-1)] px-5 py-8 text-center">
                <p className="text-sm text-[var(--ink-dim)]">No authored chapters yet. Era grouping and continuous chronology still work without them.</p>
              </div>
            )}
          </section>

          <section className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-[var(--surface-2)] p-5 sm:p-6">
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
                    chapters={chapters}
                    onUpdateOrderOverride={onUpdateOrderOverride}
                    onUpdateEntryChapter={onUpdateEntryChapter}
                    onRemoveLore={onRemoveLore}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-white/15 bg-[var(--surface-1)] px-5 py-10 text-center">
                <p className="text-sm text-[var(--ink-dim)]">No Lore is attached yet.</p>
                <button type="button" onClick={() => onOpenLorePicker?.()} className="cf-btn mt-4">
                  <Plus size={14} /> Add the first Lore Asset
                </button>
              </div>
            )}
          </section>
        </div>

        {/* MOBILE-SHELLS: the aside's save is a full scroll away on a phone,
            so the same action docks to the bottom edge below md. The aside
            button is untouched and is what renders on desktop. */}
        <CreateActionBar
          label={
            saveStatus === "saving"
              ? "Saving..."
              : isEditing
                ? "Save Timeline"
                : "Create Timeline"
          }
          onAction={onSave}
          disabled={saveDisabled}
        />
      </section>

      {lorePickerSlot}
    </>
  );
}
