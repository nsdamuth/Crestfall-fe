function previewSvg(stopA, stopB) {
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1260 540">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="${stopA}" />
          <stop offset="1" stop-color="${stopB}" />
        </linearGradient>
      </defs>
      <rect width="1260" height="540" fill="url(#g)" />
      <circle cx="900" cy="180" r="220" fill="#d9bd82" opacity="0.55" />
    </svg>
  `);
  return `data:image/svg+xml,${svg}`;
}

// Draft-asset fixture art (public/tmp-mockup-images/, gitignored
// interim art); the SVG stays as the synthetic fallback generator.
//
// Banner art, RULED 10 Aug 2026 (kit polish 3 pass), dimension claim
// corrected 11 Aug 2026 (CC5 banner-audit sitting): the 10 Aug pass
// measured Lilith.png as 2560x1441 and sassy.png as 2352x1426; both
// figures were wrong. The files as committed are Lilith.png at
// 640x360 (1.78:1) and sassy.png at 640x388 (1.65:1). The
// orientation finding stands regardless: Lilith.png is a genuinely
// wide, single-subject composition; sassy.png is an eight-panel
// reference sheet (mood board with overlaid labels), not a scene,
// and does not compose at any crop. Lilith.png replaces the
// portrait-oriented Serapha Veyloria.png used through kit polish 2.
// Its subject sits close enough to center that it survives every
// banner crop this pass uses (mobile 5/3 through desktop 35/12)
// under the ruled default anchor (see KitPromoBanner.view.jsx and
// docs/reviews/BANNER-AUDIT.md).
const BANNER_IMAGE = encodeURI(
  "/tmp-mockup-images/canon-character-images/Lilith.png"
);

const noop = () => {};

// Copy rewritten 9 Aug 2026 (kit polish 2 pass): one line selling the
// next section's unique value, one CTA, sentence case, no em dashes.
// The reduced banner height leaves less room for a stacked
// title-plus-description; each banner now carries its sell in the
// title alone and drops the separate description line.
export const kitPromoBannerTopFixture = {
  treatment: "top",
  bottomVariant: "uniform",
  eyebrow: "Create",
  title: "Build an adventure your players won't stop talking about.",
  line: "",
  ctaLabel: "Build an adventure",
  imageSrc: BANNER_IMAGE,
  onCtaClick: noop,
};

export const kitPromoBannerCardFixture = {
  ...kitPromoBannerTopFixture,
  treatment: "card",
  eyebrow: "Continue",
  title: "Pick up The First Exile right where you left off.",
  line: "",
  ctaLabel: "Resume",
};

export const kitPromoBannerBottomUniformFixture = {
  ...kitPromoBannerTopFixture,
  treatment: "bottom",
  bottomVariant: "uniform",
  eyebrow: "Explore",
  title: "Follow the creators behind every world you love.",
  line: "",
  ctaLabel: "Browse creators",
};

export const kitPromoBannerBottomFadeFixture = {
  ...kitPromoBannerBottomUniformFixture,
  bottomVariant: "bottom-fade",
};

export const kitPromoBannerLongestCopyFixture = {
  ...kitPromoBannerTopFixture,
  title: "Every published Adventure in the realm, ranked by the seasons the community has kept returning to since launch.",
  line: "This is the longest copy this banner is expected to carry, set here so wrapping and truncation can be checked at both review widths without guessing.",
};

export const kitPromoBannerNoImageFixture = {
  ...kitPromoBannerTopFixture,
  imageSrc: null,
};

export const kitPromoBannerNoCtaFixture = {
  ...kitPromoBannerTopFixture,
  ctaLabel: "",
};

export const kitPromoBannerCustomAnchorFixture = {
  ...kitPromoBannerTopFixture,
  eyebrow: "Explore",
  title: "A scene that reads better centered, not top-pinned.",
  imageAnchor: "center 45%",
};

export const kitPromoBannerGalaxyTopFixture = {
  ...kitPromoBannerTopFixture,
  showGalaxy: true,
  eyebrow: "Crestfall Chronicles",
  title: "The realm under one sky.",
  line: "The galaxy layer drifts and twinkles on the ruled animation tokens, and holds still under reduced motion.",
};
