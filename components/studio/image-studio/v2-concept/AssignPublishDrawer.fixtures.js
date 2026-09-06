import { BookOpen, Compass, MapPin, Shirt, Users } from "lucide-react";

const noop = () => {};

export const assignTargetTypes = [
  { id: "character", label: "Character", Icon: Users },
  { id: "location", label: "Location", Icon: MapPin },
  { id: "outfit", label: "Outfit", Icon: Shirt },
  { id: "story", label: "Story", Icon: BookOpen },
  { id: "adventure", label: "Adventure", Icon: Compass },
];

export const assignTargetsByType = {
  character: [
    { id: "ch-1", title: "Seraphine Vale", subtitle: "Character, Canon" },
    { id: "ch-2", title: "Brother Aldous", subtitle: "Character, Internal" },
  ],
  location: [{ id: "loc-1", title: "Moonlit Upper Gallery", subtitle: "Location, Public" }],
  outfit: [
    { id: "out-1", title: "Court Regalia", subtitle: "Outfit, Private" },
    { id: "out-2", title: "Traveling Cloak", subtitle: "Outfit, Private" },
  ],
  story: [{ id: "st-1", title: "The Gallery Confession", subtitle: "Story, Private" }],
  adventure: [],
};

export const assignVisibilityOptions = [
  { id: "private", label: "Private", description: "Only you." },
  { id: "internal", label: "Internal", description: "Crestfall team and collaborators." },
  { id: "public", label: "Public", description: "Anyone on Crestfall." },
  { id: "canon", label: "Canon", description: "Official reference. Needs review." },
];

export const assignPublishDrawerFilledFixture = {
  open: true,
  title: "Assign and Publish",
  resultTone: "linear-gradient(135deg, var(--surface-4), var(--gold-deep))",
  resultLabel: "Remix result, 16:9",
  targetTypes: assignTargetTypes,
  selectedTargetTypeId: "character",
  targets: assignTargetsByType.character,
  selectedTargetId: "ch-1",
  visibilityOptions: assignVisibilityOptions,
  selectedVisibilityId: "public",
  coinsLine: "Assigning is free. Balance 45.",
  coinBalanceLabel: "45",
  canPublish: true,
  helpText: "",
  onClose: noop,
  onChangeTargetType: noop,
  onSelectTarget: noop,
  onChangeVisibility: noop,
  onPublish: noop,
};

export const assignPublishDrawerEmptyFixture = {
  ...assignPublishDrawerFilledFixture,
  selectedTargetTypeId: "adventure",
  targets: assignTargetsByType.adventure,
  selectedTargetId: "",
  selectedVisibilityId: "private",
  canPublish: false,
  helpText: "Pick an asset to receive this image as its key reference.",
};
