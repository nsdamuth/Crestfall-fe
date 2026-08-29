"use client";

import { useRouter } from "next/navigation";

import RoomTemplateBuilderShell from "@/components/studio/create/room-template/RoomTemplateBuilderShell";

export default function V2RoomTemplateBuilderClient() {
  const router = useRouter();

  return (
    <RoomTemplateBuilderShell
      onCreated={(creation) => {
        if (!creation?.id) return;
        router.push(`/studio/v2/editor/${encodeURIComponent(creation.id)}?origin=stories`);
      }}
    />
  );
}
