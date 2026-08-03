import { notFound } from "next/navigation";

import PublicProfileHeroPreviewClient from "./PublicProfileHeroPreviewClient";

export default function PublicProfileHeroPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <PublicProfileHeroPreviewClient />;
}
