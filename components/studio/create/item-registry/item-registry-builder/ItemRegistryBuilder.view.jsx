"use client";

import {
  Box,
  CheckCircle2,
  ClipboardList,
  Database,
  Link2,
  Package,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";

import CrestfallSelect from "@/components/ui/CrestfallSelect";

const TAB_ICONS = {
  overview: ClipboardList,
  entries: Package,
  associations: Link2,
  tracking: ShieldCheck,
  prompt: Sparkles,
  review: Database,
};

function formatOptionLabel(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
}

export default function ItemRegistryBuilderView({
  title = "",
  description = "",
  scope = "",
  tabs = [],
  activeTab = "overview",
  entries = [],
  activeEntryId = null,
  activeEntry = null,
  promptGuidance = {},
  reviewPayloadText = "{}",
  saveStatus = "idle",
  saveMessage = "",
  savedCreationId = null,
  openDraftHref = "",
  categoryOptions = [],
  roleOptions = [],
  placementOptions = [],
  quantityOptions = [],
  consumptionOptions = [],
  durabilityOptions = [],
  startingAssignmentContentByEntryId = {},
  onTitleChange = null,
  onDescriptionChange = null,
  onScopeChange = null,
  onSelectTab = null,
  onSelectEntry = null,
  onAddEntry = null,
  onUpdateEntry = null,
  onUpdateEntryAliases = null,
  onDeleteEntry = null,
  onPromptGuidanceChange = null,
  onSave = null,
} = {}) {
  const saveDisabled = saveStatus === "saving" || Boolean(savedCreationId);

  return (
    <section className="space-y-6">
      <div className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
              Object Continuity
            </p>
            <h2 className="mt-2 font-display text-4xl">
              Item / Inventory Registry
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
              Build a structured registry for inventories, signature objects,
              wardrobe sets, equipment, consumables, faction caches, quest
              objects, and image-generation props.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {openDraftHref ? (
              <a
                href={openDraftHref}
                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20 hover:text-[var(--ink)]"
              >
                <CheckCircle2 size={14} />
                Open Draft
              </a>
            ) : null}

            <button
              type="button"
              onClick={() => onSave?.()}
              disabled={saveDisabled}
              className="inline-flex h-[var(--control-md)] items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-strong)] bg-transparent px-[var(--space-6)] text-[length:var(--text-cta)] leading-[var(--lh-cta)] [font-weight:var(--weight-bold)] text-[var(--gold-action)] transition hover:border-[var(--gold-action)] hover:shadow-[var(--glow-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={14} />
              {saveStatus === "saving"
                ? "Saving..."
                : savedCreationId
                  ? "Saved"
                  : "Save Draft"}
            </button>
          </div>
        </div>

        {saveMessage ? (
          <p
            className={`mt-4 rounded-[var(--radius-md)] border px-4 py-3 text-sm ${
              saveStatus === "error"
                ? "border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] text-[var(--status-danger)]"
                : "border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 text-[var(--gold-ornament)]"
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
                className={`inline-flex min-h-[var(--control-sm)] items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border px-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition ${
                  tab.active
                    ? "border-[var(--gold-action)] bg-[var(--surface-1)] text-[var(--gold-bright)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
                    : "border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
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
          categoryOptions={categoryOptions}
          roleOptions={roleOptions}
          placementOptions={placementOptions}
          onAddEntry={onAddEntry}
          onSelectEntry={onSelectEntry}
          onUpdateEntry={onUpdateEntry}
          onUpdateEntryAliases={onUpdateEntryAliases}
          onDeleteEntry={onDeleteEntry}
        />
      ) : null}
      {activeTab === "associations" ? (
        <AssociationsTab entries={entries} onUpdateEntry={onUpdateEntry} />
      ) : null}
      {activeTab === "tracking" ? (
        <TrackingTab
          entries={entries}
          quantityOptions={quantityOptions}
          consumptionOptions={consumptionOptions}
          durabilityOptions={durabilityOptions}
          startingAssignmentContentByEntryId={
            startingAssignmentContentByEntryId
          }
          onUpdateEntry={onUpdateEntry}
        />
      ) : null}
      {activeTab === "prompt" ? (
        <PromptTab
          entries={entries}
          promptGuidance={promptGuidance}
          onPromptGuidanceChange={onPromptGuidanceChange}
          onUpdateEntry={onUpdateEntry}
        />
      ) : null}
      {activeTab === "review" ? (
        <ReviewTab
          entries={entries}
          scope={scope}
          reviewPayloadText={reviewPayloadText}
        />
      ) : null}
    </section>
  );
}

function Panel({ eyebrow, title, body, children }) {
  return (
    <section className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-5">
      <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
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
      className="w-full rounded-[var(--radius-md)] border border-white/10 bg-black/45 px-4 py-3 text-sm text-[var(--ink)] outline-none transition hover:border-[var(--gold-ornament)]/35 focus:border-[var(--gold-ornament)]/45"
    />
  );
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      className="w-full resize-none rounded-[var(--radius-md)] border border-white/10 bg-black/45 px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none transition hover:border-[var(--gold-ornament)]/35 focus:border-[var(--gold-ornament)]/45"
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
      title="Registry Identity"
      body="Describe what this registry is for. This can be a character inventory, signature wardrobe, faction cache, quest object list, location prop ledger, or mixed object registry."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Registry title">
          <TextInput
            value={title}
            onChange={(event) => onTitleChange?.(event.target.value)}
            placeholder="Charlotte's Signature Objects"
          />
        </Field>

        <Field label="Registry scope">
          <TextInput
            value={scope}
            onChange={(event) => onScopeChange?.(event.target.value)}
            placeholder="Character inventory, office props, faction cache..."
          />
        </Field>

        <div className="lg:col-span-2">
          <Field label="Description">
            <TextArea
              rows={4}
              value={description}
              onChange={(event) => onDescriptionChange?.(event.target.value)}
              placeholder="Describe what this registry tracks and how runtime systems should use it."
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
  categoryOptions,
  roleOptions,
  placementOptions,
  onAddEntry,
  onSelectEntry,
  onUpdateEntry,
  onUpdateEntryAliases,
  onDeleteEntry,
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[0.42fr_1fr]">
      <Panel
        eyebrow="Entries"
        title="Objects"
        body="Add important objects, equipment, consumables, wardrobes, caches, quest objects, or memory props."
      >
        <button
          type="button"
          onClick={() => onAddEntry?.()}
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20 hover:text-[var(--ink)]"
        >
          <Plus size={14} />
          Add Entry
        </button>

        <div className="mt-4 space-y-2">
          {entries.length ? (
            entries.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => onSelectEntry?.(entry.id)}
                className={`w-full rounded-[var(--radius-md)] border px-4 py-3 text-left transition ${
                  activeEntryId === entry.id
                    ? "border-[var(--gold-ornament)]/45 bg-[var(--gold-ornament)]/10"
                    : "border-white/10 bg-black/30 hover:border-[var(--gold-ornament)]/30"
                }`}
              >
                <p className="line-clamp-1 font-display text-xl">
                  {entry.name || "Untitled Object"}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--ink-dim)]">
                  {formatOptionLabel(entry.role)} · {entry.category}
                </p>
              </button>
            ))
          ) : (
            <p className="rounded-[var(--radius-md)] border border-dashed border-white/10 bg-black/25 p-4 text-sm leading-6 text-[var(--ink-dim)]">
              No entries yet. Add an object to begin.
            </p>
          )}
        </div>
      </Panel>

      <Panel
        eyebrow="Entry Editor"
        title={activeEntry?.name || (activeEntry ? "Untitled Object" : "Select an Entry")}
        body="Define what this object is, why it matters, how it appears, and how future middleware should treat it."
      >
        {activeEntry ? (
          <ItemEntryEditor
            entry={activeEntry}
            categoryOptions={categoryOptions}
            roleOptions={roleOptions}
            placementOptions={placementOptions}
            onChange={(updates) => onUpdateEntry?.(activeEntry.id, updates)}
            onAliasesChange={(value) =>
              onUpdateEntryAliases?.(activeEntry.id, value)
            }
            onDelete={() => onDeleteEntry?.(activeEntry.id)}
          />
        ) : (
          <div className="rounded-[var(--radius-md)] border border-dashed border-white/10 bg-black/25 p-8 text-center">
            <Box size={28} className="mx-auto text-[var(--gold-ornament)]" />
            <p className="mt-4 text-sm text-[var(--ink-dim)]">
              Select an object entry or add a new one.
            </p>
          </div>
        )}
      </Panel>
    </div>
  );
}

