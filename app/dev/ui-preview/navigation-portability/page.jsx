import { notFound } from "next/navigation";

import NavigationPortabilityPreviewClient from "./NavigationPortabilityPreviewClient";

export default function NavigationPortabilityPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <NavigationPortabilityPreviewClient />;
}
