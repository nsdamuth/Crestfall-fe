export const KIT_REFERRAL_COUNTER_VIEW_CONTRACT_VERSION = "1.1.0";

// Version note, 1.0.0 -> 1.1.0 (fe/share-og follow-up 2, item 4,
// additive, no prop change): the count moves beside the label. One
// line reads the label, then the number in the balance ink one type
// step up (body size), then the "i" tip, all left-aligned with one
// small gap between each; nothing right-justified.

/**
 * Stable portable UI boundary for the referral bonus counter kit piece
 * (fe/share-og follow-up 1, item 7, RULED 13 Sep 2026). One line on the
 * signed-in account page directly under the coins block: the label
 * "Referral bonus", the count of referrals credited to this account,
 * then an "i" tip with one sentence, left to right. The count is display-ready; the
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
