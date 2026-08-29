import { notFound } from "next/navigation";

import TimelineReaderPreviewClient from "./TimelineReaderPreviewClient";

export default function TimelineReaderPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <TimelineReaderPreviewClient />;
}
