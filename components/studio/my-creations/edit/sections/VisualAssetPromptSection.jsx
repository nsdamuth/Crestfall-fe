import {
  SectionTitle,
  TextAreaField,
  SHORT_LONGFORM_MAX_LENGTH,
  DEEP_LONGFORM_MAX_LENGTH,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function VisualAssetPromptSection({ form, updateDataField }) {
  const data = form.data || {};

  return (
    <div>
      <SectionTitle
        eyebrow="Image Ingredient"
        title="Prompt / Guidance"
        body="Edit the reusable visual guidance this asset contributes to Image Studio and future generated media workflows."
      />

      <div className="mt-6 grid gap-5">
        <TextAreaField
          label="Prompt Guidance"
          value={data.prompt_guidance || data.prompt || ""}
          onChange={(value) => updateDataField("prompt_guidance", value)}
          placeholder="Reusable prompt guidance for this visual asset."
          maxLength={DEEP_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label="Design / Description Reference"
          value={data.design_reference || data.reference_description || ""}
          onChange={(value) => updateDataField("design_reference", value)}
          placeholder="Describe the visual design, atmosphere, materials, silhouette, or style reference."
          maxLength={DEEP_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label="Usage Notes"
          value={data.usage_notes || ""}
          onChange={(value) => updateDataField("usage_notes", value)}
          placeholder="When should this asset be used? What kinds of images does it support?"
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label="Registry / Continuity Notes"
          value={data.registry_notes || ""}
          onChange={(value) => updateDataField("registry_notes", value)}
          placeholder="Optional notes for future registry links, such as a Location Registry entry this visual asset represents."
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />
      </div>
    </div>
  );
}