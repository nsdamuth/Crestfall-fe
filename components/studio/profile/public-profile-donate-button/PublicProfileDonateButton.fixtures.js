import { PUBLIC_PROFILE_DONATION_MESSAGE_TONES } from "./PublicProfileDonateButton.contract";

const BASE_OPEN_PROPS = Object.freeze({
  isVisible: true,
  isOpen: true,
  recipientHandle: "crestfallen_ember",
  minimumDonation: 100,
  amountValue: 250,
  messageValue: "Your worldbuilding deserves support.",
  isAnonymous: false,
  isBusy: false,
  isSuccess: false,
  balanceLabel: 1800,
  amountNet: 250,
  taxAmount: 0,
  taxPercent: 0,
  submitLabel: "Donate 250 Coins",
  statusMessage: "",
  statusTone: "",
});

export const PUBLIC_PROFILE_DONATE_BUTTON_FIXTURES = Object.freeze([
  {
    id: "closed",
    label: "Closed trigger",
    props: {
      ...BASE_OPEN_PROPS,
      isOpen: false,
    },
  },
  {
    id: "open",
    label: "Open donation",
    props: {
      ...BASE_OPEN_PROPS,
    },
  },
  {
    id: "loading-balance",
    label: "Loading balance",
    props: {
      ...BASE_OPEN_PROPS,
      isBusy: true,
      balanceLabel: "Loading...",
      submitLabel: "Sending...",
    },
  },
  {
    id: "anonymous",
    label: "Anonymous donation",
    props: {
      ...BASE_OPEN_PROPS,
      amountValue: 500,
      amountNet: 500,
      submitLabel: "Donate 500 Coins",
      messageValue: "",
      isAnonymous: true,
    },
  },
  {
    id: "success",
    label: "Donation success",
    props: {
      ...BASE_OPEN_PROPS,
      isSuccess: true,
      statusMessage:
        "Donation sent. crestfallen_ember received 250 coins.",
      statusTone: PUBLIC_PROFILE_DONATION_MESSAGE_TONES.SUCCESS,
    },
  },
  {
    id: "validation-error",
    label: "Validation error",
    props: {
      ...BASE_OPEN_PROPS,
      amountValue: 50,
      amountNet: 50,
      submitLabel: "Donate 50 Coins",
      statusMessage: "Minimum donation is 100 coins.",
      statusTone: PUBLIC_PROFILE_DONATION_MESSAGE_TONES.ERROR,
    },
  },
  {
    id: "account-error",
    label: "Account error",
    props: {
      ...BASE_OPEN_PROPS,
      statusMessage: "Coin balance could not be loaded.",
      statusTone: PUBLIC_PROFILE_DONATION_MESSAGE_TONES.ERROR,
    },
  },
  {
    id: "long-content",
    label: "Long content",
    props: {
      ...BASE_OPEN_PROPS,
      recipientHandle:
        "crestfallen_creator_with_an_unusually_long_public_username",
      messageValue:
        "A deliberately long fixture message used to verify textarea presentation, narrow-screen dialog spacing, wrapping, and the anonymous-donation control without using real private user content.",
    },
  },
  {
    id: "hidden",
    label: "Missing profile",
    props: {
      ...BASE_OPEN_PROPS,
      isVisible: false,
    },
  },
]);

export function getPublicProfileDonateButtonFixture(fixtureId) {
  return (
    PUBLIC_PROFILE_DONATE_BUTTON_FIXTURES.find(
      (fixture) => fixture.id === fixtureId
    ) || PUBLIC_PROFILE_DONATE_BUTTON_FIXTURES[0]
  );
}
