import { Plus, Trash2 } from "lucide-react";

import {
  ReadOnlyField,
  SectionTitle,
  TextAreaField,
  TextField,
  SHORT_LONGFORM_MAX_LENGTH,
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
              maxLength={SHORT_LONGFORM_MAX_LENGTH}
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
            <p className="text-sm text-[var(--ink-dim)]">{helperMessage}</p>
          ) : null}

          {cards.length ? (
            cards.map((card) => <RegistryCard key={card.id} {...card} />)
          ) : (
            <EmptyPanel message={emptyMessage} />
          )}
        </div>
      )}

      {loadError ? (
        <p className="mt-4 text-sm text-[var(--status-danger)]">{loadError}</p>
      ) : null}
    </div>
  );
}

function RegistryCard({ eyebrow, title, body, meta = "", onEdit, onDelete }) {
  return (
    <article className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
            {eyebrow}
          </p>
          <h3 className="mt-2 text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)]">
            {title}
          </h3>
        </div>

        <div className="flex gap-2">
          <SmallAction onClick={onEdit}>Edit</SmallAction>
          <SmallDangerAction onClick={onDelete} />
        </div>
      </div>

      <p className="mt-3 leading-7 text-[var(--ink-dim)]">{body}</p>
      {meta ? (
        <p className="mt-3 text-xs uppercase tracking-[0.14em] text-[var(--gold-ornament)]">
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
      className="cf-btn cf-btn--primary w-fit"
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
      onClick={() => onClick?.()}
      className="cf-btn cf-btn--danger cf-btn--sm"
      aria-label="Delete"
    >
      <Trash2 size={14} />
      Delete
    </button>
  );
}

function EmptyPanel({ message }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--line-whisper)] bg-[var(--surface-1)] p-8 text-center">
      <p className="text-sm leading-6 text-[var(--ink-dim)]">{message}</p>
    </div>
  );
}
