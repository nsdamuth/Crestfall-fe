import {
  StepTitle,
} from "@/components/studio/create/character/CharacterCreatorUtils";

import SkinToneModal from "@/components/studio/create/character/SkinToneModal";
import EyeColorModal from "@/components/studio/create/character/EyeColorModal";
import HairModal from "@/components/studio/create/character/HairModal";

import TraitModal from "@/components/studio/create/character/TraitModal";
import { visualHeritageReferenceOptions } from "@/components/studio/create/character/constants/constants";
import DefaultClothingSelector from "@/components/studio/create/character/DefaultClothingSelector";

export default function AppearanceStep({ form, updateField }) {
  return (
    <div>
      <StepTitle
        title="Appearance"
        body="Define the first visual anchor. Rendering style will remain changeable later; the character identity is not locked to one image style."
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <SkinToneModal form={form} updateField={updateField} />

        <EyeColorModal form={form} updateField={updateField} />

        <HairModal form={form} updateField={updateField} />

        <TraitModal
          label="Ethnic Appearance"
          field="visual_heritage_reference"
          form={form}
          updateField={updateField}
          options={visualHeritageReferenceOptions}
          description="Choose the real-world visual heritage reference the image generator should use for this character. This is separate from species and skin tone."
        />

        <DefaultClothingSelector form={form} updateField={updateField} />
      </div>
    </div>
  );
}