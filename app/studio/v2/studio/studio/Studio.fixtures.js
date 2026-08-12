// Local, deterministic View-shaped fixtures (docs/FRONTEND-SOP.md
// section 1, LOOM item 5): the three states named by
// docs/STUDIO-SPEC.md section 8.1's Brief S1 (default, empty, longest
// content), mapped onto the ladder's own three altitudes per
// useStudioViewModel.js's comment (the hub carries no user-owned data
// list to otherwise vary). Built directly from studioContent.mock.js
// so these exercise the View in isolation (preview route) without
// mounting the hook.
import {
  STUDIO_LEVELS,
  STUDIO_DOORS,
  STUDIO_TOOL_GROUPS,
  STUDIO_HUB_EXPLAINER,
  STUDIO_STORY_BRIDGE,
  STUDIO_GUIDED_BUILD_SOON,
  STUDIO_BOTTOM_BANNER,
} from "./studioContent.mock";

const noop = () => {};

function decorateDoors() {
  return STUDIO_DOORS.map((door) => ({ ...door, onOpen: noop }));
}

function decorateToolGroups() {
  return STUDIO_TOOL_GROUPS.map((group) => ({
    ...group,
    cards: group.cards.map((card) => ({ ...card, onOpen: noop })),
  }));
}

const STORY_BRIDGE = { ...STUDIO_STORY_BRIDGE, onAction: noop };
const BOTTOM_BANNER = { ...STUDIO_BOTTOM_BANNER, onCtaClick: noop };

// Default: Quick Start, the primary surface, two live doors
// (Character, Worlds) among two quiet Soon doors, the Story bridge
// strip beneath.
export const studioDefaultFixture = {
  levels: STUDIO_LEVELS,
  activeLevelId: "quickStart",
  onSelectLevel: noop,
  hubExplainer: STUDIO_HUB_EXPLAINER,
  doors: decorateDoors(),
  storyBridge: STORY_BRIDGE,
  guidedBuildSoon: STUDIO_GUIDED_BUILD_SOON,
  toolGroups: decorateToolGroups(),
  bottomBanner: BOTTOM_BANNER,
  notice: null,
  onCloseNotice: noop,
};

// Empty: Guided Build, the quietest pane. No doors, no tool cards, one
// placeholder message; Story assembly has no allocation yet
// (docs/STUDIO-SPEC.md section 9, item 2).
export const studioEmptyFixture = {
  ...studioDefaultFixture,
  activeLevelId: "guidedBuild",
};

// Longest content: Full Studio, the densest pane, every tool group and
// card rendered at once, plus the notice open showing the longest
// copy this page carries.
export const studioLongestContentFixture = {
  ...studioDefaultFixture,
  activeLevelId: "fullStudio",
  notice: {
    label: "Wardrobe",
    message: "Wardrobe isn't built yet. This door will open its own creator once it exists.",
  },
};
