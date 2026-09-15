"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Folder, ImagePlus } from "lucide-react";

import KitFoldersPanel from "@/components/kit/KitFoldersPanel";
import KitImageCreatorPanel from "@/components/kit/KitImageCreatorPanel";
import KitIngredientPicker from "@/components/kit/KitIngredientPicker";
import KitNotice from "@/components/kit/KitNotice";
import KitPanelToggle from "@/components/kit/KitPanelToggle";
import KitPromoBannerView from "@/components/kit/promo-banner/KitPromoBanner.view";
import KitSaveIngredientPreset from "@/components/kit/KitSaveIngredientPreset";
import KitSelectionBar from "@/components/kit/KitSelectionBar";
import KitStudioFilterBarView from "@/components/kit/studio-filter-bar/KitStudioFilterBar.view";
import KitStudioPageView from "@/components/kit/studio-page/KitStudioPage.view";
import KitDropdownView from "@/components/kit/dropdown/KitDropdown.view";
import { useKitNoticeAutoClear } from "@/components/kit/notice/useKitNoticeViewModel";
import { BARE_ICON_BUTTON_CLASS } from "@/components/kit/panel-toggle/KitPanelToggle.view";
import MediaHistoryGridSkin from "@/components/studio/image-studio/MediaHistoryGridSkin";
import { useMediaHistoryGridViewModel } from "@/components/studio/image-studio/media-history-grid/useMediaHistoryGridViewModel";
import ViewModeToggleView from "@/components/studio/view-mode-toggle/ViewModeToggle.view";
import { useIngredientPickerViewModel } from "@/components/studio/image-studio/ingredient-picker/useIngredientPickerViewModel";
import { useSaveIngredientPresetViewModel } from "@/components/studio/image-studio/save-ingredient-preset/useSaveIngredientPresetViewModel";
import StudioPageHeaderView from "@/components/studio/studio-page-header/StudioPageHeader.view";
import { useStudioChrome } from "@/components/studio/StudioChromeProvider";
import { getDescendantIds } from "@/lib/client/studio/folders/folderRules";
import { useFolderStore } from "@/lib/client/studio/folders/useFolderStore";

import ImagesV2CameraPresetPicker from "./images-live/ImagesV2CameraPresetPicker";
import ImagesV2ComposerSheet from "./images-live/ImagesV2ComposerSheet";
import ImagesV2ImageViewer, { buildDownloadOptions } from "./images-live/ImagesV2ImageViewer";
import { useColumnDockInsets } from "./images-live/useColumnDockInsets";
import { useFoldersPanelHost } from "./images-live/useFoldersPanelHost";
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

// Folders (ASSET-FOLDERS plan, package AF5, 14 Sep 2026): surface
// MEDIA of the browser-local folder store (option 2A ruled). The
// button sits in the bar's controlsSlot between Select and Filter and
// reads "Folders" at the root, the folder's name once one is chosen;
// it alone opens and closes the panel (follow-up 1, item 3: the glyph
// left the bar) and reads selected while the panel is open. The panel
// is the column left of
// the grid at 1100 and up (option 1A ruled, closed by default) and
// the Kit sheet below, where choosing a folder closes it. Membership
// filters the visible media after the Library filter through the grid
// ViewModel's folderItemIds input; a folder shows its own items plus
// its sub-folders', the same reading as the panel's row count.
const FOLDERS_ROOT_LABEL = "Folders";
const MEDIA_ITEM_NOUN = "image";
// Select (AF5 follow-up 1, item 2): the grid header's Select / Done
// toggle moved into the shared bar, first control after the search
// field, on the unchanged onToggleSelectionMode. Bar order, ruled:
// Select, Folders, Filter, then the density toggle at the right edge.
const SELECT_LABEL = "Select";
const SELECT_DONE_LABEL = "Done";
// The composer column's open and close control (follow-up 1, item 5):
// the same KitPanelToggle the story chat mounts on its rails, turning
// with the column's state (a right-edge panel, so open is the turned
// orientation). Open, it sits on the mode toggle's row at its left
// through the panel's modeRowLeadingSlot (follow-up 2, item 6), so
// the column has no blank row above; closed, the column collapses to
// a rail holding only the toggle and the grid takes the width. Page
// state, default open; below 1100 the composer is already the sheet
// and this column is hidden.
const COMPOSER_OPEN_LABEL = "Open composer";
const COMPOSER_CLOSE_LABEL = "Close composer";

