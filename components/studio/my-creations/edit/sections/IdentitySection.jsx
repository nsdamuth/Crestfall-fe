"use client";

import CharacterColorPaletteModal from "@/components/studio/create/character/CharacterColorPaletteModal";
import CrestfallOptionModal from "@/components/ui/CrestfallOptionModal";

import CharacterIdentitySectionView from "./character-identity-section/CharacterIdentitySection.view";
import { useCharacterIdentitySectionViewModel } from "./character-identity-section/useCharacterIdentitySectionViewModel";

export default function IdentitySection(props) {
  const viewProps = useCharacterIdentitySectionViewModel(props);

  return (
    <CharacterIdentitySectionView
      {...viewProps}
      colorPaletteControl={
        <CharacterColorPaletteModal
          value={viewProps.colorPaletteValue}
          onChange={viewProps.onSelectColorPalette}
        />
      }
      roleArchetypeControl={
        <CrestfallOptionModal
          title={viewProps.roleArchetypeModalTitle}
          triggerLabel={viewProps.roleArchetypeLabel}
          value={viewProps.roleArchetypeValue}
          onChange={viewProps.onSelectRoleArchetype}
          options={viewProps.roleArchetypeOptions}
          groups={viewProps.roleArchetypeGroups}
          columns={viewProps.roleArchetypeColumns}
        />
      }
    />
  );
}
