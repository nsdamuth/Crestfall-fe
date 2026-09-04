"use client";

import { useEffect, useMemo, useState } from "react";

import {
  getStoryRoomCommandSearchTerms,
  getStoryRoomCommandSuggestions,
} from "./storyRoomCommandRegistry";

const INPUT_MODE_OPTIONS = [
  { value: "DIALOGUE", label: "Dialogue" },
  { value: "ACTION", label: "Action" },
  { value: "OOC", label: "OOC / Note" },
  { value: "DIRECT", label: "Direct / GM" },
];

function normalizeMentionSearch(value) {
  return String(value || "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^\p{L}\p{N}'-]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getMentionSearchTerms(option) {
  const normalizedLabel = normalizeMentionSearch(option?.label);

  return [normalizedLabel, ...normalizedLabel.split(" ")].filter(Boolean);
}

function findActiveMentionQuery(value, cursorPosition) {
  const beforeCursor = String(value || "").slice(0, cursorPosition);
  const match = /(?:^|[\s([{])@([\p{L}\p{N}'’_-]*)$/u.exec(beforeCursor);

  if (!match) return null;

  const start = beforeCursor.lastIndexOf("@");

  return {
    start,
    end: cursorPosition,
    query: normalizeMentionSearch(match[1].replace(/_/g, " ")),
  };
}


function findActiveCommandQuery(value, cursorPosition) {
  const beforeCursor = String(value || "").slice(0, cursorPosition);
  const match = /^\/([^\s/]*)$/u.exec(beforeCursor);

  if (!match) return null;

  return {
    start: 0,
    end: cursorPosition,
    query: String(match[1] || "").trim().toLowerCase(),
  };
}

function findActiveLocationQuery(value, cursorPosition) {
  const beforeCursor = String(value || "").slice(0, cursorPosition);
  const match = /(?:^|[\s([{])#([\p{L}\p{N}'’ _-]*)$/u.exec(beforeCursor);

  if (!match) return null;

  return {
    start: beforeCursor.lastIndexOf("#"),
    end: cursorPosition,
    query: normalizeMentionSearch(match[1].replace(/_/g, " ")),
  };
}

function normalizeMentions(mentions = []) {
  return (Array.isArray(mentions) ? mentions : [])
    .map((mention) => ({
      participantId: String(mention?.participantId || "").trim(),
      targetKind: String(mention?.targetKind || "").trim() || null,
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
      registryCreationId: String(mention?.registryCreationId || "").trim(),
      registryEntryId: String(mention?.registryEntryId || "").trim(),
      linkedLocationCreationId:
        String(mention?.linkedLocationCreationId || "").trim() || null,
      targetKind: String(mention?.targetKind || "").trim() || null,
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
      registryCreationId: String(option?.registryCreationId || "").trim(),
      registryEntryId: String(option?.registryEntryId || "").trim(),
      linkedLocationCreationId:
        String(option?.linkedLocationCreationId || "").trim() || null,
      label: String(option?.label || "").trim(),
      aliases: Array.isArray(option?.aliases) ? option.aliases.filter(Boolean) : [],
      locationScale: String(option?.locationScale || "").trim(),
      registryTitle: String(option?.registryTitle || "").trim(),
      parentRuntimeEntryId:
        String(option?.parentRuntimeEntryId || "").trim() || null,
      adjacentRuntimeEntryIds: Array.isArray(option?.adjacentRuntimeEntryIds)
        ? option.adjacentRuntimeEntryIds.filter(Boolean)
        : [],
      isCurrent: Boolean(option?.isCurrent),
      targetKind: String(option?.targetKind || "").trim() || null,
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
      participantType: String(option?.participantType || "").trim(),
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
      targetKind: String(option?.targetKind || "").trim() || null,
      mentionAlias: `@${normalizeMentionSearch(option?.label).split(" ")[0] || "character"}`,
    }))
    .filter((option) => option.id && option.label);
}

function getPlaceholder(inputMode) {
  if (inputMode === "ACTION") {
    return "Describe an action visible in the scene...";
  }

  if (inputMode === "DIRECT") {
    return "Steer pacing, scene direction, or GM-style movement...";
  }

  if (inputMode === "OOC") {
    return "Write an OOC note...";
  }

  return "Write dialogue or natural player input...";
}

export function useStoryRoomComposerViewModel({
  inputMode = "DIALOGUE",
  setInputMode,
  nextSpeaker = "AUTO",
  setNextSpeaker,
  nextSpeakerOptions = [],
  draft = "",
  setDraft,
  participantMentions = [],
  setParticipantMentions,
  participantMentionOptions = [],
  locationMentions = [],
  setLocationMentions,
  locationMentionOptions = [],
  commandOptions = [],
  onSend,
  onOpenCast,
  onOpenState,
  isSending = false,
  disabled = false,
  disabledReason = "",
} = {}) {
  const [activeMentionQuery, setActiveMentionQuery] = useState(null);
  const [highlightedMentionIndex, setHighlightedMentionIndex] = useState(0);
  const [activeCommandQuery, setActiveCommandQuery] = useState(null);
  const [highlightedCommandIndex, setHighlightedCommandIndex] = useState(0);
  const [activeLocationQuery, setActiveLocationQuery] = useState(null);
  const [highlightedLocationIndex, setHighlightedLocationIndex] = useState(0);

  const normalizedSpeakerOptions = useMemo(
    () => normalizeSpeakerOptions(nextSpeakerOptions),
    [nextSpeakerOptions]
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

    return getStoryRoomCommandSuggestions(
      activeCommandQuery.query,
      commandOptions
    ).slice(0, 8);
  }, [activeCommandQuery, commandOptions]);

  const mentionSuggestions = useMemo(() => {
    if (!activeMentionQuery) return [];

    const query = activeMentionQuery.query;

    return normalizedMentionOptions
      .filter((option) => {
        if (!query) return true;

        return getMentionSearchTerms(option).some((term) =>
          term.startsWith(query)
        );
      })
      .sort((left, right) => {
        const leftLabel = normalizeMentionSearch(left.label);
        const rightLabel = normalizeMentionSearch(right.label);
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
          .map(normalizeMentionSearch)
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

  useEffect(() => {
    setHighlightedMentionIndex(0);
  }, [activeMentionQuery?.query]);

  useEffect(() => {
    setHighlightedCommandIndex(0);
  }, [activeCommandQuery?.query]);

  useEffect(() => {
    setHighlightedLocationIndex(0);
  }, [activeLocationQuery?.query]);

  useEffect(() => {
    if (!String(draft || "")) {
      setActiveMentionQuery(null);
      setActiveCommandQuery(null);
      setActiveLocationQuery(null);
    }
  }, [draft]);

  function updateSuggestionQueries(value, cursorPosition) {
    const normalizedCursor = Number(cursorPosition) || 0;
    const commandQuery = findActiveCommandQuery(value, normalizedCursor);

    const locationQuery = commandQuery
      ? null
      : findActiveLocationQuery(value, normalizedCursor);

    setActiveCommandQuery(commandQuery);
    setActiveLocationQuery(locationQuery);
    setActiveMentionQuery(
      commandQuery || locationQuery
        ? null
        : findActiveMentionQuery(value, normalizedCursor)
    );
  }

  function changeDraft(nextValue, cursorPosition) {
    setDraft?.(nextValue);
    setParticipantMentions?.(
      reconcileParticipantMentions(nextValue, normalizedMentions)
    );
    setLocationMentions?.(
      reconcileLocationMentions(nextValue, normalizedLocationMentions)
    );
    updateSuggestionQueries(nextValue, cursorPosition);
  }

  function selectMention(participantId) {
    if (!activeMentionQuery) return null;

    const option = normalizedMentionOptions.find(
      (candidate) => candidate.id === participantId
    );

    if (!option) return null;

    const mentionText = `@${option.label}`;
    const prefix = String(draft || "").slice(0, activeMentionQuery.start);
    const suffix = String(draft || "").slice(activeMentionQuery.end);
    const separator = suffix.startsWith(" ") ? "" : " ";
    const nextValue = `${prefix}${mentionText}${separator}${suffix}`;
    const nextCursor = prefix.length + mentionText.length + separator.length;

    setDraft?.(nextValue);
    setParticipantMentions?.([
      ...normalizedMentions.filter(
        (mention) => mention.participantId !== option.id
      ),
      {
        participantId: option.id,
        targetKind: option.targetKind || null,
        displayName: option.label,
        mentionText,
      },
    ]);
    setActiveMentionQuery(null);

    return nextCursor;
  }

  function selectCommand(commandName) {
    const command = commandSuggestions.find(
      (candidate) => candidate.name === commandName
    );

    if (!command || !activeCommandQuery) return null;

    const nextValue = command.requiresArguments
      ? `/${command.name} `
      : `/${command.name}`;
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

    return (
      command.requiresArguments !== true &&
      getStoryRoomCommandSearchTerms(command).includes(activeCommandQuery.query)
    );
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
      {
        runtimeEntryId: option.runtimeEntryId,
        registryCreationId: option.registryCreationId,
        registryEntryId: option.registryEntryId,
        linkedLocationCreationId: option.linkedLocationCreationId,
        targetKind: option.targetKind || null,
        displayName: option.label,
        mentionText,
      },
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

  function activateSpeaker(speakerId) {
    const option = normalizedSpeakerOptions.find(
      (candidate) => candidate.id === speakerId
    );

    if (!option || composerDisabled || sending) return;

    if (["AUTO", "RANDOM"].includes(option.id)) {
      setNextSpeaker?.(option.id);
      return;
    }

    setNextSpeaker?.(option.id);

    if (String(draft || "").trim()) {
      onSend?.({ requestedSpeakerId: option.id });
      return;
    }

    onSend?.({
      requestedSpeakerId: option.id,
      actionType: "PLAYER_YIELD_TO_CHARACTER",
    });
  }

  const draftText = String(draft || "");
  const sending = Boolean(isSending);
  const composerDisabled = Boolean(disabled);
  const autoContinuationAvailable =
    !draftText.trim() && String(nextSpeaker || "AUTO") === "AUTO";

  function submitComposer(options = {}) {
    if (
      autoContinuationAvailable &&
      !String(options?.actionType || "").trim()
    ) {
      onSend?.({
        requestedSpeakerId: "AUTO",
        actionType: "PLAYER_YIELD_TO_AUTO",
      });
      return;
    }

    onSend?.(options);
  }

  return {
    inputModeOptions: INPUT_MODE_OPTIONS,
    inputMode: String(inputMode || "DIALOGUE"),
    nextSpeakerOptions: normalizedSpeakerOptions,
    nextSpeaker: String(nextSpeaker || "AUTO"),
    draft: draftText,
    mentionSuggestions,
    highlightedMentionIndex,
    commandSuggestions,
    highlightedCommandIndex,
    highlightedCommandExact: highlightedCommandIsExact(),
    locationSuggestions,
    highlightedLocationIndex,
    placeholder: getPlaceholder(inputMode),
    disabledReason: composerDisabled ? String(disabledReason || "") : "",
    textareaDisabled: composerDisabled || sending,
    sendDisabled:
      composerDisabled || sending || (!draftText.trim() && !autoContinuationAvailable),
    isSending: sending,
    submitIsContinuation: autoContinuationAvailable,
    submitLabel: autoContinuationAvailable ? "Continue Scene" : "Send",
    submitPendingLabel: autoContinuationAvailable
      ? "Choosing next responder..."
      : "Sending...",
    onChangeInputMode: (nextValue) => setInputMode?.(nextValue),
    onChangeNextSpeaker: activateSpeaker,
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
