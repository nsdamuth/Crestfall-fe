import { notFound } from "next/navigation";

import CrestfallOptionModalPreviewClient from "./CrestfallOptionModalPreviewClient";

export default function CrestfallOptionModalPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CrestfallOptionModalPreviewClient />;
}
