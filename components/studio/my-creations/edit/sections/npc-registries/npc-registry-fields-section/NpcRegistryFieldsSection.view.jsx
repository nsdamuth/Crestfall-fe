import { Plus, Trash2 } from "lucide-react";

import {
  ReadOnlyField,
  SectionTitle,
  TextAreaField,
  TextField,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function NpcRegistryFieldsSectionView({
  activeSection = "overview",
  sectionEyebrow = "NPC Registry Editor",
  sectionTitle = "Registry Overview",
  sectionDescription = "",
  registryTitleValue = "",
  scopeValue = "",
  descriptionValue = "",
  descriptionPlaceholder = "",
  creationTypeValue = "",
  entryCountValue = "0",
  relationshipCountValue = "0",
  knowledgeRuleCountValue = "0",
  primaryActionLabel = "",
  primaryActionDisabled = false,
  helperMessage = "",
  cards = [],
  emptyMessage = "",
  loadError = "",
  onChangeRegistryTitle = null,
  onChangeScope = null,
  onChangeDescription = null,
  onPrimaryAction = null,
} = {}) {
  if (
    !["overview", "entries", "relationships", "knowledge", "aliases"].includes(
      activeSection
    )
  ) {
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
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <TextField
            label="Registry Title"
            value={registryTitleValue}
            onChange={(value) => onChangeRegistryTitle?.(value)}
          />

          <TextField
            label="Scope"
            value={scopeValue}
            onChange={(value) => onChangeScope?.(value)}
          />

          <div className="md:col-span-2">
            <TextAreaField
              label="Description"
              value={descriptionValue}
              onChange={(value) => onChangeDescription?.(value)}
              placeholder={descriptionPlaceholder}
            />
          </div>

          <ReadOnlyField label="Creation Type" value={creationTypeValue} />
          <ReadOnlyField label="Entries" value={entryCountValue} />
          <ReadOnlyField
            label="Relationships"
            value={relationshipCountValue}
          />
          <ReadOnlyField
            label="Knowledge Rules"
            value={knowledgeRuleCountValue}
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-5">
          <PrimaryAction
            onClick={onPrimaryAction}
            disabled={primaryActionDisabled}
          >
            {primaryActionLabel}
          </PrimaryAction>

          {helperMessage ? (
            <p className="text-sm text-[var(--muted)]">{helperMessage}</p>
          ) : null}

          {cards.length ? (
            cards.map((card) => <RegistryCard key={card.id} {...card} />)
          ) : (
            <EmptyPanel message={emptyMessage} />
          )}
        </div>
      )}

      {loadError ? (
        <p className="mt-4 text-sm text-red-200">{loadError}</p>
      ) : null}
    </div>
  );
}

function RegistryCard({ eyebrow, title, body, meta = "", onEdit, onDelete }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            {eyebrow}
          </p>
          <h3 className="mt-2 font-display text-3xl">{title}</h3>
        </div>

        <div className="flex gap-2">
          <SmallAction onClick={onEdit}>Edit</SmallAction>
          <SmallDangerAction onClick={onDelete} />
        </div>
      </div>

      <p className="mt-3 leading-7 text-[var(--muted)]">{body}</p>
      {meta ? (
        <p className="mt-3 text-xs uppercase tracking-[0.14em] text-[var(--muted-gold)]">
          {meta}
        </p>
      ) : null}
    </article>
  );
}

function PrimaryAction({ children, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={() => onClick?.()}
      disabled={disabled}
      className="inline-flex w-fit items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Plus size={14} />
      {children}
    </button>
  );
}

function SmallAction({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick?.()}
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
      onClick={() => onClick?.()}
      className="rounded-lg border border-white/10 px-3 py-2 text-red-200 transition hover:border-red-300/35"
      aria-label="Delete"
    >
      <Trash2 size={14} />
    </button>
  );
}

function EmptyPanel({ message }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-black/25 p-8 text-center">
      <p className="text-sm leading-6 text-[var(--muted)]">{message}</p>
    </div>
  );
}
