// Full saved-creation fixtures for the advanced editor's dev-preview
// harness and the mock [id] resolver (docs/STUDIO-SPEC.md 4.3, brief
// S3 item 4). Shape matches the `form` object
// `components/studio/my-creations/edit/hooks/useCreationEditViewModel.js`
// hydrates from `fetchOwnedCreation` (read-only, consumed unmodified):
// top-level id/title/type/visibility/contentRating/status/reviewStatus/
// canonStatus/description/featuredMedia/chatDisplayMedia, plus the
// `data` payload every edit section reads and writes through
// `updateDataField`. Four states named by brief S3 item 4: character
// default, a non-character type (Lore, exercising the ruling's
// rehosted structured authoring surface), empty sections, and longest
// content.
import { DEFAULT_CREATION_IMAGE } from "@/lib/shared/creations/creationMedia";

// Exported for editorSavedCreations.mock.js, which builds featured
// slots for the picker-owned creation set from the same shape.
export function featuredMedia(primaryUrl = null) {
  return [
    {
      id: "slot-1",
      label: "Primary",
      imageUrl: primaryUrl || DEFAULT_CREATION_IMAGE,
      isPlaceholder: !primaryUrl,
    },
    { id: "slot-2", label: "Alt 1", imageUrl: null },
    { id: "slot-3", label: "Alt 2", imageUrl: null },
    { id: "slot-4", label: "Alt 3", imageUrl: null },
  ];
}

const CANON_ART = encodeURI(
  "/tmp-mockup-images/canon-character-images/lilith-lux-eden-confrontation.png"
);

// ED1B root-cause fix (docs/plans/ED1B-EDITOR-PAGE-SPEC.md section
// 1): every fixture carries `ownerId` and `updatedAt` so it passes
// the read-only hook's `hasUsableCreation` check. Without them the
// seeded creation was rejected, the form fell back to the CHARACTER
// fallback (type identity never reached the render), and the
// hydrate effect fired a live `fetchOwnedCreation` with the fixture
// id, whose failure rendered a raw error. These two fields are
// harness data only and never render.
const FIXTURE_PROVENANCE = {
  ownerId: "mock-owner",
  updatedAt: "2026-08-13T00:00:00.000Z",
};

// Reusable long-form filler, past every SHORT_LONGFORM/DEEP_LONGFORM
// fold threshold (SharedFields.jsx), for fixtures that need at least
// one field long enough to exercise the folding-textarea pattern.
const LONG_PARAGRAPH =
  "The scribe's testimony ran across four sealed scrolls, each annotated by a different hand of the Court Archive, and no two agreed entirely on the order of events, the names of every signatory, or the precise wording of the border clause that would, decades later, be cited in every subsequent accord between the two realms, so the Archive preserves all four in full rather than reconciling them into one false certainty. ".repeat(
    3
  );

export const EDITOR_CHARACTER_DEFAULT_FIXTURE = {
  ...FIXTURE_PROVENANCE,
  id: "mock-editor-character-default",
  title: "Vermillion Ashgrove",
  type: "CHARACTER",
  visibility: "PRIVATE",
  contentRating: "SFW",
  status: "DRAFT",
  reviewStatus: "DRAFT",
  canonStatus: "NONE",
  description: "A wandering court scribe with a taste for old accords.",
  featuredMedia: featuredMedia(CANON_ART),
  chatDisplayMedia: {
    avatar: { id: "chat-avatar", label: "Chat Avatar", imageUrl: CANON_ART },
    icon: { id: "chat-icon", label: "Chat Icon", imageUrl: null },
  },
  data: {
    name: "Vermillion Ashgrove",
    title: "Court Scribe of the Wandering Table",
    species: "Human",
    customSpecies: "",
    defaultRenderingStyle: "EITHER",
    age: "27",
    genderPresentation: "Feminine",
    customGenderPresentation: "",
    shortConcept: "Archivist-turned-diplomat",
    skinTone: "Warm olive",
    eyeColor: "Amber",
    hair: { length: "Long", texture: "Wavy", style: "Braided crown" },
    ethnicAppearance: "Aethelgard mixed heritage",
    kibbeBodyIdentity: "Soft Natural",
    bodyType: "Athletic",
    height: "5'7\"",
    build: "Lean",
    proportions: "Balanced",
    customBodyNotes: "Ink-stained fingertips, a scar along the left brow.",
    chestBust: "Average",
    outwardPersonality: "Warm, precise, quietly amused.",
    internalPersonality: "Guards old grief behind ceremony.",
    speechStyle: "Formal court cadence, softened with dry wit.",
    movementStyle: "Measured, economical",
    verbosity: "Moderate",
    philosophy: "Every accord is a story someone survived.",
    interests: ["Archives", "Cartography", "Old accords"],
    greeting: "The scribe looks up from her ledger and sets down her pen.",
    scenario: "A negotiation table in the Wandering Court's winter hall.",
    backstory: "Trained under the last Court Archivist before the Sundering.",
    relationshipToPlayer: "A cautious ally, testing your intentions.",
    personalityNotes: "Softens once trust is earned; never before.",
    appearanceNotes: "Wears the Archivist's half-cloak year round.",
    extraRuntimeNotes: "",
    mbti: "INFJ",
    westernZodiac: "Libra",
    eastAsianZodiac: "Snake",
    defaultClothing: {
      mode: "OUTFIT",
      outfit: { id: "outfit-court-robes", label: "Court Robes" },
      wardrobe: null,
    },
  },
};