function ItemEntryEditor({
  entry,
  categoryOptions,
  roleOptions,
  placementOptions,
  onChange,
  onAliasesChange,
  onDelete,
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Name">
          <TextInput
            value={entry.name || ""}
            onChange={(event) => onChange?.({ name: event.target.value })}
            placeholder="Framed Djuna pistol"
          />
        </Field>

        <Field label="Category">
          <CrestfallSelect
            value={entry.category || "General"}
            options={categoryOptions}
            onChange={(value) => onChange?.({ category: value })}
          />
        </Field>

        <Field label="Role">
          <CrestfallSelect
            value={entry.role || "SIGNATURE_OBJECT"}
            options={roleOptions}
            onChange={(value) => onChange?.({ role: value })}
          />
        </Field>

        <Field label="Default placement">
          <CrestfallSelect
            value={entry.defaultPlacement || "UNKNOWN"}
            options={placementOptions}
            onChange={(value) => onChange?.({ defaultPlacement: value })}
          />
        </Field>

        <div className="lg:col-span-2">
          <Field label="Aliases, one per line">
            <TextArea
              rows={3}
              value={entry.aliasesText || ""}
              onChange={(event) => onAliasesChange?.(event.target.value)}
              placeholder={"Djuna's gift\nThe framed pistol"}
            />
          </Field>
        </div>

        <div className="lg:col-span-2">
          <Field label="Description">
            <TextArea
              rows={4}
              value={entry.description || ""}
              onChange={(event) => onChange?.({ description: event.target.value })}
              placeholder="What this object is and why it exists."
            />
          </Field>
        </div>

        <div className="lg:col-span-2">
          <Field label="Visual description">
            <TextArea
              rows={4}
              value={entry.visualDescription || ""}
              onChange={(event) =>
                onChange?.({ visualDescription: event.target.value })
              }
              placeholder="How this object should appear in images or scene descriptions."
            />
          </Field>
        </div>

        <div className="lg:col-span-2">
          <Field label="Symbolic / memory meaning">
            <TextArea
              rows={3}
              value={entry.symbolicMeaning || ""}
              onChange={(event) =>
                onChange?.({ symbolicMeaning: event.target.value })
              }
              placeholder="Relationship meaning, memory value, status value, emotional weight..."
            />
          </Field>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDelete?.()}
        className="inline-flex h-[var(--control-md)] items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-white/10 bg-transparent px-[var(--space-6)] text-xs uppercase tracking-[0.16em] text-[var(--status-danger)] transition hover:border-[var(--status-danger)]/40"
      >
        <Trash2 size={14} />
        Delete Entry
      </button>
    </div>
  );
}

