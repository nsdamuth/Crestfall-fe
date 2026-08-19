export const LOCATION_REGISTRY_SPLIT_ANALYSIS_VERSION =
  "location_registry_split_analysis_v1";

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function list(value) {
  return Array.isArray(value) ? value : [];
}

function localEndpoint(entry, fallbackEntryId, currentCreationId) {
  const endpoint = entry && typeof entry === "object" && !Array.isArray(entry)
    ? entry
    : {};
  const registryCreationId = text(
    endpoint.registryCreationId || endpoint.registry_creation_id
  );
  const locationEntryId =
    text(endpoint.locationEntryId || endpoint.location_entry_id) ||
    text(fallbackEntryId);

  return {
    registryCreationId,
    locationEntryId,
    local:
      !registryCreationId ||
      (Boolean(currentCreationId) && registryCreationId === currentCreationId),
  };
}

function duplicateIds(items = []) {
  const seen = new Set();
  const duplicates = new Set();

  for (const item of items) {
    const id = text(item?.id);
    if (!id) continue;
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }

  return [...duplicates];
}

function buildChildrenByParent(entries, entryById) {
  const childrenByParent = new Map();

  for (const entry of entries) {
    const parentId = text(entry?.parentLocationId || entry?.parent_location_id);
    if (!parentId || !entryById.has(parentId)) continue;

    const children = childrenByParent.get(parentId) || [];
    children.push(entry);
    childrenByParent.set(parentId, children);
  }

  for (const children of childrenByParent.values()) {
    children.sort((left, right) =>
      String(left?.name || left?.title || left?.id || "").localeCompare(
        String(right?.name || right?.title || right?.id || "")
      )
    );
  }

  return childrenByParent;
}

function collectDescendants(scopeEntryId, childrenByParent) {
  const descendants = [];
  const visited = new Set([scopeEntryId]);
  const queue = [...(childrenByParent.get(scopeEntryId) || [])];

  while (queue.length) {
    const entry = queue.shift();
    const entryId = text(entry?.id);
    if (!entryId || visited.has(entryId)) continue;

    visited.add(entryId);
    descendants.push(entry);
    queue.push(...(childrenByParent.get(entryId) || []));
  }

  return descendants;
}

function findParentCycles(entries, entryById) {
  const cycleMembers = new Set();

  for (const entry of entries) {
    const startId = text(entry?.id);
    if (!startId) continue;

    const path = [];
    const indexById = new Map();
    let currentId = startId;

    while (currentId && entryById.has(currentId)) {
      if (indexById.has(currentId)) {
        const cycleStart = indexById.get(currentId);
        path.slice(cycleStart).forEach((id) => cycleMembers.add(id));
        break;
      }

      indexById.set(currentId, path.length);
      path.push(currentId);
      const current = entryById.get(currentId);
      currentId = text(
        current?.parentLocationId || current?.parent_location_id
      );
    }
  }

  return [...cycleMembers];
}