export const EDITOR_LORE_FIXTURE = {
  ...FIXTURE_PROVENANCE,
  id: "mock-editor-lore-default",
  title: "The Black Crown Accord",
  type: "LORE",
  visibility: "PRIVATE",
  contentRating: "SFW",
  status: "DRAFT",
  reviewStatus: "DRAFT",
  canonStatus: "NONE",
  description: "The founding accord between Aethelgard and the Blackcrown Dominion.",
  featuredMedia: featuredMedia(CANON_ART),
  chatDisplayMedia: null,
  data: {
    lore_document: {
      publicationSubtitle: "An archive record, reconciled from three sources",
      archiveEyebrow: "Founding Accord",
      era: "The Second Accord",
      displayDate: "Year 214 of the Second Accord",
      realm: "Aethelgard",
      publicationSummary:
        "The treaty that ended the Blackcrown border wars, annotated by the Court Archive.",
      chapters: [
        {
          id: "chapter-1",
          title: "The Opening Terms",
          subtitle: "Prepared for the winter table",
          eyebrow: "Chapter I",
          displayDate: "Year 214",
          era: "The Second Accord",
          summary: "The first terms brought to the table by both delegations.",
          sections: [
            {
              id: "section-1",
              title: "The Border Clause",
              blocks: [
                {
                  id: "block-1",
                  type: "PARAGRAPH",
                  text: "Neither realm shall cross the Ashgrove line without a sealed writ.",
                },
                {
                  id: "block-2",
                  type: "PARAGRAPH",
                  text: LONG_PARAGRAPH,
                },
              ],
            },
          ],
        },
        {
          id: "chapter-2",
          title: "The Winter Signing",
          subtitle: "As recorded by the Court Archive",
          eyebrow: "Chapter II",
          displayDate: "Year 214, midwinter",
          era: "The Second Accord",
          summary: "The formal signing at the coldwater docks, and the terms that followed.",
          sections: [
            {
              id: "section-2",
              title: "The Coldwater Docks",
              blocks: [
                {
                  id: "block-3",
                  type: "PARAGRAPH",
                  text: "The delegations met at the harbor watch-house under a vigil that lasted three nights.",
                },
                {
                  id: "block-4",
                  type: "PARAGRAPH",
                  text: LONG_PARAGRAPH,
                },
              ],
            },
          ],
        },
      ],
    },
  },
};

export const EDITOR_STORY_FIXTURE = {
  ...FIXTURE_PROVENANCE,
  id: "mock-editor-story-default",
  title: "Coldwater Vigil",
  type: "ROOM_TEMPLATE",
  visibility: "UNLISTED",
  contentRating: "SFW",
  status: "DRAFT",
  reviewStatus: "DRAFT",
  canonStatus: "NONE",
  description: "A quiet vigil kept over the coldwater docks through the last night of the accord.",
  featuredMedia: featuredMedia(CANON_ART),
  chatDisplayMedia: null,
  data: {
    title: "Coldwater Vigil",
    premise: "The delegation waits out the storm in the harbor watch-house.",
    room_mode: "GROUP",
    player_character_mode: "RECOMMENDED",
    tags: ["harbor", "vigil", "winter accord", "diplomacy"],
    public_opening_context:
      "The harbor watch-house creaks under the storm as the last lanterns along the coldwater docks are lit against the dark.",
    opening_messages: [
      {
        id: "message-1",
        speaker: "Narrator",
        body: "Rain needles across the shuttered windows while the delegation counts the hours until the storm breaks and the accord can be signed at dawn.",
      },
      {
        id: "message-2",
        speaker: "Captain Vale",
        body: "No one leaves this watch-house until the tide turns. Not with what's waiting on the docks.",
      },
    ],
    private_room_guidance: LONG_PARAGRAPH,
  },
};

