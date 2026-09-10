"use client";

// The live page's image viewer adapter (FE/MEDIA-STUDIO session 3,
// notes 6 and 6a, 10 Sep 2026). Injected through MediaHistoryGridSkin's
// renderLightbox in place of MediaLightbox on this page only. It keeps
// calling the lightbox ViewModel, so delete, details, report, share,
// and assign (the reassign call) report to the same handlers they
// always did (contract law), and it renders the lightbox's own
// dialogs over the Kit viewer. Rename and like are not wired: note 6
// removes the pencil and the heart from this viewer.
import KitImageViewer from "@/components/kit/KitImageViewer";
import {
  DeleteConfirmPanel,
  DetailsDialog,
  ReassignDialog,
  ReportDialog,
} from "@/components/studio/media/media-lightbox/MediaLightbox.view";
import { useMediaLightboxViewModel } from "@/components/studio/media/media-lightbox/useMediaLightboxViewModel";
import { getMediaHistoryStoredDimensions } from "@/components/studio/image-studio/media-history-grid/useMediaHistoryGridViewModel";

const NOT_AVAILABLE_LABEL = "Not available yet";
const SOON_LABEL = "Soon";

// Download sizes ride the file proxy's variants: thumbnail (Small),
// card (Medium), the original (Large). Extra Large is the upscaled
// file, which no job produces yet (gap 9).
function buildDownloadOptions({ imageOutputId, imageUrl }) {
  const base = imageOutputId
    ? `/api/studio/image-generation/outputs/${encodeURIComponent(imageOutputId)}/file`
    : imageUrl || "";
  if (!base) return [];
  return [
    { id: "small", label: "Small", href: `${base}?variant=thumbnail` },
    { id: "medium", label: "Medium", href: `${base}?variant=card` },
    { id: "large", label: "Large", href: base, showsPixelSize: true },
    { id: "extra-large", label: "Extra Large", disabled: true, tooltip: SOON_LABEL, title: NOT_AVAILABLE_LABEL },
  ];
}

export default function ImagesV2ImageViewer({ viewerCoinCosts = null, ...lightboxProps }) {
  const lightbox = useMediaLightboxViewModel({
    ...lightboxProps,
    allowRename: false,
    showStudioActions: false,
  });

  const media = lightbox.activeMedia;
  if (!media) return null;

  const stored = getMediaHistoryStoredDimensions(media.originalItem);
  const pixelSize = stored.width && stored.height ? stored : null;

  const overlaySlot = (
    <>
      {lightbox.deleteConfirmOpen ? (
        <DeleteConfirmPanel
          onCancelDelete={() => lightbox.onCancelDelete?.()}
          onConfirmDelete={() => lightbox.onConfirmDelete?.()}
        />
      ) : null}
      {lightbox.detailsDialog.open ? (
        <DetailsDialog {...lightbox.detailsDialog} onClose={() => lightbox.onCloseDetails?.()} />
      ) : null}
      {lightbox.reassignDialog.open ? (
        <ReassignDialog
          eyebrow="Assign"
          {...lightbox.reassignDialog}
          onDestinationChange={lightbox.onReassignDestinationChange}
          onSubmit={lightbox.onSubmitReassign}
          onClose={lightbox.onCloseReassign}
        />
      ) : null}
      {lightbox.reportDialog.open ? (
        <ReportDialog
          {...lightbox.reportDialog}
          reasonOptions={lightbox.reportReasonOptions}
          onReasonKeyChange={lightbox.onReportReasonKeyChange}
          onReasonTextChange={lightbox.onReportReasonTextChange}
          onSubmit={lightbox.onSubmitReport}
          onClose={() => lightbox.onCloseReport?.()}
        />
      ) : null}
    </>
  );

  return (
    <KitImageViewer
      imageSrc={media.imageUrl}
      title={media.title}
      items={lightbox.mediaItems}
      activeId={lightbox.activeId}
      onSelectItem={lightbox.onSelectMedia}
      pixelSize={pixelSize}
      isSaved={lightbox.isBookmarked}
      onSave={lightbox.onBookmark}
      onDelete={lightbox.showDeleteAction ? lightbox.onRequestDelete : null}
      onReport={lightbox.onOpenReport}
      onDetails={lightbox.onOpenDetails}
      onShare={lightbox.onShare}
      shareMessage={lightbox.shareMessage}
      downloadOptions={
        lightbox.allowDownload
          ? buildDownloadOptions({ imageOutputId: media.imageOutputId, imageUrl: media.imageUrl })
          : []
      }
      assignState={lightbox.showReassignAction ? "ready" : "soon"}
      onAssign={lightbox.onOpenReassign}
      upscaleCoinCost={viewerCoinCosts?.upscale}
      upscaleState="soon"
      onUpscale={null}
      editRunCoinCost={viewerCoinCosts?.editRun}
      editState="soon"
      onSubmitEdit={null}
      overlaySlot={overlaySlot}
      overlayReplacesBody={Boolean(lightbox.deleteConfirmOpen)}
      onClose={lightbox.onClose}
    />
  );
}
