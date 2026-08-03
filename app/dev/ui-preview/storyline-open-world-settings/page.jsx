import { notFound } from "next/navigation";

import StorylineOpenWorldSettingsPreviewClient from "./StorylineOpenWorldSettingsPreviewClient";

export default function StorylineOpenWorldSettingsPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StorylineOpenWorldSettingsPreviewClient />;
}
