"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createLoreDraft } from "@/lib/client/studio/lore/loreClient";
import {
  createEmptyLoreDocument,
  normalizeLoreDocument,
  useLoreEditorViewModel,
  validateLoreDocument,
} from "@/components/studio/create/lore/lore-editor/useLoreEditorViewModel";
import { useLoreDocumentRendererViewModel } from "@/components/studio/create/lore/lore-document-renderer/useLoreDocumentRendererViewModel";
import {
  LORE_CONTENT_RATING_OPTIONS,
  LORE_CREATION_TYPE,
  LORE_VISIBILITY_OPTIONS,
} from "./LoreBuilder.contract";

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function extractCreation(payload) {
  return payload?.data?.creation || payload?.creation || null;
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
    loreDocument: normalizeLoreDocument(
      source.loreDocument || source.lore_document || createEmptyLoreDocument()
    ),
  };
}

export function useLoreBuilderViewModel({
  initialDraft = null,
  createDraft = createLoreDraft,
  onCreated = null,
} = {}) {
  const router = useRouter();
  const [draft, setDraft] = useState(() => createInitialDraft(initialDraft));
  const [activeMode, setActiveMode] = useState("EDIT");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const issues = useMemo(
    () => validateLoreDocument(draft.loreDocument),
    [draft.loreDocument]
  );
  const errors = issues.filter((issue) => issue.severity !== "WARNING");
  const warnings = issues.filter((issue) => issue.severity === "WARNING");

  function updateIdentity(field, value) {
    if (!["title", "description", "visibility", "contentRating"].includes(field)) return;
    setDraft((current) => ({ ...current, [field]: String(value ?? "") }));
  }

  function updateLoreDocument(nextDocument) {
    setDraft((current) => ({
      ...current,
      loreDocument: normalizeLoreDocument(nextDocument),
    }));
  }

  const editorViewProps = useLoreEditorViewModel({
    value: draft.loreDocument,
    onChange: updateLoreDocument,
    contentRating: draft.contentRating,
  });

  const rendererViewProps = useLoreDocumentRendererViewModel({
    document: draft.loreDocument,
    title: draft.title || "Untitled Lore Asset",
    description: draft.description,
    showTestBanner: true,
    compact: true,
  });

  const saveDisabled =
    saveStatus === "saving" || !normalizeString(draft.title) || errors.length > 0;

  async function save() {
    if (saveDisabled) return;
    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const payload = await createDraft({
        type: LORE_CREATION_TYPE,
        title: normalizeString(draft.title),
        description:
          normalizeString(draft.description) ||
          "A structured Crestfall Lore publication.",
        visibility: draft.visibility,
        content_rating: draft.contentRating,
        data: {
          builder: "LORE_BUILDER",
          builder_version: "0.5",
          lore_document: normalizeLoreDocument(draft.loreDocument),
        },
      });

      const creation = extractCreation(payload);
      if (!creation?.id) {
        throw new Error("Lore Asset was saved, but no creation ID was returned.");
      }

      setSaveStatus("saved");
      setSaveMessage("Lore Asset draft saved.");

      if (typeof onCreated === "function") {
        onCreated(creation);
      } else {
        router.replace(`/studio/my-creations/${creation.id}/edit`);
      }
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error?.message || "Lore Asset draft could not be saved.");
    }
  }

  return {
    title: draft.title,
    description: draft.description,
    visibility: draft.visibility,
    contentRating: draft.contentRating,
    visibilityOptions: LORE_VISIBILITY_OPTIONS,
    contentRatingOptions: LORE_CONTENT_RATING_OPTIONS,
    activeMode,
    editorViewProps,
    rendererViewProps,
    saveDisabled,
    saveStatus,
    saveMessage,
    errorCount: errors.length,
    warningCount: warnings.length,
    onUpdateIdentity: updateIdentity,
    onSetActiveMode: setActiveMode,
    onSave: save,
  };
}
