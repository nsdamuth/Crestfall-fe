"use client";

import { useCallback, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

import KitImageCreatorPanel from "@/components/kit/KitImageCreatorPanel";
import KitIngredientPicker from "@/components/kit/KitIngredientPicker";
import KitModalFrame from "@/components/kit/KitModalFrame";
import KitSaveIngredientPreset from "@/components/kit/KitSaveIngredientPreset";
import KitStudioPageView from "@/components/kit/studio-page/KitStudioPage.view";
import MediaHistoryGrid from "@/components/studio/image-studio/MediaHistoryGrid";
import { useIngredientPickerViewModel } from "@/components/studio/image-studio/ingredient-picker/useIngredientPickerViewModel";
import { useSaveIngredientPresetViewModel } from "@/components/studio/image-studio/save-ingredient-preset/useSaveIngredientPresetViewModel";
import StudioPageHeaderView from "@/components/studio/studio-page-header/StudioPageHeader.view";

import ImagesV2CameraPresetPicker from "./images-live/ImagesV2CameraPresetPicker";
import { useImagesV2LiveViewModel } from "./images-live/useImagesV2LiveViewModel";

function LiveIngredientPicker({ pickerProps, backLabel = null }) {
  const [searchValue, setSearchValue] = useState("");
  const picker = useIngredientPickerViewModel(pickerProps);
  const normalizedSearch = searchValue.trim().toLowerCase();
  const items = useMemo(
    () =>
      picker.items
        .filter((item) => {
          if (!normalizedSearch) return true;
          return `${item.title} ${item.subtitle} ${item.description} ${item.type}`
            .toLowerCase()
            .includes(normalizedSearch);
        })
        .map((item) => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle || item.type,
          imageSrc: item.imageUrl || null,
          isSelected: item.id === picker.selectedItemId,
        })),
    [picker.items, picker.selectedItemId, normalizedSearch]
  );

  return (
    <KitIngredientPicker
      slotLabel={picker.ingredientLabel}
      searchValue={searchValue}
      searchPlaceholder={picker.searchPlaceholder}
      onSearchChange={setSearchValue}
      items={items}
      emptyMessage={picker.emptyMessage}
      loadErrorMessage={picker.loadErrorMessage}
      onChooseIngredient={picker.onChooseIngredient}
      showUseCustomAction={picker.showUseCustomAction}
      onUseCustom={picker.onUseCustom}
      showCreatePresetAction={picker.showCreatePresetAction}
      onCreatePreset={picker.onCreatePreset}
      backLabel={backLabel}
      onClose={picker.onClose}
    />
  );
}

function LiveSavePreset({ saveProps, backLabel = null }) {
  const save = useSaveIngredientPresetViewModel(saveProps);

  return (
    <KitSaveIngredientPreset
      presetTypeLabel={save.presetTypeLabel}
      introText={save.introText}
      helperText={save.helperText}
      message={save.saveMessage}
      messageTone={save.saveMessageTone}
      nameValue={save.nameValue}
      onChangeName={save.onChangeName}
      descriptionValue={save.descriptionValue}
      onChangeDescription={save.onChangeDescription}
      promptValue={save.promptValue}
      onChangePrompt={save.onChangePrompt}
      tagsValue={save.tagsValue}
      onChangeTags={save.onChangeTags}
      isSaving={save.isSaving}
      canSave={save.canSave}
      onSavePreset={save.onSavePreset}
      onUseOnce={save.onUseOnce}
      backLabel={backLabel}
      onClose={save.isSaving ? null : save.onClose}
    />
  );
}

