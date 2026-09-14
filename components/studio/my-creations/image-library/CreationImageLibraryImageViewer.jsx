"use client";

// The my-creations image library's viewer adapter (fe/updates follow-up
// 1, FIX 2, 13 Sep 2026), the same shape as the creation page's
// (components/studio/creations/CreationProfileImageViewer.jsx, commit
// e8c6ba2e) and the Media Studio adapter both model. Injected through
// CreationImageLibraryPage's renderLightbox in place of the legacy
// lightbox on /studio/my-creations/[id]/image-library (and the v2
// editor's image library, which composes the same shell). It keeps
// calling the lightbox ViewModel, so delete (the page's delete flow),
// details, report, share (this page's copy-link handler), save (the
// bookmark reaction), and assign (the reassign call, which refreshes
// the library through onReassignItem) report to the same handlers the
// legacy lightbox called (contract law, FRONTEND-SOP section 13), and
// it renders the lightbox's own dialogs over the Kit viewer.
//
// Legacy actions with no viewer slot, logged in the function map,
// never dropped silently: Generate Variant (the lightbox's link to
// imageStudioHref), Like (onToggleLike; the viewer has no heart, note
// 6), Rename (the pencil; allowRename is off here because the viewer
// has no rename control), and the item strip (onSelectMedia; removed
// from the viewer by contract 2.0.0, RULED 12 Sep 2026).
import KitImageViewer from "@/components/kit/KitImageViewer";
import {
  DeleteConfirmPanel,
  ReassignDialog,
  ReportDialog,
} from "@/components/studio/media/media-lightbox/MediaLightbox.view";
import { useMediaLightboxViewModel } from "@/components/studio/media/media-lightbox/useMediaLightboxViewModel";

import { getCreationLibraryDimensions } from "./creation-image-library-page/useCreationImageLibraryPageViewModel";

const NOT_AVAILABLE_LABEL = "Not available yet";
const SOON_LABEL = "Soon";

// Download sizes ride the file proxy's variants for the owner's own
// outputs, as on Media Studio: thumbnail (Small), card (Medium), the
// original (Large, what the legacy Download pointed at through the
// output's display URL). An item with no output id offers only its
// display URL as Large. Extra Large is the upscaled file, which no job
// produces yet (gap 9).
function buildDownloadOptions({ imageOutputId, imageUrl }) {
  const extraLarge = {
    id: "extra-large",
    label: "Extra Large",
    disabled: true,
    tooltip: SOON_LABEL,
    title: NOT_AVAILABLE_LABEL,
  };

  if (imageOutputId) {
    const base = `/api/studio/image-generation/outputs/${encodeURIComponent(imageOutputId)}/file`;
    return [
      { id: "small", label: "Small", href: `${base}?variant=thumbnail` },
      { id: "medium", label: "Medium", href: `${base}?variant=card` },
      { id: "large", label: "Large", href: base, showsPixelSize: true },
      extraLarge,
    ];
  }

  if (!imageUrl) return [];
  return [{ id: "large", label: "Large", href: imageUrl, showsPixelSize: true }, extraLarge];
}

export default function CreationImageLibraryImageViewer({ viewerCoinCosts = null, ...lightboxProps }) {
  const lightbox = useMediaLightboxViewModel({
    ...lightboxProps,
    allowRename: false,
  });

  const media = lightbox.activeMedia;
  if (!media) return null;

  const stored = getCreationLibraryDimensions(media.originalItem);
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
      downloadOptions={
        lightbox.allowDownload
          ? buildDownloadOptions({ imageOutputId: media.imageOutputId, imageUrl: media.imageUrl })
          : []
      }
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
