import { Camera, Library, MessageCircle, UserRound } from "lucide-react";

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
    <aside className="self-start rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black/45 p-5 xl:sticky xl:top-24">
      <div className="aspect-[3/4] overflow-hidden rounded-[var(--radius-md)] border border-white/10 bg-gradient-to-br from-black via-black/80 to-[var(--muted-gold)]/10">
        {activeMedia?.imageUrl ? (
          <img
            src={activeMedia.imageUrl}
            alt={creationTitle || "Creation media"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <p className="font-display text-5xl text-[var(--muted-gold)]">
                {fallbackInitial}
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
                Featured Media Slot
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">
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
            className={`aspect-square overflow-hidden rounded-xl border text-[10px] uppercase tracking-[0.12em] transition ${
              media.isActive
                ? "border-[var(--muted-gold)]/65 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                : "border-white/10 bg-black/30 text-[var(--muted)] hover:border-[var(--muted-gold)]/35"
            }`}
          >
            {media.imageUrl ? (
              <img
                src={media.imageUrl}
                alt={media.label}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center p-2 text-center">
                {media.label}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        <button
          type="button"
          onClick={() => onReplaceActiveSlot?.()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
        >
          <Library size={14} />
          Replace Slot
        </button>

        <LinkComponent
          href={imageLibraryHref}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
        >
          <Camera size={14} />
          Go to Library
        </LinkComponent>
      </div>

      <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
        Choose four featured images from this creation&apos;s image library. The
        Primary slot becomes the default identity reference image.
      </p>

      {supportsChatMedia ? (
        <section className="mt-6 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4">
          ...
        </section>
      ) : (
        <section className="mt-6 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            {nonChatContextTitle}
          </p>

          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
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
          className={`flex shrink-0 items-center justify-center overflow-hidden border border-[var(--muted-gold)]/25 bg-[var(--muted-gold)]/10 text-[var(--muted-gold)] ${
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
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            {label}
          </p>
          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        disabled
        className="mt-3 w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] opacity-60"
      >
        {buttonLabel}
      </button>
    </article>
  );
}
