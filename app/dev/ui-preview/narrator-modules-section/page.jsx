import { notFound } from "next/navigation";

import NarratorModulesSectionPreviewClient from "./NarratorModulesSectionPreviewClient";

export default function NarratorModulesSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <NarratorModulesSectionPreviewClient />;
}
