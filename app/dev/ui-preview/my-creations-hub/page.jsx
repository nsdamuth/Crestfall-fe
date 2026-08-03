import { notFound } from "next/navigation";

import MyCreationsHubPreviewClient from "./MyCreationsHubPreviewClient";

export default function MyCreationsHubPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <MyCreationsHubPreviewClient />;
}
