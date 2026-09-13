"use client";

import { useEffect, useRef } from "react";
import {
  BookOpen,
  Image as ImageIcon,
  MapPin,
  Plus,
  Send,
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
  narrator: BookOpen,
  participant: UserRound,
};

const CIRCLE_BUTTON_CLASS =
  "flex h-[var(--control-md)] w-[var(--control-md)] shrink-0 touch-manipulation items-center justify-center rounded-[var(--radius-full)]";

// A tap control rises one step above its container: the secondary
// circles (scene image, Auto) sit on --step-above in the dim ink.
const SECONDARY_CIRCLE_CLASS = `${CIRCLE_BUTTON_CLASS} bg-[var(--step-above)] text-[var(--ink-dim)] transition-colors duration-[var(--dur-hover)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)]`;

// One composer bar at every width (fe/chat-studio item 2, 12 Sep 2026).
// Row one (brief 2 item 2, brief 3 item 2): the scene image seat at the
// left edge, the player circle, then a 44px circle per cast member
// (tap: that character speaks next, through the existing next-speaker
// handler), then the input mode chip pinned right and nothing else. Row
// two: the growing message field, the Auto circle (brief 2 item 1: the
// sparkle moved off the cast row; a tap runs the existing continuation
// with the AUTO speaker and never reads the draft), and the gold send
// circle, which posts the draft, Auto and send pinned to the right
// edge. The former speaker and mode eyebrow labels, the Random speaker,
// the two Soon scene buttons, the mobile tools drawer, the old continue
// label, and the below-md story list and settings buttons (back on the
// page's top bar, brief 3 item 10) are retired.
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
  submitLabel = "Send",
  submitPendingLabel = "Sending",
  autoDisabled = false,
  autoLabel = "Auto: the story chooses who speaks next",
  autoPendingLabel = "Choosing the next speaker",
  sceneImageState = "soon",
  sceneImageLabel = "Scene image, not available yet",
  playerCircle = null,
  addCharacter = null,
  onAuto,
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

  useAutoResizeTextarea(textareaRef, draft);

  const speakerOptions = Array.isArray(nextSpeakerOptions) ? nextSpeakerOptions : [];
  const castOptions = speakerOptions.filter((option) => option?.id && option.id !== "AUTO");

  const modeOptions = (Array.isArray(inputModeOptions) ? inputModeOptions : [])
    .map((option) => ({ value: option?.value, label: option?.label }))
    .filter((option) => option.value && option.label);
  const restingMode = modeOptions[0] || { value: "DIALOGUE", label: "Dialogue" };

  const sendTitle = isSending ? submitPendingLabel : submitLabel;
  const autoTitle = isSending ? autoPendingLabel : autoLabel;

  return (
    <div className="relative z-50 shrink-0 bg-transparent">
      {/* Bottom margin (brief 2 item 10): the safe-area inset plus
          --space-2 at 390 so the field never touches the bottom edge,
          --space-3 below the send row at md and up. The bar's surface
          and top hairline belong to the chat shell's full-width composer
          row (brief 3 item 1); this View paints the content only. */}
      <div className="px-[var(--space-3)] pb-[calc(var(--space-2)+env(safe-area-inset-bottom))] pt-[var(--space-2)] md:pb-[var(--space-3)]">
        {disabledReason ? (
          <p className="mb-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {disabledReason}
          </p>
        ) : null}

        {/* Cast row order (brief 2 item 2, brief 3 items 2 and 10): the
            scene image seat at the left edge, the player circle, the
            cast circles, the input mode chip pinned right. Nothing else
            on the row at any width; below md the story list and
            settings buttons live on the page's top bar again (brief 3
            item 10), and the row widths at 390 are measured in
            storyRoomComposerMobileRowBudgetDiagnostics.mjs. */}
        <div className="mb-[var(--space-2)] flex items-center gap-[var(--space-2)]">
          {/* Scene image seat (decision A1): the Chassis serves no scene
              image operation yet (CR-070), so the seat is visible and
              honestly disabled. */}
          <button
            type="button"
            disabled={sceneImageState !== "ready"}
            aria-label={sceneImageLabel}
            title={sceneImageState === "ready" ? "Scene image" : "Not available yet"}
            className={SECONDARY_CIRCLE_CLASS}
          >
            <ImageIcon size={18} aria-hidden="true" />
          </button>

          {/* Player circle (brief 3 item 2, brief 4 item 4): the player
              before the cast, from the selected player character (avatar
              or initial), or "You" when none is chosen. Its tap never
              opens the player character picker (the player character is
              set once at the start); it asks the player character to
              speak next through the existing continuation call. */}
          <PlayerCircle circle={playerCircle} />

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

            {/* Add character (brief 4 item 5): a 44px plus circle on the
                secondary recipe after the last character circle, inside
                the scrolling strip so it follows the cast; tap opens the
                Manage cast dialog. Disabled at the cap with the cap as
                its title. */}
            {addCharacter ? (
              <button
                type="button"
                onClick={() => addCharacter.onPress?.()}
                disabled={Boolean(addCharacter.disabled) || textareaDisabled}
                aria-label={addCharacter.title || "Add character"}
                title={addCharacter.title || "Add character"}
                aria-haspopup="dialog"
                className={SECONDARY_CIRCLE_CLASS}
              >
                <Plus size={18} aria-hidden="true" />
              </button>
            ) : null}
          </div>

          <KitDropdownView
            label={restingMode.label}
            ariaLabel="Input mode"
            labelMode="replace"
            options={modeOptions}
            selectedValues={inputMode ? [inputMode] : []}
            isMultiSelect={false}
            restingValue={restingMode.value}
            align="right"
            placement="up"
            isDisabled={textareaDisabled}
            onToggleOption={(nextValue) => onChangeInputMode?.(nextValue)}
          />
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
            className="block max-h-[40dvh] min-h-[var(--control-md)] w-full resize-none overflow-hidden rounded-[var(--radius-md)] md:max-h-[320px] border border-[var(--line-whisper)] bg-[var(--step-below)] px-[var(--space-3)] py-[var(--space-3)] text-[length:var(--text-input)] leading-[var(--lh-input)] text-[var(--ink)] shadow-[var(--shadow-bed)] transition-colors duration-[var(--dur-hover)] placeholder:text-[var(--ink-faint)] disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)]"
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

          {/* Auto (brief 2 item 1): the existing continuation call with
              the AUTO speaker; it never depends on the draft. */}
          <button
            type="button"
            onClick={() => onAuto?.()}
            disabled={autoDisabled}
            aria-label={autoTitle}
            title={autoTitle}
            className={SECONDARY_CIRCLE_CLASS}
          >
            <Sparkles size={18} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => onSend?.()}
            disabled={sendDisabled}
            aria-label={sendTitle}
            title={sendTitle}
            className={`${CIRCLE_BUTTON_CLASS} bg-[var(--gold-action)] text-[var(--tag-fill-ink)] transition-colors duration-[var(--dur-hover)] hover:bg-[var(--gold-bright)] focus-visible:shadow-[var(--focus-ring-ongold)] active:bg-[var(--state-pressed-gold)] disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)]`}
          >
            {/* The paper plane (brief 3 item 9); Auto keeps the sparkle. */}
            <Send size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

