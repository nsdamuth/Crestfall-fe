"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchNpcRegistryCharacterOptions } from "@/lib/client/studio/registries/registryClient";
import {
  clearNpcRegistryEntryActorMechanicsProfileAttachment,
  createEmptyAliasRule,
  createEmptyKnowledgeRule,
  createEmptyNpcEntry,
  createEmptyRelationship,
  normalizeNpcRegistryCharacterOptions,
  removeEntryReferences,
  upsertById,
} from "@/components/studio/registries/npcRegistryUtils";

function getRegistryFromForm(form) {
  const data = form.data || {};

  return {
    title: form.title || "",
    description: form.description || "",
    scope: data.scope || "",
    entries: Array.isArray(data.entries) ? data.entries : [],
    relationships: Array.isArray(data.relationships)
      ? data.relationships
      : [],
    knowledgeRules: Array.isArray(data.knowledge_rules)
      ? data.knowledge_rules
      : Array.isArray(data.knowledgeRules)
        ? data.knowledgeRules
        : [],
    aliases: Array.isArray(data.aliases) ? data.aliases : [],
  };
}

export function useNpcRegistryEditor({ form, updateDataField }) {
  const registry = useMemo(() => getRegistryFromForm(form), [form]);

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
        const creations = await fetchNpcRegistryCharacterOptions();

        if (!cancelled) {
          setCharacterOptions(normalizeNpcRegistryCharacterOptions(creations));
        }
      } catch (error) {
        if (!cancelled) {
          setCharacterOptions([]);
          setCharacterLoadError(
            error.message || "Character options could not be loaded."
          );
        }
      }
    }

    loadCharacters();

    return () => {
      cancelled = true;
    };
  }, []);

  function applyRegistryPatch(nextRegistry) {
    updateDataField("entries", nextRegistry.entries || []);
    updateDataField("relationships", nextRegistry.relationships || []);
    updateDataField("knowledge_rules", nextRegistry.knowledgeRules || []);
    updateDataField("aliases", nextRegistry.aliases || []);
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

    updateDataField("entries", upsertById(registry.entries, nextEntry));
    setEntryDraft(null);
  }

  function deleteEntry(entryId) {
    applyRegistryPatch(removeEntryReferences(registry, entryId));
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

    updateDataField(
      "relationships",
      upsertById(registry.relationships, {
        ...relationshipDraft,
        type: relationshipDraft.type.trim(),
        description: relationshipDraft.description.trim(),
      })
    );

    setRelationshipDraft(null);
  }

  function deleteRelationship(relationshipId) {
    updateDataField(
      "relationships",
      registry.relationships.filter(
        (relationship) => relationship.id !== relationshipId
      )
    );
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

    updateDataField(
      "knowledge_rules",
      upsertById(registry.knowledgeRules, {
        ...knowledgeDraft,
        subject: knowledgeDraft.subject.trim(),
        falseBeliefNotes: knowledgeDraft.falseBeliefNotes.trim(),
        notes: knowledgeDraft.notes.trim(),
      })
    );

    setKnowledgeDraft(null);
  }

  function deleteKnowledgeRule(ruleId) {
    updateDataField(
      "knowledge_rules",
      registry.knowledgeRules.filter((rule) => rule.id !== ruleId)
    );
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

    updateDataField(
      "aliases",
      upsertById(registry.aliases, {
        ...aliasDraft,
        publicIdentity: aliasDraft.publicIdentity.trim(),
        rule: aliasDraft.rule.trim(),
      })
    );

    setAliasDraft(null);
  }

  function deleteAliasRule(aliasId) {
    updateDataField(
      "aliases",
      registry.aliases.filter((alias) => alias.id !== aliasId)
    );
  }

  return {
    registry,
    characterOptions,
    characterLoadError,

    entryDraft,
    relationshipDraft,
    knowledgeDraft,
    aliasDraft,

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
  };
}