"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createCreationDraft,
  fetchOwnedCreations,
  updateCreationDraft,
} from "@/lib/client/studio/creations/creationClient";
import {
  DEFAULT_DISTANCE_MODE_BY_RELATION,
  buildLocationRegistryCreationPayload,
  normalizeLocationRegistryLocationOptions,
  buildLocationRegistryData,
  createEmptyLocationConnection,
  createEmptyLocationEntry,
  createEmptyPresenceBinding,
  createEmptyWeatherScope,
  createStarterLocationRegistry,
  normalizeLocationConnection,
  normalizeLocationEntry,
  normalizeLocationRegistry,
  normalizeLocationRegistryNpcEntryOptions,
  normalizePresenceBinding,
  normalizeWeatherScope,
  upsertById,
} from "@/components/studio/registries/locationRegistryUtils";
import { fetchLocationRegistryLocationOptions } from "@/lib/client/studio/registries/registryClient";
import { createLocationRegistrySaveSession } from "@/components/studio/registries/hooks/locationRegistrySaveSession.mjs";

function createInitialRegistry({
  initialTitle = "",
  initialDescription = "",
  initialData = null,
}) {
  return normalizeLocationRegistry({
    ...(initialData || {}),
    title: initialTitle || "Untitled Location Registry",
    description: initialDescription || "",
    weatherScopes: initialData?.weather_scopes || initialData?.weatherScopes,
    promptGuidance: initialData?.prompt_guidance || initialData?.promptGuidance,
    runtimeGuidance: initialData?.runtime_guidance || initialData?.runtimeGuidance,
    presenceBindings: initialData?.presence_bindings || initialData?.presenceBindings,
    middlewareHints: initialData?.middleware_hints || initialData?.middlewareHints,
  });
}

