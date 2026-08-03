export const PUBLIC_PROFILE_DONATE_BUTTON_VIEW_CONTRACT_VERSION = "1.0.0";

export const PUBLIC_PROFILE_DONATION_MESSAGE_TONES = Object.freeze({
  SUCCESS: "success",
  ERROR: "error",
});

/**
 * Stable UI boundary for the public-profile coin donation surface.
 *
 * The View owns trigger, dialog, form, summary, status, and button
 * presentation. It does not receive the raw profile record, access the Studio
 * account provider, call donation clients, refresh routes, calculate donation
 * amounts, or persist application state.
 *
 * @typedef {Object} PublicProfileDonateButtonViewProps
 * @property {boolean} isVisible
 * @property {boolean} isOpen
 * @property {string} recipientHandle
 * @property {number} minimumDonation
 * @property {string|number} amountValue
 * @property {string} messageValue
 * @property {boolean} isAnonymous
 * @property {boolean} isBusy
 * @property {boolean} isSuccess
 * @property {string|number} balanceLabel
 * @property {number} amountNet
 * @property {number} taxAmount
 * @property {number} taxPercent
 * @property {string} submitLabel
 * @property {string} statusMessage
 * @property {"success"|"error"|""} statusTone
 * @property {null|(() => void)} onOpenDonation
 * @property {null|(() => void)} onCloseDonation
 * @property {null|((nextValue: string) => void)} onChangeAmount
 * @property {null|((nextValue: string) => void)} onChangeMessage
 * @property {null|((nextValue: boolean) => void)} onChangeAnonymous
 * @property {null|(() => void)} onSubmitDonation
 */

export {};
