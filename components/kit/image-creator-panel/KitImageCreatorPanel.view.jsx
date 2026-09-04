"use client";

// Fixture-driven mirror of the live image composer's function
// (docs/SPRINT-E-PLAN.md section 1.1, R6), never its code: the six
// ingredient slots below are fixed anatomy owned by this package,
// matching components/studio/image-studio/imageStudioData.js
// verbatim (READ ONLY reference, never imported). Tokens only; every
// control on kit or cf-* recipes; no fetch anywhere.
import { useId, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Library,
  Loader2,
  MapPin,
  Save,
  Shirt,
  Sparkles,
  Theater,
  User,
  Users,
  Wand2,
  X,
} from "lucide-react";

import KitDropdownView from "../dropdown/KitDropdown.view";

const SLOT_DEFS = [
  { id: "character", label: "Character", compactLabel: "Character", icon: Users, requirement: "required", savable: false },
  { id: "playerCharacter", label: "Player Character", compactLabel: "Player", icon: User, requirement: "optional", savable: false },
  { id: "pose", label: "Pose", compactLabel: "Pose", icon: Theater, requirement: "optional", savable: true },
  { id: "outfit", label: "Clothing Source", compactLabel: "Outfit", icon: Shirt, requirement: "optional", savable: true },
  { id: "location", label: "Location / Scene", compactLabel: "Location", icon: MapPin, requirement: "optional", savable: true },
  { id: "preset", label: "Rendering Preset", compactLabel: "Preset", icon: Sparkles, requirement: "optional", savable: true },
];

const EMPTY_SLOT_STATE = { selection: null, isCustomMode: false, customText: "" };

const FIELD_RECIPE =
  "mt-[var(--space-2)] w-full resize-none rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-faint)]";

function FieldCaption({ children }) {
  return (
    <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
      {children}
    </span>
  );
}

function ModeToggle({ mode, onChangeMode }) {
  return (
    <div className="grid grid-cols-2 gap-[var(--space-2)]" role="group" aria-label="Creator mode">
      {[
        { id: "IMAGE", label: "Image" },
        { id: "VIDEO", label: "Video" },
      ].map((option) => {
        const isActive = mode === option.id;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChangeMode?.(option.id)}
            className={`flex min-h-[var(--control-md)] items-center justify-center rounded-[var(--radius-md)] border px-[var(--space-3)] text-[length:var(--text-ui)] uppercase tracking-[var(--track-label)] transition-colors ${
              isActive
                ? "border-[var(--line-whisper)] bg-[var(--fill)] text-[var(--gold-bright)]"
                : "border-[var(--line-whisper)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
            }`}
          >
            {option.label}
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

function SlotTile({ def, state, onActivate, onClear }) {
  const Icon = def.icon;
  const hasSelection = Boolean(state.selection);
  const imageSrc = String(state.selection?.imageSrc || "").trim();
  const title = hasSelection ? state.selection.title : "Select...";
  const overlayTextClass = imageSrc ? "text-white/90" : "text-[var(--ink-faint)]";

  return (
    <div
      className={`group relative aspect-[5/4] overflow-hidden rounded-[var(--radius-md)] border bg-[var(--surface-2)] transition-colors ${
        hasSelection
          ? "border-[var(--line)]"
          : "border-[var(--line-whisper)] hover:border-[var(--line)]"
      }`}
    >
      <button
        type="button"
        onClick={() => onActivate?.(def.id)}
        aria-label={`${hasSelection ? "Change" : "Select"} ${def.label}${hasSelection ? `: ${state.selection.title}` : ""}`}
        className="absolute inset-0 w-full text-left"
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
              className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent"
              aria-hidden="true"
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
            <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <span className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-faint)] transition-colors group-hover:text-[var(--gold-ornament)]">
                <Icon size={20} />
              </span>
            </span>
          </>
        )}

        <span
          className={`absolute left-[var(--space-2)] top-[var(--space-2)] inline-flex items-center gap-[var(--space-1)] rounded-[var(--radius-full)] px-[var(--space-2)] py-1 text-[length:var(--text-label)] uppercase tracking-[0.12em] ${
            imageSrc ? "bg-black/55 backdrop-blur-sm" : "bg-[var(--surface-1)]"
          } ${overlayTextClass}`}
          title={def.label}
        >
          <Icon size={12} aria-hidden="true" className="flex-none" />
          <span className="whitespace-nowrap">{def.compactLabel}</span>
        </span>

        <span className="absolute bottom-[var(--space-3)] left-[var(--space-3)] right-[var(--space-3)] min-w-0">
          <span
            className={`block truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] ${
              imageSrc ? "text-white" : hasSelection ? "text-[var(--ink)]" : "text-[var(--ink-dim)]"
            }`}
          >
            {title}
          </span>
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
        <FieldCaption>Custom Guidance</FieldCaption>
        <textarea
          name={`${idPrefix}-custom-guidance-${def.id}`}
          id={`${idPrefix}-custom-guidance-${def.id}`}
          value={state.customText}
          onChange={(event) => onChangeText?.(def.id, event.target.value)}
          placeholder={`Describe the custom ${def.label.toLowerCase()} guidance...`}
          rows={4}
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
        <button type="button" disabled aria-pressed="true" className="cf-btn cf-btn--primary cf-btn--sm">
          <Check size={14} aria-hidden="true" />
          Use once
        </button>
      </div>
    </div>
  );
}

