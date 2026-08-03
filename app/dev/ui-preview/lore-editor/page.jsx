import { notFound } from "next/navigation";

import LoreEditorPreviewClient from "./LoreEditorPreviewClient";

export default function Page() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <LoreEditorPreviewClient />;
}
