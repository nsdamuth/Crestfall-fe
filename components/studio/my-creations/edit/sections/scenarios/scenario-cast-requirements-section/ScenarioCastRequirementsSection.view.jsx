import { X } from "lucide-react";

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

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {fields.map((field) => (
          <ReferenceSelectorField key={field.id} {...field} />
        ))}
      </div>

      {referenceLoadError ? (
        <p className="mt-4 text-sm text-red-200">{referenceLoadError}</p>
      ) : null}
    </div>
  );
}

function ReferenceSelectorField({
  label,
  description,
  selectedItems = [],
  onOpen,
  onRemove,
}) {
  return (
    <div className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>

      <button
        type="button"
        onClick={onOpen}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-4 text-left transition hover:border-[var(--gold-ornament)]/35 focus:border-[var(--gold-ornament)]/50"
      >
        <span className="block text-sm text-[var(--ink)]">
          {selectedItems.length
            ? `${selectedItems.length} selected`
            : "Select creations..."}
        </span>

        {description ? (
          <span className="mt-1 block text-xs leading-5 text-[var(--ink-dim)]">
            {description}
          </span>
        ) : null}
      </button>

      {selectedItems.length ? (
        <div className="mt-3 grid gap-2">
          {selectedItems.map((item) => (
            <SelectedReferenceChip
              key={item.id}
              item={item}
              onRemove={() => onRemove?.(item.id)}
            />
          ))}
        </div>
      ) : (
        <p className="mt-3 text-xs leading-5 text-[var(--ink-dim)]">
          No references selected.
        </p>
      )}
    </div>
  );
}

function SelectedReferenceChip({ item, onRemove }) {
  return (
    <article className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 p-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--gold-ornament)]/20 bg-[var(--gold-ornament)]/10 text-[var(--gold-ornament)]">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.imageAltText}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-display text-lg">{item.initial}</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 font-display text-lg leading-none text-[var(--ink)]">
          {item.title}
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[var(--gold-ornament)]">
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
