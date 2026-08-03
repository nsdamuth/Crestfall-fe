import {
  SectionTitle,
  TextAreaField,
  TextField,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function ImagePresetStyleMediumSectionView({
  sectionEyebrow = "Image Preset Editor",
  sectionTitle = "Style / Medium",
  sectionDescription = "",
  mediumLabel = "Medium",
  mediumValue = "",
  artStyleLabel = "Art Style",
  artStyleValue = "",
  artistInfluenceLabel = "Artist / Era Influence",
  artistInfluenceValue = "",
  renderingModeLabel = "Rendering Mode",
  renderingModeValue = "",
  textureStyleLabel = "Texture Style",
  textureStyleValue = "",
  colorPaletteLabel = "Color Palette",
  colorPaletteValue = "",
  styleNotesLabel = "Style Notes",
  styleNotesValue = "",
  styleNotesPlaceholder = "",
  onChangeMedium = null,
  onChangeArtStyle = null,
  onChangeArtistInfluence = null,
  onChangeRenderingMode = null,
  onChangeTextureStyle = null,
  onChangeColorPalette = null,
  onChangeStyleNotes = null,
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
          label={mediumLabel}
          value={mediumValue}
          onChange={(value) => onChangeMedium?.(value)}
        />

        <TextField
          label={artStyleLabel}
          value={artStyleValue}
          onChange={(value) => onChangeArtStyle?.(value)}
        />

        <TextField
          label={artistInfluenceLabel}
          value={artistInfluenceValue}
          onChange={(value) => onChangeArtistInfluence?.(value)}
        />

        <TextField
          label={renderingModeLabel}
          value={renderingModeValue}
          onChange={(value) => onChangeRenderingMode?.(value)}
        />

        <TextField
          label={textureStyleLabel}
          value={textureStyleValue}
          onChange={(value) => onChangeTextureStyle?.(value)}
        />

        <TextField
          label={colorPaletteLabel}
          value={colorPaletteValue}
          onChange={(value) => onChangeColorPalette?.(value)}
        />

        <div className="md:col-span-2">
          <TextAreaField
            label={styleNotesLabel}
            value={styleNotesValue}
            onChange={(value) => onChangeStyleNotes?.(value)}
            placeholder={styleNotesPlaceholder}
          />
        </div>
      </div>
    </div>
  );
}
