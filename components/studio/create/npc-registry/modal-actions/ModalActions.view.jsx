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
        className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)]"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={() => onSave?.()}
        className="rounded-xl border border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/15 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]"
      >
        {saveLabel}
      </button>
    </div>
  );
}
