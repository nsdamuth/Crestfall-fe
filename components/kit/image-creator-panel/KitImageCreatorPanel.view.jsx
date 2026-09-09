"use client";

// Media Studio composer, rebuilt 9 Sep 2026 (FE/MEDIA-STUDIO, Brian's
// note 1 and note 2, docs/references/media-studio/NOTES.md). Five
// asset tiles are fixed anatomy owned by this package, mirroring
// components/studio/image-studio/imageStudioData.js minus its second
// character slot (Character covers it, ruled 9 Sep 2026). Tokens only; every
// control on kit or cf-* recipes; no fetch anywhere. Contract 2.0.0.
import { useId, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Coins,
  Image as ImageIcon,
  Library,
  Loader2,
  MapPin,
  Save,
  Shirt,
  Sparkles,
  Theater,
  Users,
  Video,
  X,
} from "lucide-react";

import KitDropdownView from "../dropdown/KitDropdown.view";

const SLOT_DEFS = [
  { id: "character", label: "Character", icon: Users, requirement: "required", savable: false, spanRow: true },
  { id: "pose", label: "Pose", icon: Theater, requirement: "optional", savable: true, spanRow: false },
  { id: "outfit", label: "Outfit", icon: Shirt, requirement: "optional", savable: true, spanRow: false },
  { id: "location", label: "Location", icon: MapPin, requirement: "optional", savable: true, spanRow: false },
  { id: "preset", label: "Preset", icon: Sparkles, requirement: "optional", savable: true, spanRow: false },
];

const EMPTY_SLOT_STATE = { selection: null, isCustomMode: false, customText: "" };

const NOT_AVAILABLE_LABEL = "Not available yet";
const RENDER_STYLE_CONTEXT_LINE = "Fantasy on the left, realistic on the right.";
const TEXTAREA_MAX_HEIGHT_PX = 320;

const FIELD_RECIPE =
  "mt-[var(--space-2)] w-full resize-none overflow-hidden rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-faint)]";

// One row until content needs more, then it grows with the text
// (the chat composer pattern). A callback ref runs on every commit,
// so a fixture that mounts with long content sizes correctly too;
// no effect, no fetch, presentation only.
function growTextarea(element) {
  if (!element) return;
  element.style.height = "auto";
  element.style.height = `${Math.min(element.scrollHeight, TEXTAREA_MAX_HEIGHT_PX)}px`;
}

