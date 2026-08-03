"use client";

import { useEffect, useState } from "react";

import {
  useMechanicsDocumentOrchestrationViewModel,
} from "../mechanics-document-orchestration/MechanicsDocumentOrchestration";
import {
  MECHANICS_DOCUMENT_IDENTITIES,
} from "../mechanics-core/MechanicsDocumentCore.contract.js";
import {
  replaceMechanicsInstanceData,
  replaceMechanicsRootFields,
} from "../mechanics-core/mechanicsDocumentCompatibility.js";
import {
  normalizeMechanicsTrackers,
} from "../mechanics-trackers/mechanicsTrackersNormalization.js";
import {
  normalizeMechanicsDefaults,
} from "../mechanics-defaults/mechanicsDefaultsNormalization.js";
import {
  normalizeMechanicsStatusBlocks,
} from "../mechanics-status-blocks/mechanicsStatusBlocksNormalization.js";
import {
  normalizeMechanicsGuards,
} from "../mechanics-guards/mechanicsGuardsNormalization.js";
import {
  DEFAULT_MECHANICS_MODULE_ASSEMBLY_SECTION_STATE,
  MECHANICS_MODULE_ASSEMBLY_SECTION_IDS,
} from "./MechanicsModuleAssembly.contract.js";
import {
  asMechanicsArray,
  buildMechanicsModuleAssemblyProjection,
  normalizeMechanicsAssemblyCommand,
  normalizeMechanicsTags,
  pluralizeMechanicsCount,
} from "./mechanicsModuleAssemblyOperations.js";

const SECTION_KEYS = Object.keys(MECHANICS_MODULE_ASSEMBLY_SECTION_IDS);

