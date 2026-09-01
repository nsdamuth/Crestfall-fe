"use client";

import PersonalityModal from "@/components/studio/create/character/PersonalityModal";
import TraitModal from "@/components/studio/create/character/TraitModal";
import MultiTraitModal from "@/components/studio/create/character/MultiTraitModal";
import VoiceModulePickerModal from "@/components/studio/create/character/VoiceModulePickerModal";

import CharacterBehaviorSectionView from "./character-behavior-section/CharacterBehaviorSection.view";
import { useCharacterBehaviorSectionViewModel } from "./character-behavior-section/useCharacterBehaviorSectionViewModel";

export default function BehaviorSection(props) {
  const viewProps = useCharacterBehaviorSectionViewModel(props);

  return (
    <CharacterBehaviorSectionView
      {...viewProps}
      outwardPersonalityControl={
        <PersonalityModal
          label={viewProps.outwardPersonalityLabel}
          field={viewProps.outwardPersonalityField}
          form={viewProps.behaviorData}
          updateField={viewProps.onChangeCharacterField}
        />
      }
      internalPersonalityControl={
        <PersonalityModal
          label={viewProps.internalPersonalityLabel}
          field={viewProps.internalPersonalityField}
          form={viewProps.behaviorData}
          updateField={viewProps.onChangeCharacterField}
        />
      }
      mbtiControl={
        <TraitModal
          label={viewProps.mbtiLabel}
          field={viewProps.mbtiField}
          form={viewProps.behaviorData}
          updateField={viewProps.onChangeCharacterField}
          options={viewProps.mbtiOptions}
          description={viewProps.mbtiDescription}
        />
      }
      westernZodiacControl={
        <TraitModal
          label={viewProps.westernZodiacLabel}
          field={viewProps.westernZodiacField}
          form={viewProps.behaviorData}
          updateField={viewProps.onChangeCharacterField}
          options={viewProps.westernZodiacOptions}
          description={viewProps.westernZodiacDescription}
        />
      }
      eastAsianZodiacControl={
        <TraitModal
          label={viewProps.eastAsianZodiacLabel}
          field={viewProps.eastAsianZodiacField}
          form={viewProps.behaviorData}
          updateField={viewProps.onChangeCharacterField}
          options={viewProps.eastAsianZodiacOptions}
          description={viewProps.eastAsianZodiacDescription}
        />
      }
      speechStyleControl={
        <TraitModal
          label={viewProps.speechStyleLabel}
          field={viewProps.speechStyleField}
          form={viewProps.behaviorData}
          updateField={viewProps.onChangeCharacterField}
          options={viewProps.speechStyleOptions}
          description={viewProps.speechStyleDescription}
        />
      }
      movementStyleControl={
        <TraitModal
          label={viewProps.movementStyleLabel}
          field={viewProps.movementStyleField}
          form={viewProps.behaviorData}
          updateField={viewProps.onChangeCharacterField}
          options={viewProps.movementStyleOptions}
          description={viewProps.movementStyleDescription}
        />
      }
      voiceModulesControl={
        <VoiceModulePickerModal
          value={viewProps.voiceModuleIds}
          onChange={viewProps.onChangeVoiceModuleIds}
          description={viewProps.voiceModulesDescription}
        />
      }
      interestsControl={
        <MultiTraitModal
          label={viewProps.interestsLabel}
          field={viewProps.interestsField}
          form={viewProps.behaviorData}
          updateField={viewProps.onChangeCharacterField}
          options={viewProps.interestOptions}
          description={viewProps.interestsDescription}
        />
      }
    />
  );
}