export const EDITOR_LOCATION_FIXTURE = {
  ...FIXTURE_PROVENANCE,
  id: "mock-editor-location-default",
  title: "The Vermillion Coast Tavern",
  type: "LOCATION",
  visibility: "PRIVATE",
  contentRating: "SFW",
  status: "DRAFT",
  reviewStatus: "DRAFT",
  canonStatus: "NONE",
  description: "A weatherbeaten tavern at the edge of the Vermillion Coast, favored by dockworkers and archivists alike.",
  featuredMedia: featuredMedia(null),
  chatDisplayMedia: null,
  data: {
    name: "The Vermillion Coast Tavern",
    visualDescription: "Low ceilings, salt-warped timber, a hearth that never quite goes out.",
    category: "Tavern",
    space_type: "Interior",
    location_scale: "Building",
    intended_use: "Recurring social hub for dockworkers, off-duty archivists, and traveling delegations.",
    tags: ["coastal", "tavern", "dockside", "gathering place"],
    architecture: "A two-story timber-frame tavern built into the seawall, its lower floor half sunk below the tideline.",
    materials: "Salt-warped oak beams, ballast-stone flooring, patched brass fittings salvaged from old harbor ships.",
    visual_motifs: "Fishing nets strung along the rafters, ledger-scrap wallpaper from a defunct customs house.",
    landmarks: "The captain's table by the hearth; the harbor-facing bay window where the tide is watched.",
    layout: LONG_PARAGRAPH,
    design_notes: "Reads as lived-in and weatherbeaten rather than quaint; every surface should show wear from salt and traffic.",
    mood: "Warm and close despite the weather outside, with an undercurrent of watchfulness.",
    lighting: "Low firelight from the hearth, supplemented by oil lamps along the bar.",
    time_of_day: "Late evening",
    weather: "Storm rolling in off the coast, rain against the shutters.",
    activity_level: "Busy",
    population_presence: "A dozen regulars, two off-duty archivists, the tavern-keeper and her son.",
    sensory_notes: "Woodsmoke and brine, the creak of the seawall timbers, distant foghorns.",
    prompt_guidance: "Weatherbeaten coastal tavern, warm firelight, salt-worn timber, storm outside the windows.",
    image_prompt: LONG_PARAGRAPH,
    negative_prompt: "no modern electronics, no clean pristine interior, no tropical setting",
    usage_notes: "Use for dockside social scenes, informal negotiations, and Coldwater Vigil-adjacent Stories.",
    compatibility_notes: "Pairs well with dockworker and archivist characters; compatible with rain and storm image presets.",
    registry_notes: "Candidate anchor location for a future Vermillion Coast location registry.",
  },
};

export const EDITOR_NPC_REGISTRY_FIXTURE = {
  ...FIXTURE_PROVENANCE,
  id: "mock-editor-npc-registry-default",
  title: "Coastal NPC Roster",
  type: "NPC_REGISTRY",
  visibility: "PRIVATE",
  contentRating: "SFW",
  status: "DRAFT",
  reviewStatus: "DRAFT",
  canonStatus: "NONE",
  description: "The recurring cast of dockworkers, archivists, and court officials along the Vermillion Coast.",
  featuredMedia: featuredMedia(null),
  chatDisplayMedia: null,
  data: {
    scope: "The recurring cast of dockworkers, archivists, and court officials along the Vermillion Coast, tracked for continuity across Stories.",
    entries: [
      {
        id: "person-1",
        kind: "AD_HOC",
        creationId: "",
        creationType: "",
        name: "Tavern-keeper Wren",
        notes: "Runs the Vermillion Coast Tavern; knows every regular by name and every rumor by nightfall.",
      },
      {
        id: "person-2",
        kind: "AD_HOC",
        creationId: "",
        creationType: "",
        name: "Dockmaster Corrin",
        notes: "Oversees harbor traffic; suspicious of the winter accord delegation.",
      },
      {
        id: "person-3",
        kind: "AD_HOC",
        creationId: "",
        creationType: "",
        name: "Archivist Sable",
        notes: "Junior archivist assisting the Court Archive's review of the border clause.",
      },
    ],
    relationships: [
      {
        id: "relationship-1",
        fromEntryId: "person-1",
        toEntryId: "person-2",
        type: "Old friends",
        direction: "MUTUAL",
        strength: "STRONG",
        description: "Wren and Corrin have covered for each other since the last border dispute.",
      },
    ],
    knowledge_rules: [
      {
        id: "knowledge-1",
        subject: "The sealed writ hidden beneath the tavern floor",
        defaultKnowledge: "UNKNOWN",
        knownByEntryIds: ["person-1"],
        suspectedByEntryIds: ["person-3"],
        falseBeliefNotes: "Corrin believes the writ was lost in the last storm.",
        notes: "Only Wren knows the writ's true location; Sable suspects but cannot prove it.",
      },
    ],
    aliases: [
      {
        id: "alias-1",
        trueEntryId: "person-1",
        publicIdentity: "The Tavern-keeper",
        rule: "Regulars never use Wren's given name in front of outsiders.",
      },
    ],
  },
};

