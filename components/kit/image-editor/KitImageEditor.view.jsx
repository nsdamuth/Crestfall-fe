"use client";

// Brush editor View (FE/MEDIA-STUDIO session 3, note 6a). The frame
// with the image, the paint canvas and crop overlay layered on it,
// then the toolbar (hand, brush with three sizes, eraser, crop, undo,
// redo, close), the crop pixel entry while the crop tool is active,
// and the prompt row with Generate. Stateless: every value and
// handler arrives from the ViewModel; pointer math happens here only
// to turn a client event into image pixels.
//
// Phone framing, RULED at the plan gate (option A of three): one
// column, the rows below the image are fixed, the image shrinks to
// what is left. Nothing scrolls the canvas away. Zoom pauses while a
// brush, the eraser, or the crop tool is active and returns with the
// hand tool.
import { useRef } from "react";
import {
  Brush,
  Coins,
  Crop,
  Eraser,
  Hand,
  LoaderCircle,
  Redo2,
  Undo2,
  X,
} from "lucide-react";

import { ImageFrame } from "../image-overlay/ImageFrame";
import { growTextarea } from "../form-field/growTextarea";
import { paintStrokes, toImagePoint } from "./useKitImageEditorViewModel";

const NOT_AVAILABLE_LABEL = "Not available yet";
const SOON_LABEL = "Soon";

// Image caps for the editor column: header above, toolbar, entry, and
// prompt rows below, all fixed, so the image takes what remains.
const EDITOR_IMAGE_CLASSES =
  "block h-auto w-auto max-w-full select-none max-h-[calc(100dvh-22rem)] min-[700px]:max-h-[52dvh] min-[700px]:max-w-[min(88vw,76rem)]";

const FIELD_RECIPE =
  "w-full resize-none overflow-hidden rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-faint)]";

const ENTRY_RECIPE =
  "h-[var(--control-md)] w-[5.5rem] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-3)] text-center text-[length:var(--text-ui)] tabular-nums text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]";

const CROP_HANDLES = [
  { id: "nw", left: "0%", top: "0%", cursor: "nwse-resize", label: "Top left corner" },
  { id: "n", left: "50%", top: "0%", cursor: "ns-resize", label: "Top edge" },
  { id: "ne", left: "100%", top: "0%", cursor: "nesw-resize", label: "Top right corner" },
  { id: "e", left: "100%", top: "50%", cursor: "ew-resize", label: "Right edge" },
  { id: "se", left: "100%", top: "100%", cursor: "nwse-resize", label: "Bottom right corner" },
  { id: "s", left: "50%", top: "100%", cursor: "ns-resize", label: "Bottom edge" },
  { id: "sw", left: "0%", top: "100%", cursor: "nesw-resize", label: "Bottom left corner" },
  { id: "w", left: "0%", top: "50%", cursor: "ew-resize", label: "Left edge" },
];

// The paint layer reads its color from the gold-action token through
// the canvas element's own computed color, so no literal is written.
function paintCanvas(node, strokes, pixelSize) {
  if (!node) return;
  const color = getComputedStyle(node).color;
  paintStrokes(node, strokes, pixelSize, color);
}

function ToolButton({ label, active = false, disabled = false, onClick, children }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={() => onClick?.()}
      className={`flex h-[var(--control-md)] w-[var(--control-md)] flex-none items-center justify-center rounded-[var(--radius-full)] border transition-colors disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)] ${
        active
          ? "border-[var(--gold-action)] bg-[var(--fill)] text-[var(--gold-bright)]"
          : "border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] hover:border-[var(--gold-ornament)] hover:text-[var(--ink)] active:bg-[var(--state-pressed-fill)]"
      }`}
    >
      {children}
    </button>
  );
}

// Three circle sizes, the selected one in gold. The glyph grows with
// the step; the target stays 44px.
const BRUSH_GLYPH_SIZES = ["var(--space-2)", "var(--space-3)", "var(--space-5)"];
const BRUSH_SIZE_LABELS = ["Small brush", "Medium brush", "Large brush"];

function BrushSizeButton({ index, active, onClick }) {
  return (
    <ToolButton label={BRUSH_SIZE_LABELS[index]} active={active} onClick={onClick}>
      <span
        aria-hidden="true"
        className="block rounded-[var(--radius-full)] border-2 border-current"
        style={{ width: BRUSH_GLYPH_SIZES[index], height: BRUSH_GLYPH_SIZES[index] }}
      />
    </ToolButton>
  );
}

