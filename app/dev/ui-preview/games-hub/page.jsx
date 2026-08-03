import { notFound } from "next/navigation";

import GamesHubPreviewClient from "./GamesHubPreviewClient";

export default function GamesHubPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <GamesHubPreviewClient />;
}
