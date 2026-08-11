import { notFound } from "next/navigation";

import EditorV2PagePreviewClient from "./EditorV2PagePreviewClient";

// Fixture mirror of the whole advanced editor composition
// (docs/STUDIO-SPEC.md brief S3 item 4), so this and future sessions
// can verify the page without auth. Harness only, never product; the
// product staging address is /studio/v2/editor/[id].
export default function EditorV2PagePreview() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <EditorV2PagePreviewClient />;
}
