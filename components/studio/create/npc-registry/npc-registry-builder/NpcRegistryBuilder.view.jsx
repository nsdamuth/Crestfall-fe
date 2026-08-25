"use client";

import {
  BookOpen,
  GitBranch,
  Link2,
  Plus,
  Save,
  ShieldQuestion,
  Trash2,
  Users,
} from "lucide-react";

const tabs = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "entries", label: "People Entries", icon: Users },
  { id: "relationships", label: "Relationships", icon: GitBranch },
  { id: "knowledge", label: "Knowledge Rules", icon: ShieldQuestion },
  { id: "aliases", label: "Aliases", icon: Link2 },
];

export default function NpcRegistryBuilderView({
  activeTab = "overview",
  registry = {
    title: "",
    scope: "",
    description: "",
    entries: [],
    relationships: [],
    knowledgeRules: [],
    aliases: [],
  },
  saveStatus = "idle",
  saveMessage = "",
  characterLoadError = "",
  entryModalContent = null,
  relationshipModalContent = null,
  knowledgeModalContent = null,
  aliasModalContent = null,
  onSelectTab = null,
  onUpdateField = null,
  onSaveRegistry = null,
  onAddEntry = null,
  onEditEntry = null,
  onDeleteEntry = null,
  onAddRelationship = null,
  onEditRelationship = null,
  onDeleteRelationship = null,
  onAddKnowledgeRule = null,
  onEditKnowledgeRule = null,
  onDeleteKnowledgeRule = null,
  onAddAliasRule = null,
  onEditAliasRule = null,
  onDeleteAliasRule = null,
} = {}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <div className="space-y-5">
        <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-5">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectTab?.(tab.id)}
                  className={`inline-flex min-h-[var(--control-sm)] items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border px-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition ${
                    active
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

        <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-6">
          {activeTab === "overview" ? (
            <OverviewTab registry={registry} updateField={onUpdateField} />
          ) : null}

          {activeTab === "entries" ? (
            <EntriesTab
              entries={registry.entries}
              onAdd={onAddEntry}
              onEdit={onEditEntry}
              onDelete={onDeleteEntry}
            />
          ) : null}

          {activeTab === "relationships" ? (
            <RelationshipsTab
              entries={registry.entries}
              relationships={registry.relationships}
              onAdd={onAddRelationship}
              onEdit={onEditRelationship}
              onDelete={onDeleteRelationship}
            />
          ) : null}

          {activeTab === "knowledge" ? (
            <KnowledgeTab
              entries={registry.entries}
              knowledgeRules={registry.knowledgeRules}
              onAdd={onAddKnowledgeRule}
              onEdit={onEditKnowledgeRule}
              onDelete={onDeleteKnowledgeRule}
            />
          ) : null}

          {activeTab === "aliases" ? (
            <AliasesTab
              entries={registry.entries}
              aliases={registry.aliases}
              onAdd={onAddAliasRule}
              onEdit={onEditAliasRule}
              onDelete={onDeleteAliasRule}
            />
          ) : null}
        </div>
      </div>

      <aside className="self-start rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-5 xl:sticky xl:top-24">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
          Registry Summary
        </p>

        <h2 className="mt-2 font-display text-3xl">{registry.title}</h2>

        <p className="mt-3 text-sm leading-6 text-[var(--ink-dim)]">
          {registry.description}
        </p>

        <div className="mt-5 grid gap-3">
          <SummaryPill label="Scope" value={registry.scope} />
          <SummaryPill label="People Entries" value={registry.entries.length} />
          <SummaryPill
            label="Relationships"
            value={registry.relationships.length}
          />
          <SummaryPill
            label="Knowledge Rules"
            value={registry.knowledgeRules.length}
          />
          <SummaryPill label="Aliases" value={registry.aliases.length} />
        </div>

        <button
          type="button"
          onClick={() => onSaveRegistry?.()}
          disabled={saveStatus === "saving"}
          className="cf-btn cf-btn--primary mt-5 w-full"
        >
          <Save size={15} />
          {saveStatus === "saving" ? "Saving..." : "Save registry"}
        </button>

        {saveMessage ? (
          <p
            className={`mt-3 text-sm ${
              saveStatus === "error"
                ? "text-[var(--status-danger)]"
                : "text-[var(--status-success)]"
            }`}
          >
            {saveMessage}
          </p>
        ) : null}

        {characterLoadError ? (
          <p className="mt-3 text-sm text-[var(--status-danger)]">
            {characterLoadError}
          </p>
        ) : null}

        <p className="mt-4 text-xs leading-5 text-[var(--ink-dim)]">
          Stories can later attach one or more NPC
          registries. Registry data becomes the continuity source for
          relationships, aliases, and knowledge rules.
        </p>
      </aside>

      {entryModalContent}
      {relationshipModalContent}
      {knowledgeModalContent}
      {aliasModalContent}
    </section>
  );
}

function OverviewTab({ registry, updateField }) {
  return (
    <div className="grid gap-5">
      <SectionHeader
        title="Registry Overview"
        body="Define the registry’s purpose and scope. This becomes the master relationship spine for attached rooms."
      />

      <TextInput
        label="Registry Title"
        value={registry.title}
        onChange={(value) => updateField?.("title", value)}
        placeholder="Name this NPC registry..."
      />

      <TextInput
        label="Scope"
        value={registry.scope}
        onChange={(value) => updateField?.("scope", value)}
      />

      <TextArea
        label="Description"
        value={registry.description}
        onChange={(value) => updateField?.("description", value)}
        rows={4}
      />
    </div>
  );
}

function getEntryActorMechanicsProfileTitle(entry = {}) {
  const link =
    entry.actorMechanicsProfileLink ||
    entry.actor_mechanics_profile_link ||
    null;
  const creationId =
    entry.actorMechanicsProfileId ||
    entry.actor_mechanics_profile_id ||
    link?.creationId ||
    link?.creation_id ||
    "";

  return creationId ? link?.title || creationId : "";
}

function EntriesTab({ entries, onAdd, onEdit, onDelete }) {
  return (
    <div className="grid gap-5">
      <SectionHeader
        title="NPC Entries"
        body="Add linked characters or lightweight NPCs that should remain consistent across attached rooms."
      />

      <button
        type="button"
        onClick={onAdd}
        className="cf-btn cf-btn--secondary w-fit"
      >
        <Plus size={14} />
        Add person
      </button>

      <div className="grid gap-4">
        {entries.length ? (
          entries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-3)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
                    {entry.kind === "CREATION_REF" ? "Linked Creation" : "Lightweight NPC"}
                  </p>
                  <h3 className="mt-2 font-display text-3xl">{entry.name}</h3>
                </div>

                <div className="flex gap-2">
                  <SmallAction onClick={() => onEdit(entry)}>Edit</SmallAction>
                  <SmallDangerAction onClick={() => onDelete(entry.id)} />
                </div>
              </div>

              <p className="mt-3 leading-7 text-[var(--ink-dim)]">
                {entry.notes || "No notes yet."}
              </p>

              <p className="mt-3 text-xs uppercase tracking-[0.14em] text-[var(--gold-ornament)]">
                {entry.kind === "CREATION_REF"
                  ? "Mechanics follow the linked Character creation."
                  : getEntryActorMechanicsProfileTitle(entry)
                    ? `Actor Mechanics: ${getEntryActorMechanicsProfileTitle(entry)}`
                    : "No Actor Mechanics Profile attached."}
              </p>
            </article>
          ))
        ) : (
          <EmptyPanel message="No people entries yet. Add a linked character, player character, or lightweight NPC to begin." />
        )}
      </div>
    </div>
  );
}

function RelationshipsTab({
  entries,
  relationships,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <div className="grid gap-5">
      <SectionHeader
        title="Relationships"
        body="Define directional or mutual links between NPC entries: mentor, rival, spouse, enemy, handler, client, protector, informant, faction ally, and more."
      />

      <button
        type="button"
        onClick={onAdd}
        disabled={entries.length < 2}
        className="inline-flex h-[var(--control-md)] w-fit items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-strong)] px-[var(--space-6)] text-[length:var(--text-cta)] leading-[var(--lh-cta)] font-bold text-[var(--gold-action)] transition hover:border-[var(--gold-action)] hover:shadow-[var(--glow-hover)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus size={14} />
        Add relationship
      </button>

      {entries.length < 2 ? (
        <p className="text-sm text-[var(--ink-dim)]">
          Add at least two NPC entries before creating relationships.
        </p>
      ) : null}

      <div className="grid gap-4">
        {relationships.length ? (
          relationships.map((relationship) => (
            <article
              key={relationship.id}
              className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-3)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
                    {relationship.type || "Relationship"} ·{" "}
                    {relationship.strength}
                  </p>
                  <h3 className="mt-2 font-display text-2xl">
                    {getEntryName(entries, relationship.fromEntryId)} →{" "}
                    {getEntryName(entries, relationship.toEntryId)}
                  </h3>
                </div>

                <div className="flex gap-2">
                  <SmallAction onClick={() => onEdit(relationship)}>
                    Edit
                  </SmallAction>
                  <SmallDangerAction onClick={() => onDelete(relationship.id)} />
                </div>
              </div>

              <p className="mt-3 leading-7 text-[var(--ink-dim)]">
                {relationship.description || "No relationship rule yet."}
              </p>
            </article>
          ))
        ) : (
          <EmptyPanel message="No relationships yet." />
        )}
      </div>
    </div>
  );
}

function KnowledgeTab({
  entries,
  knowledgeRules,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <div className="grid gap-5">
      <SectionHeader
        title="Knowledge Rules"
        body="Control what NPCs know, suspect, falsely believe, or are forbidden from knowing unless story events expose it."
      />

      <button
        type="button"
        onClick={onAdd}
        className="cf-btn cf-btn--secondary w-fit"
      >
        <Plus size={14} />
        Add knowledge rule
      </button>

      <div className="grid gap-4">
        {knowledgeRules.length ? (
          knowledgeRules.map((rule) => (
            <article
              key={rule.id}
              className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-3)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
                    Default: {rule.defaultKnowledge}
                  </p>
                  <h3 className="mt-2 font-display text-2xl">
                    {rule.subject}
                  </h3>
                </div>

                <div className="flex gap-2">
                  <SmallAction onClick={() => onEdit(rule)}>Edit</SmallAction>
                  <SmallDangerAction onClick={() => onDelete(rule.id)} />
                </div>
              </div>

              <p className="mt-3 leading-7 text-[var(--ink-dim)]">
                {rule.notes || "No knowledge rule notes yet."}
              </p>
            </article>
          ))
        ) : (
          <EmptyPanel message="No knowledge rules yet." />
        )}
      </div>
    </div>
  );
}

function AliasesTab({ entries, aliases, onAdd, onEdit, onDelete }) {
  return (
    <div className="grid gap-5">
      <SectionHeader
        title="Aliases & Secret Identities"
        body="Map public identities, disguises, and secret identities to one canonical person so the runtime does not split them into duplicate actors."
      />

      <button
        type="button"
        onClick={onAdd}
        disabled={!entries.length}
        className="inline-flex h-[var(--control-md)] w-fit items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-strong)] px-[var(--space-6)] text-[length:var(--text-cta)] leading-[var(--lh-cta)] font-bold text-[var(--gold-action)] transition hover:border-[var(--gold-action)] hover:shadow-[var(--glow-hover)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus size={14} />
        Add alias rule
      </button>

      {!entries.length ? (
        <p className="text-sm text-[var(--ink-dim)]">
          Add an NPC entry before creating alias rules.
        </p>
      ) : null}

      <div className="grid gap-4">
        {aliases.length ? (
          aliases.map((alias) => (
            <article
              key={alias.id}
              className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-3)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
                    Alias Mapping
                  </p>
                  <h3 className="mt-2 font-display text-2xl">
                    {alias.publicIdentity} ={" "}
                    {getEntryName(entries, alias.trueEntryId)}
                  </h3>
                </div>

                <div className="flex gap-2">
                  <SmallAction onClick={() => onEdit(alias)}>Edit</SmallAction>
                  <SmallDangerAction onClick={() => onDelete(alias.id)} />
                </div>
              </div>

              <p className="mt-3 leading-7 text-[var(--ink-dim)]">
                {alias.rule || "No alias rule yet."}
              </p>
            </article>
          ))
        ) : (
          <EmptyPanel message="No alias rules yet." />
        )}
      </div>
    </div>
  );
}


function TextInput({ label, value, onChange, placeholder = "" }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 5, placeholder = "" }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
      />
    </label>
  );
}

function getEntryName(entries, entryId) {
  return entries.find((entry) => entry.id === entryId)?.name || "Unknown NPC";
}

function SectionHeader({ title, body }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
        NPC Registry
      </p>
      <h2 className="mt-2 font-display text-4xl">{title}</h2>
      <p className="mt-3 max-w-3xl leading-7 text-[var(--ink-dim)]">{body}</p>
    </div>
  );
}

function EmptyPanel({ message }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-black/25 p-8 text-center">
      <p className="text-sm leading-6 text-[var(--ink-dim)]">{message}</p>
    </div>
  );
}

function SmallAction({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cf-btn cf-btn--secondary cf-btn--sm"
    >
      {children}
    </button>
  );
}

function SmallDangerAction({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cf-btn cf-btn--danger cf-btn--sm"
      aria-label="Delete"
    >
      <Trash2 size={14} />
      Delete
    </button>
  );
}

function SummaryPill({ label, value }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-3">
      <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
        {label}
      </p>
      <p className="mt-1 text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)]">
        {value}
      </p>
    </div>
  );
}