import { notFound } from "next/navigation";

import FilterableIndexPreviewClient from "./FilterableIndexPreviewClient";

export default function FilterableIndexPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return <FilterableIndexPreviewClient />;
}
