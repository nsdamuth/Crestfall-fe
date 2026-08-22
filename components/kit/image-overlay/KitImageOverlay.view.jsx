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
import { useState, useRef } from "react";
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

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_DOUBLE_CLICK = 2;
const ZOOM_WHEEL_STEP = 0.35;

function clampZoomState(next, container) {
  const scale = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, next.scale));
  if (scale <= ZOOM_MIN || !container) {
    return { scale, x: 0, y: 0 };
  }
  const maxOffsetX = (container.clientWidth * (scale - 1)) / 2;
  const maxOffsetY = (container.clientHeight * (scale - 1)) / 2;
  return {
    scale,
    x: Math.min(maxOffsetX, Math.max(-maxOffsetX, next.x)),
    y: Math.min(maxOffsetY, Math.max(-maxOffsetY, next.y)),
  };
}

function pointerDistance(pointers) {
  const [a, b] = pointers;
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

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
      {/* Honest stub, CR-055 (filed by this build, ED1F propagation
          plan section B item 9): no backend operation exists yet, so
          the action renders disabled rather than pretending to work. */}
      <ViewerBarAction
        label="Reassign Asset"
        icon={<RefreshCw size={16} aria-hidden="true" />}
        disabled
        title="Reassign Asset is not wired yet (CR-055)"
      />
      <ViewerBarAction
        label="Share"
        icon={<Share2 size={16} aria-hidden="true" />}
        onClick={onShare}
      />
    </div>
  );
}

