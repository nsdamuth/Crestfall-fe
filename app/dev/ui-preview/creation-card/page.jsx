import { notFound } from "next/navigation";

import CreationCardPreviewClient from "./CreationCardPreviewClient";

export default function CreationCardPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CreationCardPreviewClient />;
}
