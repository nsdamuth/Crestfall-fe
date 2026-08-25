import { notFound } from "next/navigation";

import StoriesV2PagePreviewClient from "./StoriesV2PagePreviewClient";

// Fixture mirror of the full Stories v2 composition, so this and
// future sessions can verify the whole page without auth. Harness
// only, never product; the product staging address is
// /studio/v2/stories.
export default function StoriesV2PagePreview() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StoriesV2PagePreviewClient />;
}
