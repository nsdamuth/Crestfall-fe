import { notFound } from "next/navigation";

import StudioActionCardPreviewClient from "./StudioActionCardPreviewClient";

export default function StudioActionCardPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StudioActionCardPreviewClient />;
}
