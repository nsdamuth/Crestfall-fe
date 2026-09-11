export const KIT_IMAGE_VIEWER_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the live image viewer that opens
 * from a library item on the Media Studio page (FE/MEDIA-STUDIO
 * session 3, Brian's notes 6 and 6a, RULED 10 Sep 2026).
 *
 * Built on KitModalFrame variant="viewer" (full screen under 700px,
 * the B7 veil) and the shared ImageFrame (gold hairline, zoom and pan,
 * pinch on touch). Top bar: the title, then the image's current pixel
 * size beside the Upscale control (the only place Upscale exists), then
 * the icon row: Delete, Report, Details, Download (opens the size
 * menu), Save. No rename pencil, no heart (note 6). Bottom bar: Edit
 * (no cost on it), Assign, Share. The thumbnail strip shows in view
 * mode only; in edit mode the frame hosts KitImageEditor and only the
 * top and bottom bars remain.
 *
 * Download sizes: Small, Medium, Large (the Large row shows the
 * measured pixel size), Extra Large stays grey reading "Not available
 * yet" until the image has been upscaled. Upscale and the edit run
 * ship as "soon" until the Chassis serves them; costs arrive as props
 * from the page (the two workbench constants), never as literals here.
 *
 * The page keeps every operation's handler (delete, details, report,
 * share, assign) and renders its own dialogs through `overlaySlot`, so
 * what the viewer reports to the application is unchanged from the
 * lightbox it replaces (contract law, FRONTEND-SOP section 13).
 *
 * @typedef {Object} KitImageViewerItem
 * @property {string} id
 * @property {string} title
 * @property {string|null} thumbnailUrl
 *
 * @typedef {Object} KitImageViewerPixelSize
 * @property {number} width
 * @property {number} height
 *
 * @typedef {Object} KitImageViewerDownloadOption
 * @property {string} id
 * @property {string} label
 * @property {string} [href] the file URL; absent or disabled rows render as a disabled button
 * @property {boolean} [disabled]
 * @property {string} [tooltip] the chip text on a disabled row ("Soon")
 * @property {string} [title] the disabled row's hover title ("Not available yet")
 * @property {boolean} [showsPixelSize] the viewer writes the measured size as this row's detail
 *
 * @typedef {Object} KitImageViewerProps
 * @property {string|null} imageSrc
 * @property {string} title
 * @property {KitImageViewerItem[]} items the thumbnail strip, view mode only
 * @property {string|null} activeId
 * @property {(item: KitImageViewerItem) => void} onSelectItem
 * @property {KitImageViewerPixelSize|null} pixelSize the stored size; when null the viewer measures the image on load
 * @property {boolean} isSaved
 * @property {() => void} onSave
 * @property {() => void} onDelete opens the page's delete confirm; absent hides the control
 * @property {() => void} onReport
 * @property {() => void} onDetails
 * @property {() => void} onShare
 * @property {string} shareMessage the chip under the header after Share (copied link, etc.)
 * @property {KitImageViewerDownloadOption[]} downloadOptions empty hides the Download control
 * @property {"ready"|"soon"} assignState soon renders Assign disabled with the Soon chip
 * @property {() => void} onAssign
 * @property {number} upscaleCoinCost
 * @property {"soon"|"ready"|"pending"} upscaleState
 * @property {() => void} onUpscale
 * @property {number} editRunCoinCost
 * @property {"soon"|"ready"|"pending"} editState
 * @property {(payload: import("../image-editor/KitImageEditor.contract").KitImageEditorPayload) => void} onSubmitEdit
 * @property {import("react").ReactNode} overlaySlot page-owned dialogs and panels
 * @property {boolean} overlayReplacesBody when true the slot replaces the header, frame, and bars (the delete confirm)
 * @property {() => void} onClose forwarded to the frame: close control, backdrop, Escape
 */

export {};
