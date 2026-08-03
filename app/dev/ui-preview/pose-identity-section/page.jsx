import { notFound } from "next/navigation";

import PoseIdentitySectionPreviewClient from "./PoseIdentitySectionPreviewClient";

export default function PoseIdentitySectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <PoseIdentitySectionPreviewClient />;
}
