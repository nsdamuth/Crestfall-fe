import { notFound } from "next/navigation";

import HomeV2PagePreviewClient from "./HomeV2PagePreviewClient";

// Fixture mirror of the full Home v2 composition, so this and future
// sessions can verify the whole page without auth. Harness only,
// never product; the product staging address is /studio/v2/home.
export default function HomeV2PagePreview() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <HomeV2PagePreviewClient />;
}
