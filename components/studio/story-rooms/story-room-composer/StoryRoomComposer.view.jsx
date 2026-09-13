"use client";

import { useEffect, useRef } from "react";
import {
  ArrowUp,
  BookOpen,
  Image as ImageIcon,
  MapPin,
  Sparkles,
  UserRound,
} from "lucide-react";

import KitDropdownView from "@/components/kit/dropdown/KitDropdown.view";
import { MENU_PANEL_RECIPE } from "@/components/kit/form-field/menuRecipe";

// The three menus above the field (commands, locations, mentions) share
// the composer menu recipe by construction (fe/chat-studio item 5):
// the kit panel, anchored above the field and capped so it stays inside
// the viewport at 390.
const COMPOSER_MENU_PANEL_CLASS = `${MENU_PANEL_RECIPE.replace(
  "max-h-[19rem]",
  "max-h-[40dvh]"
)} bottom-full left-0 right-0 mb-[var(--space-2)]`;

const COMPOSER_MENU_HEADING_CLASS =
  "flex items-center gap-[var(--space-2)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]";

function composerMenuRowClass(highlighted) {
  return `flex min-h-[var(--control-md)] w-full items-center gap-[var(--space-3)] rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-2)] text-left transition-colors duration-[var(--dur-hover)] ${
    highlighted
      ? "bg-[var(--state-hover-fill)] text-[var(--ink)]"
      : "text-[var(--ink-dim)] hover:bg-[var(--state-hover-fill)] hover:text-[var(--ink)]"
  }`;
}

const SPEAKER_ICONS = {
  auto: Sparkles,
  narrator: BookOpen,
  participant: UserRound,
};

const CIRCLE_BUTTON_CLASS =
  "flex h-[var(--control-md)] w-[var(--control-md)] shrink-0 touch-manipulation items-center justify-center rounded-[var(--radius-full)]";

