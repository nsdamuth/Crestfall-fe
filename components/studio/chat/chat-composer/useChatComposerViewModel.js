"use client";

import { useMemo, useState } from "react";

import {
  CHAT_COMPOSER_DRAFT_SOFT_LIMIT,
  CHAT_COMPOSER_MODES,
} from "./ChatComposer.contract";
import {
  getChatComposerCommandSearchTerms,
  getChatComposerCommandSuggestions,
} from "./chatComposerCommandRegistry";
import {
  getMentionSearchTerms,
  normalizeChatComposerSearch,
  updateChatComposerSuggestionQueries,
} from "./chatComposerAutocomplete";

const MODE_OPTIONS = [
  { value: CHAT_COMPOSER_MODES.DIALOGUE, label: "Dialogue" },
  { value: CHAT_COMPOSER_MODES.ACTION, label: "Action" },
  { value: CHAT_COMPOSER_MODES.OOC, label: "OOC / Note" },
  { value: CHAT_COMPOSER_MODES.DIRECT, label: "Direct / GM" },
];

function normalizeMentions(mentions = []) {
  return (Array.isArray(mentions) ? mentions : [])
    .map((mention) => ({
      participantId: String(mention?.participantId || "").trim(),
      displayName: String(mention?.displayName || "").trim(),
      mentionText: String(mention?.mentionText || "").trim(),
    }))
    .filter((mention) => mention.participantId && mention.mentionText);
}

function reconcileParticipantMentions(value, mentions = []) {
  return normalizeMentions(mentions).filter((mention) =>
    String(value || "").includes(mention.mentionText)
  );
}

function normalizeLocationMentions(mentions = []) {
  return (Array.isArray(mentions) ? mentions : [])
    .map((mention) => ({
      runtimeEntryId: String(mention?.runtimeEntryId || "").trim(),
      displayName: String(mention?.displayName || "").trim(),
      mentionText: String(mention?.mentionText || "").trim(),
    }))
    .filter((mention) => mention.runtimeEntryId && mention.mentionText);
}

function reconcileLocationMentions(value, mentions = []) {
  return normalizeLocationMentions(mentions).filter((mention) =>
    String(value || "").includes(mention.mentionText)
  );
}

function normalizeLocationOptions(options = []) {
  return (Array.isArray(options) ? options : [])
    .map((option) => ({
      runtimeEntryId: String(option?.runtimeEntryId || "").trim(),
      label: String(option?.label || "").trim(),
      aliases: Array.isArray(option?.aliases) ? option.aliases.filter(Boolean) : [],
      locationScale: String(option?.locationScale || "").trim(),
      registryTitle: String(option?.registryTitle || "").trim(),
      parentRuntimeEntryId: String(option?.parentRuntimeEntryId || "").trim() || null,
      adjacentRuntimeEntryIds: Array.isArray(option?.adjacentRuntimeEntryIds)
        ? option.adjacentRuntimeEntryIds.filter(Boolean)
        : [],
      isCurrent: Boolean(option?.isCurrent),
    }))
    .filter((option) => option.runtimeEntryId && option.label);
}

function getSpeakerIconKind(option) {
  if (option?.id === "AUTO") return "auto";
  if (option?.id === "RANDOM") return "random";
  if (option?.participantType === "NARRATOR") return "narrator";
  return "participant";
}

function normalizeSpeakerOptions(options = []) {
  return (Array.isArray(options) ? options : [])
    .map((option) => ({
      id: String(option?.id || "").trim(),
      label: String(option?.label || "").trim(),
      iconKind: getSpeakerIconKind(option),
      avatarUrl: String(option?.avatarUrl || "").trim(),
    }))
    .filter((option) => option.id && option.label);
}

