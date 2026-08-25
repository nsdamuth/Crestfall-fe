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
        className="cf-btn cf-btn--secondary"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={() => onSave?.()}
        className="cf-btn cf-btn--primary"
      >
        {saveLabel}
      </button>
    </div>
  );
}
