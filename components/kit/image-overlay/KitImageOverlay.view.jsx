// INTERIM view. Converts to the unified modal frame (section 2.5) in
// batch 2; do not build further affordances onto this shape, extend
// the modal-frame version instead once it ships.
import { Bookmark, Heart, Share2, X } from "lucide-react";

function OverlayActionButton({ label, active = false, onClick = null, children }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={() => onClick?.()}
      className={`flex h-[var(--control-md)] w-[var(--control-md)] items-center justify-center rounded-[var(--radius-full)] border transition-colors ${
        active
          ? "border-[var(--gold-action)] bg-[var(--fill)] text-[var(--gold-bright)]"
          : "border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] hover:border-[var(--gold-ornament)] hover:text-[var(--ink)] active:bg-[var(--state-pressed-fill)]"
      }`}
    >
      {children}
    </button>
  );
}

export default function KitImageOverlayView({
  imageSrc = null,
  title = "",
  isLoved = false,
  isSaved = false,
  onLove = null,
  onSave = null,
  onShare = null,
  onClose = null,
}) {
  return (
    <div className="relative flex flex-col items-center gap-[var(--space-4)] rounded-[var(--radius-lg)] bg-[var(--scrim-strong)] p-[var(--space-6)]">
      <button
        type="button"
        onClick={() => onClose?.()}
        aria-label="Close"
        className="absolute right-[var(--space-3)] top-[var(--space-3)] flex h-[var(--control-md)] w-[var(--control-md)] items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition-colors hover:text-[var(--ink)]"
      >
        <X size={18} />
      </button>

      <div className="flex max-h-[70vh] w-full items-center justify-center overflow-hidden rounded-[var(--radius-md)]">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageSrc} alt={title} className="max-h-[70vh] w-auto object-contain" />
        ) : (
          <div className="flex h-[40vh] w-full items-center justify-center bg-[var(--surface-1)] text-[length:var(--text-label)] text-[var(--ink-faint)]">
            No image
          </div>
        )}
      </div>

      {title && (
        <p className="text-center font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--art-ink)]">
          {title}
        </p>
      )}

      <div className="flex items-center gap-[var(--space-3)]">
        <OverlayActionButton label="Love" active={isLoved} onClick={onLove}>
          <Heart size={18} fill={isLoved ? "currentColor" : "none"} />
        </OverlayActionButton>
        <OverlayActionButton label="Save" active={isSaved} onClick={onSave}>
          <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
        </OverlayActionButton>
        <button
          type="button"
          onClick={() => onShare?.()}
          className="inline-flex min-h-[var(--control-md)] items-center gap-[var(--space-1)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-4)] text-[length:var(--text-ui)] text-[var(--gold-action)] transition-colors hover:border-[var(--gold-ornament)]"
        >
          <Share2 size={16} aria-hidden="true" />
          Share
        </button>
      </div>
    </div>
  );
}
