import { notFound } from "next/navigation";

import KitFormFieldPreviewClient from "./KitFormFieldPreviewClient";

export default function KitFormFieldPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <KitFormFieldPreviewClient />;
}
