"use client";

import EyeColorModal from "@/components/studio/create/character/EyeColorModal";
import HairModal from "@/components/studio/create/character/HairModal";
import SkinToneModal from "@/components/studio/create/character/SkinToneModal";
import TraitModal from "@/components/studio/create/character/TraitModal";
import OutfitPickerModal from "@/components/studio/create/wardrobe/OutfitPickerModal";

import CharacterAppearanceSectionView from "./character-appearance-section/CharacterAppearanceSection.view";
import { useCharacterAppearanceSectionViewModel } from "./character-appearance-section/useCharacterAppearanceSectionViewModel";

export default function AppearanceSection(props) {
  const viewProps = useCharacterAppearanceSectionViewModel(props);

  return (
    <>
      <CharacterAppearanceSectionView
        {...viewProps}
        skinToneControl={
          <SkinToneModal
            form={viewProps.appearanceData}
            updateField={viewProps.onChangeCharacterField}
          />
        }
        eyeColorControl={
          <EyeColorModal
            form={viewProps.appearanceData}
            updateField={viewProps.onChangeCharacterField}
          />
        }
        hairControl={
          <HairModal
            form={viewProps.appearanceData}
            updateField={viewProps.onChangeCharacterField}
          />
        }
        visualHeritageControl={
          <TraitModal
            label={viewProps.visualHeritageLabel}
            field="visual_heritage_reference"
            form={viewProps.appearanceData}
            updateField={viewProps.onChangeCharacterField}
            options={viewProps.visualHeritageOptions}
            description={viewProps.visualHeritageDescription}
          />
        }
      />

      {viewProps.activePicker === "OUTFIT" ? (
        <OutfitPickerModal
          title="Select Default Outfit"
          modalEyebrow="Character Clothing"
          modalDescription="Choose one Outfit creation to use as this character's default clothing source."
          searchPlaceholder="Search outfits..."
          creationType="OUTFIT"
          typeLabel="Outfit"
          selectedCreationId={viewProps.selectedOutfitId}
          normalizeSelection={viewProps.normalizeDefaultOutfitSelection}
          onClose={viewProps.onClosePicker}
          onSelect={viewProps.onApplySelection}
        />
      ) : null}

      {viewProps.activePicker === "WARDROBE" ? (
        <OutfitPickerModal
          title="Select Default Wardrobe"
          modalEyebrow="Character Clothing"
          modalDescription="Choose one Wardrobe creation to use as this character's default clothing source."
          searchPlaceholder="Search wardrobes..."
          creationType="WARDROBE"
          typeLabel="Wardrobe"
          selectedCreationId={viewProps.selectedWardrobeId}
          normalizeSelection={viewProps.normalizeDefaultWardrobeSelection}
          onClose={viewProps.onClosePicker}
          onSelect={viewProps.onApplySelection}
        />
      ) : null}
    </>
  );
}
