import { notFound } from "next/navigation";

import CreationCreditsPreviewClient from "./CreationCreditsPreviewClient";

export default function CreationCreditsPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CreationCreditsPreviewClient />;
}
