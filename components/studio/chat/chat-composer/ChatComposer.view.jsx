"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Image as ImageIcon,
  MapPin,
  Menu,
  MessageSquare,
  Send,
  Sparkle,
  Square,
  Users,
  Wand2,
} from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";
import { CHAT_COMPOSER_DRAFT_SOFT_LIMIT, CHAT_COMPOSER_MODES } from "./ChatComposer.contract";

// One action-bar grid at BOTH breakpoints, RULED 23 Aug 2026
// (build-0823 pass 2), replacing the prior split Desktop/Mobile
// anatomy's "Next Speaker" row and mode-segmented-control column.
const PICKER_MODES = [CHAT_COMPOSER_MODES.DIALOGUE, CHAT_COMPOSER_MODES.ACTION, CHAT_COMPOSER_MODES.THOUGHT, CHAT_COMPOSER_MODES.SUGGESTION];

const MODE_CHIP_LABELS = {
  [CHAT_COMPOSER_MODES.DIALOGUE]: "Dialogue",
  [CHAT_COMPOSER_MODES.ACTION]: "Action",
  [CHAT_COMPOSER_MODES.THOUGHT]: "Thought",
  [CHAT_COMPOSER_MODES.SUGGESTION]: "Suggestion",
  [CHAT_COMPOSER_MODES.OOC]: "OOC",
  [CHAT_COMPOSER_MODES.DIRECT]: "Direct",
};

const SHARED_PROP_KEYS = [
  "mode",
  "speakerId",
  "draft",
  "draftLength",
  "showLengthCounter",
  "mentionSuggestions",
  "highlightedMentionIndex",
  "commandSuggestions",
  "highlightedCommandIndex",
  "highlightedCommandExact",
  "locationSuggestions",
  "highlightedLocationIndex",
  "placeholder",
  "textareaDisabled",
  "sendDisabled",
  "isSending",
  "submitIsContinuation",
  "submitLabel",
  "submitPendingLabel",
  "streamingSupported",
  "isStreaming",
  "onStopGenerating",
  "sceneImageSeat",
  "useCurrentSceneSeat",
  "onChangeMode",
  "onChangeSpeaker",
  "onChangeDraft",
  "onUpdateSuggestionQueries",
  "onMoveMentionHighlight",
  "onSelectHighlightedMention",
  "onSelectMention",
  "onDismissMentionSuggestions",
  "onMoveCommandHighlight",
  "onSelectHighlightedCommand",
  "onSelectCommand",
  "onDismissCommandSuggestions",
  "onMoveLocationHighlight",
  "onSelectHighlightedLocation",
  "onSelectLocation",
  "onDismissLocationSuggestions",
  "onSend",
  "onOpenCast",
  "onOpenState",
];

export default function ChatComposerView(props) {
  const sharedProps = {};
  SHARED_PROP_KEYS.forEach((key) => {
    sharedProps[key] = props[key];
  });

  return (
    <>
      <ComposerBar {...sharedProps} />

      {props.sceneImageConfirmSheet?.open ? (
        <SceneImageConfirmSheet {...props.sceneImageConfirmSheet} />
      ) : null}
    </>
  );
}

// B1 fade divider (docs/plans/ED1F-DESIGN-DELTAS.md), scope broadened
// to every modal-family divider: 1px, fades to transparent at both
// ends, never edge-to-edge. B8: footer buttons align to its ends.
function FadeDivider({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`h-px bg-[image:var(--line-fade)] ${className}`}
    />
  );
}

function LengthCounter({ draftLength = 0, showLengthCounter = false }) {
  if (!showLengthCounter) return null;

  return (
    <span
      className="text-[length:var(--text-label)] tabular-nums text-[var(--ink-faint)]"
      role="status"
    >
      {draftLength} past {CHAT_COMPOSER_DRAFT_SOFT_LIMIT}
    </span>
  );
}

