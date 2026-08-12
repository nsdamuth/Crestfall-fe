import { notFound } from "next/navigation";

import LookCreatorStopsPreviewClient from "./LookCreatorStopsPreviewClient";

export default function LookCreatorStopsPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <LookCreatorStopsPreviewClient />;
}
