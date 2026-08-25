import { notFound } from "next/navigation";

import KitDropdownPreviewClient from "./KitDropdownPreviewClient";

export default function KitDropdownPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <KitDropdownPreviewClient />;
}
