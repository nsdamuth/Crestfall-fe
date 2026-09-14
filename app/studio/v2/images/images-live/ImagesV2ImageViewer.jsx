"use client";

// The live page's image viewer adapter (FE/MEDIA-STUDIO session 3,
// notes 6 and 6a, 10 Sep 2026). Injected through MediaHistoryGridSkin's
// renderLightbox in place of MediaLightbox on this page only. It keeps
// calling the lightbox ViewModel, so delete, details, report, and
// assign (the reassign call) report to the same handlers they always
// did (contract law), and it renders the lightbox's own dialogs over
// the Kit viewer. Rename and like are not wired: note 6 removes the
// pencil and the heart from this viewer. Share (fe/share-og follow-up
// 1, item 5) opens the one Kit share sheet with the image kind on this
// page only; the lightbox's own share handler stays wired on the
// legacy Images page and the creation image library.
import KitImageViewer from "@/components/kit/KitImageViewer";
import KitShareSheet from "@/components/kit/KitShareSheet";
import { useKitShareController } from "@/components/kit/share/useKitShareController";
import { useStudioAccount } from "@/components/studio/StudioAccountProvider";
import {
  DeleteConfirmPanel,
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

// The two stored derivatives the share sheet may show, through the
// same file proxy the download menu uses: card is the medium size,
// display the large one. The base URL, the original, is never handed
// to the share package.
function buildShareMedia({ imageOutputId }) {
  if (!imageOutputId) return {};
  const base = `/api/studio/image-generation/outputs/${encodeURIComponent(imageOutputId)}/file`;
  return {
    cardUrl: `${base}?variant=card`,
    displayUrl: `${base}?variant=display`,
  };
}

export default function ImagesV2ImageViewer({ viewerCoinCosts = null, ...lightboxProps }) {
  const lightbox = useMediaLightboxViewModel({
    ...lightboxProps,
    allowRename: false,
    showStudioActions: false,
  });
  const { accountProfile } = useStudioAccount();
  const share = useKitShareController({ sharerUsername: accountProfile?.username || "" });

  const media = lightbox.activeMedia;
  if (!media) return null;

  // The library is the signed-in creator's own, so the byline (the
  // creator) and the ref (the sharer) are the same account here.
  function handleShare() {
    share.open({
      mediaType: "IMAGE",
      id: media.imageOutputId,
      title: media.title,
      creatorUsername: accountProfile?.username || "",
      sourceCreationId: media.sourceCreationId,
      media: buildShareMedia({ imageOutputId: media.imageOutputId }),
    });
  }

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
    <>
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
        assignOpen={Boolean(lightbox.reassignDialog.open)}
        assignPanel={{ ...lightbox.reassignDialog, eyebrow: "Assign" }}
        onCloseAssign={lightbox.onCloseReassign}
        onAssignDestinationChange={lightbox.onReassignDestinationChange}
        onSubmitAssign={lightbox.onSubmitReassign}
        onShare={media.imageOutputId ? handleShare : null}
        shareMessage=""
        downloadOptions={
          lightbox.allowDownload
            ? buildDownloadOptions({ imageOutputId: media.imageOutputId, imageUrl: media.imageUrl })
            : []
        }
        assignState={lightbox.showReassignAction ? "ready" : "soon"}
        onAssign={
          lightbox.reassignDialog.open
            ? lightbox.onCloseReassign
            : lightbox.onOpenReassign
        }
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
      <KitShareSheet {...share.sheetProps} />
    </>
  );
}
