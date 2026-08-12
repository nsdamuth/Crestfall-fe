import { Camera, Library, MessageCircle, UserRound } from "lucide-react";

import KitArtPlaceholderView from "@/components/kit/art-placeholder/KitArtPlaceholder.view";

export default function CreationEditMediaPanelView({
  creationTitle = "",
  fallbackInitial = "C",
  activeMedia = null,
  featuredSlots = [],
  imageLibraryHref = "#",
  supportsChatMedia = true,
  nonChatContextTitle = "Image Studio Ingredient",
  nonChatContextDescription =
    "This creation is a reusable image-generation ingredient. It can provide prompt guidance, design references, preview media, and future Image Studio selection behavior, but it is not a chat character.",
  onSelectFeaturedSlot = null,
  onReplaceActiveSlot = null,
  LinkComponent = "a",
} = {}) {
  const safeFeaturedSlots = Array.isArray(featuredSlots) ? featuredSlots : [];

  return (
    <aside className="self-start rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-5 xl:sticky xl:top-24">
      <div className="aspect-[3/4] overflow-hidden rounded-[var(--radius-md)] border border-white/10 bg-gradient-to-br from-black via-black/80 to-[var(--gold-ornament)]/10">
        {activeMedia?.imageUrl ? (
          <img
            src={activeMedia.imageUrl}
            alt={creationTitle || "Creation media"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center">
            <KitArtPlaceholderView size="lg" />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--ink-dim)]">
                Featured Media Slot
              </p>
              <p className="mt-2 text-sm text-[var(--ink-dim)]">
                {activeMedia?.label || "No slot selected"}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {safeFeaturedSlots.map((media) => (
          <button
            key={media.id}
            type="button"
            onClick={() => onSelectFeaturedSlot?.(media.index)}
            aria-label={media.label}
            className={`aspect-square overflow-hidden rounded-xl border text-[10px] uppercase tracking-[0.12em] transition ${
              media.isActive
                ? "border-[var(--gold-ornament)]/65 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
                : "border-white/10 bg-black/30 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/35"
            }`}
          >
            {media.imageUrl ? (
              <img
                src={media.imageUrl}
                alt={media.label}
                className="h-full w-full object-cover"
              />
            ) : (
              <KitArtPlaceholderView size="sm" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        <button
          type="button"
          onClick={() => onReplaceActiveSlot?.()}
          className="cf-btn cf-btn--primary"
        >
          <Library size={14} />
          Replace slot
        </button>

        <LinkComponent
          href={imageLibraryHref}
          className="cf-btn cf-btn--secondary"
        >
          <Camera size={14} />
          Go to library
        </LinkComponent>
      </div>

      <p className="mt-4 text-xs leading-5 text-[var(--ink-dim)]">
        Choose four featured images from this creation&apos;s image library. The
        Primary slot becomes the default identity reference image.
      </p>

      {supportsChatMedia ? (
        <section className="mt-6 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4">
          ...
        </section>
      ) : (
        <section className="mt-6 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--gold-ornament)]">
            {nonChatContextTitle}
          </p>

          <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
            {nonChatContextDescription}
          </p>
        </section>
      )}
    </aside>
  );
}

function ChatMediaSlot({
  label,
  description,
  imageUrl,
  fallback,
  icon: Icon,
  compact = false,
  buttonLabel,
}) {
  return (
    <article className="rounded-xl border border-white/10 bg-black/30 p-3">
      <div className="flex items-center gap-3">
        <div
          className={`flex shrink-0 items-center justify-center overflow-hidden border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 text-[var(--gold-ornament)] ${
            compact ? "h-14 w-14 rounded-[var(--radius-md)]" : "h-16 w-16 rounded-full"
          }`}
        >
          {imageUrl ? (
            <img src={imageUrl} alt={label} className="h-full w-full object-cover" />
          ) : (
            <div className="text-center">
              <Icon className="mx-auto" size={compact ? 17 : 20} />
              <p className="mt-0.5 font-display text-lg leading-none">
                {fallback}
              </p>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
            {label}
          </p>
          <p className="mt-1 text-xs leading-5 text-[var(--ink-dim)]">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        disabled
        className="cf-btn cf-btn--secondary cf-btn--sm mt-3 w-full"
      >
        {buttonLabel}
      </button>
    </article>
  );
}