function Divider() {
  return <span aria-hidden="true" className="mx-[var(--space-1)] h-[var(--space-6)] w-px flex-none bg-[var(--line)]" />;
}

function SoonChip() {
  return (
    <span className="ml-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
      {SOON_LABEL}
    </span>
  );
}

function EditorToolbar({
  tool,
  brushSizeIndex,
  canUndo,
  canRedo,
  onSelectTool,
  onSelectBrushSize,
  onUndo,
  onRedo,
  onClose,
}) {
  return (
    <div className="pointer-events-auto flex w-full flex-wrap items-center justify-center gap-[var(--space-2)] self-stretch rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--panel-glass)] px-[var(--space-2)] py-[var(--space-1)] backdrop-blur-[var(--blur-panel)]">
      <ToolButton label="Move" active={tool === "hand"} onClick={() => onSelectTool?.("hand")}>
        <Hand size={17} aria-hidden="true" />
      </ToolButton>
      <ToolButton label="Brush" active={tool === "brush"} onClick={() => onSelectTool?.("brush")}>
        <Brush size={17} aria-hidden="true" />
      </ToolButton>
      <Divider />
      {BRUSH_SIZE_LABELS.map((label, index) => (
        <BrushSizeButton
          key={label}
          index={index}
          active={brushSizeIndex === index}
          onClick={() => onSelectBrushSize?.(index)}
        />
      ))}
      <Divider />
      <ToolButton label="Eraser" active={tool === "eraser"} onClick={() => onSelectTool?.("eraser")}>
        <Eraser size={17} aria-hidden="true" />
      </ToolButton>
      <ToolButton label="Crop" active={tool === "crop"} onClick={() => onSelectTool?.("crop")}>
        <Crop size={17} aria-hidden="true" />
      </ToolButton>
      <ToolButton label="Undo" disabled={!canUndo} onClick={onUndo}>
        <Undo2 size={17} aria-hidden="true" />
      </ToolButton>
      <ToolButton label="Redo" disabled={!canRedo} onClick={onRedo}>
        <Redo2 size={17} aria-hidden="true" />
      </ToolButton>
      <Divider />
      <ToolButton label="Close editor" onClick={onClose}>
        <X size={17} aria-hidden="true" />
      </ToolButton>
    </div>
  );
}

function CropEntryRow({ cropEntry, cropHint, onCropEntryChange, onApplyCropEntry, onClearCrop, onRequestUpscale }) {
  return (
    <div className="pointer-events-auto flex w-full flex-col items-center gap-[var(--space-2)] self-stretch">
      <form
        className="flex flex-wrap items-center justify-center gap-[var(--space-2)]"
        onSubmit={(event) => {
          event.preventDefault();
          onApplyCropEntry?.();
        }}
      >
        <label className="sr-only" htmlFor="kit-image-editor-crop-width">Crop width in pixels</label>
        <input
          id="kit-image-editor-crop-width"
          type="number"
          inputMode="numeric"
          min="1"
          placeholder="Width"
          value={cropEntry.width}
          onChange={(event) => onCropEntryChange?.("width", event.target.value)}
          className={ENTRY_RECIPE}
        />
        <span aria-hidden="true" className="text-[length:var(--text-ui)] text-[var(--ink-dim)]">x</span>
        <label className="sr-only" htmlFor="kit-image-editor-crop-height">Crop height in pixels</label>
        <input
          id="kit-image-editor-crop-height"
          type="number"
          inputMode="numeric"
          min="1"
          placeholder="Height"
          value={cropEntry.height}
          onChange={(event) => onCropEntryChange?.("height", event.target.value)}
          className={ENTRY_RECIPE}
        />
        <span className="text-[length:var(--text-label)] text-[var(--ink-faint)]">px</span>
        <button type="submit" className="cf-btn cf-btn--secondary cf-btn--sm">
          Set size
        </button>
        <button type="button" onClick={() => onClearCrop?.()} className="cf-btn cf-btn--secondary cf-btn--sm">
          Clear crop
        </button>
      </form>
      {cropHint ? (
        <p className="flex flex-wrap items-center justify-center gap-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--status-warning-text)]">
          <span>{cropHint}</span>
          <button
            type="button"
            onClick={() => onRequestUpscale?.()}
            className="min-h-[var(--control-sm)] rounded-[var(--radius-sm)] px-[var(--space-2)] text-[var(--gold-action)] underline-offset-2 hover:text-[var(--gold-bright)] hover:underline [@media(pointer:coarse)]:min-h-[var(--control-md)]"
          >
            Go to Upscale
          </button>
        </p>
      ) : null}
    </div>
  );
}

