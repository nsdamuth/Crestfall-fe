import { notFound } from "next/navigation";

import MultiTraitModalPreviewClient from "./MultiTraitModalPreviewClient";

export default function MultiTraitModalPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <MultiTraitModalPreviewClient />;
}
