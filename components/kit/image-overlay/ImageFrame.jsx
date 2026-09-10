"use client";

// The gold hairline frame: wraps the image ALONE (or the no-image
// stand-in box), snapped to its rendered edges, never around empty
// space. Also the zoom/pan viewport and pan-clamp measurement
// container, since it clips to the same box it hugs.
//
// Moved out of KitImageOverlay.view.jsx verbatim (FE/MEDIA-STUDIO
// session 3, notes 6 and 6a, 10 Sep 2026) so the live image viewer
// (components/kit/image-viewer) and the mockup overlay share one
// frame by construction. Two additive props: `children` renders
// inside the transformed wrapper on top of the image (the brush
// editor's canvases and crop overlay ride the same zoom and pan), and
// `onImageLoad` reports the image's natural pixel size once it is
// known. `imageClassName` lets a caller size the image for its own
// column; the default is the overlay's recipe, unchanged.
import { useRef, useState } from "react";

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_DOUBLE_CLICK = 2;
const ZOOM_WHEEL_STEP = 0.35;

// The hairline shrink-wraps to whatever size the image renders at
// (never a bigger box with the image floating inside it, per R2); the
// max-height reservation under 700px accounts for the shelf's own
// height (control-md plus its space-3 padding and 1px top/bottom
// border), the space-3 gap above it, AND the hairline frame's own 1px
// top/bottom border (the 4px term: 2px shelf border plus 2px frame
// border; at 2px, tall images clipped 1px at the top and bottom edge,
// R2 review-gate find), so the image still uses the maximum remaining
// space per R5 without ever overflowing into, or leaving a gap in
// front of, the shelf.
export const OVERLAY_IMAGE_CLASSES =
  "block h-auto max-h-[calc(100dvh-var(--control-md)-var(--space-3)*3-4px)] w-auto max-w-full select-none min-[700px]:max-h-[78dvh] min-[700px]:max-w-[min(88vw,76rem)]";

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

export function ImageFrame({
  imageSrc,
  title,
  zoomDisabled = false,
  imageClassName = OVERLAY_IMAGE_CLASSES,
  onImageLoad = null,
  children = null,
}) {
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
        // The transform sits on a wrapper so anything a caller layers
        // over the image (children) pans and zooms with it. The
        // wrapper shrink-wraps the image; the image keeps its own
        // caps, so the hairline still hugs the rendered pixels.
        <div
          className="relative flex max-h-full max-w-full"
          style={{
            transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.scale})`,
            transition: isInteracting ? "none" : "transform 120ms var(--ease, ease-out)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={title || "Image"}
            draggable={false}
            className={imageClassName}
            onLoad={(event) =>
              onImageLoad?.({
                width: event.currentTarget.naturalWidth,
                height: event.currentTarget.naturalHeight,
              })
            }
          />
          {children ? <div className="absolute inset-0">{children}</div> : null}
        </div>
      ) : (
        <div className="flex aspect-[5/3] w-[min(88vw,40rem)] items-center justify-center bg-[var(--surface-1)]">
          <svg viewBox="0 0 64 64" aria-hidden="true" className="h-[var(--space-16)] w-[var(--space-16)] text-[var(--ink-faint)]">
            <use href="/assets/icons/icons-v7.svg#i-59" />
          </svg>
        </div>
      )}
    </div>
  );
}
