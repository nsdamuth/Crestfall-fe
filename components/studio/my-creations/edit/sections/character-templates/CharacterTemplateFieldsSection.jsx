"use client";

import CrestfallOptionModal from "@/components/ui/CrestfallOptionModal";
import SkinToneModal from "@/components/studio/create/character/SkinToneModal";
import HairEyesModal from "@/components/studio/create/character/HairEyesModal";
import PersonalityModal from "@/components/studio/create/character/PersonalityModal";
import TraitModal from "@/components/studio/create/character/TraitModal";
import MultiTraitModal from "@/components/studio/create/character/MultiTraitModal";
import KibbePresetModal from "@/components/studio/create/character/KibbePresetModal";

import CharacterTemplateFieldsSectionView from "../character-template-fields-section/CharacterTemplateFieldsSection.view";
import { useCharacterTemplateFieldsSectionViewModel } from "../character-template-fields-section/useCharacterTemplateFieldsSectionViewModel";

export default function CharacterTemplateFieldsSection(props) {
  const { viewProps, applicationControlProps } =
    useCharacterTemplateFieldsSectionViewModel(props);
  const {
    templateForm,
    updateTemplateFormField,
    updateTemplateFormFields,
  } = applicationControlProps;

  return (
    <CharacterTemplateFieldsSectionView
      {...viewProps}
      roleArchetypeControl={
        <CrestfallOptionModal
          title="Select Role Archetype"
          triggerLabel="Role Archetype"
          value={applicationControlProps.roleArchetypeValue}
          onChange={(value) =>
            updateTemplateFormField("short_concept", value)
          }
          options={applicationControlProps.roleArchetypeOptions}
          groups={applicationControlProps.roleArchetypeGroups}
          columns={3}
        />
      }
      skinToneControl={
        <SkinToneModal
          form={templateForm}
          updateField={updateTemplateFormField}
        />
      }
      eyeColorControl={
        <HairEyesModal
          label="Eye Color"
          summaryField="eye_color"
          form={templateForm}
          updateField={updateTemplateFormField}
        />
      }
      hairColorControl={
        <HairEyesModal
          label="Hair Color"
          summaryField="hair_color"
          form={templateForm}
          updateField={updateTemplateFormField}
        />
      }
      hairStyleControl={
        <HairEyesModal
          label="Hair Style"
          summaryField="hair_style"
          form={templateForm}
          updateField={updateTemplateFormField}
        />
      }
      kibbePresetControl={
        <KibbePresetModal
          form={templateForm}
          updateField={updateTemplateFormField}
          updateFields={updateTemplateFormFields}
        />
      }
      bodyTypeControl={
        <TraitModal
          label="Body Type"
          field="body_type"
          form={templateForm}
          updateField={updateTemplateFormField}
          options={applicationControlProps.bodyTypeOptions}
          description="Choose a broad body silhouette."
        />
      }
      heightControl={
        <TraitModal
          label="Height"
          field="height"
          form={templateForm}
          updateField={updateTemplateFormField}
          options={applicationControlProps.heightOptions}
          description="Use relative adult height descriptors rather than exact measurements."
        />
      }
      buildControl={
        <TraitModal
          label="Build"
          field="build"
          form={templateForm}
          updateField={updateTemplateFormField}
          options={applicationControlProps.buildOptions}
          description="Choose how the character’s frame feels physically."
        />
      }
      proportionsControl={
        <MultiTraitModal
          label="Proportions"
          field="proportions"
          form={templateForm}
          updateField={updateTemplateFormField}
          options={applicationControlProps.proportionOptions}
          description="Optional silhouette emphasis for image generation and narration. You can select multiple compatible traits."
        />
      }
      outwardPersonalityControl={
        <PersonalityModal
          label="Outward Personality"
          field="outward_personality"
          form={templateForm}
          updateField={updateTemplateFormField}
        />
      }
      internalPersonalityControl={
        <PersonalityModal
          label="Internal Personality"
          field="internal_personality"
          form={templateForm}
          updateField={updateTemplateFormField}
        />
      }
      mbtiControl={
        <TraitModal
          label="MBTI Personality Type"
          field="mbti_type"
          form={templateForm}
          updateField={updateTemplateFormField}
          options={applicationControlProps.mbtiTypeOptions}
          description="Choose an optional MBTI-style archetype for supplemental personality flavor only."
        />
      }
      westernZodiacControl={
        <TraitModal
          label="Western Zodiac"
          field="western_zodiac_sign"
          form={templateForm}
          updateField={updateTemplateFormField}
          options={applicationControlProps.westernZodiacOptions}
          description="Choose an optional Western zodiac archetype for supplemental narrative flavor only."
        />
      }
      eastAsianZodiacControl={
        <TraitModal
          label="East Asian Zodiac"
          field="east_asian_zodiac_sign"
          form={templateForm}
          updateField={updateTemplateFormField}
          options={applicationControlProps.eastAsianZodiacOptions}
          description="Choose an optional East Asian zodiac animal for supplemental narrative flavor only."
        />
      }
      speechStyleControl={
        <TraitModal
          label="Speech Style"
          field="speech_style"
          form={templateForm}
          updateField={updateTemplateFormField}
          options={applicationControlProps.speechStyleOptions}
          description="How the character tends to speak in dialogue."
        />
      }
      movementStyleControl={
        <TraitModal
          label="Movement Style"
          field="movement_style"
          form={templateForm}
          updateField={updateTemplateFormField}
          options={applicationControlProps.movementStyleOptions}
          description="How the character physically carries themselves in scenes."
        />
      }
      interestsControl={
        <TraitModal
          label="Interests"
          field="interests"
          form={templateForm}
          updateField={updateTemplateFormField}
          options={applicationControlProps.interestOptions}
          description="Core subjects, goals, or fascinations the character naturally gravitates toward."
        />
      }
    />
  );
}