export default function ImagesV2Live() {
  const [mobileCreatorOpen, setMobileCreatorOpen] = useState(false);
  const [cameraPickerOpen, setCameraPickerOpen] = useState(false);
  const openCameraPresetPicker = useCallback(() => setCameraPickerOpen(true), []);
  const closeCameraPresetPicker = useCallback(() => setCameraPickerOpen(false), []);
  const live = useImagesV2LiveViewModel({
    onOpenCameraPresetPicker: openCameraPresetPicker,
  });
  const nestedBackLabel = mobileCreatorOpen ? "Back to Image Editor" : null;
  const generationStatus = String(live.panelProps?.generationStatus || "").toLowerCase();
  const generationPending = ["loading", "pending", "submitting"].includes(generationStatus);
  const canGenerate =
    Boolean(live.panelProps?.canGenerate) &&
    typeof live.panelProps?.onGenerate === "function";

  return (
    <>
      <div className="pb-24 min-[1100px]:pb-0">
        <KitStudioPageView
          compactMobile
          headerSlot={
            <StudioPageHeaderView
              compactMobile
              eyebrow="Images"
              title="Image Studio"
              description="Create images from your Crestfall assets, then manage and reuse the results from one live workspace."
            />
          }
        >
          <div className="flex items-start gap-[var(--space-6)]">
            <div className="min-w-0 flex-1">
              <MediaHistoryGrid
                {...live.mediaHistoryProps}
                imageStudioHref="/studio/v2/images"
                mobilePrimaryActionLabel="Image Editor"
                onMobilePrimaryAction={() => setMobileCreatorOpen(true)}
              />
            </div>

            <aside
              className="sticky hidden w-[24rem] flex-none overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-4)] min-[1100px]:block"
              style={{
                top: "calc(var(--topbar-h) + var(--space-4))",
                maxHeight: "calc(100dvh - var(--topbar-h) - var(--space-8))",
              }}
            >
              <KitImageCreatorPanel {...live.panelProps} />
            </aside>
          </div>
        </KitStudioPageView>
      </div>

      <div className="fixed inset-x-0 bottom-[calc(4.6rem+env(safe-area-inset-bottom))] z-40 px-[var(--space-4)] min-[1100px]:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-[var(--space-3)] rounded-[var(--radius-lg)] border border-[var(--gold-ornament)]/35 bg-[color-mix(in_srgb,var(--canvas)_92%,transparent)] p-[var(--space-2)] shadow-[var(--shadow-modal)] backdrop-blur-[var(--blur-chrome)]">
          <button
            type="button"
            onClick={() => live.panelProps?.onGenerate?.()}
            disabled={!canGenerate || generationPending}
            className="cf-btn cf-btn--primary flex min-h-[var(--control-lg)] flex-1 items-center justify-center gap-[var(--space-2)] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Generate image"
          >
            <Sparkles size={17} />
            <span>{generationPending ? "Generating..." : "Generate"}</span>
            {live.panelProps?.coinCostLabel ? (
              <span className="text-[length:var(--text-label)] opacity-80">
                {live.panelProps.coinCostLabel}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {mobileCreatorOpen ? (
        <KitModalFrame
          variant="modal"
          panelClassName="w-full max-w-2xl"
          onClose={() => setMobileCreatorOpen(false)}
          ariaLabel="Image Editor"
        >
          <div className="p-[var(--space-4)] pt-[var(--space-5)] sm:p-[var(--space-6)] sm:pt-[var(--space-8)]">
            <KitImageCreatorPanel {...live.panelProps} />
          </div>
        </KitModalFrame>
      ) : null}

      {live.pickerModalProps ? (
        <LiveIngredientPicker
          key={live.pickerModalProps.slot?.id || "ingredient-picker"}
          pickerProps={live.pickerModalProps}
          backLabel={nestedBackLabel}
        />
      ) : null}

      {live.savePresetModalProps ? (
        <LiveSavePreset
          key={live.savePresetModalProps.slot?.id || "save-preset"}
          saveProps={live.savePresetModalProps}
          backLabel={nestedBackLabel}
        />
      ) : null}

      {cameraPickerOpen ? (
        <ImagesV2CameraPresetPicker
          {...live.cameraPickerProps}
          onClose={closeCameraPresetPicker}
        />
      ) : null}
    </>
  );
}
