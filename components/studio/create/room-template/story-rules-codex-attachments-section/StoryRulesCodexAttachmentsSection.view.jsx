import { BookOpen, Link2, X } from "lucide-react";

export default function StoryRulesCodexAttachmentsSectionView({
  eyebrow = "Story Rules",
  title = "Rules Codex Attachments",
  body =
    "Attach Rules Codices that define how this Story interprets mechanics, thresholds, special cases, and world-specific rules.",
  addLabel = "Attach Rules Codex",
  emptyLabel = "No Rules Codices attached.",
  runtimeNote =
    "This relationship establishes Story scope only. Runtime section selection and prompt composition are activated separately.",
  attachments = [],
  onOpenPicker = null,
  onRemoveAttachment = null,
  onChangeAttachmentNotes = null,
} = {}) {
  const safeAttachments = Array.isArray(attachments) ? attachments : [];

  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
            {eyebrow}
          </p>
          <h3 className="mt-2 font-display text-3xl">{title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--muted)]">
            {body}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenPicker?.()}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
        >
          <Link2 size={14} />
          {addLabel}
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-[var(--muted-gold)]/20 bg-black/30 p-5">
        <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/25 p-4">
          <BookOpen
            size={18}
            className="mt-0.5 shrink-0 text-[var(--muted-gold)]"
          />
          <p className="text-sm leading-6 text-[var(--muted)]">
            {runtimeNote}
          </p>
        </div>

        {safeAttachments.length ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {safeAttachments.map((attachment) => (
              <RulesCodexAttachmentCard
                key={attachment?.id}
                attachment={attachment}
                onRemove={() =>
                  onRemoveAttachment?.(attachment?.id)
                }
                onNotesChange={(notes) =>
                  onChangeAttachmentNotes?.(attachment?.id, notes)
                }
              />
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-dashed border-white/10 bg-black/25 p-4 text-sm text-[var(--muted)]">
            {emptyLabel}
          </p>
        )}
      </div>
    </section>
  );
}

function RulesCodexAttachmentCard({
  attachment = {},
  onRemove = null,
  onNotesChange = null,
} = {}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-black/35">
      <div className="flex items-center gap-3 border-b border-white/10 bg-black/25 p-3">
        {attachment?.imageUrl ? (
          <div
            className="h-16 w-16 shrink-0 rounded-xl border border-white/10 bg-black/45 bg-cover bg-center"
            style={{ backgroundImage: `url(${attachment.imageUrl})` }}
            role="img"
            aria-label={`${attachment?.title || "Rules Codex"} cover`}
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/45 text-[var(--muted-gold)]">
            <BookOpen size={22} />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-xl">
            {attachment?.title || "Attached Rules Codex"}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
            {attachment?.typeLabel || "Rules Codex"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onRemove?.()}
          className="rounded-lg border border-white/10 p-2 text-[var(--muted)] transition hover:border-red-400/40 hover:text-red-200"
          aria-label={
            attachment?.removeAriaLabel || "Remove attached Rules Codex"
          }
        >
          <X size={14} />
        </button>
      </div>

      <div className="p-4">
        {attachment?.description ? (
          <p className="mb-3 line-clamp-2 text-xs leading-5 text-[var(--muted)]">
            {attachment.description}
          </p>
        ) : null}

        <textarea
          rows={2}
          value={attachment?.notes || ""}
          onChange={(event) => onNotesChange?.(event.target.value)}
          placeholder="Optional Story-scope notes..."
          className="w-full resize-none rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-xs leading-5 text-[var(--foreground)] outline-none transition hover:border-[var(--muted-gold)]/35 focus:border-[var(--muted-gold)]/45"
        />
      </div>
    </article>
  );
}
