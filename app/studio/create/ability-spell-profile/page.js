import StudioBackLink from "@/components/studio/StudioBackLink";
import StudioPageHeader from "@/components/studio/StudioPageHeader";
import AbilitySpellProfileBuilderShell from "@/components/studio/create/ability-spell/AbilitySpellProfileBuilderShell";

export default function CreateAbilitySpellProfilePage() {
  return (
    <div className="space-y-6">
      <StudioBackLink href="/studio?mode=full&section=mechanics" label="Back to Full Studio" />
      <StudioPageHeader eyebrow="Actor Ability & Magic Definitions" title="Create Ability & Spell Profile">
        Define reusable Spells, Abilities, Techniques, Special Attacks, and Passives for later attachment through an Actor Mechanics Profile.
      </StudioPageHeader>
      <AbilitySpellProfileBuilderShell />
    </div>
  );
}
