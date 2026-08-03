import { notFound } from "next/navigation";

import NpcRegistryFieldsSectionPreviewClient from "./NpcRegistryFieldsSectionPreviewClient";

export default function NpcRegistryFieldsSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <NpcRegistryFieldsSectionPreviewClient />;
}
