export const NPC_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION =
  "npc-registry-builder.view.v1";

export const NPC_REGISTRY_BUILDER_TABS = Object.freeze([
  Object.freeze({ id: "overview", label: "Overview" }),
  Object.freeze({ id: "entries", label: "People Entries" }),
  Object.freeze({ id: "relationships", label: "Relationships" }),
  Object.freeze({ id: "knowledge", label: "Knowledge Rules" }),
  Object.freeze({ id: "aliases", label: "Aliases" }),
]);

// Doc-only correction (ED1G sw12), no version bump: `registry` is a
// boundary-only key here, but its shape (already read by the View's
// default value) was undocumented. Real shape:
// { title: string, scope: string, description: string, entries: Array,
//   relationships: Array, knowledgeRules: Array, aliases: Array }
export const NPC_REGISTRY_BUILDER_VIEW_PROPS = Object.freeze({
  state: Object.freeze([
    "activeTab",
    "registry",
    "saveStatus",
    "saveMessage",
    "characterLoadError",
  ]),
  applicationSlots: Object.freeze([
    "entryModalContent",
    "relationshipModalContent",
    "knowledgeModalContent",
    "aliasModalContent",
  ]),
  callbacks: Object.freeze([
    "onSelectTab",
    "onUpdateField",
    "onSaveRegistry",
    "onAddEntry",
    "onEditEntry",
    "onDeleteEntry",
    "onAddRelationship",
    "onEditRelationship",
    "onDeleteRelationship",
    "onAddKnowledgeRule",
    "onEditKnowledgeRule",
    "onDeleteKnowledgeRule",
    "onAddAliasRule",
    "onEditAliasRule",
    "onDeleteAliasRule",
  ]),
});
