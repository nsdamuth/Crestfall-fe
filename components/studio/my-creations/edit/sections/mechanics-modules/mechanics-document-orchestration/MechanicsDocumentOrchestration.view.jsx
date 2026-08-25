import { Braces, LibraryBig } from "lucide-react";

function OrchestrationActionButton({
  children,
  icon: Icon,
  title,
  disabled,
  onClick,
  variant = "primary",
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={() => onClick?.()}
      className={`cf-btn cf-btn--sm ${variant === "secondary" ? "cf-btn--secondary" : "cf-btn--primary"}`}
    >
      <Icon size={14} />
      {children}
    </button>
  );
}

export default function MechanicsDocumentOrchestrationControlsView({
  canReplaceData = false,
  presetButtonTitle = "Open the validated Mechanics preset library",
  jsonButtonTitle = "Open the complete Mechanics Module JSON editor",
  onOpenPresetLibrary = null,
  onOpenJsonEditor = null,
}) {
  return (
    <>
      <OrchestrationActionButton
        icon={LibraryBig}
        title={presetButtonTitle}
        disabled={!canReplaceData}
        onClick={onOpenPresetLibrary}
      >
        Preset library
      </OrchestrationActionButton>

      <OrchestrationActionButton
        icon={Braces}
        title={jsonButtonTitle}
        disabled={!canReplaceData}
        onClick={onOpenJsonEditor}
        variant="secondary"
      >
        JSON editor
      </OrchestrationActionButton>
    </>
  );
}
