"use client";

// Recomposed onto the modal frame's viewer variant (R2/R5, 10 Aug
// 2026, kit polish 3 pass, docs/BUILD-BLUEPRINT.md 2.16 (r)). The
// frame (rendered by the KitImageOverlay shell) owns the chrome-frost
// veil and the close control; this view owns the shrink-wrapped
// figure column (gold hairline hugging the image alone, never around
// empty space) and the Love/Save/Share action shelf beneath it,
// width-synced to the image by construction. No visible title line;
// the accessible name travels through the frame's ariaLabel instead.
import { useRef, useState } from "react";
import { Bookmark, Heart, Share2 } from "lucide-react";

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
}) {
  return (
    // pointer-events-none continues the frame's click-transparent
    // viewer panel (R3): only the image frame and the shelf re-enable
    // their own pointer events, so a click anywhere else falls
    // through to the veil and dismisses. w-fit at every width (R5,
    // 10 Aug 2026 review gate): the column shrink-wraps the image on
    // mobile too, so the shelf snaps to the image's own width by
    // construction instead of spanning the viewport past a narrow
    // image.
    <div className="pointer-events-none flex h-full max-h-full w-fit max-w-full min-h-0 flex-col items-center justify-center gap-[var(--space-3)] px-[var(--space-2)] min-[700px]:h-auto min-[700px]:max-h-full min-[700px]:px-0">
      <ImageFrame imageSrc={imageSrc} title={title} zoomDisabled={!imageSrc} />

      {/* R1 (10 Aug 2026, Brian's ruling): the shelf sits darker and
          slightly translucent so focus stays on the image, reusing
          the sticky-chrome recipe's exact composition (the canvas
          88 percent mix) on the existing surface tokens; no new
          value is minted. */}
      <div className="pointer-events-auto flex flex-none items-center justify-center gap-[var(--space-3)] self-stretch rounded-[var(--radius-md)] border border-[var(--line)] bg-[color-mix(in_srgb,var(--canvas)_88%,transparent)] p-[var(--space-3)]">
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
