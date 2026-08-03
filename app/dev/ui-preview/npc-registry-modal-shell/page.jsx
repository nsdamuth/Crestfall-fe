import { notFound } from "next/navigation";

import NpcRegistryModalShellPreviewClient from "./NpcRegistryModalShellPreviewClient";

export default function NpcRegistryModalShellPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <NpcRegistryModalShellPreviewClient />;
}
