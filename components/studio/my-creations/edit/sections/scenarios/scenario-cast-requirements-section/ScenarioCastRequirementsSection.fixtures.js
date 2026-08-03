const noop = () => {};

function reference({
  id,
  title,
  typeLabel,
  imageUrl = "",
}) {
  return {
    id,
    title,
    typeLabel,
    imageUrl,
    imageAltText: `${title} reference image`,
    initial: title.slice(0, 1).toUpperCase(),
  };
}

function field({
  id,
  label,
  description,
  selectedItems = [],
}) {
  return {
    id,
    label,
    description,
    selectedItems,
    onOpen: noop,
    onRemove: noop,
  };
}

const kessa = reference({
  id: "character-kessa",
  title: "Kessa Cindervell",
  typeLabel: "CHARACTER",
});

const aethelgard = reference({
  id: "location-aethelgard",
  title: "The Prism-Weave of Aethelgard",
  typeLabel: "LOCATION",
});

const factionRegistry = reference({
  id: "registry-faction",
  title: "Aethelgard Trade Factions",
  typeLabel: "FACTION_REGISTRY",
});

export const scenarioCastRequirementsDefaultFixture = {
  sectionEyebrow: "Scenario Editor",
  sectionTitle: "Cast, Location, Narrator, and Registries",
  sectionDescription:
    "Edit cast recommendations and authoritative Faction or Organization Registry attachments. Player Characters remain excluded from Scenario cast recommendations.",
  referenceLoadError: "",
  fields: [
    field({
      id: "required-characters",
      label: "Required Characters",
      description: "Characters required for this scenario to function.",
      selectedItems: [kessa],
    }),
    field({
      id: "optional-characters",
      label: "Optional Characters",
      description: "Characters that fit well but are not required.",
    }),
    field({
      id: "suggested-location",
      label: "Suggested Location",
      description: "Select one LOCATION creation for this scenario.",
      selectedItems: [aethelgard],
    }),
    field({
      id: "suggested-narrator",
      label: "Suggested Narrator",
      description: "Select one NARRATOR creation for this scenario.",
    }),
    field({
      id: "suggested-npc-registries",
      label: "Suggested NPC Registries",
      description: "NPC Registries recommended for Stories using this scenario.",
    }),
    field({
      id: "attached-faction-registries",
      label: "Attached Faction Registries",
      description:
        "Authoritative faction context inherited by Stories using this Scenario.",
      selectedItems: [factionRegistry],
    }),
    field({
      id: "attached-organization-registries",
      label: "Attached Organization Registries",
      description:
        "Authoritative organization context inherited by Stories using this Scenario.",
    }),
  ],
};

export const scenarioCastRequirementsEmptyFixture = {
  ...scenarioCastRequirementsDefaultFixture,
  fields: scenarioCastRequirementsDefaultFixture.fields.map((item) => ({
    ...item,
    selectedItems: [],
  })),
};

export const scenarioCastRequirementsErrorFixture = {
  ...scenarioCastRequirementsDefaultFixture,
  referenceLoadError: "Creation references could not be loaded.",
};
