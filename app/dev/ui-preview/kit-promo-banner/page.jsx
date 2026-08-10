import { notFound } from "next/navigation";

import KitPromoBannerPreviewClient from "./KitPromoBannerPreviewClient";

export default function KitPromoBannerPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <KitPromoBannerPreviewClient />;
}
