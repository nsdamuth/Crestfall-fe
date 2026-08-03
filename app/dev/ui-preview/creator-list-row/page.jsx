import { notFound } from "next/navigation";

import CreatorListRowPreviewClient from "./CreatorListRowPreviewClient";

export default function CreatorListRowPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CreatorListRowPreviewClient />;
}
