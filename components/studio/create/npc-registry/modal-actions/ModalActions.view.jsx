export default function ModalActionsView({
  onClose = null,
  onSave = null,
  saveLabel = "",
}) {
  return (
    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={() => onClose?.()}
        className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--ink-dim)]"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={() => onSave?.()}
        className="rounded-xl border border-[var(--gold-ornament)]/45 bg-[var(--gold-ornament)]/15 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)]"
      >
        {saveLabel}
      </button>
    </div>
  );
}
