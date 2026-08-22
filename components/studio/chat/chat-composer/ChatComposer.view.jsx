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
  Square,
  UserRound,
  Users,
  Wand2,
} from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";
import { CHAT_COMPOSER_DRAFT_SOFT_LIMIT } from "./ChatComposer.contract";

const SPEAKER_ICONS = {
  auto: Sparkles,
  narrator: BookOpen,
  participant: UserRound,
  random: Shuffle,
};

const SHARED_PROP_KEYS = [
  "modeOptions",
  "mode",
  "speakerOptions",
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
];

export default function ChatComposerView(props) {
  const sharedProps = {};
  SHARED_PROP_KEYS.forEach((key) => {
    sharedProps[key] = props[key];
  });

  return (
    <>
      <DesktopComposer {...sharedProps} />
      <MobileComposer
        {...sharedProps}
        onOpenCast={props.onOpenCast}
        onOpenState={props.onOpenState}
        initialToolsOpen={props.initialToolsOpen}
      />

      {props.sceneImageConfirmSheet?.open ? (
        <SceneImageConfirmSheet {...props.sceneImageConfirmSheet} />
      ) : null}
    </>
  );
}

function ModeSegmentedControl({ modeOptions = [], mode = "", onChangeMode, idPrefix = "" }) {
  return (
    <div role="radiogroup" aria-label="Composer mode" className="flex flex-wrap gap-[var(--space-1)]">
      {modeOptions.map((option) => {
        const active = option.value === mode;

        return (
          <button
            key={`${idPrefix}${option.value}`}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChangeMode?.(option.value)}
            className={`min-h-[var(--control-md)] touch-manipulation rounded-[var(--radius-full)] border px-[var(--space-3)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] transition ${
              active
                ? "border-[var(--gold-action)]/60 bg-[var(--fill)] text-[var(--gold-bright)]"
                : "border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function SpeakerButtons({ options = [], selectedId = "", onChange, disabled = false }) {
  return options.map((option) => {
    const Icon = SPEAKER_ICONS[option.iconKind] || UserRound;
    const active = selectedId === option.id;
    const isParticipant = !["AUTO", "RANDOM"].includes(option.id);
    const title = isParticipant
      ? `Send to ${option.label}; select with an empty draft to yield the next turn`
      : `Choose ${option.label} speaker routing`;

    return (
      <button
        key={option.id}
        type="button"
        onClick={() => onChange?.(option.id)}
        disabled={disabled}
        aria-pressed={active}
        aria-label={title}
        title={title}
        className={`${
          isParticipant
            ? "relative h-[var(--control-md)] w-[var(--control-md)] shrink-0 overflow-hidden rounded-[var(--radius-full)]"
            : "inline-flex h-[var(--control-md)] shrink-0 items-center gap-[var(--space-1)] rounded-[var(--radius-full)] px-[var(--space-3)]"
        } touch-manipulation border text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] transition disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)] ${
          active
            ? "border-[var(--gold-action)]/70 bg-[var(--fill)] text-[var(--gold-bright)]"
            : "border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
        }`}
      >
        {isParticipant ? (
          option.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={option.avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-[var(--surface-3)] text-[length:var(--text-ui)] font-[var(--weight-bold)] text-[var(--gold-ornament)]">
              {String(option.label || "?").charAt(0).toUpperCase()}
            </span>
          )
        ) : (
          <>
            <Icon size={13} aria-hidden="true" />
            {option.label}
          </>
        )}
      </button>
    );
  });
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
  compact = false,
}) {
  if (streamingSupported && isStreaming) {
    return (
      <button
        type="button"
        onClick={() => onStopGenerating?.()}
        className={
          compact
            ? "flex h-[var(--control-md)] w-[var(--control-md)] items-center justify-center rounded-[var(--radius-full)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] text-[var(--status-danger)] transition hover:bg-[var(--status-danger-bed)]"
            : "cf-btn cf-btn--secondary"
        }
        aria-label="Stop generating"
        title="Stop generating"
      >
        <Square size={compact ? 15 : 14} aria-hidden="true" />
        {compact ? null : "Stop generating"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSend?.()}
      disabled={sendDisabled}
      className={
        compact
          ? "flex h-[var(--control-md)] w-[var(--control-md)] touch-manipulation items-center justify-center rounded-[var(--radius-full)] border border-[var(--gold-action)]/45 bg-[var(--fill)] text-[var(--gold-bright)] transition hover:bg-[var(--fill-strong)] disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)]"
          : "goldring cf-btn cf-btn--primary"
      }
      title={isSending ? submitPendingLabel : submitLabel}
      aria-label={isSending ? submitPendingLabel : submitLabel}
    >
      {submitIsContinuation ? (
        <Sparkles size={compact ? 16 : 15} aria-hidden="true" />
      ) : (
        <Send size={compact ? 16 : 15} aria-hidden="true" />
      )}
      {compact ? null : isSending ? submitPendingLabel : submitLabel}
    </button>
  );
}

function SceneToolButtons({ sceneImageSeat, useCurrentSceneSeat, compact = false }) {
  return (
    <>
      {sceneImageSeat?.available ? (
        <button
          type="button"
          onClick={() => sceneImageSeat.onOpenConfirm?.()}
          disabled={sceneImageSeat.pending}
          className={
            compact
              ? "flex h-[var(--control-md)] w-[var(--control-md)] touch-manipulation items-center justify-center rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--gold-ornament)] disabled:opacity-[var(--state-disabled-opacity)]"
              : "inline-flex h-[var(--control-md)] touch-manipulation items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-3)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--ink)] disabled:cursor-wait disabled:opacity-[var(--state-disabled-opacity)]"
          }
          title={`Generate a scene image (${sceneImageSeat.costLabel})`}
          aria-label={`Generate a scene image (${sceneImageSeat.costLabel})`}
        >
          <ImageIcon size={14} aria-hidden="true" />
          {compact ? null : `Scene Image · ${sceneImageSeat.costLabel}`}
        </button>
      ) : null}

      {useCurrentSceneSeat?.available ? (
        <button
          type="button"
          onClick={() => useCurrentSceneSeat.onUse?.()}
          disabled={useCurrentSceneSeat.pending}
          className={
            compact
              ? "flex h-[var(--control-md)] w-[var(--control-md)] touch-manipulation items-center justify-center rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--gold-ornament)] disabled:opacity-[var(--state-disabled-opacity)]"
              : "inline-flex h-[var(--control-md)] touch-manipulation items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-3)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--ink)] disabled:cursor-wait disabled:opacity-[var(--state-disabled-opacity)]"
          }
          title="Describe the current scene"
          aria-label="Use current scene"
        >
          <Wand2 size={14} aria-hidden="true" />
          {compact ? null : "Use Current Scene"}
        </button>
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
            {pending ? "Generating" : `Generate (${costLabel})`}
          </button>
        </div>
      </div>
    </KitModalFrame>
  );
}

function DesktopComposer({
  modeOptions,
  mode,
  speakerOptions,
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
}) {
  const textareaRef = useRef(null);

  useAutoResizeTextarea(textareaRef, draft, 360);

  return (
    <div className="hidden border-t border-[var(--line-whisper)] bg-[var(--surface-3)] p-[var(--space-4)] xl:block">
      <div className="mb-[var(--space-3)] flex flex-wrap items-center gap-[var(--space-2)]">
        <p className="mr-[var(--space-1)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          Next Speaker
        </p>
        <SpeakerButtons options={speakerOptions} selectedId={speakerId} onChange={onChangeSpeaker} />
      </div>

      <div className="grid gap-[var(--space-3)] lg:grid-cols-[minmax(0,1fr)_200px]">
        <div>
          <label className="block">
            <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
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
              className="mt-[var(--space-2)] max-h-[360px] min-h-[72px] w-full resize-none overflow-y-auto rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-faint)]"
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

          <div className="mt-[var(--space-3)] flex flex-wrap items-center justify-between gap-[var(--space-2)]">
            <div className="flex flex-wrap items-center gap-[var(--space-2)]">
              <SceneToolButtons sceneImageSeat={sceneImageSeat} useCurrentSceneSeat={useCurrentSceneSeat} />
            </div>
            <LengthCounter draftLength={draftLength} showLengthCounter={showLengthCounter} />
          </div>
        </div>

        <div className="grid content-end gap-[var(--space-3)]">
          <div>
            <p className="mb-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
              Mode
            </p>
            <ModeSegmentedControl modeOptions={modeOptions} mode={mode} onChangeMode={onChangeMode} idPrefix="desktop-" />
          </div>

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
      </div>
    </div>
  );
}

function MobileComposer({
  modeOptions,
  mode,
  speakerOptions,
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
  initialToolsOpen = false,
}) {
  const [toolsOpen, setToolsOpen] = useState(initialToolsOpen);
  const textareaRef = useRef(null);

  useAutoResizeTextarea(textareaRef, draft, 220);

  return (
    <div className="border-t border-[var(--line-whisper)] bg-[var(--surface-3)] p-[var(--space-3)] pb-[calc(var(--space-3)+env(safe-area-inset-bottom))] xl:hidden">
      <div className="mb-[var(--space-2)] flex gap-[var(--space-2)] overflow-x-auto pb-[var(--space-1)]">
        <SpeakerButtons options={speakerOptions} selectedId={speakerId} onChange={onChangeSpeaker} />
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
        className="max-h-[220px] min-h-[var(--control-lg)] w-full resize-none overflow-y-auto rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-faint)]"
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

      <div className="mt-[var(--space-2)] flex items-center justify-between gap-[var(--space-2)]">
        <div className="flex items-center gap-[var(--space-2)]">
          <SceneToolButtons sceneImageSeat={sceneImageSeat} useCurrentSceneSeat={useCurrentSceneSeat} compact />

          <button
            type="button"
            onClick={() => setToolsOpen(true)}
            className={`flex h-[var(--control-md)] w-[var(--control-md)] touch-manipulation items-center justify-center rounded-[var(--radius-md)] border transition ${
              toolsOpen
                ? "border-[var(--gold-action)]/55 bg-[var(--fill)] text-[var(--ink)]"
                : "border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)]"
            }`}
            title="Open tools"
            aria-label="Open tools"
          >
            <SlidersHorizontal size={16} aria-hidden="true" />
          </button>
        </div>

        <LengthCounter draftLength={draftLength} showLengthCounter={showLengthCounter} />

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
          compact
        />
      </div>

      {toolsOpen ? (
        <MobileToolsSheet
          modeOptions={modeOptions}
          mode={mode}
          speakerOptions={speakerOptions}
          speakerId={speakerId}
          onChangeMode={onChangeMode}
          onChangeSpeaker={onChangeSpeaker}
          onOpenCast={onOpenCast}
          onOpenState={onOpenState}
          onClose={() => setToolsOpen(false)}
        />
      ) : null}
    </div>
  );
}

function MobileToolsSheet({
  modeOptions,
  mode,
  speakerOptions,
  speakerId,
  onChangeMode,
  onChangeSpeaker,
  onOpenCast,
  onOpenState,
  onClose,
}) {
  return (
    <KitModalFrame variant="sheet" onClose={onClose} ariaLabel="Chat tools">
      <div className="p-[var(--space-4)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          Room Tools
        </p>

        <div className="mt-[var(--space-4)] grid gap-[var(--space-4)]">
          <div>
            <p className="mb-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
              Mode
            </p>
            <ModeSegmentedControl modeOptions={modeOptions} mode={mode} onChangeMode={onChangeMode} idPrefix="mobile-" />
          </div>

          <div>
            <p className="mb-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
              Next Speaker
            </p>
            <div className="flex flex-wrap gap-[var(--space-2)]">
              <SpeakerButtons options={speakerOptions} selectedId={speakerId} onChange={onChangeSpeaker} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-[var(--space-2)]">
            <button
              type="button"
              onClick={() => onOpenCast?.()}
              className="inline-flex min-h-[var(--control-md)] touch-manipulation items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-3)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)]"
            >
              <Users size={14} aria-hidden="true" />
              Cast / Room
            </button>

            <button
              type="button"
              onClick={() => onOpenState?.()}
              className="inline-flex min-h-[var(--control-md)] touch-manipulation items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-3)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)]"
            >
              <Eye size={14} aria-hidden="true" />
              State
            </button>

            <DisabledToolButton icon={Download} label="Export" />
            <DisabledToolButton icon={Share2} label="Share" />
          </div>
        </div>
      </div>
    </KitModalFrame>
  );
}

// 4.7/D19: an honest disabled stub carries the word "Soon" beside the
// control, never baked into the label.
function DisabledToolButton({ icon: Icon, label }) {
  return (
    <button
      type="button"
      disabled
      className="inline-flex min-h-[var(--control-md)] items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-3)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)] opacity-[var(--state-disabled-opacity)]"
    >
      <Icon size={14} aria-hidden="true" />
      {label}
      <span className="normal-case tracking-normal text-[var(--ink-faint)]">Soon</span>
    </button>
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
    <div className="relative">
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
