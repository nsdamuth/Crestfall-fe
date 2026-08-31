"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  cancelLoreEngineUseSubmission,
  fetchLoreEngineUseState,
  submitLoreForEngineUse,
  withdrawLoreEngineUseSubmission,
} from "@/lib/client/studio/creations/loreEngineUseClient";
import { fetchOwnedCreations } from "@/lib/client/studio/creations/creationClient";
import {
  LORE_ENGINE_USE_AVAILABILITY_MODES,
  LORE_ENGINE_USE_BINDING_SCOPE_TYPES,
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

function createDefaultKnowledgeTimePoint() {
  return { day: "", minutes: "" };
}

function createDefaultCharacterAccess() {
  return {
    scopeType: "ASSET",
    chapterId: "",
    sectionId: "",
    excludedChapterIds: [],
    excludedSectionIds: [],
    excludedBlockIds: [],
    availabilityMode: "ALWAYS",
    knowledgeAvailableFrom: createDefaultKnowledgeTimePoint(),
    knowledgeAvailableUntil: createDefaultKnowledgeTimePoint(),
    allowedScenarioIds: [],
    allowedRoomTemplateIds: [],
  };
}

function normalizeKnowledgeTimePoint(value) {
  const source = value && typeof value === "object" ? value : {};
  return {
    day: source.day ?? "",
    minutes: source.minutes ?? "",
  };
}

function normalizeCharacterAccess(value) {
  const source = value && typeof value === "object" ? value : {};
  return {
    ...createDefaultCharacterAccess(),
    ...source,
    knowledgeAvailableFrom: normalizeKnowledgeTimePoint(
      source.knowledgeAvailableFrom
    ),
    knowledgeAvailableUntil: normalizeKnowledgeTimePoint(
      source.knowledgeAvailableUntil
    ),
    excludedChapterIds: Array.isArray(source.excludedChapterIds)
      ? source.excludedChapterIds
      : [],
    excludedSectionIds: Array.isArray(source.excludedSectionIds)
      ? source.excludedSectionIds
      : [],
    excludedBlockIds: Array.isArray(source.excludedBlockIds)
      ? source.excludedBlockIds
      : [],
    allowedScenarioIds: Array.isArray(source.allowedScenarioIds)
      ? source.allowedScenarioIds
      : [],
    allowedRoomTemplateIds: Array.isArray(source.allowedRoomTemplateIds)
      ? source.allowedRoomTemplateIds
      : [],
  };
}

function normalizeContextOption(value) {
  const source = value && typeof value === "object" ? value : {};
  return {
    id: normalizeString(source.id),
    title: normalizeString(source.title) || "Untitled",
    status: normalizeStatus(source.status),
    visibility: normalizeStatus(source.visibility),
  };
}

function parseKnowledgeTimePoint(value) {
  const source = normalizeKnowledgeTimePoint(value);
  const day = Number(source.day);
  const minutes = Number(source.minutes);
  if (!Number.isInteger(day) || day < 1) return null;
  if (!Number.isInteger(minutes) || minutes < 0 || minutes > 10079) return null;
  return { day, minutes };
}

function compareKnowledgeTimePoints(left, right) {
  if (left.day !== right.day) return left.day - right.day;
  return left.minutes - right.minutes;
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
  const [scopeMode, setScopeModeState] = useState("ENTIRE_ASSET");
  const [selectedSectionIds, setSelectedSectionIds] = useState([]);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState([]);
  const [selectedLocationIds, setSelectedLocationIds] = useState([]);
  const [knowledgeModes, setKnowledgeModes] = useState({});
  const [characterAccess, setCharacterAccess] = useState({});
  const [configuredReleaseId, setConfiguredReleaseId] = useState("");
  const [storyContextOptions, setStoryContextOptions] = useState({
    scenarios: [],
    roomTemplates: [],
  });
  const [storyContextLoadStatus, setStoryContextLoadStatus] = useState("IDLE");
  const [storyContextLoadMessage, setStoryContextLoadMessage] = useState("");

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

  const loadStoryContextOptions = useCallback(async () => {
    if (!creationId) return;
    setStoryContextLoadStatus("LOADING");
    setStoryContextLoadMessage("");

    try {
      const [scenarios, roomTemplates] = await Promise.all([
        fetchOwnedCreations({ type: "SCENARIO" }),
        fetchOwnedCreations({ type: "ROOM_TEMPLATE" }),
      ]);
      setStoryContextOptions({
        scenarios: (Array.isArray(scenarios) ? scenarios : [])
          .map(normalizeContextOption)
          .filter((item) => item.id),
        roomTemplates: (Array.isArray(roomTemplates) ? roomTemplates : [])
          .map(normalizeContextOption)
          .filter((item) => item.id),
      });
      setStoryContextLoadStatus("READY");
    } catch (error) {
      setStoryContextOptions({ scenarios: [], roomTemplates: [] });
      setStoryContextLoadStatus("ERROR");
      setStoryContextLoadMessage(
        error.message || "Story context options could not be loaded."
      );
    }
  }, [creationId]);

  useEffect(() => {
    void loadState();
  }, [loadState]);

  useEffect(() => {
    void loadStoryContextOptions();
  }, [loadStoryContextOptions]);

  useEffect(() => {
    if (!sourceReleaseId || sourceReleaseId === configuredReleaseId) return;

    setConfiguredReleaseId(sourceReleaseId);
    setScopeModeState("ENTIRE_ASSET");
    setSelectedSectionIds([]);
    setSelectedCharacterIds([]);
    setSelectedLocationIds([]);
    setKnowledgeModes({});
    setCharacterAccess({});
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

  const availableChapters = useMemo(
    () =>
      (Array.isArray(source.chapters) ? source.chapters : []).map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
      })),
    [source.chapters]
  );

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

  const availableBlocks = useMemo(
    () =>
      availableSections.flatMap((section) =>
        (Array.isArray(section.blocks) ? section.blocks : []).map((block) => ({
          ...block,
          chapterId: section.chapterId,
          chapterTitle: section.chapterTitle,
          sectionId: section.id,
          sectionTitle: section.title,
        }))
      ),
    [availableSections]
  );

  const includedSections = useMemo(
    () =>
      scopeMode === "SELECTED_SECTIONS"
        ? availableSections.filter((section) =>
            selectedSectionIds.includes(section.id)
          )
        : availableSections,
    [availableSections, scopeMode, selectedSectionIds]
  );

  const includedSectionIds = useMemo(
    () => new Set(includedSections.map((section) => section.id)),
    [includedSections]
  );

  const includedChapterIds = useMemo(
    () => new Set(includedSections.map((section) => section.chapterId)),
    [includedSections]
  );

  const characterRefs = Array.isArray(source.characterRefs)
    ? source.characterRefs
    : [];
  const locationRefs = Array.isArray(source.locationRefs)
    ? source.locationRefs
    : [];

  const setScopeMode = useCallback((nextMode) => {
    setScopeModeState(nextMode);
    setSelectedSectionIds([]);
    setCharacterAccess((current) =>
      Object.fromEntries(
        Object.keys(current).map((characterId) => [
          characterId,
          createDefaultCharacterAccess(),
        ])
      )
    );
  }, []);

  const toggleSection = useCallback((sectionId) => {
    setSelectedSectionIds((current) => toggleId(current, sectionId));
  }, []);

  const toggleCharacter = useCallback((characterId) => {
    setSelectedCharacterIds((current) => toggleId(current, characterId));
    setKnowledgeModes((current) => ({
      ...current,
      [characterId]: current[characterId] || "SECONDHAND",
    }));
    setCharacterAccess((current) => ({
      ...current,
      [characterId]: normalizeCharacterAccess(current[characterId]),
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

  const setCharacterScopeType = useCallback((characterId, scopeType) => {
    setCharacterAccess((current) => ({
      ...current,
      [characterId]: {
        ...normalizeCharacterAccess(current[characterId]),
        scopeType,
        chapterId: "",
        sectionId: "",
        excludedChapterIds: [],
        excludedSectionIds: [],
        excludedBlockIds: [],
      },
    }));
  }, []);

  const setCharacterScopeChapter = useCallback((characterId, chapterId) => {
    setCharacterAccess((current) => ({
      ...current,
      [characterId]: {
        ...normalizeCharacterAccess(current[characterId]),
        chapterId,
        sectionId: "",
        excludedChapterIds: [],
        excludedSectionIds: [],
        excludedBlockIds: [],
      },
    }));
  }, []);

  const setCharacterScopeSection = useCallback((characterId, sectionId) => {
    setCharacterAccess((current) => ({
      ...current,
      [characterId]: {
        ...normalizeCharacterAccess(current[characterId]),
        sectionId,
        excludedChapterIds: [],
        excludedSectionIds: [],
        excludedBlockIds: [],
      },
    }));
  }, []);

  const toggleCharacterExclusion = useCallback((characterId, field, id) => {
    setCharacterAccess((current) => {
      const access = normalizeCharacterAccess(current[characterId]);
      return {
        ...current,
        [characterId]: {
          ...access,
          [field]: toggleId(access[field] || [], id),
        },
      };
    });
  }, []);

  const setCharacterAvailabilityMode = useCallback((characterId, mode) => {
    setCharacterAccess((current) => {
      const access = normalizeCharacterAccess(current[characterId]);
      const next = { ...access, availabilityMode: mode };
      if (mode === "ALWAYS") {
        next.knowledgeAvailableFrom = createDefaultKnowledgeTimePoint();
        next.knowledgeAvailableUntil = createDefaultKnowledgeTimePoint();
      } else if (mode === "FROM") {
        next.knowledgeAvailableUntil = createDefaultKnowledgeTimePoint();
      } else if (mode === "UNTIL") {
        next.knowledgeAvailableFrom = createDefaultKnowledgeTimePoint();
      }
      return { ...current, [characterId]: next };
    });
  }, []);

  const setCharacterKnowledgeTimeField = useCallback(
    (characterId, boundary, field, value) => {
      setCharacterAccess((current) => {
        const access = normalizeCharacterAccess(current[characterId]);
        const point = normalizeKnowledgeTimePoint(access[boundary]);
        return {
          ...current,
          [characterId]: {
            ...access,
            [boundary]: { ...point, [field]: value },
          },
        };
      });
    },
    []
  );

  const toggleCharacterContextAllowlist = useCallback(
    (characterId, field, id) => {
      setCharacterAccess((current) => {
        const access = normalizeCharacterAccess(current[characterId]);
        return {
          ...current,
          [characterId]: {
            ...access,
            [field]: toggleId(access[field] || [], id),
          },
        };
      });
    },
    []
  );

  const isCharacterAccessValid = useCallback(
    (characterId) => {
      const access = normalizeCharacterAccess(characterAccess[characterId]);
      if (access.scopeType === "CHAPTER") {
        if (!access.chapterId || !includedChapterIds.has(access.chapterId)) {
          return false;
        }
      } else if (access.scopeType === "SECTION") {
        if (!access.sectionId || !includedSectionIds.has(access.sectionId)) {
          return false;
        }
      } else if (access.scopeType !== "ASSET") {
        return false;
      }

      const mode = access.availabilityMode || "ALWAYS";
      const from = parseKnowledgeTimePoint(access.knowledgeAvailableFrom);
      const until = parseKnowledgeTimePoint(access.knowledgeAvailableUntil);
      if (mode === "FROM" && !from) return false;
      if (mode === "UNTIL" && !until) return false;
      if (mode === "BETWEEN") {
        if (!from || !until || compareKnowledgeTimePoints(from, until) > 0) {
          return false;
        }
      } else if (!["ALWAYS", "FROM", "UNTIL"].includes(mode)) {
        return false;
      }

      return true;
    },
    [characterAccess, includedChapterIds, includedSectionIds]
  );

  const canSubmit =
    Boolean(creationId && sourceReleaseId) &&
    !isActive &&
    actionStatus !== "WORKING" &&
    selectedCharacterIds.length > 0 &&
    (scopeMode === "ENTIRE_ASSET" || selectedSectionIds.length > 0) &&
    selectedCharacterIds.every(isCharacterAccessValid);

  const submit = useCallback(async () => {
    if (!canSubmit) return;

    setActionStatus("WORKING");
    setActionMessage("");

    try {
      const nextState = await submitLoreForEngineUse(creationId, {
        publicReleaseId: sourceReleaseId,
        scopeMode,
        selectedSectionIds,
        characterBindings: selectedCharacterIds.map((subjectId) => {
          const access = normalizeCharacterAccess(characterAccess[subjectId]);
          return {
            subjectId,
            knowledgeMode: knowledgeModes[subjectId] || "SECONDHAND",
            scopeType: access.scopeType,
            chapterId: access.chapterId || null,
            sectionId: access.sectionId || null,
            excludedChapterIds: access.excludedChapterIds,
            excludedSectionIds: access.excludedSectionIds,
            excludedBlockIds: access.excludedBlockIds,
            knowledgeAvailableFrom: ["FROM", "BETWEEN"].includes(
              access.availabilityMode
            )
              ? parseKnowledgeTimePoint(access.knowledgeAvailableFrom)
              : null,
            knowledgeAvailableUntil: ["UNTIL", "BETWEEN"].includes(
              access.availabilityMode
            )
              ? parseKnowledgeTimePoint(access.knowledgeAvailableUntil)
              : null,
            allowedScenarioIds: access.allowedScenarioIds,
            allowedRoomTemplateIds: access.allowedRoomTemplateIds,
          };
        }),
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
    characterAccess,
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
    characterAccess,
    knowledgeModeOptions: LORE_ENGINE_USE_KNOWLEDGE_MODES,
    availabilityModeOptions: LORE_ENGINE_USE_AVAILABILITY_MODES,
    characterScopeOptions: LORE_ENGINE_USE_BINDING_SCOPE_TYPES,
    availableChapters,
    availableSections,
    availableBlocks,
    includedSections,
    characterRefs,
    locationRefs,
    storyContextOptions,
    storyContextLoadStatus,
    storyContextLoadMessage,
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
    setCharacterScopeType,
    setCharacterScopeChapter,
    setCharacterScopeSection,
    toggleCharacterExclusion,
    setCharacterAvailabilityMode,
    setCharacterKnowledgeTimeField,
    toggleCharacterContextAllowlist,
    submit,
    cancel,
    withdraw,
    refresh: () => loadState(),
  };
}
