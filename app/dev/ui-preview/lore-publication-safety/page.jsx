import { notFound } from "next/navigation";

import LorePublicationSafetyPreviewClient from "./LorePublicationSafetyPreviewClient";

export default function LorePublicationSafetyPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <LorePublicationSafetyPreviewClient />;
}
