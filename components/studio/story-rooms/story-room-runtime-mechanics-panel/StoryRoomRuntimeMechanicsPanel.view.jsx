import { Activity, Plus, Trash2 } from "lucide-react";

export default function StoryRoomRuntimeMechanicsPanelView({
  eyebrow = "Room Runtime",
  title = "Mechanics Module",
  description = "",
  binding = null,
  attachActionLabel = "Attach Mechanics",
  saving = false,
  savingMessage = "Saving runtime mechanics...",
  statusMessage = "",
  errorMessage = "",
  pickerContent = null,
  onOpenPicker = null,
  onRemove = null,
  onToggleEnabled = null,
  onChangeScopeMode = null,
  onChangePriority = null,
}) {
  return (
    <div className="mt-6 min-w-0 overflow-hidden rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/30 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-xl border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 p-3 text-[var(--gold-ornament)]">
          <Activity size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
            {eyebrow}
          </p>

          <h3 className="mt-1 font-display text-2xl">{title}</h3>

          {description ? (
            <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {binding ? (
          <div className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-black/25 p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                  Attached
                </p>

                <p className="mt-1 text-sm text-[var(--ink)]">
                  {binding.title}
                </p>

                <p className="mt-1 break-all text-[11px] text-[var(--ink-dim)]">
                  {binding.creationId}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onRemove?.()}
                disabled={saving}
                className="flex w-full min-w-0 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-white/10 bg-black/40 px-3 py-2 text-[var(--status-danger)] outline-none transition focus:border-[var(--gold-ornament)] disabled:opacity-60"
                title="Remove room mechanics module"
              >
                <Trash2 size={14} />
                Remove
              </button>
            </div>

            <div className="mt-3 grid gap-3">
              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-xs text-[var(--ink-dim)]">
                <input
                  type="checkbox"
                  checked={binding.enabled}
                  disabled={saving}
                  onChange={(event) =>
                    onToggleEnabled?.(Boolean(event.target.checked))
                  }
                  className="h-4 w-4 accent-[var(--gold-ornament)] disabled:opacity-50"
                />
                <span>Enabled</span>
              </label>

              <label className="grid gap-2 text-xs text-[var(--ink-dim)]">
                <span>Mechanics Scope</span>
                <select
                  value={binding.scopeMode}
                  disabled={saving}
                  onChange={(event) =>
                    onChangeScopeMode?.(event.target.value)
                  }
                  className="w-full min-w-0 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-[var(--ink)] outline-none transition focus:border-[var(--gold-ornament)] disabled:opacity-60"
                >
                  <option value="STORY_ROOM">
                    STORY_ROOM — root room mechanics
                  </option>
                  <option value="BINDING_OWNER">
                    BINDING_OWNER — scoped to binding owner
                  </option>
                </select>
              </label>

              <label className="grid gap-2 text-xs text-[var(--ink-dim)]">
                <span>Priority</span>
                <input
                  type="number"
                  value={binding.priority}
                  disabled={saving}
                  onChange={(event) =>
                    onChangePriority?.(event.target.value)
                  }
                  className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-[var(--ink)] outline-none transition focus:border-[var(--gold-ornament)] disabled:opacity-60"
                />
              </label>
            </div>

            <div className="mt-3 min-w-0 break-words rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-[11px] leading-5 text-[var(--ink-dim)]">
              <p>
                Module ID:{" "}
                <span className="text-[var(--ink)]">
                  {binding.moduleId}
                </span>
              </p>
              <p>
                Trigger:{" "}
                <span className="text-[var(--ink)]">
                  {binding.trigger}
                </span>
              </p>
              <p>
                Scope:{" "}
                <span className="text-[var(--ink)]">
                  {binding.scopeMode}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-xs leading-5 text-[var(--ink-dim)]">
            No room-level Mechanics Module attached.
          </div>
        )}

        <button
          type="button"
          onClick={() => onOpenPicker?.()}
          disabled={saving}
          className="inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-xl border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 px-3 py-3 text-center text-[0.68rem] uppercase tracking-[0.12em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20 hover:text-[var(--ink)] disabled:cursor-wait disabled:opacity-60"
        >
          <Plus size={14} />
          {attachActionLabel}
        </button>

        {saving ? (
          <p className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-[var(--ink-dim)]">
            {savingMessage}
          </p>
        ) : null}

        {statusMessage ? (
          <p className="rounded-xl border border-emerald-300/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100">
            {statusMessage}
          </p>
        ) : null}

        {errorMessage ? (
          <p className="rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs leading-5 text-red-200">
            {errorMessage}
          </p>
        ) : null}
      </div>

      {pickerContent}
    </div>
  );
}
