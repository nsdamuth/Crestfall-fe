import {
  chatNpcManagerClosedFixture,
  chatNpcManagerCompleteFixture,
  chatNpcManagerErrorFixture,
} from "../chat-npc-manager/ChatNpcManager.fixtures";
import { CHAT_CAST_PANEL_DELETE_CONFIRMATION } from "./ChatCastPanel.contract";

function noop() {}

const AVATAR_DATA_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23315E8A'/%3E%3Ctext x='40' y='52' text-anchor='middle' font-size='38' fill='%23F3F8FF'%3EV%3C/text%3E%3C/svg%3E";

function castMember({
  id,
  name,
  avatarUrl = "",
  role = "Character",
  state = "Present",
  note = "",
  isActive = true,
  selectable = true,
  selected = false,
  selectionLabel = selected ? "Next responder" : "Select responder",
} = {}) {
  const safeName = name || "Unnamed Participant";

  return {
    id,
    name: safeName,
    avatarUrl,
    fallbackInitial: safeName.slice(0, 1).toUpperCase(),
    role,
    state,
    note,
    isActive,
    selectable,
    selected,
    selectionLabel,
    selectionAriaLabel: selectable ? `Choose ${safeName} as the next responder` : "",
  };
}

const BASE_FIXTURE = {
  eyebrow: "Room & Cast",
  canClose: true,
  featuredMedia: {
    imageUrl: AVATAR_DATA_URL,
    imageAltText: "Mara Venn",
    speakerName: "Mara Venn",
    emptyEyebrow: "Room Media",
    emptyMessage: "Featured room image will appear here.",
    imageEyebrow: "Last Speaker Media",
  },
  roomTitle: "The Lantern District Ledger",
  roomIdLabel: "room-preview-014",
  narrator: { label: "Narrator", value: "The Chronicler" },
  castHeading: "Cast",
  castDescription: "Select an active Character or Narrator to choose the next responder.",
  castMembers: [
    castMember({ id: "narrator", name: "The Chronicler", role: "Narrator", state: "Present", selected: true, note: "Frames the scene and manages transitions." }),
    castMember({ id: "mara", name: "Mara Venn", avatarUrl: AVATAR_DATA_URL, role: "Night Clerk", state: "Arriving", note: "Knows who altered the district ledger." }),
    castMember({ id: "player", name: "Rowan Vale", role: "Player Character", state: "Player controlled", selectable: false, selectionLabel: "Player-controlled" }),
  ],
  playerCharacterAction: { visible: true, disabled: false, busy: false, label: "Set Player Character", busyLabel: "Setting" },
  setPlayerCharacterError: "",
  npcParticipantManager: chatNpcManagerClosedFixture,
  randomLikedAction: { visible: true, disabled: false, busy: false, label: "Random Liked", busyLabel: "Loading" },
  randomLikedError: "",
  deleteAction: { visible: true, disabled: false, busy: false, label: "Delete Story", busyLabel: "Deleting" },
  deleteError: "",
  deleteConfirm: null,
  roomListHref: "#room-list-preview",
  roomListLabel: "Room List",
  playerCharacterPickerContent: null,
  initialMobileOpen: false,
  onClosePanel: noop,
  onSelectCastMember: noop,
  onOpenPlayerCharacterPicker: noop,
  onLoadRandomLiked: noop,
  onRequestDeleteRoom: noop,
};

export const chatCastPanelCompleteFixture = BASE_FIXTURE;

export const chatCastPanelEmptyCastFixture = {
  ...BASE_FIXTURE,
  castMembers: [],
  castDescription: "",
};

export const chatCastPanelManyCastFixture = {
  ...BASE_FIXTURE,
  npcParticipantManager: chatNpcManagerCompleteFixture,
  castMembers: [
    ...BASE_FIXTURE.castMembers,
    castMember({ id: "thane", name: "Thane Corvid", role: "Investigator", state: "Present", note: "Distrusts the night clerk on principle." }),
    castMember({ id: "sable", name: "Sable Orr", role: "Dock Watcher", state: "Present" }),
    castMember({ id: "ilyan", name: "Ilyan Moss", role: "Archive Custodian", state: "Inactive", isActive: false, note: "Left the scene two turns ago." }),
    castMember({ id: "tomas", name: "Tomas Reed", role: "Courier", state: "Arriving" }),
  ],
};