function analyzeSourceIntegrity({
  entries,
  connections,
  presenceBindings,
  weatherScopes,
  currentCreationId,
}) {
  const issues = [];
  const entryById = new Map(
    entries.map((entry) => [text(entry?.id), entry]).filter(([id]) => id)
  );

  for (const id of duplicateIds(entries)) {
    issues.push({
      severity: "ERROR",
      code: "DUPLICATE_ENTRY_ID",
      referenceId: id,
      message: `Location entry id ${id} is duplicated.`,
    });
  }

  for (const id of duplicateIds(connections)) {
    issues.push({
      severity: "ERROR",
      code: "DUPLICATE_CONNECTION_ID",
      referenceId: id,
      message: `Connection id ${id} is duplicated.`,
    });
  }

  for (const id of duplicateIds(presenceBindings)) {
    issues.push({
      severity: "ERROR",
      code: "DUPLICATE_PRESENCE_BINDING_ID",
      referenceId: id,
      message: `People & Presence binding id ${id} is duplicated.`,
    });
  }

  for (const id of duplicateIds(weatherScopes)) {
    issues.push({
      severity: "ERROR",
      code: "DUPLICATE_WEATHER_SCOPE_ID",
      referenceId: id,
      message: `Weather Scope id ${id} is duplicated.`,
    });
  }

  for (const entry of entries) {
    const entryId = text(entry?.id);
    const parentId = text(entry?.parentLocationId || entry?.parent_location_id);
    const parentRef = entry?.parentLocationRef || entry?.parent_location_ref || {};
    const crossParentRegistryId = text(
      parentRef?.registryCreationId || parentRef?.registry_creation_id
    );
    const crossParentEntryId = text(
      parentRef?.locationEntryId || parentRef?.location_entry_id
    );

    if (parentId && crossParentEntryId) {
      issues.push({
        severity: "ERROR",
        code: "CONTRADICTORY_PARENT_REFERENCE",
        referenceId: entryId,
        message: `${entry?.name || entryId} has both local and cross-registry parent references.`,
      });
    }

    if (parentId && parentId === entryId) {
      issues.push({
        severity: "ERROR",
        code: "SELF_PARENT_REFERENCE",
        referenceId: entryId,
        message: `${entry?.name || entryId} references itself as its parent.`,
      });
    } else if (parentId && !entryById.has(parentId)) {
      issues.push({
        severity: "ERROR",
        code: "LOCAL_PARENT_NOT_FOUND",
        referenceId: entryId,
        message: `${entry?.name || entryId} references missing local parent ${parentId}.`,
      });
    }

    if (
      crossParentRegistryId &&
      currentCreationId &&
      crossParentRegistryId === currentCreationId
    ) {
      issues.push({
        severity: "ERROR",
        code: "SAME_REGISTRY_PARENT_STORED_AS_CROSS_REFERENCE",
        referenceId: entryId,
        message: `${entry?.name || entryId} stores a same-registry parent as a cross-registry reference.`,
      });
    }
  }

  for (const entryId of findParentCycles(entries, entryById)) {
    issues.push({
      severity: "ERROR",
      code: "LOCAL_PARENT_CYCLE",
      referenceId: entryId,
      message: `Location entry ${entryId} participates in a local parent cycle.`,
    });
  }

  for (const connection of connections) {
    const connectionId = text(connection?.id) || "unnamed connection";
    const from = localEndpoint(
      connection?.from,
      connection?.fromLocationId || connection?.from_location_id,
      currentCreationId
    );
    const to = localEndpoint(
      connection?.to,
      connection?.toLocationId || connection?.to_location_id,
      currentCreationId
    );

    if (from.local && from.locationEntryId && !entryById.has(from.locationEntryId)) {
      issues.push({
        severity: "ERROR",
        code: "CONNECTION_FROM_NOT_FOUND",
        referenceId: connectionId,
        message: `${connectionId} references missing local from-entry ${from.locationEntryId}.`,
      });
    }

    if (to.local && to.locationEntryId && !entryById.has(to.locationEntryId)) {
      issues.push({
        severity: "ERROR",
        code: "CONNECTION_TO_NOT_FOUND",
        referenceId: connectionId,
        message: `${connectionId} references missing local to-entry ${to.locationEntryId}.`,
      });
    }
  }

  for (const binding of presenceBindings) {
    const bindingId = text(binding?.id) || "unnamed presence binding";
    const locationEntryId = text(
      binding?.locationEntryId || binding?.location_entry_id
    );

    if (locationEntryId && !entryById.has(locationEntryId)) {
      issues.push({
        severity: "ERROR",
        code: "PRESENCE_LOCATION_NOT_FOUND",
        referenceId: bindingId,
        message: `${bindingId} references missing Location entry ${locationEntryId}.`,
      });
    }
  }

  return issues;
}

function classifyConnectionForCandidate({
  connection,
  movedEntryIds,
  currentCreationId,
}) {
  const from = localEndpoint(
    connection?.from,
    connection?.fromLocationId || connection?.from_location_id,
    currentCreationId
  );
  const to = localEndpoint(
    connection?.to,
    connection?.toLocationId || connection?.to_location_id,
    currentCreationId
  );
  const fromMoved = from.local && movedEntryIds.has(from.locationEntryId);
  const toMoved = to.local && movedEntryIds.has(to.locationEntryId);

  if (fromMoved && toMoved) return "INTERNAL";
  if (fromMoved || toMoved) return "BOUNDARY_REWRITE";
  return "RETAINED";
}

