"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import ImagesV2ImageViewer from "./images-live/ImagesV2ImageViewer";
import { useImagesV2LiveViewModel } from "./images-live/useImagesV2LiveViewModel";

// Library filter, RULED 10 Sep 2026 (browser review round 4, item 5),
// superseding the 6 Sep two-section panel on this page only: one
// plain multi-select dropdown holding exactly Saved, All, Images,
// Videos, in that order. No search-within; the former activity
// section's other option is gone and Saved is the only one kept. All
// is the "no filter" state and is derived, never stored: choosing it clears
// the others, and choosing any other clears it. The grid ViewModel's
// filter model is unchanged (contract law): Saved is its BOOKMARKED
// activity filter, Images and Videos are its single media pick. No
// Sort on Images (the jobs feed has no sort, CR-058).
// Order re-ruled 10 Sep 2026 (round 5, screenshot): All first, Saved
// last. All is the resting value: the trigger reads plain "Filter"
// with no count while it is the only selection (KitDropdown 1.2.0).
const LIBRARY_OPTIONS = [
  { value: "ALL", label: "All" },
  { value: "IMAGES", label: "Images" },
  { value: "VIDEOS", label: "Videos" },
  { value: "BOOKMARKED", label: "Saved" },
];

function countLibrary(items, value) {
  if (value === "BOOKMARKED") return items.filter((item) => item.bookmarked).length;
  if (value === "IMAGES") return items.filter((item) => item.type !== "VIDEO").length;
  if (value === "VIDEOS") return items.filter((item) => item.type === "VIDEO").length;
  return items.length;
}

// The one filter that exists on an asset picker today: the creator's
// own assets or the public catalog (session 2, note 3; "Mine" reworded
// at review round 1). The own-assets source is the resting value, so
// the trigger reads plain "Filter" until Public is chosen, matching
// the Library filter. A true "All" (both sources at once) needs the
// ingredient loader to fetch both, a data-flow change held for a
// ruling (STATUS, 10 Sep 2026).
const SOURCE_FILTER_OPTIONS = [
  { value: "MINE", label: "Your assets" },
  { value: "PUBLIC", label: "Public" },
];

function LiveIngredientPicker({ pickerProps, backLabel = null }) {
  const [searchValue, setSearchValue] = useState("");
  const picker = useIngredientPickerViewModel(pickerProps);
  const label = pickerProps.displayLabel || picker.ingredientLabel;
  const lowerLabel = label.toLowerCase();
  const scope = picker.sourceMode === "PUBLIC" ? "public " : "";
  const hasPublicSource = picker.sourceOptions.length > 1;
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

  const filter = hasPublicSource
    ? {
        label: "Filter",
        options: SOURCE_FILTER_OPTIONS,
        value: picker.sourceMode,
        restingValue: "MINE",
        onChange: (nextMode) => {
          setSearchValue("");
          picker.onSourceModeChange?.(nextMode);
        },
      }
    : null;

  return (
    <KitIngredientPicker
      slotLabel={label}
      searchValue={searchValue}
      searchPlaceholder={`Search ${scope}${lowerLabel}...`}
      onSearchChange={setSearchValue}
      filter={filter}
      items={items}
      itemLayout="cards"
      emptyMessage={`No ${scope}${lowerLabel} assets found.`}
      loadErrorMessage={picker.loadErrorMessage}
      onChooseIngredient={picker.onChooseIngredient}
      showUseCustomAction={picker.showUseCustomAction}
      customIsSelected={Boolean(pickerProps.selected?.custom)}
      onUseCustom={picker.onUseCustom}
      backLabel={backLabel}
      onClose={picker.onClose}
    />
  );
}

// Image to video's source picker (session 5, RULED A of three at the
// plan gate): the SAME shared picker component, cards layout, no
// Custom card, no filter, fed with the library's images the page has
// already loaded. Never a second picker component.
function LiveSourceImagePicker({ pickerProps, mediaItems = [], backLabel = null }) {
  const [searchValue, setSearchValue] = useState("");
  const normalizedSearch = searchValue.trim().toLowerCase();
  const items = useMemo(
    () =>
      mediaItems
        .filter((item) => item.type !== "VIDEO" && (item.thumbnailUrl || item.imageUrl))
        .filter((item) => {
          if (!normalizedSearch) return true;
          return String(item.title || "").toLowerCase().includes(normalizedSearch);
        })
        .map((item) => ({
          id: item.id,
          title: item.title || "Image",
          subtitle: "Image",
          imageSrc: item.thumbnailUrl || item.imageUrl || null,
          isSelected: item.id === pickerProps.selectedId,
        })),
    [mediaItems, normalizedSearch, pickerProps.selectedId]
  );

  return (
    <KitIngredientPicker
      slotLabel="Image"
      description="Choose an image from your library to bring to life."
      searchValue={searchValue}
      searchPlaceholder="Search your images..."
      onSearchChange={setSearchValue}
      filter={null}
      items={items}
      itemLayout="cards"
      emptyMessage="No images in your library yet."
      loadErrorMessage=""
      onChooseIngredient={(itemId) =>
        pickerProps.onChoose?.(items.find((item) => item.id === itemId) || null)
      }
      showUseCustomAction={false}
      onUseCustom={null}
      backLabel={backLabel}
      onClose={pickerProps.onClose}
    />
  );
}

