// Local, deterministic View-shaped fixtures (docs/FRONTEND-SOP.md
// section 1, LOOM item 5). RESHAPED 23 Aug 2026 (build-0823 pass 4,
// UPDATED 24 Aug 2026: the three fixture stress states remain, while the
// restored Quick Start / Guided Build / Full Studio selector is part of the
// portable V2 View contract again. Built
// directly from studioContent.mock.js so these exercise the View in
// isolation (preview route) without mounting the hook.
import { STUDIO_DOORS, STUDIO_HUB_EXPLAINER, STUDIO_BOTTOM_BANNER } from "./studioContent.mock";
import { CREATION_STUDIO_MODES } from "@/components/studio/create/creation-studio/CreationStudio.contract.mjs";

const noop = () => {};

const MODE_OPTIONS = [
  { id: CREATION_STUDIO_MODES.QUICK, numeral: "I", label: "Quick Start", description: "Make assets, characters, places, outfits, and start creating fast." },
  { id: CREATION_STUDIO_MODES.GUIDED, numeral: "II", label: "Guided Build", description: "Follow a guided path from core assets into a playable Story." },
  { id: CREATION_STUDIO_MODES.FULL, numeral: "III", label: "Full Studio", description: "Every builder, registry, template, and mechanics tool in one workspace." },
];

function decorateDoors(doors) {
  return doors.map((door) => ({ ...door, onOpen: noop }));
}

const BOTTOM_BANNER = { ...STUDIO_BOTTOM_BANNER, onCtaClick: noop };

// Default: the five live doors (Character, Player Character, Worlds, Looks, Stories),
// with all three zones present.
export const studioDefaultFixture = {
  hubExplainer: STUDIO_HUB_EXPLAINER,
  modeOptions: MODE_OPTIONS,
  activeMode: CREATION_STUDIO_MODES.QUICK,
  onSelectMode: noop,
  modeContentSlot: null,
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
