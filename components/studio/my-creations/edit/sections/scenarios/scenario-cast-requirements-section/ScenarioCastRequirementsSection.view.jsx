import { ExternalLink, X } from "lucide-react";

import { SectionTitle } from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function ScenarioCastRequirementsSectionView({
  sectionEyebrow = "Scenario Editor",
  sectionTitle = "Cast, Location, Narrator, and Registries",
  sectionDescription = "",
  fields = [],
  referenceLoadError = "",
}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-[var(--space-6)] grid gap-[var(--space-5)] md:grid-cols-2">
        {fields.map((field) => (
          <ReferenceSelectorField key={field.id} {...field} />
        ))}
      </div>

      {referenceLoadError ? (
        <p className="mt-[var(--space-4)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--status-danger)]">
          {referenceLoadError}
        </p>
      ) : null}
    </div>
  );
}

// 4.5 picker field: label row, standard bed, a right-edge "opens a
// dialog" affordance glyph distinct from the select chevron.
function ReferenceSelectorField({
  label,
  description,
  selectedItems = [],
  onOpen,
  onRemove,
}) {
  return (
    <div className="block">
      <span className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
        {label}
      </span>

      <button
        type="button"
        onClick={onOpen}
        className="relative mt-[var(--space-1)] w-full min-h-[var(--control-md)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] py-[var(--space-3)] pl-[var(--space-4)] pr-[calc(var(--space-4)+1.25rem)] text-left transition-colors hover:border-[var(--state-hover-line)]"
      >
        <ExternalLink
          size={14}
          aria-hidden="true"
          className="absolute right-[var(--space-4)] top-1/2 -translate-y-1/2 text-[var(--ink-faint)]"
        />

        <span
          className={`block text-[length:var(--text-body)] leading-[var(--lh-body)] ${
            selectedItems.length ? "text-[var(--ink)]" : "text-[var(--ink-faint)]"
          }`}
        >
          {selectedItems.length
            ? `${selectedItems.length} selected`
            : "Select creations..."}
        </span>
      </button>

      {description ? (
        <span className="mt-[var(--space-2)] block text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          {description}
        </span>
      ) : null}

      {selectedItems.length ? (
        <div className="mt-[var(--space-3)] grid gap-[var(--space-2)]">
          {selectedItems.map((item) => (
            <SelectedReferenceChip
              key={item.id}
              item={item}
              onRemove={() => onRemove?.(item.id)}
            />
          ))}
        </div>
      ) : (
        <p className="mt-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          No references selected.
        </p>
      )}
    </div>
  );
}

function SelectedReferenceChip({ item, onRemove }) {
  return (
    <article className="flex items-center gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-3)]">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-[var(--gold-ornament)]/10 text-[var(--gold-ornament)]">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.imageAltText}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-[length:var(--text-body)] font-medium">{item.initial}</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-[length:var(--text-body)] leading-none text-[var(--ink)]">
          {item.title}
        </p>
        <p className="mt-[var(--space-1)] text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          {item.typeLabel}
        </p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="cf-btn cf-btn--danger cf-btn--sm"
        aria-label={`Remove ${item.title}`}
      >
        <X size={14} />
        Remove
      </button>
    </article>
  );
}
