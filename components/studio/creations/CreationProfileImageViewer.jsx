"use client";

// The creation page's image viewer adapter (fe/updates, package
// CREATION-VIEWER, 13 Sep 2026; ruled approach A of three). Modeled on
// app/studio/v2/images/images-live/ImagesV2ImageViewer.jsx and mounted
// through CreationProfilePage's lightboxSlot in place of MediaLightbox
// on /studio/creations/[id] only. It keeps calling the lightbox
// ViewModel, so report, details, share (this page's copy-link handler),
// save (the bookmark reaction), and assign (the reassign call) report
// to the same handlers the legacy lightbox called (contract law,
// FRONTEND-SOP section 13), and it renders the lightbox's own dialogs
// over the Kit viewer.
//
// Legacy actions with no viewer slot, reported in STATUS and the
// function map, never dropped silently: Generate Variant (the
// lightbox's ViewerBarLink to creation.imageStudioHref), Like
// (onToggleLike; the viewer has no heart, note 6), and the item strip
// (onSelectMedia; removed from the viewer by contract 2.0.0, RULED 12
// Sep 2026). Delete never existed on this page (no onDeleteItem), so
// the viewer hides it and the confirm panel below never opens.
import KitImageViewer from "@/components/kit/KitImageViewer";
import {
  DeleteConfirmPanel,
  ReassignDialog,
  ReportDialog,
} from "@/components/studio/media/media-lightbox/MediaLightbox.view";
import { useMediaLightboxViewModel } from "@/components/studio/media/media-lightbox/useMediaLightboxViewModel";
import { getMediaHistoryStoredDimensions } from "@/components/studio/image-studio/media-history-grid/useMediaHistoryGridViewModel";

const NOT_AVAILABLE_LABEL = "Not available yet";
const SOON_LABEL = "Soon";

// Download sizes ride the derivatives the catalogue already serves on
// each media item (lib/shared/creations/creationMedia.js): thumbnail
// (Small), card (Medium), and the display URL the legacy lightbox's
// Download control pointed at (Large). A derivative that is missing or
// identical to the large one is left out rather than offered twice.
// Extra Large is the upscaled file, which no job produces yet (gap 9).
function buildDownloadOptions(item) {
  const large = item?.imageUrl || item?.displayUrl || "";
  if (!large) return [];

  const small = item?.thumbnailUrl && item.thumbnailUrl !== large ? item.thumbnailUrl : "";
  const medium = item?.cardUrl && item.cardUrl !== large ? item.cardUrl : "";

  return [
    small ? { id: "small", label: "Small", href: small } : null,
    medium ? { id: "medium", label: "Medium", href: medium } : null,
    { id: "large", label: "Large", href: large, showsPixelSize: true },
    { id: "extra-large", label: "Extra Large", disabled: true, tooltip: SOON_LABEL, title: NOT_AVAILABLE_LABEL },
  ].filter(Boolean);
}

export default function CreationProfileImageViewer({ viewerCoinCosts = null, ...lightboxProps }) {
  const lightbox = useMediaLightboxViewModel({
    ...lightboxProps,
    allowRename: false,
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
      pixelSize={pixelSize}
      isSaved={lightbox.isBookmarked}
      onSave={lightbox.onBookmark}
      onDelete={lightbox.showDeleteAction ? lightbox.onRequestDelete : null}
      onReport={lightbox.onOpenReport}
      detailsOpen={Boolean(lightbox.detailsDialog.open)}
      detailsPanel={lightbox.detailsDialog}
      onDetails={lightbox.detailsDialog.open ? lightbox.onCloseDetails : lightbox.onOpenDetails}
      onCloseDetails={lightbox.onCloseDetails}
      onShare={lightbox.onShare}
      shareMessage={lightbox.shareMessage}
      downloadOptions={lightbox.allowDownload ? buildDownloadOptions(media.originalItem) : []}
      bottomBarAction="assign"
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
