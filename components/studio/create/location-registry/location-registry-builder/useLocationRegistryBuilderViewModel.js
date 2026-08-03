"use client";

import { useMemo } from "react";

import { useLocationRegistryBuilder } from "@/components/studio/registries/hooks/useLocationRegistryBuilder";
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
  initialTitle = "",
  initialDescription = "",
  initialData = null,
  activeTab: controlledActiveTab = null,
  hideTabs = false,
  onChange,
} = {}) {
  const registry = useLocationRegistryBuilder({
    mode,
    initialTitle,
    initialDescription,
    initialData,
    onChange,
  });

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
      connections: registry.registry.connections.map(
        withConnectionListPresentation
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
    npcEntryOptions: registry.npcEntryOptions,
    npcEntryLoadError: registry.npcEntryLoadError,
    optionSets,
    onSelectTab: registry.setActiveTab,
    onUpdateField: registry.updateField,
    onUpdatePromptGuidance: registry.updatePromptGuidance,
    onUpdateRuntimeGuidance: registry.updateRuntimeGuidance,
    onSave: registry.saveRegistry,
    onOpenNewEntry: registry.openNewEntry,
    onOpenEditEntry: registry.openEditEntry,
    onCloseEntry: registry.closeEntryModal,
    onUpdateEntryField: registry.updateEntryDraftField,
    onUpdateEntryListText: updateEntryListText,
    onSetEntryKind: registry.setEntryKind,
    onApplyLocation: registry.applyLocationToEntryDraft,
    onSaveEntry: registry.saveEntryDraft,
    onDeleteEntry: registry.deleteEntry,
    onOpenNewConnection: registry.openNewConnection,
    onOpenEditConnection: registry.openEditConnection,
    onCloseConnection: registry.closeConnectionModal,
    onUpdateConnectionField: registry.updateConnectionDraftField,
    onSaveConnection: registry.saveConnectionDraft,
    onDeleteConnection: registry.deleteConnection,
    onOpenNewPresenceBinding: registry.openNewPresenceBinding,
    onOpenEditPresenceBinding: registry.openEditPresenceBinding,
    onClosePresenceBinding: registry.closePresenceBindingModal,
    onUpdatePresenceBindingField:
      registry.updatePresenceBindingDraftField,
    onUpdatePresenceConditionListText: updatePresenceConditionListText,
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
