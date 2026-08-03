import {
  LORE_CONTENT_RATING_OPTIONS,
  LORE_VISIBILITY_OPTIONS,
} from "./LoreBuilder.contract";
import { loreEditorFixture } from "../lore-editor/LoreEditor.fixtures";
import { loreDocumentRendererFixture } from "../lore-document-renderer/LoreDocumentRenderer.fixtures";

const noop = () => {};

export const loreBuilderFixture = {
  title: "The Brass Athenaeum",
  description:
    "A structured Lore draft fixture with an isolated editor and reader preview.",
  visibility: "PRIVATE",
  contentRating: "SFW",
  visibilityOptions: LORE_VISIBILITY_OPTIONS,
  contentRatingOptions: LORE_CONTENT_RATING_OPTIONS,
  activeMode: "EDIT",
  editorViewProps: loreEditorFixture,
  rendererViewProps: {
    ...loreDocumentRendererFixture,
    compact: true,
  },
  saveDisabled: false,
  saveStatus: "idle",
  saveMessage: "",
  errorCount: 0,
  warningCount: 0,
  onUpdateIdentity: noop,
  onSetActiveMode: noop,
  onSave: noop,
};

export const loreBuilderSavingFixture = {
  ...loreBuilderFixture,
  saveDisabled: true,
  saveStatus: "saving",
  saveMessage: "Saving the fixture draft…",
};

export const loreBuilderErrorFixture = {
  ...loreBuilderFixture,
  saveDisabled: false,
  saveStatus: "error",
  saveMessage: "Fixture save failed. No product data was changed.",
  errorCount: 1,
};