export function useLocationRegistryBuilder({
  mode = "create",
  initialTitle = "",
  initialDescription = "",
  initialData = null,
  onChange,
} = {}) {
  const router = useRouter();
  const isEditMode = mode === "edit";
  const [locationOptions, setLocationOptions] = useState([]);
  const [locationLoadError, setLocationLoadError] = useState("");
  const [npcEntryOptions, setNpcEntryOptions] = useState([]);
  const [npcEntryLoadError, setNpcEntryLoadError] = useState("");

  const [activeTab, setActiveTab] = useState("overview");
  const [registry, setRegistry] = useState(() =>
    isEditMode
      ? createInitialRegistry({
          initialTitle,
          initialDescription,
          initialData,
        })
      : createStarterLocationRegistry()
  );

  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [savedCreationId, setSavedCreationId] = useState(null);
  const saveSessionRef = useRef(createLocationRegistrySaveSession());

  const [entryDraft, setEntryDraft] = useState(null);
  const [connectionDraft, setConnectionDraft] = useState(null);
  const [presenceBindingDraft, setPresenceBindingDraft] = useState(null);
  const [weatherScopeDraft, setWeatherScopeDraft] = useState(null);

  const normalizedRegistry = useMemo(
    () => normalizeLocationRegistry(registry),
    [registry]
  );
    useEffect(() => {
        let cancelled = false;

        async function loadLocations() {
            setLocationLoadError("");

            try {
            const creations = await fetchLocationRegistryLocationOptions();

            if (!cancelled) {
                setLocationOptions(
                normalizeLocationRegistryLocationOptions(creations)
                );
            }
            } catch (error) {
            if (!cancelled) {
                setLocationOptions([]);
                setLocationLoadError(
                error.message || "Location options could not be loaded."
                );
            }
            }
        }

        loadLocations();

        return () => {
            cancelled = true;
        };
    }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadNpcRegistryEntries() {
      setNpcEntryLoadError("");

      try {
        const creations = await fetchOwnedCreations({ type: "NPC_REGISTRY" });

        if (!cancelled) {
          setNpcEntryOptions(
            normalizeLocationRegistryNpcEntryOptions(creations)
          );
        }
      } catch (error) {
        if (!cancelled) {
          setNpcEntryOptions([]);
          setNpcEntryLoadError(
            error.message || "NPC Registry entries could not be loaded."
          );
        }
      }
    }

    loadNpcRegistryEntries();

    return () => {
      cancelled = true;
    };
  }, []);

  function emitEditChange(nextRegistry) {
    if (!isEditMode || typeof onChange !== "function") return;

    const normalized = normalizeLocationRegistry(nextRegistry);

    onChange({
      title: normalized.title,
      description: normalized.description,
      data: buildLocationRegistryData(normalized),
    });
  }

  function markDirty() {
    setSaveStatus("idle");
    setSaveMessage("");
  }

  function commitRegistry(nextRegistry) {
    const normalized = normalizeLocationRegistry(nextRegistry);

    setRegistry(normalized);
    markDirty();
    emitEditChange(normalized);
  }

  function updateField(field, value) {
    commitRegistry({
      ...normalizedRegistry,
      [field]: value,
    });
  }

  function updatePromptGuidance(field, value) {
    commitRegistry({
      ...normalizedRegistry,
      promptGuidance: {
        ...(normalizedRegistry.promptGuidance || {}),
        [field]: value,
      },
    });
  }

  function updateRuntimeGuidance(field, value) {
    commitRegistry({
      ...normalizedRegistry,
      runtimeGuidance: {
        ...(normalizedRegistry.runtimeGuidance || {}),
        [field]: value,
      },
    });
  }

  function openNewEntry() {
    setEntryDraft(createEmptyLocationEntry());
  }

  function openEditEntry(entry) {
    setEntryDraft(normalizeLocationEntry(entry));
  }

  function closeEntryModal() {
    setEntryDraft(null);
  }

  function updateEntryDraftField(field, value) {
    setEntryDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }
  function setEntryKind(kind) {
    const safeKind = kind === "CREATION_REF" ? "CREATION_REF" : "AD_HOC";

    setEntryDraft((current) => ({
      ...current,
      kind: safeKind,
      creationId: safeKind === "AD_HOC" ? "" : current.creationId,
      creationType: safeKind === "AD_HOC" ? "" : "LOCATION",
    }));
  }

  function applyLocationToEntryDraft(location) {
    if (!location?.id) return;

    setEntryDraft((current) =>
      normalizeLocationEntry({
        ...current,
        kind: "CREATION_REF",
        creationId: location.id,
        creationType: location.type || "LOCATION",
        name: location.title,
        summary:
          current.summary || location.description || location.subtitle || "",
        publicDescription:
          current.publicDescription || location.description || "",
      })
    );
  }
  function saveEntryDraft() {
    const nextEntry = normalizeLocationEntry(entryDraft);

    if (!nextEntry.name) return;

    commitRegistry({
      ...normalizedRegistry,
      entries: upsertById(normalizedRegistry.entries, nextEntry),
    });

    setEntryDraft(null);
  }

  function deleteEntry(entryId) {
    const nextEntries = normalizedRegistry.entries
      .filter((entry) => entry.id !== entryId)
      .map((entry) =>
        entry.parentLocationId === entryId
          ? {
              ...entry,
              parentLocationId: "",
            }
          : entry
      );

    const nextConnections = normalizedRegistry.connections.filter(
      (connection) =>
        connection.fromLocationId !== entryId &&
        connection.toLocationId !== entryId
    );

    commitRegistry({
      ...normalizedRegistry,
      entries: nextEntries,
      connections: nextConnections,
      presenceBindings: normalizedRegistry.presenceBindings.filter(
        (binding) => binding.locationEntryId !== entryId
      ),
    });
  }

  function openNewConnection() {
    setConnectionDraft(createEmptyLocationConnection(normalizedRegistry.entries));
  }

  function openEditConnection(connection) {
    setConnectionDraft(normalizeLocationConnection(connection));
  }

  function closeConnectionModal() {
    setConnectionDraft(null);
  }

  function updateConnectionDraftField(field, value) {
    setConnectionDraft((current) => {
      if (!current) return current;

      if (field === "relation") {
        const nextRelation = String(value || "")
          .trim()
          .toUpperCase();

        const currentRelation = String(current.relation || "")
          .trim()
          .toUpperCase();

        const currentSuggestedDistance =
          DEFAULT_DISTANCE_MODE_BY_RELATION[currentRelation] || "UNKNOWN";

        const nextSuggestedDistance =
          DEFAULT_DISTANCE_MODE_BY_RELATION[nextRelation] || "UNKNOWN";

        const currentDistanceMode = String(current.distanceMode || "UNKNOWN")
          .trim()
          .toUpperCase();

        const followsRelationshipSuggestion =
          currentDistanceMode === "UNKNOWN" ||
          currentDistanceMode === currentSuggestedDistance;

        return {
          ...current,
          relation: nextRelation,
          ...(followsRelationshipSuggestion
            ? {
                distanceMode: nextSuggestedDistance,
              }
            : {}),
        };
      }

      if (field === "availableRouteTypes") {
        const nextAvailableRouteTypes = [
          ...new Set(
            (Array.isArray(value) ? value : [])
              .map((routeType) =>
                String(routeType || "")
                  .trim()
                  .toUpperCase()
              )
              .filter(Boolean)
          ),
        ];

        const currentDefaultRouteType = String(
          current.defaultRouteType || current.routeType || "UNKNOWN"
        )
          .trim()
          .toUpperCase();

        const nextDefaultRouteType = nextAvailableRouteTypes.includes(
          currentDefaultRouteType
        )
          ? currentDefaultRouteType
          : nextAvailableRouteTypes[0] || "UNKNOWN";

        return {
          ...current,
          availableRouteTypes: nextAvailableRouteTypes,
          defaultRouteType: nextDefaultRouteType,

          // Compatibility mirror for existing runtime readers.
          routeType: nextDefaultRouteType,
        };
      }

      if (field === "defaultRouteType") {
        const nextDefaultRouteType = String(value || "UNKNOWN")
          .trim()
          .toUpperCase();

        const currentAvailableRouteTypes = Array.isArray(
          current.availableRouteTypes
        )
          ? current.availableRouteTypes
          : [];

        const nextAvailableRouteTypes =
          nextDefaultRouteType && nextDefaultRouteType !== "UNKNOWN"
            ? [...new Set([...currentAvailableRouteTypes, nextDefaultRouteType])]
            : currentAvailableRouteTypes;

        return {
          ...current,
          availableRouteTypes: nextAvailableRouteTypes,
          defaultRouteType: nextDefaultRouteType,

          // Compatibility mirror for existing runtime readers.
          routeType: nextDefaultRouteType,
        };
      }

      return {
        ...current,
        [field]: value,
      };
    });
  }

  function saveConnectionDraft() {
    const nextConnection = normalizeLocationConnection(connectionDraft);

    if (!nextConnection.fromLocationId || !nextConnection.toLocationId) {
      return;
    }

    commitRegistry({
      ...normalizedRegistry,
      connections: upsertById(normalizedRegistry.connections, nextConnection),
    });

    setConnectionDraft(null);
  }

  function deleteConnection(connectionId) {
    commitRegistry({
      ...normalizedRegistry,
      connections: normalizedRegistry.connections.filter(
        (connection) => connection.id !== connectionId
      ),
    });
  }

  function openNewPresenceBinding() {
    setPresenceBindingDraft(
      createEmptyPresenceBinding(normalizedRegistry.entries)
    );
  }

  function openEditPresenceBinding(binding) {
    setPresenceBindingDraft(normalizePresenceBinding(binding));
  }

  function closePresenceBindingModal() {
    setPresenceBindingDraft(null);
  }

  function updatePresenceBindingDraftField(field, value) {
    setPresenceBindingDraft((current) => {
      if (!current) return current;

      if (field.startsWith("conditions.")) {
        const conditionField = field.slice("conditions.".length);

        return {
          ...current,
          conditions: {
            ...(current.conditions || {}),
            [conditionField]: value,
          },
        };
      }

      return {
        ...current,
        [field]: value,
      };
    });
  }

  function applyNpcEntryToPresenceBindingDraft(option) {
    if (!option?.registryCreationId || !option?.registryEntryId) return;

    setPresenceBindingDraft((current) => ({
      ...current,
      person: {
        kind: "NPC_REGISTRY_ENTRY",
        registryCreationId: option.registryCreationId,
        registryEntryId: option.registryEntryId,
        creationId: option.creationId || "",
        creationType: option.creationType || "",
        entryKind: option.entryKind || "",
        displayName: option.displayName || option.title || "",
        registryTitle: option.registryTitle || "",
      },
    }));
  }

  function savePresenceBindingDraft() {
    const nextBinding = normalizePresenceBinding(presenceBindingDraft);

    if (
      !nextBinding.locationEntryId ||
      !nextBinding.person.registryCreationId ||
      !nextBinding.person.registryEntryId
    ) {
      return;
    }

    const duplicate = normalizedRegistry.presenceBindings.find(
      (binding) =>
        binding.id !== nextBinding.id &&
        binding.locationEntryId === nextBinding.locationEntryId &&
        binding.person.registryCreationId ===
          nextBinding.person.registryCreationId &&
        binding.person.registryEntryId === nextBinding.person.registryEntryId
    );

    if (duplicate) return;

    commitRegistry({
      ...normalizedRegistry,
      presenceBindings: upsertById(
        normalizedRegistry.presenceBindings,
        nextBinding
      ),
    });

    setPresenceBindingDraft(null);
  }

  function deletePresenceBinding(bindingId) {
    commitRegistry({
      ...normalizedRegistry,
      presenceBindings: normalizedRegistry.presenceBindings.filter(
        (binding) => binding.id !== bindingId
      ),
    });
  }

  function openNewWeatherScope() {
    setWeatherScopeDraft(createEmptyWeatherScope());
  }

  function openEditWeatherScope(scope) {
    setWeatherScopeDraft(normalizeWeatherScope(scope));
  }

  function closeWeatherScopeModal() {
    setWeatherScopeDraft(null);
  }

  function updateWeatherScopeDraftField(field, value) {
    setWeatherScopeDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function saveWeatherScopeDraft() {
    const nextScope = normalizeWeatherScope(weatherScopeDraft);

    if (!nextScope.name) return;

    commitRegistry({
      ...normalizedRegistry,
      weatherScopes: upsertById(normalizedRegistry.weatherScopes, nextScope),
    });

    setWeatherScopeDraft(null);
  }

  function deleteWeatherScope(scopeId) {
    commitRegistry({
      ...normalizedRegistry,
      weatherScopes: normalizedRegistry.weatherScopes.filter(
        (scope) => scope.id !== scopeId
      ),
      entries: normalizedRegistry.entries.map((entry) =>
        entry.weatherScopeId === scopeId
          ? {
              ...entry,
              weatherScopeId: "",
            }
          : entry
      ),
    });
  }

  async function saveRegistry() {
    if (isEditMode) {
      setSaveStatus("idle");
      setSaveMessage("");
      return;
    }

    const saveOperation = saveSessionRef.current.beginSave();

    if (!saveOperation.accepted) return;

    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const payload = buildLocationRegistryCreationPayload(normalizedRegistry);
      const response =
        saveOperation.method === "PATCH"
          ? await updateCreationDraft(
              saveOperation.creationId,
              payload,
              "Location registry could not be updated."
            )
          : await createCreationDraft(
              payload,
              "Location registry could not be saved."
            );

      const creation = response?.data?.creation || response?.creation || null;
      const creationId =
        creation?.id || saveOperation.creationId || null;

      if (!creationId) {
        throw new Error(
          "Location registry was saved, but no creation ID was returned."
        );
      }

      const persistedCreationId =
        saveSessionRef.current.completeSave(creationId);

      setSavedCreationId(persistedCreationId);
      setSaveStatus("saved");
      setSaveMessage(
        saveOperation.method === "PATCH"
          ? "Location registry changes saved."
          : "Location registry saved as a draft."
      );
      router.replace(`/studio/my-creations/${persistedCreationId}/edit`);
    } catch (error) {
      saveSessionRef.current.failSave();
      setSaveStatus("error");
      setSaveMessage(error?.message || "Location registry could not be saved.");
    }
  }

  return {
    mode,
    isEditMode,
    activeTab,
    registry: normalizedRegistry,
    saveStatus,
    saveMessage,
    savedCreationId,

    entryDraft,
    connectionDraft,
    presenceBindingDraft,
    weatherScopeDraft,

    locationOptions,
    locationLoadError,
    npcEntryOptions,
    npcEntryLoadError,

    setActiveTab,
    updateField,
    updatePromptGuidance,
    updateRuntimeGuidance,
    saveRegistry,

    openNewEntry,
    openEditEntry,
    closeEntryModal,
    updateEntryDraftField,
    setEntryKind,
    applyLocationToEntryDraft,
    saveEntryDraft,
    deleteEntry,

    openNewConnection,
    openEditConnection,
    closeConnectionModal,
    updateConnectionDraftField,
    saveConnectionDraft,
    deleteConnection,

    openNewPresenceBinding,
    openEditPresenceBinding,
    closePresenceBindingModal,
    updatePresenceBindingDraftField,
    applyNpcEntryToPresenceBindingDraft,
    savePresenceBindingDraft,
    deletePresenceBinding,

    openNewWeatherScope,
    openEditWeatherScope,
    closeWeatherScopeModal,
    updateWeatherScopeDraftField,
    saveWeatherScopeDraft,
    deleteWeatherScope,
  };
}