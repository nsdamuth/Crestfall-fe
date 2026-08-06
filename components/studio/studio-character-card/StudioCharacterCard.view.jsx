
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
    <article className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)]">
      <div className="aspect-[3/4] bg-[var(--scrim-strong)]">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-[var(--space-4)] text-center text-[length:var(--text-ui)] text-[var(--ink-dim)]">
            No image available
          </div>
        )}
      </div>

      <div className="p-[var(--space-4)]">
        <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
          Canon Official
        </p>

        <h2 className="mt-2 font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] font-medium tabular-nums">
          {title}
        </h2>

        {eyebrow ? (
          <p className="mt-1 text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
            {eyebrow}
          </p>
        ) : null}

        <p className="mt-3 line-clamp-3 text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          {description}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <LinkComponent
            href={detailsHref}
            className="cf-btn cf-btn--secondary cf-btn--sm"
          >
            Details
          </LinkComponent>

          <button
            type="button"
            disabled
            className="cf-btn cf-btn--primary cf-btn--sm"
          >
            Start
          </button>
        </div>
      </div>
    </article>
  );
}
