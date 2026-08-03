"use client";

import { useEffect, useMemo, useState } from "react";

import {
  fetchCommunityCreations,
  fetchOwnedCreations,
} from "@/lib/client/studio/creations/creationClient";

const MECHANICS_MODULE_TYPE = "MECHANICS_MODULE";

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getModuleTags(moduleCreation) {
  const data = normalizeObject(moduleCreation?.data);

  return normalizeArray(data.tags)
    .map((tag) => normalizeString(String(tag || "")))
    .filter(Boolean);
}

function getTrackerSummary(moduleCreation) {
  const data = normalizeObject(moduleCreation?.data);
  const instanceData = normalizeObject(data.instanceData);

  return {
    trackerCount: normalizeArray(instanceData.trackers).length,
    guardCount: normalizeArray(instanceData.guards).length,
    commandCount: normalizeArray(instanceData.commands).length,
  };
}

function getSelectionId(sourceId, moduleCreationId) {
  return sourceId && moduleCreationId ? `${sourceId}:${moduleCreationId}` : "";
}

function toViewItem(moduleCreation, sourceId, sourceLabel) {
  const data = normalizeObject(moduleCreation?.data);
  const summary = getTrackerSummary(moduleCreation);

  return {
    id: getSelectionId(sourceId, moduleCreation?.id),
    sourceLabel,
    title: moduleCreation?.title || "Untitled Mechanics Module",
    description:
      moduleCreation?.description || "Reusable runtime mechanics module.",
    moduleId:
      data.moduleDefinitionId || data.moduleId || "core.trackers.v1",
    trackerCount: summary.trackerCount,
    guardCount: summary.guardCount,
    commandCount: summary.commandCount,
    status: moduleCreation?.status || "DRAFT",
    visibility: moduleCreation?.visibility || "PRIVATE",
    tags: getModuleTags(moduleCreation),
    searchTerms: [
      moduleCreation?.creatorUsername,
      moduleCreation?.creator_username,
    ]
      .map((value) => normalizeString(value))
      .filter(Boolean),
  };
}

export function useMechanicsModulePickerViewModel({
  excludedModuleIds = [],
  onClose,
  onSelected,
}) {
  const [ownedModules, setOwnedModules] = useState([]);
  const [publicModules, setPublicModules] = useState([]);
  const [loadStatus, setLoadStatus] = useState("loading");
  const [loadMessage, setLoadMessage] = useState("");

  const excludedIds = useMemo(
    () => new Set(normalizeArray(excludedModuleIds).filter(Boolean)),
    [excludedModuleIds]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadModules() {
      setLoadStatus("loading");
      setLoadMessage("");

      try {
        const [owned, publicItems] = await Promise.allSettled([
          fetchOwnedCreations({ type: MECHANICS_MODULE_TYPE }),
          fetchCommunityCreations({ type: MECHANICS_MODULE_TYPE }),
        ]);

        if (cancelled) return;

        setOwnedModules(
          owned.status === "fulfilled" ? normalizeArray(owned.value) : []
        );
        setPublicModules(
          publicItems.status === "fulfilled"
            ? normalizeArray(publicItems.value)
            : []
        );

        if (owned.status === "rejected" && publicItems.status === "rejected") {
          throw owned.reason || publicItems.reason;
        }

        setLoadStatus("loaded");
      } catch (error) {
        if (cancelled) return;

        setOwnedModules([]);
        setPublicModules([]);
        setLoadStatus("error");
        setLoadMessage(
          error?.message || "Mechanics modules could not be loaded."
        );
      }
    }

    loadModules();

    return () => {
      cancelled = true;
    };
  }, []);

  const rawModulesById = useMemo(() => {
    const modulesById = new Map();

    ownedModules.forEach((moduleCreation) => {
      const selectionId = getSelectionId("mine", moduleCreation?.id);
      if (selectionId) modulesById.set(selectionId, moduleCreation);
    });

    publicModules.forEach((moduleCreation) => {
      const selectionId = getSelectionId("public", moduleCreation?.id);
      if (selectionId) modulesById.set(selectionId, moduleCreation);
    });

    return modulesById;
  }, [ownedModules, publicModules]);

  const sources = useMemo(
    () => [
      {
        id: "mine",
        label: "My Mechanics",
        emptyMessage: "No available mechanics modules found for this tab.",
        items: ownedModules
          .filter((moduleCreation) => !excludedIds.has(moduleCreation?.id))
          .map((moduleCreation) =>
            toViewItem(moduleCreation, "mine", "My Module")
          ),
      },
      {
        id: "public",
        label: "Public Mechanics",
        emptyMessage: "No available mechanics modules found for this tab.",
        items: publicModules
          .filter((moduleCreation) => !excludedIds.has(moduleCreation?.id))
          .map((moduleCreation) =>
            toViewItem(moduleCreation, "public", "Public Module")
          ),
      },
    ],
    [excludedIds, ownedModules, publicModules]
  );

  function chooseModule(moduleSelectionId) {
    const selectedModule = rawModulesById.get(moduleSelectionId);

    if (!selectedModule) return;

    onSelected?.(selectedModule);
    onClose?.();
  }

  return {
    eyebrow: "Mechanics Modules",
    title: "Attach Runtime Mechanics",
    description:
      "Choose a reusable Mechanics Module to attach to this location. Public modules are approved modules published by other creators.",
    sources,
    initialSourceId: "mine",
    loadStatus,
    loadMessage,
    searchPlaceholder: "Search mechanics modules...",
    onClose,
    onChooseModule: chooseModule,
  };
}
