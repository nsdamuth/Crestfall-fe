import { notFound } from "next/navigation";

import StudioAccountCoinsPreviewClient from "./StudioAccountCoinsPreviewClient";

export default function StudioAccountCoinsPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StudioAccountCoinsPreviewClient />;
}
