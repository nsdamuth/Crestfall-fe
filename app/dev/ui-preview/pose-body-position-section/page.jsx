import { notFound } from "next/navigation";

import PoseBodyPositionSectionPreviewClient from "./PoseBodyPositionSectionPreviewClient";

export default function PoseBodyPositionSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <PoseBodyPositionSectionPreviewClient />;
}
