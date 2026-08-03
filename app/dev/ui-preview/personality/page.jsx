import { notFound } from "next/navigation";

import PersonalityPreviewClient from "./PersonalityPreviewClient";

export default function PersonalityPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <PersonalityPreviewClient />;
}
