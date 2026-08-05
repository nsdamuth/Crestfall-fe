import {
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";

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
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[var(--scrim-strong)] p-4 backdrop-blur-[var(--blur-panel)]">
      <div className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--gold-ornament)]/25 bg-[#080706] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
              Select Featured Image
            </p>
            <h2 className="mt-2 font-display text-4xl">{slotLabel}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--ink-dim)]">
              Choose an eligible image from this character&apos;s image library.
              Flagged, hidden, or unapproved images are not shown here.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onRefresh?.()}
              disabled={refreshDisabled}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw size={14} />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => onClose?.()}
              className="rounded-xl border border-white/10 bg-black/25 p-3 text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
              aria-label="Close image picker"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {loadErrorMessage ? (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {loadErrorMessage}
            </p>
          ) : null}

          {saveMessage ? (
            <p
              className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
                saveMessageTone === "error"
                  ? "border-red-500/30 bg-red-500/10 text-red-200"
                  : "border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 text-[var(--gold-ornament)]"
              }`}
            >
              {saveMessage}
            </p>
          ) : null}

          {isLoading ? (
            <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-10 text-center">
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
            <div className="rounded-[var(--radius-md)] border border-dashed border-white/10 bg-black/25 p-8 text-center">
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
                    className="group overflow-hidden rounded-[var(--radius-md)] border border-white/10 bg-black/30 p-3 text-left transition hover:-translate-y-1 hover:border-[var(--gold-ornament)]/35 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <div className="aspect-[3/4] overflow-hidden rounded-xl border border-white/10 bg-black/40">
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

                    <p className="mt-3 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)]">
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
                className="rounded-xl border border-[var(--gold-ornament)]/30 bg-[var(--gold-ornament)]/10 px-5 py-3 text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20 hover:text-[var(--ink)]"
              >
                Load More
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
