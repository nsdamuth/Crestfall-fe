"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  createNpcRegistryDraft,
  fetchNpcRegistryCharacterOptions,
} from "@/lib/client/studio/registries/registryClient";
import {
  buildNpcRegistryCreationPayload,
  buildNpcRegistryExportPreview,
  clearNpcRegistryEntryActorMechanicsProfileAttachment,
  createEmptyAliasRule,
  createEmptyKnowledgeRule,
  createEmptyNpcEntry,
  createEmptyRelationship,
  createStarterNpcRegistry,
  extractNpcRegistryFromApiResponse,
  normalizeNpcRegistryCharacterOptions,
  removeEntryReferences,
  upsertById,
} from "@/components/studio/registries/npcRegistryUtils";

function cloneRegistry(initialRegistry) {
  const starter = createStarterNpcRegistry();
  const source =
    initialRegistry && typeof initialRegistry === "object" ? initialRegistry : {};

  return {
    ...starter,
    ...source,
    entries: Array.isArray(source.entries) ? [...source.entries] : [],
    relationships: Array.isArray(source.relationships)
      ? [...source.relationships]
      : [],
    knowledgeRules: Array.isArray(source.knowledgeRules)
      ? [...source.knowledgeRules]
      : [],
    aliases: Array.isArray(source.aliases) ? [...source.aliases] : [],
  };
}

