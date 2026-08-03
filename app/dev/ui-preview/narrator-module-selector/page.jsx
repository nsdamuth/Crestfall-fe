import { notFound } from "next/navigation";

import NarratorModuleSelectorPreviewClient from "./NarratorModuleSelectorPreviewClient";

export default function NarratorModuleSelectorPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <NarratorModuleSelectorPreviewClient />;
}
