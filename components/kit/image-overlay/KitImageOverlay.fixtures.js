function previewSvg(seed, width = 720, height = 960) {
  const r = Math.min(width, height) / 4;
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#100d0a" />
          <stop offset="0.5" stop-color="${seed}" />
          <stop offset="1" stop-color="#15100a" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#g)" />
      <circle cx="${width / 2}" cy="${height / 2}" r="${r}" fill="#d9bd82" opacity="0.75" />
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
  // B7 viewer final: header icon row plus bottom bar callbacks.
  // onReassignAsset is accepted but the view always renders that
  // action disabled when reassignment is unavailable.
  onDelete: noop,
  onReport: noop,
  onDetails: noop,
  onDownload: noop,
  onGenerateVariant: noop,
  onReassignAsset: noop,
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

// Aspect-coverage fixtures, RULED 10 Aug 2026 (R2 review gate): the
// hairline must snap to the image's own edges with no internal gap
// at every aspect ratio, witnessed by wide, tall, square, and tiny
// states. The wide state uses the one genuinely wide draft asset;
// the synthetic generator covers the shapes the draft library lacks.
export const kitImageOverlayWideFixture = {
  ...kitImageOverlayDefaultFixture,
  imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/Lilith.png"),
  title: "Lilith, Banner Study",
};

export const kitImageOverlayTallFixture = {
  ...kitImageOverlayDefaultFixture,
  imageSrc: previewSvg("#44604b", 400, 1600),
  title: "Tower Interior, Full Height",
};

export const kitImageOverlaySquareFixture = {
  ...kitImageOverlayDefaultFixture,
  imageSrc: previewSvg("#7a5717", 800, 800),
  title: "Sigil Study, Square Crop",
};

export const kitImageOverlayTinyFixture = {
  ...kitImageOverlayDefaultFixture,
  imageSrc: previewSvg("#5a4732", 120, 90),
  title: "Thumbnail Sketch",
};
