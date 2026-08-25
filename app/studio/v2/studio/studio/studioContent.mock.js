// Stand-in content for the Studio hub (docs/STUDIO-SPEC.md section 3.1,
// docs/SPRINT-H-PLAN.md section 5, docs/BUILD-BLUEPRINT.md 3.1 row 6),
// same precedent as Home's homeContent.mock.js (CR-029), Adventures'
// adventuresContent.mock.js (CR-023), and Lore's loreContent.mock.js:
// a stand-in module, no CR filed this wave (the hub's copy is static,
// not a fetched feed). Art reused from the existing
// public/tmp-mockup-images sample set; no new art acquired this wave.

// Quick Start doors, asset-first (docs/_legacy-reference proof,
// docs/STUDIO-SPEC.md section 3.1). Character, Worlds, Looks, and
// Stories are the four live doors (docs/STUDIO-SPEC.md section 3.2
// for Character; the Worlds, Looks, and Stories quick creates are
// their own briefs). Every other type has no allocation yet
// (docs/STUDIO-SPEC.md section 9, item 2) and renders the standing
// Soon treatment.
export const STUDIO_DOORS = [
  {
    id: "character",
    label: "Character",
    eyebrow: "Living presence",
    description: "An NPC, companion, villain, ally, or interactive character for story rooms and roleplay.",
    imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/Lux.png"),
    isLive: true,
  },
  {
    id: "playerCharacter",
    label: "Player Character",
    eyebrow: "Your identity",
    description: "A private or public player identity to bring into stories, rooms, and future image generation.",
    imageSrc: encodeURI("/tmp-mockup-images/alpha-test-creator-images/rev.png"),
    isLive: false,
  },
  {
    // World-space door, renamed from "Location" this pass (RULED, the
    // Q1 world quick-create brief): same door, now opening the
    // WorldCreatorModal quick create instead of the Soon treatment.
    id: "location",
    label: "Worlds",
    eyebrow: "World space",
    description: "A setting, place, or premise a story or character can live in.",
    imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/athelgard-ampitheater-profile.png"),
    isLive: true,
  },
  {
    // Outfit/clothing door, relabeled from "Outfit / Clothing" to
    // "Looks" this pass (RULED, the Q2 look quick-create brief): same
    // door, existing OUTFIT creation type, now opening
    // LookCreatorModal instead of the Soon treatment.
    id: "outfit",
    label: "Looks",
    eyebrow: "Visual asset",
    description: "Reusable clothing, armor, uniforms, costumes, and outfit presets for characters.",
    imageSrc: encodeURI("/tmp-mockup-images/alpha-test-creator-images/whiteviolin.png"),
    isLive: true,
  },
  {
    // New door this pass (RULED, the Q3 story quick-create brief):
    // no existing door to relabel, unlike Worlds (location) and Looks
    // (outfit). Mapped onto the existing ROOM_TEMPLATE creation type
    // (label "Story"), opening StoryCreatorModal. Art reused from the
    // existing bottom-banner image, no new art acquired this wave.
    id: "story",
    label: "Stories",
    eyebrow: "Gathered together",
    description: "Gather characters, a setting, and a premise into a Story, then play it.",
    imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/lilith-lux-eden-confrontation.png"),
    isLive: true,
  },
];

// Full Studio tool groups, condensed from the proof's five groups to
// three representative ones. Every card is Soon except Character
// (docs/STUDIO-SPEC.md section 3.1, item 3: "no door routes to an
// old-system page," applied here to tool cards by the same rule).
// STUDIO_TOOL_GROUPS (Full Studio's tool-card grid), STUDIO_STORY_BRIDGE,
// and STUDIO_GUIDED_BUILD_SOON REMOVED 23 Aug 2026 (build-0823 pass 4,
// RULED): the altitude ladder and its Full Studio pane are dropped by
// the three-zone ruling. The tool grid's one live path (Character) is
// already covered by the CREATE zone's Character door.

export const STUDIO_HUB_EXPLAINER = {
  title: "Everything here starts private.",
  body: "Publish finished work to the community as Public, or submit your best into Canon for review. Nothing leaves your Vault until you say so.",
};

// Banner art, RULED 11 Aug 2026 (banner-anchor ruling, CC5 banner-audit
// sitting): Djuna Smith.png, reassigned off
// lilith-lux-eden-confrontation.png so Studio does not share a banner
// with Home (one click apart) and, thematically, sells the Image
// Studio destination with a finished character render. Selena
// Velvet.png was tried first and rendered checked at 1440: her pose
// (bent over a console, face turned down) reads as a bare hair-bun
// with no visible face under the ruled default anchor, so it was
// swapped for a forward-facing portrait instead (see
// docs/reviews/BANNER-AUDIT.md).
export const STUDIO_BOTTOM_BANNER = {
  eyebrow: "Give them a face",
  title: "See your characters in full color.",
  line: "The Image Studio turns any character, outfit, or scene into finished art in moments.",
  ctaLabel: "Open the Image Studio",
  imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/Djuna Smith.png"),
  route: "/studio/v2/images",
};
