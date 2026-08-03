import { notFound } from "next/navigation";
import RoomTemplateBuilderPreviewClient from "./RoomTemplateBuilderPreviewClient";

export default function RoomTemplateBuilderPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <RoomTemplateBuilderPreviewClient />;
}
