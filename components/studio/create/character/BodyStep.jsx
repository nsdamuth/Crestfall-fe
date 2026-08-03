
import {
    StepTitle,
    TextAreaField,
} from "@/components/studio/create/character/CharacterCreatorUtils"
import TraitModal from "@/components/studio/create/character/TraitModal"
import MultiTraitModal from "@/components/studio/create/character/MultiTraitModal";
import KibbePresetModal from "@/components/studio/create/character/KibbePresetModal";

import { 
    bodyTypeOptions, heightOptions, buildOptions, proportionOptions
 } from "@/components/studio/create/character/constants/constants"

export default function BodyStep({ form, updateField }) {
  return (
    <div>
      <StepTitle
        title="Body"
        body="Define the character’s physical silhouette. These details help visual generation, narration, movement, and scene description."
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <KibbePresetModal form={form} updateField={updateField} />
        </div>

        <TraitModal
          label="Body Type"
          field="body_type"
          form={form}
          updateField={updateField}
          options={bodyTypeOptions}
          description="Choose a broad body silhouette."
        />

        <TraitModal
          label="Height"
          field="height"
          form={form}
          updateField={updateField}
          options={heightOptions}
          description="Use relative adult height descriptors rather than exact measurements."
        />

        <TraitModal
          label="Build"
          field="build"
          form={form}
          updateField={updateField}
          options={buildOptions}
          description="Choose how the character’s frame feels physically."
        />

        <MultiTraitModal
          label="Proportions"
          field="proportions"
          form={form}
          updateField={updateField}
          options={proportionOptions}
          description="Optional silhouette emphasis for image generation and narration. You can select multiple compatible traits."
        />

        <div className="md:col-span-2">
          <TextAreaField
            label="Custom Body Notes"
            value={form.body_notes}
            onChange={(value) => updateField("body_notes", value)}
            placeholder="Optional physical details that should affect image generation or narration."
          />
        </div>
      </div>
    </div>
  );
}