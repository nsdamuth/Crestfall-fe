import {
  Image as ImageIcon,
  Loader2,
  RefreshCw,
} from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";

// ED1G SW7: migrated off the hand-rolled fixed-inset overlay onto the
// branded KitModalFrame (A4 bottom-anchor under 700px, unsaved-dismiss
// wiring available to a future caller, --blur-panel instead of the
// raw backdrop-blur-[2px] literal, 44px circular close control).
// Sizing matches the sibling featured-image picker's ruled standard
// (`max-w-4xl`, closing the prior max-w-5xl width-tier overshoot).
export default function CreationReferenceImagePickerModalView({
  referenceLabel = "Reference Image",
  referenceGuidance =
    "For best identity fidelity, choose a square (1:1) reference image. Non-square images may be cropped or resized during reference conditioning.",
  images = [],
  isLoading = false,
  loadErrorMessage = "",
  hasMoreImages = false,
  refreshDisabled = false,
  onClose = null,
  onRefresh = null,
  onLoadMore = null,
  onChooseImage = null,
}) {
  return (
    <KitModalFrame
      onClose={onClose}
      ariaLabel="Select visual reference"
      panelClassName="w-full max-w-4xl"
    >
      <div className="flex max-h-[100dvh] w-full flex-col min-[700px]:max-h-[92dvh]">
        <div className="flex items-start justify-between gap-4 p-5 pr-16">
          <div>
            <p className="text-xs uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
              Select Visual Reference
            </p>
            <h2 className="mt-2 font-display text-4xl">{referenceLabel}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--ink-dim)]">
              Choose an eligible image from this creation&apos;s image library.
              Hidden, blocked, or missing-output images are not shown.
            </p>
            {referenceGuidance ? (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--gold-ornament)]">
                {referenceGuidance}
              </p>
            ) : null}
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
              <ImageIcon
                size={30}
                className="mx-auto text-[var(--gold-ornament)]"
              />
              <p className="mt-4 font-display text-3xl">No eligible images</p>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[var(--ink-dim)]">
                Generate images for this character first, then choose one as an
                anime or realistic reference.
              </p>
            </div>
          ) : null}

          {images.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {images.map((image, index) => (
                <button
                  key={image?.id || image?.displayImageUrl || index}
                  type="button"
                  onClick={() => onChooseImage?.(image?.id)}
                  className="group overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] p-3 text-left transition hover:-translate-y-1 hover:border-[var(--gold-ornament)]/35"
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)]">
                    {image?.displayImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image.displayImageUrl}
                        alt={image?.altText || "Eligible visual reference"}
                        loading={index < 4 ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={index < 4 ? "high" : "low"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center p-4 text-center text-xs text-[var(--ink-dim)]">
                        Image preview unavailable
                      </div>
                    )}
                  </div>

                  <p className="mt-3 text-xs uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
                    Use as {referenceLabel}
                  </p>

                  <p className="mt-1 line-clamp-1 text-xs text-[var(--ink-dim)]">
                    {image?.metadataLabel || "SFW · CLEAR"}
                  </p>
                </button>
              ))}
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
