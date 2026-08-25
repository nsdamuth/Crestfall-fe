import StudioBackLink from "@/components/studio/StudioBackLink";
import StudioPageHeader from "@/components/studio/StudioPageHeader";
import NpcRegistryBuilder from "@/components/studio/create/npc-registry/NpcRegistryBuilder";

export default function CreateNpcRegistryPage() {
  return (
    <div className="space-y-6">
      <StudioBackLink href="/studio?mode=full&section=worlds" label="Back to Full Studio" />

      <StudioPageHeader eyebrow="Relationship Spine" title="NPC Registry">
        Create a reusable relationship, alias, faction, and knowledge registry
        that story rooms can attach as their master NPC continuity graph.
      </StudioPageHeader>

      <NpcRegistryBuilder />
    </div>
  );
}