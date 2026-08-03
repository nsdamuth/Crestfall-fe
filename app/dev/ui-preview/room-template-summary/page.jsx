import { notFound } from "next/navigation";

import RoomTemplateSummaryPreviewClient from "./RoomTemplateSummaryPreviewClient";

export default function RoomTemplateSummaryPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <RoomTemplateSummaryPreviewClient />;
}
