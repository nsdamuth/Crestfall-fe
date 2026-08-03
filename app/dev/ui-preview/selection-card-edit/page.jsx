import { notFound } from "next/navigation";

import SelectionCardEditPreviewClient from "./SelectionCardEditPreviewClient";

export default function SelectionCardEditPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <SelectionCardEditPreviewClient />;
}
