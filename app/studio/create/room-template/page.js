import StudioPageHeader from "@/components/studio/StudioPageHeader";
import RoomTemplateBuilderShell from "@/components/studio/create/room-template/RoomTemplateBuilderShell";
import StudioBackLink from "@/components/studio/StudioBackLink";

export default function CreateRoomTemplatePage() {
  return (
    <div className="space-y-6">
        <StudioBackLink href="/studio?mode=full&section=stories" label="Back to Full Studio" />
      <StudioPageHeader eyebrow="Create" title="Create Story">
        Package characters, a scenario, a narrator, opening messages, and room
        settings into a reusable playable room setup.
      </StudioPageHeader>
        
      <RoomTemplateBuilderShell />
    </div>
  );
}