import { notFound } from "next/navigation";

import EditorSaveBarPreviewClient from "./EditorSaveBarPreviewClient";

export default function EditorSaveBarPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <EditorSaveBarPreviewClient />;
}
