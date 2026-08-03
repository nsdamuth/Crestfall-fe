import { notFound } from "next/navigation";

import MediaHistoryGridPreviewClient from "./MediaHistoryGridPreviewClient";

export default function MediaHistoryGridPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return <MediaHistoryGridPreviewClient />;
}
