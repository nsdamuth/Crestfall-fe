import { notFound } from "next/navigation";

import EyeColorPreviewClient from "./EyeColorPreviewClient";

export default function EyeColorPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <EyeColorPreviewClient />;
}
