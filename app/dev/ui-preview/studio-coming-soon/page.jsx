import { notFound } from "next/navigation";

import StudioComingSoonPreviewClient from "./StudioComingSoonPreviewClient";

export default function StudioComingSoonPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StudioComingSoonPreviewClient />;
}
