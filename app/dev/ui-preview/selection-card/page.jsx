import { notFound } from "next/navigation";

import SelectionCardPreviewClient from "./SelectionCardPreviewClient";

export default function SelectionCardPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <SelectionCardPreviewClient />;
}
