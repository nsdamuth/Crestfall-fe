import { notFound } from "next/navigation";

import StudioAccountProfilePreviewClient from "./StudioAccountProfilePreviewClient";

export default function StudioAccountProfilePreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StudioAccountProfilePreviewClient />;
}
