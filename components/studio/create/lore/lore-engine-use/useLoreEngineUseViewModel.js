"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import {
  buildLoreEngineUseAuthoringConfiguration,
  buildLoreEngineUseDraftSource,
  projectLoreEngineUseConfigurationToAuthoringState,
  validateLoreEngineUseJsonText,
} from "./loreEngineUseJsonEditor.validation";

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

export function useLoreEngineUseViewModel({
  creationId = "",
  draftDocument = {},
  draftTitle = "",
  onDraftEngineUseChange = null,
} = {}) {
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
  const [jsonEditorOpen, setJsonEditorOpen] = useState(false);
  const draftHydrationReadyRef = useRef(false);
  const draftAuthoringDirtyRef = useRef(false);
  const lastHydratedDraftFingerprintRef = useRef("");
  const lastWrittenDraftFingerprintRef = useRef("");

  const publishedSource = state.source || {};
  const submissions = Array.isArray(state.submissions)
    ? state.submissions
    : [];
  const latest = state.latest || null;
  const latestStatus = normalizeStatus(latest?.status);
  const isActive = ACTIVE_STATUSES.has(latestStatus);
  const sourceReleaseId = normalizeString(publishedSource.publicReleaseId);
  const draftSource = useMemo(
    () =>
      buildLoreEngineUseDraftSource({
        document: draftDocument,
        title: draftTitle,
      }),
    [draftDocument, draftTitle]
  );
  const source = sourceReleaseId ? publishedSource : draftSource;
  const hasDraftAuthoringSource =
    !sourceReleaseId &&
    (source.chapters.length > 0 || source.characterRefs.length > 0);
  const draftEngineUseConfiguration = useMemo(() => {
    const metadata =
      draftDocument?.metadata &&
      typeof draftDocument.metadata === "object" &&
      !Array.isArray(draftDocument.metadata)
        ? draftDocument.metadata
        : {};
    const configuration = metadata.engineUseAuthoring;
    return configuration &&
      typeof configuration === "object" &&
      !Array.isArray(configuration)
      ? configuration
      : null;
  }, [draftDocument]);
  const draftEngineUseFingerprint = useMemo(
    () => JSON.stringify(draftEngineUseConfiguration || null),
    [draftEngineUseConfiguration]
  );
  const hasStoredDraftAuthoringConfiguration = Boolean(
    !sourceReleaseId && draftEngineUseConfiguration
  );

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
    draftHydrationReadyRef.current = false;
    draftAuthoringDirtyRef.current = false;
    lastHydratedDraftFingerprintRef.current = "";
    lastWrittenDraftFingerprintRef.current = "";
  }, [creationId]);

  useEffect(() => {
    if (sourceReleaseId) {
      draftHydrationReadyRef.current = false;
      return;
    }

    if (!draftEngineUseConfiguration) {
      draftHydrationReadyRef.current = true;
      lastHydratedDraftFingerprintRef.current = "";
      return;
    }

    if (
      draftEngineUseFingerprint === lastHydratedDraftFingerprintRef.current ||
      draftEngineUseFingerprint === lastWrittenDraftFingerprintRef.current
    ) {
      draftHydrationReadyRef.current = true;
      return;
    }

    const validation = validateLoreEngineUseJsonText(
      JSON.stringify(draftEngineUseConfiguration),
      {
        source: draftSource,
        storyContextOptions,
        storyContextLoadStatus,
      }
    );

    lastHydratedDraftFingerprintRef.current = draftEngineUseFingerprint;
    draftHydrationReadyRef.current = true;

    if (!validation.valid || !validation.data) {
      setActionStatus("ERROR");
      setActionMessage(
        `Stored draft Engine Use configuration could not be loaded: ${
          validation.errors[0]?.message || "invalid configuration"
        }`
      );
      return;
    }

    const projected = projectLoreEngineUseConfigurationToAuthoringState(
      validation.data
    );
    setScopeModeState(projected.scopeMode);
    setSelectedSectionIds(projected.selectedSectionIds);
    setSelectedCharacterIds(projected.selectedCharacterIds);
    setSelectedLocationIds(projected.selectedLocationIds);
    setKnowledgeModes(projected.knowledgeModes);
    setCharacterAccess(projected.characterAccess);
    setActionStatus("SUCCESS");
    setActionMessage(
      "Staged Engine Use configuration loaded from the current Lore draft."
    );
  }, [
    draftEngineUseConfiguration,
    draftEngineUseFingerprint,
    draftSource,
    sourceReleaseId,
    storyContextLoadStatus,
    storyContextOptions,
  ]);

  useEffect(() => {
    if (!sourceReleaseId || sourceReleaseId === configuredReleaseId) return;

    if (!configuredReleaseId) {
      setConfiguredReleaseId(sourceReleaseId);
      setJsonEditorOpen(false);
      if (selectedCharacterIds.length) {
        setActionStatus("SUCCESS");
        setActionMessage(
          "The first public Lore revision is available. The staged Engine Use configuration was preserved; review it against the published source before submitting."
        );
      }
      return;
    }

    setConfiguredReleaseId(sourceReleaseId);
    setScopeModeState("ENTIRE_ASSET");
    setSelectedSectionIds([]);
    setSelectedCharacterIds([]);
    setSelectedLocationIds([]);
    setKnowledgeModes({});
    setCharacterAccess({});
    setJsonEditorOpen(false);
    setActionStatus("IDLE");
    setActionMessage("");
  }, [configuredReleaseId, selectedCharacterIds.length, sourceReleaseId]);

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

  const markDraftAuthoringDirty = useCallback(() => {
    if (!sourceReleaseId) {
      draftAuthoringDirtyRef.current = true;
    }
  }, [sourceReleaseId]);

  const setScopeMode = useCallback((nextMode) => {
    markDraftAuthoringDirty();
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
  }, [markDraftAuthoringDirty]);

  const toggleSection = useCallback((sectionId) => {
    markDraftAuthoringDirty();
    setSelectedSectionIds((current) => toggleId(current, sectionId));
  }, [markDraftAuthoringDirty]);

  const toggleCharacter = useCallback((characterId) => {
    markDraftAuthoringDirty();
    setSelectedCharacterIds((current) => toggleId(current, characterId));
    setKnowledgeModes((current) => ({
      ...current,
      [characterId]: current[characterId] || "SECONDHAND",
    }));
    setCharacterAccess((current) => ({
      ...current,
      [characterId]: normalizeCharacterAccess(current[characterId]),
    }));
  }, [markDraftAuthoringDirty]);

  const toggleLocation = useCallback((locationId) => {
    markDraftAuthoringDirty();
    setSelectedLocationIds((current) => toggleId(current, locationId));
  }, [markDraftAuthoringDirty]);

  const setCharacterKnowledgeMode = useCallback((characterId, mode) => {
    markDraftAuthoringDirty();
    setKnowledgeModes((current) => ({
      ...current,
      [characterId]: mode,
    }));
  }, [markDraftAuthoringDirty]);

  const setCharacterScopeType = useCallback((characterId, scopeType) => {
    markDraftAuthoringDirty();
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
  }, [markDraftAuthoringDirty]);

  const setCharacterScopeChapter = useCallback((characterId, chapterId) => {
    markDraftAuthoringDirty();
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
  }, [markDraftAuthoringDirty]);

  const setCharacterScopeSection = useCallback((characterId, sectionId) => {
    markDraftAuthoringDirty();
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
  }, [markDraftAuthoringDirty]);

  const toggleCharacterExclusion = useCallback((characterId, field, id) => {
    markDraftAuthoringDirty();
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
  }, [markDraftAuthoringDirty]);

  const setCharacterAvailabilityMode = useCallback((characterId, mode) => {
    markDraftAuthoringDirty();
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
  }, [markDraftAuthoringDirty]);

  const setCharacterKnowledgeTimeField = useCallback(
    (characterId, boundary, field, value) => {
      markDraftAuthoringDirty();
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
    [markDraftAuthoringDirty]
  );

  const toggleCharacterContextAllowlist = useCallback(
    (characterId, field, id) => {
      markDraftAuthoringDirty();
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
    [markDraftAuthoringDirty]
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

  const authoringConfiguration = useMemo(
    () =>
      buildLoreEngineUseAuthoringConfiguration({
        scopeMode,
        selectedSectionIds,
        selectedCharacterIds,
        selectedLocationIds,
        knowledgeModes,
        characterAccess,
      }),
    [
      characterAccess,
      knowledgeModes,
      scopeMode,
      selectedCharacterIds,
      selectedLocationIds,
      selectedSectionIds,
    ]
  );

  useEffect(() => {
    if (
      sourceReleaseId ||
      !draftHydrationReadyRef.current ||
      !draftAuthoringDirtyRef.current ||
      typeof onDraftEngineUseChange !== "function"
    ) {
      return;
    }

    const nextFingerprint = JSON.stringify(authoringConfiguration);
    if (nextFingerprint === draftEngineUseFingerprint) {
      draftAuthoringDirtyRef.current = false;
      return;
    }

    draftAuthoringDirtyRef.current = false;
    lastWrittenDraftFingerprintRef.current = nextFingerprint;
    onDraftEngineUseChange(authoringConfiguration);
    setActionStatus("SUCCESS");
    setActionMessage(
      "Draft Engine Use configuration updated. Use the page Save action to persist it."
    );
  }, [
    authoringConfiguration,
    draftEngineUseFingerprint,
    onDraftEngineUseChange,
    sourceReleaseId,
  ]);

  const applyImportedEngineUseConfiguration = useCallback((configuration) => {
    markDraftAuthoringDirty();
    const projected = projectLoreEngineUseConfigurationToAuthoringState(configuration);
    setScopeModeState(projected.scopeMode);
    setSelectedSectionIds(projected.selectedSectionIds);
    setSelectedCharacterIds(projected.selectedCharacterIds);
    setSelectedLocationIds(projected.selectedLocationIds);
    setKnowledgeModes(projected.knowledgeModes);
    setCharacterAccess(projected.characterAccess);
    setActionStatus("SUCCESS");
    setActionMessage(
      "Engine Use JSON applied to the current authoring form. Review it before submitting."
    );
  }, [markDraftAuthoringDirty]);

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
    authoringSource: source,
    hasDraftAuthoringSource,
    hasStoredDraftAuthoringConfiguration,
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
    jsonEditorOpen,
    authoringConfiguration,
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
    openJsonEditor: () => setJsonEditorOpen(true),
    closeJsonEditor: () => setJsonEditorOpen(false),
    applyImportedEngineUseConfiguration,
    submit,
    cancel,
    withdraw,
    refresh: () => loadState(),
  };
}