function buildCandidate({
  scopeEntry,
  descendants,
  connections,
  presenceBindings,
  weatherScopes,
  childRegistryRefs,
  currentCreationId,
}) {
  const scopeEntryId = text(scopeEntry?.id);
  const movedEntryIds = new Set(descendants.map((entry) => text(entry?.id)));
  const connectionClassifications = connections.map((connection) => ({
    connection,
    classification: classifyConnectionForCandidate({
      connection,
      movedEntryIds,
      currentCreationId,
    }),
  }));
  const movedPresenceBindings = presenceBindings.filter((binding) =>
    movedEntryIds.has(
      text(binding?.locationEntryId || binding?.location_entry_id)
    )
  );
  const movedWeatherScopeIds = new Set(
    descendants
      .map((entry) => text(entry?.weatherScopeId || entry?.weather_scope_id))
      .filter(Boolean)
  );
  const relevantWeatherScopes = weatherScopes.filter((scope) =>
    movedWeatherScopeIds.has(text(scope?.id))
  );
  const authoritativeChildRegistryRefs = childRegistryRefs.filter(
    (reference) => text(reference?.source) === "CHILD_DECLARATION"
  );
  const storedIndexChildRegistryRefs = childRegistryRefs.filter(
    (reference) => text(reference?.source) === "STORED_INDEX"
  );
  const nestedChildRegistryRefs = authoritativeChildRegistryRefs.filter(
    (reference) =>
      movedEntryIds.has(
        text(reference?.scopeLocationEntryId || reference?.scope_location_entry_id)
      )
  );
  const nestedStoredIndexRefs = storedIndexChildRegistryRefs.filter(
    (reference) =>
      movedEntryIds.has(
        text(reference?.scopeLocationEntryId || reference?.scope_location_entry_id)
      )
  );
  const existingChildForScope = authoritativeChildRegistryRefs.find(
    (reference) =>
      text(reference?.scopeLocationEntryId || reference?.scope_location_entry_id) ===
      scopeEntryId
  );

  const internalConnections = connectionClassifications.filter(
    ({ classification }) => classification === "INTERNAL"
  );
  const boundaryConnections = connectionClassifications.filter(
    ({ classification }) => classification === "BOUNDARY_REWRITE"
  );

  return {
    id: `split_candidate:${scopeEntryId}`,
    status: existingChildForScope ? "BLOCKED_EXISTING_CHILD" : "PREVIEW_READY",
    executable: false,
    scopeEntryId,
    scopeEntryCreationId: text(
      scopeEntry?.creationId || scopeEntry?.creation_id
    ),
    scopeName: text(scopeEntry?.name || scopeEntry?.title) || scopeEntryId,
    suggestedChildTitle: `${
      text(scopeEntry?.name || scopeEntry?.title) || "Nested Location"
    } Registry`,
    retainedScopeEntryId: scopeEntryId,
    movedEntryIds: descendants.map((entry) => text(entry?.id)).filter(Boolean),
    movedEntryNames: descendants.map(
      (entry) => text(entry?.name || entry?.title) || text(entry?.id)
    ),
    entryCount: descendants.length,
    internalConnectionIds: internalConnections
      .map(({ connection }) => text(connection?.id))
      .filter(Boolean),
    internalConnectionCount: internalConnections.length,
    boundaryConnectionIds: boundaryConnections
      .map(({ connection }) => text(connection?.id))
      .filter(Boolean),
    boundaryConnectionCount: boundaryConnections.length,
    presenceBindingIds: movedPresenceBindings
      .map((binding) => text(binding?.id))
      .filter(Boolean),
    presenceBindingCount: movedPresenceBindings.length,
    weatherScopeIds: relevantWeatherScopes
      .map((scope) => text(scope?.id))
      .filter(Boolean),
    weatherScopeCount: relevantWeatherScopes.length,
    nestedChildRegistryCreationIds: nestedChildRegistryRefs
      .map((reference) => text(reference?.creationId || reference?.creation_id))
      .filter(Boolean),
    nestedChildReferenceRewriteCount: nestedChildRegistryRefs.length,
    storedChildIndexRefreshCount: nestedStoredIndexRefs.length,
    existingChildRegistryCreationId: text(
      existingChildForScope?.creationId || existingChildForScope?.creation_id
    ),
    stableEntryIdsPreserved: true,
  };
}

