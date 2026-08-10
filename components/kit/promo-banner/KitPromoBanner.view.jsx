// Hierarchy law, 9 Aug 2026 (docs/BUILD-BLUEPRINT.md 2.16(f)): one
// primary CTA emphasized, description de-emphasized and measure
// capped, the stack spaced on the ladder, no crowding. The `top`
// treatment can carry the galaxy layer (the existing .cf-galaxy
// recipe from app/design-system.css, reduced-motion safe), layered
// between the art and the veil.
const TREATMENT_CONFIG = {
  top: {
    radius: "rounded-[var(--radius-lg)]",
    aspect: "aspect-[4/3] min-[700px]:aspect-[21/9]",
    veil: "bg-gradient-to-t from-[var(--scrim-strong)] to-transparent",
    body: "items-start justify-end text-left",
    line: "",
  },
  card: {
    // Corners final ruling: the in-flow banner card is a STANDARD
    // surface (sits alongside siblings), never the large-radius tier.
    radius: "rounded-[var(--radius-md)]",
    aspect: "aspect-[4/3] min-[700px]:aspect-[16/9]",
    veil: "bg-gradient-to-r from-[var(--scrim-strong)] to-transparent",
    body: "items-start justify-end text-left",
    line: "",
  },
  bottom: {
    radius: "rounded-[var(--radius-lg)]",
    aspect: "aspect-[4/3] min-[700px]:aspect-[21/9]",
    veil: null, // resolved from bottomVariant below
    body: "items-center justify-center text-center",
    line: "mx-auto",
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
  showGalaxy = false,
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
      className={`relative isolate overflow-hidden ${config.radius} ${config.aspect}`}
    >
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-[var(--surface-2)]" aria-hidden="true" />
      )}

      {showGalaxy && treatment === "top" && (
        <div aria-hidden="true" className="absolute inset-0 isolate overflow-hidden">
          <div className="cf-galaxy" />
        </div>
      )}

      <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${veilClass}`} />

      <div
        className={`relative z-[1] flex h-full w-full flex-col p-[var(--space-6)] min-[700px]:px-[var(--space-8)] min-[700px]:py-[var(--space-8)] ${config.body}`}
      >
        {eyebrow && (
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--art-gold)]">
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-heading)] leading-[var(--lh-heading)] text-[var(--art-ink)]">
            {title}
          </h2>
        )}
        {line && (
          <p
            className={`mt-[var(--space-2)] max-w-[30rem] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--art-ink-dim)] ${config.line}`}
          >
            {line}
          </p>
        )}
        {ctaLabel && (
          <button
            type="button"
            onClick={() => onCtaClick?.()}
            className="cf-btn cf-btn--primary mt-[var(--space-4)] w-fit"
          >
            {ctaLabel}
          </button>
        )}
      </div>
    </div>
  );
}
