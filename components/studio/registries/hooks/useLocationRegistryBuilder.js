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
  buildLocationRegistryScopeLocationOptions,
  normalizeLocationRegistryLocationOptions,
  normalizeLocationRegistryRegistryOptions,
  hydrateLocationRegistryReferenceEntries,
  buildLocationRegistryData,
  createEmptyLocationConnection,
  createEmptyLocationEntry,
  createEmptyPresenceBinding,
  createEmptyWeatherScope,
  createStarterLocationRegistry,
  normalizeLocationConnection,
  normalizeLocationEntry,
  normalizeLocationRegistry,
  normalizeLocationRegistryCharacterOptions,
  normalizeLocationRegistryNpcEntryOptions,
  hydrateLocationRegistryPresenceBindings,
  normalizePresenceBinding,
  normalizeWeatherScope,
  upsertById,
} from "@/components/studio/registries/locationRegistryUtils";
import {
  fetchLocationRegistryById,
  fetchLocationRegistryCharacterOptions,
  fetchLocationRegistryLocationOptions,
  fetchLocationRegistryRegistryOptions,
} from "@/lib/client/studio/registries/registryClient";
import { createLocationRegistrySaveSession } from "@/components/studio/registries/hooks/locationRegistrySaveSession.mjs";
import {
  resolveLocationConnectionEndpointSelection,
} from "@/components/studio/registries/locationRegistryConnectionEndpointSelection.mjs";

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

function getPresencePersonIdentityKey(person = {}) {
  const registryCreationId = String(
    person?.registryCreationId ||
      person?.legacyReference?.registryCreationId ||
      ""
  ).trim();
  const registryEntryId = String(
    person?.registryEntryId ||
      person?.legacyReference?.registryEntryId ||
      ""
  ).trim();

  if (registryCreationId && registryEntryId) {
    return `NPC_REGISTRY_ENTRY:${registryCreationId}:${registryEntryId}`;
  }

  const creationId = String(person?.creationId || "").trim();

  return creationId ? `CHARACTER:${creationId}` : "";
}

