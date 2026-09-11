"use client";

// Image viewer ViewModel (FE/MEDIA-STUDIO session 3, notes 6 and 6a).
// Owns presentation state only: view or edit mode, the measured pixel
// size (when the page has none stored), and the download menu's
// open state. Every operation is the page's; every cost is a prop.
import { useRef, useState } from "react";

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

export function formatPixelSize(size) {
  return size ? `${size.width} x ${size.height} px` : "";
}

function normalizeState(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

function normalizeItems(items) {
  if (!Array.isArray(items)) return [];
  return items
    .filter((item) => item && (item.id || item.imageOutputId))
    .map((item) => ({
      id: item.id || item.imageOutputId,
      title: typeof item.title === "string" ? item.title : "",
      thumbnailUrl: typeof item.thumbnailUrl === "string" ? item.thumbnailUrl : null,
      original: item,
    }));
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

  const items = normalizeItems(props?.items);
  const onSelectItem = toCallback(props?.onSelectItem);

  function handleImageLoad(size) {
    const next = normalizePixelSize(size);
    if (!next) return;
    setMeasured({ src: imageSrc, size: next });
  }

  function selectItem(item) {
    setMode("view");
    setDownloadMenuOpen(false);
    onSelectItem?.(item?.original || item);
  }

  return {
    imageSrc,
    title: typeof props?.title === "string" ? props.title : "",
    items,
    activeId: props?.activeId || null,
    pixelSize,
    pixelSizeLabel: formatPixelSize(pixelSize),
    isSaved: Boolean(props?.isSaved),
    shareMessage: typeof props?.shareMessage === "string" ? props.shareMessage : "",
    downloadOptions: normalizeDownloadOptions(props?.downloadOptions, pixelSize),
    downloadMenuOpen,
    assignState: normalizeState(props?.assignState, ["ready", "soon"], "soon"),
    upscaleCoinCost: Number(props?.upscaleCoinCost ?? 0) || 0,
    upscaleState: normalizeState(props?.upscaleState, ["soon", "ready", "pending"], "soon"),
    editRunCoinCost: Number(props?.editRunCoinCost ?? 0) || 0,
    editState: normalizeState(props?.editState, ["soon", "ready", "pending"], "soon"),
    mode,
    isEditing: mode === "edit",
    upscaleRef,
    overlaySlot: props?.overlaySlot ?? null,
    overlayReplacesBody: Boolean(props?.overlayReplacesBody),
    onSelectItem: selectItem,
    onImageLoad: handleImageLoad,
    onSave: toCallback(props?.onSave),
    onDelete: toCallback(props?.onDelete),
    onReport: toCallback(props?.onReport),
    onDetails: toCallback(props?.onDetails),
    onShare: toCallback(props?.onShare),
    onAssign: toCallback(props?.onAssign),
    onUpscale: toCallback(props?.onUpscale),
    onSubmitEdit: toCallback(props?.onSubmitEdit),
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
