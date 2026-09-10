"use client";

// Media Studio composer (FE/MEDIA-STUDIO, Brian's notes 1 and 2 plus
// the 9 Sep 2026 browser review round 1). Five asset tiles are fixed
// anatomy owned by this package, mirroring
// components/studio/image-studio/imageStudioData.js minus its second
// character slot (Character covers it, ruled 9 Sep 2026). Tokens only;
// every control on kit or cf-* recipes; no fetch anywhere.
//
// Shape: one scroll region (toggle, tabs, tiles, prompt, the closed
// "Image settings" disclosure) and, as its SIBLING, a footer that
// never scrolls: the count control on its own row, then the Generate
// button on its own line. The consumer gives the root a bounded
// height (the desktop rail, the mobile sheet); the root fills it.
import { useId, useRef, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Clapperboard,
  Coins,
  Footprints,
  Image as ImageIcon,
  ImagePlus,
  Layers,
  Library,
  Loader2,
  MapPin,
  Plus,
  Save,
  Shirt,
  SlidersHorizontal,
  Sparkles,
  Users,
  Video,
  X,
} from "lucide-react";

import KitDropdownView from "../dropdown/KitDropdown.view";
import { growTextarea } from "../form-field/growTextarea";
import { InfoTip, TOOLTIP_RECIPE } from "../form-field/InfoTip";
import { MENU_PANEL_RECIPE, MenuRow } from "../form-field/menuRecipe";
import { SoonChip } from "../form-field/SoonChip";

const SLOT_DEFS = [
  { id: "character", label: "Character", icon: Users, requirement: "required", savable: false, spanRow: true },
  { id: "pose", label: "Pose", icon: Footprints, requirement: "optional", savable: true, spanRow: false },
  { id: "outfit", label: "Outfit", icon: Shirt, requirement: "optional", savable: true, spanRow: false },
  { id: "location", label: "Location", icon: MapPin, requirement: "optional", savable: true, spanRow: false },
  { id: "preset", label: "Preset", icon: Sparkles, requirement: "optional", savable: true, spanRow: false },
];

const EMPTY_SLOT_STATE = { selection: null, isCustomMode: false, customText: "" };

const NOT_AVAILABLE_LABEL = "Not available yet";

// The Remix location tile is the Generate Character tile's shape
// (spans the row) with the Location glyph; optional, never glowing.
const REMIX_LOCATION_DEF = { id: "remixLocation", label: "Location", icon: MapPin, requirement: "optional", savable: true, spanRow: true };

// A mention starts at "@" after a space or the start of the text and
// runs to the caret (letters, digits, underscore).
const ACTIVE_MENTION_PATTERN = /(^|\s)@(\w*)$/;

const FIELD_RECIPE =
  "mt-[var(--space-2)] w-full resize-none overflow-hidden rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-faint)]";

// The tooltip recipe and the InfoTip live in ../form-field/InfoTip.jsx
// since FE/MEDIA-STUDIO session 3 (shared with the image viewer's
// size note); the menu recipe and MenuRow in
// ../form-field/menuRecipe.jsx (shared with the viewer's download
// size menu). Same recipes, imported back here.

// Field growth (one row, then grows with the text) lives in
// ../form-field/growTextarea.js, shared with the custom asset modal.

// Type hierarchy inside the composer, RULED at browser review round 3
// item 4. Three steps, no more: SECTION titles (Custom prompt, Render
// style, Advanced, Negative prompt) are the gold eyebrow at --text-ui;
// CONTROL titles (Camera framing, Wardrobe theme, Aspect ratio, and
// every Advanced slider) are the quieter, smaller eyebrow at
// --text-label; VALUES sit at --text-ui. --text-label is the bottom of
// the scale, so the size step runs upward from it rather than below.
//
// Round 4 (10 Sep 2026) took the whole composer one type step down:
// tile titles and the stage tab labels to --text-label, values from
// --text-body to --text-ui, section gaps and tile padding one step
// tighter. Control titles were already at --text-label, the floor of
// the scale, and stay there. Every touch target keeps --control-md
// (44px) and the Generate button is untouched.
function SectionTitle({ children, note = "" }) {
  return (
    <span className="inline-flex items-baseline gap-[var(--space-2)]">
      <span className="text-[length:var(--text-ui)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
        {children}
      </span>
      {note ? (
        <span className="text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
          {note}
        </span>
      ) : null}
    </span>
  );
}

function ControlTitle({ children, trailingSlot = null }) {
  return (
    <span className="flex items-center justify-between gap-[var(--space-2)]">
      <span className="min-w-0 truncate text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
        {children}
      </span>
      {trailingSlot}
    </span>
  );
}

// State law, RULED at browser review round 3 item 2: a control still
// at its default reads in the dim ink; a control the user changed
// reads gold. One helper so the selects, the render style step names,
// and the Advanced sliders can never drift apart.
function stateInkClass(isChanged) {
  return isChanged ? "text-[var(--gold-bright)]" : "text-[var(--ink-dim)]";
}

// Enough of the panel to clear before we commit to opening downward.
// Measured at click time against the scroll region's bottom edge,
// which is exactly where the Generate footer starts.
const MENU_CLEARANCE_PX = 220;

function menuOpensUpward(node) {
  if (!node || typeof window === "undefined") return false;
  const triggerRect = node.getBoundingClientRect();
  const scrollRegion = node.closest("[data-composer-scroll]");
  const bottomLimit = scrollRegion
    ? scrollRegion.getBoundingClientRect().bottom
    : window.innerHeight;
  return triggerRect.bottom + MENU_CLEARANCE_PX > bottomLimit;
}