function RenderStyleRail({ rail, idPrefix }) {
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
    <section className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-[var(--fill-whisper)] p-[var(--space-4)]">
      <div className="flex items-start justify-between gap-[var(--space-3)]">
        <div className="min-w-0">
          <span className="block text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Render Style
          </span>
          <p className="mt-[var(--space-1)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
            Slide from fantasy-first workflows to realistic-first workflows.
          </p>
        </div>
        <span className="max-w-[55%] rounded-full border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-2)] py-1 text-right text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--gold-bright)]">
          {rail.activeLabel}
        </span>
      </div>

      <div className="mt-[var(--space-4)]">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-[var(--ink-dim)]">
          <span>Fantasy</span>
          <span>Realistic</span>
        </div>
        <input
          id={`${idPrefix}-render-style-rail`}
          type="range"
          min={0}
          max={maxIndex}
          step={1}
          value={activeIndex}
          aria-label="Render style workflow"
          aria-valuetext={rail.activeLabel}
          onChange={(event) => selectIndex(event.target.value)}
          className="mt-[var(--space-2)] w-full cursor-pointer accent-[var(--gold-action)]"
        />

        <div className="mt-[var(--space-2)] grid grid-cols-6 gap-1 pt-1">
          {rail.options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={index === activeIndex}
              onClick={() => selectIndex(index)}
              className={`relative h-16 min-w-0 text-[10px] transition-colors ${
                index === activeIndex
                  ? "text-[var(--gold-bright)]"
                  : "text-[var(--ink-faint)] hover:text-[var(--ink-dim)]"
              }`}
              title={option.mappedLabel}
            >
              <span
                className={`absolute left-1/2 top-1/2 whitespace-nowrap rounded-[var(--radius-sm)] px-1.5 py-1 leading-tight ${
                  index === activeIndex ? "bg-[var(--fill)]" : ""
                }`}
                style={{
                  transform: "translate(-50%, -50%) rotate(-42deg)",
                  transformOrigin: "center",
                }}
              >
                {option.shortLabel}
              </span>
            </button>
          ))}
        </div>
      </div>

      {rail.helperText ? (
        <p className="mt-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-faint)]">
          {rail.helperText}
        </p>
      ) : null}
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
        className="flex w-full items-center justify-between gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] text-left"
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
                <div className="mt-[var(--space-1)] flex justify-between gap-[var(--space-2)] text-[10px] uppercase tracking-[0.1em] text-[var(--ink-faint)]">
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
                Switch to {tuning.handoff.targetProfileLabel} →
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

function OptionsExpander({
  isOpen,
  onToggle,
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
    <div>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex min-h-[var(--control-md)] w-full items-center justify-between rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] text-left text-[length:var(--text-ui)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)] transition-colors hover:border-[var(--line)]"
      >
        Options
        {isOpen ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
      </button>

      {isOpen && (
        <div className="mt-[var(--space-3)] flex flex-col gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-4)]">
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
            <label className="flex cursor-pointer items-start gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--fill-whisper)] px-[var(--space-4)] py-[var(--space-3)]">
              <input
                type="checkbox"
                checked={sceneryOnlyHelperEnabled}
                onChange={(event) => onChangeSceneryOnlyHelper?.(event.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[var(--gold-bright)]"
              />
              <span>
                <span className="block text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">Optimize for scenery-only image</span>
                <span className="mt-[var(--space-1)] block text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">Adds bounded scenery guidance only when Location / Scene is the sole visual source.</span>
              </span>
            </label>
          ) : null}

          <label className="block">
            <FieldCaption>Negative Prompt</FieldCaption>
            <textarea
              name={`${idPrefix}-negative-prompt`}
              id={`${idPrefix}-negative-prompt`}
              value={negativePromptValue}
              onChange={(event) => onChangeNegativePrompt?.(event.target.value)}
              placeholder="Optional: describe what to avoid..."
              rows={3}
              className={FIELD_RECIPE}
            />
          </label>
        </div>
      )}
    </div>
  );
}

