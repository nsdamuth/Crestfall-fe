import { notFound } from "next/navigation";

import KibbePresetPreviewClient from "./KibbePresetPreviewClient";

export default function KibbePresetPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <KibbePresetPreviewClient />;
}
