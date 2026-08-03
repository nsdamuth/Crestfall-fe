import { notFound } from "next/navigation";

import StorylinesHubPreviewClient from "./StorylinesHubPreviewClient";

export default function StorylinesHubPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StorylinesHubPreviewClient />;
}
