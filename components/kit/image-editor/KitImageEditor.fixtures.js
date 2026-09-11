// Fixture states: default (soon, nothing drawn), ready with a painted
// stroke list, cropping with the entry row, crop larger than the image
// (hint pointing to Upscale), pending run, longest title, no image.
// Costs in fixtures are sample props, never a source of truth: the
// live page reads EDIT_RUN_COIN_COST through the workbench ViewModel.
const noop = () => {};

function art(name) {
  return encodeURI(`/tmp-mockup-images/alpha-test-creator-images/${name}.png`);
}

const PIXEL_SIZE = { width: 832, height: 1216 };

const SAMPLE_STROKES = [
  { tool: "brush", size: 50, points: [{ x: 300, y: 400 }, { x: 360, y: 440 }, { x: 420, y: 470 }] },
  { tool: "brush", size: 100, points: [{ x: 500, y: 700 }] },
  { tool: "eraser", size: 50, points: [{ x: 380, y: 450 }, { x: 400, y: 460 }] },
];

const BASE = {
  imageSrc: art("vermillion-8"),
  title: "Generated image, 10 Sep 2026",
  pixelSize: PIXEL_SIZE,
  editRunCoinCost: 20,
  editState: "soon",
  onSubmit: noop,
  onClose: noop,
  onImageLoad: noop,
  onRequestUpscale: noop,
};

export const kitImageEditorFixtures = [
  { id: "default", label: "Default (soon)", props: { ...BASE } },
  {
    id: "ready",
    label: "Ready, painted",
    props: { ...BASE, editState: "ready", initialStrokes: SAMPLE_STROKES },
  },
  {
    id: "cropping",
    label: "Cropping",
    props: { ...BASE, editState: "ready", initialTool: "crop" },
  },
  {
    id: "crop-too-large",
    label: "Crop larger than the image",
    props: { ...BASE, editState: "ready", initialTool: "crop", initialCropEntry: { width: "2048", height: "2048" } },
  },
  { id: "pending", label: "Run pending", props: { ...BASE, editState: "pending" } },
  {
    id: "longest",
    label: "Longest title",
    props: {
      ...BASE,
      title: "Kaela Veynskald, Warden of the Northern Reach, at the ampitheater gates before the winter council",
    },
  },
  { id: "empty", label: "No image", props: { ...BASE, imageSrc: null, pixelSize: null } },
];
