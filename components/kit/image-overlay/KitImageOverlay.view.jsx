"use client";

// B7 viewer final (22 Aug 2026, Fable law review, ED1F propagation
// plan group G3), superseding the R2/R5 recomposition
// (docs/BUILD-BLUEPRINT.md 2.16 (r)). The frame (rendered by the
// KitImageOverlay shell) owns the close control; this view owns the
// shrink-wrapped figure column (gold hairline hugging the image
// alone, never around empty space), the two-line glass header above
// it (centered title, six-icon row), and the gold-ink bottom bar
// beneath it, all width-synced to the image by construction. Title
// now renders visibly, resolving OPEN FOR BRIAN item 11; it still
// travels through the frame's ariaLabel as the accessible name.
import { useState } from "react";
import {
  Bookmark,
  Download,
  Flag,
  Heart,
  Info,
  RefreshCw,
  Share2,
  Sparkles,
  Trash2,
} from "lucide-react";

// The hairline frame with zoom and pan lives in ./ImageFrame.jsx
// since FE/MEDIA-STUDIO session 3 (10 Sep 2026), shared with the live
// image viewer. Same code, same recipe, no contract change here.
import { ImageFrame } from "./ImageFrame";

// Quiet-ink icon button, the header's six-icon row (B7).
function OverlayActionButton({ label, active = false, disabled = false, onClick = null, children }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={() => onClick?.()}
      className={`flex h-[var(--control-md)] w-[var(--control-md)] items-center justify-center rounded-[var(--radius-full)] border transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "border-[var(--line-whisper)] bg-[var(--fill)] text-[var(--gold-bright)]"
          : "border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] hover:border-[var(--gold-ornament)] hover:text-[var(--ink)] active:bg-[var(--state-pressed-fill)]"
      }`}
    >
      {children}
    </button>
  );
}

// B7: two-line glass header, --panel-glass paired with --blur-panel
// (2px), title centered on line one, the six-icon row (delete,
// report, details, download, bookmark, like) in quiet ink on line
// two. self-stretch inside the centered figure column so it
// width-matches the hairline frame, same construction the old shelf
// used.
function ViewerHeader({
  title,
  isLoved,
  isSaved,
  onLove,
  onSave,
  onDeleteRequest,
  onReport,
  onDetails,
  onDownload,
}) {
  return (
    <div className="pointer-events-auto flex w-full flex-col gap-[var(--space-2)] self-stretch rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--panel-glass)] px-[var(--space-4)] py-[var(--space-3)] backdrop-blur-[var(--blur-panel)]">
      <h2 className="line-clamp-1 text-center font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
        {title || "Untitled"}
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-[var(--space-2)]">
        <OverlayActionButton label="Delete" onClick={onDeleteRequest}>
          <Trash2 size={17} aria-hidden="true" />
        </OverlayActionButton>
        <OverlayActionButton label="Report" onClick={onReport}>
          <Flag size={17} aria-hidden="true" />
        </OverlayActionButton>
        <OverlayActionButton label="Details" onClick={onDetails}>
          <Info size={17} aria-hidden="true" />
        </OverlayActionButton>
        <OverlayActionButton label="Download" onClick={onDownload}>
          <Download size={17} aria-hidden="true" />
        </OverlayActionButton>
        <OverlayActionButton label="Bookmark" active={isSaved} onClick={onSave}>
          <Bookmark size={17} fill={isSaved ? "currentColor" : "none"} aria-hidden="true" />
        </OverlayActionButton>
        <OverlayActionButton label="Like" active={isLoved} onClick={onLove}>
          <Heart size={17} fill={isLoved ? "currentColor" : "none"} aria-hidden="true" />
        </OverlayActionButton>
      </div>
    </div>
  );
}

// B7: gold-ink bottom bar, Generate Variant / Reassign Asset / Share,
// --gold-action ink with --gold-bright hover, width-matched to the
// header (same self-stretch construction).
function ViewerBarAction({ label, icon, onClick = null, disabled = false, title }) {
  return (
    <button
      type="button"
      onClick={() => onClick?.()}
      disabled={disabled}
      title={title || label}
      className="inline-flex min-h-[var(--control-md)] items-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-3)] text-[length:var(--text-ui)] text-[var(--gold-action)] transition-colors disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:text-[var(--gold-bright)]"
    >
      {icon}
      {label}
    </button>
  );
}

