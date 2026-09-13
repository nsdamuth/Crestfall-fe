import { STORY_ROOM_DETAILS_ROWS } from "./useStoryRoomDetailsRailViewModel";

const noop = () => {};

const baseMedia = [
  { id: "media-1", url: "/tmp-mockup-images/canon-character-images/mara-vale.jpg", altText: "Mara Vale", sourceLabel: "Mara Vale" },
  { id: "media-2", url: "/tmp-mockup-images/canon-character-images/the-archivist.jpg", altText: "The Archivist", sourceLabel: "The Archivist" },
  { id: "media-3", url: "/tmp-mockup-images/canon-character-images/lower-reliquary.jpg", altText: "Lower Reliquary", sourceLabel: "Scene" },
];

function makeGallery(overrides = {}) {
  return {
    items: baseMedia,
    activeIndex: 0,
    onSelect: noop,
    onPrevious: noop,
    onNext: noop,
    viewerIndex: null,
    onOpenViewer: noop,
    onCloseViewer: noop,
    onViewerPrevious: noop,
    onViewerNext: noop,
    ...overrides,
  };
}

function makeFixture(overrides = {}) {
  return {
    title: "The Lantern Below",
    chips: [
      { id: "rating", label: "Sfw" },
      { id: "visibility", label: "Private" },
    ],
    byline: null,
    description: "",
    descriptionExpanded: false,
    onToggleDescription: noop,
    gallery: makeGallery(),
    menu: {
      open: false,
      onToggle: noop,
      onClose: noop,
      items: [{ id: "delete", label: "Delete story", tone: "danger", disabled: false, onSelect: noop }],
    },
    deleteError: "",
    actionsSlot: null,
    rows: STORY_ROOM_DETAILS_ROWS,
    activeDetail: null,
    onOpenDetail: noop,
    onBack: noop,
    detailPanels: {},
    ...overrides,
  };
}

export const storyRoomDetailsRailDefaultFixture = makeFixture();

export const storyRoomDetailsRailEmptyMediaFixture = makeFixture({
  gallery: makeGallery({ items: [] }),
});

export const storyRoomDetailsRailWithBylineFixture = makeFixture({
  byline: { handle: "@lantern.keeper", href: "/studio/v2/creators/lantern.keeper" },
  description:
    "A sealed archive opens beneath the city. The Archivist has waited four hundred years for someone to ask the right question, and the wrong one costs a memory. Mara Vale carries the brass key her grandmother never explained. Every door below remembers who opened it.",
});

export const storyRoomDetailsRailMenuOpenFixture = makeFixture({
  menu: {
    open: true,
    onToggle: noop,
    onClose: noop,
    items: [{ id: "delete", label: "Delete story", tone: "danger", disabled: false, onSelect: noop }],
  },
});

export const storyRoomDetailsRailDeleteErrorFixture = makeFixture({
  deleteError: "Story could not be deleted.",
});

export const storyRoomDetailsRailDrillInFixture = makeFixture({
  activeDetail: "narrator",
  detailPanels: { narrator: "The Archivist" },
});

export const storyRoomDetailsRailViewerFixture = makeFixture({
  gallery: makeGallery({ viewerIndex: 1 }),
});

export const storyRoomDetailsRailLongestFixture = makeFixture({
  title: "The Extraordinarily Long Chronicle of the Seven Lanterns and the Archivist Who Would Not Sleep",
});
