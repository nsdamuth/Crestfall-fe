const TREATMENT_CONFIG = {
  top: {
    radius: "rounded-[var(--radius-lg)]",
    aspect: "aspect-[21/9]",
    veil: "bg-gradient-to-t from-[var(--scrim-strong)] to-transparent",
    body: "items-start justify-end text-left",
  },
  card: {
    // Corners final ruling: the in-flow banner card is a STANDARD
    // surface (sits alongside siblings), never the large-radius tier.
    radius: "rounded-[var(--radius-md)]",
    aspect: "aspect-[16/9]",
    veil: "bg-gradient-to-r from-[var(--scrim-strong)] to-transparent",
    body: "items-start justify-end text-left",
  },
  bottom: {
    radius: "rounded-[var(--radius-lg)]",
    aspect: "aspect-[21/9]",
    veil: null, // resolved from bottomVariant below
    body: "items-center justify-center text-center",
  },
};

function resolveBottomVeil(bottomVariant) {
  return bottomVariant === "bottom-fade"
    ? "bg-gradient-to-t from-[var(--scrim-strong)] to-transparent"
    : "bg-[var(--scrim-strong)]";
}

export default function KitPromoBannerView({
  treatment = "bottom",
  bottomVariant = "uniform",
  eyebrow = "",
  title = "",
  line = "",
  ctaLabel = "",
  imageSrc = null,
  onCtaClick = null,
}) {
  const config = TREATMENT_CONFIG[treatment] || TREATMENT_CONFIG.bottom;
  const veilClass =
    treatment === "bottom" ? resolveBottomVeil(bottomVariant) : config.veil;

  return (
    <div
      className={`relative overflow-hidden ${config.radius} ${config.aspect}`}
    >
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-[var(--surface-2)]" aria-hidden="true" />
      )}

      <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${veilClass}`} />

      <div
        className={`relative z-[1] flex h-full w-full flex-col gap-[var(--space-2)] p-[var(--space-6)] ${config.body}`}
      >
        {eyebrow && (
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--art-gold)]">
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="font-display text-[length:var(--text-heading)] leading-[var(--lh-heading)] text-[var(--art-ink)]">
            {title}
          </h2>
        )}
        {line && (
          <p className="max-w-[30rem] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--art-ink-dim)]">
            {line}
          </p>
        )}
        {ctaLabel && (
          <button type="button" onClick={() => onCtaClick?.()} className="cf-btn cf-btn--primary w-fit">
            {ctaLabel}
          </button>
        )}
      </div>
    </div>
  );
}
