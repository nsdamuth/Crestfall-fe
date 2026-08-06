import { Plus, Shirt, Trash2 } from "lucide-react";

import CrestfallSelect from "@/components/ui/CrestfallSelect";

export default function WardrobeFieldsSectionView({
  activeSection = "overview",
  sectionEyebrow = "Wardrobe",
  sectionTitle = "Wardrobe Identity",
  sectionDescription = "",
  wardrobeTitleValue = "",
  wardrobeScopeValue = "",
  wardrobeDescriptionValue = "",
  entries = [],
  activeEntry = null,
  entryRoleOptions = [],
  fallbackModeOptions = [],
  fallbackModeValue = "DEFAULT_THEN_FIRST",
  allowRandomChecked = false,
  promptSummaryValue = "",
  promptUsageNotesValue = "",
  imagePromptValue = "",
  negativePromptValue = "",
  imagePromptMaxLength = 2000,
  negativePromptMaxLength = 2000,
  onChangeWardrobeTitle = null,
  onChangeWardrobeScope = null,
  onChangeWardrobeDescription = null,
  onAddEntry = null,
  onChangeFallbackMode = null,
  onChangeAllowRandom = null,
  onChangePromptSummary = null,
  onChangePromptUsageNotes = null,
  onChangeImagePrompt = null,
  onChangeNegativePrompt = null,
} = {}) {
  if (!["overview", "entries", "rules"].includes(activeSection)) {
    return null;
  }

  return (
    <div>
      <SectionHeader
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      {activeSection === "overview" ? (
        <OverviewSection
          wardrobeTitleValue={wardrobeTitleValue}
          wardrobeScopeValue={wardrobeScopeValue}
          wardrobeDescriptionValue={wardrobeDescriptionValue}
          onChangeWardrobeTitle={onChangeWardrobeTitle}
          onChangeWardrobeScope={onChangeWardrobeScope}
          onChangeWardrobeDescription={onChangeWardrobeDescription}
        />
      ) : null}

      {activeSection === "entries" ? (
        <EntriesSection
          entries={entries}
          activeEntry={activeEntry}
          entryRoleOptions={entryRoleOptions}
          onAddEntry={onAddEntry}
        />
      ) : null}

      {activeSection === "rules" ? (
        <RulesSection
          fallbackModeOptions={fallbackModeOptions}
          fallbackModeValue={fallbackModeValue}
          allowRandomChecked={allowRandomChecked}
          promptSummaryValue={promptSummaryValue}
          promptUsageNotesValue={promptUsageNotesValue}
          imagePromptValue={imagePromptValue}
          negativePromptValue={negativePromptValue}
          imagePromptMaxLength={imagePromptMaxLength}
          negativePromptMaxLength={negativePromptMaxLength}
          onChangeFallbackMode={onChangeFallbackMode}
          onChangeAllowRandom={onChangeAllowRandom}
          onChangePromptSummary={onChangePromptSummary}
          onChangePromptUsageNotes={onChangePromptUsageNotes}
          onChangeImagePrompt={onChangeImagePrompt}
          onChangeNegativePrompt={onChangeNegativePrompt}
        />
      ) : null}
    </div>
  );
}

function OverviewSection({
  wardrobeTitleValue,
  wardrobeScopeValue,
  wardrobeDescriptionValue,
  onChangeWardrobeTitle,
  onChangeWardrobeScope,
  onChangeWardrobeDescription,
}) {
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      <Field label="Wardrobe title">
        <TextInput
          value={wardrobeTitleValue}
          onChange={(event) => onChangeWardrobeTitle?.(event.target.value)}
          placeholder="Kessa's Wardrobe"
        />
      </Field>

      <Field label="Scope">
        <TextInput
          value={wardrobeScopeValue}
          onChange={(event) => onChangeWardrobeScope?.(event.target.value)}
          placeholder="Workshop, travel, public, and casual outfits"
        />
      </Field>

      <div className="lg:col-span-2">
        <Field label="Description">
          <TextArea
            rows={4}
            value={wardrobeDescriptionValue}
            onChange={(event) =>
              onChangeWardrobeDescription?.(event.target.value)
            }
            placeholder="Describe what this wardrobe contains and how it should be used."
          />
        </Field>
      </div>
    </div>
  );
}