export function useLocationRegistryBuilder({
  mode = "create",
  currentCreationId = "",
  initialTitle = "",
  initialDescription = "",
  initialData = null,
  onChange,
} = {}) {
  const router = useRouter();
  const isEditMode = mode === "edit";
  const [locationOptions, setLocationOptions] = useState([]);
  const [locationLoadError, setLocationLoadError] = useState("");
  const [characterOptions, setCharacterOptions] = useState([]);
  const [characterLoadError, setCharacterLoadError] = useState("");
  const [npcEntryOptions, setNpcEntryOptions] = useState([]);
  const [npcEntryLoadError, setNpcEntryLoadError] = useState("");
  const [registryOptions, setRegistryOptions] = useState([]);
  const [registryLoadError, setRegistryLoadError] = useState("");
  const [parentRegistryCreation, setParentRegistryCreation] = useState(null);
  const [parentRegistryLoadError, setParentRegistryLoadError] = useState("");
  const [ancestorRegistries, setAncestorRegistries] = useState([]);
  const [referenceRegistryCreationsById, setReferenceRegistryCreationsById] =
    useState({});
  const [referenceRegistryLoadError, setReferenceRegistryLoadError] =
    useState("");

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

    async function loadRegistries() {
      setRegistryLoadError("");

      try {
        const creations = await fetchLocationRegistryRegistryOptions();

        if (!cancelled) {
          setRegistryOptions(
            normalizeLocationRegistryRegistryOptions(creations, {
              excludeCreationId: currentCreationId,
            })
          );
        }
      } catch (error) {
        if (!cancelled) {
          setRegistryOptions([]);
          setRegistryLoadError(
            error.message || "Location Registry options could not be loaded."
          );
        }
      }
    }

    loadRegistries();

    return () => {
      cancelled = true;
    };
  }, [currentCreationId]);

  useEffect(() => {
    if (!locationOptions.length) return;

    setRegistry((current) =>
      hydrateLocationRegistryReferenceEntries(current, locationOptions)
    );
  }, [locationOptions]);

  useEffect(() => {
    let cancelled = false;

    async function loadCharacters() {
      setCharacterLoadError("");

      try {
        const creations = await fetchLocationRegistryCharacterOptions();

        if (!cancelled) {
          setCharacterOptions(
            normalizeLocationRegistryCharacterOptions(creations)
          );
        }
      } catch (error) {
        if (!cancelled) {
          setCharacterOptions([]);
          setCharacterLoadError(
            error.message || "Character creations could not be loaded."
          );
        }
      }
    }

    loadCharacters();

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

  const hydratedRegistry = useMemo(
    () =>
      hydrateLocationRegistryPresenceBindings(
        normalizedRegistry,
        characterOptions,
        npcEntryOptions
      ),
    [normalizedRegistry, characterOptions, npcEntryOptions]
  );

  useEffect(() => {
    let cancelled = false;
    const parentRegistryId = normalizedRegistry.parentRegistryId;

    if (!parentRegistryId) {
      setParentRegistryCreation(null);
      setParentRegistryLoadError("");
      setAncestorRegistries([]);
      return () => {
        cancelled = true;
      };
    }

    async function loadAncestorRegistries() {
      setParentRegistryCreation(null);
      setAncestorRegistries([]);
      setParentRegistryLoadError("");

      const seen = new Set(
        currentCreationId ? [String(currentCreationId)] : []
      );
      const localToRoot = [];
      let nextRegistryId = parentRegistryId;
      let immediateParent = null;

      try {
        for (let depth = 0; nextRegistryId && depth < 16; depth += 1) {
          if (seen.has(nextRegistryId)) {
            throw new Error(
              "The selected Location Registry hierarchy contains a cycle."
            );
          }

          seen.add(nextRegistryId);
          const creation = await fetchLocationRegistryById(nextRegistryId);

          if (
            !creation?.id ||
            String(creation.type || "").toUpperCase() !== "LOCATION_REGISTRY"
          ) {
            throw new Error(
              "The selected parent is not an available Location Registry."
            );
          }

          if (!immediateParent) immediateParent = creation;
          localToRoot.push({
            id: creation.id,
            title: creation.title || "Untitled Location Registry",
          });

          const parentData = normalizeLocationRegistry({
            ...(creation.data || {}),
            title: creation.title || "",
            description: creation.description || "",
          });

          nextRegistryId = parentData.parentRegistryId;
        }

        if (nextRegistryId) {
          throw new Error(
            "The selected Location Registry hierarchy exceeds the supported authoring depth."
          );
        }

        if (!cancelled) {
          setParentRegistryCreation(immediateParent);
          setAncestorRegistries(localToRoot.reverse());
        }
      } catch (error) {
        if (!cancelled) {
          setParentRegistryCreation(immediateParent);
          setAncestorRegistries(localToRoot.reverse());
          setParentRegistryLoadError(
            error.message || "Parent Location Registry could not be loaded."
          );
        }
      }
    }

    loadAncestorRegistries();

    return () => {
      cancelled = true;
    };
  }, [currentCreationId, normalizedRegistry.parentRegistryId]);

  const parentLocationOptions = useMemo(() => {
    if (!parentRegistryCreation?.id) return [];

    return buildLocationRegistryScopeLocationOptions(
      {
        ...(parentRegistryCreation.data || {}),
        title: parentRegistryCreation.title || "",
        description: parentRegistryCreation.description || "",
      },
      locationOptions
    );
  }, [parentRegistryCreation, locationOptions]);

  useEffect(() => {
    let cancelled = false;
    const requestedRegistryIds = [
      entryDraft?.parentLocationRef?.registryCreationId,
      connectionDraft?.from?.registryCreationId,
      connectionDraft?.to?.registryCreationId,
      ...normalizedRegistry.entries.map(
        (entry) => entry.parentLocationRef?.registryCreationId
      ),
      ...normalizedRegistry.connections.flatMap((connection) => [
        connection.from?.registryCreationId,
        connection.to?.registryCreationId,
      ]),
    ]
      .map((value) => String(value || "").trim())
      .filter(
        (value, index, values) =>
          value &&
          value !== currentCreationId &&
          values.indexOf(value) === index &&
          !referenceRegistryCreationsById[value]
      );

    if (!requestedRegistryIds.length) {
      return () => {
        cancelled = true;
      };
    }

    async function loadReferenceRegistries() {
      setReferenceRegistryLoadError("");

      try {
        const creations = await Promise.all(
          requestedRegistryIds.map((creationId) =>
            fetchLocationRegistryById(creationId)
          )
        );

        if (cancelled) return;

        const resolved = {};
        creations.forEach((creation) => {
          if (
            creation?.id &&
            String(creation.type || "").toUpperCase() ===
              "LOCATION_REGISTRY"
          ) {
            resolved[creation.id] = creation;
          }
        });

        setReferenceRegistryCreationsById((current) => ({
          ...current,
          ...resolved,
        }));
      } catch (error) {
        if (!cancelled) {
          setReferenceRegistryLoadError(
            error.message ||
              "A referenced Location Registry could not be loaded."
          );
        }
      }
    }

    loadReferenceRegistries();

    return () => {
      cancelled = true;
    };
  }, [
    connectionDraft?.from?.registryCreationId,
    connectionDraft?.to?.registryCreationId,
    currentCreationId,
    entryDraft?.parentLocationRef?.registryCreationId,
    normalizedRegistry.connections,
    normalizedRegistry.entries,
    referenceRegistryCreationsById,
  ]);

  const registryLocationOptionsById = useMemo(() => {
    const optionsById = {};

    if (currentCreationId) {
      optionsById[currentCreationId] = hydratedRegistry.entries.map(
        (entry) => ({
          id: entry.id,
          value: entry.id,
          label: entry.name || entry.id || "Unnamed Location",
          creationId:
            entry.kind === "CREATION_REF" ? entry.creationId || "" : "",
          creationType:
            entry.kind === "CREATION_REF"
              ? entry.creationType || "LOCATION"
              : "",
          kind: entry.kind,
        })
      );
    }

    Object.values(referenceRegistryCreationsById).forEach((creation) => {
      optionsById[creation.id] = buildLocationRegistryScopeLocationOptions(
        {
          ...(creation.data || {}),
          title: creation.title || "",
          description: creation.description || "",
        },
        locationOptions
      );
    });

    return optionsById;
  }, [
    currentCreationId,
    hydratedRegistry.entries,
    locationOptions,
    referenceRegistryCreationsById,
  ]);

  function getRegistryLocationOptions(registryCreationId) {
    const normalizedRegistryId = String(registryCreationId || "").trim();
    const effectiveRegistryId = normalizedRegistryId || currentCreationId;

    return registryLocationOptionsById[effectiveRegistryId] || [];
  }

  const entryCrossRegistryParentLocationOptions = getRegistryLocationOptions(
    entryDraft?.parentLocationRef?.registryCreationId
  );
  const connectionFromLocationOptions = getRegistryLocationOptions(
    connectionDraft?.from?.registryCreationId
  );
  const connectionToLocationOptions = getRegistryLocationOptions(
    connectionDraft?.to?.registryCreationId
  );

  const hierarchyTrail = useMemo(
    () => [
      ...ancestorRegistries,
      {
        id: currentCreationId || "",
        title: normalizedRegistry.title || "Untitled Location Registry",
        current: true,
      },
    ],
    [ancestorRegistries, currentCreationId, normalizedRegistry.title]
  );

  const childRegistryRefs = useMemo(() => {
    const registryById = new Map(
      registryOptions.map((option) => [option.id, option])
    );
    const entryById = new Map(
      hydratedRegistry.entries.map((entry) => [entry.id, entry])
    );
    const discovered = new Map();

    if (currentCreationId) {
      registryOptions
        .filter((option) => option.parentRegistryId === currentCreationId)
        .forEach((option) => {
          discovered.set(option.id, {
            creationId: option.id,
            scopeLocationEntryId: option.scopeLocationEntryId,
            scopeLocationCreationId: option.scopeLocationCreationId,
            loadPolicy: "LOCATION_SCOPED",
            title: option.title,
            scopeLocationName:
              entryById.get(option.scopeLocationEntryId)?.name ||
              option.scopeLocationEntryId ||
              "Unscoped",
            available: true,
            source: "CHILD_DECLARATION",
          });
        });
    }

    normalizedRegistry.childRegistryRefs.forEach((reference) => {
      const option = registryById.get(reference.creationId);
      const existing = discovered.get(reference.creationId);

      discovered.set(reference.creationId, {
        ...existing,
        ...reference,
        title:
          option?.title ||
          existing?.title ||
          "Linked child registry unavailable",
        scopeLocationName:
          entryById.get(reference.scopeLocationEntryId)?.name ||
          existing?.scopeLocationName ||
          reference.scopeLocationEntryId ||
          "Unscoped",
        available: Boolean(option || existing?.available),
        source: existing ? "CHILD_DECLARATION" : "STORED_INDEX",
      });
    });

    return [...discovered.values()].sort((left, right) =>
      String(left.title || "").localeCompare(String(right.title || ""))
    );
  }, [
    currentCreationId,
    hydratedRegistry.entries,
    normalizedRegistry.childRegistryRefs,
    registryOptions,
  ]);

  const hierarchyStatus = useMemo(() => {
    if (!normalizedRegistry.parentRegistryId) return "STANDALONE";
    if (parentRegistryLoadError) return "ERROR";
    if (!parentRegistryCreation) return "LOADING";
    if (!normalizedRegistry.scopeLocationEntryId) return "PARENT_SELECTED";

    return parentLocationOptions.some(
      (option) => option.id === normalizedRegistry.scopeLocationEntryId
    )
      ? "READY"
      : "SCOPE_UNRESOLVED";
  }, [
    normalizedRegistry.parentRegistryId,
    normalizedRegistry.scopeLocationEntryId,
    parentRegistryCreation,
    parentRegistryLoadError,
    parentLocationOptions,
  ]);

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

  function selectParentRegistry(parentRegistryId) {
    commitRegistry({
      ...normalizedRegistry,
      parentRegistryId: String(parentRegistryId || "").trim(),
      scopeLocationEntryId: "",
      scopeLocationCreationId: "",
    });
  }

  function selectParentScopeLocation(scopeLocationEntryId) {
    const normalizedEntryId = String(scopeLocationEntryId || "").trim();
    const selected = parentLocationOptions.find(
      (option) => option.id === normalizedEntryId
    );

    commitRegistry({
      ...normalizedRegistry,
      scopeLocationEntryId: selected?.id || "",
      scopeLocationCreationId: selected?.creationId || "",
    });
  }

  function openHierarchyRegistry(creationId) {
    if (!creationId) return;

    const href = `/studio/my-creations/${creationId}/edit`;

    if (typeof window !== "undefined") {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }

    router.push(href);
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
    setEntryDraft((current) => {
      if (!current) return current;

      if (field === "parentLocationId") {
        return {
          ...current,
          parentLocationId: value,
          ...(value
            ? {
                parentLocationRef: {
                  registryCreationId: "",
                  locationEntryId: "",
                  locationCreationId: "",
                },
              }
            : {}),
        };
      }

      return {
        ...current,
        [field]: value,
      };
    });
  }

  function selectEntryParentRegistry(registryCreationId) {
    const nextRegistryCreationId = String(registryCreationId || "").trim();

    setEntryDraft((current) =>
      current
        ? {
            ...current,
            parentLocationId: nextRegistryCreationId
              ? ""
              : current.parentLocationId,
            parentLocationRef: {
              registryCreationId: nextRegistryCreationId,
              locationEntryId: "",
              locationCreationId: "",
            },
          }
        : current
    );
  }

  function selectEntryParentLocation(locationEntryId) {
    const nextLocationEntryId = String(locationEntryId || "").trim();
    const selected = entryCrossRegistryParentLocationOptions.find(
      (option) => option.id === nextLocationEntryId
    );

    setEntryDraft((current) =>
      current
        ? {
            ...current,
            parentLocationId: "",
            parentLocationRef: {
              registryCreationId:
                current.parentLocationRef?.registryCreationId || "",
              locationEntryId: selected?.id || "",
              locationCreationId: selected?.creationId || "",
            },
          }
        : current
    );
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
      })
    );
  }
  function saveEntryDraft() {
    const nextEntry = normalizeLocationEntry(entryDraft);

    if (nextEntry.kind === "CREATION_REF" ? !nextEntry.creationId : !nextEntry.name) return;

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
      (connection) => {
        const fromRegistryId = String(
          connection.from?.registryCreationId || ""
        ).trim();
        const toRegistryId = String(
          connection.to?.registryCreationId || ""
        ).trim();
        const fromIsLocal =
          !fromRegistryId || fromRegistryId === currentCreationId;
        const toIsLocal =
          !toRegistryId || toRegistryId === currentCreationId;

        return !(
          (fromIsLocal &&
            (connection.from?.locationEntryId ||
              connection.fromLocationId) === entryId) ||
          (toIsLocal &&
            (connection.to?.locationEntryId ||
              connection.toLocationId) === entryId)
        );
      }
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

  function selectConnectionEndpointRegistry(side, registryCreationId) {
    if (!["from", "to"].includes(side)) return;

    const nextRegistryCreationId = String(registryCreationId || "").trim();

    setConnectionDraft((current) => {
      if (!current) return current;

      return {
        ...current,
        [side]: {
          registryCreationId: nextRegistryCreationId,
          locationEntryId: "",
          locationCreationId: "",
        },
        ...(side === "from" ? { fromLocationId: "" } : { toLocationId: "" }),
      };
    });
  }

  function selectConnectionEndpointLocation(side, locationEntryId) {
    if (!["from", "to"].includes(side)) return;

    const nextLocationEntryId = String(locationEntryId || "").trim();
    const referencedLocationOptions =
      side === "from"
        ? connectionFromLocationOptions
        : connectionToLocationOptions;

    setConnectionDraft((current) => {
      if (!current) return current;

      const endpoint = current[side] || {};
      const selectedEndpoint = resolveLocationConnectionEndpointSelection({
        registryCreationId: endpoint.registryCreationId || "",
        locationEntryId: nextLocationEntryId,
        localEntries: hydratedRegistry.entries,
        referencedLocationOptions,
      });

      return {
        ...current,
        [side]: selectedEndpoint,
        ...(side === "from"
          ? { fromLocationId: selectedEndpoint.locationEntryId }
          : { toLocationId: selectedEndpoint.locationEntryId }),
      };
    });
  }

  function saveConnectionDraft() {
    const nextConnection = normalizeLocationConnection(connectionDraft);

    if (!nextConnection.fromLocationId || !nextConnection.toLocationId) {
      return;
    }

    if (
      !currentCreationId &&
      (nextConnection.from?.registryCreationId ||
        nextConnection.to?.registryCreationId)
    ) {
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

  function applyCharacterToPresenceBindingDraft(option) {
    if (!option?.id) return;

    setPresenceBindingDraft((current) => ({
      ...current,
      person: {
        kind: "CREATION_REF",
        creationId: option.id,
        creationType: "CHARACTER",
        displayName: option.title || "Linked Character",
        description: option.description || option.subtitle || "",
        imageUrl: option.imageUrl || "",
        contentRating: option.contentRating || "SFW",
        visibility: option.visibility || "PRIVATE",
        status: option.status || "DRAFT",
        referenceStatus: "RESOLVED",
        legacyReference: null,
      },
    }));
  }

  function applyNpcEntryToPresenceBindingDraft(option) {
    if (!option?.registryCreationId || !option?.registryEntryId) return;

    setPresenceBindingDraft((current) => ({
      ...current,
      person: {
        kind: "NPC_REGISTRY_ENTRY",
        registryCreationId: option.registryCreationId,
        registryEntryId: option.registryEntryId,
        registryTitle: option.registryTitle || "NPC Registry",
        entryKind: option.entryKind || "AD_HOC",
        creationId: option.creationId || "",
        creationType: option.creationType || "",
        displayName: option.displayName || option.title || "NPC Registry entry",
        description: option.description || "",
        imageUrl: option.imageUrl || "",
        contentRating: option.contentRating || "SFW",
        visibility: "",
        status: "",
        aliases: option.aliases || [],
        referenceStatus: "RESOLVED",
        legacyReference: null,
      },
    }));
  }

  function savePresenceBindingDraft() {
    const nextBinding = normalizePresenceBinding(presenceBindingDraft);

    const nextPersonKey = getPresencePersonIdentityKey(nextBinding.person);

    if (!nextBinding.locationEntryId || !nextPersonKey) {
      return;
    }

    const duplicate = normalizedRegistry.presenceBindings.find(
      (binding) =>
        binding.id !== nextBinding.id &&
        binding.locationEntryId === nextBinding.locationEntryId &&
        getPresencePersonIdentityKey(binding.person) === nextPersonKey
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
    registry: hydratedRegistry,
    saveStatus,
    saveMessage,
    savedCreationId,

    entryDraft,
    connectionDraft,
    presenceBindingDraft,
    weatherScopeDraft,

    locationOptions,
    locationLoadError,
    characterOptions,
    characterLoadError,
    npcEntryOptions,
    npcEntryLoadError,
    registryOptions,
    registryLoadError,
    parentLocationOptions,
    parentRegistryLoadError,
    hierarchyTrail,
    hierarchyStatus,
    childRegistryRefs,
    registryLocationOptionsById,
    entryCrossRegistryParentLocationOptions,
    connectionFromLocationOptions,
    connectionToLocationOptions,
    referenceRegistryLoadError,
    crossRegistryAuthoringAvailable: Boolean(currentCreationId),

    setActiveTab,
    updateField,
    selectParentRegistry,
    selectParentScopeLocation,
    openHierarchyRegistry,
    updatePromptGuidance,
    updateRuntimeGuidance,
    saveRegistry,

    openNewEntry,
    openEditEntry,
    closeEntryModal,
    updateEntryDraftField,
    selectEntryParentRegistry,
    selectEntryParentLocation,
    setEntryKind,
    applyLocationToEntryDraft,
    saveEntryDraft,
    deleteEntry,

    openNewConnection,
    openEditConnection,
    closeConnectionModal,
    updateConnectionDraftField,
    selectConnectionEndpointRegistry,
    selectConnectionEndpointLocation,
    saveConnectionDraft,
    deleteConnection,

    openNewPresenceBinding,
    openEditPresenceBinding,
    closePresenceBindingModal,
    updatePresenceBindingDraftField,
    applyCharacterToPresenceBindingDraft,
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