function LiveSavePreset({ saveProps, backLabel = null }) {
  const save = useSaveIngredientPresetViewModel(saveProps);

  return (
    <KitSaveIngredientPreset
      assetLabel={save.assetLabel}
      introText={save.introText}
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
      canUseOnce={save.canUseOnce}
      saveAvailable={save.saveAvailable}
      hasUnsavedChanges={save.hasUnsavedChanges}
      onSavePreset={save.onSavePreset}
      onUseOnce={save.onUseOnce}
      backLabel={backLabel}
      onClose={save.isSaving ? null : save.onClose}
    />
  );
}

export default function ImagesV2Live() {
  const router = useRouter();
  const [mobileCreatorOpen, setMobileCreatorOpen] = useState(false);
  const [cameraPickerOpen, setCameraPickerOpen] = useState(false);
  // Stage tab (Generate, Remix): page-local presentation state. The
  // Remix body (session 4, notes 5, 5a, 5b) is projected by the live
  // ViewModel; its Generate stays Soon until the Chassis carries the
  // job (docs/handoffs/MEDIA-STUDIO-BACKEND.md gap 13).
  const [composerStage, setComposerStage] = useState("GENERATE");
  // Mode toggle (Image, Video): page-local presentation state since
  // session 5 (notes 7 and 7a). The Video composer is reviewable;
  // its Generate stays Soon until the Chassis carries a video job
  // (docs/handoffs/MEDIA-STUDIO-BACKEND.md gap 15).
  const [composerMode, setComposerMode] = useState("IMAGE");
  const openCameraPresetPicker = useCallback(() => setCameraPickerOpen(true), []);
  const closeCameraPresetPicker = useCallback(() => setCameraPickerOpen(false), []);
  const live = useImagesV2LiveViewModel({
    onOpenCameraPresetPicker: openCameraPresetPicker,
    stage: composerStage,
    onChangeStage: setComposerStage,
    mode: composerMode,
    onChangeMode: setComposerMode,
  });
  // The page owns the shared filter bar (RULED 6 Sep 2026), so it calls
  // the grid ViewModel itself and renders the grid skin with the
  // header's own filter controls off.
  const grid = useMediaHistoryGridViewModel({
    ...live.mediaHistoryProps,
    imageStudioHref: "/studio/v2/images",
  });
  const filterGroups = useMemo(
    () => [
      {
        id: "library",
        label: "Filter",
        isMultiSelect: true,
        restingValue: "ALL",
        options: LIBRARY_OPTIONS.map((option) => ({
          ...option,
          count: countLibrary(grid.mediaItems, option.value),
        })),
      },
    ],
    [grid.mediaItems]
  );
  const isSavedOn = grid.activityFilters.includes("BOOKMARKED");
  const hasMediaPick = grid.mediaFilter !== "ALL";
  const selectedFilterValues = useMemo(
    () => ({
      library: [
        ...(isSavedOn ? ["BOOKMARKED"] : []),
        ...(hasMediaPick ? [grid.mediaFilter] : []),
        ...(!isSavedOn && !hasMediaPick ? ["ALL"] : []),
      ],
    }),
    [isSavedOn, hasMediaPick, grid.mediaFilter]
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
              filterPresentation="dropdowns"
              filterGroups={filterGroups}
              selectedValues={selectedFilterValues}
              onFilterToggle={(groupId, value) => {
                if (value === "ALL") {
                  grid.onClearFilters?.();
                  return;
                }
                if (value === "BOOKMARKED") {
                  grid.onToggleActivityFilter?.("BOOKMARKED");
                  return;
                }
                grid.onSetMediaFilter?.(grid.mediaFilter === value ? "ALL" : value);
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
                // The image viewer (session 3, notes 6 and 6a): the
                // Kit viewer with the brush editor inside it, the
                // page's own adapter keeping every lightbox handler.
                renderLightbox={(lightboxProps) => <ImagesV2ImageViewer {...lightboxProps} />}
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
              {/* remix is already inside panelProps; it is named here
                  so the Remix wiring on this surface is greppable and
                  guarded by imagesV2LiveAdapterDiagnostics.mjs. */}
              <KitImageCreatorPanel {...live.panelProps} remix={live.panelProps.remix} />
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
          remix={live.panelProps.remix}
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

      {live.videoImagePickerProps?.isOpen ? (
        <LiveSourceImagePicker
          pickerProps={live.videoImagePickerProps}
          mediaItems={grid.mediaItems}
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
