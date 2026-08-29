import { notFound } from "next/navigation";
import TimelineBuilderPreview from "./TimelineBuilderPreview";

export default function TimelineBuilderPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <TimelineBuilderPreview />;
}
