import {
  Image as ImageIcon,
  Loader2,
  RefreshCw,
} from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";

export default function CreationFeaturedImagePickerModalView({
  slotLabel = "Featured Slot",
  images = [],
  isLoading = false,
  loadErrorMessage = "",
  saveMessage = "",
  saveMessageTone = "notice",
  activeImageId = null,
  hasMoreImages = false,
  refreshDisabled = false,
  onClose = null,
  onRefresh = null,
  onLoadMore = null,
  onChooseImage = null,
}) {
  // ED1C: composes the branded KitModalFrame (veil, panel anatomy,
  // circular close control, A4 full-screen under 700px, superseding
  // the retired R4) instead of a hand-rolled fixed overlay. Content
  // and callbacks are unchanged.
  // ED1d Defect 5: sizing now matches the ruled standard KitModalFrame
  // size (StorylineReferencePickerModal.view.jsx's own
  // `max-w-4xl` + `max-h-[100dvh] ... min-[700px]:max-h-[92dvh]`
  // pattern), replacing the one-off 64rem/90vw/88vh sizing this modal
  // had instead grown on its own.
  return (
    <KitModalFrame
      onClose={onClose}
      ariaLabel="Select featured image"
      panelClassName="w-full max-w-4xl"
    >
      <div className="flex max-h-[100dvh] w-full flex-col min-[700px]:max-h-[92dvh]">
        <div className="flex items-start justify-between gap-4 p-5 pr-16">
          <div>
            <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
              Select Featured Image
            </p>
            <h2 className="mt-2 font-display text-4xl">{slotLabel}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--ink-dim)]">
              Choose an eligible image from this character&apos;s image library.
              Flagged, hidden, or unapproved images are not shown here.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onRefresh?.()}
            disabled={refreshDisabled}
            className="cf-btn cf-btn--secondary cf-btn--sm"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* B1 fade divider, never edge-to-edge. */}
        <div aria-hidden="true" className="mx-5 h-px bg-[image:var(--line-fade)]" />

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {loadErrorMessage ? (
            <p className="rounded-[var(--radius-md)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-4 py-3 text-sm text-[var(--status-danger)]">
              {loadErrorMessage}
            </p>
          ) : null}

          {saveMessage ? (
            <p
              className={`mb-4 rounded-[var(--radius-md)] border px-4 py-3 text-sm ${
                saveMessageTone === "error"
                  ? "border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] text-[var(--status-danger)]"
                  : "border-[var(--line)] bg-[var(--fill)] text-[var(--gold-ornament)]"
              }`}
            >
              {saveMessage}
            </p>
          ) : null}

          {isLoading ? (
            <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] px-4 py-10 text-center">
              <Loader2
                size={28}
                className="mx-auto animate-spin text-[var(--gold-ornament)]"
              />
              <p className="mt-4 text-sm text-[var(--ink-dim)]">
                Loading eligible images...
              </p>
            </div>
          ) : null}

          {!isLoading && !images.length ? (
            <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--line)] bg-[var(--surface-1)] p-8 text-center">
              <ImageIcon size={30} className="mx-auto text-[var(--gold-ornament)]" />
              <p className="mt-4 font-display text-3xl">No eligible images</p>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[var(--ink-dim)]">
                Generate images for this character first, or restore/approve
                images in the character image library.
              </p>
            </div>
          ) : null}

          {images.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {images.map((image, index) => {
                const busy = activeImageId === image?.id;

                return (
                  <button
                    key={image?.id || image?.displayImageUrl || index}
                    type="button"
                    onClick={() => onChooseImage?.(image?.id)}
                    disabled={busy}
                    className="group overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] p-3 text-left transition hover:-translate-y-1 hover:border-[var(--gold-ornament)]/35 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <div className="aspect-[3/4] overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image?.displayImageUrl || ""}
                        alt={image?.altText || "Eligible character library image"}
                        loading={index < 4 ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={index < 4 ? "high" : "low"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>

                    <p className="mt-3 text-xs uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
                      {busy ? "Saving..." : `Use as ${slotLabel}`}
                    </p>

                    <p className="mt-1 line-clamp-1 text-xs text-[var(--ink-dim)]">
                      {image?.metadataLabel || "SFW · CLEAR"}
                    </p>
                  </button>
                );
              })}
            </div>
          ) : null}

          {hasMoreImages ? (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => onLoadMore?.()}
                className="cf-btn cf-btn--secondary"
              >
                Load more
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </KitModalFrame>
  );
}