// THE shared select for Image settings (round 3 item 1). Control
// title on its own line, then a full-width trigger underneath showing
// ONLY the current value and a chevron. Never a label-plus-value pill.
// The value truncates at the trigger width; it cannot wrap or
// overflow. Two call shapes, one look: pass `options` and the control
// owns its menu, or pass `onOpenPicker` and the trigger opens the
// caller's dialog instead.
function SettingSelect({
  fieldId,
  title,
  valueLabel,
  isChanged = false,
  description = "",
  options = null,
  value = "",
  onChange = null,
  onOpenPicker = null,
  idPrefix,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [opensUpward, setOpensUpward] = useState(false);
  const rootRef = useRef(null);

  const ownsMenu = Array.isArray(options) && options.length > 0;
  const canOpenPicker = typeof onOpenPicker === "function";
  const isDisabled = !ownsMenu && !canOpenPicker;
  const listId = `${idPrefix}-setting-${fieldId}`;

  function handleTriggerClick() {
    if (isDisabled) return;
    if (canOpenPicker && !ownsMenu) {
      onOpenPicker();
      return;
    }
    setOpensUpward(menuOpensUpward(rootRef.current));
    setIsOpen((current) => !current);
  }

  return (
    <div
      ref={rootRef}
      className="min-w-0"
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget)) setIsOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setIsOpen(false);
      }}
    >
      <ControlTitle>{title}</ControlTitle>

      <div className="relative mt-[var(--space-2)]">
        <button
          type="button"
          disabled={isDisabled}
          aria-haspopup={ownsMenu ? "listbox" : "dialog"}
          aria-expanded={ownsMenu ? isOpen : undefined}
          aria-controls={ownsMenu && isOpen ? listId : undefined}
          aria-label={`${title}: ${valueLabel}`}
          title={description || undefined}
          onClick={handleTriggerClick}
          className={`flex min-h-[var(--control-md)] w-full min-w-0 items-center justify-between gap-[var(--space-2)] rounded-[var(--radius-md)] border bg-[var(--surface-2)] px-[var(--space-4)] text-left text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition-colors duration-[var(--dur-hover)] ${
            isDisabled
              ? "cursor-not-allowed border-[var(--line-whisper)] text-[var(--ink-faint)] opacity-[var(--state-disabled-opacity)]"
              : `border-[var(--line-whisper)] hover:border-[var(--line)] active:bg-[var(--state-pressed-fill)] ${stateInkClass(isChanged)}`
          }`}
        >
          <span className="min-w-0 flex-1 truncate">{valueLabel}</span>
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`flex-none text-[var(--gold-ornament)] transition-transform duration-[var(--dur-fast)] ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {ownsMenu && isOpen ? (
          <div
            id={listId}
            role="listbox"
            aria-label={title}
            className={`${MENU_PANEL_RECIPE} left-0 right-0 ${
              opensUpward
                ? "bottom-[calc(100%+var(--space-1))]"
                : "top-[calc(100%+var(--space-1))]"
            }`}
          >
            {options.map((option) => (
              <MenuRow
                key={option.value}
                label={option.label}
                isSelected={option.value === value}
                disabled={Boolean(option.isDisabled)}
                tooltip={option.tooltip || ""}
                onSelect={() => {
                  onChange?.(option.value);
                  setIsOpen(false);
                }}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// Outlined track around both options, the active option filled inside
// it. Crestfall rounded square (radius-md), not a pill: ruled at the
// 9 Sep 2026 plan gate, no law change.
// Video (session 5, note 7): the option is live while the caller
// passes `video` and keeps its Soon tag while the job is not
// available, so the tag warns before the tap and Generate repeats it
// at the point of action. Disabled keeps the 2.2.0 treatment.
function ModeToggle({ mode, onChangeMode, videoDisabled, videoSoon, videoSoonLabel }) {
  const options = [
    { id: "IMAGE", label: "Image", icon: ImageIcon, disabled: false, soon: false },
    { id: "VIDEO", label: "Video", icon: Video, disabled: videoDisabled, soon: videoSoon },
  ];

  return (
    <div
      role="group"
      aria-label="Media type"
      className="grid grid-cols-2 gap-[var(--space-1)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-1)]"
    >
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = mode === option.id;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isActive}
            aria-disabled={option.disabled || undefined}
            title={option.disabled ? NOT_AVAILABLE_LABEL : undefined}
            onClick={() => {
              if (!option.disabled) onChangeMode?.(option.id);
            }}
            className={`flex min-h-[var(--control-filter)] min-w-0 items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] transition-colors [@media(pointer:coarse)]:min-h-[var(--control-md)] ${
              isActive
                ? "bg-[var(--fill)] text-[var(--gold-bright)]"
                : option.disabled
                  ? "cursor-not-allowed text-[var(--ink-dim)] opacity-[var(--state-disabled-opacity)]"
                  : "text-[var(--ink-dim)] hover:bg-[var(--state-hover-fill)] hover:text-[var(--ink)]"
            }`}
          >
            <Icon size={16} aria-hidden="true" className="flex-none" />
            <span className="truncate">{option.label}</span>
            {(option.disabled || option.soon) && videoSoonLabel ? (
              <SoonChip inline label={videoSoonLabel} />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

const IMAGE_STAGE_TABS = [
  { id: "GENERATE", label: "Generate" },
  { id: "REMIX", label: "Remix" },
];

// Video mode (session 5, RULED A of three at the plan gate): the same
// tab row carries Text to video and Image to video, with its own
// state, so switching Image and Video never moves the Generate and
// Remix tab.
const VIDEO_STAGE_TABS = [
  { id: "TEXT", label: "Text to video" },
  { id: "IMAGE", label: "Image to video" },
];

function StageTabs({ stage, onChangeStage, tabs = IMAGE_STAGE_TABS, ariaLabel = "Stage" }) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="grid grid-cols-2 gap-[var(--space-2)]">
      {tabs.map((tab) => {
        const isActive = stage === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChangeStage?.(tab.id)}
            className={`flex min-h-[var(--control-filter)] items-center justify-center rounded-[var(--radius-md)] border px-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] transition-colors [@media(pointer:coarse)]:min-h-[var(--control-md)] ${
              // Review round 2 (10 Sep 2026): the resting tab sits on
              // --surface-1 with a --line border and the active one on
              // --fill with a --line-strong border, at every width (the
              // mobile treatment from round 1, now desktop too), so the
              // pair reads apart from the panel behind it and the
              // resting tab is one step more pronounced.
              isActive
                ? "border-[var(--line-strong)] bg-[var(--fill)] text-[var(--gold-bright)]"
                : "border-[var(--line)] bg-[var(--surface-1)] text-[var(--ink-dim)] hover:border-[var(--line-strong)] hover:text-[var(--ink)]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function ClearButton({ label, onClick, overlay = false }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      className={`flex h-[var(--control-sm)] w-[var(--control-sm)] flex-none items-center justify-center rounded-[var(--radius-full)] border transition-colors [@media(pointer:coarse)]:h-[var(--control-md)] [@media(pointer:coarse)]:w-[var(--control-md)] ${
        // Over artwork: the tag-over-art recipe (--tag-bed-art bed,
        // 1px --line, over-art ink), FE/MEDIA-STUDIO session 3,
        // replacing the raw white and black literals.
        overlay
          ? "border-[var(--line)] bg-[var(--tag-bed-art)] text-[var(--art-ink)] backdrop-blur-[var(--blur-panel)] hover:border-[var(--line-strong)] hover:text-[var(--art-ink)]"
          : "border-[var(--line-whisper)] text-[var(--ink-faint)] hover:text-[var(--ink)]"
      }`}
    >
      <X size={14} aria-hidden="true" />
    </button>
  );
}

// Empty: icon centered, title centered at the bottom with (required)
// or (optional) under it, no eyebrow chip. Selected: the image fills
// the tile and its name sits centered at the bottom. The required
// Character tile carries a quiet gold glow.
function SlotTile({ def, state, onActivate, onClear }) {
  const Icon = def.icon;
  const hasSelection = Boolean(state.selection);
  const imageSrc = String(state.selection?.imageSrc || "").trim();
  const imagePosition = String(state.selection?.imagePosition || "").trim();
  const isRequired = def.requirement === "required";
  const title = hasSelection ? state.selection.title : def.label;

  return (
    <div
      // Under 1100px the composer is the sheet on the panel-lift
      // gradient, where --surface-2 tiles read muddy (review round 1,
      // session 2): the tiles drop to --surface-1 there for a clearer
      // step; the desktop rail keeps --surface-2.
      className={`group relative min-w-0 overflow-hidden rounded-[var(--radius-md)] border bg-[var(--surface-2)] transition-colors max-[1099.98px]:bg-[var(--surface-1)] ${
        def.spanRow ? "col-span-2 aspect-[5/2]" : "aspect-[5/4]"
      } ${
        isRequired
          ? "border-[var(--gold-ornament)]/40 shadow-[var(--glow-hover)]"
          : hasSelection
            ? "border-[var(--line)]"
            : "border-[var(--line-whisper)] hover:border-[var(--line)]"
      }`}
    >
      <button
        type="button"
        onClick={() => onActivate?.(def.id)}
        aria-label={`${hasSelection ? "Change" : "Select"} ${def.label}${hasSelection ? `: ${state.selection.title}` : ""}`}
        className="absolute inset-0 w-full"
      >
        {imageSrc ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt=""
              className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.02]"
              style={imagePosition ? { objectPosition: imagePosition } : undefined}
            />
            <span
              className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/95 via-black/70 to-transparent"
              aria-hidden="true"
            />
          </>
        ) : (
          <>
            <span
              className="absolute inset-0 bg-[var(--fill-whisper)] transition-colors group-hover:bg-[var(--fill)]"
              aria-hidden="true"
            />
            <span
              className="absolute inset-0 flex items-center justify-center pb-[var(--space-6)]"
              aria-hidden="true"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-faint)] transition-colors group-hover:text-[var(--gold-ornament)]">
                <Icon size={20} />
              </span>
            </span>
          </>
        )}

        <span className="absolute inset-x-[var(--space-2)] bottom-[var(--space-2)] min-w-0 text-center">
          <span
            className={`block truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] font-[var(--weight-medium)] ${
              imageSrc ? "text-[var(--art-ink)]" : "text-[var(--ink)]"
            }`}
          >
            {title}
          </span>
          {!hasSelection ? (
            <span className="block text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-faint)]">
              ({def.requirement})
            </span>
          ) : null}
        </span>
      </button>

      {hasSelection ? (
        <div className="absolute right-[var(--space-2)] top-[var(--space-2)] z-10">
          <ClearButton overlay label={`Clear ${def.label}`} onClick={() => onClear?.(def.id)} />
        </div>
      ) : null}
    </div>
  );
}

function CustomSlotEditor({ def, state, onChangeText, onBackToPresets, onSavePreset, onClear, idPrefix }) {
  return (
    <div className="col-span-2 min-w-0 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--fill-whisper)] p-[var(--space-3)]">
      <div className="flex items-start justify-between gap-[var(--space-3)]">
        <span className="inline-flex items-center gap-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          <BookOpen size={14} aria-hidden="true" />
          Custom {def.label}
        </span>
        <ClearButton label={`Clear custom ${def.label}`} onClick={() => onClear?.(def.id)} />
      </div>

      <label className="mt-[var(--space-3)] block">
        <SectionTitle>Custom guidance</SectionTitle>
        <textarea
          ref={growTextarea}
          name={`${idPrefix}-custom-guidance-${def.id}`}
          id={`${idPrefix}-custom-guidance-${def.id}`}
          value={state.customText}
          onChange={(event) => {
            growTextarea(event.target);
            onChangeText?.(def.id, event.target.value);
          }}
          placeholder={`Describe the custom ${def.label.toLowerCase()} guidance...`}
          rows={1}
          className={FIELD_RECIPE}
        />
      </label>

      <div className={`mt-[var(--space-3)] grid gap-[var(--space-2)] ${def.savable ? "grid-cols-3" : "grid-cols-2"}`}>
        <button
          type="button"
          onClick={() => onBackToPresets?.(def.id)}
          className="cf-btn cf-btn--secondary cf-btn--sm"
        >
          <Library size={14} aria-hidden="true" />
          Back to presets
        </button>
        {def.savable && (
          <button
            type="button"
            onClick={() => onSavePreset?.(def.id)}
            className="cf-btn cf-btn--secondary cf-btn--sm"
          >
            <Save size={14} aria-hidden="true" />
            Save as preset
          </button>
        )}
        <span
          role="status"
          aria-label={`${def.label} custom guidance is active for this request`}
          className="cf-btn cf-btn--primary cf-btn--sm cursor-default"
        >
          <Check size={14} aria-hidden="true" />
          Using once
        </span>
      </div>
    </div>
  );
}

// Slider plus the six diagonal step names. Each step carries a hover
// or tap tooltip with its definition. Tap selects the step and shows
// its tooltip; blur or Escape hides it.
function RenderStyleRail({ rail, idPrefix }) {
  const [openIndex, setOpenIndex] = useState(-1);
  if (!rail?.options?.length) return null;

  const activeIndex = Math.max(
    0,
    rail.options.findIndex((option) => option.active || option.value === rail.value)
  );
  const maxIndex = Math.max(rail.options.length - 1, 0);
  // Same state law as the selects: still on the default profile reads
  // dim, moved off it reads gold. The caller supplies defaultValue;
  // when it does not, the first stop is the default by definition.
  const defaultValue = rail.defaultValue || rail.options[0]?.value;
  const isChanged = rail.value !== defaultValue;

  function selectIndex(nextIndex) {
    const boundedIndex = Math.min(Math.max(Number(nextIndex) || 0, 0), maxIndex);
    const option = rail.options[boundedIndex];
    if (option) rail.onChange?.(option.value);
  }

  return (
    <section className="min-w-0">
      <SectionTitle>Render style</SectionTitle>

      <input
        id={`${idPrefix}-render-style-rail`}
        type="range"
        min={0}
        max={maxIndex}
        step={1}
        value={activeIndex}
        aria-label="Render style"
        aria-valuetext={rail.activeLabel}
        onChange={(event) => selectIndex(event.target.value)}
        className="mt-[var(--space-3)] w-full cursor-pointer accent-[var(--gold-action)]"
      />

      <div className="mt-[var(--space-1)] grid grid-cols-6 gap-1">
        {rail.options.map((option, index) => {
          const isActive = index === activeIndex;
          const isOpen = index === openIndex;
          const definition = String(option.definition || option.mappedLabel || "");
          const tipId = `${idPrefix}-render-style-tip-${index}`;
          const anchorClass =
            index === 0 ? "left-0" : index === maxIndex ? "right-0" : "left-1/2 -translate-x-1/2";
          return (
            <span key={option.value} className="group/step relative block min-w-0">
              <button
                type="button"
                aria-pressed={isActive}
                aria-describedby={definition ? tipId : undefined}
                onClick={() => {
                  selectIndex(index);
                  setOpenIndex((current) => (current === index ? -1 : index));
                }}
                onBlur={() => setOpenIndex((current) => (current === index ? -1 : current))}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setOpenIndex(-1);
                }}
                className={`relative h-16 w-full min-w-0 overflow-hidden text-[length:var(--text-label)] transition-colors ${
                  isActive
                    ? stateInkClass(isChanged)
                    : "text-[var(--ink-faint)] hover:text-[var(--ink-dim)]"
                }`}
              >
                <span
                  className={`absolute left-1/2 top-1/2 whitespace-nowrap rounded-[var(--radius-sm)] px-1.5 py-1 leading-tight ${
                    isActive ? "bg-[var(--fill)]" : ""
                  }`}
                  style={{
                    transform: "translate(-50%, -50%) rotate(-42deg)",
                    transformOrigin: "center",
                  }}
                >
                  {option.shortLabel}
                </span>
              </button>
              {definition ? (
                <span
                  id={tipId}
                  role="tooltip"
                  className={`${TOOLTIP_RECIPE} group-hover/step:opacity-100 ${
                    isOpen ? "opacity-100" : "opacity-0"
                  } ${anchorClass}`}
                >
                  <span className="block text-[var(--gold-bright)]">{option.mappedLabel}</span>
                  {definition}
                </span>
              ) : null}
            </span>
          );
        })}
      </div>
    </section>
  );
}

// Every slider the workflow definition supplies renders (none were
// removed). Copy is cut to the label plus an "i" tooltip per slider;
// no paragraphs.
function AdvancedTuning({ tuning, idPrefix }) {
  const [isOpen, setIsOpen] = useState(false);
  if (!tuning?.enabled) return null;

  return (
    <section className="min-w-0 rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--fill-whisper)]">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="flex min-h-[var(--control-md)] w-full items-center justify-between gap-[var(--space-3)] px-[var(--space-4)] text-left text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)]"
      >
        <SectionTitle note={tuning.modified ? "custom" : "defaults"}>Advanced</SectionTitle>
        {isOpen ? <ChevronUp size={15} aria-hidden="true" /> : <ChevronDown size={15} aria-hidden="true" />}
      </button>

      {isOpen ? (
        <div className="flex flex-col gap-[var(--space-4)] border-t border-[var(--line-whisper)] px-[var(--space-4)] pb-[var(--space-4)] pt-[var(--space-4)]">
          {(tuning.controls || []).map((control) => {
            const inputId = `${idPrefix}-advanced-${control.id}`;
            // Slider state reads the same way as every select: at the
            // definition's defaultValue it is dim, moved off it is gold.
            const isChanged =
              control.defaultValue !== undefined &&
              Number(control.value) !== Number(control.defaultValue);
            return (
              // `relative` is the InfoTip tooltip's anchor (see InfoTip).
              <div key={control.id} className="relative min-w-0">
                <div className="flex items-center justify-between gap-[var(--space-2)]">
                  <span className="inline-flex min-w-0 items-center gap-[var(--space-1)]">
                    <label
                      htmlFor={inputId}
                      className="min-w-0 truncate text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]"
                    >
                      {control.label}
                    </label>
                    <InfoTip label={`About ${control.label}`} text={control.description} />
                  </span>
                  <span
                    className={`shrink-0 rounded-[var(--radius-xs)] bg-[var(--surface-1)] px-[var(--space-2)] py-1 text-[length:var(--text-label)] tabular-nums ${stateInkClass(isChanged)}`}
                  >
                    {control.valueLabel}
                  </span>
                </div>
                <input
                  id={inputId}
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={control.value}
                  aria-label={control.label}
                  onChange={(event) => control.onChange?.(Number(event.target.value))}
                  className="mt-[var(--space-2)] w-full cursor-pointer accent-[var(--gold-action)]"
                />
                <div className="mt-[var(--space-1)] flex justify-between gap-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[0.1em] text-[var(--ink-faint)]">
                  <span>{control.leftLabel}</span>
                  <span className="text-right">{control.rightLabel}</span>
                </div>
              </div>
            );
          })}

          {tuning.handoff ? (
            <div className="flex flex-wrap items-center justify-between gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-3)] py-[var(--space-2)]">
              <span className="min-w-0 text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">{tuning.handoff.message}</span>
              <button
                type="button"
                onClick={() => tuning.handoff.onSwitch?.()}
                className="text-[length:var(--text-label)] font-medium text-[var(--gold-ornament)] underline decoration-[var(--gold-ornament)]/35 underline-offset-4"
              >
                Switch to {tuning.handoff.targetProfileLabel}
              </button>
            </div>
          ) : null}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => tuning.onReset?.()}
              disabled={!tuning.modified}
              className="cf-btn cf-btn--secondary cf-btn--sm disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)]"
            >
              Reset defaults
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

// One disclosure, closed by default (browser review round 1, item 4):
// Render style, Camera framing, Wardrobe theme, Aspect ratio,
// Advanced, Negative prompt. Full width, outlined, chevron; quiet
// enough not to compete with Generate.
function ImageSettings({
  renderStyleRailProps,
  optionFields,
  onChangeOption,
  advancedTuningProps,
  negativePromptValue,
  onChangeNegativePrompt,
  cameraPresetLabel,
  cameraPresetDescription,
  cameraPresetChanged,
  onOpenCameraPresetPicker,
  showSceneryOnlyHelper,
  sceneryOnlyHelperEnabled,
  onChangeSceneryOnlyHelper,
  idPrefix,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const bodyId = `${idPrefix}-image-settings`;

  return (
    <section className="min-w-0 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)]">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={bodyId}
        onClick={() => setIsOpen((current) => !current)}
        className="flex min-h-[var(--control-md)] w-full items-center justify-between gap-[var(--space-3)] rounded-[var(--radius-md)] px-[var(--space-4)] text-left text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] transition-colors hover:bg-[var(--state-hover-fill)]"
      >
        <span className="inline-flex items-center gap-[var(--space-2)]">
          <SlidersHorizontal size={16} aria-hidden="true" className="text-[var(--gold-ornament)]" />
          Image settings
        </span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`flex-none text-[var(--gold-ornament)] transition-transform duration-[var(--dur-fast)] ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div id={bodyId} className="flex flex-col gap-[var(--space-5)] border-t border-[var(--line-whisper)] px-[var(--space-4)] pb-[var(--space-5)] pt-[var(--space-4)]">
          <RenderStyleRail rail={renderStyleRailProps} idPrefix={idPrefix} />

          {/* Call site 1 of the shared SettingSelect: opens the camera
              catalog picker instead of owning a menu, because the
              catalog is too large for a menu. */}
          <SettingSelect
            fieldId="camera-preset"
            title="Camera framing"
            valueLabel={cameraPresetLabel}
            isChanged={cameraPresetChanged}
            description={cameraPresetDescription}
            onOpenPicker={onOpenCameraPresetPicker}
            idPrefix={idPrefix}
          />

          {/* Call sites 2 and 3: Wardrobe theme and Aspect ratio, each
              owning its own menu through the same component. */}
          {optionFields.map((field) => (
            <SettingSelect
              key={field.id}
              fieldId={field.id}
              title={field.label}
              valueLabel={
                field.options?.find((option) => option.value === field.value)?.label ||
                field.value
              }
              isChanged={
                field.defaultValue !== undefined && field.value !== field.defaultValue
              }
              options={field.options}
              value={field.value}
              onChange={(value) => onChangeOption?.(field.id, value)}
              idPrefix={idPrefix}
            />
          ))}

          <AdvancedTuning tuning={advancedTuningProps} idPrefix={idPrefix} />

          {showSceneryOnlyHelper ? (
            <label
              title="Adds bounded scenery guidance only when Location is the sole visual source."
              className="flex min-h-[var(--control-md)] cursor-pointer items-center gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--fill-whisper)] px-[var(--space-4)] py-[var(--space-2)]"
            >
              <input
                type="checkbox"
                checked={sceneryOnlyHelperEnabled}
                onChange={(event) => onChangeSceneryOnlyHelper?.(event.target.checked)}
                className="h-4 w-4 accent-[var(--gold-bright)]"
              />
              <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
                Optimize for scenery-only image
              </span>
            </label>
          ) : null}

          <label className="block">
            <SectionTitle note="(optional)">Negative prompt</SectionTitle>
            <textarea
              ref={growTextarea}
              name={`${idPrefix}-negative-prompt`}
              id={`${idPrefix}-negative-prompt`}
              value={negativePromptValue}
              onChange={(event) => {
                growTextarea(event.target);
                onChangeNegativePrompt?.(event.target.value);
              }}
              placeholder="Describe what to avoid..."
              rows={1}
              className={FIELD_RECIPE}
            />
          </label>
        </div>
      ) : null}
    </section>
  );
}

