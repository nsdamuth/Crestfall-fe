import { notFound } from "next/navigation";

import LoreDocumentRendererPreviewClient from "./LoreDocumentRendererPreviewClient";

export default function Page() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <LoreDocumentRendererPreviewClient />;
}
