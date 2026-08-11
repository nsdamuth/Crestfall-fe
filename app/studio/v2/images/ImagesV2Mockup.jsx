"use client";

// The full Images composition, fixture-driven, presentation only.
// Rendered by /studio/v2/images (pre-parity staging address) and
// mirrored at /dev/ui-preview/images-v2-page. Per docs/SPRINT-D-PLAN.md
// section 2 (absorbs and supersedes SPRINT-B-PLAN, updated to inherit
// R1 through R7 of the 10 Aug 2026 modal-system gate) and
// docs/SPRINT-E-PLAN.md section 1.4 (R6, the creator panel): the
// LIBRARY BROWSE HUB, fixture-first, same shape as Community,
// Creators, and Vault, now composed with the image creator panel
// (1.1 through 1.3). Desktop 1100px and up: sticky right rail beside
// the grid, inside the page column (content width law, R1). Under
// 1100px: sticky bottom-right create CTA opening the panel as a
// full-screen modal (R4). No live data, no API calls, no real
// navigation; generation and persistence stay honest R4 stubs.
import { useMemo, useState } from "react";

import KitStudioPageView from "@/components/kit/studio-page/KitStudioPage.view";
import StudioPageHeaderView from "@/components/studio/studio-page-header/StudioPageHeader.view";
import KitStudioFilterBarView from "@/components/kit/studio-filter-bar/KitStudioFilterBar.view";
import KitCreationCardView from "@/components/kit/creation-card/KitCreationCard.view";
import KitLoadMoreView from "@/components/kit/load-more/KitLoadMore.view";
import KitPromoBannerView from "@/components/kit/promo-banner/KitPromoBanner.view";
import KitImageOverlay from "@/components/kit/KitImageOverlay";
import KitImageCreatorPanel from "@/components/kit/KitImageCreatorPanel";
import KitIngredientPicker from "@/components/kit/KitIngredientPicker";
import KitSaveIngredientPreset from "@/components/kit/KitSaveIngredientPreset";
import KitModalFrame from "@/components/kit/KitModalFrame";
import KitAlertStripView from "@/components/kit/alert-strip/KitAlertStrip.view";
import ViewModeToggleView from "@/components/studio/view-mode-toggle/ViewModeToggle.view";
import FixtureActionNotice from "../FixtureActionNotice";
import {
  RENDER_STYLE_OPTIONS,
  CAMERA_OPTIONS,
  WARDROBE_THEME_OPTIONS,
  ASPECT_RATIO_OPTIONS,
  OUTPUT_COUNT_OPTIONS,
  VIDEO_DURATION_OPTIONS,
  VIDEO_ASPECT_OPTIONS,
  VIDEO_MOTION_STYLE_OPTIONS,
  NO_SOURCE_HELP_TEXT,
  NO_CLOTHING_HELP_TEXT,
  CUSTOM_SUBJECT_HELP_TEXT,
  insufficientCoinsHelpText,
} from "@/components/kit/image-creator-panel/KitImageCreatorPanel.fixtures";

function canonArt(name) {
  return encodeURI(`/tmp-mockup-images/canon-character-images/${name}.png`);
}

function creatorArt(name) {
  return encodeURI(`/tmp-mockup-images/alpha-test-creator-images/${name}.png`);
}