function normalizeMentionOptions(options = []) {
  return (Array.isArray(options) ? options : [])
    .map((option) => ({
      id: String(option?.id || "").trim(),
      label: String(option?.label || "").trim(),
      avatarUrl: String(option?.avatarUrl || "").trim(),
      mentionAlias: `@${normalizeChatComposerSearch(option?.label).split(" ")[0] || "character"}`,
    }))
    .filter((option) => option.id && option.label);
}

function getPlaceholder(mode) {
  if (mode === CHAT_COMPOSER_MODES.ACTION) {
    return "Describe an action visible in the scene...";
  }

  if (mode === CHAT_COMPOSER_MODES.DIRECT) {
    return "Steer pacing, scene direction, or GM-style movement...";
  }

  if (mode === CHAT_COMPOSER_MODES.OOC) {
    return "Write an OOC note...";
  }

  return "Write dialogue or natural player input...";
}

/**
 * ViewModel for the portable chat-composer View. Owns the autocomplete
 * interaction set (query parsing, precedence, highlight, selection),
 * the Continue Scene / portrait-yield submit semantics, and the Scene
 * Image confirm sheet's open/closed local state. Does not call an API
 * or own room persistence; onSend/onConfirm/onUse are caller-provided
 * (wave C5's chat page shell wires the live behavior).
 */
