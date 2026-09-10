"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ImagePlus } from "lucide-react";

import KitImageCreatorPanel from "@/components/kit/KitImageCreatorPanel";
import KitIngredientPicker from "@/components/kit/KitIngredientPicker";
import KitPromoBannerView from "@/components/kit/promo-banner/KitPromoBanner.view";
import KitSaveIngredientPreset from "@/components/kit/KitSaveIngredientPreset";
import KitStudioFilterBarView from "@/components/kit/studio-filter-bar/KitStudioFilterBar.view";
import KitStudioPageView from "@/components/kit/studio-page/KitStudioPage.view";
import MediaHistoryGridSkin from "@/components/studio/image-studio/MediaHistoryGridSkin";
import { useMediaHistoryGridViewModel } from "@/components/studio/image-studio/media-history-grid/useMediaHistoryGridViewModel";
import ViewModeToggleView from "@/components/studio/view-mode-toggle/ViewModeToggle.view";
import { useIngredientPickerViewModel } from "@/components/studio/image-studio/ingredient-picker/useIngredientPickerViewModel";
import { useSaveIngredientPresetViewModel } from "@/components/studio/image-studio/save-ingredient-preset/useSaveIngredientPresetViewModel";
import StudioPageHeaderView from "@/components/studio/studio-page-header/StudioPageHeader.view";

import ImagesV2CameraPresetPicker from "./images-live/ImagesV2CameraPresetPicker";
import ImagesV2ComposerSheet from "./images-live/ImagesV2ComposerSheet";
import { useImagesV2LiveViewModel } from "./images-live/useImagesV2LiveViewModel";
import { orderFilterGroups } from "../catalog/creationCatalogFilterTaxonomy.js";

// Filter sections, RULED 6 Sep 2026 (FE/FILTERS, Brian): Activity
// (Liked, Saved) first, then Media (All, Images, Videos); multi-select
// across sections, one media pick, All clears the media pick. No Sort
// on Images (the jobs feed has no sort, CR-058). Labels Title Case.
const MEDIA_OPTIONS = [
  { value: "ALL", label: "All" },
  { value: "IMAGES", label: "Images" },
  { value: "VIDEOS", label: "Videos" },
];
const ACTIVITY_OPTIONS = [
  { value: "LIKED", label: "Liked" },
  { value: "BOOKMARKED", label: "Saved" },
];

function countMedia(items, value) {
  if (value === "IMAGES") return items.filter((item) => item.type !== "VIDEO").length;
  if (value === "VIDEOS") return items.filter((item) => item.type === "VIDEO").length;
  return items.length;
}

