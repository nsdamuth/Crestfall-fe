import { redirect } from "next/navigation";

import TimelineBuilderShell from "@/components/studio/create/timeline/TimelineBuilderShell";
import V2RoomTemplateBuilderClient from "../V2RoomTemplateBuilderClient";

function normalizeType(value) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

export default async function NewV2EditorPage({ searchParams }) {
  const query = (await searchParams) || {};
  const type = normalizeType(query.type);

  if (type === "TIMELINE") {
    return <TimelineBuilderShell backHref="/studio/v2/lore" />;
  }

  if (type === "ROOM_TEMPLATE") {
    return <V2RoomTemplateBuilderClient />;
  }

  redirect("/studio/v2/editor");
}
