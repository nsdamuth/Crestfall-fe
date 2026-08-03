import { notFound } from "next/navigation";

import ViewModeTogglePreviewClient from "./ViewModeTogglePreviewClient";

export default function ViewModeTogglePreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ViewModeTogglePreviewClient />;
}
