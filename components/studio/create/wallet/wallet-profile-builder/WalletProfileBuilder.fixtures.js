import {
  walletProfileEditorFilledFixture,
} from "../wallet-profile-editor/WalletProfileEditor.fixtures.js";

export const walletProfileBuilderFilledFixture = Object.freeze({
  title: "Aethelgard Expedition Wallet",
  description:
    "A filled creation wrapper for the Wallet Profile presentation contract.",
  visibility: "PRIVATE",
  contentRating: "SFW",
  walletProfile: walletProfileEditorFilledFixture.value,
});
