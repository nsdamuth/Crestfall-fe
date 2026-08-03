import { notFound } from "next/navigation";

import ItemRegistryFieldsSectionPreviewClient from "./ItemRegistryFieldsSectionPreviewClient";

export default function ItemRegistryFieldsSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ItemRegistryFieldsSectionPreviewClient />;
}