// Eighteen fixture images (plan section 3): at least three per linked-
// asset option including four unlinked, both styles, varied counts,
// three long titles. Subtitle is fixture-grade display copy, not a
// terminology-module lookup (no asset-kind label map exists there;
// every sibling v2 page's fixtures already write this copy directly).
const FIXTURE_IMAGES = [
  { id: "img1", title: "Vesper Ash Render", imageSrc: creatorArt("vermillion-8"), linkedAsset: { kind: "character", label: "Character" }, style: "anime", hearts: 410, saves: 120, recency: 18 },
  { id: "img2", title: "Lilith, Throne Study", imageSrc: canonArt("Lilith"), linkedAsset: { kind: "character", label: "Character" }, style: "realistic", hearts: 2210, saves: 960, recency: 17 },
  { id: "img3", title: "Kaela, Field Sketch", imageSrc: canonArt("Kaela Veynskald"), linkedAsset: { kind: "character", label: "Character" }, style: "anime", hearts: 880, saves: 190, recency: 16 },
  { id: "img4", title: "Elowen, Half-Light", imageSrc: canonArt("Elowen"), linkedAsset: { kind: "character", label: "Character" }, style: "realistic", hearts: 1630, saves: 440, recency: 15 },
  { id: "img5", title: "Corwin, Backstage Pass", imageSrc: canonArt("Jax Riker"), linkedAsset: { kind: "character", label: "Character" }, style: "anime", hearts: 22, saves: 6, recency: 14 },
  { id: "img6", title: "The First Exile, Cover Study", imageSrc: creatorArt("vermillion-3"), linkedAsset: { kind: "story", label: "Story" }, style: "realistic", hearts: 1240, saves: 510, recency: 13 },
  { id: "img7", title: "Coldwater Vigil, Opening Scene", imageSrc: creatorArt("vermillion-10"), linkedAsset: { kind: "story", label: "Story" }, style: "anime", hearts: 900, saves: 340, recency: 12 },
  { id: "img8", title: "Nine Coin Night, Table Read", imageSrc: creatorArt("vermillion-6"), linkedAsset: { kind: "story", label: "Story" }, style: "realistic", hearts: 40, saves: 10, recency: 11 },
  { id: "img9", title: "The Hollow Road, Waypoint", imageSrc: creatorArt("vermillion-2"), linkedAsset: { kind: "story", label: "Story" }, style: "anime", hearts: 1, saves: 0, recency: 10 },
  { id: "img10", title: "The Wandering Blade, Draft Two", imageSrc: creatorArt("whiteviolin"), linkedAsset: { kind: "story", label: "Story" }, style: "realistic", hearts: 324, saves: 81, recency: 9 },
  { id: "img11", title: "Neon Harbor Cycle, District Overlook", imageSrc: creatorArt("vermillion-12"), linkedAsset: { kind: "adventure", label: "Adventure" }, style: "realistic", hearts: 88, saves: 19, recency: 8 },
  { id: "img12", title: "Salt Marsh Run, Rain Study", imageSrc: creatorArt("vermillion-4"), linkedAsset: { kind: "adventure", label: "Adventure" }, style: "anime", hearts: 0, saves: 0, recency: 7 },
  { id: "img13", title: "The Ferry Contract, Dock Lights", imageSrc: creatorArt("vermillion-9"), linkedAsset: { kind: "adventure", label: "Adventure" }, style: "realistic", hearts: 8, saves: 3, recency: 6 },
  { id: "img14", title: "The Long Road West, Trail Marker at the Edge of the Known Map", imageSrc: creatorArt("sassy"), linkedAsset: { kind: "adventure", label: "Adventure" }, style: "anime", hearts: 203, saves: 66, recency: 5 },
  { id: "img15", title: "Study, Untitled", imageSrc: creatorArt("vermillion-5"), linkedAsset: null, style: "anime", hearts: 2, saves: 0, recency: 4 },
  { id: "img16", title: "Palette Test", imageSrc: creatorArt("vermillion-7"), linkedAsset: null, style: "realistic", hearts: 9, saves: 2, recency: 3 },
  { id: "img17", title: "Harbor at Dusk, an Unassigned Reference Kept for Later Palette Matching", imageSrc: creatorArt("vermillion-11"), linkedAsset: null, style: "anime", hearts: 210, saves: 80, recency: 2 },
  { id: "img18", title: "Loose Concept, No Home Yet", imageSrc: creatorArt("vermillion-13"), linkedAsset: null, style: "realistic", hearts: 3, saves: 1, recency: 1 },
];

const LINKED_ASSET_OPTIONS = [
  { value: "character", label: "Characters" },
  { value: "story", label: "Stories" },
  { value: "adventure", label: "Adventures" },
  { value: "unlinked", label: "Unlinked" },
];

const STYLE_OPTIONS = [
  { value: "anime", label: "Anime" },
  { value: "realistic", label: "Realistic" },
];

// Eligibility machinery, RESTORED 10 Aug 2026 (h-restore, section 10
// candidate 13): no real moderation eligibility field exists in the
// v2 image-library model yet, so it is derived deterministically from
// id parity below rather than hand-authored per row, same pattern as
// Community's Rendering filter. CR-036 filed for a real eligibility
// field on the image record.
const ELIGIBILITY_OPTIONS = [
  { value: "eligible", label: "Eligible" },
  { value: "blocked", label: "Blocked" },
];