function countActivity(items, value) {
  if (value === "LIKED") return items.filter((item) => item.liked).length;
  return items.filter((item) => item.bookmarked).length;
}

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
      sourceMode={picker.sourceMode}
      sourceOptions={picker.sourceOptions}
      onSourceModeChange={(nextMode) => {
        setSearchValue("");
        picker.onSourceModeChange?.(nextMode);
      }}
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileCreatorOpen, setMobileCreatorOpen] = useState(false);
  const [cameraPickerOpen, setCameraPickerOpen] = useState(false);
  // Stage tab (Generate, Remix): page-local presentation state. The
  // Remix body is a later session (note 5); today it reads "Not
  // available yet".
  const [composerStage, setComposerStage] = useState("GENERATE");
  const openCameraPresetPicker = useCallback(() => setCameraPickerOpen(true), []);
  const closeCameraPresetPicker = useCallback(() => setCameraPickerOpen(false), []);
  const sharedImageOutputId = String(searchParams?.get("image") || "").trim();
  const syncLightboxShareLink = useCallback(
    (imageOutputId) => {
      const currentQuery = searchParams?.toString() || "";
      const params = new URLSearchParams(currentQuery);

      if (imageOutputId) params.set("image", imageOutputId);
      else params.delete("image");

      const nextQuery = params.toString();
      if (nextQuery === currentQuery) return;

      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  const live = useImagesV2LiveViewModel({
    onOpenCameraPresetPicker: openCameraPresetPicker,
    stage: composerStage,
    onChangeStage: setComposerStage,
  });
  // The page owns the shared filter bar (RULED 6 Sep 2026), so it calls
  // the grid ViewModel itself and renders the grid skin with the
  // header's own filter controls off.
  const grid = useMediaHistoryGridViewModel({
    ...live.mediaHistoryProps,
    imageStudioHref: "/studio/v2/images",
    initialActivePreviewId: sharedImageOutputId || null,
    onActivePreviewChange: syncLightboxShareLink,
  });
  const filterGroups = useMemo(
    () =>
      orderFilterGroups([
        {
          id: "activity",
          label: "Activity",
          isMultiSelect: true,
          options: ACTIVITY_OPTIONS.map((option) => ({
            ...option,
            count: countActivity(grid.mediaItems, option.value),
          })),
        },
        {
          id: "media",
          label: "Media",
          isMultiSelect: false,
          options: MEDIA_OPTIONS.map((option) => ({
            ...option,
            count: countMedia(grid.mediaItems, option.value),
          })),
        },
      ]),
    [grid.mediaItems]
  );
  const selectedFilterValues = useMemo(
    () => ({
      activity: grid.activityFilters,
      media: grid.mediaFilter === "ALL" ? [] : [grid.mediaFilter],
    }),
    [grid.activityFilters, grid.mediaFilter]
  );
  const nestedBackLabel = mobileCreatorOpen ? "Back to the composer" : null;

  return (
    <>
      <div className="pb-24 min-[1100px]:pb-0">
        <KitStudioPageView
          compactMobile
          headerSlot={
            <StudioPageHeaderView
              compactMobile
              eyebrow="Create"
              title="Media Studio"
              description="Generate images and video from your assets. Manage, reuse, and share them all in one place."
            />
          }
          filterBarSlot={
            <KitStudioFilterBarView
              searchValue={grid.searchQuery}
              searchPlaceholder="Search your images"
              onSearchChange={grid.onChangeSearchQuery}
              filterGroups={filterGroups}
              selectedValues={selectedFilterValues}
              onFilterToggle={(groupId, value) => {
                if (groupId === "media") grid.onSetMediaFilter?.(value);
                else grid.onToggleActivityFilter?.(value);
              }}
              onClearFilters={grid.onClearFilters}
              sortOptions={[]}
              viewModeSlot={
                // Density, RULED 6 Sep 2026: the shared toggle slot
                // carries the Large/Grid density flip through the
                // unchanged onToggleMobileGrid (grid = compact).
                <ViewModeToggleView
                  value={grid.compactMobileGrid ? "grid" : "list"}
                  label="Library density"
                  onChange={(next) => {
                    if ((next === "grid") !== grid.compactMobileGrid) grid.onToggleMobileGrid?.();
                  }}
                />
              }
            />
          }
          bannerSlot={
            // Next-section chain (ruled 6 Sep 2026): Images sells
            // Vault. Same placeholder landscape as every other
            // section page's bottom banner; the title is the one
            // already written for Images in ImagesV2Mockup.jsx.
            <KitPromoBannerView
              treatment="bottom"
              bottomVariant="uniform"
              eyebrow="Create"
              title="Everything you keep lives in the Vault."
              line=""
              ctaLabel="Open Vault"
              imageSrc={encodeURI("/tmp-mockup-images/canon-character-images/athelgard-ampitheater-profile.png")}
              onCtaClick={() => router.push("/studio/v2/vault")}
            />
          }
        >
          <div className="flex items-start gap-[var(--space-6)]">
            <div className="min-w-0 flex-1">
              <MediaHistoryGridSkin
                {...grid}
                showFilterControls={false}
                mobilePrimaryActionLabel="Compose"
                onMobilePrimaryAction={() => setMobileCreatorOpen(true)}
              />
            </div>

            {/* The composer owns its scrolling: its scroll region and
                its fixed footer are siblings inside this bounded box,
                so the aside itself never scrolls (browser review
                9 Sep 2026, items 6 and 7). No padding here; the
                composer pads its own regions. */}
            <aside
              className="sticky hidden w-[24rem] flex-none flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-2)] min-[1100px]:flex"
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
          {/* Compose opens the composer sheet (browser review 9 Sep
              2026, item 9); Generate lives inside the sheet's fixed
              footer, never on this bar. */}
          <button
            type="button"
            onClick={() => setMobileCreatorOpen(true)}
            className="cf-btn cf-btn--primary flex min-h-[var(--control-lg)] flex-1 items-center justify-center gap-[var(--space-2)]"
          >
            <ImagePlus size={17} aria-hidden="true" />
            <span>Compose</span>
          </button>
        </div>
      </div>

      {mobileCreatorOpen ? (
        <ImagesV2ComposerSheet
          panelProps={live.panelProps}
          onClose={() => setMobileCreatorOpen(false)}
        />
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
