"use client";

import { useMemo, useState } from "react";

import {
  getMechanicsPresetDefinition,
  listMechanicsPresetCatalog,
} from "../mechanics-presets/mechanicsPresetLibrary.js";
import {
  applyMechanicsPresetToModuleData,
  listMechanicsPresetCommandTargets,
  previewMechanicsPresetApplication,
} from "../mechanics-presets/mechanicsPresetApplicationService.js";
import {
  buildMechanicsPresetLiveValidationGuide,
} from "../mechanics-presets/mechanicsPresetLiveValidation.js";

const SCOPE_OPTIONS = Object.freeze([
  { id: "ALL", label: "All Presets" },
  { id: "MODULE", label: "Modules" },
  { id: "COMMAND", label: "Commands" },
  { id: "COMMAND_RESOLUTION", label: "Resolution" },
  { id: "COMMAND_COMPOSITION", label: "Composition" },
]);

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function needsCommandTarget(scope) {
  return ["COMMAND", "COMMAND_RESOLUTION", "COMMAND_COMPOSITION"].includes(scope);
}

function makePresetCard(definition) {
  const liveValidation = buildMechanicsPresetLiveValidationGuide({
    presetId: definition.id,
  });

  return {
    id: definition.id,
    label: definition.label,
    description: definition.description,
    eyebrow: definition.preview?.eyebrow || definition.category,
    summary: definition.preview?.summary || definition.description,
    badges: Array.isArray(definition.preview?.badges)
      ? definition.preview.badges
      : [],
    scope: definition.scope,
    category: definition.category,
    available: definition.availability?.available !== false,
    unavailableReason: definition.availability?.reason || "",
    validationStatus: liveValidation?.status || "",
    validationLabel: liveValidation?.statusLabel || "",
    testCommand: liveValidation?.testCommand || "",
  };
}