function eligibilityFor(item) {
  const seed = Number.parseInt(item.id.replace(/\D/g, ""), 10) || 0;
  return seed % 5 === 0 ? "blocked" : "eligible";
}

const SORT_OPTIONS = [
  { value: "recent", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "hearts", label: "Most hearted" },
  { value: "saved", label: "Most saved" },
  { value: "eligibleFirst", label: "Eligible First" },
  { value: "needsReviewFirst", label: "Needs Review First" },
];

const FIXTURE_MODES = {
  default: "Default",
  empty: "Empty",
  loading: "Loading",
  error: "Error",
};

const PAGE_SIZE = 12;
const COIN_COST = 5;

// Creator panel fixed anatomy (docs/SPRINT-E-PLAN.md section 1.1):
// slot labels and which slots are savable, mirroring
// components/studio/image-studio/imageStudioData.js verbatim.
const SLOT_LABELS = {
  character: "Character",
  playerCharacter: "Player Character",
  pose: "Pose",
  outfit: "Clothing Source",
  location: "Location / Scene",
  preset: "Rendering Preset",
};
const SAVABLE_SLOTS = ["pose", "outfit", "location", "preset"];
const EMPTY_SLOT = { selection: null, isCustomMode: false, customText: "" };

// Small per-slot ingredient pools for the picker (fixture-only, this
// page's own set, distinct from the kit package's own preview
// fixtures).
const ITEM_POOLS = {
  character: [
    { id: "char-1", title: "Vesper Ash", subtitle: "Character", imageSrc: creatorArt("vermillion-8") },
    { id: "char-2", title: "Kaela Veynskald", subtitle: "Character", imageSrc: canonArt("Kaela Veynskald") },
    { id: "char-3", title: "Elowen", subtitle: "Character", imageSrc: canonArt("Elowen") },
  ],
  playerCharacter: [
    { id: "pc-1", title: "Mara Veyne", subtitle: "Player Character", imageSrc: creatorArt("vermillion-2") },
    { id: "pc-2", title: "Silas Thorn", subtitle: "Player Character", imageSrc: creatorArt("vermillion-4") },
  ],
  pose: [
    { id: "pose-1", title: "Half-Turn, Cloak Drawn Back", subtitle: "Pose", imageSrc: creatorArt("vermillion-6") },
    { id: "pose-2", title: "Seated, Hands Folded", subtitle: "Pose", imageSrc: creatorArt("vermillion-9") },
  ],
  outfit: [
    { id: "outfit-1", title: "Dockside Coat, Weathered", subtitle: "Clothing Source", imageSrc: creatorArt("vermillion-3") },
    { id: "outfit-2", title: "Formal Vermillion Coat", subtitle: "Clothing Source", imageSrc: creatorArt("vermillion-10") },
  ],
  location: [
    { id: "location-1", title: "Harborfront at Dusk", subtitle: "Location / Scene", imageSrc: creatorArt("vermillion-11") },
    { id: "location-2", title: "The Coldwater Vigil Interior", subtitle: "Location / Scene", imageSrc: creatorArt("vermillion-12") },
  ],
  preset: [
    { id: "preset-1", title: "Crestfall Realistic, High Detail", subtitle: "Rendering Preset", imageSrc: null },
    { id: "preset-2", title: "Crestfall Fantasy, Soft Light", subtitle: "Rendering Preset", imageSrc: null },
  ],
};

const SAVE_PRESET_INTRO_TEXT =
  "Save this custom guidance as a private reusable draft. You can return to it later from My Creations or select it again from the Image Studio picker.";
const SAVE_PRESET_HELPER_TEXT =
  "Saving creates a private SFW draft and selects it for the current Image Studio request. Using it once does not create a saved asset.";

