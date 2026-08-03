import { notFound } from "next/navigation";

import StorylineBuilderShellPreviewClient from "./StorylineBuilderShellPreviewClient";

export default function StorylineBuilderShellPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StorylineBuilderShellPreviewClient />;
}
