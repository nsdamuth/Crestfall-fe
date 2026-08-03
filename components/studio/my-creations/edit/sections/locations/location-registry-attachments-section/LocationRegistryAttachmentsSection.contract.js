export const LOCATION_REGISTRY_ATTACHMENTS_SECTION_VIEW_CONTRACT_VERSION =
  "locationRegistryAttachmentsSection.view.v1";

export const LOCATION_REGISTRY_ATTACHMENTS_SECTION_VIEW_CONTRACT =
  Object.freeze({
    feature: "LocationRegistryAttachmentsSection",
    version: LOCATION_REGISTRY_ATTACHMENTS_SECTION_VIEW_CONTRACT_VERSION,
    boundary:
      "Portable View receives display-ready registry groups, attachment cards, an application-owned picker slot, and semantic callbacks only.",
    viewInputs: Object.freeze([
      "sectionEyebrow",
      "sectionTitle",
      "sectionDescription",
      "groups",
      "pickerSlot",
    ]),
    groupShape: Object.freeze([
      "id",
      "label",
      "addLabel",
      "emptyLabel",
      "body",
      "links",
    ]),
    linkShape: Object.freeze([
      "id",
      "creationId",
      "title",
      "type",
      "description",
      "imageUrl",
      "notes",
    ]),
    semanticCallbacks: Object.freeze([
      "onOpenPicker",
      "onRemoveRegistry",
      "onChangeRegistryNotes",
    ]),
    storageFields: Object.freeze([
      "boundRegistries",
      "boundRegistryLinks",
    ]),
    registryKinds: Object.freeze([
      "EVENT_REGISTRY",
      "QUEST_REGISTRY",
      "NPC_REGISTRY",
      "ITEM_REGISTRY",
      "LOCATION_REGISTRY",
      "FACTION_REGISTRY",
      "ORGANIZATION_REGISTRY",
    ]),
    compatibility: Object.freeze({
      legacyIdOnlyBindings:
        "ID arrays remain readable and are projected into legacy display links when mirrored metadata links are absent.",
      mirroredWrites:
        "Attach and remove operations continue updating both boundRegistries and boundRegistryLinks.",
    }),
    applicationOwned: Object.freeze([
      "host form hydration",
      "registry JSONB normalization",
      "legacy ID-only link projection",
      "registry picker state and filtering",
      "linked-Creation metadata construction",
      "dual-field storage mapping",
      "save orchestration",
      "persistence",
    ]),
  });