export function useMechanicsModuleAssemblyViewModel({
  mechanicsData = {},
  updateDataField = null,
  canReplaceData = false,
  onReplaceMechanicsData = null,
} = {}) {
  const projection = buildMechanicsModuleAssemblyProjection(mechanicsData);
  const {
    data,
    instanceData,
    trackers,
    commands,
    defaults,
    statusBlocks,
    guards,
    tagsText,
    priority,
    trackerSummary,
    commandSummary,
    defaultEntryCount,
  } = projection;
  const [expandedSections, setExpandedSections] = useState(
    DEFAULT_MECHANICS_MODULE_ASSEMBLY_SECTION_STATE
  );
  const [foldSignal, setFoldSignal] = useState({ revision: 0, expanded: false });
  const documentOrchestration = useMechanicsDocumentOrchestrationViewModel({
    mechanicsData: data,
    canReplaceData,
    onReplaceMechanicsData,
  });

  function applyMechanicsDocument(nextData, fallbackUpdates = {}) {
    if (canReplaceData && typeof onReplaceMechanicsData === "function") {
      onReplaceMechanicsData(nextData);
      return;
    }

    if (typeof updateDataField !== "function") return;
    Object.entries(fallbackUpdates).forEach(([key, value]) => {
      updateDataField(key, value);
    });
  }

  function patchData(updates) {
    documentOrchestration.dismissPresetValidationGuide();
    applyMechanicsDocument(replaceMechanicsRootFields(data, updates), updates);
  }

  function updateInstanceData(updates = {}) {
    documentOrchestration.dismissPresetValidationGuide();
    const nextInstanceData = {
      ...instanceData,
      contractVersion: MECHANICS_DOCUMENT_IDENTITIES.contractVersion,
      trackers: asMechanicsArray(instanceData.trackers),
      guards: normalizeMechanicsGuards(instanceData.guards),
      commands: asMechanicsArray(instanceData.commands),
      statusBlocks: normalizeMechanicsStatusBlocks(instanceData.statusBlocks),
      defaults: normalizeMechanicsDefaults(instanceData.defaults),
      ...updates,
    };
    const nextData = replaceMechanicsInstanceData(data, nextInstanceData);

    applyMechanicsDocument(nextData, {
      contractVersion: MECHANICS_DOCUMENT_IDENTITIES.contractVersion,
      instanceData: nextData.instanceData,
    });
  }

  function updateCommands(commandsNext) {
    updateInstanceData({
      commands: asMechanicsArray(commandsNext).map((command, index) =>
        normalizeMechanicsAssemblyCommand(command, index)
      ),
    });
  }

  function toggleSection(sectionKey) {
    setExpandedSections((current) => ({
      ...current,
      [sectionKey]: !current[sectionKey],
    }));
  }

  function setAllSections(expanded) {
    setExpandedSections(
      Object.fromEntries(SECTION_KEYS.map((sectionKey) => [sectionKey, expanded]))
    );
    setFoldSignal((current) => ({
      revision: current.revision + 1,
      expanded,
    }));
  }

  function navigateToSection(sectionId) {
    const sectionKey = Object.entries(MECHANICS_MODULE_ASSEMBLY_SECTION_IDS).find(
      ([, id]) => id === sectionId
    )?.[0];
    if (!sectionKey) return;

    setExpandedSections((current) => ({ ...current, [sectionKey]: true }));
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  }

  useEffect(() => {
    function handleNavigate(event) {
      navigateToSection(event?.detail?.sectionId);
    }
    function handleFoldAll(event) {
      setAllSections(event?.detail?.expanded === true);
    }

    window.addEventListener("crestfall:mechanics-runtime-navigate", handleNavigate);
    window.addEventListener("crestfall:mechanics-runtime-fold-all", handleFoldAll);

    const initialHash = window.location.hash.replace(/^#/, "");
    if (Object.values(MECHANICS_MODULE_ASSEMBLY_SECTION_IDS).includes(initialHash)) {
      navigateToSection(initialHash);
    }

    return () => {
      window.removeEventListener("crestfall:mechanics-runtime-navigate", handleNavigate);
      window.removeEventListener("crestfall:mechanics-runtime-fold-all", handleFoldAll);
    };
  }, []);

  useEffect(() => {
    const elements = Object.values(MECHANICS_MODULE_ASSEMBLY_SECTION_IDS)
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!elements.length || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) =>
              Math.abs(left.boundingClientRect.top) -
              Math.abs(right.boundingClientRect.top)
          )[0];
        if (!visible?.target?.id) return;
        window.dispatchEvent(
          new CustomEvent("crestfall:mechanics-runtime-active", {
            detail: { sectionId: visible.target.id },
          })
        );
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: [0, 0.01, 1] }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return {
    projection,
    documentOrchestration,
    foldSignal,
    updateCommands,
    updateTrackers(trackersNext) {
      updateInstanceData({ trackers: normalizeMechanicsTrackers(trackersNext) });
    },
    updateDefaults(defaultsNext) {
      updateInstanceData({ defaults: normalizeMechanicsDefaults(defaultsNext) });
    },
    updateStatusBlocks(statusBlocksNext) {
      updateInstanceData({
        statusBlocks: normalizeMechanicsStatusBlocks(statusBlocksNext),
      });
    },
    updateGuards(guardsNext) {
      updateInstanceData({ guards: normalizeMechanicsGuards(guardsNext) });
    },
    viewProps: {
      sectionIds: MECHANICS_MODULE_ASSEMBLY_SECTION_IDS,
      expandedSections,
      moduleDefinitionId: data.moduleDefinitionId,
      moduleDefinitionFallback: MECHANICS_DOCUMENT_IDENTITIES.moduleId,
      contractVersion: MECHANICS_DOCUMENT_IDENTITIES.contractVersion,
      priority,
      tagsText,
      trackerBadge: pluralizeMechanicsCount(trackers.length, "tracker"),
      trackerSummary,
      commandBadge: pluralizeMechanicsCount(commands.length, "command"),
      commandSummary,
      defaultsBadge: pluralizeMechanicsCount(defaultEntryCount, "entry", "entries"),
      statusBlocksBadge: pluralizeMechanicsCount(statusBlocks.length, "block"),
      guardsBadge: pluralizeMechanicsCount(guards.length, "guard"),
      onToggleSection: toggleSection,
      onCollapseAll: () => setAllSections(false),
      onExpandAll: () => setAllSections(true),
      onChangeModuleDefinitionId(value) {
        patchData({
          moduleDefinitionId: value || MECHANICS_DOCUMENT_IDENTITIES.moduleId,
          moduleId: value || MECHANICS_DOCUMENT_IDENTITIES.moduleId,
        });
      },
      onChangePriority(value) {
        const parsed = Number(value);
        patchData({ priority: Number.isFinite(parsed) ? parsed : 65 });
      },
      onChangeTags(value) {
        patchData({ tags: normalizeMechanicsTags(value) });
      },
    },
  };
}