function PromptRow({ prompt, onPromptChange, editState, editRunCoinCost, canSubmit, onSubmit }) {
  const isSoon = editState === "soon";
  const isPending = editState === "pending";
  const disabled = isSoon || isPending || !canSubmit;
  const reason = isSoon
    ? NOT_AVAILABLE_LABEL
    : !canSubmit && !isPending
      ? "Paint an area or set a crop first"
      : "";

  return (
    <div className="pointer-events-auto flex w-[min(92vw,40rem)] max-w-full flex-col gap-[var(--space-3)] self-center rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--panel-glass)] p-[var(--space-3)] backdrop-blur-[var(--blur-panel)]">
      <label className="sr-only" htmlFor="kit-image-editor-prompt">Describe what you would like to edit</label>
      <textarea
        id="kit-image-editor-prompt"
        ref={growTextarea}
        rows={1}
        value={prompt}
        placeholder="Describe what you'd like to edit..."
        onChange={(event) => {
          growTextarea(event.target);
          onPromptChange?.(event.target.value);
        }}
        className={FIELD_RECIPE}
      />
      <button
        type="button"
        disabled={disabled}
        title={reason || undefined}
        onClick={() => onSubmit?.()}
        className="cf-btn cf-btn--primary min-h-[var(--control-md)] w-full disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)]"
      >
        <span>Generate</span>
        {isPending ? (
          <LoaderCircle size={15} className="animate-spin" aria-hidden="true" />
        ) : (
          <Coins size={15} aria-hidden="true" />
        )}
        <span className="tabular-nums">{editRunCoinCost}</span>
        {isSoon ? <SoonChip /> : null}
      </button>
    </div>
  );
}

function percent(value, total) {
  return total ? `${(value / total) * 100}%` : "0%";
}

// The crop box: a dark wash outside it (one scrim token, cast by the
// box's own shadow and clipped by the frame), a strong line, eight
// 44px handles. Drag the body to move, a handle to resize.
function CropOverlay({ crop, pixelSize, onDragStart }) {
  if (!crop || !pixelSize) return null;
  return (
    <div
      role="group"
      aria-label="Crop box"
      onPointerDown={(event) => {
        event.stopPropagation();
        onDragStart?.("move", event);
      }}
      style={{
        left: percent(crop.x, pixelSize.width),
        top: percent(crop.y, pixelSize.height),
        width: percent(crop.width, pixelSize.width),
        height: percent(crop.height, pixelSize.height),
      }}
      className="absolute cursor-move border border-[var(--line-strong)] shadow-[0_0_0_9999px_var(--scrim-strong)]"
    >
      {CROP_HANDLES.map((handle) => (
        <button
          key={handle.id}
          type="button"
          aria-label={`Resize crop, ${handle.label.toLowerCase()}`}
          onPointerDown={(event) => {
            event.stopPropagation();
            onDragStart?.(handle.id, event);
          }}
          style={{ left: handle.left, top: handle.top, cursor: handle.cursor }}
          className="absolute flex h-[var(--control-md)] w-[var(--control-md)] -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-transparent"
        >
          <span aria-hidden="true" className="block h-[var(--space-3)] w-[var(--space-3)] rounded-[var(--radius-xs)] border border-[var(--canvas)] bg-[var(--gold-action)]" />
        </button>
      ))}
    </div>
  );
}

