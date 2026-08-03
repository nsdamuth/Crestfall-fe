import { notFound } from "next/navigation";

import HairPreviewClient from "./HairPreviewClient";

export default function HairPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <HairPreviewClient />;
}
