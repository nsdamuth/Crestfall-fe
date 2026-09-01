"use client";

import TraitModal from "@/components/studio/create/character/TraitModal";
import MultiTraitModal from "@/components/studio/create/character/MultiTraitModal";
import KibbePresetModal from "@/components/studio/create/character/KibbePresetModal";

import CharacterBodySectionView from "./character-body-section/CharacterBodySection.view";
import { useCharacterBodySectionViewModel } from "./character-body-section/useCharacterBodySectionViewModel";

export default function BodySection(props) {
  const viewProps = useCharacterBodySectionViewModel(props);

  return (
    <CharacterBodySectionView
      {...viewProps}
      kibbePresetControl={
        <KibbePresetModal
          label="Body Identity"
          form={viewProps.bodyData}
          updateField={viewProps.onChangeCharacterField}
        />
      }
      bodyTypeControl={
        <TraitModal
          label={viewProps.bodyTypeLabel}
          field={viewProps.bodyTypeField}
          form={viewProps.bodyData}
          updateField={viewProps.onChangeCharacterField}
          options={viewProps.bodyTypeOptions}
          description={viewProps.bodyTypeDescription}
        />
      }
      heightControl={
        <TraitModal
          label={viewProps.heightLabel}
          field={viewProps.heightField}
          form={viewProps.bodyData}
          updateField={viewProps.onChangeCharacterField}
          options={viewProps.heightOptions}
          description={viewProps.heightDescription}
        />
      }
      buildControl={
        <TraitModal
          label={viewProps.buildLabel}
          field={viewProps.buildField}
          form={viewProps.bodyData}
          updateField={viewProps.onChangeCharacterField}
          options={viewProps.buildOptions}
          description={viewProps.buildDescription}
        />
      }
      proportionsControl={
        <MultiTraitModal
          label={viewProps.proportionsLabel}
          field={viewProps.proportionsField}
          form={viewProps.bodyData}
          updateField={viewProps.onChangeCharacterField}
          options={viewProps.proportionOptions}
          description={viewProps.proportionsDescription}
        />
      }
    />
  );
}
