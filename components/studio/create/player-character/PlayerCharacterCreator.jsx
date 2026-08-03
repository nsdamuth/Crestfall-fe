"use client";

import CharacterColorPaletteModal from "@/components/studio/create/character/CharacterColorPaletteModal";
import DefaultClothingSelector from "@/components/studio/create/character/DefaultClothingSelector";
import HairEyesModal from "@/components/studio/create/character/HairEyesModal";
import SkinToneModal from "@/components/studio/create/character/SkinToneModal";
import TraitModal from "@/components/studio/create/character/TraitModal";
import {
  PLAYER_CHARACTER_BODY_TYPE_OPTIONS,
  PLAYER_CHARACTER_BUILD_OPTIONS,
  PLAYER_CHARACTER_HEIGHT_OPTIONS,
} from "./player-character-creator/PlayerCharacterCreator.contract";
import PlayerCharacterCreatorView from "./player-character-creator/PlayerCharacterCreator.view";
import { usePlayerCharacterCreatorViewModel } from "./player-character-creator/usePlayerCharacterCreatorViewModel";

export default function PlayerCharacterCreator(props) {
  const { viewProps, applicationFieldProps } =
    usePlayerCharacterCreatorViewModel(props);
  const { form, updateField } = applicationFieldProps;

  return (
    <PlayerCharacterCreatorView
      {...viewProps}
      characterColorPaletteContent={
        <CharacterColorPaletteModal
          value={form.character_color_palette_id}
          onChange={(value) => updateField("character_color_palette_id", value)}
        />
      }
      skinToneContent={
        <SkinToneModal form={form} updateField={updateField} />
      }
      eyeColorContent={
        <HairEyesModal
          label="Eye Color"
          summaryField="eye_color"
          form={form}
          updateField={updateField}
        />
      }
      hairColorContent={
        <HairEyesModal
          label="Hair Color"
          summaryField="hair_color"
          form={form}
          updateField={updateField}
        />
      }
      hairStyleContent={
        <HairEyesModal
          label="Hair Style"
          summaryField="hair_style"
          form={form}
          updateField={updateField}
        />
      }
      defaultClothingContent={
        <DefaultClothingSelector form={form} updateField={updateField} />
      }
      bodyTypeContent={
        <TraitModal
          label="Body Type"
          field="body_type"
          form={form}
          updateField={updateField}
          options={PLAYER_CHARACTER_BODY_TYPE_OPTIONS}
          description="Choose a broad body silhouette."
        />
      }
      heightContent={
        <TraitModal
          label="Height"
          field="height"
          form={form}
          updateField={updateField}
          options={PLAYER_CHARACTER_HEIGHT_OPTIONS}
          description="Use relative adult height descriptors rather than exact measurements."
        />
      }
      buildContent={
        <TraitModal
          label="Build"
          field="build"
          form={form}
          updateField={updateField}
          options={PLAYER_CHARACTER_BUILD_OPTIONS}
          description="Choose how the character’s frame feels physically."
        />
      }
    />
  );
}