export const chatCastPanelLoadingFixture = {
  ...BASE_FIXTURE,
  featuredMedia: { ...BASE_FIXTURE.featuredMedia, imageUrl: "" },
  castMembers: [],
  castDescription: "Loading the cast for this Story.",
  playerCharacterAction: { ...BASE_FIXTURE.playerCharacterAction, disabled: true },
  randomLikedAction: { ...BASE_FIXTURE.randomLikedAction, disabled: true },
  deleteAction: { ...BASE_FIXTURE.deleteAction, disabled: true },
};

export const chatCastPanelErrorFixture = {
  ...BASE_FIXTURE,
  setPlayerCharacterError: "The selected Player Character could not be attached to this Story.",
  deleteError: "This Story could not be deleted.",
  randomLikedError: "No eligible SFW Character remains in your liked Characters for this Story.",
  npcParticipantManager: chatNpcManagerErrorFixture,
};

export const chatCastPanelSettingFixture = {
  ...BASE_FIXTURE,
  playerCharacterAction: { ...BASE_FIXTURE.playerCharacterAction, disabled: true, busy: true },
};

export const chatCastPanelLockedFixture = {
  ...BASE_FIXTURE,
  playerCharacterAction: { ...BASE_FIXTURE.playerCharacterAction, visible: false },
  deleteAction: { ...BASE_FIXTURE.deleteAction, visible: false },
  castMembers: BASE_FIXTURE.castMembers.map((member) => ({
    ...member,
    selectable: false,
    selected: false,
    selectionLabel: member.role === "Player Character" ? "Player-controlled" : "Not selectable",
    selectionAriaLabel: "",
  })),
};

export const chatCastPanelDeleteConfirmFixture = {
  ...BASE_FIXTURE,
  deleteConfirm: {
    open: true,
    message: CHAT_CAST_PANEL_DELETE_CONFIRMATION,
    pending: false,
    error: "",
    onConfirm: noop,
    onCancel: noop,
  },
};

export const chatCastPanelDeleteConfirmPendingFixture = {
  ...BASE_FIXTURE,
  deleteConfirm: {
    open: true,
    message: CHAT_CAST_PANEL_DELETE_CONFIRMATION,
    pending: true,
    error: "",
    onConfirm: noop,
    onCancel: noop,
  },
};

export const chatCastPanelMobileOpenFixture = {
  ...BASE_FIXTURE,
  initialMobileOpen: true,
};

export const chatCastPanelLongestFixture = {
  ...BASE_FIXTURE,
  roomTitle: "The Lantern District Ledger and the Observatory Correspondence Archive",
  roomIdLabel: "room-preview-with-an-intentionally-long-identifier-for-responsive-stress",
  narrator: { label: "Narrator", value: "The Chronicler of the Western Observatory and Keeper of Uncatalogued Testimony" },
  npcParticipantManager: chatNpcManagerCompleteFixture,
  castMembers: BASE_FIXTURE.castMembers.map((member) => ({
    ...member,
    name: `${member.name} of the Lower Lantern District and Western Archive`,
    role: "Senior Participant in the Observatory Ledger Investigation and Restricted Correspondence Review",
    note: "This intentionally long note verifies wrapping, clamping, card height, and narrow-panel behavior without changing any application state.",
  })),
};

export const chatCastPanelFixtures = [
  { id: "complete", label: "Complete", props: chatCastPanelCompleteFixture },
  { id: "empty-cast", label: "Empty cast", props: chatCastPanelEmptyCastFixture },
  { id: "many-cast", label: "Many cast, NPC manager open", props: chatCastPanelManyCastFixture },
  { id: "loading", label: "Loading", props: chatCastPanelLoadingFixture },
  { id: "error", label: "Error", props: chatCastPanelErrorFixture },
  { id: "setting", label: "Setting player character", props: chatCastPanelSettingFixture },
  { id: "locked", label: "Locked, actions hidden", props: chatCastPanelLockedFixture },
  { id: "delete-confirm", label: "Delete confirm sheet", props: chatCastPanelDeleteConfirmFixture },
  { id: "delete-pending", label: "Delete confirm, pending", props: chatCastPanelDeleteConfirmPendingFixture },
  { id: "mobile-open", label: "Mobile sheet open", props: chatCastPanelMobileOpenFixture },
  { id: "longest", label: "Longest content", props: chatCastPanelLongestFixture },
];