// Count control like OD: layers glyph plus the number. The menu
// opens UPWARD over the content so it never covers the Generate
// button below it. Rows the backend cannot serve stay disabled with
// their tooltip. Open state is presentation-only; blur (focus leaving
// the control) or Escape closes it, no document listeners.
function CountMenu({ options, value, onChange, idPrefix }) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  if (!options?.length) return null;
  const selected = options.find((option) => option.value === value) || null;
  const listId = `${idPrefix}-count-menu`;

  return (
    <div
      ref={rootRef}
      className="relative inline-flex"
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget)) setIsOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setIsOpen(false);
      }}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        aria-label={`Output count: ${selected?.label || value}`}
        onClick={() => setIsOpen((current) => !current)}
        className={`inline-flex min-h-[var(--control-md)] items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border bg-[var(--surface-1)] px-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition-colors ${
          isOpen
            ? "border-[var(--line)] text-[var(--ink)]"
            : "border-[var(--line-whisper)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
        }`}
      >
        <Layers size={16} aria-hidden="true" className="flex-none text-[var(--gold-ornament)]" />
        <span className="tabular-nums text-[var(--gold-bright)]">{value}</span>
        <ChevronUp
          size={14}
          aria-hidden="true"
          className={`flex-none transition-transform duration-[var(--dur-fast)] ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div
          id={listId}
          role="listbox"
          aria-label="Output count"
          className={`${MENU_PANEL_RECIPE} bottom-[calc(100%+var(--space-1))] left-0 min-w-[12rem]`}
        >
          {options.map((option) => (
            <MenuRow
              key={option.value}
              label={option.label}
              isSelected={option.value === value}
              disabled={Boolean(option.isDisabled)}
              tooltip={option.tooltip || ""}
              onSelect={() => {
                onChange?.(option.value);
                setIsOpen(false);
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

// Footer: a SIBLING of the scroll region, never inside it. The count
// control on its own row, then Generate on its own line, reading
// "Generate", a coin glyph, and the cost. Block reasons are the
// disabled button's tooltip, never helper copy.
function GenerateFooter({
  countOptions,
  countValue,
  onChangeCount,
  generateCostLabel,
  canGenerate,
  generationHelpText,
  generationStatus,
  onGenerate,
  disabledReason,
  soon = false,
  idPrefix,
}) {
  const isLoading = generationStatus === "loading";
  const isDisabled = !canGenerate;
  // Soon (Remix until the Chassis carries the job): the button keeps
  // its coin glyph and cost, gains the Soon chip, and its title reads
  // "Not available yet" ahead of any coin or input reason.
  const reason =
    disabledReason ||
    (soon ? NOT_AVAILABLE_LABEL : "") ||
    (isDisabled ? generationHelpText : "");
  const reasonId = `${idPrefix}-generate-reason`;

  return (
    <div className="flex flex-none flex-col gap-[var(--space-3)] border-t border-[var(--line-whisper)] px-[var(--space-5)] py-[var(--space-4)]">
      {countOptions?.length ? (
        <div className="flex">
          <CountMenu options={countOptions} value={countValue} onChange={onChangeCount} idPrefix={idPrefix} />
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => onGenerate?.()}
        disabled={isDisabled}
        title={reason || undefined}
        aria-describedby={reason ? reasonId : undefined}
        className="cf-btn cf-btn--primary min-h-[var(--control-md)] w-full disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)]"
      >
        <span>Generate</span>
        {disabledReason ? null : isLoading ? (
          <Loader2 size={15} className="animate-spin" aria-hidden="true" />
        ) : (
          <Coins size={15} aria-hidden="true" />
        )}
        {disabledReason || !generateCostLabel ? null : (
          <span className="tabular-nums">{generateCostLabel}</span>
        )}
        {soon ? <SoonChip /> : null}
      </button>
      {reason ? (
        <span id={reasonId} className="sr-only">
          {reason}
        </span>
      ) : null}
    </div>
  );
}

// A filled Remix reference: the art fills a square tile, the name sits
// at the bottom, the @img handle sits top-left on the tag-over-art
// recipe (the same bed the overlay clear button uses), the clear
// button top-right. Tapping the art re-opens the picker for that
// slot. Same surface rule as SlotTile (--surface-1 under 1100px).
function RemixReferenceTile({ reference, onChange, onRemove }) {
  const imageSrc = String(reference.selection?.imageSrc || "").trim();
  const title = reference.selection?.title || "Character";

  return (
    <div className="group relative aspect-square min-w-0 overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] transition-colors max-[1099.98px]:bg-[var(--surface-1)]">
      <button
        type="button"
        onClick={() => onChange?.(reference.slotId)}
        aria-label={`Change ${reference.mention}: ${title}`}
        className="absolute inset-0 w-full"
      >
        {imageSrc ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt=""
              className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.02]"
            />
            <span
              className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/95 via-black/70 to-transparent"
              aria-hidden="true"
            />
          </>
        ) : (
          <>
            <span
              className="absolute inset-0 bg-[var(--fill-whisper)] transition-colors group-hover:bg-[var(--fill)]"
              aria-hidden="true"
            />
            <span
              className="absolute inset-0 flex items-center justify-center pb-[var(--space-6)]"
              aria-hidden="true"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-faint)] transition-colors group-hover:text-[var(--gold-ornament)]">
                <Users size={18} />
              </span>
            </span>
          </>
        )}

        <span className="absolute inset-x-[var(--space-2)] bottom-[var(--space-2)] min-w-0 text-center">
          <span
            className={`block truncate text-[length:var(--text-label)] leading-[var(--lh-label)] font-[var(--weight-medium)] ${
              imageSrc ? "text-[var(--art-ink)]" : "text-[var(--ink)]"
            }`}
          >
            {title}
          </span>
        </span>
      </button>

      <span
        aria-hidden="true"
        className="absolute left-[var(--space-2)] top-[var(--space-2)] z-10 rounded-[var(--radius-xs)] border border-[var(--line)] bg-[var(--tag-bed-art)] px-[var(--space-2)] py-[2px] text-[length:var(--text-label)] leading-[var(--lh-label)] tabular-nums text-[var(--art-ink)] backdrop-blur-[var(--blur-panel)]"
      >
        {reference.mention}
      </span>

      <div className="absolute right-[var(--space-2)] top-[var(--space-2)] z-10">
        <ClearButton
          overlay
          label={`Remove ${reference.mention}: ${title}`}
          onClick={() => onRemove?.(reference.slotId)}
        />
      </div>
    </div>
  );
}

// The one add control. It leaves the grid at the limit (Brian's
// browser note, 10 Sep 2026: the six-tile grid is simply full); the
// disabled reading of the caller's limit line is kept for a caller
// that still passes canAdd false with room in the row.
function AddCharacterTile({ canAdd, limitLabel, isRequired, onAdd }) {
  return (
    <button
      type="button"
      disabled={!canAdd}
      title={canAdd ? undefined : limitLabel}
      aria-label={canAdd ? "Add character" : limitLabel}
      onClick={() => {
        if (canAdd) onAdd?.();
      }}
      className={`group relative flex aspect-square min-w-0 flex-col items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-dashed px-[var(--space-2)] text-center transition-colors max-[1099.98px]:bg-[var(--surface-1)] ${
        canAdd
          ? `bg-[var(--fill-whisper)] hover:border-[var(--line)] hover:bg-[var(--fill)] ${
              isRequired
                ? "border-[var(--gold-ornament)]/40 shadow-[var(--glow-hover)]"
                : "border-[var(--line-whisper)]"
            }`
          : "cursor-not-allowed border-[var(--line-whisper)] bg-[var(--fill-whisper)] opacity-[var(--state-disabled-opacity)]"
      }`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-faint)] transition-colors group-hover:text-[var(--gold-ornament)]">
        <Plus size={18} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[length:var(--text-label)] leading-[var(--lh-label)] font-[var(--weight-medium)] text-[var(--ink)]">
          {canAdd ? "Add character" : limitLabel}
        </span>
        {canAdd ? (
          <span className="block text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-faint)]">
            ({isRequired ? "required" : "optional"})
          </span>
        ) : null}
      </span>
    </button>
  );
}

// The reference grid is three across; RemixStage fills the last row
// with placeholders so the rows stay even.
const REMIX_GRID_COLUMNS = 3;

// The Crestfall rosette, the primary logo's mark (the Flower of Life
// sigil in public/tmp-creator-tiles/logo-mark.svg), drawn inline in
// currentColor so it takes the tile's ink token. Strokes are heavier
// than the standalone file's because this renders at 28px.
function CrestfallRosette({ size = 28 }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <g strokeWidth="1.25">
        <circle cx="32" cy="32" r="10" />
        <circle cx="42" cy="32" r="10" />
        <circle cx="37" cy="40.66" r="10" />
        <circle cx="27" cy="40.66" r="10" />
        <circle cx="22" cy="32" r="10" />
        <circle cx="27" cy="23.34" r="10" />
        <circle cx="37" cy="23.34" r="10" />
      </g>
      <circle cx="32" cy="32" r="20" strokeWidth="1.25" />
      <circle cx="32" cy="32" r="23" strokeWidth="1.75" />
    </svg>
  );
}

// A slot not yet reachable this row: the darker bed, a solid whisper
// line, the Crestfall rosette (Brian's browser note, 10 Sep 2026,
// round 2: the primary logo's mark, not a generic glyph), nothing to
// press. Decoration only, so it is hidden from assistive technology;
// the Add tile is the one control.
function RemixPlaceholderTile() {
  return (
    <div
      aria-hidden="true"
      className="flex aspect-square min-w-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-faint)]"
    >
      <CrestfallRosette />
    </div>
  );
}

// The Remix prompt (note 5a): typing "@" opens the mention list
// (the shared menu recipe with a thumbnail per row) filtered by the
// letters after the "@"; choosing a row replaces them with the
// mention and a space at the caret. Escape, blur, or a caret away
// from an "@" closes it. Presentation only: the prompt text carries
// the "@img1" handles and the caller sends it as typed.
function RemixPrompt({ value, onChange, mentionOptions, idPrefix }) {
  const [activeMention, setActiveMention] = useState(null);
  const rootRef = useRef(null);
  const textareaRef = useRef(null);
  const listId = `${idPrefix}-remix-mention-list`;
  const inputId = `${idPrefix}-remix-prompt`;

  function readActiveMention(node) {
    if (!node || !mentionOptions?.length) return null;
    const caret = node.selectionStart ?? node.value.length;
    const match = ACTIVE_MENTION_PATTERN.exec(node.value.slice(0, caret));
    if (!match) return null;
    return { start: caret - match[2].length - 1, end: caret, query: match[2].toLowerCase() };
  }

  function syncMention(node) {
    setActiveMention(readActiveMention(node));
  }

  function chooseMention(option) {
    const node = textareaRef.current;
    if (!node || !activeMention) return;
    const insertion = `${option.mention} `;
    const nextValue =
      node.value.slice(0, activeMention.start) +
      insertion +
      node.value.slice(activeMention.end);
    const nextCaret = activeMention.start + insertion.length;
    onChange?.(nextValue);
    setActiveMention(null);
    // Restore the caret after React re-renders the controlled value.
    requestAnimationFrame(() => {
      const current = textareaRef.current;
      if (!current) return;
      current.focus();
      current.setSelectionRange(nextCaret, nextCaret);
      growTextarea(current);
    });
  }

  const visibleOptions = activeMention
    ? (mentionOptions || []).filter((option) => {
        if (!activeMention.query) return true;
        return `${option.mention} ${option.title}`
          .toLowerCase()
          .includes(activeMention.query);
      })
    : [];
  const isOpen = Boolean(activeMention) && visibleOptions.length > 0;

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget)) setActiveMention(null);
      }}
    >
      <label htmlFor={inputId} className="block">
        <SectionTitle note="(required)">Custom prompt</SectionTitle>
      </label>
      <textarea
        ref={(node) => {
          textareaRef.current = node;
          growTextarea(node);
        }}
        name={inputId}
        id={inputId}
        value={value}
        aria-autocomplete="list"
        aria-controls={isOpen ? listId : undefined}
        onChange={(event) => {
          growTextarea(event.target);
          onChange?.(event.target.value);
          syncMention(event.target);
        }}
        onClick={(event) => syncMention(event.target)}
        onKeyUp={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") syncMention(event.target);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setActiveMention(null);
        }}
        placeholder="Describe the scene, type @ to reference asset..."
        rows={1}
        className={FIELD_RECIPE}
      />

      {isOpen ? (
        <div
          id={listId}
          role="listbox"
          aria-label="Mention a reference"
          // Opens above the field (Brian's browser note, 10 Sep 2026,
          // round 2): the prompt sits at the bottom of the scroll
          // region, so a list below it would need a scroll to read.
          className={`${MENU_PANEL_RECIPE} bottom-[calc(100%+var(--space-1))] left-0 right-0`}
        >
          {visibleOptions.map((option) => (
            <MenuRow
              key={option.mention}
              label={`${option.mention}  ${option.title}`}
              imageSrc={option.imageSrc || ""}
              onSelect={() => chooseMention(option)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

// The Remix body (notes 5, 5a): a three-across reference grid, filled
// slots first then the one Add tile, the Location tile under it, and
// the prompt with the mention list. Null `remix` keeps the session 1
// stub so the fixture-era consumers render as before.
function RemixStage({ remix, idPrefix }) {
  if (!remix) {
    return (
      <div className="flex min-h-[8rem] items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--line-whisper)] bg-[var(--fill-whisper)] px-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
        {NOT_AVAILABLE_LABEL}
      </div>
    );
  }

  const references = remix.references || [];
  const locationState = { ...EMPTY_SLOT_STATE, selection: remix.location?.selection || null };
  // Even rows (Brian's browser note, 10 Sep 2026): the filled tiles
  // and the one Add tile are followed by dark placeholder tiles up to
  // the end of the row, so the grid always reads as complete rows of
  // three. At the caller's limit the Add tile leaves and the last row
  // is filled tiles only, so the grid never grows past the limit.
  const showAddTile = Boolean(remix.canAddCharacter);
  const tileCount = references.length + (showAddTile ? 1 : 0);
  const placeholderCount =
    (REMIX_GRID_COLUMNS - (tileCount % REMIX_GRID_COLUMNS)) % REMIX_GRID_COLUMNS;

  return (
    <>
      <section className="min-w-0">
        <SectionTitle note={remix.addLimitLabel ? `(${remix.addLimitLabel.toLowerCase()})` : ""}>
          References
        </SectionTitle>
        <div className="mt-[var(--space-3)] grid grid-cols-3 gap-[var(--space-3)]">
          {references.map((reference) => (
            <RemixReferenceTile
              key={reference.slotId}
              reference={reference}
              onChange={remix.onChangeCharacter}
              onRemove={remix.onRemoveCharacter}
            />
          ))}
          {showAddTile ? (
            <AddCharacterTile
              canAdd
              limitLabel={remix.addLimitLabel || ""}
              isRequired={references.length === 0}
              onAdd={remix.onAddCharacter}
            />
          ) : null}
          {Array.from({ length: placeholderCount }, (_, index) => (
            <RemixPlaceholderTile key={`placeholder-${index}`} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-[var(--space-3)]">
        <SlotTile
          def={REMIX_LOCATION_DEF}
          state={locationState}
          onActivate={() => remix.onSelectLocation?.()}
          onClear={() => remix.onClearLocation?.()}
        />
      </div>

      <RemixPrompt
        value={remix.promptValue || ""}
        onChange={remix.onChangePrompt}
        mentionOptions={remix.mentionOptions || []}
        idPrefix={idPrefix}
      />
    </>
  );
}

// The Image to video source tile: the Generate Character tile's shape
// (spans the row) with the add-image glyph, required, never glowing.
const VIDEO_SOURCE_DEF = { id: "sourceImage", label: "Image", icon: ImagePlus, requirement: "required", savable: false, spanRow: true };

// Quality: 720p or 1080p, the mode toggle's recipe (one outlined track,
// the active option filled inside it). Two options and nothing else:
// no model, extend, audio, or 4k (note 7).
function QualityToggle({ quality, onChange }) {
  const options = quality?.options || [];
  return (
    <div className="min-w-0">
      <ControlTitle>Quality</ControlTitle>
      <div
        role="group"
        aria-label="Quality"
        className="mt-[var(--space-2)] grid grid-cols-2 gap-[var(--space-1)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-1)]"
      >
        {options.map((option) => {
          const isActive = option.value === quality?.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange?.(option.value)}
              className={`flex min-h-[var(--control-filter)] min-w-0 items-center justify-center rounded-[var(--radius-md)] px-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] tabular-nums transition-colors [@media(pointer:coarse)]:min-h-[var(--control-md)] ${
                isActive
                  ? "bg-[var(--fill)] text-[var(--gold-bright)]"
                  : "text-[var(--ink-dim)] hover:bg-[var(--state-hover-fill)] hover:text-[var(--ink)]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Duration: the Advanced slider's recipe (control title, the value
// chip on the right in the dim-or-gold state ink, the range input,
// the two end labels). Moves in segment steps from the caller.
function DurationSlider({ video, idPrefix }) {
  const inputId = `${idPrefix}-video-duration`;
  const min = Number(video.durationMin) || 0;
  const max = Number(video.durationMax) || min;
  const step = Number(video.durationStep) || 1;
  const value = Number(video.durationSeconds) || min;
  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between gap-[var(--space-2)]">
        <label
          htmlFor={inputId}
          className="min-w-0 truncate text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]"
        >
          Duration
        </label>
        <span
          className={`shrink-0 rounded-[var(--radius-xs)] bg-[var(--surface-1)] px-[var(--space-2)] py-1 text-[length:var(--text-label)] tabular-nums ${stateInkClass(value !== min)}`}
        >
          {value}s
        </span>
      </div>
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label="Duration in seconds"
        aria-valuetext={`${value} seconds`}
        onChange={(event) => video.onChangeDuration?.(Number(event.target.value))}
        className="mt-[var(--space-2)] w-full cursor-pointer accent-[var(--gold-action)]"
      />
      <div className="mt-[var(--space-1)] flex justify-between gap-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
        <span>{min}s</span>
        <span className="text-right">{max}s</span>
      </div>
    </div>
  );
}

