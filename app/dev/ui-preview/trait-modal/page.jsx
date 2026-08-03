import { notFound } from "next/navigation";

import TraitModalPreviewClient from "./TraitModalPreviewClient";

export default function TraitModalPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <TraitModalPreviewClient />;
}
