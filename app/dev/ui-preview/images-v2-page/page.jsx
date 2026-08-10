import { notFound } from "next/navigation";

import ImagesV2PagePreviewClient from "./ImagesV2PagePreviewClient";

// Fixture mirror of the full Images v2 composition, so this and future
// sessions can verify the whole page without auth. Harness only,
// never product; the product staging address is /studio/v2/images.
export default function ImagesV2PagePreview() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ImagesV2PagePreviewClient />;
}
