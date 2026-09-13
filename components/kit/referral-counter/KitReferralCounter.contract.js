export const KIT_REFERRAL_COUNTER_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the referral bonus counter kit piece
 * (fe/share-og follow-up 1, item 7, RULED 13 Sep 2026). One row on the
 * signed-in account page directly under the coins block: the label
 * "Referral bonus", an "i" tip with one sentence, and the count of
 * referrals credited to this account. The count is display-ready; the
 * View never reads the account snapshot, never formats a coin number,
 * and never links anywhere (the policy link lands when a referral
 * policy page exists).
 *
 * The count comes from `referral.creditedCount` on the account
 * snapshot (CR-073); it renders 0 until the Chassis serves the field
 * and is never hidden.
 *
 * @typedef {Object} KitReferralCounterViewProps
 * @property {string} label default "Referral bonus"
 * @property {string} count display-ready, "0" until served
 * @property {string} tipLabel accessible name of the "i" control
 * @property {string} tipText the one sentence in the tip
 */

export {};