export function useMechanicsPresetApplicationViewModel({
  moduleData,
  onApply,
  onClose,
}) {
  const commandTargets = useMemo(
    () => listMechanicsPresetCommandTargets(moduleData),
    [moduleData]
  );
  const [selectedCommandId, setSelectedCommandId] = useState(
    commandTargets[0]?.id || ""
  );
  const [selectedPresetId, setSelectedPresetId] = useState("");
  const [selectedApplyMode, setSelectedApplyMode] = useState("");
  const [query, setQuery] = useState("");
  const [scopeFilter, setScopeFilter] = useState("ALL");
  const [replacementConfirmed, setReplacementConfirmed] = useState(false);
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  const selectedTarget = commandTargets.find(
    (target) => target.id === selectedCommandId
  );
  const argumentOptions = selectedTarget?.argumentOptions || [];

  const definitions = useMemo(
    () =>
      listMechanicsPresetCatalog({
        scopes: scopeFilter === "ALL" ? [] : [scopeFilter],
        query,
        argumentOptions,
        includeUnavailable: true,
      }),
    [scopeFilter, query, argumentOptions]
  );

  const selectedPreset = selectedPresetId
    ? getMechanicsPresetDefinition(selectedPresetId, { argumentOptions })
    : null;
  const requiresCommandTarget = needsCommandTarget(selectedPreset?.scope);
  const applyModeOptions = (selectedPreset?.application?.allowedModes || []).map(
    (mode) => ({
      id: mode,
      label: mode.replaceAll("_", " "),
      destructive: ["REPLACE_COMMAND", "REPLACE_MODULE"].includes(mode),
    })
  );
  const effectiveApplyMode =
    selectedApplyMode || selectedPreset?.application?.defaultMode || "";
  const liveValidation = selectedPreset
    ? buildMechanicsPresetLiveValidationGuide({
        presetId: selectedPreset.id,
        moduleData,
        commandId: selectedCommandId,
        argumentOptions,
      })
    : null;

  const preview = selectedPreset
    ? previewMechanicsPresetApplication({
        moduleData,
        presetId: selectedPreset.id,
        applyMode: effectiveApplyMode,
        commandId: selectedCommandId,
      })
    : null;
  const confirmationRequired = Boolean(preview?.destructive);
  const canApply = Boolean(
    selectedPreset &&
      selectedPreset.availability?.available !== false &&
      (!requiresCommandTarget || selectedCommandId) &&
      preview?.valid &&
      (!confirmationRequired || replacementConfirmed)
  );

  function choosePreset(presetId) {
    const definition = getMechanicsPresetDefinition(presetId, { argumentOptions });
    setSelectedPresetId(presetId);
    setSelectedApplyMode(definition?.application?.defaultMode || "");
    setReplacementConfirmed(false);
    setErrors([]);
    setWarnings([]);
    setStatusMessage("");
  }

  function chooseCommand(commandId) {
    setSelectedCommandId(commandId);
    setReplacementConfirmed(false);
    setErrors([]);
    setWarnings([]);
    setStatusMessage("");
  }

  function chooseApplyMode(mode) {
    setSelectedApplyMode(mode);
    setReplacementConfirmed(false);
    setErrors([]);
    setWarnings([]);
    setStatusMessage("");
  }

  function applyPreset() {
    if (!selectedPreset) return;

    if (confirmationRequired && !replacementConfirmed) {
      setErrors([
        {
          path: "$.confirmation",
          message: "Confirm the replacement boundary before applying this preset.",
        },
      ]);
      return;
    }

    const result = applyMechanicsPresetToModuleData({
      moduleData,
      presetId: selectedPreset.id,
      applyMode: effectiveApplyMode,
      commandId: selectedCommandId,
    });

    setErrors(result.errors || []);
    setWarnings(result.warnings || []);

    if (!result.ok) {
      setStatusMessage("Preset application was rejected. The builder was not changed.");
      return;
    }

    const appliedLiveValidation = buildMechanicsPresetLiveValidationGuide({
      presetId: selectedPreset.id,
      moduleData: result.data,
      commandId: selectedCommandId,
      commandIndex: result.commandIndex,
      argumentOptions,
    });

    onApply?.(result.data, result.audit, appliedLiveValidation);
    setStatusMessage("Preset applied to the open builder.");
    onClose?.();
  }

  return {
    title: "Mechanics Preset Library",
    description:
      "Preview and apply validated Resolution, Composition, Command, or complete Module presets. Changes update the open builder atomically; the normal page Save action still controls persistence.",
    query,
    scopeFilter,
    scopeOptions: SCOPE_OPTIONS,
    presetCards: definitions.map(makePresetCard),
    selectedPresetId,
    selectedPreset: selectedPreset
      ? {
          id: selectedPreset.id,
          label: selectedPreset.label,
          description: selectedPreset.description,
          eyebrow: selectedPreset.preview?.eyebrow || selectedPreset.category,
          summary: selectedPreset.preview?.summary || selectedPreset.description,
          badges: selectedPreset.preview?.badges || [],
          scope: selectedPreset.scope,
          category: selectedPreset.category,
          replacementPaths: selectedPreset.application?.replacementPaths || [],
          preservedPaths: selectedPreset.application?.preservedPaths || [],
          available: selectedPreset.availability?.available !== false,
          unavailableReason: selectedPreset.availability?.reason || "",
          liveValidation,
        }
      : null,
    commandTargets,
    selectedCommandId,
    requiresCommandTarget,
    applyModeOptions,
    selectedApplyMode: effectiveApplyMode,
    preview,
    errors: errors.length ? errors : preview?.errors || [],
    warnings: warnings.length ? warnings : preview?.warnings || [],
    confirmationRequired,
    replacementConfirmed,
    canApply,
    statusMessage,
    onClose,
    onChangeQuery: (value) => setQuery(normalizeString(value)),
    onChooseScope: (scope) => setScopeFilter(scope),
    onChoosePreset: choosePreset,
    onChooseCommand: chooseCommand,
    onChooseApplyMode: chooseApplyMode,
    onToggleReplacementConfirmation: setReplacementConfirmed,
    onApplyPreset: applyPreset,
  };
}