function EntriesSection({
  entries,
  activeEntry,
  entryRoleOptions,
  onAddEntry,
}) {
  return (
    <div className="mt-6 grid gap-5 xl:grid-cols-[0.42fr_1fr]">
      <div>
        <button
          type="button"
          onClick={() => onAddEntry?.()}
          className="cf-btn cf-btn--primary"
        >
          <Plus size={14} />
          Add entry
        </button>

        <div className="mt-4 space-y-2">
          {entries.length ? (
            entries.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => entry.onSelect?.()}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  entry.isActive
                    ? "border-[var(--gold-ornament)]/45 bg-[var(--gold-ornament)]/10"
                    : "border-white/10 bg-black/30 hover:border-[var(--gold-ornament)]/30"
                }`}
              >
                <p className="line-clamp-1 font-display text-xl">
                  {entry.labelDisplay}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--ink-dim)]">
                  {entry.roleDisplay} · {entry.enabledDisplay}
                </p>
              </button>
            ))
          ) : (
            <p className="rounded-xl border border-dashed border-white/10 bg-black/25 p-4 text-sm leading-6 text-[var(--ink-dim)]">
              No outfit entries yet. Add one to begin.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
        {activeEntry ? (
          <WardrobeEntryEditor
            entry={activeEntry}
            entryRoleOptions={entryRoleOptions}
          />
        ) : (
          <div className="rounded-[var(--radius-md)] border border-dashed border-white/10 bg-black/25 p-8 text-center">
            <Shirt size={28} className="mx-auto text-[var(--gold-ornament)]" />
            <p className="mt-4 text-sm text-[var(--ink-dim)]">
              Select an outfit entry or add a new one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function WardrobeEntryEditor({ entry, entryRoleOptions }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Entry label">
          <TextInput
            value={entry.labelValue}
            onChange={(event) => entry.onChangeLabel?.(event.target.value)}
            placeholder="Workshop Outfit"
          />
        </Field>

        <Field label="Outfit">
          <div className="rounded-xl border border-white/10 bg-black/35 p-4">
            {entry.outfitCreationId ? (
              <div className="flex items-start gap-4">
                {entry.outfitImageUrl ? (
                  <div
                    className="h-20 w-20 shrink-0 rounded-xl border border-white/10 bg-cover bg-center"
                    style={{ backgroundImage: `url(${entry.outfitImageUrl})` }}
                  />
                ) : null}

                <div className="min-w-0 flex-1">
                  <p className="font-display text-2xl">{entry.outfitTitle}</p>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--ink-dim)]">
                    {entry.outfitDescription}
                  </p>
                  <p className="mt-2 break-all text-[11px] uppercase tracking-[0.12em] text-[var(--ink-dim)]">
                    {entry.outfitCreationId}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm leading-6 text-[var(--ink-dim)]">
                No outfit selected yet.
              </p>
            )}

            <button
              type="button"
              onClick={() => entry.onChooseOutfit?.()}
              className="cf-btn cf-btn--primary mt-4"
            >
              <Shirt size={14} />
              {entry.outfitCreationId ? "Change outfit" : "Select outfit"}
            </button>
          </div>
        </Field>

        <Field label="Role">
          <CrestfallSelect
            value={entry.roleValue}
            options={entryRoleOptions}
            onChange={(value) => entry.onChangeRole?.(value)}
          />
        </Field>

        <Field label="Priority">
          <TextInput
            value={entry.priorityValue}
            onChange={(event) => entry.onChangePriority?.(event.target.value)}
            placeholder="50"
          />
        </Field>

        <div className="lg:col-span-2">
          <Field label="Context tags, one per line">
            <TextArea
              rows={3}
              value={entry.contextTagsText}
              onChange={(event) =>
                entry.onChangeContextTagsText?.(event.target.value)
              }
              placeholder={"workshop\ncasual\ncity\nmerchant district"}
            />
          </Field>
        </div>

        <div className="lg:col-span-2">
          <Field label="Notes">
            <TextArea
              rows={3}
              value={entry.notesValue}
              onChange={(event) => entry.onChangeNotes?.(event.target.value)}
              placeholder="When should this outfit be chosen?"
            />
          </Field>
        </div>
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/25 p-3">
        <input
          type="checkbox"
          checked={entry.enabledChecked}
          onChange={(event) =>
            entry.onChangeEnabled?.(event.target.checked)
          }
          className="mt-1"
        />
        <span className="text-sm leading-6 text-[var(--ink-dim)]">
          This outfit entry is enabled for future default wardrobe selection.
        </span>
      </label>

      <button
        type="button"
        onClick={() => entry.onDelete?.()}
        className="cf-btn cf-btn--danger"
      >
        <Trash2 size={14} />
        Delete entry
      </button>
    </div>
  );
}

function RulesSection({
  fallbackModeOptions,
  fallbackModeValue,
  allowRandomChecked,
  promptSummaryValue,
  promptUsageNotesValue,
  imagePromptValue,
  negativePromptValue,
  imagePromptMaxLength,
  negativePromptMaxLength,
  onChangeFallbackMode,
  onChangeAllowRandom,
  onChangePromptSummary,
  onChangePromptUsageNotes,
  onChangeImagePrompt,
  onChangeNegativePrompt,
}) {
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      <Field label="Fallback mode">
        <CrestfallSelect
          value={fallbackModeValue}
          options={fallbackModeOptions}
          onChange={(value) => onChangeFallbackMode?.(value)}
        />
      </Field>

      <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/25 p-3">
        <input
          type="checkbox"
          checked={allowRandomChecked}
          onChange={(event) =>
            onChangeAllowRandom?.(event.target.checked)
          }
          className="mt-1"
        />
        <span className="text-sm leading-6 text-[var(--ink-dim)]">
          Allow random selection among matching enabled outfits later.
        </span>
      </label>

      <div className="lg:col-span-2">
        <Field label="Summary">
          <TextArea
            rows={4}
            value={promptSummaryValue}
            onChange={(event) =>
              onChangePromptSummary?.(event.target.value)
            }
            placeholder="Summarize how this wardrobe should be used."
          />
        </Field>
      </div>

      <div className="lg:col-span-2">
        <Field label="Usage notes">
          <TextArea
            rows={4}
            value={promptUsageNotesValue}
            onChange={(event) =>
              onChangePromptUsageNotes?.(event.target.value)
            }
            placeholder="Describe outfit selection guidance for chat and image generation."
          />
        </Field>
      </div>

      <div className="lg:col-span-2">
        <Field label="Standalone Image Prompt">
          <TextArea
            rows={5}
            maxLength={imagePromptMaxLength}
            value={imagePromptValue}
            onChange={(event) => onChangeImagePrompt?.(event.target.value)}
            placeholder="Optional standalone prompt for generating catalogue, preview, mannequin lineup, or reference images of this wardrobe as its own visual asset. Max 2,000 characters."
          />
        </Field>
      </div>

      <div className="lg:col-span-2">
        <Field label="Negative Prompt">
          <TextArea
            rows={5}
            maxLength={negativePromptMaxLength}
            value={negativePromptValue}
            onChange={(event) => onChangeNegativePrompt?.(event.target.value)}
            placeholder="Optional negatives this wardrobe should contribute when selected as a clothing source. Example: no modern logos, no sneakers, no transparent fabric. Max 2,000 characters."
          />
        </Field>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
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
      className="w-full rounded-xl border border-white/10 bg-black/45 px-4 py-3 text-sm text-[var(--ink)] outline-none transition hover:border-[var(--gold-ornament)]/35 focus:border-[var(--gold-ornament)]/45"
    />
  );
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      className="w-full resize-none rounded-xl border border-white/10 bg-black/45 px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none transition hover:border-[var(--gold-ornament)]/35 focus:border-[var(--gold-ornament)]/45"
    />
  );
}

function SectionHeader({ eyebrow, title, body }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
        {eyebrow}
      </p>
      <h3 className="mt-2 font-display text-3xl">{title}</h3>
      {body ? (
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
          {body}
        </p>
      ) : null}
    </div>
  );
}
