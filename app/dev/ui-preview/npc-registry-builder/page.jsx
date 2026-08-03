import { notFound } from "next/navigation";
import NpcRegistryBuilderPreviewClient from "./NpcRegistryBuilderPreviewClient";

export default function NpcRegistryBuilderPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <NpcRegistryBuilderPreviewClient />;
}
