import { notFound } from "next/navigation";

import OpeningMessageCardPreviewClient from "./OpeningMessageCardPreviewClient";

export default function OpeningMessageCardPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <OpeningMessageCardPreviewClient />;
}
