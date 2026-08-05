import { Braces, LibraryBig } from "lucide-react";

function OrchestrationActionButton({
  children,
  icon: Icon,
  title,
  disabled,
  onClick,
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={() => onClick?.()}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20 hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-50"
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
        Preset Library
      </OrchestrationActionButton>

      <OrchestrationActionButton
        icon={Braces}
        title={jsonButtonTitle}
        disabled={!canReplaceData}
        onClick={onOpenJsonEditor}
      >
        JSON Editor
      </OrchestrationActionButton>
    </>
  );
}
