// V2 catalogue filter taxonomy.
// Presentation-only: mirrors Full Studio's five authoring domains while
// leaving Crestfall creation types and backend contracts unchanged.
//
// Display fixes, RULED 6 Sep 2026 (FE/FILTERS): retired words leave
// bar copy, backend names untouched. The second domain reads
// "Stories & Adventures" (group id renamed to match; backend values
// unchanged). Every option label
// is Title Case (refine ruling, same day); "Outfit / Clothing" reads
// "Outfit". Section order for the shared panel and the Activity
// section shape are declared below.

export const CATALOG_CREATION_DOMAINS = Object.freeze([
  Object.freeze({
    id: "charactersVisuals",
    label: "Characters & Visual Assets",
    options: Object.freeze([
      { value: "CHARACTER", label: "Character" },
      { value: "PLAYER_CHARACTER", label: "Player Character" },
      { value: "OUTFIT", label: "Outfit" },
      { value: "WARDROBE", label: "Wardrobe" },
      { value: "POSE", label: "Pose" },
    ]),
  }),
  Object.freeze({
    id: "storiesAdventures",
    label: "Stories & Adventures",
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
      // Owner ruling 6 Sep 2026 (FE/FILTERS refine): the filter row
      // reads "Rules Codex", allowlisted by that exact string in the
      // retired-word check. The terminology module's "Rulebook" (26
      // Aug 2026) still governs other surfaces until Brian rules it.
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

// Activity section, RULED 6 Sep 2026 (FE/FILTERS refine, Brian): the
// first section in the panel on Community, Creators, and Images.
// Liked and Saved, multi-select, filtering to items the signed-in
// user liked or saved. A page passes its own per-item predicates;
// where a payload lacks the per-user flags the page hides the
// section and files a contract request line.
export const ACTIVITY_SECTION_ID = "activity";

export function buildActivityFilterGroup(pool = [], { isLiked, isSaved } = {}) {
  const liked = typeof isLiked === "function" ? isLiked : () => false;
  const saved = typeof isSaved === "function" ? isSaved : () => false;
  return {
    id: ACTIVITY_SECTION_ID,
    label: "Activity",
    isMultiSelect: true,
    options: [
      { value: "liked", label: "Liked", count: pool.filter((item) => liked(item)).length },
      { value: "saved", label: "Saved", count: pool.filter((item) => saved(item)).length },
    ],
  };
}

// Filter panel section order, RULED 6 Sep 2026 (FE/FILTERS, Brian;
// Activity first per the same-day refine): Activity, Characters,
// Stories, Worlds, then Rules, Templates, Curation, Rating,
// Rendering, Visibility, Status, Tags. The kit View renders
// sections in caller order and carries no page vocabulary, so the
// ruling lives here: every page wraps its groups in
// orderFilterGroups. Ids not in the list (a page's own groups, e.g.
// Stories "type", Lore "approval") keep caller order ahead of the
// ranked ids.
export const FILTER_SECTION_ORDER = Object.freeze([
  "activity",
  "charactersVisuals",
  "storiesAdventures",
  "worldsContinuity",
  "rulesMechanics",
  "templatesGeneration",
  "curation",
  "rating",
  "rendering",
  "visibility",
  "status",
  "tags",
]);

export function orderFilterGroups(groups = []) {
  const rank = new Map(FILTER_SECTION_ORDER.map((id, index) => [id, index]));
  return groups
    .map((group, index) => ({ group, index }))
    .sort((a, b) => {
      const rankA = rank.has(a.group?.id) ? rank.get(a.group.id) : -1;
      const rankB = rank.has(b.group?.id) ? rank.get(b.group.id) : -1;
      if (rankA !== rankB) return rankA - rankB;
      return a.index - b.index;
    })
    .map(({ group }) => group);
}

// SUPERSEDED 6 Sep 2026 (FE/FILTERS refine, Brian): every remaining
// option renders with its live count, zero count muted and still
// selectable (KitFilterChip). Kept for a page that must drop a
// section its payload cannot answer at all; no page calls it today.
export function pruneUnsupportedFilterGroups(groups = []) {
  return groups
    .map((group) => ({
      ...group,
      options: (group?.options || []).filter(
        (option) => option?.isDisabled || option?.count === null || option?.count === undefined || option.count > 0
      ),
    }))
    .filter((group) => group.options.length > 0);
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
