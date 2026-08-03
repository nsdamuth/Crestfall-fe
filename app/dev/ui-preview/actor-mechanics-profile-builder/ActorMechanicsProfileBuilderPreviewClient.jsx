"use client";

import { useState } from "react";

import ActorMechanicsProfileBuilderShell from "@/components/studio/create/actor-mechanics-profile/ActorMechanicsProfileBuilderShell";
import { ACTOR_MECHANICS_PROFILE_BUILDER_FIXTURES } from "@/components/studio/create/actor-mechanics-profile/actor-mechanics-profile-builder/ActorMechanicsProfileBuilder.fixtures";

export default function ActorMechanicsProfileBuilderPreviewClient() {
  const [createdTitle, setCreatedTitle] = useState("");

  return (
    <div className="space-y-5">
      {createdTitle ? (
        <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/5 px-4 py-3 text-sm text-emerald-100">
          Preview create completed: {createdTitle}
        </div>
      ) : null}

      <ActorMechanicsProfileBuilderShell
        initialDraft={ACTOR_MECHANICS_PROFILE_BUILDER_FIXTURES.custom}
        createDraft={async (payload) => ({
          data: {
            creation: {
              id: "preview-actor-mechanics-profile-id",
              title: payload.title,
            },
          },
        })}
        onCreated={(creation) => setCreatedTitle(creation.title)}
      />
    </div>
  );
}
