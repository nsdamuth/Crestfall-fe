"use client";

import { useEffect, useMemo, useState } from "react";

import { fetchImageOutputDetails } from "@/lib/client/studio/media/imageDetailsClient";
import { createMediaReport } from "@/lib/client/studio/media/mediaReportClient";

export const MEDIA_REPORT_REASON_OPTIONS = [
  { value: "sexual_content", label: "Sexual content" },
  { value: "violence_gore", label: "Violence / gore" },
  { value: "underage_concern", label: "Underage-looking content" },
  { value: "copyright_likeness", label: "Copyright / likeness concern" },
  { value: "harassment_hate", label: "Harassment / hate" },
  { value: "spam_misleading", label: "Spam / misleading" },
  { value: "other", label: "Other" },
];

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    String(value || "").trim()
  );
}

export function getMediaImageUrl(item) {
  return (
    item?.imageUrl ||
    item?.displayImageUrl ||
    item?.displayUrl ||
    item?.thumbnailUrl ||
    item?.url ||
    null
  );
}

export function getMediaImageOutputId(item) {
  const candidate =
    item?.imageOutputId ||
    item?.image_output_id ||
    item?.outputId ||
    item?.output_id ||
    item?.imageGenerationOutputId ||
    item?.image_generation_output_id ||
    item?.output?.id ||
    item?.output?.rowId ||
    item?.output?.imageOutputId ||
    item?.output?.image_output_id ||
    item?.output?.outputId ||
    item?.output?.output_id ||
    item?.rawOutput?.id ||
    item?.rawOutput?.rowId ||
    item?.id ||
    "";

  const normalized = String(candidate || "").trim();
  return isUuid(normalized) ? normalized : "";
}

export function getMediaTitle(item) {
  return item?.title || item?.label || item?.type || "Image";
}

export function getMediaId(item) {
  return (
    item?.id ||
    item?.imageOutputId ||
    item?.image_output_id ||
    item?.outputId ||
    item?.output_id ||
    item?.storagePath ||
    getMediaTitle(item)
  );
}

export function getMediaThumbnailUrl(item) {
  const directThumbnailUrl =
    item?.thumbnailImageUrl ||
    item?.thumbnailUrl ||
    item?.thumbnail_url ||
    item?.previewUrl ||
    null;

  if (directThumbnailUrl) return directThumbnailUrl;

  const imageOutputId = getMediaImageOutputId(item);
  if (imageOutputId) {
    return `/api/studio/image-generation/outputs/${encodeURIComponent(
      imageOutputId
    )}/file?variant=thumbnail`;
  }

  return getMediaImageUrl(item);
}

export function normalizeMediaLightboxItem(item) {
  if (!item) return null;

  const id = getMediaId(item);
  return {
    id,
    title: getMediaTitle(item),
    imageUrl: getMediaImageUrl(item),
    thumbnailUrl: getMediaThumbnailUrl(item),
    imageOutputId: getMediaImageOutputId(item),
    originalItem: item,
  };
}

