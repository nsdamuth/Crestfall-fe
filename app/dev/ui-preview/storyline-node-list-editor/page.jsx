import { notFound } from "next/navigation";

import StorylineNodeListEditorPreviewClient from "./StorylineNodeListEditorPreviewClient";

export default function StorylineNodeListEditorPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StorylineNodeListEditorPreviewClient />;
}
