function previewSvg(seed) {
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 960">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#100d0a" />
          <stop offset="0.5" stop-color="${seed}" />
          <stop offset="1" stop-color="#15100a" />
        </linearGradient>
      </defs>
      <rect width="720" height="960" fill="url(#g)" />
      <circle cx="360" cy="360" r="180" fill="#d9bd82" opacity="0.75" />
    </svg>
  `);
  return `data:image/svg+xml,${svg}`;
}

const noop = () => {};

// Draft-asset fixture art (public/tmp-mockup-images/, gitignored
// interim art); the SVG generator stays as the synthetic fallback.
export const kitImageOverlayDefaultFixture = {
  imageSrc: encodeURI(
    "/tmp-mockup-images/alpha-test-creator-images/vermillion-8.png"
  ),
  title: "Vesper Ash Render",
  isLoved: false,
  isSaved: false,
  onLove: noop,
  onSave: noop,
  onShare: noop,
  onClose: noop,
};

export const kitImageOverlayLovedFixture = {
  ...kitImageOverlayDefaultFixture,
  isLoved: true,
};

export const kitImageOverlaySavedFixture = {
  ...kitImageOverlayDefaultFixture,
  isSaved: true,
};

export const kitImageOverlayLongestTitleFixture = {
  ...kitImageOverlayDefaultFixture,
  title: "The Lantern-Keeper of the Vermillion Coast, rendered at dusk, third attempt",
};

// Additive fixture, Sprint A Phase 3 (frame conversion): the standard
// no-art fallback rendered inside the converted frame.
export const kitImageOverlayNoImageFixture = {
  ...kitImageOverlayDefaultFixture,
  imageSrc: null,
  title: "Untitled render",
};
