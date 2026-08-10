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

const BANNER_IMAGE = previewSvg("#100d0a", "#5b4321");

const noop = () => {};

export const kitPromoBannerTopFixture = {
  treatment: "top",
  bottomVariant: "uniform",
  eyebrow: "Explore",
  title: "Adventures worth committing to.",
  line: "Discover published Adventures, or open the builder without leaving the page.",
  ctaLabel: "Build an Adventure",
  imageSrc: BANNER_IMAGE,
  onCtaClick: noop,
};

export const kitPromoBannerCardFixture = {
  ...kitPromoBannerTopFixture,
  treatment: "card",
  eyebrow: "Continue",
  title: "The First Exile",
  line: "Character, Location, and Scenario ready. Pick up where you left off.",
  ctaLabel: "Resume",
};

export const kitPromoBannerBottomUniformFixture = {
  ...kitPromoBannerTopFixture,
  treatment: "bottom",
  bottomVariant: "uniform",
  eyebrow: "The realm runs deeper",
  title: "Meet the makers.",
  line: "Follow the creators shaping the realm. New work lands from them every day.",
  ctaLabel: "Browse Creators",
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
