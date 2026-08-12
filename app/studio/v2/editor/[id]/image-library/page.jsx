// PRE-PARITY. New this pass (docs/VAULT-EDIT-TREE-CLASSIFICATION.md
// Group C): closes 14 of the CR-007/CR-008 held image-library rows by
// composing the existing, read-only
// components/studio/my-creations/image-library/CreationImageLibraryPage.
// Composition lives in ../../ImageLibrary.jsx (Binding Shell) and is
// mirrored at /dev/ui-preview/editor-image-library-v2-page for
// auth-free verification. Stays out of the sidebar until the whole
// nine-page set clears the cutover sequence, same as the editor route
// it sits beside.

import ImageLibrary from "../../ImageLibrary";

export default async function EditorImageLibraryV2Page({ params }) {
  const { id } = await params;

  return <ImageLibrary creationId={id} />;
}
