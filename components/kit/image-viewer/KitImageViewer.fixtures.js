// Fixture states: default (view mode, four items, soon everywhere),
// single item (no strip), assignable, saved with a share message,
// longest title, no stored size (measured on load), no image, upscale
// pending. Costs in fixtures are sample props, never a source of
// truth: the live page reads the two workbench constants.
const noop = () => {};

function art(name) {
  return encodeURI(`/tmp-mockup-images/alpha-test-creator-images/${name}.png`);
}

const ITEMS = [
  { id: "img-1", title: "Generated image, 10 Sep 2026", thumbnailUrl: art("vermillion-8") },
  { id: "img-2", title: "Generated image, 10 Sep 2026", thumbnailUrl: art("vermillion-2") },
  { id: "img-3", title: "Generated image, 9 Sep 2026", thumbnailUrl: art("vermillion-4") },
  { id: "img-4", title: "Generated image, 9 Sep 2026", thumbnailUrl: null },
];

const DOWNLOAD_OPTIONS = [
  { id: "small", label: "Small", href: "#small" },
  { id: "medium", label: "Medium", href: "#medium" },
  { id: "large", label: "Large", href: "#large", showsPixelSize: true },
  { id: "extra-large", label: "Extra Large", disabled: true, tooltip: "Soon", title: "Not available yet" },
];

const BASE = {
  imageSrc: art("vermillion-8"),
  title: "Generated image, 10 Sep 2026",
  items: ITEMS,
  activeId: "img-1",
  pixelSize: { width: 832, height: 1216 },
  isSaved: false,
  shareMessage: "",
  downloadOptions: DOWNLOAD_OPTIONS,
  assignState: "soon",
  upscaleCoinCost: 10,
  upscaleState: "soon",
  editRunCoinCost: 20,
  editState: "soon",
  overlaySlot: null,
  overlayReplacesBody: false,
  onSelectItem: noop,
  onSave: noop,
  onDelete: noop,
  onReport: noop,
  onDetails: noop,
  onShare: noop,
  onAssign: noop,
  onUpscale: noop,
  onSubmitEdit: noop,
  onClose: noop,
};

export const kitImageViewerFixtures = [
  { id: "default", label: "Default", props: { ...BASE } },
  { id: "single", label: "Single item", props: { ...BASE, items: [ITEMS[0]] } },
  { id: "assignable", label: "Assignable", props: { ...BASE, assignState: "ready" } },
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
