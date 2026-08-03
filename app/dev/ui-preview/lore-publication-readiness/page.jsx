import { notFound } from "next/navigation";

import LorePublicationReadinessPreviewClient from "./LorePublicationReadinessPreviewClient";

export default function Page() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <LorePublicationReadinessPreviewClient />;
}
