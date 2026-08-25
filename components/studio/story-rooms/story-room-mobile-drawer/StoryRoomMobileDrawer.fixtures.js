export const storyRoomMobileDrawerCastFixture = {
  title: "Room & Cast",
  side: "left",
  children:
    "Cast-panel content is supplied by the Story Room application and scrolls inside this mobile drawer.",
  onClose: null,
};

export const storyRoomMobileDrawerStateFixture = {
  title: "Chronicle State",
  side: "right",
  children:
    "Chronicle State content is supplied by the separated state panel without giving the drawer any Story Room domain knowledge.",
  onClose: null,
};

export const storyRoomMobileDrawerLongContentFixture = {
  title:
    "A Deliberately Long Story Room Drawer Title for Responsive Stress Testing",
  children:
    "This deliberately long fixture verifies title wrapping, drawer growth, inner scrolling, close-button alignment, and readable content when a bounded Story Room panel supplies substantially more text than the normal mobile cast or Chronicle State drawer.",
  onClose: null,
};

export const storyRoomMobileDrawerEmptyContentFixture = {
  title: "Empty Panel",
  children: null,
  onClose: null,
};

export const storyRoomMobileDrawerNoTitleFixture = {
  title: "",
  children:
    "The close control and content region remain available when no visible title is supplied.",
  onClose: null,
};
