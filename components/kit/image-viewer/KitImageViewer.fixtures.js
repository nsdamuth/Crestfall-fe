// Fixture states: default (view mode, soon everywhere), assignable,
// remix context (2.0.0, a public image from a creator card), saved
// with a share message, longest title, no stored size (measured on
// load), no image, upscale pending. The thumbnail strip and its items
// are gone at 2.0.0. Costs in fixtures are sample props, never a
// source of truth: the live page reads the two workbench constants.
const noop = () => {};

function art(name) {
  return encodeURI(`/tmp-mockup-images/alpha-test-creator-images/${name}.png`);
}

const DOWNLOAD_OPTIONS = [
  { id: "small", label: "Small", href: "#small" },
  { id: "medium", label: "Medium", href: "#medium" },
  { id: "large", label: "Large", href: "#large", showsPixelSize: true },
  { id: "extra-large", label: "Extra Large", disabled: true, tooltip: "Soon", title: "Not available yet" },
];

const BASE = {
  imageSrc: art("vermillion-8"),
  title: "Generated image, 10 Sep 2026",
  pixelSize: { width: 832, height: 1216 },
  isSaved: false,
  shareMessage: "",
  downloadOptions: DOWNLOAD_OPTIONS,
  assignState: "soon",
  bottomBarAction: "assign",
  remixState: "soon",
  upscaleCoinCost: 10,
  upscaleState: "soon",
  editRunCoinCost: 20,
  editState: "soon",
  overlaySlot: null,
  overlayReplacesBody: false,
  onSave: noop,
  onDelete: noop,
  onReport: noop,
  onDetails: noop,
  onShare: noop,
  onAssign: noop,
  onRemix: noop,
  onUpscale: noop,
  onSubmitEdit: noop,
  onClose: noop,
};

export const kitImageViewerFixtures = [
  { id: "default", label: "Default", props: { ...BASE } },
  { id: "assignable", label: "Assignable", props: { ...BASE, assignState: "ready" } },
  {
    id: "remix",
    label: "Remix context (public image)",
    props: { ...BASE, bottomBarAction: "remix", remixState: "soon", onDelete: null, downloadOptions: [] },
  },
  { id: "saved-shared", label: "Saved, link copied", props: { ...BASE, isSaved: true, shareMessage: "Link copied" } },
  {
    id: "longest",
    label: "Longest title",
    props: {
      ...BASE,
      title: "Kaela Veynskald, Warden of the Northern Reach, at the ampitheater gates before the winter council",
    },
  },
  { id: "measured", label: "No stored size", props: { ...BASE, pixelSize: null } },
  { id: "empty", label: "No image", props: { ...BASE, imageSrc: null, pixelSize: null, downloadOptions: [] } },
  { id: "upscale-pending", label: "Upscale pending", props: { ...BASE, upscaleState: "pending" } },
];
