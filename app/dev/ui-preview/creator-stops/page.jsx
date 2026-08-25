import { notFound } from "next/navigation";

import CreatorStopsPreviewClient from "./CreatorStopsPreviewClient";

export default function CreatorStopsPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CreatorStopsPreviewClient />;
}
