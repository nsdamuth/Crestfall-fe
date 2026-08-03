import {
  SectionTitle,
  TextAreaField,
  TextField,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function ImagePresetRenderingNotesSectionView({
  sectionEyebrow = "Image Preset Editor",
  sectionTitle = "Rendering Notes",
  sectionDescription = "",
  lightingStyleLabel = "Lighting Style",
  lightingStyleValue = "",
  detailLevelLabel = "Detail Level",
  detailLevelValue = "",
  lineworkLabel = "Linework",
  lineworkValue = "",
  shadingLabel = "Shading",
  shadingValue = "",
  moodLabel = "Mood / Atmosphere",
  moodValue = "",
  compositionStyleLabel = "Composition Style",
  compositionStyleValue = "",
  renderingGuidanceLabel = "Rendering Guidance",
  renderingGuidanceValue = "",
  renderingGuidancePlaceholder = "",
  onChangeLightingStyle = null,
  onChangeDetailLevel = null,
  onChangeLinework = null,
  onChangeShading = null,
  onChangeMood = null,
  onChangeCompositionStyle = null,
  onChangeRenderingGuidance = null,
}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <TextField
          label={lightingStyleLabel}
          value={lightingStyleValue}
          onChange={(value) => onChangeLightingStyle?.(value)}
        />

        <TextField
          label={detailLevelLabel}
          value={detailLevelValue}
          onChange={(value) => onChangeDetailLevel?.(value)}
        />

        <TextField
          label={lineworkLabel}
          value={lineworkValue}
          onChange={(value) => onChangeLinework?.(value)}
        />

        <TextField
          label={shadingLabel}
          value={shadingValue}
          onChange={(value) => onChangeShading?.(value)}
        />

        <TextField
          label={moodLabel}
          value={moodValue}
          onChange={(value) => onChangeMood?.(value)}
        />

        <TextField
          label={compositionStyleLabel}
          value={compositionStyleValue}
          onChange={(value) => onChangeCompositionStyle?.(value)}
        />

        <div className="md:col-span-2">
          <TextAreaField
            label={renderingGuidanceLabel}
            value={renderingGuidanceValue}
            onChange={(value) => onChangeRenderingGuidance?.(value)}
            placeholder={renderingGuidancePlaceholder}
          />
        </div>
      </div>
    </div>
  );
}
