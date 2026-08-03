"use client";

import ActorMechanicsProfileAttachmentSection from "@/components/studio/characters/ActorMechanicsProfileAttachmentSection";
import { getNpcRegistryEntryActorId } from "@/components/studio/registries/npcRegistryUtils";

import NpcEntryModalView from "./npc-entry/NpcEntryModal.view";
import { useNpcEntryModalViewModel } from "./npc-entry/useNpcEntryModalViewModel";

export default function NpcEntryModal(props) {
  const viewProps = useNpcEntryModalViewModel(props);
  const draft = props?.draft || {};
  const isLightweightNpc = draft.kind !== "CREATION_REF";

  return (
    <NpcEntryModalView
      {...viewProps}
      actorMechanicsProfileAttachmentContent={
        isLightweightNpc ? (
          <ActorMechanicsProfileAttachmentSection
            data={draft}
            updateDataField={(field, value) => props?.onChange?.(field, value)}
            actorType="NPC_REGISTRY_ENTRY"
            actorId={getNpcRegistryEntryActorId(draft.id)}
            actorTitle={draft.name || "this lightweight NPC"}
            eyebrow="Sparse NPC Mechanics"
            title="Actor Mechanics Profile"
            body="Attach one reusable NPC Registry Entry profile to this lightweight NPC. Shared definitions may be reused, while mutable mechanics state will remain isolated to this registry entry."
            addLabel="Attach NPC Mechanics Profile"
            emptyLabel="No Actor Mechanics Profile is attached to this lightweight NPC."
            runtimeNote="This step saves the NPC Registry entry-to-profile relationship only. Sparse NPC runtime hydration and actor-state initialization are introduced separately."
          />
        ) : null
      }
    />
  );
}
