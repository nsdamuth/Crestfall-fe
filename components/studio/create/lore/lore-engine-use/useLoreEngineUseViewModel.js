"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  cancelLoreEngineUseSubmission,
  fetchLoreEngineUseState,
  submitLoreForEngineUse,
  withdrawLoreEngineUseSubmission,
} from "@/lib/client/studio/creations/loreEngineUseClient";
import {
  LORE_ENGINE_USE_CONTRACT_VERSION,
  LORE_ENGINE_USE_KNOWLEDGE_MODES,
} from "./LoreEngineUse.contract";

const ACTIVE_STATUSES = new Set([
  "QUEUED",
  "PREPARING",
  "INDEXING",
  "VERIFYING",
  "CANCELLING",
]);

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeStatus(value) {
  return normalizeString(value).toUpperCase();
}

function toggleId(list, id) {
  return list.includes(id)
    ? list.filter((item) => item !== id)
    : [...list, id];
}

export function useLoreEngineUseViewModel({ creationId = "" } = {}) {
  const [state, setState] = useState({
    source: {},
    submissions: [],
    latest: null,
  });
  const [loadStatus, setLoadStatus] = useState("IDLE");
  const [loadMessage, setLoadMessage] = useState("");
  const [actionStatus, setActionStatus] = useState("IDLE");
  const [actionMessage, setActionMessage] = useState("");
  const [scopeMode, setScopeMode] = useState("ENTIRE_ASSET");
  const [selectedSectionIds, setSelectedSectionIds] = useState([]);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState([]);
  const [selectedLocationIds, setSelectedLocationIds] = useState([]);
  const [knowledgeModes, setKnowledgeModes] = useState({});
  const [configuredReleaseId, setConfiguredReleaseId] = useState("");

  const source = state.source || {};
  const submissions = Array.isArray(state.submissions)
    ? state.submissions
    : [];
  const latest = state.latest || null;
  const latestStatus = normalizeStatus(latest?.status);
  const isActive = ACTIVE_STATUSES.has(latestStatus);
  const sourceReleaseId = normalizeString(source.publicReleaseId);

  const loadState = useCallback(
    async ({ quiet = false } = {}) => {
      if (!creationId) return;
      if (!quiet) {
        setLoadStatus("LOADING");
        setLoadMessage("");
      }

      try {
        const nextState = await fetchLoreEngineUseState(creationId);
        setState({
          source: nextState?.source || {},
          submissions: Array.isArray(nextState?.submissions)
            ? nextState.submissions
            : [],
          latest: nextState?.latest || null,
        });
        setLoadStatus("READY");
      } catch (error) {
        setLoadStatus("ERROR");
        setLoadMessage(
          error.message || "Lore engine-use status could not be loaded."
        );
      }
    },
    [creationId]
  );

  useEffect(() => {
    void loadState();
  }, [loadState]);

  useEffect(() => {
    if (!sourceReleaseId || sourceReleaseId === configuredReleaseId) return;

    setConfiguredReleaseId(sourceReleaseId);
    setScopeMode("ENTIRE_ASSET");
    setSelectedSectionIds([]);
    setSelectedCharacterIds([]);
    setSelectedLocationIds([]);
    setKnowledgeModes({});
    setActionStatus("IDLE");
    setActionMessage("");
  }, [configuredReleaseId, sourceReleaseId]);

  useEffect(() => {
    if (!isActive || !creationId) return undefined;

    const interval = window.setInterval(() => {
      void loadState({ quiet: true });
    }, 10000);

    return () => window.clearInterval(interval);
  }, [creationId, isActive, loadState]);

  const availableSections = useMemo(
    () =>
      (Array.isArray(source.chapters) ? source.chapters : []).flatMap(
        (chapter) =>
          (Array.isArray(chapter.sections) ? chapter.sections : []).map(
            (section) => ({
              ...section,
              chapterId: chapter.id,
              chapterTitle: chapter.title,
            })
          )
      ),
    [source.chapters]
  );

  const characterRefs = Array.isArray(source.characterRefs)
    ? source.characterRefs
    : [];
  const locationRefs = Array.isArray(source.locationRefs)
    ? source.locationRefs
    : [];

  const toggleSection = useCallback((sectionId) => {
    setSelectedSectionIds((current) => toggleId(current, sectionId));
  }, []);

  const toggleCharacter = useCallback((characterId) => {
    setSelectedCharacterIds((current) => toggleId(current, characterId));
    setKnowledgeModes((current) => ({
      ...current,
      [characterId]: current[characterId] || "SECONDHAND",
    }));
  }, []);

  const toggleLocation = useCallback((locationId) => {
    setSelectedLocationIds((current) => toggleId(current, locationId));
  }, []);

  const setCharacterKnowledgeMode = useCallback((characterId, mode) => {
    setKnowledgeModes((current) => ({
      ...current,
      [characterId]: mode,
    }));
  }, []);

  const canSubmit =
    Boolean(creationId && sourceReleaseId) &&
    !isActive &&
    actionStatus !== "WORKING" &&
    selectedCharacterIds.length > 0 &&
    (scopeMode === "ENTIRE_ASSET" || selectedSectionIds.length > 0);

  const submit = useCallback(async () => {
    if (!canSubmit) return;

    setActionStatus("WORKING");
    setActionMessage("");

    try {
      const nextState = await submitLoreForEngineUse(creationId, {
        publicReleaseId: sourceReleaseId,
        scopeMode,
        selectedSectionIds,
        characterBindings: selectedCharacterIds.map((subjectId) => ({
          subjectId,
          knowledgeMode: knowledgeModes[subjectId] || "SECONDHAND",
        })),
        locationBindings: selectedLocationIds.map((subjectId) => ({
          subjectId,
        })),
      });

      setState({
        source: nextState?.source || {},
        submissions: Array.isArray(nextState?.submissions)
          ? nextState.submissions
          : [],
        latest: nextState?.latest || null,
      });
      setActionStatus("SUCCESS");
      setActionMessage(
        "The active public Lore revision was submitted for engine use."
      );
    } catch (error) {
      setActionStatus("ERROR");
      setActionMessage(
        error.message || "Lore could not be submitted for engine use."
      );
    }
  }, [
    canSubmit,
    creationId,
    knowledgeModes,
    scopeMode,
    selectedCharacterIds,
    selectedLocationIds,
    selectedSectionIds,
    sourceReleaseId,
  ]);

  const cancel = useCallback(async () => {
    if (!creationId || !latest?.id || actionStatus === "WORKING") return;

    setActionStatus("WORKING");
    setActionMessage("");

    try {
      const nextState = await cancelLoreEngineUseSubmission(
        creationId,
        latest.id
      );
      setState({
        source: nextState?.source || {},
        submissions: Array.isArray(nextState?.submissions)
          ? nextState.submissions
          : [],
        latest: nextState?.latest || null,
      });
      setActionStatus("SUCCESS");
      setActionMessage("The engine-use submission was cancelled.");
    } catch (error) {
      setActionStatus("ERROR");
      setActionMessage(
        error.message || "The engine-use submission could not be cancelled."
      );
    }
  }, [actionStatus, creationId, latest?.id]);

  const withdraw = useCallback(async () => {
    if (!creationId || !latest?.id || actionStatus === "WORKING") return;

    setActionStatus("WORKING");
    setActionMessage("");

    try {
      const nextState = await withdrawLoreEngineUseSubmission(
        creationId,
        latest.id
      );
      setState({
        source: nextState?.source || {},
        submissions: Array.isArray(nextState?.submissions)
          ? nextState.submissions
          : [],
        latest: nextState?.latest || null,
      });
      setActionStatus("SUCCESS");
      setActionMessage("The Lore revision was withdrawn from engine use.");
    } catch (error) {
      setActionStatus("ERROR");
      setActionMessage(
        error.message || "The Lore revision could not be withdrawn."
      );
    }
  }, [actionStatus, creationId, latest?.id]);

  return {
    contractVersion: LORE_ENGINE_USE_CONTRACT_VERSION,
    source,
    submissions,
    latest,
    latestStatus,
    isActive,
    loadStatus,
    loadMessage,
    actionStatus,
    actionMessage,
    scopeMode,
    selectedSectionIds,
    selectedCharacterIds,
    selectedLocationIds,
    knowledgeModes,
    knowledgeModeOptions: LORE_ENGINE_USE_KNOWLEDGE_MODES,
    availableSections,
    characterRefs,
    locationRefs,
    canSubmit,
    canCancel:
      ["QUEUED", "PREPARING"].includes(latestStatus) &&
      actionStatus !== "WORKING",
    canWithdraw:
      ["PREPARED", "READY", "ACTIVE"].includes(latestStatus) &&
      actionStatus !== "WORKING",
    setScopeMode,
    toggleSection,
    toggleCharacter,
    toggleLocation,
    setCharacterKnowledgeMode,
    submit,
    cancel,
    withdraw,
    refresh: () => loadState(),
  };
}
