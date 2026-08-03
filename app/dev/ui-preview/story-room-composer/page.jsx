import { notFound } from "next/navigation";

import StoryRoomComposerPreviewClient from "./StoryRoomComposerPreviewClient";

export default function StoryRoomComposerPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StoryRoomComposerPreviewClient />;
}
