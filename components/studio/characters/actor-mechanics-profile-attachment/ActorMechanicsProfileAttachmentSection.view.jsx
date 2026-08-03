import { Activity, Link2, ShieldCheck, X } from "lucide-react";

export default function ActorMechanicsProfileAttachmentSectionView({
  eyebrow = "Actor Mechanics",
  title = "Actor Mechanics Profile",
  body =
    "Attach one reusable Actor Mechanics Profile to this actor. The profile defines which mechanics domains belong to the actor while mutable state remains isolated to this actor.",
  addLabel = "Attach Actor Mechanics Profile",
  emptyLabel = "No Actor Mechanics Profile attached.",
  runtimeNote =
    "This step saves the actor-to-profile relationship only. Runtime hydration and activation are introduced separately.",
  attachment = null,
  errorMessage = "",
  warningMessage = "",
  disabled = false,
  onOpenPicker = null,
  onRemoveAttachment = null,
  onChangeAttachmentNotes = null,
} = {}) {
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
          disabled={disabled}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Link2 size={14} />
          {attachment ? "Replace Profile" : addLabel}
        </button>
      </div>

      {errorMessage ? (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </p>
      ) : null}

      {warningMessage ? (
        <p className="mt-4 rounded-xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          {warningMessage}
        </p>
      ) : null}

      <div className="mt-5 rounded-2xl border border-[var(--muted-gold)]/20 bg-black/30 p-5">
        <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/25 p-4">
          <ShieldCheck
            size={18}
            className="mt-0.5 shrink-0 text-[var(--muted-gold)]"
          />
          <p className="text-sm leading-6 text-[var(--muted)]">
            {runtimeNote}
          </p>
        </div>

        {attachment ? (
          <ActorMechanicsProfileAttachmentCard
            attachment={attachment}
            disabled={disabled}
            onRemove={() => onRemoveAttachment?.()}
            onNotesChange={(notes) => onChangeAttachmentNotes?.(notes)}
          />
        ) : (
          <p className="mt-4 rounded-xl border border-dashed border-white/10 bg-black/25 p-4 text-sm text-[var(--muted)]">
            {emptyLabel}
          </p>
        )}
      </div>
    </section>
  );
}

function ActorMechanicsProfileAttachmentCard({
  attachment = {},
  disabled = false,
  onRemove = null,
  onNotesChange = null,
} = {}) {
  const domains = Array.isArray(attachment.enabledDomainLabels)
    ? attachment.enabledDomainLabels
    : [];

  return (
    <article className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/35">
      <div className="flex flex-wrap items-center gap-3 border-b border-white/10 bg-black/25 p-4">
        {attachment.imageUrl ? (
          <div
            className="h-16 w-16 shrink-0 rounded-xl border border-white/10 bg-black/45 bg-cover bg-center"
            style={{ backgroundImage: `url(${attachment.imageUrl})` }}
            role="img"
            aria-label={`${attachment.title || "Actor Mechanics Profile"} cover`}
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/45 text-[var(--muted-gold)]">
            <Activity size={22} />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-2xl">
            {attachment.title || "Attached Actor Mechanics Profile"}
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.13em]">
            <span className="rounded-full border border-[var(--muted-gold)]/25 bg-[var(--muted-gold)]/10 px-2.5 py-1 text-[var(--muted-gold)]">
              {attachment.presetLabel || "Custom"}
            </span>
            <span className="rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[var(--muted)]">
              {attachment.ownerLabel || "Actor template"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRemove?.()}
          disabled={disabled}
          className="rounded-lg border border-white/10 p-2 text-[var(--muted)] transition hover:border-red-400/40 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={
            attachment.removeAriaLabel ||
            "Remove attached Actor Mechanics Profile"
          }
        >
          <X size={14} />
        </button>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[1fr_0.9fr]">
        <div>
          {attachment.description ? (
            <p className="text-sm leading-6 text-[var(--muted)]">
              {attachment.description}
            </p>
          ) : (
            <p className="text-sm leading-6 text-[var(--muted)]">
              No profile description has been added.
            </p>
          )}

          <div className="mt-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted-gold)]">
              Enabled Domains
            </p>
            {domains.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {domains.map((domain) => (
                  <span
                    key={domain}
                    className="rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs text-[var(--muted)]">
                No mechanics domains are enabled.
              </p>
            )}
          </div>
        </div>

        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted-gold)]">
            Actor Attachment Notes
          </span>
          <textarea
            rows={5}
            value={attachment.notes || ""}
            onChange={(event) => onNotesChange?.(event.target.value)}
            disabled={disabled}
            placeholder="Optional notes about how this actor uses the profile..."
            className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-xs leading-5 text-[var(--foreground)] outline-none transition hover:border-[var(--muted-gold)]/35 focus:border-[var(--muted-gold)]/45 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>
      </div>
    </article>
  );
}