function toggleSetItem(setter, id) {
  if (!id) return;

  setter((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
}

export function useMediaLightboxViewModel({
  items = [],
  activeItemId,
  onSelectItem,
  onClose,
  modeLabel = "Media",
  imageStudioHref = "/studio/image-studio",
  allowDownload = false,
  showStudioActions = true,
  isItemLiked,
  isItemBookmarked,
  onToggleLike,
  onToggleBookmark,
  onDeleteItem,
} = {}) {
  const mediaItems = useMemo(
    () =>
      (Array.isArray(items) ? items : [])
        .filter(Boolean)
        .map(normalizeMediaLightboxItem)
        .filter(Boolean),
    [items]
  );

  const activeIndex = Math.max(
    mediaItems.findIndex((item) => item.id === activeItemId),
    0
  );
  const activeMedia = mediaItems[activeIndex] || null;
  const activeId = activeMedia?.id || "";
  const activeOriginalItem = activeMedia?.originalItem || null;

  const [likedIds, setLikedIds] = useState(() => new Set());
  const [bookmarkedIds, setBookmarkedIds] = useState(() => new Set());
  const [shareMessage, setShareMessage] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsStatus, setDetailsStatus] = useState("idle");
  const [detailsMessage, setDetailsMessage] = useState("");
  const [imageDetails, setImageDetails] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReasonKey, setReportReasonKey] = useState("sexual_content");
  const [reportReasonText, setReportReasonText] = useState("");
  const [reportStatus, setReportStatus] = useState("idle");
  const [reportMessage, setReportMessage] = useState("");

  const isLiked =
    typeof isItemLiked === "function"
      ? Boolean(isItemLiked(activeOriginalItem))
      : likedIds.has(activeId);
  const isBookmarked =
    typeof isItemBookmarked === "function"
      ? Boolean(isItemBookmarked(activeOriginalItem))
      : bookmarkedIds.has(activeId);

  const shareUrl = useMemo(
    () => (typeof window === "undefined" ? "" : window.location.href),
    []
  );

  useEffect(() => {
    setShareMessage("");
    setDetailsOpen(false);
    setDetailsStatus("idle");
    setDetailsMessage("");
    setImageDetails(null);
    setReportOpen(false);
    setReportStatus("idle");
    setReportMessage("");
    setReportReasonText("");
  }, [activeId]);

  function handleSelectMedia(media) {
    onSelectItem?.(media?.originalItem || null);
  }

  function handleToggleLike() {
    if (typeof onToggleLike === "function") {
      onToggleLike(activeOriginalItem);
      return;
    }
    toggleSetItem(setLikedIds, activeId);
  }

  function handleToggleBookmark() {
    if (typeof onToggleBookmark === "function") {
      onToggleBookmark(activeOriginalItem);
      return;
    }
    toggleSetItem(setBookmarkedIds, activeId);
  }

  function handleDeleteItem() {
    if (typeof onDeleteItem !== "function" || !activeOriginalItem) return;

    const confirmed = window.confirm(
      "Delete this image from your Image Studio? This will also remove it from any character libraries and featured slots."
    );
    if (!confirmed) return;

    onDeleteItem(
      {
        ...activeOriginalItem,
        imageOutputId: activeMedia?.imageOutputId || "",
      },
      { confirmed: true }
    );
  }

  async function handleShare() {
    setShareMessage("");

    try {
      if (navigator?.share) {
        await navigator.share({ title: activeMedia?.title || "Image", url: shareUrl });
        setShareMessage("Shared.");
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setShareMessage("Link copied.");
    } catch {
      setShareMessage("Share unavailable.");
    }
  }

  async function handleOpenDetails() {
    setDetailsOpen(true);
    setDetailsMessage("");

    if (!activeMedia?.imageOutputId) {
      setDetailsStatus("error");
      setDetailsMessage("This image does not have an output id.");
      setImageDetails(null);
      return;
    }

    setDetailsStatus("loading");
    try {
      const details = await fetchImageOutputDetails(activeMedia.imageOutputId);
      setImageDetails(details);
      setDetailsStatus("success");
    } catch (error) {
      setDetailsStatus("error");
      setDetailsMessage(error?.message || "Image details could not be loaded.");
      setImageDetails(null);
    }
  }

  function handleOpenReport() {
    setReportOpen(true);
    setReportStatus("idle");
    setReportMessage("");
  }

  async function handleSubmitReport(event) {
    event?.preventDefault?.();

    if (!activeMedia?.imageOutputId) {
      setReportStatus("error");
      setReportMessage("This image does not have an output id.");
      return;
    }

    setReportStatus("loading");
    setReportMessage("");

    try {
      await createMediaReport({
        imageOutputId: activeMedia.imageOutputId,
        reasonKey: reportReasonKey,
        reasonText: reportReasonText,
      });
      setReportStatus("success");
      setReportMessage("Report received.");
      setReportReasonText("");
    } catch (error) {
      setReportStatus("error");
      setReportMessage(error?.message || "Report could not be submitted.");
    }
  }

  return {
    mediaItems,
    activeMedia,
    activeId,
    modeLabel,
    imageStudioHref,
    allowDownload: Boolean(allowDownload),
    showStudioActions: Boolean(showStudioActions),
    showDeleteAction: typeof onDeleteItem === "function",
    isLiked,
    isBookmarked,
    shareMessage,
    reportReasonOptions: MEDIA_REPORT_REASON_OPTIONS,
    detailsDialog: {
      open: detailsOpen,
      status: detailsStatus,
      message: detailsMessage,
      publicRows: imageDetails?.publicRows || [],
      privateRows: imageDetails?.privateRows || [],
      canViewPrivate:
        imageDetails?.permissions?.canViewPrivateGenerationDetails === true,
    },
    reportDialog: {
      open: reportOpen,
      title: activeMedia?.title || "Image",
      reasonKey: reportReasonKey,
      reasonText: reportReasonText,
      status: reportStatus,
      message: reportMessage,
    },
    onSelectMedia: handleSelectMedia,
    onClose,
    onLike: handleToggleLike,
    onBookmark: handleToggleBookmark,
    onShare: handleShare,
    onDelete: handleDeleteItem,
    onOpenDetails: handleOpenDetails,
    onCloseDetails: () => setDetailsOpen(false),
    onOpenReport: handleOpenReport,
    onCloseReport: () => setReportOpen(false),
    onReportReasonKeyChange: setReportReasonKey,
    onReportReasonTextChange: setReportReasonText,
    onSubmitReport: handleSubmitReport,
  };
}
