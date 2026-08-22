export const ACCOUNT_STUB_PAGE_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the bounded Account placeholder pages.
 *
 * The View owns the presentation of supplied account-page copy, placeholder
 * cards, placeholder notice, and navigation links. It does not own account
 * settings, billing, subscriptions, notifications, privacy, moderation,
 * service calls, or persistence.
 *
 * @typedef {Object} AccountStubCard
 * @property {string=} id
 * @property {string=} eyebrow
 * @property {string=} title
 * @property {string=} body
 *
 * @typedef {Object} AccountStubPageViewProps
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} description
 * @property {Array<AccountStubCard>} cards
 * @property {string} notice
 * @property {string} backHref
 * @property {string} backLabel
 * @property {string} returnHref
 * @property {string} returnLabel
 * @property {import("react").ElementType} [LinkComponent] doc-only addition
 *   (ED1G sw12): link/anchor component injected by the host, defaults to
 *   "a" in the View. Already read by the View, undeclared here. No
 *   version bump.
 */

export {};
