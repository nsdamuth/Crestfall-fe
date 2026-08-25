"use client";

import {
  Database,
  GitBranch,
  Link2,
  ListChecks,
  Plus,
  Save,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import CrestfallSelect from "@/components/ui/CrestfallSelect";
import KitArtPlaceholder from "@/components/kit/KitArtPlaceholder";
import {
  SectionTitle,
  TextAreaField,
  SHORT_LONGFORM_MAX_LENGTH,
  DEEP_LONGFORM_MAX_LENGTH,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

const TAB_ICONS = {
  overview: ListChecks,
  entries: Database,
  relationships: GitBranch,
  rules: ListChecks,
  prompt: Sparkles,
  review: Database,
};

export default function StructuredRegistryBuilderView({
  config,
  title,
  description,
  scope,
  entries,
  activeEntryId,
  activeEntry,
  promptGuidance,
  reviewPayloadText,
  tabs,
  activeTab,
  hideTabs = false,
  isEditMode = false,
  saveStatus = "idle",
  saveMessage = "",
  categoryOptions = [],
  onTitleChange,
  onDescriptionChange,
  onScopeChange,
  onSelectTab,
  onSelectEntry,
  onAddEntry,
  onUpdateEntry,
  onEntryAliasesTextChange,
  onDeleteEntry,
  onOpenLinkPicker,
  onRemoveLinkedCreation,
  onLinkedCreationNotesChange,
  onPromptGuidanceChange,
  onSave,
}) {
  return (
    <section className="space-y-6">
      <div className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <SectionTitle
            eyebrow={config.eyebrow}
            title={config.builderTitle}
            body={config.description}
          />

          <div className="flex flex-wrap gap-2">
            {isEditMode ? (
              <p className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs uppercase tracking-[0.14em] text-[var(--ink-dim)]">
                Use the page Save button to persist changes.
              </p>
            ) : (
              <button
                type="button"
                onClick={onSave}
                disabled={["saving", "saved"].includes(saveStatus)}
                className="cf-btn cf-btn--primary"
              >
                <Save size={14} />
                {saveStatus === "saving"
                  ? "Saving..."
                  : saveStatus === "saved"
                    ? "Opening draft..."
                    : "Save draft"}
              </button>
            )}
          </div>
        </div>

        {saveMessage ? (
          <span
            role={saveStatus === "error" ? "alert" : undefined}
            aria-live="polite"
            className={`mt-4 inline-flex items-center gap-[var(--space-1)] text-[length:var(--text-label)] leading-[var(--lh-label)] ${
              saveStatus === "error"
                ? "text-[var(--status-danger)]"
                : "text-[var(--status-success)]"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 flex-none rounded-full ${
                saveStatus === "error"
                  ? "bg-[var(--status-danger)]"
                  : "bg-[var(--status-success)]"
              }`}
            />
            <span className="inline">{saveMessage}</span>
          </span>
        ) : null}

        {hideTabs ? null : (
          <div className="mt-5 flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = TAB_ICONS[tab.iconKey] || ListChecks;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-[var(--radius-md)] border px-4 py-2 text-xs uppercase tracking-[0.14em] transition ${
                    tab.active
                      ? "border-[var(--gold-ornament)]/55 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
                      : "border-white/10 bg-black/25 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/30 hover:text-[var(--ink)]"
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {activeTab === "overview" ? (
        <OverviewTab
          config={config}
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
          config={config}
          entries={entries}
          activeEntryId={activeEntryId}
          activeEntry={activeEntry}
          categoryOptions={categoryOptions}
          onSelectEntry={onSelectEntry}
          onAddEntry={onAddEntry}
          onUpdateEntry={onUpdateEntry}
          onEntryAliasesTextChange={onEntryAliasesTextChange}
          onDeleteEntry={onDeleteEntry}
        />
      ) : null}

      {activeTab === "relationships" ? (
        <RelationshipsTab
          config={config}
          entries={entries}
          onUpdateEntry={onUpdateEntry}
          onOpenLinkPicker={onOpenLinkPicker}
          onRemoveLinkedCreation={onRemoveLinkedCreation}
          onLinkedCreationNotesChange={onLinkedCreationNotesChange}
        />
      ) : null}

      {activeTab === "rules" ? (
        <RulesTab
          config={config}
          entries={entries}
          onUpdateEntry={onUpdateEntry}
        />
      ) : null}

      {activeTab === "prompt" ? (
        <PromptTab
          config={config}
          promptGuidance={promptGuidance}
          onPromptGuidanceChange={onPromptGuidanceChange}
        />
      ) : null}

      {activeTab === "review" ? (
        <ReviewTab
          config={config}
          entryCount={entries.length}
          reviewPayloadText={reviewPayloadText}
        />
      ) : null}
    </section>
  );
}

function Panel({ eyebrow, title, body, children }) {
  return (
    <section className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-5">
      <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
        {eyebrow}
      </p>
      <h3 className="mt-2 font-display text-3xl">{title}</h3>
      {body ? (
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
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

function OverviewTab({
  config,
  title,
  description,
  scope,
  onTitleChange,
  onDescriptionChange,
  onScopeChange,
}) {
  return (
    <Panel eyebrow="Overview" title="Registry Identity" body={config.futureUse}>
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Registry title">
          <TextInput
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder={`Untitled ${config.label}`}
          />
        </Field>

        <Field label="Registry scope">
          <TextInput
            value={scope}
            onChange={(event) => onScopeChange(event.target.value)}
            placeholder="What part of the world does this registry cover?"
          />
        </Field>

        <div className="lg:col-span-2">
          <TextAreaField
            label="Description"
            value={description}
            onChange={(value) => onDescriptionChange(value)}
            placeholder="Describe what this registry tracks and how future runtime systems should use it."
            maxLength={SHORT_LONGFORM_MAX_LENGTH}
          />
        </div>
      </div>
    </Panel>
  );
}

function EntriesTab({
  config,
  entries,
  activeEntryId,
  activeEntry,
  categoryOptions,
  onSelectEntry,
  onAddEntry,
  onUpdateEntry,
  onEntryAliasesTextChange,
  onDeleteEntry,
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[0.42fr_1fr]">
      <Panel
        eyebrow="Entries"
        title={config.entryPluralLabel}
        body={`Add ${config.entryPluralLabel.toLowerCase()} for this registry.`}
      >
        <button
          type="button"
          onClick={onAddEntry}
          className="cf-btn cf-btn--primary"
        >
          <Plus size={14} />
          Add {config.entryLabel}
        </button>

        <div className="mt-4 space-y-2">
          {entries.length ? (
            entries.map((entry) => {
              const active = activeEntryId === entry.id;

              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => onSelectEntry(entry.id)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                    active
                      ? "border-[var(--gold-ornament)]/45 bg-[var(--gold-ornament)]/10"
                      : "border-white/10 bg-black/30 hover:border-[var(--gold-ornament)]/30"
                  }`}
                >
                  <p className="line-clamp-1 font-display text-xl">
                    {entry.name || `Untitled ${config.entryLabel}`}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--ink-dim)]">
                    {entry.category}
                  </p>
                </button>
              );
            })
          ) : (
            <p className="rounded-xl border border-dashed border-white/10 bg-black/25 p-4 text-sm leading-6 text-[var(--ink-dim)]">
              No entries yet.
            </p>
          )}
        </div>
      </Panel>

      <Panel
        eyebrow="Entry Editor"
        title={
          activeEntry
            ? activeEntry.name || `Untitled ${config.entryLabel}`
            : "Select an Entry"
        }
        body="Define identity, public description, hidden notes, visual identity, and middleware-ready metadata."
      >
        {activeEntry ? (
          <StructuredEntryEditor
            entry={activeEntry}
            config={config}
            categoryOptions={categoryOptions}
            onChange={(updates) => onUpdateEntry(activeEntry.id, updates)}
            onAliasesTextChange={(value) =>
              onEntryAliasesTextChange(activeEntry.id, value)
            }
            onDelete={() => onDeleteEntry(activeEntry.id)}
          />
        ) : (
          <p className="rounded-xl border border-dashed border-white/10 bg-black/25 p-4 text-sm leading-6 text-[var(--ink-dim)]">
            Select an entry or add a new one.
          </p>
        )}
      </Panel>
    </div>
  );
}

function StructuredEntryEditor({
  entry,
  config,
  categoryOptions,
  onChange,
  onAliasesTextChange,
  onDelete,
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label={`${config.entryLabel} name`}>
          <TextInput
            value={entry.name || ""}
            onChange={(event) => onChange({ name: event.target.value })}
            placeholder={config.entryPlaceholder}
          />
        </Field>

        <Field label={config.categoryLabel}>
          <CrestfallSelect
            value={entry.category || categoryOptions?.[0]?.value || "Other"}
            options={categoryOptions}
            onChange={(value) => onChange({ category: value })}
          />
        </Field>

        <div className="lg:col-span-2">
          <TextAreaField
            label="Aliases / alternate names, one per line"
            value={entry.aliasesText || ""}
            onChange={(value) => onAliasesTextChange(value)}
            maxLength={SHORT_LONGFORM_MAX_LENGTH}
          />
        </div>

        <div className="lg:col-span-2">
          <TextAreaField
            label="Summary"
            value={entry.summary || ""}
            onChange={(value) => onChange({ summary: value })}
            maxLength={SHORT_LONGFORM_MAX_LENGTH}
          />
        </div>

        <div className="lg:col-span-2">
          <TextAreaField
            label="Public description"
            value={entry.publicDescription || ""}
            onChange={(value) =>
              onChange({ publicDescription: value })
            }
            maxLength={DEEP_LONGFORM_MAX_LENGTH}
          />
        </div>

        <div className="lg:col-span-2">
          <TextAreaField
            label="Hidden / restricted notes"
            value={entry.hiddenNotes || ""}
            onChange={(value) => onChange({ hiddenNotes: value })}
            maxLength={DEEP_LONGFORM_MAX_LENGTH}
          />
        </div>

        <div className="lg:col-span-2">
          <TextAreaField
            label="Visual identity"
            value={entry.visualIdentity || ""}
            onChange={(value) =>
              onChange({ visualIdentity: value })
            }
            maxLength={SHORT_LONGFORM_MAX_LENGTH}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="cf-btn cf-btn--danger"
      >
        <Trash2 size={14} />
        Delete entry
      </button>
    </div>
  );
}

function RelationshipsTab({
  config,
  entries,
  onUpdateEntry,
  onOpenLinkPicker,
  onRemoveLinkedCreation,
  onLinkedCreationNotesChange,
}) {
  return (
    <Panel
      eyebrow="Relationships"
      title={config.relationshipLabel}
      body="Use these fields to prepare future graph/middleware links. This is intentionally flexible for v0."
    >
      <div className="space-y-4">
        {entries.length ? (
          entries.map((entry) => (
            <EntryRelationshipFields
              key={entry.id}
              entry={entry}
              config={config}
              onUpdateEntry={onUpdateEntry}
              onOpenLinkPicker={onOpenLinkPicker}
              onRemoveLinkedCreation={onRemoveLinkedCreation}
              onLinkedCreationNotesChange={onLinkedCreationNotesChange}
            />
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-white/10 bg-black/25 p-4 text-sm leading-6 text-[var(--ink-dim)]">
            Add entries before defining relationships.
          </p>
        )}
      </div>
    </Panel>
  );
}

function EntryRelationshipFields({
  entry,
  config,
  onUpdateEntry,
  onOpenLinkPicker,
  onRemoveLinkedCreation,
  onLinkedCreationNotesChange,
}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/30 p-4">
      <p className="font-display text-2xl">
        {entry.name || `Untitled ${config.entryLabel}`}
      </p>

      <div className="mt-4 grid gap-4">
        <TextAreaField
          label="Relationship notes"
          value={entry.relationshipNotes || ""}
          onChange={(value) =>
            onUpdateEntry(entry.id, {
              relationshipNotes: value,
            })
          }
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />

        <div className="grid gap-4">
          {(config.relationshipGroups || []).map((group) => (
            <LinkedCreationGroup
              key={group.id}
              entry={entry}
              group={group}
              onOpenLinkPicker={onOpenLinkPicker}
              onRemoveLinkedCreation={onRemoveLinkedCreation}
              onLinkedCreationNotesChange={onLinkedCreationNotesChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function LinkedCreationGroup({
  entry,
  group,
  onOpenLinkPicker,
  onRemoveLinkedCreation,
  onLinkedCreationNotesChange,
}) {
  const links = Array.isArray(entry?.[group.id]) ? entry[group.id] : [];

  return (
    <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
            {group.label}
          </p>
          <p className="mt-1 text-sm leading-6 text-[var(--ink-dim)]">
            Link existing creations with visual selection cards.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenLinkPicker(entry.id, group.id)}
          className="cf-btn cf-btn--primary"
        >
          <Link2 size={14} />
          {group.addLabel || "Link creation"}
        </button>
      </div>

      {links.length ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {links.map((link) => (
            <LinkedCreationCard
              key={link.id}
              link={link}
              onRemove={() =>
                onRemoveLinkedCreation(entry.id, group.id, link.id)
              }
              onNotesChange={(notes) =>
                onLinkedCreationNotesChange(
                  entry.id,
                  group.id,
                  link.id,
                  notes
                )
              }
            />
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-white/10 bg-black/25 p-4 text-sm text-[var(--ink-dim)]">
          {group.emptyLabel || "No linked creations yet."}
        </p>
      )}
    </div>
  );
}

function LinkedCreationCard({ link, onRemove, onNotesChange }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-md)] border border-white/10 bg-black/35">
      <div className="flex items-center gap-3 border-b border-white/10 bg-black/25 p-3">
        {link.imageUrl ? (
          <div
            className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/45 bg-cover bg-center"
            style={{ backgroundImage: `url(${link.imageUrl})` }}
          />
        ) : (
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10">
            <KitArtPlaceholder size="sm" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-xl">
            {link.title || "Linked Creation"}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-dim)]">
            {link.type || "Creation"}
          </p>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="cf-btn cf-btn--danger cf-btn--sm"
          aria-label="Remove linked creation"
        >
          <X size={14} />
          <span className="text-xs">Remove</span>
        </button>
      </div>

      <div className="p-4">
        {link.description ? (
          <p className="mb-3 line-clamp-2 text-xs leading-5 text-[var(--ink-dim)]">
            {link.description}
          </p>
        ) : null}

        <TextAreaField
          label="Notes"
          value={link.notes || ""}
          onChange={(value) => onNotesChange(value)}
          placeholder="Optional link notes..."
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />
      </div>
    </div>
  );
}

function RulesTab({ config, entries, onUpdateEntry }) {
  return (
    <Panel
      eyebrow="Rules"
      title={config.rulesLabel}
      body="These fields are for future middleware: access rules, knowledge gates, branch rules, consequences, or visibility logic."
    >
      <div className="space-y-4">
        {entries.length ? (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-[var(--radius-md)] border border-white/10 bg-black/30 p-4"
            >
              <p className="font-display text-2xl">
                {entry.name || `Untitled ${config.entryLabel}`}
              </p>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <TextAreaField
                  label="Rules notes"
                  value={entry.rulesNotes || ""}
                  onChange={(value) =>
                    onUpdateEntry(entry.id, {
                      rulesNotes: value,
                    })
                  }
                  maxLength={SHORT_LONGFORM_MAX_LENGTH}
                />

                <TextAreaField
                  label="Access / requirements"
                  value={entry.accessRules || ""}
                  onChange={(value) =>
                    onUpdateEntry(entry.id, {
                      accessRules: value,
                    })
                  }
                  maxLength={SHORT_LONGFORM_MAX_LENGTH}
                />

                <TextAreaField
                  label="Knowledge / visibility"
                  value={entry.knowledgeRules || ""}
                  onChange={(value) =>
                    onUpdateEntry(entry.id, {
                      knowledgeRules: value,
                    })
                  }
                  maxLength={SHORT_LONGFORM_MAX_LENGTH}
                />

                <TextAreaField
                  label="Consequences / outcomes"
                  value={entry.consequences || ""}
                  onChange={(value) =>
                    onUpdateEntry(entry.id, {
                      consequences: value,
                    })
                  }
                  maxLength={SHORT_LONGFORM_MAX_LENGTH}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-white/10 bg-black/25 p-4 text-sm leading-6 text-[var(--ink-dim)]">
            Add entries before defining rules.
          </p>
        )}
      </div>
    </Panel>
  );
}

function PromptTab({ config, promptGuidance, onPromptGuidanceChange }) {
  return (
    <Panel
      eyebrow="Prompt Guidance"
      title={config.promptLabel}
      body="Describe how this registry should feed runtime packets and Image Studio prompt compilation."
    >
      <div className="grid gap-4">
        <TextAreaField
          label="Registry summary"
          value={promptGuidance.summary || ""}
          onChange={(value) =>
            onPromptGuidanceChange("summary", value)
          }
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label="Usage notes"
          value={promptGuidance.usageNotes || ""}
          onChange={(value) =>
            onPromptGuidanceChange("usageNotes", value)
          }
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label="Negative prompt notes"
          value={promptGuidance.negativePromptNotes || ""}
          onChange={(value) =>
            onPromptGuidanceChange(
              "negativePromptNotes",
              value
            )
          }
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />
      </div>
    </Panel>
  );
}

function ReviewTab({ config, entryCount, reviewPayloadText }) {
  return (
    <Panel
      eyebrow="Review"
      title="Structured Payload Preview"
      body="This is the current structured registry payload saved into creations.data."
    >
      <div className="grid gap-4 lg:grid-cols-[0.35fr_0.65fr]">
        <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/30 p-4">
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-[var(--ink-dim)]">Registry</dt>
              <dd className="text-[var(--ink)]">{config.label}</dd>
            </div>
            <div>
              <dt className="text-[var(--ink-dim)]">Entries</dt>
              <dd className="text-[var(--ink)]">{entryCount}</dd>
            </div>
            <div>
              <dt className="text-[var(--ink-dim)]">Future payload</dt>
              <dd className="text-[var(--ink)]">
                {config.futurePayload}
              </dd>
            </div>
          </dl>
        </div>

        <pre className="max-h-[520px] overflow-auto rounded-[var(--radius-md)] border border-white/10 bg-black/50 p-4 text-xs leading-5 text-[var(--ink-dim)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {reviewPayloadText}
        </pre>
      </div>
    </Panel>
  );
}
