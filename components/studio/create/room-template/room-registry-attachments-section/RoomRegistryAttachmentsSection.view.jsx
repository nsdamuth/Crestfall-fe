import { CircleAlert, Link2, RefreshCw, X } from "lucide-react";

export default function RoomRegistryAttachmentsSectionView({
  eyebrow = "Story Registries",
  title = "Registry Attachments",
  body =
    "Attach registries directly to this Story. Story registries take priority over inherited Location registries of the same kind.",
  groups = [],
  onOpenRegistryPicker = null,
  onRemoveRegistry = null,
  onChangeRegistryNotes = null,
} = {}) {
  const safeGroups = Array.isArray(groups) ? groups : [];

  return (
    <div>
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
          {eyebrow}
        </p>
        <h3 className="mt-2 font-display text-3xl">{title}</h3>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--ink-dim)]">
          {body}
        </p>
      </div>

      <div className="mt-6 grid gap-4">
        {safeGroups.map((group) => {
          const attachments = Array.isArray(group?.attachments)
            ? group.attachments
            : [];

          return (
            <div
              key={group?.id || group?.label}
              className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/30 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
                    {group?.label || "Registries"}
                  </p>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--ink-dim)]">
                    {group?.body || ""}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenRegistryPicker?.(group?.id)}
                  className="cf-btn cf-btn--primary"
                >
                  <Link2 size={14} />
                  {group?.addLabel || "Attach registry"}
                </button>
              </div>

              {attachments.length ? (
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {attachments.map((attachment) => (
                    <RegistryAttachmentCard
                      key={attachment?.id}
                      attachment={attachment}
                      onRemove={() =>
                        onRemoveRegistry?.(group?.id, attachment?.id)
                      }
                      onNotesChange={(notes) =>
                        onChangeRegistryNotes?.(
                          group?.id,
                          attachment?.id,
                          notes
                        )
                      }
                    />
                  ))}
                </div>
              ) : (
                <p className="mt-4 rounded-xl border border-dashed border-white/10 bg-black/25 p-4 text-sm text-[var(--ink-dim)]">
                  {group?.emptyLabel || "No registries attached."}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RegistryAttachmentCard({
  attachment = {},
  onRemove = null,
  onNotesChange = null,
} = {}) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-md)] border border-white/10 bg-black/35">
      <div className="flex items-center gap-3 border-b border-white/10 bg-black/25 p-3">
        {attachment?.imageUrl ? (
          <div
            className="h-16 w-16 shrink-0 rounded-xl border border-white/10 bg-black/45 bg-cover bg-center"
            style={{
              backgroundImage: `url(${attachment.imageUrl})`,
            }}
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/45 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-dim)]">
            Registry
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-xl">
            {attachment?.title || "Attached Registry"}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-dim)]">
            {attachment?.typeLabel || "Registry"}
          </p>

          {attachment?.hydrationSourceLabel ? (
            <span
              className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] ${
                attachment.hydrationSourceTone === "FALLBACK"
                  ? "border-amber-400/25 bg-amber-400/10 text-amber-100"
                  : "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"
              }`}
            >
              {attachment.hydrationSourceTone === "FALLBACK" ? (
                <CircleAlert size={11} />
              ) : (
                <RefreshCw size={11} />
              )}
              {attachment.hydrationSourceLabel}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => onRemove?.()}
          className="cf-btn cf-btn--danger cf-btn--sm"
          aria-label={
            attachment?.removeAriaLabel || "Remove attached registry"
          }
        >
          <X size={14} />
          <span className="text-xs">Remove</span>
        </button>
      </div>

      <div className="p-4">
        {attachment?.hydrationSourceTone === "FALLBACK" &&
        attachment?.hydrationMessage ? (
          <p
            className="mb-3 rounded-[var(--radius-md)] border border-amber-400/25 bg-amber-400/10 px-3 py-2 text-xs leading-5 text-amber-100"
            role="status"
          >
            {attachment.hydrationMessage}
          </p>
        ) : null}

        {attachment?.description ? (
          <p className="mb-3 line-clamp-2 text-xs leading-5 text-[var(--ink-dim)]">
            {attachment.description}
          </p>
        ) : null}

        <textarea
          rows={2}
          value={attachment?.notes || ""}
          onChange={(event) => onNotesChange?.(event.target.value)}
          placeholder="Optional attachment notes..."
          className="w-full resize-none rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-xs leading-5 text-[var(--ink)] outline-none transition hover:border-[var(--gold-ornament)]/35 focus:border-[var(--gold-ornament)]/45"
        />
      </div>
    </div>
  );
}
