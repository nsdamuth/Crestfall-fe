// Open and closed, the two states the glyph draws (a 180 degree
// turn between them); one of each side since the turn direction
// depends on which edge the panel sits on.

export const kitPanelToggleFixtures = [
  { id: "left-closed", label: "Left-edge panel, closed (resting)", props: { side: "left", open: false } },
  { id: "left-open", label: "Left-edge panel, open (turned)", props: { side: "left", open: true } },
  { id: "right-closed", label: "Right-edge panel, closed (turned)", props: { side: "right", open: false } },
  { id: "right-open", label: "Right-edge panel, open (resting)", props: { side: "right", open: true } },
];

export default kitPanelToggleFixtures;
