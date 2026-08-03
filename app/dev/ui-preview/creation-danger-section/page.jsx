import { notFound } from "next/navigation";

import CreationDangerSectionPreviewClient from "./CreationDangerSectionPreviewClient";

export default function CreationDangerSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CreationDangerSectionPreviewClient />;
}