function AssociationsTab({ entries, onUpdateEntry }) {
  return (
    <Panel
      eyebrow="Associations"
      title="Starting Ownership and Location"
      body="Assign each item to its starting Character, Player Character, Location, general Story inventory, or leave it unassigned. Runtime transfers later change Story state without rewriting this source registry."
    >
      {entries.length ? (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-[var(--radius-md)] border border-white/10 bg-black/30 p-4"
            >
              <p className="font-display text-2xl">
                {entry.name || "Untitled Object"}
              </p>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <Field label="Ownership notes">
                  <TextArea
                    rows={3}
                    value={entry.ownershipNotes || ""}
                    onChange={(event) =>
                      onUpdateEntry?.(entry.id, {
                        ownershipNotes: event.target.value,
                      })
                    }
                    placeholder="Owner, prior owner, rightful owner, custody history..."
                  />
                </Field>

                <Field label="Location notes">
                  <TextArea
                    rows={3}
                    value={entry.locationNotes || ""}
                    onChange={(event) =>
                      onUpdateEntry?.(entry.id, {
                        locationNotes: event.target.value,
                      })
                    }
                    placeholder="Carried, stored, displayed, hidden, last seen..."
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyEntriesMessage text="Add entries before defining associations." />
      )}
    </Panel>
  );
}

function TrackingTab({
  entries,
  quantityOptions,
  consumptionOptions,
  durabilityOptions,
  startingAssignmentContentByEntryId,
  onUpdateEntry,
}) {
  return (
    <Panel
      eyebrow="Tracking"
      title="Runtime Tracking Rules"
      body="These fields prepare future middleware. The AI should not track this by prompt memory; runtime services will use these rules later."
    >
      {entries.length ? (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-[var(--radius-md)] border border-white/10 bg-black/30 p-4"
            >
              <p className="font-display text-2xl">
                {entry.name || "Untitled Object"}
              </p>

              {startingAssignmentContentByEntryId?.[entry.id] || null}

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <Field label="Quantity mode">
                  <CrestfallSelect
                    value={entry.quantityMode || "UNIQUE"}
                    options={quantityOptions}
                    onChange={(value) =>
                      onUpdateEntry?.(entry.id, { quantityMode: value })
                    }
                  />
                </Field>

                <Field label="Starting quantity">
                  <TextInput
                    value={entry.startingQuantity || ""}
                    onChange={(event) =>
                      onUpdateEntry?.(entry.id, {
                        startingQuantity: event.target.value,
                      })
                    }
                    placeholder="1"
                  />
                </Field>

                <Field label="Consumption">
                  <CrestfallSelect
                    value={entry.consumptionMode || "NONE"}
                    options={consumptionOptions}
                    onChange={(value) =>
                      onUpdateEntry?.(entry.id, { consumptionMode: value })
                    }
                  />
                </Field>

                <Field label="Durability">
                  <CrestfallSelect
                    value={entry.durabilityMode || "NONE"}
                    options={durabilityOptions}
                    onChange={(value) =>
                      onUpdateEntry?.(entry.id, { durabilityMode: value })
                    }
                  />
                </Field>

                <Field label="Condition percent">
                  <TextInput
                    value={entry.conditionPercent || ""}
                    onChange={(event) =>
                      onUpdateEntry?.(entry.id, {
                        conditionPercent: event.target.value,
                      })
                    }
                    placeholder="100"
                  />
                </Field>

                <Field label="Availability rule">
                  <TextInput
                    value={entry.availabilityRule || ""}
                    onChange={(event) =>
                      onUpdateEntry?.(entry.id, {
                        availabilityRule: event.target.value,
                      })
                    }
                    placeholder="Only available in Charlotte's office"
                  />
                </Field>
              </div>

              <label className="mt-4 flex items-start gap-3 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-3">
                <input
                  type="checkbox"
                  checked={entry.doNotHallucinateAvailability !== false}
                  onChange={(event) =>
                    onUpdateEntry?.(entry.id, {
                      doNotHallucinateAvailability: event.target.checked,
                    })
                  }
                  className="mt-1"
                />
                <span className="text-sm leading-6 text-[var(--ink-dim)]">
                  Runtime systems should not assume this item is available
                  unless state, location, ownership, or story context allows it.
                </span>
              </label>
            </div>
          ))}
        </div>
      ) : (
        <EmptyEntriesMessage text="Add entries before defining tracking rules." />
      )}
    </Panel>
  );
}