export function useChatComposerViewModel({
  mode = CHAT_COMPOSER_MODES.DIALOGUE,
  setMode,
  speakerId = "AUTO",
  setSpeakerId,
  speakerOptions = [],
  draft = "",
  setDraft,
  participantMentions = [],
  setParticipantMentions,
  participantMentionOptions = [],
  locationMentions = [],
  setLocationMentions,
  locationMentionOptions = [],
  onSend,
  onOpenCast,
  onOpenState,
  isSending = false,
  disabled = false,
  streamingSupported = false,
  isStreaming = false,
  onStopGenerating,
  sceneImage = {},
  useCurrentScene = {},
} = {}) {
  const [activeMentionQuery, setActiveMentionQuery] = useState(null);
  const [highlightedMentionIndex, setHighlightedMentionIndex] = useState(0);
  const [activeCommandQuery, setActiveCommandQuery] = useState(null);
  const [highlightedCommandIndex, setHighlightedCommandIndex] = useState(0);
  const [activeLocationQuery, setActiveLocationQuery] = useState(null);
  const [highlightedLocationIndex, setHighlightedLocationIndex] = useState(0);
  const [sceneImageConfirmOpen, setSceneImageConfirmOpen] = useState(false);

  const normalizedSpeakerOptions = useMemo(
    () => normalizeSpeakerOptions(speakerOptions),
    [speakerOptions]
  );
  const normalizedMentionOptions = useMemo(
    () => normalizeMentionOptions(participantMentionOptions),
    [participantMentionOptions]
  );
  const normalizedMentions = useMemo(
    () => normalizeMentions(participantMentions),
    [participantMentions]
  );
  const normalizedLocationMentions = useMemo(
    () => normalizeLocationMentions(locationMentions),
    [locationMentions]
  );
  const normalizedLocationOptions = useMemo(
    () => normalizeLocationOptions(locationMentionOptions),
    [locationMentionOptions]
  );

  const commandSuggestions = useMemo(() => {
    if (!activeCommandQuery) return [];

    return getChatComposerCommandSuggestions(activeCommandQuery.query).slice(0, 8);
  }, [activeCommandQuery]);

  const mentionSuggestions = useMemo(() => {
    if (!activeMentionQuery) return [];

    const query = activeMentionQuery.query;

    return normalizedMentionOptions
      .filter((option) => {
        if (!query) return true;

        return getMentionSearchTerms(option).some((term) => term.startsWith(query));
      })
      .sort((left, right) => {
        const leftLabel = normalizeChatComposerSearch(left.label);
        const rightLabel = normalizeChatComposerSearch(right.label);
        const leftExact = leftLabel === query ? 1 : 0;
        const rightExact = rightLabel === query ? 1 : 0;

        if (leftExact !== rightExact) return rightExact - leftExact;

        return leftLabel.localeCompare(rightLabel);
      })
      .slice(0, 8);
  }, [activeMentionQuery, normalizedMentionOptions]);

  const locationSuggestions = useMemo(() => {
    if (!activeLocationQuery) return [];

    const query = activeLocationQuery.query;
    const current = normalizedLocationOptions.find((option) => option.isCurrent);
    const currentParent = current?.parentRuntimeEntryId || null;
    const adjacentIds = new Set(current?.adjacentRuntimeEntryIds || []);

    return normalizedLocationOptions
      .filter((option) => {
        if (!query) return true;
        return [option.label, ...option.aliases]
          .map(normalizeChatComposerSearch)
          .some((term) => term.startsWith(query) || term.includes(query));
      })
      .sort((left, right) => {
        const rank = (option) => {
          if (option.isCurrent) return 0;
          if (adjacentIds.has(option.runtimeEntryId)) return 1;
          if (currentParent && option.parentRuntimeEntryId === currentParent) return 2;
          return 3;
        };
        const rankDifference = rank(left) - rank(right);
        if (rankDifference) return rankDifference;
        return left.label.localeCompare(right.label);
      })
      .slice(0, 8);
  }, [activeLocationQuery, normalizedLocationOptions]);

  // Highlight reset and the empty-draft menu clear both happen inside
  // the query-mutating handler below rather than a useEffect keyed on
  // derived state (react-hooks/set-state-in-effect): every call that
  // changes a query is a real user event (change/click/keyup), so
  // resetting the highlight there is the direct cause, not a passive
  // sync.
  function updateSuggestionQueries(value, cursorPosition) {
    if (!String(value || "")) {
      setActiveMentionQuery(null);
      setActiveCommandQuery(null);
      setActiveLocationQuery(null);
      setHighlightedMentionIndex(0);
      setHighlightedCommandIndex(0);
      setHighlightedLocationIndex(0);
      return;
    }

    const { commandQuery, locationQuery, mentionQuery } =
      updateChatComposerSuggestionQueries(value, cursorPosition);

    setActiveCommandQuery(commandQuery);
    setActiveLocationQuery(locationQuery);
    setActiveMentionQuery(mentionQuery);
    setHighlightedCommandIndex(0);
    setHighlightedLocationIndex(0);
    setHighlightedMentionIndex(0);
  }

  function changeDraft(nextValue, cursorPosition) {
    setDraft?.(nextValue);
    setParticipantMentions?.(reconcileParticipantMentions(nextValue, normalizedMentions));
    setLocationMentions?.(reconcileLocationMentions(nextValue, normalizedLocationMentions));
    updateSuggestionQueries(nextValue, cursorPosition);
  }

  function selectMention(participantId) {
    if (!activeMentionQuery) return null;

    const option = normalizedMentionOptions.find((candidate) => candidate.id === participantId);
    if (!option) return null;

    const mentionText = `@${option.label}`;
    const prefix = String(draft || "").slice(0, activeMentionQuery.start);
    const suffix = String(draft || "").slice(activeMentionQuery.end);
    const separator = suffix.startsWith(" ") ? "" : " ";
    const nextValue = `${prefix}${mentionText}${separator}${suffix}`;
    const nextCursor = prefix.length + mentionText.length + separator.length;

    setDraft?.(nextValue);
    setParticipantMentions?.([
      ...normalizedMentions.filter((mention) => mention.participantId !== option.id),
      { participantId: option.id, displayName: option.label, mentionText },
    ]);
    setActiveMentionQuery(null);

    return nextCursor;
  }

  function selectCommand(commandName) {
    const command = commandSuggestions.find((candidate) => candidate.name === commandName);
    if (!command || !activeCommandQuery) return null;

    const nextValue = `/${command.name}`;
    const nextCursor = nextValue.length;

    setDraft?.(nextValue);
    setParticipantMentions?.([]);
    setLocationMentions?.([]);
    setActiveCommandQuery(null);
    setActiveMentionQuery(null);
    setActiveLocationQuery(null);

    return nextCursor;
  }

  function moveCommandHighlight(direction) {
    if (!commandSuggestions.length) return;

    setHighlightedCommandIndex((current) => {
      if (direction === "previous") {
        return current <= 0 ? commandSuggestions.length - 1 : current - 1;
      }

      return current >= commandSuggestions.length - 1 ? 0 : current + 1;
    });
  }

  function selectHighlightedCommand() {
    const command = commandSuggestions[highlightedCommandIndex];
    return command ? selectCommand(command.name) : null;
  }

  function highlightedCommandIsExact() {
    const command = commandSuggestions[highlightedCommandIndex];

    if (!command || !activeCommandQuery?.query) return false;

    return getChatComposerCommandSearchTerms(command).includes(activeCommandQuery.query);
  }

  function moveMentionHighlight(direction) {
    if (!mentionSuggestions.length) return;

    setHighlightedMentionIndex((current) => {
      if (direction === "previous") {
        return current <= 0 ? mentionSuggestions.length - 1 : current - 1;
      }

      return current >= mentionSuggestions.length - 1 ? 0 : current + 1;
    });
  }

  function selectHighlightedMention() {
    const option = mentionSuggestions[highlightedMentionIndex];
    return option ? selectMention(option.id) : null;
  }

  function selectLocation(runtimeEntryId) {
    if (!activeLocationQuery) return null;

    const option = normalizedLocationOptions.find(
      (candidate) => candidate.runtimeEntryId === runtimeEntryId
    );
    if (!option) return null;

    const mentionText = `#${option.label}`;
    const prefix = String(draft || "").slice(0, activeLocationQuery.start);
    const suffix = String(draft || "").slice(activeLocationQuery.end);
    const separator = suffix.startsWith(" ") ? "" : " ";
    const nextValue = `${prefix}${mentionText}${separator}${suffix}`;
    const nextCursor = prefix.length + mentionText.length + separator.length;

    setDraft?.(nextValue);
    setLocationMentions?.([
      ...normalizedLocationMentions.filter(
        (mention) => mention.runtimeEntryId !== option.runtimeEntryId
      ),
      { runtimeEntryId: option.runtimeEntryId, displayName: option.label, mentionText },
    ]);
    setActiveLocationQuery(null);

    return nextCursor;
  }

  function moveLocationHighlight(direction) {
    if (!locationSuggestions.length) return;

    setHighlightedLocationIndex((current) => {
      if (direction === "previous") {
        return current <= 0 ? locationSuggestions.length - 1 : current - 1;
      }

      return current >= locationSuggestions.length - 1 ? 0 : current + 1;
    });
  }

  function selectHighlightedLocation() {
    const option = locationSuggestions[highlightedLocationIndex];
    return option ? selectLocation(option.runtimeEntryId) : null;
  }

  const draftText = String(draft || "");
  const sending = Boolean(isSending);
  const composerDisabled = Boolean(disabled);
  const streaming = Boolean(streamingSupported) && Boolean(isStreaming);
  const autoContinuationAvailable =
    !draftText.trim() && String(speakerId || "AUTO") === "AUTO";

  function activateSpeaker(nextSpeakerId) {
    const option = normalizedSpeakerOptions.find((candidate) => candidate.id === nextSpeakerId);

    if (!option || composerDisabled || sending || streaming) return;

    if (["AUTO", "RANDOM"].includes(option.id)) {
      setSpeakerId?.(option.id);
      return;
    }

    setSpeakerId?.(option.id);

    if (draftText.trim()) {
      onSend?.({ requestedSpeakerId: option.id });
      return;
    }

    onSend?.({ requestedSpeakerId: option.id, actionType: "PLAYER_YIELD_TO_CHARACTER" });
  }

  function submitComposer(options = {}) {
    if (streaming) return;

    if (autoContinuationAvailable && !String(options?.actionType || "").trim()) {
      onSend?.({ requestedSpeakerId: "AUTO", actionType: "PLAYER_YIELD_TO_AUTO" });
      return;
    }

    onSend?.(options);
  }

  const sceneImageAvailable = Boolean(sceneImage?.available);
  const useCurrentSceneAvailable = Boolean(useCurrentScene?.available);

  return {
    modeOptions: MODE_OPTIONS,
    mode: String(mode || CHAT_COMPOSER_MODES.DIALOGUE),
    speakerOptions: normalizedSpeakerOptions,
    speakerId: String(speakerId || "AUTO"),
    draft: draftText,
    draftLength: draftText.length,
    showLengthCounter: draftText.length > CHAT_COMPOSER_DRAFT_SOFT_LIMIT,
    mentionSuggestions,
    highlightedMentionIndex,
    commandSuggestions,
    highlightedCommandIndex,
    highlightedCommandExact: highlightedCommandIsExact(),
    locationSuggestions,
    highlightedLocationIndex,
    placeholder: getPlaceholder(mode),
    textareaDisabled: composerDisabled || sending,
    sendDisabled:
      composerDisabled ||
      sending ||
      streaming ||
      (!draftText.trim() && !autoContinuationAvailable),
    isSending: sending,
    submitIsContinuation: autoContinuationAvailable,
    submitLabel: autoContinuationAvailable ? "Continue Scene" : "Send",
    submitPendingLabel: autoContinuationAvailable ? "Choosing next responder" : "Sending",
    streamingSupported: Boolean(streamingSupported),
    isStreaming: streaming,
    onStopGenerating: streamingSupported ? () => onStopGenerating?.() : null,
    sceneImageSeat: {
      available: sceneImageAvailable,
      costLabel: String(sceneImage?.costLabel || ""),
      pending: Boolean(sceneImage?.pending),
      onOpenConfirm: sceneImageAvailable ? () => setSceneImageConfirmOpen(true) : null,
    },
    sceneImageConfirmSheet: sceneImageConfirmOpen
      ? {
          open: true,
          costLabel: String(sceneImage?.costLabel || ""),
          pending: Boolean(sceneImage?.pending),
          error: String(sceneImage?.error || ""),
          onConfirm: () => sceneImage?.onConfirm?.(),
          onCancel: () => setSceneImageConfirmOpen(false),
        }
      : null,
    useCurrentSceneSeat: {
      available: useCurrentSceneAvailable,
      pending: Boolean(useCurrentScene?.pending),
      onUse: useCurrentSceneAvailable ? () => useCurrentScene?.onUse?.() : null,
    },
    onChangeMode: (nextValue) => setMode?.(nextValue),
    onChangeSpeaker: activateSpeaker,
    onChangeDraft: changeDraft,
    onUpdateSuggestionQueries: updateSuggestionQueries,
    onMoveMentionHighlight: moveMentionHighlight,
    onSelectHighlightedMention: selectHighlightedMention,
    onSelectMention: selectMention,
    onDismissMentionSuggestions: () => setActiveMentionQuery(null),
    onMoveCommandHighlight: moveCommandHighlight,
    onSelectHighlightedCommand: selectHighlightedCommand,
    onSelectCommand: selectCommand,
    onDismissCommandSuggestions: () => setActiveCommandQuery(null),
    onMoveLocationHighlight: moveLocationHighlight,
    onSelectHighlightedLocation: selectHighlightedLocation,
    onSelectLocation: selectLocation,
    onDismissLocationSuggestions: () => setActiveLocationQuery(null),
    onSend: submitComposer,
    onOpenCast: () => onOpenCast?.(),
    onOpenState: () => onOpenState?.(),
  };
}
