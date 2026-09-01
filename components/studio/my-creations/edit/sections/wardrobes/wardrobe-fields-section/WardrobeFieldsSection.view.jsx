import { useState } from "react";
import { Plus, Shirt, Trash2 } from "lucide-react";

import {
  CheckboxField,
  SectionTitle,
  SelectField,
  SHORT_LONGFORM_MAX_LENGTH,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

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
  negativePromptMaxLength = 300,
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
      <SectionTitle
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
                className={`w-full rounded-[var(--radius-md)] border px-4 py-3 text-left transition ${
                  entry.isActive
                    ? "border-[var(--gold-action)] bg-[var(--gold-ornament)]/10"
                    : "border-[var(--line-whisper)] bg-[var(--surface-2)] hover:border-[var(--line)]"
                }`}
              >
                <p className="line-clamp-1 text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)]">
                  {entry.labelDisplay}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--ink-dim)]">
                  {entry.roleDisplay} · {entry.enabledDisplay}
                </p>
              </button>
            ))
          ) : (
            <p className="rounded-[var(--radius-md)] border border-dashed border-[var(--line-whisper)] bg-[var(--surface-1)] p-4 text-sm leading-6 text-[var(--ink-dim)]">
              No outfit entries yet. Add one to begin.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-5">
        {activeEntry ? (
          <WardrobeEntryEditor
            entry={activeEntry}
            entryRoleOptions={entryRoleOptions}
          />
        ) : (
          <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--line-whisper)] bg-[var(--surface-1)] p-8 text-center">
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
          <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-4">
            {entry.outfitCreationId ? (
              <div className="flex items-start gap-4">
                {entry.outfitImageUrl ? (
                  <div
                    className="h-20 w-20 shrink-0 rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-cover bg-center"
                    style={{ backgroundImage: `url(${entry.outfitImageUrl})` }}
                  />
                ) : null}

                <div className="min-w-0 flex-1">
                  <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)]">
                    {entry.outfitTitle}
                  </p>
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

        <SelectField
          label="Role"
          value={entry.roleValue}
          options={entryRoleOptions}
          onChange={(value) => entry.onChangeRole?.(value)}
        />

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

      <CheckboxField
        label="This outfit entry is enabled for future default wardrobe selection."
        checked={entry.enabledChecked}
        onChange={(checked) => entry.onChangeEnabled?.(checked)}
      />

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
      <SelectField
        label="Fallback mode"
        value={fallbackModeValue}
        options={fallbackModeOptions}
        onChange={(value) => onChangeFallbackMode?.(value)}
      />

      <CheckboxField
        label="Allow random selection among matching enabled outfits later."
        checked={allowRandomChecked}
        onChange={(checked) => onChangeAllowRandom?.(checked)}
      />

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
            placeholder="Optional standalone prompt for generating catalogue, preview, mannequin lineup, or reference images of this wardrobe as its own visual asset. Max 300 characters."
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
            placeholder="Optional negatives this wardrobe should contribute when selected as a clothing source. Example: no modern logos, no sneakers, no transparent fabric. Max 300 characters."
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
      className="w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition-colors hover:border-[var(--line)]"
    />
  );
}

// K1 folding field pattern (SharedFields.jsx TextAreaField), ED1d
// Defect 2: every long-form field here was a bare textarea with no
// fold and no counter. Reimplemented inline (rather than delegating
// to TextAreaField) because every call site already owns its label
// via the `Field` wrapper above; a second label would double up.
// `maxLength` defaults to the SHORT_LONGFORM ruling for call sites
// that do not pass their own (e.g. the 2,000-char prompt fields do).
function TextArea({
  value = "",
  onChange = () => {},
  placeholder,
  maxLength = SHORT_LONGFORM_MAX_LENGTH,
  rows: _rows, // superseded by the fold's own resting/expanded heights
  ...rest
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasExpanded, setHasExpanded] = useState(false);
  const isExpanded = hasExpanded || Boolean(String(value).trim());
  const atLimit = maxLength && value.length >= maxLength;
  const pastThreshold = maxLength && value.length >= maxLength * 0.8;
  const showCounter = maxLength && (isFocused || pastThreshold);

  return (
    <div>
      <textarea
        {...rest}
        value={value}
        onChange={(event) => onChange(event)}
        onFocus={(event) => {
          setIsFocused(true);
          setHasExpanded(true);
          rest.onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          rest.onBlur?.(event);
        }}
        placeholder={placeholder}
        maxLength={maxLength || undefined}
        className="w-full resize-none overflow-y-auto rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none transition-[height,border-color] hover:border-[var(--line)]"
        style={{ height: isExpanded ? undefined : "3rem", maxHeight: "320px" }}
      />
      {showCounter ? (
        <span
          className={`mt-1 block text-right text-[length:var(--text-label)] tabular-nums ${
            atLimit ? "text-[var(--status-danger)]" : "text-[var(--ink-faint)]"
          }`}
        >
          {value.length}/{maxLength}
          {atLimit ? " limit" : ""}
        </span>
      ) : null}
    </div>
  );
}
