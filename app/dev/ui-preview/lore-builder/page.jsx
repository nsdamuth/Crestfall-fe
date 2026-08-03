import { notFound } from "next/navigation";

import LoreBuilderPreviewClient from "./LoreBuilderPreviewClient";

export default function Page() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <LoreBuilderPreviewClient />;
}
