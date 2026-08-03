"use client";

import {
  ClipboardList,
  Plus,
  Save,
  Shirt,
  Sparkles,
  Trash2,
} from "lucide-react";

import CrestfallSelect from "@/components/ui/CrestfallSelect";

const TAB_ICONS = {
  overview: ClipboardList,
  entries: Shirt,
  rules: Sparkles,
};

function formatOptionLabel(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
}

export default function WardrobeBuilderView({
  title = "",
  description = "",
  scope = "",
  tabs = [],
  activeTab = "overview",
  entries = [],
  activeEntryId = null,
  activeEntry = null,
  selectionRules = {},
  promptGuidance = {},
  imagePrompt = "",
  negativePrompt = "",
  imagePromptMaxLength = 2000,
  negativePromptMaxLength = 2000,
  entryRoleOptions = [],
  fallbackModeOptions = [],
  saveStatus = "idle",
  saveMessage = "",
  onTitleChange = null,
  onDescriptionChange = null,
  onScopeChange = null,
  onSelectTab = null,
  onSelectEntry = null,
  onAddEntry = null,
  onUpdateEntry = null,
  onUpdateEntryContextTags = null,
  onDeleteEntry = null,
  onChooseOutfit = null,
  onSelectionRuleChange = null,
  onPromptGuidanceChange = null,
  onImagePromptChange = null,
  onNegativePromptChange = null,
  onSave = null,
} = {}) {
  const saveDisabled = saveStatus === "saving" || saveStatus === "saved";

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
              Character Clothing
            </p>
            <h2 className="mt-2 font-display text-4xl">Wardrobe</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              Build a reusable wardrobe made from outfit presets. Later,
              characters can use a wardrobe as their default clothing source for
              chat continuity and image generation.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSave?.()}
            disabled={saveDisabled}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={14} />
            {saveStatus === "saving"
              ? "Saving..."
              : saveStatus === "saved"
                ? "Opening..."
                : "Save Draft"}
          </button>
        </div>

        {saveMessage ? (
          <p
            className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
              saveStatus === "error"
                ? "border-red-500/30 bg-red-500/10 text-red-200"
                : "border-[var(--muted-gold)]/25 bg-[var(--muted-gold)]/10 text-[var(--muted-gold)]"
            }`}
          >
            {saveMessage}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = TAB_ICONS[tab.iconKey] || ClipboardList;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab?.(tab.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.14em] transition ${
                  tab.active
                    ? "border-[var(--muted-gold)]/55 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                    : "border-white/10 bg-black/25 text-[var(--muted)] hover:border-[var(--muted-gold)]/30 hover:text-[var(--foreground)]"
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "overview" ? (
        <OverviewTab
          title={title}
          description={description}
          scope={scope}
          onTitleChange={onTitleChange}
          onDescriptionChange={onDescriptionChange}
          onScopeChange={onScopeChange}
        />
      ) : null}
      {activeTab === "entries" ? (
        <EntriesTab
          entries={entries}
          activeEntryId={activeEntryId}
          activeEntry={activeEntry}
          entryRoleOptions={entryRoleOptions}
          onAddEntry={onAddEntry}
          onSelectEntry={onSelectEntry}
          onUpdateEntry={onUpdateEntry}
          onUpdateEntryContextTags={onUpdateEntryContextTags}
          onDeleteEntry={onDeleteEntry}
          onChooseOutfit={onChooseOutfit}
        />
      ) : null}
      {activeTab === "rules" ? (
        <RulesTab
          selectionRules={selectionRules}
          promptGuidance={promptGuidance}
          imagePrompt={imagePrompt}
          negativePrompt={negativePrompt}
          imagePromptMaxLength={imagePromptMaxLength}
          negativePromptMaxLength={negativePromptMaxLength}
          fallbackModeOptions={fallbackModeOptions}
          onSelectionRuleChange={onSelectionRuleChange}
          onPromptGuidanceChange={onPromptGuidanceChange}
          onImagePromptChange={onImagePromptChange}
          onNegativePromptChange={onNegativePromptChange}
        />
      ) : null}
    </section>
  );
}

function Panel({ eyebrow, title, body, children }) {
  return (
    <section className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-5">
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
        {eyebrow}
      </p>
      <h3 className="mt-2 font-display text-3xl">{title}</h3>
      {body ? (
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
          {body}
        </p>
      ) : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
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

function TextArea(props) {
  return (
    <textarea
      {...props}
      className="w-full resize-none rounded-xl border border-white/10 bg-black/45 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition hover:border-[var(--muted-gold)]/35 focus:border-[var(--muted-gold)]/45"
    />
  );
}

function OverviewTab({
  title,
  description,
  scope,
  onTitleChange,
  onDescriptionChange,
  onScopeChange,
}) {
  return (
    <Panel
      eyebrow="Overview"
      title="Wardrobe Identity"
      body="Describe what this wardrobe is for and which character or role it is intended to support."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Wardrobe title">
          <TextInput
            value={title}
            onChange={(event) => onTitleChange?.(event.target.value)}
            placeholder="Kessa's Wardrobe"
          />
        </Field>

        <Field label="Scope">
          <TextInput
            value={scope}
            onChange={(event) => onScopeChange?.(event.target.value)}
            placeholder="Kessa's workshop, travel, and public outfits"
          />
        </Field>

        <div className="lg:col-span-2">
          <Field label="Description">
            <TextArea
              rows={4}
              value={description}
              onChange={(event) => onDescriptionChange?.(event.target.value)}
              placeholder="Describe the wardrobe and how it should be used."
            />
          </Field>
        </div>
      </div>
    </Panel>
  );
}

function EntriesTab({
  entries,
  activeEntryId,
  activeEntry,
  entryRoleOptions,
  onAddEntry,
  onSelectEntry,
  onUpdateEntry,
  onUpdateEntryContextTags,
  onDeleteEntry,
  onChooseOutfit,
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[0.42fr_1fr]">
      <Panel
        eyebrow="Entries"
        title="Outfit Entries"
        body="Add outfit presets and context tags for future wardrobe selection rules."
      >
        <button
          type="button"
          onClick={() => onAddEntry?.()}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
        >
          <Plus size={14} />
          Add Entry
        </button>

        <div className="mt-4 space-y-2">
          {entries.length ? (
            entries.map((entry) => {
              const active = activeEntryId === entry.id;

              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => onSelectEntry?.(entry.id)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                    active
                      ? "border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/10"
                      : "border-white/10 bg-black/30 hover:border-[var(--muted-gold)]/30"
                  }`}
                >
                  <p className="line-clamp-1 font-display text-xl">
                    {entry.label || "Untitled Outfit Entry"}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                    {formatOptionLabel(entry.role)} ·{" "}
                    {entry.enabled ? "Enabled" : "Disabled"}
                  </p>
                </button>
              );
            })
          ) : (
            <p className="rounded-xl border border-dashed border-white/10 bg-black/25 p-4 text-sm leading-6 text-[var(--muted)]">
              No outfit entries yet. Add one to begin.
            </p>
          )}
        </div>
      </Panel>

      <Panel
        eyebrow="Entry Editor"
        title={
          activeEntry
            ? activeEntry.label || "Untitled Outfit Entry"
            : "Select an Entry"
        }
        body="Each entry points to an Outfit creation and gives it context tags for future selection rules."
      >
        {activeEntry ? (
          <WardrobeEntryEditor
            entry={activeEntry}
            entryRoleOptions={entryRoleOptions}
            onChange={(updates) => onUpdateEntry?.(activeEntry.id, updates)}
            onContextTagsChange={(value) =>
              onUpdateEntryContextTags?.(activeEntry.id, value)
            }
            onDelete={() => onDeleteEntry?.(activeEntry.id)}
            onChooseOutfit={() => onChooseOutfit?.(activeEntry.id)}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/25 p-8 text-center">
            <Shirt size={28} className="mx-auto text-[var(--muted-gold)]" />
            <p className="mt-4 text-sm text-[var(--muted)]">
              Select an outfit entry or add a new one.
            </p>
          </div>
        )}
      </Panel>
    </div>
  );
}

