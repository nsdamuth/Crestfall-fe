import { notFound } from "next/navigation";

import CreatorsConnectionsV2PagePreviewClient from "./CreatorsConnectionsV2PagePreviewClient";

// Fixture mirror of the full Creator Connections v2 composition, so
// this and future sessions can verify the whole page without auth.
// Harness only, never product; the product staging address is
// /studio/v2/creators/[handle]/connections.
export default function CreatorsConnectionsV2PagePreview() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CreatorsConnectionsV2PagePreviewClient />;
}
