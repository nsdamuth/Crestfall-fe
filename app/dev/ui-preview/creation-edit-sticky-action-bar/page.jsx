import { notFound } from "next/navigation";

import CreationEditStickyActionBarPreviewClient from "./CreationEditStickyActionBarPreviewClient";

export default function CreationEditStickyActionBarPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CreationEditStickyActionBarPreviewClient />;
}