// B5 danger-confirm recipe, CR-054 placeholder copy: the recovery
// window is not yet ruled to a single number, so the copy carries the
// literal "[X] days" placeholder rather than a guessed figure.
function DeleteConfirm({ onKeepImage = null, onConfirmDelete = null }) {
  return (
    <div className="pointer-events-auto w-full max-w-[26rem] self-stretch rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--panel-glass)] p-[var(--space-6)] backdrop-blur-[var(--blur-panel)]">
      <h2 className="font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
        Delete this image?
      </h2>
      <p className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
        It moves to a recovery window for [X] days before it is gone for
        good.
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

// The gold hairline frame: wraps the image ALONE (or the no-image
// stand-in box), snapped to its rendered edges, never around empty
// space. Also the zoom/pan viewport and pan-clamp measurement
// container, since it clips to the same box it hugs.
function ImageFrame({ imageSrc, title, zoomDisabled }) {
  const containerRef = useRef(null);
  const pointersRef = useRef(new Map());
  const pinchStartRef = useRef(null);
  const dragStartRef = useRef(null);
  const [zoom, setZoom] = useState({ scale: 1, x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);

  const isZoomed = zoom.scale > ZOOM_MIN;

  function updateZoom(updater) {
    setZoom((current) => clampZoomState(updater(current), containerRef.current));
  }

  function zoomAt(clientX, clientY, nextScale) {
    const container = containerRef.current;
    if (!container) {
      updateZoom((current) => ({ ...current, scale: nextScale }));
      return;
    }
    const rect = container.getBoundingClientRect();
    const originX = clientX - rect.left - rect.width / 2;
    const originY = clientY - rect.top - rect.height / 2;
    updateZoom((current) => {
      const clampedScale = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, nextScale));
      const ratio = clampedScale / current.scale;
      return {
        scale: clampedScale,
        x: current.x * ratio - originX * (ratio - 1),
        y: current.y * ratio - originY * (ratio - 1),
      };
    });
  }

  function handleWheel(event) {
    if (zoomDisabled) return;
    event.preventDefault();
    const direction = event.deltaY > 0 ? -1 : 1;
    zoomAt(event.clientX, event.clientY, zoom.scale + direction * ZOOM_WHEEL_STEP);
  }

  function handleDoubleClick(event) {
    if (zoomDisabled) return;
    if (zoom.scale > ZOOM_MIN) {
      updateZoom(() => ({ scale: ZOOM_MIN, x: 0, y: 0 }));
    } else {
      zoomAt(event.clientX, event.clientY, ZOOM_DOUBLE_CLICK);
    }
  }

  function handlePointerDown(event) {
    if (zoomDisabled) return;
    pointersRef.current.set(event.pointerId, event);
    event.currentTarget.setPointerCapture(event.pointerId);

    if (pointersRef.current.size === 2) {
      pinchStartRef.current = {
        distance: pointerDistance([...pointersRef.current.values()]),
        scale: zoom.scale,
      };
      dragStartRef.current = null;
      setIsInteracting(true);
    } else if (pointersRef.current.size === 1 && zoom.scale > ZOOM_MIN) {
      dragStartRef.current = { clientX: event.clientX, clientY: event.clientY, origin: zoom };
      setIsInteracting(true);
    }
  }

  function handlePointerMove(event) {
    if (zoomDisabled || !pointersRef.current.has(event.pointerId)) return;
    pointersRef.current.set(event.pointerId, event);

    if (pointersRef.current.size === 2 && pinchStartRef.current) {
      const distance = pointerDistance([...pointersRef.current.values()]);
      const nextScale =
        pinchStartRef.current.scale * (distance / pinchStartRef.current.distance);
      const [a, b] = [...pointersRef.current.values()];
      zoomAt((a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2, nextScale);
      return;
    }

    if (dragStartRef.current) {
      const dx = event.clientX - dragStartRef.current.clientX;
      const dy = event.clientY - dragStartRef.current.clientY;
      updateZoom((current) => ({
        scale: current.scale,
        x: dragStartRef.current.origin.x + dx,
        y: dragStartRef.current.origin.y + dy,
      }));
    }
  }

  function handlePointerUp(event) {
    pointersRef.current.delete(event.pointerId);
    if (pointersRef.current.size < 2) pinchStartRef.current = null;
    if (pointersRef.current.size === 0) {
      dragStartRef.current = null;
      setIsInteracting(false);
    }
  }

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: isZoomed ? "none" : "auto" }}
      className={`pointer-events-auto relative flex min-h-0 max-h-full min-w-0 max-w-full items-center justify-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--gold-ornament)] ${
        isZoomed ? "cursor-grabbing" : !zoomDisabled ? "cursor-grab" : ""
      }`}
    >
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={title || "Image"}
          draggable={false}
          // The hairline shrink-wraps to whatever size the image
          // renders at (never a bigger box with the image floating
          // inside it, per R2); the max-height reservation under
          // 700px accounts for the shelf's own height (control-md
          // plus its space-3 padding and 1px top/bottom border), the
          // space-3 gap above it, AND the hairline frame's own 1px
          // top/bottom border (the 4px term: 2px shelf border plus
          // 2px frame border; at 2px, tall images clipped 1px at the
          // top and bottom edge, R2 review-gate find), so the image
          // still uses the maximum remaining space per R5 without
          // ever overflowing into, or leaving a gap in front of, the
          // shelf.
          className="block h-auto max-h-[calc(100dvh-var(--control-md)-var(--space-3)*3-4px)] w-auto max-w-full select-none min-[700px]:max-h-[78dvh] min-[700px]:max-w-[min(88vw,76rem)]"
          style={{
            transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.scale})`,
            transition: isInteracting ? "none" : "transform 120ms var(--ease, ease-out)",
          }}
        />
      ) : (
        <div className="flex aspect-[5/3] w-[min(88vw,40rem)] flex-col items-center justify-center gap-[var(--space-2)] bg-[var(--surface-1)]">
          <svg viewBox="0 0 64 64" aria-hidden="true" className="h-[var(--space-14)] w-[var(--space-14)] text-[var(--ink-faint)]">
            <use href="/assets/icons/icons-v7.svg#i-59" />
          </svg>
          <span className="text-[length:var(--text-label)] text-[var(--ink-faint)]">No image</span>
        </div>
      )}
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
  // precedent as the zoom state above: no product data, reset by
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
