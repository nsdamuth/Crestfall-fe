import { notFound } from "next/navigation";

import KitStudioFilterBarPreviewClient from "./KitStudioFilterBarPreviewClient";

export default function KitStudioFilterBarPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <KitStudioFilterBarPreviewClient />;
}
