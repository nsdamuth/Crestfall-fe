export const STORYLINE_FIELDS_SECTION_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Storyline Fields View.
 *
 * The View receives section copy and one semantic editor slot. It does not
 * inspect Creation form data, normalize Storyline JSONB, load Story or Scenario
 * references, or own either application editor.
 */
export const STORYLINE_FIELDS_SECTION_APPLICATION_BOUNDARY = Object.freeze({
  applicationOwnedControls: [
    "StorylineNodeListEditor",
    "StorylineOpenWorldSettings",
  ],
  applicationOwnedOrchestration: ["useStorylineReferenceOptions"],
  storageMapping: "normalized Storyline data fields in creation.data",
  sections: ["sequence", "transitions", "openWorld"],
});

export {};
