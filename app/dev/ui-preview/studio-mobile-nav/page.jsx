import { notFound } from "next/navigation";

import StudioMobileNavPreviewClient from "./StudioMobileNavPreviewClient";

export default function StudioMobileNavPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StudioMobileNavPreviewClient />;
}
