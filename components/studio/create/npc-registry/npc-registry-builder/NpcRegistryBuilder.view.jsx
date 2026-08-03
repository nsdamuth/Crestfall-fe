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
        <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-5">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectTab?.(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
                    active
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

        <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-6">
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

      <aside className="self-start rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-5 xl:sticky xl:top-24">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
          Registry Summary
        </p>

        <h2 className="mt-2 font-display text-3xl">{registry.title}</h2>

        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
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
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-4 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={15} />
          {saveStatus === "saving" ? "Saving..." : "Save Registry"}
        </button>

        {saveMessage ? (
          <p
            className={`mt-3 text-sm ${
              saveStatus === "error" ? "text-red-200" : "text-emerald-200"
            }`}
          >
            {saveMessage}
          </p>
        ) : null}

        {characterLoadError ? (
          <p className="mt-3 text-sm text-red-200">{characterLoadError}</p>
        ) : null}

        <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
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
        className="inline-flex w-fit items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
      >
        <Plus size={14} />
        Add Person
      </button>

      <div className="grid gap-4">
        {entries.length ? (
          entries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
                    {entry.kind === "CREATION_REF" ? "Linked Creation" : "Lightweight NPC"}
                  </p>
                  <h3 className="mt-2 font-display text-3xl">{entry.name}</h3>
                </div>

                <div className="flex gap-2">
                  <SmallAction onClick={() => onEdit(entry)}>Edit</SmallAction>
                  <SmallDangerAction onClick={() => onDelete(entry.id)} />
                </div>
              </div>

              <p className="mt-3 leading-7 text-[var(--muted)]">
                {entry.notes || "No notes yet."}
              </p>

              <p className="mt-3 text-xs uppercase tracking-[0.14em] text-[var(--muted-gold)]">
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
        className="inline-flex w-fit items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus size={14} />
        Add Relationship
      </button>

      {entries.length < 2 ? (
        <p className="text-sm text-[var(--muted)]">
          Add at least two NPC entries before creating relationships.
        </p>
      ) : null}

      <div className="grid gap-4">
        {relationships.length ? (
          relationships.map((relationship) => (
            <article
              key={relationship.id}
              className="rounded-2xl border border-white/10 bg-black/25 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
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

              <p className="mt-3 leading-7 text-[var(--muted)]">
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
        className="inline-flex w-fit items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
      >
        <Plus size={14} />
        Add Knowledge Rule
      </button>

      <div className="grid gap-4">
        {knowledgeRules.length ? (
          knowledgeRules.map((rule) => (
            <article
              key={rule.id}
              className="rounded-2xl border border-white/10 bg-black/25 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
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

              <p className="mt-3 leading-7 text-[var(--muted)]">
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
        className="inline-flex w-fit items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus size={14} />
        Add Alias Rule
      </button>

      {!entries.length ? (
        <p className="text-sm text-[var(--muted)]">
          Add an NPC entry before creating alias rules.
        </p>
      ) : null}

      <div className="grid gap-4">
        {aliases.length ? (
          aliases.map((alias) => (
            <article
              key={alias.id}
              className="rounded-2xl border border-white/10 bg-black/25 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
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

              <p className="mt-3 leading-7 text-[var(--muted)]">
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
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 5, placeholder = "" }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
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
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
        NPC Registry
      </p>
      <h2 className="mt-2 font-display text-4xl">{title}</h2>
      <p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">{body}</p>
    </div>
  );
}

function EmptyPanel({ message }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-black/25 p-8 text-center">
      <p className="text-sm leading-6 text-[var(--muted)]">{message}</p>
    </div>
  );
}

function SmallAction({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-gold)] transition hover:border-[var(--muted-gold)]/35"
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
      className="rounded-lg border border-white/10 px-3 py-2 text-red-200 transition hover:border-red-300/35"
      aria-label="Delete"
    >
      <Trash2 size={14} />
    </button>
  );
}

function SummaryPill({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-gold)]">
        {label}
      </p>
      <p className="mt-1 text-sm text-[var(--foreground)]">{value}</p>
    </div>
  );
}