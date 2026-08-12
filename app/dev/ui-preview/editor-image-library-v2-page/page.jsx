import { notFound } from "next/navigation";

import EditorImageLibraryV2PagePreviewClient from "./EditorImageLibraryV2PagePreviewClient";

// Fixture mirror of this wrapper's own View states
// (docs/VAULT-EDIT-TREE-CLASSIFICATION.md Group C). Harness only,
// never product; the product staging address is
// /studio/v2/editor/[id]/image-library. The composed
// CreationImageLibraryPage has its own preview,
// /dev/ui-preview/creation-image-library-page.
export default function EditorImageLibraryV2PagePreview() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <EditorImageLibraryV2PagePreviewClient />;
}
