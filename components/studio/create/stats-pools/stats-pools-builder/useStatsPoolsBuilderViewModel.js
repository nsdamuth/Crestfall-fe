"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createStatsPoolsProfileDraft } from "@/lib/client/studio/stats-pools/statsPoolsClient";
import {
  normalizeStatsPoolsEditorValue,
  useStatsPoolsEditorViewModel,
  validateStatsPoolsEditorValue,
} from "@/components/studio/create/stats-pools/stats-pools-editor/useStatsPoolsEditorViewModel";
import {
  STATS_POOLS_CONTENT_RATING_OPTIONS,
  STATS_POOLS_PROFILE_CREATION_TYPE,
  STATS_POOLS_VISIBILITY_OPTIONS,
} from "./StatsPoolsBuilder.contract";

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function extractCreation(payload) {
  return payload?.data?.creation || payload?.creation || null;
}

function createInitialProfile() {
  return normalizeStatsPoolsEditorValue({
    title: "Stats & Pools",
    description:
      "Reusable actor stat and resource-pool definitions with owner-scoped runtime state.",
    enabled: true,
    profileMode: "SPARSE",
    capabilityPolicy: {
      mode: "STANDARD",
      numericResolutionPolicy: "DETERMINISTIC",
      workingModeProfile: "",
      notes: "",
    },
    statDefinitions: [],
    poolDefinitions: [],
    modifierDefinitions: [],
    conditionDefinitions: [],
  });
}

function createInitialDraft(initialDraft) {
  const source = normalizeObject(initialDraft);
  return {
    title: typeof source.title === "string" ? source.title : "",
    description:
      typeof source.description === "string" ? source.description : "",
    visibility: source.visibility === "UNLISTED" ? "UNLISTED" : "PRIVATE",
    contentRating: ["SFW", "MATURE", "EXPLICIT"].includes(source.contentRating)
      ? source.contentRating
      : "SFW",
    statsPoolsProfile: normalizeStatsPoolsEditorValue(
      source.statsPoolsProfile ||
        source.stats_pools_profile ||
        createInitialProfile()
    ),
  };
}

export function useStatsPoolsBuilderViewModel({
  initialDraft = null,
  createDraft = createStatsPoolsProfileDraft,
  onCreated = null,
} = {}) {
  const router = useRouter();
  const [draft, setDraft] = useState(() => createInitialDraft(initialDraft));
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const validation = useMemo(
    () => validateStatsPoolsEditorValue(draft.statsPoolsProfile),
    [draft.statsPoolsProfile]
  );
  const errors = Array.isArray(validation?.errors) ? validation.errors : [];
  const warnings = Array.isArray(validation?.warnings) ? validation.warnings : [];

  function updateIdentity(field, value) {
    if (!["title", "description", "visibility", "contentRating"].includes(field)) {
      return;
    }
    setDraft((current) => ({ ...current, [field]: String(value ?? "") }));
  }

  function updateProfile(nextValue) {
    setDraft((current) => ({
      ...current,
      statsPoolsProfile: normalizeStatsPoolsEditorValue(nextValue),
    }));
  }

  const editorViewProps = useStatsPoolsEditorViewModel({
    value: draft.statsPoolsProfile,
    onChange: updateProfile,
  });

  const saveDisabled =
    saveStatus === "saving" || !normalizeString(draft.title) || errors.length > 0;

  async function save() {
    if (saveDisabled) return;
    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const payload = await createDraft({
        type: STATS_POOLS_PROFILE_CREATION_TYPE,
        title: normalizeString(draft.title),
        description:
          normalizeString(draft.description) ||
          "A reusable Crestfall Stats & Pools Profile.",
        visibility: draft.visibility,
        content_rating: draft.contentRating,
        data: {
          builder: "STATS_POOLS_PROFILE_BUILDER",
          builder_version: "0.1",
          stats_pools_profile: normalizeStatsPoolsEditorValue(
            draft.statsPoolsProfile
          ),
        },
      });

      const creation = extractCreation(payload);
      if (!creation?.id) {
        throw new Error(
          "Stats & Pools Profile was saved, but no creation ID was returned."
        );
      }

      setSaveStatus("saved");
      setSaveMessage("Stats & Pools Profile draft saved.");

      if (typeof onCreated === "function") {
        onCreated(creation);
      } else {
        router.replace(`/studio/my-creations/${creation.id}/edit`);
      }
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(
        error?.message || "Stats & Pools Profile draft could not be saved."
      );
    }
  }

  return {
    title: draft.title,
    description: draft.description,
    visibility: draft.visibility,
    contentRating: draft.contentRating,
    visibilityOptions: STATS_POOLS_VISIBILITY_OPTIONS,
    contentRatingOptions: STATS_POOLS_CONTENT_RATING_OPTIONS,
    editorViewProps,
    saveDisabled,
    saveStatus,
    saveMessage,
    errorCount: errors.length,
    warningCount: warnings.length,
    onUpdateIdentity: updateIdentity,
    onSave: save,
  };
}