// CHARACTER_TEMPLATE, ED1d root-cause fix for Defect 1: this type had
// no base fixture (OWNED_BASE_FIXTURE_BY_TYPE in
// editorSavedCreations.mock.js fell through to the generic near-empty
// shell for this one type only), so the picker-owned
// `owned-character_template` id never carried realistic data. Field
// keys sourced from
// components/studio/my-creations/edit/sections/character-template-fields-section/useCharacterTemplateFieldsSectionViewModel.js
// (data.template_category, data.template_tags, data.fields.*).
export const EDITOR_CHARACTER_TEMPLATE_FIXTURE = {
  ...FIXTURE_PROVENANCE,
  id: "mock-editor-character-template-default",
  title: "Vermillion Coast Rogue Template",
  type: "CHARACTER_TEMPLATE",
  visibility: "UNLISTED",
  contentRating: "SFW",
  status: "DRAFT",
  reviewStatus: "DRAFT",
  canonStatus: "NONE",
  description: "A reusable rogue archetype seeded for Vermillion Coast player characters.",
  featuredMedia: featuredMedia(CANON_ART),
  chatDisplayMedia: null,
  data: {
    template_category: "Rogue",
    template_tags: ["coastal", "rogue", "smuggler", "player-facing"],
    fields: {
      name: "Fen Ashgrove",
      title: "Coldwater Smuggler",
      species: "HUMAN",
      gender_presentation: "ANDROGYNOUS",
      short_concept: "Dock-born smuggler with court connections",
      skin_tone: "Weathered olive",
      eye_color: "Storm grey",
      hair_color: "Salt-bleached brown",
      hair_style: "Cropped, wind-rough",
      clothing_style: "Layered oilskin over patched court leathers",
      kibbe_body_identity: "Soft Natural",
      body_type: "Lean",
      height: "5'8\"",
      build: "Wiry",
      proportions: "Balanced",
      body_notes: LONG_PARAGRAPH,
      outward_personality: "Easy charm, quick with a joke to defuse a tense dock inspection.",
      internal_personality: "Guarded loyalty, never forgets who covered for whom.",
      mbti_type: "ISTP",
      western_zodiac_sign: "Scorpio",
      east_asian_zodiac_sign: "Tiger",
      speech_style: "Clipped dockside slang, softened around court officials.",
      movement_style: "Quick, economical, always tracking the nearest exit.",
      interests: ["Smuggling routes", "Card games", "Old harbor maps"],
      verbosity_level: "2",
      philosophy: LONG_PARAGRAPH,
    },
  },
};

export const EDITOR_EMPTY_SECTIONS_FIXTURE = {
  ...FIXTURE_PROVENANCE,
  id: "mock-editor-character-empty",
  title: "Untitled Creation",
  type: "CHARACTER",
  visibility: "PRIVATE",
  contentRating: "SFW",
  status: "DRAFT",
  reviewStatus: "DRAFT",
  canonStatus: "NONE",
  description: "",
  featuredMedia: featuredMedia(null),
  chatDisplayMedia: {
    avatar: { id: "chat-avatar", label: "Chat Avatar", imageUrl: null },
    icon: { id: "chat-icon", label: "Chat Icon", imageUrl: null },
  },
  data: {},
};

