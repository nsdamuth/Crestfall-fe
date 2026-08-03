import { notFound } from "next/navigation";

import StudioAccountMetricsPreviewClient from "./StudioAccountMetricsPreviewClient";

export default function StudioAccountMetricsPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StudioAccountMetricsPreviewClient />;
}
