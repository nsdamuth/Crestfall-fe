import StudioBackLink from "@/components/studio/StudioBackLink";
import StudioPageHeader from "@/components/studio/StudioPageHeader";
import ActorMechanicsProfileBuilderShell from "@/components/studio/create/actor-mechanics-profile/ActorMechanicsProfileBuilderShell";

export default function CreateActorMechanicsProfilePage() {
  return (
    <div className="space-y-6">
      <StudioBackLink href="/studio/create" label="Back to Create" />

      <StudioPageHeader
        eyebrow="Actor Mechanics Package"
        title="Create Actor Mechanics Profile"
      >
        Compose reusable mechanics definitions for Player Characters,
        Characters, and important NPCs while preserving isolated mutable state
        for every actor.
      </StudioPageHeader>

      <ActorMechanicsProfileBuilderShell />
    </div>
  );
}
