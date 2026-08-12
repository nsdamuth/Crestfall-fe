export const IMAGE_LIBRARY_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * New this pass (docs/VAULT-EDIT-TREE-CLASSIFICATION.md Group C, CSV
 * rows 409-421 and 430, 14 of the 97 CR-007/CR-008 held rows). A thin
 * v2-native wrapper around the already-portable, read-only
 * `components/studio/my-creations/image-library/CreationImageLibraryPage`
 * package (contract v1.0.0 of its own, untouched here). Build address
 * `/studio/v2/editor/[id]/image-library`.
 *
 * The wrapper exists because the composed legacy page's own internal
 * "Back to editor" link and header chrome route to the legacy
 * `/studio/my-creations/[id]/edit` address (hardcoded inside its own
 * Chassis hook, out of this brief's file boundary to change). This
 * View adds a correct v2 "Back to editor" control routing to
 * `/studio/v2/editor/[id]`; the legacy page's own internal back link
 * is unchanged and still points at the old address, a composed-around
 * limitation recorded in `../editor/README.md` and the classification
 * doc, not fixed here.
 *
 * @typedef {Object} ImageLibraryViewProps
 * @property {string} creationId
 * @property {string} backLabel
 * @property {() => void} onBack Routes to `/studio/v2/editor/[id]`
 *   (with the original `origin` query param carried through where
 *   present); resolved by the Binding Shell, never the View.
 * @property {import("react").ReactNode} libraryPanel The composed,
 *   read-only `CreationImageLibraryPage`, built by the Binding Shell
 *   (`../ImageLibrary.jsx`). The View never imports it directly.
 */

export {};
