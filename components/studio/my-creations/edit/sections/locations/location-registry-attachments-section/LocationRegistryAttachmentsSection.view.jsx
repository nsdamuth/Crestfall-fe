import { Link2, X } from "lucide-react";

import { SectionTitle } from "@/components/studio/my-creations/edit/sections/SharedFields";

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

      <div className="mt-6 grid gap-4">
        {groups.map((group) => (
          <div
            key={group.id}
            className="rounded-2xl border border-[var(--gold-ornament)]/20 bg-black/30 p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
                  {group.label}
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--ink-dim)]">
                  {group.body}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenPicker?.(group.id)}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20 hover:text-[var(--ink)]"
              >
                <Link2 size={14} />
                {group.addLabel}
              </button>
            </div>

            {group.links.length ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
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
              <p className="mt-4 rounded-xl border border-dashed border-white/10 bg-black/25 p-4 text-sm text-[var(--ink-dim)]">
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

function RegistryAttachmentCard({ link, onRemove, onNotesChange }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/35">
      <div className="flex items-center gap-3 border-b border-white/10 bg-black/25 p-3">
        {link.imageUrl ? (
          <div
            className="h-16 w-16 shrink-0 rounded-xl border border-white/10 bg-black/45 bg-cover bg-center"
            style={{
              backgroundImage: `url(${link.imageUrl})`,
            }}
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/45 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-dim)]">
            Registry
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-xl">
            {link.title || "Attached Registry"}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-dim)]">
            {link.type || "Registry"}
          </p>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-white/10 px-3 py-2 text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--status-danger)] transition hover:bg-white/5"
          aria-label="Remove attached registry"
        >
          <X size={14} />
          Remove
        </button>
      </div>

      <div className="p-4">
        {link.description ? (
          <p className="mb-3 line-clamp-2 text-xs leading-5 text-[var(--ink-dim)]">
            {link.description}
          </p>
        ) : null}

        <textarea
          rows={2}
          value={link.notes || ""}
          onChange={(event) => onNotesChange?.(event.target.value)}
          placeholder="Optional attachment notes..."
          className="w-full resize-none rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-xs leading-5 text-[var(--ink)] outline-none transition hover:border-[var(--gold-ornament)]/35 focus:border-[var(--gold-ornament)]/45"
        />
      </div>
    </div>
  );
}
