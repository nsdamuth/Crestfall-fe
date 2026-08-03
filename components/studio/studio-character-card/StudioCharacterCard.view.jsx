
export default function StudioCharacterCardView({
  imageSrc = "",
  imageAlt = "",
  title = "",
  eyebrow = "",
  description = "Official Crestfall character.",
  detailsHref = "#",
  LinkComponent = "a",
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[var(--muted-gold)]/15 bg-black/45 transition hover:border-[var(--muted-gold)]/40">
      <div className="aspect-[3/4] bg-black/50">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-[var(--muted)]">
            No image available
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--muted-gold)]">
          Canon Official
        </p>

        <h2 className="mt-2 font-display text-2xl leading-tight">{title}</h2>

        {eyebrow ? (
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
            {eyebrow}
          </p>
        ) : null}

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--muted)]">
          {description}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <LinkComponent
            href={detailsHref}
            className="rounded-lg border border-white/10 px-3 py-2 text-center text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
          >
            Details
          </LinkComponent>

          <button
            type="button"
            disabled
            className="rounded-lg border border-[var(--muted-gold)]/25 bg-[var(--muted-gold)]/10 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[var(--muted-gold)] opacity-70"
          >
            Start
          </button>
        </div>
      </div>
    </article>
  );
}