export default function KitImageEditorView({
  imageSrc = null,
  title = "",
  pixelSize = null,
  editState = "soon",
  editRunCoinCost = 0,
  tool = "brush",
  isPaintTool = true,
  brushSizeIndex = 1,
  brushDiameter = 0,
  strokes = [],
  canUndo = false,
  canRedo = false,
  crop = null,
  cropEntry = { width: "", height: "" },
  cropHint = "",
  prompt = "",
  pointerPreview = null,
  canSubmit = false,
  onSelectTool = null,
  onSelectBrushSize = null,
  onStrokeStart = null,
  onStrokeMove = null,
  onStrokeEnd = null,
  onPointerLeave = null,
  onUndo = null,
  onRedo = null,
  onCropDragStart = null,
  onCropDrag = null,
  onCropDragEnd = null,
  onCropEntryChange = null,
  onApplyCropEntry = null,
  onClearCrop = null,
  onPromptChange = null,
  onSubmit = null,
  onClose = null,
  onImageLoad = null,
  onRequestUpscale = null,
}) {
  // The pointer target: every event maps through this element's rect
  // (which carries the frame's zoom and pan) into image pixels.
  const surfaceRef = useRef(null);
  const isHand = tool === "hand";
  const isCropTool = tool === "crop";

  function pointOf(event) {
    return toImagePoint(event, surfaceRef.current, pixelSize);
  }

  function handleSurfacePointerDown(event) {
    if (isHand || !pixelSize) return;
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    if (isPaintTool) onStrokeStart?.(pointOf(event));
  }

  function handleSurfacePointerMove(event) {
    if (isHand) return;
    if (isCropTool) {
      onCropDrag?.(pointOf(event));
      return;
    }
    onStrokeMove?.(pointOf(event));
  }

  function handleSurfacePointerUp(event) {
    if (isHand) return;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    if (isCropTool) onCropDragEnd?.();
    else onStrokeEnd?.();
  }

  function handleCropDragStart(handle, event) {
    surfaceRef.current?.setPointerCapture?.(event.pointerId);
    onCropDragStart?.(handle, pointOf(event));
  }

  return (
    <div className="pointer-events-none flex min-h-0 w-full flex-col items-center gap-[var(--space-3)]">
      <ImageFrame
        imageSrc={imageSrc}
        title={title}
        zoomDisabled={!isHand || !imageSrc}
        imageClassName={EDITOR_IMAGE_CLASSES}
        onImageLoad={onImageLoad}
      >
        {pixelSize ? (
          <div
            ref={surfaceRef}
            onPointerDown={handleSurfacePointerDown}
            onPointerMove={handleSurfacePointerMove}
            onPointerUp={handleSurfacePointerUp}
            onPointerCancel={handleSurfacePointerUp}
            onPointerLeave={() => onPointerLeave?.()}
            style={{ touchAction: isHand ? "auto" : "none" }}
            className={`absolute inset-0 ${isHand ? "pointer-events-none" : "pointer-events-auto"} ${
              isPaintTool ? "cursor-crosshair" : ""
            }`}
          >
            {/* Paint preview: the stroke list replayed at native
                size, tinted by the gold-action token through this
                element's color, shown at half strength over the art. */}
            <canvas
              ref={(node) => paintCanvas(node, strokes, pixelSize)}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full text-[var(--gold-action)] opacity-50"
            />
            {isPaintTool && pointerPreview && brushDiameter ? (
              <span
                aria-hidden="true"
                style={{
                  left: percent(pointerPreview.x, pixelSize.width),
                  top: percent(pointerPreview.y, pixelSize.height),
                  width: percent(brushDiameter, pixelSize.width),
                  height: percent(brushDiameter, pixelSize.height),
                }}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-full)] border border-[var(--art-ink)]"
              />
            ) : null}
            <CropOverlay crop={crop} pixelSize={pixelSize} onDragStart={handleCropDragStart} />
          </div>
        ) : null}
      </ImageFrame>

      <EditorToolbar
        tool={tool}
        brushSizeIndex={brushSizeIndex}
        canUndo={canUndo}
        canRedo={canRedo}
        onSelectTool={onSelectTool}
        onSelectBrushSize={onSelectBrushSize}
        onUndo={onUndo}
        onRedo={onRedo}
        onClose={onClose}
      />

      {isCropTool ? (
        <CropEntryRow
          cropEntry={cropEntry}
          cropHint={cropHint}
          onCropEntryChange={onCropEntryChange}
          onApplyCropEntry={onApplyCropEntry}
          onClearCrop={onClearCrop}
          onRequestUpscale={onRequestUpscale}
        />
      ) : null}

      <PromptRow
        prompt={prompt}
        onPromptChange={onPromptChange}
        editState={editState}
        editRunCoinCost={editRunCoinCost}
        canSubmit={canSubmit}
        onSubmit={onSubmit}
      />
    </div>
  );
}
