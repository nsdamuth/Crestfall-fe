"use client";

// Brush editor ViewModel (FE/MEDIA-STUDIO session 3, note 6a). Owns
// the tool, the brush size, the stroke list with its redo stack, the
// crop box, the pixel entry, and the prompt. No fetch, no coin
// literal: the cost and the readiness state arrive as props.
//
// Drawing model, RULED at the plan gate (option A of three): strokes
// are recorded in image pixels ({ tool, size, points[] }) and replayed
// onto a canvas whose pixel buffer is the image's native size, so the
// visible preview and the exported mask are the same drawing. Undo
// and redo move whole strokes between two lists. The eraser paints
// with destination-out so it truly removes paint.
import { useRef, useState } from "react";

export const EDITOR_TOOLS = ["hand", "brush", "eraser", "crop"];

// Brush diameters as a fraction of the image's short edge, so a
// stroke reads the same on a small and a large image.
export const BRUSH_SIZE_STEPS = [0.03, 0.06, 0.12];
export const DEFAULT_BRUSH_SIZE_INDEX = 1;

export const MIN_CROP_PX = 16;

export const CROP_HINT_LARGER = "Larger sizes need Upscale";

function toCallback(value) {
  return typeof value === "function" ? value : null;
}

function toPositiveInt(value) {
  const number = Number.parseInt(value, 10);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

export function normalizePixelSize(value) {
  const width = toPositiveInt(value?.width);
  const height = toPositiveInt(value?.height);
  return width && height ? { width, height } : null;
}

// Client coordinates to image pixels through the element's rendered
// rect, which already includes the frame's zoom and pan transform.
export function toImagePoint(event, element, pixelSize) {
  if (!element || !pixelSize) return null;
  const rect = element.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  return {
    x: ((event.clientX - rect.left) / rect.width) * pixelSize.width,
    y: ((event.clientY - rect.top) / rect.height) * pixelSize.height,
  };
}

export function clampCropToImage(crop, pixelSize) {
  if (!crop || !pixelSize) return null;
  const width = Math.min(pixelSize.width, Math.max(MIN_CROP_PX, Math.round(crop.width)));
  const height = Math.min(pixelSize.height, Math.max(MIN_CROP_PX, Math.round(crop.height)));
  const x = Math.min(pixelSize.width - width, Math.max(0, Math.round(crop.x)));
  const y = Math.min(pixelSize.height - height, Math.max(0, Math.round(crop.y)));
  return { x, y, width, height };
}

function defaultCrop(pixelSize) {
  return clampCropToImage(
    {
      x: pixelSize.width * 0.1,
      y: pixelSize.height * 0.1,
      width: pixelSize.width * 0.8,
      height: pixelSize.height * 0.8,
    },
    pixelSize
  );
}

function centeredCrop(size, pixelSize, around) {
  const centerX = around ? around.x + around.width / 2 : pixelSize.width / 2;
  const centerY = around ? around.y + around.height / 2 : pixelSize.height / 2;
  return clampCropToImage(
    {
      x: centerX - size.width / 2,
      y: centerY - size.height / 2,
      width: size.width,
      height: size.height,
    },
    pixelSize
  );
}

// Resize or move the crop from a drag. `handle` names the edge or
// corner being dragged (n, s, e, w, ne, nw, se, sw) or "move".
export function dragCrop(origin, handle, delta, pixelSize) {
  if (!origin || !pixelSize) return null;
  let { x, y, width, height } = origin;

  if (handle === "move") {
    return clampCropToImage({ x: x + delta.x, y: y + delta.y, width, height }, pixelSize);
  }

  if (handle.includes("w")) {
    const nextX = Math.min(x + width - MIN_CROP_PX, Math.max(0, x + delta.x));
    width = width + (x - nextX);
    x = nextX;
  }
  if (handle.includes("e")) {
    width = Math.min(pixelSize.width - x, Math.max(MIN_CROP_PX, width + delta.x));
  }
  if (handle.includes("n")) {
    const nextY = Math.min(y + height - MIN_CROP_PX, Math.max(0, y + delta.y));
    height = height + (y - nextY);
    y = nextY;
  }
  if (handle.includes("s")) {
    height = Math.min(pixelSize.height - y, Math.max(MIN_CROP_PX, height + delta.y));
  }

  return clampCropToImage({ x, y, width, height }, pixelSize);
}

// Replay the stroke list onto a canvas. The pixel buffer is the
// image's native size so one drawing serves the preview and the
// export. `color` is a resolved CSS color (the preview reads the
// gold-action token through the canvas element's computed color; the
// export passes the mask keyword).
export function paintStrokes(canvas, strokes, pixelSize, color) {
  if (!canvas || !pixelSize) return;
  if (canvas.width !== pixelSize.width || canvas.height !== pixelSize.height) {
    canvas.width = pixelSize.width;
    canvas.height = pixelSize.height;
  }
  const context = canvas.getContext("2d");
  if (!context) return;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.lineCap = "round";
  context.lineJoin = "round";

  for (const stroke of strokes) {
    if (!stroke?.points?.length) continue;
    context.globalCompositeOperation =
      stroke.tool === "eraser" ? "destination-out" : "source-over";
    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineWidth = stroke.size;

    if (stroke.points.length === 1) {
      const [point] = stroke.points;
      context.beginPath();
      context.arc(point.x, point.y, stroke.size / 2, 0, Math.PI * 2);
      context.fill();
      continue;
    }

    context.beginPath();
    context.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let index = 1; index < stroke.points.length; index += 1) {
      context.lineTo(stroke.points[index].x, stroke.points[index].y);
    }
    context.stroke();
  }

  context.globalCompositeOperation = "source-over";
}

