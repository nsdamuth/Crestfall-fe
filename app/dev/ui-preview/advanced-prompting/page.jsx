import { notFound } from "next/navigation";

import AdvancedPromptingPreviewClient from "./AdvancedPromptingPreviewClient";

export default function AdvancedPromptingPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <AdvancedPromptingPreviewClient />;
}