// Custom director: compact, editable temporal cues independent of the
// provider/billing segment length. Start/end fields accept tenths of a
// second, gaps are valid, and the caller flags overlaps or invalid ranges.
// Adding/removing a cue never changes the video's duration.
function DirectorRows({ director, idPrefix }) {
  const rows = director?.rows || [];
  const durationSeconds = Number(director?.durationSeconds) || 0;
  const timeStepSeconds = Number(director?.timeStepSeconds) || 0.1;

  return (
    <div className="flex flex-col gap-[var(--space-3)]">
      <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-faint)]">
        Set precise cue ranges. Gaps are allowed.
      </p>
      {rows.map((row) => {
        const fieldId = `${idPrefix}-director-${row.id}`;
        const startId = `${fieldId}-start`;
        const endId = `${fieldId}-end`;
        const invalidTimeClass = row.isInvalid
          ? "border-[var(--status-danger-border)] text-[var(--status-danger)]"
          : "border-[var(--line-whisper)] text-[var(--ink-dim)] focus:border-[var(--gold-ornament)] focus:text-[var(--gold-bright)]";

        return (
          <div key={row.id} className="min-w-0">
            <div className="grid min-w-0 grid-cols-[8.25rem_minmax(0,1fr)] items-start gap-[var(--space-2)]">
              <div className="mt-[var(--space-2)] flex min-h-[var(--control-md)] items-center gap-1">
                <input
                  id={startId}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={durationSeconds}
                  step={timeStepSeconds}
                  value={row.fromSecond}
                  aria-label={`Cue ${row.index + 1} start time in seconds`}
                  aria-invalid={row.isInvalid || undefined}
                  onChange={(event) =>
                    director.onChangeRowTime?.(
                      row.id,
                      "fromSecond",
                      Number(event.target.value)
                    )
                  }
                  className={`h-8 w-[2.65rem] rounded-[var(--radius-xs)] border bg-[var(--surface-1)] px-1 text-center text-[length:var(--text-label)] tabular-nums outline-none transition ${invalidTimeClass}`}
                />
                <span className="text-[length:var(--text-label)] text-[var(--ink-faint)]">–</span>
                <input
                  id={endId}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={durationSeconds}
                  step={timeStepSeconds}
                  value={row.toSecond}
                  aria-label={`Cue ${row.index + 1} end time in seconds`}
                  aria-invalid={row.isInvalid || undefined}
                  onChange={(event) =>
                    director.onChangeRowTime?.(
                      row.id,
                      "toSecond",
                      Number(event.target.value)
                    )
                  }
                  className={`h-8 w-[2.65rem] rounded-[var(--radius-xs)] border bg-[var(--surface-1)] px-1 text-center text-[length:var(--text-label)] tabular-nums outline-none transition ${invalidTimeClass}`}
                />
                <span className="text-[length:var(--text-label)] text-[var(--ink-faint)]">s</span>
                <button
                  type="button"
                  aria-label={`Remove cue ${row.index + 1}`}
                  title="Remove cue"
                  onClick={() => director.onRemoveRow?.(row.id)}
                  className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-full)] text-[var(--ink-faint)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink-dim)]"
                >
                  <X size={12} aria-hidden="true" />
                </button>
              </div>
              <label htmlFor={fieldId} className="sr-only">
                Cue {row.index + 1} direction
              </label>
              <textarea
                ref={growTextarea}
                id={fieldId}
                name={fieldId}
                value={row.prompt || ""}
                onChange={(event) => {
                  growTextarea(event.target);
                  director.onChangeRowPrompt?.(row.id, event.target.value);
                }}
                placeholder="What happens in this stretch..."
                rows={1}
                className={FIELD_RECIPE}
              />
            </div>
            {row.errorText ? (
              <p
                role="alert"
                className="mt-[var(--space-1)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--status-danger)]"
              >
                {row.errorText}
              </p>
            ) : null}
          </div>
        );
      })}
      <div className="flex justify-end">
        <button
          type="button"
          aria-label="Add director cue"
          title={director?.canAddRow ? "Add director cue" : director?.addLimitLabel || undefined}
          disabled={!director?.canAddRow}
          onClick={() => director?.onAddRow?.()}
          className="flex h-[var(--control-md)] w-[var(--control-md)] items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-dim)] transition-colors hover:border-[var(--line)] hover:text-[var(--gold-ornament)] disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)] disabled:hover:border-[var(--line-whisper)] disabled:hover:text-[var(--ink-dim)]"
        >
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

