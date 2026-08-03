import { notFound } from "next/navigation";

import PoseMotionStagingSectionPreviewClient from "./PoseMotionStagingSectionPreviewClient";

export default function PoseMotionStagingSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <PoseMotionStagingSectionPreviewClient />;
}