function WardrobeEntryEditor({
  entry,
  entryRoleOptions,
  onChange,
  onContextTagsChange,
  onDelete,
  onChooseOutfit,
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Entry label">
          <TextInput
            value={entry.label || ""}
            onChange={(event) => onChange?.({ label: event.target.value })}
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
                  <p className="font-display text-2xl">
                    {entry.outfitTitle || "Selected Outfit"}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                    {entry.outfitDescription || "No description."}
                  </p>
                  <p className="mt-2 break-all text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">
                    {entry.outfitCreationId}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm leading-6 text-[var(--muted)]">
                No outfit selected yet.
              </p>
            )}

            <button
              type="button"
              onClick={onChooseOutfit}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
            >
              <Shirt size={14} />
              {entry.outfitCreationId ? "Change Outfit" : "Select Outfit"}
            </button>
          </div>
        </Field>

        <Field label="Role">
          <CrestfallSelect
            value={entry.role || "DEFAULT"}
            options={entryRoleOptions}
            onChange={(value) => onChange?.({ role: value })}
          />
        </Field>

        <Field label="Priority">
          <TextInput
            value={String(entry.priority ?? 50)}
            onChange={(event) => onChange?.({ priority: event.target.value })}
            placeholder="50"
          />
        </Field>

        <div className="lg:col-span-2">
          <Field label="Context tags, one per line">
            <TextArea
              rows={3}
              value={entry.contextTagsText || ""}
              onChange={(event) => onContextTagsChange?.(event.target.value)}
              placeholder={"workshop\ncasual\ncity\nmerchant district"}
            />
          </Field>
        </div>

        <div className="lg:col-span-2">
          <Field label="Notes">
            <TextArea
              rows={3}
              value={entry.notes || ""}
              onChange={(event) => onChange?.({ notes: event.target.value })}
              placeholder="When should this outfit be chosen?"
            />
          </Field>
        </div>
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/25 p-3">
        <input
          type="checkbox"
          checked={entry.enabled !== false}
          onChange={(event) => onChange?.({ enabled: event.target.checked })}
          className="mt-1"
        />
        <span className="text-sm leading-6 text-[var(--muted)]">
          This outfit entry is enabled for future default wardrobe selection.
        </span>
      </label>

      <button
        type="button"
        onClick={onDelete}
        className="inline-flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-red-200 transition hover:border-red-400/40 hover:bg-red-500/15"
      >
        <Trash2 size={14} />
        Delete Entry
      </button>
    </div>
  );
}