function GenerateBlock({
  promptValue,
  onChangePrompt,
  coinBalanceLabel,
  coinCostLabel,
  showInsufficientCoins,
  canGenerate,
  generationHelpText,
  generationStatus,
  generationError,
  cameraPresetLabel,
  cameraPresetDescription,
  onOpenCameraPresetPicker,
  showSceneryOnlyHelper,
  sceneryOnlyHelperEnabled,
  onChangeSceneryOnlyHelper,
  onGenerate,
  renderStyleRailProps,
  optionFields,
  onChangeOption,
  advancedTuningProps,
  negativePromptValue,
  onChangeNegativePrompt,
  idPrefix,
}) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-[var(--space-4)]">
      <label className="block">
        <FieldCaption>Prompt</FieldCaption>
        <textarea
          name={`${idPrefix}-prompt`}
          id={`${idPrefix}-prompt`}
          value={promptValue}
          onChange={(event) => onChangePrompt?.(event.target.value)}
          placeholder="Describe what you want to see..."
          rows={5}
          className={FIELD_RECIPE}
        />
      </label>

      <button
        type="button"
        onClick={() => onGenerate?.()}
        disabled={!canGenerate}
        className="cf-btn cf-btn--primary w-full"
      >
        {generationStatus === "loading" ? (
          <Loader2 size={15} className="animate-spin" aria-hidden="true" />
        ) : (
          <Wand2 size={15} aria-hidden="true" />
        )}
        {generationStatus === "loading" ? "Generate another image" : "Generate image"}
      </button>

      {generationError ? (
        <p role="alert" className="rounded-[var(--radius-md)] border border-[var(--status-danger)]/35 bg-[var(--status-danger)]/10 px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--status-danger)]">
          {generationError}
        </p>
      ) : null}

      {generationHelpText && (
        <p className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--fill-whisper)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
          {generationHelpText}
        </p>
      )}

      <OptionsExpander
        isOpen={isOptionsOpen}
        onToggle={() => setIsOptionsOpen((current) => !current)}
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

      <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-3)]">
        <div className="flex items-center justify-between gap-[var(--space-3)]">
          <FieldCaption>Coins</FieldCaption>
          <span className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)]">
            {coinBalanceLabel}
          </span>
        </div>
        <p className="mt-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
          Image generation costs {coinCostLabel} coins.
        </p>
        {showInsufficientCoins && (
          <p className="mt-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--status-danger)]">
            You need at least {coinCostLabel} coins to generate an image.
          </p>
        )}
      </div>
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
        <FieldCaption>Video Direction</FieldCaption>
        <textarea
          name={`${idPrefix}-video-direction`}
          id={`${idPrefix}-video-direction`}
          value={videoDirectionValue}
          onChange={(event) => onChangeVideoDirection?.(event.target.value)}
          placeholder="Describe the short motion, scene beat, or recap moment..."
          rows={5}
          className={FIELD_RECIPE}
        />
      </label>

      <button type="button" disabled className="cf-btn cf-btn--primary w-full">
        <Wand2 size={15} aria-hidden="true" />
        Generate video soon
      </button>
    </div>
  );
}

export default function KitImageCreatorPanelView({
  mode = "IMAGE",
  onChangeMode = null,
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
  coinBalanceLabel = "0",
  coinCostLabel = "5",
  showInsufficientCoins = false,
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
  // Unique per mounted instance: the Images page composes the rail
  // (desktop, CSS-hidden below 1100px) and the mobile modal
  // simultaneously, so static ids would collide in the DOM.
  const idPrefix = useId();

  return (
    <div className="flex flex-col gap-[var(--space-4)]">
      <ModeToggle mode={mode} onChangeMode={onChangeMode} />

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

      {isVideoMode ? (
        <VideoBlock
          videoOptionFields={videoOptionFields}
          onChangeVideoOption={onChangeVideoOption}
          videoDirectionValue={videoDirectionValue}
          onChangeVideoDirection={onChangeVideoDirection}
          idPrefix={idPrefix}
        />
      ) : (
        <GenerateBlock
          promptValue={promptValue}
          onChangePrompt={onChangePrompt}
          coinBalanceLabel={coinBalanceLabel}
          coinCostLabel={coinCostLabel}
          showInsufficientCoins={showInsufficientCoins}
          canGenerate={canGenerate}
          generationHelpText={generationHelpText}
          generationStatus={generationStatus}
          generationError={generationError}
          cameraPresetLabel={cameraPresetLabel}
          cameraPresetDescription={cameraPresetDescription}
          onOpenCameraPresetPicker={onOpenCameraPresetPicker}
          showSceneryOnlyHelper={showSceneryOnlyHelper}
          sceneryOnlyHelperEnabled={sceneryOnlyHelperEnabled}
          onChangeSceneryOnlyHelper={onChangeSceneryOnlyHelper}
          onGenerate={onGenerate}
          renderStyleRailProps={renderStyleRailProps}
          optionFields={optionFields}
          onChangeOption={onChangeOption}
          advancedTuningProps={advancedTuningProps}
          negativePromptValue={negativePromptValue}
          onChangeNegativePrompt={onChangeNegativePrompt}
          idPrefix={idPrefix}
        />
      )}
    </div>
  );
}
