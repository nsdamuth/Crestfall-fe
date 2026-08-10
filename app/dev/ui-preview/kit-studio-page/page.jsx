import { notFound } from "next/navigation";

import KitStudioPagePreviewClient from "./KitStudioPagePreviewClient";

export default function KitStudioPagePreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <KitStudioPagePreviewClient />;
}
