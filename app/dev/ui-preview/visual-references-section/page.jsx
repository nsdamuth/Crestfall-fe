import { notFound } from "next/navigation";

import VisualReferencesSectionPreviewClient from "./VisualReferencesSectionPreviewClient";

export default function VisualReferencesSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <VisualReferencesSectionPreviewClient />;
}
