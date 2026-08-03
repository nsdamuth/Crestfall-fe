import { notFound } from "next/navigation";

import CreationStatusBadgesPreviewClient from "./CreationStatusBadgesPreviewClient";

export default function CreationStatusBadgesPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CreationStatusBadgesPreviewClient />;
}
