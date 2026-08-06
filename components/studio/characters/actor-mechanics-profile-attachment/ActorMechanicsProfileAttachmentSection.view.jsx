import { Activity, Link2, ShieldCheck, X } from "lucide-react";

export default function ActorMechanicsProfileAttachmentSectionView({
  eyebrow = "Actor Mechanics",
  title = "Actor Mechanics Profile",
  body =
    "Attach one reusable Actor Mechanics Profile to this actor. The profile defines which mechanics domains belong to the actor while mutable state remains isolated to this actor.",
  addLabel = "Attach actor mechanics profile",
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
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
            {eyebrow}
          </p>
          <h3 className="mt-2 font-display text-3xl">{title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--ink-dim)]">
            {body}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenPicker?.()}
          disabled={disabled}
          className="cf-btn cf-btn--secondary"
        >
          <Link2 size={14} />
          {attachment ? "Replace profile" : addLabel}
        </button>
      </div>

      {errorMessage ? (
        <p className="mt-4 rounded-xl border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-4 py-3 text-sm text-[var(--status-danger)]">
          {errorMessage}
        </p>
      ) : null}

      {warningMessage ? (
        <p className="mt-4 rounded-xl border border-[var(--status-warning-border)] bg-[var(--status-warning-bed)] px-4 py-3 text-sm text-[var(--status-warning)]">
          {warningMessage}
        </p>
      ) : null}

      <div className="mt-5 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-2)] p-5">
        <div className="flex items-start gap-3 rounded-xl border border-[var(--line-whisper)] bg-[var(--surface-1)] p-4">
          <ShieldCheck
            size={18}
            className="mt-0.5 shrink-0 text-[var(--gold-ornament)]"
          />
          <p className="text-sm leading-6 text-[var(--ink-dim)]">
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
          <p className="mt-4 rounded-xl border border-dashed border-[var(--line-whisper)] bg-[var(--surface-1)] p-4 text-sm text-[var(--ink-dim)]">
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
    <article className="mt-4 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-2)]">
      <div className="flex flex-wrap items-center gap-3 border-b border-[var(--line)] bg-[var(--surface-1)] p-4">
        {attachment.imageUrl ? (
          <div
            className="h-16 w-16 shrink-0 rounded-xl border border-[var(--line)] bg-black/45 bg-cover bg-center"
            style={{ backgroundImage: `url(${attachment.imageUrl})` }}
            role="img"
            aria-label={`${attachment.title || "Actor Mechanics Profile"} cover`}
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-[var(--line)] bg-black/45 text-[var(--gold-ornament)]">
            <Activity size={22} />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-2xl">
            {attachment.title || "Attached Actor Mechanics Profile"}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex h-6 items-center rounded-full bg-[var(--tag-bed-canvas)] px-3 text-[length:var(--text-label)] font-medium uppercase leading-4 tracking-[var(--track-label)] text-[var(--ink-dim)]">
              {attachment.presetLabel || "Custom"}
            </span>
            <span className="inline-flex h-6 items-center rounded-full bg-[var(--tag-bed-canvas)] px-3 text-[length:var(--text-label)] font-medium uppercase leading-4 tracking-[var(--track-label)] text-[var(--ink-dim)]">
              {attachment.ownerLabel || "Actor template"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRemove?.()}
          disabled={disabled}
          className="cf-btn cf-btn--danger cf-btn--sm"
          aria-label={
            attachment.removeAriaLabel ||
            "Remove attached Actor Mechanics Profile"
          }
        >
          <X size={14} />
          Remove
        </button>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[1fr_0.9fr]">
        <div>
          {attachment.description ? (
            <p className="text-sm leading-6 text-[var(--ink-dim)]">
              {attachment.description}
            </p>
          ) : (
            <p className="text-sm leading-6 text-[var(--ink-dim)]">
              No profile description has been added.
            </p>
          )}

          <div className="mt-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--gold-ornament)]">
              Enabled Domains
            </p>
            {domains.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {domains.map((domain) => (
                  <span
                    key={domain}
                    className="inline-flex h-6 items-center rounded-full bg-[var(--tag-bed-canvas)] px-3 text-[length:var(--text-label)] font-medium uppercase leading-4 tracking-[var(--track-label)] text-[var(--ink-dim)]"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs text-[var(--ink-dim)]">
                No mechanics domains are enabled.
              </p>
            )}
          </div>
        </div>

        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--gold-ornament)]">
            Actor Attachment Notes
          </span>
          <textarea
            rows={5}
            value={attachment.notes || ""}
            onChange={(event) => onNotesChange?.(event.target.value)}
            disabled={disabled}
            placeholder="Optional notes about how this actor uses the profile..."
            className="mt-2 w-full resize-none rounded-xl border border-[var(--line)] bg-black/45 px-3 py-2 text-xs leading-5 text-[var(--ink)] outline-none transition hover:border-[var(--gold-ornament)]/35 focus:border-[var(--gold-ornament)]/45 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>
      </div>
    </article>
  );
}