function GeometricMark({ className = "h-[var(--space-10)] w-[var(--space-10)]" }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={`${className} text-[var(--ink-faint)]`}>
      <use href="/assets/icons/icons-v7.svg#i-59" />
    </svg>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 gap-[var(--space-3)] min-[700px]:grid-cols-3 min-[1100px]:grid-cols-3 min-[700px]:gap-[var(--space-4)]">
      {Array.from({ length: 12 }, (_, index) => (
        <div
          key={index}
          className="flex aspect-[3/4] animate-pulse items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-2)]"
        >
          <GeometricMark />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-[var(--space-2)] rounded-[var(--radius-lg)] border border-dashed border-[var(--line-strong)] bg-[var(--surface-1)] p-[var(--space-12)] text-center">
      <GeometricMark className="h-[var(--space-14)] w-[var(--space-14)]" />
      <p className="font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]">
        No images yet
      </p>
      <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
        Create one and it will land here.
      </p>
    </div>
  );
}

// Live block-reason grammar, mirrored from
// getImageGenerationAvailability (useImageStudioWorkbenchViewModel.js,
// READ ONLY reference): insufficient coins beats no-renderable-source
// beats the non-blocking no-clothing help line.
function computeAvailability(slots, coinBalance) {
  const hasSource = (slot) => Boolean(slot?.selection) || Boolean(slot?.isCustomMode && slot.customText.trim());
  const hasCustomSubject = (slot) => Boolean(slot?.isCustomMode && slot.customText.trim());

  const hasVisualSubject = hasSource(slots.character) || hasSource(slots.playerCharacter);
  const hasCustomVisualSubject = hasCustomSubject(slots.character) || hasCustomSubject(slots.playerCharacter);
  const hasOutfitSource = hasSource(slots.outfit);
  const hasRenderableSource = hasVisualSubject || hasOutfitSource || hasSource(slots.location);
  const hasEnoughCoins = coinBalance >= COIN_COST;

  const blockReason = !hasEnoughCoins
    ? insufficientCoinsHelpText(String(COIN_COST))
    : !hasRenderableSource
      ? NO_SOURCE_HELP_TEXT
      : "";

  const helpText =
    !blockReason && hasVisualSubject && !hasOutfitSource
      ? hasCustomVisualSubject
        ? CUSTOM_SUBJECT_HELP_TEXT
        : NO_CLOTHING_HELP_TEXT
      : blockReason;

  return {
    canGenerate: !blockReason,
    showInsufficientCoins: !hasEnoughCoins,
    generationHelpText: helpText,
  };
}

export default function ImagesV2Mockup() {
  const [fixtureMode, setFixtureMode] = useState("default");
  const [layout, setLayout] = useState("grid");
  const [searchValue, setSearchValue] = useState("");
  const [selectedValues, setSelectedValues] = useState({});
  const [selectedSort, setSelectedSort] = useState("recent");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [lovedIds, setLovedIds] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [overlayImage, setOverlayImage] = useState(null);
  // R4 (10 Aug 2026 review gate): controls whose real behavior waits
  // on live wiring open a non-persisting notice instead of doing
  // nothing.
  const [actionNotice, setActionNotice] = useState(null);

  // Creator panel state (R6, docs/SPRINT-E-PLAN.md section 1.4).
  const [panelMode, setPanelMode] = useState("IMAGE");
  const [slots, setSlots] = useState({
    character: { selection: { id: "char-1", title: "Vesper Ash", subtitle: "Character" }, isCustomMode: false, customText: "" },
  });
  const [promptValue, setPromptValue] = useState("A quiet moment before the storm breaks over the harbor.");
  const [negativePromptValue, setNegativePromptValue] = useState("");
  const [optionValues, setOptionValues] = useState({
    renderStyle: "auto",
    camera: "AUTO",
    wardrobe: "AUTO",
    aspectRatio: "PORTRAIT_4_5",
    outputCount: "1",
  });
  const [videoOptionValues, setVideoOptionValues] = useState({
    duration: "4",
    videoAspect: "PORTRAIT",
    motionStyle: "SUBTLE",
  });
  const [videoDirectionValue, setVideoDirectionValue] = useState("");
  const [coinBalance] = useState(40);
  const [isMobileCreatorOpen, setIsMobileCreatorOpen] = useState(false);

  // Ingredient picker and save-preset modal state.
  const [activePickerSlotId, setActivePickerSlotId] = useState(null);
  const [pickerSearchValue, setPickerSearchValue] = useState("");
  const [savePresetSlotId, setSavePresetSlotId] = useState(null);
  const [savePresetForm, setSavePresetForm] = useState({ name: "", description: "", prompt: "", tags: "" });

  const filterGroups = useMemo(() => {
    const pool = fixtureMode === "empty" || fixtureMode === "error" ? [] : FIXTURE_IMAGES;
    return [
      {
        id: "linkedAsset",
        label: "Linked asset",
        isMultiSelect: true,
        options: LINKED_ASSET_OPTIONS.map((option) => ({
          ...option,
          count: pool.filter((item) =>
            option.value === "unlinked"
              ? !item.linkedAsset
              : item.linkedAsset?.kind === option.value
          ).length,
        })),
      },
      {
        id: "style",
        label: "Style",
        isMultiSelect: true,
        options: STYLE_OPTIONS.map((option) => ({
          ...option,
          count: pool.filter((item) => item.style === option.value).length,
        })),
      },
      {
        id: "eligibility",
        label: "Eligibility",
        isMultiSelect: true,
        options: ELIGIBILITY_OPTIONS.map((option) => ({
          ...option,
          count: pool.filter((item) => eligibilityFor(item) === option.value).length,
        })),
      },
    ];
  }, [fixtureMode]);

  const filteredItems = useMemo(() => {
    if (fixtureMode === "empty" || fixtureMode === "error") return [];

    const query = searchValue.trim().toLowerCase();
    const linkedAssetValues = selectedValues.linkedAsset || [];
    const styleValues = selectedValues.style || [];
    const eligibilityValues = selectedValues.eligibility || [];

    const filtered = FIXTURE_IMAGES.filter((item) => {
      if (linkedAssetValues.length) {
        const matches = linkedAssetValues.some((value) =>
          value === "unlinked" ? !item.linkedAsset : item.linkedAsset?.kind === value
        );
        if (!matches) return false;
      }
      if (styleValues.length && !styleValues.includes(item.style)) return false;
      if (eligibilityValues.length && !eligibilityValues.includes(eligibilityFor(item))) return false;
      if (query) {
        const haystack = `${item.title} ${item.linkedAsset?.label || ""}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    const sorted = [...filtered];
    if (selectedSort === "hearts") {
      sorted.sort((a, b) => b.hearts - a.hearts);
    } else if (selectedSort === "saved") {
      sorted.sort((a, b) => b.saves - a.saves);
    } else if (selectedSort === "oldest") {
      sorted.sort((a, b) => a.recency - b.recency);
    } else if (selectedSort === "eligibleFirst") {
      sorted.sort((a, b) => Number(eligibilityFor(b) === "eligible") - Number(eligibilityFor(a) === "eligible"));
    } else if (selectedSort === "needsReviewFirst") {
      sorted.sort((a, b) => Number(eligibilityFor(b) === "blocked") - Number(eligibilityFor(a) === "blocked"));
    } else {
      sorted.sort((a, b) => b.recency - a.recency);
    }
    return sorted;
  }, [fixtureMode, searchValue, selectedValues, selectedSort]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  function toggleFilter(groupId, value) {
    setSelectedValues((current) => {
      const currentValues = current[groupId] || [];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((entry) => entry !== value)
        : [...currentValues, value];
      return { ...current, [groupId]: nextValues };
    });
    setVisibleCount(PAGE_SIZE);
  }

  function toggleId(setter) {
    return (id) =>
      setter((current) =>
        current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]
      );
  }

  const toggleLoved = toggleId(setLovedIds);
  const toggleSaved = toggleId(setSavedIds);

  function subtitleFor(item) {
    return item.linkedAsset ? `Image, linked to ${item.linkedAsset.label}` : "Image";
  }

  // Character and Player Character are mutually exclusive (live
  // rule): picking or customizing one clears the other.
  function applySlotChange(slotId, nextSlotState) {
    setSlots((current) => {
      const next = { ...current, [slotId]: nextSlotState };
      if (slotId === "character") next.playerCharacter = EMPTY_SLOT;
      if (slotId === "playerCharacter") next.character = EMPTY_SLOT;
      return next;
    });
  }

  function handleSlotActivate(slotId) {
    setPickerSearchValue("");
    setActivePickerSlotId(slotId);
  }

  function handleSlotClear(slotId) {
    setSlots((current) => ({ ...current, [slotId]: EMPTY_SLOT }));
  }

  function handleCustomChangeText(slotId, text) {
    setSlots((current) => ({ ...current, [slotId]: { ...current[slotId], customText: text } }));
  }

  function handleCustomBackToPresets(slotId) {
    setPickerSearchValue("");
    setActivePickerSlotId(slotId);
  }

  function openSavePreset(slotId, initialPrompt = "") {
    setSavePresetSlotId(slotId);
    setSavePresetForm({ name: "", description: "", prompt: initialPrompt, tags: "" });
  }

  function handleCustomSavePreset(slotId) {
    openSavePreset(slotId, slots[slotId]?.customText || "");
  }

  function handlePickerChooseIngredient(itemId) {
    const pool = ITEM_POOLS[activePickerSlotId] || [];
    const item = pool.find((entry) => entry.id === itemId);
    if (item) applySlotChange(activePickerSlotId, { selection: item, isCustomMode: false, customText: "" });
    setActivePickerSlotId(null);
  }

  function handlePickerUseCustom() {
    applySlotChange(activePickerSlotId, { selection: null, isCustomMode: true, customText: "" });
    setActivePickerSlotId(null);
  }

  function handlePickerCreatePreset() {
    const slotId = activePickerSlotId;
    applySlotChange(slotId, { selection: null, isCustomMode: true, customText: "" });
    setActivePickerSlotId(null);
    openSavePreset(slotId);
  }

  const activePickerPool = activePickerSlotId ? ITEM_POOLS[activePickerSlotId] || [] : [];
  const pickerItems = activePickerPool
    .filter((item) => item.title.toLowerCase().includes(pickerSearchValue.trim().toLowerCase()))
    .map((item) => ({ ...item, isSelected: item.id === slots[activePickerSlotId]?.selection?.id }));

  const savePresetCanSave = savePresetForm.name.trim().length > 0 && savePresetForm.prompt.trim().length > 0;

  const optionFields = [
    { id: "renderStyle", label: "Render Style", value: optionValues.renderStyle, options: RENDER_STYLE_OPTIONS },
    { id: "camera", label: "Camera / Framing", value: optionValues.camera, options: CAMERA_OPTIONS },
    { id: "wardrobe", label: "Wardrobe Theme", value: optionValues.wardrobe, options: WARDROBE_THEME_OPTIONS },
    { id: "aspectRatio", label: "Aspect Ratio", value: optionValues.aspectRatio, options: ASPECT_RATIO_OPTIONS },
    { id: "outputCount", label: "Output Count", value: optionValues.outputCount, options: OUTPUT_COUNT_OPTIONS },
  ];
  const videoOptionFields = [
    { id: "duration", label: "Duration", value: videoOptionValues.duration, options: VIDEO_DURATION_OPTIONS },
    { id: "videoAspect", label: "Video Aspect", value: videoOptionValues.videoAspect, options: VIDEO_ASPECT_OPTIONS },
    { id: "motionStyle", label: "Motion Style", value: videoOptionValues.motionStyle, options: VIDEO_MOTION_STYLE_OPTIONS },
  ];

  const availability = computeAvailability(slots, coinBalance);

  // Shared with the card grid's new contextual third face action
  // (RULED 11 Aug 2026): the card's Generate icon routes to the same
  // destination as the panel's own Generate control.
  const handleGenerate = () =>
    setActionNotice({
      label: "Generate image",
      message: "Generation is wired when the page goes live. Nothing was generated in this preview.",
    });

  const panelProps = {
    mode: panelMode,
    onChangeMode: setPanelMode,
    slots,
    onSlotActivate: handleSlotActivate,
    onSlotClear: handleSlotClear,
    onCustomChangeText: handleCustomChangeText,
    onCustomBackToPresets: handleCustomBackToPresets,
    onCustomSavePreset: handleCustomSavePreset,
    promptValue,
    onChangePrompt: setPromptValue,
    negativePromptValue,
    onChangeNegativePrompt: setNegativePromptValue,
    optionFields,
    onChangeOption: (fieldId, value) => setOptionValues((current) => ({ ...current, [fieldId]: value })),
    coinBalanceLabel: String(coinBalance),
    coinCostLabel: String(COIN_COST),
    showInsufficientCoins: availability.showInsufficientCoins,
    canGenerate: availability.canGenerate,
    generationHelpText: availability.generationHelpText,
    onGenerate: handleGenerate,
    videoOptionFields,
    onChangeVideoOption: (fieldId, value) => setVideoOptionValues((current) => ({ ...current, [fieldId]: value })),
    videoDirectionValue,
    onChangeVideoDirection: setVideoDirectionValue,
  };

  return (
    <>
      <KitStudioPageView
        harnessSlot={
          <div className="flex flex-wrap items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)]">
            <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
              Fixture mode
            </span>
            {Object.entries(FIXTURE_MODES).map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={fixtureMode === key}
                onClick={() => setFixtureMode(key)}
                className={`min-h-[var(--control-sm)] rounded-[var(--radius-md)] border px-[var(--space-3)] text-[length:var(--text-label)] transition-colors ${
                  fixtureMode === key
                    ? "border-[var(--line-whisper)] bg-[var(--fill)] text-[var(--gold-bright)]"
                    : "border-[var(--line-whisper)] text-[var(--ink-dim)] hover:border-[var(--line)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        }
        headerSlot={
          <StudioPageHeaderView
            eyebrow="Create"
            title="Images"
            description="Craft the look once, pin it, and everything after stays on model."
          />
        }
        filterBarSlot={
          <KitStudioFilterBarView
            searchValue={searchValue}
            searchPlaceholder="Search your images"
            onSearchChange={(value) => {
              setSearchValue(value);
              setVisibleCount(PAGE_SIZE);
            }}
            filterGroups={filterGroups}
            selectedValues={selectedValues}
            onFilterToggle={toggleFilter}
            sortOptions={SORT_OPTIONS}
            selectedSort={selectedSort}
            onSortChange={(value) => {
              setSelectedSort(value);
              setVisibleCount(PAGE_SIZE);
            }}
            viewModeSlot={
              <ViewModeToggleView value={layout} label="Layout" onChange={setLayout} />
            }
          />
        }
        bannerSlot={
          <KitPromoBannerView
            treatment="bottom"
            bottomVariant="uniform"
            eyebrow="Create"
            title="Everything you keep lives in the Vault."
            line=""
            ctaLabel="Open the Vault"
            imageSrc={encodeURI("/tmp-mockup-images/alpha-test-creator-images/vermillion-8.png")}
            onCtaClick={() =>
              setActionNotice({
                label: "Open the Vault",
                message:
                  "This banner routes to the Vault when the new pages cut over. Nothing was opened in this preview.",
              })
            }
          />
        }
      >
        {/* Desktop 1100px and up: sticky right rail beside the grid,
            inside the content width (R1). Under 1100px: no rail, the
            create CTA below opens the panel as a modal instead
            (docs/SPRINT-E-PLAN.md section 1.4). */}
        <div className="flex items-start gap-[var(--space-6)]">
          <div className="flex min-w-0 flex-1 flex-col gap-[var(--space-6)]">
            {fixtureMode === "error" && (
              <KitAlertStripView
                tone="danger"
                title="Images could not be loaded."
                body="Try refreshing the page."
              />
            )}

            {fixtureMode === "loading" && <LoadingGrid />}

            {fixtureMode !== "loading" && fixtureMode !== "error" && filteredItems.length === 0 && (
              <EmptyState />
            )}

            {fixtureMode !== "loading" && fixtureMode !== "error" && filteredItems.length > 0 && (
              <>
                <div
                  className={
                    layout === "grid"
                      ? "grid grid-cols-2 gap-[var(--space-3)] min-[700px]:grid-cols-3 min-[700px]:gap-[var(--space-4)] min-[1100px]:grid-cols-3"
                      : "grid grid-cols-1 gap-[var(--space-3)] min-[1100px]:grid-cols-2"
                  }
                >
                  {visibleItems.map((item) => (
                    <KitCreationCardView
                      key={item.id}
                      layout={layout}
                      assetKind="image"
                      title={item.title}
                      subtitle={subtitleFor(item)}
                      imageSrc={item.imageSrc}
                      badges={[]}
                      stats={{ plays: null, hearts: item.hearts, saves: item.saves, followers: null }}
                      liked={lovedIds.includes(item.id)}
                      bookmarked={savedIds.includes(item.id)}
                      onOpenImageOverlay={() =>
                        setOverlayImage({ id: item.id, imageSrc: item.imageSrc, title: item.title })
                      }
                      onOpenAssetDetail={() =>
                        setOverlayImage({ id: item.id, imageSrc: item.imageSrc, title: item.title })
                      }
                      onLike={() => toggleLoved(item.id)}
                      onBookmark={() => toggleSaved(item.id)}
                      onGenerate={handleGenerate}
                    />
                  ))}
                </div>

                <KitLoadMoreView
                  isLoading={false}
                  hasMore={hasMore}
                  remainingCount={filteredItems.length - visibleCount}
                  onLoadMore={() =>
                    setVisibleCount((count) => Math.min(count + PAGE_SIZE, filteredItems.length))
                  }
                />
              </>
            )}
          </div>

          <aside
            className="sticky hidden w-[24rem] flex-none overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-4)] min-[1100px]:block"
            style={{
              top: "calc(var(--topbar-h) + var(--control-filter) + var(--space-3) * 2 + var(--space-4))",
              maxHeight:
                "calc(100dvh - var(--topbar-h) - var(--control-filter) - var(--space-3) * 2 - var(--space-4) * 2)",
            }}
          >
            <KitImageCreatorPanel {...panelProps} />
          </aside>
        </div>
      </KitStudioPageView>

      {/* Mobile and tablet (under 1100px): sticky create CTA opening
          the panel as a full-screen modal at 390, centered 700 to
          1099 (R4). */}
      <button
        type="button"
        onClick={() => setIsMobileCreatorOpen(true)}
        className="kit-focus fixed bottom-[calc(var(--space-4)+env(safe-area-inset-bottom))] right-[var(--space-4)] z-30 cf-btn cf-btn--primary min-[1100px]:hidden"
      >
        Create image
      </button>

      {isMobileCreatorOpen && (
        <KitModalFrame
          variant="modal"
          panelClassName="w-full max-w-2xl"
          onClose={() => setIsMobileCreatorOpen(false)}
          ariaLabel="Create image"
        >
          <div className="p-[var(--space-6)] pt-[var(--space-8)]">
            <KitImageCreatorPanel {...panelProps} />
          </div>
        </KitModalFrame>
      )}

      {activePickerSlotId && (
        <KitIngredientPicker
          slotLabel={SLOT_LABELS[activePickerSlotId]}
          searchValue={pickerSearchValue}
          searchPlaceholder={`Search ${SLOT_LABELS[activePickerSlotId].toLowerCase()}...`}
          onSearchChange={setPickerSearchValue}
          items={pickerItems}
          emptyMessage={`No ${SLOT_LABELS[activePickerSlotId].toLowerCase()} assets found.`}
          loadErrorMessage=""
          onChooseIngredient={handlePickerChooseIngredient}
          showUseCustomAction
          onUseCustom={handlePickerUseCustom}
          showCreatePresetAction={SAVABLE_SLOTS.includes(activePickerSlotId)}
          onCreatePreset={handlePickerCreatePreset}
          backLabel={isMobileCreatorOpen ? "Back to Image Creator" : null}
          onClose={() => setActivePickerSlotId(null)}
        />
      )}

      {savePresetSlotId && (
        <KitSaveIngredientPreset
          presetTypeLabel={SLOT_LABELS[savePresetSlotId]}
          introText={SAVE_PRESET_INTRO_TEXT}
          helperText={SAVE_PRESET_HELPER_TEXT}
          nameValue={savePresetForm.name}
          onChangeName={(value) => setSavePresetForm((current) => ({ ...current, name: value }))}
          descriptionValue={savePresetForm.description}
          onChangeDescription={(value) => setSavePresetForm((current) => ({ ...current, description: value }))}
          promptValue={savePresetForm.prompt}
          onChangePrompt={(value) => setSavePresetForm((current) => ({ ...current, prompt: value }))}
          tagsValue={savePresetForm.tags}
          onChangeTags={(value) => setSavePresetForm((current) => ({ ...current, tags: value }))}
          isSaving={false}
          canSave={savePresetCanSave}
          onSavePreset={() => {
            setActionNotice({
              label: "Save as preset",
              message: "Saving a preset is wired when the page goes live. Nothing was stored in this preview.",
            });
            setSavePresetSlotId(null);
          }}
          onUseOnce={() => setSavePresetSlotId(null)}
          backLabel={isMobileCreatorOpen ? "Back to Image Creator" : null}
          onClose={() => setSavePresetSlotId(null)}
        />
      )}

      {overlayImage && (
        <KitImageOverlay
          imageSrc={overlayImage.imageSrc}
          title={overlayImage.title}
          isLoved={lovedIds.includes(overlayImage.id)}
          isSaved={savedIds.includes(overlayImage.id)}
          onLove={() => toggleLoved(overlayImage.id)}
          onSave={() => toggleSaved(overlayImage.id)}
          onShare={() =>
            setActionNotice({
              label: "Share",
              message:
                "Sharing is wired when the page goes live. Nothing leaves this preview.",
            })
          }
          onClose={() => setOverlayImage(null)}
        />
      )}

      <FixtureActionNotice notice={actionNotice} onClose={() => setActionNotice(null)} />
    </>
  );
}
