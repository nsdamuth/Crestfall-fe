import { notFound } from "next/navigation";

import NpcEntryPreviewClient from "./NpcEntryPreviewClient";

export default function NpcEntryPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <NpcEntryPreviewClient />;
}
