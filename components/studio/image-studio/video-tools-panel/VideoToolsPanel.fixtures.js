const noop = () => {};

const durationOptions = Object.freeze([
  Object.freeze({ value: "4", label: "4 seconds" }),
  Object.freeze({ value: "8", label: "8 seconds" }),
  Object.freeze({ value: "12", label: "12 seconds" }),
]);

const aspectRatioOptions = Object.freeze([
  Object.freeze({ value: "PORTRAIT", label: "Portrait 9:16" }),
  Object.freeze({ value: "SQUARE", label: "Square 1:1" }),
  Object.freeze({ value: "LANDSCAPE", label: "Landscape 16:9" }),
]);

const motionStyleOptions = Object.freeze([
  Object.freeze({ value: "SUBTLE", label: "Subtle motion" }),
  Object.freeze({ value: "CINEMATIC", label: "Cinematic motion" }),
  Object.freeze({ value: "ACTION", label: "Action motion" }),
  Object.freeze({ value: "EMOTIVE", label: "Emotive motion" }),
]);

const toolCards = Object.freeze([
  Object.freeze({
    id: "scene-video",
    title: "Scene Video",
    eyebrow: "Room Moment",
    body: "Generate a short video from the selected character, location, outfit, pose, and prompt.",
  }),
  Object.freeze({
    id: "character-motion",
    title: "Character Motion",
    eyebrow: "Character Test",
    body: "Preview a character with simple motion, expression, or pose changes.",
  }),
  Object.freeze({
    id: "room-recap",
    title: "Room Recap Clip",
    eyebrow: "Story",
    body: "Create a short recap-style clip from a recent room scene once room state exists.",
  }),
  Object.freeze({
    id: "avatar-motion",
    title: "Avatar Motion Test",
    eyebrow: "Profile Media",
    body: "Create a lightweight animated profile or character media test from saved assets.",
  }),
]);

const baseFixture = Object.freeze({
  toolCards,
  durationValue: "4",
  durationOptions,
  aspectRatioValue: "PORTRAIT",
  aspectRatioOptions,
  motionStyleValue: "SUBTLE",
  motionStyleOptions,
  directionValue: "",
  onChangeDuration: noop,
  onChangeAspectRatio: noop,
  onChangeMotionStyle: noop,
  onChangeDirection: noop,
});

export const videoToolsDefaultFixture = baseFixture;

export const videoToolsCinematicFixture = Object.freeze({
  ...baseFixture,
  durationValue: "8",
  aspectRatioValue: "LANDSCAPE",
  motionStyleValue: "CINEMATIC",
  directionValue:
    "A slow camera push through the candlelit archive while the character turns toward the doorway.",
});

export const videoToolsActionFixture = Object.freeze({
  ...baseFixture,
  durationValue: "12",
  aspectRatioValue: "SQUARE",
  motionStyleValue: "ACTION",
  directionValue:
    "The character draws their blade as wind lifts the cloak and sparks cross the foreground.",
});

export const videoToolsEmotiveFixture = Object.freeze({
  ...baseFixture,
  durationValue: "4",
  aspectRatioValue: "PORTRAIT",
  motionStyleValue: "EMOTIVE",
  directionValue:
    "Hold on a restrained expression change as the character recognizes the voice behind them.",
});

export const videoToolsLongDirectionFixture = Object.freeze({
  ...baseFixture,
  durationValue: "12",
  aspectRatioValue: "LANDSCAPE",
  motionStyleValue: "CINEMATIC",
  directionValue:
    "Begin with a wide view of the rain-dark courtyard, drift past the broken statuary, then settle behind the traveler as lanterns ignite one at a time along the upper gallery. Keep the motion restrained and atmospheric, with cloth, rain, reflected light, and distant silhouettes providing the visible movement.",
});

export const videoToolsEmptyCardsFixture = Object.freeze({
  ...baseFixture,
  toolCards: Object.freeze([]),
});