function RulesTab({
  selectionRules,
  promptGuidance,
  imagePrompt,
  negativePrompt,
  imagePromptMaxLength,
  negativePromptMaxLength,
  fallbackModeOptions,
  onSelectionRuleChange,
  onPromptGuidanceChange,
  onImagePromptChange,
  onNegativePromptChange,
}) {
  return (
    <Panel
      eyebrow="Selection Rules"
      title="Default Selection Behavior"
      body="These rules prepare the future resolver. For now, they are saved as structured wardrobe data."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Fallback mode">
          <CrestfallSelect
            value={selectionRules.fallbackMode || "DEFAULT_THEN_FIRST"}
            options={fallbackModeOptions}
            onChange={(value) =>
              onSelectionRuleChange?.("fallbackMode", value)
            }
          />
        </Field>

        <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/25 p-3">
          <input
            type="checkbox"
            checked={Boolean(selectionRules.allowRandom)}
            onChange={(event) =>
              onSelectionRuleChange?.("allowRandom", event.target.checked)
            }
            className="mt-1"
          />
          <span className="text-sm leading-6 text-[var(--muted)]">
            Allow random selection among matching enabled outfits later.
          </span>
        </label>

        <div className="lg:col-span-2">
          <Field label="Summary">
            <TextArea
              rows={4}
              value={promptGuidance.summary || ""}
              onChange={(event) =>
                onPromptGuidanceChange?.("summary", event.target.value)
              }
              placeholder="Summarize how this wardrobe should be used."
            />
          </Field>
        </div>

        <div className="lg:col-span-2">
          <Field label="Usage notes">
            <TextArea
              rows={4}
              value={promptGuidance.usageNotes || ""}
              onChange={(event) =>
                onPromptGuidanceChange?.("usageNotes", event.target.value)
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
              value={imagePrompt}
              onChange={(event) => onImagePromptChange?.(event.target.value)}
              placeholder="Optional standalone prompt for generating catalogue, preview, mannequin lineup, or reference images of this wardrobe as its own visual asset. Max 2,000 characters."
            />
          </Field>
        </div>

        <div className="lg:col-span-2">
          <Field label="Negative Prompt">
            <TextArea
              rows={5}
              maxLength={negativePromptMaxLength}
              value={negativePrompt}
              onChange={(event) => onNegativePromptChange?.(event.target.value)}
              placeholder="Optional negatives this wardrobe should contribute when selected as a clothing source. Example: no modern logos, no sneakers, no transparent fabric. Max 2,000 characters."
            />
          </Field>
        </div>
      </div>
    </Panel>
  );
}