export function useNpcRegistryBuilderViewModel({
  initialRegistry = null,
  createDraft = createNpcRegistryDraft,
  loadCharacterOptions = fetchNpcRegistryCharacterOptions,
  onCreated = null,
} = {}) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("overview");
  const [registry, setRegistry] = useState(() => cloneRegistry(initialRegistry));
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const [characterOptions, setCharacterOptions] = useState([]);
  const [characterLoadError, setCharacterLoadError] = useState("");

  const [entryDraft, setEntryDraft] = useState(null);
  const [relationshipDraft, setRelationshipDraft] = useState(null);
  const [knowledgeDraft, setKnowledgeDraft] = useState(null);
  const [aliasDraft, setAliasDraft] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCharacters() {
      setCharacterLoadError("");

      try {
        const creations = await loadCharacterOptions();

        if (!cancelled) {
          setCharacterOptions(normalizeNpcRegistryCharacterOptions(creations));
        }
      } catch (error) {
        if (!cancelled) {
          setCharacterOptions([]);
          setCharacterLoadError(
            error?.message || "Character options could not be loaded."
          );
        }
      }
    }

    loadCharacters();

    return () => {
      cancelled = true;
    };
  }, [loadCharacterOptions]);

  const exportPreview = useMemo(
    () => buildNpcRegistryExportPreview(registry),
    [registry]
  );

  const creationPayload = useMemo(
    () => buildNpcRegistryCreationPayload(registry),
    [registry]
  );

  const linkedCreationIds = useMemo(
    () =>
      registry.entries
        .filter((entry) => entry.kind === "CREATION_REF" && entry.creationId)
        .map((entry) => entry.creationId),
    [registry.entries]
  );

  function markDirty() {
    setSaveStatus("idle");
    setSaveMessage("");
  }

  function updateField(field, value) {
    setRegistry((current) => ({
      ...current,
      [field]: value,
    }));
    markDirty();
  }

  function openNewEntry() {
    setEntryDraft(createEmptyNpcEntry());
  }

  function openEditEntry(entry) {
    setEntryDraft({ ...entry });
  }

  function closeEntryModal() {
    setEntryDraft(null);
  }

  function updateEntryDraftField(field, value) {
    setEntryDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function setEntryKind(kind) {
    setEntryDraft((current) => {
      const next = {
        ...current,
        kind,
        creationId: kind === "AD_HOC" ? "" : current.creationId,
        creationType: kind === "AD_HOC" ? "" : "CHARACTER",
      };

      return kind === "CREATION_REF"
        ? clearNpcRegistryEntryActorMechanicsProfileAttachment(next)
        : next;
    });
  }

  function applyCharacterToEntryDraft(character) {
    if (!character?.id) return;

    setEntryDraft((current) =>
      clearNpcRegistryEntryActorMechanicsProfileAttachment({
        ...current,
        kind: "CREATION_REF",
        creationId: character.id,
        creationType: character.type || "CHARACTER",
        name: character.title,
        notes: current.notes || character.description || "",
      })
    );
  }

  function saveEntryDraft() {
    if (!entryDraft?.name?.trim()) return;

    const nextEntry = {
      ...entryDraft,
      name: entryDraft.name.trim(),
      notes: entryDraft.notes.trim(),
    };

    setRegistry((current) => ({
      ...current,
      entries: upsertById(current.entries, nextEntry),
    }));
    setEntryDraft(null);
    markDirty();
  }

  function deleteEntry(entryId) {
    setRegistry((current) => removeEntryReferences(current, entryId));
    markDirty();
  }

  function openNewRelationship() {
    setRelationshipDraft(createEmptyRelationship(registry.entries));
  }

  function openEditRelationship(relationship) {
    setRelationshipDraft({ ...relationship });
  }

  function closeRelationshipModal() {
    setRelationshipDraft(null);
  }

  function updateRelationshipDraftField(field, value) {
    setRelationshipDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function saveRelationshipDraft() {
    if (!relationshipDraft?.fromEntryId || !relationshipDraft?.toEntryId) return;

    setRegistry((current) => ({
      ...current,
      relationships: upsertById(current.relationships, {
        ...relationshipDraft,
        type: relationshipDraft.type.trim(),
        description: relationshipDraft.description.trim(),
      }),
    }));
    setRelationshipDraft(null);
    markDirty();
  }

  function deleteRelationship(relationshipId) {
    setRegistry((current) => ({
      ...current,
      relationships: current.relationships.filter(
        (relationship) => relationship.id !== relationshipId
      ),
    }));
    markDirty();
  }

  function openNewKnowledgeRule() {
    setKnowledgeDraft(createEmptyKnowledgeRule(registry.entries));
  }

  function openEditKnowledgeRule(rule) {
    setKnowledgeDraft({
      ...rule,
      knownByEntryIds: rule.knownByEntryIds || [],
      suspectedByEntryIds: rule.suspectedByEntryIds || [],
    });
  }

  function closeKnowledgeModal() {
    setKnowledgeDraft(null);
  }

  function updateKnowledgeDraftField(field, value) {
    setKnowledgeDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function toggleKnowledgeEntry(field, entryId) {
    setKnowledgeDraft((current) => {
      const currentIds = current[field] || [];
      const exists = currentIds.includes(entryId);

      return {
        ...current,
        [field]: exists
          ? currentIds.filter((id) => id !== entryId)
          : [...currentIds, entryId],
      };
    });
  }

  function saveKnowledgeDraft() {
    if (!knowledgeDraft?.subject?.trim()) return;

    setRegistry((current) => ({
      ...current,
      knowledgeRules: upsertById(current.knowledgeRules, {
        ...knowledgeDraft,
        subject: knowledgeDraft.subject.trim(),
        falseBeliefNotes: knowledgeDraft.falseBeliefNotes.trim(),
        notes: knowledgeDraft.notes.trim(),
      }),
    }));
    setKnowledgeDraft(null);
    markDirty();
  }

  function deleteKnowledgeRule(ruleId) {
    setRegistry((current) => ({
      ...current,
      knowledgeRules: current.knowledgeRules.filter((rule) => rule.id !== ruleId),
    }));
    markDirty();
  }

  function openNewAliasRule() {
    setAliasDraft(createEmptyAliasRule(registry.entries));
  }

  function openEditAliasRule(alias) {
    setAliasDraft({ ...alias });
  }

  function closeAliasModal() {
    setAliasDraft(null);
  }

  function updateAliasDraftField(field, value) {
    setAliasDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function saveAliasDraft() {
    if (!aliasDraft?.trueEntryId || !aliasDraft?.publicIdentity?.trim()) return;

    setRegistry((current) => ({
      ...current,
      aliases: upsertById(current.aliases, {
        ...aliasDraft,
        publicIdentity: aliasDraft.publicIdentity.trim(),
        rule: aliasDraft.rule.trim(),
      }),
    }));
    setAliasDraft(null);
    markDirty();
  }

  function deleteAliasRule(aliasId) {
    setRegistry((current) => ({
      ...current,
      aliases: current.aliases.filter((alias) => alias.id !== aliasId),
    }));
    markDirty();
  }

  async function saveRegistry() {
    if (saveStatus === "saving") return;

    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const apiPayload = await createDraft(creationPayload);
      const creation = extractNpcRegistryFromApiResponse(apiPayload);

      if (!creation?.id) {
        throw new Error("NPC registry was saved, but no creation ID was returned.");
      }

      setSaveStatus("saved");
      setSaveMessage("NPC registry saved.");

      if (typeof onCreated === "function") {
        onCreated(creation);
        return;
      }

      router.push("/studio/my-creations");
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error?.message || "NPC registry could not be saved.");
    }
  }

  const viewProps = {
    activeTab,
    registry,
    saveStatus,
    saveMessage,
    characterLoadError,
    onSelectTab: setActiveTab,
    onUpdateField: updateField,
    onSaveRegistry: saveRegistry,
    onAddEntry: openNewEntry,
    onEditEntry: openEditEntry,
    onDeleteEntry: deleteEntry,
    onAddRelationship: openNewRelationship,
    onEditRelationship: openEditRelationship,
    onDeleteRelationship: deleteRelationship,
    onAddKnowledgeRule: openNewKnowledgeRule,
    onEditKnowledgeRule: openEditKnowledgeRule,
    onDeleteKnowledgeRule: deleteKnowledgeRule,
    onAddAliasRule: openNewAliasRule,
    onEditAliasRule: openEditAliasRule,
    onDeleteAliasRule: deleteAliasRule,
  };

  const applicationContentProps = {
    registry,
    characterOptions,
    linkedCreationIds,
    entryDraft,
    relationshipDraft,
    knowledgeDraft,
    aliasDraft,
    closeEntryModal,
    updateEntryDraftField,
    setEntryKind,
    applyCharacterToEntryDraft,
    saveEntryDraft,
    closeRelationshipModal,
    updateRelationshipDraftField,
    saveRelationshipDraft,
    closeKnowledgeModal,
    updateKnowledgeDraftField,
    toggleKnowledgeEntry,
    saveKnowledgeDraft,
    closeAliasModal,
    updateAliasDraftField,
    saveAliasDraft,
  };

  return {
    viewProps,
    applicationContentProps,
    compatibilityProps: {
      activeTab,
      registry,
      exportPreview,
      creationPayload,
      saveStatus,
      saveMessage,
      characterOptions,
      characterLoadError,
      entryDraft,
      relationshipDraft,
      knowledgeDraft,
      aliasDraft,
      setActiveTab,
      updateField,
      saveRegistry,
      openNewEntry,
      openEditEntry,
      closeEntryModal,
      updateEntryDraftField,
      setEntryKind,
      applyCharacterToEntryDraft,
      saveEntryDraft,
      deleteEntry,
      openNewRelationship,
      openEditRelationship,
      closeRelationshipModal,
      updateRelationshipDraftField,
      saveRelationshipDraft,
      deleteRelationship,
      openNewKnowledgeRule,
      openEditKnowledgeRule,
      closeKnowledgeModal,
      updateKnowledgeDraftField,
      toggleKnowledgeEntry,
      saveKnowledgeDraft,
      deleteKnowledgeRule,
      openNewAliasRule,
      openEditAliasRule,
      closeAliasModal,
      updateAliasDraftField,
      saveAliasDraft,
      deleteAliasRule,
    },
  };
}
