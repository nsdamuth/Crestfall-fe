import { notFound } from "next/navigation";

import StorylineReferencePickerPreviewClient from "./StorylineReferencePickerPreviewClient";

export default function StorylineReferencePickerPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StorylineReferencePickerPreviewClient />;
}
