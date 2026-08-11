import { storylineNodeListConfiguredFixture } from "@/components/studio/storylines/storyline-node-list-editor/StorylineNodeListEditor.fixtures";

export const storylineBuilderReadyFixture = Object.freeze({
  form: {
    title: "The Brasswhisker Continuity",
    description:
      "A continuing Adventure that moves from the workshop mystery into Old Crescent pressure without resetting the chat.",
    visibility: "PRIVATE",
    contentRating: "SFW",
    tags: "aethelgard\nold-crescent\nmystery",
    data: storylineNodeListConfiguredFixture,
  },
  saveStatus: "idle",
  saveMessage: "",
});

export const storylineBuilderEmptyFixture = Object.freeze({
  form: {
    title: "",
    description: "",
    visibility: "PRIVATE",
    contentRating: "SFW",
    tags: "",
    data: { nodes: [] },
  },
  saveStatus: "idle",
  saveMessage: "",
});

export const storylineBuilderSavingFixture = Object.freeze({
  ...storylineBuilderReadyFixture,
  saveStatus: "saving",
  saveMessage: "",
});

export const storylineBuilderErrorFixture = Object.freeze({
  ...storylineBuilderReadyFixture,
  saveStatus: "error",
  saveMessage: "An Adventure title is required.",
});