function pluralNoun(count) {
  return count === 1 ? MEDIA_ITEM_NOUN : `${MEDIA_ITEM_NOUN}s`;
}

// The Filter trigger's own recipe (KitDropdown.view), so Select and
// Folders read as the controls beside it; gold while marked, the way
// the Filter trigger turns gold on a non-resting pick.
const FOLDERS_TRIGGER_CLASS =
  "inline-flex min-w-0 max-w-[10rem] min-h-[var(--control-filter)] items-center gap-[var(--space-1)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--step-above)] px-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition-colors duration-[var(--dur-hover)] [@media(pointer:coarse)]:min-h-[var(--control-md)]";
const FOLDERS_TRIGGER_REST_CLASS =
  "text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)] active:bg-[var(--state-pressed-fill)]";
const FOLDERS_TRIGGER_MARKED_CLASS = "text-[var(--gold-bright)]";

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
  const [isComposerOpen, setIsComposerOpen] = useState(true);
  // Folders panel: closed by default (1A), one toggle for both bar
  // controls, the chosen folder page-local (null is the root row All).
  const [foldersOpen, setFoldersOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [noticeTone, setNoticeTone] = useState("neutral");
  const notice = useKitNoticeAutoClear();
  const foldersHost = useFoldersPanelHost();
  const folderStore = useFolderStore("MEDIA");
  // The grid column's viewport insets, handed to the fixed selection
  // bar so it centers on the column (follow-up 2, item 1).
  const [gridColumnRef, dockInsets] = useColumnDockInsets();
  // The primary sidebar's collapse control is the studio chrome's left
  // edge (StudioChromeProvider, decision J1): the sidebar reads
  // leftOwner "page" as collapsed, so opening the Folders column
  // collapses the sidebar to its rail through claimLeft("page"), the
  // same handler the story chat's story list calls (follow-up 1, item
  // 4). Closing the panel hands nothing back, so the sidebar stays on
  // its rail until the user expands it; expanding it (leftOwner "nav")
  // closes the column, one left panel at a time. Leaving the route
  // releases the edge, as the chat page does.
  const { leftOwner, claimLeft, releaseLeft } = useStudioChrome();
  const onToggleFolders = useCallback(() => {
    if (!foldersOpen && foldersHost === "column") claimLeft?.("page");
    setFoldersOpen(!foldersOpen);
  }, [claimLeft, foldersHost, foldersOpen]);
  if (foldersOpen && foldersHost === "column" && leftOwner === "nav") setFoldersOpen(false);
  useEffect(() => () => releaseLeft?.(), [releaseLeft]);
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
    mode: composerMode,
    onChangeMode: setComposerMode,
  });
  // The chosen folder, or null once it is gone from the store (a
  // delete lifts the selection to the parent through the panel; a
  // cleared browser store reads as the root).
  const activeFolder = useMemo(
    () => (selectedFolderId ? folderStore.folders.find((folder) => folder.id === selectedFolderId) || null : null),
    [folderStore.folders, selectedFolderId]
  );
  const folderItemIds = useMemo(() => {
    if (!activeFolder) return null;
    const state = { surface: "MEDIA", folders: folderStore.folders, itemsByFolder: folderStore.itemsByFolder };
    return [activeFolder.id, ...getDescendantIds(state, activeFolder.id)].flatMap(
      (folderId) => folderStore.itemsByFolder[folderId] || []
    );
  }, [activeFolder, folderStore.folders, folderStore.itemsByFolder]);
  // The page owns the shared filter bar (RULED 6 Sep 2026), so it calls
  // the grid ViewModel itself and renders the grid skin with the
  // header's own filter controls off.
  const grid = useMediaHistoryGridViewModel({
    ...live.mediaHistoryProps,
    imageStudioHref: "/studio/v2/images",
    initialActivePreviewId: sharedImageOutputId || null,
    onActivePreviewChange: syncLightboxShareLink,
    folderItemIds,
  });

  // Every folder write and every bar action reports through the one
  // KitNotice: the store's note string, delete in the danger tone.
  function showNote(note, tone = "neutral") {
    setNoticeTone(tone === "danger" ? "danger" : "neutral");
    notice.show(note);
  }

  function handleSelectFolder(folderId) {
    setSelectedFolderId(folderId ?? null);
    if (foldersHost === "sheet") setFoldersOpen(false);
  }

  function selectedMediaItems() {
    return grid.mediaItems.filter((item) => item.selected);
  }

  // Add to folder files the whole selection through the store, one
  // folder per item (M1): the last successful note shows, a refusal
  // shows instead in the danger tone.
  function handleAddToFolder(folderId) {
    let lastNote = "";
    let refusalNote = "";
    for (const item of selectedMediaItems()) {
      const result = folderStore.setItemFolder({ itemId: item.imageOutputId, folderId });
      if (result.ok) lastNote = result.note;
      else if (!refusalNote) refusalNote = result.note;
    }
    if (refusalNote) showNote(refusalNote, "danger");
    else if (lastNote) showNote(lastNote);
  }

  // Download runs the viewer's own per-item download (the Large row,
  // the original through the file proxy) on each selected item.
  function handleDownloadSelected() {
    const items = selectedMediaItems();
    for (const item of items) {
      const large = buildDownloadOptions({ imageOutputId: item.imageOutputId, imageUrl: item.imageUrl }).find(
        (option) => option.id === "large"
      );
      if (!large?.href) continue;
      const anchor = document.createElement("a");
      anchor.href = large.href;
      anchor.download = "";
      anchor.rel = "noopener";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    }
    showNote(`Downloading ${items.length} ${pluralNoun(items.length)}.`);
  }

  // Delete keeps the existing bulk delete: the bar's confirm primary
  // runs the grid ViewModel's onConfirmBulkDelete by name, and the
  // grid's own outcome line still reports what was deleted.
  function handleDeleteSelected() {
    showNote(`Deleting ${grid.selectedCount} ${pluralNoun(grid.selectedCount)}.`, "danger");
    grid.onConfirmBulkDelete?.();
  }

  const foldersPanelProps = {
    surface: "MEDIA",
    folders: folderStore.folders,
    itemsByFolder: folderStore.itemsByFolder,
    allCount: grid.mediaItems.length,
    selectedFolderId: activeFolder?.id ?? null,
    onSelectFolder: handleSelectFolder,
    onCreateFolder: folderStore.createFolder,
    onRenameFolder: folderStore.renameFolder,
    onMoveFolder: folderStore.moveFolder,
    onDeleteFolder: folderStore.deleteFolder,
    onNotice: showNote,
  };
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
  const composerToggle = (
    <button
      type="button"
      onClick={() => setIsComposerOpen((current) => !current)}
      title={isComposerOpen ? COMPOSER_CLOSE_LABEL : COMPOSER_OPEN_LABEL}
      aria-label={isComposerOpen ? COMPOSER_CLOSE_LABEL : COMPOSER_OPEN_LABEL}
      aria-expanded={isComposerOpen}
      className={BARE_ICON_BUTTON_CLASS}
    >
      <KitPanelToggle side="right" open={isComposerOpen} />
    </button>
  );

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
              description="Generate images and videos from your assets. Manage, reuse, and share them all in one place."
            />
          }
          filterBarSlot={
            <KitStudioFilterBarView
              searchValue={grid.searchQuery}
              searchPlaceholder="Search your media..."
              onSearchChange={grid.onChangeSearchQuery}
              // The bar's own filter groups are empty on this page
              // (follow-up 1, item 2): the ruled order puts the Library
              // dropdown after Select and Folders, so all three ride
              // the controlsSlot below; same KitDropdown, same grid
              // handlers, no Kit change.
              filterPresentation="dropdowns"
              filterGroups={[]}
              sortOptions={[]}
              controlsSlot={
                // The four controls in one row (follow-up 2, items 3
                // and 5): on phones they spread across the row with
                // equal gaps between; at 700 and up they sit at the
                // row's right side with one equal gap.
                <div className="flex w-full min-w-0 items-center justify-between gap-[var(--space-2)] min-[700px]:w-auto min-[700px]:justify-end min-[700px]:gap-[var(--space-3)]">
                  <button
                    type="button"
                    onClick={grid.onToggleSelectionMode}
                    aria-pressed={grid.selectionMode}
                    disabled={!grid.hasSelectableMedia || grid.isBulkDeleting}
                    className={`${FOLDERS_TRIGGER_CLASS} ${grid.selectionMode ? FOLDERS_TRIGGER_MARKED_CLASS : FOLDERS_TRIGGER_REST_CLASS}`}
                  >
                    <span className="min-w-0 truncate">{grid.selectionMode ? SELECT_DONE_LABEL : SELECT_LABEL}</span>
                  </button>
                  <button
                    type="button"
                    onClick={onToggleFolders}
                    aria-pressed={foldersOpen}
                    aria-expanded={foldersOpen}
                    aria-label={activeFolder ? `${FOLDERS_ROOT_LABEL}: ${activeFolder.name}` : FOLDERS_ROOT_LABEL}
                    className={`${FOLDERS_TRIGGER_CLASS} ${foldersOpen || activeFolder ? FOLDERS_TRIGGER_MARKED_CLASS : FOLDERS_TRIGGER_REST_CLASS}`}
                  >
                    <Folder size={14} aria-hidden="true" className="flex-none" />
                    <span className="min-w-0 truncate">{activeFolder ? activeFolder.name : FOLDERS_ROOT_LABEL}</span>
                  </button>
                  {filterGroups.map((group) => (
                    <KitDropdownView
                      key={group.id}
                      label={group.label}
                      ariaLabel={group.label}
                      labelMode="replace"
                      options={group.options}
                      selectedValues={selectedFilterValues[group.id] || []}
                      isMultiSelect={group.isMultiSelect !== false}
                      restingValue={group.restingValue ?? null}
                      onToggleOption={(value) => {
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
                    />
                  ))}
                  {/* Density, RULED 6 Sep 2026: the Large/Grid density
                      flip through the unchanged onToggleMobileGrid
                      (grid = compact), last in the row at its right
                      edge (it left the bar's own toggle slot so the
                      four controls share one row's gaps). */}
                  <ViewModeToggleView
                    value={grid.compactMobileGrid ? "grid" : "list"}
                    label="Library density"
                    onChange={(next) => {
                      if ((next === "grid") !== grid.compactMobileGrid) grid.onToggleMobileGrid?.();
                    }}
                  />
                </div>
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
            {/* Folders column (1A): left of the grid at 1100 and up,
                only while open; below 1100 the sheet renders instead,
                outside this row. */}
            {foldersOpen && foldersHost === "column" ? (
              <KitFoldersPanel host="column" {...foldersPanelProps} />
            ) : null}

            <div ref={gridColumnRef} className="min-w-0 flex-1">
              {notice.message ? (
                <div className="mb-[var(--space-4)]">
                  <KitNotice message={notice.message} tone={noticeTone} onDismiss={notice.clear} />
                </div>
              ) : null}

              <MediaHistoryGridSkin
                {...grid}
                showFilterControls={false}
                showSelectionToggle={false}
                // The image viewer (session 3, notes 6 and 6a): the
                // Kit viewer with the brush editor inside it, the
                // page's own adapter keeping every lightbox handler.
                renderLightbox={(lightboxProps) => <ImagesV2ImageViewer {...lightboxProps} />}
              />

              {/* The one selection bar (AF4, option 3A): the grid's
                  bulk section is gone; the bar runs the grid
                  ViewModel's existing handlers by name. Fixed at the
                  viewport's bottom at md and up, centered on this
                  column through its dock insets; fixed above the
                  mobile dock below. */}
              {grid.selectionMode ? (
                <KitSelectionBar
                  selectedCount={grid.selectedCount}
                  itemNoun={MEDIA_ITEM_NOUN}
                  folders={folderStore.folders}
                  onAddToFolder={handleAddToFolder}
                  onDownload={handleDownloadSelected}
                  onDelete={handleDeleteSelected}
                  onDone={grid.onToggleSelectionMode}
                  isBusy={grid.isBulkDeleting}
                  dockInsets={dockInsets}
                  deleteBody={`This removes ${grid.selectedCount} selected ${pluralNoun(grid.selectedCount)} from Media Studio, connected creation libraries, and featured image slots. This cannot be undone.`}
                />
              ) : null}
            </div>

            {/* The composer owns its scrolling: its scroll region and
                its fixed footer are siblings inside this bounded box,
                so the aside itself never scrolls (browser review
                9 Sep 2026, items 6 and 7). No padding here; the
                composer pads its own regions. */}
            <aside
              className={`sticky hidden flex-none flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-2)] min-[1100px]:flex ${
                isComposerOpen ? "w-[24rem]" : "w-auto"
              }`}
              style={{
                top: "calc(var(--topbar-h) + var(--space-4))",
                maxHeight: "calc(100dvh - var(--topbar-h) - var(--space-8))",
              }}
            >
              {/* remix is already inside panelProps; it is named here
                  so the Remix wiring on this surface is greppable and
                  guarded by imagesV2LiveAdapterDiagnostics.mjs. The
                  toggle rides the mode toggle's row while open and is
                  the rail's only content while closed. */}
              {isComposerOpen ? (
                <KitImageCreatorPanel
                  {...live.panelProps}
                  remix={live.panelProps.remix}
                  modeRowLeadingSlot={composerToggle}
                />
              ) : (
                <div className="flex shrink-0 items-center justify-start px-[var(--space-2)] py-[var(--space-2)]">{composerToggle}</div>
              )}
            </aside>
          </div>
        </KitStudioPageView>
      </div>

      {/* The sticky bottom bar is the one path to the composer sheet
          on phones (follow-up 2, item 4: the in-page button above the
          grid is gone). Edge to edge, glass on the ratified themed
          panel glass token with its paired blur, no border; one
          whisper hairline sits above the bottom nav. It hides while
          select mode is on (AF5): the selection bar takes its place. */}
      {grid.selectionMode ? null : (
        <div className="fixed inset-x-0 bottom-[calc(4.6rem+env(safe-area-inset-bottom))] z-40 min-[1100px]:hidden">
          <div className="flex items-center bg-[var(--panel-ui-glass)] px-[var(--space-5)] py-[var(--space-2)] backdrop-blur-[var(--blur-panel)]">
            {/* Opens the composer sheet (browser review 9 Sep 2026,
                item 9); Generate lives inside the sheet's fixed
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
          <div aria-hidden="true" className="h-px bg-[var(--line-whisper)]" />
        </div>
      )}

      {/* Folders sheet (1A, below 1100): the Kit frame's sheet with
          the grabber; choosing a folder closes it. */}
      {foldersOpen && foldersHost === "sheet" ? (
        <KitFoldersPanel host="sheet" {...foldersPanelProps} onClose={() => setFoldersOpen(false)} />
      ) : null}

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