function FieldCaption({ children, note = "" }) {
  return (
    <span className="inline-flex items-baseline gap-[var(--space-2)]">
      <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
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

// Outlined track around both options, the active option filled inside
// it. Crestfall rounded square (radius-md), not a pill: ruled at the
// 9 Sep 2026 plan gate, no law change.
function ModeToggle({ mode, onChangeMode, videoDisabled, videoSoonLabel }) {
  const options = [
    { id: "IMAGE", label: "Image", icon: ImageIcon, disabled: false },
    { id: "VIDEO", label: "Video", icon: Video, disabled: videoDisabled },
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
            className={`flex min-h-[var(--control-md)] items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition-colors ${
              isActive
                ? "bg-[var(--fill)] text-[var(--gold-bright)]"
                : option.disabled
                  ? "cursor-not-allowed text-[var(--ink-dim)] opacity-[var(--state-disabled-opacity)]"
                  : "text-[var(--ink-dim)] hover:bg-[var(--state-hover-fill)] hover:text-[var(--ink)]"
            }`}
          >
            <Icon size={16} aria-hidden="true" />
            <span>{option.label}</span>
            {option.disabled && videoSoonLabel ? (
              <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
                {videoSoonLabel}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function StageTabs({ stage, onChangeStage }) {
  const tabs = [
    { id: "GENERATE", label: "Generate" },
    { id: "REMIX", label: "Remix" },
  ];

  return (
    <div role="tablist" aria-label="Stage" className="grid grid-cols-2 gap-[var(--space-2)]">
      {tabs.map((tab) => {
        const isActive = stage === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChangeStage?.(tab.id)}
            className={`flex min-h-[var(--control-md)] items-center justify-center rounded-[var(--radius-md)] border px-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition-colors ${
              isActive
                ? "border-[var(--line)] bg-[var(--fill-whisper)] text-[var(--gold-bright)]"
                : "border-[var(--line-whisper)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
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
        overlay
          ? "border-white/25 bg-black/75 text-white shadow-md backdrop-blur-sm hover:bg-black/90 hover:text-white"
          : "border-[var(--line-whisper)] text-[var(--ink-faint)] hover:text-[var(--ink)]"
      }`}
    >
      <X size={14} aria-hidden="true" />
    </button>
  );
}

// Empty: icon centered, title centered at the bottom with required or
// optional under it, no eyebrow chip. Selected: the image fills the
// tile and its name sits centered at the bottom. The required
// Character tile carries a quiet gold glow.
function SlotTile({ def, state, onActivate, onClear }) {
  const Icon = def.icon;
  const hasSelection = Boolean(state.selection);
  const imageSrc = String(state.selection?.imageSrc || "").trim();
  const isRequired = def.requirement === "required";
  const title = hasSelection ? state.selection.title : def.label;

  return (
    <div
      className={`group relative overflow-hidden rounded-[var(--radius-md)] border bg-[var(--surface-2)] transition-colors ${
        def.spanRow ? "col-span-2 aspect-[2/1]" : "aspect-[5/4]"
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
              className="absolute inset-0 flex items-center justify-center pb-[var(--space-8)]"
              aria-hidden="true"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-faint)] transition-colors group-hover:text-[var(--gold-ornament)]">
                <Icon size={20} />
              </span>
            </span>
          </>
        )}

        <span className="absolute inset-x-[var(--space-3)] bottom-[var(--space-3)] min-w-0 text-center">
          <span
            className={`block truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] ${
              imageSrc ? "text-[var(--art-ink)]" : "text-[var(--ink)]"
            }`}
          >
            {title}
          </span>
          {!hasSelection ? (
            <span className="block text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
              {def.requirement}
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
    <div className="col-span-2 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--fill-whisper)] p-[var(--space-4)]">
      <div className="flex items-start justify-between gap-[var(--space-3)]">
        <span className="inline-flex items-center gap-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          <BookOpen size={14} aria-hidden="true" />
          Custom {def.label}
        </span>
        <ClearButton label={`Clear custom ${def.label}`} onClick={() => onClear?.(def.id)} />
      </div>

      <label className="mt-[var(--space-3)] block">
        <FieldCaption>Custom guidance</FieldCaption>
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
// or tap tooltip with its definition (the InfoTip recipe, inline; the
// shared tooltip component is CR-047, still open). Tap selects the
// step and shows its tooltip; blur or Escape hides it.
function RenderStyleRail({ rail, idPrefix }) {
  const [openIndex, setOpenIndex] = useState(-1);
  if (!rail?.options?.length) return null;

  const activeIndex = Math.max(
    0,
    rail.options.findIndex((option) => option.active || option.value === rail.value)
  );
  const maxIndex = Math.max(rail.options.length - 1, 0);

  function selectIndex(nextIndex) {
    const boundedIndex = Math.min(Math.max(Number(nextIndex) || 0, 0), maxIndex);
    const option = rail.options[boundedIndex];
    if (option) rail.onChange?.(option.value);
  }

  return (
    <section>
      <div className="flex items-baseline justify-between gap-[var(--space-3)]">
        <FieldCaption>Render style</FieldCaption>
        <span className="text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
          {RENDER_STYLE_CONTEXT_LINE}
        </span>
      </div>

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
            <span key={option.value} className="group/step relative block">
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
                className={`relative h-16 w-full min-w-0 text-[length:var(--text-label)] transition-colors ${
                  isActive
                    ? "text-[var(--gold-bright)]"
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
                  className={`pointer-events-none absolute bottom-full z-10 mb-[var(--space-1)] w-52 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-4)] px-[var(--space-2)] py-[var(--space-1)] text-left text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink)] shadow-[var(--shadow-modal)] transition-opacity duration-150 group-hover/step:opacity-100 ${
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

function AdvancedTuning({ tuning, idPrefix }) {
  const [isOpen, setIsOpen] = useState(false);
  if (!tuning?.enabled) return null;

  return (
    <section className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-[var(--fill-whisper)]">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="flex min-h-[var(--control-md)] w-full items-center justify-between gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-2)] text-left"
      >
        <span>
          <span className="block text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">Advanced</span>
          <span className="mt-[var(--space-1)] block text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">Curated workflow controls</span>
        </span>
        {isOpen ? <ChevronUp size={15} aria-hidden="true" /> : <ChevronDown size={15} aria-hidden="true" />}
      </button>

      {isOpen ? (
        <div className="border-t border-[var(--line-whisper)] px-[var(--space-4)] pb-[var(--space-4)] pt-[var(--space-4)]">
          <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
            {tuning.description}
          </p>
          <p className="mt-[var(--space-2)] rounded-[var(--radius-sm)] border border-[var(--gold-ornament)]/15 bg-[var(--gold-ornament)]/5 px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
            {tuning.safetyNote}
          </p>

          <div className="mt-[var(--space-4)] grid gap-[var(--space-5)]">
            {(tuning.controls || []).map((control) => (
              <label key={control.id} htmlFor={`${idPrefix}-advanced-${control.id}`} className="block">
                <div className="flex items-start justify-between gap-[var(--space-3)]">
                  <span className="min-w-0">
                    <span className="block text-[length:var(--text-ui)] text-[var(--ink)]">{control.label}</span>
                    <span className="mt-[var(--space-1)] block text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">{control.description}</span>
                  </span>
                  <span className="shrink-0 rounded-full border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-2)] py-1 text-[length:var(--text-label)] tabular-nums text-[var(--gold-ornament)]">
                    {control.valueLabel}
                  </span>
                </div>
                <input
                  id={`${idPrefix}-advanced-${control.id}`}
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={control.value}
                  onChange={(event) => control.onChange?.(Number(event.target.value))}
                  className="mt-[var(--space-3)] w-full cursor-pointer accent-[var(--gold-action)]"
                />
                <div className="mt-[var(--space-1)] flex justify-between gap-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[0.1em] text-[var(--ink-faint)]">
                  <span>{control.leftLabel}</span>
                  <span>Default {control.defaultValue}%</span>
                  <span className="text-right">{control.rightLabel}</span>
                </div>
              </label>
            ))}
          </div>

          {tuning.handoff ? (
            <div className="mt-[var(--space-4)] rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/5 p-[var(--space-3)]">
              <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">{tuning.handoff.message}</p>
              <button
                type="button"
                onClick={() => tuning.handoff.onSwitch?.()}
                className="mt-[var(--space-2)] text-[length:var(--text-label)] font-medium text-[var(--gold-ornament)] underline decoration-[var(--gold-ornament)]/35 underline-offset-4"
              >
                Switch to {tuning.handoff.targetProfileLabel}
              </button>
            </div>
          ) : null}

          <div className="mt-[var(--space-4)] flex items-center justify-between gap-[var(--space-3)] border-t border-[var(--line-whisper)] pt-[var(--space-3)]">
            <span className="text-[length:var(--text-label)] text-[var(--ink-dim)]">
              {tuning.modified ? "Custom tuning applies to this generation." : "Using validated workflow defaults."}
            </span>
            <button
              type="button"
              onClick={() => tuning.onReset?.()}
              disabled={!tuning.modified}
              className="shrink-0 text-[length:var(--text-label)] text-[var(--gold-ornament)] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Reset defaults
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function CameraPresetTrigger({
  selectedLabel = "Auto / No Camera Filter",
  description = "",
  onOpen = null,
}) {
  const isDisabled = typeof onOpen !== "function";

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-haspopup="dialog"
      aria-label={`Camera / Framing: ${selectedLabel}`}
      title={description || undefined}
      onClick={() => onOpen?.()}
      className={`inline-flex min-h-[var(--control-filter)] max-w-full items-center gap-[var(--space-1)] rounded-[var(--radius-md)] border px-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition-colors duration-[var(--dur-hover)] [@media(pointer:coarse)]:min-h-[var(--control-md)] ${
        isDisabled
          ? "cursor-not-allowed border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-faint)] opacity-[var(--state-disabled-opacity)]"
          : "border-[var(--line-whisper)] bg-[var(--fill)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)] active:bg-[var(--state-pressed-fill)]"
      }`}
    >
      <span className="truncate">Camera / Framing</span>
      <span className="truncate text-[var(--gold-bright)]">{selectedLabel}</span>
      <ChevronDown size={14} className="flex-none text-[var(--gold-ornament)]" aria-hidden="true" />
    </button>
  );
}

// Inline options (note 2): no Options dropdown. Render style, Camera /
// Framing, Wardrobe theme, Aspect ratio show inline; Advanced stays a
// disclosure; Negative prompt stays. Output count lives beside the
// Generate button.
function InlineOptions({
  renderStyleRailProps,
  optionFields,
  onChangeOption,
  advancedTuningProps,
  negativePromptValue,
  onChangeNegativePrompt,
  cameraPresetLabel,
  cameraPresetDescription,
  onOpenCameraPresetPicker,
  showSceneryOnlyHelper,
  sceneryOnlyHelperEnabled,
  onChangeSceneryOnlyHelper,
  idPrefix,
}) {
  return (
    <div className="flex flex-col gap-[var(--space-4)]">
      <RenderStyleRail rail={renderStyleRailProps} idPrefix={idPrefix} />

      <div className="flex flex-wrap gap-[var(--space-2)]">
        <CameraPresetTrigger
          selectedLabel={cameraPresetLabel}
          description={cameraPresetDescription}
          onOpen={onOpenCameraPresetPicker}
        />
        {optionFields.map((field) => (
          <KitDropdownView
            key={field.id}
            label={field.label}
            ariaLabel={field.label}
            options={field.options}
            selectedValues={field.value ? [field.value] : []}
            isMultiSelect={false}
            onToggleOption={(value) => onChangeOption?.(field.id, value)}
          />
        ))}
      </div>

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
        <FieldCaption>Negative prompt</FieldCaption>
        <textarea
          ref={growTextarea}
          name={`${idPrefix}-negative-prompt`}
          id={`${idPrefix}-negative-prompt`}
          value={negativePromptValue}
          onChange={(event) => {
            growTextarea(event.target);
            onChangeNegativePrompt?.(event.target.value);
          }}
          placeholder="Optional: describe what to avoid..."
          rows={1}
          className={FIELD_RECIPE}
        />
      </label>
    </div>
  );
}

// Sticky footer: the count dropdown beside one Generate button that
// reads "Generate", a coin glyph, and the cost. Block reasons are a
// tooltip on the disabled button, never a helper paragraph.
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
  idPrefix,
}) {
  const isLoading = generationStatus === "loading";
  const isDisabled = !canGenerate;
  const reason = disabledReason || (isDisabled ? generationHelpText : "");
  const reasonId = `${idPrefix}-generate-reason`;

  return (
    <div className="sticky bottom-0 z-10 -mx-[var(--space-4)] -mb-[var(--space-4)] mt-auto border-t border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-4)] py-[var(--space-3)]">
      <div className="flex items-stretch gap-[var(--space-2)]">
        {countOptions?.length ? (
          <KitDropdownView
            label="Count"
            ariaLabel="Output count"
            options={countOptions}
            selectedValues={countValue ? [countValue] : []}
            isMultiSelect={false}
            onToggleOption={(value) => onChangeCount?.(value)}
          />
        ) : null}
        <button
          type="button"
          onClick={() => onGenerate?.()}
          disabled={isDisabled}
          title={reason || undefined}
          aria-describedby={reason ? reasonId : undefined}
          className="cf-btn cf-btn--primary min-h-[var(--control-md)] flex-1 disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)]"
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
        </button>
      </div>
      {reason ? (
        <span id={reasonId} className="sr-only">
          {reason}
        </span>
      ) : null}
    </div>
  );
}

function RemixStage() {
  return (
    <div className="flex min-h-[8rem] items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--line-whisper)] bg-[var(--fill-whisper)] px-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
      {NOT_AVAILABLE_LABEL}
    </div>
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
    <div className="flex flex-col gap-[var(--space-4)]">
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
        <FieldCaption>Video direction</FieldCaption>
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
  // Unique per mounted instance: the Media Studio page composes the
  // rail (desktop, CSS-hidden below 1100px) and the mobile modal
  // simultaneously, so static ids would collide in the DOM.
  const idPrefix = useId();

  return (
    <div className="flex min-h-full flex-col gap-[var(--space-4)]">
      <ModeToggle
        mode={mode}
        onChangeMode={onChangeMode}
        videoDisabled={videoDisabled}
        videoSoonLabel={videoSoonLabel}
      />

      {!isVideoMode ? <StageTabs stage={stage} onChangeStage={onChangeStage} /> : null}

      {isRemixStage && !isVideoMode ? (
        <RemixStage />
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

      {isVideoMode ? (
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
            <FieldCaption note="(optional)">Custom prompt</FieldCaption>
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

          <InlineOptions
            renderStyleRailProps={renderStyleRailProps}
            optionFields={optionFields}
            onChangeOption={onChangeOption}
            advancedTuningProps={advancedTuningProps}
            negativePromptValue={negativePromptValue}
            onChangeNegativePrompt={onChangeNegativePrompt}
            cameraPresetLabel={cameraPresetLabel}
            cameraPresetDescription={cameraPresetDescription}
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

      <GenerateFooter
        countOptions={isVideoMode ? [] : countOptions}
        countValue={countValue}
        onChangeCount={onChangeCount}
        generateCostLabel={generateCostLabel}
        canGenerate={isVideoMode || isRemixStage ? false : canGenerate}
        generationHelpText={generationHelpText}
        generationStatus={generationStatus}
        onGenerate={onGenerate}
        disabledReason={isVideoMode || isRemixStage ? NOT_AVAILABLE_LABEL : ""}
        idPrefix={idPrefix}
      />
    </div>
  );
}