// The Video mode body (session 5, note 7): Text to video keeps the
// five asset tiles, Image to video takes one Image tile; then the
// custom prompt (optional on Text, required on Image), the Custom
// director, and Video settings (Aspect ratio, Duration, Quality). The
// footer is shared and carries Video's own count, cost, gate, and the
// Soon treatment while the Chassis has no video job.
function VideoStage({ video, idPrefix }) {
  const isImageStage = video.stage === "IMAGE";
  const sourceState = { ...EMPTY_SLOT_STATE, selection: video.sourceImage || null };
  const aspect = video.aspectRatio || { value: "", options: [] };
  const directorOpen = Boolean(video.director?.open);
  const promptId = `${idPrefix}-video-prompt`;

  return (
    <>
      <StageTabs
        stage={video.stage}
        onChangeStage={video.onChangeStage}
        tabs={VIDEO_STAGE_TABS}
        ariaLabel="Video mode"
      />

      <div className="grid grid-cols-2 gap-[var(--space-3)]">
        {isImageStage ? (
          <SlotTile
            def={VIDEO_SOURCE_DEF}
            state={sourceState}
            onActivate={() => video.onSelectSourceImage?.()}
            onClear={() => video.onClearSourceImage?.()}
          />
        ) : (
          SLOT_DEFS.map((def) => (
            <SlotTile
              key={def.id}
              def={def}
              state={video.slots?.[def.id] || EMPTY_SLOT_STATE}
              onActivate={video.onSlotActivate}
              onClear={video.onSlotClear}
            />
          ))
        )}
      </div>

      <div className="flex flex-col gap-[var(--space-3)]">
        <label htmlFor={promptId} className="block">
          <SectionTitle note={isImageStage ? "(required)" : "(optional)"}>Custom prompt</SectionTitle>
          <textarea
            ref={growTextarea}
            name={promptId}
            id={promptId}
            value={video.promptValue || ""}
            onChange={(event) => {
              growTextarea(event.target);
              video.onChangePrompt?.(event.target.value);
            }}
            placeholder="Describe the motion, scene beat, or moment..."
            rows={1}
            className={FIELD_RECIPE}
          />
        </label>

        <div className="flex">
          <button
            type="button"
            aria-expanded={directorOpen}
            onClick={() => video.director?.onToggle?.()}
            className="cf-btn cf-btn--secondary cf-btn--sm"
          >
            <Clapperboard size={14} aria-hidden="true" />
            Custom director
          </button>
        </div>

        {directorOpen ? <DirectorRows director={video.director} idPrefix={idPrefix} /> : null}
      </div>

      <section className="flex min-w-0 flex-col gap-[var(--space-5)]">
        <SectionTitle>Video settings</SectionTitle>
        <SettingSelect
          fieldId="video-aspect-ratio"
          title="Aspect ratio"
          valueLabel={
            aspect.options?.find((option) => option.value === aspect.value)?.label || aspect.value
          }
          isChanged={aspect.defaultValue !== undefined && aspect.value !== aspect.defaultValue}
          options={aspect.options}
          value={aspect.value}
          onChange={(value) => video.onChangeAspectRatio?.(value)}
          idPrefix={idPrefix}
        />
        <DurationSlider video={video} idPrefix={idPrefix} />
        <QualityToggle quality={video.quality} onChange={video.onChangeQuality} />
      </section>
    </>
  );
}

