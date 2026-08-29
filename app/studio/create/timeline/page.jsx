import { redirect } from "next/navigation";

export default function LegacyCreateTimelineCompatibilityPage() {
  redirect("/studio/v2/editor/new?type=TIMELINE&origin=lore");
}
