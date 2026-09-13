"use client";

// Image viewer ViewModel (FE/MEDIA-STUDIO session 3, notes 6 and 6a).
// Owns presentation state only: view or edit mode, the measured pixel
// size (when the page has none stored), and the download menu's
// open state. Every operation is the page's; every cost is a prop.
import { useCallback, useEffect, useRef, useState } from "react";

function toCallback(value) {
  return typeof value === "function" ? value : null;
}

// Fixed-ratio fit, RULED 12 Sep 2026 (Brian's browser review, second
// pass): the image is sized explicitly from its own ratio to the space
// the column leaves after the header and the bar, measured live, so a
// window of any shape shows the whole image at its correct ratio and
// the hairline still hugs it. Width ceiling is the standing desktop
// envelope (88vw, 76rem) and the phone gutter under 700px; the 2px
// takes the frame's own hairline off the measured box.
const DESKTOP_MIN_WIDTH = 700;
const DESKTOP_WIDTH_FRACTION = 0.88;
const DESKTOP_WIDTH_CAP_PX = 76 * 16;
const PHONE_GUTTER_PX = 16;
const FRAME_HAIRLINE_PX = 2;

function fitImageBox(frameBox, pixelSize) {
  if (!frameBox || !pixelSize) return null;
  const aspect = pixelSize.width / pixelSize.height;
  if (!Number.isFinite(aspect) || aspect <= 0) return null;

  const availableWidth = Math.max(frameBox.availableWidth - FRAME_HAIRLINE_PX, 0);
  const availableHeight = Math.max(frameBox.availableHeight - FRAME_HAIRLINE_PX, 0);
  if (!availableWidth || !availableHeight) return null;

  let width = Math.min(availableWidth, availableHeight * aspect);
  let height = width / aspect;
  if (height > availableHeight) {
    height = availableHeight;
    width = height * aspect;
  }

  return { width: Math.floor(width), height: Math.floor(height) };
}

function readViewerAvailableWidth() {
  const viewportWidth = window.innerWidth;
  if (viewportWidth >= DESKTOP_MIN_WIDTH) {
    return Math.min(viewportWidth * DESKTOP_WIDTH_FRACTION, DESKTOP_WIDTH_CAP_PX);
  }
  return Math.max(viewportWidth - PHONE_GUTTER_PX, 0);
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

export function formatPixelSize(size) {
  return size ? `${size.width} x ${size.height} px` : "";
}

function normalizeState(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

function normalizeDownloadOptions(options, pixelSize) {
  if (!Array.isArray(options)) return [];
  return options
    .filter((option) => option && option.id && option.label)
    .map((option) => ({
      id: option.id,
      label: option.label,
      href: option.disabled ? "" : typeof option.href === "string" ? option.href : "",
      disabled: Boolean(option.disabled) || !option.href,
      tooltip: typeof option.tooltip === "string" ? option.tooltip : "",
      title: typeof option.title === "string" ? option.title : "",
      detail: option.showsPixelSize ? formatPixelSize(pixelSize) : "",
    }));
}

export function useKitImageViewerViewModel(props) {
  const imageSrc = typeof props?.imageSrc === "string" ? props.imageSrc : null;
  const [mode, setMode] = useState("view");
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  // Measured on image load, keyed by source so a new image never
  // borrows the previous one's size.
  const [measured, setMeasured] = useState({ src: null, size: null });
  const upscaleRef = useRef(null);

  const storedSize = normalizePixelSize(props?.pixelSize);
  const measuredSize = measured.src === imageSrc ? measured.size : null;
  const pixelSize = storedSize || measuredSize;

  // The frame slot: the column's remaining height after the header and
  // the bar, observed live; the view attaches frameSlotRef to it.
  const [frameBox, setFrameBox] = useState(null);
  const frameSlotNodeRef = useRef(null);
  const frameObserverRef = useRef(null);
  const measureFrameSlot = useCallback(() => {
    const node = frameSlotNodeRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    setFrameBox({
      availableWidth: readViewerAvailableWidth(),
      availableHeight: rect.height,
    });
  }, []);
  const frameSlotRef = useCallback(
    (node) => {
      frameObserverRef.current?.disconnect();
      frameObserverRef.current = null;
      frameSlotNodeRef.current = node;
      if (!node || typeof ResizeObserver === "undefined") return;

      const observer = new ResizeObserver(() => measureFrameSlot());
      observer.observe(node);
      frameObserverRef.current = observer;
    },
    [measureFrameSlot]
  );
  useEffect(() => {
    window.addEventListener("resize", measureFrameSlot);
    return () => window.removeEventListener("resize", measureFrameSlot);
  }, [measureFrameSlot]);

  const imageBox = fitImageBox(frameBox, pixelSize);

  function handleImageLoad(size) {
    const next = normalizePixelSize(size);
    if (!next) return;
    setMeasured({ src: imageSrc, size: next });
  }

  return {
    imageSrc,
    title: typeof props?.title === "string" ? props.title : "",
    pixelSize,
    pixelSizeLabel: formatPixelSize(pixelSize),
    frameSlotRef,
    hasImageBox: Boolean(imageBox),
    imageBoxStyle: imageBox
      ? { "--viewer-image-w": `${imageBox.width}px`, "--viewer-image-h": `${imageBox.height}px` }
      : undefined,
    isSaved: Boolean(props?.isSaved),
    shareMessage: typeof props?.shareMessage === "string" ? props.shareMessage : "",
    downloadOptions: normalizeDownloadOptions(props?.downloadOptions, pixelSize),
    downloadMenuOpen,
    assignState: normalizeState(props?.assignState, ["ready", "soon"], "soon"),
    // 2.0.0: the bottom bar's middle action, chosen by the page.
    bottomBarAction: normalizeState(props?.bottomBarAction, ["assign", "remix"], "assign"),
    remixState: normalizeState(props?.remixState, ["ready", "soon"], "soon"),
    onRemix: toCallback(props?.onRemix),
    upscaleCoinCost: Number(props?.upscaleCoinCost ?? 0) || 0,
    upscaleState: normalizeState(props?.upscaleState, ["soon", "ready", "pending"], "soon"),
    editRunCoinCost: Number(props?.editRunCoinCost ?? 0) || 0,
    editState: normalizeState(props?.editState, ["soon", "ready", "pending"], "soon"),
    mode,
    isEditing: mode === "edit",
    upscaleRef,
    overlaySlot: props?.overlaySlot ?? null,
    overlayReplacesBody: Boolean(props?.overlayReplacesBody),
    detailsOpen: Boolean(props?.detailsOpen),
    detailsPanel: props?.detailsPanel ?? null,
    onImageLoad: handleImageLoad,
    onSave: toCallback(props?.onSave),
    onDelete: toCallback(props?.onDelete),
    onReport: toCallback(props?.onReport),
    onDetails: toCallback(props?.onDetails),
    onShare: toCallback(props?.onShare),
    onAssign: toCallback(props?.onAssign),
    onUpscale: toCallback(props?.onUpscale),
    onSubmitEdit: toCallback(props?.onSubmitEdit),
    onCloseDetails: toCallback(props?.onCloseDetails),
    onClose: toCallback(props?.onClose),
    onToggleDownloadMenu: () => setDownloadMenuOpen((current) => !current),
    onCloseDownloadMenu: () => setDownloadMenuOpen(false),
    onEnterEdit: () => {
      setDownloadMenuOpen(false);
      setMode("edit");
    },
    onExitEdit: () => setMode("view"),
    onFocusUpscale: () => upscaleRef.current?.focus?.(),
  };
}
