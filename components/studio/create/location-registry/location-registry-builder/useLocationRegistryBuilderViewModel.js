"use client";

import { useEffect, useMemo, useState } from "react";

import { useLocationRegistryBuilder } from "@/components/studio/registries/hooks/useLocationRegistryBuilder";
import { analyzeLocationRegistrySplit } from "@/components/studio/registries/locationRegistrySplitAnalysis.mjs";
import {
  commitLocationRegistrySplit,
  planLocationRegistrySplit,
} from "@/lib/client/studio/registries/locationRegistrySplitClient";
import {
  CONNECTION_RELATION_OPTIONS,
  DEFAULT_DISTANCE_MODE_BY_RELATION,
  DEFAULT_EFFECTIVE_TRAVEL_TIER_BY_ROUTE_TYPE,
  DISTANCE_MODE_DEFINITIONS,
  EFFECTIVE_TRAVEL_TIER_DEFINITIONS,
  LOCATION_CATEGORY_OPTIONS,
  LOCATION_SCALE_OPTIONS,
  PRESENCE_FREQUENCY_OPTIONS,
  PRESENCE_OPPORTUNITY_TRIGGER_OPTIONS,
  PRESENCE_RELATIONSHIP_ROLE_OPTIONS,
  ROUTE_TYPE_OPTIONS,
  SPACE_TYPE_OPTIONS,
  listToText,
  normalizeListText,
} from "@/components/studio/registries/locationRegistryUtils";
import {
  LOCATION_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,
  buildLocationRegistryBuilderTabs,
} from "./LocationRegistryBuilder.contract";

const DISTANCE_MODE_OPTIONS = Object.freeze([
  ...DISTANCE_MODE_DEFINITIONS.map((definition) => ({
    value: definition.value,
    label: `${definition.tier} · ${definition.label}`,
  })),
  Object.freeze({ value: "ABSTRACT", label: "Abstract / Non-Spatial" }),
  Object.freeze({ value: "UNKNOWN", label: "Unknown / Unset" }),
]);

const DISTANCE_DEFINITION_BY_VALUE = new Map(
  DISTANCE_MODE_DEFINITIONS.map((definition) => [
    definition.value,
    definition,
  ])
);

const TRAVEL_TIER_BY_NUMBER = new Map(
  EFFECTIVE_TRAVEL_TIER_DEFINITIONS.map((definition) => [
    definition.tier,
    definition,
  ])
);

