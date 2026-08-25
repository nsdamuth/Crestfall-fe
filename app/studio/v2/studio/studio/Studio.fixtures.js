// Local, deterministic View-shaped fixtures (docs/FRONTEND-SOP.md
// section 1, LOOM item 5). RESHAPED 23 Aug 2026 (build-0823 pass 4,
// RULED): the three states (default, empty, longest content) now map
// onto the three-zone page's own doors list, since the altitude
// ladder this file's fixtures used to hang on is removed. Built
// directly from studioContent.mock.js so these exercise the View in
// isolation (preview route) without mounting the hook.
import { STUDIO_DOORS, STUDIO_HUB_EXPLAINER, STUDIO_BOTTOM_BANNER } from "./studioContent.mock";

const noop = () => {};

function decorateDoors(doors) {
  return doors.map((door) => ({ ...door, onOpen: noop }));
}

const BOTTOM_BANNER = { ...STUDIO_BOTTOM_BANNER, onCtaClick: noop };

// Default: the four live doors (Character, Worlds, Looks, Stories)
// among one quiet Soon door (Player Character), all three zones
// present.
export const studioDefaultFixture = {
  hubExplainer: STUDIO_HUB_EXPLAINER,
  doors: decorateDoors(STUDIO_DOORS),
  onOpenAdvancedEditor: noop,
  onBuildStory: noop,
  onBuildAdventure: noop,
  onOpenVault: noop,
  bottomBanner: BOTTOM_BANNER,
  notice: null,
  onCloseNotice: noop,
};

// Empty: no doors at all, proving the CREATE zone's grid degrades
// cleanly with zero content (still no user-owned data list on this
// page; this state is a stress case, not a live scenario).
export const studioEmptyFixture = {
  ...studioDefaultFixture,
  doors: [],
};

// Longest content: doubled description text on every door, plus the
// notice open showing the longest copy this page carries.
export const studioLongestContentFixture = {
  ...studioDefaultFixture,
  doors: decorateDoors(
    STUDIO_DOORS.map((door) => ({ ...door, description: `${door.description} ${door.description}` }))
  ),
  notice: {
    label: "Player Character",
    message: "Player Character isn't built yet. This door will open its own creator once it exists.",
  },
};
