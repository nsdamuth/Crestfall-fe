export const IMAGE_LIBRARY_VIEW_CONTRACT_VERSION = "1.1.0";

/**
 * New this pass (docs/VAULT-EDIT-TREE-CLASSIFICATION.md Group C, CSV
 * rows 409-421 and 430, 14 of the 97 CR-007/CR-008 held rows). A thin
 * v2-native wrapper around the already-portable
 * `components/studio/my-creations/image-library/CreationImageLibraryPage`
 * package. Build address `/studio/v2/editor/[id]/image-library`.
 *
 * v1.1.0, RULED 11 Aug 2026 (Sprint H render review, item 4, FIXES
 * the double-back-control gap this contract previously recorded as
 * composed-around, not fixed): the Binding Shell (`../ImageLibrary.jsx`)
 * now passes `showBackLink={false}` into `CreationImageLibraryPage`,
 * an additive optional prop on that package (default true, unchanged
 * for its own legacy `/studio/my-creations/[id]/image-library`
 * caller). The composed legacy page's own internal "Back to editor"
 * control no longer renders; this View's own origin-aware "Back to
 * editor" (routing to `/studio/v2/editor/[id]`) is the only back path
 * on this page. No prop change to this View's own contract.
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
