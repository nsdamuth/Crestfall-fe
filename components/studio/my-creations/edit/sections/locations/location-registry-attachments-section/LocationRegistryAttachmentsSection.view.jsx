import { Link2, X } from "lucide-react";

import {
  SectionTitle,
  SHORT_LONGFORM_MAX_LENGTH,
  TextAreaField,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function LocationRegistryAttachmentsSectionView({
  sectionEyebrow = "Location Runtime Context",
  sectionTitle = "Registry Attachments",
  sectionDescription = "",
  groups = [],
  pickerSlot = null,
  onOpenPicker = null,
  onRemoveRegistry = null,
  onChangeRegistryNotes = null,
} = {}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-[var(--space-6)] grid gap-[var(--space-4)]">
        {groups.map((group) => (
          // Section 5 de-nesting: inset hairline, tier 4 label, no
          // bordered/backgrounded box.
          <div
            key={group.id}
            className="border-t border-[var(--line-whisper)] pt-[var(--space-4)] first:border-t-0 first:pt-0"
          >
            <div className="flex flex-wrap items-start justify-between gap-[var(--space-4)]">
              <div>
                <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
                  {group.label}
                </p>
                <p className="mt-[var(--space-2)] max-w-3xl text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
                  {group.body}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenPicker?.(group.id)}
                className="cf-btn cf-btn--primary"
              >
                <Link2 size={14} />
                {group.addLabel}
              </button>
            </div>

            {group.links.length ? (
              <div className="mt-[var(--space-4)] grid gap-[var(--space-3)] md:grid-cols-2 xl:grid-cols-3">
                {group.links.map((link) => (
                  <RegistryAttachmentCard
                    key={link.id || link.creationId}
                    link={link}
                    onRemove={() => onRemoveRegistry?.(group.id, link)}
                    onNotesChange={(notes) =>
                      onChangeRegistryNotes?.(group.id, link, notes)
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="mt-[var(--space-4)] rounded-[var(--radius-md)] border border-dashed border-[var(--line-whisper)] p-[var(--space-4)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
                {group.emptyLabel}
              </p>
            )}
          </div>
        ))}
      </div>

      {pickerSlot}
    </div>
  );
}

// A card list item keeps its own border (repeatable list item, same
// allowance the mechanics-modules sibling card lists use); the header
// row loses its own inner border/background bar (a third bordered
// depth) and renders as ordinary flow content.
function RegistryAttachmentCard({ link, onRemove, onNotesChange }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)]">
      <div className="flex items-center gap-[var(--space-3)] p-[var(--space-3)]">
        {link.imageUrl ? (
          <div
            className="h-16 w-16 shrink-0 rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] bg-cover bg-center"
            style={{
              backgroundImage: `url(${link.imageUrl})`,
            }}
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
            Registry
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
            {link.title || "Attached Registry"}
          </p>
          <p className="mt-[var(--space-1)] text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
            {link.type || "Registry"}
          </p>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="cf-btn cf-btn--danger cf-btn--sm"
          aria-label="Remove attached registry"
        >
          <X size={14} />
          Remove
        </button>
      </div>

      <div className="border-t border-[var(--line-whisper)] p-[var(--space-4)]">
        {link.description ? (
          <p className="mb-[var(--space-3)] line-clamp-2 text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {link.description}
          </p>
        ) : null}

        <TextAreaField
          label="Attachment Notes"
          value={link.notes || ""}
          onChange={(value) => onNotesChange?.(value)}
          placeholder="Optional attachment notes..."
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />
      </div>
    </div>
  );
}
