import { notFound } from "next/navigation";

import StudioTopBarPreviewClient from "./StudioTopBarPreviewClient";

export default function StudioTopBarPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StudioTopBarPreviewClient />;
}
