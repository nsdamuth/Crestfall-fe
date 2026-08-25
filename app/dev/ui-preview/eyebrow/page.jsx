import { notFound } from "next/navigation";

import EyebrowPreviewClient from "./EyebrowPreviewClient";

export default function EyebrowPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <EyebrowPreviewClient />;
}
