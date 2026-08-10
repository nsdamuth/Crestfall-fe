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
      className={`kit-focus flex h-[var(--control-md)] w-[var(--control-md)] items-center justify-center rounded-[var(--radius-full)] border transition-colors ${
        active
          ? "border-[var(--line-whisper)] bg-[var(--fill)] text-[var(--gold-bright)]"
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
        className="kit-focus absolute right-[var(--space-3)] top-[var(--space-3)] flex h-[var(--control-md)] w-[var(--control-md)] items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition-colors hover:text-[var(--ink)]"
      >
        <X size={18} />
      </button>

      {/* Art-anchor law, RULED 9 Aug 2026, REVISED 9 Aug 2026 (kit
          polish 2 pass): the frame centers rather than hard-anchors
          to the top. This overlay renders the full image uncropped
          (object-contain) and the frame shrink-wraps to it, so there
          is rarely any letterboxed space for a percentage anchor to
          bias into; the numeric 18%-down anchor applies where images
          are actually cropped (card grid/list art, creator
          thumbnails, below). Center is the safe default for the rare
          case a wider-than-tall image does leave vertical room. */}
      <div className="flex max-h-[70vh] w-full items-center justify-center overflow-hidden rounded-[var(--radius-md)]">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageSrc} alt={title} className="max-h-[70vh] w-auto object-contain" />
        ) : (
          <div className="flex h-[40vh] w-full flex-col items-center justify-center gap-[var(--space-2)] bg-[var(--surface-1)]">
            <svg viewBox="0 0 64 64" aria-hidden="true" className="h-[var(--space-14)] w-[var(--space-14)] text-[var(--ink-faint)]">
              <use href="/assets/icons/icons-v7.svg#i-59" />
            </svg>
            <span className="text-[length:var(--text-label)] text-[var(--ink-faint)]">No image</span>
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
          className="kit-focus inline-flex min-h-[var(--control-md)] items-center gap-[var(--space-1)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-4)] text-[length:var(--text-ui)] text-[var(--gold-action)] transition-colors hover:border-[var(--gold-ornament)]"
        >
          <Share2 size={16} aria-hidden="true" />
          Share
        </button>
      </div>
    </div>
  );
}
