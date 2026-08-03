"use client";

import { useNpcRegistryEditor } from "@/components/studio/registries/hooks/useNpcRegistryEditor";
import {
  getEntryName,
  getNpcRegistryEntryActorMechanicsProfileAttachment,
} from "@/components/studio/registries/npcRegistryUtils";

const SECTION_COPY = Object.freeze({
  overview: {
    sectionTitle: "Registry Overview",
    sectionDescription:
      "Edit the registry metadata and scope shown in My Creations and future registry pickers.",
  },
  entries: {
    sectionTitle: "People Entries",
    sectionDescription:
      "Add linked characters, player characters, or lightweight NPCs that should remain consistent across attached rooms.",
    actionLabel: "Add Person",
    emptyMessage: "No people entries yet.",
  },
  relationships: {
    sectionTitle: "Relationships",
    sectionDescription:
      "Define directional or mutual links between people entries.",
    actionLabel: "Add Relationship",
    emptyMessage: "No relationships yet.",
  },
  knowledge: {
    sectionTitle: "Knowledge Rules",
    sectionDescription:
      "Control what people know, suspect, falsely believe, or are forbidden from knowing unless story events expose it.",
    actionLabel: "Add Knowledge Rule",
    emptyMessage: "No knowledge rules yet.",
  },
  aliases: {
    sectionTitle: "Aliases & Secret Identities",
    sectionDescription:
      "Map public identities, disguises, and secret identities to one canonical person.",
    actionLabel: "Add Alias Rule",
    emptyMessage: "No alias rules yet.",
  },
});

function buildEntryCards(editor) {
  return editor.registry.entries.map((entry) => {
    const attachment =
      getNpcRegistryEntryActorMechanicsProfileAttachment(entry);

    return {
      id: entry.id,
      eyebrow:
        entry.kind === "CREATION_REF" ? "Linked Creation" : "Lightweight NPC",
      title: entry.name,
      body: entry.notes || "No notes yet.",
      meta: attachment
        ? `Actor Mechanics: ${attachment.title}`
        : entry.kind === "CREATION_REF"
          ? "Mechanics follow the linked Character creation."
          : "No Actor Mechanics Profile attached.",
      onEdit: () => editor.openEditEntry(entry),
      onDelete: () => editor.deleteEntry(entry.id),
    };
  });
}

function buildRelationshipCards(editor) {
  return editor.registry.relationships.map((relationship) => ({
    id: relationship.id,
    eyebrow: `${relationship.type || "Relationship"} · ${
      relationship.strength
    }`,
    title: `${getEntryName(
      editor.registry.entries,
      relationship.fromEntryId
    )} → ${getEntryName(editor.registry.entries, relationship.toEntryId)}`,
    body: relationship.description || "No relationship rule yet.",
    onEdit: () => editor.openEditRelationship(relationship),
    onDelete: () => editor.deleteRelationship(relationship.id),
  }));
}

function buildKnowledgeCards(editor) {
  return editor.registry.knowledgeRules.map((rule) => ({
    id: rule.id,
    eyebrow: `Default: ${rule.defaultKnowledge}`,
    title: rule.subject,
    body: rule.notes || "No knowledge rule notes yet.",
    onEdit: () => editor.openEditKnowledgeRule(rule),
    onDelete: () => editor.deleteKnowledgeRule(rule.id),
  }));
}

function buildAliasCards(editor) {
  return editor.registry.aliases.map((alias) => ({
    id: alias.id,
    eyebrow: "Alias Mapping",
    title: `${alias.publicIdentity} = ${getEntryName(
      editor.registry.entries,
      alias.trueEntryId
    )}`,
    body: alias.rule || "No alias rule yet.",
    onEdit: () => editor.openEditAliasRule(alias),
    onDelete: () => editor.deleteAliasRule(alias.id),
  }));
}

function getSectionState(section, editor) {
  if (section === "entries") {
    return {
      cards: buildEntryCards(editor),
      onPrimaryAction: editor.openNewEntry,
      primaryActionDisabled: false,
      helperMessage: "",
    };
  }

  if (section === "relationships") {
    const needsEntries = editor.registry.entries.length < 2;

    return {
      cards: buildRelationshipCards(editor),
      onPrimaryAction: editor.openNewRelationship,
      primaryActionDisabled: needsEntries,
      helperMessage: needsEntries
        ? "Add at least two people entries before creating relationships."
        : "",
    };
  }

  if (section === "knowledge") {
    return {
      cards: buildKnowledgeCards(editor),
      onPrimaryAction: editor.openNewKnowledgeRule,
      primaryActionDisabled: false,
      helperMessage: "",
    };
  }

  if (section === "aliases") {
    const needsEntry = !editor.registry.entries.length;

    return {
      cards: buildAliasCards(editor),
      onPrimaryAction: editor.openNewAliasRule,
      primaryActionDisabled: needsEntry,
      helperMessage: needsEntry
        ? "Add a person entry before creating alias rules."
        : "",
    };
  }

  return {
    cards: [],
    onPrimaryAction: null,
    primaryActionDisabled: false,
    helperMessage: "",
  };
}

export function useNpcRegistryFieldsSectionViewModel({
  section = "overview",
  form = {},
  updateField = null,
  updateDataField = null,
} = {}) {
  const editor = useNpcRegistryEditor({ form, updateDataField });
  const activeSection = SECTION_COPY[section] ? section : "overview";
  const sectionCopy = SECTION_COPY[activeSection];
  const sectionState = getSectionState(activeSection, editor);
  const linkedCreationIds = editor.registry.entries
    .filter((entry) => entry.kind === "CREATION_REF" && entry.creationId)
    .map((entry) => entry.creationId);

  return {
    viewProps: {
      activeSection,
      sectionEyebrow: "NPC Registry Editor",
      sectionTitle: sectionCopy.sectionTitle,
      sectionDescription: sectionCopy.sectionDescription,
      registryTitleValue: form.title || "",
      scopeValue: editor.registry.scope || "",
      descriptionValue: form.description || "",
      descriptionPlaceholder:
        "Describe what this registry tracks and where it should be used.",
      creationTypeValue: form.type || "",
      entryCountValue: String(editor.registry.entries.length),
      relationshipCountValue: String(editor.registry.relationships.length),
      knowledgeRuleCountValue: String(editor.registry.knowledgeRules.length),
      primaryActionLabel: sectionCopy.actionLabel || "",
      primaryActionDisabled: sectionState.primaryActionDisabled,
      helperMessage: sectionState.helperMessage,
      cards: sectionState.cards,
      emptyMessage: sectionCopy.emptyMessage || "",
      loadError: editor.characterLoadError || "",
      onChangeRegistryTitle: (value) => updateField?.("title", value),
      onChangeScope: (value) => updateDataField?.("scope", value),
      onChangeDescription: (value) => updateField?.("description", value),
      onPrimaryAction: sectionState.onPrimaryAction,
    },
    applicationModalProps: {
      editor,
      linkedCreationIds,
    },
  };
}
