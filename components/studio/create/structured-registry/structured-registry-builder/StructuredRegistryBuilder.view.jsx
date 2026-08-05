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
      <div className="rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black/45 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
              {config.eyebrow}
            </p>
            <h2 className="mt-2 font-display text-4xl">
              {config.builderTitle}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              {config.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {isEditMode ? (
              <p className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                Use the page Save button to persist changes.
              </p>
            ) : (
              <button
                type="button"
                onClick={onSave}
                disabled={["saving", "saved"].includes(saveStatus)}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={14} />
                {saveStatus === "saving"
                  ? "Saving..."
                  : saveStatus === "saved"
                    ? "Opening Draft..."
                    : "Save Draft"}
              </button>
            )}
          </div>
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
    <section className="rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black/45 p-5">
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
          <Field label="Description">
            <TextArea
              rows={4}
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
              placeholder="Describe what this registry tracks and how future runtime systems should use it."
            />
          </Field>
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
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
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
                      ? "border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/10"
                      : "border-white/10 bg-black/30 hover:border-[var(--muted-gold)]/30"
                  }`}
                >
                  <p className="line-clamp-1 font-display text-xl">
                    {entry.name || `Untitled ${config.entryLabel}`}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                    {entry.category}
                  </p>
                </button>
              );
            })
          ) : (
            <p className="rounded-xl border border-dashed border-white/10 bg-black/25 p-4 text-sm leading-6 text-[var(--muted)]">
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
          <p className="rounded-xl border border-dashed border-white/10 bg-black/25 p-4 text-sm leading-6 text-[var(--muted)]">
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
          <Field label="Aliases / alternate names, one per line">
            <TextArea
              rows={3}
              value={entry.aliasesText || ""}
              onChange={(event) => onAliasesTextChange(event.target.value)}
            />
          </Field>
        </div>

        <div className="lg:col-span-2">
          <Field label="Summary">
            <TextArea
              rows={3}
              value={entry.summary || ""}
              onChange={(event) => onChange({ summary: event.target.value })}
            />
          </Field>
        </div>

        <div className="lg:col-span-2">
          <Field label="Public description">
            <TextArea
              rows={4}
              value={entry.publicDescription || ""}
              onChange={(event) =>
                onChange({ publicDescription: event.target.value })
              }
            />
          </Field>
        </div>

        <div className="lg:col-span-2">
          <Field label="Hidden / restricted notes">
            <TextArea
              rows={4}
              value={entry.hiddenNotes || ""}
              onChange={(event) => onChange({ hiddenNotes: event.target.value })}
            />
          </Field>
        </div>

        <div className="lg:col-span-2">
          <Field label="Visual identity">
            <TextArea
              rows={3}
              value={entry.visualIdentity || ""}
              onChange={(event) =>
                onChange({ visualIdentity: event.target.value })
              }
            />
          </Field>
        </div>
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--status-danger)] transition hover:border-[var(--status-danger)]/40 hover:bg-black/35"
      >
        <Trash2 size={14} />
        Delete Entry
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
          <p className="rounded-xl border border-dashed border-white/10 bg-black/25 p-4 text-sm leading-6 text-[var(--muted)]">
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
        <Field label="Relationship notes">
          <TextArea
            rows={3}
            value={entry.relationshipNotes || ""}
            onChange={(event) =>
              onUpdateEntry(entry.id, {
                relationshipNotes: event.target.value,
              })
            }
          />
        </Field>

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
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            {group.label}
          </p>
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
            Link existing creations with visual selection cards.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenLinkPicker(entry.id, group.id)}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
        >
          <Link2 size={14} />
          {group.addLabel || "Link Creation"}
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
        <p className="mt-4 rounded-xl border border-dashed border-white/10 bg-black/25 p-4 text-sm text-[var(--muted)]">
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
        <div
          className="h-16 w-16 shrink-0 rounded-xl border border-white/10 bg-black/45 bg-cover bg-center"
          style={{
            backgroundImage: `url(${link.imageUrl || "/images/placeholder-card.jpg"})`,
          }}
        />

        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-xl">
            {link.title || "Linked Creation"}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
            {link.type || "Creation"}
          </p>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2 py-2 text-[var(--status-danger)] transition hover:border-[var(--status-danger)]/40"
          aria-label="Remove linked creation"
        >
          <X size={14} />
          <span className="text-xs">Remove</span>
        </button>
      </div>

      <div className="p-4">
        {link.description ? (
          <p className="mb-3 line-clamp-2 text-xs leading-5 text-[var(--muted)]">
            {link.description}
          </p>
        ) : null}

        <textarea
          rows={2}
          value={link.notes || ""}
          onChange={(event) => onNotesChange(event.target.value)}
          placeholder="Optional link notes..."
          className="w-full resize-none rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-xs leading-5 text-[var(--foreground)] outline-none transition hover:border-[var(--muted-gold)]/35 focus:border-[var(--muted-gold)]/45"
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
                <Field label="Rules notes">
                  <TextArea
                    rows={3}
                    value={entry.rulesNotes || ""}
                    onChange={(event) =>
                      onUpdateEntry(entry.id, {
                        rulesNotes: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Access / requirements">
                  <TextArea
                    rows={3}
                    value={entry.accessRules || ""}
                    onChange={(event) =>
                      onUpdateEntry(entry.id, {
                        accessRules: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Knowledge / visibility">
                  <TextArea
                    rows={3}
                    value={entry.knowledgeRules || ""}
                    onChange={(event) =>
                      onUpdateEntry(entry.id, {
                        knowledgeRules: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Consequences / outcomes">
                  <TextArea
                    rows={3}
                    value={entry.consequences || ""}
                    onChange={(event) =>
                      onUpdateEntry(entry.id, {
                        consequences: event.target.value,
                      })
                    }
                  />
                </Field>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-white/10 bg-black/25 p-4 text-sm leading-6 text-[var(--muted)]">
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
        <Field label="Registry summary">
          <TextArea
            rows={4}
            value={promptGuidance.summary || ""}
            onChange={(event) =>
              onPromptGuidanceChange("summary", event.target.value)
            }
          />
        </Field>

        <Field label="Usage notes">
          <TextArea
            rows={4}
            value={promptGuidance.usageNotes || ""}
            onChange={(event) =>
              onPromptGuidanceChange("usageNotes", event.target.value)
            }
          />
        </Field>

        <Field label="Negative prompt notes">
          <TextArea
            rows={3}
            value={promptGuidance.negativePromptNotes || ""}
            onChange={(event) =>
              onPromptGuidanceChange(
                "negativePromptNotes",
                event.target.value
              )
            }
          />
        </Field>
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
              <dt className="text-[var(--muted)]">Registry</dt>
              <dd className="text-[var(--foreground)]">{config.label}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Entries</dt>
              <dd className="text-[var(--foreground)]">{entryCount}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Future payload</dt>
              <dd className="text-[var(--foreground)]">
                {config.futurePayload}
              </dd>
            </div>
          </dl>
        </div>

        <pre className="max-h-[520px] overflow-auto rounded-[var(--radius-md)] border border-white/10 bg-black/50 p-4 text-xs leading-5 text-[var(--muted)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {reviewPayloadText}
        </pre>
      </div>
    </Panel>
  );
}
