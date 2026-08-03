import { notFound } from "next/navigation";

import CreationPreviewModalPreviewClient from "./CreationPreviewModalPreviewClient";

export default function CreationPreviewModalPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CreationPreviewModalPreviewClient />;
}