function PromptTab({
  entries,
  promptGuidance,
  onPromptGuidanceChange,
  onUpdateEntry,
}) {
  return (
    <Panel
      eyebrow="Prompt Guidance"
      title="Image and Runtime Guidance"
      body="Describe how this registry should feed image generation and later runtime packets."
    >
      <div className="grid gap-4">
        <Field label="Registry summary">
          <TextArea
            rows={4}
            value={promptGuidance.summary || ""}
            onChange={(event) =>
              onPromptGuidanceChange?.("summary", event.target.value)
            }
            placeholder="Summarize how these objects should influence scenes and images."
          />
        </Field>

        <Field label="Usage notes">
          <TextArea
            rows={4}
            value={promptGuidance.usageNotes || ""}
            onChange={(event) =>
              onPromptGuidanceChange?.("usageNotes", event.target.value)
            }
            placeholder="When should these objects appear? When should they be excluded?"
          />
        </Field>

        <Field label="Negative prompt notes">
          <TextArea
            rows={3}
            value={promptGuidance.negativePromptNotes || ""}
            onChange={(event) =>
              onPromptGuidanceChange?.(
                "negativePromptNotes",
                event.target.value
              )
            }
            placeholder="Objects, styles, or errors to avoid."
          />
        </Field>

        {entries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-[var(--radius-md)] border border-white/10 bg-black/30 p-4"
          >
            <p className="font-display text-2xl">
              {entry.name || "Untitled Object"}
            </p>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Field label="Entry prompt guidance">
                <TextArea
                  rows={4}
                  value={entry.promptGuidance || ""}
                  onChange={(event) =>
                    onUpdateEntry?.(entry.id, {
                      promptGuidance: event.target.value,
                    })
                  }
                  placeholder="Prompt-ready description for this object."
                />
              </Field>

              <Field label="Entry negative prompt notes">
                <TextArea
                  rows={4}
                  value={entry.negativePromptNotes || ""}
                  onChange={(event) =>
                    onUpdateEntry?.(entry.id, {
                      negativePromptNotes: event.target.value,
                    })
                  }
                  placeholder="What should image generation avoid?"
                />
              </Field>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ReviewTab({ entries, scope, reviewPayloadText }) {
  return (
    <Panel
      eyebrow="Review"
      title="Structured Payload Preview"
      body="This is the current structured registry payload that will be saved into creations.data."
    >
      <div className="grid gap-4 lg:grid-cols-[0.35fr_0.65fr]">
        <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/30 p-4">
          <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
            Summary
          </p>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-[var(--ink-dim)]">Entries</dt>
              <dd className="text-[var(--ink)]">{entries.length}</dd>
            </div>
            <div>
              <dt className="text-[var(--ink-dim)]">Scope</dt>
              <dd className="text-[var(--ink)]">
                {scope || "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--ink-dim)]">Future payload</dt>
              <dd className="text-[var(--ink)]">ITEM_REGISTRY</dd>
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

function EmptyEntriesMessage({ text }) {
  return (
    <p className="rounded-[var(--radius-md)] border border-dashed border-white/10 bg-black/25 p-4 text-sm leading-6 text-[var(--ink-dim)]">
      {text}
    </p>
  );
}
