import { Braces, LibraryBig } from "lucide-react";

function ToolButton({ children, icon: Icon, title, onClick, variant = "primary" }) {
  return (
    <button
      type="button"
      title={title}
      onClick={() => onClick?.()}
      className={`cf-btn cf-btn--sm ${variant === "secondary" ? "cf-btn--secondary" : "cf-btn--primary"}`}
    >
      <Icon size={14} />
      {children}
    </button>
  );
}

export default function StructuredRegistryDocumentToolsControlsView({
  enabled = false,
  sampleButtonTitle = "Open the educational registry sample library",
  jsonButtonTitle = "Open the complete registry JSON editor",
  onOpenSampleLibrary = null,
  onOpenJsonEditor = null,
}) {
  if (!enabled) return null;

  return (
    <>
      <ToolButton
        icon={LibraryBig}
        title={sampleButtonTitle}
        onClick={onOpenSampleLibrary}
      >
        Sample library
      </ToolButton>
      <ToolButton
        icon={Braces}
        title={jsonButtonTitle}
        onClick={onOpenJsonEditor}
        variant="secondary"
      >
        JSON editor
      </ToolButton>
    </>
  );
}
