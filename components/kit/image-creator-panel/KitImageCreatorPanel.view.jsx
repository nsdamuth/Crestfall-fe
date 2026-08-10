"use client";

// Fixture-driven mirror of the live image composer's function
// (docs/SPRINT-E-PLAN.md section 1.1, R6), never its code: the six
// ingredient slots below are fixed anatomy owned by this package,
// matching components/studio/image-studio/imageStudioData.js
// verbatim (READ ONLY reference, never imported). Tokens only; every
// control on kit or cf-* recipes; no fetch anywhere.
import { useState } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Library,
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
  { id: "character", label: "Character", icon: Users, requirement: "required", savable: false },
  { id: "playerCharacter", label: "Player Character", icon: User, requirement: "optional", savable: false },
  { id: "pose", label: "Pose", icon: Theater, requirement: "optional", savable: true },
  { id: "outfit", label: "Clothing Source", icon: Shirt, requirement: "optional", savable: true },
  { id: "location", label: "Location / Scene", icon: MapPin, requirement: "optional", savable: true },
  { id: "preset", label: "Rendering Preset", icon: Sparkles, requirement: "optional", savable: true },
];

const EMPTY_SLOT_STATE = { selection: null, isCustomMode: false, customText: "" };

const FIELD_RECIPE =
  "cf-field mt-[var(--space-2)] w-full resize-none rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-faint)]";

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
            className={`kit-focus flex min-h-[var(--control-md)] items-center justify-center rounded-[var(--radius-md)] border px-[var(--space-3)] text-[length:var(--text-ui)] uppercase tracking-[var(--track-label)] transition-colors ${
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

function ClearButton({ label, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      className="kit-focus flex h-[var(--control-sm)] w-[var(--control-sm)] flex-none items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] text-[var(--ink-faint)] transition-colors hover:text-[var(--ink)] [@media(pointer:coarse)]:h-[var(--control-md)] [@media(pointer:coarse)]:w-[var(--control-md)]"
    >
      <X size={14} aria-hidden="true" />
    </button>
  );
}

function SlotTile({ def, state, onActivate, onClear }) {
  const Icon = def.icon;
  const hasSelection = Boolean(state.selection);

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-3)]">
      <div className="flex items-center justify-between gap-[var(--space-2)]">
        <span className="inline-flex min-w-0 items-center gap-[var(--space-1)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
          <Icon size={13} aria-hidden="true" className="flex-none" />
          <span className="truncate">{def.label}</span>
        </span>
        {def.requirement === "required" && (
          <span className="flex-none text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
            Req.
          </span>
        )}
      </div>

      <div className="mt-[var(--space-2)] flex items-center gap-[var(--space-2)]">
        <button
          type="button"
          onClick={() => onActivate?.(def.id)}
          className="kit-focus min-h-[var(--control-md)] flex-1 truncate rounded-[var(--radius-sm)] border border-transparent px-[var(--space-1)] text-left text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition-colors hover:text-[var(--ink)]"
        >
          <span className={hasSelection ? "text-[var(--ink)]" : "text-[var(--ink-faint)]"}>
            {hasSelection ? state.selection.title : "Select..."}
          </span>
          {hasSelection && state.selection.subtitle && (
            <span className="block truncate text-[length:var(--text-label)] text-[var(--ink-faint)]">
              {state.selection.subtitle}
            </span>
          )}
        </button>
        {hasSelection && <ClearButton label={`Clear ${def.label}`} onClick={() => onClear?.(def.id)} />}
      </div>
    </div>
  );
}

function CustomSlotEditor({ def, state, onChangeText, onBackToPresets, onSavePreset, onClear }) {
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
          name={`custom-guidance-${def.id}`}
          id={`custom-guidance-${def.id}`}
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
          className="kit-focus cf-btn cf-btn--secondary cf-btn--sm"
        >
          <Library size={14} aria-hidden="true" />
          Back to presets
        </button>
        {def.savable && (
          <button
            type="button"
            onClick={() => onSavePreset?.(def.id)}
            className="kit-focus cf-btn cf-btn--secondary cf-btn--sm"
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

function OptionsExpander({
  isOpen,
  onToggle,
  optionFields,
  onChangeOption,
  negativePromptValue,
  onChangeNegativePrompt,
}) {
  return (
    <div>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="kit-focus flex min-h-[var(--control-md)] w-full items-center justify-between rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] text-left text-[length:var(--text-ui)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)] transition-colors hover:border-[var(--line)]"
      >
        Options
        {isOpen ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
      </button>

      {isOpen && (
        <div className="mt-[var(--space-3)] flex flex-col gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-4)]">
          <div className="flex flex-wrap gap-[var(--space-2)]">
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

          <label className="block">
            <FieldCaption>Negative Prompt</FieldCaption>
            <textarea
              name="image-creator-negative-prompt"
              id="image-creator-negative-prompt"
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
  onGenerate,
  optionFields,
  onChangeOption,
  negativePromptValue,
  onChangeNegativePrompt,
}) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-[var(--space-4)]">
      <label className="block">
        <FieldCaption>Prompt</FieldCaption>
        <textarea
          name="image-creator-prompt"
          id="image-creator-prompt"
          value={promptValue}
          onChange={(event) => onChangePrompt?.(event.target.value)}
          placeholder="Describe what you want to see..."
          rows={5}
          className={FIELD_RECIPE}
        />
      </label>

      <OptionsExpander
        isOpen={isOptionsOpen}
        onToggle={() => setIsOptionsOpen((current) => !current)}
        optionFields={optionFields}
        onChangeOption={onChangeOption}
        negativePromptValue={negativePromptValue}
        onChangeNegativePrompt={onChangeNegativePrompt}
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

      <button
        type="button"
        onClick={() => onGenerate?.()}
        disabled={!canGenerate}
        className="kit-focus cf-btn cf-btn--primary w-full"
      >
        <Wand2 size={15} aria-hidden="true" />
        Generate image
      </button>

      {generationHelpText && (
        <p className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--fill-whisper)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
          {generationHelpText}
        </p>
      )}
    </div>
  );
}

function VideoBlock({
  videoOptionFields,
  onChangeVideoOption,
  videoDirectionValue,
  onChangeVideoDirection,
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
          name="image-creator-video-direction"
          id="image-creator-video-direction"
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
  optionFields = [],
  onChangeOption = null,
  coinBalanceLabel = "0",
  coinCostLabel = "5",
  showInsufficientCoins = false,
  canGenerate = false,
  generationHelpText = "",
  onGenerate = null,
  videoOptionFields = [],
  onChangeVideoOption = null,
  videoDirectionValue = "",
  onChangeVideoDirection = null,
}) {
  const isVideoMode = mode === "VIDEO";

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
          onGenerate={onGenerate}
          optionFields={optionFields}
          onChangeOption={onChangeOption}
          negativePromptValue={negativePromptValue}
          onChangeNegativePrompt={onChangeNegativePrompt}
        />
      )}
    </div>
  );
}