// The mask an inpainting job expects: white where painted, black
// elsewhere, at the image's native size. The two color keywords are
// the bitmap's data values, not interface colors.
export function buildMaskDataUrl(strokes, pixelSize) {
  if (typeof document === "undefined" || !pixelSize || !strokes.length) return null;
  const paint = document.createElement("canvas");
  paintStrokes(paint, strokes, pixelSize, "white");

  const mask = document.createElement("canvas");
  mask.width = pixelSize.width;
  mask.height = pixelSize.height;
  const context = mask.getContext("2d");
  if (!context) return null;
  context.fillStyle = "black";
  context.fillRect(0, 0, mask.width, mask.height);
  context.drawImage(paint, 0, 0);
  return mask.toDataURL("image/png");
}

export function useKitImageEditorViewModel(props) {
  const pixelSize = normalizePixelSize(props?.pixelSize);
  const editState = ["soon", "ready", "pending"].includes(props?.editState)
    ? props.editState
    : "soon";
  const editRunCoinCost = Number(props?.editRunCoinCost ?? 0) || 0;
  const onSubmit = toCallback(props?.onSubmit);

  // initialTool, initialStrokes, and initialCropEntry seed the first
  // render for fixtures; the live page passes none of them.
  const [tool, setTool] = useState(() =>
    EDITOR_TOOLS.includes(props?.initialTool) ? props.initialTool : "brush"
  );
  const [brushSizeIndex, setBrushSizeIndex] = useState(DEFAULT_BRUSH_SIZE_INDEX);
  const [strokes, setStrokes] = useState(() =>
    Array.isArray(props?.initialStrokes) ? props.initialStrokes : []
  );
  const [redoStack, setRedoStack] = useState([]);
  const [crop, setCrop] = useState(() =>
    props?.initialTool === "crop" && pixelSize ? defaultCrop(pixelSize) : null
  );
  const [cropEntry, setCropEntry] = useState(() =>
    props?.initialCropEntry && typeof props.initialCropEntry === "object"
      ? { width: String(props.initialCropEntry.width ?? ""), height: String(props.initialCropEntry.height ?? "") }
      : { width: "", height: "" }
  );
  const [cropHint, setCropHint] = useState("");
  const [prompt, setPrompt] = useState("");
  const [pointerPreview, setPointerPreview] = useState(null);

  const paintingRef = useRef(false);
  const cropDragRef = useRef(null);

  const shortEdge = pixelSize ? Math.min(pixelSize.width, pixelSize.height) : 0;
  const brushDiameter = Math.max(2, Math.round(BRUSH_SIZE_STEPS[brushSizeIndex] * shortEdge));
  const isPaintTool = tool === "brush" || tool === "eraser";

  function selectTool(nextTool) {
    if (!EDITOR_TOOLS.includes(nextTool)) return;
    setTool(nextTool);
    setPointerPreview(null);
    if (nextTool === "crop" && !crop && pixelSize) {
      const next = defaultCrop(pixelSize);
      setCrop(next);
      setCropEntry({ width: String(next.width), height: String(next.height) });
    }
  }

  function startStroke(point) {
    if (!isPaintTool || !point || !pixelSize) return;
    paintingRef.current = true;
    setRedoStack([]);
    setStrokes((current) => [...current, { tool, size: brushDiameter, points: [point] }]);
  }

  function moveStroke(point) {
    if (!point) return;
    setPointerPreview(point);
    if (!paintingRef.current) return;
    setStrokes((current) => {
      if (!current.length) return current;
      const last = current[current.length - 1];
      return [...current.slice(0, -1), { ...last, points: [...last.points, point] }];
    });
  }

  function endStroke() {
    paintingRef.current = false;
  }

  // Whole strokes move between the two lists. Both reads come from the
  // rendered state, never from inside an updater, so a double-invoked
  // updater can never duplicate a stroke.
  function undo() {
    if (!strokes.length) return;
    const last = strokes[strokes.length - 1];
    setStrokes(strokes.slice(0, -1));
    setRedoStack([...redoStack, last]);
  }

  function redo() {
    if (!redoStack.length) return;
    const last = redoStack[redoStack.length - 1];
    setRedoStack(redoStack.slice(0, -1));
    setStrokes([...strokes, last]);
  }

  function startCropDrag(handle, point) {
    if (!crop || !point) return;
    cropDragRef.current = { handle, start: point, origin: crop };
  }

  function moveCropDrag(point) {
    const drag = cropDragRef.current;
    if (!drag || !point || !pixelSize) return;
    const next = dragCrop(
      drag.origin,
      drag.handle,
      { x: point.x - drag.start.x, y: point.y - drag.start.y },
      pixelSize
    );
    if (!next) return;
    setCrop(next);
    setCropEntry({ width: String(next.width), height: String(next.height) });
    setCropHint("");
  }

  function endCropDrag() {
    cropDragRef.current = null;
  }

  function changeCropEntry(field, value) {
    setCropEntry((current) => ({ ...current, [field]: value }));
  }

  // The pixel entry sets the box size around its current center. A
  // size larger than the image stops at the image edge and points to
  // Upscale (note 6a); it never invents pixels.
  function applyCropEntry() {
    if (!pixelSize) return;
    const width = toPositiveInt(cropEntry.width);
    const height = toPositiveInt(cropEntry.height);
    if (!width || !height) return;
    const tooLarge = width > pixelSize.width || height > pixelSize.height;
    const next = centeredCrop({ width, height }, pixelSize, crop);
    setCrop(next);
    setCropEntry({ width: String(next.width), height: String(next.height) });
    setCropHint(tooLarge ? CROP_HINT_LARGER : "");
    if (tool !== "crop") setTool("crop");
  }

  function clearCrop() {
    setCrop(null);
    setCropEntry({ width: "", height: "" });
    setCropHint("");
  }

  const hasChanges = strokes.length > 0 || Boolean(crop);
  const canSubmit = editState === "ready" && hasChanges;

  function submit() {
    if (!canSubmit) return;
    onSubmit?.({
      maskDataUrl: buildMaskDataUrl(strokes, pixelSize),
      crop,
      prompt: prompt.trim(),
    });
  }

  return {
    imageSrc: typeof props?.imageSrc === "string" ? props.imageSrc : null,
    title: typeof props?.title === "string" ? props.title : "",
    pixelSize,
    editState,
    editRunCoinCost,
    tool,
    isPaintTool,
    brushSizeIndex,
    brushDiameter,
    strokes,
    canUndo: strokes.length > 0,
    canRedo: redoStack.length > 0,
    crop,
    cropEntry,
    cropHint,
    prompt,
    pointerPreview,
    hasChanges,
    canSubmit,
    onSelectTool: selectTool,
    onSelectBrushSize: (index) => {
      if (index >= 0 && index < BRUSH_SIZE_STEPS.length) setBrushSizeIndex(index);
    },
    onStrokeStart: startStroke,
    onStrokeMove: moveStroke,
    onStrokeEnd: endStroke,
    onPointerLeave: () => setPointerPreview(null),
    onUndo: undo,
    onRedo: redo,
    onCropDragStart: startCropDrag,
    onCropDrag: moveCropDrag,
    onCropDragEnd: endCropDrag,
    onCropEntryChange: changeCropEntry,
    onApplyCropEntry: applyCropEntry,
    onClearCrop: clearCrop,
    onPromptChange: setPrompt,
    onSubmit: submit,
    onClose: toCallback(props?.onClose),
    onImageLoad: toCallback(props?.onImageLoad),
    onRequestUpscale: toCallback(props?.onRequestUpscale),
  };
}
