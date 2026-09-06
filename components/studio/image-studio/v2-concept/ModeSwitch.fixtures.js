import { Layers, Pencil, Send, Wand2 } from "lucide-react";

const noop = () => {};

export const modeSwitchFlowSteps = [
  { id: "create-assets", label: "Create Assets" },
  { id: "craft-images", label: "Craft Images", active: true },
  { id: "assign-publish", label: "Assign and Publish" },
];

export const modeSwitchModes = [
  { id: "generate", label: "Generate", stepLabel: "Build image", Icon: Wand2 },
  { id: "edit", label: "Edit", stepLabel: "Segments and regions", Icon: Pencil },
  { id: "remix", label: "Remix", stepLabel: "Scene with two or more", Icon: Layers },
  { id: "assign", label: "Assign", stepLabel: "Key image and visibility", Icon: Send },
];

export const modeSwitchDefaultFixture = {
  flowLabel: "craft-images",
  flowSteps: modeSwitchFlowSteps,
  modes: modeSwitchModes,
  activeModeId: "generate",
  onChangeMode: noop,
};

export const modeSwitchEditFixture = {
  ...modeSwitchDefaultFixture,
  activeModeId: "edit",
};
