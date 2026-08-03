"use client";

import AliasRuleModal from "@/components/studio/create/npc-registry/AliasRuleModal";
import KnowledgeRuleModal from "@/components/studio/create/npc-registry/KnowledgeRuleModal";
import NpcEntryModal from "@/components/studio/create/npc-registry/NpcEntryModal";
import RelationshipModal from "@/components/studio/create/npc-registry/RelationshipModal";

import NpcRegistryFieldsSectionView from "./npc-registry-fields-section/NpcRegistryFieldsSection.view";
import { useNpcRegistryFieldsSectionViewModel } from "./npc-registry-fields-section/useNpcRegistryFieldsSectionViewModel";

export default function NpcRegistryFieldsSection(props) {
  const { viewProps, applicationModalProps } =
    useNpcRegistryFieldsSectionViewModel(props);

  return (
    <>
      <NpcRegistryFieldsSectionView {...viewProps} />
      <NpcRegistryModals {...applicationModalProps} />
    </>
  );
}

function NpcRegistryModals({ editor, linkedCreationIds }) {
  return (
    <>
      {editor.entryDraft ? (
        <NpcEntryModal
          draft={editor.entryDraft}
          characterOptions={editor.characterOptions}
          linkedCreationIds={linkedCreationIds}
          onClose={editor.closeEntryModal}
          onChange={editor.updateEntryDraftField}
          onSetKind={editor.setEntryKind}
          onApplyCharacter={editor.applyCharacterToEntryDraft}
          onSave={editor.saveEntryDraft}
        />
      ) : null}

      {editor.relationshipDraft ? (
        <RelationshipModal
          draft={editor.relationshipDraft}
          entries={editor.registry.entries}
          onClose={editor.closeRelationshipModal}
          onChange={editor.updateRelationshipDraftField}
          onSave={editor.saveRelationshipDraft}
        />
      ) : null}

      {editor.knowledgeDraft ? (
        <KnowledgeRuleModal
          draft={editor.knowledgeDraft}
          entries={editor.registry.entries}
          onClose={editor.closeKnowledgeModal}
          onChange={editor.updateKnowledgeDraftField}
          onToggleEntry={editor.toggleKnowledgeEntry}
          onSave={editor.saveKnowledgeDraft}
        />
      ) : null}

      {editor.aliasDraft ? (
        <AliasRuleModal
          draft={editor.aliasDraft}
          entries={editor.registry.entries}
          onClose={editor.closeAliasModal}
          onChange={editor.updateAliasDraftField}
          onSave={editor.saveAliasDraft}
        />
      ) : null}
    </>
  );
}
