import { notFound } from "next/navigation";

import KitLoadMorePreviewClient from "./KitLoadMorePreviewClient";

export default function KitLoadMorePreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <KitLoadMorePreviewClient />;
}
