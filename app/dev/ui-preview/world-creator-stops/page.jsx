import { notFound } from "next/navigation";

import WorldCreatorStopsPreviewClient from "./WorldCreatorStopsPreviewClient";

export default function WorldCreatorStopsPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <WorldCreatorStopsPreviewClient />;
}
