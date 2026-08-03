import { notFound } from "next/navigation";

import NarratorBuilderPreviewClient from "./NarratorBuilderPreviewClient";

export default function NarratorBuilderPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <NarratorBuilderPreviewClient />;
}
