"use client";

import { useEffect, useMemo, useState } from "react";

import { fetchImageOutputDetails } from "@/lib/client/studio/media/imageDetailsClient";
import {
  fetchImageReassignmentContext,
  reassignImageOutput,
  updateImageOutputDisplayName,
} from "@/lib/client/studio/media/imageOutputClient";
import {
  applyImageOutputDisplayNameResult,
  getImageOutputCustomDisplayName,
  getImageOutputDisplayTitle,
} from "@/lib/shared/media/imageOutputNaming";
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

export function getMediaSourceCreationId(item) {
  const candidate =
    item?.sourceCreationId ||
    item?.source_creation_id ||
    item?.creationId ||
    item?.creation_id ||
    item?.primarySubjectCreationId ||
    item?.primary_subject_creation_id ||
    item?.output?.primarySubjectCreationId ||
    item?.output?.primary_subject_creation_id ||
    item?.job?.primarySubjectCreationId ||
    item?.job?.primary_subject_creation_id ||
    "";

  const normalized = String(candidate || "").trim();
  return isUuid(normalized) ? normalized : "";
}

export function getMediaTitle(item) {
  if (getMediaImageOutputId(item)) {
    return getImageOutputDisplayTitle(item);
  }

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
    sourceCreationId: getMediaSourceCreationId(item),
    canReassign: item?.canReassign === true,
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
  onReassignItem,
  allowRename = false,
  onRenameItem,
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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [reassignStatus, setReassignStatus] = useState("idle");
  const [reassignMessage, setReassignMessage] = useState("");
  const [reassignContext, setReassignContext] = useState(null);
  const [reassignDestinationId, setReassignDestinationId] = useState("");
  const [reassignSourceOverride, setReassignSourceOverride] = useState("");
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [renameStatus, setRenameStatus] = useState("idle");
  const [renameMessage, setRenameMessage] = useState("");
  const [activeTitleOverride, setActiveTitleOverride] = useState("");

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
    setDeleteConfirmOpen(false);
    setReassignOpen(false);
    setReassignStatus("idle");
    setReassignMessage("");
    setReassignContext(null);
    setReassignDestinationId("");
    setReassignSourceOverride("");
    setRenameOpen(false);
    setRenameValue("");
    setRenameStatus("idle");
    setRenameMessage("");
    setActiveTitleOverride("");
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

  // B5 danger-confirm recipe (ED1F propagation plan group G3): the
  // browser's native confirm() dialog is replaced by the portable
  // View's own confirm panel. Requesting delete only opens that
  // panel; the callback fires when the panel's own Delete button
  // confirms.
  function handleRequestDelete() {
    if (typeof onDeleteItem !== "function" || !activeOriginalItem) return;
    setDeleteConfirmOpen(true);
  }

  function handleCancelDelete() {
    setDeleteConfirmOpen(false);
  }

  function handleConfirmDelete() {
    setDeleteConfirmOpen(false);
    if (typeof onDeleteItem !== "function" || !activeOriginalItem) return;

    onDeleteItem(
      {
        ...activeOriginalItem,
        imageOutputId: activeMedia?.imageOutputId || "",
      },
      { confirmed: true }
    );
  }

  function handleOpenRename() {
    if (!allowRename || !activeMedia?.imageOutputId) return;
    setRenameOpen(true);
    setRenameStatus("idle");
    setRenameMessage("");
    setRenameValue(
      getImageOutputCustomDisplayName(activeOriginalItem) ||
        activeTitleOverride ||
        activeMedia?.title ||
        ""
    );
  }

  async function persistRename(displayName) {
    if (!activeMedia?.imageOutputId) {
      setRenameStatus("error");
      setRenameMessage("This image does not have an output id.");
      return;
    }

    setRenameStatus("saving");
    setRenameMessage("");

    try {
      const result = await updateImageOutputDisplayName(
        activeMedia.imageOutputId,
        displayName
      );
      const updatedSource = applyImageOutputDisplayNameResult(
        activeOriginalItem || {},
        result
      );
      const nextTitle =
        result?.effectiveTitle ||
        getImageOutputDisplayTitle(updatedSource);

      setActiveTitleOverride(nextTitle);
      setRenameStatus("success");
      setRenameMessage(
        result?.resetToDefault
          ? "Automatic image name restored."
          : "Image name saved."
      );
      setRenameValue(result?.displayName || nextTitle);
      await onRenameItem?.(
        {
          ...activeOriginalItem,
          imageOutputId: activeMedia.imageOutputId,
        },
        result
      );
    } catch (error) {
      setRenameStatus("error");
      setRenameMessage(error?.message || "Image name could not be saved.");
    }
  }

  async function handleSubmitRename(event) {
    event?.preventDefault?.();
    if (renameStatus === "saving") return;

    const nextName = String(renameValue || "").trim();
    if (!nextName) {
      setRenameStatus("error");
      setRenameMessage("Enter an image name or use Reset to default.");
      return;
    }

    await persistRename(nextName);
  }

  async function handleResetRename() {
    if (renameStatus === "saving") return;
    await persistRename("");
  }

  async function handleShare() {
    setShareMessage("");

    try {
      if (navigator?.share) {
        await navigator.share({
          title: activeTitleOverride || activeMedia?.title || "Image",
          url: shareUrl,
        });
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

  async function handleOpenReassign() {
    if (!activeMedia?.canReassign || !activeMedia?.imageOutputId) return;

    const sourceCreationId = reassignSourceOverride || activeMedia.sourceCreationId;

    if (!sourceCreationId) {
      setReassignOpen(true);
      setReassignStatus("error");
      setReassignMessage("This image is not currently assigned to an asset.");
      setReassignContext(null);
      return;
    }

    setReassignOpen(true);
    setReassignStatus("loading");
    setReassignMessage("");
    setReassignContext(null);
    setReassignDestinationId("");

    try {
      const context = await fetchImageReassignmentContext(activeMedia.imageOutputId, {
        sourceCreationId,
      });
      setReassignContext(context);
      setReassignDestinationId(context?.targets?.[0]?.id || "");
      setReassignStatus("ready");
    } catch (error) {
      setReassignStatus("error");
      setReassignMessage(
        error?.message || "Image reassignment options could not be loaded."
      );
    }
  }

  async function handleSubmitReassign(event) {
    event?.preventDefault?.();
    if (reassignStatus === "submitting") return;

    const sourceCreationId =
      reassignSourceOverride ||
      reassignContext?.sourceCreation?.id ||
      activeMedia?.sourceCreationId ||
      "";

    if (!activeMedia?.imageOutputId || !sourceCreationId) {
      setReassignStatus("error");
      setReassignMessage("Source asset is unavailable. Refresh and try again.");
      return;
    }
    if (!reassignDestinationId) {
      setReassignStatus("error");
      setReassignMessage("Choose a destination asset.");
      return;
    }

    setReassignStatus("submitting");
    setReassignMessage("");
    try {
      const result = await reassignImageOutput(activeMedia.imageOutputId, {
        sourceCreationId,
        destinationCreationId: reassignDestinationId,
      });
      setReassignSourceOverride(result?.destinationCreationId || "");
      setReassignStatus("success");
      setReassignMessage(
        result?.destinationTitle
          ? `Image reassigned to ${result.destinationTitle}. 1 Coin used.`
          : "Image reassigned. 1 Coin used."
      );
      setDetailsOpen(false);
      setImageDetails(null);
      await onReassignItem?.(
        { ...activeOriginalItem, imageOutputId: activeMedia.imageOutputId },
        result
      );
    } catch (error) {
      setReassignStatus("error");
      setReassignMessage(error?.message || "Image could not be reassigned.");
    }
  }

  return {
    mediaItems,
    activeMedia: activeMedia
      ? {
          ...activeMedia,
          title: activeTitleOverride || activeMedia.title,
        }
      : null,
    activeId,
    modeLabel,
    imageStudioHref,
    allowDownload: Boolean(allowDownload),
    showStudioActions: Boolean(showStudioActions),
    showDeleteAction: typeof onDeleteItem === "function",
    showRenameAction: Boolean(allowRename && activeMedia?.imageOutputId),
    renameDialog: {
      open: renameOpen,
      value: renameValue,
      status: renameStatus,
      message: renameMessage,
    },
    isLiked,
    isBookmarked,
    shareMessage,
    showReassignAction:
      activeMedia?.canReassign === true &&
      Boolean(activeMedia?.imageOutputId) &&
      Boolean(reassignSourceOverride || activeMedia?.sourceCreationId),
    reassignDialog: {
      open: reassignOpen,
      status: reassignStatus,
      message: reassignMessage,
      coinCost: reassignContext?.coinCost || 1,
      sourceCreation: reassignContext?.sourceCreation || null,
      targets: reassignContext?.targets || [],
      destinationCreationId: reassignDestinationId,
    },
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
      title: activeTitleOverride || activeMedia?.title || "Image",
      reasonKey: reportReasonKey,
      reasonText: reportReasonText,
      status: reportStatus,
      message: reportMessage,
    },
    deleteConfirmOpen,
    onSelectMedia: handleSelectMedia,
    onClose,
    onLike: handleToggleLike,
    onBookmark: handleToggleBookmark,
    onShare: handleShare,
    onRequestDelete: handleRequestDelete,
    onCancelDelete: handleCancelDelete,
    onConfirmDelete: handleConfirmDelete,
    onOpenRename: handleOpenRename,
    onCloseRename: () => setRenameOpen(false),
    onRenameValueChange: setRenameValue,
    onSubmitRename: handleSubmitRename,
    onResetRename: handleResetRename,
    onOpenReassign: handleOpenReassign,
    onCloseReassign: () => setReassignOpen(false),
    onReassignDestinationChange: setReassignDestinationId,
    onSubmitReassign: handleSubmitReassign,
    onOpenDetails: handleOpenDetails,
    onCloseDetails: () => setDetailsOpen(false),
    onOpenReport: handleOpenReport,
    onCloseReport: () => setReportOpen(false),
    onReportReasonKeyChange: setReportReasonKey,
    onReportReasonTextChange: setReportReasonText,
    onSubmitReport: handleSubmitReport,
  };
}
