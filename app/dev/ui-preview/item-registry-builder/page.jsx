import { notFound } from "next/navigation";
import ItemRegistryBuilderPreviewClient from "./ItemRegistryBuilderPreviewClient";

export default function ItemRegistryBuilderPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ItemRegistryBuilderPreviewClient />;
}
