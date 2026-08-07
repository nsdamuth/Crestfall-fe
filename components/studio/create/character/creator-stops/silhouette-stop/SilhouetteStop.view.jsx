"use client";

import {
  ChipRow,
  EmptyStateCard,
  Eyebrow,
  FieldPair,
  Fold,
  InlineDropdown,
  MultiChipRow,
  SectionLabel,
  TextAreaField,
  TextField,
  TileGrid,
} from "../shared/Controls";
import {
  BODY_TYPE_OPTIONS,
  bodyTypeLabelFromValue,
  bodyTypeValueFromLabel,
  BUILD_OPTIONS,
  buildLabelFromValue,
  buildValueFromLabel,
  DEFAULT_CLOTHING_MODE_OPTIONS,
  HEIGHT_OPTIONS,
  heightLabelFromValue,
  heightValueFromLabel,
  KIBBE_IDENTITY_OPTIONS,
  PROPORTION_OPTIONS,
  SILHOUETTE_NOTES_MAX_LENGTH,
} from "./SilhouetteStop.contract";

// Photographic kibbe identity art was retired; every tile falls back to
// TileGrid's geometric placeholder mark.
const KIBBE_IDENTITY_TILE_OPTIONS = KIBBE_IDENTITY_OPTIONS;

export default function SilhouetteStopView({
  kibbeIdentity = "",
  bodyType = "",
  height = "",
  build = "",
  proportions = [],
  chestBust = "",
  bodyNotes = "",
  appearanceNotes = "",
  clothingStyle = "",
  defaultClothingMode = "NONE",
  defaultOutfitTitle = "",
  defaultWardrobeTitle = "",
  onChangeKibbeIdentity = null,
  onChangeBodyType = null,
  onChangeHeight = null,
  onChangeBuild = null,
  onChangeProportions = null,
  onChangeChestBust = null,
  onChangeBodyNotes = null,
  onChangeAppearanceNotes = null,
  onChangeClothingStyle = null,
  onChangeDefaultClothingMode = null,
  onOpenOutfitPicker = null,
  onOpenWardrobePicker = null,
  fineTuneFoldOpen = false,
  onToggleFineTuneFold = null,
} = {}) {
  const fineTuneFilled = Boolean(
    bodyType ||
      height ||
      build ||
      (proportions && proportions.length) ||
      chestBust ||
      bodyNotes ||
      appearanceNotes
  );

  const hasClothingSelection =
    defaultClothingMode === "OUTFIT"
      ? Boolean(defaultOutfitTitle)
      : defaultClothingMode === "WARDROBE"
        ? Boolean(defaultWardrobeTitle)
        : false;

  return (
    <>
      <Eyebrow>Shape the silhouette</Eyebrow>
      <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">
        The line of their body
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        Pick an identity and Crestfall fills the frame beneath it. Fine-tune
        only if you care to.
      </p>

      <div className="mt-6">
        <SectionLabel>Body identity</SectionLabel>
        <TileGrid
          options={KIBBE_IDENTITY_TILE_OPTIONS}
          value={kibbeIdentity}
          onChange={onChangeKibbeIdentity}
          imagePosition="contain"
        />
      </div>

      <div className="mt-6">
        <FieldPair>
          <div>
            <SectionLabel>Clothing style</SectionLabel>
            <input
              type="text"
              value={clothingStyle}
              onChange={(event) => onChangeClothingStyle?.(event.target.value)}
              placeholder="Describe their general clothing style"
              className="cf-field w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)]"
            />
          </div>

          <InlineDropdown
            label="Default clothing"
            options={DEFAULT_CLOTHING_MODE_OPTIONS}
            value={defaultClothingMode}
            onChange={onChangeDefaultClothingMode}
            placeholder="None"
          />

          {defaultClothingMode === "OUTFIT" ? (
            <div className="sm:col-span-2">
              <EmptyStateCard
                message={
                  hasClothingSelection
                    ? `Selected outfit: ${defaultOutfitTitle}`
                    : "No outfit selected. The outfit browser is not built in this pass."
                }
                actions={[{ label: "Select outfit", onClick: onOpenOutfitPicker }]}
              />
            </div>
          ) : null}

          {defaultClothingMode === "WARDROBE" ? (
            <div className="sm:col-span-2">
              <EmptyStateCard
                message={
                  hasClothingSelection
                    ? `Selected wardrobe: ${defaultWardrobeTitle}`
                    : "No wardrobe selected. The wardrobe browser is not built in this pass."
                }
                actions={[
                  { label: "Select wardrobe", onClick: onOpenWardrobePicker },
                ]}
              />
            </div>
          ) : null}
        </FieldPair>
      </div>

      <Fold
        title="Fine-tune the body"
        sub="Body type, height, build, and proportions"
        open={fineTuneFoldOpen}
        onToggle={onToggleFineTuneFold}
        filled={fineTuneFilled}
      >
        <div>
          <SectionLabel>Body type</SectionLabel>
          <ChipRow
            options={BODY_TYPE_OPTIONS}
            value={bodyTypeLabelFromValue(bodyType)}
            onChange={(label) => onChangeBodyType?.(bodyTypeValueFromLabel(label))}
          />
        </div>

        <div>
          <SectionLabel>Height</SectionLabel>
          <ChipRow
            options={HEIGHT_OPTIONS}
            value={heightLabelFromValue(height)}
            onChange={(label) => onChangeHeight?.(heightValueFromLabel(label))}
          />
        </div>

        <div>
          <SectionLabel>Build</SectionLabel>
          <ChipRow
            options={BUILD_OPTIONS}
            value={buildLabelFromValue(build)}
            onChange={(label) => onChangeBuild?.(buildValueFromLabel(label))}
          />
        </div>

        <div>
          <SectionLabel>Proportions</SectionLabel>
          <MultiChipRow
            options={PROPORTION_OPTIONS}
            values={proportions}
            onChange={onChangeProportions}
          />
        </div>

        <TextField
          label="Chest / bust"
          value={chestBust}
          onChange={onChangeChestBust}
          placeholder="Optional description"
        />

        <TextAreaField
          label="Body notes"
          value={bodyNotes}
          onChange={onChangeBodyNotes}
          placeholder="Anything else about their body"
          maxLength={SILHOUETTE_NOTES_MAX_LENGTH}
        />

        <TextAreaField
          label="Appearance notes"
          value={appearanceNotes}
          onChange={onChangeAppearanceNotes}
          placeholder="Anything else about how they look"
          maxLength={SILHOUETTE_NOTES_MAX_LENGTH}
        />
      </Fold>
    </>
  );
}
