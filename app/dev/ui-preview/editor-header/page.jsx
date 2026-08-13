import { notFound } from "next/navigation";

import EditorHeaderPreviewClient from "./EditorHeaderPreviewClient";

export default function EditorHeaderPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <EditorHeaderPreviewClient />;
}
