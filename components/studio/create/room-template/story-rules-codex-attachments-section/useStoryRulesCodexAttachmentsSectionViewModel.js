"use client";

import { useMemo, useState } from "react";

import { createLinkedCreationLink } from "@/components/studio/registries/structuredRegistryUtils";
import { useOwnedCreationSummaryIndex } from "@/components/studio/creations/hooks/useOwnedCreationSummaryIndex";
import { hydrateCreationReference } from "@/lib/shared/creations/creationReferenceHydration";

const DEFAULT_COPY = Object.freeze({
  eyebrow: "Story Rules",
  title: "Rules Codex Attachments",
  body:
    "Attach Rules Codices that define how this Story interprets mechanics, thresholds, special cases, and world-specific rules.",
  addLabel: "Attach Rules Codex",
  emptyLabel: "No Rules Codices attached.",
  runtimeNote:
    "This relationship establishes Story scope only. Runtime section selection and prompt composition are activated separately.",
});

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function dedupeIds(values = []) {
  return [...new Set(values.map(normalizeString).filter(Boolean))];
}

function normalizeLink(value = {}) {
  const source = normalizeObject(value);
  const creationId = normalizeString(
    source.creationId || source.creation_id || source.id
  );

  if (!creationId) return null;

  return {
    id: normalizeString(source.id) || `rules_codex_${creationId}`,
    creationId,
    title: normalizeString(source.title) || creationId,
    type: "RULES_CODEX",
    description: normalizeString(source.description),
    imageUrl: normalizeString(source.imageUrl || source.image_url),
    notes: normalizeString(source.notes),
  };
}

function getRulesCodexLinks(data = {}) {
  const safeData = normalizeObject(data);
  const links = normalizeArray(
    safeData.rulesCodexLinks || safeData.rules_codex_links
  )
    .map(normalizeLink)
    .filter(Boolean);

  if (links.length) {
    return links;
  }

  return dedupeIds(
    safeData.rulesCodexIds || safeData.rules_codex_ids
  ).map((creationId) => ({
    id: `legacy_rules_codex_${creationId}`,
    creationId,
    title: creationId,
    type: "RULES_CODEX",
    description: "",
    imageUrl: "",
    notes: "",
  }));
}

function toViewAttachment(link) {
  return {
    id: link.id,
    title: link.title || "Attached Rules Codex",
    typeLabel: "Rules Codex",
    description: link.description || "",
    imageUrl: link.imageUrl || "",
    notes: link.notes || "",
    removeAriaLabel: `Remove ${link.title || "attached Rules Codex"}`,
  };
}

export function useStoryRulesCodexAttachmentsSectionViewModel({
  data = {},
  updateDataField = null,
  eyebrow = DEFAULT_COPY.eyebrow,
  title = DEFAULT_COPY.title,
  body = DEFAULT_COPY.body,
  addLabel = DEFAULT_COPY.addLabel,
  emptyLabel = DEFAULT_COPY.emptyLabel,
  runtimeNote = DEFAULT_COPY.runtimeNote,
} = {}) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const links = getRulesCodexLinks(data);
  const { summariesById } = useOwnedCreationSummaryIndex();
  const displayLinks = links.map((link) =>
    hydrateCreationReference(link, summariesById, {
      fallbackType: "RULES_CODEX",
    })
  );

  const selectedCreationIds = useMemo(
    () => links.map((link) => link.creationId).filter(Boolean),
    [links]
  );

  function persist(nextLinks) {
    const normalizedLinks = nextLinks.map(normalizeLink).filter(Boolean);

    updateDataField?.(
      "rulesCodexIds",
      dedupeIds(normalizedLinks.map((link) => link.creationId))
    );
    updateDataField?.("rulesCodexLinks", normalizedLinks);
  }

  function handleSelect(creation) {
    if (!creation?.id) return;

    if (links.some((link) => link.creationId === creation.id)) {
      setIsPickerOpen(false);
      return;
    }

    persist([
      ...links,
      {
        ...createLinkedCreationLink(creation),
        type: "RULES_CODEX",
      },
    ]);
    setIsPickerOpen(false);
  }

  function handleRemove(attachmentId) {
    persist(links.filter((link) => link.id !== attachmentId));
  }

  function handleNotesChange(attachmentId, notes) {
    persist(
      links.map((link) =>
        link.id === attachmentId
          ? {
              ...link,
              notes,
            }
          : link
      )
    );
  }

  return {
    viewProps: {
      eyebrow,
      title,
      body,
      addLabel,
      emptyLabel,
      runtimeNote,
      attachments: displayLinks.map(toViewAttachment),
      onOpenPicker: () => setIsPickerOpen(true),
      onRemoveAttachment: handleRemove,
      onChangeAttachmentNotes: handleNotesChange,
    },
    pickerProps: isPickerOpen
      ? {
          title: "Attach Rules Codex",
          body:
            "Choose an owned Rules Codex to attach at Story scope. This saves the relationship only; runtime retrieval is introduced separately.",
          allowedTypes: ["RULES_CODEX"],
          selectedCreationIds,
          onClose: () => setIsPickerOpen(false),
          onSelect: handleSelect,
        }
      : null,
  };
}
