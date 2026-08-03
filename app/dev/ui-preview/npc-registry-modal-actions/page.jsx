import { notFound } from "next/navigation";

import NpcRegistryModalActionsPreviewClient from "./NpcRegistryModalActionsPreviewClient";

export default function NpcRegistryModalActionsPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <NpcRegistryModalActionsPreviewClient />;
}
