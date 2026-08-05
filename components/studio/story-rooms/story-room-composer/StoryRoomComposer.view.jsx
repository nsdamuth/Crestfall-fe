"use client";

import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Download,
  Eye,
  Image as ImageIcon,
  MapPin,
  Send,
  Share2,
  Shuffle,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  Users,
  Wand2,
  X,
} from "lucide-react";

import CrestfallSelect from "@/components/ui/CrestfallSelect";

const SPEAKER_ICONS = {
  auto: Sparkles,
  narrator: BookOpen,
  participant: UserRound,
  random: Shuffle,
};

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
  placeholder = "Write dialogue or natural player input...",
  textareaDisabled = false,
  sendDisabled = true,
  isSending = false,
  submitIsContinuation = false,
  submitLabel = "Send",
  submitPendingLabel = "Sending...",
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
  onOpenCast,
  onOpenState,
}) {
  const sharedProps = {
    inputModeOptions,
    inputMode,
    nextSpeakerOptions,
    nextSpeaker,
    draft,
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
  };

  return (
    <>
      <DesktopComposer {...sharedProps} />
      <MobileComposer
        {...sharedProps}
        onOpenCast={onOpenCast}
        onOpenState={onOpenState}
      />
    </>
  );
}

function DesktopComposer({
  inputModeOptions,
  inputMode,
  nextSpeakerOptions,
  nextSpeaker,
  draft,
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

  useAutoResizeTextarea(textareaRef, draft, 360);

  return (
    <div className="hidden border-t border-white/10 bg-black/35 p-4 xl:block">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <p className="mr-1 text-[10px] uppercase tracking-[0.18em] text-[var(--muted-gold)]">
          Next Speaker
        </p>

        <SpeakerButtons
          options={nextSpeakerOptions}
          selectedId={nextSpeaker}
          onChange={onChangeNextSpeaker}
          desktop
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_190px]">
        <div>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Message
            </span>

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
              placeholder={placeholder}
              rows={2}
              className="mt-2 max-h-[360px] min-h-[72px] w-full resize-none overflow-y-auto rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
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
          </label>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] opacity-60"
              title="Later this will generate an image of the current scene."
            >
              <ImageIcon size={14} />
              Scene Image Soon
            </button>

            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] opacity-60"
              title="Later this can use the last active speaker, room state, and visible scene context."
            >
              <Wand2 size={14} />
              Use Current Scene
            </button>
          </div>
        </div>

        <div className="grid content-end gap-3">
          <CrestfallSelect
            label="Input Mode"
            value={inputMode}
            onChange={(nextValue) => onChangeInputMode?.(nextValue)}
            options={inputModeOptions}
            placement="top"
          />

          <button
            type="button"
            onClick={() => onSend?.()}
            disabled={sendDisabled}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/15 px-5 py-4 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/25 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitIsContinuation ? <Sparkles size={15} /> : <Send size={15} />}
            {isSending ? submitPendingLabel : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileComposer({
  inputModeOptions,
  inputMode,
  nextSpeakerOptions,
  nextSpeaker,
  draft,
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
  onOpenCast,
  onOpenState,
}) {
  const [toolsOpen, setToolsOpen] = useState(false);
  const textareaRef = useRef(null);

  useAutoResizeTextarea(textareaRef, draft, 220);

  return (
    <div className="fixed bottom-20 left-3 right-3 z-40 xl:hidden">
      {toolsOpen ? (
        <MobileToolsDrawer
          inputModeOptions={inputModeOptions}
          inputMode={inputMode}
          nextSpeaker={nextSpeaker}
          nextSpeakerOptions={nextSpeakerOptions}
          onChangeInputMode={onChangeInputMode}
          onChangeNextSpeaker={onChangeNextSpeaker}
          onOpenCast={onOpenCast}
          onOpenState={onOpenState}
          onClose={() => setToolsOpen(false)}
        />
      ) : null}

      <div className="rounded-[var(--radius-md)] border border-[var(--muted-gold)]/35 bg-[#080706]/95 p-3 shadow-2xl backdrop-blur-[var(--blur-panel)]">
        <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
          <SpeakerButtons
            options={nextSpeakerOptions}
            selectedId={nextSpeaker}
            onChange={onChangeNextSpeaker}
          />
        </div>

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
          placeholder={placeholder}
          rows={1}
          className="max-h-[220px] min-h-[52px] w-full resize-none overflow-y-auto rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
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

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/35 text-pink-300 opacity-70"
              title="Generate scene image soon"
              aria-label="Generate scene image soon"
            >
              <ImageIcon size={17} />
            </button>

            <button
              type="button"
              onClick={() => setToolsOpen((current) => !current)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                toolsOpen
                  ? "border-[var(--muted-gold)]/55 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                  : "border-white/10 bg-black/35 text-[var(--muted)]"
              }`}
              title="Open tools"
              aria-label="Open tools"
            >
              <SlidersHorizontal size={17} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onSend?.()}
            disabled={sendDisabled}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/20 text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/30 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
            title={isSending ? submitPendingLabel : submitLabel}
            aria-label={isSending ? submitPendingLabel : submitLabel}
          >
            {submitIsContinuation ? <Sparkles size={17} /> : <Send size={17} />}
          </button>
        </div>
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
    <div className="relative">
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
        <div className="absolute bottom-full left-0 right-0 z-50 mb-2 max-h-64 overflow-y-auto rounded-xl border border-[var(--muted-gold)]/30 bg-[#080706] p-1 shadow-2xl">
          <p className="px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            Composer commands
          </p>

          {commandSuggestions.map((command, index) => (
            <button
              key={command.name}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => restoreCursor(onSelectCommand?.(command.name))}
              className={`flex w-full items-start justify-between gap-4 rounded-lg px-3 py-2 text-left transition ${
                index === highlightedCommandIndex
                  ? "bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                  : "text-[var(--muted)] hover:bg-white/5 hover:text-[var(--foreground)]"
              }`}
            >
              <span className="min-w-0">
                <span className="block font-mono text-sm text-[var(--muted-gold)]">
                  {command.usage}
                </span>
                <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">
                  {command.description}
                </span>
              </span>

              {command.aliases?.length ? (
                <span className="shrink-0 pt-0.5 font-mono text-[10px] text-[var(--muted)]">
                  {command.aliases.map((alias) => `/${alias}`).join(", ")}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}

      {locationSuggestions.length ? (
        <div className="absolute bottom-full left-0 right-0 z-50 mb-2 max-h-72 overflow-y-auto rounded-xl border border-[var(--muted-gold)]/30 bg-[#080706] p-1 shadow-2xl">
          <p className="flex items-center gap-2 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            <MapPin size={12} />
            Registered locations
          </p>

          {locationSuggestions.map((option, index) => (
            <button
              key={option.runtimeEntryId}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() =>
                restoreCursor(onSelectLocation?.(option.runtimeEntryId))
              }
              className={`flex w-full items-start justify-between gap-4 rounded-lg px-3 py-2 text-left transition ${
                index === highlightedLocationIndex
                  ? "bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                  : "text-[var(--muted)] hover:bg-white/5 hover:text-[var(--foreground)]"
              }`}
            >
              <span className="min-w-0">
                <span className="block truncate text-sm text-[var(--foreground)]">
                  #{option.label}
                </span>
                <span className="mt-1 block truncate text-[10px] uppercase tracking-[0.13em] text-[var(--muted)]">
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
                <span className="max-w-[40%] shrink-0 truncate pt-0.5 text-[10px] text-[var(--muted)]">
                  {option.aliases.join(", ")}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}

      {mentionSuggestions.length ? (
        <div className="absolute bottom-full left-0 right-0 z-50 mb-2 max-h-64 overflow-y-auto rounded-xl border border-[var(--muted-gold)]/30 bg-[#080706] p-1 shadow-2xl">
          <p className="px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            Target active character
          </p>

          {mentionSuggestions.map((option, index) => (
            <button
              key={option.id}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => restoreCursor(onSelectMention?.(option.id))}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
                index === highlightedMentionIndex
                  ? "bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                  : "text-[var(--muted)] hover:bg-white/5 hover:text-[var(--foreground)]"
              }`}
            >
              {option.avatarUrl ? (
                <img
                  src={option.avatarUrl}
                  alt=""
                  className="h-8 w-8 rounded-full border border-white/10 object-cover"
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/40 text-xs text-[var(--muted-gold)]">
                  {String(option.label || "?").charAt(0).toUpperCase()}
                </span>
              )}

              <span className="min-w-0">
                <span className="block truncate text-sm text-[var(--foreground)]">
                  {option.label}
                </span>
                <span className="block text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
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

function SpeakerButtons({ options = [], selectedId = "", onChange, desktop = false }) {
  return options.map((option) => {
    const Icon = SPEAKER_ICONS[option.iconKind] || UserRound;
    const active = selectedId === option.id;
    const isParticipant = !["AUTO", "RANDOM"].includes(option.id);
    const title = isParticipant
      ? `Send to ${option.label}; click with an empty message to yield the next turn`
      : `Choose ${option.label} speaker routing`;

    return (
      <button
        key={option.id}
        type="button"
        onClick={() => onChange?.(option.id)}
        aria-pressed={active}
        aria-label={title}
        title={title}
        className={`${
          isParticipant
            ? "relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full"
            : "inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-md)] px-3 py-1.5"
        } border text-[10px] uppercase transition ${
          desktop && !isParticipant ? "tracking-[0.14em]" : "tracking-[0.12em]"
        } ${
          active
            ? "border-[var(--muted-gold)]/70 bg-[var(--muted-gold)]/20 text-[var(--foreground)] ring-2 ring-[var(--muted-gold)]/20"
            : desktop
              ? "border-white/10 bg-black/30 text-[var(--muted)] hover:border-[var(--muted-gold)]/45 hover:text-[var(--foreground)]"
              : "border-white/10 bg-black/35 text-[var(--muted)]"
        }`}
      >
        {isParticipant ? (
          option.avatarUrl ? (
            <img
              src={option.avatarUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-black/40 text-sm font-semibold text-[var(--muted-gold)]">
              {String(option.label || "?").charAt(0).toUpperCase()}
            </span>
          )
        ) : (
          <>
            <Icon size={12} />
            {option.label}
          </>
        )}
      </button>
    );
  });
}

function MobileToolsDrawer({
  inputModeOptions,
  inputMode,
  nextSpeaker,
  nextSpeakerOptions,
  onChangeInputMode,
  onChangeNextSpeaker,
  onOpenCast,
  onOpenState,
  onClose,
}) {
  return (
    <div className="mb-3 overflow-visible rounded-[var(--radius-lg)] border border-[var(--muted-gold)]/25 bg-[#080706]/95 p-4 shadow-2xl backdrop-blur-[var(--blur-panel)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
          Room Tools
        </p>

        <button
          type="button"
          onClick={() => onClose?.()}
          className="rounded-lg border border-white/10 p-2 text-[var(--muted)]"
          aria-label="Close tools"
        >
          <X size={15} />
        </button>
      </div>

      <div className="mt-4 grid gap-4">
        <CrestfallSelect
          label="Input Mode"
          value={inputMode}
          onChange={(nextValue) => onChangeInputMode?.(nextValue)}
          options={inputModeOptions}
          placement="top"
        />

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Next Speaker
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <SpeakerButtons
              options={nextSpeakerOptions}
              selectedId={nextSpeaker}
              onChange={onChangeNextSpeaker}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onOpenCast?.()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/35 px-3 py-3 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]"
          >
            <Users size={14} />
            Cast / Room
          </button>

          <button
            type="button"
            onClick={() => onOpenState?.()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/35 px-3 py-3 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]"
          >
            <Eye size={14} />
            State
          </button>

          <DisabledToolButton icon={ImageIcon} label="Scene Image" />
          <DisabledToolButton icon={Wand2} label="Current Scene" />
          <DisabledToolButton icon={Download} label="Export" />
          <DisabledToolButton icon={Share2} label="Share" />
        </div>
      </div>
    </div>
  );
}

function DisabledToolButton({ icon: Icon, label }) {
  return (
    <button
      type="button"
      disabled
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/35 px-3 py-3 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] opacity-60"
    >
      <Icon size={14} />
      {label}
    </button>
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