function VideoBlock({
  videoOptionFields,
  onChangeVideoOption,
  videoDirectionValue,
  onChangeVideoDirection,
  idPrefix,
}) {
  return (
    <div className="flex flex-col gap-[var(--space-5)]">
      <div className="flex flex-wrap gap-[var(--space-2)]">
        {videoOptionFields.map((field) => (
          <KitDropdownView
            key={field.id}
            label={field.label}
            ariaLabel={field.label}
            options={field.options}
            selectedValues={field.value ? [field.value] : []}
            isMultiSelect={false}
            onToggleOption={(value) => onChangeVideoOption?.(field.id, value)}
          />
        ))}
      </div>

      <label className="block">
        <SectionTitle>Video direction</SectionTitle>
        <textarea
          ref={growTextarea}
          name={`${idPrefix}-video-direction`}
          id={`${idPrefix}-video-direction`}
          value={videoDirectionValue}
          onChange={(event) => {
            growTextarea(event.target);
            onChangeVideoDirection?.(event.target.value);
          }}
          placeholder="Describe the short motion, scene beat, or recap moment..."
          rows={1}
          className={FIELD_RECIPE}
        />
      </label>
    </div>
  );
}

export default function KitImageCreatorPanelView({
  mode = "IMAGE",
  onChangeMode = null,
  videoDisabled = true,
  videoSoonLabel = "Soon",
  stage = "GENERATE",
  onChangeStage = null,
  remix = null,
  video = null,
  slots = {},
  onSlotActivate = null,
  onSlotClear = null,
  onCustomChangeText = null,
  onCustomBackToPresets = null,
  onCustomSavePreset = null,
  promptValue = "",
  onChangePrompt = null,
  negativePromptValue = "",
  onChangeNegativePrompt = null,
  renderStyleRailProps = null,
  optionFields = [],
  onChangeOption = null,
  advancedTuningProps = null,
  countOptions = [],
  countValue = "",
  onChangeCount = null,
  generateCostLabel = "",
  canGenerate = false,
  generationHelpText = "",
  generationStatus = "idle",
  generationError = "",
  cameraPresetLabel = "Auto / No Camera Filter",
  cameraPresetDescription = "",
  cameraPresetChanged = false,
  onOpenCameraPresetPicker = null,
  showSceneryOnlyHelper = false,
  sceneryOnlyHelperEnabled = true,
  onChangeSceneryOnlyHelper = null,
  onGenerate = null,
  videoOptionFields = [],
  onChangeVideoOption = null,
  videoDirectionValue = "",
  onChangeVideoDirection = null,
}) {
  const isVideoMode = mode === "VIDEO";
  const isRemixStage = stage === "REMIX";
  // The live Remix stage (session 4) shares the footer with Generate:
  // same count control, the Remix cost label, its own gate, and the
  // Soon chip while the Chassis cannot run the job.
  const remixActive = isRemixStage && !isVideoMode && Boolean(remix);
  // The live Video mode (session 5) shares the footer the same way:
  // its own count, its cost label, its gate, and the Soon chip while
  // the Chassis has no video job. A null `video` keeps the 2.2.0 block.
  const videoActive = isVideoMode && Boolean(video);
  // Unique per mounted instance: the Media Studio page composes the
  // rail (desktop, CSS-hidden below 1100px) and the mobile sheet
  // simultaneously, so static ids would collide in the DOM.
  const idPrefix = useId();

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-[var(--space-5)] pb-[var(--space-6)] pt-[var(--space-5)]">
        <div className="flex min-w-0 flex-col gap-[var(--space-5)]">
          <ModeToggle
            mode={mode}
            onChangeMode={onChangeMode}
            videoDisabled={videoDisabled}
            videoSoon={Boolean(video) && !video.available}
            videoSoonLabel={videoSoonLabel}
          />

          {!isVideoMode ? <StageTabs stage={stage} onChangeStage={onChangeStage} /> : null}

          {videoActive ? (
            <VideoStage video={video} idPrefix={idPrefix} />
          ) : isRemixStage && !isVideoMode ? (
            <RemixStage remix={remix} idPrefix={idPrefix} />
          ) : (
            <div className="grid grid-cols-2 gap-[var(--space-3)]">
              {SLOT_DEFS.map((def) => {
                const state = slots?.[def.id] || EMPTY_SLOT_STATE;
                return state.isCustomMode ? (
                  <CustomSlotEditor
                    key={def.id}
                    def={def}
                    state={state}
                    onChangeText={onCustomChangeText}
                    onBackToPresets={onCustomBackToPresets}
                    onSavePreset={onCustomSavePreset}
                    onClear={onSlotClear}
                    idPrefix={idPrefix}
                  />
                ) : (
                  <SlotTile
                    key={def.id}
                    def={def}
                    state={state}
                    onActivate={onSlotActivate}
                    onClear={onSlotClear}
                  />
                );
              })}
            </div>
          )}

          {videoActive ? null : isVideoMode ? (
            <VideoBlock
              videoOptionFields={videoOptionFields}
              onChangeVideoOption={onChangeVideoOption}
              videoDirectionValue={videoDirectionValue}
              onChangeVideoDirection={onChangeVideoDirection}
              idPrefix={idPrefix}
            />
          ) : isRemixStage ? null : (
            <>
              <label className="block">
                <SectionTitle note="(optional)">Custom prompt</SectionTitle>
                <textarea
                  ref={growTextarea}
                  name={`${idPrefix}-prompt`}
                  id={`${idPrefix}-prompt`}
                  value={promptValue}
                  onChange={(event) => {
                    growTextarea(event.target);
                    onChangePrompt?.(event.target.value);
                  }}
                  placeholder="Enter a custom prompt..."
                  rows={1}
                  className={FIELD_RECIPE}
                />
              </label>

              <ImageSettings
                renderStyleRailProps={renderStyleRailProps}
                optionFields={optionFields}
                onChangeOption={onChangeOption}
                advancedTuningProps={advancedTuningProps}
                negativePromptValue={negativePromptValue}
                onChangeNegativePrompt={onChangeNegativePrompt}
                cameraPresetLabel={cameraPresetLabel}
                cameraPresetDescription={cameraPresetDescription}
                cameraPresetChanged={cameraPresetChanged}
                onOpenCameraPresetPicker={onOpenCameraPresetPicker}
                showSceneryOnlyHelper={showSceneryOnlyHelper}
                sceneryOnlyHelperEnabled={sceneryOnlyHelperEnabled}
                onChangeSceneryOnlyHelper={onChangeSceneryOnlyHelper}
                idPrefix={idPrefix}
              />
            </>
          )}

          {generationError ? (
            <p role="alert" className="rounded-[var(--radius-md)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--status-danger)]">
              {generationError}
            </p>
          ) : null}
        </div>
      </div>

      <GenerateFooter
        // Remix carries its own count (2.2.0): its list starts at 1
        // image while Generate's starts at 2, so the two stages keep
        // separate values and floors (Brian's browser note, 10 Sep
        // 2026, round 2). A remix without a list falls back to the
        // shared control.
        // Video (2.3.0) carries its own count the same way; without
        // `video` the mode has no count control.
        countOptions={
          videoActive
            ? video.countOptions || []
            : isVideoMode
              ? []
              : remixActive && remix.countOptions
                ? remix.countOptions
                : countOptions
        }
        countValue={
          videoActive
            ? video.countValue || ""
            : remixActive && remix.countOptions
              ? remix.countValue || ""
              : countValue
        }
        onChangeCount={
          videoActive
            ? video.onChangeCount
            : remixActive && remix.countOptions
              ? remix.onChangeCount
              : onChangeCount
        }
        generateCostLabel={
          videoActive
            ? video.generateCostLabel
            : remixActive
              ? remix.generateCostLabel
              : generateCostLabel
        }
        canGenerate={
          videoActive
            ? Boolean(video.available && video.canGenerate)
            : isVideoMode
              ? false
              : remixActive
                ? Boolean(remix.available && remix.canGenerate)
                : isRemixStage
                  ? false
                  : canGenerate
        }
        generationHelpText={
          videoActive
            ? video.generationHelpText
            : remixActive
              ? remix.generationHelpText
              : generationHelpText
        }
        generationStatus={generationStatus}
        onGenerate={videoActive ? video.onGenerate : remixActive ? remix.onGenerate : onGenerate}
        disabledReason={
          (isVideoMode && !videoActive) || (!isVideoMode && isRemixStage && !remixActive)
            ? NOT_AVAILABLE_LABEL
            : ""
        }
        soon={(remixActive && !remix.available) || (videoActive && !video.available)}
        idPrefix={idPrefix}
      />
    </div>
  );
}