function formatRegistryOption(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getDistanceSuggestionLabel(value) {
  const normalized = String(value || "UNKNOWN").toUpperCase();
  const definition = DISTANCE_DEFINITION_BY_VALUE.get(normalized);

  return definition
    ? `Tier ${definition.tier} · ${definition.label}`
    : formatRegistryOption(normalized || "UNKNOWN");
}

function withEntryPresentation(draft) {
  if (!draft) return null;

  return {
    ...draft,
    aliasesText: listToText(draft.aliases),
    themesText: listToText(draft.themes),
    sceneAffordancesText: listToText(draft.sceneAffordances),
  };
}

function buildRegistryTitleById(registryOptions = []) {
  return new Map(
    registryOptions.map((option) => [option.id, option.title])
  );
}

function resolveLocationReferenceDisplay({
  reference = {},
  fallbackLocationEntryId = "",
  currentCreationId = "",
  currentEntries = [],
  registryLocationOptionsById = {},
  registryTitleById = new Map(),
}) {
  const registryCreationId = String(
    reference?.registryCreationId || ""
  ).trim();
  const effectiveRegistryId = registryCreationId || currentCreationId;
  const locationEntryId = String(
    reference?.locationEntryId || fallbackLocationEntryId || ""
  ).trim();
  const options = registryLocationOptionsById[effectiveRegistryId] || [];
  const localEntry = currentEntries.find((entry) => entry.id === locationEntryId);
  const option = options.find((entry) => entry.id === locationEntryId);
  const locationName =
    option?.label || localEntry?.name || locationEntryId || "Unknown Location";
  const registryTitle =
    registryCreationId && registryCreationId !== currentCreationId
      ? registryTitleById.get(registryCreationId) || "Linked Location Registry"
      : "This Registry";

  return {
    registryCreationId: effectiveRegistryId,
    locationEntryId,
    locationName,
    registryTitle,
    label:
      registryCreationId && registryCreationId !== currentCreationId
        ? `${registryTitle} · ${locationName}`
        : locationName,
  };
}

function withConnectionPresentation(draft) {
  if (!draft) return null;

  const distanceMode = String(draft.distanceMode || "UNKNOWN").toUpperCase();
  const relation = String(draft.relation || "").toUpperCase();
  const defaultRouteType = String(
    draft.defaultRouteType || draft.routeType || "UNKNOWN"
  ).toUpperCase();
  const relationDistanceSuggestion =
    DEFAULT_DISTANCE_MODE_BY_RELATION[relation] || "UNKNOWN";
  const distanceDefinition = DISTANCE_DEFINITION_BY_VALUE.get(distanceMode);
  const travelTierNumber =
    DEFAULT_EFFECTIVE_TRAVEL_TIER_BY_ROUTE_TYPE[defaultRouteType];
  const travelTier = Number.isInteger(travelTierNumber)
    ? TRAVEL_TIER_BY_NUMBER.get(travelTierNumber) || null
    : null;

  return {
    ...draft,
    relationDistanceSuggestion,
    relationDistanceSuggestionLabel: getDistanceSuggestionLabel(
      relationDistanceSuggestion
    ),
    distanceDescription: distanceDefinition?.description || "",
    defaultTravelTierText: travelTier
      ? `Tier ${travelTier.tier} · ${travelTier.label}.`
      : "",
  };
}

function withConnectionListPresentation(connection) {
  if (!connection) return connection;

  return {
    ...connection,
    distanceModeDisplay: getDistanceSuggestionLabel(connection.distanceMode),
  };
}

function withEntryListPresentation(
  entry,
  {
    currentCreationId,
    currentEntries,
    registryLocationOptionsById,
    registryTitleById,
  }
) {
  if (!entry) return entry;

  const parentReference = resolveLocationReferenceDisplay({
    reference: entry.parentLocationRef,
    fallbackLocationEntryId: entry.parentLocationId,
    currentCreationId,
    currentEntries,
    registryLocationOptionsById,
    registryTitleById,
  });

  return {
    ...entry,
    parentLocationDisplay:
      entry.parentLocationId || entry.parentLocationRef?.locationEntryId
        ? parentReference.label
        : "",
  };
}

function withConnectionListCrossRegistryPresentation(
  connection,
  {
    currentCreationId,
    currentEntries,
    registryLocationOptionsById,
    registryTitleById,
  }
) {
  const presented = withConnectionListPresentation(connection);
  if (!presented) return presented;

  const from = resolveLocationReferenceDisplay({
    reference: presented.from,
    fallbackLocationEntryId: presented.fromLocationId,
    currentCreationId,
    currentEntries,
    registryLocationOptionsById,
    registryTitleById,
  });
  const to = resolveLocationReferenceDisplay({
    reference: presented.to,
    fallbackLocationEntryId: presented.toLocationId,
    currentCreationId,
    currentEntries,
    registryLocationOptionsById,
    registryTitleById,
  });

  return {
    ...presented,
    fromLocationDisplay: from.label,
    toLocationDisplay: to.label,
    crossRegistry:
      Boolean(presented.from?.registryCreationId) ||
      Boolean(presented.to?.registryCreationId),
  };
}

function withPresencePresentation(draft) {
  if (!draft) return null;

  return {
    ...draft,
    conditionDaypartsText: listToText(draft.conditions?.dayparts),
    conditionRequiredSceneTagsText: listToText(
      draft.conditions?.requiredSceneTags
    ),
    conditionExcludedSceneTagsText: listToText(
      draft.conditions?.excludedSceneTags
    ),
    conditionRequiredFlagsText: listToText(draft.conditions?.requiredFlags),
  };
}

export function useLocationRegistryBuilderViewModel({
  mode = "create",
  currentCreationId = "",
  initialTitle = "",
  initialDescription = "",
  initialData = null,
  activeTab: controlledActiveTab = null,
  hideTabs = false,
  onChange,
  onSplitCommitted,
} = {}) {
  const registry = useLocationRegistryBuilder({
    mode,
    currentCreationId,
    initialTitle,
    initialDescription,
    initialData,
    onChange,
  });
  const [splitAnalysisOpen, setSplitAnalysisOpen] = useState(false);
  const [selectedSplitCandidateIds, setSelectedSplitCandidateIds] = useState([]);
  const [splitPlanStatus, setSplitPlanStatus] = useState("idle");
  const [splitPlanMessage, setSplitPlanMessage] = useState("");
  const [splitServerPlan, setSplitServerPlan] = useState(null);
  const [splitCreatorConfirmed, setSplitCreatorConfirmed] = useState(false);

  const splitAnalysis = useMemo(
    () =>
      analyzeLocationRegistrySplit({
        registry: {
          ...registry.registry,
          childRegistryRefs: registry.childRegistryRefs,
        },
        currentCreationId,
      }),
    [currentCreationId, registry.childRegistryRefs, registry.registry]
  );

  useEffect(() => {
    setSelectedSplitCandidateIds([]);
    setSplitPlanStatus("idle");
    setSplitPlanMessage("");
    setSplitServerPlan(null);
    setSplitCreatorConfirmed(false);
  }, [currentCreationId, splitAnalysis]);

  const selectedSplitCandidates = useMemo(() => {
    const selectedIds = new Set(selectedSplitCandidateIds);
    return (Array.isArray(splitAnalysis.candidates)
      ? splitAnalysis.candidates
      : []
    ).filter((candidate) => selectedIds.has(candidate.id));
  }, [selectedSplitCandidateIds, splitAnalysis.candidates]);

  function resetSplitServerState() {
    setSplitPlanStatus("idle");
    setSplitPlanMessage("");
    setSplitServerPlan(null);
    setSplitCreatorConfirmed(false);
  }

  function buildSelectedSplitGroups() {
    return selectedSplitCandidates.map((candidate) => ({
      scopeLocationEntryId: candidate.scopeEntryId,
      title: candidate.suggestedChildTitle,
    }));
  }

  function openSplitPreview() {
    setSelectedSplitCandidateIds([]);
    resetSplitServerState();
    setSplitAnalysisOpen(true);
  }

  function closeSplitPreview() {
    if (splitPlanStatus === "committing") return;
    setSplitAnalysisOpen(false);
    setSelectedSplitCandidateIds([]);
    resetSplitServerState();
  }

  function toggleSplitCandidate(candidateId) {
    const candidate = (splitAnalysis.candidates || []).find(
      (item) => item.id === candidateId
    );
    if (!candidate || candidate.status !== "PREVIEW_READY") return;

    const alreadySelected = selectedSplitCandidateIds.includes(candidateId);
    if (!alreadySelected) {
      const overlapsSelected = (candidate.overlappingCandidateIds || []).some(
        (id) => selectedSplitCandidateIds.includes(id)
      );
      if (overlapsSelected) {
        setSplitPlanStatus("error");
        setSplitPlanMessage(
          "Selected split scopes overlap. Deselect the conflicting scope before continuing."
        );
        return;
      }
    }

    setSelectedSplitCandidateIds((current) =>
      alreadySelected
        ? current.filter((id) => id !== candidateId)
        : [...current, candidateId]
    );
    resetSplitServerState();
  }

  async function prepareSplitPlan() {
    const groups = buildSelectedSplitGroups();
    if (!currentCreationId || groups.length === 0) {
      setSplitPlanStatus("error");
      setSplitPlanMessage(
        "Select at least one non-overlapping authored containment scope first."
      );
      return;
    }

    setSplitPlanStatus("planning");
    setSplitPlanMessage("Validating the selected split against the saved Registry...");
    setSplitServerPlan(null);
    setSplitCreatorConfirmed(false);

    try {
      const plan = await planLocationRegistrySplit(currentCreationId, { groups });
      if (!plan?.planFingerprint || !plan?.source?.sourceFingerprint) {
        throw new Error(
          "The server did not return a complete split execution plan."
        );
      }

      setSplitServerPlan(plan);
      if (plan.executionGate?.commitReady) {
        setSplitPlanStatus("ready");
        setSplitPlanMessage(
          "Server validation passed. Review the preservation checks and confirm only if this is the split you intend to apply."
        );
      } else {
        setSplitPlanStatus("blocked");
        setSplitPlanMessage(
          "The server-authoritative plan has blockers and cannot be committed."
        );
      }
    } catch (error) {
      setSplitPlanStatus("error");
      setSplitPlanMessage(
        error?.message || "Split validation could not be completed."
      );
      setSplitServerPlan(null);
    }
  }

  async function commitSplitPlan() {
    if (
      !splitServerPlan?.executionGate?.commitReady ||
      !splitCreatorConfirmed
    ) {
      return;
    }

    const groups = buildSelectedSplitGroups();
    setSplitPlanStatus("committing");
    setSplitPlanMessage(
      "Applying the confirmed split as one atomic transaction..."
    );

    try {
      const result = await commitLocationRegistrySplit(currentCreationId, {
        groups,
        creatorConfirmed: true,
        expectedSourceFingerprint:
          splitServerPlan.source.sourceFingerprint,
        expectedPlanFingerprint: splitServerPlan.planFingerprint,
      });

      setSplitPlanStatus("applied");
      setSplitPlanMessage(
        "Split applied successfully. Reloading the Registry from authoritative storage..."
      );
      await onSplitCommitted?.(result);
    } catch (error) {
      setSplitPlanStatus("error");
      setSplitPlanMessage(
        error?.message ||
          "The split was not applied. No partial Registry changes should have been committed."
      );
      setSplitCreatorConfirmed(false);
    }
  }

  const currentTab = controlledActiveTab || registry.activeTab;
  const tabs = useMemo(
    () => buildLocationRegistryBuilderTabs(currentTab),
    [currentTab]
  );

  const optionSets = useMemo(
    () => ({
      locationCategoryOptions: LOCATION_CATEGORY_OPTIONS,
      locationScaleOptions: LOCATION_SCALE_OPTIONS,
      spaceTypeOptions: SPACE_TYPE_OPTIONS,
      connectionRelationOptions: CONNECTION_RELATION_OPTIONS,
      routeTypeOptions: ROUTE_TYPE_OPTIONS,
      distanceModeOptions: DISTANCE_MODE_OPTIONS,
      presenceRelationshipRoleOptions: PRESENCE_RELATIONSHIP_ROLE_OPTIONS,
      presenceFrequencyOptions: PRESENCE_FREQUENCY_OPTIONS,
      presenceOpportunityTriggerOptions:
        PRESENCE_OPPORTUNITY_TRIGGER_OPTIONS,
    }),
    []
  );

  const registryTitleById = useMemo(
    () => buildRegistryTitleById(registry.registryOptions),
    [registry.registryOptions]
  );
  const presentationContext = useMemo(
    () => ({
      currentCreationId,
      currentEntries: registry.registry.entries,
      registryLocationOptionsById: registry.registryLocationOptionsById,
      registryTitleById,
    }),
    [
      currentCreationId,
      registry.registry.entries,
      registry.registryLocationOptionsById,
      registryTitleById,
    ]
  );

  function updateEntryListText(field, value) {
    registry.updateEntryDraftField(field, normalizeListText(value));
  }

  function updatePresenceConditionListText(field, value) {
    registry.updatePresenceBindingDraftField(
      `conditions.${field}`,
      normalizeListText(value)
    );
  }

  return {
    contractVersion: LOCATION_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,
    mode,
    currentTab,
    hideTabs,
    tabs,
    registry: {
      ...registry.registry,
      entries: registry.registry.entries.map((entry) =>
        withEntryListPresentation(entry, presentationContext)
      ),
      connections: registry.registry.connections.map((connection) =>
        withConnectionListCrossRegistryPresentation(
          connection,
          presentationContext
        )
      ),
    },
    saveStatus: registry.saveStatus,
    saveMessage: registry.saveMessage,
    entryDraft: withEntryPresentation(registry.entryDraft),
    connectionDraft: withConnectionPresentation(registry.connectionDraft),
    presenceBindingDraft: withPresencePresentation(
      registry.presenceBindingDraft
    ),
    weatherScopeDraft: registry.weatherScopeDraft,
    locationOptions: registry.locationOptions,
    locationLoadError: registry.locationLoadError,
    characterOptions: registry.characterOptions,
    characterLoadError: registry.characterLoadError,
    npcEntryOptions: registry.npcEntryOptions,
    npcEntryLoadError: registry.npcEntryLoadError,
    splitPreview: {
      available: mode === "edit" && Boolean(String(currentCreationId || "").trim()),
      open: splitAnalysisOpen,
      analysis: splitAnalysis,
      selectedCandidateIds: selectedSplitCandidateIds,
      selectedCount: selectedSplitCandidateIds.length,
      planStatus: splitPlanStatus,
      planMessage: splitPlanMessage,
      serverPlan: splitServerPlan,
      creatorConfirmed: splitCreatorConfirmed,
      busy: splitPlanStatus === "planning" || splitPlanStatus === "committing",
    },
    hierarchy: {
      status: registry.hierarchyStatus,
      registryOptions: registry.registryOptions.map((option) => ({
        value: option.id,
        label: option.title,
      })),
      registryLoadError: registry.registryLoadError,
      parentLocationOptions: registry.parentLocationOptions.map((option) => ({
        ...option,
        value: option.id,
        label: option.label,
      })),
      parentRegistryLoadError: registry.parentRegistryLoadError,
      trail: registry.hierarchyTrail,
      childRegistryRefs: registry.childRegistryRefs,
    },
    crossRegistry: {
      authoringAvailable: registry.crossRegistryAuthoringAvailable,
      registryOptions: registry.registryOptions.map((option) => ({
        value: option.id,
        label: option.title,
      })),
      referenceRegistryLoadError: registry.referenceRegistryLoadError,
      entryParentLocationOptions:
        registry.entryCrossRegistryParentLocationOptions.map((option) => ({
          ...option,
          value: option.id,
          label: option.label,
        })),
      connectionFromLocationOptions:
        registry.connectionFromLocationOptions.map((option) => ({
          ...option,
          value: option.id,
          label: option.label,
        })),
      connectionToLocationOptions:
        registry.connectionToLocationOptions.map((option) => ({
          ...option,
          value: option.id,
          label: option.label,
        })),
    },
    optionSets,
    onSelectTab: registry.setActiveTab,
    onUpdateField: registry.updateField,
    onSelectParentRegistry: registry.selectParentRegistry,
    onSelectParentScopeLocation: registry.selectParentScopeLocation,
    onOpenHierarchyRegistry: registry.openHierarchyRegistry,
    onUpdatePromptGuidance: registry.updatePromptGuidance,
    onUpdateRuntimeGuidance: registry.updateRuntimeGuidance,
    onOpenSplitPreview: openSplitPreview,
    onCloseSplitPreview: closeSplitPreview,
    onToggleSplitCandidate: toggleSplitCandidate,
    onPrepareSplitPlan: prepareSplitPlan,
    onChangeSplitCreatorConfirmation: setSplitCreatorConfirmed,
    onCommitSplitPlan: commitSplitPlan,
    onSave: registry.saveRegistry,
    onOpenNewEntry: registry.openNewEntry,
    onOpenEditEntry: registry.openEditEntry,
    onCloseEntry: registry.closeEntryModal,
    onUpdateEntryField: registry.updateEntryDraftField,
    onSelectEntryParentRegistry: registry.selectEntryParentRegistry,
    onSelectEntryParentLocation: registry.selectEntryParentLocation,
    onUpdateEntryListText: updateEntryListText,
    onSetEntryKind: registry.setEntryKind,
    onApplyLocation: registry.applyLocationToEntryDraft,
    onSaveEntry: registry.saveEntryDraft,
    onDeleteEntry: registry.deleteEntry,
    onOpenNewConnection: registry.openNewConnection,
    onOpenEditConnection: registry.openEditConnection,
    onCloseConnection: registry.closeConnectionModal,
    onUpdateConnectionField: registry.updateConnectionDraftField,
    onSelectConnectionEndpointRegistry:
      registry.selectConnectionEndpointRegistry,
    onSelectConnectionEndpointLocation:
      registry.selectConnectionEndpointLocation,
    onSaveConnection: registry.saveConnectionDraft,
    onDeleteConnection: registry.deleteConnection,
    onOpenNewPresenceBinding: registry.openNewPresenceBinding,
    onOpenEditPresenceBinding: registry.openEditPresenceBinding,
    onClosePresenceBinding: registry.closePresenceBindingModal,
    onUpdatePresenceBindingField:
      registry.updatePresenceBindingDraftField,
    onUpdatePresenceConditionListText: updatePresenceConditionListText,
    onApplyCharacter: registry.applyCharacterToPresenceBindingDraft,
    onApplyNpcEntry: registry.applyNpcEntryToPresenceBindingDraft,
    onSavePresenceBinding: registry.savePresenceBindingDraft,
    onDeletePresenceBinding: registry.deletePresenceBinding,
    onOpenNewWeatherScope: registry.openNewWeatherScope,
    onOpenEditWeatherScope: registry.openEditWeatherScope,
    onCloseWeatherScope: registry.closeWeatherScopeModal,
    onUpdateWeatherScopeField: registry.updateWeatherScopeDraftField,
    onSaveWeatherScope: registry.saveWeatherScopeDraft,
    onDeleteWeatherScope: registry.deleteWeatherScope,
  };
}
