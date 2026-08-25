// V2 catalogue filter taxonomy.
// Presentation-only: mirrors Full Studio's five authoring domains while
// leaving Crestfall creation types and backend contracts unchanged.

export const CATALOG_CREATION_DOMAINS = Object.freeze([
  Object.freeze({
    id: "charactersVisuals",
    label: "Characters & Visual Assets",
    options: Object.freeze([
      { value: "CHARACTER", label: "Character" },
      { value: "PLAYER_CHARACTER", label: "Player Character" },
      { value: "OUTFIT", label: "Outfit / Clothing" },
      { value: "WARDROBE", label: "Wardrobe" },
      { value: "POSE", label: "Pose" },
    ]),
  }),
  Object.freeze({
    id: "storiesSessions",
    label: "Stories & Sessions",
    options: Object.freeze([
      { value: "SCENARIO", label: "Scenario" },
      { value: "NARRATOR", label: "Narrator" },
      { value: "ROOM_TEMPLATE", label: "Story" },
      { value: "STORYLINE", label: "Adventure" },
      { value: "LORE", label: "Lore Asset" },
    ]),
  }),
  Object.freeze({
    id: "worldsContinuity",
    label: "Worlds & Continuity",
    options: Object.freeze([
      { value: "LOCATION", label: "Location" },
      { value: "NPC_REGISTRY", label: "NPC Registry" },
      { value: "LOCATION_REGISTRY", label: "Location Registry" },
      { value: "FACTION_REGISTRY", label: "Faction Registry" },
      { value: "ORGANIZATION_REGISTRY", label: "Organization Registry" },
      { value: "EVENT_REGISTRY", label: "Event Registry" },
      { value: "QUEST_REGISTRY", label: "Quest Registry" },
      { value: "ITEM_REGISTRY", label: "Item Registry" },
    ]),
  }),
  Object.freeze({
    id: "rulesMechanics",
    label: "Rules & Mechanics",
    options: Object.freeze([
      { value: "STATS_POOLS_PROFILE", label: "Stats & Pools Profile" },
      { value: "PROGRESSION_PROFILE", label: "Progression Profile" },
      { value: "SKILLS_PROFILE", label: "Skills Profile" },
      { value: "ABILITY_SPELL_PROFILE", label: "Ability & Spell Profile" },
      { value: "WALLET_PROFILE", label: "Wallet Profile" },
      { value: "MECHANICS_MODULE", label: "Mechanics Module" },
      { value: "ACTOR_MECHANICS_PROFILE", label: "Actor Mechanics Profile" },
      { value: "RULES_CODEX", label: "Rules Codex" },
    ]),
  }),
  Object.freeze({
    id: "templatesGeneration",
    label: "Templates & Generation",
    options: Object.freeze([
      { value: "CHARACTER_TEMPLATE", label: "Character Template" },
      { value: "IMAGE_PRESET", label: "Image Preset" },
    ]),
  }),
]);

const FIXTURE_KIND_TO_CREATION_TYPE = Object.freeze({
  character: "CHARACTER",
  story: "ROOM_TEMPLATE",
  adventure: "STORYLINE",
  image: "IMAGE_PRESET",
  look: "OUTFIT",
  world: "LOCATION",
});

export function getCatalogCreationType(item = {}) {
  const explicit = String(item?.type || item?.rawCreation?.type || item?.rawCreation?.data?.type || "")
    .trim()
    .toUpperCase();
  if (explicit) return explicit;

  return FIXTURE_KIND_TO_CREATION_TYPE[String(item?.assetKind || "").trim().toLowerCase()] || "";
}

export function getCatalogTags(item = {}) {
  const candidates = [
    item?.tags,
    item?.rawCreation?.tags,
    item?.rawCreation?.data?.tags,
  ];

  const unique = new Map();
  candidates.forEach((candidate) => {
    if (!Array.isArray(candidate)) return;
    candidate.forEach((tag) => {
      const label = String(tag || "").trim();
      if (!label) return;
      const key = label.toLowerCase();
      if (!unique.has(key)) unique.set(key, label);
    });
  });

  return [...unique.values()];
}

export function buildDomainFilterGroups(pool = []) {
  return CATALOG_CREATION_DOMAINS.map((domain) => ({
    id: domain.id,
    label: domain.label,
    isMultiSelect: true,
    options: domain.options.map((option) => ({
      ...option,
      count: pool.filter((item) => getCatalogCreationType(item) === option.value).length,
    })),
  }));
}

export function getSelectedCatalogCreationTypes(selectedValues = {}) {
  return CATALOG_CREATION_DOMAINS.flatMap((domain) => selectedValues?.[domain.id] || []);
}

export function buildTagFilterOptions(pool = []) {
  const counts = new Map();
  const labels = new Map();

  pool.forEach((item) => {
    getCatalogTags(item).forEach((tag) => {
      const key = tag.toLowerCase();
      labels.set(key, labels.get(key) || tag);
      counts.set(key, (counts.get(key) || 0) + 1);
    });
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || String(labels.get(a[0])).localeCompare(String(labels.get(b[0]))))
    .map(([key, count]) => ({
      value: key,
      label: labels.get(key),
      count,
    }));
}
