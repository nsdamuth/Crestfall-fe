import { notFound } from "next/navigation";

import CreationPublishingSectionPreviewClient from "./CreationPublishingSectionPreviewClient";

export default function CreationPublishingSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CreationPublishingSectionPreviewClient />;
}