function SubmitButton({
  onSend,
  sendDisabled,
  isSending,
  submitIsContinuation,
  submitLabel,
  submitPendingLabel,
  streamingSupported,
  isStreaming,
  onStopGenerating,
}) {
  if (streamingSupported && isStreaming) {
    return (
      <button
        type="button"
        onClick={() => onStopGenerating?.()}
        className="flex h-[var(--control-md)] w-[var(--control-md)] shrink-0 touch-manipulation items-center justify-center rounded-[var(--radius-md)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] text-[var(--status-danger)] transition hover:bg-[var(--status-danger-bed)] xl:w-auto xl:px-[var(--space-4)]"
        aria-label="Stop generating"
        title="Stop generating"
      >
        <Square size={16} aria-hidden="true" />
        <span className="hidden xl:inline">Stop generating</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSend?.()}
      disabled={sendDisabled}
      className="goldring flex h-[var(--control-md)] w-[var(--control-md)] shrink-0 touch-manipulation items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--gold-action)]/45 bg-[var(--fill)] text-[var(--gold-bright)] transition hover:bg-[var(--fill-strong)] disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)] xl:w-auto xl:px-[var(--space-4)]"
      title={isSending ? submitPendingLabel : submitLabel}
      aria-label={isSending ? submitPendingLabel : submitLabel}
    >
      {submitIsContinuation ? (
        <Sparkle size={16} aria-hidden="true" />
      ) : (
        <Send size={16} aria-hidden="true" />
      )}
      <span className="hidden text-[length:var(--text-cta)] xl:inline">
        {isSending ? submitPendingLabel : submitLabel}
      </span>
    </button>
  );
}

function SceneToolButtons({ sceneImageSeat, useCurrentSceneSeat }) {
  return (
    <>
      {sceneImageSeat?.available ? (
        <button
          type="button"
          onClick={() => sceneImageSeat.onOpenConfirm?.()}
          disabled={sceneImageSeat.pending}
          className="inline-flex h-[var(--control-md)] touch-manipulation items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-3)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--ink)] disabled:cursor-wait disabled:opacity-[var(--state-disabled-opacity)]"
          title="Generate a scene image"
          aria-label={`Generate a scene image (${sceneImageSeat.costLabel})`}
        >
          <ImageIcon size={14} aria-hidden="true" />
          Scene Image
        </button>
      ) : null}

      {useCurrentSceneSeat?.available ? (
        <button
          type="button"
          onClick={() => useCurrentSceneSeat.onUse?.()}
          disabled={useCurrentSceneSeat.pending}
          className="inline-flex h-[var(--control-md)] touch-manipulation items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-3)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--ink)] disabled:cursor-wait disabled:opacity-[var(--state-disabled-opacity)]"
          title="Describe the current scene"
          aria-label="Use current scene"
        >
          <Wand2 size={14} aria-hidden="true" />
          Use Current Scene
        </button>
      ) : null}
    </>
  );
}

function SceneImageConfirmSheet({ costLabel = "", pending = false, error = "", onConfirm, onCancel }) {
  return (
    <KitModalFrame variant="sheet" onClose={onCancel} ariaLabel="Confirm scene image generation">
      <div className="p-[var(--space-5)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          Scene Image
        </p>
        <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]">
          Generate an image of the current scene
        </h2>
        <p className="mt-[var(--space-3)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
          This costs {costLabel}. The image is generated from the current scene state and posted to
          the transcript.
        </p>

        {error ? (
          <p className="mt-[var(--space-3)] text-[length:var(--text-label)] text-[var(--status-danger)]" role="alert">
            {error}
          </p>
        ) : null}

        <FadeDivider className="mt-[var(--space-5)]" />
        <div className="mt-[var(--space-4)] flex flex-wrap items-center justify-between gap-[var(--space-2)]">
          <button type="button" onClick={() => onCancel?.()} className="cf-btn cf-btn--secondary" disabled={pending}>
            Cancel
          </button>
          <button type="button" onClick={() => onConfirm?.()} className="goldring cf-btn cf-btn--primary" disabled={pending}>
            {pending ? "Generating" : "Generate"}
          </button>
        </div>
      </div>
    </KitModalFrame>
  );
}

