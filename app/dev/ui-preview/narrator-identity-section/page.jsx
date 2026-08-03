import { notFound } from "next/navigation";

import NarratorIdentitySectionPreviewClient from "./NarratorIdentitySectionPreviewClient";

export default function NarratorIdentitySectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <NarratorIdentitySectionPreviewClient />;
}
