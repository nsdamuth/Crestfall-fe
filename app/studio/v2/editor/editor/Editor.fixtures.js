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

function featuredMedia(primaryUrl = null) {
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

export const EDITOR_CHARACTER_DEFAULT_FIXTURE = {
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
              ],
            },
          ],
        },
      ],
    },
  },
};

export const EDITOR_STORY_FIXTURE = {
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
  },
};

export const EDITOR_LOCATION_FIXTURE = {
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
  },
};

export const EDITOR_NPC_REGISTRY_FIXTURE = {
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
    entries: [],
  },
};

export const EDITOR_EMPTY_SECTIONS_FIXTURE = {
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

const LONG_PARAGRAPH =
  "The scribe's testimony ran across four sealed scrolls, each annotated by a different hand of the Court Archive, and no two agreed entirely on the order of events, the names of every signatory, or the precise wording of the border clause that would, decades later, be cited in every subsequent accord between the two realms, so the Archive preserves all four in full rather than reconciling them into one false certainty. ".repeat(
    3
  );

export const EDITOR_LONGEST_CONTENT_FIXTURE = {
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
