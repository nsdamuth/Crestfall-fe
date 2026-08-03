"use client";

import { useState } from "react";
import {
  bodyTypeOptions,
  buildOptions,
  heightOptions,
  kibbeIdentityOptions,
  proportionOptions,
} from "@/components/studio/create/character/constants/constants";

function normalizeSelected(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function getOptionLabel(options, value) {
  return (
    options.find((option) => option.value === value)?.label ||
    value ||
    "Not chosen"
  );
}

function getCurrentProportions(form) {
  const current = normalizeSelected(form?.proportions);
  if (current.length) return current;
  return normalizeSelected(form?.hips_waist_shoulders);
}

function toViewOption(option) {
  return {
    value: option?.value || "",
    label: option?.label || "Not chosen",
    description: option?.description || "",
  };
}

function toViewPreset(option) {
  if (!option) return null;

  return {
    value: option.value || "",
    label: option.label || "Not chosen",
    description: option.description || "",
  };
}

export function useKibbePresetModalViewModel({
  form = {},
  updateField = null,
  updateFields = null,
  label = "Kibbe-Inspired Body Identity",
} = {}) {
  const [open, setOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState(form?.kibbe_identity || "");

  const selectedPreset =
    kibbeIdentityOptions.find(
      (option) => option.value === form?.kibbe_identity
    ) || kibbeIdentityOptions[0];

  const pendingPreset =
    kibbeIdentityOptions.find((option) => option.value === pendingValue) ||
    kibbeIdentityOptions[0];

  function openModal() {
    setPendingValue(form?.kibbe_identity || "");
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setPendingValue(form?.kibbe_identity || "");
  }

  function commitUpdates(updates) {
    if (typeof updateFields === "function") {
      updateFields(updates);
      return;
    }

    if (typeof updateField !== "function") return;

    Object.entries(updates).forEach(([field, value]) => {
      updateField(field, value);
    });
  }

  function applyPreset(mode) {
    if (!pendingPreset?.value) {
      commitUpdates({ kibbe_identity: "" });
      setOpen(false);
      return;
    }

    const suggestions = pendingPreset.suggestions || {};
    const updates = {
      kibbe_identity: pendingPreset.value,
    };

    if (mode !== "identity_only") {
      ["body_type", "build", "height"].forEach((field) => {
        const shouldReplace = mode === "replace";
        const isEmpty = !String(form?.[field] || "").trim();

        if ((shouldReplace || isEmpty) && suggestions[field]) {
          updates[field] = suggestions[field];
        }
      });

      const currentProportions = getCurrentProportions(form);

      if (
        (mode === "replace" || currentProportions.length === 0) &&
        Array.isArray(suggestions.proportions)
      ) {
        updates.proportions = [...suggestions.proportions];
        updates.hips_waist_shoulders = "";
      }
    }

    commitUpdates(updates);
    setOpen(false);
  }

  const suggestionRows = pendingPreset?.value
    ? [
        {
          label: "Body Type",
          value: getOptionLabel(
            bodyTypeOptions,
            pendingPreset.suggestions?.body_type
          ),
        },
        {
          label: "Build",
          value: getOptionLabel(
            buildOptions,
            pendingPreset.suggestions?.build
          ),
        },
        {
          label: "Height",
          value: getOptionLabel(
            heightOptions,
            pendingPreset.suggestions?.height
          ),
        },
        {
          label: "Proportions",
          value:
            normalizeSelected(pendingPreset.suggestions?.proportions)
              .map((value) => getOptionLabel(proportionOptions, value))
              .join(" + ") || "Not chosen",
        },
      ]
    : [];

  return {
    open,
    label,
    selectedPresetLabel: selectedPreset?.label || "Not chosen",
    identityOptions: kibbeIdentityOptions.map(toViewOption),
    pendingValue,
    pendingPreset: toViewPreset(pendingPreset),
    suggestionRows,
    onOpen: openModal,
    onClose: closeModal,
    onSelectIdentity: setPendingValue,
    onSaveIdentityOnly: () => applyPreset("identity_only"),
    onFillEmptyFields: () => applyPreset("fill_empty"),
    onReplaceBodyTraits: () => applyPreset("replace"),
  };
}