// The player circle (brief 3 item 2, brief 4 item 4): the same 44px hit
// area and 36px circle as a cast circle, showing the player character's
// avatar or initial, or "You" when none is chosen. While `canSpeak` is
// true it is a button whose tap asks the player character to speak
// next (the existing continuation call with the player character as
// the requested speaker); otherwise a plain mark. It never opens the
// player character picker and never carries the selected ring.
function PlayerCircle({ circle = null }) {
  const label = String(circle?.label || "").trim();
  const avatarUrl = String(circle?.avatarUrl || "").trim();
  const canSpeak = Boolean(circle?.canSpeak);
  const face = avatarUrl ? (
    <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
  ) : (
    <span className="font-display text-[length:var(--text-ui)] text-[var(--gold-ornament)]">
      {label ? label.charAt(0).toUpperCase() : "You"}
    </span>
  );
  // Review round 4 item 2: the same 44px circle as the scene image seat
  // and the add character circle, no smaller inner disc.
  const circleClass =
    "flex h-full w-full items-center justify-center overflow-hidden rounded-[var(--radius-full)] bg-[var(--step-above)] text-[var(--ink-dim)]";
  const title = label
    ? `${label}, your player character`
    : "You, no player character selected";

  if (!canSpeak) {
    return (
      <span className={CIRCLE_BUTTON_CLASS} title={title} aria-label={title} role="img">
        <span className={circleClass}>{face}</span>
      </span>
    );
  }

  const actionLabel = `${label || "You"} speaks next`;

  return (
    <button
      type="button"
      onClick={() => circle?.onSpeak?.()}
      aria-label={actionLabel}
      title={actionLabel}
      className={CIRCLE_BUTTON_CLASS}
    >
      <span className={circleClass}>{face}</span>
    </button>
  );
}

// A 44px circle (review round 4 item 2: the same size as the scene
// image seat, the player circle, and the add character circle): the
// avatar, the narrator glyph, or the initial. The one chosen to speak
// next carries the gold outline on the inside of the circle (gold only
// for selected and active).
function SpeakerCircle({ option, active = false, disabled = false, onChange }) {
  const Icon = SPEAKER_ICONS[option?.iconKind] || UserRound;
  const label = `${option?.label || "Character"} speaks next`;
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
        className={`flex h-full w-full items-center justify-center overflow-hidden rounded-[var(--radius-full)] bg-[var(--step-above)] transition-shadow duration-[var(--dur-hover)] ${
          active
            ? "text-[var(--gold-bright)] ring-2 ring-inset ring-[var(--gold-action)]"
            : "text-[var(--ink-dim)]"
        }`}
      >
        {option?.avatarUrl ? (
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

// The field grows with its content and never shows a scrollbar until it
// reaches its cap (brief 2 item 3). The cap is the field's own CSS
// max-height (40dvh under md, 320px at md and up), read from the
// computed style so the hook carries no width fork; overflow stays
// hidden below the cap and becomes scrollable only past it.
function useAutoResizeTextarea(textareaRef, value) {
  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";
    const cap = Number.parseFloat(window.getComputedStyle(textarea).maxHeight);
    const contentHeight = textarea.scrollHeight;
    const atCap = Number.isFinite(cap) && contentHeight > cap;

    textarea.style.height = `${atCap ? cap : contentHeight}px`;
    textarea.style.overflowY = atCap ? "auto" : "hidden";
  }, [textareaRef, value]);
}