// Dialogue mode chip, RULED 23 Aug 2026: pops a small anchored picker
// presenting Dialogue / Action / Thought / Suggestion. OOC and DIRECT stay
// contract-legal (CHAT_COMPOSER_MODES) but are not surfaced here.
function ModeChip({ mode, onChangeMode }) {
  const [open, setOpen] = useState(false);
  const currentLabel = MODE_CHIP_LABELS[mode] || MODE_CHIP_LABELS[CHAT_COMPOSER_MODES.DIALOGUE];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex h-[var(--control-md)] w-full touch-manipulation items-center justify-center gap-[var(--space-1)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--ink)] xl:h-[2.25rem]"
      >
        <MessageSquare size={14} aria-hidden="true" className="shrink-0" />
        <span className="truncate">{currentLabel}</span>
        <ChevronDown size={13} aria-hidden="true" className="shrink-0" />
      </button>

      {open ? (
        <div
          role="listbox"
          className="cf-dropdown absolute bottom-full left-0 z-50 mb-[var(--space-2)] w-full min-w-[10rem]"
        >
          {PICKER_MODES.map((value) => (
            <button
              key={value}
              type="button"
              role="option"
              aria-selected={mode === value}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onChangeMode?.(value);
                setOpen(false);
              }}
              className={`flex min-h-[var(--control-sm)] w-full items-center rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-2)] text-left text-[length:var(--text-ui)] transition ${
                mode === value
                  ? "bg-[var(--fill-whisper)] text-[var(--ink)]"
                  : "text-[var(--ink-dim)] hover:bg-[var(--state-hover-fill)] hover:text-[var(--ink)]"
              }`}
            >
              {MODE_CHIP_LABELS[value]}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// The unified action bar, RULED 23 Aug 2026 (build-0823 pass 2): one
// grid at both breakpoints, [menu 40px][Auto][Party][Dialogue],
// replacing "Next Speaker" and the mode-segmented-control column.
// Menu opens the right story/state panel; Party opens the left party
// panel; Dialogue pops the mode picker above.
function ActionBar({ mode, onChangeMode, onChangeSpeaker, onOpenCast, onOpenState }) {
  return (
    <div className="grid grid-cols-[40px_1fr_1fr_1fr] items-stretch gap-[var(--space-2)]">
      <button
        type="button"
        onClick={() => onOpenState?.()}
        className="flex h-[var(--control-md)] w-full touch-manipulation items-center justify-center rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--ink)] xl:h-[2.25rem]"
        aria-label="Open story menu"
        title="Menu"
      >
        <Menu size={16} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={() => onChangeSpeaker?.("AUTO")}
        className="flex h-[var(--control-md)] w-full touch-manipulation items-center justify-center gap-[var(--space-1)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--ink)] xl:h-[2.25rem]"
        aria-label="Continue automatically"
        title="Auto"
      >
        <Sparkle size={14} aria-hidden="true" className="shrink-0" />
        <span className="truncate">Auto</span>
      </button>

      <button
        type="button"
        onClick={() => onOpenCast?.()}
        className="flex h-[var(--control-md)] w-full touch-manipulation items-center justify-center gap-[var(--space-1)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--ink)] xl:h-[2.25rem]"
        aria-label="Open the party panel"
        title="Party"
      >
        <Users size={14} aria-hidden="true" className="shrink-0" />
        <span className="truncate">Party</span>
      </button>

      <ModeChip mode={mode} onChangeMode={onChangeMode} />
    </div>
  );
}

function getPlaceholder(mode) {
  if (mode === CHAT_COMPOSER_MODES.ACTION) {
    return "Describe an action visible in the scene...";
  }

  if (mode === CHAT_COMPOSER_MODES.THOUGHT) {
    return "Write private inner dialogue...";
  }

  if (mode === CHAT_COMPOSER_MODES.SUGGESTION) {
    return "Suggest what happens next...";
  }

  if (mode === CHAT_COMPOSER_MODES.DIRECT) {
    return "Steer pacing, scene direction, or GM-style movement...";
  }

  if (mode === CHAT_COMPOSER_MODES.OOC) {
    return "Write an OOC note...";
  }

  return "Write dialogue or natural player input...";
}

function ComposerBar({
  mode,
  speakerId,
  draft,
  draftLength,
  showLengthCounter,
  mentionSuggestions,
  highlightedMentionIndex,
  commandSuggestions,
  highlightedCommandIndex,
  highlightedCommandExact,
  locationSuggestions,
  highlightedLocationIndex,
  placeholder,
  textareaDisabled,
  sendDisabled,
  isSending,
  submitIsContinuation,
  submitLabel,
  submitPendingLabel,
  streamingSupported,
  isStreaming,
  onStopGenerating,
  sceneImageSeat,
  useCurrentSceneSeat,
  onChangeMode,
  onChangeSpeaker,
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
  onOpenCast,
  onOpenState,
}) {
  const textareaRef = useRef(null);

  useAutoResizeTextarea(textareaRef, draft, 220);

  return (
    <div className="border-t border-[var(--line-whisper)] bg-[var(--surface-3)] p-[var(--space-3)] pb-[calc(var(--space-3)+env(safe-area-inset-bottom))] xl:p-[var(--space-4)]">
      {sceneImageSeat?.available || useCurrentSceneSeat?.available ? (
        <div className="mb-[var(--space-3)] flex flex-wrap items-center justify-between gap-[var(--space-2)]">
          <div className="flex flex-wrap items-center gap-[var(--space-2)]">
            <SceneToolButtons sceneImageSeat={sceneImageSeat} useCurrentSceneSeat={useCurrentSceneSeat} />
          </div>
          {sceneImageSeat?.available ? (
            <p className="text-[length:var(--text-label)] text-[var(--ink-dim)]">{sceneImageSeat.costLabel}</p>
          ) : null}
        </div>
      ) : null}

      <div className="flex items-end gap-[var(--space-2)]">
        <ParticipantMentionTextarea
          textareaRef={textareaRef}
          value={draft}
          mentionSuggestions={mentionSuggestions}
          highlightedMentionIndex={highlightedMentionIndex}
          commandSuggestions={commandSuggestions}
          highlightedCommandIndex={highlightedCommandIndex}
          highlightedCommandExact={highlightedCommandExact}
          locationSuggestions={locationSuggestions}
          highlightedLocationIndex={highlightedLocationIndex}
          disabled={textareaDisabled}
          placeholder={placeholder || getPlaceholder(mode)}
          rows={1}
          className="min-h-[var(--control-md)] max-h-[220px] w-full resize-none overflow-y-auto rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-faint)]"
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

        <SubmitButton
          onSend={onSend}
          sendDisabled={sendDisabled}
          isSending={isSending}
          submitIsContinuation={submitIsContinuation}
          submitLabel={submitLabel}
          submitPendingLabel={submitPendingLabel}
          streamingSupported={streamingSupported}
          isStreaming={isStreaming}
          onStopGenerating={onStopGenerating}
        />
      </div>

      <div className="mt-[var(--space-2)] flex items-center justify-between gap-[var(--space-2)]">
        <div className="min-w-0 flex-1">
          <ActionBar
            mode={mode}
            onChangeMode={onChangeMode}
            onChangeSpeaker={onChangeSpeaker}
            onOpenCast={onOpenCast}
            onOpenState={onOpenState}
          />
        </div>

        <LengthCounter draftLength={draftLength} showLengthCounter={showLengthCounter} />
      </div>
    </div>
  );
}

function ParticipantMentionTextarea({
  textareaRef,
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

  // IME-safe: composing keystrokes (accent/CJK input) never trigger
  // send or menu navigation. Shift+Enter always inserts a newline.
  function handleKeyDown(event) {
    if (event.isComposing || event.nativeEvent?.isComposing) return;
    if (event.key === "Enter" && event.shiftKey) return;

    // Precedence: command ("/") menu first, then location ("#"), then
    // mention ("@"), matching the crestfall-main chat baseline.
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
    <div className="relative min-w-0 flex-1">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) =>
          onChangeDraft?.(event.target.value, event.target.selectionStart ?? event.target.value.length)
        }
        onClick={(event) =>
          onUpdateSuggestionQueries?.(
            event.currentTarget.value,
            event.currentTarget.selectionStart ?? event.currentTarget.value.length
          )
        }
        onKeyUp={(event) => {
          if (["ArrowDown", "ArrowUp", "Enter", "Tab", "Escape"].includes(event.key)) return;

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
        <div className="cf-dropdown absolute bottom-full left-0 right-0 z-50 mb-[var(--space-2)] w-full max-w-none">
          <p className="px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
            Composer commands
          </p>

          {commandSuggestions.map((command, index) => (
            <button
              key={command.name}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => restoreCursor(onSelectCommand?.(command.name))}
              className={`flex min-h-[var(--control-sm)] w-full items-start justify-between gap-[var(--space-4)] rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-2)] text-left transition ${
                index === highlightedCommandIndex
                  ? "bg-[var(--fill-whisper)] text-[var(--ink)]"
                  : "text-[var(--ink-dim)] hover:bg-[var(--state-hover-fill)] hover:text-[var(--ink)]"
              }`}
            >
              <span className="min-w-0">
                <span className="block font-mono text-[length:var(--text-ui)] text-[var(--gold-ornament)]">
                  {command.usage}
                </span>
                <span className="mt-[var(--space-1)] block text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
                  {command.description}
                </span>
              </span>

              {command.aliases?.length ? (
                <span className="shrink-0 pt-[var(--space-1)] font-mono text-[length:var(--text-label)] text-[var(--ink-faint)]">
                  {command.aliases.map((alias) => `/${alias}`).join(", ")}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}

      {locationSuggestions.length ? (
        <div className="cf-dropdown absolute bottom-full left-0 right-0 z-50 mb-[var(--space-2)] w-full max-w-none">
          <p className="flex items-center gap-[var(--space-2)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
            <MapPin size={12} aria-hidden="true" />
            Registered locations
          </p>

          {locationSuggestions.map((option, index) => (
            <button
              key={option.runtimeEntryId}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => restoreCursor(onSelectLocation?.(option.runtimeEntryId))}
              className={`flex min-h-[var(--control-sm)] w-full items-start justify-between gap-[var(--space-4)] rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-2)] text-left transition ${
                index === highlightedLocationIndex
                  ? "bg-[var(--fill-whisper)] text-[var(--ink)]"
                  : "text-[var(--ink-dim)] hover:bg-[var(--state-hover-fill)] hover:text-[var(--ink)]"
              }`}
            >
              <span className="min-w-0">
                <span className="block truncate text-[length:var(--text-ui)] text-[var(--ink)]">
                  #{option.label}
                </span>
                <span className="mt-[var(--space-1)] block truncate text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
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
                <span className="max-w-[40%] shrink-0 truncate pt-[var(--space-1)] text-[length:var(--text-label)] text-[var(--ink-faint)]">
                  {option.aliases.join(", ")}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}

      {mentionSuggestions.length ? (
        <div className="cf-dropdown absolute bottom-full left-0 right-0 z-50 mb-[var(--space-2)] w-full max-w-none">
          <p className="px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
            Target active character
          </p>

          {mentionSuggestions.map((option, index) => (
            <button
              key={option.id}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => restoreCursor(onSelectMention?.(option.id))}
              className={`flex min-h-[var(--control-sm)] w-full items-center gap-[var(--space-3)] rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-2)] text-left transition ${
                index === highlightedMentionIndex
                  ? "bg-[var(--fill-whisper)] text-[var(--ink)]"
                  : "text-[var(--ink-dim)] hover:bg-[var(--state-hover-fill)] hover:text-[var(--ink)]"
              }`}
            >
              {option.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={option.avatarUrl}
                  alt=""
                  className="h-[var(--control-sm)] w-[var(--control-sm)] rounded-[var(--radius-full)] border border-[var(--line-whisper)] object-cover"
                />
              ) : (
                <span className="flex h-[var(--control-sm)] w-[var(--control-sm)] items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-3)] text-[length:var(--text-label)] text-[var(--gold-ornament)]">
                  {String(option.label || "?").charAt(0).toUpperCase()}
                </span>
              )}

              <span className="min-w-0">
                <span className="block truncate text-[length:var(--text-ui)] text-[var(--ink)]">
                  {option.label}
                </span>
                <span className="block text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
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
