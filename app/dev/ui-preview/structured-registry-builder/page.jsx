import { notFound } from "next/navigation";
import StructuredRegistryBuilderPreviewClient from "./StructuredRegistryBuilderPreviewClient";

export default function StructuredRegistryBuilderPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StructuredRegistryBuilderPreviewClient />;
}
