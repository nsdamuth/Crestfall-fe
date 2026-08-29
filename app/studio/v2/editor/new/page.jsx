import { redirect } from "next/navigation";

import TimelineBuilderShell from "@/components/studio/create/timeline/TimelineBuilderShell";

function normalizeType(value) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

export default async function NewV2EditorPage({ searchParams }) {
  const query = (await searchParams) || {};
  const type = normalizeType(query.type);

  if (type === "TIMELINE") {
    return <TimelineBuilderShell backHref="/studio/v2/lore" />;
  }

  redirect("/studio/v2/editor");
}
