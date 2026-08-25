import { createEmptyWalletProfile } from "../wallet-profile-editor/WalletProfileEditor.contract";

export const WALLET_PROFILE_BUILDER_VIEW_CONTRACT_VERSION = "1.0.0";
export const WALLET_PROFILE_CREATION_TYPE = "WALLET_PROFILE";

export const WALLET_PROFILE_VISIBILITY_OPTIONS = Object.freeze([
  { value: "PRIVATE", label: "Private" },
  { value: "UNLISTED", label: "Unlisted" },
]);

export const WALLET_PROFILE_CONTENT_RATING_OPTIONS = Object.freeze([
  { value: "SFW", label: "SFW" },
]);

export function createWalletProfileBuilderDraft() {
  const walletProfile = createEmptyWalletProfile();

  return {
    title: walletProfile.title,
    description: walletProfile.description,
    visibility: "PRIVATE",
    contentRating: "SFW",
    walletProfile,
  };
}

export function resolveWalletProfileCreationTitle({
  creationTitle,
  profileTitle,
} = {}) {
  return String(creationTitle || "").trim() || String(profileTitle || "").trim();
}