export const EDITOR_LONGEST_CONTENT_FIXTURE = {
  ...FIXTURE_PROVENANCE,
  id: "mock-editor-character-longest",
  title:
    "Vermillion Ashgrove-Highcourt, Third Archivist of the Wandering Table, Keeper of the Sundered Ledgers",
  type: "CHARACTER",
  visibility: "PRIVATE",
  contentRating: "MATURE",
  status: "DRAFT",
  reviewStatus: "DRAFT",
  canonStatus: "NONE",
  description: LONG_PARAGRAPH,
  featuredMedia: featuredMedia(CANON_ART),
  chatDisplayMedia: {
    avatar: { id: "chat-avatar", label: "Chat Avatar", imageUrl: CANON_ART },
    icon: { id: "chat-icon", label: "Chat Icon", imageUrl: CANON_ART },
  },
  data: {
    name: "Vermillion Ashgrove-Highcourt",
    title:
      "Third Archivist of the Wandering Table, Keeper of the Sundered Ledgers, Voice of the Winter Accord",
    species: "Custom",
    customSpecies: "Aethelgard court-bred, three generations removed from the Choir",
    defaultRenderingStyle: "REALISTIC",
    age: "134",
    genderPresentation: "Custom",
    customGenderPresentation:
      "Presents with shifting court regalia depending on ceremonial rank, never fixed to one reading",
    shortConcept: "Archivist-diplomat carrying four generations of unresolved treaties",
    skinTone: "Deep warm umber with archive-ink staining along both forearms",
    eyeColor: "Heterochromia: amber left, storm grey right",
    hair: {
      length: "Waist length",
      texture: "Dense coil",
      style: "Seven-strand court braid with archive-seal beads",
    },
    ethnicAppearance: LONG_PARAGRAPH,
    kibbeBodyIdentity: "Dramatic Classic",
    bodyType: "Statuesque",
    height: "6'1\"",
    build: "Broad-shouldered, archive-worker's forearms",
    proportions: "Long-limbed, elongated neck",
    customBodyNotes: LONG_PARAGRAPH,
    chestBust: "Full",
    outwardPersonality: LONG_PARAGRAPH,
    internalPersonality: LONG_PARAGRAPH,
    speechStyle: LONG_PARAGRAPH,
    movementStyle: "Deliberate, ceremonial, never hurried even under threat",
    verbosity: "High",
    philosophy: LONG_PARAGRAPH,
    interests: [
      "Archives",
      "Cartography",
      "Old accords",
      "Court ceremony",
      "Border law",
      "Choir liturgy",
      "Sundered-era pottery",
    ],
    greeting: LONG_PARAGRAPH,
    scenario: LONG_PARAGRAPH,
    backstory: LONG_PARAGRAPH + LONG_PARAGRAPH,
    relationshipToPlayer: LONG_PARAGRAPH,
    personalityNotes: LONG_PARAGRAPH,
    appearanceNotes: LONG_PARAGRAPH,
    extraRuntimeNotes: LONG_PARAGRAPH,
    mbti: "INFJ",
    westernZodiac: "Libra",
    eastAsianZodiac: "Snake",
    defaultClothing: {
      mode: "WARDROBE",
      outfit: null,
      wardrobe: { id: "wardrobe-court-seasonal", label: "Seasonal Court Regalia" },
    },
  },
};

export const EDITOR_FIXTURE_STATES = Object.freeze({
  characterDefault: {
    id: "characterDefault",
    label: "Character (default)",
    creation: EDITOR_CHARACTER_DEFAULT_FIXTURE,
  },
  nonCharacterType: {
    id: "nonCharacterType",
    label: "Lore (non-Character)",
    creation: EDITOR_LORE_FIXTURE,
  },
  story: {
    id: "story",
    label: "Story",
    creation: EDITOR_STORY_FIXTURE,
  },
  location: {
    id: "location",
    label: "Location",
    creation: EDITOR_LOCATION_FIXTURE,
  },
  npcRegistry: {
    id: "npcRegistry",
    label: "NPC Registry",
    creation: EDITOR_NPC_REGISTRY_FIXTURE,
  },
  characterTemplate: {
    id: "characterTemplate",
    label: "Character Template",
    creation: EDITOR_CHARACTER_TEMPLATE_FIXTURE,
  },
  emptySections: {
    id: "emptySections",
    label: "Empty sections",
    creation: EDITOR_EMPTY_SECTIONS_FIXTURE,
  },
  longestContent: {
    id: "longestContent",
    label: "Longest content",
    creation: EDITOR_LONGEST_CONTENT_FIXTURE,
  },
});
