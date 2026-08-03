import { notFound } from "next/navigation";

import StudioAccountProviderPreviewClient from "./StudioAccountProviderPreviewClient";

export default function StudioAccountProviderPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StudioAccountProviderPreviewClient />;
}