function annotateCandidateOverlap(candidates) {
  return candidates.map((candidate) => {
    const moved = new Set(candidate.movedEntryIds);
    const overlappingCandidateIds = candidates
      .filter((other) => other.id !== candidate.id)
      .filter((other) => other.movedEntryIds.some((id) => moved.has(id)))
      .map((other) => other.id);

    return {
      ...candidate,
      overlappingCandidateIds,
      overlapCount: overlappingCandidateIds.length,
    };
  });
}

export function analyzeLocationRegistrySplit({
  registry = {},
  currentCreationId = "",
} = {}) {
  const entries = list(registry?.entries);
  const connections = list(registry?.connections);
  const presenceBindings = list(
    registry?.presenceBindings || registry?.presence_bindings
  );
  const weatherScopes = list(registry?.weatherScopes || registry?.weather_scopes);
  const childRegistryRefs = list(
    registry?.childRegistryRefs || registry?.child_registry_refs
  );
  const entryById = new Map(
    entries.map((entry) => [text(entry?.id), entry]).filter(([id]) => id)
  );
  const childrenByParent = buildChildrenByParent(entries, entryById);
  const issues = analyzeSourceIntegrity({
    entries,
    connections,
    presenceBindings,
    weatherScopes,
    currentCreationId: text(currentCreationId),
  });

  const rawCandidates = entries
    .filter((entry) => (childrenByParent.get(text(entry?.id)) || []).length > 0)
    .map((scopeEntry) =>
      buildCandidate({
        scopeEntry,
        descendants: collectDescendants(text(scopeEntry?.id), childrenByParent),
        connections,
        presenceBindings,
        weatherScopes,
        childRegistryRefs,
        currentCreationId: text(currentCreationId),
      })
    )
    .filter((candidate) => candidate.entryCount > 0)
    .sort((left, right) => {
      if (left.entryCount !== right.entryCount) {
        return right.entryCount - left.entryCount;
      }
      return left.scopeName.localeCompare(right.scopeName);
    });

  const candidates = annotateCandidateOverlap(rawCandidates);
  const errorCount = issues.filter((issue) => issue.severity === "ERROR").length;
  const previewReadyCount = candidates.filter(
    (candidate) => candidate.status === "PREVIEW_READY"
  ).length;

  return {
    version: LOCATION_REGISTRY_SPLIT_ANALYSIS_VERSION,
    status:
      errorCount > 0
        ? "BLOCKED_SOURCE_INTEGRITY"
        : previewReadyCount > 0
          ? "PREVIEW_READY"
          : candidates.length > 0
            ? "NO_NEW_SPLIT_CANDIDATES"
            : "NO_AUTHORED_CONTAINMENT_CANDIDATES",
    mutationPerformed: false,
    currentCreationId: text(currentCreationId),
    source: {
      title: text(registry?.title),
      entryCount: entries.length,
      connectionCount: connections.length,
      presenceBindingCount: presenceBindings.length,
      weatherScopeCount: weatherScopes.length,
      childRegistryReferenceCount: childRegistryRefs.length,
    },
    issues,
    errorCount,
    candidateCount: candidates.length,
    previewReadyCount,
    candidates,
    safeguards: {
      sourceMutationAllowed: false,
      childCreationAllowed: false,
      stableIdsMustBePreserved: true,
      externalReferenceValidation: "REQUIRED_BEFORE_EXECUTION",
      servicesSideRevalidation: "REQUIRED_BEFORE_EXECUTION",
      rollbackGuarantee: "REQUIRED_BEFORE_EXECUTION",
      creatorConfirmation: "REQUIRED_BEFORE_EXECUTION",
    },
  };
}
