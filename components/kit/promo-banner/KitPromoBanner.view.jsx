// Hierarchy law, 9 Aug 2026 (docs/BUILD-BLUEPRINT.md 2.16(f)): one
// primary CTA emphasized, description de-emphasized and measure
// capped, the stack spaced on the ladder, no crowding. The `top`
// treatment can carry the galaxy layer (the existing .cf-galaxy
// recipe from app/design-system.css, reduced-motion safe), layered
// between the art and the veil.
// Heights reduced about 20% across every treatment, RULED 9 Aug 2026
// (kit polish 2 pass): each aspect ratio's height term is the prior
// term times 0.8 (4/3 -> 5/3, 21/9 -> 35/12, 16/9 -> 20/9), so the
// banner is meaningfully shorter without an arbitrary round number.
// Art anchor, RULED 11 Aug 2026 (banner-anchor ruling, supersedes the
// 10 Aug kit polish 3 pass measurement): banner art pins toward the
// top of its frame with roughly a 10% downward bias by default, so
// faces and subjects stay visible across the whole draft pool, not
// just the one wide asset the 10 Aug pass measured against. The
// default lives in the imageAnchor prop below; a caller overrides it
// per image where the ruled default does not read well (see
// docs/reviews/BANNER-AUDIT.md for the per-slot survey).
const TREATMENT_CONFIG = {
  top: {
    radius: "rounded-[var(--radius-lg)]",
    aspect: "aspect-[5/3] min-[700px]:aspect-[35/12]",
    veil: "bg-gradient-to-t from-[var(--scrim-strong)] to-transparent",
    body: "items-start justify-end text-left",
    line: "",
  },
  card: {
    // Corners final ruling: the in-flow banner card is a STANDARD
    // surface (sits alongside siblings), never the large-radius tier.
    radius: "rounded-[var(--radius-md)]",
    aspect: "aspect-[5/3] min-[700px]:aspect-[20/9]",
    veil: "bg-gradient-to-r from-[var(--scrim-strong)] to-transparent",
    body: "items-start justify-end text-left",
    line: "",
  },
  bottom: {
    radius: "rounded-[var(--radius-lg)]",
    // R6 (10 Aug 2026, kit polish 3 pass): mobile aspect moves from
    // 5/3 to 1/1, a 67 percent height increase so more artwork shows;
    // desktop unchanged. The top and card treatments are untouched
    // (R6 names the bottom promo banner only).
    aspect: "aspect-[1/1] min-[700px]:aspect-[35/12]",
    veil: null, // resolved from bottomVariant below
    body: "items-center justify-center text-center",
    line: "mx-auto",
  },
};

function PromoBannerEmptyArtwork({ variant = "default" }) {
  if (variant === "crestfall-gray-wordmark") {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 74% 28%, rgba(255,255,255,0.055), transparent 28%), linear-gradient(135deg, #303030 0%, #181818 52%, #262626 100%)",
        }}
      >
        <div
          className="absolute inset-[3%] rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--gold-ornament)_28%,transparent)]"
        />
        <div
          aria-hidden="true"
          className="absolute left-[8%] right-[8%] top-[15%] h-px bg-[image:var(--line-fade)] opacity-70"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-[15%] left-[8%] right-[8%] h-px bg-[image:var(--line-fade)] opacity-50"
        />
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-[15%] h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rotate-45 border border-[color-mix(in_srgb,var(--gold-ornament)_50%,transparent)]"
        />
        <span className="select-none font-display text-[clamp(5.5rem,15vw,15rem)] leading-[0.82] tracking-[0.08em] text-[rgba(238,238,238,0.22)] drop-shadow-[0_2px_18px_rgba(0,0,0,0.42)] max-[700px]:text-[clamp(4rem,19vw,7.5rem)] max-[700px]:tracking-[0.045em]">
          CRESTFALL
        </span>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center bg-[var(--surface-2)]"
    >
      <svg viewBox="0 0 64 64" className="h-[var(--space-16)] w-[var(--space-16)] text-[var(--ink-faint)]">
        <use href="/assets/icons/icons-v7.svg#i-59" />
      </svg>
    </div>
  );
}

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
  imageAnchor = "center 10%",
  emptyArtworkVariant = "default",
  onCtaClick = null,
  secondaryCtaLabel = "",
  onSecondaryCtaClick = null,
  enhanceTextReadability = false,
}) {
  const config = TREATMENT_CONFIG[treatment] || TREATMENT_CONFIG.bottom;
  const veilClass =
    treatment === "bottom" ? resolveBottomVeil(bottomVariant) : config.veil;
  const readabilityClass = enhanceTextReadability
    ? "cf-art-text-readable"
    : "";

  return (
    <div
      className={`relative isolate overflow-hidden ${config.radius} ${config.aspect}`}
    >
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt=""
          loading={treatment === "bottom" ? "lazy" : "eager"}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: imageAnchor }}
        />
      ) : (
        <PromoBannerEmptyArtwork variant={emptyArtworkVariant} />
      )}

      {showGalaxy && treatment === "top" && (
        <div aria-hidden="true" className="absolute inset-0 isolate overflow-hidden">
          <div className="cf-galaxy" />
        </div>
      )}

      <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${veilClass}`} />

      <div
        className={`relative z-[1] flex h-full w-full flex-col p-[var(--space-5)] min-[700px]:px-[var(--space-8)] min-[700px]:py-[var(--space-6)] ${config.body}`}
      >
        {eyebrow && (
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--art-gold)]">
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className={`mt-[var(--space-2)] font-display text-[length:var(--text-heading)] leading-[var(--lh-heading)] text-[var(--art-ink)] ${readabilityClass}`}>
            {title}
          </h2>
        )}
        {line && (
          <p
            className={`mt-[var(--space-2)] max-w-[30rem] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--art-ink-dim)] ${config.line} ${readabilityClass}`}
          >
            {line}
          </p>
        )}
        {(ctaLabel || secondaryCtaLabel) && (
          <div className="mt-[var(--space-4)] flex flex-wrap items-center gap-[var(--space-3)]">
            {ctaLabel && (
              <button
                type="button"
                onClick={() => onCtaClick?.()}
                className={`cf-btn cf-btn--primary w-fit ${
                  treatment === "bottom" ? "cf-btn--banner-cta-compact" : ""
                }`}
              >
                {ctaLabel}
              </button>
            )}
            {secondaryCtaLabel && (
              <button
                type="button"
                onClick={() => onSecondaryCtaClick?.()}
                className="cf-btn cf-btn--secondary w-fit"
              >
                {secondaryCtaLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