function ViewerBottomBar({ onGenerateVariant, onReassignAsset, onShare }) {
  return (
    <div className="pointer-events-auto flex w-full items-center justify-center gap-[var(--space-2)] self-stretch rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--panel-glass)] px-[var(--space-2)] py-[var(--space-1)] backdrop-blur-[var(--blur-panel)]">
      <ViewerBarAction
        label="Generate Variant"
        icon={<Sparkles size={16} aria-hidden="true" />}
        onClick={onGenerateVariant}
      />
      <ViewerBarAction
        label="Reassign Asset"
        icon={<RefreshCw size={16} aria-hidden="true" />}
        onClick={onReassignAsset}
        disabled={!onReassignAsset}
        title={onReassignAsset ? "Reassign Asset" : "This image cannot be reassigned"}
      />
      <ViewerBarAction
        label="Share"
        icon={<Share2 size={16} aria-hidden="true" />}
        onClick={onShare}
      />
    </div>
  );
}

// B5 danger-confirm recipe. Current runtime deletion is permanent;
// CR-054 recovery-window behavior remains a separate unresolved product rule.
function DeleteConfirm({ onKeepImage = null, onConfirmDelete = null }) {
  return (
    <div className="pointer-events-auto w-full max-w-[26rem] self-stretch rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--panel-glass)] p-[var(--space-6)] backdrop-blur-[var(--blur-panel)]">
      <h2 className="font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
        Delete this image?
      </h2>
      <p className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
        This permanently removes the image from Image Studio and any connected
        creation libraries or featured slots. This action cannot be undone.
      </p>
      <div aria-hidden="true" className="my-[var(--space-5)] h-px bg-[image:var(--line-fade)]" />
      <div className="flex items-center justify-between gap-[var(--space-3)]">
        <button
          type="button"
          onClick={() => onKeepImage?.()}
          className="cf-btn cf-btn--secondary"
        >
          Keep image
        </button>
        <button
          type="button"
          onClick={() => onConfirmDelete?.()}
          className="cf-btn cf-btn--danger-filled"
        >
          Delete
        </button>
      </div>
    </div>
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
  onDelete = null,
  onReport = null,
  onDetails = null,
  onDownload = null,
  onGenerateVariant = null,
  onReassignAsset = null,
}) {
  // Delete-confirm gating is presentation-only local state, the same
  // precedent as the frame's zoom state: no product data, reset by
  // construction whenever the overlay unmounts on close.
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  return (
    // pointer-events-none continues the frame's click-transparent
    // viewer panel (R3): only the header, image frame, bottom bar,
    // and delete-confirm panel re-enable their own pointer events, so
    // a click anywhere else falls through to the veil and dismisses.
    // w-fit at every width (R5, 10 Aug 2026 review gate): the column
    // shrink-wraps the image on mobile too, so the header and bottom
    // bar snap to the image's own width by construction instead of
    // spanning the viewport past a narrow image.
    <div className="pointer-events-none flex h-full max-h-full w-fit max-w-full min-h-0 flex-col items-center justify-center gap-[var(--space-3)] px-[var(--space-2)] min-[700px]:h-auto min-[700px]:max-h-full min-[700px]:px-0">
      {isConfirmingDelete ? (
        <DeleteConfirm
          onKeepImage={() => setIsConfirmingDelete(false)}
          onConfirmDelete={() => {
            setIsConfirmingDelete(false);
            onDelete?.();
          }}
        />
      ) : (
        <>
          <ViewerHeader
            title={title}
            isLoved={isLoved}
            isSaved={isSaved}
            onLove={onLove}
            onSave={onSave}
            onDeleteRequest={() => setIsConfirmingDelete(true)}
            onReport={onReport}
            onDetails={onDetails}
            onDownload={onDownload}
          />

          <ImageFrame imageSrc={imageSrc} title={title} zoomDisabled={!imageSrc} />

          <ViewerBottomBar
            onGenerateVariant={onGenerateVariant}
            onReassignAsset={onReassignAsset}
            onShare={onShare}
          />
        </>
      )}
    </div>
  );
}
