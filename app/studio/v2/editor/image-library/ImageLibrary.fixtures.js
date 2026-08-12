// Fixtures for this wrapper's own View states only. The composed
// legacy `CreationImageLibraryPage` exercises its own populated,
// empty, loading, and error states at its own preview,
// /dev/ui-preview/creation-image-library-page; this package does not
// duplicate them. Plain data only (no JSX) so this stays a .js file;
// the preview client builds the mock panel node from
// `mockPanelLabel`.
export const IMAGE_LIBRARY_FIXTURE_STATES = Object.freeze({
  default: {
    id: "default",
    label: "Default",
    creationId: "mock-editor-character-default",
    backLabel: "Back to editor",
    mockPanelLabel:
      "Composed CreationImageLibraryPage renders here (see its own preview for library states).",
  },
  longestContent: {
    id: "longestContent",
    label: "Longest creation id",
    creationId:
      "mock-editor-character-longest-vermillion-ashgrove-highcourt-third-archivist",
    backLabel: "Back to editor",
    mockPanelLabel: "Longest creationId, header must not clip at 390.",
  },
});