// One composer bar at every width (fe/chat-studio item 2, 12 Sep 2026).
// Row one: a 44px circle per cast member (tap: that character speaks
// next, through the existing next-speaker handler), the Auto circle,
// then the input mode chip and the scene image seat at the right end.
// Row two: the growing message field and the gold send circle. The
// former speaker and mode eyebrow labels, the Random speaker, the two
// Soon scene buttons, the mobile tools drawer, and the old continue
// label are retired.
export default function StoryRoomComposerView({
  inputModeOptions = [],
  inputMode = "DIALOGUE",
  nextSpeakerOptions = [],
  nextSpeaker = "AUTO",
  draft = "",
  mentionSuggestions = [],
  highlightedMentionIndex = 0,
  commandSuggestions = [],
  highlightedCommandIndex = 0,
  highlightedCommandExact = false,
  locationSuggestions = [],
  highlightedLocationIndex = 0,
  placeholder = "Send a message",
  disabledReason = "",
  textareaDisabled = false,
  sendDisabled = true,
  isSending = false,
  submitIsContinuation = false,
  submitLabel = "Send",
  submitPendingLabel = "Sending",
  sceneImageState = "soon",
  sceneImageLabel = "Scene image, not available yet",
  onChangeInputMode,
  onChangeNextSpeaker,
  onChangeDraft,
  onUpdateSuggestionQueries,
  onMoveMentionHighlight,
  onSelectHighlightedMention,
  onSelectMention,
  onDismissMentionSuggestions,
  onMoveCommandHighlight,
  onSelectHighlightedCommand,
  onSelectCommand,
  onDismissCommandSuggestions,
  onMoveLocationHighlight,
  onSelectHighlightedLocation,
  onSelectLocation,
  onDismissLocationSuggestions,
  onSend,
}) {
  const textareaRef = useRef(null);

  useAutoResizeTextarea(textareaRef, draft, 220);

  const speakerOptions = Array.isArray(nextSpeakerOptions) ? nextSpeakerOptions : [];
  const autoOption = speakerOptions.find((option) => option?.id === "AUTO") || null;
  const castOptions = speakerOptions.filter((option) => option?.id && option.id !== "AUTO");

  const modeOptions = (Array.isArray(inputModeOptions) ? inputModeOptions : [])
    .map((option) => ({ value: option?.value, label: option?.label }))
    .filter((option) => option.value && option.label);
  const restingMode = modeOptions[0] || { value: "DIALOGUE", label: "Dialogue" };

  const sendTitle = isSending ? submitPendingLabel : submitLabel;

  return (
    <div className="relative z-50 shrink-0 bg-transparent">
      <div className="border-t border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-3)] pb-[calc(var(--space-2)+env(safe-area-inset-bottom))] pt-[var(--space-2)]">
        {disabledReason ? (
          <p className="mb-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {disabledReason}
          </p>
        ) : null}

        <div className="mb-[var(--space-2)] flex items-center gap-[var(--space-2)]">
          <div className="flex min-w-0 flex-1 items-center gap-[var(--space-2)] overflow-x-auto">
            {castOptions.map((option) => (
              <SpeakerCircle
                key={option.id}
                option={option}
                active={nextSpeaker === option.id}
                disabled={textareaDisabled}
                onChange={onChangeNextSpeaker}
              />
            ))}

            {autoOption ? (
              <SpeakerCircle
                option={autoOption}
                active={nextSpeaker === autoOption.id}
                disabled={textareaDisabled}
                onChange={onChangeNextSpeaker}
              />
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-[var(--space-2)]">
            <KitDropdownView
              label={restingMode.label}
              ariaLabel="Input mode"
              labelMode="replace"
              options={modeOptions}
              selectedValues={inputMode ? [inputMode] : []}
              isMultiSelect={false}
              restingValue={restingMode.value}
              align="right"
              isDisabled={textareaDisabled}
              onToggleOption={(nextValue) => onChangeInputMode?.(nextValue)}
            />

            {/* Scene image seat (decision A1): the Chassis serves no
                scene image operation yet (CR-070), so the seat is
                visible and honestly disabled. */}
            <button
              type="button"
              disabled={sceneImageState !== "ready"}
              aria-label={sceneImageLabel}
              title={sceneImageState === "ready" ? "Scene image" : "Not available yet"}
              className={`${CIRCLE_BUTTON_CLASS} bg-[var(--step-above)] text-[var(--ink-dim)] transition-colors duration-[var(--dur-hover)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)]`}
            >
              <ImageIcon size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex items-end gap-[var(--space-2)]">
          <ParticipantMentionTextarea
            textareaRef={textareaRef}
            wrapperClassName="min-w-0 flex-1"
            value={draft}
            mentionSuggestions={mentionSuggestions}
            highlightedMentionIndex={highlightedMentionIndex}
            commandSuggestions={commandSuggestions}
            highlightedCommandIndex={highlightedCommandIndex}
            highlightedCommandExact={highlightedCommandExact}
            locationSuggestions={locationSuggestions}
            highlightedLocationIndex={highlightedLocationIndex}
            disabled={textareaDisabled}
            placeholder={placeholder}
            rows={1}
            className="block max-h-[220px] min-h-[var(--control-md)] w-full resize-none overflow-y-auto rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--step-below)] px-[var(--space-3)] py-[var(--space-3)] text-[length:var(--text-input)] leading-[var(--lh-input)] text-[var(--ink)] shadow-[var(--shadow-bed)] transition-colors duration-[var(--dur-hover)] placeholder:text-[var(--ink-faint)] disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)]"
            onChangeDraft={onChangeDraft}
            onUpdateSuggestionQueries={onUpdateSuggestionQueries}
            onMoveMentionHighlight={onMoveMentionHighlight}
            onSelectHighlightedMention={onSelectHighlightedMention}
            onSelectMention={onSelectMention}
            onDismissMentionSuggestions={onDismissMentionSuggestions}
            onMoveCommandHighlight={onMoveCommandHighlight}
            onSelectHighlightedCommand={onSelectHighlightedCommand}
            onSelectCommand={onSelectCommand}
            onDismissCommandSuggestions={onDismissCommandSuggestions}
            onMoveLocationHighlight={onMoveLocationHighlight}
            onSelectHighlightedLocation={onSelectHighlightedLocation}
            onSelectLocation={onSelectLocation}
            onDismissLocationSuggestions={onDismissLocationSuggestions}
            onSend={onSend}
          />

          <button
            type="button"
            onClick={() => onSend?.()}
            disabled={sendDisabled}
            aria-label={sendTitle}
            title={sendTitle}
            className={`${CIRCLE_BUTTON_CLASS} bg-[var(--gold-action)] text-[var(--tag-fill-ink)] transition-colors duration-[var(--dur-hover)] hover:bg-[var(--gold-bright)] focus-visible:shadow-[var(--focus-ring-ongold)] active:bg-[var(--state-pressed-gold)] disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)]`}
          >
            {submitIsContinuation ? (
              <Sparkles size={18} aria-hidden="true" />
            ) : (
              <ArrowUp size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// A 44px hit area around a 36px circle: the avatar, the narrator glyph,
// or the initial; the Auto circle carries the sparkle. The active one
// carries the gold selected ring (gold only for selected and active).
function SpeakerCircle({ option, active = false, disabled = false, onChange }) {
  const isAuto = option?.id === "AUTO";
  const Icon = SPEAKER_ICONS[option?.iconKind] || UserRound;
  const label = isAuto
    ? "Auto: the story chooses who speaks next"
    : `${option?.label || "Character"} speaks next`;
  const initial = String(option?.label || "?").trim().charAt(0).toUpperCase();

  return (
    <button
      type="button"
      onClick={() => onChange?.(option.id)}
      disabled={disabled}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`${CIRCLE_BUTTON_CLASS} disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)]`}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center overflow-hidden rounded-[var(--radius-full)] bg-[var(--step-above)] transition-shadow duration-[var(--dur-hover)] ${
          active
            ? "text-[var(--gold-bright)] ring-2 ring-[var(--gold-action)]"
            : "text-[var(--ink-dim)]"
        }`}
      >
        {isAuto ? (
          <Sparkles size={18} aria-hidden="true" />
        ) : option?.avatarUrl ? (
          <img src={option.avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : option?.iconKind === "narrator" ? (
          <Icon size={18} aria-hidden="true" />
        ) : (
          <span className="font-display text-[length:var(--text-ui)] text-[var(--gold-ornament)]">
            {initial}
          </span>
        )}
      </span>
    </button>
  );
}

function ParticipantMentionTextarea({
  textareaRef,
  wrapperClassName = "",
  value = "",
  mentionSuggestions = [],
  highlightedMentionIndex = 0,
  commandSuggestions = [],
  highlightedCommandIndex = 0,
  highlightedCommandExact = false,
  locationSuggestions = [],
  highlightedLocationIndex = 0,
  disabled = false,
  placeholder = "",
  rows = 1,
  className = "",
  onChangeDraft,
  onUpdateSuggestionQueries,
  onMoveMentionHighlight,
  onSelectHighlightedMention,
  onSelectMention,
  onDismissMentionSuggestions,
  onMoveCommandHighlight,
  onSelectHighlightedCommand,
  onSelectCommand,
  onDismissCommandSuggestions,
  onMoveLocationHighlight,
  onSelectHighlightedLocation,
  onSelectLocation,
  onDismissLocationSuggestions,
  onSend,
}) {
  function restoreCursor(nextCursor) {
    if (!Number.isFinite(nextCursor)) return;

    requestAnimationFrame(() => {
      const textarea = textareaRef.current;

      if (!textarea) return;

      textarea.focus();
      textarea.setSelectionRange(nextCursor, nextCursor);
    });
  }

  function handleKeyDown(event) {
    if (event.isComposing || event.nativeEvent?.isComposing) return;
    if (event.key === "Enter" && event.shiftKey) return;

    if (commandSuggestions.length) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        onMoveCommandHighlight?.("next");
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        onMoveCommandHighlight?.("previous");
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        restoreCursor(onSelectHighlightedCommand?.());
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();

        if (highlightedCommandExact) {
          onSend?.();
        } else {
          restoreCursor(onSelectHighlightedCommand?.());
        }
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        onDismissCommandSuggestions?.();
        return;
      }
    }

    if (locationSuggestions.length) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        onMoveLocationHighlight?.("next");
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        onMoveLocationHighlight?.("previous");
        return;
      }

      if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault();
        restoreCursor(onSelectHighlightedLocation?.());
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        onDismissLocationSuggestions?.();
        return;
      }
    }

    if (mentionSuggestions.length) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        onMoveMentionHighlight?.("next");
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        onMoveMentionHighlight?.("previous");
        return;
      }

      if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault();
        restoreCursor(onSelectHighlightedMention?.());
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        onDismissMentionSuggestions?.();
        return;
      }
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend?.();
    }
  }

  return (
    <div className={`relative ${wrapperClassName}`}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) =>
          onChangeDraft?.(
            event.target.value,
            event.target.selectionStart ?? event.target.value.length
          )
        }
        onClick={(event) =>
          onUpdateSuggestionQueries?.(
            event.currentTarget.value,
            event.currentTarget.selectionStart ?? event.currentTarget.value.length
          )
        }
        onKeyUp={(event) => {
          if (["ArrowDown", "ArrowUp", "Enter", "Tab", "Escape"].includes(event.key)) {
            return;
          }

          onUpdateSuggestionQueries?.(
            event.currentTarget.value,
            event.currentTarget.selectionStart ?? event.currentTarget.value.length
          );
        }}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
        className={className}
      />

      {commandSuggestions.length ? (
        <div role="listbox" aria-label="Commands" className={COMPOSER_MENU_PANEL_CLASS}>
          <p className={COMPOSER_MENU_HEADING_CLASS}>Commands</p>

          {commandSuggestions.map((command, index) => (
            <button
              key={command.name}
              type="button"
              role="option"
              aria-selected={index === highlightedCommandIndex}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => restoreCursor(onSelectCommand?.(command.name))}
              className={`${composerMenuRowClass(index === highlightedCommandIndex)} flex-col items-start gap-[var(--space-1)]`}
            >
              <span className="flex w-full items-baseline justify-between gap-[var(--space-3)]">
                <span className="min-w-0 truncate font-mono text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--gold-ornament)]">
                  {command.usage}
                </span>
                {command.aliases?.length ? (
                  <span className="shrink-0 font-mono text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
                    {command.aliases.map((alias) => `/${alias}`).join(", ")}
                  </span>
                ) : null}
              </span>
              <span className="block text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                {command.description}
              </span>
              {command.example ? (
                <span className="block text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
                  Example: <span className="font-mono text-[var(--ink)]">{command.example}</span>
                </span>
              ) : null}
              {command.sourceLabel ? (
                <span className="block text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)]">
                  {command.sourceLabel}
                  {command.ambiguous ? " · Multiple active definitions" : ""}
                </span>
              ) : null}
            </button>
          ))}

          <p className="mt-[var(--space-1)] border-t border-[var(--line-whisper)] px-[var(--space-3)] pt-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
            Commands are hidden from the story.
          </p>
        </div>
      ) : null}

      {locationSuggestions.length ? (
        <div role="listbox" aria-label="Locations" className={COMPOSER_MENU_PANEL_CLASS}>
          <p className={COMPOSER_MENU_HEADING_CLASS}>
            <MapPin size={12} aria-hidden="true" />
            Locations
          </p>

          {locationSuggestions.map((option, index) => (
            <button
              key={option.runtimeEntryId}
              type="button"
              role="option"
              aria-selected={index === highlightedLocationIndex}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() =>
                restoreCursor(onSelectLocation?.(option.runtimeEntryId))
              }
              className={`${composerMenuRowClass(index === highlightedLocationIndex)} justify-between`}
            >
              <span className="min-w-0">
                <span className="block truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)]">
                  #{option.label}
                </span>
                <span className="block truncate text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)]">
                  {[
                    option.isCurrent ? "Current" : null,
                    option.locationScale || null,
                    option.registryTitle || null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </span>

              {option.aliases?.length ? (
                <span className="max-w-[40%] shrink-0 truncate text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
                  {option.aliases.join(", ")}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}

      {mentionSuggestions.length ? (
        <div role="listbox" aria-label="Characters" className={COMPOSER_MENU_PANEL_CLASS}>
          <p className={COMPOSER_MENU_HEADING_CLASS}>Characters</p>

          {mentionSuggestions.map((option, index) => (
            <button
              key={option.id}
              type="button"
              role="option"
              aria-selected={index === highlightedMentionIndex}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => restoreCursor(onSelectMention?.(option.id))}
              className={composerMenuRowClass(index === highlightedMentionIndex)}
            >
              {option.avatarUrl ? (
                <img
                  src={option.avatarUrl}
                  alt=""
                  className="h-8 w-8 shrink-0 rounded-[var(--radius-full)] bg-[var(--chat-avatar-fill)] object-cover"
                />
              ) : (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-full)] bg-[var(--surface-3)] font-display text-[length:var(--text-ui)] text-[var(--gold-ornament)]">
                  {String(option.label || "?").charAt(0).toUpperCase()}
                </span>
              )}

              <span className="min-w-0">
                <span className="block truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)]">
                  {option.label}
                </span>
                <span className="block text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
                  {option.mentionAlias}
                </span>
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function useAutoResizeTextarea(textareaRef, value, maxHeight) {
  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, [textareaRef, value, maxHeight]);
}
