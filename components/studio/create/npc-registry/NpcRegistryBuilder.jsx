"use client";

import AliasRuleModal from "./AliasRuleModal";
import KnowledgeRuleModal from "./KnowledgeRuleModal";
import NpcEntryModal from "./NpcEntryModal";
import RelationshipModal from "./RelationshipModal";
import NpcRegistryBuilderView from "./npc-registry-builder/NpcRegistryBuilder.view";
import { useNpcRegistryBuilderViewModel } from "./npc-registry-builder/useNpcRegistryBuilderViewModel";

export default function NpcRegistryBuilder(props) {
  const { viewProps, applicationContentProps } =
    useNpcRegistryBuilderViewModel(props);

  const {
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
  } = applicationContentProps;

  return (
    <NpcRegistryBuilderView
      {...viewProps}
      entryModalContent={
        entryDraft ? (
          <NpcEntryModal
            draft={entryDraft}
            characterOptions={characterOptions}
            linkedCreationIds={linkedCreationIds}
            onClose={closeEntryModal}
            onChange={updateEntryDraftField}
            onSetKind={setEntryKind}
            onApplyCharacter={applyCharacterToEntryDraft}
            onSave={saveEntryDraft}
          />
        ) : null
      }
      relationshipModalContent={
        relationshipDraft ? (
          <RelationshipModal
            draft={relationshipDraft}
            entries={registry.entries}
            onClose={closeRelationshipModal}
            onChange={updateRelationshipDraftField}
            onSave={saveRelationshipDraft}
          />
        ) : null
      }
      knowledgeModalContent={
        knowledgeDraft ? (
          <KnowledgeRuleModal
            draft={knowledgeDraft}
            entries={registry.entries}
            onClose={closeKnowledgeModal}
            onChange={updateKnowledgeDraftField}
            onToggleEntry={toggleKnowledgeEntry}
            onSave={saveKnowledgeDraft}
          />
        ) : null
      }
      aliasModalContent={
        aliasDraft ? (
          <AliasRuleModal
            draft={aliasDraft}
            entries={registry.entries}
            onClose={closeAliasModal}
            onChange={updateAliasDraftField}
            onSave={saveAliasDraft}
          />
        ) : null
      }
    />
  );
}
