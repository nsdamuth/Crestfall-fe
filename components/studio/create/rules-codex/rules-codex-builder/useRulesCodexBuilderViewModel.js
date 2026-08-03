"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createRulesCodexDraft } from "@/lib/client/studio/rules-codex/rulesCodexClient";
import {
  normalizeRulesCodexEditorValue,
  useRulesCodexEditorViewModel,
  validateRulesCodexEditorValue,
} from "@/components/studio/create/rules-codex/rules-codex-editor/useRulesCodexEditorViewModel";
import {
  RULES_CODEX_CONTENT_RATING_OPTIONS,
  RULES_CODEX_CREATION_TYPE,
  RULES_CODEX_VISIBILITY_OPTIONS,
} from "./RulesCodexBuilder.contract";

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function extractCreation(payload) {
  return payload?.data?.creation || payload?.creation || null;
}

function createInitialCodex() {
  return normalizeRulesCodexEditorValue({
    enabled: true,
    summary: "",
    selectionPolicy: {
      maxSelectedSections: 8,
      maxContextCharacters: 12000,
    },
    sections: [],
  });
}

function createInitialDraft(initialDraft) {
  const source = initialDraft && typeof initialDraft === "object" ? initialDraft : {};

  return {
    title: typeof source.title === "string" ? source.title : "",
    description: typeof source.description === "string" ? source.description : "",
    visibility: source.visibility === "UNLISTED" ? "UNLISTED" : "PRIVATE",
    contentRating: ["SFW", "MATURE", "EXPLICIT"].includes(source.contentRating)
      ? source.contentRating
      : "SFW",
    rulesCodex: normalizeRulesCodexEditorValue(
      source.rulesCodex || source.rules_codex || createInitialCodex()
    ),
  };
}

export function useRulesCodexBuilderViewModel({
  initialDraft = null,
  createDraft = createRulesCodexDraft,
  onCreated = null,
} = {}) {
  const router = useRouter();
  const [draft, setDraft] = useState(() => createInitialDraft(initialDraft));
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const codexIssues = useMemo(
    () => validateRulesCodexEditorValue(draft.rulesCodex),
    [draft.rulesCodex]
  );
  const errors = codexIssues.filter((issue) => issue.severity !== "WARNING");
  const warnings = codexIssues.filter((issue) => issue.severity === "WARNING");

  function updateIdentity(field, value) {
    if (!["title", "description", "visibility", "contentRating"].includes(field)) {
      return;
    }

    setDraft((current) => ({
      ...current,
      [field]: String(value ?? ""),
    }));
  }

  function updateRulesCodex(nextValue) {
    setDraft((current) => ({
      ...current,
      rulesCodex: normalizeRulesCodexEditorValue(nextValue),
    }));
  }

  const editorViewProps = useRulesCodexEditorViewModel({
    value: draft.rulesCodex,
    onChange: updateRulesCodex,
  });

  const saveDisabled =
    saveStatus === "saving" || !normalizeString(draft.title) || errors.length > 0;

  async function save() {
    if (saveDisabled) return;

    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const payload = await createDraft({
        type: RULES_CODEX_CREATION_TYPE,
        title: normalizeString(draft.title),
        description:
          normalizeString(draft.description) ||
          "A scoped Crestfall Rules Codex.",
        visibility: draft.visibility,
        content_rating: draft.contentRating,
        data: {
          builder: "RULES_CODEX_BUILDER",
          builder_version: "0.1",
          rules_codex: normalizeRulesCodexEditorValue(draft.rulesCodex),
        },
      });

      const creation = extractCreation(payload);

      if (!creation?.id) {
        throw new Error("Rules Codex was saved, but no creation ID was returned.");
      }

      setSaveStatus("saved");
      setSaveMessage("Rules Codex draft saved.");

      if (typeof onCreated === "function") {
        onCreated(creation);
      } else {
        router.replace(`/studio/my-creations/${creation.id}/edit`);
      }
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error?.message || "Rules Codex draft could not be saved.");
    }
  }

  return {
    title: draft.title,
    description: draft.description,
    visibility: draft.visibility,
    contentRating: draft.contentRating,
    visibilityOptions: RULES_CODEX_VISIBILITY_OPTIONS,
    contentRatingOptions: RULES_CODEX_CONTENT_RATING_OPTIONS,
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
