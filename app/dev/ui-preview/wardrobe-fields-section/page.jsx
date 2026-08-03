import { notFound } from "next/navigation";

import WardrobeFieldsSectionPreviewClient from "./WardrobeFieldsSectionPreviewClient";

export default function WardrobeFieldsSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <WardrobeFieldsSectionPreviewClient />;
}
