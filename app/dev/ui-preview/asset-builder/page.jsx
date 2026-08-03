import { notFound } from "next/navigation";

import AssetBuilderPreviewClient from "./AssetBuilderPreviewClient";

export default function AssetBuilderPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <AssetBuilderPreviewClient />;
}
