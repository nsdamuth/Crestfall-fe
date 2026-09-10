export const KIT_IMAGE_EDITOR_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the brush editor inside the image
 * viewer (FE/MEDIA-STUDIO session 3, Brian's note 6a, RULED 10 Sep
 * 2026). Edit lives in the image viewer only, never a sidebar tab,
 * never a composer mode. The editor is one edit run: painting areas,
 * adjusting the crop, or both, for one flat cost the caller supplies.
 * Every result is a new linked library item, never an overwrite; the
 * editor itself writes nothing, it reports a payload.
 *
 * The Chassis has no inpainting, mask, or crop job today, so
 * `editState` ships as "soon": Generate renders disabled with the
 * Soon chip and the title "Not available yet". Painting, the eraser,
 * undo and redo, the crop box, and the pixel entry all work locally
 * now, so the run is ready the day the job lands (gap 8 in
 * docs/handoffs/MEDIA-STUDIO-BACKEND.md).
 *
 * Mask format (ruled at the plan gate, option A of three): strokes are
 * recorded in image pixels and replayed; the export is a PNG mask at
 * the image's native size, white where painted, black elsewhere,
 * eraser strokes cut out of the white. Crop is in source pixels.
 *
 * @typedef {Object} KitImageEditorPixelSize
 * @property {number} width
 * @property {number} height
 *
 * @typedef {Object} KitImageEditorCrop
 * @property {number} x left edge in source pixels
 * @property {number} y top edge in source pixels
 * @property {number} width
 * @property {number} height
 *
 * @typedef {Object} KitImageEditorPayload
 * @property {string|null} maskDataUrl PNG data URL at native size, null when nothing was painted
 * @property {KitImageEditorCrop|null} crop null when the crop box was never set
 * @property {string} prompt the edit description, may be empty
 *
 * @typedef {Object} KitImageEditorProps
 * @property {string|null} imageSrc
 * @property {string} title the image's accessible name
 * @property {KitImageEditorPixelSize|null} pixelSize the image's native size; painting waits until it is known
 * @property {number} editRunCoinCost the flat cost shown on Generate, supplied by the caller, never a literal here
 * @property {"soon"|"ready"|"pending"} editState soon renders the honest Soon treatment; pending shows the waiting glyph
 * @property {(payload: KitImageEditorPayload) => void} onSubmit fires from Generate when editState is ready
 * @property {() => void} onClose the toolbar's close, leaves the editor
 * @property {(size: KitImageEditorPixelSize) => void} onImageLoad forwarded from the frame so the caller can learn the size
 * @property {() => void} onRequestUpscale the crop hint's "Go to Upscale" action; the caller moves focus
 * @property {"hand"|"brush"|"eraser"|"crop"} [initialTool] fixture seed for the first render only
 * @property {Array<{tool: string, size: number, points: Array<{x: number, y: number}>}>} [initialStrokes] fixture seed only
 * @property {{width: string, height: string}} [initialCropEntry] fixture seed only
 */

export {};
